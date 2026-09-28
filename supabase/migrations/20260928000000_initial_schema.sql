-- =============================================================================
-- RevStore: initial schema
--
-- Run on an empty `public` schema (see supabase/reset.sql).
--
-- Principles
--   * The app talks to the database only from the server, with the
--     service-role key. Every table has RLS switched on and no policies, and
--     the anon/authenticated roles get no table or function privileges, so the
--     public API key can read or write nothing.
--   * Every public form submission goes through one function (submit_lead,
--     submit_financing_application, submit_tech_audit, place_web_order), which
--     does the whole write in one transaction.
--   * One row per person in `contacts`, matched on email. A person's leads,
--     applications, orders and audits all point at it, and `activity_log`
--     keeps their timeline (created, status changes, who changed it).
--   * The product catalogue lives in code (src/lib/catalog.ts). Rows that
--     mention a product store its id plus a snapshot of what was agreed
--     (name, price, monthly repayment), so later catalogue edits never
--     rewrite history.
--   * Status values are CHECK constraints mirroring src/lib/statuses.ts.
--     Change both together.
--   * Custom errors: SQLSTATE 22023 carries a customer-safe message (HTTP
--     400 in src/lib/db.ts); PT409 is a conflict (HTTP 409).
-- =============================================================================


-- ─── Helpers ─────────────────────────────────────────────────────────────────

create function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

/** Trims and collapses inner whitespace; empty becomes null. */
create function public.clean_text(p text)
returns text
language sql
immutable
set search_path = ''
as $$
  select nullif(regexp_replace(btrim(p), '\s+', ' ', 'g'), '');
$$;

create function public.normalize_email(p text)
returns text
language sql
immutable
set search_path = ''
as $$
  select nullif(lower(btrim(p)), '');
$$;

/**
 * Nigerian mobile numbers to +234XXXXXXXXXX, however they were typed
 * (0803..., 803..., 234803..., +234 803 ...). Anything else is kept as typed.
 */
create function public.normalize_phone(p text)
returns text
language plpgsql
immutable
set search_path = ''
as $$
declare
  digits text := regexp_replace(coalesce(p, ''), '\D', '', 'g');
begin
  if digits = '' then return null; end if;
  if digits ~ '^234[789][01][0-9]{8}$' then return '+' || digits; end if;
  if digits ~ '^0[789][01][0-9]{8}$' then return '+234' || substr(digits, 2); end if;
  if digits ~ '^[789][01][0-9]{8}$' then return '+234' || digits; end if;
  return public.clean_text(p);
end;
$$;

/** Short reference customers can read out or type, e.g. APP-7K4M2Q. No 0/O, 1/I/L. */
create function public.generate_ref(p_prefix text)
returns text
language sql
volatile
set search_path = ''
as $$
  select p_prefix || '-' || string_agg(substr('23456789ABCDEFGHJKMNPQRSTUVWXYZ', get_byte(b, i) % 31 + 1, 1), '' order by i)
  from (select uuid_send(gen_random_uuid()) as b) r, generate_series(0, 5) as i;
$$;


-- ─── Organisations and people ────────────────────────────────────────────────

/**
 * Schools, partner organisations (e.g. Let There Be Teachers) and government
 * bodies. Partners and government bodies are identified by `slug`, which
 * matches the ids in src/lib/partners.ts and src/lib/organizations.ts.
 * Schools come from free-text form answers and are matched on name + state.
 */
create table public.organizations (
  id          uuid primary key default gen_random_uuid(),
  kind        text not null check (kind in ('school', 'partner', 'government_body')),
  slug        text unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name        text not null check (name <> ''),
  school_type text check (school_type in ('public', 'private')),
  state       text,
  lga         text,
  name_key    text not null generated always as (lower(name)) stored,
  state_key   text not null generated always as (coalesce(lower(state), '')) stored,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  check ((kind = 'school') = (slug is null)),
  check (kind = 'school' or school_type is null)
);
create unique index organizations_school_key on public.organizations (name_key, state_key) where kind = 'school';

create table public.contacts (
  id              uuid primary key default gen_random_uuid(),
  full_name       text not null check (full_name <> ''),
  email           text unique check (email = lower(email) and email like '_%@_%'),
  phone           text,
  gender          text check (gender in ('male', 'female')),
  state           text,
  lga             text,
  job_title       text,
  organization_id uuid references public.organizations on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index contacts_phone_idx on public.contacts (phone);
create index contacts_organization_idx on public.contacts (organization_id);

/** A spreadsheet or other bulk source loaded into the database. */
create table public.import_batches (
  id          uuid primary key default gen_random_uuid(),
  label       text not null unique,
  source_file text not null,
  notes       text,
  imported_at timestamptz not null default now()
);

/** Timeline of everything that happens to a person's records. */
create table public.activity_log (
  id          bigint generated always as identity primary key,
  contact_id  uuid not null references public.contacts on delete cascade,
  entity      text not null check (entity in ('lead', 'application', 'order', 'tech_audit')),
  entity_id   uuid not null,
  action      text not null check (action in ('created', 'status_changed')),
  from_status text,
  to_status   text,
  actor       text not null,
  occurred_at timestamptz not null default now()
);
create index activity_log_contact_idx on public.activity_log (contact_id, occurred_at desc);
create index activity_log_entity_idx on public.activity_log (entity, entity_id);


-- ─── Leads ───────────────────────────────────────────────────────────────────

/** Anyone who has shown interest and isn't (yet) an order or application. */
create table public.leads (
  id                uuid primary key default gen_random_uuid(),
  contact_id        uuid not null references public.contacts,
  organization_id   uuid references public.organizations on delete set null,
  source            text not null check (source in (
                      'website_waitlist', 'website_form', 'school_enquiry', 'event', 'tech_audit',
                      'whatsapp', 'referral', 'walk_in', 'partner', 'legacy_import', 'other')),
  source_detail     text,
  intent            text not null check (intent in ('buy_outright', 'financing', 'bulk_purchase', 'services', 'general')),
  interests         text[] not null default '{}',
  product_id        text,
  device_count      integer check (device_count > 0),
  details           jsonb not null default '{}' check (jsonb_typeof(details) = 'object'),
  status            text not null default 'new' check (status in (
                      'new', 'contacted', 'qualified', 'converted', 'not_interested', 'unreachable')),
  status_changed_at timestamptz not null default now(),
  status_changed_by text,
  import_batch_id   uuid references public.import_batches,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index leads_created_idx on public.leads (created_at desc);
create index leads_contact_idx on public.leads (contact_id);
create index leads_organization_idx on public.leads (organization_id);
create index leads_import_batch_idx on public.leads (import_batch_id);


-- ─── Financing ───────────────────────────────────────────────────────────────

create table public.financing_programs (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  name       text not null,
  created_at timestamptz not null default now()
);

insert into public.financing_programs (slug, name)
values ('teacher-empowerment', 'Teacher Empowerment Programme');

/**
 * A request to buy a device on a repayment plan. Partner members and
 * government staff are sponsored by an organisation; that is how the partner
 * portal finds its applicants. The school is the one named on this
 * application (a person's school on `contacts` is only their latest).
 */
create table public.financing_applications (
  id                      uuid primary key default gen_random_uuid(),
  ref                     text not null unique,
  contact_id              uuid not null references public.contacts,
  program_id              uuid not null references public.financing_programs,
  applicant_type          text not null check (applicant_type in ('individual', 'partner_member', 'government_staff', 'school')),
  sponsor_organization_id uuid references public.organizations,
  school_organization_id  uuid references public.organizations on delete set null,
  product_id              text,
  product_name            text,
  requested_term_months   integer not null check (requested_term_months > 0),
  monthly_amount          numeric(12, 2) check (monthly_amount > 0),
  answers                 jsonb not null default '{}' check (jsonb_typeof(answers) = 'object'),
  kyc_consent             boolean not null default false,
  status                  text not null default 'submitted' check (status in (
                            'submitted', 'under_review', 'documents_requested', 'approved', 'declined',
                            'withdrawn', 'device_delivered', 'repaying', 'completed', 'defaulted')),
  status_changed_at       timestamptz not null default now(),
  status_changed_by       text,
  import_batch_id         uuid references public.import_batches,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),
  constraint financing_applications_sponsor_matches_type
    check ((applicant_type in ('partner_member', 'government_staff')) = (sponsor_organization_id is not null)),
  constraint financing_applications_product_snapshot
    check ((product_id is null) = (product_name is null) and (monthly_amount is null or product_id is not null))
);
create index financing_applications_created_idx on public.financing_applications (created_at desc);
create index financing_applications_contact_idx on public.financing_applications (contact_id);
create index financing_applications_sponsor_idx on public.financing_applications (sponsor_organization_id);
create index financing_applications_school_idx on public.financing_applications (school_organization_id);
create index financing_applications_import_batch_idx on public.financing_applications (import_batch_id);


-- ─── Orders ──────────────────────────────────────────────────────────────────

/**
 * A shop order. customer_* and delivery details are what the buyer typed for
 * this order; contact_id links it to the person. `client_key` identifies the
 * checkout session, so re-submitting checkout updates the same unpaid order.
 */
create table public.orders (
  id                uuid primary key default gen_random_uuid(),
  ref               text not null unique,
  client_key        uuid unique,
  channel           text not null default 'web' check (channel in ('web', 'whatsapp', 'phone', 'walk_in')),
  contact_id        uuid not null references public.contacts,
  customer_name     text not null,
  customer_email    text,
  customer_phone    text not null,
  fulfillment       text not null check (fulfillment in ('pickup', 'delivery')),
  delivery_address  text,
  total             numeric(14, 2) not null default 0 check (total >= 0),
  status            text not null default 'awaiting_payment' check (status in (
                      'awaiting_payment', 'paid', 'processing', 'ready_for_pickup', 'out_for_delivery',
                      'completed', 'cancelled', 'refunded')),
  status_changed_at timestamptz not null default now(),
  status_changed_by text,
  placed_at         timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  check ((fulfillment = 'delivery') = (delivery_address is not null))
);
create index orders_placed_idx on public.orders (placed_at desc);
create index orders_contact_idx on public.orders (contact_id);

create table public.order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references public.orders on delete cascade,
  product_id   text not null,
  product_name text not null,
  unit_price   numeric(12, 2) not null check (unit_price >= 0),
  quantity     integer not null check (quantity > 0),
  line_total   numeric(14, 2) not null generated always as (unit_price * quantity) stored,
  unique (order_id, product_id)
);


-- ─── Tech audits ─────────────────────────────────────────────────────────────

/** A school's self-assessment from /tech-audit. Scores are computed by the server. */
create table public.tech_audits (
  id                 uuid primary key default gen_random_uuid(),
  contact_id         uuid not null references public.contacts,
  organization_id    uuid references public.organizations on delete set null,
  contact_role       text not null,
  device_estimate    text,
  answers            jsonb not null check (jsonb_typeof(answers) = 'object'),
  triggered_products jsonb not null default '{}' check (jsonb_typeof(triggered_products) = 'object'),
  top_products       text[] not null default '{}',
  section_gaps       jsonb not null default '{}' check (jsonb_typeof(section_gaps) = 'object'),
  notes              text,
  created_at         timestamptz not null default now()
);
create index tech_audits_created_idx on public.tech_audits (created_at desc);
create index tech_audits_contact_idx on public.tech_audits (contact_id);


-- ─── RevLearn ────────────────────────────────────────────────────────────────
-- Content ids are text slugs chosen by the admin screens.

create table public.revlearn_categories (
  id          text primary key,
  title       text not null,
  description text not null default '',
  icon        text not null default '📚',
  accent      text not null default 'orange' check (accent in ('orange', 'maroon', 'teal', 'amber')),
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.revlearn_courses (
  id          text primary key,
  category_id text not null references public.revlearn_categories on delete cascade,
  title       text not null,
  description text not null default '',
  thumbnail   text not null default '',
  tags        text[] not null default '{}',
  type        text not null default 'single' check (type in ('single', 'multi')),
  url         text,
  source_name text not null default 'External',
  duration    text not null default '',
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index revlearn_courses_category_idx on public.revlearn_courses (category_id, position);

create table public.revlearn_lessons (
  id         text primary key,
  course_id  text not null references public.revlearn_courses on delete cascade,
  title      text not null,
  url        text not null,
  position   integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index revlearn_lessons_course_idx on public.revlearn_lessons (course_id, position);

create table public.revlearn_tools (
  id           text primary key,
  name         text not null,
  description  text not null default '',
  embed_url    text,
  external_url text,
  logo_url     text,
  partner_name text not null default '',
  category     text not null default 'General',
  tags         text[] not null default '{}',
  featured     boolean not null default false,
  position     integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table public.revlearn_resources (
  id          text primary key,
  title       text not null,
  description text not null default '',
  url         text not null,
  thumbnail   text,
  type        text not null default 'article' check (type in ('article', 'template', 'app', 'website', 'video')),
  audience    text not null default 'teacher' check (audience in ('teacher', 'student', 'both')),
  source_name text not null default 'External',
  tags        text[] not null default '{}',
  featured    boolean not null default false,
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

/** Community posts. Written by anonymous visitors, so sizes are capped here too. */
create table public.revlearn_posts (
  id             uuid primary key default gen_random_uuid(),
  content        text not null check (length(content) between 1 and 5000),
  author_name    text not null check (length(author_name) between 1 and 120),
  author_school  text check (length(author_school) <= 200),
  author_subject text check (length(author_subject) <= 120),
  author_avatar  text check (length(author_avatar) <= 500),
  likes          integer not null default 0 check (likes >= 0),
  created_at     timestamptz not null default now()
);
create index revlearn_posts_created_idx on public.revlearn_posts (created_at desc);

create table public.revlearn_comments (
  id            uuid primary key default gen_random_uuid(),
  post_id       uuid not null references public.revlearn_posts on delete cascade,
  content       text not null check (length(content) between 1 and 2000),
  author_name   text not null check (length(author_name) between 1 and 120),
  author_avatar text check (length(author_avatar) <= 500),
  created_at    timestamptz not null default now()
);
create index revlearn_comments_post_idx on public.revlearn_comments (post_id, created_at);


-- ─── updated_at triggers ─────────────────────────────────────────────────────

do $$
declare
  t text;
begin
  foreach t in array array[
    'organizations', 'contacts', 'leads', 'financing_applications', 'orders',
    'revlearn_categories', 'revlearn_courses', 'revlearn_lessons', 'revlearn_tools', 'revlearn_resources'
  ] loop
    execute format(
      'create trigger touch_updated_at before update on public.%I for each row execute function public.touch_updated_at()', t
    );
  end loop;
end;
$$;


-- ─── Building blocks used by the submit functions ────────────────────────────

create function public.log_activity(
  p_contact_id uuid, p_entity text, p_entity_id uuid, p_action text,
  p_from_status text, p_to_status text, p_actor text, p_at timestamptz default now()
)
returns void
language sql
set search_path = ''
as $$
  insert into public.activity_log (contact_id, entity, entity_id, action, from_status, to_status, actor, occurred_at)
  values (p_contact_id, p_entity, p_entity_id, p_action, p_from_status, p_to_status, p_actor, p_at);
$$;

/** p: { name, school_type?, state?, lga? }. Returns null when there's no name. */
create function public.upsert_school(p jsonb)
returns uuid
language plpgsql
set search_path = ''
as $$
declare
  v_name text := public.clean_text(p->>'name');
  v_id uuid;
begin
  if v_name is null then return null; end if;
  insert into public.organizations (kind, name, school_type, state, lga)
  values ('school', v_name, lower(public.clean_text(p->>'school_type')), public.clean_text(p->>'state'), public.clean_text(p->>'lga'))
  on conflict (name_key, state_key) where kind = 'school' do update
    set school_type = coalesce(excluded.school_type, organizations.school_type),
        lga         = coalesce(excluded.lga, organizations.lga)
  returning id into v_id;
  return v_id;
end;
$$;

/** p: { slug, name, kind }. Partners and government bodies; the name in code wins. */
create function public.upsert_sponsor(p jsonb)
returns uuid
language plpgsql
set search_path = ''
as $$
declare
  v_id uuid;
begin
  if coalesce(p->>'kind', '') not in ('partner', 'government_body') then
    raise exception using errcode = '22023', message = 'Unknown sponsor organisation.';
  end if;
  insert into public.organizations (kind, slug, name)
  values (p->>'kind', p->>'slug', public.clean_text(p->>'name'))
  on conflict (slug) do update set name = excluded.name
  returning id into v_id;
  return v_id;
end;
$$;

/**
 * Finds the person by email (or creates them) and brings their details up to
 * date: new non-empty values replace old ones, blanks never erase anything.
 * p: { full_name, email?, phone?, gender?, state?, lga?, job_title? }
 */
create function public.upsert_contact(p jsonb, p_organization_id uuid, p_at timestamptz default now())
returns uuid
language plpgsql
set search_path = ''
as $$
declare
  v_name  text := public.clean_text(p->>'full_name');
  v_email text := public.normalize_email(p->>'email');
  v_id    uuid;
begin
  if v_name is null then
    raise exception using errcode = '22023', message = 'Please enter your name.';
  end if;

  insert into public.contacts (full_name, email, phone, gender, state, lga, job_title, organization_id, created_at, updated_at)
  values (
    v_name, v_email, public.normalize_phone(p->>'phone'), lower(public.clean_text(p->>'gender')),
    public.clean_text(p->>'state'), public.clean_text(p->>'lga'), public.clean_text(p->>'job_title'),
    p_organization_id, p_at, p_at
  )
  on conflict (email) do update
    set full_name       = excluded.full_name,
        phone           = coalesce(excluded.phone, contacts.phone),
        gender          = coalesce(excluded.gender, contacts.gender),
        state           = coalesce(excluded.state, contacts.state),
        lga             = coalesce(excluded.lga, contacts.lga),
        job_title       = coalesce(excluded.job_title, contacts.job_title),
        organization_id = coalesce(excluded.organization_id, contacts.organization_id)
  returning id into v_id;
  return v_id;
end;
$$;


-- ─── Submissions (called by the server) ──────────────────────────────────────
--
-- Each takes one jsonb payload. The optional `import` key is used only by
-- bulk imports: { batch_id, submitted_at, status }. It lets old records keep
-- their original date and status while going through exactly the same code
-- as a live submission.

/**
 * p: { contact, school?, source, source_detail?, intent, interests?, product_id?,
 *      device_count?, details?, import? }
 * Returns { id }.
 */
create function public.submit_lead(p jsonb)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  v_at      timestamptz := coalesce((p->'import'->>'submitted_at')::timestamptz, now());
  v_batch   uuid        := (p->'import'->>'batch_id')::uuid;
  v_status  text        := coalesce(p->'import'->>'status', 'new');
  v_actor   text        := case when v_batch is null then 'website' else 'import' end;
  v_org     uuid        := public.upsert_school(p->'school');
  v_contact uuid        := public.upsert_contact(p->'contact', v_org, v_at);
  v_id      uuid;
begin
  insert into public.leads (
    contact_id, organization_id, source, source_detail, intent, interests, product_id, device_count, details,
    status, status_changed_at, status_changed_by, import_batch_id, created_at, updated_at
  )
  values (
    v_contact, v_org, p->>'source', public.clean_text(p->>'source_detail'), p->>'intent',
    coalesce(array(select jsonb_array_elements_text(p->'interests')), '{}'),
    p->>'product_id', (p->>'device_count')::integer, jsonb_strip_nulls(coalesce(p->'details', '{}')),
    v_status, v_at, v_actor, v_batch, v_at, v_at
  )
  returning id into v_id;

  perform public.log_activity(v_contact, 'lead', v_id, 'created', null, v_status, v_actor, v_at);
  return jsonb_build_object('id', v_id);
end;
$$;

/**
 * p: { contact, school?, program_slug, applicant_type, sponsor?: { slug, name, kind },
 *      product?: { id, name }, term_months, monthly_amount?, answers?, kyc_consent, import? }
 * Returns { id, ref }.
 */
create function public.submit_financing_application(p jsonb)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  v_at      timestamptz := coalesce((p->'import'->>'submitted_at')::timestamptz, now());
  v_batch   uuid        := (p->'import'->>'batch_id')::uuid;
  v_status  text        := coalesce(p->'import'->>'status', 'submitted');
  v_actor   text        := case when v_batch is null then 'website' else 'import' end;
  v_program uuid;
  v_sponsor uuid;
  v_org     uuid;
  v_contact uuid;
  v_ref     text;
  v_id      uuid;
begin
  select id into v_program from public.financing_programs where slug = p->>'program_slug';
  if v_program is null then
    raise exception using errcode = '22023', message = 'This financing programme is not open.';
  end if;

  if jsonb_typeof(p->'sponsor') = 'object' then
    v_sponsor := public.upsert_sponsor(p->'sponsor');
  end if;
  v_org     := public.upsert_school(p->'school');
  v_contact := public.upsert_contact(p->'contact', v_org, v_at);

  loop
    v_ref := public.generate_ref('APP');
    exit when not exists (select 1 from public.financing_applications where ref = v_ref);
  end loop;

  insert into public.financing_applications (
    ref, contact_id, program_id, applicant_type, sponsor_organization_id, school_organization_id, product_id, product_name,
    requested_term_months, monthly_amount, answers, kyc_consent,
    status, status_changed_at, status_changed_by, import_batch_id, created_at, updated_at
  )
  values (
    v_ref, v_contact, v_program, p->>'applicant_type', v_sponsor, v_org, p->'product'->>'id', p->'product'->>'name',
    (p->>'term_months')::integer, (p->>'monthly_amount')::numeric, jsonb_strip_nulls(coalesce(p->'answers', '{}')),
    coalesce((p->>'kyc_consent')::boolean, false),
    v_status, v_at, v_actor, v_batch, v_at, v_at
  )
  returning id into v_id;

  perform public.log_activity(v_contact, 'application', v_id, 'created', null, v_status, v_actor, v_at);
  return jsonb_build_object('id', v_id, 'ref', v_ref);
end;
$$;

/**
 * p: { client_key, buyer: { name, email, phone, fulfillment, address? },
 *      lines: [{ product_id, product_name, unit_price, quantity }] }
 * Prices come from the server's catalogue, never the browser.
 * Same client_key again: the unpaid order is updated in place; once it has
 * moved past awaiting_payment it is final (PT409).
 * Returns { id, ref }.
 */
create function public.place_web_order(p jsonb)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  v_key     uuid  := (p->>'client_key')::uuid;
  v_buyer   jsonb := p->'buyer';
  v_contact uuid;
  v_id      uuid;
  v_ref     text;
  v_status  text;
begin
  if coalesce(jsonb_typeof(p->'lines'), '') <> 'array' or jsonb_array_length(p->'lines') = 0 then
    raise exception using errcode = '22023', message = 'Your cart is empty.';
  end if;

  v_contact := public.upsert_contact(
    jsonb_build_object('full_name', v_buyer->>'name', 'email', v_buyer->>'email', 'phone', v_buyer->>'phone'),
    null
  );

  select id, ref, status into v_id, v_ref, v_status from public.orders where client_key = v_key for update;

  if v_id is not null and v_status <> 'awaiting_payment' then
    raise exception using errcode = 'PT409', message = 'This order has already been confirmed. Please start a new checkout for another order.';
  end if;

  if v_id is null then
    loop
      v_ref := public.generate_ref('ORD');
      exit when not exists (select 1 from public.orders where ref = v_ref);
    end loop;
    insert into public.orders (ref, client_key, channel, contact_id, customer_name, customer_email, customer_phone,
                               fulfillment, delivery_address, status_changed_by)
    values (v_ref, v_key, 'web', v_contact, public.clean_text(v_buyer->>'name'), public.normalize_email(v_buyer->>'email'),
            public.clean_text(v_buyer->>'phone'), v_buyer->>'fulfillment', public.clean_text(v_buyer->>'address'), 'website')
    returning id into v_id;
    perform public.log_activity(v_contact, 'order', v_id, 'created', null, 'awaiting_payment', 'website');
  else
    update public.orders
       set contact_id       = v_contact,
           customer_name    = public.clean_text(v_buyer->>'name'),
           customer_email   = public.normalize_email(v_buyer->>'email'),
           customer_phone   = public.clean_text(v_buyer->>'phone'),
           fulfillment      = v_buyer->>'fulfillment',
           delivery_address = public.clean_text(v_buyer->>'address')
     where id = v_id;
    delete from public.order_items where order_id = v_id;
  end if;

  insert into public.order_items (order_id, product_id, product_name, unit_price, quantity)
  select v_id, l.product_id, l.product_name, l.unit_price, l.quantity
  from jsonb_to_recordset(p->'lines') as l(product_id text, product_name text, unit_price numeric, quantity integer);

  update public.orders
     set total = (select sum(line_total) from public.order_items where order_id = v_id)
   where id = v_id;

  return jsonb_build_object('id', v_id, 'ref', v_ref);
end;
$$;

/**
 * p: { contact, school, contact_role, device_estimate?, answers, triggered_products,
 *      top_products, section_gaps, notes? }
 * Saves the audit and opens a lead for the school, so it lands in the pipeline.
 * Returns { id }.
 */
create function public.submit_tech_audit(p jsonb)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  v_org     uuid := public.upsert_school(p->'school');
  v_contact uuid := public.upsert_contact(p->'contact', v_org);
  v_id      uuid;
begin
  insert into public.tech_audits (contact_id, organization_id, contact_role, device_estimate, answers,
                                  triggered_products, top_products, section_gaps, notes)
  values (
    v_contact, v_org, public.clean_text(p->>'contact_role'), public.clean_text(p->>'device_estimate'),
    coalesce(p->'answers', '{}'), coalesce(p->'triggered_products', '{}'),
    coalesce(array(select jsonb_array_elements_text(p->'top_products')), '{}'),
    coalesce(p->'section_gaps', '{}'), public.clean_text(p->>'notes')
  )
  returning id into v_id;

  perform public.log_activity(v_contact, 'tech_audit', v_id, 'created', null, null, 'website');

  perform public.submit_lead(jsonb_build_object(
    'contact', p->'contact',
    'school', p->'school',
    'source', 'tech_audit',
    'source_detail', 'Tech audit request',
    'intent', 'services',
    'interests', coalesce(p->'top_products', '[]'),
    'details', jsonb_build_object('techAuditId', v_id, 'deviceEstimate', p->>'device_estimate')
  ));

  return jsonb_build_object('id', v_id);
end;
$$;


-- ─── Admin ───────────────────────────────────────────────────────────────────

/**
 * Moves an order, application or lead to a new status and records who did it.
 * Returns { updated: false } when the record doesn't exist.
 */
create function public.set_status(p_entity text, p_id uuid, p_status text, p_actor text)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  v_table   text := case p_entity
                      when 'order' then 'orders'
                      when 'application' then 'financing_applications'
                      when 'lead' then 'leads'
                    end;
  v_old     text;
  v_contact uuid;
begin
  if v_table is null then
    raise exception using errcode = '22023', message = 'Unknown record type.';
  end if;

  execute format('select status, contact_id from public.%I where id = $1 for update', v_table)
    into v_old, v_contact using p_id;
  if v_old is null then
    return jsonb_build_object('updated', false);
  end if;
  if v_old = p_status then
    return jsonb_build_object('updated', true);
  end if;

  begin
    execute format('update public.%I set status = $1, status_changed_at = now(), status_changed_by = $2 where id = $3', v_table)
      using p_status, p_actor, p_id;
  exception when check_violation then
    raise exception using errcode = '22023', message = 'That status is not valid here.';
  end;

  perform public.log_activity(v_contact, p_entity, p_id, 'status_changed', v_old, p_status, p_actor);
  return jsonb_build_object('updated', true);
end;
$$;


-- ─── RevLearn ────────────────────────────────────────────────────────────────

/**
 * Saves a course. When p has a `lessons` array, the course ends up with
 * exactly those lessons (others removed), all in this one transaction.
 * p: { id, category_id, title, description, thumbnail, tags, type, url?,
 *      source_name, duration, position, lessons?: [{ id, title, url, position }] }
 */
create function public.revlearn_save_course(p jsonb)
returns void
language plpgsql
set search_path = ''
as $$
begin
  insert into public.revlearn_courses (id, category_id, title, description, thumbnail, tags, type, url, source_name, duration, position)
  values (
    p->>'id', p->>'category_id', p->>'title', coalesce(p->>'description', ''), coalesce(p->>'thumbnail', ''),
    coalesce(array(select jsonb_array_elements_text(p->'tags')), '{}'), coalesce(p->>'type', 'single'), p->>'url',
    coalesce(p->>'source_name', 'External'), coalesce(p->>'duration', ''), coalesce((p->>'position')::integer, 0)
  )
  on conflict (id) do update
    set category_id = excluded.category_id,
        title       = excluded.title,
        description = excluded.description,
        thumbnail   = excluded.thumbnail,
        tags        = excluded.tags,
        type        = excluded.type,
        url         = excluded.url,
        source_name = excluded.source_name,
        duration    = excluded.duration,
        position    = excluded.position;

  if jsonb_typeof(p->'lessons') = 'array' then
    delete from public.revlearn_lessons
     where course_id = p->>'id'
       and id not in (select l->>'id' from jsonb_array_elements(p->'lessons') as l);

    insert into public.revlearn_lessons (id, course_id, title, url, position)
    select l->>'id', p->>'id', l->>'title', l->>'url', coalesce((l->>'position')::integer, 0)
    from jsonb_array_elements(p->'lessons') as l
    on conflict (id) do update
      set course_id = excluded.course_id,
          title     = excluded.title,
          url       = excluded.url,
          position  = excluded.position;
  end if;
end;
$$;

/** Adds (+1) or removes (-1) one like in a single statement. Returns the new count, or null if there's no such post. */
create function public.revlearn_like_post(p_post_id uuid, p_delta integer)
returns integer
language sql
set search_path = ''
as $$
  update public.revlearn_posts
     set likes = greatest(likes + p_delta, 0)
   where id = p_post_id and p_delta in (-1, 1)
  returning likes;
$$;

/**
 * Public bucket for course thumbnails. The server uploads with the service
 * role; anyone can read by URL. Skipped where Supabase Storage isn't installed.
 */
do $$
begin
  if to_regclass('storage.buckets') is not null then
    insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    values ('revlearn-thumbnails', 'revlearn-thumbnails', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
    on conflict (id) do update
      set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
  end if;
end;
$$;


-- ─── Access ──────────────────────────────────────────────────────────────────
-- Server (service_role) only. RLS on with no policies blocks the public API
-- even if a grant slips through later; the revokes make that explicit.

do $$
declare
  t text;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end;
$$;

revoke all on all tables    in schema public from public, anon, authenticated;
revoke all on all sequences in schema public from public, anon, authenticated;
revoke all on all functions in schema public from public, anon, authenticated;

grant usage on schema public to service_role;
grant select, insert, update, delete on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to service_role;
grant execute on all functions in schema public to service_role;

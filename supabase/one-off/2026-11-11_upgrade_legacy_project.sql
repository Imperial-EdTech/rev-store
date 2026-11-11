-- =============================================================================
-- One-off: upgrade the original "Rev Store" Supabase project to the current
-- schema without losing its data. Already run on that project (2026-11-11);
-- kept for the record. Do not run on a new project: use the migrations.
--
-- The project predates supabase/migrations/. It had waitlist_registrations,
-- tech_audit_requests and the revlearn_* tables in `public`.
--
--   Part 1 (before the migrations): move the old tables into a `legacy`
--     schema. Nothing is dropped; `legacy` isn't exposed through the API.
--   Then run supabase/migrations/*.sql in order.
--   Part 2 (after the migrations): copy the old rows into the new tables.
--     Waitlist sign-ups go through submit_lead exactly like the live form,
--     keeping their original dates, under one import batch.
-- =============================================================================


-- ─── Part 1: set the old tables aside ────────────────────────────────────────

create schema legacy;
revoke all on schema legacy from public, anon, authenticated;

alter table public.waitlist_registrations set schema legacy;
alter table public.tech_audit_requests    set schema legacy;
alter table public.revlearn_categories    set schema legacy;
alter table public.revlearn_courses       set schema legacy;
alter table public.revlearn_lessons       set schema legacy;
alter table public.revlearn_tools         set schema legacy;
alter table public.revlearn_resources     set schema legacy;
alter table public.revlearn_posts         set schema legacy;
alter table public.revlearn_comments      set schema legacy;
alter table public.revlearn_events        set schema legacy;

revoke all on all tables in schema legacy from public, anon, authenticated;


-- ─── Part 2: copy the data into the new tables ───────────────────────────────

-- RevLearn: same ids, so links keep working. Columns match one-to-one.
insert into public.revlearn_categories (id, title, description, icon, accent, position, created_at)
select id, title, description, icon, accent, position, created_at from legacy.revlearn_categories;

insert into public.revlearn_courses (id, category_id, title, description, thumbnail, tags, type, url, source_name, duration, position, created_at)
select id, category_id, title, description, thumbnail, tags, type, url, source_name, duration, position, created_at from legacy.revlearn_courses;

insert into public.revlearn_lessons (id, course_id, title, url, position, created_at)
select id, course_id, title, url, position, created_at from legacy.revlearn_lessons;

insert into public.revlearn_tools (id, name, description, embed_url, external_url, logo_url, partner_name, category, tags, featured, position, created_at)
select id, name, description, embed_url, external_url, logo_url, partner_name, category, tags, featured, position, created_at from legacy.revlearn_tools;

insert into public.revlearn_resources (id, title, description, url, thumbnail, type, audience, source_name, tags, featured, position, created_at)
select id, title, description, url, thumbnail, type, audience, source_name, tags, featured, position, created_at from legacy.revlearn_resources;

insert into public.revlearn_posts (id, content, author_name, author_school, author_subject, author_avatar, likes, created_at)
select id::uuid, content, author_name, author_school, author_subject, author_avatar, likes, created_at from legacy.revlearn_posts;

insert into public.revlearn_comments (id, post_id, content, author_name, author_avatar, created_at)
select id::uuid, post_id::uuid, content, author_name, author_avatar, created_at from legacy.revlearn_comments;

-- Waitlist and tech-audit requests: one import batch, oldest first so each
-- person's contact ends up with their latest details.
do $$
declare
  v_batch uuid;
  r record;
  v_contact uuid;
  v_audit uuid;
begin
  insert into public.import_batches (label, source_file, notes)
  values ('legacy-rev-store-2026-11-11', 'legacy.waitlist_registrations, legacy.tech_audit_requests',
          'Rows from the original Rev Store project, copied when it was upgraded to the current schema.')
  returning id into v_batch;

  for r in select * from legacy.waitlist_registrations order by created_at loop
    perform public.submit_lead(jsonb_build_object(
      'contact', jsonb_build_object('full_name', r.full_name, 'email', r.email, 'phone', r.phone, 'job_title', r.role),
      'source', 'website_waitlist',
      'source_detail', 'Early-access waitlist',
      'intent', case
                  when exists (select 1 from unnest(r.interests) i where i ~* 'financ|empowerment') then 'financing'
                  when 'Buy a Laptop Outright' = any (r.interests) then 'buy_outright'
                  else 'general'
                end,
      'interests', to_jsonb(coalesce(r.interests, '{}')),
      'device_count', r.device_count,
      'details', jsonb_build_object('organization', r.organization, 'role', r.role, 'notes', r.notes, 'legacyId', r.id),
      'import', jsonb_build_object('batch_id', v_batch, 'submitted_at', r.created_at, 'status', 'new')
    ));
  end loop;

  -- submit_tech_audit has no import mode, so this mirrors it with the original dates.
  for r in select * from legacy.tech_audit_requests order by created_at loop
    v_contact := public.upsert_contact(
      jsonb_build_object('full_name', r.contact_name, 'email', r.email, 'phone', r.phone, 'job_title', r.role),
      public.upsert_school(jsonb_build_object('name', r.school_name)),
      r.created_at
    );
    insert into public.tech_audits (contact_id, organization_id, contact_role, device_estimate, answers,
                                    triggered_products, top_products, section_gaps, notes, created_at)
    values (v_contact, public.upsert_school(jsonb_build_object('name', r.school_name)), coalesce(public.clean_text(r.role), 'Unknown'),
            public.clean_text(r.device_estimate), coalesce(r.answers, '{}'), coalesce(r.triggered_products, '{}'),
            coalesce(r.top_products, '{}'), coalesce(r.section_gaps, '{}'), public.clean_text(r.notes), r.created_at)
    returning id into v_audit;
    perform public.log_activity(v_contact, 'tech_audit', v_audit, 'created', null, null, 'import', r.created_at);

    perform public.submit_lead(jsonb_build_object(
      'contact', jsonb_build_object('full_name', r.contact_name, 'email', r.email, 'phone', r.phone, 'job_title', r.role),
      'school', jsonb_build_object('name', r.school_name),
      'source', 'tech_audit',
      'source_detail', 'Tech audit request',
      'intent', 'services',
      'interests', to_jsonb(coalesce(r.top_products, '{}')),
      'details', jsonb_build_object('techAuditId', v_audit, 'deviceEstimate', r.device_estimate, 'legacyId', r.id),
      'import', jsonb_build_object('batch_id', v_batch, 'submitted_at', r.created_at, 'status', 'new')
    ));
  end loop;
end;
$$;

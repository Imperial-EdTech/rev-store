-- =============================================================================
-- RevStore: "My Teacher, My Hero" teacher nominations
--
-- Anyone can nominate a teacher who shaped their life (/nominate-a-teacher).
-- The team verifies nominees, spotlights them, and the public votes; the
-- winner gets a Rev laptop.
--
-- Nominators usually give a phone number but no email, so they aren't stored
-- in `contacts` (which is matched on email). Each nomination keeps both the
-- nominator's and the teacher's details. One nominator can nominate the same
-- teacher (matched on phone) only once.
-- =============================================================================

create table public.teacher_nominations (
  id                uuid primary key default gen_random_uuid(),
  ref               text not null unique,
  nominator_name    text not null check (nominator_name <> ''),
  nominator_phone   text not null check (nominator_phone <> ''),
  nominator_role    text not null check (nominator_role in (
                      'student', 'former_student', 'parent', 'teacher', 'principal', 'school_owner', 'other')),
  teacher_name      text not null check (teacher_name <> ''),
  teacher_phone     text not null check (teacher_phone <> ''),
  teacher_subject   text,
  school_name       text not null check (school_name <> ''),
  school_state      text not null check (school_state <> ''),
  reason            text not null check (reason <> ''),
  status            text not null default 'submitted' check (status in (
                      'submitted', 'verified', 'spotlighted', 'finalist', 'winner', 'declined')),
  status_changed_at timestamptz not null default now(),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create unique index teacher_nominations_once_key on public.teacher_nominations (nominator_phone, teacher_phone);
create index teacher_nominations_created_idx on public.teacher_nominations (created_at desc);
create index teacher_nominations_teacher_idx on public.teacher_nominations (teacher_phone);

create trigger touch_updated_at before update on public.teacher_nominations
  for each row execute function public.touch_updated_at();

/**
 * p: { nominator: { name, phone, role }, teacher: { name, phone, subject? },
 *      school: { name, state }, reason }
 * Returns { id, ref }.
 */
create function public.submit_teacher_nomination(p jsonb)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  v_id  uuid;
  v_ref text;
  v_nominator_phone text := public.normalize_phone(p->'nominator'->>'phone');
  v_teacher_phone   text := public.normalize_phone(p->'teacher'->>'phone');
begin
  if v_nominator_phone = v_teacher_phone then
    raise exception using errcode = '22023', message = 'The teacher''s phone number must be different from yours.';
  end if;

  insert into public.teacher_nominations (
    ref, nominator_name, nominator_phone, nominator_role,
    teacher_name, teacher_phone, teacher_subject, school_name, school_state, reason
  )
  values (
    public.generate_ref('MTH'),
    public.clean_text(p->'nominator'->>'name'), v_nominator_phone, p->'nominator'->>'role',
    public.clean_text(p->'teacher'->>'name'), v_teacher_phone, public.clean_text(p->'teacher'->>'subject'),
    public.clean_text(p->'school'->>'name'), public.clean_text(p->'school'->>'state'), btrim(p->>'reason')
  )
  returning id, ref into v_id, v_ref;

  return jsonb_build_object('id', v_id, 'ref', v_ref);
exception
  when unique_violation then
    get stacked diagnostics v_ref = constraint_name;
    if v_ref = 'teacher_nominations_once_key' then
      raise exception using errcode = 'PT409', message = 'You''ve already nominated this teacher. Thank you!';
    end if;
    -- Re-raise without the row values, so phone numbers never reach the server logs.
    raise exception using errcode = '23505', message = 'Duplicate nomination reference.';
end;
$$;


-- ─── Permissions (same rules as the initial schema) ──────────────────────────

alter table public.teacher_nominations enable row level security;

revoke all on public.teacher_nominations from public, anon, authenticated;
revoke all on function public.submit_teacher_nomination(jsonb) from public, anon, authenticated;

grant select, insert, update, delete on public.teacher_nominations to service_role;
grant execute on function public.submit_teacher_nomination(jsonb) to service_role;

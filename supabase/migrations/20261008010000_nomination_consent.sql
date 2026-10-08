-- =============================================================================
-- RevStore: data-protection record for "My Teacher, My Hero" nominations
--
-- Run after 20261008000000_teacher_nominations.sql.
--
-- NDPA 2023 / GDPR accountability: each nomination keeps what the nominator
-- confirmed, which version of the privacy notice they saw, and when.
--   * privacy_notice_version  version of the notice on the form (src/lib/nominations/schema.ts)
--   * age_confirmed           18+, or a parent/guardian agreed (NDPA s.31)
--   * marketing_opt_in        separate, optional consent to hear about Rev devices.
--                             Nominators who didn't opt in must not get marketing.
--   * consented_at            when they submitted
--
-- The nominated teacher didn't give us their details themselves, so the team
-- must tell them at first contact (see /privacy) and delete the nomination if
-- they object. Admins delete nominations from the dashboard.
-- =============================================================================

alter table public.teacher_nominations
  add column privacy_notice_version text,
  add column age_confirmed          boolean not null default false,
  add column marketing_opt_in       boolean not null default false,
  add column consented_at           timestamptz;

/**
 * p: { nominator: { name, phone, role }, teacher: { name, phone, subject? },
 *      school: { name, state }, reason,
 *      consent: { notice_version, age_confirmed, marketing_opt_in } }
 * Returns { id, ref }.
 */
create or replace function public.submit_teacher_nomination(p jsonb)
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
  if coalesce(p->'consent'->>'notice_version', '') = '' or coalesce((p->'consent'->>'age_confirmed')::boolean, false) = false then
    raise exception using errcode = '22023', message = 'Please confirm the privacy and age statements to continue.';
  end if;

  insert into public.teacher_nominations (
    ref, nominator_name, nominator_phone, nominator_role,
    teacher_name, teacher_phone, teacher_subject, school_name, school_state, reason,
    privacy_notice_version, age_confirmed, marketing_opt_in, consented_at
  )
  values (
    public.generate_ref('MTH'),
    public.clean_text(p->'nominator'->>'name'), v_nominator_phone, p->'nominator'->>'role',
    public.clean_text(p->'teacher'->>'name'), v_teacher_phone, public.clean_text(p->'teacher'->>'subject'),
    public.clean_text(p->'school'->>'name'), public.clean_text(p->'school'->>'state'), btrim(p->>'reason'),
    p->'consent'->>'notice_version', true, coalesce((p->'consent'->>'marketing_opt_in')::boolean, false), now()
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

revoke all on function public.submit_teacher_nomination(jsonb) from public, anon, authenticated;
grant execute on function public.submit_teacher_nomination(jsonb) to service_role;

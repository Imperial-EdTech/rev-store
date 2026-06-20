create extension if not exists pgcrypto;

create table if not exists public.waitlist_registrations (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(trim(full_name)) >= 2),
  email text not null check (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'),
  phone text not null check (char_length(trim(phone)) >= 7),
  organization text not null check (char_length(trim(organization)) >= 2),
  role text not null check (
    role in (
      'Teacher',
      'School Owner',
      'School Administrator',
      'Parent',
      'Education Professional',
      'Student',
      'Other'
    )
  ),
  interests text[] not null check (array_length(interests, 1) >= 1),
  device_count integer check (device_count is null or device_count > 0),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists waitlist_registrations_created_at_idx
  on public.waitlist_registrations (created_at desc);

create index if not exists waitlist_registrations_role_idx
  on public.waitlist_registrations (role);

create index if not exists waitlist_registrations_email_idx
  on public.waitlist_registrations (lower(email));

create index if not exists waitlist_registrations_interests_idx
  on public.waitlist_registrations using gin (interests);

alter table public.waitlist_registrations enable row level security;

drop policy if exists "Anyone can register interest" on public.waitlist_registrations;
create policy "Anyone can register interest"
  on public.waitlist_registrations
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Admins can read registrations" on public.waitlist_registrations;
create policy "Admins can read registrations"
  on public.waitlist_registrations
  for select
  to authenticated
  using (
    coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin'
  );

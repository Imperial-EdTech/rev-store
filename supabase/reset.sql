-- =============================================================================
-- RevStore: wipe the public schema
--
-- DESTRUCTIVE. Drops every table, view, function, type and sequence you have
-- created in the `public` schema, with all their data. Run it once, on the
-- project you are rebuilding, before supabase/migrations/*_initial_schema.sql.
--
-- What it does NOT touch:
--   * Supabase's own schemas (auth, storage, realtime, extensions, vault, ...).
--     Auth users, storage buckets and files stay as they are.
--   * Extensions, even ones installed into `public`.
--   * The `public` schema itself, so the grants and default privileges
--     Supabase set up on it are kept exactly as they were.
--
-- Triggers elsewhere (e.g. on auth.users) that call a function in `public`
-- are dropped along with that function; they are listed in the notices.
--
-- Runs as one transaction: if anything fails, nothing is dropped.
-- =============================================================================

-- 1. Look first (read-only). Shows what the wipe below will remove.
select case c.relkind
         when 'r' then 'table' when 'p' then 'table' when 'v' then 'view'
         when 'm' then 'materialized view' when 'S' then 'sequence' else 'foreign table'
       end as kind,
       c.relname::text as name
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind in ('r', 'p', 'v', 'm', 'S', 'f')
  and not exists (select 1 from pg_depend d where d.objid = c.oid and d.deptype = 'e')
union all
select 'function', p.proname || '(' || pg_get_function_identity_arguments(p.oid) || ')'
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and not exists (select 1 from pg_depend d where d.objid = p.oid and d.deptype = 'e')
union all
select 'type', t.typname::text
from pg_type t
join pg_namespace n on n.oid = t.typnamespace
where n.nspname = 'public'
  and t.typtype in ('e', 'd', 'c', 'r')
  and (t.typrelid = 0 or (select relkind from pg_class where oid = t.typrelid) = 'c')
  and not exists (select 1 from pg_depend d where d.objid = t.oid and d.deptype = 'e')
order by 1, 2;

-- 2. Wipe.
begin;

do $$
declare
  obj record;
begin
  -- Views and materialised views first, then tables (CASCADE takes their
  -- triggers, policies, indexes and foreign keys with them).
  for obj in
    select c.relname, c.relkind
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relkind in ('v', 'm', 'r', 'p', 'f')
      and not exists (select 1 from pg_depend d where d.objid = c.oid and d.deptype = 'e')
    order by case c.relkind when 'v' then 1 when 'm' then 2 else 3 end
  loop
    execute format(
      'drop %s if exists public.%I cascade',
      case obj.relkind when 'v' then 'view' when 'm' then 'materialized view' when 'f' then 'foreign table' else 'table' end,
      obj.relname
    );
    raise notice 'dropped %', obj.relname;
  end loop;

  -- Functions, procedures and aggregates.
  for obj in
    select p.oid::regprocedure::text as signature, p.prokind
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and not exists (select 1 from pg_depend d where d.objid = p.oid and d.deptype = 'e')
  loop
    execute format(
      'drop %s if exists %s cascade',
      case obj.prokind when 'p' then 'procedure' when 'a' then 'aggregate' else 'function' end,
      obj.signature
    );
    raise notice 'dropped %', obj.signature;
  end loop;

  -- Enums, domains, composite and range types left behind.
  for obj in
    select t.typname
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public'
      and t.typtype in ('e', 'd', 'c', 'r')
      and (t.typrelid = 0 or (select relkind from pg_class where oid = t.typrelid) = 'c')
      and not exists (select 1 from pg_depend d where d.objid = t.oid and d.deptype = 'e')
  loop
    execute format('drop type if exists public.%I cascade', obj.typname);
    raise notice 'dropped type %', obj.typname;
  end loop;

  -- Standalone sequences (ones owned by a table went with it).
  for obj in
    select c.relname
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relkind = 'S'
      and not exists (select 1 from pg_depend d where d.objid = c.oid and d.deptype = 'e')
  loop
    execute format('drop sequence if exists public.%I cascade', obj.relname);
    raise notice 'dropped sequence %', obj.relname;
  end loop;
end;
$$;

commit;

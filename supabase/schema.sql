-- Run this in the Supabase SQL editor (safe to re-run).

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  name text not null,
  email text,
  phone text,
  attending boolean not null,
  guest_count integer not null default 1 check (guest_count >= 0 and guest_count <= 10),
  message text default '',
  public_wish boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.guests (
  slug text primary key,
  type text not null check (type in ('one', 'two', 'family')),
  name text not null,
  max_guests integer not null default 10 check (max_guests >= 1 and max_guests <= 10),
  -- Only used when type = 'one'. Null for couples and families.
  gender text check (gender is null or gender in ('male', 'female')),
  created_at timestamptz not null default now()
);

-- Existing projects: add the gender column if the guests table already exists.
alter table public.guests
  add column if not exists gender text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'guests_gender_check'
  ) then
    alter table public.guests
      add constraint guests_gender_check
      check (gender is null or gender in ('male', 'female'));
  end if;
end $$;

-- Individuals should have a gender; couples/families must not.
update public.guests
set gender = 'male'
where type = 'one' and gender is null;

update public.guests
set gender = null
where type in ('two', 'family');

alter table public.rsvps enable row level security;
alter table public.guests enable row level security;

-- No public policies. Only the server (service role key) can read or write.
revoke all on table public.rsvps from anon, authenticated;
revoke all on table public.guests from anon, authenticated;

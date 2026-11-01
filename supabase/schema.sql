-- Run this once in the Supabase SQL editor.

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
  created_at timestamptz not null default now()
);

alter table public.rsvps enable row level security;
alter table public.guests enable row level security;

-- No public policies. Only the server (service role key) can read or write.
revoke all on table public.rsvps from anon, authenticated;
revoke all on table public.guests from anon, authenticated;

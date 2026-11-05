-- Run this once in Supabase SQL editor if guests table already exists.
-- Adds gender for individual invites only (couples / families stay null).

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

-- Backfill existing individual guests as male (edit women in Admin afterward).
update public.guests
set gender = 'male'
where type = 'one' and gender is null;

update public.guests
set gender = null
where type in ('two', 'family');

-- Optional: fix known women by slug, e.g.
-- update public.guests set gender = 'female' where slug = 'nethmi';

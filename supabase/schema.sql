-- Vivaha wedding invitation — Supabase schema
-- Run once in Supabase → SQL Editor. Then:
--   1. Authentication → Users → "Add user" (email + strong password) for the couple / your team.
--   2. insert into public.admins (user_id) values ('<that user id>');
--   3. Put the project URL + anon key in .env (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).

create extension if not exists pgcrypto;

-- ───────────────────────── admins ─────────────────────────
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;
-- nobody reads/writes admins through the API; manage it from the SQL editor.

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;
grant execute on function public.is_admin() to anon, authenticated;

-- ───────────────────────── site config ─────────────────────────
create table if not exists public.site_config (
  id int primary key default 1 check (id = 1),
  data jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.site_config enable row level security;
drop policy if exists "config readable by everyone" on public.site_config;
create policy "config readable by everyone" on public.site_config for select using (true);
drop policy if exists "config writable by admins" on public.site_config;
create policy "config writable by admins" on public.site_config for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ───────────────────────── RSVPs ─────────────────────────
create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  device_key_hash text unique not null,          -- sha256 of a random per-device secret
  name text not null check (char_length(name) between 1 and 80),
  attending boolean not null,
  events jsonb not null default '{}'::jsonb,       -- { "wedding": 3, "reception": 2 }
  needs_rooms boolean not null default false,
  rooms int not null default 0 check (rooms between 0 and 50),
  check_in date,
  check_out date,
  notes text check (char_length(notes) <= 600),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.rsvps enable row level security;
drop policy if exists "admins read rsvps" on public.rsvps;
create policy "admins read rsvps" on public.rsvps for select to authenticated using (public.is_admin());
drop policy if exists "admins delete rsvps" on public.rsvps;
create policy "admins delete rsvps" on public.rsvps for delete to authenticated using (public.is_admin());
-- guests have no direct table access; they use the two functions below.

create or replace function public.submit_rsvp(
  p_device_key text, p_name text, p_attending boolean, p_events jsonb,
  p_needs_rooms boolean, p_rooms int, p_check_in date, p_check_out date, p_notes text
) returns setof public.rsvps
language plpgsql security definer set search_path = public as $$
declare h text := encode(digest(p_device_key, 'sha256'), 'hex');
begin
  if char_length(coalesce(p_device_key, '')) < 32 then raise exception 'invalid device key'; end if;
  if char_length(trim(coalesce(p_name, ''))) = 0 then raise exception 'name is required'; end if;
  if p_check_in is not null and p_check_out is not null and p_check_out <= p_check_in then
    raise exception 'check-out must be after check-in';
  end if;
  return query
  insert into public.rsvps as r (device_key_hash, name, attending, events, needs_rooms, rooms, check_in, check_out, notes)
  values (h, left(trim(p_name), 80), p_attending, coalesce(p_events, '{}'::jsonb),
          coalesce(p_needs_rooms, false), greatest(0, least(coalesce(p_rooms, 0), 50)), p_check_in, p_check_out, left(coalesce(p_notes, ''), 600))
  on conflict (device_key_hash) do update set
    name = excluded.name, attending = excluded.attending, events = excluded.events,
    needs_rooms = excluded.needs_rooms, rooms = excluded.rooms, check_in = excluded.check_in,
    check_out = excluded.check_out, notes = excluded.notes, updated_at = now()
  returning r.*;
end $$;

create or replace function public.get_my_rsvp(p_device_key text) returns setof public.rsvps
language sql stable security definer set search_path = public as $$
  select * from public.rsvps where device_key_hash = encode(digest(p_device_key, 'sha256'), 'hex');
$$;
grant execute on function public.submit_rsvp(text, text, boolean, jsonb, boolean, int, date, date, text) to anon, authenticated;
grant execute on function public.get_my_rsvp(text) to anon, authenticated;

-- ───────────────────────── wishes ─────────────────────────
create table if not exists public.wishes (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 60),
  message text not null check (char_length(message) between 1 and 800),
  photo_url text,
  created_at timestamptz not null default now()
);
alter table public.wishes enable row level security;
drop policy if exists "wishes readable" on public.wishes;
create policy "wishes readable" on public.wishes for select using (true);
drop policy if exists "anyone can add a wish" on public.wishes;
create policy "anyone can add a wish" on public.wishes for insert to anon, authenticated with check (true);
drop policy if exists "admins delete wishes" on public.wishes;
create policy "admins delete wishes" on public.wishes for delete to authenticated using (public.is_admin());
alter publication supabase_realtime add table public.wishes;

-- ───────────────────────── storage ─────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 15728640, array['image/jpeg','image/png','image/webp','image/gif','audio/mpeg','audio/mp4','audio/aac','audio/ogg','audio/wav','audio/x-m4a'])
on conflict (id) do nothing;

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects for select using (bucket_id = 'media');
drop policy if exists "guests upload wish photos" on storage.objects;
create policy "guests upload wish photos" on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'media' and (storage.foldername(name))[1] = 'wishes');
drop policy if exists "admins manage media" on storage.objects;
create policy "admins manage media" on storage.objects for all to authenticated
  using (bucket_id = 'media' and public.is_admin()) with check (bucket_id = 'media' and public.is_admin());

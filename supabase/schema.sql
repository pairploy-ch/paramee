-- Paramee Asset — Supabase schema
-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query).
-- Requires the pgcrypto extension for gen_random_uuid() (enabled by default on Supabase).

-- ============================================================
-- profiles — one row per authenticated user (admin staff or property owner)
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'owner' check (role in ('admin', 'owner')),
  name text,
  phone text,
  email text,
  avatar_url text,
  line_id text,
  facebook_url text,
  instagram_url text,
  tiktok_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- helper used by RLS policies below
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create policy "profiles: read own row" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles: admins read all" on public.profiles
  for select using (public.is_admin());

create policy "profiles: update own row" on public.profiles
  for update using (auth.uid() = id);

-- auto-create a profile row whenever someone signs up.
-- role/name/phone come from the `data` passed to supabase.auth.signUp().
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, name, phone, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'role', 'owner'),
    new.raw_user_meta_data ->> 'name',
    new.raw_user_meta_data ->> 'phone',
    new.email
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- properties
-- ============================================================
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  owner_id uuid references public.profiles (id) on delete set null,
  tier smallint not null default 2 check (tier in (1, 2, 3)),
  name text not null,
  type text not null check (type in ('คอนโด', 'บ้าน', 'ทาวน์โฮม', 'ที่ดิน')),
  address text not null,
  district text not null,
  map_url text,
  status text not null default 'Available' check (status in ('Available', 'Reserved', 'Sold', 'For Rent')),
  sale_price numeric,
  rent_price numeric,
  area_sqm numeric not null default 0,
  bedrooms smallint not null default 0,
  bathrooms smallint not null default 0,
  floor text,
  facing text,
  images text[] not null default '{}',
  common_fee_per_sqm numeric not null default 0,
  avg_rent_in_area numeric not null default 0,
  transfer_fee_estimate numeric not null default 0,
  transit jsonb not null default '[]',
  investor_roi_percent numeric not null default 0,
  investor_rental_yield_percent numeric not null default 0,
  investor_occupancy_percent numeric not null default 0,
  investor_cashflow_per_month numeric not null default 0,
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.properties enable row level security;

create policy "properties: public read" on public.properties
  for select using (true);

create policy "properties: owners insert own" on public.properties
  for insert with check (owner_id = auth.uid() or public.is_admin());

create policy "properties: owners update own" on public.properties
  for update using (owner_id = auth.uid() or public.is_admin());

create policy "properties: owners delete own" on public.properties
  for delete using (owner_id = auth.uid() or public.is_admin());

create index if not exists properties_owner_id_idx on public.properties (owner_id);

-- ============================================================
-- bookings — submissions from the public "นัดชมทรัพย์" form
-- ============================================================
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  mode text not null check (mode in ('view', 'financing')),
  name text not null,
  phone text not null,
  email text not null,
  property_slug text,
  appt_date date,
  appt_time time,
  note text,
  pdpa_consent boolean not null default false,
  status text not null default 'new' check (status in ('new', 'contacted', 'done'))
);

alter table public.bookings enable row level security;

create policy "bookings: anyone can submit" on public.bookings
  for insert with check (true);

create policy "bookings: admins read all" on public.bookings
  for select using (public.is_admin());

create policy "bookings: admins update" on public.bookings
  for update using (public.is_admin());

create policy "bookings: admins delete" on public.bookings
  for delete using (public.is_admin());

-- ============================================================
-- posts — blog articles managed from the admin backend
-- ============================================================
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  tag text not null default '',
  cover_image text,
  author_name text not null default 'ทีมงาน Paramee',
  is_published boolean not null default true,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.posts enable row level security;

create policy "posts: public read published" on public.posts
  for select using (is_published = true or public.is_admin());

create policy "posts: admins insert" on public.posts
  for insert with check (public.is_admin());

create policy "posts: admins update" on public.posts
  for update using (public.is_admin());

create policy "posts: admins delete" on public.posts
  for delete using (public.is_admin());

-- ============================================================
-- testimonials — "ลูกค้าพูดถึงเราอย่างไร" shown on the homepage
-- ============================================================
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  quote text not null,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.testimonials enable row level security;

create policy "testimonials: public read published" on public.testimonials
  for select using (is_published = true or public.is_admin());

create policy "testimonials: admins insert" on public.testimonials
  for insert with check (public.is_admin());

create policy "testimonials: admins update" on public.testimonials
  for update using (public.is_admin());

create policy "testimonials: admins delete" on public.testimonials
  for delete using (public.is_admin());

-- ============================================================
-- new_launch_projects — "โครงการมือ 1" admin-only presale project listings
-- ============================================================
create table if not exists public.new_launch_projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  unit_types_count text not null default '',
  price_min numeric,
  price_max numeric,
  location_highlight text not null default '',
  rent_yield_price text not null default '',
  developer text not null default '',
  unit_count text not null default '',
  building_count text not null default '',
  completion_year text not null default '',
  latest_promotion text not null default '',
  map_url text,
  common_area_facilities text not null default '',
  reservation_deposit text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.new_launch_projects enable row level security;

create policy "new_launch_projects: admins manage all" on public.new_launch_projects
  for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- Storage — bucket for property photos (uploaded photos are watermarked
-- server-side in /api/upload before they land here)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do nothing;

create policy "property-images: authenticated upload own folder"
on storage.objects for insert
with check (
  bucket_id = 'property-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "property-images: owners update own files"
on storage.objects for update using (
  bucket_id = 'property-images' and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "property-images: owners delete own files"
on storage.objects for delete using (
  bucket_id = 'property-images' and (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================
-- leads — daily walk-in/call/LINE/website lead tracker (admin-only)
-- ============================================================
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  date date not null default current_date,
  channel text not null,
  interested_type text not null,
  area text not null,
  budget text not null default '',
  size_needed text not null default '',
  purpose text not null,
  follow_up text not null default 'Warm' check (follow_up in ('Hot', 'Warm', 'Cold')),
  note text not null default '',
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

create policy "leads: admins manage all" on public.leads
  for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- Bootstrapping the first admin
-- ============================================================
-- 1. Register a normal account at /register (it will default to role='owner').
-- 2. Then run, replacing the email:
--   update public.profiles set role = 'admin'
--   where id = (select id from auth.users where email = 'you@example.com');

-- ============================================================
-- Grants — required in addition to RLS policies above.
-- Fresh Supabase projects don't always pre-grant table privileges to
-- anon/authenticated, so RLS alone isn't enough; run this once.
-- ============================================================
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on
  public.profiles,
  public.properties,
  public.bookings,
  public.posts,
  public.testimonials,
  public.leads,
  public.new_launch_projects
to anon, authenticated;

alter default privileges in schema public
  grant select, insert, update, delete on tables to anon, authenticated;

-- ============================================================
-- Migration — run this if you already executed the script above before
-- this section existed (adds multi-station transit + owner contact fields).
-- Safe to re-run; no existing property/profile rows are touched beyond
-- backfilling the new transit column from the old single-station ones.
-- ============================================================
alter table public.properties add column if not exists transit jsonb not null default '[]';

update public.properties
set transit = jsonb_build_array(
  jsonb_build_object('station', transit_station, 'line', transit_line, 'distanceMeters', transit_distance_meters)
)
where transit = '[]' and transit_station is not null;

alter table public.properties drop column if exists transit_station;
alter table public.properties drop column if exists transit_line;
alter table public.properties drop column if exists transit_distance_meters;

alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists line_id text;
alter table public.profiles add column if not exists facebook_url text;
alter table public.profiles add column if not exists instagram_url text;
alter table public.profiles add column if not exists tiktok_url text;

alter table public.properties add column if not exists map_url text;

alter table public.properties add column if not exists remarks text not null default '';
alter table public.properties add column if not exists lease_terms jsonb not null default '[]';
alter table public.properties add column if not exists land_deed_type text;
alter table public.properties add column if not exists land_transfer_fee_party text
  check (land_transfer_fee_party is null or land_transfer_fee_party in ('เจ้าของออก', '50/50', 'ลูกค้าออก'));

alter table public.bookings add column if not exists line_or_whatsapp text;
alter table public.bookings add column if not exists unit_code text;
alter table public.bookings add column if not exists budget_min numeric;
alter table public.bookings add column if not exists budget_max numeric;

-- ============================================================
-- owner_contacts — public-safe view so the property detail page can show
-- the actual listing owner's name/photo/contact instead of hardcoding the
-- Paramee team. Exposes only the fields meant to be public (no email, no
-- role) since `profiles` itself has no public read policy.
-- ============================================================
create or replace view public.owner_contacts as
select id, name, phone, avatar_url, line_id, facebook_url, instagram_url, tiktok_url
from public.profiles
where role = 'owner';

grant select on public.owner_contacts to anon, authenticated;

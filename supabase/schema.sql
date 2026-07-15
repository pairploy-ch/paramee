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
  transit_station text,
  transit_line text check (transit_line in ('BTS', 'MRT', 'ARL')),
  transit_distance_meters int not null default 0,
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

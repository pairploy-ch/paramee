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
  type text not null check (type in ('บ้าน', 'ที่ดิน', 'คอนโด', 'เรือยอชน์')),
  address text not null,
  district text not null,
  area text check (area is null or area in ('พัทยา', 'กรุงเทพฯ', 'เชียงใหม่', 'ภูเก็ต', 'เขาใหญ่')),
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
  project_code text,
  project_type text not null default 'คอนโด' check (project_type in ('บ้าน', 'ที่ดิน', 'คอนโด', 'เรือยอชน์')),
  region text check (region is null or region in ('พัทยา', 'กรุงเทพฯ', 'เชียงใหม่', 'ภูเก็ต', 'เขาใหญ่')),
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
  images text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.new_launch_projects enable row level security;

create policy "new_launch_projects: public read" on public.new_launch_projects
  for select using (true);

create policy "new_launch_projects: admins insert" on public.new_launch_projects
  for insert with check (public.is_admin());

create policy "new_launch_projects: admins update" on public.new_launch_projects
  for update using (public.is_admin());

create policy "new_launch_projects: admins delete" on public.new_launch_projects
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
  follow_up text not null default 'medium'
    check (follow_up in ('urgent_high', 'urgent', 'medium', 'general')),
  note text not null default '',
  nickname text not null default '',
  move_in_or_sign_date date,
  facebook text not null default '',
  line_id text not null default '',
  phone text not null default '',
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

create policy "leads: admins manage all" on public.leads
  for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- lease_contracts — signed lease agreements generated from the admin
-- "ระบบสัญญาเช่า" screen (admin-only, never public)
-- ============================================================
create table if not exists public.lease_contracts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  project_name text not null default '',
  project_address text not null default '',
  room_number text not null default '',
  building text not null default '',
  floor text not null default '',
  lessor_name text not null default '',
  lessor_id_card text not null default '',
  lessor_address text not null default '',
  lessee_name text not null default '',
  lessee_id_card text not null default '',
  lessee_address text not null default '',
  contract_date date,
  start_date date,
  end_date date,
  contract_years numeric not null default 1,
  rent_per_month numeric not null default 0,
  payment_due_day text not null default '',
  bank_name text not null default '',
  bank_account_number text not null default '',
  bank_account_name text not null default '',
  deposit_amount numeric not null default 0,
  cleaning_fee numeric not null default 0,
  receipt_date date,
  reservation_deposit_amount numeric not null default 0,
  damage_deposit_amount numeric not null default 0,
  checklist_items jsonb not null default '[]'
);

alter table public.lease_contracts enable row level security;

create policy "lease_contracts: admins manage all" on public.lease_contracts
  for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- co_agent_applications — submissions from the public, unlisted
-- "สมัคร Co-Agent" form. Never linked in any nav menu; only reachable via
-- the direct URLs shared out-of-band (/co-agent-register to apply,
-- /admin/co-agents to review).
-- ============================================================
create table if not exists public.co_agent_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null default '',
  nickname text not null default '',
  phone text not null default '',
  line_id text not null default '',
  email text not null default '',
  work_type text not null default '',
  expertise_areas text[] not null default '{}',
  marketing_channels text[] not null default '{}',
  marketing_name text not null default '',
  id_card_files text[] not null default '{}',
  bank_book_file text not null default '',
  company_cert_file text
);

alter table public.co_agent_applications enable row level security;

create policy "co_agent_applications: anyone can submit" on public.co_agent_applications
  for insert with check (true);

create policy "co_agent_applications: admins read all" on public.co_agent_applications
  for select using (public.is_admin());

create policy "co_agent_applications: admins delete" on public.co_agent_applications
  for delete using (public.is_admin());

-- Storage bucket for the uploaded ID card / bank book / company certificate
-- copies. Kept private (not public=true) since these are sensitive personal
-- documents — anyone can upload (the applicant isn't logged in), but only
-- admins can read them back via signed URLs.
insert into storage.buckets (id, name, public)
values ('co-agent-documents', 'co-agent-documents', false)
on conflict (id) do nothing;

create policy "co-agent-documents: anyone can upload"
on storage.objects for insert
with check (bucket_id = 'co-agent-documents');

create policy "co-agent-documents: admins read"
on storage.objects for select using (
  bucket_id = 'co-agent-documents' and public.is_admin()
);

create policy "co-agent-documents: admins delete"
on storage.objects for delete using (
  bucket_id = 'co-agent-documents' and public.is_admin()
);

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
  public.new_launch_projects,
  public.lease_contracts,
  public.co_agent_applications
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

alter table public.properties add column if not exists unit_code text;
alter table public.properties add column if not exists rental_min_term_months numeric not null default 0;
alter table public.properties add column if not exists rental_deposit_months numeric not null default 0;
alter table public.properties add column if not exists rental_advance_months numeric not null default 0;

alter table public.bookings add column if not exists line_or_whatsapp text;
alter table public.bookings add column if not exists unit_code text;
alter table public.bookings add column if not exists budget_min numeric;
alter table public.bookings add column if not exists budget_max numeric;

alter table public.properties add column if not exists unit_code text;
alter table public.properties add column if not exists rental_min_term_months numeric not null default 0;
alter table public.properties add column if not exists rental_deposit_months numeric not null default 0;
alter table public.properties add column if not exists rental_advance_months numeric not null default 0;

-- new_launch_projects: add project code + images, and open up public read
-- access so the homepage's "โครงการมือ 1" section can show them.
alter table public.new_launch_projects add column if not exists project_code text;
alter table public.new_launch_projects add column if not exists images text[] not null default '{}';
alter table public.new_launch_projects add column if not exists project_type text not null default 'คอนโด'
  check (project_type in ('คอนโด', 'บ้าน', 'ทาวน์โฮม', 'ที่ดิน'));
alter table public.new_launch_projects add column if not exists region text
  check (region is null or region in ('พัทยา', 'กรุงเทพฯ', 'เชียงใหม่', 'ภูเก็ต', 'เขาใหญ่'));

drop policy if exists "new_launch_projects: admins manage all" on public.new_launch_projects;

drop policy if exists "new_launch_projects: public read" on public.new_launch_projects;
create policy "new_launch_projects: public read" on public.new_launch_projects
  for select using (true);

drop policy if exists "new_launch_projects: admins insert" on public.new_launch_projects;
create policy "new_launch_projects: admins insert" on public.new_launch_projects
  for insert with check (public.is_admin());

drop policy if exists "new_launch_projects: admins update" on public.new_launch_projects;
create policy "new_launch_projects: admins update" on public.new_launch_projects
  for update using (public.is_admin());

drop policy if exists "new_launch_projects: admins delete" on public.new_launch_projects;
create policy "new_launch_projects: admins delete" on public.new_launch_projects
  for delete using (public.is_admin());

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

-- ============================================================
-- Property types updated: "ทาวน์โฮม" replaced with "เรือยอชน์" (yacht) across
-- properties and new_launch_projects. Existing "ทาวน์โฮม" rows are
-- recategorized as "บ้าน" before the stricter check constraint is applied.
-- Also adds a "พื้นที่" (area/region) filter field on properties, separate
-- from the free-text "ทำเล" (district) field.
-- ============================================================
update public.properties set type = 'บ้าน' where type = 'ทาวน์โฮม';
alter table public.properties drop constraint if exists properties_type_check;
alter table public.properties add constraint properties_type_check
  check (type in ('บ้าน', 'ที่ดิน', 'คอนโด', 'เรือยอชน์'));

update public.new_launch_projects set project_type = 'บ้าน' where project_type = 'ทาวน์โฮม';
alter table public.new_launch_projects drop constraint if exists new_launch_projects_project_type_check;
alter table public.new_launch_projects add constraint new_launch_projects_project_type_check
  check (project_type in ('บ้าน', 'ที่ดิน', 'คอนโด', 'เรือยอชน์'));

alter table public.properties add column if not exists area text
  check (area is null or area in ('พัทยา', 'กรุงเทพฯ', 'เชียงใหม่', 'ภูเก็ต', 'เขาใหญ่'));

-- leads: 4-level follow-up status (was Hot/Warm/Cold) + new contact/move-in
-- fields captured on the "บันทึก Lead ใหม่" form. The old constraint must be
-- dropped BEFORE remapping values, otherwise the remap's own new values
-- ('urgent_high' etc.) get rejected by the still-active old constraint.
alter table public.leads drop constraint if exists leads_follow_up_check;
update public.leads set follow_up = 'urgent_high' where follow_up = 'Hot';
update public.leads set follow_up = 'medium' where follow_up = 'Warm';
update public.leads set follow_up = 'general' where follow_up = 'Cold';
update public.leads set follow_up = 'medium'
  where follow_up not in ('urgent_high', 'urgent', 'medium', 'general');
alter table public.leads alter column follow_up set default 'medium';
alter table public.leads add constraint leads_follow_up_check
  check (follow_up in ('urgent_high', 'urgent', 'medium', 'general'));

alter table public.leads add column if not exists nickname text not null default '';
alter table public.leads add column if not exists move_in_or_sign_date date;
alter table public.leads add column if not exists facebook text not null default '';
alter table public.leads add column if not exists line_id text not null default '';
alter table public.leads add column if not exists phone text not null default '';

-- new_launch_projects: region list synced with properties' "พื้นที่" field —
-- "อื่นๆ" replaced with "เขาใหญ่". Drop the old constraint before remapping.
alter table public.new_launch_projects drop constraint if exists new_launch_projects_region_check;
update public.new_launch_projects set region = 'เขาใหญ่' where region = 'อื่นๆ';
alter table public.new_launch_projects add constraint new_launch_projects_region_check
  check (region is null or region in ('พัทยา', 'กรุงเทพฯ', 'เชียงใหม่', 'ภูเก็ต', 'เขาใหญ่'));

-- Facebook post link — saved after the listing photo/caption is posted to the
-- page, for reference.
alter table public.properties add column if not exists facebook_post_url text;
alter table public.new_launch_projects add column if not exists facebook_post_url text;

-- Google Sheet property sync — unit_code (CODE column in the sheet) is the
-- natural key used to match sheet rows to existing properties on re-sync.
create unique index if not exists properties_unit_code_unique_idx
  on public.properties (unit_code)
  where unit_code <> '';

-- The sheet sync uploads watermarked photos under a "sheet-sync/{CODE}/..."
-- path (not a per-user folder), so it needs its own admin-scoped policy
-- alongside the existing "own folder" one.
drop policy if exists "property-images: admins upload any path" on storage.objects;
create policy "property-images: admins upload any path"
on storage.objects for insert
with check (
  bucket_id = 'property-images' and public.is_admin()
);

-- Field parity with the Google Sheet: per-unit amenities, PropertyHub
-- listing link, and short-term (6/3/1-month) rental rate tiers.
alter table public.properties add column if not exists property_hub_url text;
alter table public.properties add column if not exists unit_amenities text[] not null default '{}';
alter table public.properties add column if not exists rent_price_6_month numeric;
alter table public.properties add column if not exists rent_price_3_month numeric;
alter table public.properties add column if not exists rent_price_1_month numeric;

-- ============================================================
-- commission_deals — closed deals logged for the monthly KPI dashboard
-- (admin-only, mirrors the personal "KPI TRACKER" Google Sheet tab).
-- category matches an id in src/lib/commissionCategories.ts.
-- ============================================================
create table if not exists public.commission_deals (
  id uuid primary key default gen_random_uuid(),
  closed_date date not null default current_date,
  category text not null,
  commission_amount numeric not null default 0,
  property_name text not null default '',
  note text not null default '',
  created_at timestamptz not null default now()
);

alter table public.commission_deals enable row level security;

drop policy if exists "commission_deals: admins manage all" on public.commission_deals;
create policy "commission_deals: admins manage all" on public.commission_deals
  for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- commission_monthly_targets — one row per month holding the editable
-- goals shown on the KPI dashboard (admin-only).
-- ============================================================
create table if not exists public.commission_monthly_targets (
  id uuid primary key default gen_random_uuid(),
  month date unique not null,
  commission_target numeric not null default 1000000,
  properties_sourced_target numeric not null default 100,
  developer_target numeric not null default 10,
  category_targets jsonb not null default '{
    "rental_condo_18k": 80,
    "rental_villa_30k": 15,
    "rental_newlaunch_villa_20m": 5,
    "high_condo_7pct": 3,
    "high_villa_ultraluxury_20m": 7
  }'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.commission_monthly_targets enable row level security;

drop policy if exists "commission_monthly_targets: admins manage all" on public.commission_monthly_targets;
create policy "commission_monthly_targets: admins manage all" on public.commission_monthly_targets
  for all using (public.is_admin()) with check (public.is_admin());

-- Explicit "ประเภท" (เช่า / ขาย / เช่า + ขาย) selector, shown as the first field
-- on the property/new-launch forms. Backfill properties from the prices that
-- were already entered so existing listings don't need manual re-entry.
alter table public.properties add column if not exists listing_type text not null default 'ขาย';
update public.properties set listing_type = case
  when sale_price is not null and rent_price is not null then 'เช่า + ขาย'
  when rent_price is not null then 'เช่า'
  else 'ขาย'
end;

alter table public.new_launch_projects add column if not exists listing_type text not null default 'ขาย';

-- ============================================================
-- Batch: photo shoot requests, owner nickname/WhatsApp, admin-created
-- (contact-only) owners, "ตึก" field on properties, and the property
-- status enum replacement (Available/Reserved/Sold/For Rent →
-- พร้อมปล่อยเช่า/กำลังทำความสะอาด/ยังไม่พร้อมปล่อย).
-- ============================================================

-- photo_shoot_requests — submissions from the public "นัดถ่ายภาพ" form.
create table if not exists public.photo_shoot_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  condo_name text not null,
  unit_code text,
  room_number text,
  building text,
  floor text,
  owner_nickname text,
  phone text not null,
  note text,
  status text not null default 'new' check (status in ('new', 'contacted', 'done'))
);

alter table public.photo_shoot_requests enable row level security;

drop policy if exists "photo_shoot_requests: anyone can submit" on public.photo_shoot_requests;
create policy "photo_shoot_requests: anyone can submit" on public.photo_shoot_requests
  for insert with check (true);

drop policy if exists "photo_shoot_requests: admins read all" on public.photo_shoot_requests;
create policy "photo_shoot_requests: admins read all" on public.photo_shoot_requests
  for select using (public.is_admin());

drop policy if exists "photo_shoot_requests: admins update" on public.photo_shoot_requests;
create policy "photo_shoot_requests: admins update" on public.photo_shoot_requests
  for update using (public.is_admin());

drop policy if exists "photo_shoot_requests: admins delete" on public.photo_shoot_requests;
create policy "photo_shoot_requests: admins delete" on public.photo_shoot_requests
  for delete using (public.is_admin());

grant select, insert, update, delete on public.photo_shoot_requests to anon, authenticated;

-- profiles: nickname (owner signup) + whatsapp (contact channel).
alter table public.profiles add column if not exists nickname text;
alter table public.profiles add column if not exists whatsapp text;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, name, phone, nickname, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'role', 'owner'),
    new.raw_user_meta_data ->> 'name',
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'nickname',
    new.email
  );
  return new;
end;
$$;

-- profiles: allow admins to create a "contact-only" owner record (no login)
-- from the admin add-property flow, and to relax the id/auth.users FK so
-- such a row isn't required to correspond to a real auth account.
-- Self-registered owners are unaffected — the trigger above still sets
-- id = new.id from auth.users, just without a DB-enforced FK anymore.
alter table public.profiles drop constraint if exists profiles_id_fkey;
alter table public.profiles alter column id set default gen_random_uuid();
alter table public.profiles add column if not exists is_registered boolean not null default true;

drop policy if exists "profiles: admins insert" on public.profiles;
create policy "profiles: admins insert" on public.profiles
  for insert with check (public.is_admin());

drop policy if exists "profiles: admins update any" on public.profiles;
create policy "profiles: admins update any" on public.profiles
  for update using (public.is_admin());

-- owner_contacts view: expose whatsapp alongside the other contact fields.
create or replace view public.owner_contacts as
select id, name, phone, whatsapp, avatar_url, line_id, facebook_url, instagram_url, tiktok_url
from public.profiles
where role = 'owner';

-- properties: "ตึก" (building) field, shown in the "รายละเอียดพื้นที่" section
-- of the property form.
alter table public.properties add column if not exists building text not null default '';

-- properties.status: replace the old English enum with 4 new Thai
-- availability states (ว่าง/ติดจอง/PRM ปล่อยเช่า/เจ้าของปล่อยเอง). Existing
-- rows are remapped as a best-effort default: Available -> ว่าง, Reserved ->
-- ติดจอง, For Rent -> PRM ปล่อยเช่า. "Sold" has no clean equivalent in the
-- new set (all 4 values describe rental availability, none means "sold") —
-- mapped to เจ้าของปล่อยเอง as the closest "no longer actively marketed by
-- us" bucket. Review this mapping against real listings if it matters which
-- specific properties land in which bucket.
alter table public.properties drop constraint if exists properties_status_check;
update public.properties set status = 'ว่าง' where status = 'Available';
update public.properties set status = 'ติดจอง' where status = 'Reserved';
update public.properties set status = 'PRM ปล่อยเช่า' where status = 'For Rent';
update public.properties set status = 'เจ้าของปล่อยเอง' where status = 'Sold';
update public.properties set status = 'ว่าง'
  where status not in ('ว่าง', 'ติดจอง', 'PRM ปล่อยเช่า', 'เจ้าของปล่อยเอง');
alter table public.properties alter column status set default 'ว่าง';
alter table public.properties add constraint properties_status_check
  check (status in ('ว่าง', 'ติดจอง', 'PRM ปล่อยเช่า', 'เจ้าของปล่อยเอง'));

-- properties: rental start date, shown when status is PRM ปล่อยเช่า or
-- เจ้าของปล่อยเอง (both mean the unit is currently being rented out).
alter table public.properties add column if not exists rental_start_date date;

-- properties.tier: add Tier 4 ("ไม่ทำการตลาด" — not actively marketed).
alter table public.properties drop constraint if exists properties_tier_check;
alter table public.properties add constraint properties_tier_check
  check (tier in (1, 2, 3, 4));

-- ============================================================
-- lease_contracts: lessee ID card / bank book image attachments.
-- Stored in a PRIVATE bucket (unlike property-images) since these are
-- sensitive personal documents — object paths are saved on the contract
-- row, and pages request short-lived signed URLs on demand to view them
-- (see src/app/api/admin/leases/upload/route.ts).
-- ============================================================
alter table public.lease_contracts add column if not exists lessee_id_card_image text;
alter table public.lease_contracts add column if not exists lessee_bank_book_image text;

insert into storage.buckets (id, name, public)
values ('lease-documents', 'lease-documents', false)
on conflict (id) do nothing;

drop policy if exists "lease-documents: admins manage all" on storage.objects;
create policy "lease-documents: admins manage all" on storage.objects
  for all
  using (bucket_id = 'lease-documents' and public.is_admin())
  with check (bucket_id = 'lease-documents' and public.is_admin());

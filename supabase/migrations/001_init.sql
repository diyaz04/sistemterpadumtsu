-- Migration: 001_init.sql
-- Description: Inisialisasi skema tabel portal madrasah, RLS, trigger updated_at, storage bucket, dan seed data awal.

-- 1. Ekstensi UUID (bila belum aktif)
create extension if not exists "pgcrypto";

-- 2. Tabel Services (Daftar layanan / tautan website sekolah)
create table if not exists public.services (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    description text,
    url text not null,
    icon text not null,
    color text not null check (color in ('green', 'gold', 'blue', 'purple', 'teal', 'orange')),
    sort_order int not null default 0,
    is_active boolean not null default true,
    open_in_new_tab boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Index untuk performa pengurutan dan filter aktif
create index if not exists idx_services_sort_active on public.services(sort_order asc, is_active);

-- 3. Tabel Site Settings (Pengaturan teks dan aset portal, tepat satu baris)
create table if not exists public.site_settings (
    id int primary key default 1 check (id = 1),
    school_name text not null default 'MTs KH A. Wahab Muhsin',
    portal_title text not null default 'Portal Digital Madrasah',
    hero_badge text default 'Pusat Akses Layanan Digital Terpadu',
    hero_title text not null default 'Semua Layanan Sekolah,',
    hero_highlight text not null default 'Satu Portal.',
    hero_description text not null default 'Akses website utama, administrasi, keuangan, pembelajaran, dan informasi madrasah dengan lebih mudah.',
    tagline text default 'Membangun Madrasah yang Unggul, Terhubung, dan Berkarakter',
    footer_text text default 'Membangun Generasi Islami, Berakhlakul Karimah, dan Melek Teknologi.',
    logo_url text,
    hero_image_url text,
    highlights text[] default array['Terintegrasi', 'Mudah Diakses', 'Untuk Warga Madrasah'],
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 4. Tabel Admin Profiles (Hak akses admin mengacu ke auth.users)
create table if not exists public.admin_profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    role text not null default 'admin',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 5. Trigger Fungsi Auto-Update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

drop trigger if exists set_services_updated_at on public.services;
create trigger set_services_updated_at
    before update on public.services
    for each row
    execute function public.handle_updated_at();

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
    before update on public.site_settings
    for each row
    execute function public.handle_updated_at();

drop trigger if exists set_admin_profiles_updated_at on public.admin_profiles;
create trigger set_admin_profiles_updated_at
    before update on public.admin_profiles
    for each row
    execute function public.handle_updated_at();

-- 6. Helper Function untuk Cek Status Admin (Security Definer untuk hindari rekursi RLS)
create or replace function public.is_admin()
returns boolean as $$
begin
    return exists (
        select 1 from public.admin_profiles
        where id = auth.uid()
    );
end;
$$ language plpgsql security definer;

-- 7. Row Level Security (RLS)

-- RLS: public.services
alter table public.services enable row level security;

drop policy if exists "Services are viewable by everyone" on public.services;
create policy "Services are viewable by everyone"
    on public.services for select
    using (true);

drop policy if exists "Admins can insert services" on public.services;
create policy "Admins can insert services"
    on public.services for insert
    with check (public.is_admin());

drop policy if exists "Admins can update services" on public.services;
create policy "Admins can update services"
    on public.services for update
    using (public.is_admin())
    with check (public.is_admin());

drop policy if exists "Admins can delete services" on public.services;
create policy "Admins can delete services"
    on public.services for delete
    using (public.is_admin());

-- RLS: public.site_settings
alter table public.site_settings enable row level security;

drop policy if exists "Site settings are viewable by everyone" on public.site_settings;
create policy "Site settings are viewable by everyone"
    on public.site_settings for select
    using (true);

drop policy if exists "Admins can insert site settings" on public.site_settings;
create policy "Admins can insert site settings"
    on public.site_settings for insert
    with check (public.is_admin());

drop policy if exists "Admins can update site settings" on public.site_settings;
create policy "Admins can update site settings"
    on public.site_settings for update
    using (public.is_admin())
    with check (public.is_admin());

drop policy if exists "Admins can delete site settings" on public.site_settings;
create policy "Admins can delete site settings"
    on public.site_settings for delete
    using (public.is_admin());

-- RLS: public.admin_profiles
alter table public.admin_profiles enable row level security;

drop policy if exists "Admins can read own profile" on public.admin_profiles;
create policy "Admins can read own profile"
    on public.admin_profiles for select
    using (id = auth.uid());

drop policy if exists "Admins can update own profile" on public.admin_profiles;
create policy "Admins can update own profile"
    on public.admin_profiles for update
    using (id = auth.uid())
    with check (id = auth.uid());

-- 8. Storage Bucket 'portal-assets' (Logo dan Hero Image)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'portal-assets',
    'portal-assets',
    true,
    5242880, -- Batas ukuran 5 MB
    array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif']
)
on conflict (id) do update set
    public = true;

-- Storage RLS Policies
drop policy if exists "Public can view portal-assets" on storage.objects;
create policy "Public can view portal-assets"
    on storage.objects for select
    using (bucket_id = 'portal-assets');

drop policy if exists "Admins can upload to portal-assets" on storage.objects;
create policy "Admins can upload to portal-assets"
    on storage.objects for insert
    with check (
        bucket_id = 'portal-assets' and public.is_admin()
    );

drop policy if exists "Admins can update portal-assets" on storage.objects;
create policy "Admins can update portal-assets"
    on storage.objects for update
    using (
        bucket_id = 'portal-assets' and public.is_admin()
    )
    with check (
        bucket_id = 'portal-assets' and public.is_admin()
    );

drop policy if exists "Admins can delete from portal-assets" on storage.objects;
create policy "Admins can delete from portal-assets"
    on storage.objects for delete
    using (
        bucket_id = 'portal-assets' and public.is_admin()
    );

-- 9. Seed Data Awal
-- Seed Site Settings
insert into public.site_settings (
    id,
    school_name,
    portal_title,
    hero_badge,
    hero_title,
    hero_highlight,
    hero_description,
    tagline,
    footer_text,
    highlights
)
values (
    1,
    'MTs KH A. Wahab Muhsin',
    'Portal Digital Madrasah',
    'Pusat Akses Layanan Digital Terpadu',
    'Semua Layanan Sekolah,',
    'Satu Portal.',
    'Akses website utama, administrasi, keuangan, pembelajaran, dan informasi madrasah dengan lebih mudah.',
    'Membangun Madrasah yang Unggul, Terhubung, dan Berkarakter',
    'Membangun Generasi Islami, Berakhlakul Karimah, dan Melek Teknologi.',
    array['Terintegrasi', 'Mudah Diakses', 'Untuk Warga Madrasah']
)
on conflict (id) do update set
    school_name = excluded.school_name,
    portal_title = excluded.portal_title,
    hero_badge = excluded.hero_badge,
    hero_title = excluded.hero_title,
    hero_highlight = excluded.hero_highlight,
    hero_description = excluded.hero_description,
    tagline = excluded.tagline,
    footer_text = excluded.footer_text,
    highlights = excluded.highlights;

-- Seed 6 Layanan Awal
delete from public.services;

insert into public.services (
    title,
    description,
    url,
    icon,
    color,
    sort_order,
    is_active,
    open_in_new_tab
)
values
    (
        'Website Utama',
        'Profil, visi misi & informasi sekolah',
        'https://example.com',
        'Globe',
        'green',
        1,
        true,
        true
    ),
    (
        'Website Keuangan',
        'Transparansi dan layanan keuangan',
        'https://example.com',
        'Wallet',
        'gold',
        2,
        true,
        true
    ),
    (
        'Administrasi Guru',
        'Data guru dan administrasi',
        'https://example.com',
        'Users',
        'blue',
        3,
        true,
        true
    ),
    (
        'Perangkat Pembelajaran',
        'Modul ajar, ATP & perangkat',
        'https://example.com',
        'BookOpen',
        'purple',
        4,
        true,
        true
    ),
    (
        'Raport Program Unggulan',
        'Akses hasil belajar program unggulan',
        'https://example.com',
        'FileCheck',
        'teal',
        5,
        true,
        true
    ),
    (
        'Kabar MTs KH A. Wahab Muhsin',
        'Berita, agenda & kegiatan madrasah',
        'https://example.com',
        'Megaphone',
        'orange',
        6,
        true,
        true
    );

# 🌿 Portal Digital Madrasah - MTs KH A. Wahab Muhsin

> **Portal Layanan Terpadu & Ekosistem Digital MTs KH A. Wahab Muhsin, Sukahideng, Tasikmalaya.**  
> Landing page modern yang menghimpun seluruh tautan website madrasah, administrasi, keuangan, pembelajaran, serta sistem manajemen konten (CMS) administrator berbasis Next.js App Router dan Supabase.

---

## 🎨 Design System & Identitas Visual

* **Warna Utama:** Hijau Tua Madrasah (`#0F5C3A`) & Hijau Terang Aksen (`#16A34A`)
* **Warna Aksen:** Emas Berkarakter (`#C9A24B`) untuk garis dekoratif dan badge status
* **Background:** Putih bersih (`#FFFFFF`) dan abu-abu sangat muda (`#F8FAF9`) dengan dukungan Dark Mode (`next-themes`)
* **Tipografi:** Plus Jakarta Sans (`next/font/google`)
* **Dekorasi:** Pola SVG Geometri Islami samar pada header, banner hero, dan footer
* **Elemen Interaktif:** Kartu layanan dengan live hover translate, shadow bertahap, dan drag & drop reorder di panel admin

---

## 🚀 Fitur Unggulan

1. **Beranda Publik Terpadu:**
   * **Hero Section Dinamis:** Teks sorotan, badge kategori, dan kolom pencarian real-time dengan shortcut keyboard (`Ctrl + K`).
   * **Jelajahi Layanan Digital:** Grid kartu layanan responsif (1 kolom di mobile, 2 di tablet, 3 di desktop) dengan filter pencarian instan, skeleton loading, dan animasi bertahap (Framer Motion).
   * **Navigasi Responsif:** Navbar sticky dengan drawer mobile (Sheet), dropdown layanan, serta toggle tema gelap/terang.
   * **Informasi & Kontak:** Section profil mutu madrasah, pusat bantuan, dan tautan sosial madrasah.
   * **Aksesibilitas & SEO:** Metadata Open Graph dinamis, semantic HTML, rasio kontras WCAG, dan favicon resmi dari logo madrasah.
2. **Panel Administrator (`/admin`):**
   * **Autentikasi Aman:** Supabase Auth (Email & Password) diproteksi Middleware Next.js dan verifikasi tabel `admin_profiles`.
   * **Dashboard Ringkas:** Counter statistik layanan aktif vs nonaktif dan pintasan cepat.
   * **Kelola Layanan (`/admin/layanan`):** Tambah, ubah, hapus, switch status aktif langsung, dan drag & drop urutan kartu (`@dnd-kit`).
   * **Pengaturan Portal (`/admin/pengaturan`):** Edit nama sekolah, judul, deskripsi hero, poin highlight dinamis, serta upload logo dan ilustrasi hero ke Supabase Storage (`portal-assets`) dengan kompresi client-side otomatis.

---

## 🛠️ Tech Stack

* **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
* **Bahasa:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Database, Auth & Storage:** [Supabase](https://supabase.com/) (`@supabase/supabase-js`, `@supabase/ssr`)
* **Komponen & UI:** [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/), [Sonner](https://sonner.emilkowal.ski/)
* **Form & Validasi:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
* **Drag and Drop:** [@dnd-kit/core](https://dndkit.com/) & `@dnd-kit/sortable`
* **Animasi:** [Framer Motion](https://www.framer.com/motion/)

---

## 📦 Panduan Instalasi Lokal

### 1. Masuk ke Direktori Project
```bash
cd portal-madrasah
```

### 2. Pasang Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Salin file `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```

Buka `.env.local` dan isi kredensial Supabase Anda:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"

# Domain URL Produksi (Opsional untuk Open Graph Metadata)
NEXT_PUBLIC_SITE_URL="https://portal.mtswahabmuhsin.sch.id"
```

---

## 🗄️ Menjalankan Migration Supabase

File migrasi database tersedia di [`supabase/migrations/001_init.sql`](./supabase/migrations/001_init.sql).

### Langkah-langkah:
1. Buka [Supabase Dashboard](https://supabase.com/dashboard) dan pilih project Anda.
2. Di menu sidebar kiri, klik **SQL Editor**.
3. Klik tombol **New Query**.
4. Salin seluruh isi berkas `supabase/migrations/001_init.sql` dan tempelkan ke editor.
5. Klik tombol **Run** (atau tekan `Ctrl + Enter`).
6. Skrip ini akan secara otomatis membuat:
   * Tabel `services` lengkap dengan field urutan, warna, ikon, dan status aktif.
   * Tabel `site_settings` dengan data awal identitas MTs KH A. Wahab Muhsin.
   * Tabel `admin_profiles` untuk otorisasi hak akses admin.
   * Storage bucket `portal-assets` berstatus *public* dengan batas 5MB dan RLS admin.
   * Trigger auto-update `updated_at`.
   * Row Level Security (RLS): Baca publik untuk layanan & pengaturan; tulis/hapus hanya untuk admin.

---

## 👤 Cara Membuat Akun Admin Pertama

Sistem menerapkan validasi dua lapis: akun harus ada di **Supabase Auth** dan terdaftar di tabel **`admin_profiles`**.

### Langkah 1: Buat Pengguna di Supabase Auth
1. Di Supabase Dashboard, buka menu **Authentication** $\rightarrow$ **Users**.
2. Klik tombol **Add User** $\rightarrow$ **Create User**.
3. Masukkan:
   * **Email:** contoh `admin@mtswahabmuhsin.sch.id`
   * **Password:** masukkan password aman (minimal 8 karakter)
   * Centang **Auto Confirm User?** agar akun bisa langsung digunakan tanpa verifikasi email.
4. Klik **Create User**.
5. Setelah user muncul di daftar, salin **User UID** (berupa deretan string UUID, misal `a1b2c3d4-e5f6-7890-abcd-ef1234567890`).

### Langkah 2: Daftarkan UID ke Tabel `admin_profiles`
1. Buka kembali menu **SQL Editor** di Supabase Dashboard.
2. Jalankan perintah SQL berikut (ganti `'UID_USER_DARI_LANGKAH_1'` dengan UUID yang disalin tadi):
```sql
INSERT INTO admin_profiles (id, role)
VALUES ('UID_USER_DARI_LANGKAH_1', 'admin')
ON CONFLICT (id) DO NOTHING;
```
3. Klik **Run**.

### Langkah 3: Login ke Panel Admin
1. Jalankan aplikasi secara lokal (`npm run dev`) atau buka URL deploy Anda.
2. Akses halaman login di:
   ```
   http://localhost:3000/admin/login
   ```
   *(Atau klik ikon gembok kecil di bagian kanan footer website)*.
3. Masuk menggunakan email dan password yang baru saja dibuat. Anda akan langsung diarahkan ke **Dashboard Administrator** (`/admin`).

---

## 💻 Menjalankan Server Pengembangan

```bash
npm run dev
```

Buka peramban Anda di [http://localhost:3000](http://localhost:3000).

Untuk memeriksa kode (Linting & Build):
```bash
npm run lint
npm run build
```

---

## 🌐 Panduan Deploy ke Produksi

### Opsi A: Deploy ke Vercel (Disarankan)

1. **Push repositori** Anda ke GitHub / GitLab.
2. Buka [Vercel Dashboard](https://vercel.com/) dan klik **Add New** $\rightarrow$ **Project**.
3. Impor repositori project Anda.
4. Jika repositori berada di dalam subfolder, atur **Root Directory** ke `portal-madrasah`.
5. Pada bagian **Environment Variables**, tambahkan:
   * `NEXT_PUBLIC_SUPABASE_URL` = URL project Supabase Anda
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Anon Public Key Supabase Anda
   * `NEXT_PUBLIC_SITE_URL` = Domain produksi Anda (contoh `https://portal.mtswahabmuhsin.sch.id`)
6. Klik **Deploy**. Vercel akan otomatis membangun dan merilis aplikasi.

### Opsi B: Deploy ke Netlify

1. Buka [Netlify Dashboard](https://app.netlify.com/) dan pilih **Add new site** $\rightarrow$ **Import an existing project**.
2. Hubungkan dengan repositori GitHub Anda.
3. Atur build settings:
   * **Base directory:** `portal-madrasah` (jika menggunakan subfolder)
   * **Build command:** `npm run build`
   * **Publish directory:** `.next`
4. Di bagian **Site configuration** $\rightarrow$ **Environment variables**, tambahkan variabel:
   * `NEXT_PUBLIC_SUPABASE_URL`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   * `NEXT_PUBLIC_SITE_URL`
5. Pasang plugin `@netlify/plugin-nextjs` jika diminta, lalu klik **Deploy**.

---

### ⚠️ Pengaturan Wajib di Supabase Dashboard Setelah Deploy

Agar redirect autentikasi dan middleware Next.js berjalan tanpa kendala di domain produksi:
1. Buka Supabase Dashboard $\rightarrow$ **Authentication** $\rightarrow$ **URL Configuration**.
2. Ubah **Site URL** menjadi domain produksi Anda (misal `https://portal-madrasah.vercel.app` atau domain sekolah).
3. Tambahkan URL domain ke dalam **Redirect URLs**:
   * `https://portal-madrasah.vercel.app/**`
   * `http://localhost:3000/**` (untuk pengujian lokal)
4. Klik **Save**.

---

## 📁 Struktur Berkas Utama

```
portal-madrasah/
├── public/
│   ├── logo.png                # Logo resmi MTs KH A. Wahab Muhsin
│   └── patterns/
│       └── islamic-pattern.svg # Pola SVG geometri islami
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── layanan/        # Manajemen CRUD & Drag-and-Drop Layanan
│   │   │   ├── login/          # Halaman Login Admin
│   │   │   ├── pengaturan/     # Form Pengaturan Teks & Upload Aset
│   │   │   ├── layout.tsx      # Sidebar & Header Navigasi Admin
│   │   │   └── page.tsx        # Dashboard Ringkas Statistik Layanan
│   │   ├── error.tsx           # Error Boundary bertema Islami Modern
│   │   ├── icon.png            # Favicon otomatis Next.js
│   │   ├── layout.tsx          # Root Layout & Metadata SEO Dinamis
│   │   ├── loading.tsx         # Skeleton Loading State Beranda
│   │   ├── not-found.tsx       # Halaman 404 Khas Madrasah
│   │   └── page.tsx            # Landing Page Utama Publik
│   ├── components/
│   │   ├── admin/              # Komponen Panel Admin & Dialog Form
│   │   ├── home/               # Hero & ServiceGrid Layanan Digital
│   │   ├── layout/             # Navbar, Footer, & ThemeToggle
│   │   └── ui/                 # Shadcn Primitives & ServiceIcon
│   ├── context/
│   │   └── search-context.tsx  # State pencarian global (Ctrl + K)
│   ├── lib/
│   │   ├── actions/            # Next.js Server Actions (Services & Settings)
│   │   ├── supabase/           # Client, Server, & Public Fetch Helpers
│   │   └── validations/        # Skema Zod
│   └── types/
│       └── index.ts            # Definisi TypeScript
└── supabase/
    └── migrations/
        └── 001_init.sql        # Skrip Inisialisasi Database, RLS, & Bucket
```

---

## 📜 Hak Cipta & Lisensi

Dikembangkan untuk **MTs KH A. Wahab Muhsin**, Pondok Pesantren Sukahideng, Sukarame, Kabupaten Tasikmalaya, Jawa Barat.  
Hak Cipta © 2026 Seluruh Hak Dilindungi.

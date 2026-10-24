import Link from "next/link";
import {
  Layers,
  Settings,
  ExternalLink,
  PlusCircle,
  CheckCircle2,
  XCircle,
  Globe,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { getServices, getSiteSettings } from "@/lib/supabase/data";
import { buttonVariants } from "@/components/ui/button";
import { ServiceIcon } from "@/components/ui/service-icon";

export const revalidate = 0; // Data realtime di panel admin

export const metadata = {
  title: "Dashboard Administrator | Portal Madrasah",
  description: "Ringkasan layanan madrasah dan pintasan manajemen portal.",
};

export default async function AdminDashboardPage() {
  const [settings, services] = await Promise.all([
    getSiteSettings(),
    getServices(),
  ]);

  const activeServices = services.filter((s) => s.is_active);
  const inactiveServices = services.filter((s) => !s.is_active);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0F5C3A] via-[#126b44] to-[#16A34A] text-white p-6 sm:p-8 shadow-xl shadow-emerald-950/15 overflow-hidden">
        <div className="absolute inset-0 bg-islamic-pattern opacity-10 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold tracking-wider uppercase mb-3 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A24B]" />
              Panel Pengelola Portal Digital
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {settings.school_name}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Ringkasan status ekosistem portal digital. Kelola tautan layanan,
              ubah teks landing page, serta atur media sekolah secara terpadu.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className:
                  "rounded-full bg-white text-[#0F5C3A] hover:bg-emerald-50 border-white text-xs font-bold shadow-sm",
              })}
            >
              <Globe className="w-4 h-4 mr-1.5" />
              Buka Beranda Publik
              <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
            </Link>
          </div>
        </div>
      </div>

      {/* Statistik Ringkas: Aktif, Nonaktif, Total */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
          Ringkasan Layanan Sekolah
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {/* Layanan Aktif */}
          <div className="card-madrasah p-5 sm:p-6 bg-white dark:bg-[#0D2218] border-l-4 border-l-[#16A34A]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Layanan Aktif
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-[#0F5C3A] dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#0F5C3A] dark:text-emerald-300">
                {activeServices.length}
              </span>
              <span className="text-xs text-muted-foreground">Website Tayang</span>
            </div>
            <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
              Tampil di landing page utama
            </p>
          </div>

          {/* Layanan Nonaktif */}
          <div className="card-madrasah p-5 sm:p-6 bg-white dark:bg-[#0D2218] border-l-4 border-l-amber-500">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Layanan Nonaktif
              </span>
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-foreground">
                {inactiveServices.length}
              </span>
              <span className="text-xs text-muted-foreground">Disembunyikan</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Tidak ditampilkan ke publik
            </p>
          </div>

          {/* Total Layanan */}
          <div className="card-madrasah p-5 sm:p-6 bg-white dark:bg-[#0D2218] border-l-4 border-l-[#0F5C3A]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Total Layanan Terdaftar
              </span>
              <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-foreground">
                {services.length}
              </span>
              <span className="text-xs text-muted-foreground">Total Layanan</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Tersimpan di basis data Supabase
            </p>
          </div>
        </div>
      </div>

      {/* Pintasan Utama / Shortcut Menuju Kelola Layanan & Pengaturan */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
          Pintasan Navigasi Cepat
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Shortcut 1: Kelola Layanan */}
          <Link
            href="/admin/layanan"
            className="group card-madrasah p-6 bg-white dark:bg-[#0D2218] hover:border-[#16A34A] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-emerald-700/20 text-[#0F5C3A] dark:text-emerald-300 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-foreground group-hover:text-[#0F5C3A] dark:group-hover:text-emerald-300 transition-colors">
                Kelola Daftar Layanan
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
                Tambah website baru, edit URL, atur icon & warna gradasi, ubah urutan dengan drag & drop, serta aktifkan atau nonaktifkan layanan.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs font-bold text-[#0F5C3A] dark:text-emerald-400">
              <span>Buka Kelola Layanan ({services.length} terdaftar)</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Shortcut 2: Pengaturan Portal */}
          <Link
            href="/admin/pengaturan"
            className="group card-madrasah p-6 bg-white dark:bg-[#0D2218] hover:border-[#C9A24B] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/15 to-amber-700/20 text-[#C9A24B] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Settings className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-foreground group-hover:text-[#C9A24B] transition-colors">
                Pengaturan Portal Madrasah
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
                Ubah identitas madrasah, judul hero, kata sorotan hijau, deskripsi, poin highlight, tagline footer, serta unggah logo & gambar hero.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs font-bold text-[#C9A24B] dark:text-amber-400">
              <span>Buka Pengaturan Portal</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Sekilas Daftar Layanan */}
      <div className="card-madrasah p-6 bg-white dark:bg-[#0D2218]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-foreground">
              Sekilas Daftar Layanan Digital
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Urutan dan status tayang link website yang terdaftar saat ini.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/layanan"
              className={buttonVariants({
                variant: "gradient",
                size: "sm",
                className: "rounded-full gap-1.5 text-xs font-bold",
              })}
            >
              <PlusCircle className="w-4 h-4 mr-1" />
              Kelola & Tambah Layanan
            </Link>
          </div>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground text-xs">
            Belum ada layanan yang terdaftar. Klik &quot;Kelola & Tambah Layanan&quot; untuk menambahkan website pertama.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {services.map((item, index) => (
              <div
                key={item.id}
                className="py-3 flex items-center justify-between gap-4 hover:bg-muted/30 px-3 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="text-xs font-bold text-muted-foreground w-5 text-center shrink-0">
                    #{index + 1}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 text-[#0F5C3A] dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <ServiceIcon name={item.icon} className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.url}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      item.is_active
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                    }`}
                  >
                    {item.is_active ? "Aktif" : "Nonaktif"}
                  </span>
                  <Link
                    href={item.url}
                    target="_blank"
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                    title="Buka link website"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import Link from "next/link";
import { ArrowLeft, Sliders, ShieldCheck } from "lucide-react";
import { getSiteSettings } from "@/lib/supabase/data";
import { SettingsForm } from "@/components/admin/settings/settings-form";

export const revalidate = 0; // Selalu ambil pengaturan terbaru di admin

export const metadata = {
  title: "Pengaturan Portal | Admin Portal Madrasah",
  description: "Kelola teks, identitas sekolah, highlight, logo, dan hero image portal madrasah.",
};

export default async function AdminPengaturanPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Dashboard
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-[#0F5C3A] dark:text-emerald-400 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F5C3A] dark:text-emerald-300 tracking-tight">
                Pengaturan Portal Madrasah
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Sesuaikan identitas, banner hero, poin highlight, serta logo & gambar beranda.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-medium text-emerald-800 dark:text-emerald-300">
          <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
          <span>Tersimpan di Supabase Realtime</span>
        </div>
      </div>

      {/* Formulir Pengaturan */}
      <SettingsForm initialSettings={settings} />
    </div>
  );
}

import * as React from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { CurrentYear } from "./current-year";
import type { SiteSettings } from "@/types";

interface FooterProps {
  settings: SiteSettings;
}

export function Footer({ settings }: FooterProps) {
  return (
    <footer className="relative bg-[#0F5C3A] dark:bg-[#071810] text-emerald-50 border-t border-emerald-800/40 overflow-hidden">
      {/* Pola Islami Samar Sebagai Latar Belakang */}
      <div className="absolute inset-0 opacity-8 dark:opacity-5 bg-islamic-pattern pointer-events-none" />

      {/* Garis Aksen Emas di Bagian Paling Atas Footer */}
      <div className="gold-line" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          {/* Kiri: Hak Cipta & Nama Madrasah */}
          <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-emerald-100/90 font-medium">
            <span>©</span>
            <CurrentYear fallback="2026" />
            <span className="hidden sm:inline">•</span>
            <span className="font-semibold text-white">
              {settings.school_name || "MTs KH A. Wahab Muhsin"}
            </span>
          </div>

          {/* Tengah: Tagline Italic */}
          <div className="max-w-md px-2">
            <p className="text-xs sm:text-sm italic text-emerald-200/90 font-light leading-relaxed">
              &ldquo;{settings.tagline || "Membangun Madrasah yang Unggul, Terhubung, dan Berkarakter"}&rdquo;
            </p>
          </div>

          {/* Kanan: Indikator Titik Hijau Berkedip + Status Sistem + Link Admin Tersembunyi */}
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-emerald-900/60 dark:bg-emerald-950/80 border border-emerald-600/30 text-xs font-semibold text-emerald-100 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
              <span className="tracking-wide">Sistem Portal Aktif</span>
            </div>

            {/* Link Kecil Tersembunyi Menuju /admin/login */}
            <Link
              href="/admin/login"
              className="p-1.5 rounded-full text-emerald-100/30 hover:text-white hover:bg-emerald-800/40 transition-all opacity-40 hover:opacity-100"
              title="Akses Admin"
              aria-label="Login Admin Portal"
            >
              <Lock className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

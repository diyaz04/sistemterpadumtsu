"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Search,
  ShieldCheck,
  Sparkles,
  GraduationCap,
  FileText,
  TrendingUp,
  School,
  X,
} from "lucide-react";
import { useSearch } from "@/context/search-context";
import type { SiteSettings } from "@/types";

interface HeroProps {
  settings: SiteSettings;
}

export function Hero({ settings }: HeroProps) {
  const { searchQuery, setSearchQuery, searchInputRef } = useSearch();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const element = document.getElementById("layanan");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const highlights =
    settings.highlights && settings.highlights.length > 0
      ? settings.highlights
      : ["Terintegrasi", "Mudah Diakses", "Untuk Warga Madrasah"];

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 bg-gradient-to-b from-white via-emerald-50/40 to-white dark:from-[#081710] dark:via-[#0c2317] dark:to-[#081710] transition-colors">
      {/* Pola Geometri Islami Tipis */}
      <div className="absolute inset-0 bg-islamic-pattern opacity-40 dark:opacity-15 pointer-events-none" />

      {/* Ornamen Gelombang Hijau-Emas di Kiri Bawah (SVG) */}
      <svg
        className="absolute bottom-0 left-0 w-64 sm:w-96 h-auto pointer-events-none opacity-40 dark:opacity-20 z-0"
        viewBox="0 0 350 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M-50 220 C80 180, 150 120, 220 220 Z"
          fill="url(#wave-gradient-green)"
        />
        <path
          d="M-30 220 C70 190, 130 160, 260 220 Z"
          stroke="#C9A24B"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        <defs>
          <linearGradient id="wave-gradient-green" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0F5C3A" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#16A34A" stopOpacity="0.05" />
          </linearGradient>
        </defs>
      </svg>

      {/* Ornamen Gelombang Hijau-Emas di Kanan Bawah (SVG) */}
      <svg
        className="absolute bottom-0 right-0 w-64 sm:w-96 h-auto pointer-events-none opacity-40 dark:opacity-20 z-0"
        viewBox="0 0 350 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M400 220 C270 170, 200 130, 130 220 Z"
          fill="url(#wave-gradient-gold)"
        />
        <path
          d="M380 220 C280 185, 220 170, 90 220 Z"
          stroke="#0F5C3A"
          strokeWidth="1.5"
        />
        <defs>
          <linearGradient id="wave-gradient-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#C9A24B" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#16A34A" stopOpacity="0.05" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* ==================== KOLOM KIRI ==================== */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Badge Kecil Rounded-Full */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs font-semibold tracking-wider uppercase mb-5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A24B] animate-pulse" />
              <span>{settings.hero_badge || "EKOSISTEM DIGITAL MADRASAH"}</span>
            </div>

            {/* Heading Besar Bold */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.15]">
              <span className="block text-[#0F5C3A] dark:text-emerald-200">
                {settings.hero_title || "Semua Layanan Sekolah,"}
              </span>
              <span className="block text-[#0F5C3A] dark:text-emerald-200 mt-1">
                dalam{" "}
                <span className="text-[#16A34A] dark:text-emerald-400">
                  {settings.hero_highlight || "Satu Portal."}
                </span>
              </span>
            </h1>

            {/* Paragraf Deskripsi */}
            <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
              {settings.hero_description ||
                "Akses website utama, administrasi, keuangan, pembelajaran, dan informasi madrasah dengan lebih mudah."}
            </p>

            {/* Search Bar Besar Rounded-Full */}
            <form
              onSubmit={handleSearchSubmit}
              className="mt-8 w-full max-w-xl relative flex items-center group"
            >
              <div className="absolute left-4 pointer-events-none text-emerald-700 dark:text-emerald-400">
                <Search className="w-5 h-5 transition-transform duration-200 group-focus-within:scale-110" />
              </div>

              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari layanan yang kamu butuhkan..."
                className="w-full h-14 pl-12 pr-28 rounded-full bg-white dark:bg-[#0D2218] border-2 border-emerald-200 dark:border-emerald-900/80 text-foreground placeholder:text-muted-foreground/70 text-sm sm:text-base font-medium shadow-md shadow-emerald-900/5 focus:outline-none focus:border-[#16A34A] focus:ring-4 focus:ring-emerald-500/15 transition-all"
                aria-label="Cari layanan"
              />

              <div className="absolute right-3 flex items-center gap-1.5">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    aria-label="Hapus pencarian"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <kbd
                  onClick={() => searchInputRef.current?.focus()}
                  className="hidden sm:inline-flex items-center gap-0.5 px-2.5 py-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 rounded-full border border-emerald-200 dark:border-emerald-800/80 shadow-xs cursor-pointer select-none"
                  title="Tekan Ctrl + K untuk mencari"
                >
                  Ctrl + K
                </kbd>
              </div>
            </form>

            {/* 3 Poin Highlights dengan Icon Shield Hijau */}
            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-4 text-xs sm:text-sm font-medium text-emerald-900 dark:text-emerald-200">
              {highlights.map((point, index) => (
                <React.Fragment key={point}>
                  <div className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#16A34A] shrink-0" />
                    <span>{point}</span>
                  </div>
                  {index < highlights.length - 1 && (
                    <span className="text-[#C9A24B] hidden sm:inline">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* ==================== KOLOM KANAN ==================== */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Ambient Backlight Glow */}
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-emerald-400/20 via-[#16A34A]/15 to-[#C9A24B]/15 blur-3xl pointer-events-none" />

            {/* Main Visual Container */}
            <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-br from-emerald-100/60 via-white/80 to-emerald-50/50 dark:from-[#0D2218] dark:via-[#091C12] dark:to-[#07170E] border-2 border-emerald-200/70 dark:border-emerald-800/60 shadow-2xl shadow-emerald-900/10 p-6 flex flex-col items-center justify-center overflow-hidden">
              {/* Pattern Background Dalam Frame */}
              <div className="absolute inset-0 bg-islamic-pattern opacity-30 pointer-events-none" />

              {settings.hero_image_url ? (
                <div className="relative w-full h-full rounded-2xl overflow-hidden">
                  <Image
                    src={settings.hero_image_url}
                    alt={`Ilustrasi ${settings.school_name}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 480px"
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                /* Fallback Hero Card: Logo Madrasah Resmi & Ornamen */
                <div className="relative z-10 flex flex-col items-center text-center p-6">
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gradient-to-br from-[#0F5C3A] via-[#16A34A] to-[#C9A24B] p-1 shadow-xl shadow-emerald-950/20 mb-5 group">
                    <div className="relative w-full h-full rounded-full overflow-hidden">
                      <Image
                        src={settings.logo_url || "/logo.png"}
                        alt={`Logo Resmi ${settings.school_name}`}
                        fill
                        sizes="(max-width: 640px) 112px, 128px"
                        priority
                        className="object-cover rounded-full"
                      />
                    </div>
                  </div>

                  <span className="text-xs uppercase tracking-widest font-bold text-[#C9A24B]">
                    PUSAT LAYANAN TERPADU
                  </span>
                  <h3 className="mt-2 text-xl font-extrabold text-[#0F5C3A] dark:text-emerald-300">
                    {settings.school_name}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2 max-w-xs">
                    Mewujudkan ekosistem digital madrasah yang mandiri, adaptif,
                    dan berdaya saing global.
                  </p>

                  <div className="mt-6 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/70 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-ping" />
                    Portal Terbuka 24/7
                  </div>
                </div>
              )}

              {/* Floating Badge 1: Topi Wisuda (Top-Left) */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                }}
                className="absolute -top-2 left-2 sm:-top-3 sm:left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white dark:bg-[#0D2218] border border-emerald-200 dark:border-emerald-800/80 shadow-lg"
              >
                <div className="p-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-foreground">
                  Akademik
                </span>
              </motion.div>

              {/* Floating Badge 2: Dokumen (Top-Right) */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 4.5,
                  delay: 0.5,
                  ease: "easeInOut",
                }}
                className="absolute top-6 right-1 sm:top-8 sm:-right-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white dark:bg-[#0D2218] border border-amber-200 dark:border-amber-800/80 shadow-lg"
              >
                <div className="p-1.5 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-foreground">
                  Administrasi
                </span>
              </motion.div>

              {/* Floating Badge 3: Grafik Keuangan (Bottom-Left) */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 5,
                  delay: 1,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-2 left-3 sm:-bottom-3 sm:left-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white dark:bg-[#0D2218] border border-teal-200 dark:border-teal-800/80 shadow-lg"
              >
                <div className="p-1.5 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-foreground">
                  Transparan
                </span>
              </motion.div>

              {/* Floating Badge 4: Gedung Madrasah (Bottom-Right) */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 4.2,
                  delay: 1.5,
                  ease: "easeInOut",
                }}
                className="absolute bottom-4 right-1 sm:bottom-6 sm:-right-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white dark:bg-[#0D2218] border border-emerald-200 dark:border-emerald-800/80 shadow-lg"
              >
                <div className="p-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                  <School className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-foreground">
                  Layanan Santri
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

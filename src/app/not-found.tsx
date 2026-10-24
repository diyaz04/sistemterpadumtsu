import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Home, Compass, School } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "404 - Halaman Tidak Ditemukan | Portal Madrasah",
  description: "Halaman yang Anda tuju tidak ditemukan pada Portal Digital MTs KH A. Wahab Muhsin.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white via-emerald-50/40 to-white dark:from-[#081710] dark:via-[#0c2317] dark:to-[#081710] px-4 py-12 relative overflow-hidden text-foreground">
      {/* Pattern Islami Samar */}
      <div className="absolute inset-0 bg-islamic-pattern opacity-25 pointer-events-none" />

      {/* Dekorasi Garis Emas */}
      <div className="fixed top-0 left-0 right-0 gold-line" />

      <div className="relative z-10 w-full max-w-lg card-madrasah p-8 sm:p-10 bg-card border-2 border-emerald-100 dark:border-emerald-900/60 shadow-2xl text-center">
        {/* Logo Resmi Madrasah */}
        <div className="mx-auto relative w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-[#0F5C3A] via-[#16A34A] to-[#C9A24B] p-1 shadow-xl shadow-emerald-950/20 mb-6">
          <div className="relative w-full h-full rounded-full overflow-hidden">
            <Image
              src="/logo.png"
              alt="Logo MTs KH A. Wahab Muhsin"
              fill
              sizes="80px"
              priority
              className="object-cover rounded-full"
            />
          </div>
        </div>

        {/* 404 Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100/70 dark:bg-emerald-900/60 text-[#0F5C3A] dark:text-emerald-300 text-xs font-extrabold tracking-wider mb-3">
          <span>KODE STATUS 404</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F5C3A] dark:text-emerald-300 tracking-tight">
          Halaman Tidak Ditemukan
        </h1>

        <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Tautan yang Anda tuju mungkin salah ketik, telah dinonaktifkan, atau
          belum tersedia di ekosistem portal digital madrasah.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className={buttonVariants({
              variant: "gradient",
              size: "lg",
              className:
                "w-full sm:w-auto rounded-full gap-2 shadow-md shadow-emerald-950/20",
            })}
          >
            <Home className="w-4 h-4" />
            Kembali ke Beranda
          </Link>

          <Link
            href="/#layanan"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className:
                "w-full sm:w-auto rounded-full gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/50",
            })}
          >
            <Compass className="w-4 h-4" />
            Jelajahi Layanan
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <School className="w-4 h-4 text-[#C9A24B]" />
          <span>MTs KH A. Wahab Muhsin - Sukahideng Tasikmalaya</span>
        </div>
      </div>
    </div>
  );
}

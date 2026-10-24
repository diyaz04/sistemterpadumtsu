"use client";

import * as React from "react";
import Link from "next/link";
import { RotateCcw, Home, AlertTriangle, ShieldAlert } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log error secara aman
    console.error("Portal Madrasah Runtime Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white via-emerald-50/40 to-white dark:from-[#081710] dark:via-[#0c2317] dark:to-[#081710] px-4 py-12 relative overflow-hidden text-foreground">
      {/* Pattern Islami Samar */}
      <div className="absolute inset-0 bg-islamic-pattern opacity-25 pointer-events-none" />

      {/* Dekorasi Garis Emas di Atas */}
      <div className="fixed top-0 left-0 right-0 gold-line" />

      <div className="relative z-10 w-full max-w-lg card-madrasah p-8 sm:p-10 bg-card border-2 border-emerald-100 dark:border-emerald-900/60 shadow-2xl text-center">
        {/* Logo / Icon Alert */}
        <div className="mx-auto relative w-20 h-20 rounded-3xl overflow-hidden bg-gradient-to-br from-amber-500/20 via-emerald-600/20 to-[#0F5C3A]/30 p-1 flex items-center justify-center mb-6 shadow-lg shadow-emerald-950/15">
          <div className="relative w-full h-full rounded-[22px] bg-white dark:bg-[#0A1F14] flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-amber-600 dark:text-amber-400" />
          </div>
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-[#C9A24B]">
          TERJADI KENDALA SISTEM
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F5C3A] dark:text-emerald-300 mt-2">
          Halaman Mengalami Gangguan
        </h1>

        <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Mohon maaf, terjadi kendala saat memuat data portal madrasah. Silakan
          tekan tombol muat ulang untuk mencoba kembali.
        </p>

        {process.env.NODE_ENV === "development" && error.message && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 text-left text-xs text-red-700 dark:text-red-300 font-mono break-all max-h-32 overflow-y-auto">
            {error.message}
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => reset()}
            variant="gradient"
            size="lg"
            className="w-full sm:w-auto rounded-full gap-2 shadow-md shadow-emerald-950/20"
          >
            <RotateCcw className="w-4 h-4" />
            Coba Muat Ulang
          </Button>

          <Link
            href="/"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className:
                "w-full sm:w-auto rounded-full gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/50",
            })}
          >
            <Home className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldAlert className="w-4 h-4 text-[#16A34A]" />
          <span>MTs KH A. Wahab Muhsin - Sukahideng Tasikmalaya</span>
        </div>
      </div>
    </div>
  );
}

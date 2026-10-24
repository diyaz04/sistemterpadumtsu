"use client";

import * as React from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Sparkles, SearchX, RotateCcw } from "lucide-react";
import { ServiceCard, ServiceCardSkeleton } from "./ServiceCard";
import { Button } from "@/components/ui/button";
import { useSearch } from "@/context/search-context";
import type { Service } from "@/types";

interface ServiceGridProps {
  services: Service[];
  isLoading?: boolean;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export function ServiceGrid({ services, isLoading = false }: ServiceGridProps) {
  const { searchQuery, setSearchQuery } = useSearch();

  const filteredServices = React.useMemo(() => {
    if (!searchQuery.trim()) return services;
    const q = searchQuery.toLowerCase().trim();
    return services.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        (s.description && s.description.toLowerCase().includes(q))
    );
  }, [services, searchQuery]);

  return (
    <section
      id="layanan"
      className="section-madrasah py-16 sm:py-24 border-t border-emerald-100/70 dark:border-emerald-950/70 scroll-mt-20 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading Tengah dengan Ornamen Garis Emas Kiri-Kanan */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-[2px] w-12 sm:w-16 bg-gradient-to-r from-transparent to-[#C9A24B]" />
            <div className="w-7 h-7 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 flex items-center justify-center text-[#C9A24B]">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div className="h-[2px] w-12 sm:w-16 bg-gradient-to-l from-transparent to-[#C9A24B]" />
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F5C3A] dark:text-emerald-300 tracking-tight">
            Jelajahi Layanan Digital
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-muted-foreground">
            Pilih layanan sesuai kebutuhan Anda
          </p>

          {/* Indikator Pencarian Aktif */}
          {searchQuery && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 text-xs font-semibold shadow-xs"
            >
              <span>
                Menampilkan <strong>{filteredServices.length}</strong> layanan untuk
                kata kunci &ldquo;{searchQuery}&rdquo;
              </span>
              <button
                onClick={() => setSearchQuery("")}
                className="underline font-bold hover:text-emerald-950 dark:hover:text-white cursor-pointer ml-1"
                aria-label="Reset pencarian"
              >
                Reset
              </button>
            </motion.div>
          )}
        </div>

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ServiceCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredServices.length > 0 ? (
          /* Grid Kartu: 3 kolom desktop, 2 tablet, 1 mobile */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredServices.map((service) => (
                <motion.div
                  key={service.id}
                  variants={itemVariants}
                  layout
                  transition={{ duration: 0.3 }}
                >
                  <ServiceCard service={service} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Empty State "Layanan tidak ditemukan" */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-12 text-center bg-card rounded-2xl border border-dashed border-emerald-200 dark:border-emerald-900/60 max-w-md mx-auto shadow-xs"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-muted-foreground mb-4">
              <SearchX className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              Layanan Tidak Ditemukan
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Tidak ada layanan yang sesuai dengan pencarian &ldquo;{searchQuery}&rdquo;.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchQuery("")}
              className="mt-6 rounded-full gap-2 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Tampilkan Semua Layanan
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export function ServiceGridSkeleton() {
  return (
    <section className="section-madrasah py-16 sm:py-24 border-t border-emerald-100/70 dark:border-emerald-950/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-md mx-auto mb-12 space-y-3">
          <div className="h-6 w-32 mx-auto rounded-full bg-muted animate-pulse" />
          <div className="h-8 w-64 mx-auto rounded-lg bg-muted animate-pulse" />
          <div className="h-4 w-48 mx-auto rounded-md bg-muted animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ServiceCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

import * as React from "react";
import { ServiceCardSkeleton } from "@/components/home/ServiceCard";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground animate-pulse">
      {/* Top Gold Line */}
      <div className="gold-line" />

      {/* Header Skeleton */}
      <header className="sticky top-0 z-40 w-full border-b border-emerald-100/70 dark:border-emerald-950/70 bg-white/90 dark:bg-[#081710]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50" />
            <div className="space-y-2">
              <div className="w-32 h-3 rounded-full bg-emerald-100/80 dark:bg-emerald-900/40" />
              <div className="w-48 h-4 rounded-full bg-emerald-200/80 dark:bg-emerald-800/50" />
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <div className="w-16 h-4 rounded-full bg-muted" />
            <div className="w-20 h-4 rounded-full bg-muted" />
            <div className="w-32 h-10 rounded-full bg-emerald-200/60 dark:bg-emerald-900/40" />
          </div>
        </div>
      </header>

      {/* Hero Skeleton */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 bg-gradient-to-b from-white via-emerald-50/30 to-white dark:from-[#081710] dark:via-[#0c2317] dark:to-[#081710]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="w-48 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/50" />
                <div className="space-y-3">
                  <div className="w-3/4 h-10 sm:h-14 rounded-2xl bg-emerald-200/70 dark:bg-emerald-800/40" />
                  <div className="w-1/2 h-10 sm:h-14 rounded-2xl bg-emerald-300/70 dark:bg-emerald-700/40" />
                </div>
                <div className="w-5/6 h-5 rounded-full bg-muted" />
                <div className="w-full max-w-xl h-14 rounded-full bg-emerald-100/60 dark:bg-emerald-900/40" />
                <div className="flex gap-4 pt-2">
                  <div className="w-28 h-5 rounded-full bg-muted" />
                  <div className="w-28 h-5 rounded-full bg-muted" />
                  <div className="w-36 h-5 rounded-full bg-muted" />
                </div>
              </div>

              <div className="lg:col-span-5 flex items-center justify-center">
                <div className="w-72 sm:w-80 h-72 sm:h-80 rounded-3xl bg-emerald-100/50 dark:bg-emerald-900/30 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-emerald-200/70 dark:bg-emerald-800/50" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid Skeleton */}
        <section className="py-16 sm:py-20 bg-section relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
              <div className="w-32 h-4 mx-auto rounded-full bg-amber-100 dark:bg-amber-900/40" />
              <div className="w-64 h-8 mx-auto rounded-full bg-emerald-200/70 dark:bg-emerald-800/40" />
              <div className="w-48 h-4 mx-auto rounded-full bg-muted" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <ServiceCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer Skeleton */}
      <footer className="h-20 bg-[#0F5C3A] dark:bg-[#071810]" />
    </div>
  );
}

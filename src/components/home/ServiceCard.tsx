"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ServiceIcon } from "@/components/ui/service-icon";
import { cn } from "@/lib/utils";
import type { Service, ServiceColor } from "@/types";

interface ServiceCardProps {
  service: Service;
  className?: string;
}

const COLOR_GRADIENTS: Record<
  ServiceColor,
  {
    gradient: string;
    shadow: string;
  }
> = {
  green: {
    gradient: "from-[#0F5C3A] to-[#16A34A]",
    shadow: "shadow-emerald-900/20",
  },
  gold: {
    gradient: "from-[#B38E38] to-[#E3C273]",
    shadow: "shadow-amber-900/20",
  },
  blue: {
    gradient: "from-blue-600 to-sky-400",
    shadow: "shadow-sky-900/20",
  },
  purple: {
    gradient: "from-purple-700 to-indigo-500",
    shadow: "shadow-purple-900/20",
  },
  teal: {
    gradient: "from-teal-700 to-emerald-400",
    shadow: "shadow-teal-900/20",
  },
  orange: {
    gradient: "from-amber-600 to-orange-500",
    shadow: "shadow-orange-900/20",
  },
};

export function ServiceCard({ service, className }: ServiceCardProps) {
  const colorConfig =
    COLOR_GRADIENTS[service.color] || COLOR_GRADIENTS.green;

  return (
    <Link
      href={service.url}
      target={service.open_in_new_tab ? "_blank" : undefined}
      rel={service.open_in_new_tab ? "noopener noreferrer" : undefined}
      className={cn(
        "group relative flex items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-card border border-emerald-100/90 dark:border-emerald-900/60 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-900/10 hover:border-emerald-300 dark:hover:border-emerald-700/60 cursor-pointer overflow-hidden",
        className
      )}
    >
      {/* Background Accent Subtle Glow saat Hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/0 to-emerald-500/5 dark:to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Kiri: Kotak Icon Rounded-xl 56px dengan Gradasi */}
      <div
        className={cn(
          "w-14 h-14 min-w-[56px] min-h-[56px] rounded-xl flex items-center justify-center text-white shadow-md transition-transform duration-300 group-hover:scale-105 bg-gradient-to-br shrink-0",
          colorConfig.gradient,
          colorConfig.shadow
        )}
      >
        <ServiceIcon name={service.icon} className="w-7 h-7" />
      </div>

      {/* Tengah: Judul Bold + Deskripsi Abu Kecil */}
      <div className="flex-1 min-w-0 pr-1">
        <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-[#0F5C3A] dark:group-hover:text-emerald-300 transition-colors line-clamp-1">
          {service.title}
        </h3>
        {service.description && (
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
            {service.description}
          </p>
        )}
      </div>

      {/* Kanan: Tombol Bulat Kecil Berisi Panah */}
      <div className="w-9 h-9 min-w-[36px] rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#0F5C3A] dark:text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900/50 group-hover:bg-[#0F5C3A] group-hover:text-white dark:group-hover:bg-[#16A34A] transition-all duration-300 shadow-xs">
        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

// Skeleton Loading Component
export function ServiceCardSkeleton() {
  return (
    <div className="flex items-center gap-4 p-5 sm:p-6 rounded-2xl bg-card border border-emerald-100/70 dark:border-emerald-900/40 animate-pulse">
      <div className="w-14 h-14 min-w-[56px] min-h-[56px] rounded-xl bg-emerald-100/60 dark:bg-emerald-900/40" />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="h-5 w-3/4 rounded-md bg-emerald-100/70 dark:bg-emerald-900/50" />
        <div className="h-3.5 w-full rounded-md bg-muted" />
      </div>
      <div className="w-9 h-9 min-w-[36px] rounded-full bg-emerald-100/50 dark:bg-emerald-900/30" />
    </div>
  );
}

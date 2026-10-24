"use client";

import * as React from "react";
import { PortalCard } from "./portal-card";
import { ServiceIcon } from "@/components/ui/service-icon";
import { Button } from "@/components/ui/button";
import { useSearch } from "@/context/search-context";
import { SearchX, RotateCcw } from "lucide-react";
import type { Service } from "@/types";

interface ServiceGridProps {
  services: Service[];
}

export function ServiceGrid({ services }: ServiceGridProps) {
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
      className="section-madrasah py-16 sm:py-24 border-t border-emerald-100/70 dark:border-emerald-950/70 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C9A24B]">
            EKOSISTEM DIGITAL MADRASAH
          </span>
          <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-[#0F5C3A] dark:text-emerald-300">
            Daftar Website & Layanan
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Akses langsung ke berbagai aplikasi, portal informasi, dan sistem
            manajemen terpadu madrasah.
          </p>

          {/* Search Result Status */}
          {searchQuery && (
            <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-medium">
              <span>
                Menampilkan <strong>{filteredServices.length}</strong> layanan untuk
                kata kunci &ldquo;{searchQuery}&rdquo;
              </span>
              <button
                onClick={() => setSearchQuery("")}
                className="underline font-bold hover:text-emerald-950 cursor-pointer"
              >
                Reset
              </button>
            </div>
          )}
        </div>

        {/* Grid Kartu Layanan */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <PortalCard
                key={service.id}
                title={service.title}
                description={service.description}
                url={service.url}
                color={service.color}
                openInNewTab={service.open_in_new_tab}
                icon={
                  <ServiceIcon
                    name={service.icon}
                    className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
                  />
                }
              />
            ))}
          </div>
        ) : (
          /* Empty State Pencarian */
          <div className="flex flex-col items-center justify-center p-12 text-center bg-card rounded-2xl border border-dashed border-emerald-200 dark:border-emerald-900/60 max-w-md mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-muted-foreground mb-4">
              <SearchX className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              Layanan Tidak Ditemukan
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Tidak ada layanan yang sesuai dengan pencarian &ldquo;{searchQuery}&rdquo;.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchQuery("")}
              className="mt-6 rounded-full gap-2 border-emerald-300 dark:border-emerald-800"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Tampilkan Semua Layanan
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  ChevronDown,
  Compass,
  ExternalLink,
  Info,
  Phone,
  School,
  Sparkles,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ServiceIcon } from "@/components/ui/service-icon";
import type { Service, SiteSettings } from "@/types";

interface NavbarProps {
  settings: SiteSettings;
  services: Service[];
}

export function Navbar({ settings, services }: NavbarProps) {
  const [isOpenMobile, setIsOpenMobile] = React.useState(false);

  const handleScrollToServices = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpenMobile(false);
    const element = document.getElementById("layanan");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-100/70 dark:border-emerald-950/70 bg-white/90 dark:bg-[#081710]/90 backdrop-blur-md transition-colors">
      {/* Pola Islami Halus di Sisi Kiri Header */}
      <div className="absolute inset-y-0 left-0 w-48 sm:w-80 pointer-events-none opacity-40 dark:opacity-20 bg-islamic-pattern [mask-image:linear-gradient(to_right,black,transparent)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative z-10">
        {/* Kiri: Logo & Dua Baris Teks */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-[#0F5C3A] to-[#16A34A] p-0.5 shadow-md shadow-emerald-900/15 group-hover:scale-105 transition-transform duration-300">
            {settings.logo_url ? (
              <Image
                src={settings.logo_url}
                alt={`Logo ${settings.school_name}`}
                fill
                sizes="48px"
                priority
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-white dark:bg-[#0D2218] flex items-center justify-center text-[#0F5C3A] dark:text-[#16A34A]">
                <School className="w-6 h-6" />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#16A34A] dark:text-emerald-400">
              {settings.portal_title || "PORTAL DIGITAL MADRASAH"}
            </span>
            <span className="text-base sm:text-lg font-extrabold text-[#0F5C3A] dark:text-emerald-300 leading-tight">
              {settings.school_name || "MTs KH A. Wahab Muhsin"}
            </span>
          </div>
        </Link>

        {/* Tengah: Navigasi Desktop */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {/* Beranda (Aktif dengan Garis Bawah Hijau) */}
          <Link
            href="/"
            className="relative py-2 text-foreground font-semibold hover:text-[#0F5C3A] dark:hover:text-emerald-400 transition-colors after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#0F5C3A] dark:after:bg-emerald-400 after:rounded-full"
          >
            Beranda
          </Link>

          {/* Layanan Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 py-2 text-muted-foreground hover:text-foreground outline-none transition-colors group cursor-pointer">
              <span>Layanan</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-80 p-2">
              <DropdownMenuLabel className="text-xs uppercase tracking-wider text-[#C9A24B] px-3 py-1.5">
                Daftar Layanan Digital ({services.length})
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-72 overflow-y-auto py-1">
                {services.map((service) => (
                  <DropdownMenuItem key={service.id} asChild>
                    <Link
                      href={service.url}
                      target={service.open_in_new_tab ? "_blank" : undefined}
                      rel={
                        service.open_in_new_tab
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/50 cursor-pointer"
                    >
                      <div className="mt-0.5 p-2 rounded-lg bg-emerald-100/70 dark:bg-emerald-900/50 text-[#0F5C3A] dark:text-emerald-300 shrink-0">
                        <ServiceIcon name={service.icon} className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {service.title}
                        </p>
                        {service.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {service.description}
                          </p>
                        )}
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-1 opacity-60" />
                    </Link>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a
                  href="#layanan"
                  onClick={handleScrollToServices}
                  className="flex items-center justify-center gap-2 py-2 text-xs font-semibold text-[#0F5C3A] dark:text-emerald-400 text-center hover:underline cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A24B]" />
                  Lihat Semua Layanan di Halaman
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Informasi Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 py-2 text-muted-foreground hover:text-foreground outline-none transition-colors group cursor-pointer">
              <span>Informasi</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-1.5">
              <DropdownMenuItem asChild>
                <a
                  href="#tentang"
                  className="flex items-center gap-2.5 px-3 py-2 cursor-pointer"
                >
                  <Info className="w-4 h-4 text-[#0F5C3A] dark:text-emerald-400" />
                  <span>Tentang Portal</span>
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a
                  href="#kontak"
                  className="flex items-center gap-2.5 px-3 py-2 cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-[#0F5C3A] dark:text-emerald-400" />
                  <span>Kontak Madrasah</span>
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Kanan: Tombol Akses Terpadu & Dark Mode Toggle */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Button
            variant="gradient"
            size="pill"
            onClick={handleScrollToServices}
            className="hidden sm:inline-flex cursor-pointer text-sm shadow-md"
          >
            <Compass className="w-4 h-4 mr-1.5 animate-spin-slow" />
            Akses Terpadu
          </Button>

          {/* Mobile Menu (Sheet) */}
          <div className="flex md:hidden">
            <Sheet open={isOpenMobile} onOpenChange={setIsOpenMobile}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full w-10 h-10 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                  aria-label="Buka menu"
                >
                  <Menu className="w-6 h-6 text-foreground" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full sm:max-w-md p-6 flex flex-col justify-between overflow-y-auto"
              >
                <div>
                  <SheetHeader className="text-left pb-6 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-[#0F5C3A] to-[#16A34A] p-0.5 shrink-0">
                        {settings.logo_url ? (
                          <Image
                            src={settings.logo_url}
                            alt={`Logo ${settings.school_name}`}
                            fill
                            sizes="40px"
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-[#0F5C3A] flex items-center justify-center text-white">
                            <School className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div>
                        <SheetTitle className="text-base font-bold text-[#0F5C3A] dark:text-emerald-300">
                          {settings.school_name}
                        </SheetTitle>
                        <p className="text-xs text-[#16A34A] dark:text-emerald-400 font-semibold uppercase">
                          {settings.portal_title}
                        </p>
                      </div>
                    </div>
                  </SheetHeader>

                  {/* Nav Links Mobile */}
                  <div className="py-6 space-y-6">
                    <div>
                      <Link
                        href="/"
                        onClick={() => setIsOpenMobile(false)}
                        className="flex items-center justify-between text-base font-bold text-foreground py-2 border-b border-emerald-100/50 dark:border-emerald-950/50"
                      >
                        Beranda
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full gold-badge">
                          Aktif
                        </span>
                      </Link>
                    </div>

                    {/* Daftar Layanan di Mobile */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#C9A24B] mb-3">
                        Daftar Layanan ({services.length})
                      </p>
                      <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                        {services.map((service) => (
                          <Link
                            key={service.id}
                            href={service.url}
                            target={
                              service.open_in_new_tab ? "_blank" : undefined
                            }
                            rel={
                              service.open_in_new_tab
                                ? "noopener noreferrer"
                                : undefined
                            }
                            onClick={() => setIsOpenMobile(false)}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors"
                          >
                            <div className="p-2 rounded-lg bg-emerald-100/70 dark:bg-emerald-900/50 text-[#0F5C3A] dark:text-emerald-300">
                              <ServiceIcon
                                name={service.icon}
                                className="w-4 h-4"
                              />
                            </div>
                            <span className="text-sm font-medium text-foreground truncate">
                              {service.title}
                            </span>
                            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground ml-auto opacity-60" />
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Informasi Links */}
                    <div className="pt-2 border-t border-border">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                        Informasi
                      </p>
                      <div className="space-y-2">
                        <a
                          href="#tentang"
                          onClick={() => setIsOpenMobile(false)}
                          className="flex items-center gap-2.5 text-sm text-foreground py-1.5 hover:text-[#0F5C3A]"
                        >
                          <Info className="w-4 h-4 text-[#0F5C3A] dark:text-emerald-400" />
                          Tentang Portal
                        </a>
                        <a
                          href="#kontak"
                          onClick={() => setIsOpenMobile(false)}
                          className="flex items-center gap-2.5 text-sm text-foreground py-1.5 hover:text-[#0F5C3A]"
                        >
                          <Phone className="w-4 h-4 text-[#0F5C3A] dark:text-emerald-400" />
                          Kontak Madrasah
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Drawer */}
                <div className="pt-4 border-t border-border flex flex-col gap-3">
                  <Button
                    variant="gradient"
                    size="lg"
                    className="w-full rounded-full"
                    onClick={handleScrollToServices}
                  >
                    <Compass className="w-4 h-4 mr-2" />
                    Akses Terpadu
                  </Button>
                  <p className="text-[11px] text-center text-muted-foreground">
                    {settings.tagline}
                  </p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

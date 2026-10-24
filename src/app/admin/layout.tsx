"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  Settings,
  LogOut,
  Menu,
  ExternalLink,
  User,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { createBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    name: "Kelola Layanan",
    href: "/admin/layanan",
    icon: Layers,
    exact: false,
  },
  {
    name: "Pengaturan Portal",
    href: "/admin/pengaturan",
    icon: Settings,
    exact: false,
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminEmail, setAdminEmail] = React.useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  // Ambil data admin yang sedang login
  React.useEffect(() => {
    const supabase = createBrowserClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setAdminEmail(user.email);
      }
    });
  }, []);

  // Fungsi Logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const supabase = createBrowserClient();
      await supabase.auth.signOut();
      router.push("/admin/login");
      router.refresh();
    } catch {
      setIsLoggingOut(false);
    }
  };

  // Skip layout styling jika sedang di halaman login
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const renderNavLinks = (isMobile = false) => (
    <div className="space-y-1.5 py-4">
      {NAV_ITEMS.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => isMobile && setIsMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200",
              isActive
                ? "bg-gradient-to-r from-[#0F5C3A] to-[#16A34A] text-white shadow-md shadow-emerald-950/15"
                : "text-muted-foreground hover:text-foreground hover:bg-emerald-50/70 dark:hover:bg-emerald-950/40"
            )}
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAF9] dark:bg-[#071810] flex text-foreground">
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden lg:flex flex-col w-72 bg-white dark:bg-[#0D2218] border-r border-emerald-100 dark:border-emerald-900/60 shrink-0">
        {/* Brand Header */}
        <div className="p-6 border-b border-border flex items-center gap-3.5">
          <div className="relative w-11 h-11 rounded-2xl overflow-hidden bg-gradient-to-br from-[#0F5C3A] to-[#16A34A] p-0.5 shadow-md shadow-emerald-900/20 shrink-0">
            <div className="relative w-full h-full rounded-2xl overflow-hidden">
              <Image
                src="/logo.png"
                alt="Logo MTs KH A. Wahab Muhsin"
                fill
                sizes="44px"
                className="object-cover rounded-2xl"
              />
            </div>
          </div>
          <div className="min-w-0">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#C9A24B]">
              PANEL PENGELOLA
            </span>
            <h2 className="text-sm font-extrabold text-[#0F5C3A] dark:text-emerald-300 truncate leading-tight">
              MTs KH A. Wahab Muhsin
            </h2>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-4 py-4 overflow-y-auto">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Menu Utama
          </p>
          {renderNavLinks()}
        </div>

        {/* Bottom Sidebar: Tautan ke Website Publik */}
        <div className="p-4 border-t border-border">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100/70 dark:hover:bg-emerald-900/40 transition-colors"
          >
            <span className="inline-flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Lihat Portal Publik
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200/80 dark:bg-emerald-800/80">
              Live
            </span>
          </Link>
        </div>
      </aside>

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Atas */}
        <header className="sticky top-0 z-30 h-18 bg-white/95 dark:bg-[#0D2218]/95 backdrop-blur-md border-b border-border px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Trigger (Drawer) */}
            <div className="lg:hidden">
              <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full w-9 h-9"
                    aria-label="Buka menu admin"
                  >
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-6 flex flex-col justify-between">
                  <div>
                    <SheetHeader className="text-left pb-4 border-b border-border">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-[#0F5C3A] to-[#16A34A] p-0.5 shrink-0">
                          <div className="relative w-full h-full rounded-xl overflow-hidden">
                            <Image
                              src="/logo.png"
                              alt="Logo MTs KH A. Wahab Muhsin"
                              fill
                              sizes="40px"
                              className="object-cover rounded-xl"
                            />
                          </div>
                        </div>
                        <div>
                          <SheetTitle className="text-sm font-bold text-[#0F5C3A] dark:text-emerald-300">
                            Admin Portal
                          </SheetTitle>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                            MTs KH A. Wahab Muhsin
                          </p>
                        </div>
                      </div>
                    </SheetHeader>
                    {renderNavLinks(true)}
                  </div>

                  <div className="pt-4 border-t border-border">
                    <Button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      variant="outline"
                      className="w-full justify-start text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl gap-2.5"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Breadcrumb / Title */}
            <div>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider hidden sm:block">
                Administrasi Portal
              </span>
              <h1 className="text-base sm:text-lg font-bold text-foreground capitalize">
                {pathname === "/admin"
                  ? "Dashboard Ringkasan"
                  : pathname.replace("/admin/", "").replace(/-/g, " ")}
              </h1>
            </div>
          </div>

          {/* Kanan: Info Admin + Logout */}
          <div className="flex items-center gap-3 sm:gap-4">
            <ThemeToggle />

            {/* Profil Admin */}
            <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-border">
              <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <User className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-foreground leading-tight truncate max-w-[140px]">
                  {adminEmail || "Administrator"}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#C9A24B]">
                  <ShieldCheck className="w-3 h-3" />
                  Super Admin
                </span>
              </div>
            </div>

            {/* Tombol Logout */}
            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              variant="outline"
              size="sm"
              className="rounded-full text-xs font-semibold text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/40 gap-1.5"
              title="Keluar dari akun admin"
            >
              {isLoggingOut ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <LogOut className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">Keluar</span>
            </Button>
          </div>
        </header>

        {/* Area Halaman Child */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

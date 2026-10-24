"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { createBrowserClient } from "@/lib/supabase/client";
import { loginSchema, type LoginFormValues } from "@/lib/validations/website";
import { Button } from "@/components/ui/button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  // Error dari parameter URL (misal: redirect dari middleware karena unauthorized)
  const isUnauthorized = searchParams.get("error") === "unauthorized";
  const displayedError =
    authError ||
    (isUnauthorized
      ? "Akun Anda tidak memiliki hak akses administrator."
      : null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setAuthError(null);
    setIsLoading(true);

    try {
      const supabase = createBrowserClient();

      // 1. Sign in dengan email & password
      const { data: authData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

      if (signInError) {
        if (signInError.message.includes("Invalid login credentials")) {
          setAuthError("Email atau kata sandi salah. Silakan coba lagi.");
        } else if (signInError.message.includes("Email not confirmed")) {
          setAuthError("Email akun belum dikonfirmasi di sistem.");
        } else {
          setAuthError(signInError.message);
        }
        setIsLoading(false);
        return;
      }

      if (!authData.user) {
        setAuthError("Gagal memulai sesi login. Silakan ulangi.");
        setIsLoading(false);
        return;
      }

      // 2. Verifikasi apakah ada di tabel admin_profiles
      const { data: adminProfile, error: profileError } = await supabase
        .from("admin_profiles")
        .select("id, role")
        .eq("id", authData.user.id)
        .maybeSingle();

      if (profileError || !adminProfile) {
        // Keluar jika bukan admin
        await supabase.auth.signOut();
        setAuthError(
          "Akses ditolak: Akun Anda terdaftar tetapi belum memiliki hak akses administrator."
        );
        setIsLoading(false);
        return;
      }

      // Berhasil, arahkan ke dashboard admin
      router.push("/admin");
      router.refresh();
    } catch {
      setAuthError("Terjadi kendala koneksi ke server. Periksa jaringan Anda.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Tombol Kembali ke Portal */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-[#0F5C3A] dark:hover:text-emerald-400 mb-6 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Kembali ke Beranda Portal
      </Link>

      {/* Card Login */}
      <div className="card-madrasah p-8 sm:p-10 bg-card border border-emerald-100 dark:border-emerald-900/60 shadow-xl relative overflow-hidden">
        {/* Dekorasi Aksen Emas di Atas Card */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0F5C3A] via-[#16A34A] to-[#C9A24B]" />

        {/* Logo & Judul */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-[#0F5C3A] via-[#16A34A] to-[#C9A24B] p-0.5 shadow-lg shadow-emerald-950/20 mb-4">
            <div className="relative w-full h-full rounded-2xl overflow-hidden">
              <Image
                src="/logo.png"
                alt="Logo MTs KH A. Wahab Muhsin"
                fill
                sizes="64px"
                priority
                className="object-cover rounded-2xl"
              />
            </div>
          </div>
          <span className="text-xs uppercase tracking-widest font-bold text-[#C9A24B]">
            PORTAL ADMINISTRATOR
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F5C3A] dark:text-emerald-300 mt-1">
            MTs KH A. Wahab Muhsin
          </h1>
          <p className="text-xs text-muted-foreground mt-2">
            Silakan masuk dengan akun terdaftar untuk mengelola layanan dan portal.
          </p>
        </div>

        {/* Notifikasi Error Bahasa Indonesia */}
        {displayedError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-3 text-red-800 dark:text-red-300 text-xs sm:text-sm animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium leading-relaxed">{displayedError}</div>
          </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Field */}
          <div>
            <label
              htmlFor="admin-email"
              className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2 cursor-pointer"
            >
              Alamat Email
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                placeholder="nama@madrasah.sch.id"
                {...register("email")}
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-[#16A34A] focus:ring-3 focus:ring-emerald-500/15 transition-all"
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="admin-password"
                className="block text-xs font-bold text-foreground uppercase tracking-wider cursor-pointer"
              >
                Kata Sandi
              </label>
            </div>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                {...register("password")}
                className="w-full h-11 pl-10 pr-11 rounded-xl bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-[#16A34A] focus:ring-3 focus:ring-emerald-500/15 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors"
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Tombol Submit Gradasi Hijau */}
          <Button
            type="submit"
            disabled={isLoading}
            variant="gradient"
            size="lg"
            className="w-full rounded-xl h-11 text-sm font-bold shadow-md shadow-emerald-900/15"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Memverifikasi...
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Masuk ke Panel Admin
              </span>
            )}
          </Button>
        </form>

        {/* Petunjuk Bantuan */}
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Halaman ini khusus untuk pengelola sistem. Jika belum memiliki hak
            akses, hubungi Administrator MTs KH A. Wahab Muhsin.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8 bg-gradient-to-b from-white via-emerald-50/30 to-white dark:from-[#081710] dark:via-[#0c2317] dark:to-[#081710] relative">
      {/* Pola Geometri Islami Samar */}
      <div className="absolute inset-0 bg-islamic-pattern opacity-40 dark:opacity-10 pointer-events-none" />

      <React.Suspense
        fallback={
          <div className="p-12 text-center card-madrasah">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
            <p className="text-sm text-muted-foreground mt-3">Memuat form...</p>
          </div>
        }
      >
        <LoginForm />
      </React.Suspense>
    </div>
  );
}

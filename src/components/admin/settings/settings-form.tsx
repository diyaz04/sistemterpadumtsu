"use client";

import * as React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  School,
  Save,
  Loader2,
  Upload,
  Trash2,
  Plus,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createBrowserClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/image-compress";
import {
  siteSettingsSchema,
  type SiteSettingsFormValues,
} from "@/lib/validations/website";
import { updateSiteSettingsAction } from "@/lib/actions/settings";
import type { SiteSettings } from "@/types";

interface SettingsFormProps {
  initialSettings: SiteSettings;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [logoPreview, setLogoPreview] = React.useState<string | null>(
    initialSettings.logo_url || null
  );
  const [heroImagePreview, setHeroImagePreview] = React.useState<string | null>(
    initialSettings.hero_image_url || null
  );
  const [isUploadingLogo, setIsUploadingLogo] = React.useState(false);
  const [isUploadingHero, setIsUploadingHero] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SiteSettingsFormValues>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      school_name: initialSettings.school_name || "MTs KH A. Wahab Muhsin",
      portal_title: initialSettings.portal_title || "Portal Digital Madrasah",
      hero_badge: initialSettings.hero_badge || "EKOSISTEM DIGITAL MADRASAH",
      hero_title: initialSettings.hero_title || "Semua Layanan Sekolah,",
      hero_highlight: initialSettings.hero_highlight || "Satu Portal.",
      hero_description:
        initialSettings.hero_description ||
        "Akses website utama, administrasi, keuangan, pembelajaran, dan informasi madrasah dengan lebih mudah.",
      tagline:
        initialSettings.tagline ||
        "Membangun Madrasah yang Unggul, Terhubung, dan Berkarakter",
      footer_text:
        initialSettings.footer_text ||
        "Membangun Generasi Islami, Berakhlakul Karimah, dan Melek Teknologi.",
      logo_url: initialSettings.logo_url || "",
      hero_image_url: initialSettings.hero_image_url || "",
      highlights:
        initialSettings.highlights && initialSettings.highlights.length > 0
          ? initialSettings.highlights
          : ["Terintegrasi", "Mudah Diakses", "Untuk Warga Madrasah"],
    },
  });

  const highlights = watch("highlights") || [];

  // Tambah Poin Highlight Baru
  const handleAddHighlight = () => {
    if (highlights.length >= 6) {
      toast.error("Maksimal 6 poin highlight.");
      return;
    }
    setValue("highlights", [...highlights, "Poin Baru"], { shouldDirty: true });
  };

  // Ubah Teks Poin Highlight
  const handleUpdateHighlight = (index: number, value: string) => {
    const updated = [...highlights];
    updated[index] = value;
    setValue("highlights", updated, { shouldDirty: true });
  };

  // Hapus Poin Highlight
  const handleRemoveHighlight = (index: number) => {
    if (highlights.length <= 1) {
      toast.error("Minimal harus ada 1 poin highlight.");
      return;
    }
    const updated = highlights.filter((_, i) => i !== index);
    setValue("highlights", updated, { shouldDirty: true });
  };

  // Upload Handler ke Supabase Storage (portal-assets)
  const handleUploadImage = async (
    file: File,
    type: "logo" | "hero"
  ) => {
    // 1. Validasi Tipe File
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
    ];
    if (!validTypes.includes(file.type)) {
      toast.error("Format tidak didukung. Gunakan format JPG, PNG, WEBP, atau SVG.");
      return;
    }

    // 2. Validasi Ukuran File (Maksimal 2MB)
    const MAX_SIZE = 2 * 1024 * 1024; // 2MB
    if (file.size > MAX_SIZE) {
      toast.error("Ukuran file terlalu besar! Maksimal 2MB.");
      return;
    }

    if (type === "logo") setIsUploadingLogo(true);
    if (type === "hero") setIsUploadingHero(true);

    try {
      // 3. Kompresi di client sebelum upload
      const compressedFile = await compressImage(
        file,
        type === "logo" ? 512 : 1600,
        type === "logo" ? 512 : 1600,
        type === "logo" ? 0.9 : 0.85
      );

      const supabase = createBrowserClient();
      const ext = compressedFile.name.split(".").pop() || "webp";
      const fileName = `${type}-${Date.now()}.${ext}`;
      const filePath = `settings/${fileName}`;

      // 4. Upload ke bucket 'portal-assets'
      const { error: uploadError } = await supabase.storage
        .from("portal-assets")
        .upload(filePath, compressedFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        toast.error(`Gagal mengunggah gambar: ${uploadError.message}`);
        return;
      }

      // 5. Dapatkan Public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("portal-assets").getPublicUrl(filePath);

      if (type === "logo") {
        setLogoPreview(publicUrl);
        setValue("logo_url", publicUrl, { shouldDirty: true });
        toast.success("Logo madrasah berhasil diunggah!");
      } else {
        setHeroImagePreview(publicUrl);
        setValue("hero_image_url", publicUrl, { shouldDirty: true });
        toast.success("Gambar hero berhasil diunggah!");
      }
    } catch {
      toast.error("Terjadi kesalahan saat memproses gambar.");
    } finally {
      if (type === "logo") setIsUploadingLogo(false);
      if (type === "hero") setIsUploadingHero(false);
    }
  };

  const onSubmit = async (values: SiteSettingsFormValues) => {
    try {
      const res = await updateSiteSettingsAction(values);
      if (!res.success) {
        toast.error(res.error || "Gagal menyimpan pengaturan.");
        return;
      }
      toast.success("Pengaturan portal berhasil disimpan!");
    } catch {
      toast.error("Terjadi kendala saat menyimpan data.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* 1. KELOMPOK: IDENTITAS MADRASAH */}
      <div className="card-madrasah p-6 sm:p-8 bg-white dark:bg-[#0D2218]">
        <div className="flex items-center gap-2.5 pb-4 border-b border-border mb-6">
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#0F5C3A] dark:text-emerald-400">
            <School className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              Identitas Madrasah & Portal
            </h2>
            <p className="text-xs text-muted-foreground">
              Nama sekolah dan nama portal utama yang muncul di navbar dan header.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
              Nama Madrasah <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: MTs KH A. Wahab Muhsin"
              {...register("school_name")}
              className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-sm font-semibold focus:outline-none focus:border-[#16A34A] focus:ring-3 focus:ring-emerald-500/15"
            />
            {errors.school_name && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.school_name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
              Judul Portal Digital <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Portal Digital Madrasah"
              {...register("portal_title")}
              className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-sm font-semibold focus:outline-none focus:border-[#16A34A] focus:ring-3 focus:ring-emerald-500/15"
            />
            {errors.portal_title && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.portal_title.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 2. KELOMPOK: KONTEN HERO SECTION */}
      <div className="card-madrasah p-6 sm:p-8 bg-white dark:bg-[#0D2218]">
        <div className="flex items-center gap-2.5 pb-4 border-b border-border mb-6">
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#0F5C3A] dark:text-emerald-400">
            <Sparkles className="w-5 h-5 text-[#C9A24B]" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              Konten & Teks Hero (Beranda)
            </h2>
            <p className="text-xs text-muted-foreground">
              Kata sambutan, judul besar promosi, dan deskripsi utama portal madrasah.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                Badge Kecil Hero
              </label>
              <input
                type="text"
                placeholder="EKOSISTEM DIGITAL MADRASAH"
                {...register("hero_badge")}
                className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:border-[#16A34A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                Judul Hero Baris 1 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Semua Layanan Sekolah,"
                {...register("hero_title")}
                className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-sm font-bold text-[#0F5C3A] dark:text-emerald-300 focus:outline-none focus:border-[#16A34A]"
              />
              {errors.hero_title && (
                <p className="mt-1 text-xs text-red-500 font-medium">
                  {errors.hero_title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                Kata Sorotan Hijau Baris 2 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Satu Portal."
                {...register("hero_highlight")}
                className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-sm font-bold text-[#16A34A] dark:text-emerald-400 focus:outline-none focus:border-[#16A34A]"
              />
              {errors.hero_highlight && (
                <p className="mt-1 text-xs text-red-500 font-medium">
                  {errors.hero_highlight.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
              Deskripsi Lengkap Hero <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Akses website utama, administrasi, keuangan..."
              {...register("hero_description")}
              className="w-full p-3.5 rounded-xl bg-background border border-border text-sm leading-relaxed focus:outline-none focus:border-[#16A34A] resize-none"
            />
            {errors.hero_description && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.hero_description.message}
              </p>
            )}
          </div>

          {/* Dinamis Highlights Poin (Tambah / Hapus) */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Poin-Poin Keunggulan (Highlights)
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddHighlight}
                className="rounded-full text-xs font-semibold gap-1.5 border-emerald-200 dark:border-emerald-800"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Poin
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {highlights.map((point, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-1.5 pl-3 rounded-xl border border-border bg-muted/20"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <input
                    type="text"
                    value={point}
                    onChange={(e) =>
                      handleUpdateHighlight(index, e.target.value)
                    }
                    placeholder="Contoh: Terintegrasi"
                    className="flex-1 bg-transparent text-xs font-medium focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveHighlight(index)}
                    className="p-1 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    title="Hapus poin"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. KELOMPOK: UPLOAD LOGO & GAMBAR HERO (STORAGE PORTAL-ASSETS) */}
      <div className="card-madrasah p-6 sm:p-8 bg-white dark:bg-[#0D2218]">
        <div className="flex items-center gap-2.5 pb-4 border-b border-border mb-6">
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#0F5C3A] dark:text-emerald-400">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              Aset Gambar & Logo (Supabase Storage)
            </h2>
            <p className="text-xs text-muted-foreground">
              Otomatis dikompresi di browser sebelum diunggah ke bucket <code>portal-assets</code> (Maks 2MB).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Upload Logo Madrasah */}
          <div className="p-5 rounded-2xl border border-border bg-muted/20 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-foreground block mb-1">
                Logo Madrasah (Navbar & Footer)
              </span>
              <p className="text-xs text-muted-foreground mb-4">
                Format disarankan: PNG transparan atau SVG bulat (512x512 px).
              </p>

              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-20 h-20 rounded-full border-2 border-emerald-200 dark:border-emerald-800 bg-white dark:bg-[#081710] overflow-hidden flex items-center justify-center shrink-0 shadow-md">
                  {logoPreview ? (
                    <Image
                      src={logoPreview}
                      alt="Logo Preview"
                      fill
                      sizes="80px"
                      className="object-contain p-2"
                    />
                  ) : (
                    <School className="w-9 h-9 text-[#0F5C3A] dark:text-emerald-400" />
                  )}
                </div>

                <div className="space-y-2">
                  <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#0D2218] border border-border text-xs font-bold text-foreground hover:bg-muted cursor-pointer shadow-xs transition-colors">
                    {isUploadingLogo ? (
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                    ) : (
                      <Upload className="w-4 h-4 text-emerald-600" />
                    )}
                    <span>{isUploadingLogo ? "Mengompres & Upload..." : "Pilih Logo"}</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      disabled={isUploadingLogo}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadImage(file, "logo");
                      }}
                      className="hidden"
                    />
                  </label>

                  {logoPreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setLogoPreview(null);
                        setValue("logo_url", "", { shouldDirty: true });
                      }}
                      className="block text-[11px] text-red-600 dark:text-red-400 hover:underline"
                    >
                      Hapus / Gunakan Ikon Bawaan
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="text-[11px] text-muted-foreground font-mono truncate">
              {watch("logo_url") ? watch("logo_url") : "Belum ada logo khusus"}
            </div>
          </div>

          {/* Upload Gambar Hero Section */}
          <div className="p-5 rounded-2xl border border-border bg-muted/20 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-foreground block mb-1">
                Gambar / Ilustrasi Hero (Kolom Kanan)
              </span>
              <p className="text-xs text-muted-foreground mb-4">
                Format disarankan: WEBP atau JPG lanskap (Rasio 1:1 atau 16:9).
              </p>

              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-32 h-20 rounded-xl border-2 border-emerald-200 dark:border-emerald-800 bg-white dark:bg-[#081710] overflow-hidden flex items-center justify-center shrink-0 shadow-md">
                  {heroImagePreview ? (
                    <Image
                      src={heroImagePreview}
                      alt="Hero Image Preview"
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <ImageIcon className="w-6 h-6 mb-1 text-emerald-600" />
                      <span className="text-[10px]">Ilustrasi Default</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#0D2218] border border-border text-xs font-bold text-foreground hover:bg-muted cursor-pointer shadow-xs transition-colors">
                    {isUploadingHero ? (
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                    ) : (
                      <Upload className="w-4 h-4 text-emerald-600" />
                    )}
                    <span>{isUploadingHero ? "Mengompres & Upload..." : "Pilih Gambar"}</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      disabled={isUploadingHero}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadImage(file, "hero");
                      }}
                      className="hidden"
                    />
                  </label>

                  {heroImagePreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setHeroImagePreview(null);
                        setValue("hero_image_url", "", { shouldDirty: true });
                      }}
                      className="block text-[11px] text-red-600 dark:text-red-400 hover:underline"
                    >
                      Hapus / Gunakan Ilustrasi Bawaan
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="text-[11px] text-muted-foreground font-mono truncate">
              {watch("hero_image_url")
                ? watch("hero_image_url")
                : "Menggunakan kartu ilustrasi default"}
            </div>
          </div>
        </div>
      </div>

      {/* 4. KELOMPOK: TAGLINE & TEKS FOOTER */}
      <div className="card-madrasah p-6 sm:p-8 bg-white dark:bg-[#0D2218]">
        <div className="flex items-center gap-2.5 pb-4 border-b border-border mb-6">
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#0F5C3A] dark:text-emerald-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              Tagline & Informasi Footer
            </h2>
            <p className="text-xs text-muted-foreground">
              Motto madrasah dan teks penutup yang tampil di bagian paling bawah halaman.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
              Tagline Madrasah (Teks Miring Footer)
            </label>
            <input
              type="text"
              placeholder="Contoh: Membangun Madrasah yang Unggul, Terhubung, dan Berkarakter"
              {...register("tagline")}
              className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-sm italic focus:outline-none focus:border-[#16A34A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
              Teks Deskripsi Footer
            </label>
            <input
              type="text"
              placeholder="Contoh: Membangun Generasi Islami, Berakhlakul Karimah, dan Melek Teknologi."
              {...register("footer_text")}
              className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:border-[#16A34A]"
            />
          </div>
        </div>
      </div>

      {/* STICKY BOTTOM SAVE ACTION BAR */}
      <div className="sticky bottom-6 z-20 flex items-center justify-between p-4 rounded-2xl bg-white/95 dark:bg-[#0D2218]/95 backdrop-blur-md border border-emerald-200 dark:border-emerald-800/80 shadow-xl shadow-emerald-950/15">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          {isDirty ? (
            <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Ada perubahan yang belum disimpan
            </span>
          ) : (
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Data tersinkronkan dengan database
            </span>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || isUploadingLogo || isUploadingHero}
          variant="gradient"
          size="lg"
          className="rounded-xl font-bold min-w-[170px] shadow-md shadow-emerald-950/20 cursor-pointer"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Menyimpan...
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <Save className="w-4 h-4" />
              Simpan Pengaturan
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}

"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ServiceIcon } from "@/components/ui/service-icon";
import { ServiceCard } from "@/components/home/ServiceCard";
import { serviceSchema, type ServiceFormValues } from "@/lib/validations/website";
import { createServiceAction, updateServiceAction } from "@/lib/actions/services";
import type { Service, ServiceColor } from "@/types";
import { Loader2, Search, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const AVAILABLE_ICONS = [
  { name: "Globe", label: "Website Utama / Web" },
  { name: "Wallet", label: "Keuangan & Kas" },
  { name: "Users", label: "Guru & Tenaga Pendidik" },
  { name: "BookOpen", label: "Perangkat Pembelajaran" },
  { name: "FileCheck", label: "Raport & Penilaian" },
  { name: "Megaphone", label: "Warta & Agenda" },
  { name: "School", label: "Madrasah & Profil" },
  { name: "GraduationCap", label: "Kelulusan & Santri" },
  { name: "Library", label: "Perpustakaan Digital" },
  { name: "Compass", label: "PPDB Online" },
  { name: "FileText", label: "Dokumen & Modul" },
  { name: "Calendar", label: "Kalender Akademik" },
  { name: "Settings", label: "Manajemen Sistem" },
  { name: "ShieldCheck", label: "Bimbingan Konseling" },
  { name: "Award", label: "Prestasi Siswa" },
  { name: "Laptop", label: "CBT & E-Learning" },
  { name: "Building2", label: "Sarana & Prasarana" },
  { name: "CreditCard", label: "SPP & Pembayaran" },
  { name: "Layers", label: "Portal Layanan" },
  { name: "Phone", label: "Kontak & Informasi" },
  { name: "Sparkles", label: "Program Unggulan" },
  { name: "Clock", label: "Presensi Santri" },
];

export const COLOR_OPTIONS: {
  value: ServiceColor;
  label: string;
  gradient: string;
}[] = [
  {
    value: "green",
    label: "Hijau Madrasah",
    gradient: "from-[#0F5C3A] to-[#16A34A]",
  },
  {
    value: "gold",
    label: "Emas Elegan",
    gradient: "from-[#B38E38] to-[#E3C273]",
  },
  {
    value: "blue",
    label: "Biru Akademik",
    gradient: "from-blue-600 to-sky-400",
  },
  {
    value: "purple",
    label: "Ungu Kurikulum",
    gradient: "from-purple-700 to-indigo-500",
  },
  {
    value: "teal",
    label: "Teal Penilaian",
    gradient: "from-teal-700 to-emerald-400",
  },
  {
    value: "orange",
    label: "Oranye Informasi",
    gradient: "from-amber-600 to-orange-500",
  },
];

interface ServiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceToEdit?: Service | null;
  onSuccess?: () => void;
}

export function ServiceFormDialog({
  open,
  onOpenChange,
  serviceToEdit,
  onSuccess,
}: ServiceFormDialogProps) {
  const [iconSearch, setIconSearch] = React.useState("");
  const isEditing = Boolean(serviceToEdit);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      description: "",
      url: "https://",
      icon: "Globe",
      color: "green",
      sort_order: 0,
      is_active: true,
      open_in_new_tab: true,
    },
  });

  // Sinkronkan form saat modal dibuka atau serviceToEdit berganti
  React.useEffect(() => {
    if (open) {
      if (serviceToEdit) {
        reset({
          title: serviceToEdit.title,
          description: serviceToEdit.description || "",
          url: serviceToEdit.url,
          icon: serviceToEdit.icon,
          color: serviceToEdit.color,
          sort_order: serviceToEdit.sort_order,
          is_active: serviceToEdit.is_active,
          open_in_new_tab: serviceToEdit.open_in_new_tab,
        });
      } else {
        reset({
          title: "",
          description: "",
          url: "https://",
          icon: "Globe",
          color: "green",
          sort_order: 0,
          is_active: true,
          open_in_new_tab: true,
        });
      }
      setIconSearch("");
    }
  }, [open, serviceToEdit, reset]);

  // Pantau nilai form untuk live preview
  const watchedValues = watch();

  const filteredIcons = AVAILABLE_ICONS.filter(
    (i) =>
      i.name.toLowerCase().includes(iconSearch.toLowerCase()) ||
      i.label.toLowerCase().includes(iconSearch.toLowerCase())
  );

  const onSubmit = async (values: ServiceFormValues) => {
    try {
      if (isEditing && serviceToEdit) {
        const res = await updateServiceAction(serviceToEdit.id, values);
        if (!res.success) {
          toast.error(res.error || "Gagal memperbarui layanan.");
          return;
        }
        toast.success("Layanan berhasil diperbarui!");
      } else {
        const res = await createServiceAction(values);
        if (!res.success) {
          toast.error(res.error || "Gagal menambahkan layanan.");
          return;
        }
        toast.success("Layanan baru berhasil ditambahkan!");
      }

      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast.error("Terjadi kesalahan saat memproses data.");
    }
  };

  // Objek simulasi untuk Live Preview
  const previewService: Service = {
    id: "preview",
    title: watchedValues.title.trim() || "Judul Layanan Baru",
    description:
      watchedValues.description?.trim() ||
      "Deskripsi singkat mengenai layanan atau tautan website sekolah ini.",
    url: watchedValues.url || "https://example.com",
    icon: watchedValues.icon || "Globe",
    color: (watchedValues.color as ServiceColor) || "green",
    sort_order: watchedValues.sort_order || 1,
    is_active: watchedValues.is_active,
    open_in_new_tab: watchedValues.open_in_new_tab,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <DialogHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C9A24B]">
              {isEditing ? "Mode Pembaruan" : "Layanan Baru"}
            </span>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-extrabold text-[#0F5C3A] dark:text-emerald-300">
            {isEditing ? `Edit: ${serviceToEdit?.title}` : "Tambah Layanan Digital"}
          </DialogTitle>
          <DialogDescription>
            Isi formulir di bawah. Tampilan kartu akan berubah otomatis di panel pratinjau langsung.
          </DialogDescription>
        </DialogHeader>

        {/* Layout 2 Kolom: Form Input (Kiri) & Live Preview (Kanan) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
          {/* ================= FORM INPUT (7 Kolom) ================= */}
          <form
            id="service-form"
            onSubmit={handleSubmit(onSubmit)}
            className="lg:col-span-7 space-y-5"
          >
            {/* Judul Layanan */}
            <div>
              <label
                htmlFor="service-title-input"
                className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5 cursor-pointer"
              >
                Judul Layanan <span className="text-red-500">*</span>
              </label>
              <input
                id="service-title-input"
                type="text"
                placeholder="Contoh: Website Keuangan"
                {...register("title")}
                className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-[#16A34A] focus:ring-3 focus:ring-emerald-500/15"
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-500 font-medium">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Deskripsi Singkat */}
            <div>
              <label
                htmlFor="service-desc-input"
                className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5 cursor-pointer"
              >
                Deskripsi Singkat
              </label>
              <textarea
                id="service-desc-input"
                rows={2}
                placeholder="Contoh: Transparansi laporan dan layanan keuangan sekolah"
                {...register("description")}
                className="w-full p-3 rounded-xl bg-background border border-border text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-[#16A34A] focus:ring-3 focus:ring-emerald-500/15 resize-none"
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-500 font-medium">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* URL Tautan (Wajib https://) */}
            <div>
              <label
                htmlFor="service-url-input"
                className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5 cursor-pointer"
              >
                Alamat URL (Wajib https://) <span className="text-red-500">*</span>
              </label>
              <input
                id="service-url-input"
                type="url"
                placeholder="https://keuangan.mtswahabmuhsin.sch.id"
                {...register("url")}
                className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-sm font-mono placeholder:text-muted-foreground/60 focus:outline-none focus:border-[#16A34A] focus:ring-3 focus:ring-emerald-500/15"
              />
              {errors.url && (
                <p className="mt-1 text-xs text-red-500 font-medium">
                  {errors.url.message}
                </p>
              )}
            </div>

            {/* Pilihan Warna Gradasi (Visual 6 Warna) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                Warna Gradasi Ikon <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {COLOR_OPTIONS.map((c) => {
                  const isSelected = watchedValues.color === c.value;
                  return (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setValue("color", c.value)}
                      className={cn(
                        "relative flex flex-col items-center gap-1.5 p-2 rounded-xl border text-center transition-all cursor-pointer",
                        isSelected
                          ? "border-[#16A34A] bg-emerald-50/70 dark:bg-emerald-950/60 ring-2 ring-emerald-500/30"
                          : "border-border hover:bg-muted/50"
                      )}
                    >
                      <div
                        className={cn(
                          "w-7 h-7 rounded-lg bg-gradient-to-br shadow-xs flex items-center justify-center text-white",
                          c.gradient
                        )}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-[10px] font-semibold text-foreground capitalize truncate w-full">
                        {c.value}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pilihan Ikon Lucide (Searchable Grid) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Ikon Layanan ({watchedValues.icon})
                </label>
                <div className="relative w-40">
                  <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={iconSearch}
                    onChange={(e) => setIconSearch(e.target.value)}
                    placeholder="Cari ikon..."
                    className="w-full h-8 pl-8 pr-2 text-xs rounded-lg bg-background border border-border focus:outline-none focus:border-[#16A34A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-40 overflow-y-auto p-1.5 border border-border rounded-xl bg-muted/20">
                {filteredIcons.map((item) => {
                  const isSelected = watchedValues.icon === item.name;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setValue("icon", item.name)}
                      className={cn(
                        "flex flex-col items-center justify-center p-2 rounded-xl border text-xs transition-all cursor-pointer",
                        isSelected
                          ? "border-[#16A34A] bg-emerald-100/70 dark:bg-emerald-900/60 text-[#0F5C3A] dark:text-emerald-300 font-bold"
                          : "border-transparent hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                      title={item.label}
                    >
                      <ServiceIcon name={item.name} className="w-5 h-5 mb-1" />
                      <span className="text-[9px] truncate w-full text-center">
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>
              {errors.icon && (
                <p className="mt-1 text-xs text-red-500 font-medium">
                  {errors.icon.message}
                </p>
              )}
            </div>

            {/* Switch: Buka di Tab Baru & Status Aktif */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border">
              <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20">
                <div>
                  <p className="text-xs font-bold text-foreground">Buka di Tab Baru</p>
                  <p className="text-[11px] text-muted-foreground">target=&quot;_blank&quot;</p>
                </div>
                <Controller
                  name="open_in_new_tab"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20">
                <div>
                  <p className="text-xs font-bold text-foreground">Status Aktif</p>
                  <p className="text-[11px] text-muted-foreground">Tampilkan di beranda</p>
                </div>
                <Controller
                  name="is_active"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
          </form>

          {/* ================= LIVE PREVIEW (5 Kolom) ================= */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#C9A24B]" />
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                Pratinjau Langsung (Live Preview)
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-50/50 dark:bg-[#071810]/50 border border-emerald-100 dark:border-emerald-900/50 flex flex-col justify-center gap-4 flex-1">
              <p className="text-[11px] text-muted-foreground">
                Ini adalah tampilan persis kartu layanan seperti yang akan dilihat oleh pengunjung landing page:
              </p>

              {/* Komponen Kartu Nyata */}
              <div className="w-full pointer-events-none">
                <ServiceCard service={previewService} />
              </div>

              <div className="text-[11px] text-muted-foreground bg-white/70 dark:bg-[#0D2218]/70 p-3 rounded-xl border border-border space-y-1">
                <div className="flex justify-between">
                  <span>Warna:</span>
                  <span className="font-semibold capitalize text-foreground">
                    {watchedValues.color}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Ikon:</span>
                  <span className="font-semibold text-foreground">
                    {watchedValues.icon}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span
                    className={cn(
                      "font-semibold",
                      watchedValues.is_active ? "text-emerald-600" : "text-zinc-500"
                    )}
                  >
                    {watchedValues.is_active ? "Aktif Tayang" : "Disembunyikan"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Dialog */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-border mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="rounded-xl"
          >
            Batal
          </Button>
          <Button
            type="submit"
            form="service-form"
            disabled={isSubmitting}
            variant="gradient"
            className="rounded-xl font-bold min-w-[130px]"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Menyimpan...
              </span>
            ) : isEditing ? (
              "Simpan Perubahan"
            ) : (
              "Tambah Layanan"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

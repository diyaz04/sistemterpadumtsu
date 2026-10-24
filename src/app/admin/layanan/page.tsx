import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getServices } from "@/lib/supabase/data";
import { ServicesManager } from "@/components/admin/services/services-manager";

export const revalidate = 0; // Selalu muat data terbaru

export default async function AdminLayananPage() {
  const services = await getServices();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mb-2 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          Kembali ke Dashboard
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C9A24B]">
                MANAJEMEN KONTEN
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                Live Data
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F5C3A] dark:text-emerald-300 tracking-tight mt-1">
              Kelola Daftar Layanan
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
            Tambah tautan website madrasah baru, ubah urutan dengan drag & drop,
            atau nonaktifkan layanan sementara waktu.
          </p>
        </div>
      </div>

      {/* Services Manager Client Component */}
      <ServicesManager initialServices={services} />
    </div>
  );
}

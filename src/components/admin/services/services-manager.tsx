"use client";

import * as React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Layers,
  ArrowUpDown,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DraggableServiceRow } from "./draggable-service-row";
import { ServiceFormDialog } from "./service-form-dialog";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";
import {
  toggleServiceStatusAction,
  reorderServicesAction,
} from "@/lib/actions/services";
import type { Service } from "@/types";

interface ServicesManagerProps {
  initialServices: Service[];
}

export function ServicesManager({ initialServices }: ServicesManagerProps) {
  const [prevInitial, setPrevInitial] = React.useState(initialServices);
  const [services, setServices] = React.useState<Service[]>(initialServices);

  // Sinkronkan state saat initialServices dari server berubah
  if (initialServices !== prevInitial) {
    setPrevInitial(initialServices);
    setServices(initialServices);
  }

  const [filterQuery, setFilterQuery] = React.useState("");
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [editingService, setEditingService] = React.useState<Service | null>(null);
  const [deletingService, setDeletingService] = React.useState<Service | null>(null);
  const [togglingId, setTogglingId] = React.useState<string | null>(null);

  // Setup sensors untuk dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // drag baru aktif setelah geser 5px agar klik tombol tetap responsif
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Toggle status aktif langsung update
  const handleToggleStatus = async (id: string, active: boolean) => {
    setTogglingId(id);
    // Optimistic update
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_active: active } : s))
    );

    try {
      const res = await toggleServiceStatusAction(id, active);
      if (!res.success) {
        // Rollback
        setServices((prev) =>
          prev.map((s) => (s.id === id ? { ...s, is_active: !active } : s))
        );
        toast.error(res.error || "Gagal mengubah status layanan.");
        return;
      }
      toast.success(
        active ? "Layanan berhasil diaktifkan!" : "Layanan dinonaktifkan."
      );
    } catch {
      setServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, is_active: !active } : s))
      );
      toast.error("Terjadi kesalahan koneksi.");
    } finally {
      setTogglingId(null);
    }
  };

  // Drag & drop selesai
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = services.findIndex((s) => s.id === active.id);
    const newIndex = services.findIndex((s) => s.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(services, oldIndex, newIndex).map(
      (item, idx) => ({
        ...item,
        sort_order: idx + 1,
      })
    );

    // Optimistic update UI
    setServices(reordered);

    // Kirim urutan baru ke Server Action
    try {
      const payload = reordered.map((item) => ({
        id: item.id,
        sort_order: item.sort_order,
      }));

      const res = await reorderServicesAction(payload);
      if (!res.success) {
        toast.error(res.error || "Gagal menyimpan urutan baru.");
        setServices(initialServices); // Rollback
        return;
      }
      toast.success("Urutan layanan berhasil diperbarui!");
    } catch {
      toast.error("Terjadi kesalahan saat menyimpan urutan.");
      setServices(initialServices);
    }
  };

  const filteredServices = services.filter((s) => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase().trim();
    return (
      s.title.toLowerCase().includes(q) ||
      (s.description && s.description.toLowerCase().includes(q)) ||
      s.url.toLowerCase().includes(q)
    );
  });

  const activeCount = services.filter((s) => s.is_active).length;

  return (
    <div className="space-y-6">
      {/* Bar Atas: Tombol Tambah & Pencarian */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Cari dalam tabel layanan..."
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-white dark:bg-[#0D2218] border border-border text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-[#16A34A] focus:ring-3 focus:ring-emerald-500/15"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsAddOpen(true)}
            variant="gradient"
            size="lg"
            className="rounded-xl font-bold shadow-md shadow-emerald-950/15 gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Tambah Layanan
          </Button>
        </div>
      </div>

      {/* Info Status / Bar Ringkasan */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-xs text-muted-foreground font-medium">
        <div className="flex items-center gap-3">
          <span>
            Total: <strong className="text-foreground">{services.length}</strong>
          </span>
          <span>•</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
            {activeCount} Aktif
          </span>
          <span>•</span>
          <span>{services.length - activeCount} Nonaktif</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#C9A24B]">
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>Tip: Tarik ikon titik 6 di baris untuk mengatur urutan</span>
        </div>
      </div>

      {/* Tabel Utama dengan Drag & Drop */}
      <div className="card-madrasah bg-white dark:bg-[#0D2218] border border-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-emerald-50/50 dark:bg-emerald-950/30 text-[11px] uppercase tracking-wider font-bold text-muted-foreground">
                  <th className="py-3 px-3 w-16">Urut</th>
                  <th className="py-3 px-3 w-16">Ikon</th>
                  <th className="py-3 px-3">Judul & Deskripsi</th>
                  <th className="py-3 px-3 hidden md:table-cell">URL Layanan</th>
                  <th className="py-3 px-3 w-28">Status</th>
                  <th className="py-3 px-3 text-right w-24">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <SortableContext
                  items={filteredServices.map((s) => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {filteredServices.length > 0 ? (
                    filteredServices.map((service, index) => (
                      <DraggableServiceRow
                        key={service.id}
                        service={service}
                        index={index}
                        onEdit={(s) => setEditingService(s)}
                        onDelete={(s) => setDeletingService(s)}
                        onToggleStatus={handleToggleStatus}
                        isToggling={togglingId === service.id}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-muted-foreground">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Layers className="w-8 h-8 text-muted-foreground/60" />
                          <p className="text-sm font-semibold">
                            {filterQuery
                              ? `Tidak ada layanan yang cocok dengan "${filterQuery}"`
                              : "Belum ada layanan yang ditambahkan."}
                          </p>
                          {filterQuery && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setFilterQuery("")}
                              className="rounded-full mt-2 gap-1.5"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              Reset Filter
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </SortableContext>
              </tbody>
            </table>
          </DndContext>
        </div>
      </div>

      {/* Modal Tambah Layanan */}
      <ServiceFormDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        serviceToEdit={null}
        onSuccess={() => {
          setIsAddOpen(false);
        }}
      />

      {/* Modal Edit Layanan */}
      <ServiceFormDialog
        open={Boolean(editingService)}
        onOpenChange={(open) => !open && setEditingService(null)}
        serviceToEdit={editingService}
        onSuccess={() => {
          setEditingService(null);
        }}
      />

      {/* Modal Konfirmasi Hapus */}
      <DeleteConfirmDialog
        open={Boolean(deletingService)}
        onOpenChange={(open) => !open && setDeletingService(null)}
        service={deletingService}
        onSuccess={() => {
          setDeletingService(null);
        }}
      />
    </div>
  );
}

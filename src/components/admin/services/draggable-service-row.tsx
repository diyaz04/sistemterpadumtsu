"use client";

import * as React from "react";
import Link from "next/link";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Edit2, Trash2, ExternalLink } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ServiceIcon } from "@/components/ui/service-icon";
import { cn } from "@/lib/utils";
import type { Service, ServiceColor } from "@/types";

interface DraggableServiceRowProps {
  service: Service;
  index: number;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
  onToggleStatus: (id: string, active: boolean) => void;
  isToggling?: boolean;
}

const COLOR_GRADIENTS: Record<ServiceColor, string> = {
  green: "from-[#0F5C3A] to-[#16A34A]",
  gold: "from-[#B38E38] to-[#E3C273]",
  blue: "from-blue-600 to-sky-400",
  purple: "from-purple-700 to-indigo-500",
  teal: "from-teal-700 to-emerald-400",
  orange: "from-amber-600 to-orange-500",
};

export function DraggableServiceRow({
  service,
  index,
  onEdit,
  onDelete,
  onToggleStatus,
  isToggling = false,
}: DraggableServiceRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: service.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const gradientClass =
    COLOR_GRADIENTS[service.color] || COLOR_GRADIENTS.green;

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={cn(
        "group hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-colors border-b border-border/80",
        isDragging && "opacity-50 bg-emerald-50/80 dark:bg-emerald-950/60 shadow-lg z-30"
      )}
    >
      {/* Drag Handle & Urutan */}
      <td className="py-4 px-3 w-16">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted cursor-grab active:cursor-grabbing focus:outline-none"
            title="Tarik untuk mengubah urutan"
            aria-label="Tarik untuk mengubah urutan"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-bold text-muted-foreground">
            {index + 1}
          </span>
        </div>
      </td>

      {/* Icon Preview */}
      <td className="py-4 px-3 w-16">
        <div
          className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-xs bg-gradient-to-br shrink-0",
            gradientClass
          )}
        >
          <ServiceIcon name={service.icon} className="w-5 h-5" />
        </div>
      </td>

      {/* Judul & Deskripsi */}
      <td className="py-4 px-3 max-w-xs sm:max-w-md">
        <div className="min-w-0 pr-2">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-foreground truncate">
              {service.title}
            </p>
            {service.open_in_new_tab && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-muted text-muted-foreground">
                Tab Baru
              </span>
            )}
          </div>
          {service.description && (
            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
              {service.description}
            </p>
          )}
        </div>
      </td>

      {/* URL Link */}
      <td className="py-4 px-3 hidden md:table-cell max-w-[200px]">
        <Link
          href={service.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-mono text-emerald-700 dark:text-emerald-400 hover:underline truncate max-w-full"
          title={service.url}
        >
          <span className="truncate">{service.url}</span>
          <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
        </Link>
      </td>

      {/* Status (Switch) */}
      <td className="py-4 px-3 w-28">
        <div className="flex items-center gap-2">
          <Switch
            checked={service.is_active}
            disabled={isToggling}
            onCheckedChange={(checked) => onToggleStatus(service.id, checked)}
            aria-label={`Ubah status ${service.title}`}
          />
          <span
            className={cn(
              "text-[11px] font-semibold hidden sm:inline",
              service.is_active ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
            )}
          >
            {service.is_active ? "Aktif" : "Nonaktif"}
          </span>
        </div>
      </td>

      {/* Aksi (Edit, Hapus) */}
      <td className="py-4 px-3 text-right w-24">
        <div className="flex items-center justify-end gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onEdit(service)}
            className="w-8 h-8 rounded-lg text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60"
            title="Edit layanan"
            aria-label={`Edit ${service.title}`}
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onDelete(service)}
            className="w-8 h-8 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/60"
            title="Hapus layanan"
            aria-label={`Hapus ${service.title}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

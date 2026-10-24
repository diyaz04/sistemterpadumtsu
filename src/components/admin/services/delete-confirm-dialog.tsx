"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteServiceAction } from "@/lib/actions/services";
import type { Service } from "@/types";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service | null;
  onSuccess?: () => void;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  service,
  onSuccess,
}: DeleteConfirmDialogProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);

  if (!service) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteServiceAction(service.id);
      if (!res.success) {
        toast.error(res.error || "Gagal menghapus layanan.");
        setIsDeleting(false);
        return;
      }

      toast.success(`Layanan "${service.title}" berhasil dihapus.`);
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast.error("Terjadi kesalahan saat menghapus data.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mb-2 mx-auto sm:mx-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <DialogTitle className="text-lg font-bold text-foreground">
            Hapus Layanan Digital?
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
            Apakah Anda yakin ingin menghapus layanan{" "}
            <strong className="text-foreground">&ldquo;{service.title}&rdquo;</strong>?
            Tautan ini tidak akan dapat diakses lagi oleh pengunjung landing page.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t border-border mt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="rounded-xl"
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Menghapus...
              </span>
            ) : (
              "Ya, Hapus Layanan"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

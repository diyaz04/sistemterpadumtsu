"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { serviceSchema, type ServiceFormValues } from "@/lib/validations/website";

// Helper verifikasi hak akses admin
async function verifyAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Sesi login berakhir. Silakan masuk kembali.");
  }

  const { data: profile, error: profileError } = await (supabase
    .from("admin_profiles") as any)
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    throw new Error("Akses ditolak: Anda tidak memiliki hak akses administrator.");
  }

  return { supabase, user };
}

// 1. Tambah Layanan Baru
export async function createServiceAction(values: ServiceFormValues) {
  try {
    const { supabase } = await verifyAdmin();
    const validated = serviceSchema.parse(values);

    // Ambil sort_order tertinggi jika bernilai 0
    let sortOrder = validated.sort_order;
    if (!sortOrder || sortOrder === 0) {
      const { data: maxOrderData } = await (supabase
        .from("services") as any)
        .select("sort_order")
        .order("sort_order", { ascending: false })
        .limit(1)
        .maybeSingle();

      sortOrder = (maxOrderData?.sort_order ?? 0) + 1;
    }

    const { data, error } = await (supabase
      .from("services") as any)
      .insert({
        title: validated.title,
        description: validated.description || null,
        url: validated.url,
        icon: validated.icon,
        color: validated.color,
        sort_order: sortOrder,
        is_active: validated.is_active,
        open_in_new_tab: validated.open_in_new_tab,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/layanan");
    revalidatePath("/admin/services");

    return { success: true, data };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal menambahkan layanan.";
    return { success: false, error: msg };
  }
}

// 2. Edit Layanan
export async function updateServiceAction(id: string, values: ServiceFormValues) {
  try {
    const { supabase } = await verifyAdmin();
    const validated = serviceSchema.parse(values);

    const { data, error } = await (supabase
      .from("services") as any)
      .update({
        title: validated.title,
        description: validated.description || null,
        url: validated.url,
        icon: validated.icon,
        color: validated.color,
        sort_order: validated.sort_order,
        is_active: validated.is_active,
        open_in_new_tab: validated.open_in_new_tab,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/layanan");
    revalidatePath("/admin/services");

    return { success: true, data };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal memperbarui layanan.";
    return { success: false, error: msg };
  }
}

// 3. Hapus Layanan
export async function deleteServiceAction(id: string) {
  try {
    const { supabase } = await verifyAdmin();

    const { error } = await (supabase.from("services") as any)
      .delete()
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/layanan");
    revalidatePath("/admin/services");

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal menghapus layanan.";
    return { success: false, error: msg };
  }
}

// 4. Toggle Status Aktif/Nonaktif
export async function toggleServiceStatusAction(id: string, is_active: boolean) {
  try {
    const { supabase } = await verifyAdmin();

    const { error } = await (supabase
      .from("services") as any)
      .update({ is_active })
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/layanan");
    revalidatePath("/admin/services");

    return { success: true };
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "Gagal mengubah status layanan.";
    return { success: false, error: msg };
  }
}

// 5. Reorder Layanan (Drag & Drop)
export async function reorderServicesAction(
  items: { id: string; sort_order: number }[]
) {
  try {
    const { supabase } = await verifyAdmin();

    // Jalankan update secara paralel
    const updates = items.map((item) =>
      (supabase.from("services") as any)
        .update({ sort_order: item.sort_order })
        .eq("id", item.id)
    );

    const results = await Promise.all(updates);
    const hasError = results.some((r: any) => r.error);

    if (hasError) {
      return { success: false, error: "Beberapa urutan gagal disimpan." };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/layanan");
    revalidatePath("/admin/services");

    return { success: true };
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "Gagal menyimpan urutan layanan.";
    return { success: false, error: msg };
  }
}

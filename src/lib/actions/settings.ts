"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  siteSettingsSchema,
  type SiteSettingsFormValues,
} from "@/lib/validations/website";

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

export async function updateSiteSettingsAction(values: SiteSettingsFormValues) {
  try {
    const { supabase } = await verifyAdmin();
    const validated = siteSettingsSchema.parse(values);

    const { data, error } = await (supabase
      .from("site_settings") as any)
      .update({
        school_name: validated.school_name,
        portal_title: validated.portal_title,
        hero_badge: validated.hero_badge || null,
        hero_title: validated.hero_title,
        hero_highlight: validated.hero_highlight,
        hero_description: validated.hero_description,
        tagline: validated.tagline || null,
        footer_text: validated.footer_text || null,
        logo_url: validated.logo_url || null,
        hero_image_url: validated.hero_image_url || null,
        highlights: validated.highlights || [],
      })
      .eq("id", 1)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/pengaturan");
    revalidatePath("/admin/settings");

    return { success: true, data };
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "Gagal memperbarui pengaturan portal.";
    return { success: false, error: msg };
  }
}

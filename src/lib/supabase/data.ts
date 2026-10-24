import { createPublicClient } from "./public";
import { DEFAULT_SERVICES, DEFAULT_SITE_SETTINGS } from "@/lib/constants";
import type { Service, SiteSettings } from "@/types";

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (error || !data) {
      return DEFAULT_SITE_SETTINGS;
    }

    const item = data as unknown as SiteSettings;

    return {
      ...DEFAULT_SITE_SETTINGS,
      ...item,
      logo_url: item.logo_url || DEFAULT_SITE_SETTINGS.logo_url,
      highlights:
        Array.isArray(item.highlights) && item.highlights.length > 0
          ? item.highlights
          : DEFAULT_SITE_SETTINGS.highlights,
    };
  } catch (err) {
    console.warn("Using default site_settings fallback:", err);
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function getServices(): Promise<Service[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_SERVICES;
    }

    return data as unknown as Service[];
  } catch (err) {
    console.warn("Using default services fallback:", err);
    return DEFAULT_SERVICES;
  }
}

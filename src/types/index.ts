import type { Database, ServiceColor } from "./database";

export * from "./database";

// Entity Types
export type Service = Database["public"]["Tables"]["services"]["Row"];
export type ServiceInsert = Database["public"]["Tables"]["services"]["Insert"];
export type ServiceUpdate = Database["public"]["Tables"]["services"]["Update"];

export type SiteSettings = Database["public"]["Tables"]["site_settings"]["Row"];
export type SiteSettingsInsert = Database["public"]["Tables"]["site_settings"]["Insert"];
export type SiteSettingsUpdate = Database["public"]["Tables"]["site_settings"]["Update"];

export type AdminProfile = Database["public"]["Tables"]["admin_profiles"]["Row"];
export type AdminProfileInsert = Database["public"]["Tables"]["admin_profiles"]["Insert"];
export type AdminProfileUpdate = Database["public"]["Tables"]["admin_profiles"]["Update"];

// Color Mapping Helpers for Service Cards
export const SERVICE_COLOR_STYLES: Record<
  ServiceColor,
  {
    bg: string;
    text: string;
    border: string;
    gradient: string;
    badge: string;
  }
> = {
  green: {
    bg: "bg-emerald-50 dark:bg-emerald-950/50",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-900/60",
    gradient: "from-[#0F5C3A] to-[#16A34A]",
    badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300",
  },
  gold: {
    bg: "bg-amber-50 dark:bg-amber-950/50",
    text: "text-[#C9A24B] dark:text-[#E3C273]",
    border: "border-amber-200 dark:border-amber-900/60",
    gradient: "from-[#B38E38] to-[#E3C273]",
    badge: "bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300",
  },
  blue: {
    bg: "bg-sky-50 dark:bg-sky-950/50",
    text: "text-sky-700 dark:text-sky-400",
    border: "border-sky-200 dark:border-sky-900/60",
    gradient: "from-sky-700 to-sky-500",
    badge: "bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-950/50",
    text: "text-purple-700 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-900/60",
    gradient: "from-purple-700 to-purple-500",
    badge: "bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300",
  },
  teal: {
    bg: "bg-teal-50 dark:bg-teal-950/50",
    text: "text-teal-700 dark:text-teal-400",
    border: "border-teal-200 dark:border-teal-900/60",
    gradient: "from-teal-700 to-teal-500",
    badge: "bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300",
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-950/50",
    text: "text-orange-700 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-900/60",
    gradient: "from-orange-600 to-amber-500",
    badge: "bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300",
  },
};

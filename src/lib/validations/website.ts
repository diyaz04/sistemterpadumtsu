import { z } from "zod";

export const serviceColorEnum = z.enum([
  "green",
  "gold",
  "blue",
  "purple",
  "teal",
  "orange",
]);

export const serviceSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Judul layanan minimal 2 karakter" })
    .max(100, { message: "Judul layanan maksimal 100 karakter" }),
  description: z
    .string()
    .max(300, { message: "Deskripsi maksimal 300 karakter" })
    .optional()
    .nullable(),
  url: z
    .string()
    .min(1, { message: "URL wajib diisi" })
    .url({ message: "Format URL tidak valid" })
    .refine((val) => val.startsWith("https://"), {
      message: "URL wajib menggunakan protokol https://",
    }),
  icon: z.string().min(1, { message: "Icon wajib dipilih" }),
  color: serviceColorEnum,
  sort_order: z.coerce.number().int().default(0),
  is_active: z.boolean().default(true),
  open_in_new_tab: z.boolean().default(true),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;

export const siteSettingsSchema = z.object({
  school_name: z.string().min(2, { message: "Nama madrasah minimal 2 karakter" }),
  portal_title: z.string().min(2, { message: "Judul portal minimal 2 karakter" }),
  hero_badge: z.string().optional().nullable(),
  hero_title: z.string().min(2, { message: "Hero title wajib diisi" }),
  hero_highlight: z.string().min(2, { message: "Hero highlight wajib diisi" }),
  hero_description: z.string().min(5, { message: "Hero description minimal 5 karakter" }),
  tagline: z.string().optional().nullable(),
  footer_text: z.string().optional().nullable(),
  logo_url: z.string().url().optional().nullable().or(z.literal("")),
  hero_image_url: z.string().url().optional().nullable().or(z.literal("")),
  highlights: z.array(z.string()).default([]),
});

export type SiteSettingsFormValues = z.infer<typeof siteSettingsSchema>;

export const loginSchema = z.object({
  email: z.string().email({ message: "Format email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

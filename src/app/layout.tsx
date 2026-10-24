import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Toaster } from "sonner";
import { getSiteSettings } from "@/lib/supabase/data";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  const title = `${settings.portal_title} - ${settings.school_name}`;
  const description =
    settings.hero_description ||
    `${settings.portal_title} ${settings.school_name} - Akses cepat, terpadu, dan transparan ke seluruh website, aplikasi, dan layanan digital madrasah.`;
  const logo = settings.logo_url || "/logo.png";
  const heroImg = settings.hero_image_url || logo;

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "https://mts-wahabmuhsin.sch.id"
    ),
    title: {
      default: title,
      template: `%s | ${settings.school_name}`,
    },
    description,
    keywords: [
      settings.school_name,
      settings.portal_title,
      "Madrasah Tsanawiyah KH A Wahab Muhsin",
      "MTs KH A Wahab Muhsin",
      "Sukahideng Tasikmalaya",
      "Portal Digital Madrasah",
      "Layanan Madrasah",
      "Website Sekolah Islam",
      "Pendidikan Islam Unggul",
    ],
    authors: [{ name: settings.school_name }],
    creator: settings.school_name,
    publisher: settings.school_name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: [
        { url: logo, sizes: "any" },
        { url: "/icon.png", type: "image/png" },
        { url: "/favicon.ico" },
      ],
      shortcut: logo,
      apple: [{ url: logo, sizes: "180x180", type: "image/png" }],
    },
    openGraph: {
      type: "website",
      locale: "id_ID",
      siteName: settings.portal_title,
      title,
      description,
      images: [
        {
          url: heroImg,
          width: 1200,
          height: 630,
          alt: `${settings.portal_title} ${settings.school_name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [heroImg],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable}`}
    >
      <body className="min-h-screen flex flex-col font-sans antialiased bg-background text-foreground selection:bg-emerald-700 selection:text-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}

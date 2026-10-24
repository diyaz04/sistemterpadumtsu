import { getSiteSettings, getServices } from "@/lib/supabase/data";
import { Navbar, Footer } from "@/components/layout";
import { Hero, ServiceGrid } from "@/components/home";
import { SearchProvider } from "@/context/search-context";
import { MapPin, Mail, Clock, Award, Shield } from "lucide-react";

// Revalidate data setiap 60 detik (ISR)
export const revalidate = 60;

export default async function Home() {
  const [settings, services] = await Promise.all([
    getSiteSettings(),
    getServices(),
  ]);

  return (
    <SearchProvider>
      <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
        {/* Decorative Top Gold Line */}
        <div className="gold-line" />

        {/* Sticky Navbar */}
        <Navbar settings={settings} services={services} />

        <main className="flex-1">
          {/* Section Hero */}
          <Hero settings={settings} />

          {/* Section Jelajahi Layanan Digital */}
          <ServiceGrid services={services} />

          {/* Section Tentang Portal */}
          <section
            id="tentang"
            className="py-16 sm:py-20 bg-background border-t border-emerald-100/70 dark:border-emerald-950/70 relative scroll-mt-20"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="card-madrasah p-6 flex flex-col items-start">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-[#0F5C3A] dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    Keamanan & Privasi
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    Setiap tautan dan platform dikelola secara tersentralisasi dengan
                    standar keamanan data santri dan warga madrasah.
                  </p>
                </div>

                <div className="card-madrasah p-6 flex flex-col items-start">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-[#C9A24B] border border-amber-200 dark:border-amber-900/50 flex items-center justify-center mb-4">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    Standar Mutu Unggul
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    Mendukung visi MTs KH A. Wahab Muhsin dalam mencetak generasi
                    berprestasi, berakhlak mulia, dan berwawasan teknologi.
                  </p>
                </div>

                <div className="card-madrasah p-6 flex flex-col items-start">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 border border-teal-100 dark:border-teal-900/50 flex items-center justify-center mb-4">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    Akses Cepat 24 Jam
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    Kemudahan akses bagi santri, wali santri, guru, dan tenaga
                    kependidikan kapan pun dan di mana pun.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section Kontak Madrasah */}
          <section
            id="kontak"
            className="py-12 bg-emerald-50/50 dark:bg-[#071911]/50 border-t border-emerald-100/60 dark:border-emerald-950/60 scroll-mt-20"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C9A24B]">
                    PUSAT BANTUAN & INFORMASI
                  </span>
                  <h3 className="text-xl font-bold text-foreground mt-1">
                    Hubungi MTs KH A. Wahab Muhsin
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                    Butuh bantuan mengenai akun atau tautan layanan madrasah? Tim
                    administrasi kami siap membantu.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a
                    href="mailto:info@mtswahabmuhsin.sch.id"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white dark:bg-[#0D2218] border border-emerald-200 dark:border-emerald-900/70 text-xs font-semibold text-foreground hover:bg-emerald-50 dark:hover:bg-emerald-950/50 shadow-xs transition-colors"
                  >
                    <Mail className="w-4 h-4 text-[#16A34A]" />
                    info@mtswahabmuhsin.sch.id
                  </a>
                  <a
                    href="https://mtswahabmuhsin.sch.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white dark:bg-[#0D2218] border border-emerald-200 dark:border-emerald-900/70 text-xs font-semibold text-foreground hover:bg-emerald-50 dark:hover:bg-emerald-950/50 shadow-xs transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-[#C9A24B]" />
                    mtswahabmuhsin.sch.id
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <Footer settings={settings} />
      </div>
    </SearchProvider>
  );
}

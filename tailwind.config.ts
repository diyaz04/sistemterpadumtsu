import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        madrasah: {
          primary: "#0F5C3A",
          accent: "#16A34A",
          gold: "#C9A24B",
          section: "#F8FAF9",
          dark: "#081710",
        },
        gold: {
          DEFAULT: "#C9A24B",
          light: "#E3C273",
          dark: "#9E7B2B",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
      },
      boxShadow: {
        madrasah: "0 4px 20px -2px rgba(15, 92, 58, 0.08)",
        "madrasah-hover": "0 12px 30px -4px rgba(15, 92, 58, 0.16)",
      },
    },
  },
  plugins: [],
};

export default config;

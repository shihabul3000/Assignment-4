import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#2563EB", // Blue 600
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#475569", // Slate 600
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#0D9488", // Teal 600
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F1F5F9", // Slate 100
          foreground: "#64748B", // Slate 500
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        heading: ['var(--font-outfit)'],
      }
    },
  },
  plugins: [],
};
export default config;

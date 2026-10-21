import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#060b13",
          card: "rgba(14, 25, 44, 0.75)",
          border: "rgba(255, 255, 255, 0.08)",
          emerald: "#10b981",
          cyan: "#06b6d4",
          purple: "#c084fc",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
      },
    },
  },
  plugins: [],
};

export default config;

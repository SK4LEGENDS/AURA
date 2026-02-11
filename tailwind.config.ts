import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "var(--brand-primary)",
          secondary: "var(--brand-secondary)",
        },
        status: {
          high: "var(--status-high)",
          medium: "var(--status-medium)",
          low: "var(--status-low)",
        },
        ui: {
          background: "var(--background)",
          surface: "var(--surface)",
          border: "var(--border)",
        },
        // Legacy support while refactoring
        lavender: {
          50: "#f8f5fc",
          100: "#efe6f9",
          200: "#dfccf3",
          300: "#c29be6",
          400: "#a56fd6",
          500: "#8e4bc5",
          600: "#7735ac",
          700: "#60288a",
          800: "#4f236e",
          900: "#421e5a",
        },
        midnight: "#10101a",
        canvas: "#f6f2fb",
      },
      boxShadow: {
        card: "0 20px 45px -20px rgba(82, 38, 115, 0.45)",
      },
    },
  },
  plugins: [],
};

export default config;


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
        papaya: {
          50: "#fff8f1",
          100: "#ffeedf",
          200: "#ffd9bd",
          300: "#ffba8d",
          400: "#ff8d54",
          500: "#ff6d2b",
          600: "#f0501a",
          700: "#c73916",
          800: "#9e2f18",
          900: "#7f2918",
        },
        midnight: "#10101a",
        canvas: "#fffbf7",
      },
      boxShadow: {
        card: "0 20px 45px -20px rgba(240, 80, 26, 0.45)",
      },
    },
  },
  plugins: [],
};

export default config;


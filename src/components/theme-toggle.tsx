"use client";

import { useTheme } from "next-themes";

import { useSettings } from "@/lib/settings-context";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { accentColor } = useSettings();
  if (typeof window === "undefined") return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-full border border-white/30 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] shadow-card transition hover:bg-white dark:bg-black/40 dark:text-white"
      style={{ color: !isDark ? accentColor : undefined }}
    >
      {isDark ? "LIGHT" : "DARK"}
    </button>
  );
}


"use client";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      onClick={() => setTheme(next)}
      className="relative flex items-center justify-center w-10 h-10 rounded-full glass border border-[color-mix(in_oklab,var(--foreground)_12%,transparent)] hover:border-[--color-accent] hover:shadow-[0_0_12px_color-mix(in_oklab,var(--color-accent)_35%,transparent)] transition"
      aria-label="Tema değiştir"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-[--color-accent]" />
      ) : (
        <Moon className="w-5 h-5 text-[--color-accent]" />
      )}
    </button>
  );
}

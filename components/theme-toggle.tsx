"use client";
import { useTheme } from "next-themes";
export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      onClick={() => setTheme(next)}
      className="rounded-lg border px-3 py-2 text-sm hover:border-teal-300 hover:shadow-neon transition"
      aria-label="Tema değiştir"
    >
      {theme === "dark" ? "Açık Tema" : "Koyu Tema"}
    </button>
  );
}

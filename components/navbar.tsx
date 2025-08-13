"use client";

import Link from "next/link";
import ThemeToggle from "./theme-toggle";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

const nav = [
  { href: "/hakkinda", label: "Hakkında" },
  { href: "/takvim", label: "Takvim" },
  { href: "/kurallar", label: "Kurallar" },
  { href: "/duyurular", label: "Duyurular" },
  { href: "/kayit", label: "Kayıt" },
  // Panel ve Admin’i ihtiyaç olursa aç:
  // { href: "/panel", label: "Panel" },
  // { href: "/admin", label: "Admin" },
];

export default function Navbar() {
  const pathname = usePathname();

  const items = useMemo(
    () =>
      nav.map((i) => ({
        ...i,
        active:
          i.href === "/"
            ? pathname === "/"
            : pathname === i.href || pathname.startsWith(i.href + "/"),
      })),
    [pathname]
  );

  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-slate-900/70">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-extrabold tracking-tight">
          Şehitkamil Game Jam
        </Link>

        <div className="flex items-center gap-3">
          {items.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              aria-current={i.active ? "page" : undefined}
              className={`text-sm px-2 py-1 rounded-md transition ${
                i.active
                  ? "bg-slate-100 dark:bg-slate-800"
                  : "hover:underline"
              }`}
            >
              {i.label}
            </Link>
          ))}

          {/* Giriş butonu */}
          <Link
            className="text-sm rounded-lg bg-primary px-3 py-2 text-white hover:bg-primary-600 shadow-neon"
            href="/login" // DİKKAT: /(auth)/login değil
          >
            Giriş
          </Link>

          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}

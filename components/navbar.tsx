"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./theme-toggle";

const nav = [
  { href: "/hakkinda", label: "Hakkında" },
  { href: "/takvim", label: "Takvim" },
  { href: "/kurallar", label: "Kurallar" },
  { href: "/duyurular", label: "Duyurular" },
  { href: "/kayit", label: "Kayıt" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 glass">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-base md:text-lg font-extrabold tracking-tight">
          Şehitkamil Game Jam
        </Link>

        <div className="flex items-center gap-2 md:gap-3">
          {nav.map((i) => {
            const active =
              pathname === i.href || pathname.startsWith(i.href + "/");
            return (
              <Link
                key={i.href}
                href={i.href}
                aria-current={active ? "page" : undefined}
                className="link-underline text-sm px-2 py-1 rounded-md hover:bg-[color-mix(in_oklab,var(--foreground)_6%,transparent)]"
              >
                {i.label}
              </Link>
            );
          })}

          <Link
            href="/login"
            className="text-sm rounded-lg px-3 py-2 text-[color:var(--background)] bg-[--color-primary] hover:bg-[--color-primary-600] btn-neon"
          >
            Giriş
          </Link>

          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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

  // 🚫 Panel/Admin/Auth altında görünmesin
  const HIDE_PREFIXES = ["/panel", "/admin", "/auth"];
  if (pathname && HIDE_PREFIXES.some((p) => pathname.startsWith(p))) {
    return null;
  }

  const [isAuth, setIsAuth] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const authCookieRegex =
      /(?:^|;\s*)(auth-token|sj_session|next-auth\.session-token)=/;
    setIsAuth(authCookieRegex.test(document.cookie));

    // scroll listener
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
  className={`sticky top-0 z-40 w-full transition-colors duration-300 ${
    isScrolled
      ? "backdrop-blur border-b border-black/5 dark:border-white/10"
      : "bg-white dark:bg-black border-b border-transparent"
  }`}
>
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="text-base md:text-lg font-extrabold tracking-tight whitespace-nowrap"
        >
          Şehitkamil Game Jam
        </Link>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Normal linkler */}
          {nav
            .filter((i) => i.href !== "/kayit")
            .map((i) => {
              const active =
                pathname === i.href || pathname?.startsWith(i.href + "/");
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

          {/* Giriş/Kayıt vs. */}
          {mounted && !isAuth && (
            <>
              <Link
                href="/kayit"
                className="group relative inline-flex items-center justify-center
                  rounded-xl px-3.5 py-2 text-sm font-semibold
                  text-[color:var(--background)]
                  bg-gradient-to-r from-fuchsia-600 to-cyan-500
                  transition-all duration-300 hover:scale-105
                  hover:shadow-[0_0_16px_#ff00ff,0_0_22px_#00ffff]"
              >
                Kayıt
              </Link>
              <Link
                href="/login"
                className="group relative inline-flex items-center justify-center
                  rounded-xl px-3.5 py-2 text-sm font-semibold
                  text-[color:var(--background)]
                  bg-[--color-primary] hover:bg-[--color-primary-600]
                  transition-all duration-300 hover:scale-105
                  hover:shadow-[0_0_14px_#ff00ff,0_0_18px_#00ffff]"
              >
                Giriş
              </Link>
            </>
          )}

          {mounted && isAuth && (
            <Link
              href="/panel"
              className="rounded-xl border px-3.5 py-2 text-sm font-semibold hover:bg-[color-mix(in_oklab,var(--foreground)_6%,transparent)]"
            >
              Panel
            </Link>
          )}

          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}

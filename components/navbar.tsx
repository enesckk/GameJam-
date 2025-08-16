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

  // Bu prefixlerde navbar'ı hiç gösterme
  const HIDE_PREFIXES = ["/panel", "/admin", "/auth"];
  if (pathname && HIDE_PREFIXES.some((p) => pathname.startsWith(p))) {
    return null;
  }

  const [isAuth, setIsAuth] = useState(false);
  const [mounted, setMounted] = useState(false);

  // scroll state
  const [isScrolled, setIsScrolled] = useState(false);
  const THRESHOLD = 12;

  useEffect(() => {
    setMounted(true);
    const authCookieRegex =
      /(?:^|;\s*)(auth-token|sj_session|next-auth\.session-token)=/;
    setIsAuth(authCookieRegex.test(document.cookie));

    const onScroll = () => setIsScrolled((window.scrollY || 0) > THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        // şeffaf, hiçbir zaman renk verme
        "sticky top-0 z-40 w-full overflow-x-clip isolate bg-transparent",
        // sadece ilgili özellikleri animasyonla
        "transition-[backdrop-filter,border-color,box-shadow] duration-300",
        // tepedeyken: blur tamamen kapalı + sınır çizgisi yok
        !isScrolled
          ? "backdrop-blur-0 border-b border-transparent"
          // aşağıda: sadece blur; RENK YOK (bg-transparent)
          : "supports-[backdrop-filter]:backdrop-blur-md border-b border-black/10 dark:border-white/10 shadow-[0_6px_20px_rgba(0,0,0,0.12)]",
      ].join(" ")}
    >
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="text-base md:text-lg font-extrabold tracking-tight whitespace-nowrap"
        >
          Şehitkamil Game Jam
        </Link>

        {/* Linkler */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
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

          {/* Oturuma göre CTA'lar */}
          {mounted && !isAuth ? (
            <>
              <Link
                href="/kayit"
                className="
                  group relative inline-flex items-center justify-center
                  rounded-xl px-3.5 py-2 text-sm font-semibold
                  text-[color:var(--background)]
                  bg-gradient-to-r from-fuchsia-600 to-cyan-500
                  transition-all duration-300 hover:scale-105
                  hover:shadow-[0_0_16px_#ff00ff,0_0_22px_#00ffff]
                "
              >
                Kayıt
              </Link>

              <Link
                href="/login"
                className="
                  group relative inline-flex items-center justify-center
                  rounded-xl px-3.5 py-2 text-sm font-semibold
                  text-[color:var(--background)]
                  bg-[--color-primary] hover:bg-[--color-primary-600]
                  transition-all duration-300 hover:scale-105
                  hover:shadow-[0_0_14px_#ff00ff,0_0_18px_#00ffff]
                "
              >
                Giriş
              </Link>
            </>
          ) : mounted && isAuth ? (
            <Link
              href="/panel"
              className="rounded-xl border px-3.5 py-2 text-sm font-semibold hover:bg-[color-mix(in_oklab,var(--foreground)_6%,transparent)]"
            >
              Panel
            </Link>
          ) : null}

          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}

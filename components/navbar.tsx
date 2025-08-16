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
  { href: "/kayit", label: "Kayıt" }, // CTA
];

export default function Navbar() {
  const pathname = usePathname();

  // /panel ve /admin altında navbar'ı gösterme
  const HIDE_PREFIXES = ["/panel", "/admin"];
  if (pathname && HIDE_PREFIXES.some((p) => pathname.startsWith(p))) return null;

  const [isAuth, setIsAuth] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const authCookieRegex = /(?:^|;\s*)(auth-token|sj_session|next-auth\.session-token)=/;
    setIsAuth(authCookieRegex.test(document.cookie));

    const handleScroll = () => setIsScrolled((window.scrollY || 0) > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={[
        "sticky top-0 z-40 w-full overflow-x-clip isolate",
        // sadece ilgili özellikleri animate et (opacity/scale sapıtmasın)
        "transition-[background,backdrop-filter,border-color,box-shadow] duration-300",
        // TEPEDE: tam beyaz/siyah + blur kapalı (Safari’de kalıntı olmasın diye 'backdrop-blur-0' zorunlu)
        !isScrolled
          ? "bg-white dark:bg-black border-b border-black/5 dark:border-white/10 backdrop-blur-0"
          // AŞAĞIDA: yarı saydam + blur + hafif gölge
          : "bg-white/70 dark:bg-black/70 supports-[backdrop-filter]:backdrop-blur-md supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/60 border-b border-black/10 dark:border-white/10 shadow-[0_6px_20px_rgba(0,0,0,0.18)]",
      ].join(" ")}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-base md:text-lg font-extrabold tracking-tight">
          Şehitkamil Game Jam
        </Link>

        <div className="flex items-center gap-2 md:gap-3">
          {nav
            .filter((i) => i.href !== "/kayit")
            .map((i) => {
              const active = pathname === i.href || pathname?.startsWith(i.href + "/");
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

          {mounted && !isAuth && (
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
                  before:content-[''] before:absolute before:inset-0
                  before:rounded-xl before:pointer-events-none before:opacity-0
                  group-hover:before:opacity-100 group-hover:before:p-[2px]
                  group-hover:before:[background:linear-gradient(90deg,#ff00ff,#8000ff,#00ffff)]
                  group-hover:before:[-webkit-mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)]
                  group-hover:before:[-webkit-mask-composite:xor] group-hover:before:[mask-composite:exclude]
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
                  before:content-[''] before:absolute before:inset-0
                  before:rounded-xl before:pointer-events-none before:opacity-0
                  group-hover:before:opacity-100 group-hover:before:p-[2px]
                  group-hover:before:[background:linear-gradient(90deg,#ff00ff,#8000ff,#00ffff)]
                  group-hover:before:[-webkit-mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)]
                  group-hover:before:[-webkit-mask-composite:xor] group-hover:before:[mask-composite:exclude]
                "
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

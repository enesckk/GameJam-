// app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import VideoBG from "@/components/background/video-bg";
import Card from "@/components/ui/card";
import ForceLogoutOnBack from "./_force-logout-on-back";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const search = useSearchParams();

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passOk = password.length >= 6;
  const allOk = emailOk && passOk;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!allOk) {
      setErr("Lütfen tüm alanları doğru doldurun.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // cookies için önemli
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password,
        }),
      });

      const j = await res.json().catch(() => null);

      if (!res.ok) {
        setErr(j?.message || "Giriş yapılamadı.");
        return;
      }

      // Backend zaten displayName cookie'sini set ediyor.
      // Yine de UI anlık güncellensin diye storage/event kullanabiliriz:
      const pickName = (obj: any) =>
        obj?.fullName || obj?.name || obj?.adSoyad || null;
      const fullName =
        pickName(j?.user) ||
        pickName(j) ||
        sessionStorage.getItem("displayName") ||
        localStorage.getItem("displayName") ||
        null;

      if (fullName) {
        sessionStorage.setItem("displayName", fullName);
        localStorage.setItem("displayName", fullName);
        window.dispatchEvent(new CustomEvent("user:name", { detail: fullName }));
      }

      // Öncelik sırası: backend redirectTo -> URL ?redirectTo -> role fallback
      const qsRedirect = search.get("redirectTo");
      const fallback = j?.role === "ADMIN" ? "/admin" : "/panel";
      const target = j?.redirectTo || qsRedirect || fallback;

      // Hard navigation: temiz başlangıç
      window.location.replace(target);
      // SPA istersen: router.replace(target); window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Geri tuşuyla gelindiğinde otomatik logout */}
      <ForceLogoutOnBack />

      {/* Arka plan video */}
      <VideoBG
        overlay
        mode="auto"
        opacity={0.9}
        light={{
          webm: "/videos/light-bg.webm",
          mp4: "/videos/bg-light.mp4",
          poster: "/images/light-bg.jpg",
        }}
        dark={{
          webm: "/videos/dark-bg.webm",
          mp4: "/videos/bg-dark.mp4",
          poster: "/images/dark-bg.jpg",
        }}
      />

      {/* İçerik */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4">
        <Card className="w-full max-w-md rounded-2xl border border-black/10 bg-white/80 p-8 backdrop-blur-md shadow-xl">
          <h1
            className="mb-6 text-center text-3xl font-bold"
            style={{ color: "var(--foreground)" }}
          >
            Giriş Yap
          </h1>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label
                className="mb-1 block text-sm"
                style={{
                  color: "color-mix(in oklab, var(--foreground) 80%, transparent)",
                }}
              >
                E-posta
              </label>
              <input
                className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2 text-gray-900 outline-none transition focus:ring-2 focus:ring-emerald-400 dark:border-white/20 dark:bg-white/80"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="ornek@mail.com"
                autoComplete="username"
              />
              {!emailOk && email !== "" && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-200">
                  Geçerli bir e-posta girin.
                </p>
              )}
            </div>

            <div>
              <label
                className="mb-1 block text-sm"
                style={{
                  color: "color-mix(in oklab, var(--foreground) 80%, transparent)",
                }}
              >
                Şifre
              </label>
              <input
                className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2 text-gray-900 outline-none transition focus:ring-2 focus:ring-emerald-400 dark:border-white/20 dark:bg-white/80"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••"
                autoComplete="current-password"
              />
              {!passOk && password !== "" && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-200">
                  Şifre en az 6 karakter olmalı.
                </p>
              )}
            </div>

            {err && (
              <p className="rounded-lg bg-red-500/15 p-2 text-sm text-red-700 dark:text-red-100">
                {err}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !allOk}
              className={[
                "group relative w-full overflow-hidden rounded-xl px-5 py-3 font-semibold transition-all duration-300",
                "bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 ring-1 ring-emerald-400/30",
                "hover:shadow-emerald-500/60 hover:ring-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300",
                "active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60",
                "before:pointer-events-none before:absolute before:inset-0 before:-translate-x-full",
                "before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent",
                "before:transition-transform before:duration-500 group-hover:before:translate-x-full",
              ].join(" ")}
            >
              {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between text-sm">
            <Link
              href="/forgot-password"
              className="rounded px-1 underline-offset-4 transition hover:underline hover:decoration-emerald-400 hover:decoration-2 hover:text-emerald-700 hover:drop-shadow dark:hover:text-emerald-300"
              style={{
                color: "color-mix(in oklab, var(--foreground) 80%, transparent)",
              }}
            >
              Şifremi Unuttum
            </Link>
            <Link
              href="/kayit"
              className="rounded px-1 underline-offset-4 transition hover:underline hover:decoration-emerald-400 hover:decoration-2 hover:text-emerald-700 hover:drop-shadow dark:hover:text-emerald-300"
              style={{
                color: "color-mix(in oklab, var(--foreground) 80%, transparent)",
              }}
            >
              Kayıt Ol
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

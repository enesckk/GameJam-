// app/(public)/login/page.tsx  ← kendi yoluna göre isim değişebilir
"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Card from "@/components/ui/card";
import ForceLogoutOnBack from "./_force-logout-on-back";

function LoginContent() {
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
        credentials: "include",
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

      const qsRedirect = search.get("redirectTo");
      const fallback = j?.role === "ADMIN" ? "/admin" : "/panel";
      const target = j?.redirectTo || qsRedirect || fallback;

      window.location.replace(target);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        relative isolate min-h-screen overflow-hidden
        text-white dark:text-white
        bg-gradient-to-b from-white via-gray-100 to-gray-200
        dark:from-slate-950 dark:via-slate-900 dark:to-slate-900
      "
    >
      <ForceLogoutOnBack />

      {/* Katman A: büyük mesh */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute -z-10 inset-[-20%] opacity-80
          [background:radial-gradient(55%_60%_at_20%_15%,rgba(99,102,241,.35),transparent_60%),radial-gradient(60%_55%_at_85%_25%,rgba(34,197,94,.30),transparent_60%)]
          motion-safe:animate-[meshPan_18s_ease-in-out_infinite]
        "
        style={{ mixBlendMode: "screen" }}
      />

      {/* Katman B: küçük mesh */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute -z-10 inset-[-30%] opacity-70
          [background:radial-gradient(45%_50%_at_30%_80%,rgba(56,189,248,.30),transparent_60%),radial-gradient(50%_45%_at_75%_70%,rgba(244,114,182,.28),transparent_60%)]
          motion-safe:animate-[meshPanAlt_12s_ease-in-out_infinite]
        "
        style={{ mixBlendMode: "screen" }}
      />

      {/* Katman C: conic swirl */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute -z-10 -inset-[25%] opacity-60
          [background:conic-gradient(from_210deg_at_50%_50%,rgba(14,165,233,.35),rgba(139,92,246,.35),rgba(34,197,94,.25),rgba(14,165,233,.35))]
          motion-safe:animate-[swirl_22s_linear_infinite]
          rounded-[9999px] blur-3xl
        "
        style={{ mixBlendMode: "screen" }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4">
        <Card className="w-full max-w-md rounded-2xl border border-black/10 bg-white/80 p-8 backdrop-blur-md shadow-xl dark:border-white/10 dark:bg-white/10">
          <h1 className="mb-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
            Giriş Yap
          </h1>

          <form onSubmit={submit} className="space-y-4">
            {/* E-posta input */}
            <div>
              <label className="mb-1 block text-sm text-gray-700 dark:text-gray-200">
                E-posta
              </label>
              <input
                className="w-full rounded-xl border px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 dark:border-white/10 dark:bg-white/5 dark:text-gray-100"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="ornek@mail.com"
                autoComplete="username"
              />
              {!emailOk && email !== "" && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-300">
                  Geçerli bir e-posta girin.
                </p>
              )}
            </div>

            {/* Şifre input */}
            <div>
              <label className="mb-1 block text-sm text-gray-700 dark:text-gray-200">
                Şifre
              </label>
              <input
                className="w-full rounded-xl border px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 dark:border-white/10 dark:bg-white/5 dark:text-gray-100"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••"
                autoComplete="current-password"
              />
              {!passOk && password !== "" && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-300">
                  Şifre en az 6 karakter olmalı.
                </p>
              )}
            </div>

            {err && (
              <p className="rounded-lg bg-red-500/15 p-2 text-sm text-red-700 dark:text-red-300">
                {err}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !allOk}
              className="w-full rounded-xl bg-emerald-600 px-5 py-3 text-white shadow-lg hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between text-sm text-gray-700 dark:text-gray-200">
            <Link href="/forgot-password" className="hover:underline">
              Şifremi Unuttum
            </Link>
            <Link href="/kayit" className="hover:underline">
              Kayıt Ol
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}

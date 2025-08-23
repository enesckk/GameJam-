// app/(public)/login/page.tsx
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
        text-white
        bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900
      "
    >
      <ForceLogoutOnBack />

      {/* Arka plan renkli layer */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute -z-10 inset-0
          bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20
        "
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4">
        <Card
          className="
            w-full max-w-md rounded-xl
            border border-white/15
            bg-white/10
            backdrop-blur-2xl supports-[backdrop-filter]:backdrop-blur-2xl
            backdrop-saturate-150
            shadow-2xl
            p-8
          "
        >
          <h1 className="mb-6 text-center text-3xl font-bold text-white">
            Giriş Yap
          </h1>

          <form onSubmit={submit} className="space-y-4">
            {/* E-posta input */}
            <div>
              <label className="mb-1 block text-sm text-slate-200">
                E-posta
              </label>
              <input
                className="
                  w-full rounded-xl
                  border border-slate-600
                  bg-slate-800/90
                  px-3 py-2 text-white placeholder:text-slate-400
                  focus:outline-none focus:ring-2 focus:ring-emerald-500/60
                "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="ornek@mail.com"
                autoComplete="username"
              />
              {!emailOk && email !== "" && (
                <p className="mt-1 text-xs text-red-300">
                  Geçerli bir e-posta girin.
                </p>
              )}
            </div>

            {/* Şifre input */}
            <div>
              <label className="mb-1 block text-sm text-slate-200">
                Şifre
              </label>
              <input
                className="
                  w-full rounded-xl
                  border border-slate-600
                  bg-slate-800/90
                  px-3 py-2 text-white placeholder:text-slate-400
                  focus:outline-none focus:ring-2 focus:ring-emerald-500/60
                "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••"
                autoComplete="current-password"
              />
              {!passOk && password !== "" && (
                <p className="mt-1 text-xs text-red-300">
                  Şifre en az 6 karakter olmalı.
                </p>
              )}
            </div>

            {err && (
              <p className="rounded-lg bg-red-500/15 p-2 text-sm text-red-300">
                {err}
              </p>
            )}

            <button
              type="submit"
              disabled={!allOk || loading}
              className="
                w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white
                transition-colors duration-200
                hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/60
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>

            <div className="text-center text-sm text-slate-300">
              Hesabınız yok mu?{" "}
              <Link
                href="/kayit"
                className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
              >
                Kayıt olun
              </Link>
            </div>

            <div className="text-center text-sm text-slate-300">
              <Link
                href="/forgot-password"
                className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
              >
                Şifremi unuttum
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <LoginContent />
    </Suspense>
  );
}

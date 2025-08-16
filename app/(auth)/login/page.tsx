"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import VideoBG from "@/components/background/video-bg";
import Card from "@/components/ui/card";
import ForceLogoutOnBack from "./_force-logout-on-back";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const search = useSearchParams(); // artık Suspense içinde

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
    <div className="relative min-h-screen">
      <ForceLogoutOnBack />
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

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4">
        <Card className="w-full max-w-md rounded-2xl border border-black/10 bg-white/80 p-8 backdrop-blur-md shadow-xl">
          <h1 className="mb-6 text-center text-3xl font-bold">Giriş Yap</h1>

          <form onSubmit={submit} className="space-y-4">
            {/* E-posta input */}
            <div>
              <label className="mb-1 block text-sm">E-posta</label>
              <input
                className="w-full rounded-xl border px-3 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="ornek@mail.com"
                autoComplete="username"
              />
              {!emailOk && email !== "" && (
                <p className="mt-1 text-xs text-red-600">Geçerli bir e-posta girin.</p>
              )}
            </div>

            {/* Şifre input */}
            <div>
              <label className="mb-1 block text-sm">Şifre</label>
              <input
                className="w-full rounded-xl border px-3 py-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••"
                autoComplete="current-password"
              />
              {!passOk && password !== "" && (
                <p className="mt-1 text-xs text-red-600">Şifre en az 6 karakter olmalı.</p>
              )}
            </div>

            {err && <p className="rounded-lg bg-red-500/15 p-2 text-sm text-red-700">{err}</p>}

            <button
              type="submit"
              disabled={loading || !allOk}
              className="w-full rounded-xl bg-emerald-600 px-5 py-3 text-white"
            >
              {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between text-sm">
            <Link href="/forgot-password">Şifremi Unuttum</Link>
            <Link href="/kayit">Kayıt Ol</Link>
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

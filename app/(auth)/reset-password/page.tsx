// app/(public)/reset-password/page.tsx  ← kendi yoluna göre isim değişebilir
"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function ResetPasswordContent() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const router = useRouter();

  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const passOk = p1.length >= 6 && p1 === p2 && !!token;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    if (!passOk) {
      setErr("Şifreler en az 6 karakter olmalı ve eşleşmeli.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: p1 }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(j?.message || "Sıfırlama başarısız.");
        return;
      }
      setMsg("Şifreniz güncellendi! Yönlendiriliyorsunuz...");
      setTimeout(() => router.push("/login"), 800);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="
        relative isolate min-h-screen overflow-hidden
        text-white dark:text-white
        bg-gradient-to-b from-white via-gray-100 to-gray-200
        dark:from-slate-950 dark:via-slate-900 dark:to-slate-900
      "
    >
      {/* Katman A: büyük mesh */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute -z-10 inset-[-20%] opacity-80
          [background:radial-gradient(55%_60%_at_20%_15%,rgba(99,102,241,.35),transparent_60%),radial-gradient(60%_55%_at_85%_25%,rgba(34,197,94,.30),transparent_60%)]
          motion-safe:animate-[meshPan_18s_ease-in-out_infinite]
        "
        style={{ mixBlendMode: 'screen' }}
      />
      {/* Katman B: küçük mesh */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute -z-10 inset-[-30%] opacity-70
          [background:radial-gradient(45%_50%_at_30%_80%,rgba(56,189,248,.30),transparent_60%),radial-gradient(50%_45%_at_75%_70%,rgba(244,114,182,.28),transparent_60%)]
          motion-safe:animate-[meshPanAlt_12s_ease-in-out_infinite]
        "
        style={{ mixBlendMode: 'screen' }}
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
        style={{ mixBlendMode: 'screen' }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white/80 p-8 text-gray-900 backdrop-blur-md shadow-xl dark:border-white/10 dark:bg-white/10 dark:text-white">
          <h1 className="mb-6 text-center text-2xl font-bold">Yeni Şifre</h1>

          {!token && (
            <p className="mb-4 text-sm text-red-700 dark:text-red-200">
              Geçersiz bağlantı. Lütfen “Şifremi Unuttum” sayfasından yeni link alın.
            </p>
          )}

          <form onSubmit={submit} className="space-y-4">
            <input
              type="password"
              placeholder="Yeni şifre (min 6)"
              className="w-full rounded-xl border px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 dark:border-white/10 dark:bg-white/5 dark:text-gray-100"
              value={p1}
              onChange={(e) => setP1(e.target.value)}
              autoComplete="new-password"
            />
            <input
              type="password"
              placeholder="Yeni şifre (tekrar)"
              className="w-full rounded-xl border px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 dark:border-white/10 dark:bg-white/5 dark:text-gray-100"
              value={p2}
              onChange={(e) => setP2(e.target.value)}
              autoComplete="new-password"
            />

            {err && (
              <p className="rounded-lg bg-red-500/15 p-2 text-sm text-red-700 dark:text-red-300">
                {err}
              </p>
            )}
            {msg && (
              <p className="rounded-lg bg-emerald-500/15 p-2 text-sm text-emerald-700 dark:text-emerald-300">
                {msg}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !passOk}
              className="w-full rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow-lg hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

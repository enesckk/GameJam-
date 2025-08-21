// app/(public)/forgot-password/page.tsx  ← kendi yoluna göre isim değişebilir
"use client";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    if (!emailOk) {
      setErr("Geçerli bir e‑posta girin.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErr(j?.message || "Bir hata oluştu.");
        return;
      }
      setMsg("E‑posta gönderildi. Gelen kutunu kontrol et.");
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
          <h1 className="mb-6 text-center text-2xl font-bold">Şifremi Unuttum</h1>
          <form onSubmit={submit} className="space-y-4">
            <input
              type="email"
              placeholder="E‑posta adresiniz"
              className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-emerald-400 dark:border-white/20 dark:bg-white/5 dark:text-gray-100"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
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
              disabled={loading || !emailOk}
              className="group relative w-full overflow-hidden rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow-lg hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

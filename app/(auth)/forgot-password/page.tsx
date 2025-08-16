"use client";
import { useState } from "react";
import VideoBG from "@/components/background/video-bg";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null); setErr(null);
    if (!emailOk) { setErr("Geçerli bir e‑posta girin."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });
      if (!res.ok) {
        const j = await res.json().catch(()=> ({}));
        setErr(j?.message || "Bir hata oluştu.");
        return;
      }
      setMsg("E‑posta gönderildi (geliştirmede konsola yazdırıldı). Gelen kutunu kontrol et.");
    } finally { setLoading(false); }
  }

  return (
    <div className="relative min-h-screen">
      <VideoBG
        overlay
        mode="auto"
        opacity={0.9}
        light={{ webm: "/videos/light-bg.webm", mp4: "/videos/bg-light.mp4", poster: "/images/light-bg.jpg" }}
        dark={{ webm: "/videos/dark-bg.webm",  mp4: "/videos/bg-dark.mp4",  poster: "/images/dark-bg.jpg"  }}
      />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white/80 p-8 text-gray-900 backdrop-blur-md shadow-xl dark:border-white/10 dark:bg-white/10 dark:text-white">
          <h1 className="mb-6 text-center text-2xl font-bold">Şifremi Unuttum</h1>
          <form onSubmit={submit} className="space-y-4">
            <input
              type="email"
              placeholder="E‑posta adresiniz"
              className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-emerald-400 dark:border-white/20 dark:bg-white/80"
              value={email} onChange={(e)=> setEmail(e.target.value)}
            />
            {err && <p className="rounded-lg bg-red-500/15 p-2 text-sm text-red-700 dark:text-red-100">{err}</p>}
            {msg && <p className="rounded-lg bg-emerald-500/15 p-2 text-sm text-emerald-700 dark:text-emerald-100">{msg}</p>}
            <button
              type="submit" disabled={loading || !emailOk}
              className="group relative w-full overflow-hidden rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow-lg ring-1 ring-emerald-400/30 transition-all hover:shadow-emerald-500/60"
            >
              {loading ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

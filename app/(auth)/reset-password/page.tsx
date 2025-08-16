"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import VideoBG from "@/components/background/video-bg";

export default function ResetPasswordPage() {
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
    setErr(null); setMsg(null);
    if (!passOk) { setErr("Şifreler en az 6 karakter olmalı ve eşleşmeli."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: p1 }),
      });
      const j = await res.json().catch(()=> ({}));
      if (!res.ok) { setErr(j?.message || "Sıfırlama başarısız."); return; }
      setMsg("Şifreniz güncellendi! Yönlendiriliyorsunuz...");
      setTimeout(()=> router.push("/login"), 800);
    } finally { setLoading(false); }
  }

  return (
    <div className="relative min-h-screen">
      <VideoBG
        overlay
        mode="auto"
        opacity={0.9}
        light={{ webm: "/videos/light-bg.webm", mp4: "/videos/bg-light.mp4", poster: "/images/bg-light.jpg" }}
        dark={{ webm: "/videos/dark-bg.webm",  mp4: "/videos/bg-dark.mp4",  poster: "/images/bg-dark.jpg"  }}
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
              className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-emerald-400 dark:border-white/20 dark:bg-white/80"
              value={p1} onChange={(e)=> setP1(e.target.value)}
            />
            <input
              type="password"
              placeholder="Yeni şifre (tekrar)"
              className="w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-emerald-400 dark:border-white/20 dark:bg-white/80"
              value={p2} onChange={(e)=> setP2(e.target.value)}
            />
            {err && <p className="rounded-lg bg-red-500/15 p-2 text-sm text-red-700 dark:text-red-100">{err}</p>}
            {msg && <p className="rounded-lg bg-emerald-500/15 p-2 text-sm text-emerald-700 dark:text-emerald-100">{msg}</p>}
            <button
              type="submit" disabled={loading || !passOk}
              className="group relative w-full overflow-hidden rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow-lg ring-1 ring-emerald-400/30 transition-all hover:shadow-emerald-500/60"
            >
              {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

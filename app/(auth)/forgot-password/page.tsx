"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Card from "@/components/ui/card";

function ForgotPasswordContent() {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!emailOk) {
      setErr("Lütfen geçerli bir e-posta adresi girin.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
        }),
      });

      const j = await res.json().catch(() => null);

      if (!res.ok) {
        setErr(j?.message || "Şifre sıfırlama e-postası gönderilemedi.");
        return;
      }

      setSuccess(true);
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
      {/* Basitleştirilmiş arka plan */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute -z-10 inset-0
          bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10
          backdrop-blur-3xl
        "
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4">
        <Card className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-800/60 backdrop-blur-md p-8 shadow-xl">
          <h1 className="mb-6 text-center text-3xl font-bold text-white">
            Şifremi Unuttum
          </h1>

          {success ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-green-500/15 p-4 text-center">
                <p className="text-green-300 font-medium">
                  Şifre sıfırlama e-postası gönderildi!
                </p>
                <p className="text-sm text-green-200 mt-2">
                  E-posta adresinizi kontrol edin ve gelen linke tıklayın.
                </p>
              </div>
              <div className="text-center">
                <Link
                  href="/login"
                  className="text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
                >
                  Giriş sayfasına dön
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-slate-200">
                  E-posta Adresi
                </label>
                <input
                  className="w-full rounded-xl border border-slate-600 bg-slate-700 px-3 py-2 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="ornek@mail.com"
                  autoComplete="email"
                />
                {!emailOk && email !== "" && (
                  <p className="mt-1 text-xs text-red-300">
                    Geçerli bir e-posta adresi girin.
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
                disabled={!emailOk || loading}
                className="
                  w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white
                  transition-colors duration-200
                  hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/60
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {loading ? "Gönderiliyor..." : "Şifre Sıfırlama E-postası Gönder"}
              </button>

              <div className="text-center text-sm text-slate-300">
                <Link
                  href="/login"
                  className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
                >
                  Giriş sayfasına dön
                </Link>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <ForgotPasswordContent />
    </Suspense>
  );
}

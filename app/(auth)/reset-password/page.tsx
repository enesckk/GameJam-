"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Card from "@/components/ui/card";

function ResetPasswordContent() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const search = useSearchParams();

  const token = search.get("token");
  const passOk = password.length >= 6;
  const confirmOk = password === confirmPassword;
  const allOk = passOk && confirmOk;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!allOk) {
      setErr("Lütfen tüm alanları doğru doldurun.");
      return;
    }

    if (!token) {
      setErr("Geçersiz veya eksik token.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const j = await res.json().catch(() => null);

      if (!res.ok) {
        setErr(j?.message || "Şifre sıfırlanamadı.");
        return;
      }

      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div
        className="
          relative isolate min-h-screen overflow-hidden
          text-white
          bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900
        "
      >
        <div
          aria-hidden
          className="
            pointer-events-none absolute -z-10 inset-0
            bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10
            backdrop-blur-3xl
          "
        />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4">
          <Card className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-800/60 backdrop-blur-md p-8 shadow-xl text-center">
            <h1 className="mb-6 text-3xl font-bold text-white">Geçersiz Link</h1>
            <p className="text-slate-300 mb-6">
              Bu şifre sıfırlama linki geçersiz veya süresi dolmuş.
            </p>
            <Link
              href="/forgot-password"
              className="inline-block rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700 transition-colors duration-200"
            >
              Yeni Şifre Sıfırlama İste
            </Link>
          </Card>
        </div>
      </div>
    );
  }

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
            Yeni Şifre Belirle
          </h1>

          {success ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-green-500/15 p-4 text-center">
                <p className="text-green-300 font-medium">
                  Şifreniz başarıyla güncellendi!
                </p>
                <p className="text-sm text-green-200 mt-2">
                  Artık yeni şifrenizle giriş yapabilirsiniz.
                </p>
              </div>
              <div className="text-center">
                <Link
                  href="/login"
                  className="inline-block rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700 transition-colors duration-200"
                >
                  Giriş Yap
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-slate-200">
                  Yeni Şifre
                </label>
                <input
                  className="w-full rounded-xl border border-slate-600 bg-slate-700 px-3 py-2 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="••••••"
                  autoComplete="new-password"
                />
                {!passOk && password !== "" && (
                  <p className="mt-1 text-xs text-red-300">
                    Şifre en az 6 karakter olmalı.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm text-slate-200">
                  Şifre Tekrar
                </label>
                <input
                  className="w-full rounded-xl border border-slate-600 bg-slate-700 px-3 py-2 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  placeholder="••••••"
                  autoComplete="new-password"
                />
                {!confirmOk && confirmPassword !== "" && (
                  <p className="mt-1 text-xs text-red-300">
                    Şifreler eşleşmiyor.
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
                {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

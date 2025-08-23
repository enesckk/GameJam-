"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Card from "@/components/ui/card";
import VideoBG from "@/components/background/video-bg";

type FormData = {
  name: string;
  email: string;
  phone: string;
  age: string;
  password: string;
  confirmPassword: string;
};

function RegisterContent() {
  const [f, setF] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    age: "",
    password: "",
    confirmPassword: "",
  });
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const nameOk = f.name.length >= 3;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email);
  const phoneOk = /^[\+]?[0-9]{10,14}$/.test(f.phone.replace(/\s/g, ""));
  const ageOk = f.age && parseInt(f.age) >= 14 && parseInt(f.age) <= 18;
  const passOk = f.password.length >= 6;
  const confirmOk = f.password === f.confirmPassword;
  const allOk = nameOk && emailOk && phoneOk && ageOk && passOk && confirmOk;

  const onChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setF(prev => ({ ...prev, [field]: e.target.value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!allOk) {
      setErr("Lütfen tüm alanları doğru doldurun.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: f.name.trim(),
          email: f.email.toLowerCase().trim(),
          phone: f.phone.trim(),
          age: parseInt(f.age),
          password: f.password,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErr(j?.message || "Kayıt sırasında bir sorun oluştu.");
        return;
      }
      router.push("/(auth)/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* ARKA PLAN VİDEO — sadece koyu tema */}
      <VideoBG
        overlay={true}
        mode="dark"
        opacity={0.9}
        dark={{
          webm: "/videos/register-dark.webm",
          mp4:  "/videos/register-dark.mp4",
          poster: "/videos/register-poster-dark.jpg",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4">
        <Card className="w-full max-w-xl rounded-xl border-2 border-slate-600 bg-slate-800/30 backdrop-blur-xl p-8 text-white shadow-xl">
          <h1 className="mb-6 text-center text-3xl font-bold">Kayıt Ol</h1>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-slate-200">Ad Soyad</label>
              <input
                className="w-full rounded-xl border border-slate-600 bg-slate-700 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-emerald-400"
                value={f.name}
                onChange={onChange("name")}
                placeholder="Örn. Ayşe Yılmaz"
              />
              {!nameOk && f.name !== "" && (
                <p className="mt-1 text-xs text-red-300">En az 3 karakter olmalı.</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-slate-200">E‑posta</label>
                <input
                  className="w-full rounded-xl border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:ring-2 focus:ring-emerald-400"
                  value={f.email}
                  onChange={onChange("email")}
                  type="email"
                  placeholder="ornek@mail.com"
                />
                {!emailOk && f.email !== "" && (
                  <p className="mt-1 text-xs text-red-300">Geçerli bir e‑posta girin.</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm text-slate-200">Telefon</label>
                <input
                  className="w-full rounded-xl border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:ring-2 focus:ring-emerald-400"
                  value={f.phone}
                  onChange={onChange("phone")}
                  inputMode="tel"
                  placeholder="+90 5xx xxx xx xx"
                />
                {!phoneOk && f.phone !== "" && (
                  <p className="mt-1 text-xs text-red-300">Geçerli bir telefon girin (10–14 hane).</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-slate-200">Yaş (14–18)</label>
                <input
                  className="w-full rounded-xl border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:ring-2 focus:ring-emerald-400"
                  value={f.age}
                  onChange={onChange("age")}
                  type="number"
                  min={14}
                  max={18}
                />
                {!ageOk && f.age !== "" && (
                  <p className="mt-1 text-xs text-red-300">Yaş 14 ile 18 arasında olmalı.</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm text-slate-200">Şifre</label>
                <input
                  className="w-full rounded-xl border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:ring-2 focus:ring-emerald-400"
                  value={f.password}
                  onChange={onChange("password")}
                  type="password"
                  placeholder="••••••"
                />
                {!passOk && f.password !== "" && (
                  <p className="mt-1 text-xs text-red-300">En az 6 karakter olmalı.</p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm text-slate-200">Şifre Tekrar</label>
              <input
                className="w-full rounded-xl border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:ring-2 focus:ring-emerald-400"
                value={f.confirmPassword}
                onChange={onChange("confirmPassword")}
                type="password"
                placeholder="••••••"
              />
              {!confirmOk && f.confirmPassword !== "" && (
                <p className="mt-1 text-xs text-red-300">Şifreler eşleşmiyor.</p>
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
              {loading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
            </button>

            <div className="text-center text-sm text-slate-300">
              Zaten hesabınız var mı?{" "}
              <Link
                href="/login"
                className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
              >
                Giriş yapın
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <RegisterContent />
    </Suspense>
  );
}

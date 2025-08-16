"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Dosya adın "video-bg.tsx" ise küçük harfli import doğru:
import VideoBG from "@/components/background/video-bg";

// shadcn/ui veya benzeri kullanıyorsan named import:
import  Card  from "@/components/ui/card";
import  Button  from "@/components/ui/button";

type FormState = {
  name: string;
  email: string;
  phone: string;
  age: string;
  password: string;
};

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();
  const [f, setF] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    age: "",
    password: "",
  });

  // basit regex & kurallar
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email);
  const phoneOk = /^\+?\d{10,14}$/.test(f.phone.replace(/\s/g, ""));
  const ageNum = Number(f.age);
  const ageOk = Number.isInteger(ageNum) && ageNum >= 14 && ageNum <= 18;
  const passOk = f.password.length >= 6;
  const nameOk = f.name.trim().length >= 3;

  const allOk = emailOk && phoneOk && ageOk && passOk && nameOk;

  const onChange = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF({ ...f, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!allOk) {
      setErr("Lütfen tüm alanları doğru formatta doldurun.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.name.trim(),
          email: f.email.toLowerCase().trim(),
          phone: f.phone.replace(/\s/g, ""),
          age: ageNum,
          password: f.password,
        }),
      });

      if (res.status === 409) {
        setErr("Bu e‑posta ile zaten kayıt var.");
        return;
      }
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
      {/* ARKA PLAN VİDEO — light/dark için AYRI kaynaklar ZORUNLU */}
      <VideoBG
        overlay={true}         // <-- string değil, boolean
        mode="auto"            // istersen "light" | "dark" ile zorlayabilirsin
        opacity={0.9}
        light={{
          webm: "/videos/register-light.webm",
          mp4:  "/videos/register-light.mp4",
          poster: "/videos/register-poster-light.jpg",
        }}
        dark={{
          webm: "/videos/register-dark.webm",
          mp4:  "/videos/register-dark.mp4",
          poster: "/videos/register-poster-dark.jpg",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4">
        <Card className="w-full max-w-xl rounded-2xl border-white/10 bg-white/10 p-8 text-white backdrop-blur-md">
          <h1 className="mb-6 text-center text-3xl font-bold">Kayıt Ol</h1>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm">Ad Soyad</label>
              <input
                className="w-full rounded-xl border border-white/20 bg-white/80 px-3 py-2 text-black outline-none focus:ring-2 focus:ring-emerald-400"
                value={f.name}
                onChange={onChange("name")}
                placeholder="Örn. Ayşe Yılmaz"
              />
              {!nameOk && f.name !== "" && (
                <p className="mt-1 text-xs text-red-200">En az 3 karakter olmalı.</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm">E‑posta</label>
                <input
                  className="w-full rounded-xl border border-white/20 bg-white/80 px-3 py-2 text-black focus:ring-2 focus:ring-emerald-400"
                  value={f.email}
                  onChange={onChange("email")}
                  type="email"
                  placeholder="ornek@mail.com"
                />
                {!emailOk && f.email !== "" && (
                  <p className="mt-1 text-xs text-red-200">Geçerli bir e‑posta girin.</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm">Telefon</label>
                <input
                  className="w-full rounded-xl border border-white/20 bg-white/80 px-3 py-2 text-black focus:ring-2 focus:ring-emerald-400"
                  value={f.phone}
                  onChange={onChange("phone")}
                  inputMode="tel"
                  placeholder="+90 5xx xxx xx xx"
                />
                {!phoneOk && f.phone !== "" && (
                  <p className="mt-1 text-xs text-red-200">Geçerli bir telefon girin (10–14 hane).</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm">Yaş (14–18)</label>
                <input
                  className="w-full rounded-xl border border-white/20 bg-white/80 px-3 py-2 text-black focus:ring-2 focus:ring-emerald-400"
                  value={f.age}
                  onChange={onChange("age")}
                  type="number"
                  min={14}
                  max={18}
                />
                {!ageOk && f.age !== "" && (
                  <p className="mt-1 text-xs text-red-200">Yaş 14 ile 18 arasında olmalı.</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm">Şifre</label>
                <input
                  className="w-full rounded-xl border border-white/20 bg-white/80 px-3 py-2 text-black focus:ring-2 focus:ring-emerald-400"
                  value={f.password}
                  onChange={onChange("password")}
                  type="password"
                  placeholder="En az 6 karakter"
                />
                {!passOk && f.password !== "" && (
                  <p className="mt-1 text-xs text-red-200">Şifre en az 6 karakter olmalı.</p>
                )}
              </div>
            </div>

            {err && <p className="rounded-lg bg-red-500/20 p-2 text-sm text-red-100">{err}</p>}

            <Button
              type="submit"
              disabled={loading || !allOk}
              className="w-full rounded-xl py-3 text-base"
            >
              {loading ? "Kaydediliyor..." : "Kayıt Ol"}
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-white/80">
            Kayıt olarak KVKK metnini kabul etmiş olursunuz.
          </p>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import VideoBG from "@/components/background/video-bg";

type RoleOption = "developer" | "designer" | "audio" | "pm";
type ApplyType = "individual" | "team";

type Member = { name: string; email: string; phone: string; age: string; role: "developer" | "designer" | "audio" | "pm" };

type FormState = {
  type: ApplyType;
  teamName: string;
  // Lider (başvuran)
  name: string;
  email: string;
  phone: string;
  age: string;
  password: string; // sadece lider için
  role: RoleOption;
  consentKVKK: boolean;
  // Takım üyeleri (ekstra)
  members: Member[]; // max 3 (lider + 3 = 4)
};

const MAX_TEAM = 4;
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRe = /^\+?\d{10,14}$/;

export default function KayitPage() {
  const [f, setF] = useState<FormState>({
    type: "individual",
    teamName: "",
    name: "",
    email: "",
    phone: "",
    age: "",
    password: "",
    role: "developer",
    consentKVKK: false,
    members: [],
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  // Lider doğrulamalar
  const emailOk = emailRe.test(f.email);
  const phoneOk = phoneRe.test(f.phone.replace(/\s/g, ""));
  const ageNum = Number(f.age);
  const ageOk = Number.isInteger(ageNum) && ageNum >= 14;
  const passOk = f.password.length >= 6;
  const nameOk = f.name.trim().length >= 3;
  const consentOk = f.consentKVKK === true;

  // Üye doğrulaması
  const memberValid = (m: Member) =>
    m.name.trim().length >= 3 &&
    emailRe.test(m.email.toLowerCase().trim()) &&
    phoneRe.test(m.phone.replace(/\s/g, "")) &&
    Number.isInteger(Number(m.age)) &&
    Number(m.age) >= 14 &&
    ["developer", "designer", "audio", "pm"].includes(m.role);

  // Takım kontrolü
  const teamOk =
    f.type === "individual"
      ? true
      : f.teamName.trim().length > 0 &&
        1 + f.members.length <= MAX_TEAM &&
        f.members.every(memberValid) &&
        (() => {
          const all = [f.email.toLowerCase().trim(), ...f.members.map((m) => m.email.toLowerCase().trim())];
          return new Set(all).size === all.length;
        })();

  const allOk = emailOk && phoneOk && ageOk && nameOk && consentOk && passOk && teamOk;

  // Alan değişimleri
  function onChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setF((s) => ({ ...s, [key]: value }));
  }

  function onMemberChange(i: number, patch: Partial<Member>) {
    setF((s) => {
      const members = [...s.members];
      members[i] = { ...members[i], ...patch };
      return { ...s, members };
    });
  }

  // Üye ekle
  function addMember() {
    if (f.members.length >= MAX_TEAM - 1) return;
    setF((s) => ({
      ...s,
      members: [...s.members, { name: "", email: "", phone: "", age: "", role: "developer" }],
    }));
  }

  function removeMember(i: number) {
    setF((s) => ({ ...s, members: s.members.filter((_, idx) => idx !== i) }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setMsg(null);

    if (!allOk) {
      setErr("Lütfen tüm alanları doğru formatta doldurun.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        type: f.type,
        teamName: f.type === "team" ? f.teamName.trim() : undefined,
        name: f.name.trim(),
        email: f.email.toLowerCase().trim(),
        phone: f.phone.replace(/\s/g, ""),
        age: Number(f.age),
        password: f.password,
        role: f.role,
        consentKVKK: f.consentKVKK,
        members:
          f.type === "team"
            ? f.members.map((m) => ({
                name: m.name.trim(),
                email: m.email.toLowerCase().trim(),
                phone: m.phone.replace(/\s/g, ""),
                age: Number(m.age),
                role: m.role,
              }))
            : [],
      };

      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 409) {
        const j = await res.json().catch(() => ({}));
        setErr(j?.message || "Bu e-posta ile kayıt/başvuru zaten var.");
        return;
      }
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErr(j?.message || "Formu kontrol et: Zorunlu alan/format hatası olabilir.");
        return;
      }

// ✅ Lider profilini kalıcı yaz (hem LS hem cookie)
const leaderProfile = {
  fullName: f.name.trim(),
  email:    f.email.toLowerCase().trim(),
  phone:    f.phone.replace(/\s/g, ""),
  role:     f.role,
};
localStorage.setItem("profile", JSON.stringify(leaderProfile));
document.cookie = `profile=${encodeURIComponent(JSON.stringify(leaderProfile))}; Path=/; Max-Age=31536000; SameSite=Lax`;

// ✅ Üst bar için ad
const fullName = leaderProfile.fullName;
sessionStorage.setItem("displayName", fullName);
localStorage.setItem("displayName", fullName);
document.cookie = `displayName=${encodeURIComponent(fullName)}; Path=/; Max-Age=31536000; SameSite=Lax`;
window.dispatchEvent(new CustomEvent("user:name", { detail: fullName }));


      setMsg("Başvurun alındı! E-postanı kontrol et.");

      // Formu sıfırla
      setF({
        type: "individual",
        teamName: "",
        name: "",
        email: "",
        phone: "",
        age: "",
        password: "",
        role: "developer",
        consentKVKK: false,
        members: [],
      });

      // (isteğe bağlı) direkt panele yönlendirmek istersen:
      // router.push("/panel");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen">
      {/* Arka plan video */}
      <VideoBG
        overlay={true}
        mode="auto"
        opacity={0.9}
        light={{
          webm: "/videos/register-light.webm",
          mp4: "/videos/bg-light.mp4",
          poster: "/videos/register-poster-light.jpg",
        }}
        dark={{
          webm: "/videos/register-dark.webm",
          mp4: "/videos/bg-dark.mp4",
          poster: "/videos/register-poster-dark.jpg",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 py-10">
        <div className="w-full rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-md shadow-xl sm:p-8">
          <h1
            className="mb-6 text-center text-3xl font-bold"
            style={{ color: "var(--foreground)" }}
          >
            Kayıt / Başvuru
          </h1>

          <form onSubmit={onSubmit} className="space-y-5">
            {/* Başvuru tipi */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <label className="flex items-center gap-2" style={{ color: "var(--foreground)" }}>
                <input type="radio" checked={f.type === "individual"} onChange={() => onChange("type", "individual")} />
                Bireysel
              </label>
              <label className="flex items-center gap-2" style={{ color: "var(--foreground)" }}>
                <input type="radio" checked={f.type === "team"} onChange={() => onChange("type", "team")} />
                Takım (en fazla 4 kişi)
              </label>
            </div>

            {/* Takım adı */}
            {f.type === "team" && (
              <div>
                <input
                  placeholder="Takım Adı"
                  className="w-full rounded-xl border border-white/20 bg-white/80 px-3 py-2 text-black outline-none focus:ring-2 focus:ring-emerald-400"
                  value={f.teamName}
                  onChange={(e) => onChange("teamName", e.target.value)}
                  required
                />
                {f.teamName.trim() === "" && <p className="mt-1 text-xs text-red-200">Takım adı zorunlu.</p>}
              </div>
            )}

            {/* Lider bilgileri */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <input
                  placeholder="Lider Ad Soyad"
                  className="w-full rounded-xl border border-white/20 bg-white/80 px-3 py-2 text-black outline-none focus:ring-2 focus:ring-emerald-400"
                  value={f.name}
                  onChange={(e) => onChange("name", e.target.value)}
                  required
                />
                {!nameOk && f.name !== "" && <p className="mt-1 text-xs text-red-200">En az 3 karakter olmalı.</p>}
              </div>

              <div>
                <input
                  placeholder="Lider E-posta"
                  type="email"
                  className="w-full rounded-xl border border-white/20 bg-white/80 px-3 py-2 text-black focus:ring-2 focus:ring-emerald-400"
                  value={f.email}
                  onChange={(e) => onChange("email", e.target.value)}
                  required
                />
                {!emailOk && f.email !== "" && <p className="mt-1 text-xs text-red-200">Geçerli bir e-posta girin.</p>}
              </div>

              <div>
                <input
                  placeholder="Lider Telefon (örn. +90 5xx xxx xx xx)"
                  inputMode="tel"
                  className="w-full rounded-xl border border-white/20 bg-white/80 px-3 py-2 text-black outline-none focus:ring-2 focus:ring-emerald-400"
                  value={f.phone}
                  onChange={(e) => onChange("phone", e.target.value)}
                  required
                />
                {!phoneOk && f.phone !== "" && <p className="mt-1 text-xs text-red-200">Geçerli bir telefon girin (10–14 hane).</p>}
              </div>

              <div>
                <input
                  placeholder="Lider Yaş (14 yaş ve üzeri)"
                  type="number"
                  min={14}
                  className="w-full rounded-xl border border-white/20 bg-white/80 px-3 py-2 text-black focus:ring-2 focus:ring-emerald-400"
                  value={f.age}
                  onChange={(e) => onChange("age", e.target.value)}
                  required
                />
                {!ageOk && f.age !== "" && <p className="mt-1 text-xs text-red-200">14 yaş ve üzeri olmalı.</p>}
              </div>

              <div className="sm:col-span-2">
                <input
                  placeholder="Lider Şifre (en az 6 karakter)"
                  type="password"
                  className="w-full rounded-xl border border-white/20 bg-white/80 px-3 py-2 text-black focus:ring-2 focus:ring-emerald-400"
                  value={f.password}
                  onChange={(e) => onChange("password", e.target.value)}
                  required
                />
                {!passOk && f.password !== "" && <p className="mt-1 text-xs text-red-200">Şifre en az 6 karakter olmalı.</p>}
              </div>
            </div>

            {/* Rol */}
            <select
              className="w-full rounded-xl border border-white/20 bg-white/80 px-3 py-2 text-black outline-none focus:ring-2 focus:ring-emerald-400"
              value={f.role}
              onChange={(e) => onChange("role", e.target.value as RoleOption)}
            >
              <option value="developer">Yazılımcı</option>
              <option value="designer">Tasarımcı</option>
              <option value="audio">Ses/Müzik</option>
              <option value="pm">İçerik/PM</option>
            </select>

            {/* Takım üyeleri */}
            {f.type === "team" && (
              <div className="space-y-3 rounded-xl border border-white/15 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm" style={{ color: "color-mix(in oklab, var(--foreground) 90%, transparent)" }}>
                    Takım Üyeleri (Lider hariç, en fazla {MAX_TEAM - 1})
                  </p>
                  <button
                    type="button"
                    onClick={addMember}
                    disabled={f.members.length >= MAX_TEAM - 1}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60"
                  >
                    Üye Ekle (Kalan: {MAX_TEAM - 1 - f.members.length})
                  </button>
                </div>

                {f.members.map((m, i) => {
                  const valid = memberValid(m);
                  return (
                    <div key={i} className="grid grid-cols-1 gap-3 sm:grid-cols-6">
                      <input
                        placeholder="Üye Ad Soyad"
                        className="rounded-xl border border-white/20 bg-white/80 px-3 py-2 text-black"
                        value={m.name}
                        onChange={(e) => onMemberChange(i, { name: e.target.value })}
                      />
                      <input
                        placeholder="Üye E-posta"
                        className="rounded-xl border border-white/20 bg-white/80 px-3 py-2 text-black"
                        value={m.email}
                        onChange={(e) => onMemberChange(i, { email: e.target.value })}
                      />
                      <input
                        placeholder="Üye Telefon"
                        className="rounded-xl border border-white/20 bg-white/80 px-3 py-2 text-black"
                        value={m.phone}
                        onChange={(e) => onMemberChange(i, { phone: e.target.value })}
                      />
                      <input
                        type="number"
                        min={14}
                        placeholder="Yaş"
                        className="rounded-xl border border-white/20 bg-white/80 px-3 py-2 text-black"
                        value={m.age}
                        onChange={(e) => onMemberChange(i, { age: e.target.value })}
                      />
                      <select
                        className="rounded-xl border border-white/20 bg-white/80 px-3 py-2 text-black"
                        value={m.role}
                        onChange={(e) => onMemberChange(i, { role: e.target.value as Member["role"] })}
                      >
                        <option value="developer">Yazılımcı</option>
                        <option value="designer">Tasarımcı</option>
                        <option value="audio">Ses/Müzik</option>
                        <option value="pm">İçerik/PM</option>
                      </select>

                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() => removeMember(i)}
                          className="w-full rounded-lg bg-red-600 px-3 py-2 text-white sm:w-auto"
                        >
                          Sil
                        </button>
                      </div>

                      {!valid && (m.name || m.email || m.phone || m.age) && (
                        <p className="sm:col-span-6 -mt-1 text-xs text-red-200">
                          Üye bilgilerini kontrol edin (ad 3+ karakter, geçerli e-posta & telefon, 14 yaş ve üzeri).
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* KVKK */}
            <label className="flex items-center gap-2 text-sm" style={{ color: "var(--foreground)" }}>
              <input
                type="checkbox"
                checked={f.consentKVKK}
                onChange={(e) => onChange("consentKVKK", e.target.checked)}
                required
              />
              KVKK metnini okudum, onaylıyorum.
            </label>

            {/* Mesajlar */}
            {err && <p className="rounded-lg bg-red-500/20 p-2 text-sm text-red-100">{err}</p>}
            {msg && <p className="rounded-lg bg-emerald-500/20 p-2 text-sm text-emerald-100">{msg}</p>}

            {/* Gönder */}
            <button
              type="submit"
              disabled={loading || !allOk}
              className="w-full rounded-xl bg-emerald-600 px-5 py-3 text-white shadow-lg hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Gönderiliyor..." : "Başvuruyu Gönder"}
            </button>

            <p
              className="text-center text-xs"
              style={{ color: "color-mix(in oklab, var(--foreground) 80%, transparent)" }}
            >
              Başvurudan sonra lider için hesap otomatik açılır. Diğer takım üyeleri sisteme eklenir fakat giriş yapamaz.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

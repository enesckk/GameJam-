// app/(public)/kayit/page.tsx
"use client";

import { useState } from "react";
import RoleSelect from "@/app/panel/_components/role-select"; // yolu ihtiyacına göre güncelle

type RoleOption = "developer" | "designer" | "audio" | "pm";
type ApplyType = "individual" | "team";

type Member = {
  name: string;
  email: string;
  phone: string;
  age: string;
  role: RoleOption;
};

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

// Şifre güç hesaplayıcı
function getPasswordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 6) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length >= 10) score++;

  if (score <= 1) return { label: "Zayıf", width: "33%", barClass: "bg-red-500" };
  if (score <= 3) return { label: "Orta", width: "66%", barClass: "bg-yellow-500" };
  return { label: "Güçlü", width: "100%", barClass: "bg-emerald-500" };
}

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
  const [showPass, setShowPass] = useState(false);
  const [capsOn, setCapsOn] = useState(false);

  // --- Validasyonlar ---
  const emailOk = emailRe.test(f.email);
  const phoneOk = phoneRe.test(f.phone.replace(/\s/g, ""));
  const ageNum = Number(f.age);
  const ageOk = Number.isInteger(ageNum) && ageNum >= 14;
  const passOk = f.password.length >= 6;
  const nameOk = f.name.trim().length >= 3;
  const consentOk = f.consentKVKK === true;

  const memberValid = (m: Member) =>
    m.name.trim().length >= 3 &&
    emailRe.test(m.email.toLowerCase().trim()) &&
    phoneRe.test(m.phone.replace(/\s/g, "")) &&
    Number.isInteger(Number(m.age)) &&
    Number(m.age) >= 14;

  const teamOk =
    f.type === "individual"
      ? true
      : f.teamName.trim().length > 0 &&
        1 + f.members.length <= MAX_TEAM &&
        f.members.every(memberValid) &&
        (() => {
          const all = [
            f.email.toLowerCase().trim(),
            ...f.members.map((m) => m.email.toLowerCase().trim()),
          ];
          return new Set(all).size === all.length;
        })();

  const allOk = emailOk && phoneOk && ageOk && nameOk && consentOk && passOk && teamOk;

  // --- Change handlers ---
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
  function onPasswordKey(ev: React.KeyboardEvent<HTMLInputElement>) {
    setCapsOn(ev.getModifierState("CapsLock"));
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
        ...f,
        age: Number(f.age),
        teamName: f.type === "team" ? f.teamName.trim() : undefined,
        members:
          f.type === "team"
            ? f.members.map((m) => ({
                ...m,
                email: m.email.toLowerCase().trim(),
                phone: m.phone.replace(/\s/g, ""),
                age: Number(m.age),
              }))
            : [],
      };

      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErr(j?.message || "Form hatalı olabilir.");
        return;
      }

      setMsg("Başvurun alındı! E-postanı kontrol et.");
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
    } finally {
      setLoading(false);
    }
  }

  const strength = getPasswordStrength(f.password);

  return (
    <div
      className="
        relative isolate min-h-screen
        overflow-visible
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
        "
      />

      {/* Form */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 py-10">
        <div
          className="w-full rounded-xl p-6 sm:p-8 shadow-lg
            bg-slate-800/80 backdrop-blur-sm
            border border-slate-700"
        >
          <h1 className="mb-6 text-center text-3xl font-bold text-white">
            Başvuru
          </h1>
          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            {/* Başvuru tipi */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-slate-200">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={f.type === "individual"}
                  onChange={() => onChange("type", "individual")}
                  className="text-emerald-500"
                />
                Bireysel
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={f.type === "team"}
                  onChange={() => onChange("type", "team")}
                  className="text-emerald-500"
                />
                Takım (en fazla 4 kişi)
              </label>
            </div>

            {/* Takım adı */}
            {f.type === "team" && (
              <div>
                <input
                  placeholder="Takım Adı"
                  className="w-full rounded-xl border border-slate-600 bg-slate-700 px-3 py-2 text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-transparent"
                  value={f.teamName}
                  onChange={(e) => onChange("teamName", e.target.value)}
                  required
                />
                {f.teamName.trim() === "" && (
                  <p className="mt-1 text-xs text-red-300">Takım adı zorunlu.</p>
                )}
              </div>
            )}

            {/* Lider bilgileri */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <input
                  placeholder="Lider Ad Soyad"
                  className="w-full rounded-xl border border-slate-600 bg-slate-700 px-3 py-2 text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-transparent"
                  value={f.name}
                  onChange={(e) => onChange("name", e.target.value)}
                  required
                />
                {!nameOk && f.name !== "" && (
                  <p className="mt-1 text-xs text-red-200">En az 3 karakter olmalı.</p>
                )}
              </div>

              <div>
                <input
                  placeholder="Lider E-posta"
                  type="email"
                  className="w-full rounded-xl border border-slate-600 bg-slate-700 px-3 py-2 text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-transparent"
                  value={f.email}
                  onChange={(e) => onChange("email", e.target.value)}
                  required
                />
                {!emailOk && f.email !== "" && (
                  <p className="mt-1 text-xs text-red-200">Geçerli bir e-posta girin.</p>
                )}
              </div>

              <div>
                <input
                  placeholder="Lider Telefon (örn. +90 5xx xxx xx xx)"
                  inputMode="tel"
                  className="w-full rounded-xl border border-slate-600 bg-slate-700 px-3 py-2 text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-transparent"
                  value={f.phone}
                  onChange={(e) => onChange("phone", e.target.value)}
                  required
                />
                {!phoneOk && f.phone !== "" && (
                  <p className="mt-1 text-xs text-red-300">Geçerli bir telefon girin (10–14 hane).</p>
                )}
              </div>

              <div>
                <input
                  placeholder="Lider Yaş (14+)"
                  type="number"
                  min={14}
                  className="w-full rounded-xl border border-slate-600 bg-slate-700 px-3 py-2 text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-transparent"
                  value={f.age}
                  onChange={(e) => onChange("age", e.target.value)}
                  required
                />
                {!ageOk && f.age !== "" && (
                  <p className="mt-1 text-xs text-red-300">14 yaş ve üzeri olmalı.</p>
                )}
              </div>

              {/* Şifre + Göster/Gizle + CapsLock + Güç Göstergesi */}
              <div className="sm:col-span-2">
                <div className="relative">
                  <input
                    placeholder="Lider Şifre (en az 6 karakter)"
                    type={showPass ? "text" : "password"}
                    className="w-full rounded-xl border border-slate-600 bg-slate-700 px-3 py-2 pr-24 text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-transparent"
                    value={f.password}
                    onChange={(e) => onChange("password", e.target.value)}
                    onKeyUp={onPasswordKey}
                    onKeyDown={onPasswordKey}
                    required
                    aria-invalid={!passOk && f.password !== "" ? "true" : "false"}
                  />
                  <div className="absolute inset-y-0 right-2 flex items-center gap-2">
                    {capsOn && (
                      <span
                        className="hidden sm:inline text-[10px] px-2 py-1 rounded-md bg-yellow-500/20 text-yellow-200 border border-yellow-500/30"
                        title="Caps Lock açık"
                      >
                        CAPS
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowPass((s) => !s)}
                      className="my-1 inline-flex items-center rounded-lg px-2 text-xs text-emerald-200 hover:text-emerald-100"
                      aria-pressed={showPass}
                      aria-label={showPass ? "Şifreyi gizle" : "Şifreyi göster"}
                      title={showPass ? "Şifreyi gizle" : "Şifreyi göster"}
                    >
                      {showPass ? "Gizle" : "Göster"}
                    </button>
                  </div>
                </div>

                {/* Güç barı & uyarılar */}
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  {f.password && (
                    <>
                      <div className="h-2 w-28 rounded-full bg-slate-600 overflow-hidden">
                        <div
                          className={`h-2 transition-all duration-300 ${strength.barClass}`}
                          style={{ width: strength.width }}
                        />
                      </div>
                      <span className="text-xs text-slate-200">
                        {strength.label}
                      </span>
                    </>
                  )}
                  {!passOk && f.password !== "" && (
                    <span className="text-xs text-red-300">Şifre en az 6 karakter olmalı.</span>
                  )}
                  {capsOn && (
                    <span className="text-xs text-yellow-300 sm:hidden">Caps Lock açık</span>
                  )}
                </div>
              </div>
            </div>

            {/* Lider Rol — RoleSelect */}
            <div className="relative overflow-visible">
              <RoleSelect
                className="[&>label]:sr-only"
                value={f.role}
                onChange={(r) => onChange("role", r as RoleOption)}
              />
            </div>

            {/* Takım üyeleri */}
            {f.type === "team" && (
              <div className="space-y-3 rounded-xl border border-white/25 dark:border-white/10 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-900 dark:text-gray-100">
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
                        className="rounded-xl border border-white/50 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2 text-gray-900 dark:text-gray-100 backdrop-blur-sm"
                        value={m.name}
                        onChange={(e) => onMemberChange(i, { name: e.target.value })}
                      />
                      <input
                        placeholder="Üye E-posta"
                        className="rounded-xl border border-white/50 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2 text-gray-900 dark:text-gray-100 backdrop-blur-sm"
                        value={m.email}
                        onChange={(e) => onMemberChange(i, { email: e.target.value })}
                      />
                      <input
                        placeholder="Üye Telefon"
                        className="rounded-xl border border-white/50 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2 text-gray-900 dark:text-gray-100 backdrop-blur-sm"
                        value={m.phone}
                        onChange={(e) => onMemberChange(i, { phone: e.target.value })}
                      />
                      <input
                        type="number"
                        min={14}
                        placeholder="Yaş"
                        className="rounded-xl border border-white/50 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2 text-gray-900 dark:text-gray-100 backdrop-blur-sm"
                        value={m.age}
                        onChange={(e) => onMemberChange(i, { age: e.target.value })}
                      />

                      {/* Üye Rol — RoleSelect */}
                      <div className="relative overflow-visible">
                        <RoleSelect
                          className="[&>label]:sr-only"
                          value={m.role}
                          onChange={(r) => onMemberChange(i, { role: r as RoleOption })}
                        />
                      </div>

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
                        <p className="sm:col-span-6 -mt-1 text-xs text-red-300">
                          Üye bilgilerini kontrol edin (ad 3+ karakter, geçerli e-posta & telefon, 14 yaş ve üzeri).
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* KVKK checkbox + AÇILIR İÇERİK */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-slate-200">
                <input
                  type="checkbox"
                  checked={f.consentKVKK}
                  onChange={(e) => onChange("consentKVKK", e.target.checked)}
                  required
                  aria-describedby="kvkk-desc"
                  className="text-emerald-500"
                />
                KVKK metnini okudum, onaylıyorum.
              </label>

              <details
                id="kvkk-desc"
                className="rounded-xl border border-slate-600 bg-slate-700/50 p-3 open:bg-slate-700/80 open:backdrop-blur-sm"
              >
                <summary className="cursor-pointer select-none text-sm text-emerald-300 hover:text-emerald-200">
                  KVKK Aydınlatma Metni (aç/kapa)
                </summary>
                <div className="mt-2 space-y-3 text-xs text-slate-200">
                  <p>
                    <strong>Veri Sorumlusu:</strong> Şehitkamil Belediyesi
                    <br />
                    Adres: Sanayi Mahallesi 60725 Nolu Cad. No:34, Şehitkamil / Gaziantep
                    <br />
                    Telefon: 0342 323 27 27
                    <br />
                    E-posta: <a href="mailto:belediye@sehitkamil.bel.tr" className="underline">belediye@sehitkamil.bel.tr</a>
                  </p>
                  <p>
                    <strong>İşlenen Kişisel Veriler:</strong> Ad Soyad, E-posta adresi, Telefon numarası, T.C. Kimlik Numarası, Yaş, Özgeçmiş (CV)
                  </p>
                  <p>
                    <strong>İşleme Amaçları:</strong> Katılımcı kaydının oluşturulması ve yönetilmesi, organizasyonun yürütülmesi ve iletişim sağlanması, ödül teslim süreçlerinin yürütülmesi, organizasyona ilişkin bilgilendirme ve duyuruların yapılması, işe alım fırsatlarının değerlendirilmesi.
                  </p>
                  <p>
                    <strong>Aktarım:</strong> Kişisel verileriniz yalnızca Şehitkamil Belediyesi ve GameJam moderatör ekibi tarafından işlenecek olup, üçüncü kişilerle paylaşılmayacaktır.
                  </p>
                  <p>
                    <strong>Yurt Dışına Aktarım:</strong> Kişisel verileriniz yurt dışına aktarılmamaktadır.
                  </p>
                  <p>
                    <strong>Saklama Süresi:</strong> Kişisel verileriniz, organizasyonun sona ermesinden itibaren 1 (bir) yıl süreyle saklanacak ve sürenin sonunda silinecek veya imha edilecektir.
                  </p>
                  <p>
                    <strong>Haklarınız (KVKK m.11):</strong> Verilerinize erişme, işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, işlenme amacını öğrenme, yurt içinde aktarıldığı kişileri bilme, eksik/yanlış işlenmiş verilerin düzeltilmesini isteme, ilgili mevzuat çerçevesinde silinmesini veya yok edilmesini isteme, işlemenin yalnızca otomatik sistemlerle analiz edilmesine itiraz etme ve zarara uğramanız hâlinde tazmin talep etme haklarına sahipsiniz. Taleplerinizi{" "}
                    <a href="mailto:belediye@sehitkamil.bel.tr" className="underline">belediye@sehitkamil.bel.tr</a> adresine iletebilirsiniz.
                  </p>
                </div>
              </details>
            </div>

            {/* Mesajlar */}
            {err && (
              <p className="rounded-lg border border-red-400/30 bg-red-500/10 p-2 text-sm text-red-300" role="alert" aria-live="assertive">
                {err}
              </p>
            )}
            {msg && (
              <p className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-2 text-sm text-emerald-300">
                {msg}
              </p>
            )}

            {/* Gönder */}
            <button
              type="submit"
              disabled={loading || !allOk}
              className="w-full rounded-xl bg-emerald-600 px-5 py-3 text-white shadow-lg hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Gönderiliyor..." : "Başvuruyu Gönder"}
            </button>

            {/* Alt bilgilendirme */}
            <p className="text-center text-xs text-slate-300">
              Başvurudan sonra lider için hesap otomatik açılır. Diğer takım üyelerine
              <br className="hidden sm:block" />
              <strong>davet e-postası</strong> gönderilir; e-postadaki <strong>şifre sıfırlama bağlantısı</strong> ile
              sisteme giriş yapabilirsiniz.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

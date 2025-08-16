// app/panel/profil/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "../_components/page-header";
import SectionCard from "../_components/section-card";
import RoleSelect from "../_components/role-select";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

type Role = "developer" | "designer" | "audio" | "pm";
type Profile = { fullName: string; email: string; phone: string; role: Role };

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRe = /^\+?\d{10,14}$/;

/** boş stringleri de yok sayan seçim */
const pickNonEmpty = (...vals: Array<string | null | undefined>) =>
  vals.find((v) => typeof v === "string" && v.trim().length > 0) ?? "";

/** localStorage güvenli parse */
const readLS = <T,>(key: string): Partial<T> => {
  try { return JSON.parse(localStorage.getItem(key) ?? "{}") as Partial<T>; }
  catch { return {}; }
};

/** cookie'den JSON oku (örn. profile) */
const readCookieJson = <T,>(name: string): Partial<T> => {
  try {
    const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    if (!m) return {};
    return JSON.parse(decodeURIComponent(m[1])) as Partial<T>;
  } catch { return {}; }
};

export default function ProfilPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [phone, setPhone]       = useState("");
  const [role, setRole]         = useState<Role>("developer");
  const [newPass, setNewPass]   = useState("");

  const [ok, setOk]             = useState<string | null>(null);
  const [err, setErr]           = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const router = useRouter(); // ← ekle

  // orijinal değerler (ilk odakta otomatik temizlemek için)
  const [original, setOriginal] = useState<Profile | null>(null);
  const [cleared, setCleared]   = useState<{fullName:boolean; email:boolean; phone:boolean}>({
    fullName: false, email: false, phone: false
  });

  // alan sarmalayıcı & input stilleri
  const wrap = [
    "group relative rounded-xl transition input-frame",
    "ring-1 ring-[color:color-mix(in_oklab,var(--foreground)_12%,transparent)]",
    "bg-[color:color-mix(in_oklab,var(--foreground)_6%,transparent)]",
    "hover:bg-[color:color-mix(in_oklab,var(--foreground)_10%,transparent)]",
    "focus-within:ring-transparent",
  ].join(" ");
  const input = [
    "w-full bg-transparent outline-none px-3 py-2",
    "text-[var(--foreground)] placeholder:text-[color:color-mix(in_oklab,var(--foreground)_55%,transparent)]",
  ].join(" ");

  // İlk yükleme: /api/profile -> cookie('profile') -> localStorage('profile') -> displayName
  useEffect(() => {
    let mounted = true;
    (async () => {
      // 1) API
      let data: Partial<Profile> = {};
try {
  const r = await fetch("/api/profile", { cache: "no-store" });
  if (r.ok) data = await r.json();
  console.debug("profile/api data:", data); // ← BURAYA EKLE
} catch {}

      // 2) cookie + 3) localStorage
      const cookieProfile = readCookieJson<Profile>("profile");
      const backup        = readLS<Profile>("profile");

      // 4) boş stringleri de atlayarak birleştir
      const loaded: Profile = {
        fullName: pickNonEmpty(
          data.fullName as string,
          cookieProfile.fullName as string,
          backup.fullName as string,
          localStorage.getItem("displayName") ?? ""
        ),
        email: pickNonEmpty(
          data.email as string,
          cookieProfile.email as string,
          backup.email as string
        ),
        phone: pickNonEmpty(
          data.phone as string,
          cookieProfile.phone as string,
          backup.phone as string
        ),
        role: ((data.role ?? cookieProfile.role ?? backup.role) as Role) ?? "developer",
      };

      if (!mounted) return;

      // (opsiyonel) LS boşsa cookie'den geri yaz
      if (!backup.fullName && (cookieProfile.fullName || cookieProfile.email || cookieProfile.phone)) {
        localStorage.setItem("profile", JSON.stringify({
          fullName: loaded.fullName,
          email: loaded.email,
          phone: loaded.phone,
          role: loaded.role,
        }));
      }

      setFullName(loaded.fullName);
      setEmail(loaded.email);
      setPhone(loaded.phone);
      setRole(loaded.role);
      setOriginal(loaded);
    })();
    return () => { mounted = false; };
  }, []);

  // İlk odakta temizle (değer orijinalle aynıysa)
  function clearOnFirstFocus(field: "fullName"|"email"|"phone") {
    return () => {
      setCleared((c) => {
        if (c[field]) return c;
        if (original) {
          const current = field === "fullName" ? fullName : field === "email" ? email : phone;
          const origVal = original[field];
          if (current === origVal && current.length > 0) {
            if (field === "fullName") setFullName("");
            if (field === "email")     setEmail("");
            if (field === "phone")     setPhone("");
          }
        }
        return { ...c, [field]: true };
      });
    };
  }

  // Validasyon
  const valid = useMemo(() => {
    const nameOk  = fullName.trim().length >= 3;
    const emailOk = emailRe.test(email.trim().toLowerCase());
    const phoneOk = phoneRe.test(phone.replace(/\s/g, ""));
    const passOk  = newPass === "" || newPass.length >= 6;
    return nameOk && emailOk && phoneOk && passOk;
  }, [fullName, email, phone, newPass]);

  // Kaydet
  const save = async () => {
    setOk(null); setErr(null);
    if (!valid) { setErr("Lütfen alanları kontrol edin."); return; }
    try {
      setLoading(true);
      const payload: Profile & { newPassword?: string } = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.replace(/\s/g, ""),
        role,
        ...(newPass ? { newPassword: newPass } : {}),
      };
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",               // ← ekle
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErr(j?.message || "Kaydedilemedi.");
        return;
      }
      // tarayıcı yedeği
      localStorage.setItem("profile", JSON.stringify(payload));
      // üst barda isim anında
      localStorage.setItem("displayName", payload.fullName);
      document.cookie = `displayName=${encodeURIComponent(payload.fullName)}; Path=/; Max-Age=31536000; SameSite=Lax`;
      window.dispatchEvent(new CustomEvent("user:name", { detail: payload.fullName }));
      router.refresh(); 

      setOk("Profil güncellendi.");
      setOriginal(payload);
      setNewPass("");
      setCleared({ fullName:false, email:false, phone:false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Profil" desc="Bilgilerinizi güncelleyin" variant="plain" />

      <SectionCard>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Ad Soyad */}
          <div className="md:col-span-2">
            <label className="text-sm">Ad Soyad</label>
            <div className={wrap}>
              <input
                className={input}
                value={fullName}
                onChange={(e)=>setFullName(e.target.value)}
                onFocus={clearOnFirstFocus("fullName")}
                placeholder="Ad Soyad"
                aria-label="Ad Soyad"
              />
              <Pencil className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 transition group-hover:opacity-85 group-focus-within:opacity-100" />
            </div>
          </div>

          {/* E-posta */}
          <div>
            <label className="text-sm">E-posta</label>
            <div className={wrap}>
              <input
                className={input}
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                onFocus={clearOnFirstFocus("email")}
                inputMode="email"
                placeholder="ornek@mail.com"
                aria-label="E-posta"
              />
              <Pencil className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 transition group-hover:opacity-85 group-focus-within:opacity-100" />
            </div>
          </div>

          {/* Telefon */}
          <div>
            <label className="text-sm">Telefon</label>
            <div className={wrap}>
              <input
                className={input}
                value={phone}
                onChange={(e)=>setPhone(e.target.value)}
                onFocus={clearOnFirstFocus("phone")}
                inputMode="tel"
                placeholder="+90 5xx xxx xx xx"
                aria-label="Telefon"
              />
              <Pencil className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 transition group-hover:opacity-85 group-focus-within:opacity-100" />
            </div>
          </div>

          {/* Rol (özel listbox) */}
          <RoleSelect
            className="md:col-span-1"
            value={role}
            onChange={(r)=>setRole(r)}
            label="Rol"
          />

          {/* Yeni Şifre */}
          <div className="md:col-span-2">
            <label className="text-sm">Yeni Şifre (opsiyonel)</label>
            <div className={wrap}>
              <input
                className={input}
                type="password"
                value={newPass}
                onChange={(e)=>setNewPass(e.target.value)}
                placeholder="••••••"
                aria-label="Yeni Şifre"
              />
              <Pencil className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 transition group-hover:opacity-85 group-focus-within:opacity-100" />
            </div>
            <p className="mt-1 text-xs text-[color:color-mix(in_oklab,var(--foreground)_70%,transparent)]">
              Boş bırakırsanız şifreniz değişmez.
            </p>
          </div>
        </div>

        {/* Bildirim */}
        <div className="pt-2 text-sm" aria-live="polite">
          {err && <span className="rounded-lg bg-red-500/15 px-2 py-1 text-[color:color-mix(in_oklab,crimson_85%,white_15%)]">{err}</span>}
          {ok  && <span className="rounded-lg bg-emerald-500/15 px-2 py-1 text-[color:color-mix(in_oklab,green_85%,white_15%)]">{ok}</span>}
        </div>

        {/* Kaydet — belirgin CTA */}
        <div className="pt-2">
          <button
            onClick={save}
            disabled={!valid || loading}
            className={[
              "group relative inline-flex items-center justify-center rounded-xl px-5 py-2.5 font-semibold",
              "text-[color:var(--background)] transition active:scale-[0.99]",
              "bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-500",
              "shadow-[0_8px_24px_rgba(99,102,241,.25)] hover:shadow-[0_10px_30px_rgba(99,102,241,.35)]",
              "disabled:opacity-60 disabled:cursor-not-allowed",
            ].join(" ")}
          >
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </SectionCard>
    </div>
  );
}

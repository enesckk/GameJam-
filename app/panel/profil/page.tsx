"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "../_components/page-header";
import SectionCard from "../_components/section-card";
import RoleSelect from "../_components/role-select";
import { Pencil, User, Mail, Phone, Shield, Save, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

type Role = "developer" | "designer" | "audio" | "pm";
type Profile = { fullName: string; email: string; phone: string; role: Role };

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRe = /^\+?\d{10,14}$/;

const pickNonEmpty = (...vals: Array<string | null | undefined>) =>
  vals.find((v) => typeof v === "string" && v.trim().length > 0) ?? "";

const readLS = <T,>(key: string): Partial<T> => {
  try { return JSON.parse(localStorage.getItem(key) ?? "{}") as Partial<T>; }
  catch { return {}; }
};

const readCookieJson = <T,>(name: string): Partial<T> => {
  try {
    const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    if (!m) return {};
    return JSON.parse(decodeURIComponent(m[1])) as Partial<T>;
  } catch { return {}; }
};

export default function ProfilPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<Role>("developer");
  const [newPass, setNewPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [original, setOriginal] = useState<Profile | null>(null);
  const [cleared, setCleared] = useState<{fullName:boolean; email:boolean; phone:boolean}>({
    fullName: false, email: false, phone: false
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      let data: Partial<Profile> = {};
      try {
        const r = await fetch("/api/profile", { cache: "no-store" });
        if (r.ok) data = await r.json();
      } catch {}

      const cookieProfile = readCookieJson<Profile>("profile");
      const backup = readLS<Profile>("profile");

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

  function clearOnFirstFocus(field: "fullName"|"email"|"phone") {
    return () => {
      setCleared((c) => {
        if (c[field]) return c;
        if (original) {
          const current = field === "fullName" ? fullName : field === "email" ? email : phone;
          const origVal = original[field];
          if (current === origVal && current.length > 0) {
            if (field === "fullName") setFullName("");
            if (field === "email") setEmail("");
            if (field === "phone") setPhone("");
          }
        }
        return { ...c, [field]: true };
      });
    };
  }

  const valid = useMemo(() => {
    const nameOk = fullName.trim().length >= 3;
    const emailOk = emailRe.test(email.trim().toLowerCase());
    const phoneOk = phoneRe.test(phone.replace(/\s/g, ""));
    const passOk = newPass === "" || newPass.length >= 6;
    return nameOk && emailOk && phoneOk && passOk;
  }, [fullName, email, phone, newPass]);

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
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErr(j?.message || "Kaydedilemedi.");
        return;
      }
      localStorage.setItem("profile", JSON.stringify(payload));
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
      <PageHeader title="Profil" desc="Kişisel bilgilerinizi güncelleyin" variant="plain" />

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/20 via-pink-500/15 to-blue-500/20 backdrop-blur-xl border border-purple-500/30 p-6">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 animate-pulse"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Profil Bilgileri</h2>
              <p className="text-sm text-purple-200/80">Kişisel bilgilerinizi güncelleyin</p>
            </div>
          </div>
          
          <p className="text-sm leading-relaxed text-purple-100">
            Profil bilgilerinizi güncelleyerek takım arkadaşlarınızın sizi daha iyi tanımasını sağlayın. 
            Rol seçiminiz takım eşleştirmelerinde önemli rol oynayacaktır.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 backdrop-blur-xl border border-purple-500/20 p-6">
        <div className="grid gap-4 grid-cols-1">
          {/* Ad Soyad */}
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">Ad Soyad</label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
              <div className="relative flex items-center gap-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 focus-within:border-purple-500/50 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all duration-200 p-1">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <input
                  className="flex-1 bg-transparent outline-none px-3 py-3 text-white placeholder:text-purple-200/60"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onFocus={clearOnFirstFocus("fullName")}
                  placeholder="Ad Soyad"
                  aria-label="Ad Soyad"
                />
                <Pencil className="h-4 w-4 text-purple-300 mr-3" />
              </div>
            </div>
          </div>

          {/* E-posta */}
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">E-posta</label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
              <div className="relative flex items-center gap-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200 p-1">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <input
                  className="flex-1 bg-transparent outline-none px-3 py-3 text-white placeholder:text-blue-200/60"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={clearOnFirstFocus("email")}
                  inputMode="email"
                  placeholder="ornek@mail.com"
                  aria-label="E-posta"
                />
                <Pencil className="h-4 w-4 text-blue-300 mr-3" />
              </div>
            </div>
          </div>

          {/* Telefon */}
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">Telefon</label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
              <div className="relative flex items-center gap-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 focus-within:border-green-500/50 focus-within:ring-2 focus-within:ring-green-500/20 transition-all duration-200 p-1">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <input
                  className="flex-1 bg-transparent outline-none px-3 py-3 text-white placeholder:text-green-200/60"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onFocus={clearOnFirstFocus("phone")}
                  inputMode="tel"
                  placeholder="+90 5xx xxx xx xx"
                  aria-label="Telefon"
                />
                <Pencil className="h-4 w-4 text-green-300 mr-3" />
              </div>
            </div>
          </div>

          {/* Rol */}
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">Rol</label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
              <div className="relative rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 focus-within:border-yellow-500/50 focus-within:ring-2 focus-within:ring-yellow-500/20 transition-all duration-200">
                <RoleSelect
                  value={role}
                  onChange={(r) => setRole(r)}
                  label=""
                />
              </div>
            </div>
          </div>

          {/* Yeni Şifre */}
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">Yeni Şifre (opsiyonel)</label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
              <div className="relative flex items-center gap-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 focus-within:border-red-500/50 focus-within:ring-2 focus-within:ring-red-500/20 transition-all duration-200 p-1">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <input
                  className="flex-1 bg-transparent outline-none px-3 py-3 text-white placeholder:text-red-200/60"
                  type={showPassword ? "text" : "password"}
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="••••••"
                  aria-label="Yeni Şifre"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="mr-2 p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-red-300" />
                  ) : (
                    <Eye className="h-4 w-4 text-red-300" />
                  )}
                </button>
              </div>
            </div>
            <p className="mt-2 text-xs text-purple-200/60">
              Boş bırakırsanız şifreniz değişmez. En az 6 karakter olmalıdır.
            </p>
          </div>
        </div>

        {/* Notifications */}
        <div className="mt-6 space-y-3" aria-live="polite">
          {err && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm text-red-200">{err}</span>
            </div>
          )}
          {ok && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm text-green-200">{ok}</span>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="mt-6">
          <button
            onClick={save}
            disabled={!valid || loading}
            className="group relative inline-flex items-center gap-3 rounded-xl px-6 py-3 font-semibold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
            <div className="relative flex items-center gap-3 justify-center">
              <Save className="h-5 w-5" />
              {loading ? "Kaydediliyor..." : "Kaydet"}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
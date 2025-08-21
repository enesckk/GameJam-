"use client";

import { useEffect, useState, useMemo } from "react";
import AdminHeader from "../_components/admin-header";
import AdminSectionCard from "@/app/admin/_components/admin-sectioncard";
import { Pencil, User, Mail, Phone, Shield, Lock, CheckCircle, AlertCircle, Save } from "lucide-react";
import { useRouter } from "next/navigation";

type Profile = {
  fullName: string;
  email: string;
  phone: string;
  role: string;
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRe = /^\+?\d{10,14}$/;

export default function AdminProfilePage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [phone, setPhone]       = useState("");
  const [role, setRole]         = useState<string>("—");
  const [newPass, setNewPass]   = useState("");

  const [ok, setOk]   = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/profile", { cache: "no-store" });
        if (r.ok) {
          const data = await r.json();
          setFullName(data.fullName ?? "");
          setEmail(data.email ?? "");
          setPhone(data.phone ?? "");
          setRole((data.profileRole ?? data.role ?? "—") as string);
        }
      } catch {}
    })();
  }, []);

  const valid = useMemo(() => {
    const nameOk  = fullName.trim().length >= 3;
    const emailOk = emailRe.test(email.trim().toLowerCase());
    const phoneOk = phoneRe.test(phone.replace(/\s/g, ""));
    const passOk  = newPass === "" || newPass.length >= 6;
    return nameOk && emailOk && phoneOk && passOk;
  }, [fullName, email, phone, newPass]);

  const save = async () => {
    setOk(null); setErr(null);
    if (!valid) { setErr("Lütfen alanları kontrol edin."); return; }
    try {
      setLoading(true);
      const payload = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.replace(/\s/g, ""),
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
      setNewPass("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:20px_20px] opacity-50"></div>
        <div className="relative flex items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-2xl blur-lg opacity-75"></div>
            <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-lg">
              <User className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              Profil Ayarları
            </h1>
            <p className="text-slate-300 text-lg">
              Kişisel bilgilerinizi güncelleyin ve hesap güvenliğinizi sağlayın
            </p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <AdminSectionCard>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Ad Soyad */}
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
              Ad Soyad
            </label>
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-white/80 p-4 backdrop-blur-sm transition-all duration-300 group-focus-within:border-indigo-300 group-focus-within:shadow-lg group-focus-within:shadow-indigo-500/10 dark:border-slate-700/60 dark:bg-slate-800/80">
                <User className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-300" />
                <input
                  className="flex-1 bg-transparent outline-none text-slate-900 dark:text-white placeholder-slate-500"
                  value={fullName}
                  onChange={(e)=>setFullName(e.target.value)}
                  placeholder="Ad Soyad"
                />
                <Pencil className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-300" />
              </div>
            </div>
          </div>

          {/* E-posta */}
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
              E-posta
            </label>
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-white/80 p-4 backdrop-blur-sm transition-all duration-300 group-focus-within:border-blue-300 group-focus-within:shadow-lg group-focus-within:shadow-blue-500/10 dark:border-slate-700/60 dark:bg-slate-800/80">
                <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                <input
                  className="flex-1 bg-transparent outline-none text-slate-900 dark:text-white placeholder-slate-500"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  placeholder="ornek@mail.com"
                />
                <Pencil className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-300" />
              </div>
            </div>
          </div>

          {/* Telefon */}
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
              Telefon
            </label>
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-white/80 p-4 backdrop-blur-sm transition-all duration-300 group-focus-within:border-green-300 group-focus-within:shadow-lg group-focus-within:shadow-green-500/10 dark:border-slate-700/60 dark:bg-slate-800/80">
                <Phone className="h-5 w-5 text-slate-400 group-focus-within:text-green-500 transition-colors duration-300" />
                <input
                  className="flex-1 bg-transparent outline-none text-slate-900 dark:text-white placeholder-slate-500"
                  value={phone}
                  onChange={(e)=>setPhone(e.target.value)}
                  placeholder="+90 5xx xxx xx xx"
                />
                <Pencil className="h-4 w-4 text-slate-400 group-focus-within:text-green-500 transition-colors duration-300" />
              </div>
            </div>
          </div>

          {/* Rol */}
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
              Rol
            </label>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-slate-50/80 p-4 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/80">
              <Shield className="h-5 w-5 text-slate-400" />
              <input
                className="flex-1 bg-transparent outline-none text-slate-900 dark:text-white"
                value={role}
                disabled
              />
            </div>
          </div>

          {/* Yeni Şifre */}
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
              Yeni Şifre (opsiyonel)
            </label>
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-white/80 p-4 backdrop-blur-sm transition-all duration-300 group-focus-within:border-orange-300 group-focus-within:shadow-lg group-focus-within:shadow-orange-500/10 dark:border-slate-700/60 dark:bg-slate-800/80">
                <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-300" />
                <input
                  className="flex-1 bg-transparent outline-none text-slate-900 dark:text-white placeholder-slate-500"
                  type="password"
                  value={newPass}
                  onChange={(e)=>setNewPass(e.target.value)}
                  placeholder="••••••"
                />
                <Pencil className="h-4 w-4 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Bildirimler */}
        <div className="mt-6 space-y-3">
          {err && (
            <div className="flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 backdrop-blur-sm">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <div>
                <div className="font-semibold text-red-700 dark:text-red-400">Hata</div>
                <div className="text-sm text-red-600 dark:text-red-300">{err}</div>
              </div>
            </div>
          )}
          {ok && (
            <div className="flex items-center gap-3 rounded-2xl border border-green-500/30 bg-green-500/10 p-4 backdrop-blur-sm">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <div>
                <div className="font-semibold text-green-700 dark:text-green-400">Başarılı</div>
                <div className="text-sm text-green-600 dark:text-green-300">{ok}</div>
              </div>
            </div>
          )}
        </div>

        {/* Kaydet Butonu */}
        <div className="mt-6">
          <button
            onClick={save}
            disabled={!valid || loading}
            className="group relative inline-flex items-center gap-3 rounded-2xl px-6 py-3 font-semibold text-white transition-all duration-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl hover:shadow-purple-500/25"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Save className="h-5 w-5 relative z-10" />
            </div>
            <span className="relative z-10">
              {loading ? "Kaydediliyor..." : "Kaydet"}
            </span>
            
            {/* Hover glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
          </button>
        </div>
      </AdminSectionCard>
    </div>
  );
}
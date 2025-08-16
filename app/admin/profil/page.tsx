// app/admin/profil/page.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import AdminHeader from "../_components/admin-header";
import AdminSectionCard from "@/app/admin/_components/admin-sectioncard";
import { Pencil } from "lucide-react";
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
          setRole((data.profileRole ?? data.role ?? "—") as string);        }
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
    <div className="space-y-6">
<AdminHeader title="Profil" desc="Bilgilerinizi güncelleyin" variant="plain" />
      <AdminSectionCard>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Ad Soyad */}
          <div className="md:col-span-2">
            <label className="text-sm">Ad Soyad</label>
            <div className="group relative rounded-xl ring-1 ring-foreground/10 bg-foreground/5">
              <input
                className="w-full bg-transparent outline-none px-3 py-2"
                value={fullName}
                onChange={(e)=>setFullName(e.target.value)}
                placeholder="Ad Soyad"
              />
              <Pencil className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
            </div>
          </div>

          {/* E-posta */}
          <div>
            <label className="text-sm">E-posta</label>
            <div className="group relative rounded-xl ring-1 ring-foreground/10 bg-foreground/5">
              <input
                className="w-full bg-transparent outline-none px-3 py-2"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                placeholder="ornek@mail.com"
              />
              <Pencil className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
            </div>
          </div>

          {/* Telefon */}
          <div>
            <label className="text-sm">Telefon</label>
            <div className="group relative rounded-xl ring-1 ring-foreground/10 bg-foreground/5">
              <input
                className="w-full bg-transparent outline-none px-3 py-2"
                value={phone}
                onChange={(e)=>setPhone(e.target.value)}
                placeholder="+90 5xx xxx xx xx"
              />
              <Pencil className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
            </div>
          </div>

          {/* Rol */}
          <div>
            <label className="text-sm">Rol</label>
            <input
              className="w-full bg-transparent outline-none px-3 py-2 rounded-xl ring-1 ring-foreground/10 bg-foreground/5"
              value={role}
              disabled
            />
          </div>

          {/* Yeni Şifre */}
          <div className="md:col-span-2">
            <label className="text-sm">Yeni Şifre (opsiyonel)</label>
            <div className="group relative rounded-xl ring-1 ring-foreground/10 bg-foreground/5">
              <input
                className="w-full bg-transparent outline-none px-3 py-2"
                type="password"
                value={newPass}
                onChange={(e)=>setNewPass(e.target.value)}
                placeholder="••••••"
              />
              <Pencil className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
            </div>
          </div>
        </div>

        {/* Bildirim */}
        <div className="pt-2 text-sm">
          {err && <span className="rounded-lg bg-red-500/15 px-2 py-1">{err}</span>}
          {ok  && <span className="rounded-lg bg-emerald-500/15 px-2 py-1">{ok}</span>}
        </div>

        {/* Kaydet */}
        <div className="pt-2">
          <button
            onClick={save}
            disabled={!valid || loading}
            className="rounded-xl px-5 py-2.5 font-semibold bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-500 text-white disabled:opacity-60"
          >
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </AdminSectionCard>
    </div>
  );
}

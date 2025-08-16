// app/panel/takim/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "../_components/page-header";
import SectionCard from "../_components/section-card";
import RoleSelect from "../_components/role-select";
import { Copy, RefreshCw, Trash2, Save } from "lucide-react";

type Role = "developer" | "designer" | "audio" | "pm";
type Member = {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  role: Role;
  status: "active" | "invited" | "admin_added" | "form_applied";
  isLeader?: boolean;
};
type Team = {
  type: "individual" | "team";
  teamName: string;
  inviteCode?: string;
  members: Member[];
};

const MAX_TEAM = 4;
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRe = /^\+?\d{10,14}$/;

// --- küçük yardımcı
function isPlaceholderTeam(t: Team | null) {
  if (!t) return true;
  if (!t.teamName) return true;
  if (!t.members || t.members.length === 0) return true;
  if (t.members[0]?.email === "leader@example.com") return true;
  return false;
}

function roleLabel(r: Role) {
  switch (r) {
    case "developer": return "Yazılımcı";
    case "designer":  return "Tasarımcı";
    case "audio":     return "Ses/Müzik";
    case "pm":        return "İçerik/PM";
  }
}

function statusLabel(s: Member["status"]) {
  switch (s) {
    case "invited":      return "Davet Gönderildi";
    case "admin_added":  return "Admin Atadı";
    case "form_applied": return "Form Kaydı";
    case "active":
    default:             return "Aktif";
  }
}

export default function TeamPage() {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // form – yeni üye
  const [mName, setMName] = useState("");
  const [mEmail, setMEmail] = useState("");
  const [mPhone, setMPhone] = useState("");
  const [mAge, setMAge] = useState<string>("");
  const [mRole, setMRole] = useState<Role>("developer");
  const [inviteLink, setInviteLink] = useState<string | null>(null);

  // temel input stilleri
  const wrap =
    "group relative rounded-xl transition input-frame ring-1 ring-[color:color-mix(in_oklab,var(--foreground)_12%,transparent)] bg-[color:color-mix(in_oklab,var(--foreground)_6%,transparent)] hover:bg-[color:color-mix(in_oklab,var(--foreground)_9%,transparent)] focus-within:ring-transparent";
  const input =
    "w-full bg-transparent outline-none px-3 py-2 text-[var(--foreground)] placeholder:text-[color:color-mix(in_oklab,var(--foreground)_55%,transparent)]";

  // İlk yükleme: cookie → (gerekirse) DB refresh
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        // 1) normal oku
        const r1 = await fetch("/api/team", { cache: "no-store" });
        if (!r1.ok) throw new Error("team fetch failed");
        const t1: Team = await r1.json();
        if (!mounted) return;
        // 2) placeholder ise DB’den tazele
        if (isPlaceholderTeam(t1)) {
          const r2 = await fetch("/api/team?refresh=1", { cache: "no-store" });
          if (r2.ok) {
            const t2: Team = await r2.json();
            if (mounted) setTeam(t2);
          } else {
            setTeam(t1);
          }
        } else {
          setTeam(t1);
        }
      } catch {
        if (mounted) setErr("Takım bilgileri alınamadı.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const canAdd = useMemo(() => {
    if (!team || team.type !== "team") return false;
    return (
      team.members.length < MAX_TEAM &&
      mName.trim().length >= 3 &&
      emailRe.test(mEmail.trim().toLowerCase()) &&
      phoneRe.test(mPhone.replace(/\s/g, "")) &&
      Number.isInteger(Number(mAge)) &&
      Number(mAge) >= 14
    );
  }, [team, mName, mEmail, mPhone, mAge]);

  const saveTeamBasics = async (patch: Partial<Team> & { action?: string }) => {
    setErr(null);
    setMsg(null);
    try {
      const r = await fetch("/api/team", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) {
        setErr(j?.message || "Kaydedilemedi");
        return;
      }
      setTeam(j as Team);
      if (!patch.action) setMsg("Güncellendi.");
    } catch {
      setErr("Bağlantı hatası");
    }
  };

  const saveTeamName = async (value: string) => {
    if (!team) return;
    await saveTeamBasics({ teamName: value });
  };

  const regenCode = async () => { await saveTeamBasics({ action: "regen_code" }); };
  const toIndividual = async () => { await saveTeamBasics({ action: "to_individual" }); };

  const addMember = async () => {
    if (!team || !canAdd) return;
    setErr(null);
    setMsg(null);
    setInviteLink(null);
    setLoading(true);
    try {
      const r = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_member",
          sendInvite: true, // davet gönder
          member: {
            name: mName.trim(),
            email: mEmail.trim().toLowerCase(),
            phone: mPhone.replace(/\s/g, ""),
            age: Number(mAge),
            role: mRole,
          },
        }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) {
        if (j?.code === "IN_OTHER_TEAM") {
          setErr("Bu e-posta başka bir takımda. Katılımcı mevcut takımından ayrılmadan eklenemez.");
        } else if (r.status === 409) {
          setErr(j?.message || "Bu e-posta zaten ekipte.");
        } else {
          setErr(j?.message || "Eklenemedi");
        }
        return;
      }
      setTeam(j.team as Team);
      setInviteLink(j.inviteResetUrl as string);
      setMsg("Üye eklendi. Davet e-postası canlıda gönderilecek. (Demo linki hazır)");
      setMName("");
      setMEmail("");
      setMPhone("");
      setMAge("");
    } finally {
      setLoading(false);
    }
  };

  const removeMember = async (email: string) => {
    setErr(null);
    setMsg(null);
    const r = await fetch(`/api/team?email=${encodeURIComponent(email)}`, { method: "DELETE" });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) {
      setErr(j?.message || "Silinemedi");
      return;
    }
    setTeam(j.team as Team);
    setMsg("Üye çıkarıldı.");
  };

  if (loading && !team) return <div className="text-sm opacity-80">Yükleniyor…</div>;
  if (!team) return null;

  const leader = team.members.find((m) => m.isLeader);
  const others = team.members.filter((m) => !m.isLeader);

  return (
    <div className="space-y-6">
      <PageHeader title="Takım" desc="Takım adınız, üyeler ve davetler" variant="plain" />

      {/* Takım Bilgileri */}
      <SectionCard title="Takım Bilgileri" subtitle={`Durum: ${team.type === "team" ? "Takım" : "Bireysel"}`}>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Takım adı + Kaydet */}
          <div className="md:col-span-2">
            <label className="text-sm">Takım Adı</label>
            <div className="flex items-center gap-2">
              <div className={[wrap, "flex-1"].join(" ")}>
                <input
                  className={input}
                  value={team.teamName ?? ""} // controlled
                  onChange={(e) => setTeam((t) => (t ? { ...t, teamName: e.target.value } : t))}
                  placeholder="Takım Adı"
                />
              </div>
              <button
                onClick={() => saveTeamName((team.teamName ?? "").trim())}
                className="inline-flex items-center gap-1 rounded-xl px-3 py-2 bg-[color:color-mix(in_oklab,var(--foreground)_92%,transparent)] text-[color:var(--background)] hover:opacity-95"
                title="Kaydet"
              >
                <Save className="h-4 w-4" /> Kaydet
              </button>
            </div>
          </div>

          {/* Tür */}
          {/* Tür */}
<div>
  <label className="text-sm">Tür</label>
  <div className={wrap}>
    <select
      className={[
        input,
        "appearance-none cursor-pointer",
        "bg-[color:color-mix(in_oklab,var(--foreground)_6%,transparent)]", // arka plan şeffaf yerine uyumlu renk
      ].join(" ")}
      value={team.type}
      onChange={(e) => saveTeamBasics({ type: e.target.value as Team["type"] })}
    >
      <option value="individual">Bireysel</option>
      <option value="team">Takım</option>
    </select>
  </div>
  <p className="mt-1 text-xs text-[color:color-mix(in_oklab,var(--foreground)_70%,transparent)]">
    Üye eklemek için türü “Takım”a alın.
  </p>
</div>

          {/* Opsiyonel: Takım Kodu */}
          <div>
            <label className="text-sm">Takım Kodu (opsiyonel)</label>
            <div className="flex items-center gap-2">
              <div className={[wrap, "flex-1"].join(" ")}>
                <input className={input} value={team.inviteCode || ""} readOnly />
              </div>
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(team.inviteCode || "");
                  setMsg("Kopyalandı");
                }}
                className="rounded-xl px-3 py-2 bg-background/60 ring-1 ring-[color:color-mix(in_oklab,var(--foreground)_20%,transparent)] hover:bg-background/80"
                title="Kopyala"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                onClick={regenCode}
                className="rounded-xl px-3 py-2 bg-background/60 ring-1 ring-[color:color-mix(in_oklab,var(--foreground)_20%,transparent)] hover:bg-background/80"
                title="Yenile"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Üyeler */}
      <SectionCard title="Üyeler" subtitle={`Toplam ${team.members.length}/${MAX_TEAM}`}>
        {/* Masaüstü tablo header */}
        <div className="hidden md:grid grid-cols-[1.2fr_1.6fr_1fr_0.6fr_0.9fr_0.9fr_0.7fr] items-center gap-2 rounded-xl bg-background/60 p-2 text-xs font-semibold ring-1 ring-[color:color-mix(in_oklab,var(--foreground)_15%,transparent)]">
          <div>Ad Soyad</div>
          <div>E-posta</div>
          <div>Telefon</div>
          <div>Yaş</div>
          <div>Rol</div>
          <div>Durum</div>
          <div>İşlem</div>
        </div>

        {/* Lider satırı */}
        {leader && (
          <div className="hidden md:grid grid-cols-[1.2fr_1.6fr_1fr_0.6fr_0.9fr_0.9fr_0.7fr] items-center gap-2 rounded-xl bg-white/10 dark:bg-black/10 p-3 backdrop-blur mt-2">
            <div className="font-semibold">👑 {leader.name}</div>
            <div className="opacity-90">{leader.email}</div>
            <div className="opacity-90">{leader.phone}</div>
            <div className="opacity-90">{leader.age}</div>
            <div className="opacity-90">{roleLabel(leader.role)}</div>
            <div className="opacity-90">Aktif</div>
            <div className="flex items-center gap-2">
              {team.type === "team" && team.members.length > 1 && (
                <button
                  onClick={toIndividual}
                  className="rounded-lg px-2.5 py-1.5 text-xs bg-amber-600/85 text-white hover:bg-amber-600"
                  title="Takımdan ayrıl (bireysel ol)"
                >
                  Bireysel Ol
                </button>
              )}
            </div>
          </div>
        )}

        {/* Diğer üyeler */}
        {others.map((m) => (
          <div
            key={m.id}
            className="hidden md:grid grid-cols-[1.2fr_1.6fr_1fr_0.6fr_0.9fr_0.9fr_0.7fr] items-center gap-2 rounded-xl bg-white/10 dark:bg-black/10 p-3 backdrop-blur mt-2"
          >
            <div className="font-medium">{m.name}</div>
            <div className="opacity-90">{m.email}</div>
            <div className="opacity-90">{m.phone}</div>
            <div className="opacity-90">{m.age}</div>
            <div className="opacity-90">{roleLabel(m.role)}</div>
            <div className="opacity-90">{statusLabel(m.status)}</div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => removeMember(m.email)}
                className="rounded-lg px-2.5 py-1.5 text-xs bg-red-600/85 text-white hover:bg-red-600"
                title="Üyeyi çıkar"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {/* Mobil kartlar */}
        <div className="md:hidden space-y-2">
          {[leader, ...others].filter(Boolean).map(
            (m) =>
              m && (
                <div key={m.id} className="rounded-xl bg-white/10 dark:bg-black/10 p-3 backdrop-blur">
                  <div className="font-semibold">{m.isLeader ? "👑 " : ""}{m.name}</div>
                  <div className="text-xs opacity-90">{m.email}</div>
                  <div className="text-xs opacity-90">{m.phone}</div>
                  <div className="text-xs opacity-90">
                    Yaş: {m.age} • {roleLabel(m.role)} • {m.isLeader ? "Aktif" : statusLabel(m.status)}
                  </div>
                  {!m.isLeader && (
                    <div className="mt-2">
                      <button
                        onClick={() => removeMember(m.email)}
                        className="rounded-lg px-2.5 py-1.5 text-xs bg-red-600/85 text-white hover:bg-red-600"
                      >
                        Üyeyi çıkar
                      </button>
                    </div>
                  )}
                  {m.isLeader && team.type === "team" && team.members.length > 1 && (
                    <div className="mt-2">
                      <button
                        onClick={toIndividual}
                        className="rounded-lg px-2.5 py-1.5 text-xs bg-amber-600/85 text-white hover:bg-amber-600"
                      >
                        Bireysel Ol
                      </button>
                    </div>
                  )}
                </div>
              )
          )}
        </div>

        {/* Yeni üye ekle */}
        <div className="mt-5">
          <h3 className="mb-2 font-semibold text-[var(--foreground)]">Üye Ekle</h3>
          {team.type !== "team" && (
            <p className="mb-3 text-sm text-[color:color-mix(in_oklab,var(--foreground)_70%,transparent)]">
              Üye eklemek için türü “Takım”a alın.
            </p>
          )}
          <div className="grid gap-3 md:grid-cols-6">
            <div className="md:col-span-2">
              <div className={wrap}>
                <input className={input} value={mName} onChange={(e) => setMName(e.target.value)} placeholder="Üye Ad Soyad" />
              </div>
            </div>
            <div>
              <div className={wrap}>
                <input className={input} value={mEmail} onChange={(e) => setMEmail(e.target.value)} placeholder="uye@mail.com" />
              </div>
            </div>
            <div>
              <div className={wrap}>
                <input className={input} value={mPhone} onChange={(e) => setMPhone(e.target.value)} placeholder="+90 5xx xxx xx xx" />
              </div>
            </div>
            <div>
              <div className={wrap}>
                <input className={input} value={mAge} onChange={(e) => setMAge(e.target.value)} placeholder="Yaş (14+)" inputMode="numeric" />
              </div>
            </div>

            {/* Rol seçimi — etiketi gizle */}
            <RoleSelect
              className="md:col-span-1 [&>label]:sr-only"
              value={mRole}
              onChange={setMRole}
            />

            <div className="md:col-span-6">
              <button
                onClick={addMember}
                disabled={!canAdd || loading}
                className={[
                  "group relative inline-flex items-center justify-center rounded-xl px-5 py-2.5 font-semibold",
                  "text-[color:var(--background)] transition active:scale-[0.99]",
                  team.type === "team"
                    ? "bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-500"
                    : "bg-[color:color-mix(in_oklab,var(--foreground)_25%,transparent)]",
                  "shadow-[0_8px_24px_rgba(99,102,241,.25)] hover:shadow-[0_10px_30px_rgba(99,102,241,.35)]",
                  "disabled:opacity-60 disabled:cursor-not-allowed",
                ].join(" ")}
                title={team.type !== "team" ? "Üye eklemek için türü 'Takım' yapın" : undefined}
              >
                {loading ? "Ekleniyor..." : "Üye Ekle"}
              </button>

              {inviteLink && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs">Davet bağlantısı (demo):</span>
                  <code className="rounded-md bg-background/60 px-2 py-1 text-xs">{inviteLink}</code>
                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(inviteLink);
                      setMsg("Davet linki kopyalandı.");
                    }}
                    className="rounded-md px-2 py-1 text-xs ring-1 ring-[color:color-mix(in_oklab,var(--foreground)_25%,transparent)] hover:bg-background/70"
                  >
                    Kopyala
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </SectionCard>

      {(msg || err) && (
        <div className="text-sm">
          {msg && (
            <span className="rounded-lg bg-emerald-500/15 px-2 py-1 text-[color:color-mix(in_oklab,green_85%,white_15%)]">
              {msg}
            </span>
          )}
          {err && (
            <span className="ml-2 rounded-lg bg-red-500/15 px-2 py-1 text-[color:color-mix(in_oklab,crimson_85%,white_15%)]">
              {err}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

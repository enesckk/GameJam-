"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminSectionCard from "@/app/admin/_components/admin-sectioncard";
import { useDisplayName } from "@/lib/use-user";
import { IdCard, Users, Megaphone, Link2, MessageSquare, Inbox } from "lucide-react";

const quickLinks = [
  { href: "/admin/katilimcilar", label: "Katılımcılar", icon: IdCard },
  { href: "/admin/takimlar",     label: "Takımlar",      icon: Users },
  { href: "/admin/duyurular",    label: "Duyurular",     icon: Megaphone },
  { href: "/admin/eslestirme",   label: "Takım Eşleşmeleri", icon: Link2 },
  { href: "/admin/mesajlar",     label: "Mesajlar",      icon: MessageSquare },
  { href: "/admin/teslimler",    label: "Teslimler",     icon: Inbox },
];

type Stats = {
  totalParticipants: number | null;
  totalTeams: number | null;
  pendingSubmissions: number | null;
  unreadMessages: number | null;
};

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-black/10 bg-white/50 p-4 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/10">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-fuchsia-500/15 via-purple-500/12 to-cyan-500/15 ring-1 ring-foreground/10">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xl font-extrabold leading-5">{value}</div>
          <div className="text-xs opacity-75">{label}</div>
        </div>
      </div>
    </div>
  );
}

export default function AdminHome() {
  const { displayName } = useDisplayName();

  const [stats, setStats] = useState<Stats>({
    totalParticipants: null,
    totalTeams: null,
    pendingSubmissions: null,
    unreadMessages: null,
  });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);

        const [usersRes, teamsRes, subsTeamsRes, msgsRes] = await Promise.all([
          fetch("/api/admin/users?page=1&pageSize=1", {
            cache: "no-store",
            credentials: "same-origin",
          }),
          fetch("/api/admin/teams?page=1&pageSize=1", {
            cache: "no-store",
            credentials: "same-origin",
          }),
          fetch("/api/admin/submissions/teams?page=1&pageSize=1", {
            cache: "no-store",
            credentials: "same-origin",
          }),
          // 👇 okunmamış mesajlar: admin inbox
          fetch("/api/admin/messages?box=inbox&unread=1&pageSize=1", {
            cache: "no-store",
            credentials: "same-origin",
          }),
        ]);

        if (!usersRes.ok) throw new Error(`Users HTTP ${usersRes.status}`);
        if (!teamsRes.ok) throw new Error(`Teams HTTP ${teamsRes.status}`);
        if (!subsTeamsRes.ok) throw new Error(`SubmissionsTeams HTTP ${subsTeamsRes.status}`);
        if (!msgsRes.ok) throw new Error(`Messages HTTP ${msgsRes.status}`);

        const usersJson = await usersRes.json();
        const teamsJson = await teamsRes.json();
        const subsTeamsJson = await subsTeamsRes.json();
        const msgsJson = await msgsRes.json(); // { total, ... }

        const next: Stats = {
          totalParticipants: Number(usersJson?.total ?? 0),
          totalTeams: Number(teamsJson?.totalTeams ?? 0),
          pendingSubmissions: Number(subsTeamsJson?.totalTeams ?? 0),
          unreadMessages: Number(msgsJson?.total ?? 0), // ✅ /api/admin/messages GET → total
        };

        if (alive) {
          setStats(next);
          setErr(null);
        }
      } catch (e: any) {
        if (alive) setErr(e?.message ?? "Bilinmeyen hata");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Hoş geldiniz */}
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
        Merhaba {displayName ?? "Yönetici"}, hoş geldiniz! 👋
      </h1>
      <p className="text-sm text-[color:color-mix(in_oklab,var(--foreground)_70%,transparent)]">
        Yönetim panelinden katılımcıları, takımları, duyuruları ve teslimleri buradan yönetebilirsiniz.
      </p>

      {err && (
        <div className="text-sm rounded-lg border border-red-500/30 bg-red-500/10 p-3">
          Metrikler yüklenemedi: <span className="font-semibold">{err}</span>
        </div>
      )}

      {/* Özet Metrikler */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat icon={IdCard}       label="Toplam Katılımcı" value={loading ? "…" : (stats.totalParticipants ?? "—")} />
        <Stat icon={Users}        label="Toplam Takım"      value={loading ? "…" : (stats.totalTeams ?? "—")} />
        <Stat icon={Inbox}        label="Bekleyen Teslim"   value={loading ? "…" : (stats.pendingSubmissions ?? "—")} />
        <Stat icon={MessageSquare} label="Okunmamış Mesaj" value={loading ? "…" : (stats.unreadMessages ?? "—")} />
      </div>

      {/* Kısayollar (BADGE YOK) */}
      <AdminSectionCard title="Kısayollar">
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
          {quickLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={[
                "group relative rounded-xl p-4 flex flex-col items-center gap-2 text-center transition",
                "bg-transparent hover:bg-background/55 hover:backdrop-blur-md hover:scale-[1.02]",
                "multicolor-hover",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklab,var(--foreground)_35%,transparent)]",
              ].join(" ")}
            >
              <div
                className={[
                  "flex h-10 w-10 items-center justify-center rounded-xl transition",
                  "group-hover:ring-1 group-hover:ring-[color:color-mix(in_oklab,var(--foreground)_18%,transparent)]",
                  "group-hover:bg-gradient-to-br group-hover:from-fuchsia-500/15 group-hover:via-purple-500/12 group-hover:to-cyan-500/15",
                ].join(" ")}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-semibold text-[var(--foreground)]">{label}</span>
            </Link>
          ))}
        </div>
      </AdminSectionCard>

      {/* Bekleyen İşler */}
      <AdminSectionCard title="Bekleyen İşler" subtitle="Hızlı aksiyon almanız gerekenler">
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li>
            <Link href="/admin/teslimler" className="underline">Teslimler</Link> sekmesinde
            <strong> {loading ? "…" : (stats.pendingSubmissions ?? 0)}</strong> bekleyen inceleme var.
          </li>
          <li>
            <Link href="/admin/mesajlar" className="underline">Mesajlar</Link> sekmesinde
            <strong> {loading ? "…" : (stats.unreadMessages ?? 0)}</strong> okunmamış ileti var.
          </li>
        </ul>
      </AdminSectionCard>
    </div>
  );
}

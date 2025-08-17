// app/panel/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import SectionCard from "./_components/section-card";
import { Bell, Upload, Users, Calendar, MessageSquare, FileText, Clock } from "lucide-react";
import { useDisplayName } from "@/lib/use-user";

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
type TeamState = {
  type: "individual" | "team";
  teamName: string;
  inviteCode?: string;
  members: Member[];
};

const quickLinks = [
  { href: "/panel/teslim", label: "Oyun Teslimi", icon: Upload },
  { href: "/panel/duyurular", label: "Duyurular", icon: Bell },
  { href: "/panel/takim", label: "Takım", icon: Users },
  { href: "/panel/mesajlar", label: "Mesajlar", icon: MessageSquare },
  { href: "/panel/kurallar", label: "Kurallar", icon: FileText },
  { href: "/panel/takvim", label: "Takvim", icon: Calendar },
];

// PanelLayout'ta kullandığın değerle birebir aynı olsun:
const COUNTDOWN_TARGET_ISO = "2025-09-20T10:00:00+03:00";

// güvenli fetch helper (credentials: 'include' ile cookie'ler gider)
async function getJSON<T = any>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error(await res.text().catch(() => `HTTP ${res.status}`));
  return res.json();
}

export default function PanelPage() {
  const { displayName } = useDisplayName();

  const [teamCount, setTeamCount] = useState<number>(0);
  const teamLimit = 4; // MAX_TEAM ile uyumlu
  const [unreadMessages, setUnreadMessages] = useState<number>(0);
  const [newAnnouncements, setNewAnnouncements] = useState<number>(0); // Duyurular endpoint’in hazır olunca bağla

  // Mesajlar: /api/messages?box=inbox&unread=1&pageSize=1  → total
  useEffect(() => {
    getJSON<{ total: number }>("/api/messages?box=inbox&unread=1&pageSize=1")
      .then((d) => setUnreadMessages(d?.total ?? 0))
      .catch(() => setUnreadMessages(0));
  }, []);

  // Takım: /api/team → members.length
  useEffect(() => {
    getJSON<TeamState>("/api/team")
      .then((t) => setTeamCount(Array.isArray(t?.members) ? t.members.length : 0))
      .catch(() => setTeamCount(0));
  }, []);

  // Duyurular: burada örnek olarak 0 bırakıldı.
  // Eğer okunmamış duyuru sayısını veren bir endpoint’in varsa, benzer şekilde bağla:
  // useEffect(() => {
  //   getJSON<{ total: number }>("/api/announcements?unread=1&pageSize=1")
  //     .then(d => setNewAnnouncements(d?.total ?? 0))
  //     .catch(() => setNewAnnouncements(0));
  // }, []);

  // Kalan gün hesaplama (PanelLayout ile aynı ISO kullanılıyor)
  const daysLeft = useMemo(() => {
    if (!COUNTDOWN_TARGET_ISO) return undefined;
    const now = new Date();
    const d = new Date(COUNTDOWN_TARGET_ISO);
    const ms = d.getTime() - now.getTime();
    if (Number.isNaN(ms)) return undefined;
    return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
  }, []);

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
        Merhaba {displayName ?? "Kullanıcı"}, hoş geldiniz! 👋
      </h1>
      <p className="text-sm text-[color:color-mix(in_oklab,var(--foreground)_70%,transparent)]">
        Profilinizi, takımınızı, duyuruları ve oyun teslimini buradan yönetebilirsiniz.
      </p>

      {/* Kısayollar — ROZET YOK */}
      <SectionCard title="Kısayollar">
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
          {quickLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={[
                "group relative rounded-xl p-4 flex flex-col items-center gap-2 text-center transition",
                "bg-transparent",
                "hover:bg-background/55 hover:backdrop-blur-md hover:scale-[1.02]",
                "multicolor-hover",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklab,var(--foreground)_35%,transparent)]",
              ].join(" ")}
            >
              <div
                className={[
                  "flex h-10 w-10 items-center justify-center rounded-xl transition",
                  "bg-transparent",
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
      </SectionCard>

      {/* Durum Özeti — Estetik rozetler */}
      <SectionCard title="Durum Özeti" subtitle="Takım ve bildirim durumunuz">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Takım */}
          <div className="rounded-2xl p-4 border border-transparent transition hover:bg-background/55 hover:backdrop-blur-md hover:border-[color:color-mix(in_oklab,var(--foreground)_14%,transparent)]">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-fuchsia-500/20 via-purple-500/15 to-cyan-500/20">
                <Users className="h-4 w-4" />
              </div>
              <div className="text-xs opacity-80">Takım</div>
            </div>
            <div className="mt-2 text-lg font-semibold">
              {teamCount}/{teamLimit}
            </div>
          </div>

          {/* Yeni Mesaj */}
          <div className="rounded-2xl p-4 border border-transparent transition hover:bg-background/55 hover:backdrop-blur-md hover:border-[color:color-mix(in_oklab,var(--foreground)_14%,transparent)]">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-cyan-500/20 via-sky-500/15 to-emerald-500/20">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div className="text-xs opacity-80">Yeni Mesaj</div>
            </div>
            <div className="mt-2 text-lg font-semibold">{unreadMessages}</div>
          </div>

          {/* Teslime Kalan */}
          <div className="rounded-2xl p-4 border border-transparent transition hover:bg-background/55 hover:backdrop-blur-md hover:border-[color:color-mix(in_oklab,var(--foreground)_14%,transparent)]">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-violet-500/20 via-indigo-500/15 to-fuchsia-500/20">
                <Clock className="h-4 w-4" />
              </div>
              <div className="text-xs opacity-80">Teslime Kalan</div>
            </div>
            <div className="mt-2 text-lg font-semibold">
              {typeof daysLeft === "number" ? `${daysLeft} gün` : "—"}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Hatırlatma */}
      <SectionCard title="Teslim Hatırlatması" subtitle="Son teslim tarihi">
        <p className="text-sm">
          Son teslim: <strong>12 Ekim 2025 • 23:59</strong> (örnek). Dosyalarınızı{" "}
          <Link href="/panel/teslim" className="underline">Teslim</Link> sayfasından yükleyin.
        </p>
      </SectionCard>
    </div>
  );
}

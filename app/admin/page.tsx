// app/admin/page.tsx
"use client";

import Link from "next/link";
import AdminHeader from "./_components/admin-header";
import AdminSectionCard from "@/app/admin/_components/admin-sectioncard";
import { useDisplayName } from "@/lib/use-user";
import {
  IdCard, Users, Megaphone, Link2, MessageSquare, Inbox, ShieldCheck
} from "lucide-react";

// Admin kısayolları
const quickLinks = [
  { href: "/admin/katilimcilar", label: "Katılımcılar", icon: IdCard },
  { href: "/admin/takimlar", label: "Takımlar", icon: Users },
  { href: "/admin/duyurular", label: "Duyurular", icon: Megaphone },
  { href: "/admin/eslestirme", label: "Takım Eşleşmeleri", icon: Link2 },
  { href: "/admin/mesajlar", label: "Mesajlar", icon: MessageSquare },
  { href: "/admin/teslimler", label: "Ödev/Teslimler", icon: Inbox },
];

// (opsiyonel) sayılar; API’den doldurulabilir
const badges: Record<string, number> = {
 // "/admin/duyurular": 1,
  "/admin/mesajlar": 3,
  "/admin/teslimler": 5,
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

  return (
    <div className="space-y-6">
      {/* Hoş geldiniz mesajı */}
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
        Merhaba {displayName ?? "Yönetici"}, hoş geldiniz! 👋
      </h1>
      <p className="text-sm text-[color:color-mix(in_oklab,var(--foreground)_70%,transparent)]">
        Yönetim panelinden katılımcıları, takımları, duyuruları ve teslimleri buradan yönetebilirsiniz.
      </p>

      {/* Özet Metrikler */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat icon={IdCard} label="Toplam Katılımcı" value="—" />
        <Stat icon={Users}  label="Toplam Takım"      value="—" />
        <Stat icon={Inbox}  label="Bekleyen Teslim"   value={badges["/admin/teslimler"] ?? 0} />
        <Stat icon={MessageSquare} label="Okunmamış Mesaj" value={badges["/admin/mesajlar"] ?? 0} />
      </div>

      {/* Kısayollar */}
      <AdminSectionCard title="Kısayollar">
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
          {quickLinks.map(({ href, label, icon: Icon }) => {
            const count = badges[href] ?? 0;
            return (
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

                {count > 0 && (
                  <span
                    className={[
                      "absolute top-2 right-2 rounded-full px-1.5 py-0.5 text-[10px] font-bold transition",
                      "text-[color:var(--background)] bg-[color:color-mix(in_oklab,var(--foreground)_75%,transparent)]",
                      "group-hover:text-white group-hover:bg-gradient-to-r group-hover:from-fuchsia-600 group-hover:to-cyan-500",
                    ].join(" ")}
                    aria-label={`${label} için ${count} yeni`}
                  >
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </AdminSectionCard>

      {/* Bekleyen İşler */}
      <AdminSectionCard title="Bekleyen İşler" subtitle="Hızlı aksiyon almanız gerekenler">
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li>
            <Link href="/admin/teslimler" className="underline">Teslimler</Link> sekmesinde
            <strong> {badges["/admin/teslimler"] ?? 0}</strong> bekleyen inceleme var.
          </li>
          <li>
            <Link href="/admin/duyurular" className="underline">Duyurular</Link> sekmesinde 1 taslak duyuru.
          </li>
          <li>
            <Link href="/admin/mesajlar" className="underline">Mesajlar</Link> sekmesinde okunmamış iletileriniz var.
          </li>
        </ul>
      </AdminSectionCard>
    </div>
  );
}

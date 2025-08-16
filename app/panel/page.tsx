"use client";

import Link from "next/link";
import PageHeader from "./_components/page-header";
import SectionCard from "./_components/section-card";
import { Bell, Upload, Users, Calendar, MessageSquare, FileText } from "lucide-react";
import { useDisplayName } from "@/lib/use-user";

const quickLinks = [
  { href: "/panel/teslim", label: "Oyun Teslimi", icon: Upload },
  { href: "/panel/duyurular", label: "Duyurular", icon: Bell },
  { href: "/panel/takim", label: "Takım", icon: Users },
  { href: "/panel/mesajlar", label: "Mesajlar", icon: MessageSquare },
  { href: "/panel/kurallar", label: "Kurallar", icon: FileText },
  { href: "/panel/takvim", label: "Takvim", icon: Calendar },
];

// (opsiyonel) sayılar; 0 veya undefined ise rozet gizlenir
const badges: Record<string, number> = {
  "/panel/duyurular": 2,
  "/panel/mesajlar": 1,
};

export default function PanelHome() {
  const { displayName } = useDisplayName();

  return (
    <div className="space-y-6">
      {/* İsim: klasik, tema uyumlu */}
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
        Merhaba {displayName ?? "Kullanıcı"}, hoş geldiniz! 👋
      </h1>
      <p className="text-sm text-[color:color-mix(in_oklab,var(--foreground)_70%,transparent)]">
        Profilinizi, takımınızı, duyuruları ve oyun teslimini buradan yönetebilirsiniz.
      </p>

      {/* Kısayollar: başlangıçta nötr, sadece hover'da renk */}
      <SectionCard title="Kısayollar">
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
          {quickLinks.map(({ href, label, icon: Icon }) => {
            const count = badges[href] ?? 0;
            return (
              <Link
                key={href}
                href={href}
                className={[
                  "group relative rounded-xl p-4 flex flex-col items-center gap-2 text-center transition",
                  // Başlangıçta tamamen nötr
                  "bg-transparent",
                  // Sadece hover'da arka plan, blur ve minik scale
                  "hover:bg-background/55 hover:backdrop-blur-md hover:scale-[1.02]",
                  // Sadece hover'da renkli çerçeve
                  "multicolor-hover",
                  // Erişilebilirlik: sadece klavye odakta ring göster
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklab,var(--foreground)_35%,transparent)]",
                ].join(" ")}
              >
                {/* İkon kutucuğu: başta nötr, hover’da soft tint + ince ring */}
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

                {/* Mini badge: başta nötr, hover’da degrade renge dönüşür */}
                {count > 0 && (
                  <span
                    className={[
                      "absolute top-2 right-2 rounded-full px-1.5 py-0.5 text-[10px] font-bold transition",
                      // nötr pil
                      "text-[color:var(--background)] bg-[color:color-mix(in_oklab,var(--foreground)_75%,transparent)]",
                      // hover’da gradient + beyaz
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
      </SectionCard>

      {/* Önemli Rozetler */}
      <SectionCard title="Önemli Rozetler">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full px-3 py-1.5 text-xs font-semibold ring-0 bg-transparent text-[var(--foreground)]">
            Takım: 1/4
          </span>
          <span className="rounded-full px-3 py-1.5 text-xs font-semibold ring-0 bg-transparent text-[var(--foreground)]">
            Yeni Duyuru: {badges["/panel/duyurular"] ?? 0}
          </span>
          <span className="rounded-full px-3 py-1.5 text-xs font-semibold ring-0 bg-transparent text-[var(--foreground)]">
            Yeni Mesaj: {badges["/panel/mesajlar"] ?? 0}
          </span>
          <span className="rounded-full px-3 py-1.5 text-xs font-semibold ring-0 bg-transparent text-[var(--foreground)]">
            Teslime Kalan: 2 gün
          </span>
        </div>
      </SectionCard>

      {/* Hatırlatma */}
      <SectionCard title="Teslim Hatırlatması" subtitle="Son teslim tarihi örnek">
        <p className="text-sm">
          Son teslim: <strong>12 Ekim 2025 • 23:59</strong> (örnek). Dosyalarınızı{" "}
          <Link href="/panel/teslim" className="underline">Teslim</Link> sayfasından yükleyin.
        </p>
      </SectionCard>
    </div>
  );
}

// app/panel/sponsorlar/page.tsx
"use client";

import PageHeader from "../_components/page-header";
import SectionCard from "../_components/section-card";
import { ExternalLink } from "lucide-react";
import { useMemo } from "react";

type Sponsor = {
  name: string;
  logo?: string;        // /public/sponsors/...
  website?: string;
  note?: string;
  badge?: string;
  highlight?: boolean;
};

export default function SponsorsPage() {
  const HOST: Sponsor[] = [
    {
      name: "Şehitkamil Belediyesi",
      logo: "/sehitkamill.png",
      website: "https://www.sehitkamil.bel.tr",
      note: "Etkinlik ev sahibi ve uygulama entegrasyonu",
      badge: "Ev Sahibi",
      highlight: true,
    },
  ];

  const MAIN: Sponsor[] = [
    {
      name: "Huawei Türkiye",
      logo: "/huaweilogo.png",
      website: "https://consumer.huawei.com/tr/",
      note: "1. ve 2. takıma ödüller, mentörlük ve görünürlük desteği",
      badge: "Ana Sponsor",
      highlight: true,
    },
  ];

  const SUPPORT: Sponsor[] = [
    {
      name: "RotateLab",
      logo: "/rotatelab.png",
      website: "https://rotatelab.co",
      note: "Ödül, mentörlük ve girişimleşme desteği",
      badge: "Destek Sponsoru",
    },
  ];

  const EQUIPMENT: Sponsor[] = [
    {
      name: "Planet Ekipman",
      logo: "/planet.png",
      website: "https://planetekipman.com",
      note: "Oyun aksesuar seti ve ek ödüller",
      badge: "Ekipman Sponsoru",
    },
  ];

  const CATERING: Sponsor[] = [
    {
      name: "Varil Çorba",
      logo: "/varil.png",
      website: "",
      note: "Protokol ve akşam yemeği ikramları",
      badge: "İkram Sponsoru",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Sponsorlar"
        desc="Etkinliğimize katkı sağlayan kurum ve markalar"
        variant="plain"
      />

      {/* Daha büyük kartlar için 2 sütunlu geniş grid */}
      <SectionBlock title="Ev Sahibi / Organizasyon" items={HOST} />
      <SectionBlock title="Ana Sponsor" items={MAIN} />
      <SectionBlock title="Destek Sponsoru" items={SUPPORT} />
      <SectionBlock title="Ekipman Sponsoru" items={EQUIPMENT} />
      <SectionBlock title="İkram Sponsoru" items={CATERING} />

      <SectionCard>
        <p className="text-xs opacity-75">
          * Liste PDF’teki bilgiye göre manuel güncellenir. Logo dosyalarını <code>/public/sponsors/</code> altına koyun
          ve gerekirse web adreslerini ekleyin.
        </p>
      </SectionCard>
    </div>
  );
}

/* — Bölüm + geniş grid (2 sütun) — */
function SectionBlock({ title, items }: { title: string; items: Sponsor[] }) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg md:text-xl font-semibold text-foreground">{title}</h2>
      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
        {items.map((s, i) => (
          <SponsorCard key={i} data={s} />
        ))}
      </div>
    </section>
  );
}

/* — Büyük Sponsor Kartı — */
/* — Büyük Sponsor Kartı (renkli default, hover’da canlılık) — */
function SponsorCard({ data }: { data: Sponsor }) {
  const initials = useMemo(
    () =>
      data.name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((x) => x[0]?.toUpperCase())
        .join("") || "•",
    [data.name]
  );

  return (
    <div
      className={[
        "group relative transition-transform duration-200 will-change-transform",
        data.highlight ? "gborder rounded-2xl" : "gborder-hover rounded-2xl",
        "hover:scale-[1.04] hover:shadow-[0_22px_70px_rgba(124,58,237,.22)]",
      ].join(" ")}
    >
      {data.badge && (
        <div className="pointer-events-none absolute right-4 top-4 z-10 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ring-1 ring-foreground/20 bg-foreground/10 backdrop-blur">
          {data.badge}
        </div>
      )}

      <div className="rounded-2xl bg-white/10 dark:bg-black/10 backdrop-blur p-6 md:p-7 min-h-[160px]">
        <div className="flex items-center gap-6">
          {/* Logo: renkli default, hover’da daha canlı + hafif zoom */}
          <div className="relative shrink-0 h-24 w-24 md:h-28 md:w-28 rounded-2xl overflow-hidden ring-1 ring-foreground/10 bg-foreground/10">
            {data.logo ? (
              <img
                src={data.logo}
                alt={data.name}
                className="
                  h-full w-full object-contain p-3
                  transition duration-200 ease-out
                  group-hover:scale-[1.03]
                  group-hover:saturate-150 group-hover:brightness-110 group-hover:contrast-110
                "
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold">{initials}</span>
              </div>
            )}
          </div>

          {/* Bilgi */}
          <div className="min-w-0">
            <div className="text-base md:text-lg font-semibold text-foreground truncate">
              {data.name}
            </div>
            {data.note && (
              <div className="mt-1 text-sm md:text-base opacity-85">{data.note}</div>
            )}
            {data.website && (
              <div className="mt-3">
                <a
                  href={data.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm underline underline-offset-4 hover:no-underline"
                >
                  Siteyi ziyaret et
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

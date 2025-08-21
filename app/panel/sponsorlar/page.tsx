"use client";

import PageHeader from "../_components/page-header";
import SectionCard from "../_components/section-card";
import { ExternalLink, Building2, Star, Award, Gift, Heart } from "lucide-react";
import { useMemo } from "react";

type Sponsor = {
  name: string;
  logo?: string;
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

  const EQUIPMENT: Sponsor[] = [
    {
      name: "Planet Ekipman",
      logo: "/planet.png",
      website: "https://planetekipman.com",
      note: "Oyun aksesuar seti ve ek ödüller",
      badge: "Ekipman Sponsoru",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Sponsorlar"
        desc="Etkinliğimize katkı sağlayan kurum ve markalar"
        variant="plain"
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/20 via-pink-500/15 to-blue-500/20 backdrop-blur-xl border border-purple-500/30 p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 animate-pulse"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Sponsorlarımız</h2>
              <p className="text-purple-200/80">Değerli destekçilerimiz</p>
            </div>
          </div>
          
          <p className="text-base leading-relaxed text-purple-100 max-w-2xl">
            Şehitkamil Game Jam'in başarılı bir şekilde gerçekleşmesinde büyük katkısı olan 
            sponsorlarımıza teşekkür ederiz. Onların desteği sayesinde katılımcılarımıza 
            değerli ödüller ve fırsatlar sunabiliyoruz.
          </p>
        </div>
      </div>

      {/* Sponsor Sections */}
      <SectionBlock 
        title="Ev Sahibi / Organizasyon" 
        items={HOST} 
        icon={Star}
        color="from-yellow-500 to-orange-500"
      />
      
      <SectionBlock 
        title="Ana Sponsor" 
        items={MAIN} 
        icon={Award}
        color="from-purple-500 to-pink-500"
      />
      
      <SectionBlock 
        title="Ekipman Sponsoru" 
        items={EQUIPMENT} 
        icon={Gift}
        color="from-green-500 to-emerald-500"
      />

      {/* İstatistikler */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: Building2, title: "Toplam Sponsor", value: HOST.length + MAIN.length + EQUIPMENT.length, color: "from-blue-500 to-cyan-500" },
          { icon: Award, title: "Ana Sponsor", value: MAIN.length, color: "from-purple-500 to-pink-500" },
          { icon: Heart, title: "Destek", value: "Sınırsız", color: "from-red-500 to-pink-500" },
        ].map((item, index) => (
          <div key={index} className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 backdrop-blur-xl border border-purple-500/20 p-6 hover:scale-105 transition-all duration-300">
            <div className="flex flex-col items-center text-center gap-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                <item.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{item.value}</div>
                <div className="text-sm text-purple-200/80">{item.title}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-500/10 via-gray-600/5 to-gray-700/10 backdrop-blur-xl border border-gray-500/20 p-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Star className="h-4 w-4 text-white" />
          </div>
          <div className="text-sm text-gray-200/80">
            <p>
              * Liste PDF'teki bilgiye göre manuel güncellenir. Logo dosyalarını <code className="bg-gray-600/30 px-1 rounded">/public/sponsors/</code> altına koyun
              ve gerekirse web adreslerini ekleyin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionBlock({ 
  title, 
  items, 
  icon: Icon, 
  color 
}: { 
  title: string; 
  items: Sponsor[]; 
  icon: any;
  color: string;
}) {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <p className="text-sm text-purple-200/80">{items.length} sponsor</p>
        </div>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
        {items.map((s, i) => (
          <SponsorCard key={i} data={s} />
        ))}
      </div>
    </section>
  );
}

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
    <div className={`group relative overflow-hidden rounded-3xl ${
      data.highlight 
        ? "bg-gradient-to-br from-yellow-500/20 via-orange-500/15 to-red-500/20 border-yellow-500/30" 
        : "bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 border-purple-500/20"
    } backdrop-blur-xl border p-6 hover:scale-105 transition-all duration-300 hover:shadow-xl`}>
      
      {/* Animated background */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
        data.highlight 
          ? "bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10" 
          : "bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10"
      }`}></div>
      
      {/* Badge */}
      {data.badge && (
        <div className={`absolute right-4 top-4 z-10 rounded-full px-3 py-1.5 text-xs font-bold tracking-wide ${
          data.highlight 
            ? "bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg" 
            : "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg"
        }`}>
          {data.badge}
        </div>
      )}

      <div className="relative z-10">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div className="relative shrink-0">
            <div className={`w-24 h-24 md:w-28 md:h-28 rounded-3xl overflow-hidden ring-2 ${
              data.highlight 
                ? "ring-yellow-500/30 bg-gradient-to-br from-yellow-500/20 to-orange-500/20" 
                : "ring-purple-500/30 bg-gradient-to-br from-purple-500/20 to-pink-500/20"
            } shadow-lg`}>
              {data.logo ? (
                <img
                  src={data.logo}
                  alt={data.name}
                  className="h-full w-full object-contain p-4 transition duration-300 ease-out group-hover:scale-110 group-hover:saturate-150 group-hover:brightness-110 group-hover:contrast-110"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{initials}</span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <h3 className="text-lg md:text-xl font-bold text-white mb-2 truncate">
              {data.name}
            </h3>
            
            {data.note && (
              <p className="text-sm text-purple-100/80 mb-4 leading-relaxed">
                {data.note}
              </p>
            )}
            
            {data.website && (
              <a
                href={data.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-200 text-sm font-medium"
              >
                <ExternalLink className="h-4 w-4" />
                Siteyi Ziyaret Et
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
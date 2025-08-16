"use client";

import { useState } from "react";
import PageHeader from "../_components/page-header";
import SectionCard from "../_components/section-card";

type Row = { time: string; title: string; note?: string; icon?: string };

const day1: Row[] = [
  { time: "09:00 – 10:00", icon: "🍽️", title: "Kahvaltı & Kayıt", note: "Karşılama, giriş işlemleri, yaka kartı & ekip karşılaması" },
  { time: "10:00 – 10:30", icon: "🗣️", title: "Açılış Konuşmaları", note: "Şehitkamil Belediyesi ve sponsor kurumlar" },
  { time: "10:30 – 10:45", icon: "🎮", title: "Tema Açıklanır", note: "“Oyna ve Kazan!”" },
  { time: "10:45 – 11:00", icon: "📱", title: "Sosyal Medya Görevi Başlatılır", note: "Paylaşım rehberi ve görev açıklaması yapılır" },
  { time: "11:00 – 13:00", icon: "🧠", title: "Takım içi planlama & fikir geliştirme", note: "Beyin fırtınası ve görev dağılımı" },
  { time: "13:00 – 14:00", icon: "🍽️", title: "Öğle Yemeği" },
  { time: "14:00 – 19:00", icon: "💻", title: "Kodlamaya Başlanır", note: "Geliştirme süreci, mentör desteği aktif" },
  { time: "19:00 – 20:00", icon: "🍽️", title: "Akşam Yemeği" },
  { time: "20:00 – 21:00", icon: "🎯", title: "Kahoot Bilgi Yarışması", note: "Bilgi ve eğlence dolu ödüllü yarışma 🎁" },
  { time: "21:00 – 23:00", icon: "🌙", title: "Gece Geliştirme Oturumu", note: "Sessiz çalışma ve mentör sohbetleri" },
  { time: "23:00",        icon: "🍩", title: "Tatlı İkramı", note: "Gece atıştırmalığı" },
  { time: "Tüm Gece",     icon: "☕", title: "Kodlamaya Devam & Kahve Standı", note: "Salonlar açık, ekip çalışmaları sürecek" },
];

const day2: Row[] = [
  { time: "09:00 – 10:00", icon: "☕",  title: "Kahvaltı & Güne Başlangıç" },
  { time: "10:00 – 12:00", icon: "🛠️", title: "Final Geliştirme", note: "Son kontroller, teslim hazırlıkları" },
  { time: "12:00 – 13:00", icon: "🧾", title: "Proje Teslimi", note: "Web sistemi üzerinden teslim alınır" },
  { time: "13:00 – 14:00", icon: "🍽️", title: "Öğle Yemeği" },
  { time: "14:00 – 16:00", icon: "🧑‍⚖️", title: "Jüri Değerlendirme & Sunumlar", note: "Tüm ekipler sırasıyla sunum yapar" },
  { time: "16:00 – 16:30", icon: "📱", title: "Ara & Sosyal Medya Görevi Kapanışı", note: "Son paylaşımlar alınır" },
  { time: "16:30 – 17:00", icon: "🏆", title: "Ödül Töreni", note: "Dereceler, sosyal medya ödülleri, sürpriz çekiliş" },
  { time: "17:00 – 17:30", icon: "📸", title: "Kapanış Konuşmaları", note: "Teşekkürler & hatıra fotoğrafı" },
];

/** Kablo + nokta timeline; kutular eskisiyle aynı formatta (multicolor-hover tüm satıra) */
function Timeline({ rows }: { rows: Row[] }) {
  return (
    <div className="relative">
      {/* Kablo katmanı */}
      <div className="pointer-events-none absolute left-3 top-0 bottom-0">
        <div className="absolute inset-y-0 left-0 w-px bg-white/15" />
        <div
          className="absolute inset-y-0 -left-[1px] w-[3px] rounded-full opacity-80
                     bg-[linear-gradient(180deg,theme(colors.fuchsia.500),theme(colors.cyan.400),theme(colors.fuchsia.500))]
                     [background-size:100%_300%] animate-[cable_6s_linear_infinite]"
        />
        <div
          className="absolute inset-y-0 -left-[3px] w-[8px] rounded-full blur-sm opacity-25
                     bg-[linear-gradient(180deg,theme(colors.fuchsia.500),transparent,theme(colors.cyan.400),transparent)]"
        />
      </div>

      {/* Satırlar: 24px kablo kolonu + sağda kutu (içinde 140px|1fr) */}
      <ol className="space-y-2">
        {rows.map((r, i) => (
          <li key={i} className="grid grid-cols-[24px_1fr] gap-3">
            {/* Nokta */}
            <div className="relative h-[48px]">
              <span
                className="absolute left-3 top-1/2 -translate-x-1/2 -translate-y-1/2
                           w-3.5 h-3.5 rounded-full border border-white/30
                           bg-gradient-to-r from-fuchsia-500 to-cyan-400 shadow-[0_0_10px_rgba(168,85,247,.25)]"
                aria-hidden
              />
            </div>

            {/* Satır kutusu — ESKİ FORMAT: tüm satırda multicolor-hover */}
            <div
              className={[
                "group relative grid grid-cols-[140px_1fr] items-start gap-3 rounded-xl p-3",
                "bg-transparent",            // şeffaf
                "multicolor-hover",          // hover’da renkli kenarlık/ışıma (senin sınıfın)
                "backdrop-blur-sm",          // okunabilirlik
                "transition"
              ].join(" ")}
            >
              <div className="pt-0.5 text-sm tabular-nums">{r.time}</div>
              <div>
                <div className="text-sm font-semibold">
                  {r.icon && <span className="mr-1">{r.icon}</span>}
                  {r.title}
                </div>
                {r.note && (
                  <div className="mt-0.5 text-xs text-[color:color-mix(in_oklab,var(--foreground)_75%,transparent)]">
                    {r.note}
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function SchedulePage() {
  const [day, setDay] = useState<1 | 2>(1);

  return (
    <div className="space-y-6">
      <PageHeader title="Takvim" desc="Etkinlik akışı — 2 gün" variant="plain" />

      {/* Sekmeler — aktif olana kalıcı gradient kenarlık */}
      <div className="flex items-center justify-start">
        <div className="inline-flex gap-2 rounded-2xl p-1 bg-white/5 dark:bg-black/10 backdrop-blur">
          <button
            onClick={() => setDay(1)}
            aria-pressed={day === 1}
            className={[
              "px-4 py-2 rounded-xl text-sm font-semibold transition",
              "hover:scale-[1.02] multicolor-hover",
              day === 1 ? "multicolor-persist bg-foreground/10" : "opacity-90"
            ].join(" ")}
          >
            1. Gün (Cumartesi)
          </button>
          <button
            onClick={() => setDay(2)}
            aria-pressed={day === 2}
            className={[
              "px-4 py-2 rounded-xl text-sm font-semibold transition",
              "hover:scale-[1.02] multicolor-hover",
              day === 2 ? "multicolor-persist bg-foreground/10" : "opacity-90"
            ].join(" ")}
          >
            2. Gün (Pazar)
          </button>
        </div>
      </div>

      {day === 1 ? (
        <SectionCard title="1. Gün – Açılış, Tema ve Geliştirme Başlangıcı">
          <Timeline rows={day1} />
        </SectionCard>
      ) : (
        <SectionCard title="2. Gün – Son Dokunuşlar, Jüri Sunumları & Ödüller">
          <Timeline rows={day2} />
        </SectionCard>
      )}
    </div>
  );
}


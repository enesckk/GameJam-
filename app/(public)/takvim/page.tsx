// app/(public)/takvim/page.tsx
import VideoBG from "@/components/background/video-bg";
import PageHeader from "../../panel/_components/page-header"; // kendi yolunu ayarla

const SCHEDULE = [
  {
    title: "Son Başvuru",
    date: "5 Nisan 2025",
    desc: "Bireysel veya takım olarak kayıtların tamamlanması",
  },
  {
    title: "Etkinlik Başlangıcı & Tema Duyurusu",
    date: "12 Nisan 2025 • 10:00",
    desc: "Kayıt & karşılama sonrası açılış ve tema açıklaması",
  },
  {
    title: "Oyun Teslimi",
    date: "14 Nisan 2025 • 10:00",
    desc: "Panel ▸ Oyun Teslimi üzerinden belirtilen formatta yüklenmesi",
  },
  {
    title: "Sunum & Jüri",
    date: "14 Nisan 2025 • 14:00",
    desc: "Takımlar projelerini jüriye sunar, değerlendirme kriterleri uygulanır",
  },
  {
    title: "Ödül Töreni",
    date: "14 Nisan 2025 • 18:00",
    desc: "Dereceler ve sponsor ödülleri açıklanır",
  },
];

export default function SchedulePage() {
  return (
    <section className="relative min-h-screen">
      {/* 🎥 Arka plan video */}
      <VideoBG
        light={{
          webm: "/videos/light.webm",
          mp4: "/videos/bg-light.mp4",
          poster: "/videos/light-poster.jpg",
        }}
        dark={{
          webm: "/videos/dark.webm",
          mp4: "/videos/bg-dark.mp4",
          poster: "/videos/dark-poster.jpg",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        {/* Blur + renkli kenarlıklı kart */}
        <div
          className="gborder rounded-2xl backdrop-blur-md p-8"
          style={{
            backgroundColor:
              "color-mix(in oklab, var(--foreground) 5%, transparent)",
          }}
        >
          <PageHeader
            title="Etkinlik Takvimi"
            desc="Game Jam sürecinin önemli tarihleri"
            variant="plain"
          />

          <ol className="mt-6 space-y-4 text-[color:var(--foreground)]">
            {SCHEDULE.map((item, idx) => (
              <li
                key={idx}
                className="rounded-xl bg-white/5 dark:bg-black/20 backdrop-blur-sm p-4 gborder"
              >
                <div className="font-semibold text-lg">{item.title}</div>
                <div className="text-sm opacity-85">{item.date}</div>
                <div className="text-sm opacity-80 mt-1">{item.desc}</div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

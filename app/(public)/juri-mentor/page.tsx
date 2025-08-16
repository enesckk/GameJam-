// app/(public)/juri-mentorler/page.tsx
import VideoBG from "@/components/background/video-bg";
import PageHeader from "../../panel/_components/page-header";
import Image from "next/image";

type Member = {
  name: string;
  role: string;
  img: string;   // public/ altındaki yol (örn: /images/jury/enis.jpg)
  type: "Jüri" | "Mentör";
};

const MEMBERS: Member[] = [
  { name: "Enis Kirazoğlu", role: "Oyun Yayıncısı / İçerik Üretici", img: "/jury/enis.jpg", type: "Jüri" },
  { name: "Ferit (wtcN)", role: "Streamer & İçerik Üretici",       img: "/jury/ferit.jpg", type: "Jüri" },
  { name: "Dr. Ayşe Yılmaz", role: "Üniversite Öğretim Üyesi",      img: "/mentors/ayse.jpg", type: "Mentör" },
  { name: "Mehmet Demir",    role: "Kıdemli Oyun Geliştirici",      img: "/mentors/mehmet.jpg", type: "Mentör" },
  // ... dilediğin kadar ekleyebilirsin
];

export default function JuryMentorsPage() {
  return (
    <section className="relative min-h-screen">
      {/* 🎥 Arka plan video */}
      <VideoBG
        light={{ webm: "/videos/light.webm", mp4: "/videos/bg-light.mp4", poster: "/videos/light-poster.jpg" }}
        dark={{ webm: "/videos/dark.webm", mp4: "/videos/bg-dark.mp4", poster: "/videos/dark-poster.jpg" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        {/* Dış kapsayıcı kart: blur + her zaman renkli kenarlık */}
        <div
          className="gborder rounded-2xl backdrop-blur-md p-8"
          style={{ backgroundColor: "color-mix(in oklab, var(--foreground) 5%, transparent)" }}
        >
          <PageHeader
            title="Jüri & Mentörler"
            desc="Game Jam boyunca bize eşlik edecek jüri üyeleri ve mentörler"
            variant="plain"
          />

          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {MEMBERS.map((m) => (
              <article
                key={m.name}
                className="
                  group gborder rounded-2xl p-5
                  bg-white/5 dark:bg-black/20 backdrop-blur-sm
                  transition-transform duration-300 will-change-transform
                  hover:scale-[1.02]
                "
              >
                {/* Fotoğraf */}
                <div
                  className="
                    relative mx-auto mb-4 h-28 w-28 overflow-hidden rounded-full
                    gborder
                    transition-transform duration-300 will-change-transform
                    group-hover:scale-[1.07]
                  "
                >
                  <Image
                    src={m.img} // public/ klasöründen
                    alt={m.name}
                    fill
                    sizes="112px"
                    className="object-cover"
                    priority={false}
                  />
                </div>

                {/* Metinler */}
                <h3 className="text-lg font-semibold text-[color:var(--foreground)] text-center">
                  {m.name}
                </h3>
                <p className="text-sm opacity-85 text-[color:var(--foreground)] text-center">
                  {m.role}
                </p>

                <div className="mt-2 text-center">
                  <span
                    className="
                      inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold
                      bg-white/10 dark:bg-black/30
                      text-pink-500 uppercase tracking-wide
                    "
                  >
                    {m.type}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

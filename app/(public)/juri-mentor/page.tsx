// app/(public)/juri-mentorler/page.tsx
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
    <section
      className="
        relative isolate min-h-screen overflow-hidden
        text-white dark:text-white
        bg-gradient-to-b from-white via-gray-100 to-gray-200
        dark:from-slate-950 dark:via-slate-900 dark:to-slate-900
      "
    >
      {/* Katman A: büyük mesh */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute -z-10 inset-[-20%] opacity-80
          [background:radial-gradient(55%_60%_at_20%_15%,rgba(99,102,241,.35),transparent_60%),radial-gradient(60%_55%_at_85%_25%,rgba(34,197,94,.30),transparent_60%)]
          motion-safe:animate-[meshPan_18s_ease-in-out_infinite]
        "
        style={{ mixBlendMode: "screen" }}
      />
      {/* Katman B: küçük mesh */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute -z-10 inset-[-30%] opacity-70
          [background:radial-gradient(45%_50%_at_30%_80%,rgba(56,189,248,.30),transparent_60%),radial-gradient(50%_45%_at_75%_70%,rgba(244,114,182,.28),transparent_60%)]
          motion-safe:animate-[meshPanAlt_12s_ease-in-out_infinite]
        "
        style={{ mixBlendMode: "screen" }}
      />
      {/* Katman C: conic swirl */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute -z-10 -inset-[25%] opacity-60
          [background:conic-gradient(from_210deg_at_50%_50%,rgba(14,165,233,.35),rgba(139,92,246,.35),rgba(34,197,94,.25),rgba(14,165,233,.35))]
          motion-safe:animate-[swirl_22s_linear_infinite]
          rounded-[9999px] blur-3xl
        "
        style={{ mixBlendMode: "screen" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        {/* Dış kapsayıcı kart: blur + her zaman renkli kenarlık */}
        <div
          className="gborder rounded-2xl backdrop-blur-md p-8 border border-white/20 dark:border-white/10"
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

// app/(public)/juri-mentorler/page.tsx
import PageHeader from "../../panel/_components/page-header";
import Image from "next/image";

type Member = {
  name: string;
  role: string;
  img: string;   // public/ altındaki yol (örn: /images/jury/enis.jpg)
  type: "Jüri" | "Mentör";
  color: string;
  emoji: string;
};

const MEMBERS: Member[] = [
  { name: "Enis Kirazoğlu", role: "Oyun Yayıncısı / İçerik Üretici", img: "/jury/enis.jpg", type: "Jüri", color: "blue", emoji: "🎮" },
  { name: "Ferit (wtcN)", role: "Streamer & İçerik Üretici", img: "/jury/ferit.jpg", type: "Jüri", color: "purple", emoji: "📺" },
  { name: "Dr. Ayşe Yılmaz", role: "Üniversite Öğretim Üyesi", img: "/mentors/ayse.jpg", type: "Mentör", color: "green", emoji: "🎓" },
  { name: "Mehmet Demir", role: "Kıdemli Oyun Geliştirici", img: "/mentors/mehmet.jpg", type: "Mentör", color: "orange", emoji: "💻" },
  // ... dilediğin kadar ekleyebilirsin
];

const getColorClasses = (color: string) => {
  const colors = {
    blue: "from-blue-500/20 to-indigo-600/20 border-blue-500/30 text-blue-600",
    purple: "from-purple-500/20 to-pink-600/20 border-purple-500/30 text-purple-600",
    green: "from-green-500/20 to-emerald-600/20 border-green-500/30 text-green-600",
    orange: "from-orange-500/20 to-amber-600/20 border-orange-500/30 text-orange-600",
    red: "from-red-500/20 to-pink-600/20 border-red-500/30 text-red-600",
    cyan: "from-cyan-500/20 to-blue-600/20 border-cyan-500/30 text-cyan-600"
  };
  return colors[color as keyof typeof colors] || colors.blue;
};

const getTypeColor = (type: string) => {
  return type === "Jüri" ? "from-pink-500/20 to-rose-600/20 border-pink-500/30 text-pink-600" : "from-emerald-500/20 to-teal-600/20 border-emerald-500/30 text-emerald-600";
};

export default function JuryMentorsPage() {
  return (
    <section
      className="
        relative isolate min-h-screen overflow-hidden
        text-white
        bg-gradient-to-br from-slate-950 via-slate-900/50 to-purple-950/30
      "
    >
      {/* Basitleştirilmiş arka plan */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute -z-10 inset-0
          bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10
        "
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 space-y-20">
        {/* Hero Section - daha etkileyici */}
        <div className="text-center space-y-6">
          <div className="relative">
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent animate-pulse">
              Jüri & Mentörler
            </h1>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 via-purple-600/20 to-cyan-600/20 blur-3xl -z-10"></div>
          </div>
          <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 max-w-4xl mx-auto font-medium leading-relaxed">
            Game Jam boyunca bize eşlik edecek jüri üyeleri ve mentörler
          </p>
        </div>

        {/* Jüri Bölümü */}
        <div
          className="
            relative rounded-3xl backdrop-blur-xl p-10 
            border border-white/30 dark:border-white/20
            shadow-2xl shadow-pink-500/10 dark:shadow-purple-500/10
            hover:shadow-3xl hover:shadow-pink-500/20 dark:hover:shadow-purple-500/20
            transition-all duration-500 hover:scale-[1.02]
          "
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          <PageHeader
            title="Jüri Üyeleri"
            desc="Oyunları değerlendirecek uzman jüri üyelerimiz"
            variant="plain"
          />

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {MEMBERS.filter(m => m.type === "Jüri").map((member) => (
              <article
                key={member.name}
                className="
                  group relative p-8 rounded-2xl
                  bg-gradient-to-br from-pink-500/20 to-purple-600/20
                  border border-pink-500/30 backdrop-blur-sm
                  hover:scale-105 hover:shadow-2xl
                  transition-all duration-500 ease-out
                  cursor-pointer
                "
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  {/* Emoji Badge */}
                  <div className="absolute -top-2 -right-2 w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                    {member.emoji}
                  </div>

                  {/* Fotoğraf */}
                  <div
                    className="
                      relative mx-auto mb-6 h-32 w-32 overflow-hidden rounded-2xl
                      border-4 border-white/20 shadow-2xl
                      transition-transform duration-500 will-change-transform
                      group-hover:scale-110 group-hover:shadow-3xl
                    "
                  >
                    <Image
                      src={member.img}
                      alt={member.name}
                      fill
                      sizes="128px"
                      className="object-cover"
                      priority={false}
                    />
                  </div>

                  {/* Metinler */}
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 text-center mb-3 group-hover:text-white transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-4 leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
                    {member.role}
                  </p>

                  <div className="text-center">
                    <span
                      className="
                        inline-flex items-center rounded-2xl px-4 py-2 text-sm font-bold
                        bg-gradient-to-r from-pink-500/20 to-purple-500/20
                        border border-pink-500/30
                        text-pink-600 uppercase tracking-wide
                        group-hover:scale-105 transition-transform duration-300
                      "
                    >
                      {member.type}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Mentörler Bölümü */}
        <div
          className="
            relative rounded-3xl backdrop-blur-xl p-10
            border border-white/30 dark:border-white/20
            shadow-2xl shadow-emerald-500/10 dark:shadow-cyan-500/10
            hover:shadow-3xl hover:shadow-emerald-500/20 dark:hover:shadow-cyan-500/20
            transition-all duration-500 hover:scale-[1.02]
          "
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          <PageHeader
            title="Mentörler"
            desc="Geliştirme sürecinde size rehberlik edecek deneyimli mentörlerimiz"
            variant="plain"
          />

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {MEMBERS.filter(m => m.type === "Mentör").map((member) => (
              <article
                key={member.name}
                className="
                  group relative p-8 rounded-2xl
                  bg-gradient-to-br from-emerald-500/20 to-cyan-600/20
                  border border-emerald-500/30 backdrop-blur-sm
                  hover:scale-105 hover:shadow-2xl
                  transition-all duration-500 ease-out
                  cursor-pointer
                "
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  {/* Emoji Badge */}
                  <div className="absolute -top-2 -right-2 w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                    {member.emoji}
                  </div>

                  {/* Fotoğraf */}
                  <div
                    className="
                      relative mx-auto mb-6 h-32 w-32 overflow-hidden rounded-2xl
                      border-4 border-white/20 shadow-2xl
                      transition-transform duration-500 will-change-transform
                      group-hover:scale-110 group-hover:shadow-3xl
                    "
                  >
                    <Image
                      src={member.img}
                      alt={member.name}
                      fill
                      sizes="128px"
                      className="object-cover"
                      priority={false}
                    />
                  </div>

                  {/* Metinler */}
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 text-center mb-3 group-hover:text-white transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-4 leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
                    {member.role}
                  </p>

                  <div className="text-center">
                    <span
                      className="
                        inline-flex items-center rounded-2xl px-4 py-2 text-sm font-bold
                        bg-gradient-to-r from-emerald-500/20 to-cyan-500/20
                        border border-emerald-500/30
                        text-emerald-600 uppercase tracking-wide
                        group-hover:scale-105 transition-transform duration-300
                      "
                    >
                      {member.type}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* CTA Bölümü */}
        <div className="text-center">
          <div className="
            relative p-10 rounded-3xl 
            bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 
            border border-pink-500/30 backdrop-blur-xl
            shadow-2xl shadow-pink-500/10
            hover:shadow-3xl hover:shadow-pink-500/20
            transition-all duration-500 hover:scale-[1.02]
            group
          ">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-cyan-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-black mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Uzmanlarla Tanışın!
              </h2>
              <p className="text-xl text-slate-700 dark:text-slate-300 mb-8 leading-relaxed">
                Deneyimli jüri üyeleri ve mentörlerimizle birlikte Game Jam'de yerinizi alın.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a
                  href="/kayit"
                  className="
                    group inline-flex items-center gap-3 px-10 py-4 
                    bg-gradient-to-r from-pink-600 to-purple-600 
                    hover:from-pink-500 hover:to-purple-500
                    text-white rounded-2xl font-bold text-lg
                    transition-all duration-300 hover:scale-105 hover:shadow-2xl
                    shadow-lg
                  "
                >
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd"/>
                  </svg>
                  Kayıt Ol
                </a>
                <a
                  href="/takvim"
                  className="
                    group inline-flex items-center gap-3 px-10 py-4 
                    bg-transparent border-2 border-purple-500/50 
                    hover:bg-purple-500/10 hover:border-purple-500/70
                    text-purple-600 rounded-2xl font-bold text-lg
                    transition-all duration-300 hover:scale-105 hover:shadow-2xl
                  "
                >
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                  </svg>
                  Takvimi Gör
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

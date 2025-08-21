// app/(public)/hakkinda/page.tsx
import PageHeader from "../../panel/_components/page-header";

export default function AboutPage() {
  return (
    <section
      className="
        relative isolate min-h-screen overflow-hidden
        text-white dark:text-white
        bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30
        dark:from-slate-950 dark:via-slate-900/50 dark:to-purple-950/30
      "
    >
      {/* Katman A: büyük mesh - daha dinamik */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute -z-10 inset-[-20%] opacity-90
          [background:radial-gradient(55%_60%_at_20%_15%,rgba(99,102,241,.4),transparent_60%),radial-gradient(60%_55%_at_85%_25%,rgba(34,197,94,.35),transparent_60%)]
          motion-safe:animate-[meshPan_20s_ease-in-out_infinite]
        "
        style={{ mixBlendMode: "screen" }}
      />
      
      {/* Katman B: küçük mesh - daha yumuşak */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute -z-10 inset-[-30%] opacity-80
          [background:radial-gradient(45%_50%_at_30%_80%,rgba(56,189,248,.35),transparent_60%),radial-gradient(50%_45%_at_75%_70%,rgba(244,114,182,.32),transparent_60%)]
          motion-safe:animate-[meshPanAlt_15s_ease-in-out_infinite]
        "
        style={{ mixBlendMode: "screen" }}
      />
      
      {/* Katman C: conic swirl - daha yavaş */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute -z-10 -inset-[25%] opacity-70
          [background:conic-gradient(from_210deg_at_50%_50%,rgba(14,165,233,.4),rgba(139,92,246,.4),rgba(34,197,94,.3),rgba(14,165,233,.4))]
          motion-safe:animate-[swirl_25s_linear_infinite]
          rounded-[9999px] blur-3xl
        "
        style={{ mixBlendMode: "screen" }}
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
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent animate-pulse">
              Hakkımızda
            </h1>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 blur-3xl -z-10"></div>
          </div>
          <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 max-w-4xl mx-auto font-medium leading-relaxed">
            Şehitkamil Game Jam hakkında detaylı bilgiler ve vizyonumuz
          </p>
        </div>

        {/* Ana İçerik - daha şık */}
        <div
          className="
            relative rounded-3xl backdrop-blur-xl p-10 
            border border-white/30 dark:border-white/20
            shadow-2xl shadow-blue-500/10 dark:shadow-purple-500/10
            hover:shadow-3xl hover:shadow-blue-500/20 dark:hover:shadow-purple-500/20
            transition-all duration-500 hover:scale-[1.02]
          "
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          <PageHeader
            title="Şehitkamil Game Jam"
            desc="Oyun geliştiricilerini, tasarımcıları ve içerik üreticilerini bir araya getiren yaratıcı üretim maratonu"
            variant="plain"
          />

          <div className="max-w-none space-y-8 leading-relaxed text-slate-800 dark:text-slate-200 text-lg">
            <p className="text-xl">
              <strong className="font-bold text-blue-600 dark:text-blue-400">Şehitkamil Game Jam</strong>, yazılım geliştiriciler, oyun
              tasarımcıları, ses/müzik prodüktörleri ve içerik üreticilerini 48 saat süren
              yoğun bir üretim maratonunda bir araya getirir.
            </p>
            <p>
              Amacımız; ekip çalışmasını, hızlı prototiplemeyi ve yaratıcı problem çözme becerilerini teşvik ederek
              özgün ve yenilikçi oyun fikirlerinin ortaya çıkmasını sağlamaktır.
            </p>
            <p>
              Etkinlik süresince geliştirilen projeler,{" "}
              <strong className="font-semibold text-purple-600 dark:text-purple-400">Şehitkamil Belediyesi'nin teknoloji vizyonuna</strong> uygun olarak
              tasarlanır ve sosyal fayda sağlayacak çözümler sunar.
            </p>
            <p>
              Katılımcılar, hem teknik hem de yaratıcı süreçlerde deneyim kazanır, sektör profesyonelleriyle ağ kurma
              fırsatı yakalar.
            </p>
          </div>
        </div>

        {/* Game Jam Hakkında Kartları - daha interaktif */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: "👥",
              title: "Game Jam Nedir?",
              desc: "Oyun geliştiricilerin belirli bir süre içinde oyun yaratma yarışmasıdır. Katılımcılar takımlar halinde çalışarak, verilen tema doğrultusunda oyunlar geliştirirler.",
              gradient: "from-blue-500/20 to-indigo-600/20",
              border: "border-blue-500/30",
              bg: "bg-blue-500/10"
            },
            {
              icon: "🎯",
              title: "Hedef Kitle",
              desc: "Oyun geliştirme tutkusu olan herkes katılabilir. Programcılar, tasarımcılar, sanatçılar ve oyun geliştirme meraklıları için mükemmel bir fırsat.",
              gradient: "from-green-500/20 to-emerald-600/20",
              border: "border-green-500/30",
              bg: "bg-green-500/10"
            },
            {
              icon: "⚡",
              title: "Yarışma Formatı",
              desc: "48 saatlik yoğun bir geliştirme süreci. Takımlar tema açıklandıktan sonra oyunlarını geliştirmeye başlar ve süre sonunda projelerini teslim eder.",
              gradient: "from-purple-500/20 to-pink-600/20",
              border: "border-purple-500/30",
              bg: "bg-purple-500/10"
            },
            {
              icon: "🏆",
              title: "Değerlendirme",
              desc: "Oyunlar yaratıcılık, teknik kalite, oynanabilirlik ve tema uyumu kriterlerine göre uzman jüri tarafından değerlendirilir.",
              gradient: "from-orange-500/20 to-amber-600/20",
              border: "border-orange-500/30",
              bg: "bg-orange-500/10"
            }
          ].map((card, index) => (
            <div
              key={index}
              className={`
                group relative p-8 rounded-2xl 
                bg-gradient-to-br ${card.gradient}
                border ${card.border} backdrop-blur-sm
                hover:scale-105 hover:shadow-2xl
                transition-all duration-500 ease-out
                cursor-pointer
              `}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-2xl ${card.bg} flex items-center justify-center mx-auto mb-6 text-3xl group-hover:scale-110 transition-transform duration-300`}>
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-center group-hover:text-white transition-colors duration-300">
                  {card.title}
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 text-center leading-relaxed group-hover:text-slate-100 transition-colors duration-300">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Misyon ve Vizyon - daha modern */}
        <div className="grid md:grid-cols-2 gap-10">
          <div
            className="
              relative rounded-3xl backdrop-blur-xl p-10
              border border-white/30 dark:border-white/20
              shadow-2xl shadow-blue-500/10
              hover:shadow-3xl hover:shadow-blue-500/20
              transition-all duration-500 hover:scale-[1.02]
              group
            "
            style={{
              background: "linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(147,51,234,0.05) 100%)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/30 to-blue-600/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  Misyonumuz
                </h2>
              </div>
              <p className="text-slate-700 dark:text-slate-300 mb-6 text-lg leading-relaxed">
                Gaziantep'te oyun geliştirme ekosistemini güçlendirmek, genç yetenekleri desteklemek ve yerel oyun endüstrisinin gelişimine katkıda bulunmak.
              </p>
              <ul className="space-y-3 text-base">
                {[
                  "Oyun geliştirme kültürünü yaygınlaştırmak",
                  "Yerel yetenekleri keşfetmek ve desteklemek",
                  "Teknoloji ve yaratıcılığı birleştirmek",
                  "Topluluk oluşturmak ve networking sağlamak"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors duration-300">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            className="
              relative rounded-3xl backdrop-blur-xl p-10
              border border-white/30 dark:border-white/20
              shadow-2xl shadow-purple-500/10
              hover:shadow-3xl hover:shadow-purple-500/20
              transition-all duration-500 hover:scale-[1.02]
              group
            "
            style={{
              background: "linear-gradient(135deg, rgba(147,51,234,0.1) 0%, rgba(236,72,153,0.05) 100%)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/30 to-purple-600/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                  Vizyonumuz
                </h2>
              </div>
              <p className="text-slate-700 dark:text-slate-300 mb-6 text-lg leading-relaxed">
                Gaziantep'i Türkiye'nin önde gelen oyun geliştirme merkezlerinden biri haline getirmek ve uluslararası arenada tanınan oyunlar üretmek.
              </p>
              <ul className="space-y-3 text-base">
                {[
                  "Uluslararası standartlarda oyunlar geliştirmek",
                  "Oyun geliştirme eğitimini desteklemek",
                  "Yerel oyun stüdyolarının kurulmasını teşvik etmek",
                  "Dijital ekonomiye katkıda bulunmak"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors duration-300">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-3 flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Organizasyon Ekibi - daha şık */}
        <div
          className="
            relative rounded-3xl backdrop-blur-xl p-10
            border border-white/30 dark:border-white/20
            shadow-2xl shadow-cyan-500/10
            hover:shadow-3xl hover:shadow-cyan-500/20
            transition-all duration-500 hover:scale-[1.01]
          "
          style={{
            background: "linear-gradient(135deg, rgba(6,182,212,0.1) 0%, rgba(59,130,246,0.05) 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          <PageHeader
            title="Organizasyon Ekibi"
            desc="Game Jam'i mümkün kılan değerli ekip üyelerimiz"
            variant="plain"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
            {[
              {
                name: "Ahmet Yılmaz",
                role: "Proje Koordinatörü",
                org: "Şehitkamil Belediyesi",
                gradient: "from-blue-500/20 to-indigo-600/20",
                border: "border-blue-500/30",
                bg: "bg-blue-500/10",
                icon: "👨‍💼"
              },
              {
                name: "Mehmet Kaya",
                role: "Teknik Direktör",
                org: "Oyun Geliştirici",
                gradient: "from-green-500/20 to-emerald-600/20",
                border: "border-green-500/30",
                bg: "bg-green-500/10",
                icon: "👨‍💻"
              },
              {
                name: "Ayşe Demir",
                role: "Tasarım Koordinatörü",
                org: "UI/UX Tasarımcı",
                gradient: "from-purple-500/20 to-pink-600/20",
                border: "border-purple-500/30",
                bg: "bg-purple-500/10",
                icon: "👩‍🎨"
              },
              {
                name: "Fatma Özkan",
                role: "İletişim Sorumlusu",
                org: "Pazarlama Uzmanı",
                gradient: "from-orange-500/20 to-amber-600/20",
                border: "border-orange-500/30",
                bg: "bg-orange-500/10",
                icon: "👩‍💼"
              }
            ].map((member, index) => (
              <div
                key={index}
                className={`
                  group text-center p-8 rounded-2xl 
                  bg-gradient-to-br ${member.gradient}
                  border ${member.border} backdrop-blur-sm
                  hover:scale-105 hover:shadow-xl
                  transition-all duration-500 ease-out
                  cursor-pointer
                `}
              >
                <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6 text-4xl group-hover:scale-110 transition-transform duration-300">
                  {member.icon}
                </div>
                <h3 className="font-bold mb-2 text-lg group-hover:text-white transition-colors duration-300">
                  {member.role}
                </h3>
                <p className="text-sm font-semibold mb-2 group-hover:text-white/90 transition-colors duration-300">
                  {member.name}
                </p>
                <span className="text-xs text-slate-600 dark:text-slate-400 group-hover:text-slate-200 transition-colors duration-300">
                  {member.org}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* İstatistikler - daha etkileyici */}
        <div
          className="
            relative rounded-3xl backdrop-blur-xl p-10
            border border-white/30 dark:border-white/20
            shadow-2xl shadow-emerald-500/10
            hover:shadow-3xl hover:shadow-emerald-500/20
            transition-all duration-500 hover:scale-[1.01]
          "
          style={{
            background: "linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(6,182,212,0.05) 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          <PageHeader 
            title="Rakamlarla Game Jam" 
            desc="Etkinliğimizin etkileyici istatistikleri" 
            variant="plain" 
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
            {[
              { number: "100+", label: "Katılımcı", color: "blue" },
              { number: "25", label: "Takım", color: "green" },
              { number: "48", label: "Saat", color: "purple" },
              { number: "₺50K", label: "Toplam Ödül", color: "orange" }
            ].map((stat, index) => (
              <div
                key={index}
                className={`
                  group text-center p-8 rounded-2xl 
                  bg-gradient-to-br from-${stat.color}-500/20 to-${stat.color}-600/20
                  border border-${stat.color}-500/30 backdrop-blur-sm
                  hover:scale-110 hover:shadow-2xl
                  transition-all duration-500 ease-out
                  cursor-pointer
                `}
              >
                <div className={`text-4xl font-black text-${stat.color}-600 mb-3 group-hover:scale-125 transition-transform duration-500`}>
                  {stat.number}
                </div>
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-white transition-colors duration-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// app/(public)/hakkinda/page.tsx
import PageHeader from "../../panel/_components/page-header";

export default function AboutPage() {
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
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent animate-pulse">
              Hakkımızda
            </h1>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 blur-3xl -z-10"></div>
          </div>
          <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto font-medium leading-relaxed">
            Şehitkamil Game Jam hakkında detaylı bilgiler ve vizyonumuz
          </p>
        </div>

        {/* Ana İçerik - daha şık */}
        <div
          className="
            relative rounded-3xl backdrop-blur-xl p-10 
            border border-white/20
            shadow-2xl shadow-purple-500/10
            hover:shadow-3xl hover:shadow-purple-500/20
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

          <div className="max-w-none space-y-8 leading-relaxed text-slate-200 text-lg">
            <p className="text-xl">
              <strong className="font-bold text-blue-400">Şehitkamil Game Jam</strong>, yazılım geliştiriciler, oyun
              tasarımcıları ve yaratıcı profesyonelleri bir araya getiren benzersiz bir etkinliktir. Bu maraton
              tarzı yarışma, katılımcıların sınırlı süre içinde orijinal oyunlar geliştirmelerini teşvik eder.
            </p>

            <p>
              <strong className="font-bold text-purple-400">Misyonumuz:</strong> Genç yetenekleri keşfetmek,
              oyun geliştirme becerilerini geliştirmek ve yaratıcılığı desteklemektir. Katılımcılarımız sadece
              teknik becerilerini değil, aynı zamanda takım çalışması, problem çözme ve zaman yönetimi
              yeteneklerini de geliştirirler.
            </p>

            <p>
              <strong className="font-bold text-cyan-400">Vizyonumuz:</strong> Türkiye'nin en prestijli oyun
              geliştirme etkinliklerinden biri olmak ve uluslararası arenada tanınan bir platform haline
              gelmektir. Amacımız, oyun endüstrisinin geleceğini şekillendirecek yetenekleri desteklemek ve
              onlara gerekli araçları ve fırsatları sağlamaktır.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-emerald-400">Neden Game Jam?</h3>
                <ul className="space-y-2 text-slate-300">
                  <li>• Hızlı prototip geliştirme deneyimi</li>
                  <li>• Gerçek dünya problemlerini çözme fırsatı</li>
                  <li>• Endüstri profesyonelleriyle networking</li>
                  <li>• Portföyünüz için özgün projeler</li>
                  <li>• Takım çalışması ve liderlik becerileri</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-pink-400">Kimler Katılabilir?</h3>
                <ul className="space-y-2 text-slate-300">
                  <li>• 14-18 yaş arası öğrenciler</li>
                  <li>• Oyun geliştirme meraklıları</li>
                  <li>• Programlama ve tasarım tutkunları</li>
                  <li>• Yaratıcı projeler geliştirmek isteyenler</li>
                  <li>• Takım çalışmasına açık bireyler</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Ek Bilgiler */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-2xl bg-slate-800/50 border border-slate-700">
            <div className="text-4xl font-bold text-blue-400 mb-2">48+</div>
            <div className="text-slate-300">Saat Süre</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-slate-800/50 border border-slate-700">
            <div className="text-4xl font-bold text-purple-400 mb-2">100+</div>
            <div className="text-slate-300">Katılımcı</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-slate-800/50 border border-slate-700">
            <div className="text-4xl font-bold text-cyan-400 mb-2">20+</div>
            <div className="text-slate-300">Takım</div>
          </div>
        </div>
      </div>
    </section>
  );
}

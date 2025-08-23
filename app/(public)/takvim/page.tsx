// app/(public)/takvim/page.tsx
import PageHeader from "../../panel/_components/page-header";

const TIMELINE_DATA = [
  {
    date: "15",
    month: "Eylül",
    title: "Kayıtların Açılması",
    desc: "Game Jam'e katılım için kayıtlar başlar. Takımlar oluşturulur ve ön kayıt formları doldurulur.",
    time: "09:00 - 18:00",
    location: "Online Kayıt",
    color: "blue"
  },
  {
    date: "30",
    month: "Eylül",
    title: "Son Kayıt Tarihi",
    desc: "Game Jam'e katılım için son kayıt tarihi. Bu tarihten sonra yeni kayıt alınmayacaktır.",
    time: "23:59",
    location: "Online Kayıt",
    color: "orange"
  },
  {
    date: "10",
    month: "Ekim",
    title: "Ön Hazırlık Toplantısı",
    desc: "Katılımcılar için bilgilendirme toplantısı. Kurallar, teknik detaylar ve organizasyon hakkında bilgi verilir.",
    time: "14:00 - 16:00",
    location: "Şehitkamil Belediyesi Sanat Merkezi",
    color: "green"
  },
  {
    date: "12",
    month: "Ekim",
    title: "Game Jam Başlangıcı",
    desc: "Tema açıklanır ve 48 saatlik geliştirme süreci başlar. Takımlar oyunlarını geliştirmeye başlar.",
    time: "23:59",
    location: "Online Platform",
    color: "purple"
  },
  {
    date: "14",
    month: "Ekim",
    title: "Geliştirme Süreci",
    desc: "48 saatlik yoğun geliştirme süreci devam eder. Takımlar oyunlarını tamamlamaya çalışır.",
    time: "00:00 - 23:59",
    location: "Online Platform",
    color: "cyan"
  },
  {
    date: "15",
    month: "Ekim",
    title: "Proje Teslimi",
    desc: "Oyunların teslim edilmesi için son tarih. Bu saatten sonra yapılan değişiklikler kabul edilmez.",
    time: "23:59",
    location: "Online Platform",
    color: "red"
  },
  {
    date: "16",
    month: "Ekim",
    title: "Jüri Değerlendirmesi",
    desc: "Jüri üyeleri oyunları değerlendirir ve puanlama yapar. Sonuçlar hazırlanır.",
    time: "10:00 - 18:00",
    location: "Şehitkamil Belediyesi",
    color: "indigo"
  },
  {
    date: "18",
    month: "Ekim",
    title: "Ödül Töreni",
    desc: "Kazananlar açıklanır ve ödüller dağıtılır. Tüm katılımcılar için özel etkinlik.",
    time: "19:00 - 22:00",
    location: "Şehitkamil Belediyesi Sanat Merkezi",
    color: "yellow"
  }
];

const IMPORTANT_DATES = [
  { title: "Kayıt Başlangıcı", date: "15 Eylül 2025", time: "09:00", icon: "📅", color: "blue" },
  { title: "Kayıt Sonu", date: "30 Eylül 2025", time: "23:59", icon: "⏰", color: "red" },
  { title: "Game Jam Başlangıcı", date: "12 Ekim 2025", time: "23:59", icon: "🚀", color: "green" },
  { title: "Proje Teslimi", date: "15 Ekim 2025", time: "23:59", icon: "📦", color: "orange" },
  { title: "Ödül Töreni", date: "18 Ekim 2025", time: "19:00", icon: "🏆", color: "yellow" }
];

const DAILY_SCHEDULE = [
  {
    day: "1. Gün",
    color: "blue",
    events: [
      { time: "23:59", title: "Tema Açıklanması", desc: "Game Jam teması açıklanır ve geliştirme süreci başlar." },
      { time: "00:30", title: "Takım Toplantıları", desc: "Takımlar kendi aralarında planlama yapar." }
    ]
  },
  {
    day: "2. Gün",
    color: "green",
    events: [
      { time: "10:00", title: "Geliştirme Süreci", desc: "Yoğun geliştirme süreci devam eder." },
      { time: "15:00", title: "Ara Kontrol", desc: "Organizasyon ekibi ilerleme kontrolü yapar." }
    ]
  },
  {
    day: "3. Gün",
    color: "purple",
    events: [
      { time: "20:00", title: "Son Kontroller", desc: "Oyunların son testleri yapılır." },
      { time: "23:59", title: "Proje Teslimi", desc: "Oyunlar teslim edilir ve geliştirme süreci sona erer." }
    ]
  }
];

const getColorClasses = (color: string) => {
  const colors = {
    blue: "from-blue-500 to-blue-600 border-blue-500/20 text-blue-600",
    orange: "from-orange-500 to-red-500 border-orange-500/20 text-orange-600",
    green: "from-green-500 to-emerald-500 border-green-500/20 text-green-600",
    purple: "from-purple-500 to-pink-500 border-purple-500/20 text-purple-600",
    cyan: "from-cyan-500 to-blue-500 border-cyan-500/20 text-cyan-600",
    red: "from-red-500 to-orange-500 border-red-500/20 text-red-600",
    indigo: "from-indigo-500 to-purple-500 border-indigo-500/20 text-indigo-600",
    yellow: "from-yellow-500 to-amber-500 border-yellow-500/20 text-yellow-600"
  };
  return colors[color as keyof typeof colors] || colors.blue;
};

const getBgColorClasses = (color: string) => {
  const colors = {
    blue: "from-blue-500/20 to-indigo-600/20 border-blue-500/30",
    orange: "from-orange-500/20 to-red-600/20 border-orange-500/30",
    green: "from-green-500/20 to-emerald-600/20 border-green-500/30",
    purple: "from-purple-500/20 to-pink-600/20 border-purple-500/30",
    cyan: "from-cyan-500/20 to-blue-600/20 border-cyan-500/30",
    red: "from-red-500/20 to-orange-600/20 border-red-500/30",
    indigo: "from-indigo-500/20 to-purple-600/20 border-indigo-500/30",
    yellow: "from-yellow-500/20 to-amber-600/20 border-yellow-500/30"
  };
  return colors[color as keyof typeof colors] || colors.blue;
};

export default function SchedulePage() {
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
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
              Etkinlik Takvimi
            </h1>
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 via-blue-600/20 to-purple-600/20 blur-3xl -z-10"></div>
          </div>
          <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 max-w-4xl mx-auto font-medium leading-relaxed">
            Game Jam sürecinin tüm aşamaları ve önemli tarihler
          </p>
        </div>

        {/* Detaylı Timeline - daha şık */}
        <div
          className="
            relative rounded-3xl backdrop-blur-xl p-10 
            border border-white/30 dark:border-white/20
            shadow-2xl shadow-green-500/10 dark:shadow-blue-500/10
            hover:shadow-3xl hover:shadow-green-500/20 dark:hover:shadow-blue-500/20
            transition-all duration-500 hover:scale-[1.02]
          "
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          <PageHeader
            title="Detaylı Takvim"
            desc="Game Jam sürecinin tüm aşamaları ve önemli tarihler"
            variant="plain"
          />

          <div className="mt-16 space-y-12">
            <div className="relative">
              {/* Timeline Line - daha etkileyici */}
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 via-blue-500 to-purple-500 shadow-lg"></div>

              {/* Timeline Items - daha interaktif */}
              <div className="space-y-16">
                {TIMELINE_DATA.map((item, idx) => (
                  <div key={idx} className="relative flex items-start gap-8 group">
                    <div className={`
                      flex-shrink-0 w-16 h-16 rounded-2xl 
                      bg-gradient-to-r ${getColorClasses(item.color)} 
                      flex items-center justify-center shadow-2xl
                      group-hover:scale-110 group-hover:shadow-3xl
                      transition-all duration-500 ease-out
                    `}>
                      <div className="text-center text-white font-bold">
                        <div className="text-sm">{item.date}</div>
                        <div className="text-xs">{item.month}</div>
                      </div>
                    </div>
                    <div className={`
                      flex-1 p-8 rounded-2xl 
                      bg-gradient-to-r ${getBgColorClasses(item.color)} 
                      backdrop-blur-sm
                      group-hover:scale-[1.02] group-hover:shadow-xl
                      transition-all duration-500 ease-out
                      cursor-pointer
                    `}>
                      <h3 className={`text-2xl font-bold mb-3 ${getColorClasses(item.color).split(' ')[0]}`}>
                        {item.title}
                      </h3>
                      <p className="text-slate-300 mb-4 text-lg leading-relaxed">
                        {item.desc}
                      </p>
                      <div className="flex items-center gap-6 text-sm">
                        <span className={`flex items-center gap-2 ${getColorClasses(item.color).split(' ')[0]} font-semibold`}>
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                          </svg>
                          {item.time}
                        </span>
                        <span className={`flex items-center gap-2 ${getColorClasses(item.color).split(' ')[0]} font-semibold`}>
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                          </svg>
                          {item.location}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Önemli Tarihler - daha modern */}
        <div
          className="
            relative rounded-3xl backdrop-blur-xl p-10
            border border-white/20
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
            title="Önemli Tarihler"
            desc="Game Jam sürecinin kritik dönüm noktaları"
            variant="plain"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mt-12">
            {IMPORTANT_DATES.map((item, idx) => (
              <div key={idx} className={`
                group p-8 rounded-2xl 
                bg-gradient-to-br ${getBgColorClasses(item.color)} 
                backdrop-blur-sm text-center
                hover:scale-105 hover:shadow-2xl
                transition-all duration-500 ease-out
                cursor-pointer
              `}>
                <div className={`w-16 h-16 rounded-2xl ${getColorClasses(item.color).split(' ')[0].replace('from-', 'bg-').replace('to-', 'bg-')}/20 flex items-center justify-center mx-auto mb-6 text-3xl group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors duration-300">
                  {item.title}
                </h3>
                <div className="space-y-2">
                  <div className={`text-lg font-bold ${getColorClasses(item.color).split(' ')[0]} group-hover:text-white transition-colors duration-300`}>
                    {item.date}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-200 transition-colors duration-300">
                    {item.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Günlük Program - daha etkileyici */}
        <div
          className="
            relative rounded-3xl backdrop-blur-xl p-10
            border border-white/30 dark:border-white/20
            shadow-2xl shadow-purple-500/10
            hover:shadow-3xl hover:shadow-purple-500/20
            transition-all duration-500 hover:scale-[1.01]
          "
          style={{
            background: "linear-gradient(135deg, rgba(147,51,234,0.1) 0%, rgba(236,72,153,0.05) 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          <PageHeader
            title="Günlük Program"
            desc="48 saatlik Game Jam sürecinin detaylı programı"
            variant="plain"
          />

          <div className="mt-12">
            <div className="grid md:grid-cols-3 gap-8">
              {DAILY_SCHEDULE.map((day, idx) => (
                <div key={idx} className={`
                  group p-8 rounded-2xl 
                  bg-gradient-to-br ${getBgColorClasses(day.color)} 
                  backdrop-blur-sm
                  hover:scale-105 hover:shadow-xl
                  transition-all duration-500 ease-out
                  cursor-pointer
                `}>
                  <h3 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${getColorClasses(day.color).split(' ')[0]}`}>
                    <div className={`w-10 h-10 rounded-2xl ${getColorClasses(day.color).split(' ')[0].replace('from-', 'bg-').replace('to-', 'bg-')} text-white flex items-center justify-center text-lg font-bold group-hover:scale-110 transition-transform duration-300`}>
                      {idx + 1}
                    </div>
                    {day.day}
                  </h3>
                  <div className="space-y-6">
                    {day.events.map((event, eventIdx) => (
                      <div key={eventIdx} className="flex items-start gap-4">
                        <div className={`text-sm font-bold ${getColorClasses(day.color).split(' ')[0]} ${getColorClasses(day.color).split(' ')[0].replace('from-', 'bg-').replace('to-', 'bg-')}/20 px-3 py-2 rounded-xl group-hover:scale-105 transition-transform duration-300`}>
                          {event.time}
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2 group-hover:text-white transition-colors duration-300">
                            {event.title}
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-200 transition-colors duration-300 leading-relaxed">
                            {event.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Bölümü - daha modern */}
        <div className="text-center">
          <div className="
            relative p-10 rounded-3xl 
            bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 
            border border-green-500/30 backdrop-blur-xl
            shadow-2xl shadow-green-500/10
            hover:shadow-3xl hover:shadow-green-500/20
            transition-all duration-500 hover:scale-[1.02]
            group
          ">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-black mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Hemen Kayıt Ol!
              </h2>
              <p className="text-xl text-slate-700 dark:text-slate-300 mb-8 leading-relaxed">
                Game Jam'e katılmak için son fırsat. 30 Eylül'e kadar kayıtlarınızı tamamlayın.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a
                  href="/kayit"
                  className="
                    group inline-flex items-center gap-3 px-10 py-4 
                    bg-gradient-to-r from-green-600 to-blue-600 
                    hover:from-green-500 hover:to-blue-500
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
                  href="/kurallar"
                  className="
                    group inline-flex items-center gap-3 px-10 py-4 
                    bg-transparent border-2 border-blue-500/50 
                    hover:bg-blue-500/10 hover:border-blue-500/70
                    text-blue-600 rounded-2xl font-bold text-lg
                    transition-all duration-300 hover:scale-105 hover:shadow-2xl
                  "
                >
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                  </svg>
                  Kuralları Oku
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

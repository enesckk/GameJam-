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
  { title: "Kayıt Başlangıcı", date: "15 Eylül 2025", time: "09:00", icon: "calendar-plus", color: "blue" },
  { title: "Kayıt Sonu", date: "30 Eylül 2025", time: "23:59", icon: "calendar-times", color: "red" },
  { title: "Game Jam Başlangıcı", date: "12 Ekim 2025", time: "23:59", icon: "play", color: "green" },
  { title: "Proje Teslimi", date: "15 Ekim 2025", time: "23:59", icon: "stop", color: "orange" },
  { title: "Ödül Töreni", date: "18 Ekim 2025", time: "19:00", icon: "trophy", color: "yellow" }
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
    blue: "from-blue-500/10 to-indigo-500/10 border-blue-500/20",
    orange: "from-orange-500/10 to-red-500/10 border-orange-500/20",
    green: "from-green-500/10 to-emerald-500/10 border-green-500/20",
    purple: "from-purple-500/10 to-pink-500/10 border-purple-500/20",
    cyan: "from-cyan-500/10 to-blue-500/10 border-cyan-500/20",
    red: "from-red-500/10 to-orange-500/10 border-red-500/20",
    indigo: "from-indigo-500/10 to-purple-500/10 border-indigo-500/20",
    yellow: "from-yellow-500/10 to-amber-500/10 border-yellow-500/20"
  };
  return colors[color as keyof typeof colors] || colors.blue;
};

export default function SchedulePage() {
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

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Etkinlik Takvimi
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Game Jam sürecinin tüm aşamaları ve önemli tarihler
          </p>
        </div>

        {/* Detaylı Timeline */}
        <div
          className="gborder rounded-2xl backdrop-blur-md p-8 border border-white/20 dark:border-white/10"
          style={{ backgroundColor: 'color-mix(in oklab, var(--foreground) 5%, transparent)' }}
        >
          <PageHeader
            title="Detaylı Takvim"
            desc="Game Jam sürecinin tüm aşamaları ve önemli tarihler"
            variant="plain"
          />

          <div className="mt-16 space-y-8">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500"></div>

              {/* Timeline Items */}
              <div className="space-y-12">
                {TIMELINE_DATA.map((item, idx) => (
                  <div key={idx} className="relative flex items-start gap-8">
                    <div className={`flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-r ${getColorClasses(item.color)} flex items-center justify-center shadow-lg`}>
                      <div className="text-center text-white font-bold">
                        <div className="text-sm">{item.date}</div>
                        <div className="text-xs">{item.month}</div>
                      </div>
                    </div>
                    <div className={`flex-1 p-6 rounded-xl bg-gradient-to-r ${getBgColorClasses(item.color)} backdrop-blur-sm`}>
                      <h3 className={`text-xl font-semibold mb-2 ${getColorClasses(item.color).split(' ')[0]}`}>
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground mb-3">
                        {item.desc}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className={`flex items-center gap-1 ${getColorClasses(item.color).split(' ')[0]}`}>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                          </svg>
                          {item.time}
                        </span>
                        <span className={`flex items-center gap-1 ${getColorClasses(item.color).split(' ')[0]}`}>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
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

        {/* Önemli Tarihler */}
        <div
          className="gborder rounded-2xl backdrop-blur-md p-8 border border-white/20 dark:border-white/10"
          style={{ backgroundColor: 'color-mix(in oklab, var(--foreground) 5%, transparent)' }}
        >
          <PageHeader
            title="Önemli Tarihler"
            desc="Game Jam sürecinin kritik dönüm noktaları"
            variant="plain"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mt-12">
            {IMPORTANT_DATES.map((item, idx) => (
              <div key={idx} className={`p-6 rounded-xl bg-gradient-to-br ${getBgColorClasses(item.color)} backdrop-blur-sm text-center`}>
                <div className={`w-12 h-12 rounded-lg ${getColorClasses(item.color).split(' ')[0].replace('from-', 'bg-').replace('to-', 'bg-')}/20 flex items-center justify-center mx-auto mb-4`}>
                  <svg className={`w-6 h-6 ${getColorClasses(item.color).split(' ')[0]}`} fill="currentColor" viewBox="0 0 20 20">
                    {item.icon === "calendar-plus" && (
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                    )}
                    {item.icon === "calendar-times" && (
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                    )}
                    {item.icon === "play" && (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                    )}
                    {item.icon === "stop" && (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd"/>
                    )}
                    {item.icon === "trophy" && (
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    )}
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <div className="space-y-1">
                  <div className={`text-sm font-medium ${getColorClasses(item.color).split(' ')[0]}`}>{item.date}</div>
                  <div className="text-xs text-muted-foreground">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Günlük Program */}
        <div
          className="gborder rounded-2xl backdrop-blur-md p-8 border border-white/20 dark:border-white/10"
          style={{ backgroundColor: 'color-mix(in oklab, var(--foreground) 5%, transparent)' }}
        >
          <PageHeader
            title="Günlük Program"
            desc="48 saatlik Game Jam sürecinin detaylı programı"
            variant="plain"
          />

          <div className="mt-12">
            <div className="grid md:grid-cols-3 gap-6">
              {DAILY_SCHEDULE.map((day, idx) => (
                <div key={idx} className={`p-6 rounded-xl bg-gradient-to-br ${getBgColorClasses(day.color)} backdrop-blur-sm`}>
                  <h3 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${getColorClasses(day.color).split(' ')[0]}`}>
                    <div className={`w-8 h-8 rounded-full ${getColorClasses(day.color).split(' ')[0].replace('from-', 'bg-').replace('to-', 'bg-')} text-white flex items-center justify-center text-sm font-bold`}>
                      {idx + 1}
                    </div>
                    {day.day}
                  </h3>
                  <div className="space-y-4">
                    {day.events.map((event, eventIdx) => (
                      <div key={eventIdx} className="flex items-start gap-3">
                        <div className={`text-sm font-medium ${getColorClasses(day.color).split(' ')[0]} ${getColorClasses(day.color).split(' ')[0].replace('from-', 'bg-').replace('to-', 'bg-')}/20 px-2 py-1 rounded`}>
                          {event.time}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">{event.title}</h4>
                          <p className="text-xs text-muted-foreground">{event.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Bölümü */}
        <div className="text-center">
          <div className="p-8 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 backdrop-blur-sm">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Hemen Kayıt Ol!
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Game Jam'e katılmak için son fırsat. 30 Eylül'e kadar kayıtlarınızı tamamlayın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/kayit"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 font-semibold"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd"/>
                </svg>
                Kayıt Ol
              </a>
              <a
                href="/kurallar"
                className="inline-flex items-center gap-2 px-8 py-3 bg-transparent border border-blue-500/30 hover:bg-blue-500/10 text-blue-600 rounded-lg transition-all duration-200 font-semibold"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
                Kuralları Oku
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

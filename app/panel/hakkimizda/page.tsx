import Link from "next/link";
import PageHeader from "../_components/page-header";
import SectionCard from "../_components/section-card";
import { ArrowRight, Users, Clock, Trophy, Target, Heart, Star, Award, MapPin, Coffee, Shield, MessageCircle, Gamepad2, Lightbulb, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Hakkımızda"
        desc="Şehitkamil Game Jam — oyun geliştiricilerini bir araya getiren yaratıcı maraton"
        variant="plain"
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/20 via-pink-500/15 to-blue-500/20 backdrop-blur-xl border border-purple-500/30 p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 animate-pulse"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Gamepad2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Şehitkamil Game Jam</h2>
              <p className="text-purple-200/80">Oyun Geliştirme Maratonu</p>
            </div>
          </div>
          
          <p className="text-base leading-relaxed text-purple-100 max-w-3xl">
            <strong className="text-white">Şehitkamil Game Jam</strong>, geliştiriciler, tasarımcılar, ses/müzik ve içerik üreticilerini
            48 saat boyunca aynı çatı altında buluşturan bir üretim maratonudur. Hedefimiz; ekip çalışması,
            hızlı prototipleme ve yaratıcı problem çözmeyi teşvik ederek yeni oyun fikirlerini ortaya çıkarmaktır.
          </p>
        </div>
      </div>

      {/* Öne çıkanlar / sayılar */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { k: "Süre", v: "48 Saat", icon: Clock, color: "from-blue-500 to-cyan-500" },
          { k: "Ekip Boyutu", v: "En fazla 4 kişi", icon: Users, color: "from-purple-500 to-pink-500" },
          { k: "Katılım", v: "Bireysel veya Takım", icon: Target, color: "from-green-500 to-emerald-500" },
          { k: "Teslim", v: "Panel ▸ Oyun Teslimi", icon: Trophy, color: "from-yellow-500 to-orange-500" },
        ].map((i) => (
          <div key={i.k} className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 backdrop-blur-xl border border-purple-500/20 p-6 hover:scale-105 transition-all duration-300 hover:shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className={`w-12 h-12 bg-gradient-to-br ${i.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                <i.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-sm text-purple-200/80 mb-2">{i.k}</div>
              <div className="text-lg font-bold text-white">{i.v}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Nedir? */}
      <SectionCard title="Game Jam Nedir?" subtitle="Kısa açıklama">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 backdrop-blur-xl border border-purple-500/20 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Lightbulb className="h-5 w-5 text-white" />
            </div>
            <div className="space-y-3 text-sm text-purple-100">
              <p>
                Belirlenen tema doğrultusunda sınırlı sürede bir oyun prototipi geliştirirsiniz. İster bireysel,
                ister takım olarak katılabilirsiniz. Panel üzerinden{" "}
                <Link href="/panel/takim" className="text-purple-300 hover:text-purple-200 underline underline-offset-4 font-medium">Takım</Link>{" "}
                ve <Link href="/panel/teslim" className="text-purple-300 hover:text-purple-200 underline underline-offset-4 font-medium">Oyun Teslimi</Link> adımlarını yönetebilirsiniz.
              </p>
              <p>
                Süreç boyunca duyurular ve iletişim için{" "}
                <Link href="/panel/duyurular" className="text-purple-300 hover:text-purple-200 underline underline-offset-4 font-medium">Duyurular</Link> ve{" "}
                <Link href="/panel/mesajlar" className="text-purple-300 hover:text-purple-200 underline underline-offset-4 font-medium">Mesajlar</Link> bölümlerini kullanın.
              </p>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Amaç & Değerler */}
      <SectionCard title="Amaç & Değerler" subtitle="Topluluk kültürü">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { text: "Yaratıcı işbirliği ve bilgi paylaşımı", icon: Heart, color: "from-red-500 to-pink-500" },
            { text: "Hızlı prototipleme ve üretkenlik", icon: Zap, color: "from-yellow-500 to-orange-500" },
            { text: "Erişilebilirlik ve kapsayıcılık", icon: Users, color: "from-blue-500 to-cyan-500" },
            { text: "Yerel ekosisteme katkı ve görünürlük", icon: Star, color: "from-purple-500 to-pink-500" },
          ].map((item, index) => (
            <div key={index} className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 backdrop-blur-xl border border-purple-500/20 p-5 hover:scale-105 transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <item.icon className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm text-purple-100 font-medium">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Değerlendirme Ölçütleri */}
      <SectionCard title="Değerlendirme Ölçütleri" subtitle="Jüri tarafından dikkate alınan başlıklar">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { h: "Tema Uyumu", p: "Belirlenen tema ile fikrin uyumu ve yorumlanışı.", icon: Target, color: "from-blue-500 to-cyan-500" },
            { h: "Oynanış & Mekanik", p: "Mekaniklerin açıklığı, akış ve dengesi.", icon: Gamepad2, color: "from-purple-500 to-pink-500" },
            { h: "Görsel & Ses", p: "Sanat yönü, ses/müzik bütünlüğü.", icon: Star, color: "from-yellow-500 to-orange-500" },
            { h: "Teknik Kalite", p: "Optimizasyon, kararlılık ve uygulama kalitesi.", icon: Zap, color: "from-green-500 to-emerald-500" },
            { h: "Yenilikçilik", p: "Fikir özgünlüğü ve yaratıcı dokunuşlar.", icon: Lightbulb, color: "from-pink-500 to-red-500" },
            { h: "Sunum", p: "Projenin anlatımı, teslim paketinin düzeni.", icon: Award, color: "from-indigo-500 to-purple-500" },
          ].map((b) => (
            <div key={b.h} className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 backdrop-blur-xl border border-purple-500/20 p-5 hover:scale-105 transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${b.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <b.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white mb-2">{b.h}</div>
                  <div className="text-sm text-purple-100">{b.p}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Akış Özeti */}
      <SectionCard title="Akış Özeti" subtitle="Yüksek seviyede plan">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { t: "Kayıt & Karşılama", d: "Panoya erişim, takım oluşturma / birleştirme.", icon: Users, color: "from-blue-500 to-cyan-500" },
            { t: "Tema Duyurusu", d: "Açılışta açıklanır. Duyurular sayfasını takip edin.", icon: Target, color: "from-purple-500 to-pink-500" },
            { t: "Geliştirme Süreci", d: "Mentör desteği, ara checkpoint'ler.", icon: Zap, color: "from-green-500 to-emerald-500" },
            { t: "Oyun Teslimi", d: "Panel ▸ Oyun Teslimi üzerinden belirtilen formatta.", icon: Trophy, color: "from-yellow-500 to-orange-500" },
            { t: "Sunum & Jüri", d: "Kısa oynanış/sunum; değerlendirme kriterleri uygulanır.", icon: Award, color: "from-pink-500 to-red-500" },
            { t: "Ödüller", d: "Dereceler ve sponsor ödülleri duyurulur.", icon: Star, color: "from-indigo-500 to-purple-500" },
          ].map((s, i) => (
            <div key={i} className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 backdrop-blur-xl border border-purple-500/20 p-5 hover:scale-105 transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <s.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white mb-2">{s.t}</div>
                  <div className="text-sm text-purple-100">{s.d}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Mekân & Lojistik */}
      <SectionCard title="Mekân & Lojistik" subtitle="Ulaşım, yemek ve çalışma alanları">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { h: "Mekân & Konum", p: <>Detaylar <Link href="/panel/iletisim" className="text-purple-300 hover:text-purple-200 underline underline-offset-4 font-medium">İletişim</Link> sayfasında.</>, icon: MapPin, color: "from-blue-500 to-cyan-500" },
            { h: "Çalışma Alanları", p: "Elektrik/İnternet erişimi, ekipman yerleşimi.", icon: Zap, color: "from-green-500 to-emerald-500" },
            { h: "İkramlar", p: "Belirli saatlerde atıştırmalık ve içecek/akşam yemeği.", icon: Coffee, color: "from-yellow-500 to-orange-500" },
            { h: "Güvenlik", p: "Etkinlik kurallarına uyum ve alan güvenliği.", icon: Shield, color: "from-red-500 to-pink-500" },
          ].map((b) => (
            <div key={b.h} className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 backdrop-blur-xl border border-purple-500/20 p-5 hover:scale-105 transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${b.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <b.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white mb-2">{b.h}</div>
                  <div className="text-sm text-purple-100">{b.p}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Topluluk Kuralları */}
      <SectionCard title="Topluluk Kuralları" subtitle="Pozitif ve kapsayıcı bir ortam">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 backdrop-blur-xl border border-purple-500/20 p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="space-y-3 text-sm text-purple-100">
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Saygılı iletişim; ayrımcı, saldırgan veya toksik davranışlara izin verilmez.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Telif ve lisanslara dikkat edin; kullandığınız asset'lerin kaynağını belirtin.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Hazır projelerin aynısını teslim etmeyin; jam döneminde üretime odaklanın.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Takım içi sorumluluk dağılımını netleştirin; teslim tarihlerini kaçırmayın.</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Link href="/panel/kurallar" className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-200 underline underline-offset-4 font-medium">
              Kurallar sayfasına git <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </SectionCard>

      {/* CTA */}
      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/20 via-pink-500/15 to-blue-500/20 backdrop-blur-xl border border-purple-500/30 p-6">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div className="text-sm text-purple-100">
              Sorun mu var? Organizasyon ekibi yardım için burada.
            </div>
          </div>
          
          <Link
            href="/panel/mesajlar"
            className="ml-auto inline-flex items-center gap-2 rounded-xl px-6 py-3 text-white bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 hover:scale-105 transition-all duration-200 font-medium shadow-lg"
          >
            Mesaj Gönder <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
// app/(public)/hakkinda/page.tsx
import VideoBG from "@/components/background/video-bg";
import PageHeader from "../../panel/_components/page-header";

export default function AboutPage() {
  return (
    <section className="relative min-h-screen">
      {/* Arka plan video */}
      <VideoBG
        light={{
          mp4: "/videos/bg-light.mp4",
        }}
        dark={{
          mp4: "/videos/bg-dark.mp4",
        }}
        overlay
        opacity={0.9}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Hakkımızda
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Şehitkamil Game Jam hakkında detaylı bilgiler ve vizyonumuz
          </p>
        </div>

        {/* Ana İçerik */}
        <div 
          className="gborder rounded-2xl backdrop-blur-md p-8"
          style={{ 
            backgroundColor: 'color-mix(in oklab, var(--foreground) 5%, transparent)',
          }}
        >
          <PageHeader
            title="Şehitkamil Game Jam"
            desc="Oyun geliştiricilerini, tasarımcıları ve içerik üreticilerini bir araya getiren yaratıcı üretim maratonu"
            variant="plain"
          />

          <div className="max-w-none space-y-6 leading-relaxed text-[color:var(--foreground)]">
            <p>
              <strong className="font-semibold">Şehitkamil Game Jam</strong>, yazılım geliştiriciler, oyun
              tasarımcıları, ses/müzik prodüktörleri ve içerik üreticilerini 48 saat süren
              yoğun bir üretim maratonunda bir araya getirir. Amacımız; ekip çalışmasını,
              hızlı prototiplemeyi ve yaratıcı problem çözme becerilerini teşvik ederek
              özgün ve yenilikçi oyun fikirlerinin ortaya çıkmasını sağlamaktır.
            </p>
            <p>
              Etkinlik süresince geliştirilen projeler,{" "}
              <strong className="font-semibold">Şehitkamil Belediyesi'nin teknoloji vizyonuna</strong> uygun olarak
              tasarlanır ve sosyal fayda sağlayacak çözümler sunar. Katılımcılar, hem teknik
              hem de yaratıcı süreçlerde deneyim kazanır, sektör profesyonelleriyle ağ kurma
              fırsatı yakalar.
            </p>
            <p>
              Şehitkamil Game Jam, yerel ekosistemi güçlendiren, inovasyonu teşvik eden ve
              genç yeteneklerin görünürlüğünü artıran bir topluluk etkinliğidir.
            </p>
          </div>
        </div>

        {/* Game Jam Hakkında Kartları */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 backdrop-blur-sm text-center">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-3">Game Jam Nedir?</h3>
            <p className="text-sm text-muted-foreground">
              Oyun geliştiricilerin belirli bir süre içinde oyun yaratma yarışmasıdır. Katılımcılar takımlar halinde çalışarak, verilen tema doğrultusunda oyunlar geliştirirler.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 backdrop-blur-sm text-center">
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-3">Hedef Kitle</h3>
            <p className="text-sm text-muted-foreground">
              Oyun geliştirme tutkusu olan herkes katılabilir. Programcılar, tasarımcılar, sanatçılar ve oyun geliştirme meraklıları için mükemmel bir fırsat.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-sm text-center">
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-3">Yarışma Formatı</h3>
            <p className="text-sm text-muted-foreground">
              48 saatlik yoğun bir geliştirme süreci. Takımlar tema açıklandıktan sonra oyunlarını geliştirmeye başlar ve süre sonunda projelerini teslim eder.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20 backdrop-blur-sm text-center">
            <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-3">Değerlendirme</h3>
            <p className="text-sm text-muted-foreground">
              Oyunlar yaratıcılık, teknik kalite, oynanabilirlik ve tema uyumu kriterlerine göre uzman jüri tarafından değerlendirilir.
            </p>
          </div>
        </div>

        {/* Misyon ve Vizyon */}
        <div className="grid md:grid-cols-2 gap-8">
          <div 
            className="gborder rounded-2xl backdrop-blur-md p-8"
            style={{ backgroundColor: 'color-mix(in oklab, var(--foreground) 5%, transparent)' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-blue-600">Misyonumuz</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Gaziantep'te oyun geliştirme ekosistemini güçlendirmek, genç yetenekleri desteklemek ve yerel oyun endüstrisinin gelişimine katkıda bulunmak.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                Oyun geliştirme kültürünü yaygınlaştırmak
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                Yerel yetenekleri keşfetmek ve desteklemek
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                Teknoloji ve yaratıcılığı birleştirmek
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                Topluluk oluşturmak ve networking sağlamak
              </li>
            </ul>
          </div>

          <div 
            className="gborder rounded-2xl backdrop-blur-md p-8"
            style={{ backgroundColor: 'color-mix(in oklab, var(--foreground) 5%, transparent)' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-purple-600">Vizyonumuz</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Gaziantep'i Türkiye'nin önde gelen oyun geliştirme merkezlerinden biri haline getirmek ve uluslararası arenada tanınan oyunlar üretmek.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                Uluslararası standartlarda oyunlar geliştirmek
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                Oyun geliştirme eğitimini desteklemek
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                Yerel oyun stüdyolarının kurulmasını teşvik etmek
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                Dijital ekonomiye katkıda bulunmak
              </li>
            </ul>
          </div>
        </div>

        {/* Organizasyon Ekibi */}
        <div 
          className="gborder rounded-2xl backdrop-blur-md p-8"
          style={{ backgroundColor: 'color-mix(in oklab, var(--foreground) 5%, transparent)' }}
        >
          <PageHeader
            title="Organizasyon Ekibi"
            desc="Game Jam'i mümkün kılan değerli ekip üyelerimiz"
            variant="plain"
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Proje Koordinatörü</h3>
              <p className="text-sm font-medium text-blue-600 mb-1">Ahmet Yılmaz</p>
              <span className="text-xs text-muted-foreground">Şehitkamil Belediyesi</span>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Teknik Direktör</h3>
              <p className="text-sm font-medium text-green-600 mb-1">Mehmet Kaya</p>
              <span className="text-xs text-muted-foreground">Oyun Geliştirici</span>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Tasarım Koordinatörü</h3>
              <p className="text-sm font-medium text-purple-600 mb-1">Ayşe Demir</p>
              <span className="text-xs text-muted-foreground">UI/UX Tasarımcı</span>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20">
              <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="font-semibold mb-1">İletişim Sorumlusu</h3>
              <p className="text-sm font-medium text-orange-600 mb-1">Fatma Özkan</p>
              <span className="text-xs text-muted-foreground">Pazarlama Uzmanı</span>
            </div>
          </div>
        </div>

        {/* İstatistikler */}
        <div 
          className="gborder rounded-2xl backdrop-blur-md p-8"
          style={{ backgroundColor: 'color-mix(in oklab, var(--foreground) 5%, transparent)' }}
        >
          <PageHeader
            title="Rakamlarla Game Jam"
            desc="Etkinliğimizin etkileyici istatistikleri"
            variant="plain"
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20">
              <div className="text-3xl font-bold text-blue-600 mb-2">100+</div>
              <div className="text-sm text-muted-foreground">Katılımcı</div>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
              <div className="text-3xl font-bold text-green-600 mb-2">25</div>
              <div className="text-sm text-muted-foreground">Takım</div>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <div className="text-3xl font-bold text-purple-600 mb-2">48</div>
              <div className="text-sm text-muted-foreground">Saat</div>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20">
              <div className="text-3xl font-bold text-orange-600 mb-2">₺50K</div>
              <div className="text-sm text-muted-foreground">Toplam Ödül</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

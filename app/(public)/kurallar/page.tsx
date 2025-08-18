// app/(public)/kurallar/page.tsx
import VideoBG from "@/components/background/video-bg";
import PageHeader from "../../panel/_components/page-header";

export default function RulesPage() {
  return (
    <section className="relative isolate min-h-screen">
      {/* 🎥 Arka plan video — sadece MP4 */}
      <VideoBG
        overlay
        opacity={0.9}
        light={{ mp4: "/videos/bg-light.mp4", poster: "/videos/light-poster.jpg" }}
        dark={{ mp4: "/videos/bg-dark.mp4",  poster: "/videos/dark-poster.jpg"  }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Yarışma Kuralları
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Game Jam'e katılmak için bilmeniz gereken tüm kurallar ve şartlar
          </p>
        </div>

        {/* Genel Kurallar */}
        <div
          className="gborder rounded-2xl backdrop-blur-md p-8"
          style={{ backgroundColor: "color-mix(in oklab, var(--foreground) 5%, transparent)" }}
        >
          <PageHeader
            title="Genel Kurallar"
            desc="Yarışmaya katılmak için uyulması gereken temel kurallar"
            variant="plain"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {/* Takım Kuralları */}
            <div className="space-y-4 p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Takım Kuralları</h3>
              <ul className="space-y-2 text-sm">
                <li>• Her takım 2-5 kişiden oluşmalıdır</li>
                <li>• Takım üyeleri 18 yaşını doldurmuş olmalıdır</li>
                <li>• Bir kişi sadece bir takımda yer alabilir</li>
                <li>• Takım isimleri uygun olmalıdır</li>
              </ul>
            </div>

            {/* Zaman Kuralları */}
            <div className="space-y-4 p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Zaman Kuralları</h3>
              <ul className="space-y-2 text-sm">
                <li>• Geliştirme süresi tam 48 saattir</li>
                <li>• Tema açıklanmadan önce kod yazılamaz</li>
                <li>• Süre sonunda projeler teslim edilmelidir</li>
                <li>• Geç teslim kabul edilmez</li>
              </ul>
            </div>

            {/* Teknik Kurallar */}
            <div className="space-y-4 p-6 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20">
              <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Teknik Kurallar</h3>
              <ul className="space-y-2 text-sm">
                <li>• Herhangi bir oyun motoru kullanılabilir</li>
                <li>• Ücretsiz veya lisanslı yazılımlar kullanılabilir</li>
                <li>• Hazır asset'ler kullanılabilir (kaynak belirtilmeli)</li>
                <li>• Oyun çalışır durumda olmalıdır</li>
              </ul>
            </div>

            {/* Teslim Kuralları */}
            <div className="space-y-4 p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Teslim Kuralları</h3>
              <ul className="space-y-2 text-sm">
                <li>• Oyun dosyaları ve kaynak kodları teslim edilmelidir</li>
                <li>• README dosyası zorunludur</li>
                <li>• Oyun videosu veya screenshot'ları eklenmelidir</li>
                <li>• Dosya boyutu 500MB'ı geçmemelidir</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tema Kuralları */}
        <div
          className="gborder rounded-2xl backdrop-blur-md p-8"
          style={{ backgroundColor: "color-mix(in oklab, var(--foreground) 5%, transparent)" }}
        >
          <PageHeader
            title="Tema Kuralları"
            desc="2025 yılı için belirlenen özel tema ve gereksinimler"
            variant="plain"
          />

          <div className="mt-8 space-y-6">
            <div className="p-6 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
              <h3 className="text-2xl font-bold text-yellow-600 mb-4">2025 Teması: "Oyna ve Kazan!"</h3>
              <p className="text-lg leading-relaxed">
                Bu yılın teması, kullanıcıların oynadıkça puan kazandığı ve ödüller alabildiği oyunlar geliştirmektir. 
                Oyununuz bu konsepti yansıtmalıdır.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-blue-600">Tema Gereksinimleri:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    Oyun, puan sistemi içermelidir
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    Kullanıcılar oynayarak ödüller kazanabilmelidir
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    Tema açıkça görülebilir olmalıdır
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    Orijinal ve yaratıcı olmalıdır
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Değerlendirme Kriterleri */}
        <div
          className="gborder rounded-2xl backdrop-blur-md p-8"
          style={{ backgroundColor: "color-mix(in oklab, var(--foreground) 5%, transparent)" }}
        >
          <PageHeader
            title="Değerlendirme Kriterleri"
            desc="Jüri üyelerinin oyunları değerlendirirken kullanacağı kriterler"
            variant="plain"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
              <div className="text-2xl font-bold text-emerald-600 mb-2">25%</div>
              <h3 className="text-lg font-semibold mb-2">Yaratıcılık</h3>
              <p className="text-sm text-muted-foreground">Orijinal fikirler, yenilikçi yaklaşımlar ve yaratıcı çözümler</p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20">
              <div className="text-2xl font-bold text-blue-600 mb-2">25%</div>
              <h3 className="text-lg font-semibold mb-2">Teknik Kalite</h3>
              <p className="text-sm text-muted-foreground">Kod kalitesi, performans, hata yokluğu ve teknik mükemmellik</p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-500/20">
              <div className="text-2xl font-bold text-purple-600 mb-2">20%</div>
              <h3 className="text-lg font-semibold mb-2">Oynanabilirlik</h3>
              <p className="text-sm text-muted-foreground">Oyun mekanikleri, kullanıcı deneyimi ve eğlence faktörü</p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20">
              <div className="text-2xl font-bold text-orange-600 mb-2">15%</div>
              <h3 className="text-lg font-semibold mb-2">Tema Uyumu</h3>
              <p className="text-sm text-muted-foreground">Verilen temaya uygunluk ve konsept tutarlılığı</p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20">
              <div className="text-2xl font-bold text-pink-600 mb-2">10%</div>
              <h3 className="text-lg font-semibold mb-2">Görsel Tasarım</h3>
              <p className="text-sm text-muted-foreground">Grafik kalitesi, sanat yönetimi ve görsel çekicilik</p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-sky-500/10 border border-cyan-500/20">
              <div className="text-2xl font-bold text-cyan-600 mb-2">5%</div>
              <h3 className="text-lg font-semibold mb-2">Sosyal Medya</h3>
              <p className="text-sm text-muted-foreground">#Şehitkamil etiketiyle yapılan paylaşımlar</p>
            </div>
          </div>
        </div>

        {/* Diskalifiye Durumları */}
        <div
          className="gborder rounded-2xl backdrop-blur-md p-8"
          style={{ backgroundColor: "color-mix(in oklab, var(--foreground) 5%, transparent)" }}
        >
          <PageHeader
            title="Diskalifiye Durumları"
            desc="Bu durumlar yarışmadan diskalifiye olmanıza neden olabilir"
            variant="plain"
          />

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="p-6 rounded-xl bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/20">
              <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-3">Yasaklı İçerik</h3>
              <ul className="space-y-2 text-sm">
                <li>• Müstehcen veya uygunsuz içerik</li>
                <li>• Şiddet içeren görseller</li>
                <li>• Telif hakkı ihlali</li>
                <li>• Kötü niyetli kod</li>
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20">
              <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-3">Kural İhlalleri</h3>
              <ul className="space-y-2 text-sm">
                <li>• Geç teslim</li>
                <li>• Çalışmayan oyun</li>
                <li>• Eksik dosyalar</li>
                <li>• Kopya içerik</li>
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-gray-500/10 to-slate-500/10 border border-gray-500/20">
              <div className="w-12 h-12 rounded-lg bg-gray-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-3">Davranış Kuralları</h3>
              <ul className="space-y-2 text-sm">
                <li>• Hakaret veya küfür</li>
                <li>• Diğer katılımcılara zarar verme</li>
                <li>• Organizasyon ekibine saygısızlık</li>
                <li>• Yarışmayı baltalama girişimi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sık Sorulan Sorular */}
        <div
          className="gborder rounded-2xl backdrop-blur-md p-8"
          style={{ backgroundColor: "color-mix(in oklab, var(--foreground) 5%, transparent)" }}
        >
          <PageHeader
            title="Sık Sorulan Sorular"
            desc="Katılımcıların en çok merak ettiği konular"
            variant="plain"
          />

          <div className="mt-8 space-y-4">
            <div className="p-6 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
              <h3 className="text-lg font-semibold mb-2">Hangi oyun motorları kullanılabilir?</h3>
              <p className="text-sm text-muted-foreground">
                Unity, Unreal Engine, Godot, GameMaker Studio, Construct, Scratch veya herhangi bir oyun motoru kullanabilirsiniz. 
                Ayrıca sıfırdan kod yazarak da oyun geliştirebilirsiniz.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
              <h3 className="text-lg font-semibold mb-2">Hazır asset'ler kullanabilir miyim?</h3>
              <p className="text-sm text-muted-foreground">
                Evet, ücretsiz veya lisanslı asset'ler kullanabilirsiniz. Ancak kullandığınız asset'lerin kaynaklarını 
                README dosyasında belirtmeniz zorunludur.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20">
              <h3 className="text-lg font-semibold mb-2">Takım değişikliği yapabilir miyim?</h3>
              <p className="text-sm text-muted-foreground">
                Kayıt süresi sona ermeden önce takım değişikliği yapabilirsiniz. Kayıt süresi bittikten sonra değişiklik yapılamaz.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20">
              <h3 className="text-lg font-semibold mb-2">Oyun hangi platformlarda çalışmalı?</h3>
              <p className="text-sm text-muted-foreground">
                Oyununuz Windows, macOS veya web platformlarında çalışabilir. Jüri üyelerinin test edebilmesi için 
                gerekli kurulum talimatları README dosyasında yer almalıdır.
              </p>
            </div>
          </div>
        </div>

        {/* İletişim Desteği */}
        <div
          className="gborder rounded-2xl backdrop-blur-md p-8 text-center"
          style={{ backgroundColor: "color-mix(in oklab, var(--foreground) 5%, transparent)" }}
        >
          <PageHeader
            title="Kural Hakkında Sorularınız mı Var?"
            desc="Kurallar hakkında herhangi bir sorunuz varsa bizimle iletişime geçebilirsiniz"
            variant="plain"
          />

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:rules@gamejam.org" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
              E-posta Gönder
            </a>
            <a 
              href="#" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"/>
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"/>
              </svg>
             
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

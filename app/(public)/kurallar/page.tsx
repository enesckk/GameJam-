// app/(public)/kurallar/page.tsx
import VideoBG from "@/components/background/video-bg";
import PageHeader from "../../panel/_components/page-header"; // kendi yolunu ayarla

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

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 space-y-12">
        {/* Katılım Şartları */}
        <div
          className="gborder rounded-2xl backdrop-blur-md p-8"
          style={{ backgroundColor: "color-mix(in oklab, var(--foreground) 5%, transparent)" }}
        >
          <PageHeader
            title="Katılım Şartları"
            desc="Etkinliğe kimler katılabilir, nasıl başvuru yapılır?"
            variant="plain"
          />

          <div className="space-y-6 text-base leading-relaxed text-[color:var(--foreground)]">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Kimler Katılabilir?</strong> Lise ve üzeri eğitim düzeyine sahip
                herkes katılabilir. Yazılım, tasarım, içerik üretimi, ses/müzik gibi
                alanlarda katkı sağlayabilecek katılımcılar davetlidir.
              </li>
              <li>
                <strong>Katılım Şekli:</strong> Bireysel veya takım halinde başvuru
                yapılabilir. Takımlar en fazla 4 kişiden oluşabilir.
              </li>
              <li>
                <strong>Bireysel Katılımcılar:</strong> Tek başına başvuranlar, ilgi ve
                yetenek alanlarına göre uygun takımlarla eşleştirilecektir.
              </li>
              <li>
                <strong>Süreç Yönetimi:</strong> Tüm eşleştirme, duyurular, görev takibi
                ve teslimatlar web sitesi üzerinden yönetilecektir.
              </li>
              <li>
                <strong>Mentör Desteği:</strong> Etkinlik boyunca alanında uzman mentörler
                katılımcılara rehberlik edecek, soru-cevap desteği sunacaktır.
              </li>
            </ul>
          </div>
        </div>

        {/* Topluluk Kuralları */}
        <div
          className="gborder rounded-2xl backdrop-blur-md p-8"
          style={{ backgroundColor: "color-mix(in oklab, var(--foreground) 5%, transparent)" }}
        >
          <PageHeader
            title="Topluluk Kuralları"
            desc="Pozitif ve kapsayıcı bir ortam için belirlenen kurallar"
            variant="plain"
          />

          <div className="space-y-6 text-base leading-relaxed text-[color:var(--foreground)]">
            <ul className="list-disc pl-5 space-y-2">
              <li>Saygılı iletişim: Ayrımcı, saldırgan veya toksik davranışlara izin verilmez.</li>
              <li>Telif ve lisanslara dikkat edin: Kullandığınız asset’lerin kaynağını belirtin.</li>
              <li>Hazır projelerin aynısını teslim etmeyin; jam süresince üretime odaklanın.</li>
              <li>Takım içi sorumluluk dağılımını netleştirin; teslim tarihlerini kaçırmayın.</li>
            </ul>
            <p>
              Katılımcılar, bu kurallara uymayı kabul etmiş sayılır. Organizasyon ekibi,
              ihlaller durumunda gerekli aksiyonları alma hakkını saklı tutar.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

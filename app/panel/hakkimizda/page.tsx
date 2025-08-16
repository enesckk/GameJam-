// app/panel/hakkimizda/page.tsx
import Link from "next/link";
import PageHeader from "../_components/page-header";
import SectionCard from "../_components/section-card";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Hakkımızda"
        desc="Şehitkamil Game Jam — oyun geliştiricilerini bir araya getiren yaratıcı maraton"
        variant="plain"
      />

      {/* Giriş */}
      <SectionCard>
        <div className="prose prose-invert max-w-none">
          <p className="text-base leading-relaxed opacity-90">
            <strong>Şehitkamil Game Jam</strong>, geliştiriciler, tasarımcılar, ses/müzik ve içerik üreticilerini
            48 saat boyunca aynı çatı altında buluşturan bir üretim maratonudur. Hedefimiz; ekip çalışması,
            hızlı prototipleme ve yaratıcı problem çözmeyi teşvik ederek yeni oyun fikirlerini ortaya çıkarmaktır.
          </p>
        </div>
      </SectionCard>

      {/* Öne çıkanlar / sayılar */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { k: "Süre", v: "48 Saat" },
          { k: "Ekip Boyutu", v: "En fazla 4 kişi" },
          { k: "Katılım", v: "Bireysel veya Takım" },
          { k: "Teslim", v: "Panel ▸ Oyun Teslimi" },
        ].map((i) => (
          <div key={i.k} className="gborder-hover rounded-2xl">
            <div className="rounded-2xl bg-white/10 dark:bg-black/10 backdrop-blur p-5">
              <div className="text-xs opacity-70">{i.k}</div>
              <div className="text-lg font-semibold text-foreground">{i.v}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Nedir? */}
      <SectionCard title="Game Jam Nedir?" subtitle="Kısa açıklama">
        <div className="space-y-3 text-sm opacity-90">
          <p>
            Belirlenen tema doğrultusunda sınırlı sürede bir oyun prototipi geliştirirsiniz. İster bireysel,
            ister takım olarak katılabilirsiniz. Panel üzerinden{" "}
            <Link href="/panel/takim" className="underline underline-offset-4">Takım</Link>{" "}
            ve <Link href="/panel/teslim" className="underline underline-offset-4">Oyun Teslimi</Link> adımlarını yönetebilirsiniz.
          </p>
          <p>
            Süreç boyunca duyurular ve iletişim için{" "}
            <Link href="/panel/duyurular" className="underline underline-offset-4">Duyurular</Link> ve{" "}
            <Link href="/panel/mesajlar" className="underline underline-offset-4">Mesajlar</Link> bölümlerini kullanın.
          </p>
        </div>
      </SectionCard>

      {/* Amaç & Değerler */}
      <SectionCard title="Amaç & Değerler" subtitle="Topluluk kültürü">
        <ul className="grid gap-3 sm:grid-cols-2">
          {[
            "Yaratıcı işbirliği ve bilgi paylaşımı",
            "Hızlı prototipleme ve üretkenlik",
            "Erişilebilirlik ve kapsayıcılık",
            "Yerel ekosisteme katkı ve görünürlük",
          ].map((t) => (
            <li key={t} className="gborder-hover rounded-2xl">
              <div className="rounded-2xl bg-white/10 dark:bg-black/10 backdrop-blur p-4 text-sm opacity-90">
                {t}
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* Değerlendirme Ölçütleri */}
      <SectionCard title="Değerlendirme Ölçütleri" subtitle="Jüri tarafından dikkate alınan başlıklar">
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { h: "Tema Uyumu", p: "Belirlenen tema ile fikrin uyumu ve yorumlanışı." },
            { h: "Oynanış & Mekanik", p: "Mekaniklerin açıklığı, akış ve dengesi." },
            { h: "Görsel & Ses", p: "Sanat yönü, ses/müzik bütünlüğü." },
            { h: "Teknik Kalite", p: "Optimizasyon, kararlılık ve uygulama kalitesi." },
            { h: "Yenilikçilik", p: "Fikir özgünlüğü ve yaratıcı dokunuşlar." },
            { h: "Sunum", p: "Projenin anlatımı, teslim paketinin düzeni." },
          ].map((b) => (
            <div key={b.h} className="gborder-hover rounded-2xl">
              <div className="rounded-2xl bg-white/10 dark:bg-black/10 backdrop-blur p-4">
                <div className="text-sm font-semibold text-foreground">{b.h}</div>
                <div className="text-sm opacity-85">{b.p}</div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Akış Özeti */}
      <SectionCard title="Akış Özeti" subtitle="Yüksek seviyede plan">
        <ol className="grid gap-3 md:grid-cols-2">
          {[
            { t: "Kayıt & Karşılama", d: "Panoya erişim, takım oluşturma / birleştirme." },
            { t: "Tema Duyurusu", d: "Açılışta açıklanır. Duyurular sayfasını takip edin." },
            { t: "Geliştirme Süreci", d: "Mentör desteği, ara checkpoint’ler." },
            { t: "Oyun Teslimi", d: "Panel ▸ Oyun Teslimi üzerinden belirtilen formatta." },
            { t: "Sunum & Jüri", d: "Kısa oynanış/sunum; değerlendirme kriterleri uygulanır." },
            { t: "Ödüller", d: "Dereceler ve sponsor ödülleri duyurulur." },
          ].map((s, i) => (
            <li key={i} className="gborder-hover rounded-2xl">
              <div className="rounded-2xl bg-white/10 dark:bg-black/10 backdrop-blur p-4">
                <div className="text-sm font-semibold text-foreground">{s.t}</div>
                <div className="text-sm opacity-85">{s.d}</div>
              </div>
            </li>
          ))}
        </ol>
      </SectionCard>

      {/* Mekân & Lojistik */}
      <SectionCard title="Mekân & Lojistik" subtitle="Ulaşım, yemek ve çalışma alanları">
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { h: "Mekân & Konum", p: <>Detaylar <Link href="/panel/iletisim" className="underline underline-offset-4">İletişim</Link> sayfasında.</> },
            { h: "Çalışma Alanları", p: "Elektrik/İnternet erişimi, ekipman yerleşimi." },
            { h: "İkramlar", p: "Belirli saatlerde atıştırmalık ve içecek/akşam yemeği." },
            { h: "Güvenlik", p: "Etkinlik kurallarına uyum ve alan güvenliği." },
          ].map((b) => (
            <div key={b.h} className="gborder-hover rounded-2xl">
              <div className="rounded-2xl bg-white/10 dark:bg-black/10 backdrop-blur p-4">
                <div className="text-sm font-semibold text-foreground">{b.h}</div>
                <div className="text-sm opacity-85">{b.p}</div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Topluluk Kuralları */}
      <SectionCard title="Topluluk Kuralları" subtitle="Pozitif ve kapsayıcı bir ortam">
        <ul className="list-disc pl-5 space-y-2 text-sm opacity-90">
          <li>Saygılı iletişim; ayrımcı, saldırgan veya toksik davranışlara izin verilmez.</li>
          <li>Telif ve lisanslara dikkat edin; kullandığınız asset’lerin kaynağını belirtin.</li>
          <li>Hazır projelerin aynısını teslim etmeyin; jam döneminde üretime odaklanın.</li>
          <li>Takım içi sorumluluk dağılımını netleştirin; teslim tarihlerini kaçırmayın.</li>
        </ul>
        <div className="mt-3 text-sm">
          Detaylar için{" "}
          <Link href="/panel/kurallar" className="inline-flex items-center gap-1 underline underline-offset-4">
            Kurallar sayfasına git <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </SectionCard>

      {/* CTA */}
      <div className="gborder-hover rounded-2xl">
        <div className="rounded-2xl bg-white/10 dark:bg-black/10 backdrop-blur p-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="text-sm opacity-90">
            Sorun mu var? Organizasyon ekibi yardım için burada.
          </div>
          <Link
            href="/panel/mesajlar"
            className="ml-auto inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[color:var(--background)] bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-500 hover:scale-[1.02] transition"
          >
            Mesaj Gönder <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

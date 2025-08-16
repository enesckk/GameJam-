// app/(public)/hakkinda/page.tsx
import VideoBG from "@/components/background/video-bg";
import PageHeader from "../../panel/_components/page-header"; // kendi yolunu ayarla

export default function AboutPage() {
  return (
    <section className="relative min-h-screen">
      {/* Arka plan video */}
      <VideoBG
        light={{
          webm: "/videos/light.webm",
          mp4: "/videos/bg-light.mp4",
          poster: "/videos/light-poster.jpg",
        }}
        dark={{
          webm: "/videos/dark.webm",
          mp4: "/videos/bg-dark.mp4",
          poster: "/videos/dark-poster.jpg",
        }}
       />

       <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        {/* Her zaman renkli kenarlık + blur arka plan */}
        <div 
          className="gborder rounded-2xl backdrop-blur-md p-8"
          style={{ 
            backgroundColor: 'color-mix(in oklab, var(--foreground) 5%, transparent)',
          }}
        >
          <PageHeader
            title="Hakkımızda"
            desc="Şehitkamil Game Jam — oyun geliştiricilerini, tasarımcıları ve içerik üreticilerini bir araya getiren yaratıcı üretim maratonu"
            variant="plain"
          />

          {/* CSS custom properties ile tema uyumlu renkler */}
          <div className="max-w-none space-y-4 leading-relaxed">
            <p style={{ color: 'var(--foreground)' }}>
              <strong 
                style={{ color: 'var(--foreground)', fontWeight: '600' }}
              >
                Şehitkamil Game Jam
              </strong>, yazılım geliştiriciler, oyun
              tasarımcıları, ses/müzik prodüktörleri ve içerik üreticilerini 48 saat süren
              yoğun bir üretim maratonunda bir araya getirir. Amacımız; ekip çalışmasını,
              hızlı prototiplemeyi ve yaratıcı problem çözme becerilerini teşvik ederek
              özgün ve yenilikçi oyun fikirlerinin ortaya çıkmasını sağlamaktır.
            </p>
            <p style={{ color: 'var(--foreground)' }}>
              Etkinlik süresince geliştirilen projeler,{" "}
              <strong 
                style={{ color: 'var(--foreground)', fontWeight: '600' }}
              >
                Şehitkamil Belediyesi'nin teknoloji vizyonuna
              </strong> uygun olarak
              tasarlanır ve sosyal fayda sağlayacak çözümler sunar. Katılımcılar, hem teknik
              hem de yaratıcı süreçlerde deneyim kazanır, sektör profesyonelleriyle ağ kurma
              fırsatı yakalar.
            </p>
            <p style={{ color: 'var(--foreground)' }}>
              Şehitkamil Game Jam, yerel ekosistemi güçlendiren, inovasyonu teşvik eden ve
              genç yeteneklerin görünürlüğünü artıran bir topluluk etkinliğidir.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
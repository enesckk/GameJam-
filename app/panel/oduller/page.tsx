// app/panel/oduller/page.tsx
"use client";

import PageHeader from "../_components/page-header";
import SectionCard from "../_components/section-card";
import {
  Trophy, Award, Gift, Sparkles, Ticket, BadgeCheck, ShieldCheck, Cpu
} from "lucide-react";

export default function AwardsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Ödüller"
        desc="Bu yılın ödülleri, teşvikleri ve entegrasyon fırsatları"
        variant="plain"
      />

      {/* İlk 3 derece – her zaman renkli çerçeve */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">Büyük Ödüller</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AwardCard
            icon={<Trophy className="h-6 w-6" />}
            place="1. Takım"
            prize="Huawei Tablet"
            highlight
          />
          <AwardCard
            icon={<Award className="h-6 w-6" />}
            place="2. Takım"
            prize="Huawei Akıllı Saat"
            highlight
          />
          <AwardCard
            icon={<Cpu className="h-6 w-6" />}
            place="3. Takım"
            prize="Oyun Aksesuar Seti (mouse, mousepad, kablo vb.)"
            highlight
          />
        </div>
      </section>

      {/* Entegrasyon & Belediye Desteği */}
      <SectionCard>
        <div className="gborder-hover rounded-2xl">
          <div className="rounded-2xl bg-white/10 dark:bg-black/10 backdrop-blur p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 opacity-90" />
              <div>
                <h3 className="text-sm font-semibold">Uygulama Entegrasyonu ve Belediye Desteği</h3>
                <ul className="mt-2 space-y-1.5 text-sm opacity-90">
                  <li>Başarılı görülen oyunlar, <strong>Şehitkamil Belediyesi mobil uygulamasına</strong> entegre edilme şansı yakalayacaktır.</li>
                  <li>Belediye mühendisleri teknik değerlendirmede rol alacak ve yönlendirme sağlayacaktır.</li>
                  <li>Geliştirilmeye uygun projeler, <strong>teşvik edilerek</strong> desteklenmeye devam edecektir.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Her katılımcıya */}
      <SectionCard>
        <div className="gborder-hover rounded-2xl">
          <div className="rounded-2xl bg-white/10 dark:bg-black/10 backdrop-blur p-5">
            <div className="flex items-start gap-3">
              <Gift className="mt-0.5 h-5 w-5 opacity-90" />
              <div>
                <h3 className="text-sm font-semibold">Her Katılımcıya Özel</h3>
                <ul className="mt-2 space-y-1.5 text-sm opacity-90">
                  <li>Tüm katılımcılara <strong>özel hediyeler</strong> sunulacaktır.</li>
                  <li>Resmî <strong>dijital katılım sertifikası</strong> verilecektir.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Ekstra fırsatlar */}
      <SectionCard>
        <div className="gborder-hover rounded-2xl">
          <div className="rounded-2xl bg-white/10 dark:bg-black/10 backdrop-blur p-5">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 opacity-90" />
              <div>
                <h3 className="text-sm font-semibold">Ekstra Ödül Fırsatları</h3>
                <ul className="mt-2 space-y-1.5 text-sm opacity-90">
                  <li><strong>Kahoot Bilgi Yarışması</strong>: Etkinlik sırasında yapılacak yarışmalarla sürpriz hediyeler.</li>
                  <li><strong>Çekiliş Hediyeleri</strong>: Katılımcılar arasında yapılacak çekilişlerle çeşitli ödüller.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Sponsor katkıları – opsiyonel kısa blok */}
      <SectionCard>
        <div className="gborder-hover rounded-2xl">
          <div className="rounded-2xl bg-white/10 dark:bg-black/10 backdrop-blur p-5">
            <div className="flex items-start gap-3">
              <BadgeCheck className="mt-0.5 h-5 w-5 opacity-90" />
              <div>
                <h3 className="text-sm font-semibold">Sponsor Katkıları (Özet)</h3>
                <p className="mt-2 text-sm opacity-90">
                  Ana ödüller ve ekstra sürprizler sponsor destekleriyle sağlanır.
                  Detaylar duyuru ve sahada bildirilecektir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Not / dip bilgi */}
      <SectionCard>
        <p className="text-xs opacity-75">
          * Ödüller PDF dokümanındaki bilgilere dayanır; organizasyon gerek gördüğünde güncelleme yapabilir.
        </p>
      </SectionCard>
    </div>
  );
}

/* — küçük, tekrar kullanılabilir kart — */
function AwardCard({ icon, place, prize, highlight = false }: {
  icon: React.ReactNode;
  place: string;
  prize: string;
  highlight?: boolean;
}) {
  return (
    <div className={highlight ? "gborder rounded-2xl" : "gborder-hover rounded-2xl"}>
      <div className="rounded-2xl bg-white/10 dark:bg-black/10 backdrop-blur p-5 h-full">
        <div className="flex items-start gap-3">
          <div className="shrink-0">{icon}</div>
          <div>
            <div className="text-sm font-semibold">{place}</div>
            <div className="text-sm opacity-90">{prize}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

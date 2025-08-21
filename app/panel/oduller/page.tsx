"use client";

import PageHeader from "../_components/page-header";
import SectionCard from "../_components/section-card";
import {
  Trophy, Award, Gift, Sparkles, Ticket, BadgeCheck, ShieldCheck, Cpu, Star, Crown, Medal, Gem
} from "lucide-react";

export default function AwardsPage() {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-500/20 via-orange-500/15 to-red-500/20 backdrop-blur-xl border border-yellow-500/30 p-4 sm:p-6 lg:p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 animate-pulse"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Ödüller & Fırsatlar</h2>
              <p className="text-sm sm:text-base text-yellow-200/80">Başarılarınızın karşılığı</p>
            </div>
          </div>
          
          <p className="text-sm sm:text-base leading-relaxed text-yellow-100 max-w-2xl">
            Şehitkamil Game Jam'de sadece oyun geliştirmekle kalmayın! Dereceye giren takımlar 
            değerli ödüller kazanırken, tüm katılımcılar özel fırsatlar ve entegrasyon imkanları elde edecek.
          </p>
        </div>
      </div>

      {/* İlk 3 derece */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
            <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">Büyük Ödüller</h2>
            <p className="text-sm text-purple-200/80">İlk 3 takıma özel ödüller</p>
          </div>
        </div>
        
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <AwardCard
            icon={<Trophy className="h-6 w-6 sm:h-8 sm:w-8" />}
            place="1. Takım"
            prize="Huawei Tablet"
            highlight
            color="from-yellow-500 to-orange-500"
            rank="1"
          />
          <AwardCard
            icon={<Award className="h-6 w-6 sm:h-8 sm:w-8" />}
            place="2. Takım"
            prize="Huawei Akıllı Saat"
            highlight
            color="from-gray-400 to-gray-600"
            rank="2"
          />
          <AwardCard
            icon={<Cpu className="h-6 w-6 sm:h-8 sm:w-8" />}
            place="3. Takım"
            prize="Oyun Aksesuar Seti (mouse, mousepad, kablo vb.)"
            highlight
            color="from-orange-600 to-red-600"
            rank="3"
          />
        </div>
      </section>

      {/* Entegrasyon & Belediye Desteği */}
      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500/20 via-indigo-500/15 to-purple-500/20 backdrop-blur-xl border border-blue-500/30 p-4 sm:p-6 hover:scale-[1.02] transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white mb-3">Uygulama Entegrasyonu ve Belediye Desteği</h3>
              <ul className="space-y-3 text-sm text-blue-100">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Başarılı görülen oyunlar, <strong className="text-white">Şehitkamil Belediyesi mobil uygulamasına</strong> entegre edilme şansı yakalayacaktır.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Belediye mühendisleri teknik değerlendirmede rol alacak ve yönlendirme sağlayacaktır.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Geliştirilmeye uygun projeler, <strong className="text-white">teşvik edilerek</strong> desteklenmeye devam edecektir.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Her katılımcıya */}
      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500/20 via-emerald-500/15 to-teal-500/20 backdrop-blur-xl border border-green-500/30 p-4 sm:p-6 hover:scale-[1.02] transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <Gift className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white mb-3">Her Katılımcıya Özel</h3>
              <ul className="space-y-3 text-sm text-green-100">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Tüm katılımcılara <strong className="text-white">özel hediyeler</strong> sunulacaktır.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Resmî <strong className="text-white">dijital katılım sertifikası</strong> verilecektir.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Ekstra fırsatlar */}
      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/20 via-pink-500/15 to-red-500/20 backdrop-blur-xl border border-purple-500/30 p-4 sm:p-6 hover:scale-[1.02] transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white mb-3">Ekstra Ödül Fırsatları</h3>
              <ul className="space-y-3 text-sm text-purple-100">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong className="text-white">Kahoot Bilgi Yarışması</strong>: Etkinlik sırasında yapılacak yarışmalarla sürpriz hediyeler.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong className="text-white">Çekiliş Hediyeleri</strong>: Katılımcılar arasında yapılacak çekilişlerle çeşitli ödüller.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Sponsor katkıları */}
      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500/20 via-blue-500/15 to-cyan-500/20 backdrop-blur-xl border border-indigo-500/30 p-4 sm:p-6 hover:scale-[1.02] transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <BadgeCheck className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white mb-3">Sponsor Katkıları</h3>
              <p className="text-sm text-indigo-100 leading-relaxed">
                Ana ödüller ve ekstra sürprizler sponsor destekleriyle sağlanır.
                Detaylar duyuru ve sahada bildirilecektir.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* İstatistikler */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { icon: Trophy, title: "Toplam Ödül", value: "3", color: "from-yellow-500 to-orange-500" },
          { icon: Gift, title: "Katılımcı Hediyesi", value: "Tümü", color: "from-green-500 to-emerald-500" },
          { icon: Star, title: "Ekstra Fırsat", value: "Sınırsız", color: "from-purple-500 to-pink-500" },
        ].map((item, index) => (
          <div key={index} className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 backdrop-blur-xl border border-purple-500/20 p-4 sm:p-6 hover:scale-105 transition-all duration-300">
            <div className="flex flex-col items-center text-center gap-3">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                <item.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white">{item.value}</div>
                <div className="text-sm text-purple-200/80">{item.title}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Not */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-500/10 via-gray-600/5 to-gray-700/10 backdrop-blur-xl border border-gray-500/20 p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Gem className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
          </div>
          <div className="text-sm text-gray-200/80">
            <p>
              * Ödüller PDF dokümanındaki bilgilere dayanır; organizasyon gerek gördüğünde güncelleme yapabilir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AwardCard({ 
  icon, 
  place, 
  prize, 
  highlight = false, 
  color = "from-purple-500 to-pink-500",
  rank 
}: {
  icon: React.ReactNode;
  place: string;
  prize: string;
  highlight?: boolean;
  color?: string;
  rank?: string;
}) {
  return (
    <div className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 backdrop-blur-xl border border-purple-500/20 p-4 sm:p-6 hover:scale-105 transition-all duration-300 ${highlight ? 'shadow-xl' : ''}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col items-center text-center gap-3 sm:gap-4">
          {/* Rank Badge */}
          {rank && (
            <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center shadow-lg`}>
              <span className="text-white font-bold text-base sm:text-lg">{rank}</span>
            </div>
          )}
          
          {/* Icon */}
          <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${color} rounded-3xl flex items-center justify-center shadow-lg`}>
            <div className="text-white">
              {icon}
            </div>
          </div>
          
          {/* Content */}
          <div>
            <div className="text-base sm:text-lg font-bold text-white mb-2">{place}</div>
            <div className="text-xs sm:text-sm text-purple-200/80 leading-relaxed">{prize}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
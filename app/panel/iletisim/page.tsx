"use client";

import { useState } from "react";
import PageHeader from "../_components/page-header";
import SectionCard from "../_components/section-card";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  MessageCircle,
  Copy,
  CheckCircle,
  Building,
  Globe,
  Users,
  Calendar
} from "lucide-react";

const WHATSAPP_LINK = "https://chat.whatsapp.com/XXXXXXXXXXXXXXX";
const SUPPORT_EMAIL = "destek@sehitkamilgamejam.tr";
const PHONE = "+90 5xx xxx xx xx";
const HOURS = "Hafta içi 09:00–18:00";

const VENUE = {
  name: "Şehitkamil Belediyesi",
  address: "Şehitkamil / Gaziantep",
  mapQuery: "Şehitkamil Belediyesi, Gaziantep",
};

const MAP_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(
  VENUE.mapQuery
)}&output=embed`;

export default function IletisimPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* no-op */
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="İletişim"
        desc="Soru ve önerileriniz için bize ulaşın"
        variant="plain"
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/20 via-pink-500/15 to-blue-500/20 backdrop-blur-xl border border-purple-500/30 p-4 sm:p-6 lg:p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 animate-pulse"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Bizimle İletişime Geçin</h2>
              <p className="text-sm sm:text-base text-purple-200/80">Her zaman yanınızdayız</p>
            </div>
          </div>
          
          <p className="text-sm sm:text-base leading-relaxed text-purple-100 max-w-2xl">
            Sorularınız, önerileriniz veya teknik destek ihtiyacınız için aşağıdaki kanallardan bize ulaşabilirsiniz. 
            Organizasyon ekibimiz size en kısa sürede dönüş yapacaktır.
          </p>
        </div>
      </div>

      {/* Hızlı aksiyonlar */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        {/* WhatsApp */}
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500/20 via-emerald-500/15 to-teal-500/20 backdrop-blur-xl border border-green-500/30 p-4 sm:p-6 hover:scale-105 transition-all duration-300 hover:shadow-xl"
          title="WhatsApp grubuna katıl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10 flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-base sm:text-lg font-bold text-white mb-1">
                WhatsApp Grubu
              </div>
              <div className="text-xs sm:text-sm text-green-200/80">
                Duyuruları kaçırmamak için gruba katılın
              </div>
            </div>
            <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 text-green-300 group-hover:text-green-200 transition-colors flex-shrink-0" />
          </div>
        </a>

        {/* Konum */}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            VENUE.mapQuery
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500/20 via-indigo-500/15 to-purple-500/20 backdrop-blur-xl border border-blue-500/30 p-4 sm:p-6 hover:scale-105 transition-all duration-300 hover:shadow-xl"
          title="Haritada aç"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10 flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-base sm:text-lg font-bold text-white mb-1 truncate">
                {VENUE.name}
              </div>
              <div className="text-xs sm:text-sm text-blue-200/80 truncate">
                {VENUE.address}
              </div>
            </div>
            <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300 group-hover:text-blue-200 transition-colors flex-shrink-0" />
          </div>
        </a>
      </div>

      {/* İletişim bilgileri */}
      <SectionCard
        title="İletişim Bilgileri"
        subtitle="Destek kanalları ve çalışma saatleri"
      >
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {/* E-posta */}
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 backdrop-blur-xl border border-purple-500/20 p-4 sm:p-6 hover:scale-105 transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs sm:text-sm text-purple-200/80 mb-1">E-posta</div>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="block font-bold text-white hover:text-purple-200 transition-colors break-words text-sm sm:text-base"
                >
                  {SUPPORT_EMAIL}
                </a>
              </div>
              <button
                onClick={() => copy(SUPPORT_EMAIL, "email")}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 w-full sm:w-auto ${
                  copied === "email" 
                    ? "bg-green-500/20 border-green-500/30 text-green-200" 
                    : "bg-purple-500/20 border-purple-500/30 text-purple-200 hover:bg-purple-500/30"
                } border backdrop-blur-sm`}
                title="Kopyala"
              >
                {copied === "email" ? (
                  <>
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    Kopyalandı
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                    Kopyala
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Telefon */}
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-teal-500/10 backdrop-blur-xl border border-green-500/20 p-4 sm:p-6 hover:scale-105 transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs sm:text-sm text-green-200/80 mb-1">Telefon</div>
                <a
                  href={`tel:${PHONE.replace(/\s/g, "")}`}
                  className="block font-bold text-white hover:text-green-200 transition-colors text-sm sm:text-base"
                >
                  {PHONE}
                </a>
              </div>
              <button
                onClick={() => copy(PHONE, "phone")}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 w-full sm:w-auto ${
                  copied === "phone" 
                    ? "bg-green-500/20 border-green-500/30 text-green-200" 
                    : "bg-green-500/20 border-green-500/30 text-green-200 hover:bg-green-500/30"
                } border backdrop-blur-sm`}
                title="Kopyala"
              >
                {copied === "phone" ? (
                  <>
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    Kopyalandı
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                    Kopyala
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Saatler */}
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-red-500/10 backdrop-blur-xl border border-yellow-500/20 p-4 sm:p-6 md:col-span-2 hover:scale-105 transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs sm:text-sm text-yellow-200/80 mb-1">Destek Saatleri</div>
                <div className="font-bold text-white text-base sm:text-lg">
                  {HOURS}
                </div>
              </div>
              <div className="flex items-center gap-2 text-yellow-200/80">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm">Pazartesi - Cuma</span>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Harita */}
      <SectionCard title="Konum" subtitle="Mekan haritası ve yol tarifi">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-purple-500/10 backdrop-blur-xl border border-blue-500/20">
          <div className="p-4 sm:p-6 pb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Building className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm sm:text-base">{VENUE.name}</h3>
                <p className="text-xs sm:text-sm text-blue-200/80">{VENUE.address}</p>
              </div>
            </div>
          </div>
          
          <div className="w-full h-48 sm:h-64 md:h-80 bg-black/20 rounded-b-3xl overflow-hidden">
            <iframe
              src={MAP_EMBED}
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              aria-label="Google Maps konum haritası"
            />
          </div>
        </div>
        
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm text-purple-200/80">
          <div className="flex items-center gap-2">
            <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Harita açılmıyorsa</span>
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              VENUE.mapQuery
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-200 underline underline-offset-4 font-medium transition-colors"
          >
            Google Maps'de aç
            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
          </a>
        </div>
      </SectionCard>

      {/* Ek Bilgiler */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {[
          { icon: Users, title: "Topluluk", desc: "Aktif katılımcılar", color: "from-purple-500 to-pink-500" },
          { icon: Calendar, title: "Etkinlik", desc: "48 saat maraton", color: "from-blue-500 to-cyan-500" },
          { icon: Building, title: "Mekan", desc: "Şehitkamil Belediyesi", color: "from-green-500 to-emerald-500" },
        ].map((item, index) => (
          <div key={index} className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 backdrop-blur-xl border border-purple-500/20 p-4 sm:p-6 hover:scale-105 transition-all duration-300">
            <div className="flex flex-col items-center text-center gap-3">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                <item.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1 text-sm sm:text-base">{item.title}</h3>
                <p className="text-xs sm:text-sm text-purple-200/80">{item.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
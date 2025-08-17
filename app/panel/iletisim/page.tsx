// app/panel/iletisim/page.tsx
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

      {/* Hızlı aksiyonlar */}
      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
        {/* WhatsApp */}
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="gborder-hover rounded-2xl transition-transform hover:scale-[1.02]"
          title="WhatsApp grubuna katıl"
        >
          <div className="rounded-2xl bg-white/10 dark:bg-black/10 backdrop-blur p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
            <div className="rounded-2xl bg-foreground/10 ring-1 ring-foreground/10 p-2.5 sm:p-3">
              <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0">
              <div className="text-sm sm:text-base font-semibold text-foreground">
                WhatsApp Grubu
              </div>
              <div className="text-xs sm:text-sm opacity-80">
                Duyuruları kaçırmamak için gruba katılın
              </div>
            </div>
            <ExternalLink className="ml-auto h-4 w-4 opacity-70 flex-shrink-0" />
          </div>
        </a>

        {/* Konum */}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            VENUE.mapQuery
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="gborder-hover rounded-2xl transition-transform hover:scale-[1.02]"
          title="Haritada aç"
        >
          <div className="rounded-2xl bg-white/10 dark:bg-black/10 backdrop-blur p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
            <div className="rounded-2xl bg-foreground/10 ring-1 ring-foreground/10 p-2.5 sm:p-3">
              <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0">
              <div className="text-sm sm:text-base font-semibold text-foreground truncate">
                {VENUE.name}
              </div>
              <div className="text-xs sm:text-sm opacity-80 truncate">
                {VENUE.address}
              </div>
            </div>
            <ExternalLink className="ml-auto h-4 w-4 opacity-70 flex-shrink-0" />
          </div>
        </a>
      </div>

      {/* İletişim bilgileri */}
      <SectionCard
        title="İletişim Bilgileri"
        subtitle="Destek kanalları ve çalışma saatleri"
      >
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
          {/* E-posta */}
          <div className="gborder-hover rounded-2xl">
            <div className="rounded-2xl bg-white/10 dark:bg-black/10 backdrop-blur p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
              <div className="rounded-2xl bg-foreground/10 ring-1 ring-foreground/10 p-2.5 sm:p-3">
                <Mail className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm opacity-80">E-posta</div>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="block font-semibold text-foreground break-words hover:underline text-sm sm:text-base"
                >
                  {SUPPORT_EMAIL}
                </a>
              </div>
              <button
                onClick={() => copy(SUPPORT_EMAIL, "email")}
                className="ml-auto rounded-lg px-2 py-1 text-xs ring-1 ring-foreground/15 hover:bg-foreground/10 whitespace-nowrap"
                title="Kopyala"
              >
                <div className="flex items-center gap-1">
                  <Copy className="h-3.5 w-3.5" />
                  {copied === "email" ? "Kopyalandı" : "Kopyala"}
                </div>
              </button>
            </div>
          </div>

          {/* Telefon */}
          <div className="gborder-hover rounded-2xl">
            <div className="rounded-2xl bg-white/10 dark:bg-black/10 backdrop-blur p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
              <div className="rounded-2xl bg-foreground/10 ring-1 ring-foreground/10 p-2.5 sm:p-3">
                <Phone className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm opacity-80">Telefon</div>
                <a
                  href={`tel:${PHONE.replace(/\s/g, "")}`}
                  className="block font-semibold text-foreground hover:underline text-sm sm:text-base"
                >
                  {PHONE}
                </a>
              </div>
              <button
                onClick={() => copy(PHONE, "phone")}
                className="ml-auto rounded-lg px-2 py-1 text-xs ring-1 ring-foreground/15 hover:bg-foreground/10 whitespace-nowrap"
                title="Kopyala"
              >
                <div className="flex items-center gap-1">
                  <Copy className="h-3.5 w-3.5" />
                  {copied === "phone" ? "Kopyalandı" : "Kopyala"}
                </div>
              </button>
            </div>
          </div>

          {/* Saatler */}
          <div className="gborder-hover rounded-2xl md:col-span-2">
            <div className="rounded-2xl bg-white/10 dark:bg-black/10 backdrop-blur p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
              <div className="rounded-2xl bg-foreground/10 ring-1 ring-foreground/10 p-2.5 sm:p-3">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm opacity-80">Destek Saatleri</div>
                <div className="font-semibold text-foreground text-sm sm:text-base">
                  {HOURS}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Harita */}
      <SectionCard title="Konum" subtitle="Mekan haritası ve yol tarifi">
        <div className="gborder rounded-2xl overflow-hidden">
          <div className="w-full h-52 sm:h-60 md:h-72 bg-black/10 dark:bg-white/10">
            <iframe
              src={MAP_EMBED}
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              aria-label="Google Maps konum haritası"
            />
          </div>
        </div>
        <div className="mt-2 text-xs sm:text-sm opacity-75">
          Harita açılmıyorsa{" "}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              VENUE.mapQuery
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            Google Maps’de aç
          </a>
          .
        </div>
      </SectionCard>
    </div>
  );
}

// app/panel/sss/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "../_components/page-header";
import SectionCard from "../_components/section-card";
import { Search, ChevronDown, Link as LinkIcon, HelpCircle } from "lucide-react";

type Cat =
  | "kayit"      // Kayıt & Başvuru
  | "takim"      // Takım & Profil
  | "teslim"     // Oyun Teslimi
  | "takvim"     // Takvim & Mekan
  | "teknik"     // Teknik & Kurallar
  | "odul"       // Ödüller & Sponsorlar
  | "diger";     // Diğer

type FAQ = {
  id: string;       // anchor için
  cat: Cat;
  q: string;
  a: string;
};

// ——— MANUEL İÇERİK: PDF’e/kurallara göre düzenleyin
const FAQS: FAQ[] = [
  {
    id: "kimler-katılabilir",
    cat: "kayit",
    q: "Kimler katılabilir? Yaş sınırı var mı?",
    a: "14 yaş ve üzeri herkes katılabilir. 18 yaş altı katılımcılar için veliden onay gerekebilir.",
  },
  {
    id: "bireysel-mi-takim-mi",
    cat: "kayit",
    q: "Bireysel mi, takım olarak mı katılmalıyım?",
    a: "Bireysel katılabilirsiniz; dilerseniz panelden takım oluşturup en fazla 4 kişiye kadar ekip kurabilirsiniz.",
  },
  {
    id: "takim-uyesi-ekleme",
    cat: "takim",
    q: "Takıma üye nasıl eklerim/çıkarırım?",
    a: "Panel ▸ Takım sayfasından üye bilgilerini girip davet gönderebilir, mevcut üyeleri çıkarabilirsiniz. Lider kendini çıkarırsa başvuru bireysele döner.",
  },
  {
    id: "profil-bilgileri",
    cat: "takim",
    q: "Profilimde hangi bilgileri düzenleyebilirim?",
    a: "Ad–Soyad, e-posta, telefon, rol ve şifre bilgilerinizi Profil sayfasından güncelleyebilirsiniz.",
  },
  {
    id: "teslim-format",
    cat: "teslim",
    q: "Oyun teslim formatı ve son tarih nedir?",
    a: "Panel ▸ Oyun Teslimi sayfasından build veya proje arşivi ile açıklama dosyalarını yükleyin. Son tarih etkinlik akışında belirtilir.",
  },
  {
    id: "takvim-mekan",
    cat: "takvim",
    q: "Etkinlik takvimi ve mekân bilgisi nerede?",
    a: "Panel ▸ Takvim bölümünde güncel saatler; “Hakkında” sayfasında mekân ve ulaşım bilgisi yer alır.",
  },
  {
    id: "kurallar-kisitlar",
    cat: "teknik",
    q: "Teknik kurallar ve kısıtlar neler?",
    a: "“Kurallar” sayfasında tema, süre, telif, ekipman ve değerlendirme kriterleri detaylıca listelenmiştir.",
  },
  {
    id: "oduller",
    cat: "odul",
    q: "Ödüller ve sponsor destekleri nelerdir?",
    a: "Ödüller sayfasında ilk 3 derece, her katılımcıya hediyeler ve sponsor katkıları (Huawei, vb.) açıklanır.",
  },
  {
    id: "sertifika",
    cat: "diger",
    q: "Katılım sertifikası verilecek mi?",
    a: "Evet, tüm katılımcılara dijital katılım sertifikası verilecektir.",
  },
  {
    id: "iletisim",
    cat: "diger",
    q: "Sorularım için kime yazabilirim?",
    a: "Panel ▸ Mesajlar bölümünden yeni mesaj oluşturabilir veya duyuruları takip edebilirsiniz.",
  },
];

const CAT_LABEL: Record<Cat, string> = {
  kayit: "Kayıt & Başvuru",
  takim: "Takım & Profil",
  teslim: "Oyun Teslimi",
  takvim: "Takvim & Mekan",
  teknik: "Teknik & Kurallar",
  odul: "Ödüller & Sponsorlar",
  diger: "Diğer",
};

export default function FAQPage() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<Cat | "all">("all");
  const [open, setOpen] = useState<Set<string>>(new Set());

  // URL #hash ile gelen soruyu otomatik aç
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = decodeURIComponent(window.location.hash.replace("#", ""));
    if (!hash) return;
    const exists = FAQS.some((f) => f.id === hash);
    if (exists) {
      setOpen((s) => new Set([...Array.from(s), hash]));
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    return FAQS.filter((f) => {
      const okCat = cat === "all" ? true : f.cat === cat;
      if (!okCat) return false;
      if (!q) return true;
      const hay = (f.q + " " + f.a).toLocaleLowerCase("tr");
      return hay.includes(q);
    });
  }, [query, cat]);

  const toggle = (id: string) =>
    setOpen((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const copyLink = async (id: string) => {
    try {
      const url =
        typeof window !== "undefined"
          ? `${window.location.origin}${window.location.pathname}#${id}`
          : `#${id}`;
      await navigator.clipboard?.writeText(url);
    } catch {
      /* noop */
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sıkça Sorulan Sorular"
        desc="En çok merak edilenler, hızlı yanıtlar ve ipuçları"
        variant="plain"
      />

      {/* Arama + Kategoriler */}
      <SectionCard>
        <div className="flex flex-col gap-4">
          {/* Arama kutusu */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70">
              <Search className="h-4 w-4" />
            </div>
            <input
              className="w-full rounded-xl bg-white/10 dark:bg-black/10 backdrop-blur pl-9 pr-3 py-2 text-sm ring-1 ring-[color:color-mix(in_oklab,var(--foreground)_18%,transparent)] focus:outline-none focus:ring-2"
              placeholder="Ara: kayıt, teslim, ödüller..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Kategori pill’leri (yatay kaydırılabilir) */}
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto py-1">
            <CatPill label="Tümü" active={cat === "all"} onClick={() => setCat("all")} />
            {(["kayit","takim","teslim","takvim","teknik","odul","diger"] as Cat[]).map((c) => (
              <CatPill key={c} label={CAT_LABEL[c]} active={cat === c} onClick={() => setCat(c)} />
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Liste */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-2xl bg-white/10 dark:bg-black/10 backdrop-blur p-6 text-sm flex items-center gap-3">
            <HelpCircle className="h-5 w-5 opacity-80" />
            Aradığınız kriterlere uygun sonuç yok. Kategoriyi değiştirin veya aramayı sadeleştirin.
          </div>
        )}

        {filtered.map((f) => {
          const isOpen = open.has(f.id);
          return (
            <div
              key={f.id}
              id={f.id}
              className={[
                isOpen ? "gborder" : "gborder-hover",
                "rounded-2xl transition-colors",
              ].join(" ")}
            >
              <div className="rounded-2xl bg-white/10 dark:bg-black/10 backdrop-blur">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => toggle(f.id)}
                  className="w-full px-4 py-3 flex items-center gap-3 text-left"
                >
                  <ChevronDown
                    className={[
                      "h-4 w-4 shrink-0 transition-transform duration-200",
                      isOpen ? "rotate-180" : "rotate-0",
                    ].join(" ")}
                  />
                  <span className="font-semibold text-foreground">{f.q}</span>

                  {/* Kopya link */}
                  <span className="ml-auto">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyLink(f.id);
                      }}
                      className="rounded-md px-2 py-1 text-xs ring-1 ring-foreground/15 hover:bg-foreground/10"
                      title="Bağlantıyı kopyala"
                    >
                      <LinkIcon className="h-3.5 w-3.5" />
                    </button>
                  </span>
                </button>

                {/* İçerik */}
                {isOpen && (
                  <div className="px-10 pb-4 -mt-1 text-sm opacity-90">
                    {f.a}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* İpucu / İletişim */}
      <SectionCard>
        <p className="text-xs opacity-75">
          Cevabını bulamadın mı? <strong>Panel ▸ Mesajlar</strong> bölümünden bize yazabilirsin.
        </p>
      </SectionCard>
    </div>
  );
}

/* — Kategori pill — */
/* — Kategori pill (kenarlık tam kaplar + daha büyük) — */
function CatPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "relative isolate shrink-0 rounded-2xl",
        "px-4 py-2 text-sm md:text-base font-semibold transition",
        "backdrop-blur bg-white/10 dark:bg-black/10",
        active ? "gborder" : "gborder-hover hover:opacity-100",
      ].join(" ")}
      title={label}
    >
      <span className="text-foreground whitespace-nowrap">{label}</span>
    </button>
  );
}

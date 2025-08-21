"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "../_components/page-header";
import SectionCard from "../_components/section-card";
import { Search, ChevronDown, Link as LinkIcon, HelpCircle, MessageCircle, CheckCircle, Copy } from "lucide-react";

type Cat =
  | "kayit"
  | "takim"
  | "teslim"
  | "takvim"
  | "teknik"
  | "odul"
  | "diger";

type FAQ = {
  id: string;
  cat: Cat;
  q: string;
  a: string;
};

const FAQS: FAQ[] = [
  {
    id: "kimler-katilabilir",
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
    a: "Panel ▸ Takvim bölümünde güncel saatler; Hakkında sayfasında mekân ve ulaşım bilgisi yer alır.",
  },
  {
    id: "kurallar-kisitlar",
    cat: "teknik",
    q: "Teknik kurallar ve kısıtlar neler?",
    a: "Kurallar sayfasında tema, süre, telif, ekipman ve değerlendirme kriterleri detaylıca listelenmiştir.",
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
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      /* noop */
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="SSS" desc="Sıkça sorulan sorular ve yanıtları" variant="plain" />

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/20 via-pink-500/15 to-blue-500/20 backdrop-blur-xl border border-purple-500/30 p-6">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 animate-pulse"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <HelpCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Sıkça Sorulan Sorular</h2>
              <p className="text-sm text-purple-200/80">Hızlı yanıtlar ve ipuçları</p>
            </div>
          </div>
          
          <p className="text-sm leading-relaxed text-purple-100">
            Şehitkamil Game Jam hakkında en çok merak edilen sorular ve yanıtları. 
            Aradığınız bilgiyi bulamazsanız, mesajlar bölümünden bize ulaşabilirsiniz.
          </p>
        </div>
      </div>

      {/* Arama + Kategoriler */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 backdrop-blur-xl border border-purple-500/20 p-4">
        <div className="space-y-4">
          {/* Arama kutusu */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-300" />
            <input
              className="w-full rounded-xl bg-white/20 backdrop-blur-sm pl-10 pr-4 py-3 text-sm outline-none border border-white/20 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
              placeholder="Ara: kayıt, teslim, ödüller..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Kategori pill'leri */}
          <div className="flex flex-wrap gap-2">
            <CatPill label="Tümü" active={cat === "all"} onClick={() => setCat("all")} />
            {(["kayit","takim","teslim","takvim","teknik","odul","diger"] as Cat[]).map((c) => (
              <CatPill key={c} label={CAT_LABEL[c]} active={cat === c} onClick={() => setCat(c)} />
            ))}
          </div>
        </div>
      </div>

      {/* Sonuç sayısı */}
      <div className="flex items-center justify-between text-xs text-purple-200/80">
        <span>{filtered.length} soru bulundu</span>
        <span>Toplam {FAQS.length} soru</span>
      </div>

      {/* Liste */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mb-3">
              <HelpCircle className="h-6 w-6 text-purple-300" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Sonuç Bulunamadı</h3>
            <p className="text-xs text-purple-200/80">
              Aradığınız kriterlere uygun sonuç yok. Kategoriyi değiştirin veya aramayı sadeleştirin.
            </p>
          </div>
        )}

        {filtered.map((f) => {
          const isOpen = open.has(f.id);
          return (
            <div
              key={f.id}
              id={f.id}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 backdrop-blur-xl border border-purple-500/20 hover:scale-[1.02] transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => toggle(f.id)}
                  className="w-full px-4 py-3 flex items-center gap-3 text-left"
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <ChevronDown
                      className={`h-3 w-3 text-white transition-transform duration-300 ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-left text-sm">{f.q}</h3>
                  </div>

                  {/* Kopya link */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyLink(f.id);
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-200 text-xs font-medium"
                    title="Bağlantıyı kopyala"
                  >
                    {copiedId === f.id ? (
                      <>
                        <CheckCircle className="h-3 w-3 text-green-400" />
                        <span className="hidden sm:inline">Kopyalandı</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span className="hidden sm:inline">Kopyala</span>
                      </>
                    )}
                  </button>
                </button>

                {/* İçerik */}
                {isOpen && (
                  <div className="px-10 pb-4">
                    <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                      <p className="text-xs text-purple-100 leading-relaxed">
                        {f.a}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* İletişim CTA */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/20 via-emerald-500/15 to-teal-500/20 backdrop-blur-xl border border-green-500/30 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <MessageCircle className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-white mb-1">Cevabını Bulamadın mı?</h3>
            <p className="text-xs text-green-200/80">
              Panel ▸ Mesajlar bölümünden bize yazabilirsin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

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
      className={`group relative overflow-hidden rounded-xl px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
        active 
          ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 shadow-lg" 
          : "bg-gradient-to-r from-white/10 to-white/5 border-white/20 hover:from-white/20 hover:to-white/10"
      } backdrop-blur-xl border`}
      title={label}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <span className="relative text-white whitespace-nowrap">{label}</span>
    </button>
  );
}
"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import PageHeader from "../_components/page-header";
import SectionCard from "../_components/section-card";
import { Printer, BookOpen, Shield, Users, FileText, Award, Clock, CheckCircle, ArrowRight, Hash } from "lucide-react";

type RuleSection = { id: string; title: string; items: ReactNode[] };

export default function RulesPage() {
  const updatedAt = useMemo(
    () => new Date().toLocaleDateString("tr-TR", { dateStyle: "long" }),
    []
  );

  const sections = useMemo<RuleSection[]>(
    () => [
      {
        id: "genel",
        title: "Genel Kurallar",
        items: [
          "Etkinlik alanında ve çevrim içi kanallarda saygılı, kapsayıcı ve yapıcı iletişim esastır.",
          "Tema/alt temalar başlangıçta açıklanır; proje bu temayı anlamlı şekilde işlemelidir.",
          "Önceden yazılmış genel amaçlı kütüphaneler serbesttir, fakat oyunun ana içeriği etkinlik sürecinde üretilmelidir.",
          "Organizasyon yönergelerine ve alan kurallarına uyulması zorunludur.",
        ],
      },
      {
        id: "uygunluk",
        title: "Uygunluk ve Katılım",
        items: [
          "Katılımcı yaşı en az 14 olmalıdır; 18 yaş altı için veli/vasî onayı gerekebilir.",
          "Bireysel veya en fazla 4 kişilik takımlar kabul edilir.",
          "Kayıt bilgileriniz (ad-soyad, e-posta, telefon) doğru ve güncel olmalıdır.",
        ],
      },
      {
        id: "takim",
        title: "Takım Kuralları",
        items: [
          "Takım değişiklikleri teslim tarihinden önce panel üzerinden yapılmalıdır.",
          "Bir katılımcı aynı anda yalnızca bir takımda yer alabilir.",
          "Rol paylaşımı serbest; teslim edilecek build tekil ve çalışır olmalıdır.",
        ],
      },
      {
        id: "icerik",
        title: "İçerik ve Telif",
        items: [
          "Üçüncü taraf varlıkların lisanslarına uyun; kaynak belirtin.",
          "Nefret söylemi, yasa dışı veya rahatsız edici içerik yasaktır.",
          "Kullandığınız kod/asset için gerekli haklara sahip olduğunuzu beyan edersiniz.",
        ],
      },
      {
        id: "teslim",
        title: "Oyun Teslimi",
        items: [
          <>
            Teslim, <strong>Panel → Oyun Teslimi</strong> sayfasından yapılır. Zorunlu öğeler:
            <ul className="mt-2 list-disc pl-5">
              <li>Çalışan build (Win/Linux/macOS ya da WebGL) ve/veya oynanabilir link</li>
              <li>Kısa açıklama, ekran görüntüsü ve kontrol şeması</li>
              <li>Gerekiyorsa kurulum adımları</li>
            </ul>
          </>,
          "Son teslim saatinden sonra gelen başvurular değerlendirmeye alınmayabilir.",
          "Build'in açılmaması durumunda sorumluluk takıma aittir.",
        ],
      },
      {
        id: "degerlendirme",
        title: "Değerlendirme Kriterleri",
        items: [
          "Tema Uyumu · 0–10",
          "Oynanış/Özgünlük · 0–10",
          "Teknik Kalite · 0–10",
          "Sanat/Tasarım/Ses · 0–10",
          "Sunum · 0–10",
        ],
      },
      {
        id: "disiplin",
        title: "Disiplin ve Güvenlik",
        items: [
          "Hile, intihal veya uygunsuz davranışlar diskalifiye sebebidir.",
          "Organizatör gerekli gördüğünde kural ihlallerine yaptırım uygulayabilir.",
        ],
      },
      {
        id: "kvkk",
        title: "Gizlilik ve KVKK",
        items: [
          "Kişisel veriler yalnızca etkinlik süreçleri için işlenir.",
          "Ayrıntılar için KVKK aydınlatma metnini inceleyin.",
        ],
      },
    ],
    []
  );

  // Scroll-spy
  const [activeId, setActiveId] = useState<string>(sections[0]?.id || "genel");
  const refs = useRef<Record<string, HTMLElement | null>>({});
  const setSecRef = (id: string) => (el: HTMLElement | null) => { refs.current[id] = el; };

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        let top: { id: string; ratio: number } | null = null;
        for (const e of entries) {
          const id = (e.target as HTMLElement).dataset.secId!;
          if (e.isIntersecting) {
            if (!top || e.intersectionRatio > top.ratio) top = { id, ratio: e.intersectionRatio };
          }
        }
        if (top) setActiveId(top.id);
      },
      {
        threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
        rootMargin: "-40% 0px -40% 0px",
      }
    );
    const nodes = sections.map(s => refs.current[s.id]).filter((n): n is HTMLElement => !!n);
    nodes.forEach(n => io.observe(n));
    return () => io.disconnect();
  }, [sections]);

  const goTo = (id: string) => {
    const el = refs.current[id];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Kurallar"
        desc="Etkinlik boyunca uyulması gereken kurallar ve teslim yönergeleri"
        variant="plain"
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/20 via-pink-500/15 to-blue-500/20 backdrop-blur-xl border border-purple-500/30 p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 animate-pulse"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Etkinlik Kuralları</h2>
              <p className="text-purple-200/80">Adil ve güvenli bir ortam için</p>
            </div>
          </div>
          
          <p className="text-base leading-relaxed text-purple-100 max-w-2xl">
            Şehitkamil Game Jam'in başarılı bir şekilde gerçekleşmesi için tüm katılımcıların 
            uyması gereken kurallar ve yönergeler. Bu kurallar adil, güvenli ve yaratıcı bir 
            ortam sağlamak için hazırlanmıştır.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Sol: içerik */}
        <div className="space-y-6">
          {/* Header Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 backdrop-blur-xl border border-purple-500/20 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-purple-200/80">Son güncelleme</div>
                  <div className="font-semibold text-white">{updatedAt}</div>
                </div>
              </div>
              
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-200"
                title="Yazdır / PDF"
              >
                <Printer className="h-4 w-4" />
                Yazdır / PDF
              </button>
            </div>
          </div>

          {/* Rules Sections */}
          {sections.map((sec, index) => (
            <section
              id={sec.id}
              key={sec.id}
              ref={setSecRef(sec.id)}
              data-sec-id={sec.id}
              className="scroll-mt-24"
            >
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 backdrop-blur-xl border border-purple-500/20 p-6 hover:scale-[1.01] transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  {/* Section Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{sec.title}</h3>
                      <div className="text-sm text-purple-200/80">Kural {index + 1}</div>
                    </div>
                  </div>

                  {/* Rules List */}
                  <div className="space-y-4">
                    {sec.items.map((item, i) => (
                      <div key={i} className="group/item relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 p-4 hover:scale-[1.02] transition-all duration-200">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-xs font-bold">{i + 1}</span>
                          </div>
                          <div className="text-sm leading-relaxed text-purple-100">
                            {item}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ))}

          {/* Footer Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-teal-500/10 backdrop-blur-xl border border-green-500/20 p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div className="text-sm text-green-200/80">
                <p className="mb-2">
                  * Kurallar güncellenirse duyurulacaktır. En güncel sürüm bu sayfada geçerlidir.
                </p>
                <p>
                  Bu kurallar tüm katılımcılar için geçerlidir. Sorularınız için organizasyon ekibi ile iletişime geçebilirsiniz.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sağ: İçindekiler */}
        <aside className="hidden lg:block sticky top-20 self-start">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 backdrop-blur-xl border border-purple-500/20 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">İçindekiler</h3>
                <div className="text-sm text-purple-200/80">{sections.length} bölüm</div>
              </div>
            </div>
            
            <nav className="space-y-2">
              {sections.map((s, index) => {
                const active = activeId === s.id;
                return (
                  <div key={s.id} className={`group relative overflow-hidden rounded-2xl transition-all duration-200 ${
                    active 
                      ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30" 
                      : "bg-gradient-to-r from-white/5 to-white/10 border-white/20 hover:from-white/10 hover:to-white/20"
                  } border backdrop-blur-sm`}>
                    <button
                      onClick={(e) => { e.currentTarget.blur(); goTo(s.id); }}
                      className="block w-full text-left px-4 py-3 text-sm outline-none transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                          active 
                            ? "bg-gradient-to-br from-purple-500 to-pink-600 text-white" 
                            : "bg-white/20 text-purple-200"
                        }`}>
                          {index + 1}
                        </div>
                        <span className={`font-medium ${
                          active ? "text-white" : "text-purple-200 hover:text-white"
                        }`}>
                          {s.title}
                        </span>
                        {active && (
                          <ArrowRight className="h-4 w-4 text-purple-300 ml-auto" />
                        )}
                      </div>
                    </button>
                  </div>
                );
              })}
            </nav>
          </div>
        </aside>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import PageHeader from "../_components/page-header";
import SectionCard from "../_components/section-card";
import { Printer } from "lucide-react";

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
          "Build’in açılmaması durumunda sorumluluk takıma aittir.",
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
    // aktifliği IO güncelleyecek
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kurallar"
        desc="Etkinlik boyunca uyulması gereken kurallar ve teslim yönergeleri"
        variant="plain"
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        {/* Sol: içerik */}
        <div className="space-y-6">
          <SectionCard>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-xl px-3 py-1 text-xs ring-1 ring-foreground/15 bg-foreground/5">
                Son güncelleme: {updatedAt}
              </span>
              <button
                onClick={() => window.print()}
                className="ml-auto inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium bg-foreground/10 hover:bg-foreground/15 transition"
                title="Yazdır / PDF"
              >
                <Printer className="h-4 w-4" />
                Yazdır / PDF
              </button>
            </div>
          </SectionCard>

          {sections.map((sec) => (
            <section
              id={sec.id}
              key={sec.id}
              ref={setSecRef(sec.id)}
              data-sec-id={sec.id}
              className="scroll-mt-24"
            >
              <SectionCard title={sec.title}>
                <ol className="mt-1 space-y-2 list-decimal pl-5">
                  {sec.items.map((it, i) => (
                    <li key={i}>
                      {/* İç renk sabit, sadece kenar renkli (hover’da) */}
                      <div className="gborder-hover rounded-2xl">
                        <div className="rounded-2xl bg-white/10 dark:bg-black/10 backdrop-blur p-3 transition hover:scale-[1.005]">
                          <div className="text-sm leading-relaxed">{it}</div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </SectionCard>
            </section>
          ))}

          <SectionCard>
            <p className="text-xs opacity-75">
              * Kurallar güncellenirse duyurulacaktır. En güncel sürüm bu sayfada geçerlidir.
            </p>
          </SectionCard>
        </div>

        {/* Sağ: İçindekiler (aktif olan kalıcı renkli kenarlık) */}
        <aside className="hidden lg:block sticky top-20 self-start">
          <SectionCard title="İçindekiler">
            <nav className="space-y-2">
              {sections.map((s) => {
                const active = activeId === s.id;
                return (
                  <div key={s.id} className={active ? "gborder rounded-xl" : "gborder-hover-toc rounded-xl"}>
                    <button
                      onClick={(e) => { e.currentTarget.blur(); goTo(s.id); }}
                      className="block w-full text-left rounded-xl px-3 py-2 text-sm outline-none"
                    >
                      {s.title}
                    </button>
                  </div>
                );
              })}
            </nav>
          </SectionCard>
        </aside>
      </div>
    </div>
  );
}

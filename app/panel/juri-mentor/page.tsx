// app/panel/juri-mentor/page.tsx
"use client";

import PageHeader from "../_components/page-header";
import SectionCard from "../_components/section-card";
import { Mail, Linkedin, User2 } from "lucide-react";
import { useMemo } from "react";

type Person = {
  name: string;
  email: string;
  linkedin: string;
  photo?: string;   // /public/people/...
  title?: string;
};

const JURI: Person[] = [
  {
    name: "Ad Soyad",
    email: "ad.soyad@example.com",
    linkedin: "https://www.linkedin.com/in/kullanici",
    photo: "/people/juri-1.jpg",
    title: "Jüri Üyesi",
  },
  {
    name: "Ad Soyad",
    email: "ad.soyad@example.com",
    linkedin: "https://www.linkedin.com/in/kullanici",
    photo: "/people/juri-2.jpg",
    title: "Jüri Üyesi",
  },
  {
    name: "Ad Soyad",
    email: "ad.soyad@example.com",
    linkedin: "https://www.linkedin.com/in/kullanici",
    photo: "/people/juri-3.jpg",
    title: "Jüri Üyesi",
  },
];

const MENTORLER: Person[] = [
  {
    name: "Ad Soyad",
    email: "ad.soyad@example.com",
    linkedin: "https://www.linkedin.com/in/kullanici",
    photo: "/people/mentor-1.jpg",
    title: "Mentör",
  },
  {
    name: "Ad Soyad",
    email: "ad.soyad@example.com",
    linkedin: "https://www.linkedin.com/in/kullanici",
    photo: "/people/mentor-2.jpg",
    title: "Mentör",
  },
  {
    name: "Ad Soyad",
    email: "ad.soyad@example.com",
    linkedin: "https://www.linkedin.com/in/kullanici",
    photo: "/people/mentor-3.jpg",
    title: "Mentör",
  },
  {
    name: "Ad Soyad",
    email: "ad.soyad@example.com",
    linkedin: "https://www.linkedin.com/in/kullanici",
    photo: "/people/mentor-4.jpg",
    title: "Mentör",
  },
];

export default function JuryMentorsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Jüri & Mentörler"
        desc="Etkinliğimizin jüri ve mentör kadrosu"
        variant="plain"
      />

      {/* Jüri */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">Jüri</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {JURI.map((p, i) => (
            <PersonCard key={i} person={p} highlight size="lg" />
          ))}
        </div>
      </section>

      {/* Mentörler */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">Mentörler</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {MENTORLER.map((p, i) => (
            <PersonCard key={i} person={p} size="lg" />
          ))}
        </div>
      </section>

      <SectionCard>
        <p className="text-xs opacity-75">
          * Liste manuel güncellenir. Görsel/iletişim değişikliklerini bu sayfadaki dizilerden düzenleyebilirsiniz.
        </p>
      </SectionCard>
    </div>
  );
}

function PersonCard({
  person,
  highlight = false,
  size = "lg",
}: {
  person: Person;
  highlight?: boolean;
  size?: "md" | "lg";
}) {
  const initials = useMemo(() => {
    const t = person.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join("");
    return t || "•";
  }, [person.name]);

  // Boyutları tek yerden yönetelim
  const avatarSize = size === "lg" ? "h-24 w-24" : "h-16 w-16"; // 96px / 64px
  const nameText = size === "lg" ? "text-base" : "text-sm";
  const titleText = "text-xs";
  const wrapClass = [
    "group", // hover target
    highlight ? "gborder rounded-2xl" : "gborder-hover rounded-2xl",
    // hover’da büyüme + glow
    "transition-transform duration-200 will-change-transform hover:scale-[1.03]",
    "hover:shadow-[0_16px_50px_rgba(124,58,237,.22)]",
  ].join(" ");

  return (
    <div className={wrapClass}>
      <div className="rounded-2xl bg-white/10 dark:bg-black/10 backdrop-blur p-5 h-full">
        <div className="flex items-center gap-5">
          {/* Avatar (resim varsa img, yoksa baş harfler) */}
          <div
            className={[
              "relative shrink-0 overflow-hidden rounded-2xl bg-foreground/10 ring-1 ring-foreground/10",
              avatarSize,
            ].join(" ")}
          >
            {person.photo ? (
              <img
                src={person.photo}
                alt={person.name}
                className="h-full w-full object-cover"
                loading="lazy"
                onError={(e) => {
                  // görsel bozulursa fallback'a düş
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            ) : null}
            {!person.photo && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-semibold">{initials || <User2 className="h-5 w-5" />}</span>
              </div>
            )}
          </div>

          {/* Bilgiler */}
          <div className="min-w-0">
            <div className={`${nameText} font-semibold text-foreground truncate`}>
              {person.name}
            </div>
            {person.title && (
              <div className={`${titleText} opacity-80 truncate`}>{person.title}</div>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
              <a
                href={`mailto:${person.email}`}
                className="inline-flex items-center gap-1 hover:underline"
                title={person.email}
              >
                <Mail className="h-3.5 w-3.5" />
                <span className="truncate">{person.email}</span>
              </a>
              <span className="opacity-30">•</span>
              <a
                href={person.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:underline"
                title="LinkedIn"
              >
                <Linkedin className="h-3.5 w-3.5" />
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

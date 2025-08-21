"use client";

import PageHeader from "../_components/page-header";
import SectionCard from "../_components/section-card";
import { Mail, Linkedin, User2, Award, Users, Star, Trophy, Gavel, Lightbulb, ExternalLink } from "lucide-react";
import { useMemo } from "react";

type Person = {
  name: string;
  email: string;
  linkedin: string;
  photo?: string;
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
    <div className="space-y-8">
      

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/20 via-pink-500/15 to-blue-500/20 backdrop-blur-xl border border-purple-500/30 p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 animate-pulse"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Uzman Kadromuz</h2>
              <p className="text-purple-200/80">Deneyimli jüri ve mentörler</p>
            </div>
          </div>
          
          <p className="text-base leading-relaxed text-purple-100 max-w-2xl">
            Oyun geliştirme alanında uzman jüri üyelerimiz ve deneyimli mentörlerimiz ile 
            projelerinizi değerlendiriyor ve geliştirme sürecinizde size rehberlik ediyoruz.
          </p>
        </div>
      </div>

      {/* Jüri */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
            <Gavel className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Jüri</h2>
            <p className="text-sm text-purple-200/80">Projelerinizi değerlendiren uzmanlar</p>
          </div>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {JURI.map((p, i) => (
            <PersonCard key={i} person={p} highlight size="lg" />
          ))}
        </div>
      </section>

      {/* Mentörler */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
            <Lightbulb className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Mentörler</h2>
            <p className="text-sm text-purple-200/80">Geliştirme sürecinizde rehberlik edenler</p>
          </div>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {MENTORLER.map((p, i) => (
            <PersonCard key={i} person={p} size="lg" />
          ))}
        </div>
      </section>

      {/* İstatistikler */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: Gavel, title: "Jüri Üyesi", count: JURI.length, color: "from-yellow-500 to-orange-500" },
          { icon: Lightbulb, title: "Mentör", count: MENTORLER.length, color: "from-blue-500 to-cyan-500" },
          { icon: Star, title: "Toplam Uzman", count: JURI.length + MENTORLER.length, color: "from-purple-500 to-pink-500" },
        ].map((item, index) => (
          <div key={index} className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 backdrop-blur-xl border border-purple-500/20 p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                <item.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{item.count}</div>
                <div className="text-sm text-purple-200/80">{item.title}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <SectionCard>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Star className="h-4 w-4 text-white" />
          </div>
          <div className="text-sm text-purple-200/80">
            <p className="mb-2">
              * Liste manuel güncellenir. Görsel/iletişim değişikliklerini bu sayfadaki dizilerden düzenleyebilirsiniz.
            </p>
            <p>
              Jüri ve mentörlerimiz oyun geliştirme alanında uzman kişilerden oluşmaktadır. 
              Sorularınız için iletişim bilgilerini kullanabilirsiniz.
            </p>
          </div>
        </div>
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

  const avatarSize = size === "lg" ? "h-20 w-20" : "h-16 w-16";
  const nameText = size === "lg" ? "text-lg" : "text-sm";
  const titleText = "text-sm";

  return (
    <div className={`group relative overflow-hidden rounded-3xl ${
      highlight 
        ? "bg-gradient-to-br from-yellow-500/20 via-orange-500/15 to-red-500/20 border-yellow-500/30" 
        : "bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 border-purple-500/20"
    } backdrop-blur-xl border p-6 hover:scale-105 transition-all duration-300 hover:shadow-xl`}>
      
      {/* Animated background */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
        highlight 
          ? "bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10" 
          : "bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10"
      }`}></div>
      
      <div className="relative z-10">
        <div className="flex flex-col items-center text-center gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className={`${avatarSize} relative overflow-hidden rounded-2xl ${
              highlight 
                ? "bg-gradient-to-br from-yellow-500 to-orange-600 ring-2 ring-yellow-500/50" 
                : "bg-gradient-to-br from-purple-500 to-pink-600 ring-2 ring-purple-500/50"
            } shadow-lg`}>
              {person.photo ? (
                <img
                  src={person.photo}
                  alt={person.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{initials || <User2 className="h-8 w-8" />}</span>
                </div>
              )}
            </div>
            
            {/* Role badge */}
            <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
              highlight 
                ? "bg-gradient-to-br from-yellow-500 to-orange-600" 
                : "bg-gradient-to-br from-blue-500 to-cyan-600"
            }`}>
              {highlight ? (
                <Trophy className="h-4 w-4 text-white" />
              ) : (
                <Lightbulb className="h-4 w-4 text-white" />
              )}
            </div>
          </div>

          {/* Info */}
          <div className="w-full">
            <div className={`${nameText} font-bold text-white mb-1`}>
              {person.name}
            </div>
            {person.title && (
              <div className={`${titleText} text-purple-200/80 mb-3`}>
                {person.title}
              </div>
            )}

            {/* Contact buttons */}
            <div className="flex items-center justify-center gap-2">
              <a
                href={`mailto:${person.email}`}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-200 text-sm font-medium"
                title={person.email}
              >
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">E-posta</span>
              </a>
              
              <a
                href={person.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 border border-blue-500/30 hover:border-blue-500/50 transition-all duration-200 text-sm font-medium"
                title="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
                <span className="hidden sm:inline">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
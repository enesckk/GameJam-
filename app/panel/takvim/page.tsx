"use client";

import { useState } from "react";
import PageHeader from "../_components/page-header";
import SectionCard from "../_components/section-card";
import { Calendar, Clock, Trophy, Coffee, Users, Code, Gamepad2, Sparkles } from "lucide-react";

type Row = { time: string; title: string; note?: string; icon?: string };

const day1: Row[] = [
  { time: "09:00 – 10:00", icon: "🍽️", title: "Kahvaltı & Kayıt", note: "Karşılama, giriş işlemleri, yaka kartı & ekip karşılaması" },
  { time: "10:00 – 10:30", icon: "🗣️", title: "Açılış Konuşmaları", note: "Şehitkamil Belediyesi ve sponsor kurumlar" },
  { time: "10:30 – 10:45", icon: "🎮", title: "Tema Açıklanır", note: "Oyna ve Kazan!" },
  { time: "10:45 – 11:00", icon: "📱", title: "Sosyal Medya Görevi Başlatılır", note: "Paylaşım rehberi ve görev açıklaması yapılır" },
  { time: "11:00 – 13:00", icon: "🧠", title: "Takım içi planlama & fikir geliştirme", note: "Beyin fırtınası ve görev dağılımı" },
  { time: "13:00 – 14:00", icon: "🍽️", title: "Öğle Yemeği" },
  { time: "14:00 – 19:00", icon: "💻", title: "Kodlamaya Başlanır", note: "Geliştirme süreci, mentör desteği aktif" },
  { time: "19:00 – 20:00", icon: "🍽️", title: "Akşam Yemeği" },
  { time: "20:00 – 21:00", icon: "🎯", title: "Kahoot Bilgi Yarışması", note: "Bilgi ve eğlence dolu ödüllü yarışma ��" },
  { time: "21:00 – 23:00", icon: "🌙", title: "Gece Geliştirme Oturumu", note: "Sessiz çalışma ve mentör sohbetleri" },
  { time: "23:00",        icon: "🍩", title: "Tatlı İkramı", note: "Gece atıştırmalığı" },
  { time: "Tüm Gece",     icon: "☕", title: "Kodlamaya Devam & Kahve Standı", note: "Salonlar açık, ekip çalışmaları sürecek" },
];

const day2: Row[] = [
  { time: "09:00 – 10:00", icon: "☕",  title: "Kahvaltı & Güne Başlangıç" },
  { time: "10:00 – 12:00", icon: "💻", title: "Final Geliştirme", note: "Son kontroller, teslim hazırlıkları" },
  { time: "12:00 – 13:00", icon: "🧾", title: "Proje Teslimi", note: "Web sistemi üzerinden teslim alınır" },
  { time: "13:00 – 14:00", icon: "🍽️", title: "Öğle Yemeği" },
  { time: "14:00 – 16:00", icon: "🧑‍⚖️", title: "Jüri Değerlendirme & Sunumlar", note: "Tüm ekipler sırasıyla sunum yapar" },
  { time: "16:00 – 16:30", icon: "📱", title: "Ara & Sosyal Medya Görevi Kapanışı", note: "Son paylaşımlar alınır" },
  { time: "16:30 – 17:00", icon: "🏆", title: "Ödül Töreni", note: "Dereceler, sosyal medya ödülleri, sürpriz çekiliş" },
  { time: "17:00 – 17:30", icon: "📸", title: "Kapanış Konuşmaları", note: "Teşekkürler & hatıra fotoğrafı" },
];

function Timeline({ rows }: { rows: Row[] }) {
  return (
    <div className="relative">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5 rounded-3xl animate-pulse"></div>
      
      {/* Timeline cable */}
      <div className="pointer-events-none absolute left-6 top-0 bottom-0">
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-purple-500/30 via-pink-500/30 to-blue-500/30"></div>
        <div
          className="absolute inset-y-0 -left-[2px] w-[4px] rounded-full opacity-80
                     bg-gradient-to-b from-purple-500 via-pink-500 to-blue-500
                     animate-pulse"
        />
        <div
          className="absolute inset-y-0 -left-[4px] w-[12px] rounded-full blur-md opacity-20
                     bg-gradient-to-b from-purple-500 via-pink-500 to-blue-500"
        />
      </div>

      <ol className="space-y-4 relative z-10">
        {rows.map((r, i) => (
          <li key={i} className="group">
            <div className="grid grid-cols-[48px_1fr] gap-4">
              {/* Timeline dot */}
              <div className="relative h-[60px] flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-md opacity-60 animate-pulse"></div>
                  <div className="relative w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-2 border-white/30 shadow-lg"></div>
                </div>
              </div>

              {/* Event card */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/15 hover:border-purple-500/30 hover:scale-[1.02] transition-all duration-300 group-hover:shadow-xl group-hover:shadow-purple-500/20">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center border border-purple-500/30">
                        <span className="text-2xl">{r.icon}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30">
                          <Clock className="h-3 w-3 text-purple-300" />
                          <span className="text-xs font-medium text-purple-200">{r.time}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-200 transition-colors">
                        {r.title}
                      </h3>
                      
                      {r.note && (
                        <p className="text-sm text-purple-200/80 leading-relaxed">
                          {r.note}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function SchedulePage() {
  const [day, setDay] = useState<1 | 2>(1);

  return (
    <div className="space-y-8">

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/20 via-pink-500/15 to-blue-500/20 backdrop-blur-xl border border-purple-500/30 p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 animate-pulse"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Etkinlik Takvimi</h2>
              <p className="text-purple-200/80">2 günlük yoğun program ve heyecan dolu aktiviteler</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Clock className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">Toplam Süre</div>
                <div className="text-xs text-purple-200/80">32+ Saat</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">Katılımcılar</div>
                <div className="text-xs text-blue-200/80">100+ Kişi</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Trophy className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">Ödüller</div>
                <div className="text-xs text-green-200/80">10+ Kategori</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Day Tabs */}
      <div className="flex items-center justify-center">
        <div className="inline-flex gap-1 rounded-2xl p-1 bg-white/10 backdrop-blur-sm border border-white/20">
          <button
            onClick={() => setDay(1)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
              day === 1 
                ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/25" 
                : "text-purple-200 hover:text-white hover:bg-white/10"
            }`}
          >
            <Gamepad2 className="h-4 w-4" />
            1. Gün (Cumartesi)
          </button>
          <button
            onClick={() => setDay(2)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
              day === 2 
                ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/25" 
                : "text-purple-200 hover:text-white hover:bg-white/10"
            }`}
          >
            <Trophy className="h-4 w-4" />
            2. Gün (Pazar)
          </button>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 backdrop-blur-xl border border-purple-500/20 p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5 animate-pulse"></div>
        <div className="relative z-10">
          {day === 1 ? (
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Gamepad2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">1. Gün – Açılış, Tema ve Geliştirme Başlangıcı</h3>
                  <p className="text-sm text-purple-200/80">Yoğun bir gün: Kayıt, tema açıklanması ve kodlamaya başlangıç</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">2. Gün – Son Dokunuşlar, Jüri Sunumları & Ödüller</h3>
                  <p className="text-sm text-purple-200/80">Final teslim, sunumlar ve ödül töreni ile muhteşem kapanış</p>
                </div>
              </div>
            </div>
          )}
          
          <Timeline rows={day === 1 ? day1 : day2} />
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-purple-400" />
          <span className="text-sm font-medium text-purple-200">Hazır mısınız?</span>
        </div>
        <p className="text-sm text-purple-200/80">
          Bu yoğun programda yerinizi alın ve unutulmaz bir deneyim yaşayın!
        </p>
      </div>
    </div>
  );
}
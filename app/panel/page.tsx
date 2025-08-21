"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import SectionCard from "./_components/section-card";
import { Bell, Upload, Users, Calendar, MessageSquare, FileText, Clock, Gamepad2, Trophy, Sparkles, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { useDisplayName } from "@/lib/use-user";

type Role = "developer" | "designer" | "audio" | "pm";
type Member = {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  role: Role;
  status: "active" | "invited" | "admin_added" | "form_applied";
  isLeader?: boolean;
};
type TeamState = {
  type: "individual" | "team";
  teamName: string;
  inviteCode?: string;
  members: Member[];
};

const quickLinks = [
  { href: "/panel/teslim", label: "Oyun Teslimi", icon: Upload, color: "from-purple-500 to-pink-600", desc: "Projenizi yükleyin" },
  { href: "/panel/duyurular", label: "Duyurular", icon: Bell, color: "from-blue-500 to-cyan-600", desc: "Güncel haberler" },
  { href: "/panel/takim", label: "Takım", icon: Users, color: "from-green-500 to-emerald-600", desc: "Ekip yönetimi" },
  { href: "/panel/mesajlar", label: "Mesajlar", icon: MessageSquare, color: "from-orange-500 to-red-600", desc: "İletişim merkezi" },
  { href: "/panel/kurallar", label: "Kurallar", icon: FileText, color: "from-indigo-500 to-purple-600", desc: "Yarışma kuralları" },
  { href: "/panel/takvim", label: "Takvim", icon: Calendar, color: "from-pink-500 to-rose-600", desc: "Etkinlik programı" },
];

const COUNTDOWN_TARGET_ISO = "2025-09-20T10:00:00+03:00";

async function getJSON<T = any>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error(await res.text().catch(() => `HTTP ${res.status}`));
  return res.json();
}

export default function PanelPage() {
  const { displayName } = useDisplayName();

  const [teamCount, setTeamCount] = useState<number>(0);
  const teamLimit = 4;
  const [unreadMessages, setUnreadMessages] = useState<number>(0);
  const [newAnnouncements, setNewAnnouncements] = useState<number>(0);

  useEffect(() => {
    getJSON<{ total: number }>("/api/messages?box=inbox&unread=1&pageSize=1")
      .then((d) => setUnreadMessages(d?.total ?? 0))
      .catch(() => setUnreadMessages(0));
  }, []);

  useEffect(() => {
    getJSON<TeamState>("/api/team")
      .then((t) => setTeamCount(Array.isArray(t?.members) ? t.members.length : 0))
      .catch(() => setTeamCount(0));
  }, []);

  const daysLeft = useMemo(() => {
    if (!COUNTDOWN_TARGET_ISO) return undefined;
    const now = new Date();
    const d = new Date(COUNTDOWN_TARGET_ISO);
    const ms = d.getTime() - now.getTime();
    if (Number.isNaN(ms)) return undefined;
    return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/20 via-pink-500/15 to-blue-500/20 backdrop-blur-xl border border-purple-500/30 p-4 sm:p-6 lg:p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 animate-pulse"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Gamepad2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">
                Merhaba {displayName ?? "Kullanıcı"}, hoş geldiniz! 👋
              </h1>
              <p className="text-sm sm:text-base text-purple-200/80">
                Profilinizi, takımınızı, duyuruları ve oyun teslimini buradan yönetebilirsiniz.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">Takım Durumu</div>
                <div className="text-xs text-purple-200/80">{teamCount}/{teamLimit} üye</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">Yeni Mesajlar</div>
                <div className="text-xs text-blue-200/80">{unreadMessages} okunmamış</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 sm:col-span-2 lg:col-span-1">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Clock className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">Kalan Süre</div>
                <div className="text-xs text-green-200/80">
                  {typeof daysLeft === "number" ? `${daysLeft} gün` : "—"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Kısayollar */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 backdrop-blur-xl border border-purple-500/20 p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Hızlı Erişim</h2>
            <p className="text-sm text-purple-200/80">Sık kullanılan sayfalar ve özellikler</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {quickLinks.map(({ href, label, icon: Icon, color, desc }) => (
            <Link
              key={href}
              href={href}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 hover:scale-105 transition-all duration-300"
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-white mb-1 group-hover:text-purple-200 transition-colors">
                      {label}
                    </h3>
                    <p className="text-xs sm:text-sm text-purple-200/80 mb-3">
                      {desc}
                    </p>
                    <div className="flex items-center gap-2 text-purple-300 group-hover:text-purple-200 transition-colors">
                      <span className="text-xs sm:text-sm font-medium">Aç</span>
                      <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Durum Özeti */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 backdrop-blur-xl border border-purple-500/20 p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Durum Özeti</h2>
            <p className="text-sm text-purple-200/80">Takım ve bildirim durumunuz</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Takım */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 hover:scale-105 transition-all duration-300">
            <div className="p-3 sm:p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Takım</div>
                  <div className="text-xs text-purple-200/80">Üye sayısı</div>
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white mb-2">
                {teamCount}/{teamLimit}
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(teamCount / teamLimit) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Yeni Mesaj */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-500/30 hover:scale-105 transition-all duration-300">
            <div className="p-3 sm:p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Yeni Mesaj</div>
                  <div className="text-xs text-blue-200/80">Okunmamış</div>
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white mb-2">
                {unreadMessages}
              </div>
              {unreadMessages > 0 && (
                <div className="flex items-center gap-2 text-blue-200 text-xs sm:text-sm">
                  <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Yeni mesajlarınız var</span>
                </div>
              )}
            </div>
          </div>

          {/* Teslime Kalan */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30 hover:scale-105 transition-all duration-300">
            <div className="p-3 sm:p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Teslime Kalan</div>
                  <div className="text-xs text-green-200/80">Gün sayısı</div>
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white mb-2">
                {typeof daysLeft === "number" ? `${daysLeft}` : "—"}
              </div>
              <div className="text-xs sm:text-sm text-green-200">
                {typeof daysLeft === "number" ? "gün kaldı" : "Tarih belirsiz"}
              </div>
            </div>
          </div>

          {/* Genel Durum */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30 hover:scale-105 transition-all duration-300 sm:col-span-2 lg:col-span-1">
            <div className="p-3 sm:p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Genel Durum</div>
                  <div className="text-xs text-orange-200/80">Hazırlık</div>
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white mb-2">
                {teamCount > 0 ? "Hazır" : "Beklemede"}
              </div>
              <div className="text-xs sm:text-sm text-orange-200">
                {teamCount > 0 ? "Takım kuruldu" : "Takım kurulması gerekiyor"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hatırlatma */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-xl border border-yellow-500/30 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white mb-1">Teslim Hatırlatması</h3>
            <p className="text-sm sm:text-base text-yellow-200/90 mb-3">
              Son teslim: <strong>12 Ekim 2025 • 23:59</strong> (örnek). 
              Dosyalarınızı zamanında yüklemeyi unutmayın!
            </p>
            <Link 
              href="/panel/teslim" 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30 border border-yellow-500/30 hover:border-yellow-500/50 transition-all duration-200 text-sm font-medium w-full sm:w-auto justify-center"
            >
              <Upload className="h-4 w-4" />
              Teslim Sayfasına Git
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Motivasyon Mesajı */}
      <div className="text-center p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
          <span className="text-sm font-medium text-purple-200">Başarılar!</span>
        </div>
        <p className="text-xs sm:text-sm text-purple-200/80">
          Harika bir oyun geliştirmek için her şey hazır. Yaratıcılığınızı gösterin ve eğlenin! 🎮✨
        </p>
      </div>
    </div>
  );
}
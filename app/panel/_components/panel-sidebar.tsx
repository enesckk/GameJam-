"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, User, Users, Mail, Bell, FileText, Calendar,
  Gavel, Briefcase, HelpCircle, Info, Trophy, Upload,
  MapPin, Gamepad2
} from "lucide-react";

const links = [
  { href: "/panel", label: "Gösterge", icon: Home, color: "from-blue-500 to-cyan-500" },
  { href: "/panel/profil", label: "Profil", icon: User, color: "from-purple-500 to-pink-500" },
  { href: "/panel/takim", label: "Takım", icon: Users, color: "from-green-500 to-emerald-500" },
  { href: "/panel/mesajlar", label: "Mesajlar", icon: Mail, color: "from-indigo-500 to-purple-500" },
  { href: "/panel/duyurular", label: "Duyurular", icon: Bell, color: "from-orange-500 to-red-500" },
  { href: "/panel/kurallar", label: "Kurallar", icon: FileText, color: "from-slate-500 to-gray-500" },
  { href: "/panel/teslim", label: "Oyun Teslimi", icon: Upload, color: "from-teal-500 to-blue-500" },
  { href: "/panel/oduller", label: "Ödüller", icon: Trophy, color: "from-yellow-500 to-orange-500" },
  { href: "/panel/takvim", label: "Takvim", icon: Calendar, color: "from-pink-500 to-rose-500" },
  { href: "/panel/juri-mentor", label: "Jüri & Mentörler", icon: Gavel, color: "from-violet-500 to-purple-500" },
  { href: "/panel/sponsorlar", label: "Sponsorlar", icon: Briefcase, color: "from-amber-500 to-yellow-500" },
  { href: "/panel/hakkimizda", label: "Hakkımızda", icon: Info, color: "from-cyan-500 to-blue-500" },
  { href: "/panel/sss", label: "SSS", icon: HelpCircle, color: "from-emerald-500 to-teal-500" },
  { href: "/panel/iletisim", label: "İletişim", icon: MapPin, color: "from-rose-500 to-pink-500" },
];

export default function PanelSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav
      className="
        w-full h-full min-h-0
        grid grid-rows-[auto_1fr_auto]   /* header | links | footer */
        bg-gradient-to-b from-slate-50 via-white to-slate-50
        dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
        border-r border-slate-200/60 dark:border-slate-700/60
      "
    >
      {/* Header (row 1) */}
      <div className="px-3 sm:px-4 pt-4 sm:pt-6 pb-3 sm:pb-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-xl" />
          <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-3 sm:p-4 border border-white/20 dark:border-slate-700/50 shadow-lg">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Gamepad2 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm sm:text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent truncate">
                  Katılımcı Paneli
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                  Game Jam Merkezi
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Links (row 2) */}
      <div className="min-h-0 px-2 sm:px-3 py-2">
        <div className="space-y-1 sm:space-y-2">
          {links.map(({ href, label, icon: Icon, color }) => {
            const active = pathname === href || pathname?.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={onNavigate}
                className={[
                  "group relative flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl transition-all duration-300 ease-out",
                  "border border-transparent",
                  active
                    ? `bg-gradient-to-r ${color} bg-opacity-10 border-opacity-50 shadow-lg shadow-opacity-10`
                    : "hover:bg-white/60 dark:hover:bg-slate-700/60 hover:border-slate-200/50 dark:hover:border-slate-600/50 hover:shadow-md",
                  "backdrop-blur-sm",
                ].join(" ")}
              >
                {active && (
                  <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 sm:h-8 bg-gradient-to-b ${color} rounded-r-full`} />
                )}
                <div
                  className={[
                    "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl transition-all duration-300 relative overflow-hidden flex-shrink-0",
                    active
                      ? `bg-gradient-to-br ${color} text-white shadow-lg shadow-opacity-25`
                      : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 group-hover:bg-gradient-to-br group-hover:from-slate-100 group-hover:to-slate-200 dark:group-hover:from-slate-700 dark:group-hover:to-slate-600 group-hover:text-slate-700 dark:group-hover:text-slate-300",
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 relative z-10" />
                  {active && <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />}
                </div>
                <span
                  className={[
                    "text-xs sm:text-sm font-medium transition-all duration-300 relative truncate",
                    active
                      ? "text-slate-900 dark:text-white font-semibold"
                      : "text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100",
                  ].join(" ")}
                >
                  {label}
                  {active && (
                    <div className={`absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r ${color} rounded-full`} />
                  )}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, UserCog, IdCard, Users, Megaphone, Link2, MessageSquare, Inbox,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Gösterge", icon: Home },
  { href: "/admin/profil", label: "Profil", icon: UserCog },
  { href: "/admin/katilimcilar", label: "Katılımcılar", icon: IdCard },
  { href: "/admin/takimlar", label: "Takımlar", icon: Users },
  { href: "/admin/duyurular", label: "Duyurular", icon: Megaphone },
  { href: "/admin/eslestirme", label: "Takım Eşleşmeleri", icon: Link2 },
  { href: "/admin/mesajlar", label: "Mesajlar", icon: MessageSquare },
  { href: "/admin/teslimler", label: "Teslimler", icon: Inbox },
];

export default function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="w-full h-full flex flex-col bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-r border-slate-200/60 dark:border-slate-700/60">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 px-4 pt-6 pb-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-xl"></div>
          <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-4 border border-white/20 dark:border-slate-700/50 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <div className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                  Admin Paneli
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Yönetim Merkezi
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links - Scrollable */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <div className="space-y-2">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname?.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={onNavigate}
                className={[
                  "group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-500 ease-out",
                  "border border-transparent",
                  active 
                    ? "bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-indigo-200/50 dark:border-indigo-700/50 shadow-lg shadow-indigo-500/10" 
                    : "hover:bg-white/60 dark:hover:bg-slate-700/60 hover:border-slate-200/50 dark:hover:border-slate-600/50 hover:shadow-md",
                  "backdrop-blur-sm",
                ].join(" ")}
              >
                {/* Active indicator */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-r-full"></div>
                )}
                
                <div className={[
                  "flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-500 relative overflow-hidden",
                  active 
                    ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25" 
                    : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 group-hover:bg-gradient-to-br group-hover:from-indigo-100 group-hover:to-purple-100 dark:group-hover:from-indigo-900/30 dark:group-hover:to-purple-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                ].join(" ")}>
                  <Icon className="h-5 w-5 relative z-10" />
                  {active && (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                  )}
                </div>
                
                <span className={[
                  "text-sm font-medium transition-all duration-300 relative",
                  active 
                    ? "text-indigo-700 dark:text-indigo-300 font-semibold" 
                    : "text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100"
                ].join(" ")}>
                  {label}
                  {active && (
                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></div>
                  )}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* Footer - Fixed */}
      <div className="flex-shrink-0 px-3 pb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-200/50 via-white/50 to-slate-200/50 dark:from-slate-700/50 dark:via-slate-800/50 dark:to-slate-700/50 rounded-2xl blur-sm"></div>
          <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-4 border border-white/20 dark:border-slate-700/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Admin Panel v1.0
              </div>
              <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Sistem Aktif
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
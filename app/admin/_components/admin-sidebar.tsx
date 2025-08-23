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
    <nav className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto no-scrollbar bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                Admin Paneli
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Yönetim Merkezi
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="px-3 space-y-2">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname?.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={[
                "group relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors duration-200",
                "border border-transparent",
                active 
                  ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700" 
                  : "hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-600",
              ].join(" ")}
            >
              {/* Active indicator */}
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full"></div>
              )}
              
              <div className={[
                "flex items-center justify-center w-10 h-10 rounded-xl transition-colors duration-200",
                active 
                  ? "bg-indigo-500 text-white" 
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
              ].join(" ")}>
                <Icon className="h-5 w-5" />
              </div>
              
              <span className={[
                "text-sm font-medium transition-colors duration-200",
                active 
                  ? "text-indigo-700 dark:text-indigo-300 font-semibold" 
                  : "text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100"
              ].join(" ")}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Bottom Spacer */}
      <div className="flex-1" />
      
      {/* Footer */}
      <div className="px-3 pb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Admin Panel v1.0
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Sistem Aktif
          </div>
        </div>
      </div>
    </nav>
  );
}
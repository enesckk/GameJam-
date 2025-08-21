// app/admin/_components/admin-sidebar.tsx
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
    <nav className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto no-scrollbar">
      <div className="mb-3 px-3 pt-2 text-base md:text-lg font-semibold text-foreground">
        Admin Paneli
      </div>

      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname?.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={[
              "flex items-center gap-3 p-3 rounded-lg no-underline transition-all duration-200",
              "border-2 border-transparent text-foreground hover:bg-foreground/5",
              "backdrop-blur-sm bg-white/10 dark:bg-black/10",
              "multicolor-hover",
              active ? "multicolor-persist bg-foreground/10 font-semibold" : "font-medium",
            ].join(" ")}
          >
            <Icon className="h-4 w-4 opacity-95" />
            <span className="text-sm">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

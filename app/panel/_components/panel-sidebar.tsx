"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, User, Users, Mail, Bell, FileText, Calendar,
  Gavel, Briefcase, HelpCircle, Info, Trophy, Upload,
  MapPin
} from "lucide-react";

const links = [
  { href: "/panel", label: "Gösterge", icon: Home },
  { href: "/panel/profil", label: "Profil", icon: User },
  { href: "/panel/takim", label: "Takım", icon: Users },
  { href: "/panel/mesajlar", label: "Mesajlar", icon: Mail },
  { href: "/panel/duyurular", label: "Duyurular", icon: Bell },
  { href: "/panel/kurallar", label: "Kurallar", icon: FileText },
  { href: "/panel/teslim", label: "Oyun Teslimi", icon: Upload },
  { href: "/panel/oduller", label: "Ödüller", icon: Trophy },
  { href: "/panel/takvim", label: "Takvim", icon: Calendar },
  { href: "/panel/juri-mentor", label: "Jüri & Mentörler", icon: Gavel },
  { href: "/panel/sponsorlar", label: "Sponsorlar", icon: Briefcase },
  { href: "/panel/hakkimizda", label: "Hakkımızda", icon: Info },
  { href: "/panel/sss", label: "SSS", icon: HelpCircle },
  { href: "/panel/iletisim", label: "İletişim", icon: MapPin },
];

export default function PanelSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto no-scrollbar">
      <div className="mb-3 px-3 pt-2 text-base md:text-lg font-semibold text-foreground">
        Katılımcı Paneli
      </div>

      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname?.startsWith(href + "/");

        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={[
              // Temel stiller - tema uyumlu renk + blur efekti
              "flex items-center gap-3 p-3 rounded-lg no-underline transition-all duration-200",
              "border-2 border-transparent text-foreground hover:bg-foreground/5",
              "backdrop-blur-sm bg-white/10 dark:bg-black/10", // blur efekti
              "multicolor-hover", // özel hover efekti
              active ? "multicolor-persist bg-foreground/10 font-semibold" : "font-medium"
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
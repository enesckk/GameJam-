
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Şehitkamil Game Jam — Oyun Geliştirme Maratonu",
  description: "Etkinlik takvimi, başvuru, duyurular ve paneller tek çatı altında.",
  
  // Sadece koyu tema için renk şeması
  other: {
    "color-scheme": "dark",
  },
};

// Mobil viewport + iOS safe area + theme-color
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#0b0b0c", // Sadece koyu tema rengi
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="tr"
      suppressHydrationWarning
      className="dark h-full scroll-smooth perf-lite [--safe-top:env(safe-area-inset-top)] [--safe-right:env(safe-area-inset-right)] [--safe-bottom:env(safe-area-inset-bottom)] [--safe-left:env(safe-area-inset-left)]"
    >
      {/* Skip link: klavye kullanıcıları için */}
      <a
        href="#content"
        className="
          sr-only focus:not-sr-only focus:fixed focus:z-50
          focus:left-4 focus:top-4 focus:rounded-lg focus:bg-black/80 focus:text-white
          focus:px-3 focus:py-2
        "
      >
        İçeriğe atla
      </a>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full min-h-dvh bg-[var(--background)] text-[var(--foreground)] overflow-x-clip [padding:var(--safe-top)_var(--safe-right)_calc(var(--safe-bottom)+16px)_var(--safe-left)]`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
          enableColorScheme
        >
          <Navbar />
          <main id="content" className="min-h-[70dvh]">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

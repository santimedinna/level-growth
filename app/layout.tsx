import type { Metadata } from "next";
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

/* ─── Fuentes ─────────────────────────────── */
const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

/* ─── Metadata base ───────────────────────── */
export const metadata: Metadata = {
  title: {
    default: "Level Growth — Agencia de Funnel y Conversión",
    template: "%s | Level Growth",
  },
  description:
    "Auditamos tu sitio web y tu publicidad. Te mostramos exactamente dónde perdés clientes y lo solucionamos. Especialistas en funnel completo y paid media.",
  keywords: [
    "agencia de marketing",
    "optimización de funnel",
    "conversión",
    "Google Ads",
    "Meta Ads",
    "landing page",
    "growth",
    "Argentina",
  ],
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Level Growth",
    images: [{ url: "/og/default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

/* ─── Layout raíz ─────────────────────────── */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col font-body bg-lg-bg text-lg-text antialiased">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

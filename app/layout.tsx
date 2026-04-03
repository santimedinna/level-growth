import type { Metadata } from "next";
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

/* ─── WhatsApp flotante (solo mobile) ──────── */
const WA_URL = "https://wa.me/5493512613927?text=Hola%20Santiago!%20Vi%20tu%20web%20y%20quiero%20saber%20m%C3%A1s%20sobre%20la%20auditor%C3%ADa%20gratuita.";

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
  icons: {
    icon: "/favicon.svg",
  },
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

        {/* Botón flotante de WhatsApp — solo visible en mobile */}
        <a
          href={WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar por WhatsApp"
          className="block md:hidden fixed bottom-6 right-5 z-50 w-14 h-14 rounded-full shadow-[0_4px_24px_rgba(37,211,102,0.35)] transition-transform duration-200 hover:scale-110 active:scale-95"
          style={{ backgroundColor: "#25D366" }}
        >
          <svg viewBox="0 0 24 24" fill="white" className="w-full h-full p-3.5" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.118 1.528 5.849L.057 23.886a.5.5 0 0 0 .611.611l6.037-1.471A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.696-.528-5.228-1.448l-.374-.224-3.883.946.964-3.882-.236-.385A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
          </svg>
        </a>

        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "w5vxzd5voa");`}
        </Script>
      </body>
    </html>
  );
}

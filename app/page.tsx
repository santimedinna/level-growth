import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";

/* ─── Secciones below-fold: lazy-load
   Cada dynamic() crea un chunk JS separado.
   Con ssr: true (default) el HTML sigue siendo
   generado en servidor — sin impacto en SEO.
   Framer Motion y Recharts quedan fuera del
   bundle crítico y solo se cargan al hacer scroll. ── */

const Pain = dynamic(() =>
  import("@/components/sections/Pain").then(m => ({ default: m.Pain }))
);

const AuditoriaCTA = dynamic(() =>
  import("@/components/sections/AuditoriaCTA").then(m => ({ default: m.AuditoriaCTA }))
);

const Services = dynamic(() =>
  import("@/components/sections/Services").then(m => ({ default: m.Services }))
);

const TrustLogos = dynamic(() =>
  import("@/components/sections/TrustLogos").then(m => ({ default: m.TrustLogos }))
);

const CaseStudy = dynamic(() =>
  import("@/components/sections/CaseStudy").then(m => ({ default: m.CaseStudy }))
);

const Process = dynamic(() =>
  import("@/components/sections/Process").then(m => ({ default: m.Process }))
);

const Pricing = dynamic(() =>
  import("@/components/sections/Pricing").then(m => ({ default: m.Pricing }))
);

const FAQ = dynamic(() =>
  import("@/components/sections/FAQ").then(m => ({ default: m.FAQ }))
);

const CTAFinal = dynamic(() =>
  import("@/components/sections/CTAFinal").then(m => ({ default: m.CTAFinal }))
);

/* ─── Metadata ────────────────────────────── */
export const metadata: Metadata = {
  title: { absolute: "Level Growth — Más conversiones, más clientes, menos fricción" },
};

/* ─── Página ──────────────────────────────── */
export default function Home() {
  return (
    <>
      <Hero />
      <Pain />
      <AuditoriaCTA />
      <Services />
      <TrustLogos />
      <CaseStudy />
      <Process />
      <Pricing />
      <FAQ />
      <CTAFinal />
    </>
  );
}

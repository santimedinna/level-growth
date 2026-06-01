import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";
import { SchemaScript } from "@/components/ui/SchemaScript";
import { buildFAQSchema } from "@/lib/schema";
import { faqs } from "@/lib/data/business";

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

const Showroom = dynamic(() =>
  import("@/components/sections/Showroom").then(m => ({ default: m.Showroom }))
);

const Santiago = dynamic(() =>
  import("@/components/sections/Santiago").then(m => ({ default: m.Santiago }))
);

const Testimonios = dynamic(() =>
  import("@/components/sections/Testimonios").then(m => ({ default: m.Testimonios }))
);

const TrustLogos = dynamic(() =>
  import("@/components/sections/TrustLogos").then(m => ({ default: m.TrustLogos }))
);

const CaseStudy = dynamic(() =>
  import("@/components/sections/CaseStudy").then(m => ({ default: m.CaseStudy }))
);

const MetodoLevelGrowth = dynamic(() =>
  import("@/components/sections/MetodoLevelGrowth").then(m => ({ default: m.MetodoLevelGrowth }))
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
      <SchemaScript schema={buildFAQSchema(faqs)} />
      <Hero />
      <Pain />
      <AuditoriaCTA />
      <Showroom />
      <Testimonios />
      <Santiago />
      <TrustLogos />
      <CaseStudy />
      <MetodoLevelGrowth />
      <Pricing />
      <FAQ />
      <CTAFinal />
    </>
  );
}

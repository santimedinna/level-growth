"use client";

import { motion } from "framer-motion";
import {
  fadeUp,
  stagger,
  BrowserMockup,
  MetricsGrid,
  TestimonialCarousel,
  CaseCTA,
  type TabDef,
  type HotspotDef,
  type MetricDef,
  type TestimonialDef,
} from "@/components/sections/proyectos/CaseShared";

const TABS: TabDef[] = [
  { label: "Hero",     imageSrc: "/images/showroom/La-jungla-showroom.webp" },
  { label: "Catálogo" },
  { label: "Contacto" },
];

const HOTSPOTS: HotspotDef[] = [
  { top: "18%", left: "28%", label: "El H1 comunica el beneficio en 3 palabras. No el nombre del negocio." },
  { top: "55%", left: "32%", label: "Dos CTAs visibles arriba del fold — cotizar y ver catálogo. El cliente elige su camino." },
  { top: "85%", left: "88%", label: "Canal de contacto siempre visible. El cliente no tiene que buscar cómo comunicarse." },
];

const METRICS: MetricDef[] = [
  { label: "PageSpeed Rendimiento",     target: 96,  suffix: ""     },
  { label: "PageSpeed Accesibilidad",   target: 100, suffix: ""     },
  { label: "PageSpeed Recomendaciones", target: 100, suffix: ""     },
  { label: "PageSpeed SEO",             target: 100, suffix: ""     },
  { label: "Auditor Level Growth",      target: 83,  suffix: "/100" },
  { label: "Total Blocking Time",       target: 0,   suffix: "ms"   },
];

const TESTIMONIALS: TestimonialDef[] = [
  {
    quote:  "Antes usábamos un Linktree y la gente nos preguntaba por WhatsApp cosas que deberían estar en la web. Ahora el sitio responde solo.",
    name:   "Lucía M.",
    role:   "cliente desde 2024",
  },
  {
    quote:  "El sitio carga rapidísimo y se ve igual de bien en el celular que en la compu. Eso para nosotros fue clave porque la mayoría nos encuentra desde el teléfono.",
    name:   "Martín R.",
    role:   "cliente desde 2024",
  },
  {
    quote:  "Nunca pensamos que una web podía ser tan diferente al Linktree que teníamos. Ahora cuando la gente nos busca en Google, nos encuentra y entiende qué hacemos al toque.",
    name:   "Diego F.",
    role:   "cliente desde 2025",
  },
];

export function LaJunglaContent() {
  return (
    <article className="max-w-[1200px] mx-auto px-[clamp(1.5rem,5vw,4rem)] py-[clamp(5rem,12vw,10rem)]">

      {/* ── 1. Header ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="mb-16"
      >
        <motion.div variants={fadeUp} className="flex items-center gap-2 mb-6">
          <a
            href="/proyectos"
            className="font-body text-xs text-[#4A6070] hover:text-[#7A8FA6] transition-colors duration-200"
          >
            Proyectos
          </a>
          <span className="text-[#4A6070] text-xs">→</span>
          <span className="font-body text-xs text-[#7A8FA6]">La Jungla Encantada</span>
        </motion.div>

        <motion.p variants={fadeUp}
          className="font-body text-xs text-[#3FC87A] uppercase tracking-[0.12em] mb-3">
          Inflables — Córdoba
        </motion.p>
        <motion.h1 variants={fadeUp}
          className="font-display font-bold text-[clamp(2rem,5vw,3.5rem)] text-white leading-tight mb-4">
          La Jungla Encantada
        </motion.h1>
        <motion.p variants={fadeUp}
          className="font-body text-[1.05rem] text-[#7A8FA6] leading-[1.7] max-w-[560px]">
          Alquiler de juegos e inflables en Córdoba. Solo tenían un Linktree con PageSpeed 68 y sin posibilidad de conversión.
        </motion.p>
      </motion.div>

      {/* ── 2. El punto de partida ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="mb-20"
      >
        <motion.h2 variants={fadeUp}
          className="font-display font-bold text-xl text-white mb-8">
          El punto de partida
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Imagen del Linktree viejo */}
          <motion.div variants={fadeUp} className="rounded-xl overflow-hidden border border-white/[0.08]">
            <img
              src="/images/showroom/pagina vieja la jungla encantada.webp"
              alt="Sitio anterior La Jungla Encantada"
              className="w-full h-auto"
              loading="lazy"
            />
          </motion.div>

          {/* Items */}
          <motion.div variants={fadeUp} className="flex flex-col gap-3">
            {[
              { label: "PageSpeed Rendimiento", value: "68/100",         color: "#EF4444" },
              { label: "Auditor Level Growth",  value: "53/100",         color: "#F59E0B" },
              { label: "Escenario detectado",   value: "Doble Fricción", color: "#F59E0B" },
              { label: "Dominio propio",         value: "Sin dominio",    color: "#EF4444" },
              { label: "SEO indexable",          value: "No indexado",    color: "#EF4444" },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="flex items-center justify-between px-4 py-3 rounded-lg border border-white/[0.06]"
                style={{ background: "#0D1221" }}
              >
                <span className="font-body text-sm text-[#7A8FA6]">{label}</span>
                <span className="font-mono text-sm font-medium" style={{ color }}>{value}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ── 3. Lo que construimos ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="mb-20"
      >
        <motion.h2 variants={fadeUp}
          className="font-display font-bold text-xl text-white mb-2">
          Lo que construimos
        </motion.h2>
        <motion.p variants={fadeUp}
          className="font-body text-sm text-[#4A6070] mb-8">
          Pasá el mouse sobre cada punto para ver por qué está ahí
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 items-start">
          <motion.div variants={fadeUp}>
            <BrowserMockup
              url="la-jungla-encantada.vercel.app"
              tabs={TABS}
              hotspots={HOTSPOTS}
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <MetricsGrid metrics={METRICS} siteUrl="https://la-jungla-encantada.vercel.app/" />
          </motion.div>
        </div>
      </motion.div>

      {/* ── 4. Testimonios ── */}
      <TestimonialCarousel
        testimonials={TESTIMONIALS}
        title="Lo que dijo el cliente"
        subtitle="La Jungla Encantada — Córdoba"
      />

      {/* ── 5. CTA ── */}
      <CaseCTA />

    </article>
  );
}

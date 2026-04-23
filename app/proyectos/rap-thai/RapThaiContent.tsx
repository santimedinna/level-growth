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
  { label: "Hero",        imageSrc: "/images/showroom/rap-thai-showroom.webp" },
  { label: "Beneficios",  imageSrc: "/images/showroom/rap-thai-beneficios.webp" },
  { label: "Testimonios", imageSrc: "/images/showroom/rap-thai-testimonios.webp" },
];

const HOTSPOTS: HotspotDef[] = [
  { top: "14%", left: "48%", label: "Escasez real comunicada arriba del fold. \"Solo 8 lugares por turno\" genera urgencia sin mentir." },
  { top: "32%", left: "22%", label: "Tipografía de impacto. El visitante lee el beneficio antes de ver cualquier otra cosa." },
  { top: "60%", left: "38%", label: "Un solo CTA dominante arriba del fold. Sin opciones que compitan." },
];

const METRICS: MetricDef[] = [
  { label: "PageSpeed Rendimiento",     target: 93,  suffix: ""     },
  { label: "PageSpeed Accesibilidad",   target: 100, suffix: ""     },
  { label: "PageSpeed Recomendaciones", target: 100, suffix: ""     },
  { label: "PageSpeed SEO",             target: 100, suffix: ""     },
  { label: "Auditor Level Growth",      target: 88,  suffix: "/100" },
  { label: "Total Blocking Time",       target: 0,   suffix: "ms"   },
];

const TESTIMONIALS: TestimonialDef[] = [
  { imageSrc: "/images/showroom/testimonio-rap-thai-1.webp" },
  { imageSrc: "/images/showroom/testimonio-rap-thai-2.webp" },
  { imageSrc: "/images/showroom/testimonio-rap-thai-3.webp" },
];

export function RapThaiContent() {
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
          <span className="font-body text-xs text-[#7A8FA6]">Rap Thai</span>
        </motion.div>

        <motion.p variants={fadeUp}
          className="font-body text-xs text-[#3FC87A] uppercase tracking-[0.12em] mb-3">
          Muay Thai — Córdoba
        </motion.p>
        <motion.h1 variants={fadeUp}
          className="font-display font-bold text-[clamp(2rem,5vw,3.5rem)] text-white leading-tight mb-4">
          Rap Thai
        </motion.h1>
        <motion.p variants={fadeUp}
          className="font-body text-[1.05rem] text-[#7A8FA6] leading-[1.7] max-w-[560px]">
          Gimnasio de Muay Thai en Córdoba. Sin web, sin presencia digital — solo Instagram y boca en boca.
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
          {/* Card sin web */}
          <motion.div
            variants={fadeUp}
            className="rounded-xl border border-white/[0.08] flex items-center justify-center"
            style={{ background: "#0D1221", minHeight: 200 }}
          >
            <div className="text-center px-8 py-10">
              <div className="mb-4 flex justify-center">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="15" stroke="#4A6070" strokeWidth="1.5"/>
                  <ellipse cx="20" cy="20" rx="7" ry="15" stroke="#4A6070" strokeWidth="1.5"/>
                  <line x1="5" y1="20" x2="35" y2="20" stroke="#4A6070" strokeWidth="1.5"/>
                  <line x1="8" y1="12" x2="32" y2="12" stroke="#4A6070" strokeWidth="1.5"/>
                  <line x1="8" y1="28" x2="32" y2="28" stroke="#4A6070" strokeWidth="1.5"/>
                  <line x1="6" y1="6" x2="34" y2="34" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <p className="font-mono text-[#4A6070] text-xs tracking-widest uppercase mb-2">
                Sin presencia web
              </p>
              <p className="font-body text-sm text-[#4A6070] leading-relaxed max-w-[240px] mx-auto">
                Solo Instagram y recomendaciones. Sin forma de que un alumno potencial encontrara información o reservara solo.
              </p>
            </div>
          </motion.div>

          {/* Items en rojo */}
          <motion.div variants={fadeUp} className="flex flex-col gap-3">
            {[
              { label: "Presencia web",          value: "Inexistente",      color: "#EF4444" },
              { label: "SEO indexable",           value: "No indexado",      color: "#EF4444" },
              { label: "CTA de conversión",       value: "Sin CTA",          color: "#EF4444" },
              { label: "Información de horarios", value: "Solo por mensaje", color: "#F59E0B" },
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
              url="rap-thai.vercel.app"
              tabs={TABS}
              hotspots={HOTSPOTS}
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <MetricsGrid metrics={METRICS} siteUrl="https://rap-thai.vercel.app/" />
          </motion.div>
        </div>
      </motion.div>

      {/* ── 4. Testimonios ── */}
      <TestimonialCarousel
        testimonials={TESTIMONIALS}
        title="Lo que dijo Nicolás"
        subtitle="Nicolás Gutiérrez — Fundador, Rap Thai"
      />

      {/* ── 5. CTA ── */}
      <CaseCTA />

    </article>
  );
}

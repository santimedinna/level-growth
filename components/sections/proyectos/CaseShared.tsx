"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

/* ─── Constantes ─────────────────────────────── */
export const WA_URL =
  "https://wa.me/5493512613927?text=Hola%20Santiago!%20Vi%20la%20web%20y%20quiero%20saber%20m%C3%A1s%20sobre%20c%C3%B3mo%20trabajas.";

/* ─── Variantes Framer Motion ────────────────── */
export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
};
export const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ─── CountUp ────────────────────────────────── */
export function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [value, setValue] = useState(0);
  const ref               = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        const duration = 1200;
        const start    = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          setValue(Math.round((1 - Math.pow(1 - p, 3)) * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={ref}>{value}{suffix}</span>;
}

/* ─── Hotspot ────────────────────────────────── */
export interface HotspotDef {
  top: string;
  left: string;
  label: string;
}

interface HotspotPointProps extends HotspotDef {
  index: number;
  active: number | null;
  onToggle: (i: number | null) => void;
}

function HotspotPoint({ top, left, label, index, active, onToggle }: HotspotPointProps) {
  const isOpen = active === index;
  return (
    <div className="absolute z-10" style={{ top, left }}>
      <button
        className="relative flex items-center justify-center"
        onClick={() => onToggle(isOpen ? null : index)}
        aria-label={label}
      >
        <span
          className="absolute rounded-full animate-ping opacity-40"
          style={{ width: 14, height: 14, background: "#3FC87A" }}
        />
        <span
          className="relative rounded-full border-2 border-white"
          style={{ width: 10, height: 10, background: "#3FC87A" }}
        />
      </button>
      {isOpen && (
        <div
          className="absolute left-5 top-0 z-20 hidden md:block"
          style={{
            background: "#0D1221",
            border: "1px solid rgba(63,200,122,0.25)",
            borderRadius: 8,
            padding: "10px 14px",
            maxWidth: 220,
          }}
        >
          <p className="font-body text-white leading-relaxed" style={{ fontSize: 13 }}>
            {label}
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── Browser Mockup con tabs ────────────────── */
export interface TabDef {
  label: string;
  imageSrc?: string;
}

export function BrowserMockup({
  url,
  tabs,
  hotspots,
}: {
  url: string;
  tabs: TabDef[];
  hotspots: HotspotDef[];
}) {
  const [activeTab,     setActiveTab]     = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

  const currentImage = tabs[activeTab]?.imageSrc;

  return (
    <div>
      {/* Ventana del browser */}
      <div
        className="rounded-xl overflow-hidden border border-white/[0.08]"
        style={{ background: "#080C14" }}
      >
        {/* Barra del browser */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.06]">
          <span className="w-3 h-3 rounded-full" style={{ background: "#EF4444" }} />
          <span className="w-3 h-3 rounded-full" style={{ background: "#F59E0B" }} />
          <span className="w-3 h-3 rounded-full" style={{ background: "#3FC87A" }} />
          <span className="font-mono text-[0.6rem] text-[#4A6070] ml-2">{url}</span>
        </div>
        {/* Contenido / imagen */}
        <div className="relative">
          {currentImage ? (
            <img src={currentImage} alt="" className="w-full h-auto" loading="lazy" />
          ) : (
            <div
              className="w-full flex items-center justify-center"
              style={{ background: "#0D1221", aspectRatio: "16/9" }}
            >
              <span className="font-mono text-xs text-[#4A6070] tracking-widest uppercase">
                Captura próximamente
              </span>
            </div>
          )}
          {/* Hotspots solo en el primer tab */}
          {activeTab === 0 &&
            hotspots.map((h, i) => (
              <HotspotPoint
                key={i}
                {...h}
                index={i}
                active={activeHotspot}
                onToggle={setActiveHotspot}
              />
            ))}
        </div>
      </div>

      {/* Tooltip mobile */}
      {activeTab === 0 && activeHotspot !== null && (
        <div
          className="mt-3 px-4 py-3 rounded-lg border md:hidden"
          style={{ background: "#0D1221", borderColor: "rgba(63,200,122,0.25)" }}
        >
          <p className="font-body text-sm text-white leading-relaxed">
            {hotspots[activeHotspot].label}
          </p>
        </div>
      )}

      {/* Pills de navegación */}
      <div className="flex gap-2 mt-4">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => { setActiveTab(i); setActiveHotspot(null); }}
            className={[
              "px-3 py-1 rounded-full text-xs font-body font-medium transition-all duration-200",
              i === activeTab
                ? "bg-[#3FC87A]/10 border border-[#3FC87A]/50 text-[#3FC87A]"
                : "border border-white/[0.08] text-[#7A8FA6] hover:border-white/20 hover:text-white",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Métricas ───────────────────────────────── */
export interface MetricDef {
  label: string;
  target: number;
  suffix?: string;
}

export function MetricsGrid({ metrics, siteUrl }: { metrics: MetricDef[]; siteUrl: string }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        {metrics.map(({ label, target, suffix = "" }) => (
          <div
            key={label}
            className="rounded-xl border border-white/[0.08] p-4 text-center"
            style={{ background: "#0D1221" }}
          >
            <p className="font-mono font-medium text-2xl leading-none mb-1.5" style={{ color: "#3FC87A" }}>
              <CountUp target={target} suffix={suffix} />
            </p>
            <p className="font-body text-xs text-[#4A6070] leading-snug">{label}</p>
          </div>
        ))}
      </div>
      <a
        href={siteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-[#3FC87A] border border-[#3FC87A]/30 px-5 py-2.5 rounded-lg hover:border-[#3FC87A]/70 hover:bg-[#3FC87A]/5 transition-all duration-200"
      >
        Ver sitio →
      </a>
    </div>
  );
}

/* ─── Carrusel de testimonios ────────────────── */
export interface TestimonialDef {
  quote?: string;
  name?: string;
  role?: string;
  imageSrc?: string;
  placeholder?: boolean;
}

export function TestimonialCarousel({
  testimonials,
  title,
  subtitle,
}: {
  testimonials: TestimonialDef[];
  title: string;
  subtitle: string;
}) {
  const [current,    setCurrent]    = useState(0);
  const touchStartX                 = useRef(0);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) delta > 0 ? next() : prev();
  };

  const t = testimonials[current];

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="mb-20"
    >
      <motion.h2 variants={fadeUp} className="font-display font-bold text-xl text-white mb-1">
        {title}
      </motion.h2>
      <motion.p variants={fadeUp} className="font-body text-sm text-[#4A6070] mb-8">
        {subtitle}
      </motion.p>

      <motion.div variants={fadeUp}>
        {/* Área deslizable */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{ touchAction: "pan-y" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={t.imageSrc ? "rounded-xl overflow-hidden border border-white/[0.08]" : "rounded-xl border p-8"}
              style={t.imageSrc ? {} : { background: "#0D1221", borderColor: "rgba(63,200,122,0.15)" }}
            >
              {t.imageSrc ? (
                <div className="overflow-hidden max-w-[400px] mx-auto" style={{ background: "#0D1221" }}>
                  <img
                    src={t.imageSrc}
                    alt={t.name ?? "Testimonio"}
                    className="max-h-[300px] w-auto object-contain rounded-xl"
                    loading="lazy"
                  />
                </div>
              ) : t.placeholder ? (
                <div className="text-center py-8">
                  <p className="font-body text-sm text-[#4A6070]">Testimonio del cliente próximamente</p>
                </div>
              ) : (
                <>
                  <div
                    className="text-[#3FC87A] mb-4 leading-none select-none"
                    style={{ fontSize: 48, fontFamily: "Georgia, serif" }}
                  >
                    &ldquo;
                  </div>
                  <p className="font-body text-[1.0625rem] text-[#7A8FA6] leading-[1.75] mb-6">
                    {t.quote}
                  </p>
                  <div>
                    <p className="font-body text-sm font-medium text-white">{t.name}</p>
                    <p className="font-body text-xs text-[#4A6070]">{t.role}</p>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controles */}
        <div className="flex items-center justify-between mt-5">
          {/* Dots */}
          <div className="flex gap-2 items-center">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Ir al testimonio ${i + 1}`}
                className="rounded-full transition-all duration-200"
                style={{
                  width:      i === current ? 16 : 8,
                  height:     8,
                  background: i === current ? "#3FC87A" : "rgba(255,255,255,0.2)",
                }}
              />
            ))}
          </div>
          {/* Flechas */}
          <div className="flex gap-2">
            <button
              onClick={prev}
              aria-label="Anterior"
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/[0.08] hover:border-white/20 text-[#7A8FA6] hover:text-white transition-all duration-200"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 11L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Siguiente"
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/[0.08] hover:border-white/20 text-[#7A8FA6] hover:text-white transition-all duration-200"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── CTA final ──────────────────────────────── */
export function CaseCTA() {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="border-t border-white/[0.06] pt-16 text-center"
    >
      <motion.h2
        variants={fadeUp}
        className="font-display font-bold text-[clamp(1.4rem,3vw,2rem)] text-white mb-4"
      >
        ¿Querés un sitio así?
      </motion.h2>
      <motion.p
        variants={fadeUp}
        className="font-body text-[1rem] text-[#7A8FA6] leading-[1.7] max-w-[480px] mx-auto mb-8"
      >
        Empezá con una auditoría gratuita.
      </motion.p>
      <motion.div
        variants={fadeUp}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <a
          href="/auditoria-web-gratis"
          className="inline-flex items-center justify-center gap-2 font-body font-medium text-base text-white px-8 py-4 rounded-lg transition-all duration-200 hover:brightness-110"
          style={{
            background:  "linear-gradient(135deg, #3FC87A, #2BA86A)",
            boxShadow:   "0 0 24px rgba(63,200,122,0.3)",
          }}
        >
          Auditá tu web gratis →
        </a>
        <a
          href={WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-body text-sm text-[#7A8FA6] hover:text-white transition-colors duration-200"
        >
          O hablá directamente →
        </a>
      </motion.div>
    </motion.div>
  );
}

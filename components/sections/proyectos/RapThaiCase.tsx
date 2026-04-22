"use client";

import { useState, useEffect, useRef } from "react";
import { motion, type Variants } from "framer-motion";

/* ─── Constantes ──────────────────────────── */
const WA_URL =
  "https://wa.me/5493512613927?text=Hola%20Santiago!%20Vi%20la%20web%20y%20quiero%20saber%20m%C3%A1s%20sobre%20c%C3%B3mo%20trabajas.";

/* ─── Animaciones ─────────────────────────── */
const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
};
const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ─── CountUp con IntersectionObserver ───── */
function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [value, setValue] = useState(0);
  const ref               = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
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
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={ref}>{value}{suffix}</span>;
}

/* ─── Hotspot ────────────────────────────── */
interface HotspotProps {
  top: string; left: string;
  label: string;
  index: number;
  active: number | null;
  onToggle: (i: number | null) => void;
}

function Hotspot({ top, left, label, index, active, onToggle }: HotspotProps) {
  const isOpen = active === index;
  return (
    <div className="absolute z-10" style={{ top, left }}>
      <button
        className="relative flex items-center justify-center"
        onClick={() => onToggle(isOpen ? null : index)}
        aria-label={label}
      >
        <span className="absolute w-6 h-6 rounded-full animate-ping opacity-40"
          style={{ background: "#3FC87A" }} />
        <span className="relative w-3 h-3 rounded-full border-2 border-white"
          style={{ background: "#3FC87A" }} />
      </button>
      {isOpen && (
        <div className="absolute left-5 top-0 z-20 w-[200px] rounded-lg border px-4 py-3 text-left"
          style={{ background: "#0D1221", borderColor: "rgba(63,200,122,0.25)" }}>
          <p className="font-body text-xs text-white leading-relaxed">{label}</p>
        </div>
      )}
    </div>
  );
}

/* ─── Componente principal ────────────────── */
export function RapThaiCase() {
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

  const hotspots = [
    { top: "12%", left: "50%", label: "Video hero de fondo. El visitante entiende qué es el gimnasio antes de leer una sola línea." },
    { top: "45%", left: "20%", label: "Cupos limitados visibles desde el primer scroll. La escasez real genera decisión." },
    { top: "70%", left: "60%", label: "Un solo CTA, claro y repetido. El visitante no tiene que pensar." },
  ];

  return (
    <section className="py-20">

      {/* ── Encabezado ── */}
      <motion.div variants={stagger} initial="hidden" whileInView="visible"
        viewport={{ once: true, margin: "-60px" }} className="mb-16">
        <motion.p variants={fadeUp}
          className="font-body text-xs text-[#3FC87A] uppercase tracking-[0.12em] mb-3">
          Muay Thai — Córdoba
        </motion.p>
        <motion.h2 variants={fadeUp}
          className="font-display font-bold text-[clamp(1.8rem,4vw,2.8rem)] text-white leading-tight mb-4">
          Rap Thai
        </motion.h2>
        <motion.p variants={fadeUp}
          className="font-body text-[1.05rem] text-[#7A8FA6] leading-[1.7] max-w-[560px]">
          Gimnasio de Muay Thai en Córdoba. Sin web, sin reservas online, solo redes sociales y boca en boca.
        </motion.p>
      </motion.div>

      {/* ── Sección 2: El antes ── */}
      <motion.div variants={stagger} initial="hidden" whileInView="visible"
        viewport={{ once: true, margin: "-60px" }} className="mb-20">
        <motion.h3 variants={fadeUp}
          className="font-display font-bold text-xl text-white mb-8">
          El punto de partida
        </motion.h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Placeholder sin web anterior */}
          <motion.div variants={fadeUp}
            className="rounded-xl overflow-hidden border border-white/[0.08] flex items-center justify-center"
            style={{ background: "#0D1221", minHeight: "220px" }}>
            <div className="text-center px-8 py-12">
              <p className="font-mono text-[#4A6070] text-xs tracking-widest uppercase mb-3">Sin presencia web</p>
              <p className="font-body text-sm text-[#4A6070] leading-relaxed max-w-[280px]">
                El negocio existía solo en Instagram y por recomendaciones. No había forma de que un potencial alumno encontrara información o reservara por su cuenta.
              </p>
            </div>
          </motion.div>
          {/* Métricas en rojo */}
          <motion.div variants={fadeUp} className="flex flex-col gap-3">
            {[
              { label: "Presencia web",          value: "Inexistente",     color: "#EF4444" },
              { label: "Dominio propio",          value: "Sin dominio",     color: "#EF4444" },
              { label: "SEO indexable",           value: "No indexado",     color: "#EF4444" },
              { label: "Sistema de reservas",     value: "Sin reservas",    color: "#EF4444" },
              { label: "CTA de conversión",       value: "Sin CTA",         color: "#EF4444" },
              { label: "Información de horarios", value: "Solo por mensaje",color: "#F59E0B" },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between px-4 py-3 rounded-lg border border-white/[0.06]"
                style={{ background: "#0D1221" }}>
                <span className="font-body text-sm text-[#7A8FA6]">{label}</span>
                <span className="font-mono text-sm font-medium" style={{ color }}>{value}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ── Sección 3: Hero con anotaciones ── */}
      <motion.div variants={stagger} initial="hidden" whileInView="visible"
        viewport={{ once: true, margin: "-60px" }} className="mb-20">
        <motion.h3 variants={fadeUp}
          className="font-display font-bold text-xl text-white mb-2">
          Lo que construimos
        </motion.h3>
        <motion.p variants={fadeUp}
          className="font-body text-sm text-[#4A6070] mb-8">
          Pasá el mouse sobre cada punto para ver por qué está ahí
        </motion.p>

        {/* Mockup browser */}
        <motion.div variants={fadeUp}
          className="rounded-xl overflow-hidden border border-white/[0.08]"
          style={{ background: "#080C14" }}>
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.06]">
            <span className="w-3 h-3 rounded-full" style={{ background: "#EF4444" }} />
            <span className="w-3 h-3 rounded-full" style={{ background: "#F59E0B" }} />
            <span className="w-3 h-3 rounded-full" style={{ background: "#3FC87A" }} />
            <span className="font-mono text-[0.6rem] text-[#4A6070] ml-2">
              rap-thai.vercel.app
            </span>
          </div>
          <div className="relative">
            <img
              src="/images/showroom/rap-thai-showroom.webp"
              alt="Rap Thai — sitio nuevo"
              className="w-full h-auto"
              loading="lazy"
            />
            {hotspots.map((h, i) => (
              <Hotspot key={i} {...h} index={i}
                active={activeHotspot} onToggle={setActiveHotspot} />
            ))}
          </div>
        </motion.div>

        {activeHotspot !== null && (
          <div className="mt-4 px-4 py-3 rounded-lg border md:hidden"
            style={{ background: "#0D1221", borderColor: "rgba(63,200,122,0.25)" }}>
            <p className="font-body text-sm text-white leading-relaxed">
              {hotspots[activeHotspot].label}
            </p>
          </div>
        )}
      </motion.div>

      {/* ── Sección 4: Testimonios ── */}
      <motion.div variants={stagger} initial="hidden" whileInView="visible"
        viewport={{ once: true, margin: "-60px" }} className="mb-20">
        <motion.h3 variants={fadeUp}
          className="font-display font-bold text-xl text-white mb-8">
          Lo que dicen los alumnos
        </motion.h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { quote: "Nunca había entrenado artes marciales. Entré con cero experiencia y en el primer mes ya sentía que aprendía algo real. El ambiente te hace querer volver.", author: "Santiago G.", since: "alumno desde 2024" },
            { quote: "Buscaba algo más que el gimnasio. Acá encontré técnica, gente comprometida y un profesor que te corrige sin hacerte sentir mal. La web me convenció antes de pisar el lugar.", author: "Samuel R.", since: "alumno desde 2024" },
            { quote: "Lo que más me sorprendió fue que no te obligan a competir. Podés entrenar a tu ritmo. El sitio lo aclara bien y por eso me animé a ir.", author: "Damián F.", since: "alumno desde 2025" },
            { quote: "Llegué por Google, encontré el sitio, vi los horarios y reservé el mismo día. Antes de que tuvieran web, ni sabía que existían.", author: "Sofía M.", since: "alumna desde 2025" },
          ].map(({ quote, author, since }) => (
            <motion.div key={author} variants={fadeUp}
              className="rounded-xl border border-white/[0.08] p-6 flex flex-col gap-4"
              style={{ background: "#0D1221" }}>
              <p className="font-body text-sm text-[#7A8FA6] leading-[1.7] flex-1">
                &ldquo;{quote}&rdquo;
              </p>
              <div>
                <p className="font-body text-sm font-medium text-white">{author}</p>
                <p className="font-body text-xs text-[#4A6070]">{since}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Sección 5: Métricas finales ── */}
      <motion.div variants={stagger} initial="hidden" whileInView="visible"
        viewport={{ once: true, margin: "-60px" }} className="mb-20">
        <motion.h3 variants={fadeUp}
          className="font-display font-bold text-xl text-white mb-8">
          Los resultados
        </motion.h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: "PageSpeed Rendimiento",   target: 94,  suffix: "",    color: "#3FC87A" },
            { label: "PageSpeed Accesibilidad", target: 100, suffix: "",    color: "#3FC87A" },
            { label: "PageSpeed SEO",            target: 100, suffix: "",    color: "#3FC87A" },
            { label: "Auditor Level Growth",     target: 79,  suffix: "/100",color: "#3FC87A" },
            { label: "Imágenes con alt text",    target: 100, suffix: "%",   color: "#3FC87A" },
            { label: "Total Blocking Time",      target: 0,   suffix: "ms",  color: "#3FC87A" },
          ].map(({ label, target, suffix, color }) => (
            <motion.div key={label} variants={fadeUp}
              className="rounded-xl border border-white/[0.08] p-5 text-center"
              style={{ background: "#0D1221" }}>
              <p className="font-mono font-medium text-3xl leading-none mb-2" style={{ color }}>
                <CountUp target={target} suffix={suffix} />
              </p>
              <p className="font-body text-xs text-[#4A6070] leading-snug">{label}</p>
            </motion.div>
          ))}
        </div>
        <motion.div variants={fadeUp}>
          <a href="https://rap-thai.vercel.app/" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-[#3FC87A] border border-[#3FC87A]/30 px-5 py-2.5 rounded-lg hover:border-[#3FC87A]/70 hover:bg-[#3FC87A]/5 transition-all duration-200">
            Ver sitio →
          </a>
        </motion.div>
      </motion.div>

      {/* ── Sección 6: CTA ── */}
      <motion.div variants={stagger} initial="hidden" whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="border-t border-white/[0.06] pt-16 text-center">
        <motion.h3 variants={fadeUp}
          className="font-display font-bold text-[clamp(1.4rem,3vw,2rem)] text-white mb-4">
          ¿Querés un sitio así para tu negocio?
        </motion.h3>
        <motion.p variants={fadeUp}
          className="font-body text-[1rem] text-[#7A8FA6] leading-[1.7] max-w-[480px] mx-auto mb-8">
          Empezá con una auditoría gratuita. Si encontramos oportunidades reales, te lo contamos. Si no, también.
        </motion.p>
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="/auditoria-web-gratis"
            className="inline-flex items-center justify-center gap-2 font-body font-medium text-base text-white px-8 py-4 rounded-lg transition-all duration-200 hover:brightness-110"
            style={{ background: "linear-gradient(135deg, #3FC87A, #2BA86A)", boxShadow: "0 0 24px rgba(63,200,122,0.3)" }}>
            Auditá tu web gratis →
          </a>
          <a href={WA_URL} target="_blank" rel="noopener noreferrer"
            className="font-body text-sm text-[#7A8FA6] hover:text-white transition-colors duration-200">
            O hablá directamente →
          </a>
        </motion.div>
      </motion.div>

    </section>
  );
}

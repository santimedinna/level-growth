"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MetodoTab1 } from "./metodo/MetodoTab1";
import { MetodoTab2 } from "./metodo/MetodoTab2";
import { MetodoTab3 } from "./metodo/MetodoTab3";
import { MetodoTab4 } from "./metodo/MetodoTab4";

const TABS = [
  {
    num: "01",
    label: "Auditoría",
    line1: "Analizamos tu sitio, tus ads y tu proceso de contacto. Sin costo.",
    line2: "Para que sepas exactamente dónde está la fuga antes de invertir un peso.",
  },
  {
    num: "02",
    label: "Diagnóstico",
    line1: "Convertimos los problemas detectados en un plan de acción concreto.",
    line2: "Para que cada cambio que hagamos tenga sentido y prioridad clara.",
  },
  {
    num: "03",
    label: "Implementación",
    line1: "Ejecutamos los cambios. Web, publicidad y todo lo necesario para que vendan.",
    line2: "Para que las mejoras dejen de ser teoría y empiecen a generar resultados.",
  },
  {
    num: "04",
    label: "Optimización",
    line1: "Medimos resultados y ajustamos semana a semana. El trabajo no termina.",
    line2: "Para que tu sistema mejore con el tiempo, no se quede estancado.",
  },
];

const AUTOPLAY_MS = 14000;

export function MetodoLevelGrowth() {
  const [active, setActive]     = useState(0);
  const [paused, setPaused]     = useState(false);
  const [progress, setProgress] = useState(0);
  const sectionRef  = useRef<HTMLElement>(null);
  const visibleRef  = useRef(true);
  const startRef    = useRef<number | null>(null);
  const rafRef      = useRef<number>(0);

  /* IntersectionObserver — pause when section not visible */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting; },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Progress bar + autoplay loop */
  const tick = useCallback((ts: number) => {
    if (!visibleRef.current || paused) {
      startRef.current = null;
      rafRef.current = requestAnimationFrame(tick);
      return;
    }
    if (startRef.current === null) startRef.current = ts;
    const elapsed = ts - startRef.current;
    const pct = Math.min(elapsed / AUTOPLAY_MS, 1);
    setProgress(pct);
    if (pct >= 1) {
      setActive(prev => (prev + 1) % TABS.length);
      startRef.current = null;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [paused]);

  useEffect(() => {
    startRef.current = null;
    setProgress(0);
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, tick]);

  function goTo(i: number) {
    setActive(i);
    setPaused(true);
    setProgress(0);
    startRef.current = null;
    setTimeout(() => setPaused(false), 10000);
  }

  return (
    <section
      ref={sectionRef}
      id="metodo"
      className="px-[clamp(1.5rem,5vw,4rem)] py-[clamp(4rem,10vw,8rem)]"
      style={{ background: "#080C14" }}
    >
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: "#3FC87A" }}>
            Cómo trabajamos
          </p>
          <h2 className="font-display font-bold text-[clamp(1.8rem,4vw,3rem)] leading-tight text-white mt-3">
            El Método Level Growth
          </h2>
        </motion.div>

        {/* Tab buttons */}
        <div className="flex gap-0 overflow-x-auto mb-0 border-b border-white/[0.08]">
          {TABS.map((t, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="flex items-center gap-2 px-6 py-3 shrink-0 transition-all duration-300 relative"
              style={{
                opacity:     active === i ? 1 : 0.5,
                borderBottom: active === i ? "2px solid #3FC87A" : "2px solid transparent",
                marginBottom: "-1px",
              }}
            >
              <span className="font-mono text-xs" style={{ color: "#3FC87A" }}>{t.num} ·</span>
              <span
                className="font-body font-medium text-sm"
                style={{ color: active === i ? "#fff" : "#7A8FA6" }}
              >
                {t.label}
              </span>
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="relative h-[2px] bg-white/[0.06] mb-8">
          <div
            className="absolute left-0 top-0 h-full transition-none"
            style={{
              width: `${progress * 100}%`,
              background: "#3FC87A",
            }}
          />
        </div>

        {/* Stage container */}
        <div
          className="relative w-full max-w-[1100px] mx-auto rounded-2xl overflow-hidden"
          style={{
            aspectRatio: "1280 / 800",
            background: "#0D1221",
          }}
        >
          {TABS.map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-500"
              style={{
                opacity:       active === i ? 1 : 0,
                pointerEvents: active === i ? "auto" : "none",
              }}
            >
              {i === 0 && <MetodoTab1 isActive={active === 0} />}
              {i === 1 && <MetodoTab2 isActive={active === 1} />}
              {i === 2 && <MetodoTab3 isActive={active === 2} />}
              {i === 3 && <MetodoTab4 isActive={active === 3} />}
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="max-w-[1100px] mx-auto mt-6 min-h-[64px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="font-body text-base text-white">
                {TABS[active].line1}
              </p>
              <p className="font-body text-sm italic mt-2" style={{ color: "#7A8FA6" }}>
                {TABS[active].line2}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <p className="font-display text-2xl text-white mb-4">
            Listo para crecer.
          </p>
          <a
            href="/auditoria-web-gratis"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-body font-semibold text-white text-base transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110"
            style={{
              background:  "linear-gradient(135deg, #3FC87A 0%, #2BA86A 55%, #1a7a4e 100%)",
              boxShadow:   "0 0 20px rgba(43,168,106,0.3)",
            }}
          >
            Auditá tu sitio gratis →
          </a>
        </div>

      </div>
    </section>
  );
}

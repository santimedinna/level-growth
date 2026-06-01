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

const TAB_DURATIONS = [
  18000, // Tab 1 — Auditoría
  11000, // Tab 2 — Diagnóstico
  16000, // Tab 3 — Implementación
  15000, // Tab 4 — Optimización
];

export function MetodoLevelGrowth() {
  const [active, setActive]     = useState(0);
  const [paused, setPaused]     = useState(false);
  const [progress, setProgress] = useState(0);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

  const sectionRef   = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs      = useRef<(HTMLButtonElement | null)[]>([]);
  const visibleRef   = useRef(true);
  const startRef     = useRef<number | null>(null);
  const rafRef       = useRef<number>(0);

  /* ── Sizing dinámico: ancho real × ratio 16:10, sin marco negro ── */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      const parentWidth = container.parentElement?.clientWidth ?? 0;
      const maxW = Math.min(parentWidth, 900);

      let width  = maxW;
      let height = width * (800 / 1280);

      // cap de altura para que entre en pantallas bajas
      const maxHeight = Math.min(window.innerHeight - 240, 600);
      if (height > maxHeight) {
        height = maxHeight;
        width  = height * (1280 / 800);
      }

      setStageSize({ width, height });
    };

    updateSize();

    const ro = new ResizeObserver(updateSize);
    if (container.parentElement) ro.observe(container.parentElement);
    window.addEventListener("resize", updateSize);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  /* ── IntersectionObserver — pausa cuando la sección no está visible ── */
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

  /* ── Progress bar + autoplay ── */
  const tick = useCallback((ts: number) => {
    if (!visibleRef.current || paused) {
      startRef.current = null;
      rafRef.current = requestAnimationFrame(tick);
      return;
    }
    if (startRef.current === null) startRef.current = ts;
    const elapsed  = ts - startRef.current;
    const duration = TAB_DURATIONS[active] ?? 14000;
    const pct = Math.min(elapsed / duration, 1);
    setProgress(pct);
    if (pct >= 1) {
      setActive(prev => (prev + 1) % TABS.length);
      startRef.current = null;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [paused, active]);

  useEffect(() => {
    startRef.current = null;
    setProgress(0);
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, tick]);

  /* Scroll tab activo al centro del contenedor */
  useEffect(() => {
    tabRefs.current[active]?.scrollIntoView({
      behavior: "smooth",
      block:    "nearest",
      inline:   "center",
    });
  }, [active]);

  function goTo(i: number) {
    setActive(i);
    setPaused(true);
    setProgress(0);
    startRef.current = null;
    setTimeout(() => setPaused(false), 10000);
  }

  const hasSize = stageSize.width > 0;

  return (
    <section
      ref={sectionRef}
      id="metodo"
      className="px-4 md:px-8 lg:px-16 py-[clamp(3rem,8vw,6rem)]"
      style={{ background: "#080C14" }}
    >
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: "#3FC87A" }}>
            Cómo trabajamos
          </p>
          <h2 className="font-display font-bold text-[clamp(1.6rem,3.5vw,2.6rem)] leading-tight text-white">
            El Método Level Growth
          </h2>
        </motion.div>

        {/* CSS para ocultar scrollbar en todos los browsers */}
        <style dangerouslySetInnerHTML={{ __html: `
          .tabs-container::-webkit-scrollbar { display: none; }
          .tabs-container { scrollbar-width: none; -ms-overflow-style: none; }
        ` }} />

        {/* Bloque unificado: tabs + stage + barra — mismo ancho, centrado */}
        <div
          className="mx-auto flex flex-col mt-6"
          style={{ width: hasSize ? `${stageSize.width}px` : "100%" }}
        >
          {/* Corrección 1+2 — Tabs al ancho del stage, sin scrollbar visible */}
          <div className="tabs-container flex gap-0 overflow-x-auto overflow-y-hidden border-b border-white/[0.08]">
            {TABS.map((t, i) => (
              <button
                key={i}
                ref={(el) => { tabRefs.current[i] = el; }}
                onClick={() => goTo(i)}
                className="flex items-center gap-2 px-6 py-2 shrink-0 transition-all duration-300"
                style={{
                  opacity:      active === i ? 1 : 0.5,
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

          {/* Stage: dimensiones computadas sin aspect-ratio fijo */}
          <div
            ref={containerRef}
            className="relative rounded-2xl overflow-hidden"
            style={{
              width:       hasSize ? `${stageSize.width}px`  : "100%",
              height:      hasSize ? `${stageSize.height}px` : undefined,
              aspectRatio: hasSize ? undefined : "1280/800",
              background:  "#0D1221",
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

          {/* Corrección 3 — Barra al mismo ancho del stage, no interactiva */}
          <div
            className="relative mt-3"
            style={{
              height:        "2px",
              background:    "rgba(255,255,255,0.08)",
              borderRadius:  "2px",
              pointerEvents: "none",
              userSelect:    "none",
            }}
          >
            <div
              style={{
                height:       "100%",
                width:        `${progress * 100}%`,
                background:   "#3FC87A",
                borderRadius: "2px",
                transition:   "none",
              }}
            />
          </div>
        </div>

        {/* Descripción — mismo ancho que el stage */}
        <div
          className="mx-auto mt-4 text-center min-h-[56px]"
          style={{ width: hasSize ? `${stageSize.width}px` : "100%" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="font-body text-lg text-white">
                {TABS[active].line1}
              </p>
              <p className="font-body text-sm italic mt-2" style={{ color: "#7A8FA6" }}>
                {TABS[active].line2}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="font-display text-2xl text-white mb-4">
            Listo para crecer.
          </p>
          <a
            href="/auditoria-web-gratis"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-body font-semibold text-white text-base transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110"
            style={{
              background: "linear-gradient(135deg, #3FC87A 0%, #2BA86A 55%, #1a7a4e 100%)",
              boxShadow:  "0 0 20px rgba(43,168,106,0.3)",
            }}
          >
            Auditá tu sitio gratis →
          </a>
        </div>

      </div>
    </section>
  );
}

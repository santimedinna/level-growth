"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ─── Etapas ──────────────────────────────── */
const stages = [
  {
    label:    "Tráfico",
    sublabel: "Visitantes calificados que llegan con intención",
    widthPct: 100,
    bg:       "rgba(63, 200, 122, 0.25)",
  },
  {
    label:    "Nutrición",
    sublabel: "Prospectos que conocen tu propuesta de valor",
    widthPct: 82,
    bg:       "rgba(63, 200, 122, 0.18)",
  },
  {
    label:    "Conversión",
    sublabel: "Leads listos para tomar una decisión de compra",
    widthPct: 65,
    bg:       "rgba(63, 200, 122, 0.12)",
  },
  {
    label:    "Fidelización",
    sublabel: "Clientes que repiten y generan referidos",
    widthPct: 50,
    bg:       "rgba(63, 200, 122, 0.08)",
  },
];

/* ─── Componente ──────────────────────────── */
export function FunnelComparison() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="comparacion-funnel"
      className="py-[clamp(3.75rem,5vw,5rem)] px-[clamp(1.5rem,5vw,4rem)]"
    >
      <div className="max-w-[860px] mx-auto">

        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-14"
        >
          <h2 className="font-display font-semibold text-[clamp(1.75rem,3.5vw,2.25rem)] text-lg-text mb-4 leading-tight">
            Funnel optimizado: El Motor que<br className="hidden sm:block" /> Multiplica tus Ventas
          </h2>
          <p className="font-body text-[1.125rem] text-lg-text-secondary leading-[1.7] max-w-[560px] mx-auto">
            No hacemos solo campañas. Diseñamos ecosistemas de conversión
            optimizados para generar resultados.
          </p>
        </motion.div>

        {/* ── Embudo ────────────────────────────────────────────────────
            Layout: dos columnas
            - Izquierda (60%): contiene las barras, todas centradas dentro
            - Derecha  (40%): etiquetas alineadas a cada fila
        ──────────────────────────────────────────────────────────────── */}
        <div className="flex gap-4 items-start">

          {/* Columna barras — las barras se centran dentro de este contenedor */}
          <div className="flex-[3] flex flex-col gap-2">
            {stages.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scaleX: 0.5 }}
                animate={inView ? { opacity: 1, scaleX: 1 } : {}}
                transition={{ duration: 0.55, ease: "easeOut", delay: i * 0.15 }}
                className="flex justify-center"
                style={{ transformOrigin: "center" }}
              >
                <div
                  className="h-14 rounded-xl"
                  style={{
                    width:      `${s.widthPct}%`,
                    background: s.bg,
                  }}
                />
              </motion.div>
            ))}
          </div>

          {/* Columna etiquetas — cada etiqueta ocupa la misma altura que su barra */}
          <div className="flex-[2] flex flex-col gap-2">
            {stages.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: 10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.15 + 0.1 }}
                className="h-14 flex items-center gap-2"
              >
                {/* Línea líder */}
                <div className="h-px w-4 shrink-0 bg-white/10" />
                {/* Texto */}
                <div>
                  <p className="font-body text-sm font-medium text-lg-text leading-tight">
                    {s.label}
                  </p>
                  <p className="font-body text-[0.68rem] text-lg-text-muted leading-snug mt-0.5 hidden sm:block">
                    {s.sublabel}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}

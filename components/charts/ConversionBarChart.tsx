"use client";

import { useRef, useState, useEffect } from "react";

/* ─── Datos ───────────────────────────────── */
const bars = [
  {
    lines: ["Sitio promedio", "sin optimizar"],
    value: 1.5,
    color: "#2D3B45",
    glow: false,
  },
  {
    lines: ["Con funnel", "optimizado"],
    value: 4.8,
    color: "#3FC87A",
    glow: true,
  },
] as const;

/* ─── Dimensiones del SVG ─────────────────── */
const LABEL_W  = 170;  // ancho de la columna de etiquetas
const BAR_AREA = 270;  // ancho de la zona de barras
const MAX_VAL  = 6.5;  // dominio máximo del eje X
const BAR_H    = 30;   // altura de cada barra
const BAR_GAP  = 22;   // separación entre barras
const VW       = LABEL_W + BAR_AREA + 50; // +50 para la etiqueta del porcentaje
const VH       = BAR_H * 2 + BAR_GAP + 8;

/* ─── Hook IntersectionObserver ──────────── */
function useInView(ref: React.RefObject<Element | null>) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { rootMargin: "-80px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return visible;
}

/* ─── Componente ──────────────────────────── */
export function ConversionBarChart() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const barRefs = useRef<(SVGRectElement | null)[]>([]);
  const inView  = useInView(wrapRef as React.RefObject<Element>);

  /* Animar el ancho de cada barra cuando entra al viewport */
  useEffect(() => {
    if (!inView) return;
    bars.forEach((bar, i) => {
      const el = barRefs.current[i];
      if (!el) return;
      const targetW = (bar.value / MAX_VAL) * BAR_AREA;
      const start   = performance.now();
      const dur     = 900 + i * 250; // stagger entre barras

      const tick = (now: number) => {
        const p     = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.setAttribute("width", String(eased * targetW));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, [inView]);

  return (
    <div ref={wrapRef} className="mt-14 max-w-[680px] mx-auto">
      {/* Títulos */}
      <p className="font-body text-sm font-medium text-lg-text text-center mb-1">
        Tasa de conversión promedio
      </p>
      <p className="font-body text-xs text-lg-text-muted text-center mb-8">
        Mismo tráfico, más ventas.
      </p>

      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        width="100%"
        style={{ display: "block" }}
        aria-label="Comparación de tasa de conversión: sitio sin optimizar vs funnel optimizado"
      >
        <defs>
          <filter id="cbc-glow" x="-10%" y="-60%" width="120%" height="220%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {bars.map((bar, i) => {
          const y    = 4 + i * (BAR_H + BAR_GAP);
          const midY = y + BAR_H / 2;

          return (
            <g key={i}>
              {/* Etiqueta en dos líneas alineada a la derecha */}
              <text
                textAnchor="end"
                fill="#7A8FA6"
                fontSize={11}
                fontFamily="DM Sans, sans-serif"
              >
                <tspan x={LABEL_W - 8} y={midY - 5}>{bar.lines[0]}</tspan>
                <tspan x={LABEL_W - 8} dy={14}>{bar.lines[1]}</tspan>
              </text>

              {/* Barra — arranca en width=0, se anima via JS */}
              <rect
                ref={(el) => { barRefs.current[i] = el; }}
                x={LABEL_W}
                y={y}
                width={0}
                height={BAR_H}
                rx={4}
                fill={bar.color}
                filter={bar.glow ? "url(#cbc-glow)" : undefined}
              />

              {/* Porcentaje a la derecha de la barra */}
              <text
                x={LABEL_W + BAR_AREA + 8}
                y={midY + 4}
                fill="#7A8FA6"
                fontSize={12}
                fontFamily="JetBrains Mono, monospace"
              >
                {bar.value}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

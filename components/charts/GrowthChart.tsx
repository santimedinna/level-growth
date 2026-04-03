"use client";

import { useRef, useState, useEffect } from "react";

/* ─── Puntos del área chart (pre-calculados) ─
   Datos: Mes 1→$1.5K, Mes 6→$5K, Mes 12→$15K,
          Mes 18→$42K, Mes 24→$90K, Mes 36→$150K
   viewBox 560×165 | área chart: y 0–140, labels 140–165
   Curvas bezier: control en el punto medio horizontal de cada segmento ── */
const LINE = "M 20,139 C 72,139 72,136 124,136 C 176,136 176,127 228,127 C 280,127 280,104 332,104 C 384,104 384,62 436,62 C 488,62 488,10 540,10";
const AREA = LINE + " L 540,140 L 20,140 Z";
const XS   = [20, 124, 228, 332, 436, 540] as const;
const LABELS = ["Mes 1", "Mes 6", "Mes 12", "Mes 18", "Mes 24", "Mes 36"] as const;
const VW = 560;
const VH = 165;

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
export function GrowthChart() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<SVGRectElement>(null);
  const inView  = useInView(wrapRef as React.RefObject<Element>);

  /* Animar el clipPath de izquierda a derecha cuando entra al viewport */
  useEffect(() => {
    if (!inView || !clipRef.current) return;
    const el    = clipRef.current;
    const start = performance.now();
    const dur   = 1500;

    const tick = (now: number) => {
      const p     = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.setAttribute("width", String(eased * VW));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView]);

  return (
    <div ref={wrapRef} className="w-full">
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        width="100%"
        style={{ display: "block" }}
        aria-label="Gráfico de crecimiento exponencial del negocio"
      >
        <defs>
          <linearGradient id="gc-stroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#3FC87A" />
            <stop offset="100%" stopColor="#4A9EE0" />
          </linearGradient>
          <linearGradient id="gc-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#3FC87A" stopOpacity={0.22} />
            <stop offset="100%" stopColor="#4A9EE0" stopOpacity={0.01} />
          </linearGradient>
          <clipPath id="gc-clip">
            {/* El ancho arranca en 0 y se anima vía JS */}
            <rect ref={clipRef} x="0" y="0" width="0" height={VH} />
          </clipPath>
        </defs>

        {/* Relleno del área */}
        <path d={AREA} fill="url(#gc-fill)" clipPath="url(#gc-clip)" />

        {/* Línea de trazo */}
        <path
          d={LINE}
          fill="none"
          stroke="url(#gc-stroke)"
          strokeWidth={2}
          strokeLinecap="round"
          clipPath="url(#gc-clip)"
        />

        {/* Etiquetas del eje X */}
        {XS.map((x, i) => (
          <text
            key={i}
            x={x}
            y={VH - 4}
            textAnchor="middle"
            fill="#4A6070"
            fontSize={11}
            fontFamily="DM Sans, sans-serif"
          >
            {LABELS[i]}
          </text>
        ))}
      </svg>

      <p className="font-body text-[0.7rem] text-lg-text-muted text-center mt-3 tracking-[0.05em]">
        Así crece un negocio con un funnel bien construido
      </p>
    </div>
  );
}

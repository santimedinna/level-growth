"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

/* ─── IntersectionObserver hook (sin Framer Motion) ── */
function useVisible(ref: React.RefObject<Element | null>) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return visible;
}

/* ─── CountUp ─────────────────────────────── */
interface CountUpProps {
  target:    number;
  prefix?:   string;
  suffix?:   string;
  decimals?: number;
}

function CountUp({ target, prefix = "", suffix = "", decimals = 0 }: CountUpProps) {
  const ref     = useRef<HTMLSpanElement>(null);
  const visible = useVisible(ref);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const duration  = 1500;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [visible, target, decimals]);

  return <span ref={ref}>{prefix}{value.toFixed(decimals)}{suffix}</span>;
}

/* ─── Datos de métricas ───────────────────── */
const metrics = [
  { prefix: "+", target: 40,   suffix: "%",  decimals: 0, label: "conversión promedio" },
  {              target: 4.75, suffix: "x",  decimals: 2, label: "retorno en ads"       },
  {              target: 48,   suffix: "hs", decimals: 0, label: "primer reporte"        },
];

/* ─── Helper: estilo de animación CSS ────── */
// Anima con keyframe fade-up-hero definido en globals.css.
// fill-mode "both" = opacity:0 antes de comenzar.
// El H1 NO usa esto — debe ser visible de inmediato para LCP.
const anim = (delay: string): React.CSSProperties => ({
  animation: `fade-up-hero 0.6s ease-out ${delay} both`,
});

/* ─── Componente ──────────────────────────── */
export function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-[clamp(1.5rem,5vw,4rem)] pb-[120px]"
    >
      {/* Glow azul — top left */}
      <div
        className="absolute -top-20 -left-16 w-[500px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(13,31,74,0.5) 0%, transparent 70%)" }}
      />
      {/* Glow verde — bottom right */}
      <div
        className="absolute -bottom-16 -right-10 w-[400px] h-[350px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(20,90,50,0.25) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-[680px] w-full text-center pt-20">

        {/* Badge */}
        <div style={anim("0s")} className="mb-6">
          <Badge>Agencia de Growth</Badge>
        </div>

        {/* H1 — sin animación para que sea el LCP inmediato */}
        <h1 className="font-display font-bold text-[clamp(2rem,5vw,3.2rem)] leading-tight text-lg-text mb-6 max-w-[700px] mx-auto">
          Tu negocio merece un funnel
          <br />
          que{" "}
          <span className="gradient-text">realmente convierta</span>
        </h1>

        {/* Subtítulo */}
        <p
          style={anim("0.1s")}
          className="font-body text-[1.125rem] text-lg-text-secondary leading-[1.7] max-w-[560px] mx-auto mb-10"
        >
          Auditamos tu sitio web y tu publicidad. Te mostramos exactamente
          dónde perdés clientes — y lo solucionamos.
        </p>

        {/* CTAs */}
        <div
          style={anim("0.22s")}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
        >
          <Button
            href="https://wa.me/5493512613927?text=Hola%20Santiago!%20Vi%20tu%20web%20y%20quiero%20saber%20m%C3%A1s%20sobre%20la%20auditor%C3%ADa%20gratuita."
            external
            size="lg"
          >
            Quiero mi auditoría gratis →
          </Button>
          <Button href="#caso-de-exito" variant="secondary" size="lg">
            Ver casos de éxito
          </Button>
        </div>

        {/* Divisor + Métricas */}
        <div style={anim("0.36s")}>
          <div className="border-t border-white/[0.08] pt-8">
            <div className="grid grid-cols-3">
              {metrics.map((m, i) => (
                <div
                  key={m.label}
                  className={[
                    "text-center px-4",
                    i > 0 && "border-l border-white/[0.08]",
                  ].filter(Boolean).join(" ")}
                >
                  <p className="font-mono text-[clamp(2rem,4vw,3.5rem)] font-medium gradient-text leading-none mb-1">
                    <CountUp {...m} />
                  </p>
                  <p className="font-body text-[0.75rem] text-lg-text-muted tracking-[0.08em] uppercase">
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

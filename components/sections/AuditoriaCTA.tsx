"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";

/* ─── Animaciones ─────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ─── Mockup de scores ────────────────────── */
const MOCK_SCORES = [
  { label: "Velocidad", score: 9, color: "#3FC87A" },
  { label: "SEO",       score: 8, color: "#3FC87A" },
  { label: "Mensaje",   score: 6, color: "#F59E0B" },
  { label: "CTA",       score: 4, color: "#EF4444" },
];

/* ─── Componente ──────────────────────────── */
export function AuditoriaCTA() {
  const router   = useRouter();
  const [url, setUrl] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed    = url.trim();
    if (!trimmed) return;
    const normalized = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
    router.push(`/auditoria-web-gratis?url=${encodeURIComponent(normalized)}`);
  }

  return (
    <section className="px-[clamp(1.5rem,5vw,4rem)] py-[clamp(5rem,12vw,10rem)]"
      style={{ background: "#0D1221" }}>
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          {/* ── Lado izquierdo — formulario ── */}
          <motion.div variants={fadeUp} className="flex flex-col gap-6">
            <Badge>Herramienta gratuita</Badge>

            <h2 className="font-display font-bold text-[clamp(1.5rem,3vw,2.2rem)] leading-tight text-white">
              Descubrí en segundos qué está frenando tus ventas
            </h2>

            <p className="font-body text-[1.05rem] text-[#7A8FA6] leading-[1.7]">
              Ingresá la URL de tu sitio y te mostramos exactamente dónde perdés clientes — gratis, sin registro, sin tecnicismos.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="tuempresa.com"
                className="flex-1 font-body text-base text-white bg-[#111827] border border-white/[0.08] rounded-lg px-4 py-3 outline-none focus:border-[#3FC87A]/50 transition-colors placeholder:text-[#4A6070]"
              />
              <button
                type="submit"
                className="font-body font-medium text-base text-white px-6 py-3 rounded-lg whitespace-nowrap transition-all duration-200 hover:brightness-110 active:brightness-95"
                style={{ background: "linear-gradient(135deg, #3FC87A, #2BA86A)", boxShadow: "0 0 20px rgba(63,200,122,0.3)" }}
              >
                Analizar gratis →
              </button>
            </form>

            <p className="font-body text-[0.8rem] text-[#4A6070]">
              Ya auditamos más de 200 sitios. El análisis tarda menos de 60 segundos.
            </p>
          </motion.div>

          {/* ── Lado derecho — mockup visual ── */}
          <motion.div variants={fadeUp}>
            <div className="rounded-xl border border-white/[0.08] p-6"
              style={{ background: "#080C14" }}>

              {/* Header del mockup */}
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#3FC87A]" />
                <span className="font-mono text-[0.65rem] text-[#4A6070] ml-2">miempresa.com</span>
              </div>

              {/* Score general */}
              <div className="text-center mb-5 pb-5 border-b border-white/[0.06]">
                <p className="font-body text-[0.65rem] text-[#4A6070] uppercase tracking-[0.1em] mb-1">
                  Puntaje general
                </p>
                <span className="font-mono font-medium text-[3rem] leading-none" style={{ color: "#F59E0B" }}>
                  67
                </span>
                <span className="font-mono text-lg text-[#4A6070]">/100</span>
              </div>

              {/* Cards de scores */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {MOCK_SCORES.map(({ label, score, color }) => (
                  <div key={label}
                    className="rounded-lg p-3 border border-white/[0.06]"
                    style={{ background: "#0D1221" }}>
                    <p className="font-body text-[0.65rem] text-[#4A6070] uppercase tracking-[0.08em] mb-1">
                      {label}
                    </p>
                    <p className="font-mono font-medium text-xl leading-none" style={{ color }}>
                      {score}<span className="text-sm text-[#4A6070]">/10</span>
                    </p>
                  </div>
                ))}
              </div>

              {/* Escenario */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[0.7rem] font-body font-medium"
                  style={{ borderColor: "#F59E0B40", backgroundColor: "#F59E0B12", color: "#F59E0B" }}>
                  Escenario: Doble Fricción
                </span>
                <span className="font-body text-[0.65rem] text-[#4A6070]">
                  Ejemplo real de auditoría
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

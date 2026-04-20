"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";

/* ─── Animaciones ─────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ─── Datos ───────────────────────────────── */
const pains = [
  {
    title: "Tu web es un colador, no un vendedor.",
    body:  "Tenés visitas, pero se escapan por los agujeros de tu sitio. Si no vendés con mil visitas, el problema no es el tráfico, es tu motor. Una web lenta o confusa mata cualquier pauta.",
  },
  {
    title: "Estás invirtiendo a ciegas.",
    body:  "Invertís en publicidad pero no sabés qué funciona y qué no. Cada peso que gastás sin datos es plata tirada. Si no sabés quién te compra ni volvés a aparecer ante el que te vio, no estás invirtiendo, estás apostando.",
  },
  {
    title: "Tu web no habla, y tu WhatsApp explota.",
    body:  "Tenés un producto excelente, pero tu página no explica nada. Tu WhatsApp está lleno de consultas que no cierran. La web debería estar filtrando y resolviendo sola — no mandarte a explicar mil veces lo mismo.",
  },
];

/* ─── Componente ──────────────────────────── */
export function Pain() {
  return (
    <section
      id="problema"
      className="bg-lg-bg-secondary pt-[clamp(1.875rem,2.5vw,2.5rem)] pb-8 px-[clamp(1.5rem,5vw,4rem)]"
    >
      <div className="max-w-[1200px] mx-auto">

        {/* Título */}
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="font-display font-semibold text-[clamp(1.75rem,3.5vw,2.25rem)] text-center text-lg-text mb-12"
        >
          ¿Te suena alguno de estos escenarios?
        </motion.h2>

        {/* Cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14"
        >
          {pains.map((pain) => (
            <motion.div key={pain.title} variants={fadeUp} className="h-full">
              <Card interactive className="h-full flex flex-col">
                <h3 className="font-body font-medium text-[1.25rem] text-lg-text mb-3 leading-snug">
                  {pain.title}
                </h3>
                <p className="font-body text-sm text-lg-text-secondary leading-[1.65]">
                  {pain.body}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Texto de transición */}
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="font-body text-[1.125rem] text-lg-text-secondary text-center leading-[1.7] max-w-[680px] mx-auto"
        >
          Tu competencia ya lo está resolviendo. ¿Cuánto más vas a esperar?
        </motion.p>


      </div>
    </section>
  );
}

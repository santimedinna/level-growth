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
    title: '"Tengo visitas pero nadie compra"',
    body:  "Tu sitio tiene tráfico pero la tasa de conversión es casi cero. El problema no es la cantidad de visitas — es lo que pasa cuando llegan.",
  },
  {
    title: '"Hago publicidad pero no sé si funciona"',
    body:  "Invertís en ads sin saber exactamente qué retorno obtenés. Cada peso parece que desaparece sin dejar rastro.",
  },
  {
    title: '"Mi vendedor pierde clientes que ya estaban listos"',
    body:  "El funnel funciona pero falla en el último paso: el contacto humano. Un WhatsApp sin responder es un cliente que se va a la competencia.",
  },
];

/* ─── Componente ──────────────────────────── */
export function Pain() {
  return (
    <section
      id="problema"
      className="bg-lg-bg-secondary pt-[clamp(1.875rem,2.5vw,2.5rem)] pb-[clamp(3.75rem,5vw,5rem)] px-[clamp(1.5rem,5vw,4rem)]"
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
          El problema casi nunca es uno solo — es la suma de pequeñas roturas
          en cada etapa del proceso. Por eso auditamos el funnel completo.
        </motion.p>


      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

/* ─── Animaciones ─────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ─── Íconos inline ───────────────────────── */
function IconSearch() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function IconCursor() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l7.07 17 2.51-7.39L21 11.07z" />
    </svg>
  );
}

function IconChart() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function IconFunnel() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 3H2l8 9.46V19l4 2v-8.54z" />
    </svg>
  );
}

/* ─── Datos ───────────────────────────────── */
const services = [
  {
    num:         "01",
    icon:        <IconSearch />,
    badge:       "Punto de partida",
    title:       "Auditoría de funnel",
    description: "Analizamos tu sitio web, tu publicidad activa y tu proceso de contacto. En 48 horas sabés exactamente qué está frenando tus ventas.",
  },
  {
    num:         "02",
    icon:        <IconCursor />,
    badge:       "Más conversiones",
    title:       "Optimización de landing",
    description: "Rediseñamos o mejoramos tu sitio para que cada visitante tenga un motivo claro para contactarte. Copy, estructura y velocidad.",
  },
  {
    num:         "03",
    icon:        <IconChart />,
    badge:       "Paid Media",
    title:       "Gestión de publicidad",
    description: "Creamos y gestionamos tus campañas en Google y Meta. Setup inicial + optimización mensual orientada a resultados medibles, no a impresiones.",
  },
  {
    num:         "04",
    icon:        <IconFunnel />,
    badge:       "Todo incluido",
    title:       "Funnel completo",
    description: "Landing + publicidad + seguimiento. Un sistema donde cada pieza trabaja junto. Ideal para negocios que quieren escalar sin improvisar.",
  },
];

/* ─── Componente ──────────────────────────── */
export function Services() {
  return (
    <section
      id="servicios"
      className="py-[clamp(3.75rem,5vw,5rem)] px-[clamp(1.5rem,5vw,4rem)]"
    >
      <div className="max-w-[1200px] mx-auto">

        {/* Encabezado */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center mb-14"
        >
          <motion.div variants={fadeUp} className="mb-4">
            <Badge>Servicios</Badge>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="font-display font-semibold text-[clamp(1.75rem,3.5vw,2.25rem)] text-lg-text mb-4"
          >
            Qué hacemos en Level Growth
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="font-body text-[1.125rem] text-lg-text-secondary leading-[1.7] max-w-[560px] mx-auto"
          >
            No vendemos servicios sueltos. Analizamos tu negocio entero
            y atacamos donde más duele.
          </motion.p>
        </motion.div>

        {/* Grid de servicios */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {services.map((s) => (
            <motion.div key={s.title} variants={fadeUp}>
              <Card interactive className="relative overflow-hidden h-full flex flex-col gap-4">
                {/* Número decorativo de fondo */}
                <span
                  aria-hidden
                  className="absolute -bottom-6 -right-2 font-mono font-bold text-[8rem] leading-none select-none pointer-events-none text-white/[0.035]"
                >
                  {s.num}
                </span>
                {/* Ícono */}
                <div className="w-10 h-10 rounded-lg bg-lg-green/10 text-lg-green flex items-center justify-center">
                  {s.icon}
                </div>
                {/* Badge + título */}
                <div>
                  <div className="mb-2">
                    <Badge>{s.badge}</Badge>
                  </div>
                  <h3 className="font-body font-medium text-[1.25rem] text-lg-text">
                    {s.title}
                  </h3>
                </div>
                {/* Descripción */}
                <p className="font-body text-sm text-lg-text-secondary leading-[1.65]">
                  {s.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

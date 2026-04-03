"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
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

/* ─── Ícono check ─────────────────────────── */
function IconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/* ─── Datos de planes ─────────────────────── */
const plans = [
  {
    name:        "Auditoría",
    price:       "Gratis",
    priceNote:   null,
    description: "Para negocios que quieren saber dónde están parados antes de invertir.",
    features: [
      "Análisis del sitio web",
      "Revisión de publicidad activa",
      "Reporte en PDF",
      "Llamada de 30 minutos",
    ],
    cta:         "Solicitar auditoría",
    ctaHref:     "/contacto",
    featured:    false,
  },
  {
    name:        "Landing + Optimización",
    price:       "desde $400 USD",
    priceNote:   null,
    description: "Para negocios que necesitan un sitio orientado a convertir, no solo a existir.",
    features: [
      "Diseño y desarrollo de landing",
      "Copy orientado a conversión",
      "Integración de WhatsApp y formulario",
      "Entrega en 7-10 días hábiles",
    ],
    cta:         "Hablar con un especialista",
    ctaHref:     "/contacto",
    featured:    true,
    badge:       "Más vendido",
  },
  {
    name:        "Funnel Completo",
    price:       "desde $700 USD",
    priceNote:   "+ fee mensual",
    description: "Para negocios que quieren un sistema completo funcionando.",
    features: [
      "Todo lo del plan anterior",
      "Setup de Google/Meta Ads",
      "Gestión mensual de campañas",
      "Reportes de resultados",
    ],
    cta:         "Hablar con un especialista",
    ctaHref:     "/contacto",
    featured:    false,
  },
];

/* ─── Componente ──────────────────────────── */
export function Pricing() {
  return (
    <section
      id="precios"
      className="py-[clamp(3.75rem,5vw,5rem)] px-[clamp(1.5rem,5vw,4rem)]"
    >
      <div className="max-w-[1200px] mx-auto">

        {/* Encabezado */}
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="font-display font-semibold text-[clamp(1.75rem,3.5vw,2.25rem)] text-center text-lg-text mb-14"
        >
          Precios claros, sin sorpresas
        </motion.h2>

        {/* Cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
        >
          {plans.map((plan) => (
            <motion.div key={plan.name} variants={fadeUp} className="relative flex flex-col">

              {/* Badge "Más vendido" */}
              {plan.featured && plan.badge && (
                <div className="absolute -top-3 inset-x-0 flex justify-center z-10">
                  <Badge>{plan.badge}</Badge>
                </div>
              )}

              {/* Card */}
              <div
                className={[
                  "flex-1 flex flex-col rounded-card border p-8 transition-all duration-300",
                  plan.featured
                    ? "border-lg-green/40 bg-gradient-to-br from-lg-green/[0.06] to-transparent shadow-[0_0_40px_rgba(63,200,122,0.08)]"
                    : "border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01]",
                ].join(" ")}
              >
                {/* Nombre */}
                <h3 className="font-body font-medium text-[1.125rem] text-lg-text mb-2">
                  {plan.name}
                </h3>

                {/* Precio */}
                <div className="mb-8">
                  <span className="font-mono text-[2rem] font-medium gradient-text leading-none">
                    {plan.price}
                  </span>
                  {plan.priceNote && (
                    <span className="font-body text-sm text-lg-text-muted ml-2">
                      {plan.priceNote}
                    </span>
                  )}
                </div>

                {/* Descripción */}
                <p className="font-body text-sm text-lg-text-secondary leading-[1.65] mb-6">
                  {plan.description}
                </p>

                {/* Divisor */}
                <div className="border-t border-white/[0.06] mb-6" />

                {/* Features */}
                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-lg-text-secondary">
                      <span className="text-lg-green">
                        <IconCheck />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  href={plan.ctaHref}
                  variant={plan.featured ? "primary" : "secondary"}
                  className="w-full justify-center"
                >
                  {plan.cta}
                </Button>
              </div>

            </motion.div>
          ))}
        </motion.div>

        {/* Nota */}
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="font-body text-sm text-lg-text-muted text-center max-w-[560px] mx-auto"
        >
          Todos los proyectos arrancan con una auditoría gratuita.
          Si no encontramos oportunidades reales de mejora, te lo decimos.
        </motion.p>

      </div>
    </section>
  );
}

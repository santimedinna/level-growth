"use client";

import { motion } from "framer-motion";

/* ─── Animaciones ─────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ─── Íconos por paso ─────────────────────── */
function IconAudit() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8"  y1="11" x2="14" y2="11" />
    </svg>
  );
}

function IconDiagnosis() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="12" y2="17" />
    </svg>
  );
}

function IconBuild() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function IconTrack() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

/* ─── Datos ───────────────────────────────── */
const steps = [
  {
    icon:  <IconAudit />,
    title: "Auditoría",
    body:  "Analizamos tu sitio, tus ads y tu proceso de contacto. Sin costo.",
  },
  {
    icon:  <IconDiagnosis />,
    title: "Diagnóstico",
    body:  "En 48hs te entregamos un reporte con los problemas encontrados y las soluciones propuestas.",
  },
  {
    icon:  <IconBuild />,
    title: "Implementación",
    body:  "Ejecutamos los cambios acordados. Landing, publicidad o ambas.",
  },
  {
    icon:  <IconTrack />,
    title: "Seguimiento",
    body:  "Medimos resultados y optimizamos. El trabajo no termina cuando entregamos.",
  },
];

/* ─── Componente ──────────────────────────── */
export function Process() {
  return (
    <section
      id="proceso"
      className="bg-lg-bg-secondary py-[clamp(3.75rem,5vw,5rem)] px-[clamp(1.5rem,5vw,4rem)]"
    >
      <div className="max-w-[1200px] mx-auto">

        {/* Título */}
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="font-display font-semibold text-[clamp(1.75rem,3.5vw,2.25rem)] text-center text-lg-text mb-16"
        >
          Cómo trabajamos
        </motion.h2>

        {/* Steps */}
        <div className="relative">

          {/* Línea conectora — solo desktop (centrada con el ícono de 4rem) */}
          <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-white/[0.06] z-0" />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6"
          >
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                variants={fadeUp}
                className="relative z-10 flex flex-row md:flex-col items-start md:items-center gap-5 md:gap-5 md:text-center"
              >
                {/* Ícono grande con badge de número */}
                <div className="relative shrink-0">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-lg-green/[0.15] to-lg-blue/[0.08] border border-lg-green/20 flex items-center justify-center text-lg-green">
                    {step.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-lg-bg border border-lg-green/30 flex items-center justify-center font-mono text-[0.6rem] font-medium text-lg-green">
                    {i + 1}
                  </span>
                </div>

                {/* Conector vertical mobile */}
                {i < steps.length - 1 && (
                  <div className="md:hidden absolute left-8 top-16 bottom-[-2.5rem] w-px bg-white/[0.06]" />
                )}

                {/* Texto */}
                <div>
                  <h3 className="font-body font-medium text-[1.25rem] text-lg-text mb-2">
                    {step.title}
                  </h3>
                  <p className="font-body text-[1rem] text-lg-text-secondary leading-[1.65]">
                    {step.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}

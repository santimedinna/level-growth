"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { GrowthChart } from "@/components/charts/GrowthChart";
import { Button } from "@/components/ui/Button";

const WA_URL =
  "https://wa.me/5493512613927?text=Hola%20Santiago!%20Vi%20tu%20web%20y%20quiero%20saber%20m%C3%A1s%20sobre%20la%20auditor%C3%ADa%20gratuita.";

interface Stage {
  stage: string;
  period: string;
  title: string;
  body: string;
  highlight?: string;
  imageSrc: string | null;
  imageAlt: string;
}

const stages: Stage[] = [
  {
    stage: "ETAPA 01",
    period: "2021 — 2022",
    title: "Aprendí a vender",
    body: "Trabajé tres años vendiendo por WhatsApp para otros. Atendía entre 10 y 20 clientes por día y cerraba entre 1 y 5 ventas diarias. Ahí entendí lo que significa un sistema de ventas que escala.",
    imageSrc: "/images/Storytelling/vendiendo.svg",
    imageAlt: "Vendiendo por WhatsApp",
  },
  {
    stage: "ETAPA 02",
    period: "2022 — 2023",
    title: "Aprendí a construir",
    body: "Mientras vendía, empecé a estudiar publicidad digital y programación. Aprendí a leer datos, a manejar Google Ads y a desarrollar mis propios sitios. Las dos disciplinas que hoy son el corazón de Level Growth.",
    imageSrc: "/images/Storytelling/aprendiendo.svg",
    imageAlt: "Aprendiendo publicidad digital",
  },
  {
    stage: "ETAPA 03",
    period: "2023 — 2025",
    title: "Construí mi propio negocio",
    body: "Con $1.500 USD de inversión inicial, escalé un negocio propio hasta superar los $150.000 USD en facturación. De trabajar solo en mi casa pasé a una oficina con un socio y seis vendedores.",
    imageSrc: null,
    imageAlt: "Gráfico de crecimiento del negocio",
  },
  {
    stage: "ETAPA 04",
    period: "2025 — Hoy",
    title: "Nació Level Growth",
    body: "El negocio cerró por problemas de gestión interna — no por falta de clientes. Lo que me quedó fue la certeza de que un sistema de ventas bien armado puede escalar cualquier negocio.",
    highlight: "Ese sistema es hoy El Método Level Growth.",
    imageSrc: null,
    imageAlt: "",
  },
];

const textVariants = {
  enter:  { opacity: 0, x: 16 },
  center: { opacity: 1, x: 0,  transition: { duration: 0.4, ease: "easeOut" as const } },
  exit:   { opacity: 0, x: -16, transition: { duration: 0.22, ease: "easeIn" as const } },
};

const imageVariants = {
  enter:  { opacity: 0, scale: 0.95 },
  center: { opacity: 1, scale: 1,    transition: { duration: 0.45, ease: "easeOut" as const } },
  exit:   { opacity: 0, scale: 1.04, transition: { duration: 0.22, ease: "easeIn" as const } },
};

/* Crossfade derrotado → iluminado al montar la etapa 4 */
function Stage4Visual() {
  const [showIluminado, setShowIluminado] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowIluminado(true), 1100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative w-full max-w-[300px] mx-auto">
      <motion.img
        src="/images/Storytelling/iluminado.svg"
        alt="Nacimiento de Level Growth"
        className="w-full h-auto block"
        animate={{ opacity: showIluminado ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ opacity: showIluminado ? 0 : 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <img
          src="/images/Storytelling/derrotado.svg"
          alt="El negocio cerró"
          className="w-full h-auto block"
        />
      </motion.div>
    </div>
  );
}

/* ─── Componente principal ────────────────── */
export function CaseStudyStorytelling() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActiveStage(Math.min(3, Math.floor(v * 4)));
  });

  const s = stages[activeStage];

  return (
    <section
      ref={sectionRef}
      id="caso-de-exito"
      className="bg-lg-bg-secondary"
      style={{ minHeight: "380vh" }}
    >
      {/* Marco fijo */}
      <div className="sticky top-0 min-h-screen flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-4xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <p className="font-mono text-[0.7rem] text-lg-green uppercase tracking-[0.18em] mb-3">
              EL ORIGEN
            </p>
            <h2 className="font-display font-semibold text-[clamp(1.5rem,3vw,2rem)] text-lg-text">
              La historia detrás de Level Growth
            </h2>
          </div>

          {/* Contenido: imagen + texto */}
          <div className="grid md:grid-cols-2 gap-10 items-center">

            {/* Visual */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`visual-${activeStage}`}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="flex items-center justify-center"
              >
                {activeStage === 2 ? (
                  <div className="w-full max-w-[360px] mx-auto">
                    <GrowthChart />
                  </div>
                ) : activeStage === 3 ? (
                  <Stage4Visual />
                ) : (
                  <img
                    src={s.imageSrc!}
                    alt={s.imageAlt}
                    className="w-full h-auto max-w-[300px] mx-auto block"
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Texto */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${activeStage}`}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <p className="font-mono text-[0.65rem] text-lg-green uppercase tracking-[0.15em] mb-1">
                  {s.stage}
                </p>
                <p className="font-display text-lg text-lg-text-muted mb-3">
                  {s.period}
                </p>
                <h3 className="font-display font-semibold text-[clamp(1.2rem,2.5vw,1.6rem)] text-lg-text mb-4 leading-tight">
                  {s.title}
                </h3>
                <p className="font-body text-[1rem] text-lg-text-secondary leading-[1.7]">
                  {s.body}
                  {s.highlight && (
                    <>
                      {" "}
                      <span className="text-lg-green font-medium">{s.highlight}</span>
                    </>
                  )}
                </p>
              </motion.div>
            </AnimatePresence>

          </div>

          {/* Puntos de progreso */}
          <div className="flex justify-center gap-2 mt-10">
            {stages.map((_, i) => (
              <div
                key={i}
                className={[
                  "rounded-full transition-all duration-300",
                  i === activeStage
                    ? "w-5 h-2 bg-lg-green"
                    : "w-2 h-2 bg-white/20",
                ].join(" ")}
              />
            ))}
          </div>

          {/* Pista de scroll — solo en etapa 0 */}
          <AnimatePresence>
            {activeStage === 0 && (
              <motion.p
                className="text-center font-body text-[0.7rem] text-lg-text-muted mt-4 tracking-[0.08em] uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.9 } }}
                exit={{ opacity: 0 }}
              >
                Scrolleá para continuar ↓
              </motion.p>
            )}
          </AnimatePresence>

          {/* CTA — solo en etapa 3 */}
          <AnimatePresence>
            {activeStage === 3 && (
              <motion.div
                className="text-center mt-8"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.35 } }}
                exit={{ opacity: 0 }}
              >
                <p className="font-body text-lg-text-secondary mb-5">
                  Esa es la historia. Ahora es tu turno.
                </p>
                <Button href={WA_URL} external size="lg">
                  Quiero que analicen mi negocio
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </section>
  );
}

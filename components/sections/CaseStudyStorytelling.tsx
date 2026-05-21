"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { GrowthChart } from "@/components/charts/GrowthChart";
import { Button }      from "@/components/ui/Button";

const WA_URL =
  "https://wa.me/5493512613927?text=Hola%20Santiago!%20Vi%20tu%20web%20y%20quiero%20saber%20m%C3%A1s%20sobre%20la%20auditor%C3%ADa%20gratuita.";

/* ─── Variantes ──────────────────────────── */
const itemFade = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ─── Bloque de historia reutilizable ─────── */
interface BlockProps {
  stage:   string;
  period:  string;
  title:   string;
  body:    ReactNode;
  visual:  ReactNode;
  svgLeft: boolean;
}

function StoryBlock({ stage, period, title, body, visual, svgLeft }: BlockProps) {
  return (
    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">

      {/*
        Visual: siempre primero en el DOM → arriba en mobile.
        Si svgLeft=false, se mueve a la derecha en desktop con md:order-2.
      */}
      <motion.div
        className={svgLeft ? "" : "md:order-2"}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55, ease: "easeOut", delay: 0.3 }}
      >
        {visual}
      </motion.div>

      {/* Texto: abajo en mobile, izquierda si svgLeft=false */}
      <motion.div
        className={svgLeft ? "" : "md:order-1"}
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div variants={itemFade} className="mb-3">
          <p className="font-mono text-[0.65rem] text-lg-green uppercase tracking-[0.15em] mb-1">
            {stage}
          </p>
          <p className="font-display text-xl text-lg-text-muted">
            {period}
          </p>
        </motion.div>

        <motion.h3
          variants={itemFade}
          className="font-display font-semibold text-[clamp(1.3rem,2.5vw,1.75rem)] text-lg-text mb-4 leading-tight"
        >
          {title}
        </motion.h3>

        <motion.p
          variants={itemFade}
          className="font-body text-[1rem] text-lg-text-secondary leading-[1.7]"
        >
          {body}
        </motion.p>
      </motion.div>

    </div>
  );
}

/* ─── Componente principal ────────────────── */
export function CaseStudyStorytelling() {
  const block4Ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: block4Ref,
    offset: ["start end", "end start"],
  });

  /* Crossfade en el tramo central del scroll del bloque */
  const derrotadoOpacity = useTransform(scrollYProgress, [0.25, 0.55], [1, 0]);
  const iluminadoOpacity = useTransform(scrollYProgress, [0.25, 0.55], [0, 1]);

  return (
    <section id="caso-de-exito" className="bg-lg-bg-secondary py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4">

        {/* ── Header ── */}
        <motion.div
          className="text-center mb-16 md:mb-20"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <motion.p
            variants={itemFade}
            className="font-mono text-[0.7rem] text-lg-green uppercase tracking-[0.18em] mb-4"
          >
            EL ORIGEN
          </motion.p>
          <motion.h2
            variants={itemFade}
            className="font-display font-semibold text-[clamp(1.75rem,3.5vw,2.25rem)] text-lg-text"
          >
            La historia detrás de Level Growth
          </motion.h2>
        </motion.div>

        {/* ── Bloques narrativos ── */}
        <div className="space-y-12 md:space-y-16">

          {/* Bloque 1 — SVG derecha */}
          <StoryBlock
            stage="ETAPA 01"
            period="2021 — 2022"
            title="Aprendí a vender"
            body="Trabajé tres años vendiendo por WhatsApp para otros. Atendía entre 10 y 20 clientes por día y cerraba entre 1 y 5 ventas diarias. Ahí entendí lo que significa un sistema de ventas que escala."
            visual={
              <img
                src="/images/storytelling/vendiendo.svg"
                alt="Vendiendo por WhatsApp"
                className="w-full h-auto max-w-[400px] mx-auto block"
              />
            }
            svgLeft={false}
          />

          {/* Bloque 2 — SVG izquierda */}
          <StoryBlock
            stage="ETAPA 02"
            period="2022 — 2023"
            title="Aprendí a construir"
            body="Mientras vendía, empecé a estudiar publicidad digital y programación. Aprendí a leer datos, a manejar Google Ads y a desarrollar mis propios sitios. Las dos disciplinas que hoy son el corazón de Level Growth."
            visual={
              <img
                src="/images/storytelling/aprendiendo.svg"
                alt="Aprendiendo publicidad digital"
                className="w-full h-auto max-w-[400px] mx-auto block"
              />
            }
            svgLeft={true}
          />

          {/* Bloque 3 — GrowthChart derecha */}
          <StoryBlock
            stage="ETAPA 03"
            period="2023 — 2025"
            title="Construí mi propio negocio"
            body="Con $1.500 USD de inversión inicial, escalé un negocio propio hasta superar los $150.000 USD en facturación. De trabajar solo en mi casa pasé a una oficina con un socio y seis vendedores."
            visual={
              <div className="w-full max-w-[400px] mx-auto">
                <GrowthChart />
              </div>
            }
            svgLeft={false}
          />

          {/* Bloque 4 — Dual SVG crossfade, izquierda */}
          <div
            ref={block4Ref}
            className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
          >
            {/* Visual dual — izquierda en desktop, arriba en mobile */}
            <div className="relative">
              {/* iluminado: base que define la altura del contenedor */}
              <motion.div style={{ opacity: iluminadoOpacity }}>
                <img
                  src="/images/storytelling/iluminado.svg"
                  alt="Nacimiento de Level Growth"
                  className="w-full h-auto max-w-[400px] mx-auto block"
                />
              </motion.div>
              {/* derrotado: overlay absoluto que se desvanece al hacer scroll */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                style={{ opacity: derrotadoOpacity }}
              >
                <img
                  src="/images/storytelling/derrotado.svg"
                  alt="El negocio cerró"
                  className="w-full h-full object-contain max-w-[400px] mx-auto block"
                />
              </motion.div>
            </div>

            {/* Texto — derecha en desktop, abajo en mobile */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.div variants={itemFade} className="mb-3">
                <p className="font-mono text-[0.65rem] text-lg-green uppercase tracking-[0.15em] mb-1">
                  ETAPA 04
                </p>
                <p className="font-display text-xl text-lg-text-muted">
                  2025 — Hoy
                </p>
              </motion.div>

              <motion.h3
                variants={itemFade}
                className="font-display font-semibold text-[clamp(1.3rem,2.5vw,1.75rem)] text-lg-text mb-4 leading-tight"
              >
                Nació Level Growth
              </motion.h3>

              <motion.p
                variants={itemFade}
                className="font-body text-[1rem] text-lg-text-secondary leading-[1.7]"
              >
                El negocio cerró por problemas de gestión interna — no por falta
                de clientes. Lo que me quedó fue la certeza de que un sistema de
                ventas bien armado puede escalar cualquier negocio.{" "}
                <span className="text-lg-green font-medium">
                  Ese sistema es hoy El Método Level Growth.
                </span>
              </motion.p>
            </motion.div>
          </div>

        </div>

        {/* ── CTA ── */}
        <motion.div
          className="text-center mt-16 md:mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="font-body text-lg-text-secondary mb-6">
            Esa es la historia. Ahora es tu turno.
          </p>
          <Button href={WA_URL} external size="lg">
            Quiero que analicen mi negocio
          </Button>
        </motion.div>

      </div>
    </section>
  );
}

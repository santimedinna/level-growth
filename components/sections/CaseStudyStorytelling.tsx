"use client";

import { useRef, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { GrowthChart } from "@/components/charts/GrowthChart";
import { Button } from "@/components/ui/Button";

const WA_URL =
  "https://wa.me/5493512613927?text=Hola%20Santiago!%20Vi%20tu%20web%20y%20quiero%20saber%20m%C3%A1s%20sobre%20la%20auditor%C3%ADa%20gratuita.";

const itemFade = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ─── Bloque reutilizable ─────────────────── */
interface BlockProps {
  title:   string;
  body:    ReactNode;
  visual:  ReactNode;
  svgLeft: boolean;
}

function StoryBlock({ title, body, visual, svgLeft }: BlockProps) {
  return (
    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center md:min-h-[280px]">

      {/* Visual: siempre primero en DOM → arriba en mobile */}
      <motion.div
        className={svgLeft ? "" : "md:order-2"}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {visual}
      </motion.div>

      {/* Texto */}
      <motion.div
        className={svgLeft ? "" : "md:order-1"}
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
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

/* ─── Bloque 4: crossfade derrotado → iluminado al entrar al viewport ── */
function Stage4Visual() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [showIluminado, setShowIluminado] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setShowIluminado(true), 1500);
    return () => clearTimeout(t);
  }, [inView]);

  return (
    /* iluminado en flujo normal define la altura; derrotado absolutamente encima */
    <div ref={ref} className="relative max-w-[320px] mx-auto">
      <img
        src="/images/Storytelling/iluminado.svg"
        alt="Nacimiento de Level Growth"
        className="w-full h-auto block"
        style={{ opacity: showIluminado ? 1 : 0, transition: "opacity 1s ease-in-out" }}
      />
      <img
        src="/images/Storytelling/derrotado.svg"
        alt="El negocio cerró"
        className="absolute inset-0 w-full h-full object-contain"
        style={{ opacity: showIluminado ? 0 : 1, transition: "opacity 1s ease-in-out" }}
      />
    </div>
  );
}

/* ─── Componente principal ────────────────── */
export function CaseStudyStorytelling() {
  return (
    <section id="caso-de-exito" className="bg-lg-bg-secondary py-10 md:py-16">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <motion.div
          className="text-center mb-14 md:mb-16"
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

        {/* Bloques narrativos */}
        <div className="space-y-8 md:space-y-10">

          {/* Bloque 1 — SVG derecha */}
          <StoryBlock
            title="Aprendí a vender"
            body="Antes de Level Growth, vendí tres años por WhatsApp para otros. Entre 10 y 20 clientes por día, cerrando hasta 5 ventas diarias. Ahí entendí qué hace que un sistema de ventas escale — y qué lo frena."
            visual={
              <img
                src="/images/Storytelling/vendiendo.svg"
                alt="Vendiendo por WhatsApp"
                className="w-full h-auto max-w-[320px] mx-auto block"
              />
            }
            svgLeft={false}
          />

          {/* Bloque 2 — SVG izquierda */}
          <StoryBlock
            title="Aprendí a construir"
            body="Mientras vendía, estudié publicidad digital y programación. Aprendí a leer datos, a optimizar campañas y a desarrollar mis propios sitios. Las dos disciplinas que hoy son el corazón de Level Growth."
            visual={
              <img
                src="/images/Storytelling/aprendiendo.svg"
                alt="Aprendiendo publicidad digital"
                className="w-full h-auto max-w-[320px] mx-auto block"
              />
            }
            svgLeft={true}
          />

          {/* Bloque 3 — GrowthChart derecha */}
          <StoryBlock
            title="Construí mi propio negocio"
            body="Con $1.500 USD de inversión inicial, escalé un negocio propio hasta superar los $150.000 USD en facturación acumulada. De trabajar solo en mi casa a una oficina con un socio y seis vendedores."
            visual={
              <div className="w-full max-w-[360px] mx-auto">
                <GrowthChart />
              </div>
            }
            svgLeft={false}
          />

          {/* Bloque 4 — dual SVG crossfade, SVG izquierda */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center md:min-h-[280px]">

            {/* Visual — izquierda en desktop, arriba en mobile */}
            <Stage4Visual />

            {/* Texto — derecha en desktop */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
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

        {/* CTA */}
        <motion.div
          className="text-center mt-14 md:mt-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
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

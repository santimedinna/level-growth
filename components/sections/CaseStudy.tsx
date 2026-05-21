"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { GrowthChart } from "@/components/charts/GrowthChart";

/* ─── Animaciones ─────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ─── Métricas del caso ───────────────────── */
const caseMetrics = [
  { value: "100x",     label: "retorno sobre inversión inicial" },
  { value: "3 años",   label: "desde $0 hasta escala"          },
  { value: "$150K USD",label: "facturación generada con paid media" },
];

/* ─── Componente ──────────────────────────── */
export function CaseStudy() {
  return (
    <section
      id="caso-de-exito"
      className="py-[clamp(3.75rem,5vw,5rem)] px-[clamp(1.5rem,5vw,4rem)]"
      style={{ background: "linear-gradient(135deg, #0D1F4A 0%, #071a0e 100%)" }}
    >
      <div className="max-w-[1200px] mx-auto">

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col items-center text-center"
        >
          {/* Título */}
          <motion.h2
            variants={fadeUp}
            className="font-display font-semibold text-[clamp(1.75rem,3.5vw,2.25rem)] text-lg-text mb-8"
          >
            La historia detrás de Level Growth
          </motion.h2>

          {/* Historia — Párrafo 1 */}
          <motion.p
            variants={fadeUp}
            className="font-body text-[1.125rem] text-lg-text-secondary leading-[1.7] max-w-[680px] mb-4"
          >
            En 2020 arranqué un negocio propio con{" "}
            <span className="text-lg-text font-medium">$1.500 USD</span> de
            inversión en Google Ads. Sin equipo, sin oficina, sin experiencia
            previa en publicidad digital. Solo un producto que funcionaba y la
            necesidad de hacerlo crecer.
          </motion.p>

          {/* Historia — Párrafo 2 */}
          <motion.p
            variants={fadeUp}
            className="font-body text-[1.125rem] text-lg-text-secondary leading-[1.7] max-w-[680px] mb-4"
          >
            Durante 3 años manejé las campañas yo mismo. Aprendí a leer los datos,
            a cortar lo que no funcionaba y a duplicar lo que sí. El negocio pasó
            de ser yo solo en mi casa a una oficina con un socio y seis vendedores.
            La facturación acumulada con Google Ads como único canal superó los{" "}
            <span className="text-lg-text font-medium">$150.000 USD</span>.
          </motion.p>

          {/* Historia — Párrafo 3 */}
          <motion.p
            variants={fadeUp}
            className="font-body text-[1.125rem] text-lg-text-secondary leading-[1.7] max-w-[680px] mb-14"
          >
            El negocio cerró por problemas de gestión interna, no por falta de
            clientes. Lo que me quedó fue la certeza de que un sistema de
            ventas bien armado puede escalar cualquier negocio que tenga un
            producto probado. Así nacio{" "}
            <span className="text-lg-text font-medium">
              El Metodo Level Growth.
            </span>
          </motion.p>

          {/* Métricas grandes */}
          <motion.div
            variants={stagger}
            className="grid grid-cols-3 gap-8 text-center w-full"
          >
            {caseMetrics.map((m, i) => (
              <motion.div
                key={m.label}
                variants={fadeUp}
                className={[
                  "flex flex-col items-center gap-2 py-6",
                  i > 0 && "sm:border-l border-white/[0.08]",
                ].filter(Boolean).join(" ")}
              >
                <p className="font-mono text-2xl sm:text-3xl lg:text-5xl font-medium gradient-text leading-none whitespace-nowrap">
                  {m.value}
                </p>
                <p className="font-body text-xs text-lg-text-muted tracking-[0.08em] uppercase max-w-[140px] leading-relaxed">
                  {m.label}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Gráfico de crecimiento */}
          <motion.div variants={fadeUp} className="w-full max-w-[720px] mb-4">
            <GrowthChart />
          </motion.div>

          {/* Línea de tiempo */}
          <motion.div
            variants={fadeUp}
            className="w-full max-w-[600px] mb-14"
          >
            <div className="relative">
              {/* Línea base */}
              <div className="absolute top-3.5 left-8 right-8 h-px bg-white/[0.08]" />
              {/* Línea de progreso */}
              <div className="absolute top-3.5 left-8 right-8 h-px bg-gradient-to-r from-lg-green/50 via-lg-blue/30 to-transparent" />

              <div className="relative flex justify-between">
                {[
                  { year: "Año 1", value: "$1.5K",  label: "inversión inicial"   },
                  { year: "Año 2", value: "×10",    label: "primera escala"      },
                  { year: "Año 3", value: "$150K",  label: "facturación total"   },
                ].map((node, i) => (
                  <div key={node.year} className="flex flex-col items-center gap-2">
                    <div
                      className={[
                        "w-7 h-7 rounded-full border-2 flex items-center justify-center z-10 relative",
                        i === 2
                          ? "border-lg-green bg-lg-green/20"
                          : i === 1
                            ? "border-lg-blue/60 bg-lg-blue/10"
                            : "border-white/20 bg-lg-bg",
                      ].join(" ")}
                    >
                      <div
                        className={[
                          "w-2 h-2 rounded-full",
                          i === 2 ? "bg-lg-green" : i === 1 ? "bg-lg-blue/60" : "bg-white/30",
                        ].join(" ")}
                      />
                    </div>
                    <span className="font-mono text-[0.65rem] text-lg-text-muted uppercase tracking-[0.08em]">
                      {node.year}
                    </span>
                    <span className="font-mono text-sm font-medium gradient-text">
                      {node.value}
                    </span>
                    <span className="font-body text-[0.7rem] text-lg-text-muted text-center leading-snug max-w-[90px]">
                      {node.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          

          {/* CTA */}
          <motion.div variants={fadeUp}>
            <Button
              href="https://wa.me/5493512613927?text=Hola%20Santiago!%20Vi%20tu%20web%20y%20quiero%20saber%20m%C3%A1s%20sobre%20la%20auditor%C3%ADa%20gratuita."
              external
              size="lg"
            >
              Quiero que analicen mi negocio →
            </Button>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}

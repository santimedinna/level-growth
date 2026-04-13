"use client";

import { motion, type Variants } from "framer-motion";
import { Badge } from "@/components/ui/Badge";

/* ─── Animaciones ─────────────────────────── */
const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
};

const staggerContainer: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ─── Métricas ────────────────────────────── */
const STATS = [
  { value: "+40",  label: "sitios auditados"              },
  { value: "$0",   label: "cobrados por esta herramienta" },
];

/* ─── Componente ──────────────────────────── */
export function Santiago() {
  return (
    <section className="px-[clamp(1.5rem,5vw,4rem)] py-[clamp(5rem,12vw,10rem)]">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          {/* ── Columna izquierda — foto ── */}
          <motion.div variants={fadeUp}>
            <div
              className="w-full flex flex-col items-center justify-center gap-3 rounded-xl"
              style={{
                aspectRatio:     "3 / 4",
                background:      "#0D1221",
                border:          "1px solid rgba(63,200,122,0.25)",
                borderRadius:    "12px",
              }}
            >
              <span className="text-4xl">📷</span>
              <p className="font-body text-sm text-lg-text-muted">Foto próximamente</p>
            </div>
          </motion.div>

          {/* ── Columna derecha — texto ── */}
          <motion.div variants={staggerContainer} className="flex flex-col gap-6">
            <motion.div variants={fadeUp}>
              <Badge>El equipo</Badge>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="font-display font-bold text-[clamp(1.5rem,3vw,2.2rem)] leading-tight text-white"
            >
              No somos una agencia más
            </motion.h2>

            <motion.p variants={fadeUp} className="font-body text-[1rem] text-lg-text-secondary leading-[1.7]">
              Level Growth nació de una obsesión: entender por qué negocios con buen producto y buena
              publicidad igual pierden clientes. La respuesta casi siempre estaba en el medio — la web,
              el mensaje, el momento en que el visitante decide si confía o se va.
            </motion.p>

            <motion.p variants={fadeUp} className="font-body text-[1rem] text-lg-text-secondary leading-[1.7]">
              Soy Santiago Medina. Construí Level Growth para darle a cualquier negocio las mismas
              herramientas de conversión que usan las empresas que más crecen — sin el precio de una
              agencia multinacional y sin vueltas.
            </motion.p>

            <motion.p variants={fadeUp} className="font-body text-[1rem] text-lg-text-secondary leading-[1.7]">
              Cada sitio que auditamos, cada funnel que optimizamos, parte de datos reales. No de
              suposiciones, no de tendencias del momento.
            </motion.p>

            {/* Métricas */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4 mt-2">
              {STATS.map(({ value, label }) => (
                <div
                  key={label}
                  className="rounded-xl p-4 border border-white/[0.08]"
                  style={{ background: "#0D1221" }}
                >
                  <p className="font-mono font-medium text-[1.8rem] leading-none text-white mb-1">
                    {value}
                  </p>
                  <p className="font-body text-[0.75rem] text-lg-text-muted leading-snug">
                    {label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

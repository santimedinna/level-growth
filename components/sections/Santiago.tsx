"use client";

import { motion, type Variants } from "framer-motion";

/* ─── Animaciones ─────────────────────────── */
const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
};

const staggerContainer: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12 } },
};

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
{/* ── Columna izquierda — foto de Santiago ── */}
<motion.div variants={fadeUp} className="flex justify-center lg:justify-end">
  <div className="relative w-48 sm:w-56 lg:w-64">
    <img
      src="/images/Santiago/Santiago.webp"
      alt="Santiago Medina — Fundador de Level Growth"
      className="w-full h-auto rounded-2xl object-cover"
      style={{
        opacity: 0.85,
        mixBlendMode: "luminosity",
        filter: "contrast(1.05)",
      }}
      fetchPriority="high"
    />
    {/* Gradiente inferior para fundir con el fondo */}
    <div
      className="absolute bottom-0 inset-x-0 h-1/3 rounded-b-2xl pointer-events-none"
      style={{ background: "linear-gradient(to bottom, transparent, #080C14)" }}
    />
  </div>
</motion.div>

          {/* ── Columna derecha — texto ── */}
          <motion.div variants={staggerContainer} className="flex flex-col gap-6">
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

          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

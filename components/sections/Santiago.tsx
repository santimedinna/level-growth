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
<motion.div 
  variants={fadeUp || {}} // El || {} evita que rompa si fadeUp no está definido en este archivo
  className="relative"
>
  <div
    className="w-full flex items-end justify-center rounded-xl overflow-hidden"
    style={{
      aspectRatio: "4 / 5",
      border: "1px solid rgba(63,200,122,0.15)",
      position: "relative",
      background: "transparent", // Aseguramos que no haya fondo sólido
    }}
  >
    {/* Resplandor de fondo para dar profundidad */}
    <div 
      className="absolute inset-0 opacity-20"
      style={{
        background: "radial-gradient(circle at center, #3FC87A 0%, transparent 70%)",
        filter: "blur(40px)",
        zIndex: 0
      }}
    />

    <img
      src="\images\Santiago\Santiago.webp" 
      alt="Santiago - Fundador de Level Growth"
      className="w-full h-full object-contain object-bottom relative z-10"
      style={{ display: "block" }}
      fetchPriority="high" 
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

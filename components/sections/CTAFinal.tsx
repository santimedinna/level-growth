"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

/* ─── Animaciones ─────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.15 } },
};

/* ─── Componente ──────────────────────────── */
export function CTAFinal() {
  return (
    <section
      id="cta-final"
      className="py-[120px] px-[clamp(1.5rem,5vw,4rem)]"
      style={{
        background:
          "linear-gradient(135deg, #0D1F4A 0%, #071a0e 60%, #080C14 100%)",
      }}
    >
      <div className="max-w-[680px] mx-auto text-center">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col items-center gap-6"
        >
          {/* Título */}
          <motion.h2
            variants={fadeUp}
            className="font-display font-bold text-[clamp(2rem,4vw,3rem)] text-lg-text leading-tight"
          >
            ¿Listo para saber qué está frenando tus ventas?
          </motion.h2>

          {/* Subtítulo */}
          <motion.p
            variants={fadeUp}
            className="font-body text-[1.125rem] text-lg-text-secondary leading-[1.7] max-w-[520px]"
          >
            La auditoría es gratuita. El diagnóstico es honesto.
            Y si no encontramos nada para mejorar, te lo decimos.
          </motion.p>

          {/* CTA principal */}
          <motion.div variants={fadeUp}>
            <Button href="/contacto" size="lg">
              Quiero mi auditoría gratis →
            </Button>
          </motion.div>

          {/* Link secundario WhatsApp */}
          <motion.div variants={fadeUp}>
            <a
              href="https://wa.me/5493512613927?text=Hola%20Santiago!%20Vi%20tu%20web%20y%20quiero%20saber%20m%C3%A1s%20sobre%20la%20auditor%C3%ADa%20gratuita."
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm text-lg-text-muted hover:text-lg-green transition-colors duration-200"
            >
              ¿Preferís respuesta inmediata? Escribinos por WhatsApp →
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

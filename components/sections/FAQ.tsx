"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { faqs } from "@/lib/data/faq";

/* ─── Animaciones ─────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ─── Item del acordeón ───────────────────── */
interface FAQItemProps {
  faq:       { question: string; answer: string };
  isOpen:    boolean;
  onToggle:  () => void;
}

function FAQItem({ faq, isOpen, onToggle }: FAQItemProps) {
  return (
    <motion.div
      variants={fadeUp}
      className="border-b border-white/[0.06]"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-6 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lg-green/50 rounded"
        aria-expanded={isOpen}
      >
        <span className={[
          "font-body font-medium text-[1rem] leading-snug transition-colors duration-200",
          isOpen ? "text-lg-text" : "text-lg-text-secondary",
        ].join(" ")}>
          {faq.question}
        </span>

        {/* Ícono +/– */}
        <span
          className={[
            "shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300",
            isOpen
              ? "border-lg-green/40 text-lg-green rotate-45"
              : "border-white/20 text-lg-text-muted",
          ].join(" ")}
          aria-hidden
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="5" y1="1" x2="5" y2="9" />
            <line x1="1" y1="5" x2="9" y2="5" />
          </svg>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="font-body text-sm text-lg-text-secondary leading-[1.7] pb-5 max-w-[640px]">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Componente ──────────────────────────── */
export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) =>
    setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <section
      id="faq"
      className="bg-lg-bg-secondary py-[clamp(3.75rem,5vw,5rem)] px-[clamp(1.5rem,5vw,4rem)]"
    >
      <div className="max-w-[720px] mx-auto">

        {/* Título */}
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="font-display font-semibold text-[clamp(1.75rem,3.5vw,2.25rem)] text-center text-lg-text mb-12"
        >
          Preguntas frecuentes
        </motion.h2>

        {/* Acordeón */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {faqs.map((faq, i) => (
            <FAQItem
              key={faq.question}
              faq={faq}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </motion.div>

      </div>
    </section>
  );
}

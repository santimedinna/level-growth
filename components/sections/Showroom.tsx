"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { Badge } from "@/components/ui/Badge";

/* ─── Animaciones ─────────────────────────── */
const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
};

const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ─── Sub-componentes ─────────────────────── */

function PageSpeedRow({ scores }: { scores: { label: string; value: number }[] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {scores.map(({ label, value }) => (
        <span key={label} className="font-body text-[0.75rem] text-[#3FC87A]">
          <span className="font-mono font-medium">{value}</span>{" "}
          <span className="text-[#4A6070]">{label}</span>
        </span>
      ))}
    </div>
  );
}

function SiteButton({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-[#3FC87A] border border-[#3FC87A]/30 px-4 py-2 rounded-lg hover:border-[#3FC87A]/70 hover:bg-[#3FC87A]/5 transition-all duration-200"
    >
      Ver sitio →
    </a>
  );
}

function ScenarioBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex self-start items-center gap-1.5 px-3 py-1.5 rounded-full border text-[0.7rem] font-body font-medium"
      style={{ borderColor: "#3FC87A40", backgroundColor: "#3FC87A12", color: "#3FC87A" }}>
      {label}
    </span>
  );
}

/* ─── Componente principal ────────────────── */
export function Showroom() {
  return (
    <section className="px-[clamp(1.5rem,5vw,4rem)] py-[clamp(5rem,12vw,10rem)]"
      style={{ background: "#0D1221" }}>
      <div className="max-w-[1200px] mx-auto">

        {/* Encabezado */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-16"
        >
          <motion.div variants={fadeUp} className="mb-4">
            <Badge>Casos reales</Badge>
          </motion.div>
          <motion.h2 variants={fadeUp}
            className="font-display font-bold text-[clamp(1.5rem,3vw,2.2rem)] leading-tight text-white mb-4">
            Sitios que construimos
          </motion.h2>
          <motion.p variants={fadeUp}
            className="font-body text-[1rem] text-[#7A8FA6] max-w-[520px] mx-auto leading-[1.7]">
            Cada proyecto parte de un diagnóstico real. Los resultados son verificables.
          </motion.p>
        </motion.div>

        {/* ── CASO 1 — La Jungla Encantada ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="rounded-xl border border-white/[0.08] p-6 md:p-8 mb-8"
          style={{ background: "#080C14" }}
        >
          <motion.div variants={fadeUp} className="mb-6">
            <p className="font-body text-sm font-medium text-white mb-1">La Jungla Encantada</p>
            <p className="font-body text-[0.8rem] text-[#4A6070] mb-1">
              Alquiler de inflables y juegos para eventos — Córdoba
            </p>
            <p className="font-body text-[0.8rem] text-[#7A8FA6]">
              Diseño y desarrollo desde cero. Copy orientado a conversión. Optimización técnica completa.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

            {/* Antes */}
            <motion.div variants={fadeUp} className="flex flex-col gap-4">
              <p className="font-body text-[0.65rem] font-medium uppercase tracking-[0.12em]"
                style={{ color: "#EF4444" }}>
                Antes
              </p>

              <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-white/[0.06]">
                <Image
                  src="/images/showroom/pagina vieja la jungla encantada.png"
                  alt="Sitio anterior La Jungla Encantada"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              <div className="relative w-full rounded-lg overflow-hidden border border-white/[0.06]">
                <Image
                  src="/images/showroom/La Jungla vieja auditor LG.png"
                  alt="Auditoría Level Growth — sitio anterior La Jungla"
                  width={600}
                  height={300}
                  className="w-full h-auto"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </motion.div>

            {/* Después */}
            <motion.div variants={fadeUp} className="flex flex-col gap-4">
              <p className="font-body text-[0.65rem] font-medium uppercase tracking-[0.12em]"
                style={{ color: "#3FC87A" }}>
                Después
              </p>

              <div className="relative w-full rounded-lg overflow-hidden border border-white/[0.06]">
                <Image
                  src="/images/showroom/La Jungla Encantada auditor LG.png"
                  alt="Auditoría Level Growth — sitio nuevo La Jungla Encantada"
                  width={600}
                  height={300}
                  className="w-full h-auto"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              <div className="relative w-full rounded-lg overflow-hidden border border-white/[0.06]">
                <Image
                  src="/images/showroom/la jungla encantada page speed.png"
                  alt="PageSpeed — sitio nuevo La Jungla Encantada"
                  width={600}
                  height={200}
                  className="w-full h-auto"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              <div className="flex flex-col gap-3">
                <ScenarioBadge label="83/100 · La Puerta Giratoria" />
                <PageSpeedRow scores={[
                  { label: "Rendimiento",     value: 96  },
                  { label: "Accesibilidad",   value: 100 },
                  { label: "Recomendaciones", value: 100 },
                  { label: "SEO",             value: 100 },
                ]} />
                <SiteButton href="https://la-jungla-encantada.vercel.app/" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ── CASO 2 — Rap Thai ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="rounded-xl border border-white/[0.08] p-6 md:p-8"
          style={{ background: "#080C14" }}
        >
          <motion.div variants={fadeUp} className="mb-6">
            <p className="font-body text-sm font-medium text-white mb-1">Rap Thai</p>
            <p className="font-body text-[0.8rem] text-[#4A6070] mb-1">
              Gimnasio de Muay Thai — Córdoba
            </p>
            <p className="font-body text-[0.8rem] text-[#7A8FA6]">
              Diseño y desarrollo desde cero. Video en hero. Testimonios reales de alumnos. Optimización técnica completa.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

            {/* Antes */}
            <motion.div variants={fadeUp} className="flex flex-col gap-4">
              <p className="font-body text-[0.65rem] font-medium uppercase tracking-[0.12em]"
                style={{ color: "#EF4444" }}>
                Antes
              </p>

              <div className="w-full aspect-video rounded-lg border border-white/[0.06] flex flex-col items-center justify-center gap-3"
                style={{ background: "#0D1221" }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                </svg>
                <p className="font-body text-sm font-medium text-[#7A8FA6]">Sin presencia web</p>
                <p className="font-body text-[0.75rem] text-[#4A6070] text-center max-w-[180px]">
                  El negocio existía. Sus clientes potenciales no lo encontraban.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {["Sin sitio", "Sin SEO", "Sin conversión digital"].map((tag) => (
                  <span key={tag} className="font-body text-[0.7rem] px-2.5 py-1 rounded border"
                    style={{ borderColor: "#EF444440", backgroundColor: "#EF444412", color: "#EF4444" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Después */}
            <motion.div variants={fadeUp} className="flex flex-col gap-4">
              <p className="font-body text-[0.65rem] font-medium uppercase tracking-[0.12em]"
                style={{ color: "#3FC87A" }}>
                Después
              </p>

              <div className="relative w-full rounded-lg overflow-hidden border border-white/[0.06]">
                <Image
                  src="/images/showroom/Rap Thai auditor LG.png"
                  alt="Auditoría Level Growth — Rap Thai"
                  width={600}
                  height={300}
                  className="w-full h-auto"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              <div className="relative w-full rounded-lg overflow-hidden border border-white/[0.06]">
                <Image
                  src="/images/showroom/rap thai page speed.png"
                  alt="PageSpeed — Rap Thai"
                  width={600}
                  height={200}
                  className="w-full h-auto"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              <div className="flex flex-col gap-3">
                <ScenarioBadge label="88/100 · La Máquina de Ventas" />
                <PageSpeedRow scores={[
                  { label: "Rendimiento",     value: 93  },
                  { label: "Accesibilidad",   value: 100 },
                  { label: "Recomendaciones", value: 100 },
                  { label: "SEO",             value: 100 },
                ]} />
                <SiteButton href="https://rap-thai.vercel.app/" />
              </div>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

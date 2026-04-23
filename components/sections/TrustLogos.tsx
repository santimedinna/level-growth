"use client";

import { motion, type Variants } from "framer-motion";

/* ─── Animaciones ─────────────────────────── */
const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ─── Íconos de herramientas ──────────────── */
function IconGoogleAds() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path
        d="M21.35 11.1H12.18V13.83H18.69C18.36 17.64 15.19 19.27 12.19 19.27C8.36 19.27 5 16.28 5 12C5 7.8 8.29 4.73 12.19 4.73C15.285 4.73 16.95 5.898 17.738 6.478L19.724 4.539C18.144 3.028 15.767 2 12.19 2C6.727 2 2.1 6.498 2.1 12C2.1 17.501 6.497 22 12.19 22C17.394 22 21.71 18.44 21.71 12.978C21.71 12.028 21.612 11.498 21.35 11.1Z"
        fill="#4285F4"
      />
    </svg>
  );
}

function IconMeta() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="#0082FB">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

function IconClarity() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#00A3E0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IconNextJs() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 16.633L9.75 7.5H8.25v9h1.5v-6.633l7.244 9.133c-.972.637-2.064 1.074-3.244 1.306V16.5h-1.5v3.75c-3.728-.609-6.75-3.694-6.75-7.5S8.272 5.359 12 4.75V8.25h1.5V4.75c3.728.609 6.75 3.694 6.75 7.5 0 1.823-.655 3.494-1.731 4.8L14.25 12.75V7.5h-1.5v9h1.5v-2.367l2.394 3.022c-.239.18-.49.346-.75.478z"/>
    </svg>
  );
}

/* ─── Datos ───────────────────────────────── */
const tools = [
  {
    name:  "Google Ads",
    icon:  <IconGoogleAds />,
    desc:  "Capturamos clientes que ya están buscando lo que vos vendés",
  },
  {
    name:  "Meta Ads",
    icon:  <IconMeta />,
    desc:  "Llegamos a tu cliente ideal antes de que sepa que te necesita",
  },
  {
    name:  "Microsoft Clarity",
    icon:  <IconClarity />,
    desc:  "Vemos exactamente dónde perdés clientes dentro de tu web",
  },
  {
    name:  "Next.js",
    icon:  <IconNextJs />,
    desc:  "Webs que cargan en menos de 1 segundo — la misma tecnología que usa TikTok y Netflix",
  },
];

/* ─── Componente ──────────────────────────── */
export function TrustLogos() {
  return (
    <section
      aria-label="Herramientas"
      className="border-t border-b border-white/[0.04] py-16 px-[clamp(1.5rem,5vw,4rem)]"
    >
      <div className="max-w-[1200px] mx-auto">

        <p className="font-body text-[0.7rem] text-lg-text-muted text-center tracking-[0.12em] uppercase mb-10">
          Cada peso invertido, medido
        </p>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {tools.map((tool) => (
            <motion.div
              key={tool.name}
              variants={fadeUp}
              className="flex flex-col gap-3 p-5 rounded-xl border"
              style={{
                background:   "#0D1221",
                borderColor:  "rgba(255,255,255,0.08)",
                borderRadius: "12px",
              }}
            >
              {tool.icon}
              <p className="font-body font-medium text-sm text-white">
                {tool.name}
              </p>
              <p className="font-body text-[0.8rem] text-lg-text-secondary leading-[1.6]">
                {tool.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

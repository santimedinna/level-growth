"use client";

import { motion } from "framer-motion";

/* ─── Animaciones ─────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ─── Íconos de herramientas ──────────────── */
function IconGoogleAds() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M21.35 11.1H12.18V13.83H18.69C18.36 17.64 15.19 19.27 12.19 19.27C8.36 19.27 5 16.28 5 12C5 7.8 8.29 4.73 12.19 4.73C15.285 4.73 16.95 5.898 17.738 6.478L19.724 4.539C18.144 3.028 15.767 2 12.19 2C6.727 2 2.1 6.498 2.1 12C2.1 17.501 6.497 22 12.19 22C17.394 22 21.71 18.44 21.71 12.978C21.71 12.028 21.612 11.498 21.35 11.1Z"
        fill="#4285F4"
      />
    </svg>
  );
}

function IconMeta() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#0082FB">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

function IconAnalytics() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="2"  y="14" width="4" height="8" rx="1" fill="#E8710A" />
      <rect x="9"  y="8"  width="4" height="14" rx="1" fill="#FBBC04" />
      <rect x="16" y="3"  width="4" height="19" rx="1" fill="#34A853" />
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#25D366">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/* ─── Datos ───────────────────────────────── */
const logos = [
  { name: "Google Ads",       icon: <IconGoogleAds />  },
  { name: "Meta Ads",         icon: <IconMeta />       },
  { name: "Google Analytics", icon: <IconAnalytics />  },
  { name: "WhatsApp Business",icon: <IconWhatsApp />   },
];

/* ─── Componente ──────────────────────────── */
export function TrustLogos() {
  return (
    <section
      aria-label="Herramientas"
      className="border-t border-b border-white/[0.04] py-10 px-[clamp(1.5rem,5vw,4rem)]"
    >
      <div className="max-w-[1200px] mx-auto">

        <p className="font-body text-[0.7rem] text-lg-text-muted text-center tracking-[0.12em] uppercase mb-8">
          Herramientas que usamos
        </p>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-6 md:gap-12"
        >
          {logos.map((logo) => (
            <motion.div
              key={logo.name}
              variants={fadeUp}
              className="flex items-center gap-2.5 opacity-40 hover:opacity-75 transition-opacity duration-200"
            >
              {logo.icon}
              <span className="font-body text-sm font-medium text-lg-text-secondary whitespace-nowrap">
                {logo.name}
              </span>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

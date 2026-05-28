"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TESTIMONIOS = [
  {
    nombre:  "Gian",
    negocio: "La Jungla Encantada",
    imagen:  "/images/testimonios/logo-la-jungla-encantada.webp",
    esLogo:  true,
    texto:   "Sos crack Santi. La página quedó de 10 y anda muy bien. Ya puedo jubilar tranquilo el linktree viejo, ahora me encuentra más gente y cuando me mandan mensajes ya saben qué juego quieren alquilar.",
  },
  {
    nombre:  "Alejandro",
    negocio: "Kerby Taller",
    imagen:  "/images/testimonios/kerby.webp",
    esLogo:  false,
    texto:   "Tengo el taller hace más de 30 años y nunca había pasado un verano tan flojo. Santiago me armó el perfil de Google y empezó a aparecer gente nueva. El primer mes tuve varias consultas y clientes que llegaron por Google Maps. La verdad me dio un poco de aire.",
  },
  {
    nombre:  "Nico",
    negocio: "Rap Thai",
    imagen:  "/images/testimonios/logo-rap-thai.webp",
    esLogo:  false,
    texto:   "Santi logro mostrar exactamente lo que se vive en el Rap Thai. La página y el instagram transmiten la energía de los chicos y se nota cuando llega gente nueva o vamos a un evento.",
  },
];

/* ─── Contenido interno de cada card ─────── */
function CardContent({
  t,
  index,
  isActive,
  keyForStars,
}: {
  t: typeof TESTIMONIOS[0];
  index: number;
  isActive: boolean;
  keyForStars?: number;
}) {
  return (
    <>
      {/* Estrellas en cascada */}
      <div className="flex gap-1 relative z-10">
        {[...Array(5)].map((_, i) => (
          <motion.svg
            key={`${keyForStars ?? index}-${i}`}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="#F59E0B"
            initial={{ opacity: 0, scale: 0, rotate: -30 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ delay: i * 0.12, duration: 0.4, ease: "backOut" }}
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </motion.svg>
        ))}
      </div>

      {/* Texto */}
      <p
        className="font-body text-[0.95rem] leading-[1.7] relative z-10 transition-colors duration-300"
        style={{ color: isActive ? "#C5D0DC" : "#7A8FA6" }}
      >
        &ldquo;{t.texto}&rdquo;
      </p>

      {/* Footer */}
      <div className="border-t border-white/[0.06] pt-4 mt-auto flex items-center gap-3 relative z-10">
        {t.esLogo ? (
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center overflow-hidden shrink-0">
            <img src={t.imagen} alt={t.negocio} className="w-8 h-8 object-contain" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white/10 bg-white/5">
            <img
              src={t.imagen}
              alt={t.nombre}
              className="w-full h-full object-cover"
              style={{ objectPosition: "center" }}
            />
          </div>
        )}
        <div>
          <p className="font-body font-medium text-white text-sm">{t.nombre}</p>
          <p className="font-body text-xs" style={{ color: "#4A6070" }}>{t.negocio}</p>
        </div>
      </div>
    </>
  );
}

/* ─── Link a reseñas de Google ────────────── */
function GoogleReviewsLink() {
  return (
    <motion.div
      className="text-center mt-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <p className="font-body text-xs" style={{ color: "#4A6070" }}>
        ¿Trabajaste con nosotros?{" "}
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline transition-colors"
          style={{ color: "#7A8FA6" }}
        >
          Sumá tu opinión
        </a>
        .
      </p>
    </motion.div>
  );
}

/* ─── Componente principal ────────────────── */
export function Testimonios() {
  const [active, setActive]       = useState(0);
  const [paused, setPaused]       = useState(false);
  const [hoveredCard, setHovered] = useState<number | null>(null);

  /* Autoplay — solo activo en mobile */
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActive(prev => (prev + 1) % TESTIMONIOS.length);
    }, 7000);
    return () => clearInterval(id);
  }, [paused, active]);

  const navigateTo = (i: number) => {
    setActive(i);
    setPaused(true);
    setTimeout(() => setPaused(false), 3000);
  };

  return (
    <section
      id="testimonios"
      className="px-[clamp(1.5rem,5vw,4rem)] py-[clamp(4rem,10vw,8rem)]"
      style={{ background: "#080C14" }}
    >
      {/* Keyframe shimmer — solo para desktop */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      ` }} />

      <div className="max-w-[1200px] mx-auto">

        {/* Encabezado */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: "#3FC87A" }}>
            Lo que dicen los que ya trabajaron con nosotros
          </p>
          <h2 className="font-display font-bold text-[clamp(1.5rem,3vw,2.2rem)] leading-tight text-white">
            Resultados que hablan por sí solos
          </h2>
        </motion.div>

        {/* ── DESKTOP: 3 cards con spotlight ── */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {TESTIMONIOS.map((t, i) => (
            <motion.div
              key={t.nombre}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              animate={{
                y:       hoveredCard === i ? -4 : 0,
                opacity: hoveredCard === null || hoveredCard === i ? 1 : 0.5,
                filter:  hoveredCard === null || hoveredCard === i
                  ? "saturate(1)"
                  : "saturate(0.5)",
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative flex flex-col gap-5 rounded-xl p-6 border cursor-default overflow-hidden"
              style={{
                background:  "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
                borderColor: hoveredCard === i ? "rgba(63,200,122,0.4)" : "rgba(255,255,255,0.08)",
                boxShadow:   hoveredCard === i ? "0 8px 32px rgba(63,200,122,0.15)" : "none",
                transition:  "border-color 0.3s, box-shadow 0.3s",
              }}
            >
              {/* Shimmer sweep en hover */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  opacity:        hoveredCard === i ? 1 : 0,
                  background:     "linear-gradient(120deg, transparent 30%, rgba(63,200,122,0.08) 50%, transparent 70%)",
                  backgroundSize: "200% 100%",
                  animation:      hoveredCard === i ? "shimmer 1.2s ease-in-out" : "none",
                  transition:     "opacity 0.3s",
                }}
              />
              <CardContent t={t} index={i} isActive={hoveredCard === i} />
            </motion.div>
          ))}
        </div>

        {/* Link Google — desktop */}
        <div className="hidden md:block">
          <GoogleReviewsLink />
        </div>

        {/* ── MOBILE: una card con borde orbitando ── */}
        <div className="md:hidden overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -50) {
                  setActive((active + 1) % TESTIMONIOS.length);
                } else if (info.offset.x > 50) {
                  setActive((active - 1 + TESTIMONIOS.length) % TESTIMONIOS.length);
                }
                setTimeout(() => setPaused(false), 3000);
              }}
              className="testimonio-card-wrapper"
            >
              {/* SVG cometa dinámico — cola difusa + cuerpo brillante superpuestos */}
              <svg
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{ width: "100%", height: "100%", zIndex: 2 }}
              >
                <defs>
                  {/* Glow amplio para la cola */}
                  <filter id="glow-soft" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  {/* Glow ajustado para el cuerpo */}
                  <filter id="glow-sharp" x="-15%" y="-15%" width="130%" height="130%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Contorno base siempre visible */}
                <rect
                  x="1" y="1" rx="11" ry="11"
                  fill="none"
                  stroke="rgba(63,200,122,0.08)"
                  strokeWidth="1"
                  style={{ width: "calc(100% - 2px)", height: "calc(100% - 2px)" }}
                />

                {/* Cola — larga, blur amplio, se arrastra 14% detrás del cuerpo */}
                <rect
                  x="1" y="1" rx="11" ry="11"
                  fill="none" stroke="#3FC87A"
                  strokeWidth="3" strokeLinecap="round"
                  pathLength={100} strokeDasharray="22 78" strokeOpacity={0.35}
                  filter="url(#glow-soft)"
                  style={{
                    width: "calc(100% - 2px)", height: "calc(100% - 2px)",
                    animation: "border-trace 7s linear infinite",
                    animationDelay: "-4.5s",
                  }}
                />

                {/* Cuerpo — corto, blur preciso, lidera el movimiento */}
                <rect
                  x="1" y="1" rx="11" ry="11"
                  fill="none" stroke="#C4F5DD"
                  strokeWidth="2" strokeLinecap="round"
                  pathLength={100} strokeDasharray="10 90"
                  filter="url(#glow-sharp)"
                  style={{
                    width: "calc(100% - 2px)", height: "calc(100% - 2px)",
                    animation: "border-trace 7s linear infinite",
                    animationDelay: "-5.5s",
                  }}
                />
              </svg>
              <div className="testimonio-card-content relative flex flex-col gap-5 p-5">
                <CardContent
                  t={TESTIMONIOS[active]}
                  index={active}
                  isActive={true}
                  keyForStars={active}
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Indicadores — solo mobile */}
          <div className="flex justify-center items-center gap-1.5 mt-5">
            {TESTIMONIOS.map((_, i) => (
              <button
                key={i}
                onClick={() => navigateTo(i)}
                aria-label={`Ver testimonio ${i + 1}`}
                className="rounded-full transition-all duration-300"
                style={{
                  width:      active === i ? "20px" : "5px",
                  height:     "5px",
                  background: active === i ? "#3FC87A" : "rgba(255,255,255,0.2)",
                }}
              />
            ))}
          </div>

          {/* Link Google — mobile */}
          <GoogleReviewsLink />
        </div>

      </div>
    </section>
  );
}

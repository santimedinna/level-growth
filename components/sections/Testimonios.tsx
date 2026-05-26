"use client";

import { motion } from "framer-motion";

interface Testimonio {
  nombre:  string;
  negocio: string;
  imagen:  string | null;
  esLogo:  boolean;
  texto:   string;
  metrica: string | null;
}

const TESTIMONIOS: Testimonio[] = [
  {
    nombre:  "Gian",
    negocio: "La Jungla Encantada",
    imagen:  "/images/testimonios/logo-la-jungla-encantada.webp",
    esLogo:  true,
    texto:   "Sos crack Santi! La página quedo de 10 y anda muy bien. Ya puedo jubilar tranquilo el linktree viejo, ahora me encuentra mas gente y cuando me mandan mensajes ya saben que juego quieren alquilar.",
    metrica: null,
  },
  {
    nombre:  "Alejandro",
    negocio: "Kerby Taller",
    imagen:  null,
    esLogo:  false,
    texto:   "Tengo el taller hace más de 30 años y nunca había pasado un verano tan flojo. Santiago me armó el perfil de Google y empezó a aparecer gente nueva. El primer mes tuve varias consultas y clientes que llegaron por Google Maps. La verdad me dio un poco de aire.",
    metrica: "428 visitas · 47 cómo llegar · 4 llamadas — primer mes",
  },
  {
    nombre:  "Nico",
    negocio: "Rap Thai",
    imagen:  "/images/testimonios/logo-rap-thai.webp",
    esLogo:  false,
    texto:   "Santi logro mostrar exactamente lo que se vive en el Rap Thai. La página y el instagram transmiten la energía de los chicos y se nota cuando llega gente nueva o vamos a un evento.",
    metrica: null,
  },
];

function Avatar({ t }: { t: Testimonio }) {
  if (t.esLogo && t.imagen) {
    return (
      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center overflow-hidden shrink-0">
        <img src={t.imagen} alt={t.negocio} className="w-8 h-8 object-contain" />
      </div>
    );
  }

  if (!t.esLogo && t.imagen) {
    return (
      <img
        src={t.imagen}
        alt={t.nombre}
        className="w-10 h-10 rounded-full object-cover shrink-0 border border-white/10"
      />
    );
  }

  /* Fallback: fondo azul con iniciales / nombre corto */
  return (
    <div
      className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center border border-white/10"
      style={{ background: "#1E3A5F" }}
    >
      <span className="font-mono text-[0.6rem] font-medium text-white leading-none text-center px-1">
        {t.negocio.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
      </span>
    </div>
  );
}

export function Testimonios() {
  return (
    <section
      id="testimonios"
      className="bg-lg-bg px-[clamp(1.5rem,5vw,4rem)] py-[clamp(4rem,10vw,8rem)]"
    >
      <div className="max-w-[1200px] mx-auto">

        {/* Encabezado */}
        <div className="text-center mb-12">
          <p
            className="font-mono text-xs tracking-widest uppercase mb-3"
            style={{ color: "#3FC87A" }}
          >
            Lo que dicen los que ya trabajaron con nosotros
          </p>
          <h2 className="font-display font-bold text-[clamp(1.5rem,3vw,2.2rem)] leading-tight text-white">
            Resultados que hablan por sí solos
          </h2>
        </div>

        {/* Grid de cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIOS.map((t, index) => (
            <motion.div
              key={t.nombre}
              className="flex flex-col gap-5 rounded-xl p-6 border border-white/[0.08]"
              style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))" }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Estrellas */}
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              {/* Texto */}
              <p
                className="font-body text-[0.95rem] leading-[1.7]"
                style={{ color: "#7A8FA6" }}
              >
                &ldquo;{t.texto}&rdquo;
              </p>

              {/* Métrica (solo si existe) */}
              {t.metrica && (
                <p className="font-mono text-[0.75rem]" style={{ color: "#3FC87A" }}>
                  {t.metrica}
                </p>
              )}

              {/* Separador + autor */}
              <div className="border-t border-white/[0.06] pt-4 mt-auto flex items-center gap-3">
                <Avatar t={t} />
                <div>
                  <p className="font-body font-medium text-white text-sm">{t.nombre}</p>
                  <p className="font-body text-xs" style={{ color: "#4A6070" }}>{t.negocio}</p>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

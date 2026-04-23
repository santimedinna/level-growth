import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "Proyectos — Level Growth",
  description: "Casos reales de sitios que construimos y los resultados verificables que obtuvieron.",
};

export default function ProyectosPage() {
  return (
    <main className="max-w-[1200px] mx-auto px-[clamp(1.5rem,5vw,4rem)] py-[clamp(5rem,12vw,10rem)]">

      {/* Hero */}
      <div className="mb-16 max-w-[680px]">
        <p className="font-body text-xs text-[#3FC87A] uppercase tracking-[0.12em] mb-4">
          Proyectos
        </p>
        <h1 className="font-display font-bold text-[clamp(2rem,4vw,3rem)] text-white leading-tight mb-4">
          Máquinas de venta a medida.
        </h1>
        <p className="font-body text-[1.125rem] text-[#7A8FA6] leading-[1.7]">
          Una web lenta pierde clientes antes de que lean una sola palabra. Construimos con Next.js porque la velocidad es nuestra prioridad número uno — y nuestros números lo prueban.
        </p>
      </div>

      {/* Grid de cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Rap Thai */}
        <a
          href="/proyectos/rap-thai"
          className="group flex flex-col rounded-xl overflow-hidden border border-white/[0.08] hover:border-[#3FC87A]/30 transition-all duration-300"
          style={{ background: "#0D1221" }}
        >
          <div className="relative h-48 overflow-hidden">
            <img
              src="/images/showroom/rap-thai-showroom.webp"
              alt="Rap Thai"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D1221]/80 via-transparent to-transparent" />
          </div>
          <div className="p-6 flex flex-col flex-1 gap-3">
            <p className="font-body text-xs text-[#3FC87A] uppercase tracking-[0.1em]">Muay Thai — Córdoba</p>
            <h2 className="font-display font-bold text-xl text-white group-hover:text-[#3FC87A] transition-colors duration-200">
              Rap Thai
            </h2>
            <p className="font-body text-sm text-[#7A8FA6] leading-[1.65] flex-1">
              De cero presencia digital a 88/100 en el auditor y 93/100 en PageSpeed mobile.
            </p>
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
              <span className="font-mono text-xs text-[#4A6070]">93 · 100 · 100 · 100</span>
              <span className="font-body text-sm font-medium text-[#3FC87A]">Ver caso →</span>
            </div>
          </div>
        </a>

        {/* La Jungla Encantada */}
        <a
          href="/proyectos/la-jungla-encantada"
          className="group flex flex-col rounded-xl overflow-hidden border border-white/[0.08] hover:border-[#3FC87A]/30 transition-all duration-300"
          style={{ background: "#0D1221" }}
        >
          <div className="relative h-48 overflow-hidden">
            <img
              src="/images/showroom/La-jungla-showroom.webp"
              alt="La Jungla Encantada"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D1221]/80 via-transparent to-transparent" />
          </div>
          <div className="p-6 flex flex-col flex-1 gap-3">
            <p className="font-body text-xs text-[#3FC87A] uppercase tracking-[0.1em]">Inflables — Córdoba</p>
            <h2 className="font-display font-bold text-xl text-white group-hover:text-[#3FC87A] transition-colors duration-200">
              La Jungla Encantada
            </h2>
            <p className="font-body text-sm text-[#7A8FA6] leading-[1.65] flex-1">
              De un Linktree con PageSpeed 68 a un sitio con 96/100 en rendimiento.
            </p>
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
              <span className="font-mono text-xs text-[#4A6070]">96 · 100 · 100 · 100</span>
              <span className="font-body text-sm font-medium text-[#3FC87A]">Ver caso →</span>
            </div>
          </div>
        </a>

        {/* Próximo proyecto placeholder */}
        <div
          className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.1] p-8"
          style={{ background: "#0D1221", minHeight: 280 }}
        >
          <p className="font-body text-sm font-medium text-[#4A6070] mb-1">Próximo proyecto</p>
          <p className="font-body text-xs" style={{ color: "rgba(74,96,112,0.6)" }}>En construcción</p>
        </div>

      </div>
    </main>
  );
}

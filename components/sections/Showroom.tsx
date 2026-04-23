
/* ─── Datos de proyectos ──────────────────── */
const PROJECTS = [
  {
    name:            "Rap Thai",
    niche:           "Muay Thai — Córdoba",
    url:             "https://rap-thai.vercel.app/",
    image:           "/images/showroom/rap-thai-showroom.webp",
    pagespeedMobile: "93 · 100 · 100 · 100",
    pagespeedDesktop:"100 · 100 · 100 · 100",
  },
  {
    name:            "La Jungla Encantada",
    niche:           "Alquiler de inflables — Córdoba",
    url:             "https://la-jungla-encantada.vercel.app/",
    image:           "/images/showroom/La-jungla-showroom.webp",
    pagespeedMobile: "96 · 100 · 100 · 100",
    pagespeedDesktop:"100 · 100 · 100 · 100",
  },
];

/* ─── Mockup de browser ───────────────────── */
function BrowserMockup({ url, image, name }: { url: string; image: string; name: string }) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-[#1a1a2e]">
      {/* Barra superior */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-[#1a1a2e] border-b border-white/[0.06]">
        <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        <span className="font-mono text-[0.6rem] text-[#4A6070] ml-2 truncate">
          {url.replace("https://", "")}
        </span>
      </div>

      {/* Imagen del sitio */}
      <a href={url} target="_blank" rel="noopener noreferrer">
        <img
          src={image}
          alt={name}
          className="w-full block"
          loading="lazy"
        />
      </a>

      {/* Barra inferior estilo macOS dock */}
      <div className="hidden md:flex items-center justify-center gap-3 px-4 py-2 bg-[#1a1a2e] border-t border-white/[0.06]">
        {/* Finder */}
        <div className="w-6 h-6 rounded-md bg-[#2a2a3e] flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
            <rect width="24" height="24" rx="4" fill="#00BFFF" opacity="0.3"/>
            <circle cx="12" cy="10" r="4" stroke="#00BFFF" strokeWidth="1.5"/>
            <path d="M8 10 Q12 14 16 10" stroke="#00BFFF" strokeWidth="1.5" fill="none"/>
          </svg>
        </div>
        {/* Chrome */}
        <div className="w-6 h-6 rounded-md bg-[#2a2a3e] flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
            <circle cx="12" cy="12" r="5" stroke="#3FC87A" strokeWidth="1.5"/>
            <circle cx="12" cy="12" r="2" fill="#3FC87A"/>
            <path d="M12 7 L21 7" stroke="#EF4444" strokeWidth="1.5"/>
            <path d="M7.5 15.5 L3 22" stroke="#FBBF24" strokeWidth="1.5"/>
            <path d="M16.5 15.5 L21 22" stroke="#3B82F6" strokeWidth="1.5"/>
          </svg>
        </div>
        {/* Terminal */}
        <div className="w-6 h-6 rounded-md bg-[#2a2a3e] flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
            <path d="M4 6 L10 12 L4 18" stroke="#3FC87A" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M12 18 L20 18" stroke="#3FC87A" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        {/* Separador */}
        <div className="w-px h-4 bg-white/10 mx-1" />
        {/* Punto activo */}
        <div className="w-1 h-1 rounded-full bg-[#3FC87A] opacity-60" />
      </div>
    </div>
  );
}

/* ─── Componente principal ────────────────── */
export function Showroom() {
  return (
    <section className="px-[clamp(1.5rem,5vw,4rem)] py-[clamp(5rem,12vw,10rem)]">
      <div className="max-w-[1200px] mx-auto">

        {/* Encabezado */}
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-[clamp(1.5rem,3vw,2.2rem)] leading-tight text-white">
            Trabajo real. Resultados verificables.
          </h2>
          <p className="font-body text-[1rem] text-[#7A8FA6] leading-[1.7] mt-3">
            Una web lenta pierde clientes antes de que lean una sola palabra. Por eso la velocidad es nuestra prioridad.
          </p>
        </div>

        {/* Grid de proyectos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PROJECTS.map(({ name, niche, url, image, pagespeedMobile }) => (
            <div key={name} className="flex flex-col gap-4">
              <BrowserMockup url={url} image={image} name={name} />

              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="font-body font-medium text-white">{name}</p>
                  <p className="font-body text-[0.8rem] text-[#4A6070]">{niche}</p>
                  <p className="font-mono text-sm mt-1" style={{ color: "#3FC87A" }}>
                    {pagespeedMobile}
                    <span className="font-body text-[0.65rem] text-[#4A6070] ml-1.5">
                      PageSpeed mobile
                    </span>
                  </p>
                </div>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-1 font-body text-sm font-medium text-[#3FC87A] border border-[#3FC87A]/30 px-4 py-2 rounded-lg hover:border-[#3FC87A]/70 hover:bg-[#3FC87A]/5 transition-all duration-200 whitespace-nowrap"
                >
                  Ver sitio →
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

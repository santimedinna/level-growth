
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
    <div className="rounded-xl overflow-hidden border border-white/[0.08]"
      style={{ background: "#080C14" }}>
      {/* Barra superior */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.06]">
        <span className="w-3 h-3 rounded-full" style={{ background: "#EF4444" }} />
        <span className="w-3 h-3 rounded-full" style={{ background: "#F59E0B" }} />
        <span className="w-3 h-3 rounded-full" style={{ background: "#3FC87A" }} />
        <span className="font-mono text-[0.6rem] text-[#4A6070] ml-2 truncate">
          {url.replace("https://", "")}
        </span>
      </div>

      {/* Imagen del sitio — click abre en nueva pestaña */}
      <a href={url} target="_blank" rel="noopener noreferrer">
        <img
          src={image}
          alt={name}
          className="w-full rounded-b-lg"
          style={{ display: "block" }}
          loading="lazy"
        />
      </a>
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

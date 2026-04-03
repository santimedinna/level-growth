/* ─── Footer ──────────────────────────────────────────────────────────────
   Número de WhatsApp y redes se completan cuando estén disponibles.
   ───────────────────────────────────────────────────────────────────────── */

const serviciosLinks = [
  { label: "Auditoría de funnel",     href: "/servicios#auditoria" },
  { label: "Optimización de landing", href: "/servicios#landing" },
  { label: "Gestión de publicidad",   href: "/servicios#publicidad" },
  { label: "Funnel completo",         href: "/servicios#funnel-completo" },
];

const recursosLinks = [
  { label: "Blog",            href: "/blog" },
  { label: "Casos de éxito",  href: "/#caso-de-exito" },
  { label: "FAQ",             href: "/#faq" },
];

export function Footer() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  return (
    <footer className="bg-lg-bg border-t border-white/[0.06]">
      <div className="max-w-[1200px] mx-auto px-[clamp(1.5rem,5vw,4rem)] py-16">

        {/* Grid principal */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Columna 1 — Marca */}
          <div className="lg:col-span-1">
            <a
              href="/"
              className="font-display font-bold text-xl text-lg-text tracking-tight hover:text-lg-green transition-colors duration-200"
            >
              Level<span className="text-lg-green">Growth</span>
            </a>
            <p className="mt-4 font-body text-sm text-lg-text-secondary leading-relaxed max-w-[240px]">
              Especialistas en funnel completo y paid media. Desde el primer clic del ad hasta el cliente que paga.
            </p>
          </div>

          {/* Columna 2 — Servicios */}
          <div>
            <h3 className="font-body font-medium text-xs text-lg-text-muted tracking-[0.1em] uppercase mb-5">
              Servicios
            </h3>
            <ul className="flex flex-col gap-3">
              {serviciosLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-body text-sm text-lg-text-secondary hover:text-lg-text transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3 — Recursos */}
          <div>
            <h3 className="font-body font-medium text-xs text-lg-text-muted tracking-[0.1em] uppercase mb-5">
              Recursos
            </h3>
            <ul className="flex flex-col gap-3">
              {recursosLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-body text-sm text-lg-text-secondary hover:text-lg-text transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4 — Contacto */}
          <div>
            <h3 className="font-body font-medium text-xs text-lg-text-muted tracking-[0.1em] uppercase mb-5">
              Contacto
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href="mailto:contacto@levelgrowth.com.ar"
                  className="font-body text-sm text-lg-text-secondary hover:text-lg-text transition-colors duration-200"
                >
                  contacto@levelgrowth.com.ar
                </a>
              </li>
              {whatsapp && (
                <li>
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-sm text-lg-text-secondary hover:text-lg-text transition-colors duration-200"
                  >
                    WhatsApp
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-lg-text-muted">
            © 2025 Level Growth. Todos los derechos reservados.
          </p>
          <p className="font-body text-xs text-lg-text-muted">
            Hecho en Argentina 🇦🇷
          </p>
        </div>
      </div>
    </footer>
  );
}

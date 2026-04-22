"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

/* ─── Links de navegación ─────────────────── */
const navLinks = [
  { label: "Servicios",       href: "/#servicios" },
  { label: "Proyectos",        href: "/proyectos" },
  { label: "Blog",            href: "/blog" },
  { label: "Contacto",        href: "/contacto" },
];

export function Header() {
  const [scrolled,     setScrolled]     = useState(false);
  const [menuAbierto,  setMenuAbierto]  = useState(false);

  /* Detectar scroll para cambiar fondo del header */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Cerrar menú al redimensionar a desktop */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuAbierto(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header
      className={[
        "fixed top-0 inset-x-0 z-50",
        "transition-all duration-300",
        scrolled
          ? "bg-lg-bg/90 backdrop-blur-md border-b border-white/[0.06]"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="max-w-[1200px] mx-auto px-[clamp(1.5rem,5vw,4rem)]">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <a
            href="/"
            className="font-display font-bold text-lg text-lg-text tracking-tight hover:text-lg-green transition-colors duration-200"
          >
            Level<span className="text-lg-green">Growth</span>
          </a>

          {/* Navegación desktop */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Navegación principal">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-body text-sm text-lg-text-secondary hover:text-lg-text transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA desktop */}
          <div className="hidden md:block">
            <Button href="/contacto" size="sm">
              Auditoría gratis
            </Button>
          </div>

          {/* Botón hamburguesa mobile */}
          <button
            className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lg-green/50 rounded"
            onClick={() => setMenuAbierto((v) => !v)}
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuAbierto}
          >
            <span
              className={[
                "block h-[1.5px] w-full bg-lg-text transition-transform duration-300 origin-center",
                menuAbierto && "translate-y-[6.5px] rotate-45",
              ].filter(Boolean).join(" ")}
            />
            <span
              className={[
                "block h-[1.5px] w-full bg-lg-text transition-opacity duration-300",
                menuAbierto && "opacity-0",
              ].filter(Boolean).join(" ")}
            />
            <span
              className={[
                "block h-[1.5px] w-full bg-lg-text transition-transform duration-300 origin-center",
                menuAbierto && "-translate-y-[6.5px] -rotate-45",
              ].filter(Boolean).join(" ")}
            />
          </button>
        </div>
      </div>

      {/* Menú mobile */}
      <div
        className={[
          "md:hidden overflow-hidden transition-all duration-300",
          "bg-lg-bg/95 backdrop-blur-md border-b border-white/[0.06]",
          menuAbierto ? "max-h-80 opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
        aria-hidden={!menuAbierto}
      >
        <nav
          className="flex flex-col px-[clamp(1.5rem,5vw,4rem)] py-4 gap-4"
          aria-label="Navegación mobile"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-body text-base text-lg-text-secondary hover:text-lg-text transition-colors duration-200 py-1"
              onClick={() => setMenuAbierto(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 pb-1">
            <Button href="/contacto" size="sm" className="w-full justify-center">
              Auditoría gratis
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}

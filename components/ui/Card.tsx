/* ─── Card ────────────────────────────────────────────────────────────────
   Contenedor base con fondo sutil y borde. Soporta hover interactivo
   para las cards de servicios, problemas y precios.
   ───────────────────────────────────────────────────────────────────────── */

interface CardProps {
  children:   React.ReactNode;
  className?: string;
  /** Activa el efecto hover (borde verde + escala leve) */
  interactive?: boolean;
  /** Fondo alternativo más oscuro */
  dark?: boolean;
}

export function Card({
  children,
  className   = "",
  interactive = false,
  dark        = false,
}: CardProps) {
  return (
    <div
      className={[
        "rounded-card border p-6",
        dark
          ? "bg-lg-bg border-white/[0.06]"
          : "bg-gradient-to-br from-white/[0.04] to-white/[0.01] border-white/[0.08]",
        interactive && [
          "transition-all duration-300 cursor-default",
          "hover:border-lg-green/20 hover:scale-[1.01]",
          "hover:shadow-[0_0_30px_rgba(63,200,122,0.05)]",
        ].join(" "),
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

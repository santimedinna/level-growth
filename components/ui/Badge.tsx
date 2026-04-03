/* ─── Badge ───────────────────────────────────────────────────────────────
   Etiqueta pequeña usada para categorías y labels en cards y secciones.
   ───────────────────────────────────────────────────────────────────────── */

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={[
        "inline-block",
        "text-lg-green border border-lg-green/30",
        "text-[10px] font-body font-medium",
        "tracking-[0.1em] uppercase",
        "px-3 py-1 rounded-badge",
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

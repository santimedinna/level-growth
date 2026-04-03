"use client";

import { forwardRef } from "react";

/* ─── Tipos ───────────────────────────────── */
type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize    = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?:    ButtonSize;
  /** Renderiza como <a> cuando se provee href */
  href?:    string;
  /** Abre el link en nueva pestaña */
  external?: boolean;
}

/* ─── Estilos por variante ────────────────── */
const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    "bg-gradient-to-br from-lg-green-dark to-[#1a7a4e]",
    "text-white font-medium",
    "shadow-[0_0_20px_rgba(43,168,106,0.3)]",
    "hover:brightness-110 active:brightness-95",
  ].join(" "),

  secondary: [
    "border border-white/10 text-lg-text-secondary",
    "hover:border-white/20 hover:text-lg-text",
  ].join(" "),

  ghost: [
    "text-lg-green",
    "hover:text-lg-text",
  ].join(" "),
};

/* ─── Estilos por tamaño ──────────────────── */
const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs tracking-[0.08em] uppercase",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

/* ─── Componente ──────────────────────────── */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant  = "primary",
      size     = "md",
      href,
      external = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const base = [
      "inline-flex items-center justify-center gap-2",
      "rounded-button font-body font-medium",
      "transition-all duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lg-green/50",
      "disabled:opacity-50 disabled:pointer-events-none",
    ].join(" ");

    const classes = `${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    /* Renderiza como enlace si se pasa href */
    if (href) {
      return (
        <a
          href={href}
          className={classes}
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };

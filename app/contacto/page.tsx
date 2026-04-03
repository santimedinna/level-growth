import type { Metadata } from "next";
import { ContactForm } from "@/components/sections/ContactForm";

export const metadata: Metadata = {
  title: "Contacto — Auditoría gratuita",
  description:
    "Pedí tu auditoría gratuita. Analizamos tu sitio web y tu publicidad y te mostramos exactamente dónde perdés clientes.",
};

export default function ContactoPage() {
  return (
    <section className="py-[clamp(5rem,12vw,10rem)] px-[clamp(1.5rem,5vw,4rem)]">
      <div className="max-w-[1200px] mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Columna izquierda — copy */}
          <div className="lg:sticky lg:top-32">
            <span className="inline-block text-lg-green border border-lg-green/30 text-[10px] font-body font-medium tracking-[0.1em] uppercase px-3 py-1 rounded-badge mb-6">
              Auditoría gratuita
            </span>

            <h1 className="font-display font-bold text-[clamp(2rem,4vw,3rem)] text-lg-text leading-tight mb-6">
              Empezamos con
              una auditoría{" "}
              <span className="gradient-text">sin costo</span>
            </h1>

            <p className="font-body text-[1.125rem] text-lg-text-secondary leading-[1.7] mb-10">
              Completá el formulario y en 48 horas hábiles te enviamos un diagnóstico
              honesto de tu negocio. Si no encontramos oportunidades reales, te lo decimos.
            </p>

            {/* Puntos de valor */}
            <ul className="flex flex-col gap-4">
              {[
                "Análisis de tu sitio web y experiencia del usuario",
                "Revisión de tu publicidad activa (si tenés)",
                "Diagnóstico de tu proceso de atención y cierre",
                "Reporte en PDF + llamada de 30 minutos",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-lg-text-secondary font-body">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3FC87A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Columna derecha — formulario */}
          <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] rounded-card p-8">
            <ContactForm />
          </div>

        </div>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { AuditorTool } from "./AuditorTool";

export const metadata: Metadata = {
  title: "Auditoría Web Gratis — Descubrí dónde perdés clientes",
  description:
    "Analizamos la velocidad, el SEO, el copy y las llamadas a la acción de tu sitio web en menos de 60 segundos. Gratis y sin registro.",
};

export default function AuditoriaWebPage() {
  return (
    <main
      className="min-h-screen pt-24 pb-24 px-[clamp(1.5rem,5vw,4rem)]"
      style={{ background: "#080C14" }}
    >
      <div className="max-w-[760px] mx-auto">

        {/* Encabezado */}
        <div className="text-center mb-12">
          <span className="font-body text-[#3FC87A] border border-[#3FC87A]/30 text-[10px] font-medium tracking-[0.1em] uppercase px-3 py-1 rounded inline-block mb-5">
            Herramienta gratuita
          </span>

          <h1 className="font-display font-bold text-[clamp(1.9rem,4.5vw,3rem)] text-white leading-tight mb-5">
            Descubrí dónde tu sitio{" "}
            <span
              style={{
                background:            "linear-gradient(90deg, #3FC87A, #4A9EE0)",
                WebkitBackgroundClip:  "text",
                WebkitTextFillColor:   "transparent",
              }}
            >
              pierde clientes
            </span>
          </h1>

          <p className="font-body text-[1.05rem] text-[#7A8FA6] leading-[1.7] max-w-[520px] mx-auto">
            Ingresá la URL de tu sitio y en menos de 60 segundos te mostramos exactamente
            qué está frenando tus ventas, sin tecnicismos, en lenguaje de negocio.
          </p>
        </div>

        {/* Herramienta interactiva */}
        <Suspense>
          <AuditorTool />
        </Suspense>

        {/* Nota al pie */}
        <p className="font-body text-xs text-[#4A6070] text-center mt-10">
          El análisis es orientativo y se basa en datos públicos de tu sitio.
          Para un diagnóstico completo, solicitá la auditoría profesional gratuita.
        </p>

      </div>
    </main>
  );
}

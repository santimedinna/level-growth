import type { Metadata } from "next";
import { LaJunglaCase } from "@/components/sections/proyectos/LaJunglaCase";
import { RapThaiCase }  from "@/components/sections/proyectos/RapThaiCase";

export const metadata: Metadata = {
  title:       "Proyectos — Level Growth",
  description: "Casos reales de sitios que construimos y los resultados verificables que obtuvieron.",
};

export default function ProyectosPage() {
  return (
    <main className="max-w-[1200px] mx-auto px-[clamp(1.5rem,5vw,4rem)] py-[clamp(5rem,12vw,10rem)]">

      {/* Encabezado de la página */}
      <header className="mb-20">
        <p className="font-body text-xs text-[#3FC87A] uppercase tracking-[0.12em] mb-3">
          Casos de éxito
        </p>
        <h1 className="font-display font-bold text-[clamp(2rem,5vw,3.5rem)] text-white leading-tight mb-4">
          Trabajo real. Sin adornos.
        </h1>
        <p className="font-body text-[1.05rem] text-[#7A8FA6] leading-[1.7] max-w-[560px]">
          Cada proyecto arrancó con un diagnóstico claro. Lo que ves acá son los resultados que se pueden medir.
        </p>
      </header>

      {/* Separador entre casos */}
      <div className="divide-y divide-white/[0.06]">
        <div className="pb-24">
          <RapThaiCase />
        </div>
        <div className="pt-24">
          <LaJunglaCase />
        </div>
      </div>

    </main>
  );
}

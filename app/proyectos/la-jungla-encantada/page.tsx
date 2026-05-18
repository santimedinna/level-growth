import type { Metadata } from "next";
import { LaJunglaContent } from "./LaJunglaContent";
import { SchemaScript }    from "@/components/ui/SchemaScript";
import { buildBreadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title:       "La Jungla Encantada — Level Growth",
  description: "Cómo transformamos el Linktree de La Jungla Encantada en un sitio con 96/100 en PageSpeed y 83/100 en el auditor de conversión.",
};

const breadcrumb = buildBreadcrumbSchema([
  { name: "Inicio",               url: "https://levelgrowthagency.com" },
  { name: "Proyectos",            url: "https://levelgrowthagency.com/proyectos" },
  { name: "La Jungla Encantada",  url: "https://levelgrowthagency.com/proyectos/la-jungla-encantada" },
]);

export default function LaJunglaPage() {
  return (
    <>
      <SchemaScript schema={breadcrumb} />
      <LaJunglaContent />
    </>
  );
}

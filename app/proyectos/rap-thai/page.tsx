import type { Metadata } from "next";
import { RapThaiContent }  from "./RapThaiContent";
import { SchemaScript }    from "@/components/ui/SchemaScript";
import { buildBreadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title:       "Rap Thai — Level Growth",
  description: "Cómo construimos desde cero el sitio de Rap Thai Muay Thai en Córdoba. 93/100 en PageSpeed mobile, 88/100 en el auditor de conversión.",
};

const breadcrumb = buildBreadcrumbSchema([
  { name: "Inicio",    url: "https://levelgrowthagency.com" },
  { name: "Proyectos", url: "https://levelgrowthagency.com/proyectos" },
  { name: "Rap Thai",  url: "https://levelgrowthagency.com/proyectos/rap-thai" },
]);

export default function RapThaiPage() {
  return (
    <>
      <SchemaScript schema={breadcrumb} />
      <RapThaiContent />
    </>
  );
}

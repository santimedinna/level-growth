import type { Metadata } from "next";
import { RapThaiContent } from "./RapThaiContent";

export const metadata: Metadata = {
  title:       "Rap Thai — Level Growth",
  description: "Cómo construimos desde cero el sitio de Rap Thai Muay Thai en Córdoba. 93/100 en PageSpeed mobile, 88/100 en el auditor de conversión.",
};

export default function RapThaiPage() {
  return <RapThaiContent />;
}

import type { Metadata } from "next";
import { LaJunglaContent } from "./LaJunglaContent";

export const metadata: Metadata = {
  title:       "La Jungla Encantada — Level Growth",
  description: "Cómo transformamos el Linktree de La Jungla Encantada en un sitio con 96/100 en PageSpeed y 83/100 en el auditor de conversión.",
};

export default function LaJunglaPage() {
  return <LaJunglaContent />;
}

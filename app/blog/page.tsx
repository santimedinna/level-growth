import type { Metadata } from "next";
import { getAllPosts } from "@/lib/mdx";
import { Badge } from "@/components/ui/Badge";
import { BlogGrid } from "./BlogGrid";

export const metadata: Metadata = {
  title:       "El día a día — Level Growth",
  description: "Nuestras bases, lo que aprendemos y lo que construimos. Sin filtro.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <section className="py-[clamp(5rem,12vw,10rem)] px-[clamp(1.5rem,5vw,4rem)]">
      <div className="max-w-[1200px] mx-auto">

        {/* Encabezado */}
        <div className="max-w-[640px] mb-16">
          <div className="mb-4">
            <Badge>El día a día</Badge>
          </div>
          <h1 className="font-display font-bold text-[clamp(2rem,4vw,3rem)] text-lg-text leading-tight mb-4">
            Lo que hacemos, lo que aprendemos y en qué nos basamos
          </h1>
          <p className="font-body text-[1.125rem] text-lg-text-secondary leading-[1.7]">
            Auditorías reales, referencias que usamos y el detrás de escena de construir webs que venden. Sin términos vacíos.
          </p>
        </div>

        <BlogGrid posts={posts} />

      </div>
    </section>
  );
}

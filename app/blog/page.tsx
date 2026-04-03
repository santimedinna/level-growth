import type { Metadata } from "next";
import { getAllPosts, formatDate } from "@/lib/mdx";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title:       "Blog de Growth y Marketing Digital",
  description: "Artículos sobre optimización de funnel, publicidad paga y estrategias de conversión para negocios en Argentina y Latinoamérica.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <section className="py-[clamp(5rem,12vw,10rem)] px-[clamp(1.5rem,5vw,4rem)]">
      <div className="max-w-[1200px] mx-auto">

        {/* Encabezado */}
        <div className="max-w-[640px] mb-16">
          <div className="mb-4">
            <Badge>Blog</Badge>
          </div>
          <h1 className="font-display font-bold text-[clamp(2rem,4vw,3rem)] text-lg-text leading-tight mb-4">
            Sin vueltas sobre growth,
            funnels y publicidad
          </h1>
          <p className="font-body text-[1.125rem] text-lg-text-secondary leading-[1.7]">
            Casos reales, errores que cometimos y lo que aprendimos. Sin términos
            vacíos, sin promesas imposibles.
          </p>
        </div>

        {/* Grid de posts */}
        {posts.length === 0 ? (
          <p className="font-body text-lg-text-muted text-center py-20">
            No hay artículos publicados aún.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <a
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] rounded-card overflow-hidden hover:border-lg-green/20 transition-all duration-300"
              >
                {/* Placeholder de imagen */}
                <div className="h-44 bg-lg-bg-tertiary flex items-center justify-center border-b border-white/[0.06]">
                  <span className="font-mono text-lg-text-muted text-xs tracking-widest uppercase">
                    Level Growth
                  </span>
                </div>

                {/* Contenido */}
                <div className="flex flex-col flex-1 p-6 gap-3">
                  <div className="flex items-center gap-3">
                    <Badge>{post.category}</Badge>
                    <span className="font-body text-xs text-lg-text-muted">{post.readTime}</span>
                  </div>

                  <h2 className="font-body font-medium text-[1.125rem] text-lg-text leading-snug group-hover:text-lg-green transition-colors duration-200">
                    {post.title}
                  </h2>

                  <p className="font-body text-sm text-lg-text-secondary leading-[1.65] flex-1">
                    {post.description}
                  </p>

                  <p className="font-body text-xs text-lg-text-muted mt-2">
                    {formatDate(post.date)}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

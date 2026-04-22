import type { Metadata } from "next";
import { notFound }             from "next/navigation";
import { MDXRemote }            from "next-mdx-remote/rsc";
import { getAllSlugs, getPostBySlug, formatDate } from "@/lib/mdx";
import { Badge }                from "@/components/ui/Badge";
import { Button }               from "@/components/ui/Button";

/* ─── Componentes MDX personalizados ─────── */
const mdxComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="font-display font-medium text-[1.5rem] text-lg-text mt-12 mb-4 leading-snug"
      {...props}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className="font-body font-medium text-[1.25rem] text-lg-text mt-8 mb-3"
      {...props}
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className="font-body text-[1rem] text-lg-text-secondary leading-[1.75] mb-5"
      {...props}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-none flex flex-col gap-2 mb-5" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-inside flex flex-col gap-2 mb-5 text-lg-text-secondary font-body text-sm" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="flex items-start gap-2 font-body text-sm text-lg-text-secondary leading-[1.65]">
      <span className="text-lg-green shrink-0 mt-0.5">→</span>
      <span {...props} />
    </li>
  ),
  blockquote: (props: React.HTMLAttributes<HTMLElement>) => (
    <blockquote
      className="border-l-2 border-lg-green/40 pl-5 my-6 italic text-lg-text-secondary font-body text-[1.0625rem] leading-[1.75]"
      {...props}
    />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="text-lg-text font-medium" {...props} />
  ),
  hr: () => (
    <hr className="border-none border-t border-white/[0.08] my-10" />
  ),
};

/* ─── Static params ───────────────────────── */
export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

/* ─── Metadata dinámica ───────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { frontmatter } = getPostBySlug(slug);
    return {
      title:       frontmatter.title,
      description: frontmatter.description,
    };
  } catch {
    return {};
  }
}

/* ─── Página ──────────────────────────────── */
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let frontmatter: ReturnType<typeof getPostBySlug>["frontmatter"];
  let content:     string;

  try {
    ({ frontmatter, content } = getPostBySlug(slug));
  } catch {
    notFound();
  }

  return (
    <article className="py-[clamp(5rem,12vw,10rem)] px-[clamp(1.5rem,5vw,4rem)]">
      <div className="max-w-[680px] mx-auto">

        {/* Encabezado del post */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Badge>{frontmatter.category}</Badge>
            <span className="font-body text-xs text-lg-text-muted">{frontmatter.readTime} de lectura</span>
          </div>

          <h1 className="font-display font-bold text-[clamp(1.75rem,4vw,2.5rem)] text-lg-text leading-tight mb-6">
            {frontmatter.title}
          </h1>

          <p className="font-body text-[1.125rem] text-lg-text-secondary leading-[1.7] mb-6">
            {frontmatter.description}
          </p>

          <div className="flex items-center gap-4 pt-4 border-t border-white/[0.06]">
            {/* Avatar placeholder */}
            <div className="w-9 h-9 rounded-full bg-lg-green/10 border border-lg-green/20 flex items-center justify-center">
              <span className="font-mono text-xs text-lg-green font-medium">LG</span>
            </div>
            <div>
              <p className="font-body text-sm text-lg-text font-medium">Level Growth</p>
              <p className="font-body text-xs text-lg-text-muted">{formatDate(frontmatter.date)}</p>
            </div>
          </div>
        </header>

        {/* Cover image */}
        {frontmatter.cover ? (
          <div className="relative h-64 overflow-hidden rounded-card mb-12">
            <img
              src={frontmatter.cover}
              alt={frontmatter.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080C14]/60 to-transparent" />
          </div>
        ) : (
          <div className="h-64 bg-lg-bg-secondary border border-white/[0.06] rounded-card flex items-center justify-center mb-12">
            <span className="font-mono text-lg-text-muted text-xs tracking-widest uppercase">
              Cover image
            </span>
          </div>
        )}

        {/* Contenido MDX */}
        <div>
          <MDXRemote source={content} components={mdxComponents} />
        </div>

        {/* CTA al final del post */}
        <div className="mt-16 p-8 bg-gradient-to-br from-lg-green/[0.06] to-transparent border border-lg-green/20 rounded-card text-center">
          <p className="font-body font-medium text-lg-text mb-2">
            ¿Querés que auditemos tu negocio?
          </p>
          <p className="font-body text-sm text-lg-text-secondary mb-6">
            Lo que describimos en este artículo lo aplicamos en cada proyecto. Sin costo inicial.
          </p>
          <Button href="/contacto">Contactanos →</Button>
        </div>

        {/* Volver al blog */}
        <div className="mt-10 text-center">
          <a
            href="/blog"
            className="font-body text-sm text-lg-text-muted hover:text-lg-text transition-colors duration-200"
          >
            ← Volver al blog
          </a>
        </div>

      </div>
    </article>
  );
}

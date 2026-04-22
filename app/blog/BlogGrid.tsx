"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import type { PostMeta } from "@/lib/mdx";

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  const [y, m, d] = parts[0].length === 4 ? parts : parts.reverse();
  const months = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  return `${parseInt(d)} de ${months[parseInt(m) - 1]} de ${y}`;
}

const CATEGORIES = ["Todas", "Nuestras bases", "Aprendiendo día a día"] as const;

export function BlogGrid({ posts }: { posts: PostMeta[] }) {
  const [active, setActive] = useState<string>("Todas");

  const filtered = active === "Todas"
    ? posts
    : posts.filter((p) => p.category === active);

  return (
    <>
      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={[
              "font-body text-xs font-medium px-3 py-1.5 rounded border transition-colors duration-150",
              active === cat
                ? "border-[#3FC87A]/50 bg-[#3FC87A]/10 text-[#3FC87A]"
                : "border-white/[0.08] text-[#7A8FA6] hover:border-white/20 hover:text-white",
            ].join(" ")}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="font-body text-lg-text-muted text-center py-20">
          No hay artículos en esta categoría aún.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => (
            <a
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] rounded-card overflow-hidden hover:border-lg-green/20 transition-all duration-300"
            >
              <div className="h-44 bg-lg-bg-tertiary flex items-center justify-center border-b border-white/[0.06]">
                <span className="font-mono text-lg-text-muted text-xs tracking-widest uppercase">
                  Level Growth
                </span>
              </div>

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
    </>
  );
}

import fs   from "fs";
import path from "path";

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

/* ─── Tipos ───────────────────────────────── */
export interface PostFrontmatter {
  title:       string;
  description: string;
  date:        string;
  category:    string;
  readTime:    string;
}

export type PostMeta = PostFrontmatter & { slug: string };

/* ─── Parser de frontmatter ───────────────── */
/* Parsea bloques YAML simples sin dependencias externas.
   Solo soporta valores string en una línea — suficiente para nuestros posts. */
function parseFrontmatter(source: string): { frontmatter: PostFrontmatter; content: string } {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);

  if (!match) {
    return { frontmatter: {} as PostFrontmatter, content: source };
  }

  const yaml    = match[1];
  const content = source.slice(match[0].length);
  const fm: Record<string, string> = {};

  yaml.split("\n").forEach((line) => {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) return;
    const key = line.slice(0, colonIdx).trim();
    const val = line.slice(colonIdx + 1).trim().replace(/^["'](.*)["']$/, "$1");
    fm[key] = val;
  });

  return { frontmatter: fm as unknown as PostFrontmatter, content };
}

/* ─── API pública ─────────────────────────── */

/** Devuelve todos los posts ordenados por fecha descendente */
export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));

  return files
    .map((filename) => {
      const slug   = filename.replace(".mdx", "");
      const source = fs.readFileSync(path.join(POSTS_DIR, filename), "utf8");
      const { frontmatter } = parseFrontmatter(source);
      return { ...frontmatter, slug };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** Devuelve frontmatter + contenido MDX de un post por slug */
export function getPostBySlug(slug: string): { frontmatter: PostFrontmatter; content: string } {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  const source   = fs.readFileSync(filePath, "utf8");
  return parseFrontmatter(source);
}

/** Devuelve los slugs de todos los posts (para generateStaticParams) */
export function getAllSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(".mdx", ""));
}

/** Formatea una fecha ISO a texto legible en español */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-AR", {
    year:  "numeric",
    month: "long",
    day:   "numeric",
  });
}

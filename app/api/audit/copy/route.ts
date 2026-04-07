import { NextResponse } from "next/server";
import { load } from "cheerio";

/* ─── Tipos ───────────────────────────────── */
interface CopyResult {
  seoScore:  number;
  copyScore: number;
  ctaScore:  number;
}

interface CacheEntry {
  data:    CopyResult;
  expires: number;
}

/* ─── Caché en memoria 24h ────────────────── */
const cache = new Map<string, CacheEntry>();
const TTL   = 24 * 60 * 60 * 1000;

/* ─── Vocabulario de análisis ─────────────── */
const EGO_WORDS    = ["nosotros", "nuestra", "nuestro", "somos", "tenemos", "ofrecemos"];
const CLIENT_WORDS = ["vos", " tu ", " tus ", "buscás", "necesitás", "querés", "podés"];
const ACTION_WORDS = [
  "comprar", "agendar", "contactar", "cotizar", "consultar",
  "contratar", "solicitar", "escribir", "llamar", "reservar",
];

function countOccurrences(text: string, words: string[]): number {
  const lower = text.toLowerCase();
  return words.reduce((sum, w) => sum + (lower.split(w).length - 1), 0);
}

function normalize(url: string): string {
  const u = url.trim();
  return u.startsWith("http") ? u : `https://${u}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("url");
  if (!raw) return NextResponse.json({ error: "URL requerida" }, { status: 400 });

  const url = normalize(raw);

  /* Servir desde caché si está fresco */
  const cached = cache.get(url);
  if (cached && cached.expires > Date.now()) {
    return NextResponse.json(cached.data);
  }

  try {
    const htmlRes = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; LevelGrowthAudit/1.0)" },
      signal: AbortSignal.timeout(12000),
    });
    if (!htmlRes.ok) throw new Error(`HTTP ${htmlRes.status}`);

    const html = await htmlRes.text();
    const $    = load(html);

    /* ── SEO ────────────────────────────────── */
    const hasTitle    = $("title").length > 0 && $("title").text().trim().length > 5;
    const hasMetaDesc = ($('meta[name="description"]').attr("content") ?? "").trim().length > 10;
    const h1Count     = $("h1").length;

    let seoScore = 2; // base mínima
    if (hasTitle)    seoScore += 3;
    if (hasMetaDesc) seoScore += 3;
    if (h1Count === 1) seoScore += 2;

    /* Sin H1 único: cap en 4 */
    if (h1Count !== 1) seoScore = Math.min(seoScore, 4);
    seoScore = Math.min(10, Math.max(1, seoScore));

    /* ── Copy ───────────────────────────────── */
    const bodyText  = $("body").text();
    const egoCount  = countOccurrences(bodyText, EGO_WORDS);
    const clientCnt = countOccurrences(bodyText, CLIENT_WORDS);

    let copyScore: number;
    const total = egoCount + clientCnt;

    if (total === 0) {
      copyScore = 4; // sin señales claras
    } else {
      const clientRatio = clientCnt / total;
      copyScore = Math.max(1, Math.round(clientRatio * 9) + 1);
      /* Si ego supera cliente: cap en 5 */
      if (egoCount > clientCnt) copyScore = Math.min(copyScore, 5);
    }
    copyScore = Math.min(10, copyScore);

    /* ── CTA ────────────────────────────────── */
    let ctaCount = 0;
    $("button, a").each((_, el) => {
      const text = $(el).text().toLowerCase();
      if (ACTION_WORDS.some((w) => text.includes(w))) ctaCount++;
    });

    let ctaScore: number;
    if (ctaCount === 0)      ctaScore = 1;
    else if (ctaCount === 1) ctaScore = 3;
    else if (ctaCount <= 4)  ctaScore = 7;
    else                     ctaScore = 9;

    /* Menos de 2 CTAs: cap en 4 */
    if (ctaCount < 2) ctaScore = Math.min(ctaScore, 4);

    const result: CopyResult = { seoScore, copyScore, ctaScore };
    cache.set(url, { data: result, expires: Date.now() + TTL });

    return NextResponse.json(result);
  } catch (err) {
    console.error("[audit/copy]", err);
    return NextResponse.json({ error: "No se pudo analizar el sitio" }, { status: 500 });
  }
}

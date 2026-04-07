import { NextResponse } from "next/server";
import { load } from "cheerio";

/* ─── Tipos ───────────────────────────────── */
export interface CopyResult {
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

const USER_AGENTS = [
  "Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (compatible; LevelGrowthAudit/1.0; +https://levelgrowthagency.com)",
];

function countOccurrences(text: string, words: string[]): number {
  const lower = text.toLowerCase();
  return words.reduce((sum, w) => sum + (lower.split(w).length - 1), 0);
}

function normalize(url: string): string {
  const u = url.trim();
  return u.startsWith("http") ? u : `https://${u}`;
}

/* ─── Calcular puntajes desde HTML ─────────── */
function analyze(html: string): CopyResult {
  const $ = load(html);

  /* SEO */
  const hasTitle    = $("title").length > 0 && $("title").text().trim().length > 5;
  const hasMetaDesc = ($('meta[name="description"]').attr("content") ?? "").trim().length > 10;
  const h1Count     = $("h1").length;

  let seoScore = 2;
  if (hasTitle)      seoScore += 3;
  if (hasMetaDesc)   seoScore += 3;
  if (h1Count === 1) seoScore += 2;
  if (h1Count !== 1) seoScore = Math.min(seoScore, 4);
  seoScore = Math.min(10, Math.max(1, seoScore));

  /* Copy */
  const bodyText  = $("body").text();
  const egoCount  = countOccurrences(bodyText, EGO_WORDS);
  const clientCnt = countOccurrences(bodyText, CLIENT_WORDS);
  const total     = egoCount + clientCnt;

  let copyScore: number;
  if (total === 0) {
    copyScore = 4;
  } else {
    const ratio = clientCnt / total;
    copyScore   = Math.max(1, Math.round(ratio * 9) + 1);
    if (egoCount > clientCnt) copyScore = Math.min(copyScore, 5);
  }
  copyScore = Math.min(10, copyScore);

  /* CTA */
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
  if (ctaCount < 2) ctaScore = Math.min(ctaScore, 4);

  return { seoScore, copyScore, ctaScore };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("url");
  if (!raw) return NextResponse.json({ error: "URL requerida" }, { status: 400 });

  const url = normalize(raw);

  /* Caché */
  const cached = cache.get(url);
  if (cached && cached.expires > Date.now()) {
    return NextResponse.json(cached.data);
  }

  /* Intentar con distintos User-Agents para evitar bloqueos */
  let lastError: unknown;

  for (const ua of USER_AGENTS) {
    try {
      const controller = new AbortController();
      const timer      = setTimeout(() => controller.abort(), 15_000);

      const htmlRes = await fetch(url, {
        headers: {
          "User-Agent":      ua,
          "Accept":          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "es-AR,es;q=0.9,en;q=0.7",
        },
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!htmlRes.ok) {
        lastError = `HTTP ${htmlRes.status}`;
        continue;
      }

      const html   = await htmlRes.text();
      const result = analyze(html);

      cache.set(url, { data: result, expires: Date.now() + TTL });
      return NextResponse.json(result);
    } catch (err) {
      lastError = err;
      /* Intentar con el siguiente User-Agent */
    }
  }

  /* Si todos los intentos fallaron, loguear y devolver scores neutrales */
  console.error("[audit/copy] Todos los intentos fallaron:", url, lastError);

  /* Devolvemos scores bajos-medios como señal conservadora */
  const fallback: CopyResult = { seoScore: 4, copyScore: 4, ctaScore: 4 };
  return NextResponse.json(fallback);
}

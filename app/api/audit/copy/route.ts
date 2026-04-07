import { NextResponse } from "next/server";
import { load } from "cheerio";

/* ─── Tipos ───────────────────────────────── */
export type FormFriction = "none" | "missing" | "too_many_fields" | "optimal";
export type PageType     = "conversion" | "institutional" | "blog" | "contact";

export interface CopyResult {
  seoScore:          number;
  copyScore:         number;
  ctaScore:          number;
  hasSocialProof:    boolean;
  hicksLawViolation: boolean;
  formFriction:      FormFriction;
  pageType:          PageType;
}

interface CacheEntry {
  data:    CopyResult;
  expires: number;
}

/* ─── Caché en memoria 24h ────────────────── */
const cache = new Map<string, CacheEntry>();
const TTL   = 24 * 60 * 60 * 1000;

/* ─── Vocabulario ─────────────────────────── */
const EGO_WORDS    = ["nosotros", "nuestra", "nuestro", "somos", "tenemos", "ofrecemos"];
const CLIENT_WORDS = ["vos", " tu ", " tus ", "buscás", "necesitás", "querés", "podés"];
const ACTION_WORDS = [
  "comprar", "agendar", "contactar", "cotizar", "consultar",
  "contratar", "solicitar", "escribir", "llamar", "reservar",
];
const SOCIAL_PROOF_WORDS = [
  "testimonio", "testimonios", "opiniones", "clientes", "reseñas", "experiencia",
];
const SERVICE_WORDS  = ["servicio", "producto", "solución", "soluciones", "ofrecemos", "precio", "plan"];
const BLOG_WORDS     = ["publicado", "artículo", "articulo", "leer más", "leer mas", "minutos de lectura", "min de lectura"];
const DATE_PATTERN   = /\d{1,2}\/\d{1,2}\/\d{4}|enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre/i;
const STATS_PATTERN  = /\d+\s*%|\d+\s*(clientes|años|proyectos|empresas|casos)/i;

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

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

/* ─── Detección de tipo de página por votación ─────────────────────── */
function detectPageType(
  $:              ReturnType<typeof load>,
  bodyText:       string,
  bodyLower:      string,
  url:            string,
  uniqueCtaTexts: Set<string>,
): PageType {
  let conversionPts    = 0;
  let institutionalPts = 0;
  let blogPts          = 0;
  let contactPts       = 0;

  const h1Text      = $("h1").first().text().toLowerCase().trim();
  const h1WordCount = h1Text.split(/\s+/).filter(Boolean).length;
  const headingText = $("h1, h2").text().toLowerCase();

  /* ── Señales de página de CONVERSIÓN ────────────────────────────── */
  if (h1WordCount > 0 && h1WordCount < 15)                                     conversionPts++; // H1 conciso
  if ($("section, body > div, main > div").length > 3)                         conversionPts++; // Múltiples secciones
  if (STATS_PATTERN.test(bodyText))                                             conversionPts++; // Métricas/estadísticas
  if (SERVICE_WORDS.some((w) => bodyLower.includes(w)))                        conversionPts++; // Descripción de servicios
  try { if (new URL(url).pathname.replace(/\/$/, "") === "") conversionPts++; } catch {}        // Path raíz "/"
  if (uniqueCtaTexts.size > 2)                                                  conversionPts++; // Más de 2 CTAs distintos

  /* ── Señales de página INSTITUCIONAL ────────────────────────────── */
  if (/nosotros|equipo|historia|quiénes|quienes|about/.test(headingText))      institutionalPts++; // Título institucional
  const egoCountRaw  = countOccurrences(bodyText, EGO_WORDS);
  const clientCntRaw = countOccurrences(bodyText, CLIENT_WORDS);
  if (egoCountRaw > 15 && egoCountRaw > clientCntRaw * 2)                      institutionalPts++; // Ratio ego muy alto
  if (uniqueCtaTexts.size < 2)                                                  institutionalPts++; // Pocos CTAs
  if (!SERVICE_WORDS.some((w) => bodyLower.includes(w)))                       institutionalPts++; // Sin servicios/precios

  /* ── Señales de BLOG/LISTADO ─────────────────────────────────────── */
  if (DATE_PATTERN.test(bodyText))                                              blogPts++; // Fechas en el contenido
  if ($("article").length > 4 || $("[class*='card'], [class*='post'], [class*='article']").length > 4) blogPts++; // Estructura repetitiva
  if (BLOG_WORDS.some((w) => bodyLower.includes(w)))                           blogPts++; // Vocabulario de blog
  if (!/servicio|producto|solución|precio|gratis|mejora|aumenta/i.test(h1Text)) blogPts++; // Sin H1 comercial

  /* ── Señales de página de CONTACTO ──────────────────────────────── */
  const forms      = $("form");
  const inputCount = forms.length > 0
    ? forms.first().find("input:not([type='hidden']):not([type='submit'])").length
    : 0;
  if (forms.length > 0 && inputCount > 2)                                       contactPts++; // Formulario prominente
  if (/contacto|contactanos|escribinos|hablemos|consulta|cotizá|cotiza/.test(h1Text)) contactPts++; // H1 de contacto
  if ($("section, main > div, article").length < 3)                             contactPts++; // Pocas secciones
  if (!SERVICE_WORDS.some((w) => bodyLower.includes(w)))                       contactPts++; // Sin servicios

  /* ── Clasificación: gana el que más puntos acumula ──────────────── */
  const scores = [
    { type: "conversion"    as PageType, pts: conversionPts    },
    { type: "institutional" as PageType, pts: institutionalPts },
    { type: "blog"          as PageType, pts: blogPts          },
    { type: "contact"       as PageType, pts: contactPts       },
  ].sort((a, b) => b.pts - a.pts);

  // Empate o menos de 2 puntos para una categoría secundaria → conversión (caso más estricto)
  if (scores[0].pts === scores[1].pts)                                return "conversion";
  if (scores[0].type !== "conversion" && scores[0].pts < 2)          return "conversion";

  return scores[0].type;
}

/* ─── Análisis heurístico principal ──────── */
function analyze(html: string, url: string): CopyResult {
  const $ = load(html);

  const bodyText  = $("body").text();
  const bodyLower = bodyText.toLowerCase();

  /* ── CTAs únicos (compartido entre detección y scoring) ── */
  const uniqueCtaTexts = new Set<string>();
  let actionBtnCount   = 0;
  $("button, a").each((_, el) => {
    const text = $(el).text().toLowerCase().trim();
    if (ACTION_WORDS.some((w) => text.includes(w)) && text.length > 1) {
      uniqueCtaTexts.add(text);
      actionBtnCount++;
    }
  });

  /* ── Tipo de página ──────────────────────────────────── */
  const pageType = detectPageType($, bodyText, bodyLower, url, uniqueCtaTexts);

  /* ── SEO (igual para todos los tipos) ───────────────── */
  const hasTitle    = $("title").length > 0 && $("title").text().trim().length > 5;
  const hasMetaDesc = ($('meta[name="description"]').attr("content") ?? "").trim().length > 10;
  const h1Count     = $("h1").length;

  let seoScore = 2;
  if (hasTitle)      seoScore += 3;
  if (hasMetaDesc)   seoScore += 3;
  if (h1Count === 1) seoScore += 2;
  if (h1Count !== 1) seoScore = Math.min(seoScore, 4);
  seoScore = clamp(seoScore, 1, 10);

  /* ── Copy ego vs cliente ─────────────────────────────── */
  const egoCount  = countOccurrences(bodyText, EGO_WORDS);
  const clientCnt = countOccurrences(bodyText, CLIENT_WORDS);
  const total     = egoCount + clientCnt;

  let copyScore: number;
  if (total === 0) {
    copyScore = 4;
  } else {
    const ratio = clientCnt / total;
    copyScore   = Math.max(1, Math.round(ratio * 9) + 1);
    // Penalizar ratio ego/cliente solo en conversión y contacto — en institucional es esperado
    if ((pageType === "conversion" || pageType === "contact") && egoCount > clientCnt) {
      copyScore = Math.min(copyScore, 5);
    }
  }

  /* ── Social Proof (Cialdini) ─────────────────────────── */
  const hasSocialProofText = SOCIAL_PROOF_WORDS.some((w) => bodyLower.includes(w));
  const hasSocialProofImg  = $("img").toArray().some((el) => {
    const alt = ($(el).attr("alt") ?? "").toLowerCase();
    return alt.includes("logo") || alt.includes("cliente");
  });
  const hasSocialProof = hasSocialProofText || hasSocialProofImg;

  // Solo penalizar falta de social proof en páginas de conversión
  if (pageType === "conversion" && !hasSocialProof) {
    copyScore = Math.max(1, copyScore - 2);
  }

  // Blog: bonus leve si título y meta descripción son claros
  if (pageType === "blog") {
    const h1Text   = $("h1").first().text().trim();
    const metaDesc = ($('meta[name="description"]').attr("content") ?? "").trim();
    if (h1Text.length > 5 && metaDesc.length > 10) copyScore = clamp(copyScore + 1, 1, 10);
  }

  copyScore = clamp(copyScore, 1, 10);

  /* ── Contacto y formulario ───────────────────────────── */
  const forms     = $("form");
  const hasWaLink = $("a[href*='wa.me'], a[href*='whatsapp']").length > 0
                 || bodyLower.includes("wa.me")
                 || bodyLower.includes("whatsapp");

  const inputCount   = forms.length > 0
    ? forms.first().find("input:not([type='hidden']):not([type='submit'])").length
    : 0;
  const hasLightForm = forms.length > 0 && inputCount <= 5;
  const hasContact   = hasWaLink || hasLightForm;

  /* ── Score de CTA según tipo de página ──────────────── */
  let ctaScore: number;

  if (pageType === "contact") {
    // Páginas de contacto: mínimo 7 si hay formulario visible
    if (forms.length > 0 && inputCount > 0) {
      ctaScore = hasWaLink ? 9 : 7;      // WA como alternativa → excelente
      if (inputCount > 5) ctaScore = Math.max(4, ctaScore - 2); // fricción penaliza
    } else {
      ctaScore = hasWaLink ? 6 : 2;
    }
  } else if (pageType === "institutional") {
    // Institucional: penalizar solo si no hay ningún CTA hacia conversión
    ctaScore = uniqueCtaTexts.size === 0 ? 2
             : uniqueCtaTexts.size === 1 ? 5
             : 7;
  } else {
    // Conversión y Blog: lógica calibrada estándar
    if (!hasContact) {
      ctaScore = 1;
    } else {
      ctaScore = 6;
      if (actionBtnCount >= 2) ctaScore = 8;
      if (forms.length > 0 && inputCount > 5) ctaScore = Math.max(1, ctaScore - 2);
    }
  }

  /* ── Ley de Hick (solo en páginas de conversión) ────── */
  const aboveFoldEls      = $("body").children().slice(0, 3);
  const uniqueAboveCtas   = new Set<string>();
  aboveFoldEls.find("button, a").each((_, el) => {
    const text = $(el).text().toLowerCase().trim();
    if (ACTION_WORDS.some((w) => text.includes(w)) && text.length > 1) {
      uniqueAboveCtas.add(text);
    }
  });
  const hicksLawViolation = pageType === "conversion" && uniqueAboveCtas.size >= 4;
  if (hicksLawViolation) ctaScore = Math.max(1, ctaScore - 2);

  /* ── Fricción de formulario ─────────────────────────── */
  let formFriction: FormFriction = "none";
  if (!hasContact)                               formFriction = "missing";
  else if (forms.length > 0 && inputCount > 5)  formFriction = "too_many_fields";
  else if (forms.length > 0 && inputCount <= 3) formFriction = "optimal";

  // Páginas institucionales y blog sin formulario no son "missing" — es lo esperado
  if ((pageType === "institutional" || pageType === "blog") && formFriction === "missing") {
    formFriction = "none";
  }

  ctaScore = clamp(ctaScore, 1, 10);

  return { seoScore, copyScore, ctaScore, hasSocialProof, hicksLawViolation, formFriction, pageType };
}

/* ─── Handler ─────────────────────────────── */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("url");
  if (!raw) return NextResponse.json({ error: "URL requerida" }, { status: 400 });

  const url = normalize(raw);

  const cached = cache.get(url);
  if (cached && cached.expires > Date.now()) {
    return NextResponse.json(cached.data);
  }

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
      if (!htmlRes.ok) { lastError = `HTTP ${htmlRes.status}`; continue; }

      const html   = await htmlRes.text();
      const result = analyze(html, url);

      cache.set(url, { data: result, expires: Date.now() + TTL });
      return NextResponse.json(result);
    } catch (err) {
      lastError = err;
    }
  }

  console.error("[audit/copy] Todos los intentos fallaron:", url, lastError);
  const fallback: CopyResult = {
    seoScore: 4, copyScore: 4, ctaScore: 4,
    hasSocialProof: false, hicksLawViolation: false, formFriction: "none",
    pageType: "conversion",
  };
  return NextResponse.json(fallback);
}

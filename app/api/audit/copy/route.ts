import { NextResponse } from "next/server";
import { load } from "cheerio";

/* ─── Tipos ─────────────────────────────────────────────────────────── */
export type FormFriction = "none" | "missing" | "too_many_fields" | "optimal";
export type PageType     = "conversion" | "institutional" | "blog" | "contact";
export type BusinessType = "b2b" | "ecommerce" | "services" | "general";

export interface CopyResult {
  seoScore:           number;
  copyScore:          number;
  ctaScore:           number;
  hasSocialProof:     boolean;
  hicksLawViolation:  boolean;
  formFriction:       FormFriction;
  pageType:           PageType;
  businessType:       BusinessType;
  hasGenericH1:       boolean;   /* H1/H2 genérico sin propuesta de valor */
  hasFeatureBias:     boolean;   /* Describe features, no beneficios */
  hasUnsubstantiated: boolean;   /* Claims fuertes sin evidencia */
}

interface CacheEntry {
  data:    CopyResult;
  expires: number;
}

/* ─── Caché en memoria 24h ───────────────────────────────────────────── */
const cache = new Map<string, CacheEntry>();
const TTL   = 24 * 60 * 60 * 1000;

/* ─── Vocabulario ────────────────────────────────────────────────────── */

/* Señales de conversión */
const SERVICE_WORDS  = ["servicio", "solución", "solucion", "producto", "ofrecemos", "instalación", "instalacion", "asesoría", "asesoria", "precio", "plan"];
const RESULT_VERBS   = ["aumentá", "aumenta", "reducí", "reduce", "ahorrá", "ahorra", "optimizá", "optimiza", "mejorá", "mejora", "lográ", "logra"];
const STATS_PATTERN  = /\d+\s*%|\d+\s*(clientes|años|anos|proyectos|casos|eventos|empresas)/i;

/* Blog */
const BLOG_WORDS     = ["publicado", "artículo", "articulo", "leer más", "leer mas", "minutos de lectura"];
const DATE_PATTERN   = /\d{1,2}\/\d{1,2}\/\d{4}|enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre/i;

/* Ego vs cliente */
const EGO_WORDS      = ["nosotros", "nuestra", "nuestro", "somos", "tenemos", "ofrecemos"];
const CLIENT_WORDS   = [" vos ", " tu ", " tus ", "tu negocio", "tu empresa", "tus clientes"];

/* Calidad de CTAs */
const STRONG_CTA_WORDS = [
  "cotizá", "cotiza", "solicitá", "solicita", "agendá", "agenda",
  "contactanos", "contactá", "contacta", "empezá", "empieza",
  "obtenés", "reservá", "reserva", "consultá", "consulta",
  "hablar con", "quiero", "necesito", "agendar", "cotizar",
  "solicitar", "contratar",
];
const WEAK_CTA_WORDS = [
  "ver más", "ver mas", "leer más", "leer mas", "click aquí", "click aqui",
  "más información", "mas informacion", "enviar", "aceptar", "submit",
];

/* Análisis semántico */
const GENERIC_H1_WORDS = [
  "líderes", "lideres", "empresa líder", "empresa lider",
  "los mejores", "calidad premium", "innovadores",
  "excelencia", "soluciones integrales", "comprometidos",
];
const BENEFIT_WORDS_H1 = [
  "aumentar", "reducir", "mejorar", "optimizar", "ganar", "ahorrar",
  "crecer", "escalar", "resolver", "lograr",
  "tu negocio", "tu empresa", "tus clientes", "tu equipo",
];
const FEATURE_WORDS = [
  "sistema", "estructura", "material", "modelo", "tipo", "componente",
  "módulo", "modulo", "versión", "version", "especificación", "especificacion",
  "técnico", "tecnico",
];
const BENEFIT_WORDS = [
  "aumentar", "reducir", "mejorar", "optimizar", "ganar", "ahorrar",
  "resolver", "simplificar", "acelerar", "maximizar",
];
const CLAIM_WORDS = [
  "líder", "lider", "mejor", "único", "unico",
  "revolucionario", "premium", "innovador",
];

/* Social proof */
const SOCIAL_PROOF_WORDS = [
  "testimonios", "testimonio", "opiniones", "reseñas", "resenas",
  "casos de éxito", "casos de exito", "años de experiencia",
  "proyectos realizados", "empresas que confían", "empresas que confian",
];

/* Tipo de negocio */
const B2B_WORDS       = ["proyecto", "logística", "logistica", "industria", "depósito", "deposito", "almacenamiento"];
const ECOMMERCE_WORDS = ["carrito", "envío", "envio", "pagar", "stock", "tienda"];
const SERVICES_WORDS  = ["consultoría", "consultoria", "asesoría", "asesoria", "estrategia", "agencia"];

const USER_AGENTS = [
  "Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (compatible; LevelGrowthAudit/1.0; +https://levelgrowthagency.com)",
];

/* ─── Utilidades ─────────────────────────────────────────────────────── */
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

/* ─── Tipo de negocio ────────────────────────────────────────────────── */
function detectBusinessType(bodyLower: string): BusinessType {
  const b2b  = countOccurrences(bodyLower, B2B_WORDS);
  const ecom = countOccurrences(bodyLower, ECOMMERCE_WORDS);
  const svc  = countOccurrences(bodyLower, SERVICES_WORDS);
  const max  = Math.max(b2b, ecom, svc);
  if (max < 2)                return "general";
  if (b2b >= ecom && b2b >= svc) return "b2b";
  if (ecom >= svc)            return "ecommerce";
  return "services";
}

/* ─── Tipo de página por votación de señales ────────────────────────── */
function detectPageType(
  $:           ReturnType<typeof load>,
  bodyText:    string,
  bodyLower:   string,
  url:         string,
  allCtaCount: number,
): PageType {
  let convPts = 0, instPts = 0, blogPts = 0, ctcPts = 0;

  const h1Text      = $("h1").first().text().toLowerCase().trim();
  const h1WordCount = h1Text.split(/\s+/).filter(Boolean).length;
  const headingText = $("h1, h2").text().toLowerCase();

  /* ── Conversión ───────────────────────── */
  if (h1WordCount > 0 && h1WordCount < 15)                       convPts++;
  if (STATS_PATTERN.test(bodyText))                              convPts++;
  if (allCtaCount > 2)                                           convPts++;
  if (SERVICE_WORDS.some((w) => bodyLower.includes(w)))         convPts++;
  if ($("section, body > div, main > div").length > 3)          convPts++;
  if (RESULT_VERBS.some((w) => bodyLower.includes(w)))          convPts++;
  try { if (new URL(url).pathname.replace(/\/$/, "") === "") convPts++; } catch {}

  /* ── Institucional ────────────────────── */
  const egoRaw = countOccurrences(bodyText, EGO_WORDS);
  const cliRaw = countOccurrences(bodyText, CLIENT_WORDS);
  if (/nosotros|equipo|historia|quiénes|quienes|about/.test(headingText)) instPts++;
  if (egoRaw > 15 && egoRaw > cliRaw * 2)                       instPts++;
  if (allCtaCount < 2)                                           instPts++;
  if (!SERVICE_WORDS.some((w) => bodyLower.includes(w)))        instPts++;

  /* ── Blog / listado ───────────────────── */
  if (DATE_PATTERN.test(bodyText))                               blogPts++;
  if ($("article").length > 4 || $("[class*='card'],[class*='post'],[class*='article']").length > 4) blogPts++;
  if (BLOG_WORDS.some((w) => bodyLower.includes(w)))            blogPts++;
  if (!/servicio|producto|solución|solucion|precio|gratis|mejora/i.test(h1Text)) blogPts++;

  /* ── Contacto ─────────────────────────── */
  const forms      = $("form");
  const inputCount = forms.length > 0
    ? forms.first().find("input:not([type='hidden']):not([type='submit'])").length
    : 0;
  if (forms.length > 0 && inputCount > 2)                        ctcPts++;
  if (/contacto|contactanos|escribinos|hablemos|consulta|cotizá|cotiza/.test(h1Text)) ctcPts++;
  if ($("section, main > div, article").length < 3)              ctcPts++;

  /* ── Clasificar ───────────────────────── */
  const sorted = [
    { type: "conversion"    as PageType, pts: convPts },
    { type: "institutional" as PageType, pts: instPts },
    { type: "blog"          as PageType, pts: blogPts },
    { type: "contact"       as PageType, pts: ctcPts  },
  ].sort((a, b) => b.pts - a.pts);

  if (sorted[0].pts === sorted[1].pts)                          return "conversion";
  if (sorted[0].type !== "conversion" && sorted[0].pts < 2)    return "conversion";
  return sorted[0].type;
}

/* ─── Análisis completo ──────────────────────────────────────────────── */
function analyze(html: string, url: string): CopyResult {
  const $ = load(html);
  const bodyText  = $("body").text();
  const bodyLower = bodyText.toLowerCase();

  /* ── 1. CTAs: fuertes vs débiles ─────────────────────────────────── */
  let strongCtaCount = 0;
  let weakCtaCount   = 0;
  const allCtaTexts  = new Set<string>();

  $("button, a").each((_, el) => {
    const text = $(el).text().toLowerCase().trim();
    if (!text || text.length < 2) return;
    if (STRONG_CTA_WORDS.some((w) => text.includes(w))) {
      strongCtaCount++;
      allCtaTexts.add(text);
    } else if (WEAK_CTA_WORDS.some((w) => text.includes(w))) {
      weakCtaCount++;
      allCtaTexts.add(text);
    }
  });

  /* ── 2. Contacto disponible ──────────────────────────────────────── */
  const forms     = $("form");
  const hasWaLink = $("a[href*='wa.me'], a[href*='whatsapp']").length > 0
                 || bodyLower.includes("wa.me")
                 || bodyLower.includes("whatsapp");
  const inputCount = forms.length > 0
    ? forms.first().find("input:not([type='hidden']):not([type='submit'])").length
    : 0;
  const hasContact = hasWaLink || (forms.length > 0 && inputCount <= 5);

  /* ── 3. Tipo de página y de negocio ──────────────────────────────── */
  const pageType     = detectPageType($, bodyText, bodyLower, url, allCtaTexts.size);
  const businessType = detectBusinessType(bodyLower);

  /* ── 4. SEO score (técnico puro) ─────────────────────────────────── */
  const hasTitle    = $("title").text().trim().length > 10;
  const hasMetaDesc = ($('meta[name="description"]').attr("content") ?? "").trim().length > 50;
  const h1Count     = $("h1").length;

  const imgs        = $("img").toArray();
  const imgWithAlt  = imgs.filter((el) => ($(el).attr("alt") ?? "").trim().length > 0).length;
  const altCoverage = imgs.length === 0 ? 1 : imgWithAlt / imgs.length;

  let seoScore = 0;
  if (hasTitle)          seoScore += 2;
  if (hasMetaDesc)       seoScore += 2;
  if (h1Count === 1)     seoScore += 3; // exactamente uno
  if (h1Count <= 1)      seoScore += 1; // sin duplicado
  if (altCoverage > 0.8) seoScore += 2;

  /* Cap si falta H1, meta description o alt texts */
  if (h1Count === 0 || !hasMetaDesc || altCoverage < 0.8) {
    seoScore = Math.min(seoScore, 6);
  }
  seoScore = clamp(seoScore, 1, 10);

  /* ── 5. Social proof ─────────────────────────────────────────────── */
  const hasSocialProofText = SOCIAL_PROOF_WORDS.some((w) => bodyLower.includes(w));
  const hasSocialProofImg  = imgs.some((el) => {
    const alt = ($(el).attr("alt") ?? "").toLowerCase();
    return alt.includes("logo") || alt.includes("cliente");
  });
  const hasSocialProof = hasSocialProofText || hasSocialProofImg;

  /* ── 6. Flags semánticos ─────────────────────────────────────────── */
  const headingArea = `${$("h1").first().text().toLowerCase()} ${$("h2").first().text().toLowerCase()}`;

  const hasGenericH1 = GENERIC_H1_WORDS.some((w) => headingArea.includes(w))
    && !BENEFIT_WORDS_H1.some((w) => headingArea.includes(w))
    && !/\d+/.test(headingArea);

  const featureCount  = countOccurrences(bodyText, FEATURE_WORDS);
  const benefitCount  = countOccurrences(bodyText, BENEFIT_WORDS);
  const hasFeatureBias = featureCount > 3 && (benefitCount === 0 || featureCount > benefitCount * 2);

  const claimCount        = countOccurrences(bodyText, CLAIM_WORDS);
  const hasNumericEvidence = STATS_PATTERN.test(bodyText);
  const hasUnsubstantiated = claimCount > 2 && !hasNumericEvidence && !hasSocialProof;

  /* ── 7. Copy score ───────────────────────────────────────────────── */
  let copyScore: number;

  if (pageType === "blog") {
    /* Blog: solo claridad de titular y meta */
    const h1Clean  = $("h1").first().text().trim();
    const metaClean = ($('meta[name="description"]').attr("content") ?? "").trim();
    copyScore = (h1Clean.length > 5 && metaClean.length > 10) ? 6 : 4;

  } else {
    /* Ratio base ego/cliente */
    const egoCount = countOccurrences(bodyText, EGO_WORDS);
    const clientCnt = countOccurrences(bodyText, CLIENT_WORDS);
    const total     = egoCount + clientCnt;

    if (total === 0) {
      copyScore = 5;
    } else {
      const ratio = clientCnt / total;
      copyScore   = Math.max(1, Math.round(ratio * 9) + 1);
    }

    /* Penalización: H1 genérico (conversion y contact) */
    if (hasGenericH1 && (pageType === "conversion" || pageType === "contact")) {
      copyScore = Math.min(copyScore, 5);
    }

    /* Penalización: features > beneficios (solo conversion) */
    if (hasFeatureBias && pageType === "conversion") {
      copyScore -= 1;
    }

    /* Penalización: claims sin evidencia (solo conversion) */
    if (hasUnsubstantiated && pageType === "conversion") {
      copyScore -= 1;
    }

    /* Penalización: ratio ego alto (solo conversion) */
    const egoC  = countOccurrences(bodyText, EGO_WORDS);
    const cliC  = countOccurrences(bodyText, CLIENT_WORDS);
    if (pageType === "conversion" && cliC > 0 && egoC > cliC * 2) {
      copyScore -= 1;
    }

    /* Penalización: falta de prueba social (solo conversion, por tipo de negocio) */
    if (pageType === "conversion" && !hasSocialProof) {
      switch (businessType) {
        case "ecommerce": copyScore -= 2; break;
        case "services":  copyScore -= 2; break;
        case "b2b":       copyScore -= 1; break;
        default:          copyScore -= 1; break;
      }
    }
  }

  copyScore = clamp(copyScore, 1, 10);

  /* ── 8. CTA score ────────────────────────────────────────────────── */
  let ctaScore: number;

  if (pageType === "contact") {
    /* Contacto: mínimo 7 si hay formulario visible */
    const hasForm = forms.length > 0 && inputCount > 0;
    if (hasForm && hasWaLink)      ctaScore = 9;
    else if (hasForm)              ctaScore = 7;
    else if (hasWaLink)            ctaScore = 6;
    else                           ctaScore = 2;
    if (forms.length > 0 && inputCount > 5) ctaScore = Math.max(4, ctaScore - 2);

  } else if (pageType === "institutional") {
    /* Institucional: penalizar solo si no hay CTAs */
    ctaScore = allCtaTexts.size === 0 ? 2
             : allCtaTexts.size === 1 ? 5
             : 7;

  } else {
    /* Conversión y blog: sistema de fuertes/débiles */
    /* WhatsApp cuenta como 1 CTA fuerte efectivo */
    const effectiveStrong = strongCtaCount + (hasWaLink ? 1 : 0);

    if (effectiveStrong >= 2)         ctaScore = 8;
    else if (effectiveStrong === 1)   ctaScore = 6;
    else if (weakCtaCount > 0)        ctaScore = 3;
    else                              ctaScore = 1;

    /* Ajuste por formulario */
    if (forms.length > 0 && inputCount > 5)       ctaScore -= 2;
    else if (forms.length > 0 && inputCount <= 3) ctaScore += 1;

    /* Sin contacto en absoluto */
    if (!hasContact) ctaScore = Math.min(ctaScore, 2);
  }

  /* ── 9. Ley de Hick (solo conversion, above-the-fold) ───────────── */
  const aboveFoldEls    = $("body").children().slice(0, 3);
  const uniqueAboveCtas = new Set<string>();
  aboveFoldEls.find("button, a").each((_, el) => {
    const text = $(el).text().toLowerCase().trim();
    const isCta = STRONG_CTA_WORDS.some((w) => text.includes(w))
               || WEAK_CTA_WORDS.some((w) => text.includes(w));
    if (isCta && text.length > 1) uniqueAboveCtas.add(text);
  });
  const hicksLawViolation = pageType === "conversion" && uniqueAboveCtas.size > 4;
  if (hicksLawViolation) ctaScore -= 1; // penalización -1

  ctaScore = clamp(ctaScore, 1, 10);

  /* ── 10. Fricción de formulario ──────────────────────────────────── */
  let formFriction: FormFriction = "none";
  if (!hasContact) {
    /* Institucional y blog sin contacto es lo esperado */
    formFriction = (pageType === "institutional" || pageType === "blog") ? "none" : "missing";
  } else if (forms.length > 0 && inputCount > 5) {
    formFriction = "too_many_fields";
  } else if (forms.length > 0 && inputCount <= 3) {
    formFriction = "optimal";
  }

  return {
    seoScore, copyScore, ctaScore,
    hasSocialProof, hicksLawViolation, formFriction,
    pageType, businessType,
    hasGenericH1, hasFeatureBias, hasUnsubstantiated,
  };
}

/* ─── Handler ────────────────────────────────────────────────────────── */
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
    pageType: "conversion", businessType: "general",
    hasGenericH1: false, hasFeatureBias: false, hasUnsubstantiated: false,
  };
  return NextResponse.json(fallback);
}

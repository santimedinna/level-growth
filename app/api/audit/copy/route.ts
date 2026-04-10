import { NextResponse } from "next/server";
import { load } from "cheerio";

/* ─── Tipos ─────────────────────────────────────────────────────────── */
export type FormFriction = "none" | "missing" | "too_many_fields" | "optimal";
export type PageType     = "conversion" | "institutional" | "blog" | "contact";
export type BusinessType = "b2b" | "ecommerce" | "services" | "general";

export interface PageTypeScores {
  conversion:    number;
  institutional: number;
  blog:          number;
  contact:       number;
}

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
  /* Solo en desarrollo — omitido en producción */
  _debug?: {
    pageTypeScores: PageTypeScores;
    copyPenalties:  number;
    seoElements:    { hasTitle: boolean; hasMetaDesc: boolean; h1Count: number; altCoverage: number };
  };
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
const SERVICE_WORDS  = [
  "servicio", "solución", "solucion", "producto", "ofrecemos", "instalación", "instalacion", "asesoría", "asesoria", "precio", "plan",
  "service", "solution", "product", "offer", "pricing",
];
const RESULT_VERBS   = [
  "aumentá", "aumenta", "reducí", "reduce", "ahorrá", "ahorra", "optimizá", "optimiza", "mejorá", "mejora", "lográ", "logra",
  "increase", "decrease", "save", "grow", "scale", "boost",
];
const STATS_PATTERN  = /\d+\s*%|\d+\s*(clientes|años|anos|proyectos|casos|eventos|empresas|customers|years|projects|clients|cases|companies)/i;

/* Blog */
const BLOG_WORDS     = [
  "publicado", "artículo", "articulo", "leer más", "leer mas", "minutos de lectura",
  "published", "article", "read more", "min read", "minutes to read",
];
const DATE_PATTERN   = /\d{1,2}\/\d{1,2}\/\d{4}|enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|january|february|march|april|june|july|august|september|october|november|december/i;

/* Ego vs cliente — español + inglés */
const EGO_WORDS      = [
  "nosotros", "nuestra", "nuestro", "somos", "tenemos", "ofrecemos",
  " we ", " our ", "we are", "we offer", "we provide",
];
const CLIENT_WORDS   = [
  " vos ", " tu ", " tus ", "tu negocio", "tu empresa", "tus clientes",
  " you ", " your ", "your business", "your team",
];

/* Calidad de CTAs — español + inglés + SaaS */
const STRONG_CTA_WORDS = [
  /* ES */
  "cotizá", "cotiza", "solicitá", "solicita", "agendá", "agenda",
  "contactanos", "contactá", "contacta", "empezá", "empieza",
  "obtenés", "reservá", "reserva", "consultá", "consulta",
  "hablar con", "quiero", "necesito", "agendar", "cotizar",
  "solicitar", "contratar",
  "empezar gratis", "registrate", "crear cuenta", "probar gratis",
  /* EN */
  "get started", "sign up", "try free", "start now", "contact us",
  "get a quote", "book a demo", "book demo", "schedule", "request",
  "subscribe", "get access", "claim",
  /* SaaS — captura "Try Notion free", "Try it free", "Start for free", etc. */
  "free trial", "start trial", "start free", "try for free",
  "start for free", "get started free",
  "join", "demo", "free demo",
  " for free",  /* trailing match: "try notion for free", "use it for free" */
  "try ",       /* leading match: "try notion", "try it" */
];
const WEAK_CTA_WORDS = [
  /* ES */
  "ver más", "ver mas", "leer más", "leer mas", "click aquí", "click aqui",
  "más información", "mas informacion", "enviar", "aceptar",
  /* EN */
  "learn more", "read more", "click here", "submit", "send",
];

/* Análisis semántico */
const GENERIC_H1_WORDS = [
  "líderes", "lideres", "empresa líder", "empresa lider",
  "los mejores", "calidad premium", "innovadores",
  "excelencia", "soluciones integrales", "comprometidos",
  "leaders", "the best", "premium quality", "innovative", "excellence",
  "integrated solutions", "committed",
];
const BENEFIT_WORDS_H1 = [
  /* ES */
  "aumentar", "reducir", "mejorar", "optimizar", "ganar", "ahorrar",
  "crecer", "escalar", "resolver", "lograr",
  "tu negocio", "tu empresa", "tus clientes", "tu equipo",
  /* EN */
  "increase", "reduce", "improve", "save", "grow", "scale",
  "optimize", "boost", "maximize", "streamline",
  "your business", "your team", "your company",
];
const FEATURE_WORDS = [
  "sistema", "estructura", "material", "modelo", "tipo", "componente",
  "módulo", "modulo", "versión", "version", "especificación", "especificacion",
  "técnico", "tecnico",
  "system", "structure", "component", "module", "specification", "technical",
];
const BENEFIT_WORDS = [
  /* ES */
  "aumentar", "reducir", "mejorar", "optimizar", "ganar", "ahorrar",
  "resolver", "simplificar", "acelerar", "maximizar",
  /* EN */
  "increase", "reduce", "improve", "optimize", "save", "grow",
  "scale", "boost", "maximize", "streamline", "simplify", "accelerate",
];
const CLAIM_WORDS = [
  "líder", "lider", "mejor", "único", "unico", "revolucionario", "premium", "innovador",
  "leading", "best", "unique", "revolutionary", "innovative", "number one", "top rated",
];

/* Social proof — español + inglés */
const SOCIAL_PROOF_WORDS = [
  "testimonios", "testimonio", "opiniones", "reseñas", "resenas",
  "casos de éxito", "casos de exito", "años de experiencia",
  "proyectos realizados", "empresas que confían", "empresas que confian",
  "testimonials", "reviews", "case studies", "years of experience",
  "clients served", "companies trust", "trusted by", "success stories",
];

/* Tipo de negocio — español + inglés */
const B2B_WORDS       = [
  "proyecto", "logística", "logistica", "industria", "depósito", "deposito", "almacenamiento",
  "project", "logistics", "industry", "warehouse", "storage", "enterprise",
];
const ECOMMERCE_WORDS = [
  "carrito", "envío", "envio", "pagar", "stock", "tienda",
  "cart", "shipping", "checkout", "payment", "shop", "store",
];
const SERVICES_WORDS  = [
  "consultoría", "consultoria", "asesoría", "asesoria", "estrategia", "agencia",
  "consulting", "advisory", "strategy", "agency", "marketing",
];

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
): { type: PageType; scores: PageTypeScores } {
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
  const scores: PageTypeScores = { conversion: convPts, institutional: instPts, blog: blogPts, contact: ctcPts };

  const sorted = [
    { type: "conversion"    as PageType, pts: convPts },
    { type: "institutional" as PageType, pts: instPts },
    { type: "blog"          as PageType, pts: blogPts },
    { type: "contact"       as PageType, pts: ctcPts  },
  ].sort((a, b) => b.pts - a.pts);

  if (sorted[0].pts === sorted[1].pts)                       return { type: "conversion", scores };
  if (sorted[0].type !== "conversion" && sorted[0].pts < 2) return { type: "conversion", scores };
  return { type: sorted[0].type, scores };
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

  const ctaDebugStrong: string[] = [];
  const ctaDebugWeak:   string[] = [];

  /* Selector ampliado: incluye role=button, inputs y atributos aria-label/title */
  $("button, a, [role='button'], input[type='submit'], input[type='button']").each((_, el) => {
    const text       = $(el).text().toLowerCase().trim();
    const ariaLabel  = ($(el).attr("aria-label") ?? "").toLowerCase().trim();
    const titleAttr  = ($(el).attr("title") ?? "").toLowerCase().trim();
    const textToCheck = text || ariaLabel || titleAttr;
    if (!textToCheck || textToCheck.length < 2) return;

    if (STRONG_CTA_WORDS.some((w) => textToCheck.includes(w))) {
      strongCtaCount++;
      allCtaTexts.add(textToCheck);
      ctaDebugStrong.push(textToCheck.slice(0, 60));
    } else if (WEAK_CTA_WORDS.some((w) => textToCheck.includes(w))) {
      weakCtaCount++;
      allCtaTexts.add(textToCheck);
      ctaDebugWeak.push(textToCheck.slice(0, 60));
    }
  });

  /* Fallback para sitios JS-rendered: segunda pasada sobre el HTML crudo */
  const rawLower = html.toLowerCase();
  const isLikelyJsRendered = bodyText.trim().split(/\s+/).length < 300 && $("script").length > 5;
  let rawFallbackFound: string[] = [];
  if (strongCtaCount === 0) {
    const saasPatterns = [
      "get started", "try for free", "start for free", "sign up",
      "start free", "free trial", "get access", "book a demo",
      "get started free", "try it free", "start now",
    ];
    rawFallbackFound = saasPatterns.filter((p) => rawLower.includes(p));
    strongCtaCount += rawFallbackFound.length;
  }

  console.log(`[audit/copy][CTA] ${url.slice(0, 70)}`);
  console.log(`  fuertes (${strongCtaCount}): ${JSON.stringify(ctaDebugStrong.slice(0, 10))}`);
  console.log(`  débiles (${weakCtaCount}):  ${JSON.stringify(ctaDebugWeak.slice(0, 10))}`);
  console.log(`  bodyWords=${bodyText.trim().split(/\s+/).length} scripts=${$("script").length} jsRendered=${isLikelyJsRendered} rawFallback=${JSON.stringify(rawFallbackFound)}`);

  /* ── 2. Contacto disponible ──────────────────────────────────────── */
  const forms     = $("form");
  const hasWaLink = $("a[href*='wa.me'], a[href*='whatsapp']").length > 0
                 || bodyLower.includes("wa.me")
                 || bodyLower.includes("whatsapp");
  const inputCount = forms.length > 0
    ? forms.first().find("input:not([type='hidden']):not([type='submit'])").length
    : 0;
  const hasSignupLink = $("a[href*='signup'], a[href*='sign-up'], a[href*='register'], a[href*='get-started'], a[href*='start'], a[href*='trial'], a[href*='/join']").length > 0;
  const hasContact = hasWaLink || (forms.length > 0 && inputCount <= 5) || hasSignupLink || strongCtaCount >= 2;

  /* ── 3. Tipo de página y de negocio ──────────────────────────────── */
  const { type: pageType, scores: pageTypeScores } = detectPageType($, bodyText, bodyLower, url, allCtaTexts.size);
  const businessType = detectBusinessType(bodyLower);

  /* ── 4. SEO score (técnico puro) ─────────────────────────────────── */
  const titleText   = $("title").text().trim();
  const hasTitle    = titleText.length > 10;
  const metaContent = ($('meta[name="description"]').attr("content") ?? "").trim();
  const metaLen     = metaContent.length;
  /* Meta description: 50-160 chars = puntos completos; >10 pero fuera de rango = parcial */
  const metaFull    = metaLen >= 50 && metaLen <= 160;
  const metaPartial = metaLen > 10 && !metaFull;
  const hasMetaDesc = metaFull || metaPartial;
  const h1Count     = $("h1").length;
  const h1Text      = $("h1").first().text().trim();
  const h1Len       = h1Text.length;
  /* H1 válido: exactamente uno, entre 10 y 70 caracteres */
  const h1Valid     = h1Count === 1 && h1Len >= 10 && h1Len <= 70;

  const imgs        = $("img").toArray();
  const imgWithAlt  = imgs.filter((el) => ($(el).attr("alt") ?? "").trim().length > 0).length;
  const altCoverage = imgs.length === 0 ? 1 : imgWithAlt / imgs.length;

  let seoScore = 0;
  if (hasTitle)          seoScore += 2;
  if (metaFull)          seoScore += 2;   // 50-160 chars: puntos completos
  else if (metaPartial)  seoScore += 1;   // existe pero fuera de rango
  if (h1Valid)           seoScore += 4;   // un H1 con longitud correcta (10-70c)
  else if (h1Count === 1) seoScore += 2;  // existe pero longitud fuera de rango
  if (altCoverage > 0.8) seoScore += 2;

  /* Caps individuales por carencias críticas */
  const seoRaw     = seoScore;
  const capReasons: string[] = [];
  if (h1Count === 0)    { capReasons.push("sin H1"); }
  if (!hasMetaDesc)     { capReasons.push("sin meta description"); }
  if (altCoverage < 0.8) { capReasons.push(`alts ${Math.round(altCoverage * 100)}%<80%`); }

  /* Sin H1 o sin meta desc: cap crítico en 6 */
  if (h1Count === 0 || !hasMetaDesc) seoScore = Math.min(seoScore, 6);
  /* Alt coverage insuficiente: cap en 7 (solo imágenes, no bloquea completamente) */
  if (altCoverage < 0.8) seoScore = Math.min(seoScore, 7);
  seoScore = clamp(seoScore, 1, 10);

  /* Log de debug para SEO — visible en consola del servidor */
  console.log(`[audit/copy][SEO] ${url.slice(0, 70)}`);
  console.log(`  title  (>10c): ${hasTitle ? "✓" : "✗"} "${titleText.slice(0, 60)}"`);
  console.log(`  meta   (50-160c): ${metaFull ? "✓ full" : metaPartial ? "~ partial" : "✗"} "${metaContent.slice(0, 60)}" (${metaLen}c)`);
  console.log(`  h1 count: ${h1Count} ${h1Valid ? "✓ válido" : h1Count === 1 ? `~ existe pero len=${h1Len}` : h1Count === 0 ? "✗ falta" : "✗ duplicado"}`);
  console.log(`  imgs: ${imgs.length} total, ${imgWithAlt} con alt (${Math.round(altCoverage * 100)}%) ${altCoverage > 0.8 ? "✓" : "✗"}`);
  console.log(`  score: raw=${seoRaw}${capReasons.length ? ` → caps [${capReasons.join(", ")}]` : " → sin cap"} → final=${seoScore}`);

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
  let copyPenalties = 0;

  if (pageType === "blog") {
    /* Blog: solo claridad de titular y meta */
    const h1Clean   = $("h1").first().text().trim();
    const metaClean = ($('meta[name="description"]').attr("content") ?? "").trim();
    copyScore = (h1Clean.length > 5 && metaClean.length > 10) ? 6 : 4;

  } else {
    /* Base = 8. Se ajusta solo hacia abajo con penalizaciones acumuladas (cap -5) */

    /* Penalización: H1 genérico → -2 (antes era ceiling en 5) */
    if (hasGenericH1 && (pageType === "conversion" || pageType === "contact")) {
      copyPenalties += 2;
    }

    /* Penalización: features > beneficios (solo conversion) */
    if (hasFeatureBias && pageType === "conversion") {
      copyPenalties += 1;
    }

    /* Penalización: claims sin evidencia (solo conversion) */
    if (hasUnsubstantiated && pageType === "conversion") {
      copyPenalties += 1;
    }

    /* Penalización: ratio ego/cliente alto (solo conversion) */
    const egoCount = countOccurrences(bodyText, EGO_WORDS);
    const clientCnt = countOccurrences(bodyText, CLIENT_WORDS);
    if (pageType === "conversion" && clientCnt > 0 && egoCount > clientCnt * 2) {
      copyPenalties += 1;
    }

    /* Penalización: falta de prueba social (solo conversion, según tipo de negocio) */
    if (pageType === "conversion" && !hasSocialProof) {
      copyPenalties += (businessType === "ecommerce" || businessType === "services") ? 2 : 1;
    }

    /* Cap de penalizaciones: máximo -5 puntos */
    copyPenalties = Math.min(copyPenalties, 5);

    /* Floor en 3 si hay algo de contenido, 1 si la página está vacía */
    const isEmptyPage = bodyText.trim().length < 200;
    copyScore = Math.max(isEmptyPage ? 1 : 3, 8 - copyPenalties);
  }

  copyScore = clamp(copyScore, 1, 10);

  /* ── 8. CTA score ────────────────────────────────────────────────── */

  /* Email capture: input[type="email"] + botón en los primeros elementos → conversión directa */
  const firstElements       = $("body").children().slice(0, 5);
  const hasEmailCaptureCTA  = firstElements.find('input[type="email"]').length > 0
                           && firstElements.find("button, input[type='submit']").length > 0;

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

  /* Email capture above-the-fold = conversión directa → score mínimo 9 */
  if (hasEmailCaptureCTA) ctaScore = Math.max(ctaScore, 9);

  /* Sitio JS-rendered con score inflado por fallback raw → cap en 7 */
  if (isLikelyJsRendered && ctaScore > 7) ctaScore = 7;

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

  const result: CopyResult = {
    seoScore, copyScore, ctaScore,
    hasSocialProof, hicksLawViolation, formFriction,
    pageType, businessType,
    hasGenericH1, hasFeatureBias, hasUnsubstantiated,
  };

  /* Debug info — solo se adjunta fuera de producción */
  if (process.env.NODE_ENV !== "production") {
    result._debug = {
      pageTypeScores,
      copyPenalties,
      seoElements: { hasTitle, hasMetaDesc, h1Count, altCoverage },
    };
  }

  console.log(`[CTA-FINAL] ${url.slice(0, 50)} | bodyLen=${html.length} | bodyWords=${bodyText.trim().split(/\s+/).length} | strongRaw=${strongCtaCount} | weakRaw=${weakCtaCount} | ctaScore=${ctaScore} | hasWa=${hasWaLink} | forms=${forms.length}`);

  return result;
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

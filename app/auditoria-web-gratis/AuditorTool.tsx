"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FormFriction, PageType, BusinessType, PageTypeScores } from "@/app/api/audit/copy/route";

/* ─── Constantes ──────────────────────────── */
const WA_URL =
  "https://wa.me/5493512613927?text=Hola%20Santiago!%20Analicé%20mi%20sitio%20con%20la%20herramienta%20de%20Level%20Growth%20y%20tiene%20problemas%20de%20conversión.%20Quiero%20una%20auditoría%20profesional.";

const LOADING_MESSAGES = [
  "Midiendo velocidad en dispositivos móviles...",
  "Analizando el mensaje de tu marca...",
  "Evaluando oportunidades de mejora...",
  "Calculando impacto en ventas...",
];

/* ─── Tipos ───────────────────────────────── */
type Step  = "input" | "loading" | "results";
type Level = "red" | "yellow" | "green";

type Scenario =
  | "maquina"
  | "puerta-giratoria"
  | "doble-friccion"
  | "abismo";

interface AuditResults {
  speed:              number | null;  /* null si PageSpeed y TTFB fallaron */
  seo:                number;
  copy:               number;
  cta:                number;
  lcpMs:              number | null;
  hasSocialProof:     boolean;
  hicksLawViolation:  boolean;
  formFriction:       FormFriction;
  pageType:           PageType;
  businessType:       BusinessType;
  hasGenericH1:       boolean;
  hasFeatureBias:     boolean;
  hasUnsubstantiated: boolean;
  _debug?: {
    pageTypeScores: PageTypeScores;
    copyPenalties:  number;
    seoElements:    { hasTitle: boolean; hasMetaDesc: boolean; h1Count: number; altCoverage: number };
  };
}

/* ─── Semáforo ────────────────────────────── */
function getLevel(score: number): Level {
  if (score <= 4) return "red";
  if (score <= 7) return "yellow";
  return "green";
}

const LEVEL_COLOR: Record<Level, string> = {
  red:    "#EF4444",
  yellow: "#F59E0B",
  green:  "#3FC87A",
};
const LEVEL_LABEL: Record<Level, string> = {
  red:    "Crítico",
  yellow: "Mejorable",
  green:  "Bueno",
};

function scoreColor(score: number)   { return LEVEL_COLOR[getLevel(score)]; }
function overallColor(score: number) {
  if (score <= 40) return "#EF4444";
  if (score <= 70) return "#F59E0B";
  return "#3FC87A";
}

/* ─── Mensajes base ──────────────────────── */
type Category = "speed" | "seo" | "copy" | "cta";

const BASE_MESSAGES: Record<Category, Record<Level, string>> = {
  speed: {
    red:    "Tu web tiene el freno de mano puesto. Cada segundo de carga extra cuesta hasta un 10% de conversiones (Google). Con mejoras de performance podés recuperar ese tráfico perdido sin cambiar una sola línea de copy.",
    yellow: "Tu sitio carga bien en desktop pero tiene margen en mobile. El 70% de tus visitantes navegan desde el celular. Optimizaciones puntuales en imágenes y scripts pueden marcar una diferencia notable en tus conversiones.",
    green:  "Excelente velocidad. Tu sitio no pierde clientes por este motivo. Enfocá la energía en el mensaje y las llamadas a la acción.",
  },
  seo: {
    red:    "Tu sitio tiene problemas técnicos de SEO que limitan tu visibilidad. Con ajustes en el título, la descripción y los encabezados podés mejorar tu posicionamiento significativamente sin inversión en publicidad.",
    yellow: "Tus bases de SEO están pero hay oportunidades claras de mejora. Completar los elementos faltantes puede aumentar tu tráfico orgánico de forma sostenida.",
    green:  "Buenas bases técnicas de SEO. Tu sitio tiene los elementos correctos para posicionarse. Ahora el foco debe estar en la calidad del contenido y la autoridad de dominio.",
  },
  copy: {
    red:    "Tu mensaje no conecta con lo que el cliente necesita escuchar. Los sitios orientados al cliente convierten hasta 200% más. Con ajustes en el copy podés transformar el tráfico existente en consultas reales.",
    yellow: "Tu mensaje podría ser más persuasivo. Hay oportunidades claras para orientar mejor el copy hacia los problemas y deseos de tu cliente.",
    green:  "Tu copy está bien orientado al cliente. El mensaje comunica valor de forma clara. Seguí iterando en base a datos reales de comportamiento.",
  },
  cta: {
    red:    "Tu sitio no guía al visitante hacia la acción. Un CTA claro puede aumentar las conversiones de forma inmediata, sin cambiar el diseño ni el presupuesto de publicidad.",
    yellow: "Tus llamadas a la acción existen pero podrían ser más fuertes. Cambiar el texto por verbos de acción concretos puede aumentar el click-through de manera significativa.",
    green:  "Tus CTAs son claros y están bien posicionados. Los visitantes saben exactamente qué hacer cuando llegan.",
  },
};

/* ─── Flags para mensajes contextuales ───── */
interface MsgFlags {
  hasSocialProof:     boolean;
  hicksLawViolation:  boolean;
  formFriction:       FormFriction;
  pageType:           PageType;
  businessType:       BusinessType;
  hasGenericH1:       boolean;
  hasFeatureBias:     boolean;
  hasUnsubstantiated: boolean;
}

/* ─── Social proof por tipo de negocio ───── */
function getSocialProofMsg(bt: BusinessType): string {
  switch (bt) {
    case "ecommerce":
      return "Sin reseñas de clientes visibles, los compradores no tienen motivo para preferirte. Las tiendas con reviews activos convierten hasta 3x más. Agregá testimonios o calificaciones — es uno de los cambios de mayor impacto que podés hacer.";
    case "b2b":
      return "Para clientes B2B, los logos de empresas con las que trabajaste y los casos de éxito con resultados medibles son el principal factor de confianza. Mostrar evidencia de tu experiencia puede aumentar tu tasa de conversión de manera significativa.";
    case "services":
      return "En servicios profesionales, el cliente compra confianza antes que precio. Sin testimonios o resultados concretos, el visitante no puede validar tu experiencia. Un caso de éxito con número real vale más que diez afirmaciones genéricas.";
    default:
      return "Tu web se siente sola. El cliente actual no te cree a vos, le cree a otros clientes. Agregar testimonios, logos o evidencia de clientes anteriores puede multiplicar tu tasa de contacto de forma notable.";
  }
}

/* ─── Selector de mensaje por categoría ──── */
function getMessage(cat: Category, score: number, flags: MsgFlags): string {
  const {
    pageType, businessType, hasSocialProof,
    hicksLawViolation, formFriction,
    hasGenericH1, hasFeatureBias, hasUnsubstantiated,
  } = flags;

  /* ── Copy ────────────────────────────────────────────────────────── */
  if (cat === "copy") {
    if (pageType === "institutional") {
      return "Esta es una página institucional — hablar de la empresa es lo esperado. La oportunidad está en incluir CTAs claros que lleven al visitante hacia tus páginas de conversión o contacto.";
    }
    if (pageType === "blog") {
      return score >= 7
        ? "Los titulares de tus artículos están bien trabajados. Seguí midiendo qué temas generan más engagement y replicá ese formato."
        : "Los titulares definen si alguien hace clic o sigue scrolleando. Un buen título no describe el artículo — promete un resultado concreto. Revisá y optimizá los titulares de tus posts principales.";
    }
    if (hasGenericH1) {
      return "Tu web tarda más en explicar qué hace que lo que el cliente tarda en irse. Necesitás una propuesta de valor que se entienda en 5 segundos: qué hacés, para quién, y qué resultado consiguen. Con ese ajuste solo en el H1 podés aumentar el tiempo en página de forma significativa.";
    }
    if (hasFeatureBias && pageType === "conversion") {
      return "Tu sitio describe características pero no comunica beneficios claros. El cliente no compra un producto, compra el resultado que ese producto le da. Reformular el copy en términos de beneficios puede aumentar tu tasa de contacto de forma importante.";
    }
    if (hasUnsubstantiated && pageType === "conversion") {
      return "Tu sitio hace afirmaciones fuertes sin respaldo. Decir 'somos los mejores' sin probarlo genera desconfianza, no ventas. Reemplazá esos claims con datos concretos: años de experiencia, cantidad de clientes, resultados medibles.";
    }
    if (!hasSocialProof && pageType === "conversion") {
      return getSocialProofMsg(businessType);
    }
  }

  /* ── CTA ─────────────────────────────────────────────────────────── */
  if (cat === "cta") {
    if (pageType === "institutional" && score <= 5) {
      return "Tu página institucional no lleva al visitante al siguiente paso. Cada página necesita un camino claro hacia la conversión. Agregá al menos un CTA que dirija hacia tu página de servicios o contacto.";
    }
    if (pageType === "contact") {
      if (score >= 8) {
        return "Bien: tenés formulario y WhatsApp como alternativa. El siguiente factor crítico es el tiempo de respuesta — los clientes que reciben respuesta en menos de 5 minutos convierten a una tasa significativamente mayor.";
      }
      return "Ofrecé WhatsApp como alternativa visible al formulario. Los usuarios prefieren el canal donde ya están activos — el formulario solo no es suficiente para capturar a todos los interesados.";
    }
    if (pageType === "blog") {
      return score >= 7
        ? "Tus artículos tienen CTAs. Seguí midiendo cuáles generan más consultas para concentrar el esfuerzo donde el ROI es mayor."
        : "Los artículos sin CTA son oportunidades perdidas. Agregá un llamado a la acción al final de cada post — puede ser tan simple como 'Contactanos para aplicar esto a tu negocio'.";
    }
    if (formFriction === "missing") {
      return "Tu sitio no tiene una forma clara de contacto. El cliente que quiere comprarte no sabe cómo hacerlo. Agregá WhatsApp o un formulario simple y vas a ver resultados de inmediato.";
    }
    if (formFriction === "too_many_fields") {
      return "Estás pidiendo demasiado antes de dar algo. Tu formulario es una barrera, no un puente. Reducir a 3 campos (nombre, email, mensaje) puede duplicar las consultas que recibís.";
    }
    if (hicksLawViolation) {
      return "Tu hero tiene demasiadas opciones compitiendo. Cuando hay demasiadas decisiones, el visitante no elige ninguna (Ley de Hick). Una sola acción dominante arriba del fold puede aumentar tus conversiones de forma inmediata.";
    }
    /* CTAs débiles: si score bajo y no es por falta de contacto */
    if (score <= 3) {
      return "Tus botones usan palabras genéricas que no generan urgencia ni claridad. Cambiar 'Enviar' o 'Ver más' por 'Cotizá ahora' o 'Hablá con un especialista' puede aumentar el click-through de tus CTAs de manera significativa.";
    }
  }

  /* ── Speed ───────────────────────────────────────────────────────── */
  if (cat === "speed") {
    if (getLevel(score) === "red")   return BASE_MESSAGES.speed.red;
    if (getLevel(score) === "green") return BASE_MESSAGES.speed.green;
    if (score <= 5) return "Tu sitio tiene problemas serios de velocidad, especialmente en mobile. La mayoría de los visitantes no esperan más de 3 segundos — si tu sitio tarda más, los perdés antes de que vean tu propuesta de valor.";
    return BASE_MESSAGES.speed.yellow;
  }

  return BASE_MESSAGES[cat][getLevel(score)];
}

/* ─── Estimación contextual de visitas y conversiones ──── */
function estimateContext(
  businessType: BusinessType,
  pageType:     PageType,
  seoScore:     number,
  _overall:     number,
): { visits: number; unitLabel: string; conversionRate: number } {
  void pageType; // reservado para refinamiento futuro

  const BASE_VISITS: Record<BusinessType, number> = {
    ecommerce: 3000,
    b2b:       600,
    services:  350,
    general:   400,
  };

  const seoMultiplier = seoScore >= 8 ? 2 : seoScore >= 6 ? 1.3 : 1;
  const visits = Math.round(BASE_VISITS[businessType] * seoMultiplier / 100) * 100;

  const CONVERSION_RATE: Record<BusinessType, number> = {
    ecommerce: 0.02,
    b2b:       0.02,
    services:  0.04,
    general:   0.03,
  };

  const UNIT_LABEL: Record<BusinessType, string> = {
    ecommerce: "ventas potenciales",
    b2b:       "oportunidades de negocio",
    services:  "consultas",
    general:   "contactos",
  };

  return {
    visits,
    unitLabel:      UNIT_LABEL[businessType],
    conversionRate: CONVERSION_RATE[businessType],
  };
}

/* ─── Escenario basado en puntaje general ──── */
function getScenario(overall: number, ctaScore: number, copyScore: number): Scenario {
  /* Regla de eslabón más débil: si CTA o copy no superan 5, nunca es "maquina" */
  const weakLink = ctaScore < 5 || copyScore < 5;
  if (overall >= 88 && !weakLink) return "maquina";
  if (overall >= 75)              return "puerta-giratoria";
  if (overall >= 50)              return "doble-friccion";
  return                                 "abismo";
}

function getLossRange(scenario: Scenario): [number, number] {
  switch (scenario) {
    case "maquina":          return [0,  10];
    case "puerta-giratoria": return [30, 50];
    case "doble-friccion":   return [50, 70];
    case "abismo":           return [80, 95];
  }
}

const SCENARIO_DATA: Record<Scenario, { name: string; color: string }> = {
  "maquina":          { name: "La Máquina de Ventas", color: "#3FC87A" },
  "puerta-giratoria": { name: "La Puerta Giratoria",  color: "#F59E0B" },
  "doble-friccion":   { name: "Doble Fricción",        color: "#F97316" },
  "abismo":           { name: "El Abismo",             color: "#EF4444" },
};

function getScenarioMessage(scenario: Scenario, lossRange: [number, number]): string {
  const [min, max] = lossRange;
  switch (scenario) {
    case "maquina":
      return "Tu sitio tiene buenas bases técnicas y un mensaje claro. El margen de mejora existe pero no estás perdiendo clientes de forma significativa por estos factores. El foco ahora debería estar en optimización fina y en el proceso de ventas post-contacto.";
    case "puerta-giratoria":
      return `Tu sitio está bien encaminado pero hay oportunidades claras de mejora en uno o más puntos del funnel. El eslabón más débil es el que más cuesta — identificarlo y resolverlo puede recuperar entre el ${min} y el ${max}% de las conversiones que hoy se pierden.`;
    case "doble-friccion":
      return `Tu sitio tiene fricción en más de un punto del funnel. Ningún problema individual es crítico por sí solo, pero juntos generan una pérdida estimada del ${min}-${max}% de tus conversiones posibles. Un especialista puede mostrarte exactamente por dónde arrancar para el mayor impacto.`;
    case "abismo":
      return "Tu sitio está perdiendo la gran mayoría de su potencial de conversión. Los problemas son sistémicos — velocidad, mensaje y llamadas a la acción trabajan en contra del visitante. Con mejoras coordinadas en estos frentes podés multiplicar tus resultados actuales de forma significativa.";
  }
}

/* ─── CountUp ─────────────────────────────── */
function CountUp({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    setValue(0);
    const start = performance.now();
    const tick  = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setValue(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return <>{value}</>;
}

/* ─── ScoreCard ───────────────────────────── */
function ScoreCard({
  label, score, message, delay,
}: {
  label:   string;
  score:   number;
  message: string;
  delay:   number;
}) {
  const color = scoreColor(score);
  const level = getLevel(score);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] rounded-xl p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-body text-[0.7rem] text-[#4A6070] uppercase tracking-[0.1em] mb-1">
            {label}
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-5xl font-medium leading-none" style={{ color }}>
              <CountUp target={score} />
            </span>
            <span className="font-mono text-xl text-[#4A6070]">/10</span>
          </div>
        </div>
        <span
          className="font-body text-[0.65rem] font-medium px-2.5 py-1 rounded-full border"
          style={{ color, borderColor: `${color}40`, backgroundColor: `${color}15` }}
        >
          {LEVEL_LABEL[level]}
        </span>
      </div>
      <p className="font-body text-sm text-[#7A8FA6] leading-[1.65]">{message}</p>
    </motion.div>
  );
}

/* ─── Etiqueta de tipo de página ─────────── */
const PAGE_TYPE_LABEL: Record<string, string> = {
  conversion:    "Pág. de conversión",
  institutional: "Pág. institucional",
  blog:          "Blog / listado",
  contact:       "Pág. de contacto",
};

/* ─── Componente principal ────────────────── */
export function AuditorTool() {
  const [step,     setStep]     = useState<Step>("input");
  const [url,      setUrl]      = useState("");
  const [error,    setError]    = useState("");
  const [msgIdx,   setMsgIdx]   = useState(0);
  const [progress, setProgress] = useState(0);
  const [results,  setResults]  = useState<AuditResults | null>(null);

  /* overall primero — scenario lo necesita */
  const overall   = results
    ? results.speed !== null
      ? Math.round((results.speed + results.seo + results.copy + results.cta) * 2.5)
      : Math.round(((results.seo + results.copy + results.cta) / 30) * 100)
    : 0;
  const scenario  = results ? getScenario(overall, results.cta, results.copy) : "maquina";
  const lossRange = results ? getLossRange(scenario) : [0, 10] as [number, number];

  /* Rotar mensajes de carga */
  useEffect(() => {
    if (step !== "loading") return;
    const id = setInterval(() => setMsgIdx((i) => (i + 1) % LOADING_MESSAGES.length), 2200);
    return () => clearInterval(id);
  }, [step]);

  /* Barra de progreso falsa (termina en 92%) */
  useEffect(() => {
    if (step !== "loading") { setProgress(0); return; }
    const start = performance.now();
    const dur   = 40_000;
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 0.92);
      setProgress(p);
      if (p < 0.92) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [step]);

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    setError("");
    setStep("loading");
    setMsgIdx(0);

    try {
      const normalized = url.trim().startsWith("http") ? url.trim() : `https://${url.trim()}`;
      try { new URL(normalized); } catch {
        setError("La URL no parece válida. Probá con: tuempresa.com");
        setStep("input");
        return;
      }

      const encoded = encodeURIComponent(normalized);
      const [psRes, copyRes] = await Promise.all([
        fetch(`/api/audit/pagespeed?url=${encoded}`),
        fetch(`/api/audit/copy?url=${encoded}`),
      ]);

      const ps   = await psRes.json();
      const copy = await copyRes.json();

      setResults({
        speed:              ps.speedScore          ?? null,
        seo:                copy.seoScore          ?? 4,
        copy:               copy.copyScore         ?? 4,
        cta:                copy.ctaScore          ?? 4,
        lcpMs:              ps.lcpMs               ?? null,
        hasSocialProof:     copy.hasSocialProof    ?? false,
        hicksLawViolation:  copy.hicksLawViolation ?? false,
        formFriction:       copy.formFriction      ?? "none",
        pageType:           copy.pageType          ?? "conversion",
        businessType:       copy.businessType      ?? "general",
        hasGenericH1:       copy.hasGenericH1      ?? false,
        hasFeatureBias:     copy.hasFeatureBias    ?? false,
        hasUnsubstantiated: copy.hasUnsubstantiated ?? false,
        _debug:             copy._debug,
      });

      setProgress(1);
      setTimeout(() => setStep("results"), 400);
    } catch (err) {
      console.error("[audit]", err);
      setError("No pudimos conectarnos. Verificá tu conexión e intentá de nuevo.");
      setStep("input");
    }
  }

  function reset() {
    setStep("input");
    setResults(null);
    setUrl("");
    setError("");
  }

  const flags: MsgFlags = results
    ? {
        hasSocialProof:     results.hasSocialProof,
        hicksLawViolation:  results.hicksLawViolation,
        formFriction:       results.formFriction,
        pageType:           results.pageType,
        businessType:       results.businessType,
        hasGenericH1:       results.hasGenericH1,
        hasFeatureBias:     results.hasFeatureBias,
        hasUnsubstantiated: results.hasUnsubstantiated,
      }
    : {
        hasSocialProof: true, hicksLawViolation: false, formFriction: "none",
        pageType: "conversion", businessType: "general",
        hasGenericH1: false, hasFeatureBias: false, hasUnsubstantiated: false,
      };

  return (
    <AnimatePresence mode="wait">

      {/* ── PASO 1: Input ─────────────────────── */}
      {step === "input" && (
        <motion.div
          key="input"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
        >
          <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="tuempresa.com"
              autoFocus
              aria-label="URL del sitio web a analizar"
              className="flex-1 font-body text-base text-white placeholder-[#4A6070] bg-[#0D1221] border border-white/[0.08] rounded-lg px-4 py-3.5 outline-none transition-all duration-200"
              onFocus={(e) => (e.target.style.borderColor = "rgba(63,200,122,0.4)")}
              onBlur={(e)  => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
            />
            <button
              type="submit"
              className="font-body font-medium text-sm text-white px-6 py-3.5 rounded-lg whitespace-nowrap transition-all duration-200 hover:brightness-110 active:brightness-95"
              style={{ background: "linear-gradient(135deg, #2BA86A, #1a7a4e)", boxShadow: "0 0 20px rgba(43,168,106,0.3)" }}
            >
              Analizar mi sitio gratis
            </button>
          </form>

          {error && <p className="font-body text-sm text-[#EF4444] mt-3">{error}</p>}

          <p className="font-body text-xs text-[#4A6070] mt-3 text-center">
            Solo leemos tu sitio públicamente — no guardamos datos ni necesitamos acceso.
          </p>
        </motion.div>
      )}

      {/* ── PASO 2: Loading ───────────────────── */}
      {step === "loading" && (
        <motion.div
          key="loading"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
          className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] rounded-xl p-10 text-center"
        >
          <div className="w-full bg-white/[0.06] rounded-full h-1 mb-10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.round(progress * 100)}%`, background: "linear-gradient(90deg, #3FC87A, #4A9EE0)" }}
            />
          </div>

          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 rounded-full mx-auto mb-7"
            style={{ border: "2px solid rgba(63,200,122,0.15)", borderTop: "2px solid #3FC87A" }}
          />

          <AnimatePresence mode="wait">
            <motion.p
              key={msgIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="font-body text-base text-[#7A8FA6]"
            >
              {LOADING_MESSAGES[msgIdx]}
            </motion.p>
          </AnimatePresence>

          <p className="font-body text-xs text-[#4A6070] mt-3">
            El análisis tarda entre 30 y 60 segundos
          </p>
        </motion.div>
      )}

      {/* ── PASO 3: Resultados ────────────────── */}
      {step === "results" && results && (
        <motion.div
          key="results"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* URL analizada + tipo detectado + resetear */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              <p className="font-body text-sm text-[#4A6070]">
                Análisis de <span className="text-[#7A8FA6] break-all">{url}</span>
              </p>
              <span className="font-body text-[0.6rem] uppercase tracking-[0.08em] px-2 py-0.5 rounded border border-white/[0.08] text-[#4A6070]">
                {PAGE_TYPE_LABEL[results.pageType] ?? results.pageType}
              </span>
            </div>
            <button
              onClick={reset}
              className="font-body text-xs text-[#3FC87A] hover:text-white transition-colors duration-200"
            >
              Analizar otro sitio
            </button>
          </div>

          {/* 4 score cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {results.speed !== null ? (
              <ScoreCard label="Velocidad" score={results.speed} message={getMessage("speed", results.speed, flags)} delay={0} />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0 }}
                className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] rounded-xl p-6"
              >
                <p className="font-body text-[0.7rem] text-[#4A6070] uppercase tracking-[0.1em] mb-3">Velocidad</p>
                <p className="font-mono text-sm text-[#4A6070] mb-3">— / 10</p>
                <p className="font-body text-sm text-[#7A8FA6] leading-[1.65]">
                  No pudimos analizar la velocidad de este sitio. Puede deberse a restricciones de acceso del servidor o bloqueos de red. Podés medirla manualmente en{" "}
                  <span className="text-[#3FC87A]">pagespeed.web.dev</span>.
                </p>
              </motion.div>
            )}
            <ScoreCard label="SEO"                  score={results.seo}   message={getMessage("seo",   results.seo,   flags)} delay={0.1} />
            <ScoreCard label="Mensaje"              score={results.copy}  message={getMessage("copy",  results.copy,  flags)} delay={0.2} />
            <ScoreCard label="Llamadas a la acción" score={results.cta}   message={getMessage("cta",   results.cta,   flags)} delay={0.3} />
          </div>

          {/* Panel de escenario e impacto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="rounded-xl p-8 text-center"
            style={{ background: "linear-gradient(135deg, #0D1F4A 0%, #071a0e 60%, #080C14 100%)" }}
          >
            {/* Puntaje general */}
            <p className="font-body text-[0.7rem] text-[#4A6070] uppercase tracking-[0.1em] mb-2">
              Puntaje general
            </p>
            <div className="flex items-baseline justify-center gap-2 mb-5">
              <span
                className="font-mono font-medium leading-none"
                style={{ fontSize: "clamp(3.5rem, 8vw, 5rem)", color: overallColor(overall) }}
              >
                <CountUp target={overall} duration={1500} />
              </span>
              <span className="font-mono text-2xl text-[#4A6070]">/100</span>
            </div>

            {/* Escenario detectado */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border"
              style={{
                borderColor:     `${SCENARIO_DATA[scenario].color}40`,
                backgroundColor: `${SCENARIO_DATA[scenario].color}12`,
              }}
            >
              <span className="font-body text-[0.7rem] text-[#7A8FA6] uppercase tracking-[0.08em]">
                Escenario detectado:
              </span>
              <span
                className="font-display font-bold text-base tracking-wide"
                style={{ color: SCENARIO_DATA[scenario].color }}
              >
                {SCENARIO_DATA[scenario].name}
              </span>
            </div>

            {/* Mensaje del escenario */}
            <p className="font-body text-[1rem] text-[#7A8FA6] leading-[1.7] max-w-[500px] mx-auto mb-3">
              {getScenarioMessage(scenario, lossRange)}
            </p>

            {/* Pérdida estimada contextual */}
            {scenario !== "maquina" && results && (() => {
              const { visits, unitLabel, conversionRate } = estimateContext(
                results.businessType,
                results.pageType,
                results.seo,
                overall,
              );
              const [lossMin, lossMax] = lossRange;
              const baseConversions = Math.round(visits * conversionRate);
              const lostMin = Math.round(baseConversions * lossMin / 100);
              const lostMax = Math.round(baseConversions * lossMax / 100);
              if (lostMin < 1) return null;
              return (
                <p className="font-body text-sm text-[#7A8FA6] leading-[1.7] max-w-[500px] mx-auto mb-2">
                  En un sitio con tráfico similar al tuyo, eso representa entre{" "}
                  <span className="text-white font-medium">{lostMin}</span> y{" "}
                  <span className="text-white font-medium">{lostMax}</span>{" "}
                  {unitLabel} perdidas por mes que podrían estar eligiéndote a vos.
                </p>
              );
            })()}

            {/* Disclaimer */}
            <p className="font-body text-[0.68rem] text-[#4A6070] max-w-[480px] mx-auto mb-8 leading-relaxed">
              Este análisis es orientativo y se basa en indicadores técnicos públicos de tu sitio, aplicando benchmarks de Google, Amazon, Nielsen Norman Group y Robert Cialdini. No reemplaza una auditoría profesional completa que considere tu modelo de negocio, tus canales de venta y tus datos reales de conversión.
            </p>

            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 font-body font-medium text-base text-white px-8 py-4 rounded-lg transition-all duration-200 hover:brightness-110 active:brightness-95 mb-4"
              style={{ background: "linear-gradient(135deg, #2BA86A, #1a7a4e)", boxShadow: "0 0 28px rgba(43,168,106,0.4)" }}
            >
              Quiero recuperar esos clientes →
            </a>

            <p className="font-body text-xs text-[#4A6070]">
              Un especialista analiza tu caso en menos de 24hs. Sin costo.
            </p>
          </motion.div>

          {/* Panel de debug — solo visible en desarrollo */}
          {process.env.NODE_ENV !== "production" && results._debug && (
            <div className="mt-4 p-4 rounded-xl border border-white/[0.08] bg-black/40 font-mono text-[0.65rem] text-[#4A6070] space-y-1">
              <p className="text-[#3FC87A] mb-2 font-medium">⚙ DEBUG (solo en desarrollo)</p>
              <p>
                <span className="text-[#7A8FA6]">Tipo detectado:</span>{" "}
                <span className="text-white">{results.pageType}</span>
                {" · "}conv={results._debug.pageTypeScores.conversion}{" "}
                inst={results._debug.pageTypeScores.institutional}{" "}
                blog={results._debug.pageTypeScores.blog}{" "}
                ctc={results._debug.pageTypeScores.contact}
              </p>
              <p>
                <span className="text-[#7A8FA6]">Copy:</span>{" "}
                base=8 penalizaciones=-{results._debug.copyPenalties} → score={results.copy}
              </p>
              <p>
                <span className="text-[#7A8FA6]">SEO elements:</span>{" "}
                title={results._debug.seoElements.hasTitle ? "✓" : "✗"}{" "}
                meta={results._debug.seoElements.hasMetaDesc ? "✓" : "✗"}{" "}
                h1={results._debug.seoElements.h1Count}{" "}
                alts={Math.round(results._debug.seoElements.altCoverage * 100)}%{" "}
                → score={results.seo}
              </p>
              <p>
                <span className="text-[#7A8FA6]">Negocio:</span> {results.businessType}{" · "}
                <span className="text-[#7A8FA6]">Social proof:</span> {results.hasSocialProof ? "✓" : "✗"}{" · "}
                <span className="text-[#7A8FA6]">H1 genérico:</span> {results.hasGenericH1 ? "✓" : "✗"}{" · "}
                <span className="text-[#7A8FA6]">Feature bias:</span> {results.hasFeatureBias ? "✓" : "✗"}
              </p>
            </div>
          )}
        </motion.div>
      )}

    </AnimatePresence>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FormFriction } from "@/app/api/audit/copy/route";

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
type Step = "input" | "loading" | "results";
type Level = "red" | "yellow" | "green";

type Scenario =
  | "optimal"
  | "puerta-giratoria"
  | "cuello-de-botella"
  | "abismo";

interface AuditResults {
  speed:             number;
  seo:               number;
  copy:              number;
  cta:               number;
  lcpMs:             number;
  hasSocialProof:    boolean;
  hicksLawViolation: boolean;
  formFriction:      FormFriction;
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

function scoreColor(score: number) { return LEVEL_COLOR[getLevel(score)]; }
function overallColor(score: number) {
  if (score <= 40) return "#EF4444";
  if (score <= 70) return "#F59E0B";
  return "#3FC87A";
}

/* ─── Mensajes por categoría ──────────────── */
type Category = "speed" | "seo" | "copy" | "cta";

const BASE_MESSAGES: Record<Category, Record<Level, string>> = {
  speed: {
    red:    "Tu web tiene el freno de mano puesto. Según datos de Amazon y Google, cada segundo de carga extra te está costando hasta un 10% de tus ventas potenciales. El 90% de los usuarios abandona un sitio que tarda más de 5 segundos.",
    yellow: "Tu sitio carga bien en desktop pero tiene margen de mejora en mobile. El 70% de tus visitantes navegan desde el celular — cada segundo cuenta.",
    green:  "Excelente velocidad. Tu sitio carga rápido y no pierde clientes por este motivo.",
  },
  seo: {
    red:    "Sos invisible para Google. El 70% de los clientes potenciales eligen entre los primeros 3 resultados — y hoy tu sitio no califica para competir por esos lugares.",
    yellow: "Tu visibilidad en Google tiene oportunidades de mejora. Hay ajustes simples que pueden aumentar significativamente tu tráfico orgánico.",
    green:  "Buenas bases de SEO. Tu sitio está bien posicionado para aparecer en búsquedas relevantes.",
  },
  copy: {
    red:    "Tu sitio habla demasiado de vos y poco de tu cliente. Estudios de Nielsen Norman Group muestran que los usuarios leen solo el 20% de una página — si ese 20% no habla de sus problemas, se van.",
    yellow: "Tu mensaje podría ser más persuasivo. Los sitios orientados al cliente convierten hasta un 200% más que los que enumeran características.",
    green:  "Tu copy está orientado al cliente. Buen trabajo comunicando valor.",
  },
  cta: {
    red:    "Tu sitio no le dice claramente a los visitantes qué hacer. Un visitante sin dirección no actúa — y se va a la competencia que sí se lo dice.",
    yellow: "Tus llamadas a la acción existen pero podrían ser más fuertes y frecuentes.",
    green:  "Tus CTAs son claros y frecuentes. Los visitantes saben exactamente qué hacer.",
  },
};

interface MsgFlags {
  hasSocialProof:    boolean;
  hicksLawViolation: boolean;
  formFriction:      FormFriction;
}

function getMessage(cat: Category, score: number, flags: MsgFlags): string {
  if (cat === "copy" && !flags.hasSocialProof) {
    return "Tu web se siente sola. El cliente actual no te cree a vos, le cree a otros clientes. No mostrar testimonios o logos de marcas con las que trabajás es dejar dinero sobre la mesa.";
  }
  if (cat === "cta") {
    if (flags.formFriction === "missing") {
      return "Tu sitio no tiene una forma clara de contacto. El cliente que quiere comprarte no sabe cómo hacerlo.";
    }
    if (flags.formFriction === "too_many_fields") {
      return "Estás pidiendo demasiado antes de dar algo. Tu formulario es una barrera, no un puente. Reducir los campos multiplica las consultas de inmediato.";
    }
    if (flags.hicksLawViolation) {
      return "Tu hero tiene demasiadas opciones compitiendo. Al darle tantas decisiones al visitante en el primer vistazo, terminan sin elegir ninguna. Una sola acción dominante puede aumentar tus conversiones hasta un 20%.";
    }
  }
  return BASE_MESSAGES[cat][getLevel(score)];
}

/* ─── Escenario combinado ─────────────────── */
/* Usa los scores (1-10) — umbral >= 7 para "bueno" */
function getScenario(speedScore: number, copyScore: number): Scenario {
  const speedOk = speedScore >= 7;
  const copyOk  = copyScore  >= 7;
  if (speedOk && copyOk)   return "optimal";
  if (speedOk && !copyOk)  return "puerta-giratoria";
  if (!speedOk && copyOk)  return "cuello-de-botella";
  return "abismo";
}

function getLossRange(scenario: Scenario): [number, number] {
  switch (scenario) {
    case "optimal":           return [0,  10];
    case "puerta-giratoria":  return [40, 60];
    case "cuello-de-botella": return [65, 80];
    case "abismo":            return [90, 95];
  }
}

const SCENARIO_DATA: Record<Scenario, { name: string; color: string }> = {
  "optimal":           { name: "Buen estado general",    color: "#3FC87A" },
  "puerta-giratoria":  { name: "La Puerta Giratoria",    color: "#F59E0B" },
  "cuello-de-botella": { name: "El Cuello de Botella",   color: "#F97316" },
  "abismo":            { name: "El Abismo",              color: "#EF4444" },
};

function getScenarioMessage(scenario: Scenario, lossRange: [number, number]): string {
  const [min] = lossRange;
  switch (scenario) {
    case "optimal":
      return "Tu sitio tiene buenas bases. Sin embargo, siempre hay oportunidades de mejora que marcan la diferencia entre una web que existe y una que vende activamente.";
    case "puerta-giratoria":
      return `Tu web es una puerta giratoria. Entra rápido, pero sale igual de rápido. Tenés el tráfico pero lo desperdiciás porque el mensaje no conecta con tu cliente. Cada mes que pasa así estás regalando el ${min}% de tu inversión en publicidad a la competencia.`;
    case "cuello-de-botella":
      return "Tu mensaje es bueno pero casi nadie llega a leerlo. La lentitud filtra a tus clientes por nivel de paciencia — y los impacientes son exactamente los que más compran. Estás perdiendo a tus mejores clientes antes de que vean tu propuesta.";
    case "abismo":
      return "Tu web tiene una doble fuga de capital. Primero, la lentitud expulsa al 70% de tus visitas antes de que cargue. Segundo, el mensaje no retiene a los pocos que logran entrar. Estás operando al 5% de tu capacidad real de ventas.";
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

/* ─── Componente principal ────────────────── */
export function AuditorTool() {
  const [step,    setStep]    = useState<Step>("input");
  const [url,     setUrl]     = useState("");
  const [error,   setError]   = useState("");
  const [msgIdx,  setMsgIdx]  = useState(0);
  const [progress,setProgress]= useState(0);
  const [results, setResults] = useState<AuditResults | null>(null);

  const scenario   = results ? getScenario(results.speed, results.copy) : "optimal";
  const lossRange  = results ? getLossRange(scenario) : [0, 10] as [number, number];
  const overall    = results
    ? Math.round((results.speed + results.seo + results.copy + results.cta) * 2.5)
    : 0;

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
        speed:             ps.speedScore          ?? 5,
        seo:               copy.seoScore          ?? 4,
        copy:              copy.copyScore         ?? 4,
        cta:               copy.ctaScore          ?? 4,
        lcpMs:             ps.lcpMs               ?? 3000,
        hasSocialProof:    copy.hasSocialProof    ?? false,
        hicksLawViolation: copy.hicksLawViolation ?? false,
        formFriction:      copy.formFriction      ?? "none",
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
    ? { hasSocialProof: results.hasSocialProof, hicksLawViolation: results.hicksLawViolation, formFriction: results.formFriction }
    : { hasSocialProof: true, hicksLawViolation: false, formFriction: "none" };

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
          {/* URL analizada + resetear */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <p className="font-body text-sm text-[#4A6070]">
              Análisis de <span className="text-[#7A8FA6] break-all">{url}</span>
            </p>
            <button
              onClick={reset}
              className="font-body text-xs text-[#3FC87A] hover:text-white transition-colors duration-200"
            >
              Analizar otro sitio
            </button>
          </div>

          {/* 4 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <ScoreCard label="Velocidad"            score={results.speed} message={getMessage("speed", results.speed, flags)} delay={0}   />
            <ScoreCard label="SEO"                  score={results.seo}   message={getMessage("seo",   results.seo,   flags)} delay={0.1} />
            <ScoreCard label="Mensaje"              score={results.copy}  message={getMessage("copy",  results.copy,  flags)} delay={0.2} />
            <ScoreCard label="Llamadas a la acción" score={results.cta}   message={getMessage("cta",   results.cta,   flags)} delay={0.3} />
          </div>

          {/* Panel de impacto con escenario */}
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

            {/* Escenario detectado — prominente */}
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

            {/* Pérdida estimada */}
            {scenario !== "optimal" && (
              <p className="font-body text-sm text-[#7A8FA6] leading-[1.7] max-w-[500px] mx-auto mb-2">
                En un negocio con 500 visitas mensuales, eso son entre{" "}
                <span className="text-white font-medium">{Math.round(500 * lossRange[0] / 100)}</span> y{" "}
                <span className="text-white font-medium">{Math.round(500 * lossRange[1] / 100)}</span> clientes
                potenciales que se van a la competencia cada mes.
              </p>
            )}

            {/* Disclaimer científico */}
            <p className="font-body text-[0.68rem] text-[#4A6070] max-w-[460px] mx-auto mb-8 leading-relaxed">
              Estimación basada en estudios de Google, Amazon, Nielsen Norman Group y Robert Cialdini aplicados a los indicadores de tu sitio.
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
        </motion.div>
      )}

    </AnimatePresence>
  );
}

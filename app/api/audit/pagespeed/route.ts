import { NextResponse } from "next/server";

/* ─── Tipos ───────────────────────────────── */
export interface PageSpeedResult {
  speedScore: number;
  lossRange:  [number, number];
  source:     "pagespeed" | "ttfb" | "fallback";
}

interface CacheEntry {
  data:    PageSpeedResult;
  expires: number;
}

/* ─── Caché en memoria 24h ────────────────── */
const cache = new Map<string, CacheEntry>();
const TTL   = 24 * 60 * 60 * 1000;

/* ─── LCP/TTFB (ms) → rango de pérdida ───── */
function msToLossRange(ms: number): [number, number] {
  if (ms <= 1200) return [0,  5];
  if (ms <= 2500) return [10, 25];
  if (ms <= 4000) return [30, 50];
  return [60, 80];
}

/* ─── Score PageSpeed 0-1 → 1-10 ─────────── */
function psToTen(score: number): number {
  return Math.max(1, Math.min(10, Math.round(score * 10)));
}

/* ─── TTFB → speed score heurístico ─────── */
function ttfbToScore(ms: number): number {
  if (ms < 300)  return 9;
  if (ms < 600)  return 7;
  if (ms < 1200) return 5;
  if (ms < 2500) return 3;
  return 1;
}

/* ─── Normalizar URL ──────────────────────── */
function normalize(url: string): string {
  const u = url.trim();
  return u.startsWith("http") ? u : `https://${u}`;
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

  /* ── Intento 1: Google PageSpeed API ──── */
  const apiKey = process.env.PAGESPEED_API_KEY;
  if (apiKey) {
    try {
      const apiUrl =
        `https://www.googleapis.com/pagespeedonline/v5/runPagespeed` +
        `?url=${encodeURIComponent(url)}&strategy=mobile&key=${apiKey}`;

      const controller = new AbortController();
      const timeout    = setTimeout(() => controller.abort(), 30_000);

      const res = await fetch(apiUrl, { signal: controller.signal, cache: "no-store" });
      clearTimeout(timeout);

      if (res.ok) {
        const json  = await res.json();
        const perf  = json.lighthouseResult?.categories?.performance?.score ?? 0.3;
        const lcpMs = json.lighthouseResult?.audits?.["largest-contentful-paint"]?.numericValue ?? 5000;

        const result: PageSpeedResult = {
          speedScore: psToTen(perf),
          lossRange:  msToLossRange(lcpMs),
          source:     "pagespeed",
        };

        cache.set(url, { data: result, expires: Date.now() + TTL });
        return NextResponse.json(result);
      }
    } catch {
      /* PageSpeed falló — caemos al fallback de TTFB */
    }
  }

  /* ── Intento 2: TTFB propio como proxy de velocidad ── */
  try {
    const controller = new AbortController();
    const timeout    = setTimeout(() => controller.abort(), 15_000);

    const start  = Date.now();
    const probeRes = await fetch(url, {
      method:  "GET",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; LevelGrowthAudit/1.0; +https://levelgrowthagency.com)" },
      signal:  controller.signal,
    });
    const ttfb = Date.now() - start;
    clearTimeout(timeout);

    /* Consumir body para liberar la conexión */
    await probeRes.text().catch(() => {});

    const score = ttfbToScore(ttfb);
    const result: PageSpeedResult = {
      speedScore: score,
      lossRange:  msToLossRange(ttfb),
      source:     "ttfb",
    };

    cache.set(url, { data: result, expires: Date.now() + TTL });
    return NextResponse.json(result);
  } catch (err) {
    console.error("[audit/pagespeed] TTFB también falló:", err);
  }

  /* ── Fallback final: no bloquear al usuario ─ */
  const fallback: PageSpeedResult = { speedScore: 5, lossRange: [10, 25], source: "fallback" };
  return NextResponse.json(fallback);
}

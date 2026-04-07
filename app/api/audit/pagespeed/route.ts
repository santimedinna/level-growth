import { NextResponse } from "next/server";

/* ─── Tipos ───────────────────────────────── */
interface PageSpeedResult {
  speedScore: number;
  lossRange:  [number, number];
}

interface CacheEntry {
  data:    PageSpeedResult;
  expires: number;
}

/* ─── Caché en memoria 24h ────────────────── */
const cache = new Map<string, CacheEntry>();
const TTL   = 24 * 60 * 60 * 1000;

/* ─── LCP (ms) → rango de pérdida de visitas */
function lcpToLossRange(lcpMs: number): [number, number] {
  if (lcpMs <= 1200) return [0,  5];
  if (lcpMs <= 2500) return [10, 25];
  if (lcpMs <= 4000) return [30, 50];
  return [60, 80];
}

/* ─── Score PageSpeed 0-1 → 1-10 ─────────── */
function psToTen(score: number): number {
  return Math.max(1, Math.min(10, Math.round(score * 10)));
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

  /* Servir desde caché si está fresco */
  const cached = cache.get(url);
  if (cached && cached.expires > Date.now()) {
    return NextResponse.json(cached.data);
  }

  const apiKey = process.env.PAGESPEED_API_KEY;
  const apiUrl =
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed` +
    `?url=${encodeURIComponent(url)}&strategy=mobile` +
    (apiKey ? `&key=${apiKey}` : "");

  try {
    const res = await fetch(apiUrl, { cache: "no-store" });
    if (!res.ok) throw new Error(`PageSpeed API ${res.status}`);

    const json = await res.json();
    const perf  = json.lighthouseResult?.categories?.performance?.score ?? 0.3;
    const lcpMs = json.lighthouseResult?.audits?.["largest-contentful-paint"]?.numericValue ?? 5000;

    const result: PageSpeedResult = {
      speedScore: psToTen(perf),
      lossRange:  lcpToLossRange(lcpMs),
    };

    cache.set(url, { data: result, expires: Date.now() + TTL });
    return NextResponse.json(result);
  } catch (err) {
    console.error("[audit/pagespeed]", err);
    return NextResponse.json({ error: "No se pudo analizar la velocidad" }, { status: 500 });
  }
}

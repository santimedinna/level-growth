# CLAUDE.md — Level Growth Agency

---

## 1. IDENTIDAD DEL PROYECTO

**Nombre:** Level Growth  
**Tipo:** Agencia de growth, optimización de funnel y conversión  
**Mercado:** Argentina, Latinoamérica, habla hispana global  
**Dominio:** levelgrowthagency.com

### Posicionamiento
Especialistas en el funnel completo: desde el primer clic del ad hasta el cliente que paga. No somos una agencia de marketing genérica.

**Propuesta de valor:**
> Auditamos tu sitio web y tu publicidad, identificamos exactamente dónde perdés clientes y lo solucionamos.

### Tono de comunicación
- Directo, sin vueltas, sin términos vacíos
- Resultados concretos con números reales
- Español rioplatense: vos, tenés, hacés, podés
- **NUNCA usar:** "potenciamos tu marca", "llevamos tu negocio al siguiente nivel", "somos apasionados", ni frases de agencia genérica
- Copy siempre orientado al cliente, no a la empresa

---

## 2. STACK TÉCNICO

```
Framework:    Next.js 16 con App Router
Lenguaje:     TypeScript (siempre, sin excepciones)
Estilos:      Tailwind CSS v4 (CSS-first via @theme en globals.css)
Animaciones:  Framer Motion
Formularios:  React Hook Form
Email:        Resend
HTML parsing: Cheerio (para /api/audit/copy)
Deploy:       Vercel
Blog:         MDX con next-mdx-remote
```

### Variables de entorno

```env
RESEND_API_KEY=         # API key de Resend — requerida para emails
FROM_EMAIL=             # Remitente (default: santiago@levelgrowthagency.com)
TO_EMAIL=               # Destino interno (default: santiago@levelgrowthagency.com)
PAGESPEED_API_KEY=      # Google PageSpeed Insights API v5 — opcional, tiene fallback TTFB
```

---

## 3. SISTEMA DE DISEÑO

### Paleta de colores

```
Fondos:
  #080C14   — bg-primary / lg-bg (fondo principal, negro azulado)
  #0D1221   — bg-secondary / lg-bg-secondary (cards, secciones alternas)
  #111827   — bg-tertiary / lg-bg-tertiary (hover states, inputs)

Acentos:
  #3FC87A   — verde principal (lg-green)
  #2BA86A   — verde CTA/hover (lg-green-dark)
  #4A9EE0   — azul gradiente (lg-blue)
  #0D1F4A   — azul noche (lg-blue-dark)

Texto:
  #FFFFFF   — texto principal (lg-text)
  #7A8FA6   — texto secundario (lg-text-secondary)
  #4A6070   — texto apagado / metadata (lg-text-muted)

Bordes:
  rgba(255,255,255,0.08)   — borde estándar
  rgba(63,200,122,0.25)    — borde acento verde
```

### Tipografía (Google Fonts)

```
font-display:  Syne           — títulos grandes (weights 400, 500, 700)
font-body:     DM Sans        — texto general (weights 300, 400, 500)
font-mono:     JetBrains Mono — números, métricas (weights 400, 500)
```

**Escala:**
```
H1 display:   clamp(2.5rem, 6vw, 4.5rem)  — Syne 700
H1 regular:   clamp(2rem, 4vw, 3rem)      — Syne 500
H2:           clamp(1.5rem, 3vw, 2rem)    — Syne 500
Body large:   1.125rem, line-height 1.7   — DM Sans 400
Body:         1rem, line-height 1.65      — DM Sans 400
Label:        0.75rem, tracking 0.08em    — DM Sans 500
Metric:       clamp(2rem, 4vw, 3.5rem)    — JetBrains Mono 500
```

### Layout

```
Max width contenido:   1200px
Max width texto:       680px
Padding horizontal:    clamp(1.5rem, 5vw, 4rem)
Gap entre secciones:   clamp(5rem, 12vw, 10rem)
Border radius cards:   12px  → rounded-card
Border radius botones: 8px   → rounded-button
Border radius badges:  4px   → rounded-badge
```

### Componentes base

**Button** (`components/ui/Button.tsx`)
- Props: `variant` (`"primary"` | `"secondary"` | `"ghost"`), `size` (`"sm"` | `"md"` | `"lg"`)
- `href` + `external` renderiza como `<a>`
```tsx
<Button variant="primary" size="lg">Quiero mi auditoría gratis →</Button>
<Button variant="secondary" href="/contacto">Hablar con un especialista</Button>
<Button variant="ghost" href="https://wa.me/..." external>WhatsApp</Button>
```

**Badge** (`components/ui/Badge.tsx`)
- Verde con borde sutil, texto uppercase tracking
```tsx
<Badge>Herramienta gratuita</Badge>
```

**Card** (`components/ui/Card.tsx`)
- Props: `interactive` (hover verde + scale), `dark` (fondo más oscuro)
```tsx
<Card interactive>Contenido</Card>
<Card dark>Fondo más oscuro</Card>
```

### Animaciones Framer Motion

```tsx
// Scroll reveal base — usar en todas las secciones
const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

// Stagger container
const staggerContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } }
}
```

---

## 4. ESTRUCTURA ACTUAL DEL PROYECTO

```
app/
  layout.tsx                   ← Fuentes, metadata base, floating WA button, MS Clarity
  page.tsx                     ← Landing principal (ensambla todas las secciones)
  globals.css                  ← @theme Tailwind v4 con paleta y tokens
  favicon.svg                  ← SVG custom (gráfico verde sobre fondo oscuro)
  auditoria-web-gratis/
    page.tsx                   ← Server component con metadata
    AuditorTool.tsx            ← Herramienta interactiva (Client Component)
  blog/
    page.tsx                   ← Listado de posts MDX
    [slug]/page.tsx            ← Post individual
  contacto/
    page.tsx                   ← Formulario de contacto
  api/
    contact/route.ts           ← POST — envía 2 emails vía Resend
    audit/
      pagespeed/route.ts       ← GET — PageSpeed API o TTFB fallback
      copy/route.ts            ← GET — Cheerio heurístico

components/
  ui/
    Button.tsx
    Badge.tsx
    Card.tsx
  layout/
    Header.tsx                 ← Nav sticky con backdrop-blur
    Footer.tsx
  sections/
    Hero.tsx
    Pain.tsx
    Services.tsx
    CaseStudy.tsx
    FunnelComparison.tsx
    Process.tsx
    Pricing.tsx
    FAQ.tsx
    CTAFinal.tsx
    ContactForm.tsx
    TrustLogos.tsx
  charts/
    GrowthChart.tsx            ← SVG puro + requestAnimationFrame (sin Recharts)
    ConversionBarChart.tsx     ← SVG puro + requestAnimationFrame (sin Recharts)

content/
  blog/                        ← Archivos .mdx

public/
  favicon.svg
  images/
  og/
```

### APIs activas

**`/api/contact`** (POST)
- Recibe: `{ nombre, email, whatsapp?, sitioWeb?, servicio, mensaje }`
- Email A (interno): asunto `"Nuevo lead — [nombre]"`, HTML con datos del lead
- Email B (confirmación al usuario): personal, botón WA verde, firma levelgrowthagency.com
- Requiere: `RESEND_API_KEY` en env; `new Resend()` siempre dentro del handler (nunca a nivel de módulo)

**`/api/audit/pagespeed`** (GET `?url=...`)
- Intento 1: Google PageSpeed API v5 mobile (solo si `PAGESPEED_API_KEY` existe), timeout 30s
- Intento 2: TTFB propio, `estimatedLcp = ttfb * 3`, timeout 15s
- Fallback: `{ speedScore: 5, lcpMs: 3000, source: "fallback" }` — nunca lanza error HTTP
- Retorna: `{ speedScore: number, lcpMs: number, source: "pagespeed"|"ttfb"|"fallback" }`
- Caché en memoria 24h por URL

**`/api/audit/copy`** (GET `?url=...`)
- Descarga HTML con 3 User-Agents en loop (timeout 15s cada uno)
- Analiza: SEO (title, meta desc, H1), copy ego vs cliente, social proof (Cialdini), CTAs, Hick's Law, fricción de formulario (HubSpot)
- Fallback: `{ seoScore: 4, copyScore: 4, ctaScore: 4, hasSocialProof: false, hicksLawViolation: false, formFriction: "none" }`
- Retorna: `{ seoScore, copyScore, ctaScore, hasSocialProof, hicksLawViolation, formFriction }`
- Caché en memoria 24h por URL

---

## 5. REGLAS DE DESARROLLO

1. **Siempre TypeScript** — sin archivos .js ni .jsx
2. **Mobile first** — diseñar desde el breakpoint más chico hacia arriba
3. **Tailwind para estilos** — sin CSS modules ni styled-components
4. **Framer Motion para animaciones** — no CSS keyframes salvo casos triviales
5. **Sin librerías innecesarias** — si se puede con Tailwind + Framer Motion, no agregar dependencia extra
6. **Componentes pequeños** — no superar ~150 líneas; extraer si crece
7. **Antes de crear un componente** — verificar si ya existe en `/components`
8. **Comentarios en español** — coherente con el tono del proyecto
9. **Resend init dentro del handler** — nunca a nivel de módulo (falla en build sin env var)
10. **Respetar prefers-reduced-motion** — no animar si el usuario lo desactivó

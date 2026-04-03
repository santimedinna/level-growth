# CLAUDE.md — Level Growth Agency

Este archivo es el briefing completo del proyecto. Leelo íntegro antes de escribir una sola línea de código. Cada decisión de diseño, copy y arquitectura está documentada acá.

---

## 1. IDENTIDAD DEL PROYECTO

**Nombre:** Level Growth  
**Tipo:** Agencia de growth, optimización de funnel y conversión  
**Propietario:** Fundador único, experto en funnel completo y paid media  
**Mercado:** Argentina, Latinoamérica, habla hispana global  
**Dominio objetivo:** levelgrowth.com.ar (o similar)

### Posicionamiento
No somos una agencia de marketing genérica. Somos especialistas en el funnel completo: desde el primer clic del ad hasta el cliente que paga. Entendemos que una landing perfecta sin un vendedor que atienda el WhatsApp es dinero tirado. Eso nos diferencia.

### Propuesta de valor
> Auditamos tu sitio web y tu publicidad, identificamos exactamente dónde perdés clientes y lo solucionamos.

### Tono de comunicación
- Directo, sin vueltas, sin términos vacíos
- Habla de resultados concretos con números reales
- Honesto: reconoce que el marketing no es magia
- Cercano pero profesional — ni formal ni informal extremo
- En español rioplatense (vos, tenés, hacés)
- NUNCA usar: "potenciamos tu marca", "llevamos tu negocio al siguiente nivel", "somos apasionados", ni ninguna frase de agencia genérica

---

## 2. STACK TÉCNICO

```
Framework:     Next.js 14+ con App Router
Estilos:       Tailwind CSS
Lenguaje:      TypeScript
Fuentes:       Google Fonts (ver sección tipografía)
Animaciones:   Framer Motion para transiciones y scroll reveals
Formularios:   React Hook Form
Email:         Resend o Nodemailer para el formulario de contacto
Deploy:        VPS con Nginx (build estático exportado)
Blog:          MDX con next-mdx-remote
SEO:           next/metadata en cada página
Analytics:     Google Analytics 4 + Meta Pixel (estructura lista, IDs a completar)
```

### Estructura de carpetas

```
/app
  /page.tsx                  ← Landing principal
  /servicios/page.tsx        ← Página de servicios detallados
  /blog/page.tsx             ← Listado del blog
  /blog/[slug]/page.tsx      ← Post individual
  /contacto/page.tsx         ← Formulario de contacto
  /api/contact/route.ts      ← API route para el form
/components
  /ui/                       ← Componentes base (Button, Badge, Card)
  /sections/                 ← Secciones de la landing (Hero, Services, etc.)
  /layout/                   ← Header, Footer, Nav
/content
  /blog/                     ← Archivos .mdx de los posts
/lib
  /utils.ts
  /fonts.ts
/public
  /images/
  /og/                       ← Open Graph images
```

---

## 3. SISTEMA DE DISEÑO

### Paleta de colores

```css
/* Fondos */
--color-bg-primary:    #080C14;   /* Fondo principal — negro azulado profundo */
--color-bg-secondary:  #0D1221;   /* Cards, secciones alternativas */
--color-bg-tertiary:   #111827;   /* Hover states, inputs */

/* Acentos */
--color-green:         #3FC87A;   /* Verde dólar — acento principal */
--color-green-dark:    #2BA86A;   /* CTA buttons, hover del verde */
--color-green-muted:   rgba(63, 200, 122, 0.12); /* Backgrounds sutiles con verde */
--color-blue:          #4A9EE0;   /* Azul para gradientes */
--color-blue-dark:     #0D1F4A;   /* Azul noche para secciones */

/* Texto */
--color-text-primary:  #FFFFFF;   /* Títulos y texto principal */
--color-text-secondary:#7A8FA6;   /* Subtítulos, descripciones */
--color-text-muted:    #4A6070;   /* Labels, metadata, texto pequeño */

/* Bordes */
--color-border:        rgba(255, 255, 255, 0.08);
--color-border-accent: rgba(63, 200, 122, 0.25);

/* Gradientes — usar con moderación, solo en momentos de impacto */
--gradient-hero:       radial-gradient(ellipse at 20% 50%, rgba(13,31,74,0.6) 0%, transparent 60%),
                       radial-gradient(ellipse at 80% 50%, rgba(20,80,50,0.3) 0%, transparent 60%);
--gradient-text:       linear-gradient(90deg, #3FC87A, #4A9EE0);
--gradient-cta:        linear-gradient(135deg, #2BA86A, #1a7a4e);
--gradient-card:       linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01));
```

### Tipografía

```css
/* Display / Títulos grandes */
font-family: 'Syne', sans-serif;
/* Importar: weights 400, 500, 700 */

/* Body / Texto general */
font-family: 'DM Sans', sans-serif;
/* Importar: weights 300, 400, 500 */

/* Monospace / Números, métricas, código */
font-family: 'JetBrains Mono', monospace;
/* Importar: weight 400, 500 */
```

**Escala tipográfica:**
```
H1 display:   clamp(2.5rem, 6vw, 4.5rem) — Syne 700
H1 regular:   clamp(2rem, 4vw, 3rem)     — Syne 500
H2:           clamp(1.5rem, 3vw, 2rem)   — Syne 500
H3:           1.25rem                    — DM Sans 500
Body large:   1.125rem                   — DM Sans 400, line-height 1.7
Body:         1rem                       — DM Sans 400, line-height 1.65
Small/Label:  0.75rem                    — DM Sans 500, letter-spacing 0.08em
Metric:       clamp(2rem, 4vw, 3.5rem)   — JetBrains Mono 500
```

### Espaciado y layout

```
Max width contenido:   1200px
Max width texto:       680px (para legibilidad óptima)
Padding horizontal:    clamp(1.5rem, 5vw, 4rem)
Gap entre secciones:   clamp(5rem, 12vw, 10rem)
Border radius cards:   12px
Border radius botones: 8px
Border radius badges:  4px
```

### Componentes base

**Botón primario:**
```tsx
// Fondo gradiente verde, texto blanco, hover con brillo sutil
className="bg-gradient-to-br from-[#2BA86A] to-[#1a7a4e] text-white 
           px-6 py-3 rounded-lg font-medium text-sm
           hover:brightness-110 transition-all duration-200
           shadow-[0_0_20px_rgba(43,168,106,0.3)]"
```

**Botón secundario (ghost):**
```tsx
className="border border-white/10 text-[#7A8FA6] px-6 py-3 rounded-lg 
           font-medium text-sm hover:border-white/20 hover:text-white 
           transition-all duration-200"
```

**Badge / Label:**
```tsx
className="text-[#3FC87A] border border-[#3FC87A]/30 text-[10px] 
           font-medium tracking-[0.1em] uppercase px-3 py-1 rounded"
```

**Card:**
```tsx
className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] 
           border border-white/[0.08] rounded-xl p-6
           hover:border-[#3FC87A]/20 transition-all duration-300"
```

---

## 4. ANIMACIONES Y MICROINTERACCIONES

Usar Framer Motion. Principios:

- **Scroll reveals:** Fade up suave (y: 20 → 0, opacity: 0 → 1, duration: 0.6s)
- **Stagger:** Entre elementos de una lista, delay de 0.1s entre cada uno
- **Hover cards:** Scale 1.01, border color change, duration 0.2s
- **Números/métricas:** Animación de conteo al entrar en viewport
- **Gradientes de fondo:** Sin animación — son estáticos para no distraer
- **NO usar:** Bounces, efectos de partículas, parallax agresivo, nada que ralentice

```tsx
// Variante base para scroll reveal — usar en todas las secciones
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

// Stagger container
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
}
```

---

## 5. ESTRUCTURA DE LA LANDING (page.tsx)

La landing tiene exactamente estas secciones en este orden:

### SECCIÓN 1: HERO

**Objetivo:** Capturar atención en los primeros 3 segundos y que el visitante entienda exactamente qué hacemos.

**Layout:** Full viewport height, texto centrado, fondo oscuro con glows de color.

**Elementos:**
- Badge superior: `AGENCIA DE GROWTH`
- H1 (dos líneas):
  ```
  Tu negocio merece un funnel
  que realmente convierta
  ```
  La palabra "realmente convierta" lleva el gradiente verde→azul.
- Subtítulo:
  ```
  Auditamos tu sitio web y tu publicidad. Te mostramos exactamente 
  dónde perdés clientes — y lo solucionamos.
  ```
- Dos CTAs:
  - Primario: `Quiero mi auditoría gratis →`
  - Secundario: `Ver casos de éxito`
- Métricas debajo de los CTAs (separadas por línea sutil):
  - `+40%` conversión promedio
  - `4.75x` retorno en ads
  - `48hs` primer reporte
  Los números van en JetBrains Mono con gradiente verde→azul.
- Fondo: dos glows radiales — uno azul top-left, uno verde bottom-right.

**Código de fondo del hero:**
```tsx
// Glow azul — top left
<div className="absolute -top-20 -left-16 w-[500px] h-[400px] 
     bg-[radial-gradient(ellipse,rgba(13,31,74,0.5)_0%,transparent_70%)] 
     pointer-events-none" />

// Glow verde — bottom right  
<div className="absolute -bottom-16 -right-10 w-[400px] h-[350px] 
     bg-[radial-gradient(ellipse,rgba(20,90,50,0.25)_0%,transparent_70%)] 
     pointer-events-none" />
```

---

### SECCIÓN 2: PROBLEMA (Pain section)

**Objetivo:** Que el visitante se sienta identificado. Empatía antes de la solución.

**Layout:** Fondo levemente diferente (#0D1221), ancho completo.

**Título:**
```
¿Te suena alguno de estos escenarios?
```

**Tres cards con problemas comunes** (grid 3 columnas en desktop, 1 en mobile):

1. **"Tengo visitas pero nadie compra"**  
   Tu sitio tiene tráfico pero la tasa de conversión es casi cero. El problema no es la cantidad de visitas — es lo que pasa cuando llegan.

2. **"Hago publicidad pero no sé si funciona"**  
   Invertís en ads sin saber exactamente qué retorno obtenés. Cada peso parece que desaparece sin dejar rastro.

3. **"Mi vendedor pierde clientes que ya estaban listos"**  
   El funnel funciona pero falla en el último paso: el contacto humano. Un WhatsApp sin responder es un cliente que se va a la competencia.

**Después de las cards, texto de transición:**
```
El problema casi nunca es uno solo — es la suma de pequeñas roturas 
en cada etapa del proceso. Por eso auditamos el funnel completo.
```

---

### SECCIÓN 3: SOLUCIÓN / SERVICIOS

**Objetivo:** Mostrar exactamente qué hacemos y por qué tiene sentido.

**Título:**
```
Qué hacemos en Level Growth
```

**Subtítulo:**
```
No vendemos servicios sueltos. Analizamos tu negocio entero 
y atacamos donde más duele.
```

**Cuatro servicios** en grid (2x2 desktop, 1 columna mobile):

**1. Auditoría de funnel**
- Ícono: lupa o scanner
- Descripción: Analizamos tu sitio web, tu publicidad activa y tu proceso de contacto. En 48 horas sabés exactamente qué está frenando tus ventas.
- Badge: `PUNTO DE PARTIDA`

**2. Optimización de landing**
- Ícono: cursor / conversión
- Descripción: Rediseñamos o mejoramos tu sitio para que cada visitante tenga un motivo claro para contactarte. Copy, estructura y velocidad.
- Badge: `MÁS CONVERSIONES`

**3. Gestión de publicidad**
- Ícono: megáfono / gráfica
- Descripción: Creamos y gestionamos tus campañas en Google y Meta. Setup inicial + optimización mensual orientada a resultados medibles, no a impresiones.
- Badge: `PAID MEDIA`

**4. Funnel completo**
- Ícono: embudo
- Descripción: Landing + publicidad + seguimiento. Un sistema donde cada pieza trabaja junto. Ideal para negocios que quieren escalar sin improvisar.
- Badge: `TODO INCLUIDO`

---

### SECCIÓN 4: CASO DE ÉXITO

**Objetivo:** Prueba social con números reales. Esta sección es la más importante para cerrar la venta.

**Layout:** Fondo especial — gradiente azul noche a verde muy oscuro. Ancho completo. Diseño que transmite impacto.

**Título:**
```
Un caso real. Sin adornos.
```

**Historia (en dos partes):**

PARTE A — El resultado:
```
Tomamos un negocio que arrancó con $1.500 USD en inversión publicitaria 
y en 3 años generamos más de $150.000 USD en facturación usando 
Google Ads como único canal de adquisición.
```

**Métricas grandes en el centro:**
- `100x` — retorno sobre inversión inicial
- `3 años` — desde $0 hasta escala
- `$150K USD` — facturación generada con paid media

PARTE B — La lección (texto más pequeño, color secundario):
```
Ese mismo negocio cerró después. No por la publicidad — 
la publicidad funcionó mejor que nunca. Cerró porque cuando el funnel 
trajo más clientes de los que el equipo podía atender, el sistema 
humano colapsó. Aprendimos algo que pocos consultores te van a decir: 
un funnel excelente con un equipo que no está preparado para el volumen 
es igual a un funnel roto. Por eso en Level Growth auditamos todo — 
no solo los ads.
```

**CTA debajo:**
`Quiero que analicen mi negocio →`

---

### SECCIÓN 5: PROCESO

**Objetivo:** Reducir la fricción mostrando que arrancar es simple.

**Título:**
```
Cómo trabajamos
```

**Cuatro pasos** en línea horizontal (desktop) o vertical (mobile):

1. **Auditoría** — Analizamos tu sitio, tus ads y tu proceso de contacto. Sin costo.
2. **Diagnóstico** — En 48hs te entregamos un reporte con los problemas encontrados y las soluciones propuestas.
3. **Implementación** — Ejecutamos los cambios acordados. Landing, publicidad o ambas.
4. **Seguimiento** — Medimos resultados y optimizamos. El trabajo no termina cuando entregamos.

---

### SECCIÓN 6: PRECIOS

**Objetivo:** Transparencia. Los precios claros generan confianza y pre-califican al cliente.

**Título:**
```
Precios claros, sin sorpresas
```

**Tres planes** (cards en grid):

**Auditoría**
- Precio: `Gratis`
- Descripción: Para negocios que quieren saber dónde están parados antes de invertir.
- Incluye: Análisis del sitio web, revisión de publicidad activa, reporte en PDF, llamada de 30 minutos.
- CTA: `Solicitar auditoría`

**Landing + Optimización**
- Precio: `desde $400 USD`
- Descripción: Para negocios que necesitan un sitio orientado a convertir, no solo a existir.
- Incluye: Diseño y desarrollo de landing, copy orientado a conversión, integración de WhatsApp y formulario, entrega en 7-10 días hábiles.
- Badge: `MÁS VENDIDO`
- CTA: `Hablar con un especialista`

**Funnel Completo**
- Precio: `desde $700 USD + fee mensual`
- Descripción: Para negocios que quieren un sistema completo funcionando.
- Incluye: Todo lo anterior + setup de Google/Meta Ads + gestión mensual + reportes de resultados.
- CTA: `Hablar con un especialista`

**Nota debajo de los precios:**
```
Todos los proyectos arrancan con una auditoría gratuita. 
Si no encontramos oportunidades reales de mejora, te lo decimos.
```

---

### SECCIÓN 7: FAQ

**Objetivo:** Resolver objeciones antes de que las pregunten.

**Seis preguntas:**

**¿Cuánto tiempo tarda la auditoría?**
48 horas hábiles desde que recibimos los datos de tu negocio. Te entregamos un reporte en PDF con todo lo que encontramos.

**¿Necesito tener un sitio web para contratar el servicio de publicidad?**
No idealmente — pero si no tenés una landing optimizada, la publicidad va a funcionar muy por debajo de su potencial. Por eso generalmente recomendamos empezar con la landing.

**¿Cómo se cobra la gestión de publicidad?**
Fee fijo mensual por la gestión, más el presupuesto de publicidad que definimos juntos. El presupuesto de ads lo manejás vos directamente con Google o Meta.

**¿Trabajan con cualquier tipo de negocio?**
Trabajamos con negocios que venden productos o servicios y quieren aumentar sus ventas online. Si tenés un e-commerce en Tiendanube o WooCommerce, también podemos ayudarte.

**¿Qué pasa si no veo resultados?**
Antes de arrancar cualquier proyecto hacemos la auditoría gratuita. Si no encontramos oportunidades reales, no te vamos a proponer trabajar. Una vez que arrancamos, medimos todo y ajustamos en base a datos reales.

**¿Tienen experiencia con negocios en Argentina?**
Sí. El equipo fundador tiene experiencia gestionando publicidad y optimizando funnels en el mercado argentino, con casos que van desde servicios locales hasta negocios que escalan a toda Latinoamérica.

---

### SECCIÓN 8: CTA FINAL

**Objetivo:** Última oportunidad de captura antes del footer.

**Fondo:** Gradiente azul-verde, más saturado que el resto de la página.

**Título:**
```
¿Listo para saber qué está frenando tus ventas?
```

**Subtítulo:**
```
La auditoría es gratuita. El diagnóstico es honesto. 
Y si no encontramos nada para mejorar, te lo decimos.
```

**CTA único:**
`Quiero mi auditoría gratis →`

---

### SECCIÓN 9: FOOTER

**Columnas:**
- Logo + tagline + descripción breve
- Servicios: links a cada servicio
- Recursos: Blog, Casos de éxito, FAQ
- Contacto: email, WhatsApp (número a completar), redes sociales

**Línea de cierre:**
```
© 2025 Level Growth. Todos los derechos reservados.
```

---

## 6. PÁGINAS ADICIONALES

### /blog

**Propósito:** Posicionamiento SEO y construcción de autoridad.

**Layout:** Header con título y descripción, grid de cards de artículos.

**Primer artículo a crear** (en /content/blog/de-cero-a-150k.mdx):

```
Slug: de-cero-a-150k-usd-con-google-ads
Título: De $1.500 USD a $150.000 USD: lo que nadie te cuenta sobre escalar con publicidad
Descripción: Cómo llevamos un negocio desde su primer peso invertido en Google Ads hasta generar más de $150.000 USD en facturación — y por qué ese negocio cerró igual.
Categoría: Casos de estudio
Tiempo de lectura: 8 min
```

**Segundo artículo a crear** (en /content/blog/tres-errores-quiebra.mdx):
```
Slug: tres-errores-que-llevan-a-la-quiebra
Título: De facturar miles de dólares al año a $0 en tres errores
Descripción: El funnel funcionaba. La publicidad convertía. El negocio cerró igual. Esta es la historia completa y los tres errores que ninguna agencia te va a admitir.
Categoría: Estrategia
Tiempo de lectura: 10 min
```

**Estructura de cada post:**
- Header con título, fecha, categoría y tiempo de lectura
- Imagen de cover (placeholder hasta tener fotos reales)
- Contenido MDX con soporte para: H2, H3, párrafos, listas, blockquotes, código
- Sección de autor al final
- CTA al final del post: `¿Querés que auditemos tu negocio? → Contactanos`
- Posts relacionados (máximo 2)

---

### /contacto

**Formulario con estos campos:**
- Nombre
- Email
- WhatsApp (opcional)
- Sitio web actual (opcional)
- ¿Qué necesitás? (selector: Auditoría gratis / Landing page / Gestión de publicidad / Funnel completo / No sé, necesito orientación)
- Contanos brevemente sobre tu negocio (textarea)
- Botón: `Enviar solicitud →`

**Al enviar:** Mensaje de éxito en pantalla + email automático de confirmación al usuario.

**API route** en /api/contact/route.ts — manejar con Resend o Nodemailer. Configurar variables de entorno para las credenciales.

---

## 7. SEO Y METADATA

```tsx
// Layout raíz — metadata base
export const metadata: Metadata = {
  title: {
    default: "Level Growth — Agencia de Funnel y Conversión",
    template: "%s | Level Growth"
  },
  description: "Auditamos tu sitio web y tu publicidad. Te mostramos exactamente dónde perdés clientes y lo solucionamos. Especialistas en funnel completo y paid media.",
  keywords: ["agencia de marketing", "optimización de funnel", "conversión", "Google Ads", "Meta Ads", "landing page", "growth", "Argentina"],
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Level Growth",
    images: [{ url: "/og/default.png", width: 1200, height: 630 }]
  },
  twitter: {
    card: "summary_large_image"
  }
}
```

**Página a página:**
- `/` → "Level Growth — Más conversiones, más clientes, menos fricción"
- `/servicios` → "Servicios de Growth y Conversión | Level Growth"
- `/blog` → "Blog de Growth y Marketing Digital | Level Growth"
- `/contacto` → "Contacto — Auditoría gratuita | Level Growth"

---

## 8. PERFORMANCE Y ACCESIBILIDAD

- Todas las imágenes con next/image, formato WebP, lazy loading
- Fuentes con `display: swap` para evitar FOIT
- Contraste mínimo AA en todo el texto sobre fondos oscuros
- Todos los botones con aria-label cuando no tienen texto visible
- Formulario con manejo de errores claro y accesible
- Score objetivo en PageSpeed: 90+ mobile, 95+ desktop
- Sin animaciones si el usuario tiene `prefers-reduced-motion: reduce`

---

## 9. VARIABLES DE ENTORNO (.env.local)

```
# Email
RESEND_API_KEY=
FROM_EMAIL=contacto@levelgrowth.com.ar
TO_EMAIL=contacto@levelgrowth.com.ar

# Analytics (completar cuando estén disponibles)
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_META_PIXEL_ID=

# WhatsApp (número de contacto)
NEXT_PUBLIC_WHATSAPP_NUMBER=
```

---

## 10. INSTRUCCIONES PARA CLAUDE CODE

Cuando recibas instrucciones de desarrollo, seguí estas reglas:

1. **Siempre TypeScript** — sin excepciones, sin archivos .js
2. **Tailwind para estilos** — sin CSS modules ni styled-components
3. **Framer Motion para animaciones** — no CSS keyframes salvo casos simples
4. **Componentes pequeños y reutilizables** — nada de archivos de 500 líneas
5. **Mobile first** — diseñar desde el breakpoint más chico hacia arriba
6. **No placeholder de Tailwind** — usar los colores exactos de la paleta definida arriba, configurados en tailwind.config.ts
7. **Comentarios en español** — igual que el tono del proyecto
8. **El copy es sagrado** — no inventar texto alternativo, usar exactamente lo definido en este documento
9. **Sin librerías innecesarias** — si algo se puede hacer con Tailwind y Framer Motion, no agregar una librería extra
10. **Antes de crear un componente nuevo** — verificar si ya existe uno similar en /components

### Configuración de Tailwind

Extender el tema con todos los colores de la paleta:

```ts
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      'lg-bg':           '#080C14',
      'lg-bg-secondary': '#0D1221',
      'lg-bg-tertiary':  '#111827',
      'lg-green':        '#3FC87A',
      'lg-green-dark':   '#2BA86A',
      'lg-blue':         '#4A9EE0',
      'lg-blue-dark':    '#0D1F4A',
      'lg-text':         '#FFFFFF',
      'lg-text-secondary':'#7A8FA6',
      'lg-text-muted':   '#4A6070',
      'lg-border':       'rgba(255,255,255,0.08)',
    },
    fontFamily: {
      'display': ['Syne', 'sans-serif'],
      'body':    ['DM Sans', 'sans-serif'],
      'mono':    ['JetBrains Mono', 'monospace'],
    },
  }
}
```

---

## 11. ORDEN DE DESARROLLO RECOMENDADO

Desarrollar en este orden exacto:

1. `tailwind.config.ts` — paleta de colores y fuentes
2. `app/layout.tsx` — fuentes, metadata base, providers
3. `components/ui/Button.tsx` — componente base reutilizable
4. `components/ui/Badge.tsx`
5. `components/ui/Card.tsx`
6. `components/layout/Header.tsx` — navegación principal
7. `components/layout/Footer.tsx`
8. `components/sections/Hero.tsx`
9. `components/sections/Pain.tsx`
10. `components/sections/Services.tsx`
11. `components/sections/CaseStudy.tsx`
12. `components/sections/Process.tsx`
13. `components/sections/Pricing.tsx`
14. `components/sections/FAQ.tsx`
15. `components/sections/CTAFinal.tsx`
16. `app/page.tsx` — ensamblar todas las secciones
17. `app/contacto/page.tsx` + `app/api/contact/route.ts`
18. `app/blog/page.tsx` + `app/blog/[slug]/page.tsx`
19. MDX setup y primeros dos artículos

---

*Este documento es la fuente de verdad del proyecto. Ante cualquier duda sobre diseño, copy o arquitectura, la respuesta está acá.*
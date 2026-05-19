/**
 * Fuente única de verdad de Level Growth.
 * Editá este archivo para actualizar tanto la UI como el JSON-LD automáticamente.
 * Los builders de /lib/schema/index.ts leen de aquí; los componentes también.
 */

export const SITE_URL = "https://levelgrowthagency.com";

/* ─── Información del negocio ─────────────── */
export const businessInfo = {
  name:             "Level Growth",
  description:      "Level Growth es una agencia de crecimiento que ayuda a negocios a generar más ventas optimizando su sitio web y su publicidad paga. Especialistas en funnel completo: desde el primer clic del ad hasta el cliente que paga.",
  shortDescription: "Especialistas en funnel completo y paid media. Desde el primer clic del ad hasta el cliente que paga.",
  foundingDate:     "2026",
  email:            "santiago@levelgrowthagency.com",
  telephone:        "+54 9 351 261-3927",
  whatsapp:         "5493512613927",
  priceRange:       "$$",
  url:              SITE_URL,
};

/* ─── Fundador ────────────────────────────── */
export const founder = {
  name:        "Santiago Medina",
  jobTitle:    "Fundador de Level Growth Agency",
  description: "Santiago Medina fundó Level Growth con el objetivo de darle a cualquier negocio las mismas herramientas de conversión que usan las empresas que más crecen. Con experiencia en marketing digital desde 2023, se especializó en el funnel completo: desde el primer clic del ad hasta el cliente que paga.",
  knowsAbout:  [
    "marketing digital",
    "publicidad digital",
    "desarrollo web",
    "Next.js",
    "SEO técnico",
    "CRO",
    "Meta Ads",
    "Google Ads",
  ],
};

/* ─── Ubicación y cobertura ───────────────── */
export const locations = {
  address: {
    addressLocality: "Córdoba",
    postalCode:      "5016",
    addressCountry:  "AR",
  },
  geo: {
    latitude:  -31.4201,
    longitude: -64.1888,
  },
  areaServed: [
    { type: "Country" as const, name: "Argentina" },
    { type: "Place"   as const, name: "Latinoamérica" },
  ],
};

/* ─── Servicios para JSON-LD (7 items granulares) ── */
export const schemaServices = [
  {
    name:        "Desarrollo web",
    description: "Diseño y desarrollo de landing pages de alta conversión con Next.js.",
    serviceType: "Desarrollo web",
  },
  {
    name:        "Auditoría web gratuita",
    description: "Análisis de velocidad, SEO y conversión con resultado en menos de 60 segundos.",
    serviceType: "Auditoría web",
  },
  {
    name:        "Meta Ads",
    description: "Creación y gestión de campañas publicitarias en Facebook e Instagram.",
    serviceType: "Publicidad digital",
  },
  {
    name:        "Google Ads",
    description: "Campañas de búsqueda y display en Google orientadas a resultados medibles.",
    serviceType: "Publicidad digital",
  },
  {
    name:        "SEO técnico",
    description: "Optimización técnica para mejorar el posicionamiento orgánico en buscadores.",
    serviceType: "SEO",
  },
  {
    name:        "CRO — Optimización de conversión",
    description: "Análisis y mejora de la tasa de conversión de sitios web y funnels.",
    serviceType: "Optimización de conversión",
  },
  {
    name:        "Contenido para redes sociales",
    description: "Creación de contenido estratégico para redes orientado a la generación de leads.",
    serviceType: "Contenido",
  },
];

/* ─── Servicios para la UI (4 grupos de marketing) ── */
export const uiServices = [
  {
    num:         "01",
    badge:       "Punto de partida",
    title:       "Auditoría de funnel",
    description: "Analizamos tu sitio web, tu publicidad activa y tu proceso de contacto. En 48 horas sabés exactamente qué está frenando tus ventas.",
  },
  {
    num:         "02",
    badge:       "Más conversiones",
    title:       "Optimización de landing",
    description: "Rediseñamos o mejoramos tu sitio para que cada visitante tenga un motivo claro para contactarte. Copy, estructura y velocidad.",
  },
  {
    num:         "03",
    badge:       "Paid Media",
    title:       "Gestión de publicidad",
    description: "Creamos y gestionamos tus campañas en Google y Meta. Setup inicial + optimización mensual orientada a resultados medibles, no a impresiones.",
  },
  {
    num:         "04",
    badge:       "Todo incluido",
    title:       "Funnel completo",
    description: "Landing + publicidad + seguimiento. Un sistema donde cada pieza trabaja junto. Ideal para negocios que quieren escalar sin improvisar.",
  },
];

/* ─── FAQs ────────────────────────────────── */
export const faqs = [
  {
    question: "Ya probé con una agencia y no me fue bien.",
    answer:   "La mayoría de las agencias optimizan la pauta sin tocar la página. Es como ponerle más nafta a un auto con las ruedas pinchadas. Nosotros arrancamos por la web y el mensaje — si el destino del clic no funciona, la pauta más cara del mundo no te salva.",
  },
  {
    question: "No sé si tengo presupuesto para esto.",
    answer:   "Cada mes que tu web pierde clientes tiene un costo real, aunque no aparezca en ninguna factura. Lo que pagás en publicidad para mandar gente a una página que no convierte es plata que ya perdiste. La auditoría es gratuita y te muestra si tiene sentido invertir antes de gastar un peso.",
  },
  {
    question: "¿Cuánto tiempo tarda todo el proceso?",
    answer:   "La auditoría automática tarda 60 segundos y podés hacerla vos mismo en levelgrowthagency.com/auditoria-web-gratis. La auditoría profesional completa con análisis de publicidad y funnel te la entregamos en 48 horas. Una landing completa se entrega en 7 a 10 días hábiles. Si sumás publicidad, el setup inicial es de una semana y después es gestión y optimización continua.",
  },
  {
    question: "¿Y si no veo resultados?",
    answer:   "Antes de proponerte nada hacemos la auditoría sin costo. Si no encontramos oportunidades reales de mejora, te lo decimos y no arrancamos. Una vez que empezamos, medimos semana a semana y ajustamos en base a datos. No trabajamos con suposiciones.",
  },
  {
    question: "Mi negocio es chico, ¿esto es para mí?",
    answer:   "Si ya tenés un producto que se vende y gente que llega a tu web, estás listo. El tamaño del negocio no importa — lo que importa es que haya un camino entre el clic y la venta que se pueda optimizar. Level Growth nació justamente para darle a negocios en crecimiento las herramientas que antes solo tenían las empresas grandes.",
  },
  {
    question: "¿Puedo contratar solo la web sin la publicidad?",
    answer:   "Sí. Muchos arrancan por la landing y después suman publicidad cuando están listos. Lo que no hacemos es publicidad sin que la página esté preparada para recibir ese tráfico — sería quemar tu plata.",
  },
  {
    question: "No sé por dónde empezar.",
    answer:   "Por la auditoría gratuita en levelgrowthagency.com/auditoria-web-gratis. Tardás 60 segundos y ya sabés exactamente qué está frenando tus ventas. Si querés ir más a fondo, agendamos una llamada sin costo y analizamos tu situación completa. No necesitás saber de marketing para arrancar — para eso estamos nosotros.",
  },
];

/* ─── Redes sociales ──────────────────────── */
export const socials = {
  instagram: "https://www.instagram.com/levelgrowthagency/",
  linkedin:  null as string | null,
};

/* ─── Assets de marca ─────────────────────── */
export const brandAssets = {
  logoUrl:  "/favicon.svg",
  // TODO: reemplazar por imagen 1200×630px cuando esté disponible (campo "image" en LocalBusiness schema)
  imageUrl: `${SITE_URL}/favicon.svg`,
};

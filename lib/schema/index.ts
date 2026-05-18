const SITE_URL = "https://levelgrowthagency.com";
const ORG_ID   = `${SITE_URL}/#organization`;
const WEB_ID   = `${SITE_URL}/#website`;

export function buildOrgWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness"],
        "@id": ORG_ID,
        name: "Level Growth",
        url: SITE_URL,
        logo: `${SITE_URL}/favicon.svg`,
        email: "santiago@levelgrowthagency.com",
        foundingDate: "2026",
        description:
          "Level Growth es una agencia de crecimiento que ayuda a negocios a generar más ventas optimizando su sitio web y su publicidad paga. Especialistas en funnel completo: desde el primer clic del ad hasta el cliente que paga.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Córdoba",
          addressCountry: "AR",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: -31.4201,
          longitude: -64.1888,
        },
        areaServed: [
          { "@type": "Country", name: "Argentina" },
          { "@type": "Place",   name: "Latinoamérica" },
        ],
        sameAs: ["https://www.instagram.com/levelgrowthagency/"],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Servicios Level Growth",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Desarrollo web" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Auditoría web gratuita" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Meta Ads" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Google Ads" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "SEO" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "CRO — Optimización de conversión" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Contenido para redes sociales" } },
          ],
        },
      },
      {
        "@type": "WebSite",
        "@id": WEB_ID,
        name: "Level Growth",
        url: SITE_URL,
        publisher: { "@id": ORG_ID },
      },
    ],
  };
}

export function buildFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildArticleSchema({
  slug,
  title,
  description,
  datePublished,
  dateModified,
}: {
  slug:          string;
  title:         string;
  description:   string;
  datePublished: string;
  dateModified?: string;
}) {
  const url = `${SITE_URL}/blog/${slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline:      title,
    description,
    url,
    datePublished,
    dateModified: dateModified ?? datePublished,
    author:    { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };
}

export function buildBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

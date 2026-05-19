import {
  SITE_URL,
  businessInfo,
  founder,
  locations,
  schemaServices,
  socials,
  brandAssets,
} from "@/lib/data/business";

const ORG_ID     = `${SITE_URL}/#organization`;
const WEB_ID     = `${SITE_URL}/#website`;
const FOUNDER_ID = `${SITE_URL}/#founder`;

/* ─── Organization + WebSite + Person ─────── */
export function buildOrgWebsiteSchema() {
  const sameAs = [socials.instagram, socials.linkedin].filter(Boolean) as string[];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type":      ["Organization", "LocalBusiness"],
        "@id":        ORG_ID,
        name:         businessInfo.name,
        url:          businessInfo.url,
        logo:         `${SITE_URL}${brandAssets.logoUrl}`,
        image:        brandAssets.imageUrl,
        email:        businessInfo.email,
        telephone:    businessInfo.telephone,
        priceRange:   businessInfo.priceRange,
        foundingDate: businessInfo.foundingDate,
        description:  businessInfo.description,
        knowsAbout:   founder.knowsAbout,
        founder:      { "@id": FOUNDER_ID },
        sameAs,
        address: {
          "@type":         "PostalAddress",
          addressLocality: locations.address.addressLocality,
          postalCode:      locations.address.postalCode,
          addressCountry:  locations.address.addressCountry,
        },
        geo: {
          "@type":   "GeoCoordinates",
          latitude:  locations.geo.latitude,
          longitude: locations.geo.longitude,
        },
        areaServed: locations.areaServed.map((a) => ({
          "@type": a.type,
          name:    a.name,
        })),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name:    "Servicios Level Growth",
          itemListElement: schemaServices.map((s) => ({
            "@type": "Offer",
            itemOffered: {
              "@type":       "Service",
              name:          s.name,
              description:   s.description,
              serviceType:   s.serviceType,
              provider:      { "@id": ORG_ID },
              areaServed:    locations.areaServed.map((a) => ({ "@type": a.type, name: a.name })),
            },
          })),
        },
      },
      {
        "@type":     "WebSite",
        "@id":       WEB_ID,
        name:        businessInfo.name,
        url:         businessInfo.url,
        inLanguage:  "es-AR",
        publisher:   { "@id": ORG_ID },
      },
      {
        "@type":      "Person",
        "@id":        FOUNDER_ID,
        name:         founder.name,
        jobTitle:     founder.jobTitle,
        description:  founder.description,
        worksFor:     { "@id": ORG_ID },
        knowsAbout:   founder.knowsAbout,
        sameAs:       [socials.instagram].filter(Boolean),
      },
    ],
  };
}

/* ─── FAQPage ─────────────────────────────── */
export function buildFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type":    "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name:    faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text:    faq.answer,
      },
    })),
  };
}

/* ─── BlogPosting + BreadcrumbList (@graph) ── */
export function buildBlogPostSchema({
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
    "@graph": [
      {
        "@type":          "BlogPosting",
        "@id":            `${url}#article`,
        headline:         title,
        description,
        url,
        inLanguage:       "es-AR",
        datePublished,
        dateModified:     dateModified ?? datePublished,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        author:           { "@id": FOUNDER_ID },
        publisher:        { "@id": ORG_ID },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Blog",   item: `${SITE_URL}/blog` },
          { "@type": "ListItem", position: 3, name: title,    item: url },
        ],
      },
    ],
  };
}

/* ─── BreadcrumbList standalone ──────────── */
export function buildBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type":    "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type":  "ListItem",
      position: i + 1,
      name:     item.name,
      item:     item.url,
    })),
  };
}

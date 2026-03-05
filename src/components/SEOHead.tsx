// src/components/SEOHead.tsx
import React from "react";
import { Helmet } from "react-helmet-async";
import seoConfig, { siteUrl, siteName } from "../config/seo.config";

type EventMeta = {
  name: string;
  startDate: string; // ISO
  endDate?: string;
  location?: string;
  description?: string;
  url?: string;
};

interface Props {
  title?: string;
  description?: string;
  keywords?: string | string[];
  ogImage?: string; // relative or absolute
  ogImageAlt?: string;
  canonicalUrl?: string;
  twitterHandle?: string;
  locale?: string;
  eventMeta?: EventMeta | null;
  preloadImage?: boolean; // if hero image is above the fold
}

const absoluteUrl = (u?: string) => {
  if (!u) return `${siteUrl}${seoConfig.defaultImage}`;
  return u.startsWith("http") ? u : `${siteUrl}${u.startsWith("/") ? "" : "/"}${u}`;
};

const SEOHead: React.FC<Props> = ({
  title,
  description,
  keywords,
  ogImage,
  ogImageAlt,
  canonicalUrl,
  twitterHandle,
  locale,
  eventMeta,
  preloadImage = false,
}) => {
  const finalTitle = title || seoConfig.defaultTitle;
  const finalDescription = description || seoConfig.defaultDescription;
  const finalKeywordsArr = typeof keywords === "string" ? keywords.split(",").map(s => s.trim()) :
    (keywords as string[]) || seoConfig.primaryKeywords;
  const absoluteOg = absoluteUrl(ogImage || seoConfig.defaultImage);
  const canonical = canonicalUrl || siteUrl + (typeof window !== "undefined" ? window.location.pathname : "/");

  // JSON-LD
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: seoConfig.organization.name || siteName,
    url: seoConfig.organization.url || siteUrl,
    logo: seoConfig.organization.logo || absoluteUrl(),
    sameAs: Object.values(seoConfig.social),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: seoConfig.organization.contactEmail,
      },
    ],
  };

  const siteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    description: finalDescription,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
    ],
  };

  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywordsArr.join(", ")} />
      <meta name="author" content={siteName} />
      <meta name="robots" content="index, follow, max-snippet:160, max-image-preview:large, max-video-preview:-1" />
      <link rel="canonical" href={canonical} />
      <link rel="alternate" href={canonical} hrefLang="en" />
      <link rel="alternate" href={canonical} hrefLang="en-IN" />

      {/* OpenGraph */}
      <meta property="og:locale" content={locale || seoConfig.locale || "en_IN"} />
      <meta property="og:type" content={eventMeta ? "event" : "website"} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={absoluteOg} />
      <meta property="og:image:alt" content={ogImageAlt || finalTitle} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle || seoConfig.twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle || seoConfig.twitterHandle} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={absoluteOg} />

      {/* Mobile / PWA hints */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#5ECFCF" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-title" content={siteName} />

      {/* Performance hints */}
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      {/* Example preload of hero image if above the fold */}
      {preloadImage && <link rel="preload" as="image" href={absoluteOg} />}

      {/* Structured data */}
      <script type="application/ld+json">{JSON.stringify(orgLd)}</script>
      <script type="application/ld+json">{JSON.stringify(siteLd)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      {eventMeta && <script type="application/ld+json">{JSON.stringify({ "@context": "https://schema.org", "@type": "Event", ...eventMeta })}</script>}
    </Helmet>
  );
};

export default SEOHead;

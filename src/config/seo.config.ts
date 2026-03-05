// src/config/seoConfig.ts
export const siteUrl =
  "https://welluno.in";

export const siteName = "Welluno";

type ChangeFreq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

export type SEOPage = {
  path: string; // absolute path (e.g. "/about")
  title?: string;
  description?: string;
  priority?: number;
  changefreq?: ChangeFreq;
  lastmod?: string; // ISO date (YYYY-MM-DD)
  excludeFromSitemap?: boolean;
};

export type SEOConfigType = {
  siteName: string;
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultImage: string; // relative path under /public or absolute URL
  locale: string;
  twitterHandle?: string | null;
  primaryKeywords: string[];
  secondaryKeywords: string[];
  pages: SEOPage[];
  social: {
    twitter?: string | null;
    linkedin?: string | null;
    instagram?: string | null;
  };
  organization: {
    name: string;
    url: string;
    logo: string;
    contactEmail: string;
    phone?: string;
    foundingDate?: string;
  };

  /* helpers */
  getFullUrl: (p: string) => string;
  getImageUrl: (imagePath: string) => string;
  getSeoForPath: (path: string) => {
    title: string;
    description: string;
    image: string;
    url: string;
    locale: string;
    keywords: string[];
  };
  getStructuredData: () => Record<string, unknown>;
};

const todayISO = new Date().toISOString().split("T")[0];

export const seoConfig: SEOConfigType = {
  siteName,
  siteUrl,
  defaultTitle: "Welluno - Own Your Story | Corporate Mental Wellness Platform",
  defaultDescription:
"Welluno reimagines corporate wellness through handcrafted live experiences that spark connection, support emotional wellbeing, and help teams thrive at work." , // Keep this relative (put file in /public). getImageUrl will resolve full URL.
  defaultImage: "/og-image.jpg",
  locale: "en-IN",
  twitterHandle: null, // set to "@welluno" if you have a maintained Twitter handle

  primaryKeywords: [
    "welluno",
    "welluno website",
    "welluno.in",
    "corporate wellness",
    "workplace wellness",
    "employee wellbeing",
    "burnout prevention",
    "corporate mental health",
  ],
  secondaryKeywords: [
    "AI wellness",
    "stress management",
    "wellness events",
    "employee engagement",
    "workplace culture",
  ],

  // page-specific (used by sitemap generator / SEOHead)
  pages: [
    {
      path: "/",
      priority: 1.0,
      changefreq: "daily",
      title: "Welluno - Own Your Story",
      description:
        "Live, human-first wellness experiences to prevent burnout and build the best workplace culture.",
      lastmod: todayISO,
    },
    {
      path: "/about",
      priority: 0.8,
      changefreq: "monthly",
      title: "About Welluno | Our Mission",
      description:
        "How Welluno blends AI insights with human experiences to make work human again.",
      lastmod: todayISO,
    },
    {
      path: "/solutions",
      priority: 0.8,
      changefreq: "monthly",
      title: "Welluno Solutions | AI + Human Wellness",
      description: "Programs and events to improve company wellbeing.",
      lastmod: todayISO,
    },
    {
      path: "/events",
      priority: 0.7,
      changefreq: "weekly",
      title: "Welluno Events | Live Wellness Experiences",
      description: "Browse virtual and in-person wellness events that reduce stress.",
      lastmod: todayISO,
    },
    {
      path: "/community",
      priority: 0.6,
      changefreq: "weekly",
      title: "Welluno Community | Connect & Thrive",
      description: "Peer groups, challenges, and employee engagement programs.",
      lastmod: todayISO,
    },
    {
      path: "/contact",
      priority: 0.3,
      changefreq: "yearly",
      title: "Contact Welluno",
      description: "Get in touch with Welluno for partnerships and demos.",
      lastmod: todayISO,
    },
    // add more pages (blog, press) here as you add them
  ],

  social: {
    twitter: null,
    linkedin: "https://www.linkedin.com/company/welluno/",
    instagram: "https://www.instagram.com/welluno.in/",
  },

  organization: {
    name: siteName,
    url: siteUrl,
    // Prefer an absolute URL for the logo (helps some crawlers)
    logo: `${siteUrl}/assets/welluno-logo.jpg`,
    contactEmail: "welluno.pvt.ltd@gmail.com",
    phone: "+91-7982904715",
    foundingDate: "2024",
  },

  /* ------------------------------------
     Helper utilities consumed by SEOHead
     (exported here to keep logic consistent)
     ------------------------------------ */
  getFullUrl(p: string) {
    if (!p) return siteUrl;
    // if p looks absolute, return as-is
    if (/^https?:\/\//i.test(p)) return p;
    if (!p.startsWith("/")) p = `/${p}`;
    return `${siteUrl}${p}`;
  },

  getImageUrl(imagePath: string) {
    if (!imagePath) return `${siteUrl}/og-image.jpg`;
    if (/^https?:\/\//i.test(imagePath)) return imagePath;
    // remove trailing slash
    return `${siteUrl}${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`;
  },

  getSeoForPath(path: string) {
    // match exact path in pages; fallback to default
    const page =
      seoConfig.pages.find((p) => p.path === path) || seoConfig.pages[0] || null;

    const title = page?.title || seoConfig.defaultTitle;
    const description = page?.description || seoConfig.defaultDescription;
    const image = seoConfig.getImageUrl(seoConfig.defaultImage);
    const url = seoConfig.getFullUrl(path || "/");
    const keywords = [
      ...seoConfig.primaryKeywords,
      ...seoConfig.secondaryKeywords,
    ].slice(0, 20);

    return {
      title,
      description,
      image,
      url,
      locale: seoConfig.locale,
      keywords,
    };
  },

  getStructuredData() {
    // Return Organization JSON-LD (can be injected into <head>)
    const sd = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: seoConfig.organization.name,
      url: seoConfig.organization.url,
      logo: seoConfig.organization.logo,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: seoConfig.organization.phone,
        contactType: "Customer Service",
        email: seoConfig.organization.contactEmail,
      },
      sameAs: [
        seoConfig.social.linkedin,
        seoConfig.social.instagram,
      ].filter(Boolean),
      foundingDate: seoConfig.organization.foundingDate,
    };

    return sd;
  },
};

export default seoConfig;
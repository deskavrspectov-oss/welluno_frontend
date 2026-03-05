// scripts/generate-sitemap.js

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/* ----------------------------
   ESM dirname fix
----------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ----------------------------
   Config
----------------------------- */

// Use ENV in production (Vercel etc.)
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://welluno.in";

// Folders to scan (Next.js / React / Vite style)
const ROUTES_DIRS = [
  "../app",
  "../pages", // fallback if app router not used
];

// Ignore these paths
const EXCLUDED = [
  "api",
  "_app",
  "_document",
  "_error",
  "404",
  "500",
];

/* ----------------------------
   Helpers
----------------------------- */

function isPageFile(file) {
  return (
    file.endsWith(".js") ||
    file.endsWith(".jsx") ||
    file.endsWith(".ts") ||
    file.endsWith(".tsx")
  );
}

function cleanRoute(route) {
  return route
    .replace(/index$/g, "")
    .replace(/\.(js|jsx|ts|tsx)$/g, "")
    .replace(/\/+/g, "/");
}

/* ----------------------------
   Scan Routes
----------------------------- */

function scanDir(dir, base = "") {
  let routes = [];

  if (!fs.existsSync(dir)) return routes;

  const files = fs.readdirSync(dir);

  for (const file of files) {
    if (EXCLUDED.includes(file)) continue;

    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      routes = routes.concat(
        scanDir(fullPath, path.join(base, file))
      );
    } else if (isPageFile(file)) {
      let route = cleanRoute(path.join(base, file));

      if (!route.startsWith("/")) route = "/" + route;

      routes.push(route);
    }
  }

  return routes;
}

/* ----------------------------
   Generate Routes
----------------------------- */

let allRoutes = ["/"];

// Auto-detect routes
for (const dir of ROUTES_DIRS) {
  const fullDir = path.join(__dirname, dir);
  allRoutes = allRoutes.concat(scanDir(fullDir));
}

// Remove duplicates
allRoutes = [...new Set(allRoutes)];

/* ----------------------------
   SEO Settings
----------------------------- */

function getPriority(route) {
  if (route === "/") return 1.0;
  if (route.includes("blog")) return 0.8;
  if (route.includes("event")) return 0.7;
  if (route.includes("contact")) return 0.4;
  return 0.6;
}

function getChangeFreq(route) {
  if (route === "/") return "daily";
  if (route.includes("blog")) return "weekly";
  if (route.includes("event")) return "weekly";
  return "monthly";
}

/* ----------------------------
   Build XML
----------------------------- */

const today = new Date().toISOString();

const urls = allRoutes
  .map((route) => {
    return `
  <url>
    <loc>${SITE_URL}${route === "/" ? "" : route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${getChangeFreq(route)}</changefreq>
    <priority>${getPriority(route)}</priority>
  </url>`;
  })
  .join("");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
${urls}
</urlset>`;

/* ----------------------------
   Output
----------------------------- */

const OUTPUT_DIR = path.join(__dirname, "..", "public");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "sitemap.xml");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

fs.writeFileSync(OUTPUT_FILE, sitemap.trim(), "utf8");

/* ----------------------------
   Logs
----------------------------- */

console.log("✅ Sitemap generated successfully!");
console.log("🌐 Site:", SITE_URL);
console.log("📄 Routes:", allRoutes.length);
console.log("📍 Output:", OUTPUT_FILE);
/**
 * Static XML Sitemap Generator for Home Project Planner
 * 
 * Generates public/sitemap.xml deterministically from canonical source registries.
 * Ensures:
 * - 1 Homepage
 * - 1 Projects Overview
 * - 7 Category Hubs (/projects/:slug)
 * - 15 Calculators (/calculators/:slug)
 * - 15 Guides (/guides/:slug)
 * - 5 Public Trust & Foundation Pages (/about, /methodology, /contact, /privacy, /terms)
 * Total: 44 canonical URLs
 * No duplicate /categories/ aliases, no preview URLs, no internal-only routes.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CALCULATORS } from '../src/data/calculators.ts';
import { CATEGORIES } from '../src/data/categories.ts';
import { GUIDES } from '../src/data/guides.ts';
import { SITE_CONFIG, getCanonicalUrl } from '../src/data/siteConfig.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const sitemapPath = path.resolve(rootDir, 'public', 'sitemap.xml');

interface SitemapEntry {
  loc: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
  lastmod?: string;
}

export function generateSitemapEntries(): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  const today = '2026-02-20';

  // 1. Homepage
  entries.push({
    loc: getCanonicalUrl('/'),
    changefreq: 'weekly',
    priority: '1.0',
    lastmod: today,
  });

  // 2. Projects Overview Hub
  entries.push({
    loc: getCanonicalUrl('/projects'),
    changefreq: 'weekly',
    priority: '0.9',
    lastmod: today,
  });

  // 3. Category Hubs (7 canonical /projects/:slug routes)
  Object.values(CATEGORIES).forEach((category) => {
    entries.push({
      loc: getCanonicalUrl(`/projects/${category.slug}`),
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: today,
    });
  });

  // 4. Calculators (15 interactive tools)
  Object.values(CALCULATORS).forEach((calculator) => {
    entries.push({
      loc: getCanonicalUrl(`/calculators/${calculator.slug}`),
      changefreq: 'monthly',
      priority: '0.8',
      lastmod: today,
    });
  });

  // 5. Guides (15 editorial guides)
  Object.values(GUIDES).forEach((guide) => {
    entries.push({
      loc: getCanonicalUrl(`/guides/${guide.slug}`),
      changefreq: 'monthly',
      priority: '0.8',
      lastmod: guide.lastReviewedDate || today,
    });
  });

  // 6. Public Trust & Foundation Pages (5 canonical routes)
  const trustPages = [
    { path: '/about', priority: '0.7', changefreq: 'monthly' as const },
    { path: '/methodology', priority: '0.7', changefreq: 'monthly' as const },
    { path: '/contact', priority: '0.5', changefreq: 'monthly' as const },
    { path: '/privacy', priority: '0.3', changefreq: 'yearly' as const },
    { path: '/terms', priority: '0.3', changefreq: 'yearly' as const },
  ];

  trustPages.forEach((page) => {
    entries.push({
      loc: getCanonicalUrl(page.path),
      changefreq: page.changefreq,
      priority: page.priority,
      lastmod: today,
    });
  });

  return entries;
}

export function buildSitemapXml(): string {
  const entries = generateSitemapEntries();
  const xmlLines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];

  entries.forEach((entry) => {
    xmlLines.push('  <url>');
    xmlLines.push(`    <loc>${entry.loc}</loc>`);
    if (entry.lastmod) {
      xmlLines.push(`    <lastmod>${entry.lastmod}</lastmod>`);
    }
    xmlLines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
    xmlLines.push(`    <priority>${entry.priority}</priority>`);
    xmlLines.push('  </url>');
  });

  xmlLines.push('</urlset>');
  return xmlLines.join('\n') + '\n';
}

export function writeSitemap(): void {
  const xml = buildSitemapXml();
  const publicDir = path.dirname(sitemapPath);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  fs.writeFileSync(sitemapPath, xml, 'utf8');
  console.log(`[sitemap] Generated public/sitemap.xml with ${generateSitemapEntries().length} URLs.`);
}

// Run if called directly
writeSitemap();

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { CALCULATORS } from '../src/data/calculators.ts';
import { CATEGORIES, getCategoryBySlug } from '../src/data/categories.ts';
import { GUIDES } from '../src/data/guides.ts';
import { getCanonicalUrl } from '../src/data/siteConfig.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function getAllCanonicalRoutes(): string[] {
  return [
    '/',
    '/projects',
    ...Object.values(CATEGORIES).map((c) => `/projects/${c.slug}`),
    ...Object.keys(CALCULATORS).map((slug) => `/calculators/${slug}`),
    ...Object.keys(GUIDES).map((slug) => `/guides/${slug}`),
    '/about',
    '/methodology',
    '/contact',
    '/privacy',
    '/terms',
  ];
}

function routeToDistHtmlPath(distDir: string, route: string): string {
  if (route === '/') {
    return path.join(distDir, 'index.html');
  }
  const trimmed = route.replace(/^\/+/, '').replace(/\/+$/, '');
  return path.join(distDir, `${trimmed}.html`);
}

test('Astro SSG: vercel.json enforces cleanUrls, redirects, and no global SPA fallback rewrite', () => {
  const vercelPath = path.join(rootDir, 'vercel.json');
  assert.ok(fs.existsSync(vercelPath), 'vercel.json must exist in project root');

  const content = fs.readFileSync(vercelPath, 'utf-8');
  const config = JSON.parse(content);

  assert.equal(config.cleanUrls, true, 'vercel.json must enable cleanUrls: true');
  assert.equal(config.trailingSlash, false, 'vercel.json must set trailingSlash: false');
  assert.equal(config.rewrites, undefined, 'vercel.json must NOT contain global SPA fallback rewrites');

  assert.ok(Array.isArray(config.redirects), 'vercel.json must specify redirects array');
  const categoryRedirect = config.redirects.find(
    (r: any) => r.source === '/categories/:slug' && r.destination === '/projects/:slug'
  );
  assert.ok(categoryRedirect, 'Must contain alias redirect: /categories/:slug -> /projects/:slug');
  assert.equal(categoryRedirect.permanent, true, 'Category alias redirect should be permanent');

  const flooringRedirect = config.redirects.find(
    (r: any) => r.source === '/calculators/flooring' && r.destination === '/calculators/flooring-calculator'
  );
  assert.ok(flooringRedirect, 'Must contain legacy redirect: /calculators/flooring -> /calculators/flooring-calculator');
  assert.equal(flooringRedirect.permanent, true, 'Flooring redirect should be permanent');
});

test('Astro SSG: all 44 canonical HTML files, 404.html, robots.txt, sitemap.xml, and ads.txt exist in dist', () => {
  const distDir = path.join(rootDir, 'dist');
  assert.ok(fs.existsSync(distDir), 'dist directory must exist');

  const routes = getAllCanonicalRoutes();
  assert.equal(routes.length, 44, 'Must verify all 44 canonical routes');

  for (const route of routes) {
    const htmlPath = routeToDistHtmlPath(distDir, route);
    assert.ok(fs.existsSync(htmlPath), `Static HTML file missing for route ${route}: ${htmlPath}`);
  }

  const notFoundHtml = path.join(distDir, '404.html');
  assert.ok(fs.existsSync(notFoundHtml), 'dist/404.html must exist');

  const robotsTxt = path.join(distDir, 'robots.txt');
  assert.ok(fs.existsSync(robotsTxt), 'dist/robots.txt must exist');
  const robotsContent = fs.readFileSync(robotsTxt, 'utf-8');
  assert.ok(robotsContent.includes('User-agent: *'), 'dist/robots.txt must contain User-agent: *');
  assert.ok(robotsContent.includes('https://homeprojectplanner.org/sitemap.xml'), 'dist/robots.txt must contain sitemap URL');

  const sitemapXml = path.join(distDir, 'sitemap.xml');
  assert.ok(fs.existsSync(sitemapXml), 'dist/sitemap.xml must exist');
  const sitemapContent = fs.readFileSync(sitemapXml, 'utf-8');
  assert.ok(sitemapContent.includes('<?xml version="1.0" encoding="UTF-8"?>'), 'dist/sitemap.xml must be valid xml');
  assert.ok(sitemapContent.includes('<urlset'), 'dist/sitemap.xml must contain urlset');

  const adsTxt = path.join(distDir, 'ads.txt');
  assert.ok(fs.existsSync(adsTxt), 'dist/ads.txt must exist');
  const adsContent = fs.readFileSync(adsTxt, 'utf-8');
  assert.ok(adsContent.includes('pub-1850854173653124'), 'dist/ads.txt must contain AdSense publisher ID');
});

test('Astro SSG: pre-rendered HTML for all 44 routes contains unique SSR SEO tags, canonical, h1, JSON-LD, and AdSense without SPA root', () => {
  const distDir = path.join(rootDir, 'dist');
  const routes = getAllCanonicalRoutes();
  const seenTitles = new Set<string>();
  const seenCanonicals = new Set<string>();

  for (const route of routes) {
    const html = fs.readFileSync(routeToDistHtmlPath(distDir, route), 'utf-8');
    const expectedCanonical = getCanonicalUrl(route);

    assert.ok(/<!doctype html>/i.test(html), `${route}: missing doctype`);
    assert.ok(!html.includes('<div id="root"></div>'), `${route}: must not contain empty SPA #root mount`);

    // Exact canonical link (and no duplicates)
    const canonicalMatches = [...html.matchAll(/<link\s+rel="canonical"\s+href="([^"]+)"/g)];
    assert.equal(canonicalMatches.length, 1, `${route}: expected exactly 1 canonical link`);
    assert.equal(canonicalMatches[0][1], expectedCanonical, `${route}: canonical mismatch`);
    assert.ok(!seenCanonicals.has(expectedCanonical), `Duplicate canonical ${expectedCanonical}`);
    seenCanonicals.add(expectedCanonical);

    // Unique <title>
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    assert.ok(titleMatch && titleMatch[1].trim().length > 10, `${route}: missing or empty <title>`);
    assert.ok(!seenTitles.has(titleMatch[1]), `${route}: duplicate title "${titleMatch[1]}"`);
    seenTitles.add(titleMatch[1]);

    // <meta name="description">
    const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/);
    assert.ok(descMatch && descMatch[1].trim().length >= 50, `${route}: missing or short meta description`);

    // <h1> present in static HTML
    assert.ok(/<h1[\s>]/i.test(html), `${route}: missing static <h1>`);

    // Inner pages must not serve homepage hero
    if (route !== '/') {
      assert.ok(
        !html.includes('Plan Your Next Home Project With <span class="text-amber-400">Confidence</span>'),
        `${route}: accidentally served homepage hero`
      );
    }

    // Valid single JSON-LD script block
    const jsonLdMatches = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
    assert.equal(jsonLdMatches.length, 1, `${route}: expected exactly 1 JSON-LD block`);
    const parsed = JSON.parse(jsonLdMatches[0][1]);
    assert.equal(parsed['@context'], 'https://schema.org', `${route}: invalid JSON-LD @context`);
    assert.ok(Array.isArray(parsed['@graph']) && parsed['@graph'].length >= 1, `${route}: empty JSON-LD @graph`);

    // AdSense script in static head
    assert.ok(html.includes('ca-pub-1850854173653124'), `${route}: missing AdSense client ID`);
  }

  // Verify 404.html has noindex, nofollow and no canonical
  const notFoundHtml = fs.readFileSync(path.join(distDir, '404.html'), 'utf-8');
  assert.ok(
    notFoundHtml.includes('<meta name="robots" content="noindex, nofollow"'),
    '404.html must include noindex, nofollow'
  );
  assert.ok(!notFoundHtml.includes('rel="canonical"'), '404.html must not emit a canonical link');
  assert.ok(/<h1[\s>]/i.test(notFoundHtml), '404.html must include an <h1>');
});

test('Astro SSG: simulated Vercel cleanUrls static server serves 200 on all 44 routes, 308 redirects, and 404 on unknown paths', async () => {
  const distDir = path.join(rootDir, 'dist');
  assert.ok(fs.existsSync(distDir), 'dist must be built');
  const notFoundContent = fs.readFileSync(path.join(distDir, '404.html'), 'utf-8');

  const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    const pathname = decodeURIComponent(parsedUrl.pathname).replace(/\/+$/, '') || '/';

    // 1. Permanent redirects from vercel.json
    if (pathname.startsWith('/categories/')) {
      const slug = pathname.replace('/categories/', '');
      res.writeHead(308, { Location: `/projects/${slug}` });
      res.end();
      return;
    }
    if (pathname === '/calculators/flooring') {
      res.writeHead(308, { Location: '/calculators/flooring-calculator' });
      res.end();
      return;
    }

    // 2. Exact static file (robots.txt, sitemap.xml, ads.txt, favicon.svg, assets)
    const exactFile = path.join(distDir, pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, ''));
    if (fs.existsSync(exactFile) && fs.statSync(exactFile).isFile()) {
      const ext = path.extname(exactFile).toLowerCase();
      const contentTypes: Record<string, string> = {
        '.html': 'text/html; charset=utf-8',
        '.txt': 'text/plain; charset=utf-8',
        '.xml': 'text/xml; charset=utf-8',
        '.svg': 'image/svg+xml',
        '.js': 'text/javascript; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
      };
      res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'application/octet-stream' });
      res.end(fs.readFileSync(exactFile));
      return;
    }

    // 3. Vercel cleanUrls: true lookup (<pathname>.html)
    const cleanHtmlFile = path.join(distDir, `${pathname.replace(/^\/+/, '')}.html`);
    if (fs.existsSync(cleanHtmlFile) && fs.statSync(cleanHtmlFile).isFile()) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(fs.readFileSync(cleanHtmlFile));
      return;
    }

    // 4. Real 404 serving 404.html
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(notFoundContent);
  });

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as any).port;
  const baseUrl = `http://localhost:${port}`;

  const fetchRoute = async (urlPath: string) => {
    return new Promise<{ status: number; contentType: string; body: string; location?: string }>((resolve, reject) => {
      const req = http.get(`${baseUrl}${urlPath}`, (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          resolve({
            status: res.statusCode || 0,
            contentType: res.headers['content-type'] || '',
            body,
            location: res.headers.location,
          });
        });
      });
      req.on('error', reject);
    });
  };

  try {
    // 1. Static non-HTML files
    const robotsRes = await fetchRoute('/robots.txt');
    assert.equal(robotsRes.status, 200);
    assert.ok(robotsRes.contentType.includes('text/plain'));
    assert.ok(robotsRes.body.includes('User-agent: *'));

    const sitemapRes = await fetchRoute('/sitemap.xml');
    assert.equal(sitemapRes.status, 200);
    assert.ok(sitemapRes.contentType.includes('text/xml'));
    assert.ok(sitemapRes.body.includes('<urlset'));

    const adsRes = await fetchRoute('/ads.txt');
    assert.equal(adsRes.status, 200);
    assert.ok(adsRes.body.includes('pub-1850854173653124'));

    const faviconRes = await fetchRoute('/favicon.svg');
    assert.equal(faviconRes.status, 200);
    assert.ok(faviconRes.contentType.includes('image/svg+xml'));

    // 2. Permanent redirects
    const categoryRedirectRes = await fetchRoute('/categories/flooring');
    assert.equal(categoryRedirectRes.status, 308);
    assert.equal(categoryRedirectRes.location, '/projects/flooring');

    const flooringRedirectRes = await fetchRoute('/calculators/flooring');
    assert.equal(flooringRedirectRes.status, 308);
    assert.equal(flooringRedirectRes.location, '/calculators/flooring-calculator');

    // 3. All 44 canonical routes must return 200 with page-specific HTML
    for (const route of getAllCanonicalRoutes()) {
      const res = await fetchRoute(route);
      assert.equal(res.status, 200, `Route ${route} should return HTTP 200`);
      assert.ok(res.contentType.includes('text/html'), `Route ${route} should return text/html`);
      assert.ok(
        res.body.includes(`href="${getCanonicalUrl(route)}"`),
        `Route ${route} HTML must contain its own canonical URL`
      );
    }

    // 4. Unknown route must return HTTP 404 (not 200 homepage)
    const missingRes = await fetchRoute('/this-route-does-not-exist');
    assert.equal(missingRes.status, 404, 'Unknown route must return HTTP 404');
    assert.ok(missingRes.body.includes('noindex, nofollow'), '404 response must serve 404.html');

    // 5. Category helper check preserved
    assert.ok(getCategoryBySlug('flooring'));
  } finally {
    server.close();
  }
});

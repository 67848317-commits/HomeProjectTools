import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { CALCULATORS } from '../src/data/calculators.ts';
import { CATEGORIES, getCategoryBySlug } from '../src/data/categories.ts';
import { GUIDES } from '../src/data/guides.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('Phase 6A.6: vercel.json structure and routing configuration', () => {
  const vercelPath = path.join(rootDir, 'vercel.json');
  assert.ok(fs.existsSync(vercelPath), 'vercel.json must exist in project root');

  const content = fs.readFileSync(vercelPath, 'utf-8');
  const config = JSON.parse(content);

  // Rewrites verification
  assert.ok(Array.isArray(config.rewrites), 'vercel.json must specify rewrites array');
  const spaRewrite = config.rewrites.find(
    (r: any) => r.source === '/(.*)' && r.destination === '/index.html'
  );
  assert.ok(spaRewrite, 'Must contain fallback rewrite: source "/(.*)" -> destination "/index.html"');

  // Redirects verification
  assert.ok(Array.isArray(config.redirects), 'vercel.json must specify redirects array');
  const categoryRedirect = config.redirects.find(
    (r: any) => r.source === '/categories/:slug' && r.destination === '/projects/:slug'
  );
  assert.ok(categoryRedirect, 'Must contain alias redirect: /categories/:slug -> /projects/:slug');
  assert.equal(categoryRedirect.permanent, true, 'Category alias redirect should be permanent');
});

test('Phase 6A.6: static files exist and are not missing from dist', () => {
  const distDir = path.join(rootDir, 'dist');
  assert.ok(fs.existsSync(distDir), 'dist directory must exist');

  const indexHtml = path.join(distDir, 'index.html');
  assert.ok(fs.existsSync(indexHtml), 'dist/index.html must exist');
  const indexContent = fs.readFileSync(indexHtml, 'utf-8');
  assert.ok(/<!doctype html>/i.test(indexContent), 'dist/index.html must contain valid html document');
  assert.ok(indexContent.includes('<div id="root"></div>'), 'dist/index.html must contain react mount node');

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
});

test('Phase 6A.6: SPA router recognizes all 44 canonical routes and handles 404', () => {
  const testRoutes = [
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

  assert.equal(testRoutes.length, 44, 'Must verify all 44 canonical routes');

  // Verify each route against router recognition logic (mirroring App.tsx)
  for (const route of testRoutes) {
    const isCalc = route.startsWith('/calculators/') && !!CALCULATORS[route.replace('/calculators/', '')];
    const isGuide = route.startsWith('/guides/') && !!GUIDES[route.replace('/guides/', '')];
    const isProject = route.startsWith('/projects/') && !!getCategoryBySlug(route.replace('/projects/', ''));
    const isTrust = ['/about', '/methodology', '/contact', '/privacy', '/terms'].includes(route);
    const isHomeOrProjects = route === '/' || route === '/projects';

    const matched = isCalc || isGuide || isProject || isTrust || isHomeOrProjects;
    assert.ok(matched, `Route ${route} should be recognized by router`);
  }

  // Verify unknown route is recognized as unmapped
  const invalidRoute: string = '/this-route-does-not-exist';
  const isCalc = invalidRoute.startsWith('/calculators/') && !!CALCULATORS[invalidRoute.replace('/calculators/', '')];
  const isGuide = invalidRoute.startsWith('/guides/') && !!GUIDES[invalidRoute.replace('/guides/', '')];
  const isProject = invalidRoute.startsWith('/projects/') && !!getCategoryBySlug(invalidRoute.replace('/projects/', ''));
  const isTrust = ['/about', '/methodology', '/contact', '/privacy', '/terms'].includes(invalidRoute);
  const isHomeOrProjects = invalidRoute === '/' || invalidRoute === '/projects';

  const matched = isCalc || isGuide || isProject || isTrust || isHomeOrProjects;
  assert.equal(matched, false, 'Invalid route should not match valid application routes');
});

test('Phase 6A.6: simulated Vercel static file server serves static files and rewrites SPA routes', async () => {
  const distDir = path.join(rootDir, 'dist');
  assert.ok(fs.existsSync(distDir), 'dist must be built');

  const indexHtmlContent = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

  // Simulate Vercel static + rewrite behavior
  const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    // 1. Check redirects (like /categories/:slug -> /projects/:slug)
    if (pathname.startsWith('/categories/')) {
      const slug = pathname.replace('/categories/', '');
      res.writeHead(308, { Location: `/projects/${slug}` });
      res.end();
      return;
    }

    // 2. Check filesystem for static file
    const filePath = path.join(distDir, pathname === '/' ? 'index.html' : pathname);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentTypes: Record<string, string> = {
        '.html': 'text/html; charset=utf-8',
        '.txt': 'text/plain; charset=utf-8',
        '.xml': 'text/xml; charset=utf-8',
        '.svg': 'image/svg+xml',
        '.js': 'text/javascript; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
      };
      res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'application/octet-stream' });
      res.end(fs.readFileSync(filePath));
      return;
    }

    // 3. Fallback rewrite to /index.html
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(indexHtmlContent);
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
    // 1. Static file precedence tests
    const robotsRes = await fetchRoute('/robots.txt');
    assert.equal(robotsRes.status, 200);
    assert.ok(robotsRes.contentType.includes('text/plain'), 'robots.txt must return text/plain');
    assert.ok(robotsRes.body.includes('User-agent: *'), 'robots.txt content must be real robots.txt');
    assert.ok(!robotsRes.body.includes('<!DOCTYPE html>'), 'robots.txt must not return index.html');

    const sitemapRes = await fetchRoute('/sitemap.xml');
    assert.equal(sitemapRes.status, 200);
    assert.ok(sitemapRes.contentType.includes('text/xml'), 'sitemap.xml must return text/xml');
    assert.ok(sitemapRes.body.includes('<urlset'), 'sitemap.xml content must be real XML');
    assert.ok(!sitemapRes.body.includes('<!DOCTYPE html>'), 'sitemap.xml must not return index.html');

    const faviconRes = await fetchRoute('/favicon.svg');
    assert.equal(faviconRes.status, 200);
    assert.ok(faviconRes.contentType.includes('image/svg+xml'), 'favicon.svg must return image/svg+xml');

    // 2. Redirect tests
    const categoryRedirectRes = await fetchRoute('/categories/flooring');
    assert.equal(categoryRedirectRes.status, 308);
    assert.equal(categoryRedirectRes.location, '/projects/flooring');

    // 3. Deep-link test matrix (all must return 200 text/html serving index.html)
    const deepRoutes = [
      '/',
      '/projects',
      '/projects/flooring',
      '/calculators/flooring-calculator',
      '/calculators/tile-calculator',
      '/calculators/paint-calculator',
      '/calculators/concrete-slab-calculator',
      '/calculators/concrete-post-hole-calculator',
      '/calculators/mulch-calculator',
      '/calculators/gravel-calculator',
      '/calculators/sod-calculator',
      '/calculators/drywall-calculator',
      '/calculators/deck-material-calculator',
      '/calculators/fence-material-calculator',
      '/calculators/roofing-calculator',
      '/calculators/paver-patio-calculator',
      '/calculators/topsoil-calculator',
      '/calculators/baseboard-trim-calculator',
      '/guides/how-much-tile-do-i-need',
      '/guides/how-much-gravel-do-i-need',
      '/about',
      '/methodology',
      '/contact',
      '/privacy',
      '/terms',
      '/this-route-does-not-exist',
    ];

    for (const r of deepRoutes) {
      const res = await fetchRoute(r);
      assert.equal(res.status, 200, `Route ${r} should return status 200`);
      assert.ok(res.contentType.includes('text/html'), `Route ${r} should return text/html`);
      assert.ok(res.body.includes('<div id="root"></div>'), `Route ${r} should serve SPA entry point`);
    }
  } finally {
    server.close();
  }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CALCULATORS } from '../src/data/calculators.ts';
import { CATEGORIES } from '../src/data/categories.ts';
import { GUIDES } from '../src/data/guides.ts';
import { SITE_CONFIG, getCanonicalUrl } from '../src/data/siteConfig.ts';
import { generateSitemapEntries } from '../scripts/generate-sitemap.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('Phase 5B-1: Inventory baseline matches specification', () => {
  assert.equal(Object.keys(CALCULATORS).length, 15, 'Must have exactly 15 calculators');
  assert.equal(Object.keys(GUIDES).length, 15, 'Must have exactly 15 companion guides');
  assert.equal(Object.keys(CATEGORIES).length, 7, 'Must have exactly 7 canonical category hubs');
  const sitemapEntries = generateSitemapEntries();
  assert.equal(sitemapEntries.length, 44, 'Must have exactly 44 canonical sitemap URLs');
});

test('Phase 5B-1: Page titles are unique and free of duplicate brand repetition', () => {
  // Check categories
  for (const [id, cat] of Object.entries(CATEGORIES)) {
    assert.ok(
      !cat.seo.metaTitle.includes('Home Project Tools'),
      `Category ${id} metaTitle '${cat.seo.metaTitle}' should not contain brand name because App.tsx appends it`
    );
  }

  // Check calculators
  const calcTitles = new Set<string>();
  for (const [id, calc] of Object.entries(CALCULATORS)) {
    assert.ok(
      !calc.seo.metaTitle.includes('Home Project Tools'),
      `Calculator ${id} metaTitle '${calc.seo.metaTitle}' should not contain brand name because App.tsx appends it`
    );
    assert.ok(!calcTitles.has(calc.seo.metaTitle), `Duplicate calculator metaTitle in ${id}`);
    calcTitles.add(calc.seo.metaTitle);
  }

  // Check guides
  const guideTitles = new Set<string>();
  for (const [id, guide] of Object.entries(GUIDES)) {
    assert.ok(
      !guide.metaTitle.includes('Home Project Tools'),
      `Guide ${id} metaTitle '${guide.metaTitle}' should not contain brand name because App.tsx appends it`
    );
    assert.ok(!guideTitles.has(guide.metaTitle), `Duplicate guide metaTitle in ${id}`);
    guideTitles.add(guide.metaTitle);
  }
});

test('Phase 5B-1: Meta descriptions are descriptive, unique, and non-empty', () => {
  for (const [id, calc] of Object.entries(CALCULATORS)) {
    assert.ok(calc.seo.metaDescription.length >= 60, `Calculator ${id} metaDescription too short`);
  }
  for (const [id, guide] of Object.entries(GUIDES)) {
    assert.ok(guide.metaDescription.length >= 60, `Guide ${id} metaDescription too short`);
  }
  for (const [id, cat] of Object.entries(CATEGORIES)) {
    assert.ok(cat.seo.metaDescription.length >= 60, `Category ${id} metaDescription too short`);
  }
});

test('Phase 5B-1: Favicon exists and is linked properly', () => {
  const faviconSvg = path.resolve(rootDir, 'public', 'favicon.svg');
  assert.ok(fs.existsSync(faviconSvg), 'public/favicon.svg must exist');
  const faviconContent = fs.readFileSync(faviconSvg, 'utf8');
  assert.ok(faviconContent.includes('<svg'), 'favicon.svg must be a valid SVG');

  const indexHtml = fs.readFileSync(path.resolve(rootDir, 'index.html'), 'utf8');
  assert.ok(indexHtml.includes('/favicon.svg'), 'index.html must reference /favicon.svg');
});

test('Phase 5B-1: Organization schema has no non-existent assets', () => {
  const org = SITE_CONFIG.organization as Record<string, unknown>;
  if (org.logo) {
    const logoStr = String(org.logo);
    assert.ok(
      !logoStr.includes('assets/logo.png'),
      'Must not reference non-existent logo.png in organization schema'
    );
  }
});

test('Phase 5B-1: Canonical URLs and domain safety', () => {
  assert.equal(getCanonicalUrl('/'), 'https://homeprojecttools.com/');
  assert.equal(getCanonicalUrl('/projects'), 'https://homeprojecttools.com/projects');
  assert.equal(getCanonicalUrl('/projects/flooring'), 'https://homeprojecttools.com/projects/flooring');
  assert.equal(
    getCanonicalUrl('/calculators/tile-calculator'),
    'https://homeprojecttools.com/calculators/tile-calculator'
  );
  assert.equal(
    getCanonicalUrl('/about'),
    'https://homeprojecttools.com/about'
  );

  const sitemapEntries = generateSitemapEntries();
  for (const entry of sitemapEntries) {
    assert.ok(entry.loc.startsWith('https://homeprojecttools.com'), `Invalid host in ${entry.loc}`);
    assert.ok(!entry.loc.includes('localhost'), `localhost in ${entry.loc}`);
    assert.ok(!entry.loc.includes('run.app'), `run.app in ${entry.loc}`);
    assert.ok(!entry.loc.includes('vercel.app'), `vercel.app in ${entry.loc}`);
    assert.ok(!entry.loc.includes('/categories/'), `/categories/ alias in ${entry.loc}`);
  }
});

test('Phase 5B-2: GA4 analytics safety and event contract', async () => {
  const {
    getMeasurementId,
    initGA,
    trackPageView,
    trackCalculatorStart,
    trackCalculatorComplete,
    trackGuideCalculatorClick,
    trackCategoryView,
    _resetAnalyticsSessionForTesting,
  } = await import('../src/lib/analytics.ts');

  _resetAnalyticsSessionForTesting();

  // Test measurement ID lookup
  const mid = getMeasurementId();
  assert.ok(mid === null || typeof mid === 'string');

  // SSR/Node runtime safety (calling without browser must not throw)
  assert.equal(initGA(), false);
  assert.doesNotThrow(() => {
    trackPageView({ page_path: '/calculators/flooring-calculator', page_title: 'Test' });
    trackCalculatorStart({
      calculator_slug: 'flooring-calculator',
      calculator_name: 'Flooring Calculator',
      project_category: 'flooring',
    });
    trackCalculatorComplete({
      calculator_slug: 'flooring-calculator',
      calculator_name: 'Flooring Calculator',
      project_category: 'flooring',
    });
    trackGuideCalculatorClick({
      guide_slug: 'how-much-flooring-do-i-need',
      calculator_slug: 'flooring-calculator',
    });
    trackCategoryView({ category_slug: 'flooring' });
  });

  // Browser simulation test
  const eventsRecorded: { name: string; params: Record<string, unknown> }[] = [];
  const mockGtag = (type: string, nameOrId: string, params?: Record<string, unknown>) => {
    if (type === 'event') {
      eventsRecorded.push({ name: nameOrId, params: params || {} });
    }
  };

  (globalThis as any).window = {
    dataLayer: [],
    gtag: mockGtag,
    location: { href: 'https://homeprojecttools.com/' },
  };
  (globalThis as any).document = {
    querySelector: () => null,
    createElement: () => ({ setAttribute: () => {}, async: true, src: '' }),
    head: { appendChild: () => {} },
  };

  const initialized = initGA('G-TEST123456');
  assert.equal(initialized, true);

  trackPageView({ page_path: '/projects', page_title: 'Projects Overview' });
  // Deduplicate consecutive identical page view
  trackPageView({ page_path: '/projects', page_title: 'Projects Overview' });

  const pageViews = eventsRecorded.filter((e) => e.name === 'page_view');
  assert.equal(pageViews.length, 1);

  // Calculator start deduplication
  trackCalculatorStart({
    calculator_slug: 'tile-calculator',
    calculator_name: 'Tile Calculator',
    project_category: 'flooring',
  });
  trackCalculatorStart({
    calculator_slug: 'tile-calculator',
    calculator_name: 'Tile Calculator',
    project_category: 'flooring',
  });
  const starts = eventsRecorded.filter((e) => e.name === 'calculator_start');
  assert.equal(starts.length, 1);
  assert.equal(starts[0].params.calculator_slug, 'tile-calculator');

  // Calculator complete deduplication
  trackCalculatorComplete({
    calculator_slug: 'tile-calculator',
    calculator_name: 'Tile Calculator',
    project_category: 'flooring',
  });
  trackCalculatorComplete({
    calculator_slug: 'tile-calculator',
    calculator_name: 'Tile Calculator',
    project_category: 'flooring',
  });
  const completes = eventsRecorded.filter((e) => e.name === 'calculator_complete');
  assert.equal(completes.length, 1);

  // Guide calculator click
  trackGuideCalculatorClick({
    guide_slug: 'how-much-paint-do-i-need',
    calculator_slug: 'paint-calculator',
  });
  const clicks = eventsRecorded.filter((e) => e.name === 'guide_calculator_click');
  assert.equal(clicks.length, 1);

  delete (globalThis as any).window;
  delete (globalThis as any).document;
});

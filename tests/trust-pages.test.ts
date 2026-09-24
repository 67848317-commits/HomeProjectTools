import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateSitemapEntries } from '../scripts/generate-sitemap.ts';
import { CALCULATORS } from '../src/data/calculators.ts';
import { CATEGORIES } from '../src/data/categories.ts';
import { GUIDES } from '../src/data/guides.ts';
import { SITE_CONFIG } from '../src/data/siteConfig.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('Phase 5A: Content inventory baseline remains intact', () => {
  assert.equal(Object.keys(CALCULATORS).length, 15, 'Must have exactly 15 calculators');
  assert.equal(Object.keys(GUIDES).length, 15, 'Must have exactly 15 companion guides');
  assert.equal(Object.keys(CATEGORIES).length, 7, 'Must have exactly 7 canonical category hubs');
});

test('Phase 5A: Sitemap contains exactly 44 canonical URLs', () => {
  const entries = generateSitemapEntries();
  assert.equal(entries.length, 44, 'Sitemap must contain exactly 44 canonical URLs');

  const locs = entries.map(e => e.loc);
  assert.equal(new Set(locs).size, 44, 'All 44 sitemap URLs must be unique');

  // Verify all URLs use production domain
  for (const loc of locs) {
    assert.ok(
      loc.startsWith(SITE_CONFIG.productionUrl),
      `URL '${loc}' does not use production domain '${SITE_CONFIG.productionUrl}'`
    );
    assert.ok(!loc.includes('localhost'), `URL '${loc}' contains localhost`);
    assert.ok(!loc.includes('run.app'), `URL '${loc}' contains run.app`);
    assert.ok(!loc.includes('vercel.app'), `URL '${loc}' contains vercel.app`);
    assert.ok(!loc.includes('/categories/'), `URL '${loc}' contains alias /categories/`);
  }

  // Verify the 5 Phase 5A trust pages exist in sitemap
  const expectedTrustPaths = ['/about', '/methodology', '/contact', '/privacy', '/terms'];
  for (const p of expectedTrustPaths) {
    const canonical = `${SITE_CONFIG.productionUrl}${p}`;
    assert.ok(locs.includes(canonical), `Missing trust page '${canonical}' in sitemap`);
  }
});

test('Phase 5A: robots.txt contains proper production directives', () => {
  const robotsPath = path.resolve(rootDir, 'public', 'robots.txt');
  assert.ok(fs.existsSync(robotsPath), 'public/robots.txt must exist');

  const robotsContent = fs.readFileSync(robotsPath, 'utf8');
  assert.ok(robotsContent.includes('User-agent: *'), 'Must contain User-agent: *');
  assert.ok(robotsContent.includes('Allow: /'), 'Must contain Allow: /');
  assert.ok(
    robotsContent.includes('Sitemap: https://homeprojectplanner.org/sitemap.xml'),
    'Must specify canonical sitemap'
  );
  assert.ok(!robotsContent.includes('localhost'), 'Must not contain localhost');
  assert.ok(!robotsContent.includes('run.app'), 'Must not contain run.app');
});

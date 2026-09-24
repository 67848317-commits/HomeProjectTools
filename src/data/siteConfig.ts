/**
 * Centralized Site Configuration & Technical SEO Settings
 */

export const SITE_CONFIG = {
  siteName: 'Home Project Tools',
  tagline: 'Home Improvement Planning & Cost Estimation',
  defaultDescription:
    'Home Project Tools helps homeowners and DIYers estimate materials, quantities, packaging, and planning costs before buying. Measure your space and calculate shopping lists.',
  // Isolated production site URL (no temporary preview or run.app URLs)
  productionUrl: 'https://homeprojecttools.com',
  organization: {
    '@type': 'Organization',
    name: 'Home Project Tools',
    url: 'https://homeprojecttools.com',
  },
  editorialTeam: {
    '@type': 'Organization',
    name: 'Home Project Tools Editorial Team',
    url: 'https://homeprojecttools.com',
  },
};

/**
 * Returns an absolute canonical URL for any route path.
 * Guarantees no trailing slashes on sub-routes, and always uses the production URL.
 */
export function getCanonicalUrl(path: string): string {
  const cleanPath = path.split('#')[0].split('?')[0].replace(/\/$/, '') || '';
  const base = SITE_CONFIG.productionUrl.replace(/\/$/, '');
  return `${base}${cleanPath || '/'}`;
}

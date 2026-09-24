# Phase 6A.5 Production Domain Migration & Trust Copy Report

**Brand:** Home Project Planner  
**Production Domain:** `https://homeprojectplanner.org`  
**Previous Placeholder Domain:** `https://homeprojecttools.com`  
**Date:** February 2026  
**Status:** Completed & Verified  

---

## 1. Summary of Migration Actions

1. **Centralized Configuration (`src/data/siteConfig.ts`):**
   - Updated `productionUrl` to `https://homeprojectplanner.org`.
   - Updated `siteName` to `Home Project Planner`.
   - Updated structured data organization and publisher URLs to `https://homeprojectplanner.org`.
   - Maintained single source of truth for canonical URL generation (`getCanonicalUrl`).

2. **Static Entry & Metadata (`index.html`):**
   - Updated `<title>` to `Home Project Planner | Home Improvement Planning & Cost Estimation`.
   - Updated canonical link to `<link rel="canonical" href="https://homeprojectplanner.org/" />`.
   - Updated Open Graph metadata: `og:title` and `og:url` to `https://homeprojectplanner.org/`.

3. **Crawl & Index Directives (`public/robots.txt` & `public/sitemap.xml`):**
   - Updated `public/robots.txt` directive to `Sitemap: https://homeprojectplanner.org/sitemap.xml`.
   - Regenerated `public/sitemap.xml` with all 44 canonical URLs under `https://homeprojectplanner.org`.
   - Zero staging, preview, localhost, or old domain references remain in sitemap or robots directives.

4. **Dynamic Metadata & SEO Injection (`src/App.tsx`):**
   - Dynamic canonical links, Open Graph tags, and Schema.org JSON-LD (WebSite, WebPage, AboutPage, ContactPage, Organization, BreadcrumbList, TechArticle) resolve via `SITE_CONFIG.productionUrl` and `getCanonicalUrl`.
   - Trust page meta descriptions and titles updated to reference "Home Project Planner".

5. **Site Branding & Navigation Components (`src/components/common/`):**
   - `Header.tsx`: Brand title updated to "Home Project Planner".
   - `Footer.tsx`: Brand text and copyright notice updated to "Home Project Planner".

6. **Trust & Informational Pages (`src/pages/`):**
   - `ContactPage.tsx`: Removed unverified email address (`editorial@homeprojecttools.com`) and removed unsupported 2-business-day response time claims. Replaced with clear feedback channels and bug reporting instructions.
   - `AboutPage.tsx`: Updated brand references to Home Project Planner; maintained transparent, non-authoritative planning mission without claiming nonprofit status.
   - `MethodologyPage.tsx`: Updated brand references and editorial citations.
   - `PrivacyPage.tsx`: Updated brand references and reaffirmed client-side execution, no personal account requirements, and zero cross-site ad cookies.
   - `TermsPage.tsx`: Updated brand references and disclaimers.
   - `HomePage.tsx`: Updated pricing transparency reference to Home Project Planner.

7. **Test Suites & Verification:**
   - Updated `tests/seo-polish.test.ts` and `tests/trust-pages.test.ts` to assert against `https://homeprojectplanner.org` and "Home Project Planner".
   - Full test suite passing (94/94 tests).
   - TypeScript checking passed (`tsc --noEmit`).
   - Production build verified (`npm run build`).
   - Inspected `dist/` artifacts to ensure zero occurrences of `homeprojecttools.com` in production bundles.

---

## 2. Canonical Inventory Verification (44 URLs)

| Section | Count | Sample Canonical URL |
| :--- | :--- | :--- |
| **Homepage** | 1 | `https://homeprojectplanner.org/` |
| **Projects Overview** | 1 | `https://homeprojectplanner.org/projects` |
| **Category Hubs** | 7 | `https://homeprojectplanner.org/projects/flooring` |
| **Calculators** | 15 | `https://homeprojectplanner.org/calculators/flooring-calculator` |
| **Companion Guides** | 15 | `https://homeprojectplanner.org/guides/how-to-calculate-flooring-material` |
| **Trust Pages** | 5 | `https://homeprojectplanner.org/about`<br>`https://homeprojectplanner.org/methodology`<br>`https://homeprojectplanner.org/contact`<br>`https://homeprojectplanner.org/privacy`<br>`https://homeprojectplanner.org/terms` |
| **Total** | **44** | All verified with status 200 equivalent canonical URLs. |

# Final Cleanup & Pre-Production Audit Report

**Product:** Home Project Planner (`homeprojectplanner.org`)  
**Audit Date:** September 28, 2026  
**Auditor:** Senior Software Engineer & Release Engineer  
**Status:** Pre-Production Audit & Cleanup Pass  

---

## 1. Current Architecture

The production implementation is a modern, high-performance static/client-side Single Page Application (SPA):
* **Core Framework:** React 19 (`react` 19.0.1, `react-dom` 19.0.1)
* **Build System & Tooling:** Vite 8 (`vite` 8.3.0, `@vitejs/plugin-react` 6.1.1, `typescript` 7.0.2)
* **Styling:** Tailwind CSS v4 (`@tailwindcss/vite` 4.3.3)
* **Icons:** Lucide React (`lucide-react` 0.546.0)
* **Runtime Routing:** Custom client-side router (`src/App.tsx`) leveraging the HTML5 History API (`popstate`, `pushState`, `replaceState`)
* **Production Deployment:** Static distribution (`dist/`) deployed on Vercel with edge routing (`vercel.json`)
* **Execution Paradigm:** 100% client-side calculation engines; all user measurements, waste calculations, packaging conversions, and cost estimates run in browser memory without server persistence or external database round-trips.

---

## 2. Current Route Structure

The application serves exactly **44 canonical public routes**, organized into six functional hierarchies:

### A. Homepage (1 route)
* `/` — Main landing page featuring interactive tool directory, recent guides, and project planning overview.

### B. Projects Overview Hub (1 route)
* `/projects` — Comprehensive category overview and project planning portal.

### C. Category Hubs (7 routes)
* `/projects/flooring` — Flooring materials & installation planning
* `/projects/tile` — Tile, mortar, and grout planning
* `/projects/painting` — Interior/exterior painting & coverage
* `/projects/concrete-masonry` — Slabs, post footings, and masonry
* `/projects/landscaping` — Mulch, topsoil, gravel, and sod
* `/projects/drywall` — Drywall panels, joint compound, and fasteners
* `/projects/framing-decking` — Decks, fencing, and structural timber

*(Note: Legacy `/categories/:slug` URLs are permanently redirected to `/projects/:slug` at both server and client levels).*

### D. Calculators (15 interactive tools)
1. `/calculators/flooring-calculator` — Flooring material, waste allowance, and carton estimator
2. `/calculators/tile-calculator` — Tile count, carton count, mortar bags, and grout requirements
3. `/calculators/paint-calculator` — Wall/ceiling net surface area, coat multiplier, and gallon requirements
4. `/calculators/concrete-slab-calculator` — Cubic yards, 60-lb/80-lb pre-mix bag counts, and gravel subbase
5. `/calculators/concrete-post-hole-calculator` — Hole cylinder volume, post displacement, and concrete bag count
6. `/calculators/mulch-calculator` — Cubic yards, bulk purchase, and 2 cu ft/3 cu ft bag requirements
7. `/calculators/gravel-calculator` — Cubic yards, bulk tons, and 50-lb bag calculations
8. `/calculators/sod-calculator` — Lawn area, 500 sq ft commercial pallets, and 10 sq ft rolls
9. `/calculators/drywall-calculator` — 4x8 and 4x12 sheets, joint tape rolls, screws, and compound buckets
10. `/calculators/deck-material-calculator` — Decking surface boards, joists, beams, and structural hardware
11. `/calculators/fence-material-calculator` — Line/corner posts, horizontal rails, vertical pickets, and fasteners
12. `/calculators/roofing-calculator` — Roof pitch multiplier, roofing squares, and bundle counts
13. `/calculators/paver-patio-calculator` — Paver units, bedding sand bags, and crushed stone base tonnage
14. `/calculators/topsoil-calculator` — Soil bed volume, organic settling allowance, and bulk tons
15. `/calculators/baseboard-trim-calculator` — Perimeter lineal footage, doorway deductions, and stock stick lengths

*(Note: Legacy `/calculators/flooring` redirects permanently to `/calculators/flooring-calculator`).*

### E. Practical Project Guides (15 editorial guides)
1. `/guides/how-to-calculate-flooring-material`
2. `/guides/how-much-paint-do-i-need`
3. `/guides/how-to-calculate-mulch`
4. `/guides/how-much-tile-do-i-need`
5. `/guides/how-much-concrete-for-a-slab`
6. `/guides/how-much-concrete-do-i-need-for-fence-posts`
7. `/guides/how-much-gravel-do-i-need`
8. `/guides/how-much-sod-do-i-need`
9. `/guides/how-many-sheets-of-drywall-do-i-need`
10. `/guides/how-to-calculate-deck-materials`
11. `/guides/how-to-calculate-fence-materials`
12. `/guides/how-many-roofing-squares-do-i-need`
13. `/guides/how-many-pavers-do-i-need`
14. `/guides/how-much-topsoil-do-i-need`
15. `/guides/how-much-baseboard-do-i-need`

### F. Foundation & Trust Pages (5 routes)
1. `/about` — Editorial mission, founding principles, and team overview
2. `/methodology` — Formula governance, industry standards (ASTM, TCNA, IRC), and price ranges
3. `/contact` — Feedback channel, formula inquiries, and editorial corrections
4. `/privacy` — Privacy policy, client-side data safety, and aggregate GA4 analytics disclosure
5. `/terms` — Terms of use, informational planning disclaimers, and limitation of liability

### G. Application-Level 404 Handler
* Any unmatched route renders `<NotFoundPage>`, which delivers a helpful error state, navigation buttons, and popular links while issuing a `noindex, nofollow` robots directive.

---

## 3. Calculator Count

* **Active Declarative Calculators:** Exactly **15** registered in `src/data/calculators.ts`.
* **Active Calculator Pages:** Exactly **15** dedicated page components in `src/pages/`.
* **Engine Modules:** 15 dedicated pure mathematical calculation modules in `src/scripts/calculators/` enforcing a strict 3-stage estimation pipeline (Net Area -> Allowance/Scrap -> Commercial Unit Packaging).

---

## 4. Guide Count

* **Active Editorial Guides:** Exactly **15** registered in `src/data/guides.ts` (combining pilot guides, `guides-phase4b2b.ts`, and `guides-phase4b2d.ts`).
* **Active Guide Renderer:** Dynamic `src/pages/GuidePage.tsx` supporting full structured content, measurement checklists, mathematical examples, buying guides, and interactive FAQ accordions.

---

## 5. Sitemap URL Count

* **Canonical Sitemap File:** `public/sitemap.xml` (copied to `dist/sitemap.xml` upon build).
* **Total Canonical URLs:** Exactly **44**.
* **URL Inventory Breakdown:**
  * 1 Homepage
  * 1 Projects Overview
  * 7 Category Hubs
  * 15 Calculators
  * 15 Guides
  * 5 Trust Pages
* **Exclusions:** No category aliases (`/categories/*`), no legacy redirects (`/calculators/flooring`), no preview/development environments, and no local test endpoints.

---

## 6. Existing Redirect Configuration

* **Vercel Edge Redirects (`vercel.json`):**
  * `/categories/:slug` -> `/projects/:slug` (301 Permanent Redirect)
  * `/calculators/flooring` -> `/calculators/flooring-calculator` (301 Permanent Redirect)
* **Vercel Edge Rewrites (`vercel.json`):**
  * `/(.*)` -> `/index.html` (preserves all static asset requests such as `/sitemap.xml`, `/robots.txt`, and assets; rewrites all application deep-links to the React SPA entry point)
* **Client-Side History Interceptors (`src/App.tsx`):**
  * Intercepts `/categories/:slug` and replaces history with `/projects/:slug`
  * Intercepts `/calculators/flooring` and replaces history with `/calculators/flooring-calculator`

---

## 7. Existing SEO Implementation

* **Dynamic Document Metadata (`src/App.tsx`):**
  * Page-specific `<title>` adhering to strict non-duplicative brand guidelines (`Page Name | Home Project Planner`)
  * Unique `<meta name="description">` per route
  * Canonical `<link rel="canonical">` locked to `https://homeprojectplanner.org`
  * OpenGraph meta tags (`og:title`, `og:description`, `og:url`, `og:type`)
* **Structured Data (JSON-LD `@graph`):**
  * `Organization` & `WebSite` schema on homepage
  * `WebApplication` / `SoftwareApplication` schema on all 15 calculators
  * `Article` schema with author, publisher, and dates on all 15 guides
  * `CollectionPage` schema on category hubs
  * `BreadcrumbList` schema across all subpages
  * `FAQPage` schema on guides containing structured Q&As
* **Robots Configuration (`public/robots.txt`):**
  * `User-agent: *`
  * `Allow: /`
  * `Sitemap: https://homeprojectplanner.org/sitemap.xml`
  * Dynamic `noindex, nofollow` injection for 404 pages.

---

## 8. Existing Analytics Implementation

* **Framework:** Google Analytics 4 (GA4) implemented via `src/lib/analytics.ts`.
* **Initialization:** Safely guarded against SSR/Node/test execution; loaded asynchronously when `PUBLIC_GA4_MEASUREMENT_ID` is present.
* **Privacy-First Telemetry Contract:**
  * Only low-cardinality metadata is tracked: `page_view`, `calculator_start`, `calculator_complete`, `guide_calculator_click`, and `category_view`.
  * **Strict Data Isolation:** Calculator inputs (room dimensions, square footage, slab thickness) and custom price entries are processed purely in client-side memory and **never transmitted** to Google Analytics or any server.

---

## 9. Existing Test Structure

The test suite runs on the native Node.js test runner (`node:test`) with TypeScript execution (`tsx`):
* `tests/calculators.test.ts` — Tests core mathematical calculation engines
* `tests/edge-cases.test.ts` — Tests mathematical boundary cases, zero inputs, and negative constraints
* `tests/golden.test.ts` — Verifies baseline calculation results against contractor benchmark worksheets
* `tests/guides.test.ts` — Validates guide data integrity, slug parity, and structured metadata
* `tests/math-utils.test.ts` — Validates fundamental rounding, conversion, and volume utilities
* `tests/phase-3a-calculators.test.ts` — Phase 3A calculation test suites
* `tests/phase-3b-calculators.test.ts` — Phase 3B calculation test suites
* `tests/phase-3c-calculators.test.ts` — Phase 3C calculation test suites
* `tests/routing.test.ts` — Validates SPA routing, `vercel.json` rewrites/redirects, static assets, and HTTP responses
* `tests/seo-polish.test.ts` — Validates SEO canonical URLs, meta tags, and GA4 event contracts
* `tests/trust-pages.test.ts` — Validates 5 trust pages, content baseline, and robots.txt directives
* **Total Automated Assertions:** 98 tests, all passing with zero errors.

---

## 10. Discrepancies Between Historical Documentation & Implementation

* **Architecture Evolution:** Early historical documentation (`docs/PHASE_1_PRODUCT_ARCHITECTURE.md`) referenced an initial proposal of Astro 5 with 18 planned guides and preliminary working domain `homeprojecttools.com`.
* **Production Decision:** The project was deliberately built as a React 19 + Vite 8 SPA. This decision ensures instant, stateful calculation reactions, real-time packaging adjustments without full-page reloads, and robust client-side testability.
* **Domain Finalization:** The production domain was officially established as `https://homeprojectplanner.org` during Phase 6A.5.
* **Historical References:** Any residual references to Astro 5 or `homeprojecttools.com` in older markdown files reflect historical planning artifacts and do not indicate missing features or an architectural gap.

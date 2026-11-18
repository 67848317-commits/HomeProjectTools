# Phase 2A — Editorial Trust Audit & Phased Implementation Roadmap

**Domain:** `https://homeprojectplanner.org/`  
**Architecture:** React 19 + Vite 8 + TypeScript + Tailwind CSS v4 SPA (44 canonical public routes)  
**Scope:** Audit and planning only. Zero changes were made to application code (`src/`), metadata (`index.html`, `public/`), tests (`tests/`), or build artifacts (`dist/`).  
**Companion Phase 2A Deliverables:**
1. `docs/PHASE_2A_TECHNICAL_SOURCE_REGISTRY.md`
2. `docs/PHASE_2A_PRICE_BENCHMARK_AUDIT.md`
3. `docs/PHASE_2A_GUIDE_IMPROVEMENT_MATRIX.md`
4. `docs/PHASE_2A_CALCULATOR_VALUE_AUDIT.md`
5. `docs/PHASE_2A_IMPLEMENTATION_ROADMAP.md` *(this document)*

---

## Executive Summary

Across all 15 calculators, 15 calculation engines, 15 guides, 7 category hubs, 29 price benchmarks, and 5 trust/legal pages, the platform already has a clean visual structure and three-stage estimating architecture (`Net Geometry -> Planning Allowance -> Commercial Packaging`). However, this Phase 2A audit identified **critical trust contradictions, brand inconsistencies, silent calculation/BOM parity bugs, and unverified empirical assumptions** that directly weaken user trust and Google AdSense quality readiness ("Low Value Content" and policy compliance risks):

1. **P0 Legal & AdSense Policy Contradiction (`src/pages/PrivacyPage.tsx`):** The live app deploys Google AdSense (`ca-pub-1850854173653124` in `index.html`, `src/App.tsx`, `src/components/common/AdSenseUnit.tsx`, and `public/ads.txt`), yet `PrivacyPage.tsx` explicitly states that the site *"does not use advertising cookies"* and *"does not participate in third-party advertising networks (such as Google AdSense)."*
2. **Split Brand Identity (`Home Project Planner` vs. `Home Project Tools`):** Core metadata and legal pages use **Home Project Planner**, while `Header.tsx`, `Footer.tsx`, `HomePage.tsx`, `MethodologyPage.tsx`, and `GuidePage.tsx` display **Home Project Tools**.
3. **Methodology & Guide Overclaims:** `MethodologyPage.tsx`, `GuidePage.tsx`, `CostEstimateCard.tsx`, `AssumptionsList.tsx`, `CategoryHubPage.tsx`, `PaverPatioCalculatorPage.tsx`, and `HomePage.tsx` contain factual mismatches against the actual TypeScript engines (e.g., claiming gravel density is user-adjustable, claiming `"local benchmark pricing"`, referencing unverified `"ICPI Certified"` phrasing, advertising unbuilt `"5-gallon pail comparison"`, and showing hardcoded homepage showcase numbers that differ from `deckMaterial.ts` and `mulch.ts`).
4. **High-Severity Engine/UI Parity Bugs:** Documented in `PHASE_2A_CALCULATOR_VALUE_AUDIT.md`, including a dead `groutJointWidthInches` input in `tile.ts`, net-area pricing on `paverPatio.ts` (ignoring waste), BOM/cost mismatch in `DrywallCalculatorPage.tsx` vs. `drywall.ts`, square-based vs. bundle-based pricing in `roofing.ts`, non-existent BOM price IDs (`framing-joist-lumber`, `deck-fasteners-box`) + labor scope mismatch in `deckMaterial.ts`/`DeckMaterialCalculatorPage.tsx`, and unscaled fence posts/rails/pickets + concrete bag yield mismatch (`50-lb` vs. `80-lb`) in `fenceMaterial.ts`.
5. **Guide Discoverability & Contact Dead-End:** `HomePage.tsx` has a `"Browse All 15 Guides"` button pointing to `/projects` (`ProjectsOverviewPage.tsx`), which currently renders zero guide links. Meanwhile, `ContactPage.tsx` references *"public code repository issues"* without any clickable link, email address, or feedback form.

---

## Part A — Editorial, Brand, Legal & Trust Architecture Audit (Task 5)

### A1. CRITICAL: Privacy Policy vs. Live Google AdSense Contradiction (`P0`)

**Verified Repository Evidence:**
- **Active AdSense Integration:**
  - `index.html:16–17` — `<meta name="google-adsense-account" content="ca-pub-1850854173653124" />` and `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1850854173653124" crossorigin="anonymous"></script>`.
  - `src/App.tsx:261, 341–349` — sets `google-adsense-account` meta and calls `(window.adsbygoogle || []).push({})` on route changes.
  - `src/components/common/AdSenseUnit.tsx` — active `<ins className="adsbygoogle" data-ad-client="ca-pub-1850854173653124" ... />` component.
  - `public/ads.txt` — declares `google.com, pub-1850854173653124, DIRECT, f08c47fec0942fa0`.
- **Contradicting Claims in `src/pages/PrivacyPage.tsx`:**
  - `PrivacyPage.tsx:47` (Summary Box): *"...we do not use advertising cookies or cross-site behavioral profiling networks..."*
  - `PrivacyPage.tsx:86` (Section 2, Advertising Cookies): *"We do not use third-party advertising cookies, retargeting pixels, or commercial ad network scripts."*
  - `PrivacyPage.tsx:89` (Section 2, Behavioral Advertising): *"We do not engage in behavioral profiling, interest-based user targeting..."*
  - `PrivacyPage.tsx:143` (Section 4, Third-Party Links & External Services): *"We do not participate in third-party advertising networks (such as Google AdSense) or affiliate tracking networks."*

**Impact:** Direct factual contradiction visible to human reviewers, automated AdSense compliance checks, and privacy regulators. Maintaining an explicit statement denying Google AdSense while serving `adsbygoogle.js` and `ads.txt` is an immediate trust and policy blocker.

#### Conservative Replacement Copy Proposal (`src/pages/PrivacyPage.tsx`)
*(Preserves existing GA4 and client-side computation disclosures while accurately disclosing Google AdSense without inventing fake consent vendor URLs or unimplemented CMP tools; update effective/last-reviewed dates upon actual Phase 2B publish.)*

- **Replace `PrivacyPage.tsx:45–50` (Summary Box):**
  > Home Project Planner is an open, client-side informational planning resource. We do not require user accounts, and we do not store your room dimensions or custom project inputs on our servers. All calculations execute directly in your browser. We use Google Analytics 4 for aggregate site traffic measurement and Google AdSense to display advertising that supports free access to our tools.

- **Replace `PrivacyPage.tsx:85–93` (Section 2 bullets):**
  > - **Advertising Partners (Google AdSense):** We use Google AdSense to display advertisements. Third-party vendors, including Google, may use cookies or device identifiers to serve ads based on a user's prior visits to this website or other websites. You can learn how Google uses data when you use our site or adjust personalized advertising preferences through Google's Ad Settings (`https://adssettings.google.com`) or opt out of third-party vendor cookie use via the Network Advertising Initiative (`https://optout.networkadvertising.org/`). *(Verify exact outbound URL formatting before release.)*
  > - **No First-Party Project Tracking:** We do not capture, profile, or sell your entered calculator measurements, room dimensions, or custom material budgets for advertising targeting.
  > - **No Social Retargeting Pixels:** We do not deploy third-party social media retargeting pixels (such as Meta Pixel) or session-replay keystroke loggers.

- **Replace `PrivacyPage.tsx:142–144` (Section 4):**
  > This website displays advertising served through Google AdSense and links to external reference materials for informational context. Advertising partners may use cookies in accordance with their own privacy policies to deliver and measure ad performance. We do not participate in retail affiliate commission links inside calculator BOM outputs. *(Confirm and maintain `no affiliate links` status before publishing.)*

---

### A2. Brand Identity Split (`Home Project Planner` vs. `Home Project Tools`) (`P0`)

**Canonical Brand Evidence:** `SITE_CONFIG` (`src/data/siteConfig.ts`), `index.html:7, 11`, `public/manifest` / metadata, `AboutPage.tsx`, `PrivacyPage.tsx`, `TermsPage.tsx`, `ContactPage.tsx`, and the user prompt all identify the official brand as **Home Project Planner** (`https://homeprojectplanner.org/`).

**Verified Drift Locations (Legacy Name `Home Project Tools`):**
1. `src/components/common/Header.tsx:53` (`aria-label="Home Project Tools Homepage"`) and `Header.tsx:59` (visible header wordmark `Home Project Tools`).
2. `src/components/common/Footer.tsx:81` (brand heading `Home Project Tools`) and `Footer.tsx:236` (`© {year} Home Project Tools. For planning and estimating purposes only.`).
3. `src/pages/HomePage.tsx:1030` (*"Every calculator on Home Project Tools follows our strict three-stage estimating model."*).
4. `src/pages/MethodologyPage.tsx:65` (*"Home Project Tools enforces a strict, three-stage separation..."*).
5. `src/pages/GuidePage.tsx:207` (*"Every calculator on Home Project Tools follows this rigorous 3-stage model."*).
6. Internal developer file headers/comments (cleanup only, non-user-facing): `src/data/prices.ts:2`, `src/scripts/core/math-utils.ts:2`, `src/types/index.ts:2`.

#### Conservative Replacement Copy Proposal
- `Header.tsx:53, 59`: `Home Project Tools` → `Home Project Planner` (`aria-label="Home Project Planner Homepage"`).
- `Footer.tsx:81, 236`: `Home Project Tools` → `Home Project Planner`.
- `HomePage.tsx:1030`, `MethodologyPage.tsx:65`, `GuidePage.tsx:207`: `Home Project Tools` → `Home Project Planner`.

---

### A3. Methodology, Guide, Hub & UI Factual Overclaims / Mismatches (`P0` / `P1`)

| # | File & Exact Line | Current Claim / Text | Verified Code Reality | Priority | Conservative Replacement Copy / Action |
|---|---|---|---|---|---|
| 1 | `src/pages/MethodologyPage.tsx:103` | *"Organic Settling: 10% to 15% natural settling for shredded hardwood mulch and loose topsoil"* | `calculators.ts` sets `mulch` & `topsoil` waste options to `[0, 5]` (`min: 0, max: 15` / `[0, 5]` buttons) with **default `0%`**; `HomePage.tsx:183` shows `10%` | **P0** | Align **both** `calculators.ts`/`mulch.ts`/`topsoil.ts` presets (if keeping 0%/5%/10%/15%) **and** `MethodologyPage.tsx:103` so ranges and defaults match exact presets (`0% to 15% adjustable settling allowance depending on depth and material looseness`). |
| 2 | `src/pages/MethodologyPage.tsx:104` | *"Subgrade Slump Cushion: 5% to 10% safety buffer for uneven concrete subgrade excavation"* | `calculators.ts` concrete slab/post-hole waste options support `5%`, `10%`, `15%` | **P0** | Update to: `Subgrade & Spillage Buffer: 5% to 15% safety allowance (10% default) for uneven concrete subgrade, form deflection, and mixer chute waste.` |
| 3 | `src/pages/MethodologyPage.tsx:149–152` | *"Assumptions such as waste percentages, gravel bulk density (e.g. 1.35 tons/cu yd for pea gravel vs 1.40 tons for crushed stone)... are exposed as user-adjustable parameters."* | (a) `gravel.ts` uses `1.45` tons/yd³ for Pea Gravel (`1.40` Crushed Stone, `1.35` River Rock). (b) Density is **not** user-adjustable numerically—only selectable via 3 preset aggregate types. | **P0** | Replace lines 149–152: `Key parameters—including waste percentages, gravel aggregate type (1.40 tons/cu yd for crushed stone, 1.45 tons/cu yd for pea gravel, and 1.35 tons/cu yd for river rock, pending supplier weight verification), concrete bag weights (60-lb vs. 80-lb), and sod pallet coverage—are exposed through calculator controls. They are residential planning benchmarks, not guaranteed supplier weights.` |
| 4 | `src/pages/GuidePage.tsx:521` | *"...commercial carton/bag rounding, and **local benchmark pricing**."* | `prices.ts` stores national illustrative USD benchmarks, NOT localized/regional pricing feeds. | **P0** | Replace `local benchmark pricing` with `illustrative U.S. national material price benchmarks`. |
| 5 | `src/components/calculator/CostEstimateCard.tsx:111` | *"Prices are **regional planning benchmarks**, not real-time store shelf quotes."* | Contradicts `MethodologyPage.tsx:187` (*"national planning benchmarks"*) and `prices.ts` (single U.S. range per SKU, no ZIP/region selector). | **P0** | Replace `regional planning benchmarks` with `illustrative U.S. national planning benchmarks`. |
| 6 | `src/components/calculator/AssumptionsList.tsx:20` | *"Costs reflect US median retail shelf and trade indices, updated periodically for planning budgeting."* | Currently lacks empirical verification cadence or index citations (`UNVERIFIED`). | **P0 / P1** | P0 interim copy: `Costs reflect illustrative U.S. residential material and labor planning ranges intended for preliminary budgeting, not live store quotes.` Upgrade to cited verified source summary in P1 once `PriceBenchmark.provenance` is populated. |
| 7 | `src/pages/PaverPatioCalculatorPage.tsx:478` | `subtitle="ICPI Certified Installation Guidelines"` | ICPI merged with NCMA into Concrete Masonry & Hardscapes Association (CMHA); site does not hold an official ICPI certification or cite specific CMHA Tech Spec numbers (`UNVERIFIED`). | **P0** | Replace subtitle with: `Residential Interlocking Concrete Paver Base & Bedding Best Practices` (and add exact CMHA Tech Spec citations in P1 after verification). |
| 8 | `src/pages/CategoryHubPage.tsx:44` & `ProjectsOverviewPage.tsx:49` | `output: 'Whole 1-gallon cans, 5-gallon pail comparison, door & window deductions'` | `paint.ts` and `PaintCalculatorPage.tsx` currently only compute 1-gallon cans (no 5-gallon pail comparison exists). | **P0** | P0: Change copy to `'Whole 1-gallon cans, coat count scaling, and door & window deductions'`. Restore `'5-gallon pail comparison'` only after implementing 5-gal comparison in P1. |
| 9 | `src/pages/HomePage.tsx:183, 201, 204–207` | Mulch card shows `10%` buffer (`4.07 cu yds` / `55 bags`); Deck card shows `5/4x6 Pressure-Treated Pine` (`28 Surface Boards`) | (a) `mulch.ts` defaults to `0%` (max button `5%`); (b) `deckMaterial.ts` computes `29` boards for `16×12` at 16' stock length (`ceil(144 / 5.75) = 26` + 10% waste = `29`), and `prices.ts` prices `deck-board-composite-lf` (`$5.50/lf`), not pressure-treated pine (`~$1.10–$1.80/lf`). | **P0** | Once P0 engine fixes land (or immediately on HomePage showcase), verify every showcase card dynamically or mathematically against `mulch.ts` and `deckMaterial.ts` so `HomePage.tsx` never contradicts its own calculator outputs. |

---

### A4. Contact & Accountability Transparency (`src/pages/ContactPage.tsx`)

**Verified Issue (`ContactPage.tsx:59–69`):**
The `"Feedback & Issue Reporting"` box says errata are managed *"through our project deployment channels and public code repository issues,"* but provides **no clickable email address, no contact form, and no public repository URL**. A user wishing to report a calculation bug or privacy question has zero actionable way to contact the publisher—a recurring red flag during AdSense trust/E-E-A-T evaluations.

**Phase 2B Action & Conservative Copy Template:**
- **Required Owner Decision (Cannot Be Fabricated):** Site owner must supply either (a) a real monitored contact email (e.g., `editorial@homeprojectplanner.org` or `support@homeprojectplanner.org`), (b) a real verified form endpoint / Formspree / serverless feedback form, and/or (c) an actual public repository URL if open-sourced.
- **Proposed Replacement Block (`ContactPage.tsx:59–69`) once real channel is supplied:**
  > **Direct Editorial & Errata Contact**  
  > Email mathematical errata, packaging dimension updates, broken link reports, or privacy inquiries to **[OWNER-CONFIRMED EMAIL ADDRESS — DO NOT FABRICATE]**, or submit an issue through **[VERIFIED FORM OR REPOSITORY LINK IF APPLICABLE]**.  
  > *Response Target:* Substantive calculation and pricing benchmark reviews are typically evaluated within **[OWNER-CONFIRMED SLA, e.g., 5 business days]**. Please include the calculator URL, entered dimensions, and observed vs. expected output.

---

### A5. Guide Discoverability & Navigation Architecture

**Verified Issues:**
1. `Header.tsx:90` (`Guides` nav link) points to `#planning-guides` on `/`, which renders only **4 curated guides** (`HomePage.tsx:964`). If clicked from a subpage, `Header.tsx:34–38` attempts `onNavigate('/#planning-guides')` and `scrollIntoView`.
2. `HomePage.tsx:954–961` has a prominent **`Browse All 15 Guides`** button whose `onClick` navigates to `/projects` (`ProjectsOverviewPage.tsx`).
3. `ProjectsOverviewPage.tsx` currently renders only the **7 Category Cards** and **15 Calculators**—**zero guides are listed on `/projects`**. Users clicking `"Browse All 15 Guides"` cannot see all 15 guides in one place.

**Recommended Architectural Options (Respecting Existing Constraints):**
- **Option A (Recommended for P0 — Preserves Exact 44-Route Architecture):**
  - Add a dedicated **`#all-guides` ("Complete Directory of 15 Field Guides")** section to `ProjectsOverviewPage.tsx`, grouped by the 7 trade categories, displaying title, reading time, companion calculator link, and direct `/guides/:slug` CTA.
  - Update `HomePage.tsx:956` (`"Browse All 15 Guides"`) and add a `"View All 15 Guides"` link in `Header.tsx` / `Footer.tsx` pointing to `/projects#all-guides` (updating `App.tsx` scroll handling to scroll to hash fragments smoothly on route change).
  - **Advantage:** Zero changes to the 44-URL sitemap, canonical URLs, or Vercel/test route assertions while solving 100% of the dead-end UX.
- **Option B (Explicit Phase 2B Route Expansion — 45 Routes):**
  - Introduce a standalone `/guides` index page (`GuidesDirectoryPage.tsx`), update `src/App.tsx`, `scripts/generate-sitemap.ts`, `public/sitemap.xml`, and route verification tests. Only pursue if site owner explicitly authorizes changing the 44-URL baseline.

---

## Part B — Phased Implementation Roadmap (P0, P1, P2)

> **Cross-Reference Rule:** Detailed formulas and parameter tables live in `PHASE_2A_TECHNICAL_SOURCE_REGISTRY.md`; the proposed 10-field `PriceBenchmark.provenance` TypeScript schema and missing benchmark inventory live in `PHASE_2A_PRICE_BENCHMARK_AUDIT.md`; per-guide enhancement specs live in `PHASE_2A_GUIDE_IMPROVEMENT_MATRIX.md`; and per-calculator evaluations/bug line numbers live in `PHASE_2A_CALCULATOR_VALUE_AUDIT.md`.

### Priority Tier Definitions
- **P0 — Immediate Trust, Policy Compliance & High-Severity Parity Fixes:** Eliminates legal/AdSense policy contradictions, brand split, false methodology claims, broken guide discovery, and silent calculator/pricing bugs where UI controls do nothing or BOMs disagree with cost totals.
- **P1 — Primary Source Verification, Expanded Price Provenance & High-Value Upgrades:** Populates verified external standards/manufacturer TDS data (`UNVERIFIED` registry items), implements the 10-field `PriceBenchmark.provenance` schema + missing SKUs, adds the highest-ROI calculator features (#1–#5 from `PHASE_2A_CALCULATOR_VALUE_AUDIT.md`), and upgrades all 15 guides with product matrices, code/safety limits, and verified citations.
- **P2 — Secondary Feature Depth & Automated Regression Lock:** Adds multi-zone/helper enhancements (#6–#9) and automated guide-to-engine unit/E2E parity tests.

---

### Phase P0 — Immediate Trust, Compliance & Engine Parity Fixes

#### P0.1 — Reconcile Privacy Policy with Live Google AdSense & Unify Brand Identity
- **Target Files:** `src/pages/PrivacyPage.tsx`, `src/components/common/Header.tsx`, `src/components/common/Footer.tsx`, `src/pages/HomePage.tsx`, `src/pages/MethodologyPage.tsx`, `src/pages/GuidePage.tsx` (plus internal docblock cleanup in `src/data/prices.ts`, `src/scripts/core/math-utils.ts`, `src/types/index.ts`).
- **Change Rationale:** Removes direct legal/policy contradiction denying Google AdSense while serving `ca-pub-1850854173653124` and `ads.txt`; eliminates split branding between `Home Project Planner` and `Home Project Tools`.
- **User Benefit:** Honest, consistent privacy disclosures with clear opt-out guidance and a cohesive publisher identity across every page.
- **Required External Evidence / Data Needed:** Owner confirmation of AdSense consent/CMP posture (especially if serving EEA/UK traffic) and verification of external opt-out link targets (`adssettings.google.com`, `optout.networkadvertising.org`).
- **Dependencies:** None.
- **Acceptance Criteria:** Zero occurrences of `"Home Project Tools"` in user-facing UI/JSX; `PrivacyPage.tsx` accurately describes both GA4 and Google AdSense with no contradicting "we do not use advertising cookies / AdSense" clauses.

#### P0.2 — Fix Methodology, Hub, Card & Showcase Factual Mismatches + Restore Guide Directory Discovery
- **Target Files:** `src/pages/MethodologyPage.tsx`, `src/pages/GuidePage.tsx`, `src/components/calculator/CostEstimateCard.tsx`, `src/components/calculator/AssumptionsList.tsx`, `src/pages/PaverPatioCalculatorPage.tsx`, `src/pages/CategoryHubPage.tsx`, `src/pages/ProjectsOverviewPage.tsx`, `src/pages/HomePage.tsx`, `src/App.tsx` (hash-scroll support).
- **Change Rationale:** Fixes inaccurate copy (`1.35` vs `1.45` pea gravel density, false claim of user-adjustable gravel density, `"local"`/`"regional"` pricing claims, unsubstantiated `"ICPI Certified"` header, unbuilt `"5-gallon pail comparison"` blurb) and ensures `"Browse All 15 Guides"` on `/projects` actually lists all 15 guides.
- **User Benefit:** Editorial claims match interactive calculator behavior 1:1, and homeowners can browse all 15 guides from one directory.
- **Required External Evidence / Data Needed:** Owner decision on Option A (`/projects#all-guides`, keeps 44 routes) vs. Option B (new `/guides` route, 45 routes).
- **Dependencies:** P0.1 (brand wording).
- **Acceptance Criteria:** Every assumption cited on `MethodologyPage.tsx` and `HomePage.tsx` matches engine logic; clicking `"Browse All 15 Guides"` displays all 15 guides grouped by category.

#### P0.3 — Fix Silent Calculation & Pricing Parity Bugs Across 7 Engines/Pages
*(Addresses verified bugs detailed in `PHASE_2A_CALCULATOR_VALUE_AUDIT.md` Section 2 & `PHASE_2A_TECHNICAL_SOURCE_REGISTRY.md` Section 3.)*
- **Scope & Target Files:**
  1. **Tile (`src/scripts/calculators/tile.ts`, `src/pages/TileCalculatorPage.tsx`, `src/data/guides.ts`):** Wire `groutJointWidthInches` into grout volume calculation (currently dead state/ignored parameter) and align grout calculation between engine and guide (`1/8"` vs. `3/16"` worked example); fix mortar thin-set vs. square-foot coverage consistency.
  2. **Paver Patio (`src/scripts/calculators/paverPatio.ts`):** Fix `costEstimate` to price `paversWithWasteSqFt` (purchased pavers) instead of `netAreaSqFt`, and verify consistent unit quantities on sand/base BOM rows.
  3. **Drywall (`src/scripts/calculators/drywall.ts`, `src/pages/DrywallCalculatorPage.tsx`):** Move `4×8` vs. `4×12` sheet switching, tape roll counts, and screw quantities into `drywall.ts` so BOM and `costEstimate` stay 100% synchronized (removing the UI-only `1.5×`/`0.35×`/`0.65×` synthetic splits and flat `$25` `qty=1` kit placeholder), and cap `openingsSqFt` deduction safely (matching `paint.ts`'s `<= 60%` or `0`-clamped validation).
  4. **Roofing (`src/scripts/calculators/roofing.ts`, `src/pages/RoofingCalculatorPage.tsx`):** Price shingles by whole **purchased bundles (`totalBundles`)** rather than fractional `totalSquares`, and replace/label `roofing-felt-roll` accurately if `#30` felt vs. synthetic underlayment coverage differs (`200 sq ft` vs. `1,000 sq ft` roll mismatch in `HomePage.tsx`/`roofing.ts`).
  5. **Deck Material (`src/scripts/calculators/deckMaterial.ts`, `src/pages/DeckMaterialCalculatorPage.tsx`, `src/pages/HomePage.tsx`):** Resolve missing BOM price IDs (`'framing-joist-lumber'`, `'deck-fasteners-box'`), align board pricing choice (Pressure-Treated `5/4×6` vs. Composite) with explicit board-type selector, clarify turnkey structural labor vs. surface-board-only materials scope, and sync `HomePage.tsx` showcase (`29` vs. `28` boards).
  6. **Fence Material & Post Hole (`src/scripts/calculators/fenceMaterial.ts`, `src/scripts/calculators/concretePostHole.ts`):** Expose height (`6 ft` vs. `8 ft`), post spacing (`6 ft` vs. `8 ft`), and rails-per-bay (`2` vs. `3`) or align fence concrete bag size (`80-lb` vs. `50-lb`) with `concretePostHole.ts` / `prices.ts` so bag counts aren't hardcoded to `2` regardless of soil/height.
  7. **Sod & Mulch Thresholds (`src/scripts/calculators/sod.ts`, `src/pages/SodCalculatorPage.tsx`, `src/scripts/calculators/mulch.ts`, `src/pages/MulchCalculatorPage.tsx`, `src/data/calculators.ts`):** Pass dynamic `palletCoverageSqFt` into `sod.ts` cost calculation (remove hardcoded `450 sq ft` assumption in cost math) and unify `min` constraints (`350` vs. `400` vs. `200`). Unify Mulch bulk-vs.-bag crossover notice (`20` bags vs. `25` bags vs. `2 cu yds` vs. `3+ cu yds`) and `calculators.ts` settling preset options (`0/5/10/15%`).
- **Change Rationale:** Prevents users from entering real dimensions/options (like grout joint width, 4×12 drywall sheets, or custom sod pallet sizes) that are silently ignored in calculations or pricing.
- **User Benefit:** Trustworthy, consistent quantities and dollar budgets across UI inputs, BOM tables, and companion guides.
- **Required External Evidence / Data Needed:** Standard ANSI A118.6/A118.7 grout joint consumption formula check (`tile.ts` `UNVERIFIED` grout formula vs. manufacturer chart) and verified 50-lb vs. 80-lb fence concrete bag yields (`UNVERIFIED` in registry).
- **Dependencies:** Engine updates must include unit test updates in `tests/`.
- **Acceptance Criteria:** Changing every interactive input measurably updates the engine output and BOM/cost estimate cleanly; `npm run test`, `npm run lint`, and `npm run build` pass with zero regressions.

---

### Phase P1 — Technical Source Verification, Price Provenance & High-Value Substance Upgrades

#### P1.1 — External Technical Standards & Manufacturer TDS Verification Sprint
- **Target Files:** `docs/PHASE_2A_TECHNICAL_SOURCE_REGISTRY.md` (status promotion from `UNVERIFIED` to `VERIFIED` with exact archived citation dates/clauses), then propagated into `src/data/guides.ts` and `src/scripts/calculators/*.ts`.
- **Change Rationale:** Replaces inherited rule-of-thumb constants with documented manufacturer Technical Data Sheets (TDS) and industry standards so every assumption can be cited on-page.
- **User Benefit:** High E-E-A-T credibility ("Why this number?") backed by real ASTM, TCNA, CMHA, IRC, AWPA, GA, and manufacturer references.
- **Required External Evidence / Data Needed Before Implementation (`UNVERIFIED` Registry Items):**
  - **Tile & Flooring:** NWFA waste guidelines (`flooring`); TCNA *Handbook for Ceramic, Glass, and Stone Tile Installation* trowel notch-size vs. mortar coverage (`ft²/50-lb bag`) and ANSI A118.6/A118.7 grout yield table (`tile`); USG/millwork standard molding scrap allowance (`baseboardTrim`).
  - **Paint & Drywall:** Sherwin-Williams / Benjamin Moore TDS for interior acrylic (`350–400 sq ft/gal`), PVA primer (`300–400 sq ft/gal`), and flat ceiling paint (`paint`); Gypsum Association GA-216 / USG Sheetrock® Handbook & All-Purpose Joint Compound TDS (`gal per 100 sq ft` at Level 3/4/5 finish, tape LF, fastener spacing) (`drywall`).
  - **Concrete, Pavers & Masonry:** QUIKRETE® No. 1101 (80-lb = `0.60 cu ft`) & No. 1101/1102 (60-lb = `0.45 cu ft`, 50-lb fast-setting = `0.375 cu ft`) official yield sheets + ACI 302.1R/IRC Table R403.1 minimum footing/frost rules (`concreteSlab`, `concretePostHole`, `fenceMaterial`); CMHA (formerly ICPI) Tech Spec 2 / Tech Spec 9 for base depth, 6-inch perimeter extension, bedding sand (`1"`), and polymeric sand coverage (`paverPatio`).
  - **Landscaping:** Mulch & Soil Council (MSC) bag sizing (`2.0` and `3.0 cu ft`) and settling guidance; regional aggregate supplier bulk density sheets (`tons/cu yd` for crushed limestone #57, pea gravel, river rock) + compaction factor (`gravel`); Turfgrass Producers International (TPI) standard pallet/roll coverage (`sod`); bagged soil weights & moisture density (`topsoil`).
  - **Framing & Roofing:** American Wood Council (AWC) DCA 6 *Prescriptive Residential Wood Deck Construction Guide* (`deckMaterial`); IRC Section R905.2 & GAF Timberline® HDZ / Owens Corning Duration® bundle coverage (`33.3 sq ft/bundle`, 3 bundles/square), ridge cap bundles, starter strips, and #30 felt vs. synthetic underlayment roll yields (`roofing`).
- **Dependencies:** Must complete verification before publishing citations in guides or updating empirical defaults.
- **Acceptance Criteria:** Every non-geometric constant in `src/scripts/calculators/` has a verified citation record in the Technical Source Registry (no `UNVERIFIED` assumptions remaining in production engines).

#### P1.2 — Implement Expanded `PriceBenchmark.provenance` Schema & Sample Verified Retail Prices
- **Target Files:** `src/types/index.ts`, `src/data/prices.ts`, `src/components/calculator/CostEstimateCard.tsx`, `src/components/calculator/AssumptionsList.tsx`.
- **Change Rationale:** `prices.ts` currently holds 29 un-dated, un-sourced numbers (`lastUpdated: '2026-02'` only) and lacks 14 companion SKUs identified in `PHASE_2A_PRICE_BENCHMARK_AUDIT.md`. Upgrading to the 10-field `PriceBenchmark.provenance` schema makes pricing defensible, transparent, and honest.
- **User Benefit:** Users see exact specification notes, package sizes, sampling month/year, and clear separation between DIY material shelf ranges and national contractor labor guides.
- **Required External Evidence / Data Needed Before Implementation:**
  - Live U.S. national SKU sampling across 2+ national retailers (Home Depot, Lowe's, Menards, Ace, or regional bulk landscape yards) for all **29 existing IDs** plus **14 missing IDs**:
    - `flooring-laminate`, `paint-ceiling-flat-gallon`, `paint-primer-pva-gallon`, `drywall-sheet-4x12`, `drywall-tape-roll-500ft`, `drywall-screws-lb`, `deck-board-pt-lf`, `framing-joist-lumber`, `deck-fasteners-box`, `gravel-bag-50lb`, `mulch-bag-3cuft`, `topsoil-bag-1cuft`, `fence-post-4x4x10`, `fence-picket-8ft` (plus contractor labor basis sources: HomeAdvisor/Angi/RSMeans/Craftsman residential national guides with explicit sample quarter).
- **Dependencies:** P0.3 (BOM price ID alignment).
- **Acceptance Criteria:** All `PriceBenchmark` entries populate complete `provenance` metadata; `CostEstimateCard` surfaces sampling period and scope clarity without claiming "regional" or "live shelf" data.

#### P1.3 — High-Value Calculator Substance Upgrades (Ranks #1–#5 from `PHASE_2A_CALCULATOR_VALUE_AUDIT.md`)
- **Target Files & Workstreams:**
  1. **Tile Trowel & Grout Intelligence (`tile.ts`, `TileCalculatorPage.tsx`):** Dynamic notched-trowel coverage selector (`1/4"×1/4"` ≈ 60 sq ft, `1/4"×3/8"` ≈ 45 sq ft, `1/2"×1/2"` ≈ 35 sq ft/bag—pending P1.1 TCNA verification) + full grout joint-width & tile-thickness formula.
  2. **Paint 5-Gallon Pail Economics + Ceiling & Primer Mode (`paint.ts`, `PaintCalculatorPage.tsx`):** Side-by-side `1-gal` vs. `5-gal` bucket optimization (`5-gal` usually saves at `>= 4–5` gallons), dedicated ceiling `2-coat` toggle, and bare-drywall PVA primer gallon calculation.
  3. **Concrete Slab Ready-Mix & Short-Load Fee Warning (`concreteSlab.ts`, `ConcreteSlabCalculatorPage.tsx`):** Automatic threshold warning (`>= 1.5–2.0 cu yds`) comparing pre-mix pallet labor vs. ready-mix truck delivery + short-load fee disclosure (`< 3–4 cu yds`), plus optional wire mesh / rebar grid and gravel sub-base link/summary.
  4. **Deck Board Material Selector & Joist/Beam Framing Breakdown (`deckMaterial.ts`, `DeckMaterialCalculatorPage.tsx`):** Explicit `Pressure-Treated 5/4×6` vs. `Composite/PVC` toggle with matching pricing, `12"` vs. `16"` o.c. joist spacing selector, and clear separation of **Surface-Only Resurfacing** vs. **Full Structural Framing** BOM & labor.
  5. **Roofing Accessories & Underlayment Selector (`roofing.ts`, `RoofingCalculatorPage.tsx`):** Add starter-course strips, ridge-cap bundles (from ridge LF input), ice-and-water shield eave rolls, and `#30` felt vs. `1,000 sq ft` synthetic underlayment toggle + pitch-based safety/difficulty warning (`>= 7:12`).
- **Change Rationale:** Transforms single-number calculators into true project-planning worksheets that prevent costly mid-project hardware store runs and inaccurate DIY vs. pro budget comparisons.
- **User Benefit:** Actionable, material-accurate shopping lists covering every major companion item (primers, trowels, ridge caps, framing joists, short-load truck thresholds).
- **Required External Evidence / Data Needed:** Verified TDS numbers from P1.1 and retail SKU prices from P1.2.
- **Dependencies:** P0.3, P1.1, P1.2.
- **Acceptance Criteria:** Each upgraded calculator exposes verified controls, passes deterministic unit tests, and updates BOM + CostEstimateCard seamlessly.

#### P1.4 — Deepen All 15 Companion Guides (`src/data/guides.ts`, `src/pages/GuidePage.tsx`, `src/types/index.ts`)
- **Target Files:** `src/types/index.ts` (add optional `references?: GuideReference[]`, `safetyAndCodeNotes?: string[]`), `src/data/guides.ts`, `src/pages/GuidePage.tsx`.
- **Change Rationale:** `PHASE_2A_GUIDE_IMPROVEMENT_MATRIX.md` shows all 15 guides share a clean template (`quickAnswer`, `measurementsNeeded`, `threeStageExplanation`, `practicalExample`, `sections`, `costPlanning`, `commonMistakes`, `faqs`) but average ~1,100–1,400 words with thin comparison tables, minimal safety/code warnings, zero external references, and occasional worked-example/engine mismatches.
- **Priority Grouping (per `PHASE_2A_GUIDE_IMPROVEMENT_MATRIX.md`):**
  - *Wave 1 (Critical Alignment & High Commercial/Safety Impact):* `tile`, `paver-patio`, `deck-material`, `roofing`, `drywall`, `concrete-post-hole`.
  - *Wave 2 (Technical Depth & Product Matrices):* `paint`, `concrete-slab`, `fence-material`, `gravel`, `flooring`.
  - *Wave 3 (Completion & Seasonality/Disposal Details):* `mulch`, `sod`, `topsoil`, `baseboard-trim`.
- **Enhancements Per Guide:**
  - Add 1–2 high-value structured comparison tables (e.g., trowel size matrix, concrete slab 4" vs 6" thickness/load, shingle architectural vs 3-tab, paint sheen durability, aggregate density/drainage).
  - Add explicit **Safety, Permits & Building Code Boundary** callout (811 Call Before You Dig, frost-line footings, steep-roof pitch fall protection, PPE for silica concrete/tile dust and pressure-treated sawdust, IRC guardrail/stair triggers).
  - Add a **Verified Reference Citations** section (`GuidePage.tsx`) linking to verified ASTM/TCNA/CMHA/AWC/GA/manufacturer TDS documents (NO unverified links).
  - Verify every `practicalExample` numerically against its TypeScript calculation engine (`P2` test lock).
- **Required External Evidence / Data Needed:** P1.1 verified standards/TDS citations + P1.2 verified pricing tier ranges.
- **Dependencies:** P0.3, P1.1, P1.2.
- **Acceptance Criteria:** Every guide renders verified references, includes safety/code callouts, passes numerical parity against its engine, and avoids filler prose.

#### P1.5 — Implement Real Contact & Errata Reporting Channel (`src/pages/ContactPage.tsx`)
- **Target Files:** `src/pages/ContactPage.tsx`, `src/pages/PrivacyPage.tsx` (if a form collects optional email).
- **Change Rationale:** Replaces non-actionable *"deployment channels and public code repository issues"* text with a concrete contact mechanism.
- **User Benefit:** Gives homeowners, contractors, and reviewers a direct, verifiable channel for errata, privacy requests, and feedback.
- **Required External Evidence / Data Needed:** Owner-supplied real monitored email address and/or verified form endpoint or repository URL.
- **Dependencies:** Owner decision; Privacy Policy check if collecting user-submitted emails.
- **Acceptance Criteria:** `ContactPage.tsx` provides at least one clickable, functional contact method (mailto link, verified form, or verified repository issue link).

---

### Phase P2 — Secondary Feature Depth & Automated Regression Lock

#### P2.1 — Secondary Calculator Decision Helpers (Ranks #6–#9 from `PHASE_2A_CALCULATOR_VALUE_AUDIT.md`)
- **Target Files & Workstreams:**
  1. **Paver Spoil Excavation & Edge Restraint BOM (`paverPatio.ts`, `PaverPatioCalculatorPage.tsx`):** Output excavated dirt/spoil volume (`cu yds` + ~25% swell factor for dumpster/disposal planning) and linear edge restraint (`ft` + `8-ft` pieces + spikes).
  2. **Multi-Room / Multi-Zone Area Adder (`Flooring`, `Paint`, `Mulch`, `Topsoil`, `Sod`):** Lightweight additive zone rows (`Zone 1 + Zone 2...` or `Add Another Room`) feeding total net geometry without breaking single-room simplicity.
  3. **Topsoil Moisture Weight & Bag-vs-Bulk Crossover (`topsoil.ts`, `TopsoilCalculatorPage.tsx`):** Surface bulk delivery weight (`~2,000–2,400 lb/cu yd` dry vs. damp screening—pending P1.1 verification) and `0.75 cu ft` vs. `1.0 cu ft` bag crossover.
  4. **Baseboard Shoe Molding / Quarter-Round Toggle & Sod Deduction Mode (`baseboardTrim.ts`, `sod.ts`):** Optional shoe molding stick row on `BaseboardTrimCalculatorPage.tsx` and non-turf deduction input (patio/beds) on `SodCalculatorPage.tsx`.
- **Dependencies:** P1.1, P1.2, P1.3.
- **Acceptance Criteria:** Zero regressions to default single-zone quick UX; new helpers tested across boundary inputs.

#### P2.2 — Automated Guide-to-Engine Parity & Trust-Guard Test Suite (`tests/`)
- **Target Files:** `tests/guides-parity.test.ts` *(new)*, `tests/trust-compliance.test.ts` *(new)*, existing `tests/*.test.ts`.
- **Change Rationale:** `MethodologyPage.tsx:145` states: *"When a guide presents a worked example, the numbers are directly verified against the corresponding engine function."* Currently, several worked examples drift from engine outputs and `HomePage.tsx` showcase cards drift from engines.
- **User Benefit:** Prevents future edits from silently reintroducing guide/calculator mismatches, dead inputs, missing price IDs, or brand-name drift.
- **Required External Evidence / Data Needed:** None (purely internal verification tests once P0–P1 code/guide updates are complete).
- **Dependencies:** P0 and P1 completion.
- **Acceptance Criteria:**
  - Every `PriceBenchmark` ID referenced by any calculator engine resolves in `PRICES` (`prices.ts`).
  - All 15 guide worked examples match their corresponding TypeScript calculation engine output within stated rounding rules.
  - Automated check asserts no legacy `"Home Project Tools"` string in rendered trust/header/footer components and verifies AdSense/Privacy alignment.

---

## Part C — Master Checklist of External Evidence & Owner Inputs Needed Before Phase 2B

No Phase 2B implementation commit should invent external citations, standard clauses, prices, or contact endpoints. Gather and confirm the following before writing Phase 2B code:

1. **Owner Product & Compliance Decisions:**
   - [ ] Confirm real monitored **Contact Email / Feedback Form / Public Repo URL** for `ContactPage.tsx`.
   - [ ] Confirm **AdSense & Privacy Consent Posture** (e.g., whether Google CMP / Funding Choices is enabled in AdSense console for EEA/UK traffic) and approve updated `PrivacyPage.tsx` AdSense disclosure text.
   - [ ] Confirm **Guide Directory Architecture**: Option A (`/projects#all-guides`, preserving 44 canonical routes) vs. Option B (new `/guides` index route, expanding to 45 routes + sitemap update).
2. **Primary Technical Standards & Manufacturer TDS (`UNVERIFIED` Registry Resolution):**
   - [ ] Tile: TCNA trowel-notch mortar coverage chart + ANSI A118.6/A118.7 grout consumption formula.
   - [ ] Paint: Major manufacturer TDS coverage for wall acrylic, PVA primer, and ceiling paint.
   - [ ] Concrete & Pavers: QUIKRETE® 50/60/80-lb bag yield TDS + CMHA Tech Spec 2 / 9 base & sand allowances.
   - [ ] Drywall: GA-216 / USG Sheetrock® & joint compound consumption rates + fastener spacing.
   - [ ] Decking & Fencing: AWC DCA 6 joist/beam/post guidance + pressure-treated vs. composite gapping/fastener TDS.
   - [ ] Roofing: Manufacturer architectural shingle bundle coverage (`33.3 sq ft/bundle`), #30 felt vs. synthetic underlayment roll yields, starter/ridge cap yields, IRC R905.2 slope rules.
   - [ ] Landscaping: TPI sod pallet coverage range, Mulch & Soil Council bag/settling guidance, regional quarry `tons/cu yd` bulk density ranges.
3. **Current U.S. Retail Price Sampling (`src/data/prices.ts`):**
   - [ ] Sample 2+ national retailers + bulk landscape/ready-mix quotes (recording SKU description, package size, unit price, and exact date/month) for all **29 existing IDs** and **14 missing IDs**, plus documented residential labor range sources.

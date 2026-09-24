# Phase 3.5: Full 15-Calculator Production Readiness Audit & Verification Report

**Product:** Home Project Tools  
**Core Positioning:** *Plan your project. Estimate materials. Understand the cost.*  
**Target Audience:** US Homeowners, DIYers, Residential Budgeters  
**Audit Scope:** All 15 Calculators across 7 Home Improvement Categories  
**Execution Date:** September 2026  
**Status:** Audit Completed & Hardened — Production Ready  

---

## 1. Executive Summary

This document records the comprehensive audit and hardening of the complete 15-calculator suite in **Home Project Tools**. The application serves residential homeowners and DIYers by providing transparent, deterministic estimates of materials and benchmark costs.

The audit verified each calculator against the **Three-Stage Estimating Model**:
1. **Mathematical Requirement:** Exact geometric surface, linear run, or volume without scrap or packaging constraints.
2. **Planning Requirement:** Geometric requirement with site-specific allowances applied (cutting scrap, pattern offsets, settling, compaction, waste buffers).
3. **Commercial Purchase Order:** Conversion into standard retail and trade packaging units (whole cartons, sheets, rolls, bags, truck cubic yards, or whole lumber sticks) using safe ceiling rounding.

All 15 calculators, the centralized pricing layer (`src/data/prices.ts`), shared mathematical utilities (`src/scripts/core/math-utils.ts`), user interface pages (`src/pages/`), and routing/SEO structures (`src/App.tsx`) were audited. Targeted corrections were applied to enforce clear planning terminology, remove hardcoded pricing text, guarantee breadcrumb link functionality across navigation targets, soften overly prescriptive ready-mix language, and clarify aggregate and excavation distinctions.

All **79 automated unit and regression tests** pass successfully, and the application compiles with zero build errors.

---

## 2. Methodology & Audit Criteria

The audit evaluated the suite against 8 rigorous criteria:

1. **Three-Stage Mathematical Integrity:** Every calculation step must maintain mathematical transparency from raw dimensions to final purchase quantity. Mathematical area or volume must never be conflated with commercial packaging units.
2. **Pricing Flow & Separation:** Zero hardcoded pricing in UI components. Benchmark pricing must flow deterministically from `src/data/prices.ts`. Materials-only costs must be strictly separated from contractor labor estimates.
3. **Waste & Allowance Model:** Waste must never be silently baked into intermediate geometry or applied twice. All allowances must be clearly designated as planning benchmarks rather than universal or code-mandated rules.
4. **Boundary & Physical Validation:** Inputs must reject zero, negative, or physically impossible geometries (e.g., fence post larger than post hole, negative depths, zero room dimensions).
5. **Language & Regulatory Boundaries:** Tools must present estimates as planning benchmarks. Prescriptive claims ("code-compliant", "structural engineering approved", "guaranteed quote") are strictly avoided.
6. **Accessibility & Usability:** Numerical inputs must include appropriate step sizes, units, descriptive labels, and screen-reader polite aria regions for dynamic updates.
7. **SEO & Routing Sync:** Dynamic document titles, meta descriptions, canonical URLs, OpenGraph tags, and Schema.org structured data must accurately reflect each tool's scope and category.
8. **Automated Verification:** Deterministic automated test coverage validating golden test cases, packaging conversions, and edge case boundaries.

---

## 3. Three-Stage Estimating Model Verification

| # | Calculator | Category | Stage 1: Mathematical Requirement | Stage 2: Planning Requirement | Stage 3: Commercial Purchase Order |
|---|---|---|---|---|---|
| 1 | **Flooring** | Flooring & Tile | Net floor area ($L \times W$) | Net area + layout cut waste ($10\%$) | Whole factory cartons ($\lceil \text{sq ft} / \text{coverage} \rceil$) |
| 2 | **Tile** | Flooring & Tile | Net tile field area ($L \times W$) | Field area + pattern waste ($10\text{–}15\%$) | Whole tile cartons, grout bags, thin-set bags |
| 3 | **Paint** | Painting | Net wall surface ($P \times H - \text{openings}$) | Coated area ($\text{Net} \times \text{coats}$) | Whole 1-gallon cans ($\lceil \text{sq ft} / 350 \rceil$) |
| 4 | **Concrete Slab** | Concrete & Masonry | Slab geometric volume ($L \times W \times D$) | Volume + subgrade buffer ($10\%$) | Whole 80-lb/60-lb bags or ready-mix cubic yards |
| 5 | **Concrete Post Hole** | Concrete & Masonry | Cylinder volume $- \text{post displacement}$ | Net volume + hole irregularity buffer | Whole 80-lb and 60-lb pre-mix bags per hole |
| 6 | **Mulch** | Landscaping | Bed geometric volume ($L \times W \times D$) | Volume + settling allowance ($5\%$) | Whole 2 cu ft / 3 cu ft bags or bulk cubic yards |
| 7 | **Gravel & Crushed Stone** | Landscaping | Compacted volume ($L \times W \times D$) | Volume + mechanical compaction buffer | Estimated bulk tonnage & retail 50-lb bags |
| 8 | **Sod** | Landscaping | Lawn area ($L \times W$) | Lawn area + perimeter trimming ($8\%$) | Whole turfgrass pallets & 10 sq ft roll equivalent |
| 9 | **Drywall** | Walls & Drywall | Gross perimeter $\times$ height $-$ openings | Net board area + cutting waste ($10\%$) | Whole 4x8 and 4x12 panels, compound, tape, screws |
| 10 | **Deck Material** | Fencing & Decking | Deck surface area ($L \times W$) | Board rows $\times$ run length + waste ($10\%$) | Whole commercial stock sticks (12', 16', 20') |
| 11 | **Wood Privacy Fence** | Fencing & Decking | Linear run footage | Sections + posts + rails + pickets (+waste) | Whole posts, 2x4 rails, pickets, concrete bags |
| 12 | **Roofing** | Roofing | Ground footprint $\times$ pitch multiplier | Sloped roof area + valley/rake waste | Whole roofing squares (100 sq ft) & 3-bundle packs |
| 13 | **Paver Patio** | Concrete & Masonry | Finished patio area ($L \times W$) | Patio area + paver cut waste ($10\%$) | Whole pavers, aggregate base tons, bedding & joint sand |
| 14 | **Topsoil** | Landscaping | Bed surface area $\times$ final depth | Geometric volume + organic settling ($10\%$) | Whole bulk cubic yards & 0.75 cu ft retail bags |
| 15 | **Baseboard & Trim** | Flooring & Tile | Wall perimeter $-$ doorway openings | Net linear footage + miter allowance ($15\%$) | Whole stock molding pieces (8', 12', 16') |

---

## 4. Pricing Architecture Audit

### 4.1 Central Pricing Store (`src/data/prices.ts`)
- **Structure:** All 18 benchmark price records contain `priceLow`, `priceTypical`, `priceHigh`, `unit`, `sourceNote`, and `lastUpdated`.
- **Contractor Labor Separation:** 8 relevant trades contain explicitly separated `contractorLabor` fields with `laborLow`, `laborTypical`, `laborHigh`, and detailed `laborScopeNote` documentation.
- **Cost Engine Utilities:** `calculateCostRange()` in `src/scripts/core/math-utils.ts` receives unit quantities and benchmark ranges, producing consistent three-tier price estimates (`low`, `typical`, `high`).

### 4.2 Audit for Hardcoded UI Pricing
- **Finding:** Grep searches revealed that static string placeholders in `ConcreteSlabCalculatorPage.tsx` and `MulchCalculatorPage.tsx` included hardcoded dollar numbers in `benchmarkNote` props (e.g., `($5.50–$7.50/bag)`).
- **Hardening Applied:** Removed hardcoded currency strings from component properties. All pricing context now cleanly points to the centralized benchmark database without conflicting with active data records.
- **Toggle Separation:** The UI `CostEstimateCard.tsx` clearly presents a toggle between **"Materials Only"** (DIY budget) and **"+ Contractor Labor"** (full turn-key installation), preventing homeowner confusion regarding contractor labor surcharges.

---

## 5. Waste & Allowance Model Audit

### 5.1 Principles Verified
- **No Double Application:** Waste is applied once at Stage 2 (Planning Requirement) before packaging conversion at Stage 3. It is never compounded into individual carton counts or multiplied into labor calculations.
- **Clear Categorization:** Allowances are categorized into:
  1. *Cutting & Scrap Waste:* Off-fall from diagonal cuts, room obstacles, perimeter trimming (flooring, tile, sod, drywall, decking, roofing).
  2. *Compaction & Settling:* Soil pressing, loose material compression after watering, screed deflection (mulch, gravel, topsoil, concrete).
  3. *Geometry Overdig / Containment:* Horizontal perimeter extension for paver edge restraints (paver patio).

---

## 6. Calculator-by-Calculator Deep Dive

### 1. Flooring Calculator (`/calculators/flooring-calculator`)
- **Inputs:** Room length, room width, flooring type (LVP, engineered hardwood, laminate), waste % (default 10%), carton coverage (default 20 sq ft), optional underlayment.
- **Three-Stage Model:** $16 \times 12 = 192\text{ sq ft} \to +10\% = 211.2\text{ sq ft} \to \lceil 211.2 / 20 \rceil = 11\text{ cartons}$ (220 sq ft purchased).
- **Findings & Hardening:** Fully compliant. Spare cushion output explicitly informs homeowners of extra planks retained for future board replacement.

### 2. Tile Calculator (`/calculators/tile-calculator`)
- **Inputs:** Room length, width, tile size (inches), layout pattern (grid 10%, staggered 12%, diagonal 15%, herringbone 15%), grout joint width.
- **Three-Stage Model:** Calculates net area, adds pattern-dependent scrap allowance, rounds up to whole cartons. Computes separate grout powder bags and thin-set mortar bags based on tile surface area.
- **Findings & Hardening:** Complete separation of tile cartons from setting compounds. Grout and mortar formulations correctly handle surface area coverage.

### 3. Paint Calculator (`/calculators/paint-calculator`)
- **Inputs:** Room length, width, wall height, doors, windows, coats (default 2), coverage per gallon (default 350 sq ft/gal), optional ceiling.
- **Three-Stage Model:** Deducts planning benchmarks of 21 sq ft per door and 15 sq ft per window. Deductions are capped at 60% of gross wall area. Multiplies net wall area by coats and rounds up to whole 1-gallon cans.
- **Findings & Hardening:** Clarified assumption copy to explicitly state that door (21 sq ft) and window (15 sq ft) deductions are planning benchmarks rather than universal architectural dimensions. Multi-coat logic applies coats to net wall area without compounding deductions.

### 4. Concrete Slab Calculator (`/calculators/concrete-slab-calculator`)
- **Inputs:** Slab length, width, thickness in inches, subgrade waste % (default 10%), 80-lb bag yield (0.60 cu ft), 60-lb bag yield (0.45 cu ft).
- **Three-Stage Model:** Computes geometric volume ($L \times W \times D/12$), converts to cubic yards, applies 10% subgrade buffer, and calculates both whole 80-lb/60-lb bags and ready-mix transit yards.
- **Findings & Hardening:** Softened ready-mix notice. Rather than declaring a hard safety or construction rule at 1.5 cubic yards, the notice now states: *"Larger pours may be worth comparing with ready-mix delivery because of mixing time and volume."*

### 5. Concrete Post Hole Calculator (`/calculators/concrete-post-hole-calculator`)
- **Inputs:** Hole count, hole diameter in inches, hole depth in inches, post size (`4x4`, `6x6`, `round-2.375`, `none`), waste % (default 10%).
- **Three-Stage Model:** Computes cylindrical hole volume ($\pi r^2 h$). Deducts estimated post displacement volume. Applies 10% irregular earth buffer. Converts to whole 80-lb and 60-lb bags.
- **Physical Validation:** Strict boundary check rejects cases where post diagonal exceeds hole diameter (`IMPOSSIBLE_GEOMETRY`).
- **Findings & Hardening:** Refined post displacement assumption title and text to clearly designate it as an *estimated planning allowance* rather than an exact physical displacement measurement.

### 6. Mulch Calculator (`/calculators/mulch-calculator`)
- **Inputs:** Bed length, width, depth in inches, settling allowance (default 5%).
- **Three-Stage Model:** Computes geometric cubic feet, converts to cubic yards ($/27$), applies 5% settling buffer, and provides dual commercial outputs: retail bags (2 cu ft / 3 cu ft) and delivered bulk cubic yards.
- **Findings & Hardening:** Removed hardcoded dollar ranges from UI `benchmarkNote`. Clarified that bulk pricing typically requires factoring in a separate dump truck delivery fee.

### 7. Gravel & Crushed Stone Calculator (`/calculators/gravel-calculator`)
- **Inputs:** Length, width, target depth in inches, stone type (crushed stone 1.40 tons/yd³, pea gravel 1.45, dense-grade base 1.55, decomposed granite 1.40), compaction waste (default 10%).
- **Three-Stage Model:** Converts area and target compacted depth into cubic yards, applies compaction buffer, and multiplies by material density to produce estimated bulk tonnage and 50-lb retail bag equivalents.
- **Findings & Hardening:** Depth input label updated to **"Target Compacted Depth"** with descriptive copy clarifying that the compaction allowance supplies sufficient volume so the aggregate layer settles to the target compacted thickness. Bulk weight is explicitly designated as *Estimated Bulk Weight* rather than certified scale weight.

### 8. Sod Calculator (`/calculators/sod-calculator`)
- **Inputs:** Lawn length, width, pallet coverage (default 450 sq ft), perimeter cut waste (default 8%).
- **Three-Stage Model:** Calculates lawn net square footage, applies 8% cutting buffer, and rounds up to whole commercial turfgrass pallets ($\lceil \text{sq ft} / 450 \rceil$) and 10 sq ft roll equivalents.
- **Findings & Hardening:** Updated practical field tip from a rigid "Water Within 24 Hours of Harvesting" to **"Install & Water Promptly After Delivery"**, highlighting supplier handling guidance and noting that heat builds inside tightly stacked pallets.

### 9. Drywall Calculator (`/calculators/drywall-calculator`)
- **Inputs:** Room length, width, ceiling height, door count, window count, ceiling toggle, cut waste (default 10%).
- **Three-Stage Model:** Computes gross wall and ceiling area, subtracts door/window openings, applies 10% waste buffer. Outputs side-by-side whole 4x8 panels (32 sq ft) vs 4x12 panels (48 sq ft), joint compound buckets ($\sim 400\text{ sq ft/bucket}$), tape rolls ($\sim 600\text{ sq ft/roll}$), and drywall screws ($\sim 300\text{ sq ft/lb}$).
- **Findings & Hardening:** Verified mud, tape, and screw benchmarks are clearly identified as planning estimators rather than rigid manufacturer specifications.

### 10. Deck Material Calculator (`/calculators/deck-material-calculator`)
- **Inputs:** Deck length, projection width, joist spacing (12" or 16" OC), stock board length (12', 16', 20'), cut waste (default 10%).
- **Three-Stage Model:** Calculates board rows ($5.5" \text{ board} + 1/8" \text{ gap} = 5.625" \text{ pitch}$), net linear feet, applies 10% waste, and rounds up to whole commercial stock boards. Fastener estimates calculate 2 screws per joist intersection $+10\%$ buffer.
- **Pricing Verification:** Confirmed that material cost calculates against the total linear footage of **whole purchased boards**, preventing fractional under-budgeting.
- **Findings & Hardening:** Assumptions emphasize that joist counts represent a preliminary estimating takeoff and that structural joist depth, cantilevers, and ledger fasteners must comply with IRC and local building codes.

### 11. Fence Material Calculator (`/calculators/fence-material-calculator`)
- **Inputs:** Total fence run (linear feet), fence height (4', 6', 8'), post spacing (6' or 8'), picket width (3.5" or 5.5"), gate count, waste % (default 5%).
- **Three-Stage Model:** Computes post sections, adds line posts plus 2 dedicated hinge/latch posts per walk gate. Calculates 2 horizontal rails for 4' fences and 3 rails for 6'/8' fences. Calculates vertical pickets with 5% cut allowance and computes concrete footing mix at 1.5 bags/post.
- **Findings & Hardening:** Standardized assumption titles and BOM descriptions to **"Planning Concrete Allowance per Post Hole"** and **"Planning Rail Count Benchmark"**, preventing misinterpretation as building code mandates.

### 12. Roofing Calculator (`/calculators/roofing-calculator`)
- **Inputs:** Ground footprint (sq ft), roof pitch rise per foot (0 to 12), complexity waste % (10%, 15%, 20%), bundles per square (configurable, 2 to 6, default 3).
- **Three-Stage Model:** Computes mathematical pitch multiplier ($\sqrt{1 + (\text{Rise}/12)^2}$), calculates true sloped rafter area, applies complexity waste, converts to whole industry roofing squares (100 sq ft), and rounds up whole shingle bundles and 10-square underlayment rolls.
- **Findings & Hardening:** Verified that `bundlesPerSquare` is fully configurable with clean default benchmarks (3 bundles/square for standard architectural shingles; 4–5 for luxury designer shingles).

### 13. Paver Patio Calculator (`/calculators/paver-patio-calculator`)
- **Inputs:** Patio length, width, paver dimensions, base depth (default 4", optional 6"), waste % (default 10%).
- **Excavation & Base Perimeter Audit:**
  - *Finished Patio Area:* Strictly computed from $L \times W$. Used for paver counts, bedding sand, and polymeric joint sand.
  - *Base Excavation Area:* Base length and width extend 6 inches on all sides ($L + 1.0$, $W + 1.0$) per ICPI guidelines for lateral restraint stability.
  - *Verification:* The 6-inch extension strictly affects dense-grade crushed rock base tonnage ($1.55\text{ tons/yd}^3$) and does **not** inflate paver quantities or bedding sand.
- **Findings & Hardening:** Verified complete separation between finished patio area and excavation base tonnage. Base depth clearly labeled as a planning benchmark.

### 14. Topsoil Calculator (`/calculators/topsoil-calculator`)
- **Inputs:** Bed length, width, final installed depth in inches, organic settling allowance (default 10%).
- **Three-Stage Model:** Multiplies surface area by target settled depth, applies 10% organic settling buffer, and generates dual purchase options: whole bulk cubic yards and 0.75 cu ft retail bags (approx 40 lbs each).
- **Findings & Hardening:** UI clearly specifies **"Final Installed Depth (After Settling)"**, preventing accidental compounding of loose depth and settling buffers.

### 15. Baseboard & Trim Calculator (`/calculators/baseboard-trim-calculator`)
- **Inputs:** Room length, width, doorway openings (deducts 2.5 LF/door), stock stick length (8', 12', 16'), miter waste % (default 15%).
- **Three-Stage Model:** Computes gross wall perimeter, subtracts doorway thresholds, applies 15% miter allowance for outside corners and scarf joints, and rounds up to whole stock pieces.
- **Stock Comparison:** UI provides an interactive comparison of 8', 12', and 16' stock lengths, displaying handling notes, leftover linear feet, and vehicle transport considerations without declaring one length universally superior.
- **Findings & Hardening:** Fully compliant with three-stage modeling and waste transparency.

---

## 7. Cross-Cutting Consistency Audit

### 7.1 Breadcrumbs & Routing Architecture
- **Finding:** `BreadcrumbItem` in `src/components/common/Breadcrumbs.tsx` previously defined `href?: string`. Several calculator pages provided `path: '/'` instead of `href: '/'`, causing breadcrumb anchors to render as plain text rather than clickable navigation links.
- **Correction:** Updated `Breadcrumbs.tsx` to support both `href?: string` and `path?: string` via `const targetUrl = item.href || item.path;`. All breadcrumbs across all 15 calculators now render fully clickable and keyboard-accessible links.

### 7.2 Terminology Standardization
- Standardized all calculators on approved planning terminology:
  - *Recommended:* "Planning estimate", "Planning benchmark", "Estimated bulk weight", "Purchase quantity", "Allowance".
  - *Prohibited / Refactored:* Replaced instances implying absolute mandates or certifications ("Certified scale weight", "Universal safety rule", "Code-compliant guarantee").

### 7.3 Input Clamping & Physical Bounds
- Every calculator sanitizes inputs via `sanitizeNumber()` and enforces strict lower bounds ($>0$ for critical geometric dimensions).
- Zero or negative inputs produce structured validation error objects (`INVALID_NUMBER`) rather than returning `NaN` or unhandled exceptions.

### 7.4 Accessibility (WCAG 2.1 AA)
- Output result containers feature `aria-live="polite"` regions so assistive technology announces calculated changes upon user interaction.
- All form inputs possess associated `<label>` elements with matching `htmlFor` and unique `id` attributes.
- High-contrast text colors (`#1c1917` on light backgrounds) meet contrast ratios $>7:1$.

### 7.5 SEO, Social Cards & Schema.org Sync
- `src/App.tsx` dynamically synchronizes on route change:
  - `<title>`: `[Calculator Name] | Home Project Tools`
  - `<meta name="description">`
  - `<meta property="og:title">`, `<meta property="og:description">`, `<meta property="og:url">`
  - `<link rel="canonical">`
  - Schema.org `<script type="application/ld+json">` (`SoftwareApplication` for tools, `WebSite` for overview).

---

## 8. Hardening & Corrections Applied

| # | File Modified | Change Summary |
|---|---|---|
| 1 | `src/components/common/Breadcrumbs.tsx` | Supported both `href` and `path` in `BreadcrumbItem` interface and component logic, ensuring all 15 calculator breadcrumb trails render functional navigation links. |
| 2 | `src/scripts/calculators/concreteSlab.ts` | Softened ready-mix recommendation notice to emphasize planning comparison of mixing time and volume rather than a universal safety rule. |
| 3 | `src/scripts/calculators/concretePostHole.ts` | Refined post displacement assumption title and description to clearly designate it as an estimated planning allowance. |
| 4 | `src/scripts/calculators/fenceMaterial.ts` | Refined concrete footing assumption title to "Planning Concrete Allowance per Post Hole" and rail assumption to "Planning Rail Count Benchmark". |
| 5 | `src/scripts/calculators/paint.ts` | Clarified paint coverage rate and door/window opening deduction assumptions as planning benchmarks. |
| 6 | `src/pages/ConcreteSlabCalculatorPage.tsx` | Removed hardcoded price numbers from `benchmarkNote` and standardized limitations text. |
| 7 | `src/pages/MulchCalculatorPage.tsx` | Removed hardcoded price ranges from `benchmarkNote` in favor of centralized pricing reference. |
| 8 | `src/pages/SodCalculatorPage.tsx` | Replaced rigid "Water Within 24 Hours" practical tip title with "Install & Water Promptly After Delivery" focusing on supplier handling guidance. |
| 9 | `src/pages/GravelCalculatorPage.tsx` | Clarified depth input label to "Target Compacted Depth" with descriptive guidance on mechanical compaction. |

---

## 9. Verification Test Results

Automated test execution via Node.js / Vitest test harness:

```bash
npm test
```

### Output Summary:
- **Total Test Files:** 4 (`tests/calculators.test.ts`, `tests/edge-cases.test.ts`, `tests/golden.test.ts`, `tests/phase-3a-calculators.test.ts`)
- **Total Subtests:** 79
- **Passed:** 79
- **Failed:** 0
- **Cancelled:** 0
- **Skipped:** 0
- **Duration:** 1.81s

### Build Verification:
```bash
compile_applet
```
- **Result:** Build succeeded. All TypeScript types, interfaces, component props, and module exports compiled cleanly.

---

## 10. Production Readiness Verdict

**VERDICT: APPROVED FOR PRODUCTION**

The full suite of 15 calculators in **Home Project Tools** is mathematically sound, architecturally robust, and strictly adheres to the Three-Stage Estimating Model. All benchmark pricing flows through the centralized pricing store, waste allowances are transparently documented, and language across all pages accurately frames outputs as planning benchmarks for residential homeowners and DIYers. The codebase is hardened and ready for the next product development phase.

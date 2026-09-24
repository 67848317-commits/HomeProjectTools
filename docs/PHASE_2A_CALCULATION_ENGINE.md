# PHASE 2A: Core Infrastructure, Data Architecture & Calculation Engine

**Project:** Home Project Tools  
**Core Positioning:** Home Improvement Planning & Cost Estimation  
**Status:** Audited, Hardened & Validated (42/42 Passing Automated Tests)  
**Date:** September 2026  

---

## 1. Executive Summary

Phase 2A delivers the complete, decoupled foundation for **Home Project Tools**:
1. **Core Type System (`src/types/index.ts`):** Complete domain model covering categories, calculators, benchmarks, bills of materials, and structured errors.
2. **Centralized Pricing Store (`src/data/prices.ts`):** Illustrative planning benchmarks (Low, Typical, High) with explicit packaging assumptions, methodology sources, and separated contractor labor rates. Includes `getBenchmarkPriceRange` helper function to eliminate fallback drift.
3. **Category & Calculator Registries (`src/data/categories.ts`, `src/data/calculators.ts`):** Declarative metadata for all 7 categories and 15 V1 calculators, strictly isolated from formulas.
4. **Shared Mathematical & Conversion Core (`src/scripts/core/math-utils.ts`):** Pure functions for geometric area, volume, cylinder displacement, slope multipliers, waste application, safe numeric validation, and commercial package ceiling rounding.
5. **15 Pure Calculation Engine Modules (`src/scripts/calculators/*.ts`):** Deterministic, pure TypeScript modules producing detailed mathematical results, waste-adjusted planning quantities, package-rounded purchase bills of materials, and benchmark-driven cost estimates.
6. **Rigorous Audit & Test Suite (`tests/**/*.test.ts`):** 42 automated unit tests across 4 suites (`math-utils.test.ts`, `calculators.test.ts`, `edge-cases.test.ts`, and `golden.test.ts`) validating positive homeowner cases, physical geometric limits, edge cases, and hand-verified golden cases.

---

## 2. Architecture & Layer Separation

```
┌────────────────────────────────────────────────────────┐
│ UI Layer (Phase 2B)                                    │
│ Astro Calculator Pages / Form Sliders / Result Cards   │
└───────────────────────────┬────────────────────────────┘
                            │ imports
┌───────────────────────────▼────────────────────────────┐
│ Calculation Engine Layer (`src/scripts/calculators/`)  │
│ 15 Pure Functions • Deterministic • Zero DOM/Astro     │
└─────────────┬──────────────────────────────┬───────────┘
              │ imports                      │ imports
┌─────────────▼───────────────┐ ┌────────────▼───────────┐
│ Shared Math Core            │ │ Data Layer             │
│ `src/scripts/core/`         │ │ `src/data/prices.ts`   │
│ ceilToPackage, applyWaste   │ │ `src/data/calculators` │
│ geometry & conversions      │ │ `src/data/categories`  │
└─────────────────────────────┘ └────────────────────────┘
```

---

## 3. The 15 Audited Calculation Engines

| # | Calculator ID | Module Path | Primary Units | Packaging Model | Benchmark IDs |
|---|---|---|---|---|---|
| 1 | `flooring-calculator` | `src/scripts/calculators/flooring.ts` | Sq Ft, Cartons | Full cartons (default 20 sq ft), Underlayment rolls | `flooring-lvp`, `flooring-engineered-hardwood`, `flooring-underlayment-roll` |
| 2 | `tile-calculator` | `src/scripts/calculators/tile.ts` | Tiles, Boxes, Mortar, Grout | Full boxes, 50-lb thin-set bags, 25-lb grout bags | `tile-ceramic-porcelain`, `tile-thinset-mortar-50lb`, `tile-grout-bag` |
| 3 | `paint-calculator` | `src/scripts/calculators/paint.ts` | Coated Sq Ft, Gallons | Full 1-gallon cans (walls & ceiling) | `paint-interior-gallon` |
| 4 | `concrete-slab-calculator` | `src/scripts/calculators/concreteSlab.ts` | Cu Yds, 80lb/60lb Bags | 80-lb bags (0.60 cu ft), 60-lb bags (0.45 cu ft), Ready-mix | `concrete-80lb-bag`, `concrete-readymix-yard` |
| 5 | `concrete-post-hole-calculator` | `src/scripts/calculators/concretePostHole.ts` | Cu Ft/Hole, Total Cu Yds, Bags | 80-lb and 60-lb bags, cylinder minus embedded post displacement | `concrete-80lb-bag`, `concrete-60lb-bag` |
| 6 | `mulch-calculator` | `src/scripts/calculators/mulch.ts` | Bulk Cu Yds, 2 cu ft Bags | 2 cu ft retail bags (13.5 bags/yd³), 3 cu ft bags, bulk yardage | `mulch-bulk-yard`, `mulch-bag-2cuft` |
| 7 | `gravel-calculator` | `src/scripts/calculators/gravel.ts` | Bulk Tons, Cu Yds, 50-lb Bags | Density-specific (1.40–1.55 tons/yd³), 2000 lbs/ton | `gravel-crushed-stone-ton`, `gravel-bag-50lb` |
| 8 | `sod-calculator` | `src/scripts/calculators/sod.ts` | Sq Ft, Pallets, 10 sq ft Rolls | Full pallets (450 sq ft), individual rolls | `sod-pallet` |
| 9 | `drywall-calculator` | `src/scripts/calculators/drywall.ts` | Sheets (4x8, 4x12), Mud, Tape | 32 sq ft sheets, 48 sq ft sheets, 4.5-gal buckets, 500 ft rolls | `drywall-sheet-4x8`, `drywall-sheet-4x12`, `drywall-joint-compound-bucket`, `drywall-accessories-kit` |
| 10 | `deck-material-calculator` | `src/scripts/calculators/deckMaterial.ts` | Linear Ft, Deck Boards, Joists | 12/16/20 ft boards, 12"/16" joists, fasteners | `deck-board-composite-lf` |
| 11 | `fence-material-calculator` | `src/scripts/calculators/fenceMaterial.ts` | Posts, Rails, Pickets, Bags | 4x4x8 posts, 2x4 backer rails, dog-ear pickets, concrete bags | `fence-post-4x4x8`, `fence-rail-2x4x8`, `fence-picket-dogear`, `concrete-60lb-bag` |
| 12 | `roofing-calculator` | `src/scripts/calculators/roofing.ts` | Actual Area, Squares, Bundles | 100 sq ft squares, 3 bundles/square (configurable), 10-square rolls | `roofing-architectural-square`, `roofing-synthetic-underlayment-roll` |
| 13 | `paver-patio-calculator` | `src/scripts/calculators/paverPatio.ts` | Pavers, Base Tons, Sand Yds | Individual pavers, dense-grade gravel (6" over-dig), bedding sand, joint sand | `paver-concrete-unit`, `sand-bedding-bulk-yard`, `polymeric-sand-50lb`, `gravel-crushed-stone-ton` |
| 14 | `topsoil-calculator` | `src/scripts/calculators/topsoil.ts` | Bulk Cu Yds, 0.75 cu ft Bags | 0.75 cu ft retail bags (36 bags/yd³), 1.0 cu ft bags, bulk yardage | `topsoil-bulk-yard`, `topsoil-bag-075` |
| 15 | `baseboard-trim-calculator` | `src/scripts/calculators/baseboardTrim.ts` | Linear Ft, Molding Sticks | 8/12/16 ft pieces, miter cut allowance, doorway deductions | `baseboard-mdf-primed` |

---

## 4. Key Engineering Standards & Verified Formulas

### 4.1. Rounding Philosophy
1. **Mathematical Result:** Preserves float precision for auditing and unit testing (e.g., `netAreaSqFt: 192.00`).
2. **Planning Result:** Includes single-application cut waste (e.g., `recommendedPurchaseSqFt: 211.20`).
3. **Purchase Quantity:** Strictly rounded upward to whole commercial units using `ceilToPackage` with IEEE 754 precision safeguards (`Math.ceil(val - 1e-9)`).
4. **Purchased Quantities & Cost Estimates:** Cost estimates are strictly computed against whole purchased packages (e.g., purchased carton sq ft, whole shingle squares, whole deck boards), not fractional net requirements.

### 4.2. Waste Factor Rules
- **Applied Exactly Once:** Waste is applied exclusively to the net geometric quantity before commercial packaging division.
- **Configurable Presets:** Provided via `wasteOptions` in calculator metadata (e.g. straight lay 10%, diagonal 15%, herringbone 18–20%).
- **Compaction / Settling Factors:** Differentiated between organic landscaping materials (mulch settling 5%, topsoil compaction 10%) and aggregate base tamping (crushed stone 10–15%).

### 4.3. Pricing & Labor Separation
- **Illustrative Planning Benchmarks:** Stored in `src/data/prices.ts` with low, typical, and high tiers.
- **Strict Separation:** Contractor installation labor is stored as an optional separate object within the benchmark (`contractorLabor`) and reported in results under `contractorInstalledTotal`, never blended into `materialsOnly`.
- **Packaging Decoupling:** Calculators reference benchmarks via stable strings (`'flooring-lvp'`, `'concrete-80lb-bag'`), keeping formulas 100% price-agnostic.
- **Benchmark Range Helper:** `getBenchmarkPriceRange(id)` provides unified fallback handling, preventing out-of-sync hardcoded price literals.

---

## 5. Phase 2A Calculation Engine Audit Findings & Remediation

During the independent calculation engine audit, 6 critical and non-critical architectural improvements were identified and remediated:

### 5.1. Findings and Remediation Summary
1. **Hardcoded Price Fallback Drift (Remediated):**
   - *Finding:* Several modules (`paverPatio.ts`, `topsoil.ts`, `drywall.ts`) contained inline fallback numbers when retrieving benchmark records.
   - *Fix:* Added `getBenchmarkPriceRange` helper to `src/data/prices.ts` returning normalized `{ low, typical, high }` ranges directly from the centralized registry.
2. **Missing Price Benchmarks (Remediated):**
   - *Finding:* Paver bedding sand, retail 0.75 cu ft topsoil bags, and drywall installation accessories lacked dedicated benchmark entries.
   - *Fix:* Created `sand-bedding-bulk-yard` ($42/$55/$75 per cu yd), `topsoil-bag-075` ($2.95/$3.98/$5.45 per bag), and `drywall-accessories-kit` ($18/$28/$45 per kit) in `src/data/prices.ts` and updated metadata in `src/data/calculators.ts`.
3. **Paver Patio Bedding Sand Omission (Remediated):**
   - *Finding:* `paverPatio.ts` calculated bedding sand cubic yards in outputs, but omitted it from the Bill of Materials and material cost total.
   - *Fix:* Added `bedding-sand` to the BOM with its benchmark ID and factored it into the materials-only and installed cost estimates. Made gravel base depth configurable (defaulting to 4" for walkways/patios).
4. **Decking Pricing Unit Alignment (Remediated):**
   - *Finding:* `deckMaterial.ts` calculated `deckBoardsToPurchase` accurately, but material pricing was applied to recommended linear feet rather than whole purchased board footage (`purchasedDeckingLinearFeet = deckBoardsToPurchase * stockLength`).
   - *Fix:* Updated material cost calculation to bill for full purchased stock boards and exposed `purchasedDeckingLinearFeet` in the output contract.
5. **Concrete Post Hole Geometric Clearance (Remediated):**
   - *Finding:* Inputting a post larger than the hole diameter (e.g. 4" hole for a 4x4 post with 4.95" diagonal) resulted in a mathematical output rather than a physical validation error.
   - *Fix:* Added geometric clearance validation enforcing `holeDiameter > postDiagonal` with guidance on the standard 3x post width collar rule.
6. **Roofing Bundles Configurable Contract (Remediated):**
   - *Finding:* Roofing shingle calculations assumed a fixed 3 bundles/square without allowing manufacturer-specific packaging overrides.
   - *Fix:* Added `bundlesPerSquare` input (default 3, range 2–6) to `RoofingInputs` and `RoofingOutputs`, syncing with calculator metadata in `src/data/calculators.ts`.

---

## 6. Automated Unit Test Verification

The test runner utilizes Node native test runner via `npm test`:
```bash
npm test
# Command: node --import tsx --test 'tests/**/*.test.ts'
```

### Test Results
- **Total Tests Executed:** 42
- **Passed:** 42
- **Failed:** 0
- **Suites:**
  1. `tests/math-utils.test.ts` (9 tests): Sanitize, clamp, ceilToPackage, applyWaste, precision rounding, unit conversions, cylinder displacement, slope multiplier, cost range calculation.
  2. `tests/calculators.test.ts` (16 tests): 15 positive homeowner scenarios covering real-world project dimensions, packaging rounding, BOM outputs, plus universal calculator dispatcher verification.
  3. `tests/edge-cases.test.ts` (2 tests): Zero/negative inputs returning structured error objects gracefully, extreme dimensions (250ft rooms), and fractional inputs without NaN/Infinity.
  4. `tests/golden.test.ts` (15 tests): Explicit hand-calculated golden cases asserting mathematical exactness, net vs gross separation, and pricing accuracy across all 15 calculators.

---

## 7. Phase 2B Readiness

The calculation engine is audited, hardened, and 100% ready for UI implementation in Phase 2B:
- **Zero UI Bleed:** All 15 calculation engines are pure TypeScript functions with zero DOM or Astro dependencies.
- **Standardized Contracts:** Every calculator implements `CalculationResult<T>` with `outputs`, `billOfMaterials`, `costEstimate`, `assumptions`, and `notices`.
- **Form Binders:** All input fields defined in `src/data/calculators.ts` match the parameter names accepted by calculation engines.
- **Packaging Integrity:** All costs and purchases reflect commercial packaging reality.

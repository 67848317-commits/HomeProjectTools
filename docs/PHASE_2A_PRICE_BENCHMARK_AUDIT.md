# Phase 2A — Price Benchmark Audit & Provenance Plan

**Project:** Home Project Planner (`https://homeprojectplanner.org/`)  
**Target File Audited:** `src/data/prices.ts` (29 `PriceBenchmark` records) & `src/types/index.ts`  
**Phase:** 2A (Audit & Planning — No Code or Pricing Data Modified)

---

## 1. Executive Summary of Audit Findings

The centralized `PRICE_BENCHMARKS` store in `src/data/prices.ts` currently holds **29 records** across 6 pricing categories. While keeping pricing centralized rather than scattered inside calculation logic is architecturally sound, **all 29 records currently lack verifiable empirical provenance** and suffer from internal scope/unit inconsistencies:

1. **Zero Primary Source Traceability (`UNVERIFIED`):** Every record shares an identical synthetic timestamp (`lastReviewedDate: '2026-01-15'`) with vague `sourceNote` text (e.g., *"National home improvement centers"*, *"Standard commercial bag retail benchmarks"*), zero SKU references, zero supplier names/URLs, zero sample logs, and zero regional variance methodology.
2. **Contradictory Scope Claims Across UI & Docs:**
   - `prices.ts` header, `AboutPage.tsx`, `MethodologyPage.tsx`, and `TermsPage.tsx` describe prices as **US national residential planning averages**.
   - `CostEstimateCard.tsx` (line 111) labels them *"regional planning benchmarks"*.
   - `AssumptionsList.tsx` describes them as *"US median retail shelf and trade indices"*.
   - `GuidePage.tsx` (line 521) claims *"local benchmark pricing"*.
   - Individual records mix scopes (`concrete-readymix-yard`: *"Regional..."*; `sod-pallet`: *"Regional..."*; `paint-interior-gallon`: *"Aggregated tiers"*).
3. **Unmodeled / Missing Benchmarks & Pricing Mismatches:**
   - **Broken or Missing IDs:** `DeckMaterialCalculatorPage.tsx` passes `'framing-joist-lumber'` and `'deck-fasteners-box'` (neither exists in `prices.ts`); `flooring.ts` maps `'laminate'` to `'flooring-lvp'`; `paint.ts` prices flat ceiling paint at `'paint-interior-gallon'` rates; `drywall.ts` lacks separate benchmarks for `4×12` sheets, tape rolls, and screws (forcing a fixed `$25` room kit and mismatched UI-side pricing); `gravel.ts` calculates `50-lb` bag counts without a bag benchmark; `mulch.ts` & `topsoil.ts` calculate `3 cu ft` and `1.0 cu ft` bags without price benchmarks; `fenceMaterial.ts` prices `4'`, `6'`, and `8'` fences using only `8'` posts, `8'` rails, and `6'` pickets.
   - **Unit Confusion:** `'paver-concrete-unit'` uses `unit: 'sq ft'` (`$2.50 / $4.50 / $8.50`), directly contradicting its ID (`-unit`) and the companion guide's `benchmarksNote` (*"$0.65 to $2.40 per standard concrete paver unit ($1.25 typical)"*).
   - **Labor Scope Mismatch:** `'deck-board-composite-lf'` attaches turnkey full-deck structural construction labor (`$18/$30/$50` sq ft) to a surface-boards-only material estimate.
   - **Flat Fixed Kit Anomaly:** `'drywall-accessories-kit'` charges `$15/$25/$40` flat per project regardless of whether the room is 100 sq ft or 3,000 sq ft.

---

## 2. Proposed Expanded TypeScript Benchmark Schema (Phase 2B Target)

To meet high transparency and E-E-A-T expectations in Phase 2B, expand `PriceBenchmark` in `src/types/index.ts` to enforce explicit provenance metadata with **all 10 required fields**:

```typescript
export type BenchmarkStatus = 'illustrative_estimate' | 'verified_benchmark';

export interface PriceBenchmark {
  // Existing core fields (preserved for backward compatibility)
  id: string;
  materialName: string;
  category:
    | 'flooring'
    | 'painting'
    | 'concrete-masonry'
    | 'landscaping'
    | 'walls-drywall'
    | 'fencing-decking'
    | 'roofing';
  unit: string;
  priceLow: number;
  priceTypical: number;
  priceHigh: number;
  priceBasis: string;
  packagingAssumption: string;
  sourceNote: string;
  lastReviewedDate: string; // YYYY-MM-DD
  disclaimer: string;
  contractorLabor?: {
    laborLow: number;
    laborTypical: number;
    laborHigh: number;
    unit: string;
    laborScopeNote: string;
  };

  // NEW: 10 Required Provenance & Transparency Fields (Phase 2B)
  provenance: {
    /** 1. Explicit supplier, retailer, producer index, or estimator source */
    sourceOrigin: string;
    /** Optional archival/reference URLs when verified from public listings or trade guides */
    referenceUrls?: string[];
    /** 2. Geographic scope ("US National Average", "Regional Sample - [Region]", etc.) */
    geographicScope: 'US National Illustrative Average' | 'US National Sampled Benchmark' | 'Regional / Metro Range';
    /** 3. ISO date when underlying prices were actually observed or estimated (YYYY-MM-DD) */
    collectionDate: string;
    /** 4. Review cadence & stale-after threshold (e.g., "Quarterly (90 days)", "Semi-Annual (180 days)") */
    reviewCadence: string;
    /** 5. Explicit tier definitions mapping Low / Typical / High */
    tierDefinitions: {
      low: string;
      typical: string;
      high: string;
    };
    /** 6. Representative SKU or generic product class basis (e.g., "4000 PSI pre-mix 80-lb bag, generic") */
    representativeBasis: string;
    /** 7. Exact pricing & packaging unit basis (e.g., "$/sq ft billed by full 20 sq ft carton") */
    unitAndPackagingBasis: string;
    /** 8. Structured array of explicit exclusions (delivery, tax, tools, subbase, fasteners, short-load fees) */
    exclusions: string[];
    /** 9. Variance / confidence explanation (commodity volatility, freight weight, regional spread) */
    confidenceAndVarianceNote: string;
    /** 10. Truthful classification until backed by documented retail/supplier sampling */
    verificationStatus: BenchmarkStatus;
  };
}
```

**Important Integrity Rule:** Until real market sampling from specific retail/supplier sources is performed and logged with actual observation dates in Phase 2B, every price benchmark in the app MUST carry `verificationStatus: 'illustrative_estimate'` and be disclosed transparently in UI/Copy as **illustrative US planning estimates** rather than "verified local market prices."

---

## 3. Audit of All 29 Existing Records in `src/data/prices.ts`

### Disposition Categories
- **`RE-VERIFY & RETAIN (Illustrative Until Sampled)`**: Unit and structure are logical, but prices/sources are currently `UNVERIFIED` and need live multi-retailer/supplier sampling in Phase 2B.
- **`SPLIT / REPLACE`**: Record conflates multiple distinct products, uses a flat kit fee, or mismatches engine scope.
- **`CLARIFY UNIT / SCOPE`**: Record has unit confusion (`sq ft` vs `unit`), mismatched contractor labor scope, or rounding edge cases (minimum loads / drop fees).

| # | ID | Material Name | Current Low / Typ / High (Unit) | Verification Status | Identified Issues / Contradictions | Recommended Phase 2B Disposition | Required Research / Evidence |
|---|---|---|---|---|---|---|---|
| 1 | `flooring-lvp` | Luxury Vinyl Plank (LVP) | `$1.79 / $3.29 / $5.99` (`sq ft`) + Labor `$1.50/$2.75/$4.50` | `UNVERIFIED` | Shared with `'laminate'` silently in `flooring.ts`; names brands (LifeProof, Pergo, Mohawk) without logged SKU sampling. | **RE-VERIFY & RETAIN** (for LVP only; split Laminate out) | Sample 3–5 budget/mid/premium SPC LVP SKUs (e.g., 6 mil / 12 mil / 20+ mil wear layer) & verify regional installation labor indices. |
| 2 | `flooring-engineered-hardwood` | Engineered Hardwood | `$3.49 / $5.75 / $9.50` (`sq ft`) + Labor `$2.50/$4.00/$6.50` | `UNVERIFIED` | Broad species/wear-layer spread (`2mm`–`4mm` sawn oak); unverified SKU basis. | **RE-VERIFY & RETAIN** | Document representative thickness/wear-layer tiers (thin veneer vs thick sawn European oak) & verify nail/glue labor scope. |
| 3 | `flooring-underlayment-roll` | Acoustic / Foam Underlayment Roll | `$25.00 / $45.00 / $75.00` (`roll 100 sq ft`) | `UNVERIFIED` | Retail underlayment rolls vary from 100 sq ft to 200 or 400 sq ft rolls (many ~100 sq ft cork/felt/foam runs `$0.25–$0.75/sq ft`). | **RE-VERIFY & RETAIN** | Verify 100 sq ft standard roll shelf pricing across basic PE foam, 3-in-1 vapor barrier, and cork/dense felt. |
| 4 | `baseboard-mdf-primed` | Primed MDF Baseboard (3-1/4" to 5-1/4") | `$0.95 / $1.65 / $2.75` (`linear foot`) + Labor `$1.25/$2.25/$3.50` | `UNVERIFIED` | Covers MDF only; does not cover solid finger-joint pine or clear oak/PVC; 3-1/4" vs 5-1/4" spans low-to-typical. | **CLARIFY TIER & RE-VERIFY** | Map tiers explicitly (e.g., 3-1/4" builder MDF -> 5-1/4" MDF -> solid FJ pine/tall architectural) via home center LF pricing. |
| 5 | `tile-ceramic-porcelain` | Ceramic & Porcelain Tile | `$1.49 / $3.89 / $8.50` (`sq ft`) + Labor `$5.00/$9.00/$15.00` | `UNVERIFIED` | Labor scope mentions *"on prepared cement board"*, yet no cement backer board / uncoupling membrane material benchmark exists. | **RE-VERIFY & RETAIN** (+ add backer board caveat/optional SKU) | Sample glazed ceramic builder tiles, rectified 12×24 porcelain, and specialty porcelain lines; note backer board/membrane exclusion clearly. |
| 6 | `tile-thinset-mortar-50lb` | Polymer-Modified Thin-Set Mortar | `$16.00 / $24.00 / $38.00` (`50-lb bag`) | `UNVERIFIED` | Note: many retail LFT/polymer-modified mortars now sell in **40-lb or 50-lb** bags (`ANSI A118.4 / A118.15`). | **RE-VERIFY & CLARIFY BAG WEIGHT** | Check current retail mortar weights (40 lb lightweight vs 50 lb standard polymer-modified) & price tiers. |
| 7 | `tile-grout-bag` | Sanded / Unsanded Tile Grout | `$14.00 / $22.00 / $34.00` (`25-lb bag`) | `UNVERIFIED` | Many modern retail grouts (high-performance polymer-modified cement) sell in **10-lb or 25-lb** bags; basic sanded 25-lb bags are often lower-tier while 10-lb premium FA grouts cost `$18–$28`. | **RE-VERIFY & CLARIFY FORMULATION** | Verify standard 25-lb cementitious grout pricing vs. 10-lb/25-lb high-performance grout and confirm bag weight alignment with `tile.ts`. |
| 8 | `paint-interior-gallon` | Interior Acrylic Latex Wall Paint | `$26.00 / $48.00 / $78.00` (`gallon`) + Labor `$1.20/$2.20/$3.50` | `UNVERIFIED` | Reused identically for **ceiling paint**; omits PVA primer and 5-gallon pail bulk discount (promised in `CategoryHubPage.tsx`). | **RE-VERIFY & SPLIT** (add Ceiling Flat & PVA Primer) | Sample retail 1-gal and 5-gal cans across contractor-grade, mid-tier matte/eggshell, premium paint+primer, flat ceiling paint, and PVA primer. |
| 9 | `sand-bedding-bulk-yard` | Coarse Bedding Sand (ASTM C33) | `$32.00 / $46.00 / $65.00` (`cubic yard`) | `UNVERIFIED` | Excludes bulk delivery fee (`$50–$120`) and regional quarry minimum orders. | **RE-VERIFY & RETAIN** | Sample landscape supply yards for washed concrete sand (ASTM C33) per cubic yard/ton + document delivery minimums. |
| 10 | `concrete-80lb-bag` | 80 lb High-Strength Concrete Mix | `$5.60 / $6.65 / $8.20` (`80-lb bag`) + Labor `$4.50/$8.00/$14.00` | `UNVERIFIED` | `concreteSlab.ts` attaches flatwork labor (`$4.50/$8.00/$14.00` sq ft) to this record even when `costEstimate` flips to ready-mix! | **RE-VERIFY & RETAIN** (decouple flatwork labor or document basis clearly) | Sample retail 80-lb standard 4000 PSI bags (e.g., Quikrete/Sakrete); verify turnkey flatwork labor ranges separately. |
| 11 | `concrete-60lb-bag` | 60 lb High-Strength Concrete Mix | `$4.50 / $5.35 / $6.75` (`60-lb bag`) | `UNVERIFIED` | Used by `fenceMaterial.ts`, **NOT** used by `concreteSlab.ts` or `concretePostHole.ts` cost estimates even though those pages show 60-lb cards. | **RE-VERIFY & WIRE INTO SLAB/POST BOM** | Sample retail 60-lb standard concrete bags; wire into 60-lb option/BOM in concrete calculators. |
| 12 | `concrete-readymix-yard` | Ready-Mix Concrete (Delivered) | `$135.00 / $165.00 / $210.00` (`cubic yard`) | `UNVERIFIED` | `sourceNote` says *"Regional..."*; `concreteSlab.ts` multiplies fractional yards without minimum load or short-load surcharges (`<3–4 yd³`), understating real 1.5–3 yd³ truck pours! | **CLARIFY SCOPE & ADD MINIMUM/SHORT-LOAD RULE** | Sample regional ready-mix batch plant yard rates + short-load fee schedules; model or flag short-load surcharge explicitly for `1.5–3.5 yd³` pours. |
| 13 | `paver-concrete-unit` | Standard Concrete Patio Pavers | `$2.50 / $4.50 / $8.50` (`sq ft`) + Labor `$8.00/$14.00/$22.00` | `UNVERIFIED` | **CRITICAL CONFLICT:** ID is `paver-concrete-unit`, unit is `sq ft`, guide `benchmarksNote` says `$0.65–$2.40 per paver unit ($1.25 typ)` (~`$5.63/sq ft`!), and `paverPatio.ts` bills net area without waste! | **CLARIFY UNIT/ID & FIX GUIDE + ENGINE** | Sample concrete paver pricing per **sq ft** across tumbled/architectural/holland lines; update guide text to match `sq ft` unit cleanly. |
| 14 | `polymeric-sand-50lb` | Polymeric Jointing Sand | `$24.00 / $34.00 / $48.00` (`50-lb bag`) | `UNVERIFIED` | Market packs vary (`40-lb` vs `50-lb` bags; wide variation between basic vs heavy-duty poly sand). | **RE-VERIFY & RETAIN** | Verify retail 50-lb (or 40-lb) polymeric sand bag prices & coverage specs. |
| 15 | `mulch-bulk-yard` | Bulk Shredded Hardwood Mulch | `$30.00 / $42.00 / $58.00` (`cubic yard`) | `UNVERIFIED` | Excludes `$40–$90` delivery drop fee; `mulch.ts` costs fractional yards while BOM rounds whole yards. | **RE-VERIFY & CLARIFY DELIVERY** | Sample landscape supply yards for triple-shredded hardwood / dyed / cedar bulk mulch; clarify pickup vs delivered basis. |
| 16 | `mulch-bag-2cuft` | Mulch (2 cu ft Retail Bag) | `$3.25 / $4.50 / $6.25` (`2 cu ft bag`) | `UNVERIFIED` | Seasonal promotional pricing (spring $2/bag sales vs $4.50–$6 regular shelf price) makes range wide; `3 cu ft` bags displayed in UI have no price benchmark. | **RE-VERIFY & ADD `mulch-bag-3cuft`** | Sample regular-price & promotional 2 cu ft and 3 cu ft retail bags. |
| 17 | `gravel-crushed-stone-ton` | Crushed Stone / #57 Gravel | `$35.00 / $52.00 / $75.00` (`ton`) | `UNVERIFIED` | Reused for all 4 stone types (`crushed-stone`, `pea-gravel`, `dense-grade`, `decomposed-granite`) AND `paverPatio.ts` base rock; pea gravel & decomposed granite often cost more per ton than #57 limestone/crusher run. | **RE-VERIFY & CONSIDER VARIANT NOTES/SKUs** | Sample landscape yard / quarry ton prices for #57 crushed stone, crusher run, washed pea gravel, and decomposed granite (+ delivery fee disclosure). |
| 18 | `sod-pallet` | Turfgrass Sod Pallet | `$180.00 / $260.00 / $380.00` (`pallet 450 sq ft`) + Labor `$0.35/$0.65/$1.15` | `UNVERIFIED` | `sourceNote` says *"Regional sod farm benchmarks"*; `sod.ts` multiplies fixed pallet price by `palletsToPurchase` even if user changes `palletCoverageSqFt` to `600` or `350`! | **RE-VERIFY & CONVERT TO $/SQ FT OR SCALE BY PALLET SIZE** | Sample cool-season (fescue/KBG) vs warm-season (Bermuda/St. Augustine/Zoysia) per-sq-ft and per-pallet prices; tie cost to actual purchased sq ft when pallet size varies. |
| 19 | `topsoil-bulk-yard` | Screened Loam Topsoil | `$26.00 / $38.00 / $54.00` (`cubic yard`) | `UNVERIFIED` | Excludes dump truck delivery fee (`$40–$80+`); screened topsoil vs compost-amended garden mix differs significantly. | **RE-VERIFY & RETAIN** | Sample landscape yard screened loam vs compost-blended garden soil per cubic yard. |
| 20 | `topsoil-bag-075` | Topsoil (0.75 cu ft Retail Bag) | `$2.49 / $3.79 / $5.29` (`0.75 cu ft bag`) | `UNVERIFIED` | UI highlights `1.0 cu ft` bags too, which have no benchmark. | **RE-VERIFY & ADD `1.0 cu ft` BENCHMARK OR SCOPE NOTE** | Sample retail 0.75 cu ft & 1.0 cu ft bagged topsoil / raised-bed soil prices. |
| 21 | `drywall-sheet-4x8` | 1/2" x 4' x 8' Standard Drywall | `$13.50 / $16.50 / $21.00` (`sheet`) + Labor `$1.10/$1.85/$2.80` | `UNVERIFIED` | Only covers 1/2" 4×8; `4×12` sheets priced inconsistently via `1.5×` UI hack in `DrywallCalculatorPage.tsx` (ignored by `drywall.ts` `costEstimate`); excludes 5/8" Type X. | **RE-VERIFY & ADD `4x12` / `5/8"` BENCHMARKS** | Sample 1/2" 4×8, 1/2" 4×12, and 5/8" Type X retail gypsum board prices + hanging/finishing Level 4 labor. |
| 22 | `drywall-joint-compound-bucket` | All-Purpose Joint Compound | `$16.00 / $21.00 / $28.00` (`4.5-gal bucket`) | `UNVERIFIED` | Reasonable range conceptually, needs current retail SKU confirmation (USG Sheetrock Plus 3 / All Purpose 4.5-gal pail). | **RE-VERIFY & RETAIN** | Sample premixed 4.5-gal all-purpose & lightweight joint compound buckets. |
| 23 | `drywall-accessories-kit` | Drywall Screws & Joint Tape Pack | `$15.00 / $25.00 / $40.00` (`kit allowance`) | `UNVERIFIED` | **SPLIT / REPLACE:** Fixed flat `$25` per project breaks scaling for large basements/additions AND triggers fake `0.35` / `0.65` multiplier mismatch in `DrywallCalculatorPage.tsx`. | **SPLIT / REPLACE** (`drywall-tape-roll-500ft` + `drywall-screws-lb`) | Replace flat kit with per-roll tape (`500'`) and per-lb/5-lb box drywall screw benchmarks used identically by `drywall.ts` and UI BOM. |
| 24 | `fence-post-4x4x8` | 4" x 4" x 8' PT Pine Post | `$9.50 / $13.75 / $18.50` (`post`) | `UNVERIFIED` | Used for `4'`, `6'`, AND `8'` tall fences (`8'` fence cannot use an `8'` post!). | **RE-VERIFY & ADD `10'`/`12'` POST BENCHMARKS** | Sample PT ground-contact (UC4A) 4×4×8, 4×4×10, and 4×4×12 post prices. |
| 25 | `fence-rail-2x4x8` | 2" x 4" x 8' PT Backer Rail | `$5.25 / $7.50 / $10.50` (`rail`) | `UNVERIFIED` | Used even when `postSpacingFeet = 6` (`fenceMaterial.ts`). | **RE-VERIFY & CLARIFY RAIL LENGTH / ADD `6'` OR `12'` NOTE** | Sample PT 2×4×8 (and cedar/6' rail options if supported). |
| 26 | `fence-picket-dogear` | 1" x 6" x 6' Dog-Ear Picket | `$1.95 / $2.85 / $4.25` (`picket`) | `UNVERIFIED` | Used identically for `4'`, `6'`, and `8'` fence heights and `1×4` (`3.5"`) vs `1×6` (`5.5"`) picket widths! | **RE-VERIFY & ADD HEIGHT/WIDTH SCALING** | Sample 1×6×6, 1×6×8, 1×4×6 PT pine vs Western Red Cedar pickets. |
| 27 | `deck-board-composite-lf` | Composite Decking Board | `$2.25 / $4.50 / $8.50` (`linear foot`) + Labor `$18/$30/$50` (`sq ft`) | `UNVERIFIED` | **SCOPE/LABEL MISMATCH:** `deckMaterial.ts` uses composite LF prices while BOM says `"Nominal 6\" boards"`, `HomePage.tsx` shows PT pine, UI adds unpriced PT floor joists (`'framing-joist-lumber'`), and labor covers full structural build while materials only cover surface boards! | **SPLIT MATERIAL + FIX LABOR SCOPE** | Add `deck-board-pt-lf` (5/4×6 PT pine), `framing-joist-lumber` (e.g. PT 2×8/2×10 per LF), and `deck-fasteners-box`; separate deck *resurfacing* labor vs *full structural build* disclaimer. |
| 28 | `roofing-architectural-square` | Architectural Shingles | `$105.00 / $135.00 / $185.00` (`roofing square`) + Labor `$250/$420/$650` | `UNVERIFIED` | `roofing.ts` ignores `bundlesPerSquare` (`4` or `5`) in material pricing; note recent roofing supply inflation often places GAF/OC mid-tier shingles around $35–$50/bundle ($105–$150+/sq) and installed turnkey roof tear-off+replace varies widely by pitch/region. | **RE-VERIFY & FIX BUNDLE SCALING** | Sample major shingle lines (per bundle & per square) for 3-bundle architectural vs 4–5 bundle designer shingles; document exclusions (ridge cap, starter, drip edge, I&W shield). |
| 29 | `roofing-synthetic-underlayment-roll` | Synthetic Underlayment (10-sq Roll) | `$65.00 / $95.00 / $145.00` (`roll 1000 sq ft`) | `UNVERIFIED` | Claim of 10 squares *"with lap allowance"* conflicts with `recommendedArea / 1000` gross division if gross roll is 1,000 sq ft. | **RE-VERIFY & CLARIFY GROSS VS NET ROLL COVERAGE** | Sample retail/distributor 10-square synthetic rolls (standard vs heavy slip-resistant). |

---

## 4. Missing Benchmarks Needed to Eliminate Silent Fallbacks & UI Hacks

| Proposed ID | Used By | Why Needed |
|---|---|---|
| `flooring-laminate` | `flooring.ts` | Eliminates silent mapping of Laminate flooring to LVP price benchmark. |
| `paint-ceiling-flat-gallon` | `paint.ts` | Ceiling paint is priced lower than premium scrubbable wall paint; supports separate ceiling/wall cost accuracy. |
| `paint-primer-pva-gallon` | `paint.ts` (optional) | Supports new drywall / dramatic color-change primer planning mentioned in guides & notices. |
| `drywall-sheet-4x12` | `drywall.ts` | Eliminates `1.5×` UI-only hack and aligns BOM with `costEstimate`. |
| `drywall-tape-roll-500ft` & `drywall-screws-lb` | `drywall.ts` | Replaces flat `$25` `drywall-accessories-kit` so fastener/tape costs scale accurately with square footage. |
| `deck-board-pt-lf`, `framing-joist-lumber`, `deck-fasteners-box` | `deckMaterial.ts` | Fixes nonexistent IDs referenced in `DeckMaterialCalculatorPage.tsx` and aligns PT pine vs composite options. |
| `gravel-bag-50lb`, `mulch-bag-3cuft`, `topsoil-bag-1cuft` | `gravel.ts`, `mulch.ts`, `topsoil.ts` | Supports retail bag formats already calculated and displayed in UI cards. |
| `fence-post-4x4x10` / `fence-picket-8ft` (or scaled factors) | `fenceMaterial.ts` | Prevents pricing an 8-ft fence with 8-ft posts and 6-ft pickets. |

---

## 5. Recommended Phase 2B Price Governance Protocol

1. **No Synthetic Dates:** Never update `lastReviewedDate` globally with a batch date unless every modified record was genuinely checked on that date.
2. **Transparent Labeling:** Update `CostEstimateCard.tsx`, `AboutPage.tsx`, `MethodologyPage.tsx`, `AssumptionsList.tsx`, and `GuidePage.tsx` to use consistent terminology: **"Illustrative US National Planning Estimates (Verified As Of [Date])"**—eliminating contradictory claims of *"regional planning benchmarks"* and *"local benchmark pricing"*.
3. **Document Exclusions Explicitly:** Every `CostEstimateCard` should render the `provenance.exclusions` chips/list cleanly (taxes, delivery fees, minimum-load surcharges, waste disposal, specialty fasteners, permits) so homeowners never mistake a raw material subtotal for an out-the-door contractor bid.

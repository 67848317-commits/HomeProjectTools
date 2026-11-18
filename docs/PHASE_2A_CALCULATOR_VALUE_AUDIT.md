# Phase 2A — Calculator Value Audit (All 15 Calculators & Engines)

**Project:** Home Project Planner (`https://homeprojectplanner.org/`)  
**Files Audited:** `src/data/calculators.ts`, `src/scripts/calculators/*.ts`, `src/pages/*CalculatorPage.tsx`, `src/components/calculator/*.tsx`, `src/pages/HomePage.tsx`  
**Phase:** 2A (Audit & Planning — No Calculator Logic or UI Modified)

---

## Executive Summary

All 15 calculators implement a cohesive **3-Stage Deterministic Estimating Model** (`Stage 1: Net Geometry` → `Stage 2: Jobsite Allowance` → `Stage 3: Commercial Packaging Ceiling`) backed by clean pure functions in `src/scripts/calculators/` and structured Bill-of-Materials + Cost Estimate displays.

However, deep code inspection uncovered **multiple high-impact functional bugs, silent pricing fallbacks, BOM/Cost card discrepancies, and missing practical decision helpers** that directly reduce real-world estimating accuracy:

- **1 Dead Input Bug:** `TileCalculatorPage.tsx` collects `groutJointWidthInches`, **but `tile.ts` never reads it!**
- **6 Pricing / BOM Parity Bugs:** `paverPatio.ts` (bills net area without waste + unit mismatch), `roofing.ts` (ignores `bundlesPerSquare` in price), `drywall.ts` (UI BOM totals contradict `costEstimate` + flat `$25` kit), `deckMaterial.ts` (surface-board cost paired with full turnkey structural deck labor + broken UI price IDs), `flooring.ts` (`laminate` silently priced as LVP), `fenceMaterial.ts` (always prices 8' posts, 8' rails, 6' pickets regardless of height/spacing).
- **Cross-Tool & Showcase Contradictions:** `fenceMaterial.ts` (`1.5` 60-lb bags/post) conflicts with `concretePostHole.ts` (`3.1` 60-lb bags/post at default `10"×36"`), and `HomePage.tsx` hero/showcase cards display numbers (`28` deck boards, `56` roof bundles, `#30` felt, `10%` mulch buffer) that do not match the live engines (`29` deck boards, `57` bundles, synthetic underlayment, max `5%` mulch preset).

---

## Evaluation Criteria Applied to All 15 Calculators

1. **Mathematical Accuracy & Edge Cases**
2. **Real-World Usability & Missing Practical Parameters**
3. **Output Clarity (BOM, Purchasing Units & Cost Range)**
4. **Input Validation & Bounds**
5. **Alignment Between Calculator, Engine & Guide**
6. **Helpful Decision-Support Elements (Beyond Basic Math)**
7. **Known Bugs / Specific Phase 2B Upgrades**

---

## Individual Calculator Audits (1–15)

### 1. Flooring Calculator (`flooring-calculator`)
- **1. Math & Edge Cases:** Sound net area → `applyWaste` → `ceilToPackage` cartons + 100 sq ft underlayment rolls. Edge case: does not support deducting islands/cabinets or adding multi-room areas.
- **2. Usability / Missing Params:** Includes `flooringType` (`lvp`, `engineered-hardwood`, `laminate`), `cartonCoverage`, `wastePercentage`, and `includeUnderlayment`. Missing: **transition strips / reducers / stair-nose** count and **attic-stock spare box** toggle (currently only a notice text, not added to takeoff).
- **3. Output Clarity:** `ThreeWayBreakdown`, `BillOfMaterialsTable`, and `CostEstimateCard` clearly separate net area, waste area, and purchased carton sq ft + spare cushion.
- **4. Validation & Bounds:** Clean `length > 0`, `width > 0` checks (`min 1`, `max 500`); `cartonCoverage` clamped `>= 1` (`UI 5–60`).
- **5. Alignment:** **CONFLICT:** UI & guide treat Laminate as a distinct option, **but `flooring.ts:76` maps `laminate` to `'flooring-lvp'` pricing.**
- **6. Decision Support:** Underlayment toggle + spare carton reminder are helpful; would benefit from a quick **Room + Closet / Multi-Zone Area Adder** or spare-box cost toggle.
- **7. Bugs & Phase 2B Rank:** **Medium Priority** — Add `'flooring-laminate'` benchmark; add optional multi-area/closet quick-add and transition molding helper.

### 2. Tile & Grout Calculator (`tile-calculator`)
- **1. Math & Edge Cases:** Tile count and commercial box rounding are accurate. **CRITICAL MATH GAP:** Thinset is hardcoded at `50 sq ft / 50-lb bag`, and grout uses a crude binary `<= 4"` tile check (`80` vs `150 sq ft / 25-lb bag`), completely ignoring joint width and tile thickness!
- **2. Usability / Missing Params:** Exposes `tileLengthInches`, `tileWidthInches`, `boxCoverageSqFt`, `groutJointWidthInches`, and `wastePercentage`. Missing: **tile thickness** (`1/4"`, `3/8"`, `1/2"`), **trowel notch size** (auto-derived from max tile edge or selectable), and **backer board / uncoupling membrane**.
- **3. Output Clarity:** BOM lists Tile Boxes, Thinset Bags, and Grout Bags clearly.
- **4. Validation & Bounds:** Checks `area > 0` and `tile dims > 0`; `boxCoverage` clamped `>= 1`.
- **5. Alignment:** **CRITICAL DEAD-INPUT BUG:** `TileCalculatorPage.tsx` renders `groutJointWidthInches` selector (`1/16"` to `1/4"`), **but `tile.ts` never reads `inputs.groutJointWidthInches`!** Also UI/guide warn that `12×24` LFT tile drops thinset yield to `30–40 sq ft/bag`, while engine still outputs `50 sq ft/bag`.
- **6. Decision Support:** Adding live **Sanded vs. Unsanded / High-Performance Grout Trigger** (`<= 1/8"` vs `> 1/8"`) and **Recommended Trowel Size** (`>= 15"` edge → `1/2"×1/2"` trowel + back-butter) would deliver instant contractor value.
- **7. Bugs & Phase 2B Rank:** **HIGHEST PRIORITY (#1 Bug Fix)** — Wire `groutJointWidthInches` + tile thickness formula into `tile.ts`; adjust thinset coverage dynamically by tile size/trowel notch.

### 3. Interior Paint Calculator (`paint-calculator`)
- **1. Math & Edge Cases:** Wall perimeter × height minus openings (capped at 60% of gross wall area), multiplied by coats, divided by coverage, rounded to gallons. Ceiling hardcoded to **1 coat**.
- **2. Usability / Missing Params:** Includes `includeCeiling`, `doorCount`, `windowCount`, `coatCount` (`1/2/3`), `coveragePerGallon`. Missing: **ceiling coat count** (1 vs 2), **dedicated PVA primer coat toggle**, **surface texture adjustment** (smooth vs knockdown), and **5-gallon pail bulk comparison**.
- **3. Output Clarity:** Clean wall vs ceiling gallon BOM; **prices both wall and ceiling at the same wall-paint price (`$48/gal`)**.
- **4. Validation & Bounds:** Clean `length/width/height > 0` validation; `coverage >= 100`.
- **5. Alignment:** **CONFLICT:** `CategoryHubPage.tsx:44` claims *"5-gallon pail comparison"*, which does not exist in `paint.ts` or `PaintCalculatorPage.tsx`!
- **6. Decision Support:** High-impact upgrade: auto-calculate **5-gallon bucket + 1-gallon can mix** whenever `totalWallGallons >= 4` (with verified 5-gal savings), plus optional **PVA Primer** row.
- **7. Bugs & Phase 2B Rank:** **High Priority** — Implement 5-gallon pail comparison, ceiling coat toggle + flat ceiling price, and optional primer toggle.

### 4. Concrete Slab Calculator (`concrete-slab-calculator`)
- **1. Math & Edge Cases:** Exact volume `L × W × (T/12) / 27`, waste once, `ceilToPackage` for 80-lb (`0.60` cu ft) & 60-lb (`0.45` cu ft) bags.
- **2. Usability / Missing Params:** Exposes customizable `yield80lbCuFt` & `yield60lbCuFt` in Advanced settings. Missing: **Preferred pour method selector** (`80-lb bags` vs `60-lb bags` vs `Ready-Mix`) and **bag-pallet breakdown** (`42` or `56` bags/pallet).
- **3. Output Clarity:** **BOM/PRICING GAP:** `billOfMaterials` ONLY shows `80-lb bags` even when `isReadyMixRecommended === true` (`>= 1.5 yd³`) and `costEstimate` switches to `readyMixCost`! Also `readyMixCost` multiplies fractional yards (`1.6 yd³ × $165 = $264`) without warning on minimum-order (`3–4 yd³`) / short-load surcharges (`$100–$250`).
- **4. Validation & Bounds:** Validated positive dimensions; yields clamped `>= 0.4` / `>= 0.3`.
- **5. Alignment:** Consistent with guide; `MethodologyPage.tsx:104` understates waste preset range (`5–10%` vs actual `5/10/15%`).
- **6. Decision Support:** Adding a **Total Slab Weight & Mixing Effort / Short-Load Break-Even Comparison** (`80-lb` vs `60-lb` vs `Ready-Mix incl. short-load note`) would make 1.5–4 yd³ slab decisions dramatically clearer.
- **7. Bugs & Phase 2B Rank:** **High Priority** — Sync BOM rows with 60-lb / Ready-Mix mode and add explicit short-load fee disclosure card for `1.5–3.5 yd³` pours.

### 5. Concrete Post Hole Calculator (`concrete-post-hole-calculator`)
- **1. Math & Edge Cases:** Exact cylinder volume minus post displacement (`4x4`, `6x6`, `2.375"` pipe, `none`), plus waste. Includes clever **physical geometry validation** (`holeDiameter > postDiagonal`).
- **2. Usability / Missing Params:** Missing **adjustable bag yield** (`0.60`/`0.45` hardcoded unlike `concreteSlab.ts`), **60-lb vs 80-lb BOM selection** (UI computes 60-lb bags, BOM only lists 80-lb bags), and **frost-depth / structural pier warning** differentiating fence posts vs deck footings.
- **3. Output Clarity:** Very clear per-hole vs total volume and cylinder vs displacement cards.
- **4. Validation & Bounds:** Excellent `IMPOSSIBLE_GEOMETRY` error prevents negative/zero collar width.
- **5. Alignment:** **CROSS-TOOL CONFLICT:** `concretePostHole.ts` at `10"×36"` yields `3.1` × 60-lb bags/post, contradicting `fenceMaterial.ts`'s hardcoded `1.5` × 60-lb bags/post!
- **6. Decision Support:** Adding a **Gravel Drainage Base Calculator** (2–3" crushed stone per hole) and quick **Post-Hole Size Presets** (`4' fence 8"×24"`, `6' fence 10"×36"`, `Gate/8' fence 12"×42"`) would unify it with `fenceMaterial.ts`.
- **7. Bugs & Phase 2B Rank:** **Medium-High Priority** — Expose bag yields & 60/80-lb choice in BOM; reconcile presets with Fence calculator.

### 6. Mulch Calculator (`mulch-calculator`)
- **1. Math & Edge Cases:** Standard `L × W × (D/12) / 27` + settling %.
- **2. Usability / Missing Params:** Exposes `2"`, `3"`, `4"` depth presets and custom depth. Missing: **multi-bed sum** or **irregular/oval shape selector** (rectangular only, though guide explains measuring irregular beds), and **top-dress vs new bed** preset (`1"`–`1.5"` refresh).
- **3. Output Clarity:** **INCONSISTENCIES:** (a) UI highlights `3.0 cu ft` bags (`bags3cuftToPurchase`), **but `prices.ts` has no 3.0 cu ft bag price**; (b) `mulch.ts` pricing flips to bulk at `bags2cuft <= 20`, notice flips at `> 25`, UI card recommends bulk at `>= 2 cu yds` (`27` bags), guide card says `3+ yards`; (c) `bulkCost` uses fractional yards while BOM rounds `ceil` yards.
- **4. Validation & Bounds:** Positive dimension checks.
- **5. Alignment:** **CONFLICT:** `MethodologyPage.tsx:103` states `10–15%` settling and `HomePage.tsx` showcase states `10%` buffer, while `calculators.ts` only offers `0%` and `5%`!
- **6. Decision Support:** **Vehicle Payload & Cost Break-Even Comparator** (showing exact bag weight `bags × 35–40 lbs` vs bulk + typical `$40–$80` delivery fee) directly answers the shopper's main buying dilemma.
- **7. Bugs & Phase 2B Rank:** **Medium-High Priority** — Reconcile `5%/10%/15%` settling options, unify break-even threshold, align `HomePage`/`MethodologyPage`, and price `3.0 cu ft` bags.

### 7. Gravel & Crushed Stone Calculator (`gravel-calculator`)
- **1. Math & Edge Cases:** Volume × density (`1.40`, `1.45`, `1.55`, `1.40` tons/yd³) + compaction buffer + 50-lb bag conversion (`40` bags/ton).
- **2. Usability / Missing Params:** `stoneType` presets work well; **missing user-editable custom density override** (falsely claimed as user-adjustable by `MethodologyPage.tsx:151`!) and **missing loose-vs-compacted distinction** for dense-grade crusher run.
- **3. Output Clarity:** **PRICING GAP:** Calculates `bags50lbToPurchase` and displays a Bagged vs Bulk comparison card, **but `prices.ts` lacks a 50-lb gravel bag benchmark**, so even a tiny 4×4 firepit pad (`0.2` tons = `8` bags) prices as bulk quarry tonnage (`$10`) instead of `8 × $6 = $48` retail bags!
- **4. Validation & Bounds:** Clean positive checks.
- **5. Alignment:** **CONFLICT:** `MethodologyPage.tsx:149` states `1.35 tons/yd³` for pea gravel vs `1.45` in `gravel.ts` & UI & guide.
- **6. Decision Support:** Depth Impact callout (`2"`, `4"`, `6"`) is genuinely useful! Adding **Vehicle/Bag Break-Even** (`gravel-bag-50lb` vs bulk + delivery fee) completes it.
- **7. Bugs & Phase 2B Rank:** **Medium Priority** — Fix `MethodologyPage.tsx` density/adjustability text, expose custom density in Advanced settings, add `50-lb` bag benchmark for small projects.

### 8. Sod Roll & Pallet Calculator (`sod-calculator`)
- **1. Math & Edge Cases:** Net area + waste % → `ceil` pallets + `10 sq ft` rolls.
- **2. Usability / Missing Params:** Advanced `palletCoverageSqFt` setting (`350–600`). Missing: **slab sod option** (`2.67` sq ft/slab for southern warm-season turf) and **custom deduction input** (patio/beds inside a rectangular yard).
- **3. Output Clarity:** **PRICING BUG:** `sod.ts:67` multiplies `palletsToPurchase` by fixed `sod-pallet` (`450 sq ft` benchmark `$260`), **ignoring custom `palletCoverageSqFt`!** Changing pallet size from `450` to `600` changes pallet count without adjusting price per sq ft!
- **4. Validation & Bounds:** **MINOR MISMATCH:** UI `min={350}`, `calculators.ts` `min: 400`, `sod.ts` `Math.max(200, ...)`.
- **5. Alignment:** Good perishability wording alignment after Phase 4 cleanup.
- **6. Decision Support:** Clear pallet vs roll spare-footage comparison and estimated pallet weight warning (`1,500–3,000 lbs`).
- **7. Bugs & Phase 2B Rank:** **Low-Medium Priority** — Scale pallet cost proportionally by `(palletCoverage / 450)` or $/sq ft benchmark; align min/max bounds (`350–600`).

### 9. Drywall Sheet & Mud Calculator (`drywall-calculator`)
- **1. Math & Edge Cases:** Gross walls + optional ceiling minus doors (`21`) & windows (`15`) → waste % → `4×8` & `4×12` sheets + mud/tape/screws. **EDGE CASE BUG:** No 60% deduction cap like `paint.ts` (large opening count collapses net area to `10` sq ft).
- **2. Usability / Missing Params:** Has `includeCeiling` and UI toggle `preferredSheetSize` (`4×8` vs `4×12`). Missing: **panel thickness/type** (`1/2" Standard` vs `5/8" Type X Fire-Rated` vs `Moisture-Resistant`), **corner bead linear footage** estimator, and **`4×10` / `54"` wide** sheet option for 9-ft walls.
- **3. Output Clarity:** **CRITICAL BOM/COST MISMATCH:** `DrywallCalculatorPage.tsx` constructs `companionBOM` with custom math (`1.5×` for 4×12 sheets, `0.35×` kit for tape rolls, `0.65×` kit for screws), while **`CostEstimateCard` displays `drywall.ts` totals which ONLY price `4×8` sheets + mud + a flat `$25` kit (`quantity = 1`)!** Thus, the BOM table prices do NOT sum to the Cost Estimate Card!
- **4. Validation & Bounds:** Positive dimension checks.
- **5. Alignment:** Engine vs UI sheet-size & accessory pricing mismatch; verify mud/screw coverage (`400` / `300` sq ft) against USG/GA-216 TDS in Phase 2B.
- **6. Decision Support:** The `4×8` vs `4×12` handling comparison card (weight ~`52` vs `78` lbs, stairwell/hallway warning, `-33%` butt joints) is high-value.
- **7. Bugs & Phase 2B Rank:** **HIGH PRIORITY (#2 Bug Fix)** — Move `preferredSheetSize` into `calculateDrywall()`, split `drywall-accessories-kit` into per-roll tape + per-lb screws in `prices.ts`, add `drywall-sheet-4x12` & `5/8"` Type X toggle, and cap opening deductions consistently with `paint.ts`.

### 10. Deck Board & Framing Estimator (`deck-material-calculator`)
- **1. Math & Edge Cases:** Board rows `ceil(width * 12 / 5.625)`, linear feet, whole stock sticks (`12/16/20`), joists `ceil(length * 12 / spacing) + 1`, fasteners `rows * joists * 2 * 1.10`.
- **2. Usability / Missing Params:** Missing **board material selector** (`PT 5/4×6 Pine` vs `Composite`), **beam / post / stair / guardrail exclusions clarity in cost**, and **hidden clip vs face screw** option.
- **3. Output Clarity:** **CRITICAL SCOPE & PRICING MISMATCH:**
  - `deckMaterial.ts` BOM says `"Nominal 6\" boards"` and prices **`deck-board-composite-lf`** (`$2.25/$4.50/$8.50/lf`), while pairing surface-board-only material cost with **`$18/$30/$50` sq ft turnkey full-deck construction labor** (including footings, framing, and railings!).
  - `DeckMaterialCalculatorPage.tsx` manually appends floor joists (`benchmarkPriceId: 'framing-joist-lumber'`) and fasteners (`benchmarkPriceId: 'deck-fasteners-box'`), **neither of which exists in `prices.ts`**, leaving unpriced BOM rows!
- **4. Validation & Bounds:** Clean positive checks.
- **5. Alignment:** **SHOWCASE MISMATCH:** `HomePage.tsx` Deck showcase card (`16×12`) displays `5/4x6 Pressure-Treated Pine`, **`28 Surface Boards`**, and `$1,100–$1,500`, whereas `deckMaterial.ts` at `16×12` returns **`29 Boards`** (`26 rows × 16' = 416 lf × 1.10 = 457.6 lf / 16' = 28.6 → ceil = 29`!) and composite pricing `$2,088` typical materials!
- **6. Decision Support:** Stock-length (`12' / 16' / 20'`) board comparison and prominent IRC structural non-engineering banner are strong.
- **7. Bugs & Phase 2B Rank:** **HIGH PRIORITY (#3 Bug Fix)** — Add PT Wood vs Composite board selector & real price benchmarks, add framing joist/fastener benchmarks or explicitly scope labor vs materials cleanly, and fix `HomePage.tsx` showcase (`28` → `29` boards).

### 11. Wood Privacy Fence Calculator (`fence-material-calculator`)
- **1. Math & Edge Cases:** Bays `ceil(len / spacing)`, posts `bays + 1 + gates * 2`, rails `bays * (2 or 3)`, pickets `(len * 12) / width * (1 + waste)`, concrete `ceil(posts * 1.5)`.
- **2. Usability / Missing Params:** Allows `4/6/8'` height, `6/8'` spacing, `5.5"/3.5"` pickets, walk gates. Missing: **post hole / frost depth selector**, **gate width deduction** clarity (does `+2` posts overlap line posts?), **cedar vs PT pine** choice, and **contractor labor benchmark**.
- **3. Output Clarity:** **PRICING DIMENSION BUGS:** Always prices `fence-post-4x4x8`, `fence-rail-2x4x8`, and `fence-picket-dogear` (`6'`) even when user chooses an **`8' tall fence`** (cannot use an `8'` post for an `8'` fence!) or **`6' post spacing`** (`2×4×6'` rails)!
- **4. Validation & Bounds:** Clean `length > 0` check.
- **5. Alignment:** **CONFLICT WITH `concretePostHole.ts`:** Hardcodes `1.5` 60-lb bags/post (~`24"` hole), whereas `concretePostHole.ts` defaults to `3.1` 60-lb bags/post (`10"×36"` hole).
- **6. Decision Support:** Top banner cross-linking to `/calculators/concrete-post-hole-calculator` is very helpful, though users notice the bag count discrepancy immediately.
- **7. Bugs & Phase 2B Rank:** **High Priority** — Scale post length (`8'`/`10'`/`12'`), picket height (`4'`/`6'`/`8'`), and concrete bags per post by fence height & frost zone; clarify gate bay post math.

### 12. Roofing Shingle & Bundle Calculator (`roofing-calculator`)
- **1. Math & Edge Cases:** Exact Pythagorean pitch multiplier + complexity waste + roofing squares (`100` sq ft) + bundles + `1,000` sq ft underlayment rolls.
- **2. Usability / Missing Params:** Includes `footprint`, `pitch`, `complexityWaste`, and `bundlesPerSquare` (`2–6`). Missing: **ridge/hip/eave linear feet** inputs (even optional) to estimate **ridge cap shingles, starter strips, drip edge, and ice & water shield**.
- **3. Output Clarity:** **PRICING BUG:** `roofing.ts:81` bills `roofingSquaresToPurchase` × fixed 3-bundle square price (`$135`), **so increasing `bundlesPerSquare` to `4` or `5` increases `shingleBundlesToPurchase` without changing cost!** Also `underlaymentRolls` divides `recommendedArea` by `1,000` gross sq ft while `prices.ts` says 10-square net lap coverage.
- **4. Validation & Bounds:** `footprint > 0`, `bundlesPerSquare` clamped `2–6`, `waste >= 5`.
- **5. Alignment:** **SHOWCASE MISMATCH:** `HomePage.tsx` Roofing showcase lists **`56 Bundles`** and **`#30 Asphalt Felt`**, whereas engine outputs **`57 Bundles`** (`ceil(2000 * 1.118 * 1.10 / 100) = 19 sq × 3` — wait let's note: at 1,500 footprint × 1.118 × 1.10 = 1,844.7 sq ft → `19` sq × 3 = `57` bundles!) and **`Synthetic Underlayment (10-sq)`**.
- **6. Decision Support:** Clear 3-stage breakdown and overhang reminder (`+1–2 ft` eaves/rakes).
- **7. Bugs & Phase 2B Rank:** **High Priority** — Fix `bundlesPerSquare` pricing formula, verify synthetic roll net coverage (`~900–950` vs `1,000`), add optional ridge/eave accessory estimator, and fix `HomePage.tsx` showcase (`56` → `57`, `#30 felt` → `Synthetic`).

### 13. Paver Patio & Sand Calculator (`paver-patio-calculator`)
- **1. Math & Edge Cases:** Multi-layer model (`pavers + waste`, `L+1 × W+1` base × depth × `1.55`, `1"` bedding sand, `70` sq ft/bag polymeric sand) is conceptually one of the strongest tools on the site.
- **2. Usability / Missing Params:** Includes patio dims, individual paver L×W, base depth (`4"`/`6"`), waste. Missing: **pattern type preset** (running bond vs herringbone / 45°), **total excavation depth + soil spoil cubic yards** readout, and **perimeter edge restraint + spikes (`2×(L+W)`)** takeoff!
- **3. Output Clarity:** **TWO CRITICAL BUGS:** (a) `paverPatio.ts:97` computes `paverCost = calculateCostRange(patioArea, ...)` **using net `patioArea` WITHOUT the 10–15% cut waste**, understating paver cost! (b) `prices.ts` uses `$/sq ft` while guide `benchmarksNote` says `$1.25 per paver unit` (~4.5× higher!).
- **4. Validation & Bounds:** Positive dimension checks.
- **5. Alignment:** Verify CMHA (ICPI) & ASTM C33 primary docs; soften UI subtitle `"ICPI Certified Installation Guidelines"` (`PaverPatioCalculatorPage.tsx:478`) to `"Industry Base & Bedding Best Practices"` unless verified.
- **6. Decision Support:** The **"Patio Layer Construction Guide"** card in the left column is great! Adding **Excavation Depth & Dirt Spoil Haul-Off Yards** + **Edge Restraint Linear Feet** would make it truly complete for DIYers.
- **7. Bugs & Phase 2B Rank:** **HIGH PRIORITY (#4 Bug Fix)** — Fix `paverCost` to include waste/purchased coverage; align guide pricing unit; add excavation spoil & edge-restraint LF outputs.

### 14. Topsoil & Garden Bed Calculator (`topsoil-calculator`)
- **1. Math & Edge Cases:** Clean area × depth ÷ 27 + settling % → bulk yards + `0.75` & `1.0` cu ft bags.
- **2. Usability / Missing Params:** Missing **application quick-presets** (`0.5"` lawn top-dressing, `3"` flower/seed prep, `6"–12"` raised garden bed) and **multi-bed multiplier** (e.g., `4` identical `4×8` raised beds).
- **3. Output Clarity:** **THRESHOLD & PRICING GAPS:** Cost switches to bulk at `bags075cuft > 25` (`0.69` yd³), UI recommends bulk at `> 1` yd³ (`36` bags), assumption says `> 1.5` yd³ (`54` bags); `1.0` cu ft bags have no benchmark price; `bulkCost` prices fractional yards while BOM rounds `ceil` yards.
- **4. Validation & Bounds:** Positive checks (`min 0.25"` depth).
- **5. Alignment:** Consistent with `MethodologyPage.tsx` (`10–15%` settling).
- **6. Decision Support:** Adding an **Estimated Soil Weight** metric (`~2,200 lbs/yd³` or `~40 lbs/0.75-cu-ft bag`) for truck/trunk loading safety would be immediately practical.
- **7. Bugs & Phase 2B Rank:** **Medium Priority** — Reconcile break-even thresholds, add depth presets & weight metric, add `1.0 cu ft` bag benchmark or clarify.

### 15. Baseboard & Trim Molding Calculator (`baseboard-trim-calculator`)
- **1. Math & Edge Cases:** Clean `2×(L+W) - doors×2.5` + miter waste % → `ceil` stock sticks (`8/12/16` ft).
- **2. Usability / Missing Params:** Missing **inside/outside corner count** (or complex layout presets), **optional shoe/quarter-round molding toggle**, **material tier** (MDF vs finger-joint pine vs PVC), and **finish nails / caulk tube** estimate.
- **3. Output Clarity:** `Stock-Length Comparison (8' vs 12' vs 16')` with spare linear feet & vehicle transport notes is very well done.
- **4. Validation & Bounds:** Clean positive checks.
- **5. Alignment:** Aligned with guide and `prices.ts`.
- **6. Decision Support:** Adding **Vehicle Length Compatibility + Optional Shoe Molding** (for LVP/hardwood retrofits) adds clear practical value.
- **7. Bugs & Phase 2B Rank:** **Low-Medium Priority** — Add optional shoe molding / corner-caulk note and pine/PVC material tier notes.

---

## Priority Ranking of Phase 2B Calculator & Engine Enhancements

| Rank | Calculator | Issue / Enhancement Summary | Impact Type |
|---|---|---|---|
| **1** | **Tile (`tile.ts`)** | Wire `groutJointWidthInches` (+ tile thickness) into grout formula; adjust thinset trowel yield by tile size (`12×24` LFT). | Correctness / Dead UI Input Fix |
| **2** | **Paver Patio (`paverPatio.ts`)** | Fix `paverCost` excluding waste; fix guide `$/unit` vs `$/sq ft` mismatch; add excavation spoil yd³ & edge-restraint LF. | Pricing Bug / Decision Value |
| **3** | **Drywall (`drywall.ts`)** | Unify UI BOM & engine `costEstimate`; price `4×12` sheets, tape rolls, and screw lbs dynamically instead of flat `$25` kit; add `5/8"` Type X option; cap deductions at 60%. | Pricing & BOM Parity Bug |
| **4** | **Deck (`deckMaterial.ts`)** | Fix composite vs PT pine mismatch; fix board-only materials vs turnkey structural deck labor mismatch; wire real joist/fastener price IDs; fix `HomePage` `28`→`29` boards. | Scope Integrity & Showcase Fix |
| **5** | **Roofing (`roofing.ts`)** | Scale shingle cost when `bundlesPerSquare != 3`; clarify gross vs net underlayment lap coverage; fix `HomePage` `56`→`57` bundles & `#30 felt`→`Synthetic`. | Pricing Bug & Showcase Fix |
| **6** | **Fence (`fenceMaterial.ts`)** | Scale post length (`8'`/`10'`/`12'`), rail price, picket height, and concrete bags by fence height & frost depth (reconcile with `concretePostHole.ts`). | Cross-Tool Consistency & Sizing |
| **7** | **Paint (`paint.ts`)** | Add 5-gallon pail comparison (promised in Category Hub), ceiling 2-coat toggle + flat ceiling price, and optional PVA primer row. | Missing Feature / Hub Promise |
| **8** | **Concrete Slab & Post Hole** | Add 60-lb/ready-mix BOM parity + short-load fee alert (`1.5–3.5 yd³`); expose bag yields in `concretePostHole.ts`. | Decision Clarity & Parity |
| **9** | **Flooring / Gravel / Mulch / Topsoil / Sod** | Dedicated `'flooring-laminate'` benchmark; add `50-lb` gravel, `3 cu ft` mulch, `1.0 cu ft` topsoil bag prices; fix `sod.ts` pallet-size pricing; reconcile Mulch/Topsoil thresholds & `MethodologyPage` contradictions. | Pricing Completeness & Consistency |

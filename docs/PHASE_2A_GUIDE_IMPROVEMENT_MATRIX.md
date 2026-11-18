# Phase 2A — Guide Improvement Matrix (All 15 Guides)

**Project:** Home Project Planner (`https://homeprojectplanner.org/`)  
**Files Audited:** `src/data/guides.ts`, `src/data/guides-phase4b2b.ts`, `src/data/guides-phase4b2d.ts`, `src/pages/GuidePage.tsx`  
**Phase:** 2A (Audit & Planning — No Published Guide Content Modified)

---

## Executive Summary & Systemic Guide Quality Findings

All 15 companion guides follow a structured `GuideDefinition` template (Overview → Three-Stage Methodology Box → Measurement Rules → Worked Example → Planning Rules → Cost Planning → Companion Calculator CTA → FAQs) and match each calculator 1:1. That structural discipline is a strong foundation, **but AdSense "Low Value Content" risk stems from four systemic weaknesses across the guide corpus:**

1. **Zero Cited Primary Sources or Standards Documentation:** Guides reference *"ICPI standards"*, *"ASTM C33"*, *"IRC span tables"*, and *"ANSI A118.4"*, yet none contain a verifiable **Technical References & Source Basis** section with standard identifiers, manufacturer TDS benchmarks, or verification dates (`UNVERIFIED` across all 15 guides).
2. **Template Repetition & Boilerplate Parity Gaps:** `GuidePage.tsx` line 207 repeats *"Home Project Tools follows this rigorous 3-stage model"* identically on every guide, and line 521 inaccurately promises *"local benchmark pricing"* when costs are unlocalized national estimates.
3. **Discoverability Gap (No `/guides` Index Page):** Header navigation (`Header.tsx` `#planning-guides`) only scrolls to 4 cards on the homepage, and `HomePage.tsx` `"Browse All 15 Guides"` routes to `/projects` rather than a dedicated `/guides` directory. Eleven of 15 guides have weak site-wide entry points.
4. **Guide-to-Engine & Pricing Discrepancies:** Several guides state rules or prices that contradict their companion calculator engine or `prices.ts` (most severely Paver Patio unit pricing, Gravel density vs `MethodologyPage`, Mulch bulk break-even, Tile grout joint width, and Fence concrete bags vs Post Hole depth).

Below is the **individual 8-dimension audit for every one of the 15 guides** (no filler word-count targets; focus is purely on practical decision value, technical accuracy, and primary-source verification).

---

## Evaluation Matrix — All 15 Guides

### 1. Flooring (`how-much-flooring-do-i-need`)
- **1. Current Strengths:** Clear separation of net room sq ft (`16×12 = 192`), 10% cut waste (`211.2`), and whole-carton rounding (`11 cartons = 220 sq ft`). Good practical rules for closets, stair treads, subfloor flatness (`3/16"` in `10 ft`), and attic-stock spare carton.
- **2. Missing Practical Info:** Does not explain how to handle **fixed vs pre-attached pad underlayment** when choosing LVP vs laminate, transition strips (T-molding, reducers, stair noses, quarter round) per doorway/run, or how plank width/length affects end-cut waste in narrow hallways.
- **3. Unsupported Assumptions (`UNVERIFIED`):** 10%/12%/15%/20% waste bands, `20 sq ft` default carton yield, `48-hour` acclimation rule (modern rigid SPC LVP often specifies 24–48h or temperature equilibrium rather than wood moisture acclimation), `3/16" per 10 ft` subfloor flatness tolerance.
- **4. Worked Example Improvements:** Add a short L-shaped room + closet worked addendum showing why diagonal/herringbone waste jumps from 10% to 15–20%, and show why Laminate vs LVP cost differs once Laminate pricing is split in Phase 2B.
- **5. Product-Specific Guidance Needed:** Explicit comparison matrix: Rigid Core SPC/WPC LVP (waterproof, often integrated pad) vs HDF Laminate (moisture-sensitive seams, usually requires vapor/acoustic pad) vs Engineered Hardwood (nail/staple/glue-down, species wear layer, humidity bands 35–55% RH).
- **6. Safety / Code / Scope Limits:** Clarify vapor-barrier/moisture testing over concrete slabs (calcium chloride / RH limits), wet-area warranty voids (steam mops, standing water under laminate), and door-undercut clearances.
- **7. Helpful Internal Links:** Link directly to `/calculators/flooring-calculator`, `/calculators/baseboard-trim-calculator` (plus `/guides/how-much-baseboard-do-i-need` for shoe molding/quarter round), and `/calculators/tile-calculator` for wet bath transitions.
- **8. Required External References (`UNVERIFIED`):** NWFA Installation Guidelines (engineered wood acclimation/flatness), ASTM F1869 / F2170 concrete moisture testing standards, 2–3 major LVP/laminate manufacturer installation manuals (LifeProof, Pergo, Shaw).

---

### 2. Tile (`how-much-tile-do-i-need`)
- **1. Current Strengths:** Strong explanation of tile box rounding, dye-lot/caliber stamping, diagonal/herringbone waste escalation, and keeping an unopened attic-stock box.
- **2. Missing Practical Info:** Fails to cover **wet-area waterproofing** (cement backer board vs uncoupling/waterproofing membrane vs liquid-applied membrane), **notch trowel size selection** by tile edge length, **clip/leveling systems** for large-format rectified porcelain (`12×24`+), and grout type selection (**unsanded vs sanded vs high-performance FA/epoxy** by joint width `1/16"` vs `>= 1/8"`).
- **3. Unsupported Assumptions (`UNVERIFIED`):** Fixed `50 sq ft` mortar coverage per 50-lb bag (contradicts its own large-format trowel note of `30–40 sq ft`), `80` vs `150 sq ft` grout coverage per 25-lb bag, and claiming grout joint width influences grout consumption when the calculator engine currently ignores `groutJointWidthInches`.
- **4. Worked Example Improvements:** Add concrete comparison showing a `12×12` bathroom floor (`1/4"×3/8"` trowel, `1/8"` joint) vs a `12×24` large-format floor (`1/2"×1/2"` trowel + back-buttering = ~35 sq ft/bag mortar, plus lippage leveling clips).
- **5. Product-Specific Guidance Needed:** Ceramic vs Porcelain (water absorption `<0.5%` porcelain requiring polymer-modified ANSI A118.4/A118.11/A118.15 thinset), natural stone/marble (white non-staining mortar + penetrating sealer), mosaic sheets (smaller trowel V-notch + high grout usage).
- **6. Safety / Code / Scope Limits:** Wet-shower waterproofing (ANSI A118.10), subfloor deflection requirements (`L/360` ceramic, `L/720` natural stone per TCNA), and movement/expansion joints at perimeters & changes of plane (silicone caulk instead of grout per TCNA EJ171).
- **7. Helpful Internal Links:** `/calculators/tile-calculator`, `/calculators/flooring-calculator` (adjacent rooms), `/calculators/drywall-calculator` (adjacent wall prep), `/calculators/paint-calculator`.
- **8. Required External References (`UNVERIFIED`):** TCNA Handbook (EJ171 movement joints, wet-area methods, deflection limits), ANSI A108.5 (mortar transfer) / A118.4 / A118.15, Mapei & Laticrete mortar/grout coverage datasheets.

---

### 3. Interior Paint (`how-much-paint-do-i-need`)
- **1. Current Strengths:** Good perimeter-minus-openings methodology (`21 sq ft` door, `15 sq ft` window), clear explanation of why dramatic color shifts or bare drywall need dedicated primer rather than wasting expensive topcoat.
- **2. Missing Practical Info:** Does not explain **5-gallon pail vs 1-gallon can** economics (especially since `CategoryHubPage.tsx` promises a 5-gallon pail comparison!), **sheen selection by room** (flat/matte ceilings & low-traffic bedrooms vs eggshell/satin living areas vs semi-gloss kitchens/baths/trim), or how textured walls (orange peel, knockdown, stucco) cut coverage by 20–35%.
- **3. Unsupported Assumptions (`UNVERIFIED`):** `350 sq ft/gal` benchmark, `21`/`15 sq ft` openings, `1-coat` ceiling refresh assumption (cannot be toggled to 2 coats in tool), `"Paint-and-Primer-in-One"` marketing caveats.
- **4. Worked Example Improvements:** Show a worked breakdown for **bare new drywall** (1 coat PVA primer at ~300 sq ft/gal + 2 coats finish paint + 2 coats flat ceiling paint) versus a **like-for-like color repaint** so users stop confusing primer vs topcoat math.
- **5. Product-Specific Guidance Needed:** Dedicated PVA drywall primer vs stain-blocking shellac/oil primer (water stains, knots, smoke), flat ceiling paint vs scrubbable matte/eggshell wall paint, urethane/alkyd trim enamels for baseboards/doors.
- **6. Safety / Code / Scope Limits:** EPA **RRP Lead-Safe** rule warning for homes built before **1978** before sanding/scraping existing paint; VOC/ventilation safety for oil/shellac primers.
- **7. Helpful Internal Links:** `/calculators/paint-calculator`, `/calculators/drywall-calculator` (plus `/guides/how-much-drywall-do-i-need` for new walls), `/calculators/baseboard-trim-calculator` (plus `/guides/how-much-baseboard-do-i-need`).
- **8. Required External References (`UNVERIFIED`):** PDCA Estimating Guide, Sherwin-Williams / Benjamin Moore product TDS (`sq ft/gal` & recoat times), EPA Lead Renovation, Repair and Painting (RRP) Program rule for pre-1978 housing.

---

### 4. Concrete Slab (`how-much-concrete-do-i-need-for-a-slab`)
- **1. Current Strengths:** Excellent warning on the `1.5 cu yd` hand-mixing threshold (`68+` 80-lb bags ≈ `5,440 lbs`), short-load ready-mix delivery surcharges (`<3–4 yd³`), drainage slope (`1/4" per ft`), and control joint overview.
- **2. Missing Practical Info:** Lacks clear guidance on **4-inch compacted gravel subbase** under exterior slabs, **vapor retarder (10–15 mil poly)** for interior/conditioned garage/shop slabs, **wire mesh vs #3/#4 rebar vs fiber mesh** reinforcement, concrete **strength grade (3000 vs 4000 vs 4500 PSI + air entrainment)** in freeze-thaw climates, and curing (wet cure / curing compound vs hot-weather cracking).
- **3. Unsupported Assumptions (`UNVERIFIED`):** `0.60` cu ft (`80-lb`) and `0.45` cu ft (`60-lb`) bag yields, `1.5 cu yd` ready-mix threshold, `$100–$250` short-load fee range, control joint spacing rules, `4"` patio vs `5–6"` driveway thickness.
- **4. Worked Example Improvements:** Explicitly reconcile how a small 10×12 patio slab (`1.63 yd³` with 10% buffer) triggers ready-mix recommendation AND explain what adding a typical short-load fee means compared to renting a volumetric mixer or palletized 80-lb bags with a drum mixer.
- **5. Product-Specific Guidance Needed:** Standard `4000 PSI` concrete vs high-early/fast-setting mixes (why NOT to use fast-setting mix for flatwork slabs!), air-entrained ready-mix (5–7% air) for freeze-thaw driveways/patios, volumetric concrete trucks (pay per poured yard with zero short-load fee in many metros).
- **6. Safety / Code / Scope Limits:** IRC minimum slab thickness (`3.5"` interior floors), frost-protected thickened-edge / monolithic footings for attached structures or garages, and concrete alkali skin-burn PPE notice (gloves/eye protection).
- **7. Helpful Internal Links:** `/calculators/concrete-slab-calculator`, `/calculators/gravel-calculator` (for subbase rock), `/calculators/paver-patio-calculator` (comparing poured slab vs interlocking pavers).
- **8. Required External References (`UNVERIFIED`):** ACI 302.1R / ACI 332 (Residential Concrete), NRMCA "Concrete in Practice" (ordering, control joints, curing, freeze-thaw air entrainment), Quikrete/Sakrete bag TDS, IRC R506.

---

### 5. Concrete Post Hole (`how-much-concrete-do-i-need-for-fence-posts`)
- **1. Current Strengths:** Clear explanation of cylindrical geometry minus post displacement, `3× post width` hole rule, frost heave risks, crowning concrete collar above grade, and gravel drainage pad below wood posts.
- **2. Missing Practical Info:** Needs clearer separation between **non-structural fence posts** vs **structural deck footing piers** (which require wider bearing footings / tube forms per tributary load, NOT `10"` holes!). Also needs guidance on **wet-set vs dry-pour ("no-mix") limits** (dry-pour risk in dry clay/high wind or structural posts) and **steel vs wood post rot** (`UC4A` vs `UC4B` ground-contact preservative retention).
- **3. Unsupported Assumptions (`UNVERIFIED`):** `3× post diameter` rule, `0.60` / `0.45` bag yields, `6"` below frost line rule, and conflict with `fenceMaterial.ts` (`1.5` 60-lb bags/post vs this guide's `2.3` 80-lb / `3.1` 60-lb bags at `10"×36"`).
- **4. Worked Example Improvements:** Explicitly include a side-by-side table showing `8"×24"` (mild climate 4-ft fence), `10"×36"` (6-ft privacy / moderate frost), and `12"×42"` (8-ft fence / northern frost zone) bags per post so homeowners understand why `fenceMaterial.ts` vs `concretePostHole.ts` differ!
- **5. Product-Specific Guidance Needed:** Standard 4000 PSI structural pre-mix (for structural piers/heavy gates) vs Fast-Setting concrete (convenient for non-structural line fence posts, lower early flexural tolerance if disturbed), paper Sonotube forms vs poured earth holes, post-base hardware vs direct-burial timber.
- **6. Safety / Code / Scope Limits:** Mandatory **811 Call Before You Dig** utility locate notice before augering; clear warning that deck piers require IRC R403/R507 footing sizing & building inspection rather than fence-post sizing.
- **7. Helpful Internal Links:** `/calculators/concrete-post-hole-calculator`, `/calculators/fence-material-calculator`, `/calculators/deck-material-calculator`, `/calculators/gravel-calculator` (drainage gravel).
- **8. Required External References (`UNVERIFIED`):** IRC R403.1.4 (Frost Depth), AWC DCA 6 (Deck Footings), Quikrete Standard vs Fast-Setting TDS, AWPA UC4A/UC4B treated lumber use category guide.

---

### 6. Paver Patio (`how-to-calculate-paver-patio-materials`)
- **1. Current Strengths:** Strong 4-layer anatomical cross-section explanation, clear `6"` base perimeter over-dig rule, warning against pre-compacting bedding sand, and dry-surface polymeric sand rule.
- **2. Missing Practical Info:** Missing **total excavation depth calculation** (`4" or 6" base + 1" sand + 2.375" paver = ~7.5"–9.5"` cut depth + spoil haul-off volume!), **geotextile fabric** separation between clay subgrade and aggregate base, **edge restraint & 10" spike** estimating (`perimeter LF`), **lift compaction** (2"–3" max lifts with plate compactor, not dumping 6" at once), and **open-graded permeable base** alternative.
- **3. Unsupported Assumptions (`UNVERIFIED`):** `"ICPI"` & `"ASTM C33"` citations without archived docs, hardcoded `1.55 tons/yd³` compacted density (loose-vs-compacted shrinkage unclarified), `70 sq ft / 50-lb bag` polymeric sand (insensitive to joint width or large-format slab pavers). **CRITICAL ERROR in `benchmarksNote`:** Claims `$0.65 to $2.40 per standard concrete paver unit ($1.25 typical)`, contradicting `prices.ts` (`$2.50/$4.50/$8.50 per sq ft`)!
- **4. Worked Example Improvements:** Correct `benchmarksNote` to match `/sq ft` pricing (and match the engine once `paverPatio.ts` waste-pricing bug is fixed); add a quick excavation spoil volume check (`~4.5 yd³` of dirt to remove for a `15×12` patio!).
- **5. Product-Specific Guidance Needed:** Standard tumbled/Holland `60mm` pedestrian pavers (`4×8`, `6×9`, modular 3-piece kits) vs `80mm` vehicular driveway pavers vs thin architectural porcelain outdoor pavers (pedestal or mortar-over-slab).
- **6. Safety / Code / Scope Limits:** Slope `1–2%` (`1/8"–1/4"` per ft) away from foundation walls, maintaining weep/siding clearance below door thresholds, and polymeric sand environmental/runoff cleanup before misting.
- **7. Helpful Internal Links:** `/calculators/paver-patio-calculator`, `/calculators/gravel-calculator`, `/calculators/concrete-slab-calculator` (comparing poured vs paver), `/calculators/topsoil-calculator` (perimeter grading).
- **8. Required External References (`UNVERIFIED`):** CMHA (formerly ICPI) Tech Spec 2 & Tech Spec 9, ASTM C33 (Concrete Sand) & ASTM C936 (Solid Concrete Interlocking Paving Units), Techniseal / Alliance Gator polymeric sand TDS.

---

### 7. Gravel (`how-much-gravel-do-i-need`)
- **1. Current Strengths:** Clear distinction between theoretical volumetric calculation and certified quarry scale-weight billing, moisture weight fluctuation warning, and clear `4"` vs `6"` depth impact.
- **2. Missing Practical Info:** Does not adequately guide **stone type selection by drainage vs compaction function** (why `#57` clean washed crushed stone drains water/retains voids without compacting tight like crusher run, why **pea gravel rolls underfoot** and fails as a structural driveway/paver base!), nor **geotextile separation fabric** over mud/clay to stop stone from sinking.
- **3. Unsupported Assumptions (`UNVERIFIED`):** Bulk densities (`1.40` / `1.45` / `1.55` / `1.40` tons/yd³ — plus `MethodologyPage` mismatch of `1.35`), compaction percentages (`10–20%`), driveway depth rules (`4–6"`), and `1.5 ton` bulk tipping point (note 50-lb bags cost ~$5–$7 each = **$200–$280/ton** vs $40–$65/ton bulk + delivery fee!).
- **4. Worked Example Improvements:** Compare a **20×10 `#57` crushed stone driveway** (needs drainage/clean look or over compacted crusher run base) vs **crusher run base**, explicitly showing compacted vs loose ordering considerations.
- **5. Product-Specific Guidance Needed:** Washed `#57` / `#67` angular stone (French drains, driveways) vs Crusher Run / Dense Grade / Road Base (stone+fines for hard-packed patio/shed bases) vs Pea Gravel / River Rock (decorative paths, play areas, dog runs — never steep driveways) vs Decomposed Granite (stabilized vs unstabilized garden paths).
- **6. Safety / Code / Scope Limits:** Dump truck overhead utility wire & branch clearance (`15–20 ft`), driveway curb/apron weight protection (loaded tri-axle truck weighs ~`50,000–70,000 lbs`!), and French drain perforated pipe / filter fabric considerations.
- **7. Helpful Internal Links:** `/calculators/gravel-calculator`, `/calculators/paver-patio-calculator`, `/calculators/concrete-slab-calculator`, `/calculators/concrete-post-hole-calculator`.
- **8. Required External References (`UNVERIFIED`):** State DOT / NSSGA aggregate gradation & bulk unit weight charts, ASTM C29 (Bulk Density of Aggregate), FHWA Gravel Roads / Residential Driveway Aggregate Maintenance Guide.

---

### 8. Mulch (`how-to-calculate-mulch`)
- **1. Current Strengths:** Great coverage of the `2"–3"` depth rule, tree-collar `"mulch volcano"` warning (`2–3"` bare collar), curved bed measurement, and payload/weight warning (`30–45 lbs` per moist `2 cu ft` bag).
- **2. Missing Practical Info:** Needs clearer explanation of **existing mulch depth measurement** (top-dressing `1"–1.5"` over existing un-decomposed mulch vs full `3"` new bed, avoiding `5"+` total suffocating mat!), **organic vs inorganic** tradeoffs (wood chips/bark vs pine straw vs rubber/rock near foundation walls for **termite/fire-wise clearance**), and weed-fabric downsides (how plastic/landscape fabric chokes soil biology and catches blowing weed seeds *on top* of the fabric within 2 years vs cardboard/compost).
- **3. Unsupported Assumptions (`UNVERIFIED`):** `5%` settling factor in engine vs `10–15%` in `MethodologyPage` and `10%` on `HomePage`; `2 cu yd` (`27` bags) vs `3+ yd` (`guide` card) vs `20` bags (`mulch.ts` pricing) bulk break-even.
- **4. Worked Example Improvements:** Align settling percentage and bulk break-even math identically with `mulch.ts` once reconciled in Phase 2B; show how seasonal `$2.00/bag` home-center sales shift the break-even point compared to `$50` bulk + `$65` dump delivery fee!
- **5. Product-Specific Guidance Needed:** Triple-shredded hardwood bark (stays put on mild slopes), cypress/cedar (slower decay, aromatic), pine bark nuggets (float/wash away in heavy rain slopes!), arborist wood chips (free/low-cost, high nitrogen-tie-up misconception clarified — only affects top 1/4" soil interface).
- **6. Safety / Code / Scope Limits:** **Wildfire / Ignition-Resistant Zone (WUI)** warning (avoid combustible wood mulch within 0–5 feet of siding/decks in high-wildfire regions; use gravel/rock instead), and termite inspection clearance (`6"` below siding/sill plate). Also warn that **cocoa hull mulch is toxic to dogs**.
- **7. Helpful Internal Links:** `/calculators/mulch-calculator`, `/calculators/topsoil-calculator`, `/calculators/sod-calculator`, `/calculators/gravel-calculator` (fire-safe rock perimeter strips).
- **8. Required External References (`UNVERIFIED`):** University Extension Horticulture guides (e.g., Clemson HGIC, Penn State Extension, Washington State / Linda Chalker-Scott "Horticultural Myths" on wood-chip mulch & landscape fabric), NFPA Firewise USA Zone 0 (0–5 ft noncombustible zone).

---

### 9. Drywall (`how-much-drywall-do-i-need`)
- **1. Current Strengths:** Helpful coverage of horizontal vs vertical hanging, ceiling-first installation sequence, staggering butt joints by `4 ft`, and stairwell access limitations for `4×12` sheets.
- **2. Missing Practical Info:** Lacks guidance on **drywall panel types & thicknesses** (`1/2"` lightweight standard wallboard, `1/2"` sag-resistant ceiling board for `24" OC` trusses, `5/8"` Type X fire-rated board required on garage-to-house walls/ceilings, mold/moisture-resistant purple/green board vs cement board/foam board in showers!), **setting-type hot mud vs premixed all-purpose vs lightweight topping mud**, and **corner bead** (metal/vinyl/paper-faced inside/outside corners).
- **3. Unsupported Assumptions (`UNVERIFIED`):** `400 sq ft / 4.5-gal` mud coverage, `600 sq ft / 500-ft` tape roll, `1 lb / 300 sq ft` screws, `21`/`15 sq ft` uncapped deductions in `drywall.ts`, and flat `$25` kit pricing bug.
- **4. Worked Example Improvements:** Update cost/BOM worked example once `drywall.ts` prices tape rolls and screw lbs individually instead of a flat `$25` kit, and add a `4×12` vs `4×8` stairwell feasibility check.
- **5. Product-Specific Guidance Needed:** `1-1/4"` coarse-thread bugle screws (for `1/2"` board on wood studs) vs `1-5/8"` screws (for `5/8"` Type X) vs fine-thread screws (metal framing); paper tape (stronger on flat seams & inside corners) vs fiberglass mesh tape (must use **setting-type hot mud**, NEVER premixed air-drying mud, to avoid cracking!).
- **6. Safety / Code / Scope Limits:** **IRC R302.6** fire-separation requirement (`1/2"` or `5/8"` Type X gypsum board on attached garage walls/ceilings), **dust/silica/asbestos** warning before sanding pre-1980 joint compound or popcorn ceilings, and never hanging standard/green-board inside tiled wet shower stalls.
- **7. Helpful Internal Links:** `/calculators/drywall-calculator`, `/calculators/paint-calculator` (+ PVA primer guidance), `/calculators/baseboard-trim-calculator`, `/calculators/tile-calculator`.
- **8. Required External References (`UNVERIFIED`):** Gypsum Association GA-216 & GA-214 (Levels of Finish 0–5), ASTM C1396, USG Sheetrock / National Gypsum coverage TDS, IRC R302.6 (Dwelling-Garage Fire Separation).

---

### 10. Deck Materials (`how-to-calculate-deck-materials`)
- **1. Current Strengths:** Clear separation of surface board takeoff vs structural framing design, strong IRC structural disclaimers, 1/8" gap explanation, and stock-length (12/16/20 ft) end-joint splicing optimization.
- **2. Missing Practical Info:** Does not explain **hidden fastener clip vs face screw** differences, **picture-frame borders & fascia/riser boards** (requiring extra perimeter framing blocking & boards), **joist hanger / structural hardware** (hot-dip galvanized G185 or stainless steel — NEVER standard electro-galvanized with ACQ/CA-C treated wood!), **ledger flashing & butyl joist tape**, or **stair stringer spacing** (`9"–12" OC` for composites!).
- **3. Unsupported Assumptions (`UNVERIFIED`):** `5.5" + 1/8" = 5.625"` pitch (composites vary `3/16"`–`1/4"` thermal gap with hidden clips!), `12"` vs `16"` joist spacing rules, fastener formula (`2 × rows × joists × 1.10`), and major pricing/labor mismatch (board-only materials paired with `$30/sq ft` full structural turnkey labor!).
- **4. Worked Example Improvements:** Clearly distinguish **Resurfacing an existing sound frame** (deck boards + screws/clips only) from **New Deck Construction** (footings, posts, beams, joists, hardware, decking, stairs, guardrails), and fix the `HomePage.tsx` example (`29` boards vs `28`).
- **5. Product-Specific Guidance Needed:** `5/4×6` Pressure-Treated Pine (`UC3B` above-ground) vs Cedar/Redwood vs Capped Composite (`Trex`/`TimberTech`/`Fiberon` — expansion/contraction gapping & `12"` OC diagonal limits) vs PVC decking.
- **6. Safety / Code / Scope Limits:** **IRC R507** structural deck requirements: ledger attachment (lag screws / structural screws per Table R507.9.1.3(1), never nails, never cantilevered ledger over brick veneer!), guardrails (`>= 36"` residential height when deck is `> 30"` above grade, `< 4"` baluster sphere rule), stair graspable handrails, and footing depth below frost line.
- **7. Helpful Internal Links:** `/calculators/deck-material-calculator`, `/calculators/concrete-post-hole-calculator` (distinguishing deck piers), `/calculators/fence-material-calculator`, `/calculators/paver-patio-calculator` (ground-level patio alternative).
- **8. Required External References (`UNVERIFIED`):** AWC **DCA 6** (*Prescriptive Residential Wood Deck Construction Guide*), **IRC Section R507** (*Exterior Decks*), Simpson Strong-Tie Corrosion/Fastener Guide for Treated Wood, Trex/TimberTech Installation Guides.

---

### 11. Fence Materials (`how-to-calculate-fence-materials`)
- **1. Current Strengths:** Clear bay-and-post breakdown, `2` vs `3` backer-rail logic by height (`4'` vs `6'`/`8'`), mandatory 811 utility callout, setback/HOA reminder, and gate post isolation note.
- **2. Missing Practical Info:** Does not clarify **post lengths required by fence height & frost depth** (`8'` post ONLY works for `4'` fences or shallow `24"` non-frost `6'` fences; `6'` fence with `36"` embedment needs **`9'–10'` posts**; `8'` fence needs **`10'–12'` posts**!), **gate hardware & framing** (anti-sag diagonal compression brace, heavy hinges, latch), **stepped vs racked panels** on sloped yards, and **fastener compatibility** (`ACQ/CA` copper-treated posts require stainless or hot-dip galvanized/ceramic-coated ring-shank nails/screws!).
- **3. Unsupported Assumptions (`UNVERIFIED`):** Hardcoded `1.5` × `60-lb` bags/post (clashes directly with `concretePostHole.ts`'s `3.1` bags at `10"×36"`!), always pricing `8'` posts & `8'` rails & `6'` pickets regardless of `4'`/`8'` height or `6'` spacing, and `+2` gate post formula nuance when gate bay replaces a standard line bay.
- **4. Worked Example Improvements:** Add explicit line clarifying how total run `150'` breaks into line bays vs gate bay so users don't accidentally add extra feet, and explain concrete bag sizing for frost (`36"`) vs warm (`24"`) zones.
- **5. Product-Specific Guidance Needed:** Pressure-Treated Pine (`UC4A` ground contact for posts vs `UC3B` above-ground pickets/rails) vs Western Red Cedar pickets/rails on PT or galvanized steel posts (PostMaster/round steel posts last longer in wet soil than `4×4` PT pine).
- **6. Safety / Code / Scope Limits:** **811 Call Before You Dig** (`48–72` hrs prior), municipal **pool-barrier code** (minimum `48"` height, self-closing/self-latching gates, max gap sizes if enclosing a pool), front-yard sight-triangle height caps (`36"–42"`), and HOA "good neighbor" outward-facing picket rules.
- **7. Helpful Internal Links:** `/calculators/fence-material-calculator`, `/calculators/concrete-post-hole-calculator` (plus `/guides/how-much-concrete-do-i-need-for-fence-posts`), `/calculators/deck-material-calculator`.
- **8. Required External References (`UNVERIFIED`):** American Fence Association (AFA) Consumer Fence Guide, AWPA Use Category `UC4A` (Ground Contact Posts), IRC Appendix G / ISPSC (Swimming Pool Barrier Fence Rules), Common 811 state notice laws.

---

### 12. Roofing (`how-much-roofing-material-do-i-need`)
- **1. Current Strengths:** Rigorous explanation of Pythagorean pitch multipliers (`4:12` to `12:12`), roofing squares (`100 sq ft`), complexity waste tiers (`10/15/20%`), eave/rake overhang inclusion (`1–2 ft`), and starter/ridge/drip-edge exclusions.
- **2. Missing Practical Info:** Lacks practical estimating rules of thumb for the **critical excluded components**: **starter strip shingles** (eaves + rakes LF), **hip & ridge cap shingles** (ridge + hip LF, ~`25–35 LF/bundle`), **ice & water shield** (`24"` inside heated wall line per IRC), **metal drip edge**, **galvanized coil roofing nails** (`~320` nails/sq, `4` vs `6` nails/shingle high-wind), and **existing shingle tear-off weight / dumpster sizing** (~`200–250 lbs/sq` per layer of architectural shingles!).
- **3. Unsupported Assumptions (`UNVERIFIED`):** `10/15/20%` waste tiers, `3` bundles/sq default vs 4–5 bundle pricing bug in `roofing.ts`, `1,000 sq ft` gross underlayment division vs real horizontal/end-lap net loss (`~900–940 sq ft` effective per roll).
- **4. Worked Example Improvements:** Fix `HomePage.tsx` example mismatch (`57` bundles, Synthetic Underlayment), and add an explicit quick checklist showing estimated linear feet of starter/ridge/drip edge for a simple `2,000 sq ft` gable roof so budgets aren't surprised by `+15–25%` in accessory costs.
- **5. Product-Specific Guidance Needed:** `3-tab` strip shingles (fading market share, lower wind rating) vs **Architectural/Dimensional laminate** (`3` bundles/sq, 110–130 mph wind warranty) vs **Impact-Resistant Class 4 / Designer** (`4–5` bundles/sq) vs **Standing Seam Metal** (outside shingle calculator scope).
- **6. Safety / Code / Scope Limits:** **OSHA fall-protection / steep-slope safety** (`>= 6:12` requires roof jacks/harnesses; DIY not advisable on steep/two-story roofs), **IRC R905.2.2 low-slope rule** (shingles disallowed `< 2:12`; `2:12–4:12` requires **double-layer underlayment**!), **IRC R908.3 reroof limits** (never shingle over >2 existing layers or rotted decking), and balanced attic intake/exhaust ventilation (e.g., `1:150` or `1:300` NFA) to avoid voiding shingle warranties!
- **7. Helpful Internal Links:** `/calculators/roofing-calculator`, `/calculators/drywall-calculator` (interior ceiling repair after roof leak), `/calculators/paint-calculator`.
- **8. Required External References (`UNVERIFIED`):** NRCA Roofing Manual (Steep-Slope), ARMA (Asphalt Roofing Manufacturers Association) Installation Manual, **IRC Chapter 9 (R905 / R908)**, GAF Timberline HDZ / Owens Corning Duration TDS (net underlayment & shingle bundle coverage).

---

### 13. Sod (`how-much-sod-do-i-need`)
- **1. Current Strengths:** Well-reasoned perimeter waste tiers (`5%` square / `8%` curved / `12%` irregular), explicit pallet weight warning (`1,500–3,000 lbs` — prevents pickup overload!), staggered brick-bond seam rule, and non-dogmatic perishability notice.
- **2. Missing Practical Info:** Needs practical guidance on **soil preparation depth** (`4"–6"` tilled loam + starter phosphorus/soil test + `0.5"–1"` final grade clearance below sidewalks so turf sits flush with concrete!), **post-lay watering schedule** (daily light-to-moderate saturation for first `10–14 days` until root tack-down before first mow), and **regional pallet/roll vs southern flat-slab** differences (`10 sq ft` rolls vs `16"×24"` `2.67 sq ft` rectangular slabs).
- **3. Unsupported Assumptions (`UNVERIFIED`):** `450 sq ft` pallet default, `10 sq ft` roll size, `1,500–3,000 lb` pallet weight, fixed per-pallet pricing regardless of user-adjusted pallet sq ft (`sod.ts` pricing bug if user changes `450` to `500` or `400`).
- **4. Worked Example Improvements:** Add a quick reminder that a `1,500 sq ft` lawn = `4` pallets (`1,800 sq ft`), leaving `300 sq ft` (`~30 rolls`) leftover after cutting—showing how toggling to `500 sq ft` pallets (if local farm cuts 500 sq ft) drops the order from `4` pallets to `3` or `4` depending on waste!
- **5. Product-Specific Guidance Needed:** Cool-season grasses (Tall Fescue, Kentucky Bluegrass, Perennial Rye — spring/early fall install ideal) vs Warm-season grasses (Bermuda, Zoysia, St. Augustine, Centipede — late spring/summer install, often harvested as 16×24 slabs). Shade tolerance warning (sod fails under dense tree canopy regardless of watering).
- **6. Safety / Code / Scope Limits:** Lift/ergonomic weight warning (`30–50 lb` soaked rolls/slabs; forklift pallet drop clearance away from septic leach fields & irrigation heads), and local municipal drought/watering restriction permits for new turf establishment.
- **7. Helpful Internal Links:** `/calculators/sod-calculator`, `/calculators/topsoil-calculator` (subgrade leveling soil before sodding), `/calculators/mulch-calculator` (perimeter planting beds), `/calculators/gravel-calculator`.
- **8. Required External References (`UNVERIFIED`):** Turfgrass Producers International (TPI) *Guideline Specifications to Turfgrass Sodding*, State University Extension Sod Establishment Bulletins (e.g., NC State TurfFiles, Purdue, UF/IFAS).

---

### 14. Topsoil (`how-much-topsoil-do-i-need`)
- **1. Current Strengths:** Clear final-settled-depth instruction, accurate conversion (`36` bags of `0.75 cu ft` = `1 cu yd`), strong truck payload warning (`2,000–2,500 lbs/yd³`), and distinction between screened loam vs unscreened fill dirt.
- **2. Missing Practical Info:** Needs guidance on **soil application depth by task** (`0.25"–0.5"` lawn top-dressing to avoid smothering grass crowns vs `2"–4"` turf seeding vs `6"–12"` vegetable/raised beds), **raised bed fill economics** (blending 60% screened topsoil + 30% compost + 10% aeration/perlite for containers, or filling bottom of 24" tall beds with coarse wood/subsoil), and **herbicide carryover risk** in cheap municipal compost/manure blends (aminopyralid/clopyralid kills tomatoes/beans!).
- **3. Unsupported Assumptions (`UNVERIFIED`):** `10%` organic settling buffer (`MethodologyPage` says `10–15%`), `2,000–2,500 lbs/yd³` wet density, inconsistent bulk-vs-bag tipping points (`25 bags` / `0.69 yd³` in `topsoil.ts` pricing vs `1 yd³` in UI vs `1.5 yd³` in `topsoil.ts` assumptions!), missing `1.0 cu ft` bag price benchmark.
- **4. Worked Example Improvements:** Reconcile the `25-bag` / `1-yd³` / `1.5-yd³` break-even contradictions and add a **raised bed calculator example** (e.g. four `4'×8'×12"` raised beds = `128 sq ft × 12" = 4.74 yd³ + 10% = 5.2 yd³`) to show how fast deep beds require bulk delivery instead of 250 retail bags!
- **5. Product-Specific Guidance Needed:** Screened Topsoil (mineral loam for grading/lawns) vs Raised-Bed Garden Mix (topsoil + compost + bark fines) vs Bagged Potting Mix (soilless peat/coir/perlite for containers — never use heavy topsoil in pots!).
- **6. Safety / Code / Scope Limits:** **Sloped drainage against house foundation** (never pile topsoil against wood siding or above the `6"` concrete foundation clearance; grade soil to slope `>= 6"` drop over first `10 ft` away from house per IRC R401.3!), and lead/contaminant testing in urban yards before vegetable beds.
- **7. Helpful Internal Links:** `/calculators/topsoil-calculator`, `/calculators/sod-calculator`, `/calculators/mulch-calculator`, `/calculators/gravel-calculator`.
- **8. Required External References (`UNVERIFIED`):** State Cooperative Extension soil & raised-bed guides (e.g., Oregon State, Cornell, Clemson), US Composting Council STA program / herbicide carryover advisories, IRC R401.3 (Surface Drainage).

---

### 15. Baseboard & Trim (`how-much-baseboard-do-i-need`)
- **1. Current Strengths:** Clear explanation of `2.5 lf` doorway deduction, why trim needs a higher `15%` miter/scarf waste factor than flat flooring, `8/12/16 ft` stick transport vs seam trade-off, coping inside corners, and pre-painting trim before nailing.
- **2. Missing Practical Info:** Needs estimating rules for **quarter round / shoe molding** (often added when floating LVP/hardwood expands `1/4"–3/8"` from existing baseboards without removing baseboards!), **consumables takeoff** (`16-ga` or `18-ga` brad nails, elastomeric painter's caulk ~1 tube per 30–50 lf, spackle, wood glue for miter returns), and **how tall walls / closets / door casings** affect stick selection (`12'` sticks eliminate butt splices on standard 10–12' bedrooms!).
- **3. Unsupported Assumptions (`UNVERIFIED`):** `2.5 lf` (`30"`) door deduction, `15%` (`10/15/20%`) miter waste, only pricing primed MDF (`baseboard-mdf-primed`) while guides/homes frequently use finger-jointed pine or PVC in bathrooms.
- **4. Worked Example Improvements:** Add a **bathroom / wet-area material swap note** explaining why primed MDF swells if mop water or shower steam hits raw bottom edges unless sealed or swapped for cellular PVC trim.
- **5. Product-Specific Guidance Needed:** Primed MDF (smooth paint finish, low cost, zero knots, vulnerable to standing water) vs Finger-Jointed Pine (durable, moisture-tolerant if primed, accepts screws/nails cleanly) vs Cellular PVC (waterproof for baths/laundry/mudrooms) vs Stain-Grade Solid Hardwood.
- **6. Safety / Code / Scope Limits:** Pre-1978 lead-paint safety when prying off old baseboards (scoring caulk seams first to avoid tearing drywall paper!), and MDF fine-dust PPE (respirator/dust collection when miter-sawing MDF).
- **7. Helpful Internal Links:** `/calculators/baseboard-trim-calculator`, `/calculators/flooring-calculator`, `/calculators/paint-calculator`, `/calculators/drywall-calculator`.
- **8. Required External References (`UNVERIFIED`):** Finish carpentry & Woodwork Institute architectural millwork standards, manufacturer MDF/PVC trim installation & sealing TDS, OSHA/NIOSH wood & MDF dust protection guidance.

# Phase 4B-1: Project Guide Content Architecture & 3 Pilot Guides

## 1. Overview & Editorial Philosophy

Phase 4B-1 establishes the permanent editorial and informational knowledge architecture for **Home Project Tools**. 

Unlike generic content sites that generate superficial articles stuffed with affiliate links, Home Project Tools treats its guides as **practical planning companion pieces**. Each guide's goal is to empower a homeowner to understand real field conditions, measure accurately, select appropriate waste factors, and purchase materials in standard commercial units without shortages or excessive waste.

Every guide directly reinforces our **Three-Stage Estimating Model**:
1. **Mathematical Net Requirement:** Geometric measurement (sq ft, lin ft, cubic volume).
2. **Field Reality Factor:** Waste, cutting scrap, pattern layout, settling, absorption, and subgrade variance.
3. **Commercial Ceiling Unit:** Standard retail packaging (cartons, whole gallons, bags, rolls, bundles, pallets, bulk yards).

---

## 2. Information Architecture & Data Model

### 2.1 Type Definitions (`src/types/index.ts`)
The `GuideDefinition` interface and supporting sub-structures define a standardized, high-density editorial format:
- `GuideMeasurement`: Specific dimensions to take, recommended tools, and field measuring tips.
- `GuideThreeStageExplanation`: Explicit breakdown of Stage 1 (Math), Stage 2 (Allowance), and Stage 3 (Purchase packaging) with formulas.
- `GuideWorkedStep` & `GuidePracticalExample`: Step-by-step arithmetic walk-through with real homeowner scenarios and itemized inputs.
- `GuideSection`: Deep-dive content blocks with markdown-style formatting, comparison tables, and warning/tip callouts.
- `GuideCommonMistake`: High-impact homeowner pitfalls, why they matter, and actionable prevention techniques.
- `GuideCostPlanning`: Low/medium/high material price benchmarks and separated DIY vs contractor labor ranges.
- `FAQItem`: Frequently asked questions with clear, direct answers.

### 2.2 Centralized Data Store (`src/data/guides.ts`)
All guide content is strictly decoupled from the presentation layer and stored in `src/data/guides.ts`. Helper query functions provide fast, reliable access:
- `getGuideBySlug(slug: string)`
- `getGuidesByCategory(categoryId: string)`
- `getGuidesForCalculator(calculatorId: string)`

---

## 3. The 3 Pilot Guides

### 3.1 Flooring Material Calculator Guide
- **Slug:** `how-to-calculate-flooring-material`
- **Category:** Flooring (`flooring`)
- **Companion Calculator:** Flooring Material Calculator (`/calculators/flooring-calculator`)
- **Core Topics:**
  - Room sectioning for L-shaped spaces and closets
  - Waste factors: 10% straight lay vs 15% diagonal vs 20% herringbone
  - Commercial carton coverage (18–24 sq ft per box) and safe ceiling rounding
  - Underlayment rolls and transition strips
  - Worked Example: 14' × 18' Living Room + 4' × 5' Entryway = 14 cartons (280 sq ft)

### 3.2 Interior Paint Coverage Guide
- **Slug:** `how-much-paint-do-i-need`
- **Category:** Painting & Finishes (`painting`)
- **Companion Calculator:** Interior Paint Calculator (`/calculators/paint-calculator`)
- **Core Topics:**
  - Perimeter wall surface calculation: `(2 × (L + W)) × H`
  - Standard deductions: 21 sq ft per door, 15 sq ft per window
  - Spread rate benchmarks: 350 to 400 sq ft per gallon (250–300 sq ft on textured drywall)
  - When 2 coats are mandatory (color transitions, unprimed drywall)
  - Commercial packaging: 1-gallon cans vs 5-gallon pails
  - Worked Example: 12' × 15' Bedroom with 9' Ceilings = 3 Gallons for walls + 1 Gallon for ceiling

### 3.3 Garden Bed Mulch Guide
- **Slug:** `how-to-calculate-mulch`
- **Category:** Landscaping & Groundwork (`landscaping`)
- **Companion Calculator:** Mulch Calculator (`/calculators/mulch-calculator`)
- **Core Topics:**
  - Depth standards: 2" for top-up freshening, 3" for weed suppression and moisture retention
  - The 324 divisor rule: `(Sq Ft × Depth in Inches) ÷ 324 = Cubic Yards`
  - Natural settling and decomposition compaction (10% to 15%)
  - Bagged retail (2 cu ft / 3 cu ft) vs bulk dump truck delivery tipping point (≥ 3 cubic yards)
  - Danger of "mulch volcanoes" against tree bark
  - Worked Example: 300 sq ft Foundation Bed @ 3" Depth = 3.1 Cubic Yards (or 42 bags @ 2 cu ft)

---

## 4. Full Bidirectional Linking Architecture

No dead links or placeholder text exist across the application:
1. **Homepage (`src/pages/HomePage.tsx`):**
   - Displays a dedicated "Home Improvement Planning Guides" section featuring the 3 pilot guides with summaries, reading times, companion tool tags, and direct links.
2. **Category Hubs (`src/pages/CategoryHubPage.tsx`):**
   - Resolves `category.relatedGuideSlugs` dynamically via `getGuideBySlug`.
   - Renders a rich "Planning & Material Guides" card grid on relevant category hubs (Flooring, Painting, Landscaping).
3. **Calculators (`src/pages/FlooringCalculatorPage.tsx`, etc.):**
   - Feature an editorial "Project Planning Guide" callout card directing users to the detailed field guide.
   - `RelatedTools.tsx` dynamically retrieves active live guides via `getGuidesForCalculator(currentCalculatorId)`, ensuring only live guides appear as interactive links.
4. **Guide Page (`src/pages/GuidePage.tsx`):**
   - Top banner jumping directly to companion calculator.
   - Breadcrumb navigation (`Home` → `Category` → `Guide`).
   - Bottom primary CTA banner launching the companion calculator.
   - Companion calculators list and related guides list.

---

## 5. SEO & Schema.org Metadata

- **Dynamic Page Titles:** Synchronized with editorial meta titles.
- **Dynamic Meta Descriptions:** Tailored for high-intent search click-through.
- **Structured Data (JSON-LD):**
  - Guides inject Schema.org `Article` schemas with author, headline, dateModified, and canonical URLs.
  - Category Hubs inject `CollectionPage` schemas.
  - Calculators inject `SoftwareApplication` schemas.

---

## 6. Verification & Test Suite

The test suite in `tests/calculators.test.ts` was verified to ensure that all 15 deterministic calculation engines maintain 100% precision. TypeScript checks confirm that all guide metadata, categories, and calculator routing conform to strict interfaces without type errors or broken references.

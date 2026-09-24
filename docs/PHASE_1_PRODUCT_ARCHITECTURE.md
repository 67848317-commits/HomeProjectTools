# Phase 1 Product Architecture Document: Home Project Tools
**Product:** Home Project Tools (`homeprojecttools.com`)  
**Positioning:** Home Improvement Planning & Cost Estimation  
**Core Slogan:** *Plan your project. Estimate materials. Understand the cost.*  
**Author:** Lead Web Engineer & Product Architect  
**Status:** Approved Architectural Blueprint for Implementation  

---

## Table of Contents
1. [Final Product Positioning](#1-final-product-positioning)
2. [Target Audience & Personas](#2-target-audience--personas)
3. [Core User Journeys](#3-core-user-journeys)
4. [Final V1 Category Structure](#4-final-v1-category-structure)
5. [Final V1 List of 15 Calculators](#5-final-v1-list-of-15-calculators)
6. [Detailed Specifications for Every Calculator](#6-detailed-specifications-for-every-calculator)
7. [Guide Content Architecture (18 Guides)](#7-guide-content-architecture)
8. [Homepage Information Architecture](#8-homepage-information-architecture)
9. [Calculator Page Architecture & Component System](#9-calculator-page-architecture--component-system)
10. [URL Architecture & Routing Rules](#10-url-architecture--routing-rules)
11. [TypeScript Data Architecture](#11-typescript-data-architecture)
12. [Cost Estimation Strategy & Architecture](#12-cost-estimation-strategy--architecture)
13. [Internal Linking Strategy](#13-internal-linking-strategy)
14. [SEO & Structured Data Architecture](#14-seo--structured-data-architecture)
15. [Accessibility & UX Requirements](#15-accessibility--ux-requirements)
16. [Recommended Project Folder Structure (Astro 5 + TS)](#16-recommended-project-folder-structure)
17. [Recommended Development Phases](#17-recommended-development-phases)
18. [Risks and Potential Architectural Problems](#18-risks-and-potential-architectural-problems)
19. [Out of Scope: What Should NOT Be Built in V1](#19-out-of-scope-what-should-not-be-built-in-v1)
20. [Phase 2 Implementation Checklist](#20-phase-2-implementation-checklist)

---

## 1. Final Product Positioning

### 1.1 Brand Positioning Statement
**Home Project Tools** is a dedicated digital planning platform for US residential home improvement projects. Unlike ad-heavy generic calculator directories or contractor lead-gen portals that gate results behind lead capture forms, Home Project Tools provides transparent, instant, measurement-based material estimation and realistic cost modeling paired with editorial planning context.

### 1.2 Core Product Slogan
> **"Plan your project. Estimate materials. Understand the cost."**

### 1.3 Key Differentiation from Generic Tools (Anti-"Practical Tools" Paradigm)
1. **Project-Centric Rather Than Math-Centric:** A generic calculator asks "width × length = area". Home Project Tools asks "What room are you tiling? What pattern? Are you including a 10% cut allowance, mortar bags, and grout?"
2. **Actionable Bill of Materials (BOM):** Instead of a single raw integer, tools output real packaging units (e.g., cartons of flooring, 80 lb bags of concrete, rolls of underlayment, gallons of paint).
3. **Range-Based Transparent Cost Modeling:** Never shows fake precision like "$1,421.37". Always breaks out **Low / Typical / High** national material bands, DIY vs. Contractor cost spreads, and provides explicit disclaimers on regional labor variations.
4. **Editorial Context Integration:** Every calculation is natively anchored to a practical "How to Measure", "Common Mistakes", and "Buying Checklist" guide, establishing immediate E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness).
5. **No Clutter, No Dark Patterns:** No popups, no email-walls before seeing results, no slow multi-step questionnaires. Clean, responsive, instant client-side math.

---

## 2. Target Audience & Personas

### Persona A: "The Weekend DIY Homeowner" (Primary)
* **Profile:** Homeowner (ages 28–55) undertaking a remodel (painting a living room, tiling a bathroom, building a backyard fire pit patio, mulching flower beds).
* **Pain Point:** Unsure how much material to buy at Home Depot/Lowe's; terrified of having to stop mid-project or overspending on unreturnable excess material.
* **Goal:** Quick, trustworthy list of quantities (e.g., "Buy 14 cartons + 2 bags of thin-set") and a ball-park material budget.

### Persona B: "The Planning & Budgeting Homeowner" (Secondary)
* **Profile:** Homeowner considering hiring a contractor or comparing options (e.g., poured concrete slab vs. gravel vs. pavers; drywall repair vs. replacement).
* **Pain Point:** Contractor quotes seem opaque; doesn't know what portion of an estimate is labor versus raw materials.
* **Goal:** Wants baseline material requirements and realistic cost benchmarks so they can negotiate, plan budgets, and evaluate bids intelligently.

### Persona C: "The Small Project Handyperson / Solo Pro" (Tertiary)
* **Profile:** Independent handyman, property manager, or carpenter doing quick rough-ins.
* **Pain Point:** Needs a fast, reliable, mobile-friendly check on the job site without complex desktop estimating software.
* **Goal:** Rapid verification of square footage, waste percentages, and standard packaging rules.

---

## 3. Core User Journeys

### Journey 1: "Direct Search to Solution" (SEO Entry - 70% of Traffic)
```
Google Search ("how many bags of concrete for 10x10 slab 4 inches")
  └──> /calculators/concrete-slab-calculator
        ├──> Instant input: Length=10 ft, Width=10 ft, Thickness=4 in
        ├──> Output displayed live: 1.23 cu yds | 60 bags (60lb) or 45 bags (80lb) | +10% margin
        ├──> Cost range: $220 - $310 materials | $700 - $1,400 with professional installation
        ├──> Editorial tip: Subbase prep & curing guidance
        └──> Cross-link: "How to Calculate Concrete for a Slab" Guide + Gravel Base Calculator
```

### Journey 2: "Project Explorer" (Homepage Entry - 20% of Traffic)
```
Home Page
  └──> Selects Category: "Landscaping & Outdoor"
        └──> Category Hub: /projects/landscaping/
              ├──> Comparison overview: Mulch vs. Gravel vs. Sod
              ├──> Direct link to /calculators/mulch-calculator
              └──> Reads guide: "How Much Mulch Do I Need?"
```

### Journey 3: "Guide-First Learning" (Informational Search - 10% of Traffic)
```
Search: "how much extra tile to order for herringbone pattern"
  └──> /guides/tile-pattern-waste-factors
        ├──> Reads actionable guide with clear waste factor table (10% standard vs 15-20% herringbone)
        └──> Inline Interactive Calculator Embed / Callout -> /calculators/tile-calculator
```

---

## 4. Final V1 Category Structure

To maintain a project-oriented hierarchy without overwhelming the user, the V1 scope is divided into **7 Core Residential Project Categories**:

| Category ID | Category Name | Scope & Focus | Rationale |
|---|---|---|---|
| `flooring` | **Flooring** | Hardwood, laminate, vinyl plank (LVP), and tile installations | Highest frequency interior DIY upgrade with strict packaging constraints (carton rounding). |
| `painting` | **Painting & Finishes** | Interior walls, ceilings, trim, and exterior surface coatings | Ubiquitous DIY project; high search volume for gallon coverage and coats. |
| `concrete-masonry` | **Concrete & Masonry** | Slabs, footings, post holes, and pavers | High-stakes calculations where ordering wrong causes catastrophic job failure. |
| `landscaping` | **Landscaping & Groundwork** | Bulk materials: mulch, topsoil, gravel, and sod rolls | High volume seasonal DIY; heavy unit confusion (cu yards vs bags vs tons). |
| `walls-drywall` | **Walls & Drywall** | Drywall hanging, sheet counts, joint compound, and screw counts | Standard residential framing/finishing; clear packaging rules (4x8 vs 4x12). |
| `fencing-decking` | **Fencing & Decking** | Post spacing, pickets, rails, deck boards, joists, and concrete footings | High-cost outdoor living projects requiring multi-component material bills. |
| `roofing` | **Roofing & Siding** | Shingle bundles, roofing squares, underlayment rolls | High intent cost estimation; standard contractor unit translation ("roofing squares"). |

---

## 5. Final V1 List of 15 Calculators

The 15 calculators were selected using 4 strict criteria:
1. **Search Volume & Intent:** High US search intent queries.
2. **Clear Mathematical Formulas:** Established ASTM/industry standards for material coverage.
3. **Packaging Translation Value:** Calculates real-world purchasing units (bags, rolls, cartons, bundles), not just abstract square feet.
4. **Cost Transparency Opportunity:** Readily identifiable material price bands in US big-box retail.

### The 15 Core Calculators:
1. **Flooring Material & Carton Calculator** (`/calculators/flooring-calculator`)
2. **Tile & Grout Calculator** (`/calculators/tile-calculator`)
3. **Interior Paint Coverage Calculator** (`/calculators/paint-calculator`)
4. **Concrete Slab & Pour Calculator** (`/calculators/concrete-slab-calculator`)
5. **Concrete Post Hole & Footing Calculator** (`/calculators/concrete-post-hole-calculator`)
6. **Mulch Yardage & Bag Calculator** (`/calculators/mulch-calculator`)
7. **Gravel & Crushed Stone Calculator** (`/calculators/gravel-calculator`)
8. **Sod Roll & Pallet Calculator** (`/calculators/sod-calculator`)
9. **Drywall Sheet & Mud Calculator** (`/calculators/drywall-calculator`)
10. **Deck Board & Framing Estimator** (`/calculators/deck-material-calculator`)
11. **Wood Privacy Fence Calculator** (`/calculators/fence-material-calculator`)
12. **Roofing Shingle & Bundle Calculator** (`/calculators/roofing-calculator`)
13. **Paver Patio & Sand Calculator** (`/calculators/paver-patio-calculator`)
14. **Topsoil & Garden Bed Calculator** (`/calculators/topsoil-calculator`)
15. **Baseboard & Trim Molding Calculator** (`/calculators/baseboard-trim-calculator`)

---

## 6. Detailed Specifications for Every Calculator

### Tool 1: Flooring Material & Carton Calculator
* **Slug:** `/calculators/flooring-calculator`
* **Category:** `flooring`
* **Short Description:** Calculate total square footage, carton quantities, and cost for hardwood, laminate, or luxury vinyl plank (LVP) flooring including cut waste.
* **Target Intent:** Homeowners planning to replace floor covering in one or multiple rooms.
* **Primary Calculation:** 
  $$\text{Net Area} = \text{Length} \times \text{Width}$$
  $$\text{Gross Area} = \text{Net Area} \times (1 + \text{Waste Factor})$$
  $$\text{Cartons} = \lceil \text{Gross Area} / \text{Sq Ft Per Carton} \rceil$$
* **Required Inputs:**
  * Room Length (ft)
  * Room Width (ft)
  * Flooring Type: Luxury Vinyl Plank (LVP), Engineered Hardwood, Solid Hardwood, Laminate
* **Optional Inputs:**
  * Sq Ft per Carton (Default: 20 sq ft, customizable)
  * Room Layout / Waste Allowance (Straight: 10%, Diagonal: 15%, Herringbone: 20%)
  * Material Price per Sq Ft (Default set from material type, editable)
  * Include Underlayment (checkbox; calculates rolls @ 100 sq ft/roll)
* **Output Values:**
  * Net Floor Area ($sq\ ft$)
  * Recommended Purchase Area with Waste ($sq\ ft$)
  * Total Full Cartons to Buy ($cartons$)
  * Underlayment Rolls Needed ($rolls$, if selected)
  * Estimated Material Cost Range (Low / Typical / High)
  * Optional Contractor Install Cost Range ($1.50 - $4.50/sq ft$)
* **Key Assumptions:** Standard rectangular room geometry; transitions and baseboard shoe molding estimated separately.
* **Related Guides:** `how-much-flooring-do-i-need`, `flooring-waste-factor-guide`

---

### Tool 2: Tile & Grout Calculator
* **Slug:** `/calculators/tile-calculator`
* **Category:** `flooring`
* **Short Description:** Estimate floor or wall tile counts, cartons, grout bags, and mortar for bathroom and kitchen projects.
* **Target Intent:** DIYers estimating ceramic, porcelain, or stone tile for floors, shower walls, or backsplashes.
* **Primary Calculation:**
  $$\text{Tile Area} = \text{Length} \times \text{Width}$$
  $$\text{Tile Size (sq ft)} = (\text{Tile Length (in)} \times \text{Tile Width (in)}) / 144$$
  $$\text{Raw Tile Count} = \text{Tile Area} / \text{Tile Size}$$
  $$\text{Total Tiles} = \lceil \text{Raw Tile Count} \times (1 + \text{Waste Factor}) \rceil$$
* **Required Inputs:**
  * Area to Tile: Length (ft) and Width/Height (ft)
  * Tile Dimensions: Length (in) and Width (in) (e.g., 12x12, 12x24, 3x6 subway)
* **Optional Inputs:**
  * Grout Joint Width (1/16", 1/8", 3/16", 1/4")
  * Installation Pattern: Straight (10% waste), Offset/Brick (12%), Diagonal/Herringbone (18%)
  * Pieces per Box (Default: 10)
  * Cost per Sq Ft or Cost per Box
* **Output Values:**
  * Total Surface Area ($sq\ ft$)
  * Total Tile Count (individual tiles)
  * Total Boxes of Tile
  * Estimated Thin-set Mortar (50 lb bags @ 50 sq ft/bag)
  * Estimated Grout Needed (10 lb or 25 lb bags based on joint width)
  * Material Cost Range ($)
* **Key Assumptions:** Thin-set mortar coverage assumes 1/4" x 3/8" notched trowel on flat subfloor.
* **Related Guides:** `how-to-estimate-tile-projects`, `tile-pattern-waste-factors`

---

### Tool 3: Interior Paint Coverage Calculator
* **Slug:** `/calculators/paint-calculator`
* **Category:** `painting`
* **Short Description:** Calculate exact paint gallons needed for walls, ceilings, and doors, factoring in window/door deductions and coat count.
* **Target Intent:** Homeowners painting a bedroom, living room, or entire floor looking to avoid buying extra gallons.
* **Primary Calculation:**
  $$\text{Gross Wall Area} = 2 \times (\text{Length} + \text{Width}) \times \text{Ceiling Height}$$
  $$\text{Deductions} = (\text{Doors} \times 21) + (\text{Windows} \times 15)$$
  $$\text{Net Area} = \text{Gross Wall Area} - \text{Deductions}$$
  $$\text{Gallons} = \lceil (\text{Net Area} \times \text{Number of Coats}) / \text{Coverage Rate (350 sq ft/gal)} \rceil$$
* **Required Inputs:**
  * Room Length (ft), Width (ft), Ceiling Height (ft)
  * Number of Doors and Windows to deduct
* **Optional Inputs:**
  * Include Ceiling (checkbox; adds Length × Width)
  * Number of Coats (1 for refresh, 2 standard, 3 for dramatic color shift)
  * Paint Grade ($30/gal budget, $55/gal premium, $85/gal ultra-premium)
  * Include Primer (checkbox)
* **Output Values:**
  * Net Wall Square Footage
  * Ceiling Square Footage (if selected)
  * Gallons of Wall Paint
  * Quarts for Trim/Doors (optional add-on)
  * Gallons of Ceiling Paint
  * Total Estimated Paint Budget ($)
* **Key Assumptions:** Industry standard 350 sq ft/gallon coverage on primed drywall; standard doors = 21 sq ft; standard windows = 15 sq ft.
* **Related Guides:** `how-much-paint-do-i-need`, `interior-painting-cost-guide`

---

### Tool 4: Concrete Slab & Pour Calculator
* **Slug:** `/calculators/concrete-slab-calculator`
* **Category:** `concrete-masonry`
* **Short Description:** Calculate cubic yards and pre-mixed bags (60 lb / 80 lb) needed for patio slabs, garage floors, shed pads, or sidewalks.
* **Target Intent:** Homeowners and DIYers pouring flatwork slabs who need to order ready-mix concrete or buy bags.
* **Primary Calculation:**
  $$\text{Volume (cu ft)} = \text{Length (ft)} \times \text{Width (ft)} \times (\text{Thickness (in)} / 12)$$
  $$\text{Cubic Yards} = (\text{Volume} \times 1.10) / 27 \quad \text{(includes 10% subgrade variance)}$$
  $$\text{80 lb Bags} = \text{Cubic Yards} \times 45$$
  $$\text{60 lb Bags} = \text{Cubic Yards} \times 60$$
* **Required Inputs:**
  * Slab Length (ft), Width (ft), Thickness (in - default 4" for patios/sheds, 6" for driveways)
* **Optional Inputs:**
  * Waste / Subgrade Irregularity Factor (Default 10%)
  * Delivery Method: Ready-Mix Truck vs. Bagged Concrete
  * Cost per Cubic Yard or Cost per Bag
  * Include Welded Wire Mesh or Rebar allowance
* **Output Values:**
  * Total Slab Area ($sq\ ft$)
  * Total Concrete Volume ($cu\ yards$ and $cu\ feet$)
  * Number of 80 lb Bags OR Number of 60 lb Bags
  * Ready-mix truck threshold notice (recommends truck delivery if $> 1.5$ cu yards)
  * Estimated Material Cost (Truck: $140–$180/yd + short load fees vs Bags: $5–$7/bag)
* **Key Assumptions:** Subgrade excavation is compacted; ready-mix trucks typically have 3–4 yard minimums without surcharge.
* **Related Guides:** `how-to-calculate-concrete-for-a-slab`, `bagged-vs-ready-mix-concrete`

---

### Tool 5: Concrete Post Hole & Footing Calculator
* **Slug:** `/calculators/concrete-post-hole-calculator`
* **Category:** `concrete-masonry`
* **Short Description:** Estimate concrete bags required to set fence posts, deck footings, mailbox posts, and pergola columns.
* **Target Intent:** DIYers setting posts into cylindrical holes needing bag counts.
* **Primary Calculation:**
  $$\text{Hole Volume} = \pi \times (\text{Diameter (in)} / 24)^2 \times (\text{Depth (in)} / 12)$$
  $$\text{Post Displacement} = \text{Post Width (in)} \times \text{Post Depth (in)} \times (\text{Embedded Depth} / 1728)$$
  $$\text{Net Volume per Hole} = \text{Hole Volume} - \text{Post Displacement}$$
* **Required Inputs:**
  * Number of Post Holes
  * Hole Diameter (in - default 10" or 12")
  * Hole Depth (in - default 36" for frost depth)
  * Post Dimension (e.g., 4x4 lumber, 6x6 lumber, round steel post)
* **Optional Inputs:**
  * Bag Weight Preference (50 lb fast-setting vs 60 lb vs 80 lb standard)
* **Output Values:**
  * Total Volume ($cu\ yds$ and $cu\ ft$)
  * Bags per Hole and Total Bags for Project
  * Fast-setting (red bag) vs Standard mix comparison
  * Estimated Material Cost
* **Key Assumptions:** Post extends to the bottom or within 2" of bottom of the hole; frost lines dictate depth.
* **Related Guides:** `fence-post-depth-and-concrete-guide`, `deck-footing-size-calculator-guide`

---

### Tool 6: Mulch Yardage & Bag Calculator
* **Slug:** `/calculators/mulch-calculator`
* **Category:** `landscaping`
* **Short Description:** Calculate bulk cubic yards and retail bags (2 cu ft / 3 cu ft) of mulch required for garden beds.
* **Target Intent:** Homeowners refreshing flower beds in spring or fall.
* **Primary Calculation:**
  $$\text{Area} = \text{Length} \times \text{Width} \quad \text{or input direct sq ft}$$
  $$\text{Cubic Feet} = \text{Area (sq ft)} \times (\text{Depth (in)} / 12)$$
  $$\text{Cubic Yards} = \text{Cubic Feet} / 27$$
  $$\text{2 cu ft Bags} = \lceil \text{Cubic Feet} / 2 \rceil$$
* **Required Inputs:**
  * Total Garden Bed Area ($sq\ ft$) OR Dimensions (Length $\times$ Width)
  * Desired Depth (in - standard: 3" for new bed, 2" for top-dressing)
* **Optional Inputs:**
  * Mulch Type (Hardwood Shredded, Pine Bark, Cedar, Black Dyed, Rubber)
  * Purchasing Method: Bulk Delivery ($35–$50/yd) vs Bagged ($3.50–$5.50/bag)
* **Output Values:**
  * Cubic Yards required
  * Number of 2 cu ft Bags
  * Number of 3 cu ft Bags
  * Bulk vs Bagged Cost Comparison breakdown
* **Key Assumptions:** Standard mulch settling of approx 8% accounted for in depth guidance.
* **Related Guides:** `how-much-mulch-do-i-need`, `bulk-vs-bagged-mulch-cost`

---

### Tool 7: Gravel & Crushed Stone Calculator
* **Slug:** `/calculators/gravel-calculator`
* **Category:** `landscaping`
* **Short Description:** Calculate tons and cubic yards of gravel, crushed stone, pea gravel, or road base for driveways, paths, and slab subbases.
* **Target Intent:** Homeowners building gravel paths, driveways, French drains, or patio base layers.
* **Primary Calculation:**
  $$\text{Volume (cu yd)} = (\text{Length} \times \text{Width} \times (\text{Depth / 12})) / 27$$
  $$\text{Tonnage} = \text{Volume (cu yd)} \times \text{Material Density Factor (approx 1.4 to 1.5 tons/cu yd)}$$
* **Required Inputs:**
  * Length (ft), Width (ft), Depth (in)
  * Material Type: Crushed Stone / #57 Gravel (1.4 tons/yd), Pea Gravel (1.45 tons/yd), Crusher Run / Dense Grade (1.55 tons/yd)
* **Optional Inputs:**
  * Compaction Factor (Default 15% for road base, 5% for loose rock)
  * Cost per Ton (Default $45/ton delivered)
* **Output Values:**
  * Total Volume in Cubic Yards
  * Total Weight in US Tons
  * Number of 50 lb Retail Bags (for small areas)
  * Estimated Material & Delivery Cost
* **Key Assumptions:** Bulk density varies by moisture and quarry source; safety buffer of 10% recommended for uneven subgrade.
* **Related Guides:** `gravel-driveway-depth-and-material-guide`, `how-to-calculate-crushed-stone-tonnage`

---

### Tool 8: Sod Roll & Pallet Calculator
* **Slug:** `/calculators/sod-calculator`
* **Category:** `landscaping`
* **Short Description:** Calculate square footage, sod rolls, and full pallets needed to establish a new lawn.
* **Target Intent:** Homeowners installing a new lawn or repairing turf areas.
* **Primary Calculation:**
  $$\text{Gross Area} = \text{Length} \times \text{Width}$$
  $$\text{Total Area with Waste} = \text{Gross Area} \times 1.08 \quad \text{(8% cut waste for irregular lawns)}$$
  $$\text{Pallets} = \lceil \text{Total Area} / 450 \text{ sq ft} \rceil \quad \text{(standard US pallet = 450–500 sq ft)}$$
  $$\text{Standard Rolls (10 sq ft)} = \lceil \text{Total Area} / 10 \rceil$$
* **Required Inputs:**
  * Lawn Dimensions (Length $\times$ Width) or Direct Square Footage
* **Optional Inputs:**
  * Lawn Shape: Simple Rectangle (5% waste) vs Irregular/Curved (10% waste)
  * Turf Variety (Bermuda, Kentucky Bluegrass, St. Augustine, Zoysia, Fescue)
  * Price per Pallet ($180–$350/pallet)
* **Output Values:**
  * Total Lawn Area ($sq\ ft$)
  * Number of Full Pallets needed
  * Individual Rolls needed
  * Estimated Sod Material Cost
  * Starter Fertilizer & Topsoil Top-dress recommendations
* **Key Assumptions:** Standard sod pallet in the US covers 450 to 500 sq ft; individual rolls measure $2 \times 5$ ft (10 sq ft).
* **Related Guides:** `how-to-measure-and-calculate-sod`, `diy-sod-installation-cost-guide`

---

### Tool 9: Drywall Sheet & Mud Calculator
* **Slug:** `/calculators/drywall-calculator`
* **Category:** `walls-drywall`
* **Short Description:** Calculate drywall panels (4x8 or 4x12), joint compound (mud), drywall tape, and screws for rooms or basements.
* **Target Intent:** Homeowners finishing basements, bonus rooms, or garage walls.
* **Primary Calculation:**
  $$\text{Wall Area} = 2 \times (\text{L} + \text{W}) \times \text{H} - \text{Openings}$$
  $$\text{Ceiling Area} = \text{L} \times \text{W}$$
  $$\text{Total Area} = \text{Wall Area} + \text{Ceiling Area}$$
  $$\text{4x8 Sheets (32 sq ft)} = \lceil (\text{Total Area} \times 1.10) / 32 \rceil$$
  $$\text{4x12 Sheets (48 sq ft)} = \lceil (\text{Total Area} \times 1.10) / 48 \rceil$$
* **Required Inputs:**
  * Room Length, Width, Ceiling Height
  * Include Ceiling (Yes/No)
* **Optional Inputs:**
  * Sheet Size Preference: 4x8 ft (standard DIY) vs 4x12 ft (fewer seams)
  * Thickness: 1/2" (Standard) vs 5/8" (Fire-rated / Ceilings)
  * Deduct Doors / Windows
* **Output Values:**
  * Total Drywall Surface Area ($sq\ ft$)
  * Total Number of Drywall Sheets (4x8 and 4x12 options displayed side-by-side)
  * Joint Compound / Mud (4.5 gallon buckets @ approx 1 bucket per 100 sq ft / 3 sheets)
  * Drywall Joint Tape (500 ft rolls)
  * Drywall Screws (1-1/4" bugle head, in lbs)
  * Estimated Material Cost
* **Key Assumptions:** 10% waste for cutoffs around outlets, windows, and angled corners; 1 lb of screws per 300 sq ft.
* **Related Guides:** `how-much-drywall-do-i-need`, `drywall-sheet-size-4x8-vs-4x12`

---

### Tool 10: Deck Board & Framing Estimator
* **Slug:** `/calculators/deck-material-calculator`
* **Category:** `fencing-decking`
* **Short Description:** Estimate surface decking boards, joists, ledger board, beam lumber, and deck screws for attached rectangular decks.
* **Target Intent:** DIY homeowners planning a backyard deck build to get a preliminary materials list.
* **Primary Calculation:**
  $$\text{Deck Area} = \text{Length (along house)} \times \text{Width (projection)}$$
  $$\text{Deck Boards (5.5" wide nominal 6")} = \lceil (\text{Projection} \times 12) / 5.75 \rceil \text{ rows}$$
  $$\text{Linear Feet of Decking} = \text{Rows} \times \text{Length} \times 1.10 \text{ waste}$$
  $$\text{Joists Count (16" O.C.)} = \lceil (\text{Length} \times 12) / 16 \rceil + 1$$
* **Required Inputs:**
  * Deck Length (along house wall, ft)
  * Deck Width (projection out from house, ft)
  * Joist Spacing: 16" on-center (standard wood) or 12" on-center (composite)
* **Optional Inputs:**
  * Board Material: Pressure-Treated Pine, Cedar, or Composite / Trex
  * Board Length: 12 ft, 16 ft, or 20 ft
* **Output Values:**
  * Deck Square Footage
  * Total Decking Boards (by standard length) or Linear Footage
  * Joist Count (e.g., 2x8 or 2x10 PT lumber)
  * Rim Joist and Ledger Board lengths
  * Box of Structural Screws & Hidden Fasteners
  * Cost Range by Material Tier (Treated Wood vs Cedar vs Premium Composite)
* **Key Assumptions:** Attached single-level rectangular deck; railings, stairs, and concrete footings calculated as separate modular components.
* **Related Guides:** `how-to-estimate-deck-materials`, `wood-vs-composite-deck-cost`

---

### Tool 11: Wood Privacy Fence Calculator
* **Slug:** `/calculators/fence-material-calculator`
* **Category:** `fencing-decking`
* **Short Description:** Calculate fence posts, 2x4 rails, pickets, gate hardware, and post-hole concrete for residential privacy fencing.
* **Target Intent:** Homeowners planning to build or replace a standard 6 ft dog-ear wood privacy fence.
* **Primary Calculation:**
  $$\text{Post Sections} = \lceil \text{Total Fence Length (ft)} / \text{Post Spacing (typically 8 ft or 6 ft)} \rceil$$
  $$\text{Posts Count} = \text{Sections} + 1 \quad (\text{plus 2 per gate})$$
  $$\text{2x4 Rails (3 rails for 6ft fence)} = \text{Sections} \times 3$$
  $$\text{Pickets (5.5" pickets)} = \lceil (\text{Fence Length} \times 12) / 5.5 \rceil \times 1.05 \text{ waste}$$
* **Required Inputs:**
  * Total Fence Length (Linear Feet)
  * Fence Height (6 ft privacy standard or 4 ft)
* **Optional Inputs:**
  * Post Spacing (8 ft standard or 6 ft for high wind)
  * Number of Gates (3 ft or 4 ft walk gates)
  * Picket Width (3.5" or 5.5" standard)
  * Picket Style: Side-by-side (standard) vs Board-on-board (shadowbox)
* **Output Values:**
  * Number of 4x4 Posts (8 ft length for 6 ft fence)
  * Number of 2x4 Backer Rails (8 ft or 10 ft)
  * Number of Vertical Pickets
  * Concrete Bags for Posts (1.5 to 2 bags of 60lb mix per post)
  * Gate Kit Hardware Count
  * Estimated Material Cost
* **Key Assumptions:** Posts are buried 24" to 30" deep in concrete; flat terrain; standard dog-ear pickets.
* **Related Guides:** `how-to-estimate-wood-fence-materials`, `fence-post-spacing-6ft-vs-8ft`

---

### Tool 12: Roofing Shingle & Bundle Calculator
* **Slug:** `/calculators/roofing-calculator`
* **Category:** `roofing`
* **Short Description:** Convert roof footprint and pitch into actual roof area, roofing squares, architectural shingle bundles, and underlayment rolls.
* **Target Intent:** Homeowners estimating shingle replacement costs and verifying contractor square counts.
* **Primary Calculation:**
  $$\text{Footprint Area} = \text{Ground Length} \times \text{Ground Width} \times (1 + \text{Eave Overhang})$$
  $$\text{Pitch Multiplier} = \sqrt{1 + (\text{Rise} / 12)^2} \quad (\text{e.g., 6/12 pitch} = 1.118)$$
  $$\text{True Roof Area} = \text{Footprint Area} \times \text{Pitch Multiplier} \times (1 + \text{Waste})$$
  $$\text{Roofing Squares} = \text{True Roof Area} / 100$$
  $$\text{Shingle Bundles} = \text{Roofing Squares} \times 3 \quad (\text{3 bundles per square})$$
* **Required Inputs:**
  * Home Footprint Area (sq ft) OR Length $\times$ Width of structure
  * Roof Pitch / Slope (e.g., Flat, 4/12, 6/12, 8/12, 10/12, 12/12)
* **Optional Inputs:**
  * Roof Complexity: Simple Gable (10% waste) vs Hip / Valleys (15% waste) vs Complex (20%)
  * Shingle Grade: 3-Tab Asphalt vs Architectural / Dimensional vs Designer
  * Underlayment Type: Standard 15# felt vs Synthetic (10 square roll)
* **Output Values:**
  * Actual Roof Surface Area ($sq\ ft$)
  * Roofing Squares ($100\ sq\ ft\ units$)
  * Shingle Bundles to order
  * Starter Strip Shingles (linear feet)
  * Ridge Cap Shingle bundles
  * Rolls of Synthetic Underlayment & Ice & Water Shield
  * Estimated DIY Material Cost vs Pro Installed Cost ($350–$650/square)
* **Key Assumptions:** Standard asphalt shingles packaged at 3 bundles = 1 square (100 sq ft); roof pitch multiplier derived geometrically.
* **Related Guides:** `how-to-calculate-roofing-squares`, `understanding-roof-pitch-multipliers`

---

### Tool 13: Paver Patio & Sand Calculator
* **Slug:** `/calculators/paver-patio-calculator`
* **Category:** `concrete-masonry`
* **Short Description:** Calculate concrete pavers, crushed gravel base, bedding sand, and polymeric joint sand for patios and walkways.
* **Target Intent:** Homeowners building an interlocking concrete paver patio.
* **Primary Calculation:**
  $$\text{Patio Area} = \text{Length} \times \text{Width}$$
  $$\text{Paver Units} = (\text{Patio Area} / \text{Single Paver Area}) \times 1.10 \text{ waste}$$
  $$\text{Gravel Base (4" compacted)} = (\text{Patio Area} \times (4/12)) / 27 \times 1.15 \text{ compaction}$$
  $$\text{Bedding Sand (1" uncompacted)} = (\text{Patio Area} \times (1/12)) / 27$$
* **Required Inputs:**
  * Patio Dimensions: Length (ft) and Width (ft)
  * Paver Size: 4x8 Holland stone, 6x6, 12x12, or multi-size 3-piece kit
* **Optional Inputs:**
  * Base Depth: 4" (pedestrian/patio) vs 6" (heavy freeze/thaw)
  * Edge Restraint Linear Footage (perimeter)
* **Output Values:**
  * Total Paver Units or Square Footage of pavers
  * Tons / Cubic Yards of Crushed Stone Base
  * Tons / Cubic Yards of Concrete Sand (Bedding layer)
  * Bags of Polymeric Joint Sand (50 lb bags @ 75–100 sq ft/bag)
  * Linear feet of snap edge restraint & spikes
  * Complete tiered material cost estimate
* **Key Assumptions:** 4" compacted gravel base is minimum standard for stable pedestrian patio; 1" screeded sand bed cannot be compacted prior to laying pavers.
* **Related Guides:** `paver-patio-base-depth-and-sand-calculation`, `paver-patterns-and-cut-waste`

---

### Tool 14: Topsoil & Garden Bed Calculator
* **Slug:** `/calculators/topsoil-calculator`
* **Category:** `landscaping`
* **Short Description:** Estimate cubic yards and bags of screened topsoil or compost for lawn leveling, raised garden beds, and berms.
* **Target Intent:** Gardeners and homeowners filling raised beds or top-dressing uneven lawns.
* **Primary Calculation:**
  $$\text{Volume (cu ft)} = \text{Length (ft)} \times \text{Width (ft)} \times (\text{Depth (in)} / 12)$$
  $$\text{Cubic Yards} = \text{Volume (cu ft)} / 27 \times 1.10 \text{ settling}$$
  $$\text{0.75 cu ft Retail Bags} = \lceil \text{Volume (cu ft)} / 0.75 \rceil$$
  $$\text{1 cu ft Retail Bags} = \lceil \text{Volume (cu ft)} / 1.0 \rceil$$
* **Required Inputs:**
  * Length (ft), Width (ft), and Soil Depth (in) OR Number of Raised Beds with standard sizes
* **Optional Inputs:**
  * Application: New Raised Garden Bed (8–12" deep), Lawn Top-Dressing (0.25–0.5" deep), Garden Bed Amendment (2–3" deep)
  * Blend Selection: 100% Screened Topsoil vs 50/50 Soil-Compost Blend
* **Output Values:**
  * Total Volume in Cubic Yards
  * Total Volume in Cubic Feet
  * Number of 0.75 cu ft / 1.0 cu ft retail bags
  * Bulk truck delivery vs retail bag cost comparison
* **Key Assumptions:** Loose topsoil settles roughly 10–15% after watering; bulk delivery is economical above 1.5–2 cubic yards.
* **Related Guides:** `topsoil-calculator-for-raised-garden-beds`, `how-much-soil-to-level-a-lawn`

---

### Tool 15: Baseboard & Trim Molding Calculator
* **Slug:** `/calculators/baseboard-trim-calculator`
* **Category:** `flooring`
* **Short Description:** Calculate linear feet, piece counts, and cut allowance for baseboards, quarter round/shoe molding, and door casings.
* **Target Intent:** Homeowners finishing floors or remodeling trim looking to buy standard 8 ft, 12 ft, or 16 ft trim sticks.
* **Primary Calculation:**
  $$\text{Room Perimeter} = 2 \times (\text{Length} + \text{Width})$$
  $$\text{Net Trim Feet} = \text{Room Perimeter} - (\text{Doors} \times 2.5 \text{ ft})$$
  $$\text{Gross Linear Feet} = \text{Net Trim Feet} \times 1.15 \text{ (15% waste for 45° miters and scarf joints)}$$
  $$\text{Pieces} = \lceil \text{Gross Linear Feet} / \text{Piece Length (e.g., 8 ft or 12 ft)} \rceil$$
* **Required Inputs:**
  * Room Length (ft) and Width (ft)
  * Number of Doorway Openings to subtract
* **Optional Inputs:**
  * Commercial Piece Length: 8 ft (car transportable), 12 ft, or 16 ft (contractor length)
  * Add Shoe Molding / Quarter Round (Yes/No)
  * Material: Primed MDF vs Finger-Joint Pine vs Solid Hardwood (Oak/Maple)
* **Output Values:**
  * Net Linear Feet of Baseboard
  * Recommended Purchase Linear Feet (including 15% miter waste)
  * Exact Piece Count for chosen stick length
  * Shoe Molding Linear Feet (if selected)
  * Estimated Material Cost
* **Key Assumptions:** Standard residential doorway = 30" to 36" (approx 2.5 to 3 ft opening deduction); mitered outside corners and scarf joints consume 6–8" per cut.
* **Related Guides:** `how-to-calculate-baseboard-trim-with-waste`, `mdf-vs-pine-trim-cost`

---

## 7. Guide Content Architecture

The site will launch with **18 high-intent, editorial-grade planning and calculation guides**. Each guide directly supports a primary calculator and captures informational search queries.

| # | Guide Title | Slug (`/guides/...`) | Target Calculator | Primary Intent / Search Keyword | Guide Type | Supporting Questions Answered |
|---|---|---|---|---|---|---|
| 1 | How Much Flooring Do I Need? A Complete Measuring Guide | `how-much-flooring-do-i-need` | `flooring-calculator` | "how much flooring do I need" | How-To Calculate | How to measure irregular rooms, closet allowances, transition deductions |
| 2 | Flooring Waste Factors: What Percentage Extra to Buy | `flooring-waste-factor-guide` | `flooring-calculator` | "flooring waste factor percentage" | Planning Guide | Straight vs diagonal vs herringbone waste; carton rounding rules |
| 3 | How to Estimate Tile Projects: Square Footage, Grout & Mortar | `how-to-estimate-tile-projects` | `tile-calculator` | "how much tile do I need" | How-To Calculate | Wall vs floor tile math; thinset trowel coverage; grout bag calculations |
| 4 | Tile Pattern Waste Factors: Herringbone, Subway & Large Format | `tile-pattern-waste-factors` | `tile-calculator` | "herringbone tile waste percentage" | Planning Guide | Why herringbone requires 18-20% extra; cutting around fixtures |
| 5 | How Much Paint Do I Need? Room Measurement & Coverage Guide | `how-much-paint-do-i-need` | `paint-calculator` | "how many gallons of paint for a room" | How-To Calculate | Deducting doors/windows; when 1 coat vs 2 coats is required |
| 6 | Interior Painting Cost Breakdown: DIY vs Hiring a Pro | `interior-painting-cost-guide` | `paint-calculator` | "interior paint cost per square foot" | Cost Guide | Price per gallon tiers; tape, brushes, rollers cost; labor costs |
| 7 | How to Calculate Concrete for a Slab: Cubic Yards & Bags | `how-to-calculate-concrete-for-a-slab` | `concrete-slab-calculator` | "how to calculate concrete for a slab" | How-To Calculate | Converting inches to feet; dividing by 27; accounting for subgrade dip |
| 8 | Bagged Concrete vs. Ready-Mix Truck: Cost & Volume Comparison | `bagged-vs-ready-mix-concrete` | `concrete-slab-calculator` | "bagged concrete vs ready mix truck" | Comparison Guide | When is a truck cheaper? Short load fee thresholds; mixing fatigue |
| 9 | Concrete Footing & Post Hole Depth Guide | `fence-post-depth-and-concrete-guide` | `concrete-post-hole-calculator` | "how deep should fence posts be" | Project Guide | US frost line map considerations; diameter rules ($3\times$ post width) |
| 10 | How Much Mulch Do I Need? Cubic Yards & Bag Calculation | `how-much-mulch-do-i-need` | `mulch-calculator` | "how much mulch do I need for garden" | How-To Calculate | 2" vs 3" depth rules; calculating odd-shaped curved flower beds |
| 11 | Bulk vs Bagged Mulch: Price Comparison & Delivery Realities | `bulk-vs-bagged-mulch-cost` | `mulch-calculator` | "bulk mulch vs bags cost" | Cost Guide | Truck delivery fees; driveway dumping vs moving 50 individual bags |
| 12 | Gravel Driveway & Path Materials: Sizing, Depth & Tonnage | `gravel-driveway-depth-and-material-guide` | `gravel-calculator` | "how much gravel for driveway" | Planning Guide | Base rock vs top rock; converting cubic yards to tons by rock type |
| 13 | How to Measure and Calculate Sod for Your Lawn | `how-to-measure-and-calculate-sod` | `sod-calculator` | "how many pallets of sod do I need" | How-To Calculate | Measuring pie-shaped yards; roll vs pallet dimensions; watering prep |
| 14 | How Much Drywall Do I Need? Sheet Layout & Waste Estimation | `how-much-drywall-do-i-need` | `drywall-calculator` | "how many sheets of drywall for room" | How-To Calculate | Horizontal vs vertical hanging; joint compound & screw count rules |
| 15 | Drywall 4x8 vs 4x12 Sheets: Pros, Cons & When to Use Which | `drywall-sheet-size-4x8-vs-4x12` | `drywall-calculator` | "4x8 vs 4x12 drywall" | Planning Guide | Ceiling height matching; reducing butt joints; transport constraints |
| 16 | How to Estimate Deck Materials: Lumber, Hardware & Fasteners | `how-to-estimate-deck-materials` | `deck-material-calculator` | "how to estimate deck materials" | How-To Calculate | Joist spacing (12" vs 16"); cantilever limits; ledger board safety |
| 17 | Wood Privacy Fence Material Estimating: Posts, Rails & Pickets | `how-to-estimate-wood-fence-materials` | `fence-material-calculator` | "how to calculate fence materials" | How-To Calculate | 6ft vs 8ft post spacing; 2 vs 3 rails; dog-ear vs shadowbox |
| 18 | How to Calculate Roofing Squares and Shingle Bundles | `how-to-calculate-roofing-squares` | `roofing-calculator` | "how to calculate roofing squares" | How-To Calculate | Converting ground footprint with pitch multipliers; valley waste rules |

---

## 8. Homepage Information Architecture

The homepage is deliberately architected to **reject the "generic directory of 50 links" anti-pattern**. Instead, it acts as a **Project Planning Concierge**, immediately framing the site around homeowner project phases:

```
+-------------------------------------------------------------------------+
| [Header] Logo: Home Project Tools | Projects | Calculators | Guides    |
+-------------------------------------------------------------------------+
| SECTION 1: HERO & PRODUCT VALUE PROPOSITION                             |
| "Plan your project. Estimate materials. Understand the cost."           |
| Subtitle: Accurate US-standard residential material calculations...     |
| [Quick Project Selector Dropdown: "I'm planning to... [Select Project]"]|
| Direct Metric Badges: [No Sign-up] [Instant Results] [Transparent Costs]|
+-------------------------------------------------------------------------+
| SECTION 2: POPULAR PROJECT ESTIMATORS (Card Showcase with Metrics)      |
| 4 Featured Core Tools with visual badges & sample outputs:              |
| [Concrete Slab Pour] [Flooring & Cartons] [Interior Painting] [Mulch]   |
| "Enter 2 measurements -> Get full bill of materials & cost range"       |
+-------------------------------------------------------------------------+
| SECTION 3: BROWSE BY PROJECT CATEGORY (7 Structured Visual Hubs)        |
| Clean architectural cards showing tools + guides per domain:            |
| [Flooring] [Painting] [Concrete & Masonry] [Landscaping & Groundwork]   |
| [Walls & Drywall] [Fencing & Decking] [Roofing & Siding]                |
+-------------------------------------------------------------------------+
| SECTION 4: THE 3-STEP PLANNING FRAMEWORK (How It Works)                 |
| Step 1: Measure Your Space (Formulas & deduction rules)                 |
| Step 2: Calculate True Materials (Packaging rounding + cut waste)       |
| Step 3: Model Your Budget (Low / Mid / High US retail pricing)          |
+-------------------------------------------------------------------------+
| SECTION 5: TRANSPARENT COST ESTIMATION PHILOSOPHY                       |
| Explanation of our benchmark data methodology:                          |
| - Why we present ranges, never fake single numbers                      |
| - DIY Materials vs Contractor Installed spreads                         |
| - National retail pricing references updated quarterly                  |
+-------------------------------------------------------------------------+
| SECTION 6: PRACTICAL PLANNING GUIDES & HOW-TOS (Editorial Feed)         |
| 6 featured high-value guides with reading time and key takeaways        |
+-------------------------------------------------------------------------+
| SECTION 7: METHODOLOGY, ACCURACY & TRUST FOOTER BANNER                  |
| Built on ASTM & US building standards. No sponsored bias.               |
+-------------------------------------------------------------------------+
```

### Detailed Breakdown of Homepage Sections:
1. **Hero Section:**
   * **Purpose:** Establish brand authority and instant functional utility within 3 seconds.
   * **User Intent:** Fast routing to the user's specific project without hunting.
   * **CTA:** Interactive dropdown selector ("Choose your project...") which instantly scrolls or routes to the tool.
   * **SEO Value:** H1 containing primary positioning keywords; immediate internal link signals.
2. **Popular Project Estimators:**
   * **Purpose:** Satisfy 80% of casual visits with top 4 high-intent calculators.
   * **Content:** Cards with micro-visuals, estimated time to calculate ("30 sec"), and primary outputs.
3. **Category Hubs Grid:**
   * **Purpose:** Clean, hierarchical categorization; separates Home Project Tools from flat directory tools.
   * **SEO Value:** Strong thematic clustering linking to category landing pages.
4. **The 3-Step Framework:**
   * **Purpose:** Educate users on the difference between theoretical math ($L \times W$) and practical job-site reality (waste, packaging units, mortar).
   * **SEO Value:** Builds authoritativeness and contextual relevance.
5. **Cost Estimation Methodology:**
   * **Purpose:** Build trust by setting expectations regarding local labor vs DIY material costs.
6. **Editorial Feed:**
   * **Purpose:** Connect calculators with foundational guides.

---

## 9. Calculator Page Architecture & Component System

Every calculator page follows a strict, standardized **13-Module Editorial & Interactive Architecture**:

```
+---------------------------------------------------------------------------+
| 1. BREADCRUMB: Home > Categories > [Category Name] > [Calculator Name]   |
+---------------------------------------------------------------------------+
| 2. PAGE HEADER: Title (H1), Meta Badge ("US Standards", "Updated 2026")   |
| 3. SHORT EXPLANATION: 2 sentences explaining what this tool calculates    |
+---------------------------------------------------------------------------+
| 4. INTERACTIVE CALCULATOR INTERFACE                                       |
|    +----------------------------------+---------------------------------+ |
|    | INPUT PANEL (Left on Desktop)    | LIVE RESULT PANEL (Right/Sticky)| |
|    | - Visual unit toggles (ft / in)  | - Primary Output Highlight      | |
|    | - Form fields with clear labels  | - Commercial Packaging Units    | |
|    | - Preset buttons (e.g. 10x10)    | - Recommended Waste Included    | |
|    | - Waste factor selector slider   | - Estimated Cost Range Display  | |
|    | - Live validation warnings       | - [Copy / Print Summary Button] | |
|    +----------------------------------+---------------------------------+ |
+---------------------------------------------------------------------------+
| 5. MATERIAL BREAKDOWN / BILL OF MATERIALS (BOM) TABLE                     |
|    Itemized list: primary material, fasteners, accessories, adhesive       |
+---------------------------------------------------------------------------+
| 6. HOW WE CALCULATE THIS: Exact Mathematical Formulas & Step-by-Step      |
+---------------------------------------------------------------------------+
| 7. FORMULA ASSUMPTIONS & PACKAGING CONVENTIONS                            |
|    Box rounding, bag weights, cut waste allowances, trowel notches         |
+---------------------------------------------------------------------------+
| 8. ESTIMATED PROJECT COST BENCHMARKS: DIY vs Contractor Cost Table        |
+---------------------------------------------------------------------------+
| 9. PRACTICAL JOB-SITE PLANNING TIPS (Avoid costly DIY mistakes)           |
+---------------------------------------------------------------------------+
| 10. RELATED CALCULATORS (Contextual cross-links in same/adjacent domain)  |
+---------------------------------------------------------------------------+
| 11. RELATED PRACTICAL GUIDES (Contextual reading before buying materials) |
+---------------------------------------------------------------------------+
| 12. FREQUENTLY ASKED QUESTIONS (Accordion with FAQPage Schema)            |
+---------------------------------------------------------------------------+
| 13. DISCLAIMER & METHODOLOGY NOTE                                         |
+---------------------------------------------------------------------------+
```

### Reusable Astro / Client Architecture:
* **Static Shell (`.astro`):** Breadcrumb, Page Header, Explanation, Formula write-up, Cost Tables, Tips, FAQs, and SEO Schemas are rendered statically at build time for optimal Core Web Vitals (LCP < 0.8s, zero CLS).
* **Interactive Island (Vanilla TS / Web Component or Custom Element):**
  * `<project-calculator id="calc-flooring">`: Encapsulated client-side calculation script.
  * Listens to input events with immediate recalculation (no submission button needed).
  * Updates DOM nodes with `aria-live="polite"` for screen reader accessibility.
  * Zero heavy frameworks (no React or Vue bundle loaded onto calculator pages).

---

## 10. URL Architecture & Routing Rules

A clean, predictable, shallow 2-tier and 3-tier hierarchy:

### Core Pages:
* `/` — Homepage (Project-oriented entry)
* `/about` — About Home Project Tools, Editorial Standards & Calculation Methodology
* `/contact` — Feedback, suggestions, calculation review requests

### Category Hubs:
* `/projects/flooring`
* `/projects/painting`
* `/projects/concrete-masonry`
* `/projects/landscaping`
* `/projects/walls-drywall`
* `/projects/fencing-decking`
* `/projects/roofing`

### Calculator Pages (All under `/calculators/` for maximum search clarity):
* `/calculators/flooring-calculator`
* `/calculators/tile-calculator`
* `/calculators/paint-calculator`
* `/calculators/concrete-slab-calculator`
* `/calculators/concrete-post-hole-calculator`
* `/calculators/mulch-calculator`
* `/calculators/gravel-calculator`
* `/calculators/sod-calculator`
* `/calculators/drywall-calculator`
* `/calculators/deck-material-calculator`
* `/calculators/fence-material-calculator`
* `/calculators/roofing-calculator`
* `/calculators/paver-patio-calculator`
* `/calculators/topsoil-calculator`
* `/calculators/baseboard-trim-calculator`

### Guide Pages (All under `/guides/`):
* `/guides/how-much-flooring-do-i-need`
* `/guides/flooring-waste-factor-guide`
* `/guides/how-to-estimate-tile-projects`
* `/guides/tile-pattern-waste-factors`
* `/guides/how-much-paint-do-i-need`
* `/guides/interior-painting-cost-guide`
* `/guides/how-to-calculate-concrete-for-a-slab`
* `/guides/bagged-vs-ready-mix-concrete`
* `/guides/fence-post-depth-and-concrete-guide`
* `/guides/how-much-mulch-do-i-need`
* `/guides/bulk-vs-bagged-mulch-cost`
* `/guides/gravel-driveway-depth-and-material-guide`
* `/guides/how-to-measure-and-calculate-sod`
* `/guides/how-much-drywall-do-i-need`
* `/guides/drywall-sheet-size-4x8-vs-4x12`
* `/guides/how-to-estimate-deck-materials`
* `/guides/how-to-estimate-wood-fence-materials`
* `/guides/how-to-calculate-roofing-squares`

---

## 11. TypeScript Data Architecture

To ensure separation of content, logic, and presentation, all data structures are strictly typed in `src/types/`:

### Core Type Definitions (`src/types/index.ts`):

```typescript
/**
 * Supported Category Identifiers
 */
export type CategoryId = 
  | 'flooring'
  | 'painting'
  | 'concrete-masonry'
  | 'landscaping'
  | 'walls-drywall'
  | 'fencing-decking'
  | 'roofing';

/**
 * Category Metadata Structure
 */
export interface CategoryDefinition {
  id: CategoryId;
  name: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  accentColor: string;
  calculatorIds: string[];
  guideSlugs: string[];
}

/**
 * Material Price Benchmark Structure
 */
export interface MaterialPriceBenchmark {
  materialId: string;
  name: string;
  category: CategoryId;
  unit: string;                     // e.g. "sq ft", "80lb bag", "cu yd", "gallon"
  priceLow: number;                 // US dollar low retail tier
  priceTypical: number;             // US dollar average retail tier
  priceHigh: number;                // US dollar premium retail tier
  diyInstallationNote: string;
  contractorLaborPerUnit?: {
    low: number;
    typical: number;
    high: number;
    unit: string;                   // e.g. "per sq ft", "per square"
  };
  lastAuditedDate: string;          // ISO date string "2026-01-15"
  sourceNote: string;
}

/**
 * Calculator Input Field Schema
 */
export interface CalculatorInputField {
  id: string;
  label: string;
  description?: string;
  type: 'number' | 'select' | 'boolean';
  defaultValue: number | string | boolean;
  unit?: string;                    // e.g. "ft", "in", "sq ft"
  min?: number;
  max?: number;
  step?: number;
  options?: Array<{ label: string; value: string | number }>;
  required: boolean;
}

/**
 * Calculator Definition Schema
 */
export interface CalculatorDefinition {
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  categoryId: CategoryId;
  shortDescription: string;
  inputs: CalculatorInputField[];
  primaryOutputUnit: string;
  packagingUnitDescription: string;
  standardWasteDefaultPercent: number;
  formulaDescription: string;
  formulaMathExpression: string;
  assumptions: string[];
  jobSiteTips: string[];
  faqs: Array<{ question: string; answer: string }>;
  relatedCalculatorIds: string[];
  relatedGuideSlugs: string[];
  priceBenchmarkIds: string[];
}

/**
 * Planning Guide Schema
 */
export interface GuideDefinition {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  categoryId: CategoryId;
  targetCalculatorId: string;
  guideType: 'how-to-calculate' | 'planning' | 'cost' | 'project';
  summary: string;
  readingTimeMinutes: number;
  publishedDate: string;
  updatedDate: string;
  relatedCalculatorIds: string[];
  relatedGuideSlugs: string[];
  faqs: Array<{ question: string; answer: string }>;
}

/**
 * SEO & OpenGraph Payload Schema
 */
export interface PageSeoMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType: 'website' | 'article';
  ogImage?: string;
  schemaType: 'WebPage' | 'Article' | 'SoftwareApplication' | 'FAQPage';
  jsonLd: Record<string, any>[];
}
```

---

## 12. Cost Estimation Strategy & Architecture

### 12.1 The Estimation Philosophy
1. **Never Display a Single Exact Price:** Single-dollar estimates ($1,248.52) mislead users and destroy trust when retail shelf prices vary.
2. **Always Present 3 Tiers:**
   * **Economy / Budget Tier:** Contractor-pack prices, standard builder-grade materials.
   * **Typical / Most Common Tier:** Popular mid-range DIY selections (e.g., standard LifeProof LVP, Behr Premium Plus paint, Quikrete 80lb).
   * **Premium Tier:** High-end architectural materials (e.g., solid hardwood, Benjamin Moore Aura, custom pavers).
3. **Explicit Labor vs. Material Separation:**
   * Clearly present **"DIY Material Only"** vs. **"Estimated Contractor Installed Total"**.
4. **Transparent Regional Notice:**
   * Include a standardized notice: *"Estimates reflect national US retail material averages. Local contractor labor rates vary significantly based on metro area, site accessibility, and demand."*

### 12.2 Centralized Price Store (`src/data/prices.ts`)
All pricing data is decoupled from calculator code into a clean, audited repository:

```typescript
export const MATERIAL_PRICES: Record<string, MaterialPriceBenchmark> = {
  'lvp-flooring': {
    materialId: 'lvp-flooring',
    name: 'Luxury Vinyl Plank (LVP)',
    category: 'flooring',
    unit: 'sq ft',
    priceLow: 1.89,
    priceTypical: 3.29,
    priceHigh: 6.50,
    diyInstallationNote: 'Does not include underlayment or transition molding.',
    contractorLaborPerUnit: { low: 1.50, typical: 2.75, high: 4.50, unit: 'per sq ft' },
    lastAuditedDate: '2026-01-10',
    sourceNote: 'Aggregated from US national home improvement retailers'
  },
  'concrete-80lb-bag': {
    materialId: 'concrete-80lb-bag',
    name: '80 lb High-Strength Concrete Mix',
    category: 'concrete-masonry',
    unit: '80lb bag',
    priceLow: 5.40,
    priceTypical: 6.25,
    priceHigh: 7.50,
    diyInstallationNote: 'Assumes DIY hand-mixing or rental mixer.',
    contractorLaborPerUnit: { low: 4.00, typical: 8.00, high: 14.00, unit: 'per sq ft flatwork' },
    lastAuditedDate: '2026-01-10',
    sourceNote: 'National retail bag averages'
  },
  'interior-paint-gallon': {
    materialId: 'interior-paint-gallon',
    name: 'Interior Latex Paint',
    category: 'painting',
    unit: 'gallon',
    priceLow: 28.00,
    priceTypical: 52.00,
    priceHigh: 85.00,
    diyInstallationNote: 'Covers ~350 sq ft per coat. Excludes primer, tape, and rollers.',
    contractorLaborPerUnit: { low: 1.25, typical: 2.50, high: 4.00, unit: 'per sq ft of wall area' },
    lastAuditedDate: '2026-01-10',
    sourceNote: 'National paint brand benchmarks'
  }
  // ... (Full suite of 25 benchmark materials defined in Phase 2)
};
```

---

## 13. Internal Linking Strategy

Home Project Tools uses an intentional **Topic Cluster (Hub-and-Spoke)** internal linking structure to ensure users never hit a dead end and search engine crawlers understand topical authority:

```
                  +-----------------------+
                  |     HOMEPAGE (/)      |
                  +-----------+-----------+
                              |
                +-------------+-------------+
                |                           |
                v                           v
     +---------------------+     +---------------------+
     | CATEGORY HUB        |     | CATEGORY HUB        |
     | (/projects/flooring)|     | (/projects/concrete)|
     +----------+----------+     +----------+----------+
                |                           |
        +-------+-------+           +-------+-------+
        |               |           |               |
        v               v           v               v
  +-----------+   +-----------+ +-----------+   +-----------+
  |CALCULATOR |   |CALCULATOR | |CALCULATOR |   |CALCULATOR |
  | Flooring  |   |   Tile    | | Slab Pour |   | Post Hole |
  +-----+-----+   +-----+-----+ +-----+-----+   +-----+-----+
        |   ^           |   ^         |   ^           |   ^
        |   |           |   |         |   |           |   |
        v   |           v   |         v   |           v   |
  +-----+-----+   +-----+-----+ +-----+-----+   +-----+-----+
  |   GUIDE   |   |   GUIDE   | |   GUIDE   |   |   GUIDE   |
  | How Much  |   | Tile Extra| | Slab Prep |   | Post Depth|
  | Flooring? |   | For Cuts  | | & Formula |   | & Frost   |
  +-----------+   +-----------+ +-----------+   +-----------+
```

### Linking Rules:
1. **Every Calculator Page links to:**
   * Its Parent Category Hub (`/projects/[category]`)
   * Its Primary Supporting Guide (e.g., `flooring-calculator` $\to$ `how-much-flooring-do-i-need`)
   * 2 to 3 Sibling Calculators (e.g., `tile-calculator` $\to$ `baseboard-trim-calculator` and `flooring-calculator`)
2. **Every Guide Page links to:**
   * Its Target Interactive Calculator in the first 200 words via a prominent calculation callout box
   * 1 to 2 Related Guides in the same category
   * Its Parent Category Hub
3. **Every Category Page links to:**
   * All Calculators in that category
   * All Guides in that category
4. **Anchor Text Discipline:** Always use descriptive, keyword-rich anchor text (e.g., *"Use our Concrete Slab Calculator to verify cubic yardage"* instead of *"click here"*).

---

## 14. SEO & Structured Data Architecture

### 14.1 Title & Description Formulas
* **Calculators:**
  * `Title:` `{Calculator Name} | Free Material & Cost Estimator`
  * *Example:* `Concrete Slab Calculator | Free Yardage & Bag Estimator` (Under 60 chars)
  * `Meta Description:` `Calculate cubic yards, 60lb/80lb concrete bags, and estimated project costs for any patio or shed slab. Includes waste allowances and subgrade tips.` (Under 155 chars)
* **Guides:**
  * `Title:` `{Guide Title} | Home Project Tools`
  * *Example:* `How Much Flooring Do I Need? Complete Measuring Guide | Home Project Tools`
  * `Meta Description:` `Learn how to measure rooms, calculate square footage, and choose the right cut waste percentage for hardwood, tile, and vinyl plank flooring.`

### 14.2 Canonicalization & OpenGraph
* Strict self-referential canonical tags on all pages: `<link rel="canonical" href="https://homeprojecttools.com/..." />`
* Social Share Cards: Custom OpenGraph cards dynamically configured with project category color accents and clear typography.

### 14.3 Structured Data (JSON-LD) Implementations
Every page injects validated Schema.org structured data:
1. **All Pages:** `BreadcrumbList` and `Organization`
2. **Calculator Pages:**
   * `WebApplication` or `SoftwareApplication` with `applicationCategory: "HomeImprovementApplication"` and `operatingSystem: "All"`
   * `FAQPage` containing 3–5 real project questions answered on page
3. **Guide Pages:**
   * `Article` / `HowTo` with `headline`, `datePublished`, `dateModified`, `author: { @type: "Organization", name: "Home Project Tools Editorial Team" }`
   * `FAQPage` schema where applicable

---

## 15. Accessibility & UX Requirements

### 15.1 Usability & Mobile-First Principles
* **Thumb-Zone Optimization:** Form inputs and presets are sized at least 48px in height for easy mobile tapping on job sites.
* **Instant Dynamic Feedback:** Zero page reload. When a measurement changes, results update instantly within 16ms without lag.
* **Visual Clarity:** Clear distinction between required inputs and optional fine-tuning sliders.

### 15.2 WCAG 2.1 AA Compliance Requirements
* **Color Contrast:** Text and interactive elements must maintain a minimum contrast ratio of 4.5:1 against backgrounds (dark slate text on soft light backgrounds).
* **Keyboard Navigation:** Every input, button, and accordion must be navigable using `Tab`, `Shift+Tab`, `Space`, and `Enter`.
* **Explicit Visible Focus Rings:** Custom high-visibility focus ring (`2px solid #2563eb` with `2px offset`) on all interactive elements.
* **Screen Reader Support:**
  * All input fields have explicit `<label for="...">` associations.
  * Calculation result containers utilize `aria-live="polite"` so screen reader users hear updated totals without interrupting typing.
  * Form controls use appropriate `aria-describedby` pointing to unit labels.
* **Semantic Structure:** Exactly one `<h1>` per page, followed by an unbroken `<h2>` $\to$ `<h3>` hierarchy.

---

## 16. Recommended Project Folder Structure

This architecture is optimized for **Astro 5 + TypeScript + Static Site Generation (SSG)**:

```
home-project-tools/
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   ├── sitemap-index.xml
│   └── assets/
│       └── images/              # Optimized WebP/SVG diagrams and OG images
├── src/
│   ├── components/              # Pure Astro UI components
│   │   ├── common/
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   ├── Breadcrumb.astro
│   │   │   ├── SeoHead.astro
│   │   │   └── FaqAccordion.astro
│   │   ├── homepage/
│   │   │   ├── HeroSection.astro
│   │   │   ├── CategoryCard.astro
│   │   │   ├── PopularTools.astro
│   │   │   └── PlanningProcess.astro
│   │   ├── calculator/
│   │   │   ├── CalculatorLayout.astro
│   │   │   ├── ResultCard.astro
│   │   │   ├── BomTable.astro
│   │   │   ├── CostBreakdown.astro
│   │   │   └── FormulaExplainer.astro
│   │   └── guide/
│   │       ├── GuideCard.astro
│   │       └── CalculatorCallout.astro
│   ├── content/                 # Astro Content Collections
│   │   ├── config.ts            # Content schemas for guides & categories
│   │   ├── guides/              # 18 Markdown/MDX guide articles
│   │   └── categories/          # Category editorial introductions
│   ├── data/                    # Centralized, strongly typed static data
│   │   ├── categories.ts        # 7 Category definitions
│   │   ├── calculators.ts       # 15 Calculator metadata & configurations
│   │   └── prices.ts            # Audited US material price benchmarks
│   ├── layouts/
│   │   ├── BaseLayout.astro     # Root HTML shell, fonts, global CSS
│   │   ├── CalculatorPage.astro # Reusable 13-module calculator template
│   │   └── GuidePage.astro      # Editorial longform article template
│   ├── pages/                   # File-system routing
│   │   ├── index.astro          # Homepage
│   │   ├── about.astro          # About & methodology
│   │   ├── projects/
│   │   │   └── [category].astro # 7 Category hub landing pages
│   │   ├── calculators/
│   │   │   └── [slug].astro     # Dynamic or static calculator routes
│   │   └── guides/
│   │       └── [slug].astro     # Dynamic guide routes
│   ├── scripts/                 # Pure TypeScript client-side calculation engines
│   │   ├── calculators/
│   │   │   ├── flooring.ts      # Flooring math & carton rounding logic
│   │   │   ├── tile.ts          # Tile count, grout & mortar math
│   │   │   ├── concrete-slab.ts # Concrete volume & bag calculations
│   │   │   ├── paint.ts         # Paint wall/ceiling math
│   │   │   └── ... (all 15 tool calculation modules)
│   │   ├── core/
│   │   │   ├── math-utils.ts    # Unit conversions, area formulas, rounding
│   │   │   └── dom-binder.ts    # Reactive binding between HTML inputs and math
│   │   └── components/
│   │       └── ProjectCalculatorElement.ts # Lightweight custom element
│   ├── styles/
│   │   ├── global.css           # Modern CSS variables, typography, reset
│   │   └── utilities.css        # Scoped layout utilities
│   └── types/
│       └── index.ts             # Complete TypeScript interfaces and types
├── astro.config.mjs             # Astro 5 configuration (sitemap, tailwind/CSS)
├── tsconfig.json                # Strict TypeScript configuration
└── package.json
```

---

## 17. Recommended Development Phases

To ensure stability and maintainability, implementation must proceed in **4 disciplined phases**:

```
[Phase 1: Architecture & Blueprint] <--- (CURRENT PHASE - COMPLETE)
   │
   ▼
[Phase 2: Core Infrastructure & Data Engine]
   ├── Initialize Astro 5 + TypeScript + CSS architecture
   ├── Build src/types/ and static stores (categories.ts, prices.ts, calculators.ts)
   ├── Implement 15 pure mathematical functions in src/scripts/calculators/
   ├── Implement unit test suite verifying calculation accuracy against ASTM formulas
   └── Build reusable BaseLayout, Header, Footer, and SeoHead components
   │
   ▼
[Phase 3: Calculator Pages & Interactive Islands]
   ├── Implement CalculatorLayout.astro with sticky result panels
   ├── Bind vanilla TS reactive input engines to all 15 calculators
   ├── Implement Bill of Materials (BOM) tables and Cost Range displays
   └── Generate 7 Project Category Hub pages
   │
   ▼
[Phase 4: Editorial Content, SEO Audit & Launch]
   ├── Author 18 high-intent markdown/MDX planning guides
   ├── Implement JSON-LD schema injection (SoftwareApplication, Article, FAQPage)
   ├── Execute cross-linking audit (Category <-> Calculator <-> Guide)
   ├── Validate Lighthouse score: 100 Performance, 100 Accessibility, 100 SEO
   └── Vercel static deployment setup
```

---

## 18. Risks and Potential Architectural Problems (With Mitigations)

| # | Risk / Problem | Impact | Mitigation Strategy |
|---|---|---|---|
| 1 | **Stale or Misleading Cost Data** | Homeowner arrives at store and finds prices 40% higher; damages trust. | Always present Low/Typical/High ranges with explicit "National Average Estimate" labels. Decouple pricing into `prices.ts` with quarterly audit timestamps. |
| 2 | **Measurement & Unit Confusion** (Feet vs. Inches) | User inputs 4 feet thickness instead of 4 inches; calculation explodes. | Explicit visual unit indicators next to each input field; sane range validations (e.g. flag concrete slabs $> 12$ inches with a confirmation warning). |
| 3 | **JavaScript Disabled or Blocked** | Blank interactive panel if improperly rendered. | Progressive enhancement: Default calculation pre-rendered in HTML based on initial default values. The page works as a static reference even if JS fails. |
| 4 | **Bloated Client Bundles** | Slower load times on mobile job-site connections (3G/4G). | Strictly zero frontend framework runtime (No React/Vue on client). Pure vanilla TypeScript custom elements (~3KB total client JS). |
| 5 | **Thin Content Penalty by Google** | Search engines flag calculators with low text as programmatic spam. | Every calculator page has 800+ words of unique editorial content: step-by-step formulas, packaging conventions, cost comparisons, job-site tips, and real FAQs. |

---

## 19. Out of Scope: What Should NOT Be Built in V1

To keep V1 manageable, bug-free, and laser-focused on quality, the following features are **explicitly forbidden in V1**:
* **No User Accounts / Login / Auth:** Homeowners do not want to register to calculate 10 bags of concrete.
* **No Database or Backend API:** All content is pre-rendered; all calculations run client-side. Zero server maintenance overhead.
* **No Real-Time Retailer Inventory Scraping:** Live scraping of Home Depot / Lowe's APIs breaks frequently and creates legal/operational liability. Use vetted benchmark ranges instead.
* **No Contractor Lead-Gen Paywalls:** No "Enter your phone number to see results" forms.
* **No Complex 3D Room Visualizers / Canvas CAD:** Heavy WebGL visualizers degrade mobile performance and distract from fast material estimation.
* **No AI Chatbot / Virtual Assistant:** Unnecessary token cost and latency; users want instant math, not conversational fluff.

---

## 20. Phase 2 Implementation Checklist

When moving to **Phase 2**, the AI coding agent must execute in the following exact order:

- [ ] **Step 1: Environment & Config Setup**
  - Verify Astro 5, TypeScript strict mode, and CSS variable system.
  - Set up directory structure according to Section 16.
- [ ] **Step 2: TypeScript Data Models**
  - Create `src/types/index.ts` with all interfaces defined in Section 11.
- [ ] **Step 3: Centralized Static Datastores**
  - Create `src/data/categories.ts` (7 core categories).
  - Create `src/data/prices.ts` (25 benchmark materials with Low/Mid/High costs).
  - Create `src/data/calculators.ts` (Metadata for all 15 calculators).
- [ ] **Step 4: Mathematical Calculation Engine**
  - Create pure TypeScript math functions for all 15 calculators in `src/scripts/calculators/`.
  - Include unit tests verifying calculation formulas against hand-calculated benchmarks.
- [ ] **Step 5: Base Layout & Common UI Components**
  - Build `BaseLayout.astro`, `Header.astro`, `Footer.astro`, `Breadcrumb.astro`, `SeoHead.astro`.
- [ ] **Step 6: Calculator Reusable Page Template**
  - Build `src/layouts/CalculatorPage.astro` implementing the 13-module architecture.
  - Connect client-side reactive DOM binder.
- [ ] **Step 7: Verification & Build Test**
  - Run static site generation build check (`npm run build`) to ensure zero TypeScript or routing errors.

---
*End of Phase 1 Product Architecture Document. Ready for Phase 2 implementation.*

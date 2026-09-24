/**
 * Phase 4B-2B: Five Additional Home Project Planning Guides
 * 
 * 1. How Much Drywall Do I Need? (/guides/how-much-drywall-do-i-need)
 * 2. How to Calculate Deck Materials (/guides/how-to-calculate-deck-materials)
 * 3. How to Calculate Fence Materials (/guides/how-to-calculate-fence-materials)
 * 4. How Much Roofing Material Do I Need? (/guides/how-much-roofing-material-do-i-need)
 * 5. How Much Topsoil Do I Need? (/guides/how-much-topsoil-do-i-need)
 */

import type { GuideDefinition } from '../types/index.ts';

export const PHASE_4B_2B_GUIDES: Record<string, GuideDefinition> = {
  'how-much-drywall-do-i-need': {
    slug: 'how-much-drywall-do-i-need',
    title: 'How Much Drywall Do I Need? Calculate Panels, Joint Compound, Tape, and Screws',
    subtitle: 'A complete room takeoff guide: measure wall perimeter, calculate 4×8 versus 4×12 panel yields, deduct openings accurately, and estimate joint compound, tape, and screws.',
    metaTitle: 'How Much Drywall Do I Need? Drywall Panel, Mud, Tape & Screw Calculator',
    metaDescription: 'Learn how to calculate drywall square footage, compare 4x8 vs 4x12 sheets, deduct doors and windows, and estimate joint compound buckets, tape rolls, and screws without running short.',
    categoryId: 'walls-drywall',
    targetCalculatorId: 'drywall-calculator',
    targetCalculatorPath: '/calculators/drywall-calculator',
    targetCalculatorName: 'Drywall Sheet & Mud Calculator',
    guideType: 'how-to-calculate',
    summary: 'Estimate your complete drywall material package including panels, 4.5-gallon joint compound buckets, 500-foot tape rolls, and fasteners based on room dimensions, ceiling height, and opening deductions.',
    readingTimeMinutes: 10,
    publishedDate: '2026-02-18',
    lastReviewedDate: '2026-02-18',
    quickAnswer:
      'To calculate drywall: multiply the room perimeter by ceiling height for wall area, add ceiling area (length × width) if finishing the ceiling, deduct doors (21 sq ft each) and windows (15 sq ft each), and add a 10% cutting waste buffer. Divide recommended square footage by 32 for 4×8 panels or by 48 for 4×12 panels. For a 16×12 ft room with 8 ft ceilings, 2 doors, and 2 windows (568 sq ft net, 624.8 sq ft recommended with 10% waste), purchase 20 sheets of 4×8 (or 14 sheets of 4×12), two 4.5-gallon buckets of all-purpose joint compound, two 500-foot rolls of drywall tape, and 3 lbs of 1-1/4 inch drywall screws.',
    introduction: [
      'Drywall estimation is one of the most deceptively complex material takeoffs in home remodeling. While calculating raw square footage requires only basic geometry, turning that footage into an accurate jobsite delivery list requires balancing panel dimensions against room layout, minimizing fragile butt-edge seams, and purchasing three separate finishing consumables that deplete at very different rates.',
      'A common DIY mistake is estimating only gypsum wallboard panels while treating joint compound, paper tape, and fasteners as casual afterthoughts. Running out of drywall mid-project leaves you with partial sheets, but running out of joint compound or setting mud halfway through a second coat forces an emergency trip to the home improvement center while wet edges dry unevenly, creating visible joint flashing and sanding ridges.',
      'Furthermore, standard 1/2-inch gypsum panels are heavy, rigid, and fragile. A single 4×8 sheet weighs approximately 45 to 55 pounds, while a 4×12 sheet weighs upwards of 75 pounds. Choosing the wrong panel size can leave you unable to maneuver panels up tight stairwells or around ninety-degree hallway turns. This planning guide details our three-stage estimating framework for panels, compound, tape, and screws.',
    ],
    measurementsNeeded: [
      {
        item: 'Room Perimeter (Length & Width)',
        unit: 'Feet',
        description: 'The continuous linear distance around all four interior walls of the room.',
        howToMeasure: 'Measure room length and width with a steel tape at floor level. Perimeter = 2 × (Length + Width). For irregular rooms, measure and sum each individual wall segment.',
      },
      {
        item: 'Ceiling Height',
        unit: 'Feet',
        description: 'The vertical rough distance from subfloor to bottom of ceiling joists or framing.',
        howToMeasure: 'Measure floor to ceiling framing. Standard residential ceilings are 8 feet (96 inches) or 9 feet (108 inches). Measure at several corners to verify consistent height.',
      },
      {
        item: 'Ceiling Finish Inclusion',
        unit: 'Yes / No boolean',
        description: 'Whether the room ceiling will be drywalled or already has an existing finished surface.',
        howToMeasure: 'If drywalled, calculate ceiling area as Room Length × Room Width. Always hang ceiling panels before wall panels so wall sheets support ceiling edges.',
      },
      {
        item: 'Doors & Standard Window Openings',
        unit: 'Item count',
        description: 'The number of doorway passages and exterior or interior window rough openings.',
        howToMeasure: 'Count full doorways and standard windows. Standard planning deductions are 21 sq ft per door and 15 sq ft per window.',
      },
    ],
    threeStageExplanation: {
      stage1Title: 'Stage 1: Mathematical Net Requirement',
      stage1Formula: 'Net Area (sq ft) = [Perimeter × Ceiling Height] + Ceiling Area - [(Doors × 21) + (Windows × 15)]',
      stage1Description:
        'The exact physical surface area of the framing studs and ceiling joists that must be covered with gypsum board. This reflects true geometric area after subtracting open voids created by doors and windows.',
      stage2Title: 'Stage 2: Planning Requirement (10% Cutting Waste Allowance)',
      stage2Formula: 'Recommended Drywall Area (sq ft) = Net Area × 1.10',
      stage2Description:
        'A calculated 10% material buffer that accounts for electrical outlet box cutouts, HVAC register penetrations, score-and-snap perimeter offcuts, and door casing overlap trims. Without this allowance, you will run out of full-width panels before finishing the final wall.',
      stage3Title: 'Stage 3: Commercial Purchase Quantity',
      stage3Formula: '4×8 Sheets = Math.ceil(Rec Area ÷ 32); 4×12 Sheets = Math.ceil(Rec Area ÷ 48); Mud Buckets = Math.ceil(Rec Area ÷ 400); Tape Rolls = Math.ceil(Rec Area ÷ 600); Screws Lbs = Math.ceil(Rec Area ÷ 300)',
      stage3Description:
        'The physical commercial package units ordered from suppliers. Panels are purchased in whole 4×8 or 4×12 sheets; all-purpose premixed joint compound in 4.5-gallon buckets (planning benchmark ~400 sq ft coverage across 3 coats); drywall tape in 500-foot rolls (planning benchmark ~600 sq ft); and 1-1/4 inch bugle-head screws by the pound (planning benchmark 1 lb per 300 sq ft).',
    },
    practicalExample: {
      scenario: 'Complete drywall takeoff for a 16×12 foot bedroom with 8-foot ceilings, 2 interior doors, 2 exterior windows, and a drywalled ceiling using a standard 10% planning waste allowance.',
      inputs: {
        'Room Length': '16 feet',
        'Room Width': '12 feet',
        'Ceiling Height': '8 feet',
        'Include Ceiling': 'Yes',
        'Doors': '2 standard doors',
        'Windows': '2 standard windows',
        'Planning Waste': '10%',
      },
      steps: [
        {
          step: '1',
          title: 'Calculate Gross Wall & Ceiling Areas',
          calculation: 'Perimeter = 2 × (16 + 12) = 56 ft. Gross Wall Area = 56 ft × 8 ft = 448 sq ft. Ceiling Area = 16 ft × 12 ft = 192 sq ft. Total Gross Area = 448 + 192 = 640 sq ft.',
          note: 'Wall perimeter accounts for all four continuous room faces. Ceiling area matches horizontal floor square footage.',
        },
        {
          step: '2',
          title: 'Deduct Door & Window Openings',
          calculation: 'Deductions = (2 doors × 21 sq ft) + (2 windows × 15 sq ft) = 42 + 30 = 72 sq ft. Net Drywall Area = 640 - 72 = 568.0 sq ft.',
          note: 'Deductions prevent over-purchasing full wall panels while preserving rough cutoffs around headers.',
        },
        {
          step: '3',
          title: 'Apply 10% Planning Waste Allowance',
          calculation: 'Recommended Area = 568.0 sq ft × 1.10 = 624.8 sq ft.',
          note: 'Accounts for electrical receptacle cutouts, switch boxes, closet returns, and trim scrap.',
        },
        {
          step: '4',
          title: 'Determine Commercial Panel Counts (4×8 vs 4×12)',
          calculation: '4×8 Panels (32 sq ft): 624.8 ÷ 32 = 19.525 → Order 20 sheets. 4×12 Panels (48 sq ft): 624.8 ÷ 48 = 13.017 → Order 14 sheets.',
          note: 'Always round fractions up to whole commercial panels. 4×12 panels eliminate one-third of vertical butt joints.',
        },
        {
          step: '5',
          title: 'Estimate Finishing Consumables (Compound, Tape, Screws)',
          calculation: 'Joint Compound: 624.8 ÷ 400 = 1.56 → 2 buckets (4.5-gal). Drywall Tape: 624.8 ÷ 600 = 1.04 → 2 rolls (500-ft). Screws: 624.8 ÷ 300 = 2.08 → 3 lbs (1-1/4" bugle-head).',
          note: 'Consumable calculations reflect practical jobsite benchmarks covering tape embedding, second coat, and final skim coat.',
        },
      ],
      resultSummary: 'For this 16×12 ft bedroom, order either 20 sheets of 4×8 drywall (or 14 sheets of 4×12 drywall), two 4.5-gallon buckets of premixed all-purpose joint compound, two 500-foot rolls of drywall paper tape, and 3 lbs of 1-1/4 inch drywall screws.',
    },
    sections: [
      {
        id: 'panels-4x8-vs-4x12',
        title: '4×8 vs 4×12 Sheets: Balancing Joint Elimination Against Carrying Weight',
        content:
          'When purchasing drywall, homeowners face an immediate decision between standard 4×8 foot panels and longer 4×12 foot panels. A 4×8 panel contains 32 square feet and weighs approximately 45 to 55 pounds in standard 1/2-inch thickness. It can be loaded into an eight-foot truck bed and handled by one person with reasonable care. A 4×12 panel covers 48 square feet and weighs 70 to 80 pounds, requiring two people to carry, lift, and position.\n\nThe primary engineering advantage of 4×12 sheets is seam reduction. When installed horizontally across a 16-foot or 24-foot wall, longer sheets reduce vertical butt joints by 30% to 50%. Factory tapered edges are easy to tape and feather flush, whereas butt joints (where cut factory ends meet) require extensive feathering out 12 to 14 inches on either side to disguise the bump under interior lighting. If your access pathway allows 12-foot panels without damaging corners or stair railings, professional drywallers strongly favor 12-foot stock.',
        table: {
          caption: 'Drywall Panel Size Comparison Matrix',
          headers: ['Panel Size', 'Nominal Area', 'Approx Weight (1/2")', 'Handling Difficulty', 'Butt Joint Frequency'],
          rows: [
            ['4x8 ft', '32 sq ft', '45 - 55 lbs', 'Manageable for DIY / tight halls', 'Higher (every 8 feet)'],
            ['4x10 ft', '40 sq ft', '58 - 70 lbs', 'Moderate (two-person lift)', 'Moderate'],
            ['4x12 ft', '48 sq ft', '70 - 82 lbs', 'Challenging (requires 2 people)', 'Lowest (eliminates ~33% seams)'],
          ],
        },
      },
      {
        id: 'openings-and-deductions',
        title: 'Openings and Deductions: When to Subtract and When to Leave Full Area',
        content:
          'In architectural estimating, deducting every window and doorway opening seems intuitive. However, seasoned drywall contractors apply deductions carefully. A standard residential interior door opening (32×80 inches) measures approximately 18 square feet of void; our calculator applies a benchmark 21 square feet deduction to account for jamb framing and trim casing. Standard windows average 15 square feet.\n\nCrucially, drywall panels are never cut into tiny piecemeal patches to fit around window corners. To prevent stress cracks caused by structural building settling, drywall panels must be hung across the top of door and window openings in an unbroken "flag" shape, and then routed or cut out in place. The cutout scrap from inside the window or door opening is frequently discarded. If your project has small basement windows under 8 square feet, experienced contractors often ignore the opening entirely to avoid underestimating panel stock.',
        callout: {
          type: 'tip',
          title: 'Contractor Layout Rule: Never Place Seams on Door Jambs',
          text: 'Never align a drywall butt joint directly with the vertical edge of a door or window frame. Framing movement will cause that joint to crack within months. Always hang panels so seams sit at least 8 to 12 inches away from door corners.',
        },
      },
      {
        id: 'mud-tape-screws-benchmarks',
        title: 'Finishing Materials: Why Accessories Must Be Estimated Separately',
        content:
          'Gypsum panels represent only the substrate; a finished drywall assembly requires joint compound, tape, and fasteners. These consumables must be estimated using dedicated planning benchmarks:\n\n1. Joint Compound (All-Purpose Mud): Finished drywall requires three distinct applications: embedding tape, a fill coat, and a wide feather coat. A standard 4.5-gallon bucket (approx 60 lbs) covers approximately 400 square feet of board surface under typical residential conditions. Hand-taping with thicker mud coats or repairing uneven framing will increase consumption.\n\n2. Drywall Tape: Paper tape or fiberglass mesh is required over all tapered joints, butt joints, and inside corners. One 500-foot roll covers approximately 600 square feet of wallboard. We recommend paper tape for inside corners and tapered joints, as it provides high tensile strength against building vibration.\n\n3. Drywall Screws: Fastener density is specified at roughly one screw every 12 inches on ceilings and every 16 inches on wall studs. Approximately 1 pound of 1-1/4 inch coarse-thread bugle-head screws (containing roughly 300 fasteners) covers 300 square feet of board.',
      },
      {
        id: 'transportation-and-handling',
        title: 'Transportation, Staging, and Moisture Acclimation',
        content:
          'Handling 20 to 50 sheets of drywall is an intense physical exercise. An average 600-square-foot room package weighs over 1,000 pounds. Transporting this in a standard half-ton pickup truck requires multiple trips to avoid exceeding vehicle payload limits, or arranging flatbed boom-truck delivery from a commercial building supplier.\n\nDrywall must always be stored flat on a dry floor with three to four wooden 2×4 dunnage blocks placed beneath to prevent sagging and ground moisture absorption. Storing sheets upright on edge against a wall will warp the panels within 48 hours, making them nearly impossible to pull tight against wall studs without popping screws.',
      },
    ],
    costPlanning: {
      overview: 'Drywall costs are driven by board thickness, sheet size, and finishing level. While materials represent an accessible DIY investment, professional hanging and Level 4 taping represent substantial labor costs.',
      benchmarksNote: 'Material price benchmarks reflect current retail home center ranges for 1/2-inch drywall sheets, 4.5-gallon joint compound buckets, and fastener accessories.',
      materialTiers: [
        {
          tier: 'Budget DIY (1/2" Standard 4×8 Sheets)',
          range: '$0.50 - $0.70 / sq ft (Materials Only)',
          description: 'Standard 4×8 gypsum panels, all-purpose premixed compound, paper tape, and coarse-thread phosphate drywall screws.',
        },
        {
          tier: 'Mid-Grade / Specialty (4×12 Sheets & Mold-Resistant)',
          range: '$0.75 - $1.05 / sq ft (Materials Only)',
          description: '4×12 panels for fewer butt seams, moisture/mold-resistant greenboard or purpleboard for bathrooms, and lightweight topping compound.',
        },
        {
          tier: 'Turnkey Contractor Installed (Hang, Tape & Level 4 Finish)',
          range: '$1.85 - $3.25 / sq ft (Materials + Labor)',
          description: 'Professional delivery, full panel hanging, three-coat taped joints, corner bead installation, and machine or hand sanding ready for primer.',
        },
      ],
      diyVsContractor: 'Hanging drywall boards is an accessible DIY task, but taping, bedding, and sanding joints to a seamless Level 4 finish requires significant muscle memory and tool mastery. Many homeowners hang the panels themselves and hire a professional taper for mudding.',
    },
    commonMistakes: [
      {
        mistake: 'Hanging wall panels before ceiling panels',
        whyItMatters: 'If walls are hung first, ceiling edge joints have no bottom support and are prone to severe sagging and cracking along the room perimeter.',
        prevention: 'Always hang ceiling panels first, pushing them tight to joists. Then install wall sheets tight against the ceiling so wall boards physically support ceiling edges.',
      },
      {
        mistake: 'Aligning vertical seams with door or window jamb corners',
        whyItMatters: 'Door frames vibrate every time a door is closed. Seams aligned with casing corners will crack through the joint compound within weeks.',
        prevention: 'Hang panels horizontally and notch them around openings like an upside-down "L" so seams land at least 8 to 12 inches away from door corners.',
      },
      {
        mistake: 'Underestimating joint compound buckets by purchasing only for coat one',
        whyItMatters: 'Taping consumes only 20% of compound volume. The second bed coat and third feather coat consume the vast majority of mud.',
        prevention: 'Follow our planning benchmark of one 4.5-gallon bucket per 400 square feet of recommended board area.',
      },
      {
        mistake: 'Over-driving drywall screws so the paper facing tears',
        whyItMatters: 'A drywall screw derives 100% of its holding power from the surface paper facing. If the screw head breaks the paper, the board is loose.',
        prevention: 'Use a drywall dimpler bit on your drill or a dedicated drywall screw gun that countersinks the screw 1/32" below the surface without rupturing paper.',
      },
    ],
    whenEstimateChanges: [
      'Ceiling Height Exceeds 8 Feet: 9-foot or 10-foot ceilings require 54-inch-wide drywall boards or extra horizontal seams, increasing waste and joint compound.',
      'Complex Architectural Angles: Vaulted cathedral ceilings, multiple dormers, and knee walls increase cut scrap from 10% to 18-20%.',
      'Bathrooms and Wet Areas: Water-resistant greenboard or cement backer board (Durock) must be substituted in moist zones at higher unit costs.',
      'Level 5 Finish Requirement: Severe raking light conditions require a full-surface skim coat across every square inch of paper, doubling compound requirements.',
      'Soundproofing Requirements: Double-layer 5/8" Type X drywall with green glue damping compound doubles panel counts and fastener lengths.',
    ],
    methodologyAssumptions: [
      'Panel Yields: 4×8 panels yield exactly 32 sq ft; 4×12 panels yield exactly 48 sq ft.',
      'Planning Cut Waste: Calculator applies a standard 10% waste buffer to account for outlet cutouts, edge trimmings, and fitting fractures.',
      'Openings Deductions: Doors deduct 21 sq ft; standard windows deduct 15 sq ft as planning benchmarks.',
      'Finishing Benchmarks: One 4.5-gal bucket of joint compound covers ~400 sq ft; one 500-ft roll of tape covers ~600 sq ft; 1 lb of screws covers ~300 sq ft.',
      'Structural Notice: Fastener schedules and wallboard thickness must comply with local fire codes (e.g. 5/8" Type X on garage separation walls).',
    ],
    faqs: [
      {
        question: 'Should I install drywall horizontally or vertically on walls?',
        answer:
          'In residential framing, drywall is almost always installed horizontally across wall studs. Horizontal installation spans irregularities across multiple studs, reduces total seam length by roughly 25%, and places the continuous tapered seam at waist height (approx 48 to 54 inches) where it is much easier to tape and sand than tall vertical floor-to-ceiling seams.',
      },
      {
        question: 'How many drywall screws do I need per sheet of drywall?',
        answer:
          'A standard 4×8 sheet requires approximately 32 screws on walls (spaced 16 inches apart along studs) and 36 screws on ceilings (spaced 12 inches apart). A 4×12 sheet requires approximately 48 to 54 screws. One pound of 1-1/4 inch drywall screws contains approximately 300 fasteners, enough for 8 to 9 standard 4×8 sheets.',
      },
      {
        question: 'What is the difference between all-purpose compound and lightweight topping mud?',
        answer:
          'All-purpose joint compound contains heavy binding polymers and vinyl adhesives, making it ideal for embedding paper tape and installing metal corner beads. Lightweight topping compound contains less binder and more lightweight fillers, making it much easier to spread and sand for the second and third finish coats.',
      },
      {
        question: 'When should I use 5/8-inch drywall instead of 1/2-inch drywall?',
        answer:
          'Standard 1/2-inch drywall is used for general interior walls and ceilings with 16-inch framing centers. 5/8-inch Type X (fire-rated) drywall is required by building codes on attached garage walls and ceilings shared with living spaces, furnace rooms, and ceilings with 24-inch joist spacing to prevent sagging.',
      },
      {
        question: 'Can I transport 4×8 drywall in an SUV or minivan?',
        answer:
          'Most minivans with stowable seats can carry a small stack of 4×8 sheets flat on the floor with the tailgate closed. Mid-size SUVs cannot fit 4×8 sheets flat without bending or breaking the fragile gypsum edges. For orders over 15 to 20 sheets, retailer flatbed delivery is strongly recommended.',
      },
    ],
    relatedCalculatorIds: ['drywall-calculator', 'paint-calculator', 'baseboard-trim-calculator'],
    relatedGuideSlugs: ['how-much-paint-do-i-need'],
  },

  'how-to-calculate-deck-materials': {
    slug: 'how-to-calculate-deck-materials',
    title: 'How to Calculate Deck Materials: Deck Boards, Joists, and Fasteners',
    subtitle: 'A practical material takeoff guide: convert deck length and projection into board rows, calculate decking linear footage, choose stock board lengths, and estimate joists and fasteners.',
    metaTitle: 'How to Calculate Deck Materials | Deck Boards, Joists & Fasteners Estimator',
    metaDescription: 'Learn how to calculate deck boards, board rows, linear footage, 12/16/20 ft stock lumber options, floor joists, and fastener counts for residential deck projects.',
    categoryId: 'fencing-decking',
    targetCalculatorId: 'deck-material-calculator',
    targetCalculatorPath: '/calculators/deck-material-calculator',
    targetCalculatorName: 'Deck Material & Framing Calculator',
    guideType: 'how-to-calculate',
    summary: 'Turn deck dimensions into an actionable bill of materials covering surface deck boards, stock stick lengths, framing joists, and screws using our three-stage estimating model.',
    readingTimeMinutes: 11,
    publishedDate: '2026-02-18',
    lastReviewedDate: '2026-02-18',
    quickAnswer:
      'To calculate deck surface boards: divide the projection width (in inches) by the effective board pitch (5.625 inches for nominal 6-inch boards with a 1/8-inch expansion gap) to find the number of board rows. Multiply board rows by deck length to calculate net linear footage, add a 10% cutting waste buffer, and divide by stock board length (12, 16, or 20 ft) to determine whole boards to purchase. For a 16×12 ft deck with 16" joist spacing and 16 ft stock boards: 26 board rows yield 416 net linear feet (457.6 LF with 10% waste), requiring 29 sixteen-foot deck boards (464 purchased LF), 13 floor joists, and approximately 744 fasteners.',
    introduction: [
      'Building a residential deck is one of the most rewarding home improvements, but estimating deck lumber requires navigating a critical distinction between material quantity estimation and structural engineering design. While material estimators calculate the volume of boards, joists, and screws needed to build a deck of a given footprint, they do not verify soil bearing capacities, frost-depth footings, ledger connection bolting, or structural beam cantilevers.',
      'For the deck surface itself, estimating is governed by board orientation, expansion gaps, and commercial stock lengths. Homeowners who simply divide deck square footage by board width quickly encounter shortages because lumber is sold in discrete stock sticks (12, 16, and 20 feet). Purchasing 12-foot boards for a 14-foot deck run creates unsightly, non-reusable cutoffs and forces random butt-joints that look amateurish and invite water rot.',
      'Our deck material estimating framework separates physical dimensions into three distinct stages: mathematical linear footage based on board rows and expansion spacing, a practical cutting and squaring allowance, and whole commercial stick purchasing paired with framing joist and fastener takeoffs.',
    ],
    measurementsNeeded: [
      {
        item: 'Deck Length (Along House Wall)',
        unit: 'Feet',
        description: 'The horizontal dimension of the deck running parallel to the ledger board attached to the house.',
        howToMeasure: 'Measure the exterior wall where the deck attaches, checking for obstacles like dryer vents, hose bibbs, or electrical meters.',
      },
      {
        item: 'Deck Projection Width (Out from House)',
        unit: 'Feet',
        description: 'The distance the deck projects outward from the house wall toward the yard.',
        howToMeasure: 'Measure perpendicular from the house siding out to the outer perimeter rim joist location.',
      },
      {
        item: 'Framing Joist Spacing',
        unit: 'Inches on-center (12" or 16")',
        description: 'The planned horizontal distance between floor joist centerlines.',
        howToMeasure: 'Planning input: standard pressure-treated wood decking commonly uses 16" on-center spacing, while composite decking or diagonal layouts typically use 12" on-center spacing.',
      },
      {
        item: 'Stock Board Length Selection',
        unit: 'Feet (12, 16, or 20 ft)',
        description: 'The standard commercial length of decking boards you intend to order from the lumberyard.',
        howToMeasure: 'Select stock lengths that minimize butt joints across the deck length. If the deck is 16 feet long, 16-foot stock boards span the entire distance without a single butt joint.',
      },
    ],
    threeStageExplanation: {
      stage1Title: 'Stage 1: Mathematical Net Requirement',
      stage1Formula: 'Board Rows = Math.ceil((Deck Width in × 12) ÷ 5.625 in); Net Decking Linear Feet = Board Rows × Deck Length (ft)',
      stage1Description:
        'The exact geometric linear footage of decking boards required to cover the deck surface. Nominal 6-inch boards measure 5.5 inches in actual width; when paired with a recommended 1/8-inch (0.125") drainage and expansion gap, each row occupies exactly 5.625 inches of projection.',
      stage2Title: 'Stage 2: Planning Requirement (10% Cutting Waste Allowance)',
      stage2Formula: 'Recommended Decking Linear Feet = Net Linear Feet × 1.10',
      stage2Description:
        'A calculated 10% allowance that covers squaring blade cuts at board ends, trimming overhangs along perimeter rim joists, and culling boards with natural knots, splits, or crook warps. Diagonal decking layouts require a 15% to 20% allowance.',
      stage3Title: 'Stage 3: Commercial Purchase Quantity',
      stage3Formula: 'Deck Boards To Purchase = Math.ceil(Rec Linear Feet ÷ Stock Length); Purchased LF = Boards × Stock Length; Joists = Math.ceil((Length × 12) ÷ Spacing) + 1; Fasteners = Math.ceil(Rows × Joists × 2 × 1.10)',
      stage3Description:
        'The physical lumber order. Deck boards must be purchased in whole commercial sticks (12, 16, or 20 feet). Joist framing requires whole joists across the deck length plus rim framing. Fasteners are estimated at 2 screws per board-joist intersection plus a 10% drop buffer.',
    },
    practicalExample: {
      scenario: 'Complete material takeoff for a 16-foot long by 12-foot wide attached deck using 16-foot stock composite boards, 16-inch joist spacing, and a 10% cutting waste allowance.',
      inputs: {
        'Deck Length': '16 feet (along house)',
        'Projection Width': '12 feet (outward)',
        'Stock Board Length': '16 feet',
        'Joist Spacing': '16 inches on-center',
        'Planning Waste': '10%',
      },
      steps: [
        {
          step: '1',
          title: 'Calculate Surface Area and Number of Board Rows',
          calculation: 'Deck Area = 16 ft × 12 ft = 192 sq ft. Projection in Inches = 12 ft × 12 in/ft = 144 in. Board Rows = Math.ceil(144 in ÷ 5.625 in) = Math.ceil(25.6) = 26 board rows.',
          note: '5.625 inches accounts for standard 5.5-inch board width plus a mandatory 1/8-inch thermal/water drainage gap.',
        },
        {
          step: '2',
          title: 'Calculate Net Decking Linear Footage',
          calculation: 'Net Linear Feet = 26 rows × 16 ft length = 416.0 linear feet.',
          note: 'This represents the theoretical minimum linear footage with zero end trimming.',
        },
        {
          step: '3',
          title: 'Apply 10% Cutting & Scrap Waste',
          calculation: 'Recommended Linear Feet = 416.0 LF × 1.10 = 457.6 linear feet.',
          note: 'Provides the extra footage needed to square rough factory ends and trim perimeter overruns.',
        },
        {
          step: '4',
          title: 'Convert to Whole Stock Boards and Purchased Linear Feet',
          calculation: 'Deck Boards to Purchase (16-ft sticks): 457.6 ÷ 16 = 28.6 → Order 29 boards. Purchased Linear Feet = 29 boards × 16 ft = 464 linear feet.',
          note: 'Purchasing 29 sixteen-foot boards ensures full unbroken runs across the 16-foot deck with 3 spare boards for border framing or trim.',
        },
        {
          step: '5',
          title: 'Calculate Floor Joists and Fasteners',
          calculation: 'Joists: Math.ceil((16 ft × 12 in) ÷ 16 in) + 1 = 12 + 1 = 13 joists. Intersections = 26 rows × 13 joists = 338. Fasteners = Math.ceil(338 × 2 screws × 1.10) = 744 fasteners.',
          note: 'Order 750 fasteners (or two 350-count retail boxes plus a small pack). Fastener estimate includes 2 screws per joist crossing plus 10% dropped/stripped screw allowance.',
        },
      ],
      resultSummary: 'For this 16×12 ft deck, order 29 sixteen-foot deck boards (464 linear feet), 13 floor joists (nominal 2×8 or 2×10 per your structural plans), and at least 744 deck screws or hidden fastener clips.',
    },
    sections: [
      {
        id: 'board-rows-and-gap',
        title: 'Board Rows and the Critical 1/8-Inch Expansion Gap',
        content:
          'One of the most persistent estimating errors is assuming a nominal 6-inch deck board covers 6 inches of projection. Standard 5/4×6 and 2×6 decking boards measure exactly 5.5 inches in actual width. Furthermore, wood and composite decking boards must never be installed tightly edge-to-edge.\n\nWood boards swell significantly during spring rains and shrink under dry summer heat. Composite boards expand longitudinally and laterally with temperature changes. A uniform 1/8-inch (0.125") gap between boards allows rainwater, melted snow, and autumn debris to drain cleanly through to the ground below instead of ponding on the surface. Adding 5.5 inches of board width to 0.125 inches of gap yields an effective pitch of 5.625 inches per row. Dividing projection inches by 5.625 provides the exact row count required.',
      },
      {
        id: 'stock-board-length-optimization',
        title: 'Stock Length Optimization: Why Shortest Is Not Always Cheapest',
        content:
          'Lumberyards stock exterior decking in 12-foot, 16-foot, and 20-foot stick lengths. Choosing the correct length directly impacts both material waste and visual aesthetics.\n\nIf your deck length is 16 feet, ordering 16-foot stock boards allows each board to span the entire distance without a single butt joint. If you ordered 12-foot boards instead, every single row would require a cut piece (a 12-foot stick plus a 4-foot cutoff). You would need to stagger those joints across floor joists, creating visible seams that collect moisture and rot over time. While 12-foot lumber has a lower price per stick, the resulting cut-off scrap and structural blocking often make it more expensive overall.',
        table: {
          caption: 'Decking Stock Length Comparison for 16-Foot Deck',
          headers: ['Stock Length', 'Sticks Needed', 'Purchased LF', 'Butt Joints Required', 'Visual Quality'],
          rows: [
            ['12-Foot Sticks', '38 boards', '456 LF', 'Every row requires a spliced joint', 'Low (patchwork seams)'],
            ['16-Foot Sticks', '29 boards', '464 LF', 'Zero butt joints (continuous span)', 'Premium (clean unbroken lines)'],
            ['20-Foot Sticks', '23 boards', '460 LF', 'Zero butt joints (4 ft cutoff per stick)', 'High (requires high-waste trim)'],
          ],
        },
      },
      {
        id: 'deck-estimation-vs-structural-design',
        title: 'Deck Material Estimation vs Structural Engineering Design',
        content:
          'This calculator provides a planning material takeoff for surface decking, joist counts, and fasteners. It is not an engineering design tool or a building code compliance check.\n\nActual deck safety depends on structural elements not modeled here: beam sizing, post-to-beam connection hardware, concrete footing diameter and frost depth, ledger board lag bolting, flashing, and guardrail post tension ties. Joist spacing inputs (16 inches or 12 inches on-center) are planning parameters; your actual required joist depth (e.g. 2×8 vs 2×10) depends on rafter spans and local building code design loads (typically 40 lbs/sq ft live load + 10 lbs/sq ft dead load). Always consult your local building department and IRC span tables before framing.',
        callout: {
          type: 'warning',
          title: 'Structural Code Notice',
          text: 'Never use a material quantity calculator to determine beam sizes, footing depths, or ledger bolting schedules. A structurally deficient deck poses severe collapse hazards. Always build from approved architectural plans.',
        },
      },
      {
        id: 'fastener-takeoff',
        title: 'Fasteners: Hidden Clip Systems vs Face-Driven Deck Screws',
        content:
          'Deck fasteners represent a substantial portion of your overall project budget. Standard face-screwed decking requires two screws at every joist intersection. For our 26-row by 13-joist example, that equals 338 intersections × 2 = 676 screws. Adding a 10% buffer for dropped, stripped, or warped fasteners brings the requirement to 744 fasteners.\n\nIf you choose grooved composite decking with hidden fastener clips, each clip secures two adjoining boards at the joist intersection. Hidden fastener systems are typically packaged in buckets covering 50, 100, or 500 square feet, and include specialized driver bits and starter clips for perimeter rows.',
      },
    ],
    costPlanning: {
      overview: 'Decking material budgets vary widely based on whether you choose standard pressure-treated southern pine, western red cedar, or low-maintenance composite boards.',
      benchmarksNote: 'Material price benchmarks reflect current retail lumberyard ranges for composite and treated decking per linear foot.',
      materialTiers: [
        {
          tier: 'Pressure-Treated Pine (Standard DIY)',
          range: '$1.50 - $2.50 / linear foot ($3.50 - $6.00 / sq ft)',
          description: 'Standard 5/4×6 pressure-treated wood decking. Economical upfront cost but requires annual washing, staining, and sealing.',
        },
        {
          tier: 'Mid-Grade Composite (Capped Wood-Plastic)',
          range: '$3.50 - $5.50 / linear foot ($8.00 - $13.00 / sq ft)',
          description: 'Capped composite decking with wood-grain embossing. Resistant to rot, splinters, and fading with 25-year manufacturer warranties.',
        },
        {
          tier: 'Premium PVC / Exotic Hardwood (Ipe / Tigerwood)',
          range: '$6.50 - $11.00 / linear foot ($15.00 - $26.00 / sq ft)',
          description: 'Cellular PVC or tropical dense hardwoods. Extreme durability, cool-underfoot formulations, and hidden fastening systems.',
        },
      ],
      diyVsContractor: 'Framing and surface decking a 200-square-foot deck is a common multi-weekend DIY project. Turnkey contractor installation typically adds $25 to $50 per square foot in professional labor and permitting costs.',
    },
    commonMistakes: [
      {
        mistake: 'Installing deck boards tightly without an expansion gap',
        whyItMatters: 'During rainy weather, wood swells. Without a 1/8" gap, expanding boards buckle upward, pop screws, and trap water that causes premature rot.',
        prevention: 'Use 1/8-inch plastic deck spacers or 16d nails as temporary spacers during installation to maintain uniform drainage gaps.',
      },
      {
        mistake: 'Using 16" joist spacing for diagonal composite layouts',
        whyItMatters: 'Composite boards are more flexible than wood. When laid diagonally across 16" joists, the effective span becomes 22.6 inches, causing noticeable springy bounce.',
        prevention: 'Always frame joists at 12 inches on-center if you plan to install decking at a 45-degree diagonal angle.',
      },
      {
        mistake: 'Ordering board lengths that require random, unsupported splices',
        whyItMatters: 'Butt joints must meet directly centered over a joist. Splices between joists create structural weak points and severe tripping hazards.',
        prevention: 'Order stock lengths that span the entire deck length, or plan joint locations intentionally with doubled joists (sister joists) at splice points.',
      },
      {
        mistake: 'Using standard drywall or interior screws on exterior treated lumber',
        whyItMatters: 'The copper chemicals in pressure-treated lumber rapidly corrode unrated steel screws, causing heads to snap off under foot traffic within two seasons.',
        prevention: 'Only use hot-dipped galvanized or ceramic-coated exterior deck screws rated for ACQ/pressure-treated contact, or 305/316 grade stainless steel.',
      },
    ],
    whenEstimateChanges: [
      'Diagonal 45° Decking Pattern: Increases cutting waste from 10% to 15-20% due to angled rim joist trimmings and requires 12" joist spacing.',
      'Picture-Frame Perimeter Borders: Adding single or double breaker-board perimeter borders requires extra framing blocking and separate linear foot orders.',
      'Stairs and Multi-Level Landings: Deck stairs require dedicated stringers (typically 12" on-center) and 2 boards per tread, calculated separately.',
      'Deck Elevation Above Ground: Decks over 30 inches above grade require building permits, guardrails, and deeper concrete frost footings.',
      'Cantilevered Joist Overhangs: If joists cantilever past the support beam, order stock joist lumber lengths that accommodate the extra overhang distance.',
    ],
    methodologyAssumptions: [
      'Board Dimensions: Calculator assumes nominal 6-inch decking measuring 5.5 inches in actual width.',
      'Expansion Gap: Calculator incorporates a standard 1/8-inch (0.125") gap for an effective row pitch of 5.625 inches.',
      'Cutting Waste Buffer: A default 10% allowance is applied to linear footage for squaring cuts and board sorting.',
      'Joist Count Formula: Joists = Math.ceil((Length in inches) ÷ Joist Spacing) + 1 to account for start and end rim framing.',
      'Fastener Multiplier: Calculated as 2 screws per board-joist intersection plus a 10% contingency buffer.',
    ],
    faqs: [
      {
        question: 'How do I calculate how many deck boards I need for my deck?',
        answer:
          'First, determine the projection width in inches and divide by 5.625 (the width of a nominal 6-inch board plus a 1/8-inch gap) to find the number of board rows. Multiply rows by deck length to find net linear feet, add 10% for cutting waste, and divide by the stock board length (12, 16, or 20 ft) to get whole boards to purchase.',
      },
      {
        question: 'Should deck boards be installed bark side up or bark side down?',
        answer:
          'For pressure-treated wood decking, inspect the end-grain growth rings. Installing boards with the curvature of the rings pointing downward ("bark side up") helps shed water as the board cups slightly during drying. However, always prioritize the best-looking, knot-free face upward.',
      },
      {
        question: 'Can I use 16-inch joist spacing for composite decking?',
        answer:
          'For perpendicular layouts, most composite manufacturers approve 16-inch on-center joist spacing for residential applications. However, if you plan to install composite boards at a 45-degree angle, you must frame joists at 12 inches on-center to prevent sagging.',
      },
      {
        question: 'What is the standard gap between deck boards?',
        answer:
          'The standard gap is 1/8 inch (0.125 inches) for air-dried wood and composite decking. If installing soaking-wet pressure-treated wood fresh from the treating plant, boards can be installed with a narrower 1/16-inch gap or butt-tight, as they will shrink to 1/8-1/4 inch as they dry.',
      },
      {
        question: 'How many deck screws are in a 5-pound box?',
        answer:
          'A standard 5-pound box of 2-1/2 inch or 3-inch #9 exterior deck screws contains approximately 350 to 400 screws. For a 200-square-foot deck requiring roughly 750 fasteners, you will need two 5-pound boxes.',
      },
    ],
    relatedCalculatorIds: ['deck-material-calculator', 'fence-material-calculator', 'concrete-post-hole-calculator'],
    relatedGuideSlugs: ['how-to-calculate-fence-materials', 'how-much-concrete-do-i-need-for-fence-posts'],
  },

  'how-to-calculate-fence-materials': {
    slug: 'how-to-calculate-fence-materials',
    title: 'How to Calculate Fence Materials: Posts, Rails, Pickets, and Concrete',
    subtitle: 'A contractor-grade estimating worksheet: calculate post bays, rail quantities by fence height, picket spacing allowances, gate post isolation, and footing concrete bags.',
    metaTitle: 'How to Calculate Fence Materials | Posts, Rails, Pickets & Concrete Estimator',
    metaDescription: 'Learn how to estimate wood privacy fence materials: post bays, 2x4 rails, dog-ear pickets, walk gates, and concrete bags per post hole without running short.',
    categoryId: 'fencing-decking',
    targetCalculatorId: 'fence-material-calculator',
    targetCalculatorPath: '/calculators/fence-material-calculator',
    targetCalculatorName: 'Fence Material & Concrete Calculator',
    guideType: 'how-to-calculate',
    summary: 'Turn your perimeter linear footage into a complete material takeoff covering pressure-treated 4×4 posts, horizontal 2×4 rails, vertical privacy pickets, and pre-mixed concrete bags.',
    readingTimeMinutes: 10,
    publishedDate: '2026-02-18',
    lastReviewedDate: '2026-02-18',
    quickAnswer:
      'To calculate fence materials: divide total linear length by post spacing (typically 8 feet) to determine bay sections. Total posts = (sections + 1) plus 2 dedicated hinge/latch posts per walk gate. Horizontal rails = sections × 2 (for 4-ft fences) or sections × 3 (for 6-ft and 8-ft fences). Pickets = (linear feet × 12) ÷ effective picket pitch with a 5% sorting buffer. Concrete = total posts × 1.5 bags of 60-lb pre-mix (planning benchmark). For a 150-ft, 6-ft-tall privacy fence with 8-ft spacing, 5.5-inch dog-ear pickets, and 1 walk gate: order 22 pressure-treated 4×4 posts, 57 horizontal 2×4 rails, 344 pickets, and 33 bags of 60-lb concrete.',
    introduction: [
      'Building a residential wood privacy fence requires converting a linear perimeter property line into a structural system of vertical posts, horizontal cross-rails, vertical pickets, and below-ground concrete anchors. An accurate material estimate must account for property boundaries, gate strain, rail sagging prevention, and footing concrete bags.',
      'A frequent estimating mistake is under-counting posts by treating a fence line as isolated 8-foot modules. In reality, every turn in property direction requires a corner post, end runs terminate on terminal posts, and swing gates exert heavy dynamic rotational torque that requires dedicated hinge and latch posts. Hanging a swinging gate off a standard line post will cause the post to lean and drag the latch across the ground within months.',
      'Our fence material estimating model structures your material list into three clear phases: physical geometric sections, practical defect and gate allowances, and commercial purchase packages. All calculations align with the centralized benchmarks in our calculator engine.',
    ],
    measurementsNeeded: [
      {
        item: 'Total Fence Run (Linear Feet)',
        unit: 'Linear Feet',
        description: 'The continuous perimeter length of the planned fence line, including gates.',
        howToMeasure: 'Measure property boundaries using a 100-foot fiberglass measuring tape or surveyor wheel. Ensure you locate boundary stakes or property markers before purchasing materials.',
      },
      {
        item: 'Finished Fence Height',
        unit: 'Feet (4, 6, or 8 ft)',
        description: 'The vertical height of the fence from grade to top of pickets.',
        howToMeasure: 'Determine required height based on privacy and local zoning rules. 6 feet is standard residential privacy; 4 feet is common for front yards; 8 feet is used for noise/commercial buffers.',
      },
      {
        item: 'Post Spacing (Bay Width)',
        unit: 'Feet (6 or 8 ft)',
        description: 'The horizontal centerline distance between vertical fence posts.',
        howToMeasure: '8 feet is standard for residential privacy. In high-wind zones or heavy clay soils, 6-foot spacing is recommended to reduce wind-load strain on rails.',
      },
      {
        item: 'Picket Width & Gap Specification',
        unit: 'Inches (3.5" or 5.5")',
        description: 'The actual width of individual fence pickets and the planned gap between them.',
        howToMeasure: 'Standard dog-ear pickets measure 5.5 inches wide (nominal 1×6) or 3.5 inches wide (nominal 1×4). Solid privacy fences use a 0-inch gap, while shadowbox fences leave spacing.',
      },
      {
        item: 'Walk Gate Count',
        unit: 'Number of gates',
        description: 'The number of pedestrian or utility access swing gates planned along the run.',
        howToMeasure: 'Count all gates. Each walk gate requires two dedicated heavy-duty hinge and latch posts independent of standard run calculations.',
      },
    ],
    threeStageExplanation: {
      stage1Title: 'Stage 1: Mathematical Net Requirement',
      stage1Formula: 'Section Bays = Math.ceil(Fence Length ÷ Post Spacing); Exact Pickets = (Fence Length × 12) ÷ (Picket Width + Picket Gap)',
      stage1Description:
        'The raw physical component requirement before waste or gate additions. Dividing linear footage by post spacing determines the number of structural bays and theoretical picket counts.',
      stage2Title: 'Stage 2: Planning Requirement (Gate Isolation & 5% Picket Scrap)',
      stage2Formula: 'Total Posts = (Bays + 1) + (Gates × 2); Recommended Pickets = Exact Pickets × 1.05',
      stage2Description:
        'Practical adjustments covering structural realities. Every walk gate adds two dedicated hinge and latch posts. A 5% allowance is added to pickets to account for warped, split, or knotty boards encountered in bundled lumber packs.',
      stage3Title: 'Stage 3: Commercial Purchase Quantity',
      stage3Formula: 'Rails To Purchase = Bays × (Height ≤ 4 ? 2 : 3); Concrete Bags = Math.ceil(Total Posts × 1.5); Pickets = Math.ceil(Rec Pickets)',
      stage3Description:
        'The physical purchase order for the lumberyard: pressure-treated 4×4 posts (8 ft or 10 ft length), 2×4 horizontal backer rails (matching post spacing), individual dog-ear pickets, and 60-lb pre-mix concrete sacks (planning benchmark: 1.5 bags per hole).',
    },
    practicalExample: {
      scenario: 'Complete material takeoff for a 150-linear-foot, 6-foot-tall wood privacy fence with 8-foot post spacing, 5.5-inch dog-ear pickets, 1 walk gate, and a 5% picket sorting allowance.',
      inputs: {
        'Fence Length': '150 linear feet',
        'Fence Height': '6 feet',
        'Post Spacing': '8 feet on-center',
        'Picket Width': '5.5 inches (nominal 1×6)',
        'Picket Gap': '0 inches (solid privacy)',
        'Walk Gates': '1 gate',
        'Picket Waste': '5%',
      },
      steps: [
        {
          step: '1',
          title: 'Calculate Section Bays and Base Posts',
          calculation: 'Section Bays = Math.ceil(150 ft ÷ 8 ft) = Math.ceil(18.75) = 19 sections. Base Posts = 19 sections + 1 terminal post = 20 posts.',
          note: 'Sections always round up to the next whole bay. A continuous straight fence line always requires one more post than the number of bays.',
        },
        {
          step: '2',
          title: 'Add Dedicated Gate Posts',
          calculation: 'Gate Posts = 1 gate × 2 dedicated posts = 2 posts. Total Posts = 20 base + 2 gate = 22 posts.',
          note: 'Never hang heavy swinging gates on standard line posts. Gate posts experience dynamic rotational torque and must be isolated.',
        },
        {
          step: '3',
          title: 'Calculate Horizontal 2×4 Backer Rails',
          calculation: '6-foot height requires 3 rails per bay. Total Rails = 19 bays × 3 rails = 57 rails (2×4×8 ft).',
          note: 'Standard industry rule: 4-foot fences require 2 rails; 6-foot and 8-foot fences require 3 rails to prevent vertical pickets from cupping.',
        },
        {
          step: '4',
          title: 'Calculate Vertical Dog-Ear Pickets with 5% Waste',
          calculation: 'Exact Pickets = (150 ft × 12 in/ft) ÷ 5.5 in = 1,800 ÷ 5.5 = 327.27 pickets. Recommended Pickets (5% waste) = 327.27 × 1.05 = 343.64 → Order 344 pickets.',
          note: 'Pickets are bundled in packs of 10 or 20. A 5% waste allowance accounts for split edges, warped boards, and loose knots.',
        },
        {
          step: '5',
          title: 'Calculate Pre-Mix Concrete Bags for Footings',
          calculation: 'Concrete: 22 posts × 1.5 bags (60-lb) = 33 bags of 60-lb pre-mix concrete.',
          note: 'Planning benchmark of 1.5 bags per hole reflects standard 24-to-30-inch post depth in residential soil.',
        },
      ],
      resultSummary: 'For this 150-ft privacy fence, order 22 pressure-treated 4×4 posts (8-foot length), 57 horizontal 2×4 backer rails (8-foot length), 344 dog-ear pickets (6-foot length), and 33 bags of 60-lb pre-mix concrete.',
    },
    sections: [
      {
        id: 'post-spacing-8ft-vs-6ft',
        title: 'Post Spacing: 8-Foot Standard vs 6-Foot High-Wind Spacing',
        content:
          'Residential wood privacy fences are typically framed with 8-foot post spacing. This maximizes standard 8-foot 2×4 lumber utilization and minimizes post hole digging. However, in regions with frequent severe thunderstorms or open-field exposure, wind load exerts intense lateral force against solid privacy pickets, acting like a giant sail.\n\nFraming with 6-foot post spacing reduces the surface area per bay by 25%, drastically stiffening the fence against wind shear and preventing horizontal rails from sagging under the dead weight of treated pickets. If using 6-foot spacing, order 2×4×6 foot rails or 12-foot rails cut in half.',
      },
      {
        id: 'the-three-rail-rule',
        title: 'The Three-Rail Rule: Why 6-Foot Fences Require 3 Rails',
        content:
          'A frequent cause of fence failure is attempting to build a 6-foot privacy fence with only two horizontal 2×4 backer rails. Pressure-treated wood pickets are sold saturated with chemical preservatives and moisture. As they dry under direct sun, pickets shrink, cup, and twist.\n\nWithout a center backer rail positioned at the vertical midpoint (approximately 36 inches from grade), pickets will pull away from top and bottom nails, warp outwards, and leave unsightly gaps. Building codes and professional standards mandate two rails for fences up to 4 feet tall, and three rails for 6-foot and 8-foot fences.',
        table: {
          caption: 'Backer Rail Recommendations by Fence Height',
          headers: ['Fence Height', 'Rails per Bay', 'Rail Positioning', 'Risk of 2-Rail System'],
          rows: [
            ['4 Feet', '2 Rails', 'Top & Bottom (6" from ends)', 'Low (short picket length resists warping)'],
            ['6 Feet', '3 Rails', 'Top, Center, Bottom (approx 28" spacing)', 'Severe (pickets cup and bow outward)'],
            ['8 Feet', '3 - 4 Rails', 'Evenly spaced every 24" - 28"', 'Extreme (high wind failure hazard)'],
          ],
        },
      },
      {
        id: 'gate-post-isolation',
        title: 'Why Every Walk Gate Adds Two Dedicated Posts to Your Order',
        content:
          'When planning fence materials, homeowners often assume a gate simply replaces a standard section of fence. However, gates exert heavy rotational torque and dynamic shock every time they swing and latch shut.\n\nTo ensure gate longevity, swing gates must be mounted on dedicated hinge and latch posts set deeper in the ground with additional concrete. Our calculator automatically adds two dedicated posts per gate. Furthermore, gate posts should ideally be upgraded from standard 4×4 lumber to heavy-duty 6×6 posts, especially for gates exceeding 48 inches in width.',
        callout: {
          type: 'tip',
          title: 'Gate Hardware Staging Tip',
          text: 'Order heavy-duty adjustable steel anti-sag gate kits (turnbuckle cable or diagonal steel brace) when purchasing gate hardware. Wood gate frames inevitably sag under gravity over their first wet season.',
        },
      },
      {
        id: 'concrete-anchoring-benchmark',
        title: 'Anchoring Posts: The 1.5 Bags per Hole Planning Benchmark',
        content:
          'Post hole concrete is estimated using our planning benchmark of 1.5 bags (60-lb) per post hole. For a standard 8-inch diameter augered hole dug to a typical residential depth of 24 to 30 inches, a 4×4 wood post displaces approximately 0.20 to 0.25 cubic feet of volume. The surrounding annular void requires approximately 0.65 to 0.70 cubic feet of concrete, which equates closely to 1.5 bags of 60-lb pre-mix.\n\nActual concrete needs vary with hole diameter and frost line requirements. If your local building code requires digging 36 to 48 inches deep to reach below the frost line, concrete consumption will increase to 2.5 to 3.5 bags per hole. (Refer to our companion Concrete Post Hole Calculator for exact cylindrical volume modeling).',
      },
    ],
    costPlanning: {
      overview: 'Wood fence costs are dictated by lumber species (pressure-treated pine vs western red cedar) and post spacing. Material packages are transparent and highly cost-effective for DIY builders.',
      benchmarksNote: 'Material price benchmarks reflect current retail home center prices for pressure-treated 4×4 posts, 2×4 rails, dog-ear pickets, and 60-lb concrete sacks.',
      materialTiers: [
        {
          tier: 'Pressure-Treated Pine (Standard DIY)',
          range: '$11.00 - $16.00 / linear foot (Materials Only)',
          description: 'PT pine 4×4 posts, 2×4 rails, standard dog-ear pine pickets, and pre-mixed concrete. Economical and rot-resistant.',
        },
        {
          tier: 'Western Red Cedar / Metal Post Upgrades',
          range: '$18.00 - $28.00 / linear foot (Materials Only)',
          description: 'Naturally rot-resistant Western Red Cedar pickets paired with PostMaster steel inline posts or heavy 6×6 corner posts.',
        },
        {
          tier: 'Turnkey Contractor Installed Fence',
          range: '$28.00 - $48.00 / linear foot (Materials + Labor)',
          description: 'Professional boundary layout, motorized power augering, concrete post setting, custom on-site picket construction, and debris haul-away.',
        },
      ],
      diyVsContractor: 'Digging 20 to 40 post holes by hand with a manual clam-shell post hole digger is exhausting physical labor. Renting a gas-powered one-person or two-person power auger saves immense time and ensures uniform cylindrical holes.',
    },
    commonMistakes: [
      {
        mistake: 'Digging post holes too shallow to resist wind load',
        whyItMatters: 'A 6-foot solid privacy fence acts as a massive sail. If posts are only buried 12 to 18 inches, winter windstorms will tilt the entire fence over.',
        prevention: 'Follow the universal rule of thumb: at least 1/3 of the total post length (or minimum 24-30 inches) should be buried in the ground.',
      },
      {
        mistake: 'Using only two rails on a 6-foot privacy fence',
        whyItMatters: 'Without a center rail to stabilize pickets, summer heat and winter rain will cause pickets to bow, cup, and pull nails out.',
        prevention: 'Always install three horizontal 2×4 rails on all 6-foot and 8-foot privacy fences.',
      },
      {
        mistake: 'Hanging pickets directly touching damp soil or turf',
        whyItMatters: 'When wood pickets sit in contact with wet grass and soil, they wick moisture continuously, causing the bottom 6 inches to rot within 3 to 4 years.',
        prevention: 'Leave a 1-1/2 to 2-inch clearance gap between the bottom of the pickets and the soil grade, or install a sacrificial horizontal rot board (kickboard).',
      },
      {
        mistake: 'Failing to brace gate posts during concrete cure',
        whyItMatters: 'If gate posts shift even 1/4 inch out of plumb while concrete hardens, the gate latch will never align properly.',
        prevention: 'Use diagonal 2×4 kickers and stakes to lock gate posts perfectly plumb in both directions for a full 48 hours before hanging gates.',
      },
    ],
    whenEstimateChanges: [
      'Sloped or Rolling Terrain: Racking or stepping fence panels down hillside slopes requires longer posts (e.g. 10 ft posts) and extra rail trimming.',
      'Frost Line Depth Over 30 Inches: Freeze-thaw regions requiring 36-to-48-inch footings increase concrete bag requirements from 1.5 to 2.5-3.5 bags per post.',
      'Double Driveway Swing Gates: Driveway gates spanning 10 to 12 feet require heavy 6×6 steel-reinforced posts and commercial drop-rod hardware.',
      'Board-on-Board Overlap Design: True privacy board-on-board styling overlaps pickets by 1 inch on each side, increasing picket counts by approximately 30%.',
      'Rocky Subgrade Soil: Digging post holes in rocky or hardpan clay soil often requires renting heavy hydraulic augers or hiring a post-hole drilling contractor.',
    ],
    methodologyAssumptions: [
      'Post Spacing: Calculator defaults to 8-foot on-center spacing, but supports 6-foot spacing for high-wind conditions.',
      'Rail Schedules: 4-foot fences calculate 2 rails per section; 6-foot and 8-foot fences calculate 3 rails per section as a planning benchmark.',
      'Gate Post Isolation: Each walk gate adds 2 dedicated structural posts to the project takeoff.',
      'Picket Waste Factor: A default 5% waste buffer is applied to pickets to cover natural lumber culls, splits, and end trimmings.',
      'Concrete Benchmark: Estimated at 1.5 bags of 60-lb pre-mix per post hole for standard 24-to-30-inch residential depth.',
    ],
    faqs: [
      {
        question: 'How many posts do I need for a 100-foot fence?',
        answer:
          'For a 100-foot straight fence with 8-foot post spacing, divide 100 by 8 to get 12.5, which rounds up to 13 section bays. Add 1 terminal post to get 14 base posts. If you add 1 walk gate, add 2 dedicated gate posts for a total of 16 posts.',
      },
      {
        question: 'How deep should fence post holes be dug?',
        answer:
          'A standard residential fence post hole should be dug to a depth equal to 1/3 of the total post length, or at least 24 to 30 inches for a 6-foot fence. In cold northern climates, post holes must extend below the municipal frost line (often 36 to 48 inches) to prevent frost heaving.',
      },
      {
        question: 'Should fence posts be set in concrete or packed gravel?',
        answer:
          'Concrete is the standard for privacy fences and gate posts because it provides maximum resistance against wind overturning loads. Packed crushed stone gravel is an alternative for well-draining soils that promotes water drainage away from wood fibers, but requires thorough mechanical tamping.',
      },
      {
        question: 'How many pickets do I need per foot of fence?',
        answer:
          'For standard 5.5-inch wide dog-ear pickets with zero gap, you need approximately 2.18 pickets per linear foot (12 inches ÷ 5.5 inches). For a 100-foot fence, that equals 218 exact pickets; adding 5% for sorting scrap yields 229 pickets to purchase.',
      },
      {
        question: 'What fasteners should I use to attach fence pickets to rails?',
        answer:
          'Use 1-3/4 inch or 2-inch hot-dipped galvanized or ring-shank stainless steel nails. Ring-shank nails resist pulling out as the wet pickets dry and cup in the sun. Avoid smooth common nails or interior screws, which will corrode and loosen rapidly.',
      },
    ],
    relatedCalculatorIds: ['fence-material-calculator', 'concrete-post-hole-calculator', 'deck-material-calculator'],
    relatedGuideSlugs: ['how-much-concrete-do-i-need-for-fence-posts', 'how-to-calculate-deck-materials'],
  },

  'how-much-roofing-material-do-i-need': {
    slug: 'how-much-roofing-material-do-i-need',
    title: 'How Much Roofing Material Do I Need? Calculate Squares, Shingle Bundles, and Underlayment',
    subtitle: 'A homeowner planning guide: convert horizontal ground footprint into true sloped rafter area, understand roof pitch multipliers, calculate roofing squares, and estimate shingle bundles and synthetic underlayment.',
    metaTitle: 'How Much Roofing Material Do I Need? Roofing Squares & Shingle Calculator',
    metaDescription: 'Learn how to calculate roof square footage from ground footprint, apply pitch multipliers, calculate roofing squares (100 sq ft), and order shingle bundles and underlayment rolls.',
    categoryId: 'roofing',
    targetCalculatorId: 'roofing-calculator',
    targetCalculatorPath: '/calculators/roofing-calculator',
    targetCalculatorName: 'Roofing Square & Bundle Calculator',
    guideType: 'how-to-calculate',
    summary: 'Convert your home footprint and roof slope pitch into actual sloped surface area, standard roofing squares, architectural shingle bundles, and synthetic underlayment rolls.',
    readingTimeMinutes: 10,
    publishedDate: '2026-02-18',
    lastReviewedDate: '2026-02-18',
    quickAnswer:
      'To calculate roofing material: multiply horizontal ground footprint (including overhangs) by the geometric pitch multiplier [sqrt(1 + (pitch/12)²)] to find actual sloped surface area. Add complexity waste (10% for gable roofs, 15% to 20% for hip roofs and valleys), and divide by 100 to determine roofing squares. Multiply squares by the manufacturer’s bundles-per-square specification (standard architectural shingles use 3 bundles per square). For a 2,000 sq ft footprint with a 6:12 pitch (multiplier 1.118) and 10% gable waste: actual area is 2,236.1 sq ft, recommended area is 2,459.7 sq ft (24.6 squares), requiring an order of 25 roofing squares, 75 shingle bundles, and 3 rolls of 10-square synthetic underlayment.',
    introduction: [
      'Estimating roofing materials is an intimidating task for many homeowners because looking up at a sloped roof from the driveway makes direct tape-measure verification difficult and dangerous. More importantly, horizontal ground dimensions do not match the actual surface area of a sloped roof: as the pitch steepens, rafter length and surface area expand dramatically.',
      'In the roofing trade, material takeoff is standardized around the "roofing square"—a unit equal to exactly 100 square feet of finished roof surface. However, asphalt shingles are not sold by the square foot; they are packaged in heavy bundles (typically 3 bundles per square for standard architectural shingles) to allow human workers to carry them up ladders onto roof decks.',
      'This homeowner guide walks through the exact three-stage estimating methodology used by professional estimators: converting horizontal ground footprint into true rafter square footage using trigonometric pitch multipliers, applying a roofline complexity waste allowance, and translating those requirements into commercial roofing squares, shingle bundles, and roll underlayment.',
    ],
    measurementsNeeded: [
      {
        item: 'Ground Footprint Area (Including Overhangs)',
        unit: 'Square Feet',
        description: 'The horizontal flat projected area covered by the roof structure, including exterior eave and gable rake overhangs.',
        howToMeasure: 'Measure exterior foundation length and width, and add the horizontal projection of roof overhangs (typically 1 to 2 feet on all sides). Footprint = Total Length × Total Width.',
      },
      {
        item: 'Roof Pitch (Slope)',
        unit: 'Inches of vertical rise per 12 inches of horizontal run',
        description: 'The steepness of the roof expressed as a ratio over 12 (e.g. 4:12, 6:12, 8:12, 12:12).',
        howToMeasure: 'Measure with a pitch gauge, smartphone level app on a rafter in the attic, or a 12-inch level on the roof deck. Measure vertical inches from the 12-inch level mark down to the roof surface.',
      },
      {
        item: 'Roofline Complexity & Waste Level',
        unit: 'Percentage (10%, 15%, or 20%)',
        description: 'The geometry type of the roof structure governing cutting and trimming scrap.',
        howToMeasure: 'Simple gable roofs (two flat slopes) use 10% waste. Hip roofs with diagonal hips, valleys, and dormers require 15% to 20% waste for angle cuts.',
      },
      {
        item: 'Shingle Bundle Specification',
        unit: 'Bundles per square (typically 3)',
        description: 'The manufacturer packaging specification for the selected shingle product line.',
        howToMeasure: 'Check the manufacturer wrapper label. Standard architectural/laminate shingles are packaged at 3 bundles per square. Heavyweight designer luxury shingles require 4 or 5 bundles per square.',
      },
    ],
    threeStageExplanation: {
      stage1Title: 'Stage 1: Mathematical Net Requirement',
      stage1Formula: 'Pitch Multiplier = sqrt[1 + (Pitch ÷ 12)²]; Actual Roof Surface Area (sq ft) = Footprint Area × Pitch Multiplier',
      stage1Description:
        'The true geometric surface area of the wooden roof deck sheathing. Multiplying the horizontal ground footprint by the Pythagorean pitch multiplier converts flat horizontal projection into true sloping rafter area.',
      stage2Title: 'Stage 2: Planning Requirement (Roofline Complexity Waste Allowance)',
      stage2Formula: 'Recommended Roof Area (sq ft) = Actual Roof Area × [1 + (Waste % ÷ 100)]; Exact Squares = Recommended Area ÷ 100',
      stage2Description:
        'A calculated allowance for starter strip courses along eaves, ridge cap trimming, diagonal cutoffs in valleys and along hip ridges, and flashing penetrations. Standard gable roofs require 10%; hip roofs with valleys require 15% to 20%.',
      stage3Title: 'Stage 3: Commercial Purchase Quantity',
      stage3Formula: 'Roofing Squares To Purchase = Math.ceil(Exact Squares); Shingle Bundles = Squares × Bundles Per Square; Underlayment Rolls = Math.ceil(Rec Area ÷ 1000)',
      stage3Description:
        'The physical order placed with a roofing supply distributor or home center: whole roofing squares rounded up, packaged shingle bundles (typically 3 per square), and 10-square rolls of synthetic underlayment (1,000 sq ft per roll).',
    },
    practicalExample: {
      scenario: 'Complete roofing material takeoff for a home with a 2,000 sq ft ground footprint, 6:12 roof pitch, simple gable roofline (10% waste), and standard architectural shingles (3 bundles per square).',
      inputs: {
        'Ground Footprint': '2,000 sq ft (including overhangs)',
        'Roof Pitch': '6:12 (6 inches rise per 12 inches run)',
        'Roofline Style': 'Simple gable (10% waste)',
        'Bundles per Square': '3 bundles/square',
      },
      steps: [
        {
          step: '1',
          title: 'Calculate the Geometric Pitch Multiplier',
          calculation: 'Pitch Multiplier = sqrt(1 + (6 ÷ 12)²) = sqrt(1 + 0.25) = sqrt(1.25) = 1.118034 (rounded to 1.118).',
          note: 'A 6:12 slope increases the actual rafter surface area by exactly 11.8% over the flat horizontal ground footprint.',
        },
        {
          step: '2',
          title: 'Calculate Actual Sloped Roof Surface Area',
          calculation: 'Actual Roof Area = 2,000 sq ft × 1.118034 = 2,236.07 sq ft (rounded to 2,236.1 sq ft).',
          note: 'This represents the true uninflated plywood deck sheathing square footage.',
        },
        {
          step: '3',
          title: 'Apply 10% Gable Complexity Waste Allowance',
          calculation: 'Recommended Roof Area = 2,236.068 sq ft × 1.10 = 2,459.67 sq ft (rounded to 2,459.7 sq ft).',
          note: 'Accounts for starter courses at drip edges, rake trimmings, ridge cap overlaps, and vent pipe cutouts.',
        },
        {
          step: '4',
          title: 'Convert to Roofing Squares (Exact vs Purchase)',
          calculation: 'Exact Squares = 2,459.67 sq ft ÷ 100 = 24.597 squares (rounded to 24.60 squares). Roofing Squares to Purchase = Math.ceil(24.597) = 25 whole squares.',
          note: 'Roofing materials cannot be ordered in fractional squares; always round up to the next full square.',
        },
        {
          step: '5',
          title: 'Calculate Shingle Bundles and Synthetic Underlayment Rolls',
          calculation: 'Shingle Bundles = 25 squares × 3 bundles/square = 75 bundles. Synthetic Underlayment: 2,459.67 ÷ 1,000 sq ft/roll = 2.46 → Order 3 rolls (10 squares each).',
          note: 'Standard synthetic underlayment rolls cover 10 squares (1,000 sq ft) and replace traditional 15-lb asphalt felt.',
        },
      ],
      resultSummary: 'For this 2,000 sq ft footprint roof, order 25 roofing squares of architectural shingles (packaged as 75 individual bundles) and 3 rolls of 10-square synthetic underlayment.',
    },
    sections: [
      {
        id: 'roof-pitch-multipliers',
        title: 'The Geometry of Roof Pitch: Converting Ground Footprint into Sloped Area',
        content:
          'Roof pitch is expressed as the vertical rise in inches for every 12 inches of horizontal run. Because rafters form the hypotenuse of a right triangle, higher pitches drastically expand surface area.\n\nUsing the Pythagorean theorem, the geometric pitch multiplier formula is:\nMultiplier = sqrt[1 + (Rise ÷ 12)²]\n\nFor a low-slope 3:12 roof, the multiplier is 1.031 (only a 3.1% increase). For a common 6:12 roof, the multiplier is 1.118 (an 11.8% expansion). For a steep 8:12 roof, the multiplier reaches 1.202 (a 20.2% expansion), and for a steep 12:12 Victorian roof, the multiplier is 1.414—meaning the actual roof surface is over 41% larger than the foundation footprint of the house below.',
        table: {
          caption: 'Roof Pitch Multipliers and Area Expansion Table',
          headers: ['Roof Pitch', 'Rise / Run', 'Pitch Multiplier', 'Actual Area per 1,000 sq ft Footprint'],
          rows: [
            ['3:12', '3" rise per 12" run', '1.0308', '1,031 sq ft'],
            ['4:12', '4" rise per 12" run', '1.0541', '1,054 sq ft'],
            ['5:12', '5" rise per 12" run', '1.0833', '1,083 sq ft'],
            ['6:12', '6" rise per 12" run', '1.1180', '1,118 sq ft'],
            ['7:12', '7" rise per 12" run', '1.1577', '1,158 sq ft'],
            ['8:12', '8" rise per 12" run', '1.2019', '1,202 sq ft'],
            ['9:12', '9" rise per 12" run', '1.2500', '1,250 sq ft'],
            ['10:12', '10" rise per 12" run', '1.3017', '1,302 sq ft'],
            ['12:12', '12" rise per 12" run', '1.4142', '1,414 sq ft'],
          ],
        },
      },
      {
        id: 'understanding-roofing-squares',
        title: 'What Is a Roofing Square? The Industry Universal Unit',
        content:
          'In North American construction, roofing is never estimated or billed in square feet. The universal commercial unit is the "Roofing Square", which equals exactly 100 square feet of finished roof surface area.\n\nA roof with 2,400 square feet of actual surface area is referred to by suppliers and contractors as a "24-square roof". Estimating in squares simplifies material ordering, pricing quotes, and dumpster volume calculations. Always convert square feet into squares by dividing by 100, and round up to the next whole number when placing an order.',
      },
      {
        id: 'bundles-per-square-variations',
        title: 'Shingle Bundles per Square: Why It Is Product-Dependent',
        content:
          'A single roofing square weighs between 200 and 450 pounds depending on shingle composition. Because human workers must physically carry this material, manufacturers divide each square into multiple discrete bundles:\n\n1. Standard Architectural Laminate Shingles: Packaged at 3 bundles per square. Each bundle covers approximately 33.3 square feet and weighs 65 to 80 pounds.\n\n2. Traditional 3-Tab Shingles: Also packaged at 3 bundles per square, but thinner, weighing 55 to 65 pounds per bundle.\n\n3. Heavyweight Designer / Luxury Shingles: Thicker, multi-layered dimensional shingles (such as presidential-style or slate-look shingles) are packaged at 4 or 5 bundles per square to prevent individual bundle weights from exceeding safe handling limits (keeping bundles around 70 to 90 pounds each).\n\nOur calculator provides a configurable "bundles per square" setting that defaults to the standard benchmark of 3, but allows adjustments if you choose luxury shingle lines.',
      },
      {
        id: 'complexity-waste-factors',
        title: 'Roof Complexity: Simple Gable vs Hip Roofs and Valleys',
        content:
          'Cutting waste in roofing is largely determined by roofline geometry. On a simple rectangular gable roof, shingles are installed in straight horizontal courses, and offcuts from the right rake edge can frequently be used to start rows on the left rake edge, requiring only a 10% waste buffer.\n\nOn hip roofs, hips meet at 45-degree angles, and valleys channel rainwater into internal intersections. Every shingle meeting a valley or hip must be diagonally trimmed, producing triangular offcuts that cannot be reused. Furthermore, valleys require specialized metal valley flashing or double-woven shingle layers. For hip roofs, multi-gable rooflines, dormers, and chimney saddles, always increase your planning waste buffer to 15% or 20%.',
        callout: {
          type: 'warning',
          title: 'Takeoff Disclaimer: Complex Architectural Roofs',
          text: 'This calculator models area-based estimates from horizontal footprint and pitch. Highly complex rooflines with multiple intersecting dormers, mansard slopes, or curved turrets require detailed on-site drone imaging or architectural blueprint takeoffs.',
        },
      },
      {
        id: 'underlayment-and-accessories',
        title: 'Synthetic Underlayment, Starter Strips, and Drip Edge',
        content:
          'A complete shingle roofing installation requires several accessory materials that accompany your shingle order:\n\n1. Synthetic Underlayment: Modern synthetic polymer underlayment has virtually replaced heavy 15-lb asphalt felt. Standard rolls cover 10 squares (1,000 square feet) and weigh less than 30 pounds while providing superior tear resistance and water repellency.\n\n2. Ice & Water Shield: Self-adhering modified bitumen membrane required along eaves (extending at least 24 inches inside the interior heated wall line in freeze-thaw zones) and along valley centerlines to prevent ice dam leaks.\n\n3. Starter Strip Shingles: Specialized adhesive-backed shingles installed along all eaves and rakes to prevent wind uplift. Estimated by measuring total perimeter linear footage.\n\n4. Hip & Ridge Cap Shingles: Pre-cut capping shingles folded over the peak ridges. Estimated by measuring total ridge linear footage.',
      },
    ],
    costPlanning: {
      overview: 'Roofing costs are divided between material packages (shingles, underlayment, fasteners, flashing) and skilled contractor labor involving tear-off, disposal, and steep-slope staging.',
      benchmarksNote: 'Material price benchmarks reflect current retail distributor ranges per roofing square (100 sq ft) for architectural shingles and synthetic underlayment.',
      materialTiers: [
        {
          tier: 'Standard Architectural Shingles (3-Bundle System)',
          range: '$105 - $185 / roofing square ($1.05 - $1.85 / sq ft)',
          description: 'Standard lifetime limited warranty architectural laminate shingles (e.g. GAF Timberline, Owens Corning Duration) plus synthetic underlayment.',
        },
        {
          tier: 'Premium / Designer Luxury Shingles',
          range: '$190 - $350 / roofing square ($1.90 - $3.50 / sq ft)',
          description: 'Heavyweight dimensional shingles (4 to 5 bundles/square) with high-definition shadow lines, Class 4 impact resistance, and algae defense.',
        },
        {
          tier: 'Turnkey Contractor Installed Roof Replacement',
          range: '$350 - $700 / roofing square ($3.50 - $7.00 / sq ft)',
          description: 'Complete project: old shingle tear-off, disposal dumpster, deck inspection, ice & water shield, synthetic underlayment, shingles, ridge vent, and labor warranty.',
        },
      ],
      diyVsContractor: 'Roof replacement involves steep heights, extreme slip hazards, and heavy material lifting. While detached garage or shed re-roofing is an achievable DIY task, residential home roofs are almost universally contracted to insured professional roofing crews.',
    },
    commonMistakes: [
      {
        mistake: 'Using ground footprint without applying a roof pitch multiplier',
        whyItMatters: 'A 6:12 roof has 11.8% more surface area than the ground footprint; an 8:12 roof has 20.2% more. Forgetting the multiplier guarantees a catastrophic material shortage.',
        prevention: 'Always multiply the horizontal ground footprint by the Pythagorean pitch multiplier before calculating squares or ordering bundles.',
      },
      {
        mistake: 'Assuming all shingle brands use 3 bundles per square',
        whyItMatters: 'If you order luxury or designer shingles packaged at 4 or 5 bundles per square while calculating on a 3-bundle assumption, you will run out with 25% of the roof exposed.',
        prevention: 'Always verify the bundle-per-square packaging count on the specific shingle product specification sheet before placing your order.',
      },
      {
        mistake: 'Underestimating waste on hip and valley rooflines',
        whyItMatters: 'Every hip and valley requires diagonal angle cuts. Applying a standard 10% gable waste buffer to a hip roof will leave you short of shingles on the final ridge.',
        prevention: 'Use a 15% to 20% waste allowance for roofs with hips, valleys, multiple dormers, or intersecting ridge lines.',
      },
      {
        mistake: 'Reusing old, corroded drip edge and valley flashing',
        whyItMatters: 'Shingles last 25 to 30 years. Reusing thin 15-year-old metal flashing creates leak paths beneath new shingles that are costly to repair.',
        prevention: 'Always install brand new galvanized or aluminum drip edge flashing along all eaves and rakes, and install fresh valley metal.',
      },
    ],
    whenEstimateChanges: [
      'Multiple Roof Pitches on One Home: Homes combining a 4:12 main slope with 8:12 dormers require calculating each section with its respective pitch multiplier.',
      'Dormers and Skylight Penetrations: Each roof penetration interrupts shingle courses and requires additional step flashing and angle trimmings.',
      'Existing Shingle Tear-Off Layers: Homes with 2 existing layers of old shingles require double the disposal dumpster capacity and extra labor time.',
      'High-Wind Zone Fastener Requirements: Coastal or hurricane-prone areas require 6 nails per shingle rather than standard 4-nail schedules, increasing coil nail orders.',
      'Rotted Plywood Decking Replacement: Stripping old shingles often reveals rotted 4×8 CDX plywood or OSB sheathing around eaves and valleys that must be replaced.',
    ],
    methodologyAssumptions: [
      'Square Foot Equivalency: One roofing square equals exactly 100 square feet of finished roof surface area.',
      'Pitch Multiplier Formula: Calculated as sqrt(1 + (Rise ÷ 12)²), representing the true geometric hypotenuse of the rafter run.',
      'Complexity Waste Default: A 10% waste buffer is standard for gable roofs; 15% to 20% is recommended for hip and valley layouts.',
      'Bundle Default: Calculator defaults to 3 bundles per square (typical for architectural shingles), but allows configuration for 2 to 6 bundles.',
      'Underlayment Coverage: Synthetic underlayment rolls are modeled at 1,000 sq ft (10 squares) per commercial roll.',
    ],
    faqs: [
      {
        question: 'What is the formula to calculate roof square footage from ground footprint?',
        answer:
          'Measure the horizontal ground footprint of the home (Length × Width including roof overhangs), and multiply by the pitch multiplier: sqrt[1 + (Pitch / 12)²]. For example, a 2,000 sq ft footprint with a 6:12 pitch has a multiplier of 1.118, yielding 2,236 square feet of actual sloped roof area.',
      },
      {
        question: 'How many bundles of shingles do I need for a 2,000 square foot roof?',
        answer:
          'A 2,000 square foot actual roof area equals 20 roofing squares. Adding 10% for cutting waste brings the total to 22 squares. If using standard architectural shingles packaged at 3 bundles per square, you will need 66 bundles (22 squares × 3 bundles/square).',
      },
      {
        question: 'How much does a bundle of shingles weigh?',
        answer:
          'A standard bundle of architectural laminate shingles weighs between 65 and 80 pounds. A full roofing square (3 bundles) weighs between 200 and 240 pounds. Heavyweight luxury shingles can weigh upwards of 90 pounds per bundle.',
      },
      {
        question: 'Can I install new shingles directly over old shingles?',
        answer:
          'Most building codes allow a maximum of two layers of asphalt shingles on a roof. However, roofing manufacturers and quality contractors strongly advise tearing off the old layer. Installing over old shingles prevents inspecting the wooden deck sheathing, reduces fire resistance, traps heat that shortens shingle lifespan, and voids certain manufacturer warranties.',
      },
      {
        question: 'How many nails are needed per shingle?',
        answer:
          'Standard installation requires 4 roofing nails per shingle under normal wind conditions. In designated high-wind zones (over 110 mph) or on steep roofs, building codes and manufacturer warranties require 6 nails per shingle plus starter strip sealing.',
      },
    ],
    relatedCalculatorIds: ['roofing-calculator', 'drywall-calculator'],
    relatedGuideSlugs: ['how-much-drywall-do-i-need'],
  },

  'how-much-topsoil-do-i-need': {
    slug: 'how-much-topsoil-do-i-need',
    title: 'How Much Topsoil Do I Need? Calculate Cubic Yards, Depth, and Bags',
    subtitle: 'A homeowner groundwork guide: measure bed square footage, specify final installed depth, account for organic settling, and evaluate bulk dump truck delivery versus retail bags.',
    metaTitle: 'How Much Topsoil Do I Need? Topsoil Yardage & Bag Calculator',
    metaDescription: 'Calculate how many cubic yards and bags of topsoil you need for garden beds and lawns based on area, final installed depth, and organic settling allowances.',
    categoryId: 'landscaping',
    targetCalculatorId: 'topsoil-calculator',
    targetCalculatorPath: '/calculators/topsoil-calculator',
    targetCalculatorName: 'Topsoil & Garden Bed Calculator',
    guideType: 'how-to-calculate',
    summary: 'Determine exactly how many bulk cubic yards or retail bags (0.75 cu ft / 1.0 cu ft) of topsoil your garden bed, lawn leveling, or raised bed project requires with organic settling buffers.',
    readingTimeMinutes: 9,
    publishedDate: '2026-02-18',
    lastReviewedDate: '2026-02-18',
    quickAnswer:
      'To calculate topsoil: multiply bed length by width to get square footage, multiply by final installed depth in feet (depth in inches divided by 12) to calculate geometric cubic feet, divide by 27 to convert to cubic yards, and apply a 10% organic settling buffer once. For a 20×10 ft garden bed (200 sq ft) at a 4-inch final installed depth: geometric volume is 66.67 cu ft (2.47 cu yds). Adding 10% settling requires 73.33 cu ft (2.72 cu yds), which translates to 3 bulk cubic yards delivered by dump truck, or 98 retail bags (0.75 cu ft each), or 74 retail bags (1.0 cu ft each).',
    introduction: [
      'Whether you are establishing a new lawn, building raised vegetable planters, or leveling undulations across an established turf yard, ordering topsoil requires converting two-dimensional surface area into three-dimensional volume while accounting for a fundamental reality of loose earth: soil settles.',
      'Unlike crushed stone or solid concrete, freshly screened topsoil contains substantial air porosity and organic fluff created by mechanical screening drums and loader buckets. When spread across a yard and subjected to rainfall or irrigation, the loose loam particles consolidate into subgrade pores, decreasing in volume by roughly 10% over the first two weeks. Failing to incorporate this settling allowance leaves garden beds sunken below borders and exposes plant root balls.',
      'Furthermore, homeowners must choose between bulk dump truck delivery (priced per cubic yard) and retail plastic bags (typically 0.75 or 1.0 cubic feet). Our topsoil estimating model applies a single transparent 10% settling buffer to final installed depth, helping you calculate both bulk yardage and bag counts while planning delivery access and wheelbarrow workloads.',
    ],
    measurementsNeeded: [
      {
        item: 'Bed Dimensions (Length × Width)',
        unit: 'Feet',
        description: 'The horizontal surface dimensions of the garden bed, lawn patch, or raised planting box.',
        howToMeasure: 'Measure with a tape or surveyor wheel. For irregular curved beds, break the area into approximate rectangles, triangles, or circles and sum the areas.',
      },
      {
        item: 'Final Installed Depth',
        unit: 'Inches',
        description: 'The target compacted, settled depth of topsoil desired after watering and settling.',
        howToMeasure: 'Typical depth standards: 1 to 2 inches for lawn topdressing; 3 to 4 inches for new sod/seed bed prep; 6 to 12 inches for raised vegetable gardens.',
      },
      {
        item: 'Settling Allowance',
        unit: 'Percentage (typically 10%)',
        description: 'The compaction and consolidation buffer applied once to offset natural soil settling.',
        howToMeasure: 'Our calculator incorporates a 10% planning benchmark. Do not double-count by increasing your depth measurement; enter your true target final depth.',
      },
      {
        item: 'Packaging Format Selection',
        unit: 'Bulk Cubic Yards vs Retail Bags',
        description: 'The delivery format: bulk delivery by dump truck or individually bagged garden loam.',
        howToMeasure: 'General threshold: projects requiring over 1.5 to 2.0 cubic yards (more than 50 bags) are significantly cheaper and less packaging-wasteful when ordered in bulk.',
      },
    ],
    threeStageExplanation: {
      stage1Title: 'Stage 1: Mathematical Net Requirement',
      stage1Formula: 'Area (sq ft) = Length × Width; Geometric Cu Ft = Area × (Final Depth in ÷ 12); Geometric Cu Yds = Geometric Cu Ft ÷ 27',
      stage1Description:
        'The pure geometric physical volume required to fill the specified area to your target depth before soil consolidation. Dividing depth in inches by 12 converts dimensions into feet, and dividing cubic feet by 27 converts volume to cubic yards.',
      stage2Title: 'Stage 2: Planning Requirement (10% Settling Allowance Applied Once)',
      stage2Formula: 'Recommended Cu Ft = Geometric Cu Ft × 1.10; Recommended Cu Yds = Recommended Cu Ft ÷ 27',
      stage2Description:
        'A calculated 10% volume allowance that ensures your bed reaches its true target depth after initial watering, foot traffic, and natural particle consolidation. This buffer is applied once—never double-count settling by artificially inflating input depth.',
      stage3Title: 'Stage 3: Commercial Purchase Quantity',
      stage3Formula: 'Bulk Yards = Math.ceil(Rec Cu Yds); 0.75 cu ft Bags = Math.ceil(Rec Cu Ft ÷ 0.75); 1.0 cu ft Bags = Math.ceil(Rec Cu Ft ÷ 1.0)',
      stage3Description:
        'The physical order format: bulk cubic yards delivered by dump truck (typically rounded up to the nearest whole yard, or half-yard where supported), or retail bagged topsoil (36 bags of 0.75 cu ft per yard; 27 bags of 1.0 cu ft per yard).',
    },
    practicalExample: {
      scenario: 'Complete topsoil takeoff for a 20-foot long by 10-foot wide planting bed (200 sq ft) requiring a 4-inch final installed depth and a 10% organic settling allowance.',
      inputs: {
        'Bed Length': '20 feet',
        'Bed Width': '10 feet',
        'Final Installed Depth': '4 inches',
        'Settling Allowance': '10%',
      },
      steps: [
        {
          step: '1',
          title: 'Calculate Surface Area and Depth in Feet',
          calculation: 'Area = 20 ft × 10 ft = 200 sq ft. Depth in Feet = 4 in ÷ 12 in/ft = 0.3333 ft.',
          note: 'Converting depth inches into decimal feet is essential to calculate cubic volume correctly.',
        },
        {
          step: '2',
          title: 'Calculate Geometric Volume (Cubic Feet & Cubic Yards)',
          calculation: 'Geometric Cu Ft = 200 sq ft × 0.3333 ft = 66.67 cu ft. Geometric Cu Yds = 66.67 ÷ 27 = 2.469 cu yds (rounded to 2.47 cu yds).',
          note: 'There are exactly 27 cubic feet in one cubic yard (3 ft × 3 ft × 3 ft).',
        },
        {
          step: '3',
          title: 'Apply 10% Organic Settling Allowance (Applied Once)',
          calculation: 'Recommended Cu Ft = 66.67 cu ft × 1.10 = 73.33 cu ft. Recommended Cu Yds = 73.33 ÷ 27 = 2.716 cu yds (rounded to 2.72 cu yds).',
          note: 'Accounts for soil compression and void consolidation following first deep watering.',
        },
        {
          step: '4',
          title: 'Determine Bulk Order Quantity',
          calculation: 'Bulk Order = Math.ceil(2.72 cu yds) = 3 cubic yards (or 2.75 yards if supplier permits fractional billing).',
          note: 'Most bulk landscape supply yards deliver in whole or half cubic yard increments.',
        },
        {
          step: '5',
          title: 'Calculate Retail Bagged Alternatives (0.75 vs 1.0 cu ft)',
          calculation: '0.75 cu ft Bags: 73.33 ÷ 0.75 = 97.77 → Order 98 bags. 1.0 cu ft Bags: 73.33 ÷ 1.0 = 73.33 → Order 74 bags.',
          note: '0.75 cu ft bags weigh approx 35-40 lbs; 1.0 cu ft bags weigh approx 45-55 lbs depending on moisture content.',
        },
      ],
      resultSummary: 'For this 20×10 ft bed at 4 inches final depth, order 3 cubic yards of bulk screened topsoil (or 98 retail 0.75 cu ft bags, or 74 retail 1.0 cu ft bags).',
    },
    sections: [
      {
        id: 'final-installed-depth-vs-settling',
        title: 'Final Installed Depth vs Settling: The 10% Rule Explained',
        content:
          'When planning a landscaping bed, homeowners think in terms of the "Final Installed Depth"—the finished thickness of soil once the garden is established, planted, and watered. However, soil dumped from a truck bucket or poured from a retail bag is aerated and fluffy.\n\nOur calculator incorporates a 10% organic settling buffer applied once to the geometric volume. A 4-inch target depth will initially be spread at roughly 4.4 inches; as gravity and irrigation consolidate the soil particles, it settles down to your desired 4-inch grade. Never artificially inflate your input depth to "guess" at settling—enter your true target depth, and let the 10% planning allowance handle the consolidation volume.',
      },
      {
        id: 'bulk-vs-bagged-decision',
        title: 'Bulk Delivery vs Bagged Topsoil: The Break-Even Analysis',
        content:
          'Choosing between bulk truck delivery and bagged retail topsoil involves weighing purchase price against handling labor and site access:\n\n1. Bagged Topsoil (Retail Centers): Ideal for small repairs, raised planters under 1 cubic yard (under 25-35 bags), and properties without driveway access for a dump truck. Bags can be carried directly into backyard gates without wheelbarrows, but cost 2x to 3x more per cubic yard and generate significant plastic waste.\n\n2. Bulk Topsoil (Landscape Supply Yards): Essential for projects exceeding 1.5 to 2 cubic yards. Bulk screened loam costs between $26 and $54 per cubic yard, compared to $85 to $140 for the equivalent volume in retail bags. However, bulk delivery requires a dump truck drop site and manual wheelbarrow staging.',
        table: {
          caption: 'Topsoil Purchasing Format Comparison (for 2.72 cu yds)',
          headers: ['Format', 'Package Unit', 'Units Needed', 'Approx Material Cost', 'Labor & Handling'],
          rows: [
            ['Bulk Delivery', '1 Cubic Yard', '3 cu yds', '$80 - $160 (+ delivery fee)', 'Dumped in driveway; requires 25-35 wheelbarrow trips'],
            ['0.75 cu ft Bags', '40-lb Bag', '98 bags', '$245 - $520', 'Can transport in SUV; requires hauling 98 individual bags'],
            ['1.0 cu ft Bags', '50-lb Bag', '74 bags', '$260 - $480', 'Heavy lifting; requires carrying 74 individual bags'],
          ],
        },
      },
      {
        id: 'delivery-and-wheelbarrow-logistics',
        title: 'Delivery Staging and Wheelbarrow Workloads',
        content:
          'One cubic yard of topsoil weighs between 2,000 and 2,400 pounds (over 1 ton) depending on moisture content. A 3-yard delivery weighs upwards of 6,500 pounds.\n\nA standard residential wheelbarrow holds 2 to 3 cubic feet of soil when comfortably filled (weighing 150 to 200 pounds). To move 1 cubic yard (27 cubic feet) from your driveway to the backyard requires 9 to 14 wheelbarrow trips. For our 2.72 cubic yard example, expect 25 to 35 wheelbarrow trips. Ensure you protect lawns with plywood sheets if soil is wet, and never dump bulk soil directly over septic drain fields or water meter covers.',
        callout: {
          type: 'tip',
          title: 'Tarp Staging Tip',
          text: 'Always lay down a large 12×16 foot heavy-duty tarp on your driveway before the dump truck arrives. Having the driver drop the soil directly onto the tarp prevents asphalt staining and makes scraping up the final half-yard with a flat shovel effortless.',
        },
      },
      {
        id: 'screened-loam-vs-fill-dirt',
        title: 'Screened Topsoil vs Fill Dirt vs Garden Soil Blends',
        content:
          'When ordering bulk soil, landscape yards offer several distinct grades:\n\n1. Screened Loam Topsoil: Native topsoil passed through a 1/2-inch or 3/8-inch vibrating screen to remove rocks, sticks, and roots. Ideal for lawn leveling, turfgrass seed beds, and general grading.\n\n2. 50/50 Garden Blend (Topsoil + Compost): Screened topsoil blended with decomposed organic compost. Essential for raised vegetable garden beds and perennial flower beds requiring high nutrient density and water retention.\n\n3. Unscreened Fill Dirt: Subsoil containing clay, stones, and gravel. Useful only for deep structural grading (filling deep depressions over 8 inches) where plant growth is not required.',
      },
    ],
    costPlanning: {
      overview: 'Topsoil costs depend on purchase volume, organic blend composition, and local dump truck delivery charges ($40 to $90 flat delivery fee per drop).',
      benchmarksNote: 'Material price benchmarks reflect current national ranges for bulk screened loam per cubic yard and retail 0.75 cu ft bags.',
      materialTiers: [
        {
          tier: 'Bulk Screened Topsoil (Dump Truck Delivery)',
          range: '$26 - $54 / cubic yard ($1.00 - $2.00 / cu ft)',
          description: 'Standard 1/2" screened loam topsoil delivered in bulk. Most cost-effective format for projects over 1.5 yards.',
        },
        {
          tier: 'Bulk Organic Garden Mix (50% Loam / 50% Compost)',
          range: '$38 - $68 / cubic yard ($1.40 - $2.50 / cu ft)',
          description: 'Premium enriched garden blend with organic compost, mushroom manure, or aged pine fines for raised vegetable beds.',
        },
        {
          tier: 'Retail Bagged Topsoil (0.75 cu ft Bags)',
          range: '$2.49 - $5.29 / bag ($3.30 - $7.00 / cu ft)',
          description: 'Clean, moisture-controlled bagged topsoil from home centers. Ideal for small patches, potted planters, and tight spaces.',
        },
      ],
      diyVsContractor: 'Spreading 2 to 4 cubic yards of topsoil is a classic weekend DIY project with a shovel, wheelbarrow, and bow rake. Landscaping crews typically charge $40 to $70 per cubic yard for spreading and grading labor.',
    },
    commonMistakes: [
      {
        mistake: 'Double-counting soil settling by inflating input depth',
        whyItMatters: 'If you want a 4-inch depth and enter 5 inches while our calculator also applies a 10% settling allowance, you will over-order by 35% and receive piles of leftover soil.',
        prevention: 'Enter your exact target final depth. The calculator automatically adds the 10% organic settling buffer once.',
      },
      {
        mistake: 'Ordering bagged topsoil for large multi-yard projects',
        whyItMatters: 'Buying 100 bags of topsoil at $4.00 per bag costs $400, whereas 3 bulk yards delivered by dump truck costs roughly $150. You also spend hours slicing open 100 plastic bags.',
        prevention: 'Order bulk truck delivery for any project requiring more than 1.5 cubic yards (approx 50 retail bags).',
      },
      {
        mistake: 'Allowing the dump truck to drop soil across a concrete sidewalk or lawn',
        whyItMatters: 'A loaded tandem-axle dump truck weighs over 15 to 25 tons. Driving across residential sidewalks, curbs, or front lawns will crack concrete and leave deep tire ruts.',
        prevention: 'Have the driver dump exclusively on the driveway apron or street edge, and transport soil to the backyard using wheelbarrows.',
      },
      {
        mistake: 'Spreading topsoil over compacted, un-scarified clay subsoil',
        whyItMatters: 'If topsoil is spread over hardpan clay, a sharp boundary layer forms. Roots cannot penetrate, and water pools at the interface, causing lawn root rot.',
        prevention: 'Till or core-aerate the top 2 inches of native subsoil before adding new topsoil so the two soil layers blend seamlessly.',
      },
    ],
    whenEstimateChanges: [
      'Raised Garden Bed Depth: Deep raised beds (8 to 12 inches depth) require significantly more volume; consider filling the bottom 4 inches with coarse organic matter (hugelkultur).',
      'Lawn Topdressing Applications: Topdressing existing turf requires only 1/4 to 1/2 inch depth spread evenly with a lawn leveling lute rake.',
      'Extreme Soil Compaction: Heavy tractor or skid-steer grading compresses loose topsoil up to 15-20% rather than natural 10% settling.',
      'Wet Soil Delivery Weight: Saturated topsoil delivered after heavy rain weighs up to 30% more, limiting truck capacity and making shoveling difficult.',
      'Slope Retention Borders: Sloped terrain requires retaining berms or timber borders to prevent new topsoil from washing away in heavy thunderstorms.',
    ],
    methodologyAssumptions: [
      'Depth Unit Conversion: Final installed depth in inches is converted to feet by dividing by 12.',
      'Cubic Yard Constant: 1 cubic yard equals exactly 27 cubic feet.',
      'Settling Allowance Benchmark: A single 10% organic settling and compaction buffer is applied to geometric volume.',
      'Bag Sizing Standards: Commercial 0.75 cu ft bags yield 36 bags per cubic yard; 1.0 cu ft bags yield 27 bags per cubic yard.',
      'Weight Estimates: Topsoil density varies between 2,000 and 2,400 lbs per cubic yard depending on moisture content and sand/loam ratio.',
    ],
    faqs: [
      {
        question: 'How do I calculate how many cubic yards of topsoil I need?',
        answer:
          'Multiply length (ft) by width (ft) to get square footage. Multiply by depth in feet (depth in inches divided by 12) to calculate cubic feet. Divide cubic feet by 27 to get cubic yards, and add 10% for organic settling. Formula: (Area in sq ft × Depth in inches ÷ 324) × 1.10 = Cubic Yards.',
      },
      {
        question: 'How many bags of topsoil are in a cubic yard?',
        answer:
          'One cubic yard contains 27 cubic feet. If using standard 0.75-cubic-foot bags, you need exactly 36 bags to equal one cubic yard (27 ÷ 0.75 = 36). If using 1.0-cubic-foot bags, you need exactly 27 bags.',
      },
      {
        question: 'How deep should topsoil be for a new lawn?',
        answer:
          'For a healthy new lawn from seed or sod, aim for a final installed depth of 4 to 6 inches of screened topsoil over loosened subsoil. For overseeding or topdressing an existing lawn, spread a thin layer of 1/4 to 1/2 inch.',
      },
      {
        question: 'How much does a cubic yard of topsoil weigh?',
        answer:
          'One cubic yard of dry screened topsoil weighs approximately 2,000 to 2,200 pounds (approx 1 ton). If the soil is wet from rain, weight increases to 2,400 to 2,700 pounds.',
      },
      {
        question: 'What is the difference between topsoil and garden soil?',
        answer:
          'Topsoil is screened natural mineral loam (sand, silt, and clay) with basic organic matter, designed for general grading, lawn leveling, and filling. Garden soil is topsoil enriched with high percentages of compost, peat moss, or manure to provide high nutrient levels and moisture retention for flowers and vegetables.',
      },
    ],
    relatedCalculatorIds: ['topsoil-calculator', 'mulch-calculator', 'gravel-calculator'],
    relatedGuideSlugs: ['how-to-calculate-mulch', 'how-much-gravel-do-i-need'],
  },
};

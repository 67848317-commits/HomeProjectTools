/**
 * Phase 4B-2D: Final Two Calculator Companion Guides
 * 
 * Guide 14: How Much Sod Do I Need? (/guides/how-much-sod-do-i-need)
 * Guide 15: How Much Baseboard Do I Need? (/guides/how-much-baseboard-do-i-need)
 * 
 * ARCHITECTURAL RULES:
 * - Content adheres strictly to the 3-stage estimating model:
 *   Stage 1: Mathematical Net Requirement
 *   Stage 2: Planning Requirement (waste / cutting allowances)
 *   Stage 3: Commercial Purchase Quantity (pallets, rolls, stock molding pieces)
 * - All mathematical examples match the exact calculations in sod.ts and baseboardTrim.ts.
 * - Waste percentages and pallet sizes are identified as planning benchmarks, not universal rules.
 */

import type { GuideDefinition } from '../types/index.ts';

export const PHASE_4B_2D_GUIDES: Record<string, GuideDefinition> = {
  'how-much-sod-do-i-need': {
    slug: 'how-much-sod-do-i-need',
    title: 'How Much Sod Do I Need? Calculate Pallets, Rolls, and Lawn Area',
    subtitle: 'A complete homeowner turfgrass guide: measure lawn square footage, deduct non-lawn obstacles, apply seam-staggering cut waste, and order full commercial pallets or small rolls.',
    metaTitle: 'How Much Sod Do I Need? Sod Pallet, Roll & Lawn Area Calculator',
    metaDescription: 'Calculate how much sod you need for your lawn. Step-by-step guide to measuring square footage, deducting beds, adding cutting waste, and ordering pallets and rolls.',
    categoryId: 'landscaping',
    targetCalculatorId: 'sod-calculator',
    targetCalculatorPath: '/calculators/sod-calculator',
    targetCalculatorName: 'Sod Roll & Pallet Calculator',
    guideType: 'how-to-calculate',
    summary: 'Estimate your complete turfgrass order including lawn square footage, recommended cutting waste, full commercial pallets, and 10-square-foot roll breakdowns for residential lawns.',
    readingTimeMinutes: 9,
    publishedDate: '2026-02-20',
    lastReviewedDate: '2026-02-20',
    quickAnswer:
      'To calculate sod: measure the length and width of each lawn section, multiply to get square footage, subtract non-turf obstacles (patios, flower beds, driveways), and add 5% to 8% for seam-cutting waste (up to 12% for curved borders). Divide recommended square footage by your sod farm’s pallet coverage (standardly 450 to 500 sq ft). Always round UP to the next full pallet. For a 50×30 ft lawn (1,500 sq ft net) with standard 8% cutting waste (1,620 sq ft recommended) and 450 sq ft pallets, order exactly 4 full pallets (1,800 sq ft purchased) or 162 standard 10-sq-ft rolls.',
    introduction: [
      'Establishing a new lawn with freshly harvested sod provides instant green coverage, erosion control, and weed suppression compared to seeding. However, fresh sod is time-sensitive. Because cut turf pallets begin generating internal microbial heat, follow your supplier’s delivery, storage, and installation guidance and plan to install and water it promptly upon arrival.',
      'A frequent homeowner error is underestimating the square footage consumed by curved landscaping beds or failing to order enough material to maintain a proper brick-bond staggered seam pattern. Running short by half a pallet forces an emergency trip to a local nursery—where sod may come from a different farm, resulting in mismatched grass cultivars, uneven leaf textures, or contrasting shades of green.',
      'Conversely, ordering too much sod results in expensive waste, as excess rolls cannot be stored for a following weekend. By following our three-stage estimating methodology—measuring net geometric area, adding appropriate seam-cutting waste, and converting into whole commercial pallets or individual rolls—you ensure your lawn project goes smoothly from delivery to root establishment.',
    ],
    measurementsNeeded: [
      {
        item: 'Lawn Boundary Segments (Length × Width)',
        unit: 'Feet',
        description: 'The maximum length and width of each distinct rectangular or geometric lawn section.',
        howToMeasure: 'Break irregular yards into individual geometric sub-rectangles or right triangles. Measure with a 100-foot fiberglass open-reel tape or walking measuring wheel along existing ground contours.',
      },
      {
        item: 'Non-Lawn Obstacle Deductions',
        unit: 'Square feet',
        description: 'Permanent landscape features that will not receive sod (patios, driveways, garden beds, sheds, sidewalks).',
        howToMeasure: 'Measure the length and width of each obstacle separately. Calculate its square footage and subtract it from the total gross property footprint.',
      },
      {
        item: 'Supplier Pallet Coverage Benchmark',
        unit: 'Square feet per pallet',
        description: 'The exact square footage packed onto a single shipping pallet by your local turfgrass grower.',
        howToMeasure: 'Verify with your local sod farm before ordering. Standard commercial turf pallets in North America standardly hold 450 to 500 square feet (45 to 50 ten-square-foot rolls), but regional pallet sizes can range from 400 to 600 square feet.',
      },
    ],
    threeStageExplanation: {
      stage1Title: 'Stage 1: Mathematical Net Lawn Area',
      stage1Formula: 'Net Area (sq ft) = ∑ (Section Length × Section Width) - Non-Lawn Obstacles',
      stage1Description:
        'Calculate the raw two-dimensional surface area of the lawn. Break irregular or curved yards into simple rectangles, triangles, or trapezoids. Sum all sub-sections together and deduct all hardscaping and planting beds.',
      stage2Title: 'Stage 2: Planning Requirement with Cutting Allowance',
      stage2Formula: 'Recommended Area (sq ft) = Net Area × (1 + Waste Percentage ÷ 100)',
      stage2Description:
        'Sod must be laid in a staggered brick pattern with staggered joints, requiring end-of-row cutoffs. Apply a 5% waste buffer for simple rectangular yards, 8% for standard residential yards with gentle curves, or 12% for yards with kidney-shaped borders, mature trees, or steep slope transitions.',
      stage3Title: 'Stage 3: Commercial Purchase Quantity (Pallets & Rolls)',
      stage3Formula: 'Pallets to Purchase = Math.ceil(Recommended Area ÷ Pallet Coverage); Rolls = Math.ceil(Recommended Area ÷ 10)',
      stage3Description:
        'Commercial turf farms bill and ship sod on wooden pallets. Divide the recommended square footage by the farm’s pallet yield (default 450 sq ft) and round UP to the nearest whole pallet. For small touch-up areas, retail garden centers sell individual 2×5 ft rolls (10 sq ft each).',
    },
    practicalExample: {
      scenario: 'A suburban homeowner installing Kentucky Bluegrass sod on a 50×30 ft backyard with an existing 8% planning waste buffer and standard 450 sq ft farm pallets.',
      inputs: {
        'Lawn Length': '50 feet',
        'Lawn Width': '30 feet',
        'Net Area': '1,500 sq ft',
        'Planning Waste': '8% (standard residential curves)',
        'Pallet Yield': '450 sq ft per pallet',
      },
      steps: [
        {
          step: '1',
          title: 'Calculate Net Mathematical Lawn Area',
          calculation: 'Net Area = 50 ft × 30 ft = 1,500 sq ft.',
          note: 'Represents the exact physical ground footprint requiring grass coverage.',
        },
        {
          step: '2',
          title: 'Apply Seam-Cutting Planning Allowance',
          calculation: 'Recommended Area = 1,500 sq ft × 1.08 = 1,620.0 sq ft.',
          note: 'The 8% planning allowance covers staggered end cuts, edging around borders, and minor trimming scrap.',
        },
        {
          step: '3',
          title: 'Convert to Commercial Full Pallets',
          calculation: 'Exact Pallets = 1,620 sq ft ÷ 450 sq ft/pallet = 3.60 pallets. Pallets to Purchase = Math.ceil(3.60) = 4 full pallets.',
          note: 'Turf farms do not split pallets for bulk delivery orders. Rounding up yields 1,800 total purchased square feet.',
        },
        {
          step: '4',
          title: 'Calculate Equivalent Roll Count',
          calculation: 'Rolls Equivalent = Math.ceil(1,620 sq ft ÷ 10 sq ft/roll) = 162 individual rolls (2 ft × 5 ft each).',
          note: 'Each pallet contains approx 45 rolls (4 pallets × 45 rolls = 180 rolls shipped).',
        },
      ],
      resultSummary: 'For this 50×30 ft lawn (1,500 sq ft net), order 4 full pallets of sod (providing 1,800 sq ft, or 162 rolls minimum recommended coverage) to ensure complete coverage with zero shortfalls.',
    },
    sections: [
      {
        id: 'measuring-irregular-lawns',
        title: 'How to Measure Rectangular, Triangular, and Curved Lawns',
        content:
          'Few residential lawns are perfect rectangles. Measuring an irregular yard accurately requires breaking the total space into simple geometric shapes: rectangles (Length × Width), right triangles (Base × Height ÷ 2), and circles or semi-circles (3.14 × Radius²).\n\nFor curved borders along flowerbeds or patios, measure the widest rectangular bounding box and calculate the area of the non-turf crescent or curved bed. Subtracting the bed area from the rectangle produces a precise net lawn area. Always measure with a taut steel tape or measuring wheel following the grade of the soil rather than aerial property boundary lines.',
        callout: {
          type: 'tip',
          title: 'Planning for Waste on Curved Borders',
          text: 'Every curved border requires trimming straight-edged sod rolls with a sod knife. Yards with extensive meandering landscape beds require a 10% to 12% cut waste buffer compared to 5% for fenced, rectangular backyards.',
        },
      },
      {
        id: 'pallet-vs-roll-standards',
        title: 'Commercial Sod Packaging: Pallets, Big Rolls, and Small Rolls',
        content:
          'In North America, sod is commercially harvested in three primary packaging formats:\n\n1. **Standard Small Rolls (2 ft × 5 ft = 10 sq ft)**: The standard format for residential DIY installations. One roll weighs between 30 and 45 pounds depending on field moisture.\n2. **Commercial Wooden Pallets (450 to 500 sq ft)**: Standard pallets hold 45 to 50 small rolls stacked in interlocked layers. A full pallet weighs between 1,500 and 3,000 pounds. Pallet weights require delivery by flatbed truck equipped with a motorized forklift.\n3. **Slab Sod (16 in × 24 in = 2.67 sq ft)**: Common in some southern warm-season grass regions (St. Augustine, Bermuda), stacked flat on pallets.\n\nAlways confirm your supplier’s exact pallet square footage before finalizing your takeoff.',
        table: {
          caption: 'Standard Residential Sod Packaging Benchmarks',
          headers: ['Packaging Unit', 'Typical Dimensions', 'Square Footage', 'Typical Weight'],
          rows: [
            ['Standard Roll', '2 ft × 5 ft', '10 sq ft', '30 – 45 lbs'],
            ['Sod Slab (Warm-Season)', '16 in × 24 in', '2.67 sq ft', '15 – 25 lbs'],
            ['Standard Pallet (45 rolls)', '48 in × 48 in pallet', '450 sq ft', '1,500 – 2,250 lbs'],
            ['Heavy Pallet (50 rolls)', '48 in × 48 in pallet', '500 sq ft', '1,750 – 2,500 lbs'],
          ],
        },
      },
      {
        id: 'soil-prep-and-staging',
        title: 'Essential Soil Preparation and Delivery Staging',
        content:
          'Sod roots cannot penetrate compacted, dry, or rocky subsoil. Proper site preparation must be completed *before* the sod delivery truck arrives:\n\n1. **Rough Grading**: Clear rocks, roots, and construction debris larger than 1 inch. Grade the soil 1 inch below adjacent concrete sidewalks and driveway edges so the finished sod sits flush.\n2. **Soil Conditioning & Tilling**: Till the top 4 to 6 inches of soil. If native soil is heavy clay or poor sand, incorporate 1 to 2 inches of compost or screened topsoil.\n3. **Starter Fertilizer**: Broadcast a phosphorus-rich starter fertilizer (e.g., 10-20-10 or 18-24-12) onto the graded soil to stimulate immediate root branching.\n4. **Pre-Moistening**: Lightly moisten the dry soil 24 hours before installation. Laying sod on bone-dry dirt pulls critical moisture out of the grass root zone.',
        callout: {
          type: 'warning',
          title: 'Fresh Sod is Time-Sensitive',
          text: 'Fresh sod is time-sensitive. Follow the supplier’s delivery, storage, and installation guidance and plan to install it promptly. Microbial activity inside tightly stacked pallets can raise internal core temperatures rapidly, so avoid staging pallets in direct sun or delaying installation.',
        },
      },
      {
        id: 'installation-best-practices',
        title: 'Step-by-Step Installation: Seams, Staggering, and Rolling',
        content:
          'When laying sod:\n\n- **Start along a straight edge**: Begin along a long straight sidewalk, driveway, or stringline.\n- **Stagger all end joints**: Arrange rolls in a staggered brick pattern (running bond) so end seams do not align across adjacent rows. This prevents erosion channels during early irrigation.\n- **Butt edges tightly together**: Push edges firmly against adjacent rolls without stretching or overlapping. Gaps cause edges to dry out and die, while overlapping creates humps.\n- **Trim with a sharp utility or linoleum knife**: Cut around trees, curves, and sprinkler heads. Always preserve small off-cuts to plug minor voids.\n- **Roll the finished lawn**: Use a water-filled lawn roller to press sod roots firmly against the conditioned subsoil, eliminating air pockets.',
      },
    ],
    costPlanning: {
      overview:
        'Turfgrass sod costs range from $0.35 to $0.85 per square foot for farm-direct bulk pallets ($160 to $380 per pallet). Premium varieties (such as Zoysia or specialty hybrid Bermudas) command higher prices than standard Fescue or Kentucky Bluegrass blends. Delivery freight typically adds $75 to $200 per flatbed shipment.',
      benchmarksNote:
        'Costs vary by geographic region, grass cultivar, and transport distance. Professional contractor installation typically adds $0.40 to $0.90 per square foot for labor, grading, and rolling.',
      materialTiers: [
        {
          tier: 'Economy Cool-Season Blends',
          range: '$160 – $220 per pallet ($0.35 – $0.48/sq ft)',
          description: 'Standard tall fescue, perennial ryegrass, or builder-grade turfgrass blends suitable for sunny residential yards.',
        },
        {
          tier: 'Premium Cool- & Warm-Season Turf',
          range: '$220 – $300 per pallet ($0.49 – $0.67/sq ft)',
          description: 'Kentucky Bluegrass, Tifway 419 Bermuda, or improved turf-type tall fescues with high disease resistance and drought tolerance.',
        },
        {
          tier: 'Specialty & Warm-Season Luxury Sod',
          range: '$300 – $420 per pallet ($0.67 – $0.93/sq ft)',
          description: 'Zoysia (Zeon, Palisades), Palmetto St. Augustine, or shade-tolerant specialty cultivars with dense growth habits.',
        },
      ],
      diyVsContractor:
        'DIY installation saves $600 to $1,500 on a typical 1,500 sq ft lawn, but requires physical labor (lifting 3,000–6,000 lbs of sod) and tight coordination to complete the installation within 24 hours of delivery.',
    },
    commonMistakes: [
      {
        mistake: 'Measuring the gross property perimeter without deducting driveways and beds',
        whyItMatters: 'Results in over-ordering expensive sod pallets that cannot be returned to the farm or stored for later use.',
        prevention: 'Deduct all patios, driveways, decks, and planting beds from the property square footage before computing pallet counts.',
      },
      {
        mistake: 'Stretching sod rolls to cover more ground',
        whyItMatters: 'Stretched sod temporarily covers space, but shrinks back as it dries, leaving wide 1-inch bare gaps between rolls where roots desiccate.',
        prevention: 'Lay rolls naturally and butt edges snugly together without pulling or elongating the turf mesh.',
      },
      {
        mistake: 'Failing to roll the sod after installation',
        whyItMatters: 'Air pockets between sod backing and subsoil prevent roots from anchoring, causing brown, dead patches within 7 to 10 days.',
        prevention: 'Rent a water-ballast lawn roller and make two perpendicular passes over the newly laid lawn immediately before the first deep watering.',
      },
      {
        mistake: 'Light daily surface sprinkling instead of deep soakings',
        whyItMatters: 'Only wets the grass blades, leaving the underlying soil dry and training roots to remain shallow.',
        prevention: 'Water deeply (1 inch of water) immediately after laying, ensuring water penetrates 4 to 6 inches into the subsoil. Maintain damp soil for the first 14 days.',
      },
    ],
    whenEstimateChanges: [
      'Irregular, curved, or tiered landscape borders increase cutting waste from 8% to 12% or 15%.',
      'Local sod farm pallet dimensions: verify whether your supplier ships 400, 450, 500, or 600 sq ft per pallet.',
      'Subsoil quality: poor, heavily compacted clay requires an additional topsoil or compost layer (1 to 2 inches) prior to sodding.',
      'Slope gradients: steep banks require sod staples (biodegradable stakes) to anchor rolls until roots establish.',
    ],
    methodologyAssumptions: [
      'Square footage calculations are based on flat geometric projections; severe slopes require a 5% to 10% surface area expansion.',
      'Pallet coverage assumes the North American residential benchmark of 450 sq ft per pallet (45 ten-square-foot rolls); user-configurable in the calculator from 400 to 600 sq ft.',
      'Waste percentages are planning benchmarks based on lawn geometry: 5% for simple rectangles, 8% for standard residential yards, and 12% for curved/irregular beds.',
      'Sod weights (1,500–3,000 lbs/pallet) are environmental moisture-dependent and provided for delivery logistics planning.',
    ],
    faqs: [
      {
        question: 'How many square feet are in a standard pallet of sod?',
        answer:
          'In most parts of the United States and Canada, a standard pallet of sod contains between 450 and 500 square feet. This typically consists of 45 to 50 individual rolls measuring 2 ft × 5 ft (10 sq ft each). In southern warm-season regions, slab sod pallets may hold 400 to 500 square feet. Always verify your specific supplier’s pallet yield before ordering.',
      },
      {
        question: 'How do I calculate how many pallets of sod I need?',
        answer:
          'First calculate your lawn square footage (Length × Width minus non-lawn beds). Multiply by your planning waste factor (e.g., 1.08 for 8% waste). Then divide by your supplier’s pallet square footage (e.g., 450 sq ft). Always round UP to the next whole pallet. For example, 1,500 sq ft with 8% waste = 1,620 sq ft. Divided by 450 sq ft/pallet = 3.6 pallets, which rounds up to 4 full pallets.',
      },
      {
        question: 'How long can sod sit on a pallet before being installed?',
        answer:
          'Fresh sod is time-sensitive and should be installed as promptly as possible—ideally the same day it is delivered. Follow your supplier’s delivery, storage, and installation guidance. In warm weather, unstack pallets in shaded areas if immediate installation is not possible to prevent heat buildup inside the pallet core.',
      },
      {
        question: 'Can I lay new sod directly over my existing dead grass?',
        answer:
          'No. Laying sod over existing lawn or dead turf creates a physical barrier that prevents new roots from penetrating the underlying soil. The decaying thatch underneath will decompose anaerobically, causing uneven settling, fungal disease, and root rot. You must strip existing sod or rototill the soil, grade the surface, and remove rocks before installing new sod.',
      },
      {
        question: 'How much does a full pallet of sod weigh?',
        answer:
          'A full pallet of sod weighs between 1,500 and 3,000 pounds. The weight varies significantly based on soil thickness and recent field rainfall. Because of this extreme weight, turf farms use flatbed trucks with forklift attachments for delivery, and pallets must be placed on firm driveways or staging areas that can support heavy axle loads.',
      },
    ],
    relatedCalculatorIds: ['sod-calculator', 'topsoil-calculator', 'mulch-calculator'],
    relatedGuideSlugs: ['how-much-topsoil-do-i-need', 'how-to-calculate-mulch'],
  },

  'how-much-baseboard-do-i-need': {
    slug: 'how-much-baseboard-do-i-need',
    title: 'How Much Baseboard Do I Need? Calculate Linear Feet, Door Deductions, and Stock Molding',
    subtitle: 'A complete interior trim estimating guide: measure room perimeter, deduct doorway casing openings accurately, apply miter/scarf cut waste, and optimize commercial stock stick lengths.',
    metaTitle: 'How Much Baseboard Do I Need? Baseboard & Trim Molding Calculator',
    metaDescription: 'Calculate how much baseboard molding you need. Step-by-step guide to measuring room perimeter, subtracting door openings, adding miter cut waste, and choosing stock lengths.',
    categoryId: 'flooring',
    targetCalculatorId: 'baseboard-trim-calculator',
    targetCalculatorPath: '/calculators/baseboard-trim-calculator',
    targetCalculatorName: 'Baseboard & Trim Molding Calculator',
    guideType: 'how-to-calculate',
    summary: 'Estimate your complete baseboard molding order including wall perimeter, doorway casing deductions, recommended 15% miter/scarf joint allowance, and commercial 8-ft, 12-ft, or 16-ft stick counts.',
    readingTimeMinutes: 8,
    publishedDate: '2026-02-20',
    lastReviewedDate: '2026-02-20',
    quickAnswer:
      'To calculate baseboard molding: measure the continuous perimeter of the room (2 × [Length + Width]), subtract 2.5 linear feet for each standard interior doorway opening, and multiply by 1.15 to add a 15% planning allowance for 45° corner miters, inside copes, and scarf joints. Divide recommended linear footage by your chosen stock molding length (8, 12, or 16 ft) and round UP to the nearest whole piece. For a 16×12 ft room (56 ft perimeter) with 2 standard doors (5.0 ft deduction = 51.0 LF net) and 15% miter allowance (58.7 LF recommended), purchase five 12-foot stock sticks (60 purchased linear feet).',
    introduction: [
      'Baseboard trim and shoe molding serve both an aesthetic and a critical functional role in residential construction. Beyond creating a clean transition between wall surfaces and flooring, baseboards conceal the required 1/4-inch to 1/2-inch perimeter expansion gap left around hardwood, laminate, and luxury vinyl plank floors. When baseboards are missing or improperly sized, flooring edges remain exposed to dust, moisture, and buckled planks.',
      'A common measuring mistake homeowners make is calculating simple wall perimeter and purchasing the exact linear footage in short 8-foot sticks. While 8-foot boards fit easily inside a standard passenger SUV, installing short pieces across a 16-foot living room wall forces multiple mid-wall scarf joints. Every scarf joint requires bevel cutting, glue, brad nailing, wood filling, and meticulous sanding to blend seamlessly into the trim.',
      'Furthermore, 45-degree outside miter cuts and angled cuts consume material from every stick, and cutoffs shorter than 12 inches cannot be reused. By following our three-stage estimating model—measuring gross perimeter, deducting doorway openings, adding a 15% miter allowance, and selecting optimal stock piece lengths—you can finish your rooms with professional, seamless trim work.',
    ],
    measurementsNeeded: [
      {
        item: 'Gross Room Perimeter (Length & Width)',
        unit: 'Linear feet',
        description: 'The continuous distance around the base of all walls in the room.',
        howToMeasure: 'Measure room length and width at floor level against the finished drywall. Gross Perimeter = 2 × (Length + Width). For irregular rooms, measure and sum each individual straight wall run.',
      },
      {
        item: 'Interior Doorway Openings',
        unit: 'Number of doors',
        description: 'Standard passage doors, closet openings, or archways where the baseboard terminates against door casing.',
        howToMeasure: 'Count all standard doorway openings. The planning standard deducts 2.5 linear feet (30 inches) per opening, accounting for casing trim.',
      },
      {
        item: 'Commercial Stock Stick Length',
        unit: '8, 12, or 16 feet',
        description: 'The physical manufactured length of the baseboard trim pieces you plan to purchase.',
        howToMeasure: 'Select based on wall lengths and transport capability: 8-foot pieces for easy vehicle transport; 12-foot pieces for the best DIY balance of few seams and manageable handling; 16-foot pieces for professional seamless long walls.',
      },
    ],
    threeStageExplanation: {
      stage1Title: 'Stage 1: Mathematical Net Linear Footage',
      stage1Formula: 'Net Linear Feet = Gross Perimeter - (Door Count × 2.5 ft)',
      stage1Description:
        'Calculate the raw wall perimeter where baseboard will actually be attached. Sum all wall segments and subtract 2.5 linear feet for every standard doorway opening where baseboard terminates against vertical door jamb casing.',
      stage2Title: 'Stage 2: Planning Requirement with Miter Allowance',
      stage2Formula: 'Recommended Linear Feet = Net Linear Feet × (1 + Waste Percentage ÷ 100)',
      stage2Description:
        'Cutting 45° outside corner miters, inside corner copes, and 30°/45° scarf lap joints removes workable length from each stick. A 15% planning allowance is recommended for standard rectangular rooms, while 10% works for long uninterrupted hallways and 20% for complex layouts with frequent bump-outs and short pilasters.',
      stage3Title: 'Stage 3: Commercial Purchase Quantity (Whole Stock Sticks)',
      stage3Formula: 'Sticks to Purchase = Math.ceil(Recommended Linear Feet ÷ Stick Length); Purchased LF = Sticks × Stick Length',
      stage3Description:
        'Lumberyards and home improvement stores sell molding in rigid commercial lengths (standardly 8, 12, or 16 feet). Divide the recommended linear footage by the chosen stick length and round UP to the next whole piece. Multiply stick count by piece length to find total purchased linear footage.',
    },
    practicalExample: {
      scenario: 'A homeowner trimming a 16×12 ft primary bedroom with two standard doorways, choosing 12-foot stock MDF baseboards and applying the standard 15% planning miter allowance.',
      inputs: {
        'Room Length': '16 feet',
        'Room Width': '12 feet',
        'Doorway Openings': '2 doors',
        'Stock Piece Length': '12 feet',
        'Planning Waste': '15% (standard miter allowance)',
      },
      steps: [
        {
          step: '1',
          title: 'Calculate Gross Room Perimeter',
          calculation: 'Gross Perimeter = 2 × (16 ft + 12 ft) = 2 × 28 ft = 56.0 linear feet.',
          note: 'Represents the continuous wall base perimeter before accounting for doors.',
        },
        {
          step: '2',
          title: 'Deduct Doorway Openings for Net Linear Footage',
          calculation: 'Doorway Deductions = 2 doors × 2.5 ft/door = 5.0 linear feet. Net Linear Feet = 56.0 - 5.0 = 51.0 linear feet.',
          note: 'Baseboard terminates cleanly against door casing moldings.',
        },
        {
          step: '3',
          title: 'Apply 15% Miter and Scarf Cut Allowance',
          calculation: 'Recommended Linear Feet = 51.0 LF × 1.15 = 58.65 LF (rounded to 58.7 linear feet).',
          note: 'The 15% buffer covers outside corner miter angles, inside cope test cuts, and end trimming.',
        },
        {
          step: '4',
          title: 'Convert to Commercial Whole Stock Sticks',
          calculation: 'Exact Sticks = 58.65 LF ÷ 12 ft/stick = 4.8875 sticks. Sticks to Purchase = Math.ceil(4.8875) = 5 full 12-foot sticks.',
          note: 'Home improvement centers sell full unbroken molding pieces.',
        },
        {
          step: '5',
          title: 'Calculate Total Purchased Linear Footage',
          calculation: 'Purchased Linear Feet = 5 sticks × 12 ft = 60 linear feet.',
          note: 'Provides 9 linear feet of contingency scrap for test miter cuts and coping practice.',
        },
      ],
      resultSummary: 'For this 16×12 ft room with 2 doors (51.0 net LF), purchase 5 full 12-foot sticks of baseboard (60 purchased linear feet) to achieve clean installations with minimal wall seams.',
    },
    sections: [
      {
        id: 'measuring-multiple-rooms',
        title: 'How to Measure Single Rooms, Hallways, and Multi-Room Projects',
        content:
          'When measuring a multi-room house for baseboard renovation, measure each room as an independent worksheet segment:\n\n1. **Measure against finished drywall**: Always hook your tape against the bottom of the wallboard at the subfloor level. If old baseboards are still installed, measure along the top edge to avoid measuring warped shoe mold.\n2. **Catalog all door openings separately**: Count passage doors, bifold closet openings, and exterior entry doors. Standard interior passage doors measure 30 to 36 inches across the casing opening, which converts to the standard 2.5 linear foot deduction.\n3. **Handle wide openings accurately**: For 60-inch double doors or 72-inch sliding patio doors, measure the actual opening width in feet rather than using the default 2.5-foot passage door deduction.',
        callout: {
          type: 'tip',
          title: 'Measuring Hallways and Stair Landings',
          text: 'Hallways have high door-to-wall ratios. While a standard bedroom has 2 doors across 56 feet, a hallway may have 5 doors across 30 feet. Always tally every door opening individually to avoid massive over-ordering in corridors.',
        },
      },
      {
        id: 'choosing-stock-lengths',
        title: 'Choosing Stock Lengths: 8 ft vs 12 ft vs 16 ft Pieces',
        content:
          'Baseboard trim is manufactured in three primary commercial lengths, each presenting distinct trade-offs:\n\n- **8-Foot Pieces**: Easiest to handle and transport inside any passenger car, hatchback, or midsize SUV. However, on walls longer than 8 feet, you must join pieces with scarf joints, increasing installation labor and potential visible seams.\n- **12-Foot Pieces**: The ideal DIY balance. Spans most typical bedroom and bathroom walls with zero joints, fits through residential doors with ease, and can be transported on an SUV roof rack or pickup bed with tailgate down.\n- **16-Foot Pieces**: The professional contractor benchmark. Eliminates seams on walls up to 16 feet long. However, 16-foot sticks are unwieldy, require careful handling to avoid snapping primed MDF, and require a full-size pickup truck or lumberyard flatbed delivery.',
        table: {
          caption: 'Baseboard Stock Length Comparison Matrix',
          headers: ['Stock Length', 'Best Project Applications', 'Joint Frequency', 'Transportation Requirement'],
          rows: [
            ['8-Foot Pieces', 'Small bathrooms, closets, DIYers with small cars', 'High (every 8 ft on long walls)', 'Fits inside passenger vehicles / SUVs'],
            ['12-Foot Pieces', 'Standard bedrooms, living rooms, DIY projects', 'Low (spans most bedroom walls)', 'Pickup truck bed or SUV roof rack'],
            ['16-Foot Pieces', 'Open-concept spaces, master suites, professional trim', 'Minimal (seamless runs up to 16 ft)', 'Truck with lumber rack or lumber delivery'],
          ],
        },
      },
      {
        id: 'material-selection-mdf-wood',
        title: 'Molding Material Comparison: Primed MDF vs Finger-Joint Pine vs Hardwood',
        content:
          'Selecting the right trim profile and substrate depends on your paint finish and room moisture:\n\n- **Primed MDF (Medium Density Fiberboard)**: The most cost-effective and uniform option for painted trim. Completely free of knots, perfectly straight, and budget-friendly. However, MDF swells irreversibly if exposed to standing water, making it unsuitable for wet bathroom zones.\n- **Primed Finger-Joint Pine**: Natural solid wood constructed from interlocked finger-jointed pine segments. Holds finish nails exceptionally well, resists minor moisture exposure better than MDF, and cuts cleanly without powdery dust.\n- **Solid Hardwood (Oak, Maple, Poplar)**: Used for clear-coat, stained, or high-end architectural trim. Must be pre-drilled near board ends to prevent splitting during nailing.',
      },
      {
        id: 'fasteners-and-adhesives',
        title: 'Fasteners, Adhesives, and Finishing Accessories Takeoff',
        content:
          'A complete baseboard takeoff requires several companion consumables:\n\n- **Finish Nails (15-gauge or 16-gauge)**: Use 2-inch to 2-1/2-inch finish nails driven through the baseboard into wall studs (spaced 16 inches on-center). Never nail baseboard only into drywall or subfloor.\n- **Painter’s Acrylic Latex Caulk**: Plan for approximately 1 standard 10-oz cartridge per 50 linear feet of baseboard. Caulk seals the top edge gap against drywall irregularities.\n- **Wood Filler or Spackle**: 1 small tub for filling nail indentations and smoothing scarf joint transitions.\n- **Base Shoe / Quarter Round**: If your new flooring sits lower than the previous floor or has irregular expansion gaps, add matching quarter round molding (measured using the same linear footage formula).',
      },
    ],
    costPlanning: {
      overview:
        'Baseboard molding costs range from $0.95 to $2.75 per linear foot for standard 3-1/4 to 5-1/4 inch primed MDF profiles. Finger-jointed pine runs $1.40 to $3.50 per linear foot, while solid hardwoods range from $3.00 to $7.00+ per foot. Finishing consumables (nails, caulk, filler) add approximately $0.15 to $0.25 per linear foot.',
      benchmarksNote:
        'Prices represent typical retail benchmarks. Professional finish carpenters typically charge $1.50 to $3.50 per linear foot for installation labor, including coping inside corners and caulking.',
      materialTiers: [
        {
          tier: 'Primed MDF (3-1/4" to 4-1/4" profile)',
          range: '$0.95 – $1.65 per linear foot',
          description: 'Standard modern or colonial primed MDF baseboard molding for painted interior walls.',
        },
        {
          tier: 'Primed Finger-Joint Pine (3-1/4" to 5-1/4" profile)',
          range: '$1.45 – $2.60 per linear foot',
          description: 'Solid wood finger-jointed pine with factory primer, superior nail holding, and better moisture resistance.',
        },
        {
          tier: 'Tall Architectural Profiles / Solid Hardwood (5-1/4" to 7-1/4")',
          range: '$2.75 – $5.50+ per linear foot',
          description: 'Substantial multi-piece baseboards, craftsmen speed base, or solid oak/poplar for stain-grade finishes.',
        },
      ],
      diyVsContractor:
        'Trimming a 16×12 ft bedroom DIY costs approximately $75 to $150 in materials, compared to $250 to $450 with professional trim carpenter installation.',
    },
    commonMistakes: [
      {
        mistake: 'Measuring over existing quarter round or warped shoe mold',
        whyItMatters: 'Produces inaccurate wall measurements and ignores drywall corner build-ups.',
        prevention: 'Hook your tape directly against drywall framing at the floor line, or measure along the top edge of existing baseboard.',
      },
      {
        mistake: 'Using simple 90-degree butt joints on straight wall runs',
        whyItMatters: 'Straight butt joints will open into noticeable dark cracks as wood or MDF expands and contracts with seasonal humidity.',
        prevention: 'Join pieces along long walls using a 30° or 45° overlapping scarf joint positioned directly over a wall stud, glued and double-nailed.',
      },
      {
        mistake: 'Miter cutting inside corners instead of coping',
        whyItMatters: 'Drywall corners are rarely square (often 88° or 92° due to joint compound tape buildup). Mitering inside corners creates gaping open seams.',
        prevention: 'Run one baseboard square into the corner and cope the profile of the intersecting piece using a coping saw for a tight, gap-free fit.',
      },
      {
        mistake: 'Purchasing only 8-foot sticks for large rooms',
        whyItMatters: 'Creates numerous mid-wall seams that require extensive caulking, filling, and sanding to hide.',
        prevention: 'Select 12-foot or 16-foot stock pieces for rooms with walls longer than 10 feet.',
      },
    ],
    whenEstimateChanges: [
      'Room layout complexity: rooms with bay windows, decorative pillars, or half-walls increase miter waste from 15% to 20% or 25%.',
      'Doorway width variations: wide 6-foot French doors or sliding glass patio doors require custom deductions instead of the standard 2.5-foot door allowance.',
      'Quarter round / shoe mold addition: adding shoe molding requires doubling the purchased stick count.',
      'Stock piece breakage: primed MDF sticks longer than 12 feet can crack if transported without adequate rigid support.',
    ],
    methodologyAssumptions: [
      'Gross perimeter is calculated as 2 × (Length + Width) for rectangular rooms.',
      'Standard doorway deduction is 2.5 linear feet (30 inches) per opening, reflecting typical residential interior passage doors.',
      'Miter allowance of 15% is a planning benchmark to absorb 45° outside miter cuts, 30°/45° scarf joints, and coping scrap; user-configurable to 10% or 20%.',
      'Stock stick sizing assumes commercial standard pieces of 8, 12, or 16 feet; full-piece purchase rounding is strictly enforced.',
    ],
    faqs: [
      {
        question: 'How do I calculate how much baseboard I need?',
        answer:
          'Measure the length and width of your room to find the perimeter: 2 × (Length + Width). Subtract 2.5 linear feet for every interior doorway opening to get your net linear footage. Then multiply by 1.15 to add a 15% allowance for miter cuts, corner joints, and scrap. Finally, divide by your chosen board length (8, 12, or 16 ft) and round UP to the nearest whole piece.',
      },
      {
        question: 'How much linear footage do I deduct for a doorway?',
        answer:
          'Standard interior residential passage doors (measuring 28 to 36 inches wide) require a 2.5-foot (30-inch) deduction from the gross wall perimeter. This accounts for the space occupied by the door opening and vertical door casing moldings. For larger openings such as 5-foot French doors or 6-foot patio sliders, measure and deduct the exact opening width.',
      },
      {
        question: 'Why should I add 15% waste for baseboard molding?',
        answer:
          'Unlike straight flooring cuts where cutoff pieces can often start the next row, baseboards require 45-degree angle miter cuts for outside corners and overlapping scarf joints. Angled cuts consume length from each board, and offcuts shorter than 12 inches cannot be cleanly reused. A 15% planning buffer ensures you have enough length for test cuts and coping without running short.',
      },
      {
        question: 'Should I buy 8-foot, 12-foot, or 16-foot baseboard sticks?',
        answer:
          'If you have a pickup truck or roof rack, 12-foot pieces are the best choice for DIYers. They span most bedroom walls without any joints while remaining easy to maneuver around stairways and hallways. Buy 8-foot pieces only if you must transport them inside a small car, and use 16-foot pieces if you have open-concept walls and a truck equipped to haul long lumber.',
      },
      {
        question: 'Do I need baseboard and quarter round (shoe molding)?',
        answer:
          'Baseboard is the primary vertical trim against the wall. Shoe molding (or quarter round) is a small 1/2" × 3/4" flexible molding installed along the bottom front edge of the baseboard. It is commonly needed when installing floating floors (luxury vinyl plank or laminate) to conceal uneven floor dips and ensure the mandatory 1/4" to 3/8" expansion gap is completely covered.',
      },
    ],
    relatedCalculatorIds: ['baseboard-trim-calculator', 'flooring-calculator', 'paint-calculator'],
    relatedGuideSlugs: ['how-to-calculate-flooring-material', 'how-much-paint-do-i-need'],
  },
};

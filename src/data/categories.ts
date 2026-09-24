/**
 * Category Data Store for Home Project Tools
 * Defines the 7 Core Residential Improvement Categories
 */

import type { CategoryDefinition, CategoryId } from '../types/index.ts';
export type { CategoryDefinition, CategoryId };

export const CATEGORIES: Record<CategoryId, CategoryDefinition> = {
  flooring: {
    id: 'flooring',
    name: 'Flooring',
    slug: 'flooring',
    hubPath: '/projects/flooring',
    shortDescription: 'Plan hardwood, luxury vinyl plank, tile, and trim molding projects.',
    fullDescription:
      'Accurately estimate floor square footage, commercial carton counts, underlayment rolls, and trim allowances for residential floor installations.',
    iconName: 'Layers',
    accentColor: '#0284c7', // Sky Blue
    calculatorIds: ['flooring-calculator', 'tile-calculator', 'baseboard-trim-calculator'],
    relatedCategoryIds: ['walls-drywall', 'painting'],
    commonMaterials: [
      'Luxury Vinyl Plank (LVP)',
      'Engineered Hardwood',
      'Ceramic & Porcelain Tile',
      'Acoustic & Moisture Underlayment',
      'Baseboard & Quarter Round Molding',
      'Thin-Set Mortar & Tile Grout',
    ],
    planningWorkflowSteps: [
      'Measure room length and width, accounting for closets, alcoves, and transitions.',
      'Determine net square footage and select appropriate cut waste allowance (10% standard, 15% diagonal).',
      'Convert required coverage into full manufacturer cartons and underlayment rolls.',
      'Factor in companion trim: baseboards, shoe molding, transition thresholds, and reserve cushions.',
    ],
    planningQuestions: [
      {
        question: 'How much flooring should I order above my room square footage?',
        answer:
          'Plan for 10% cut waste on standard rectangular rooms. Increase to 12% for multiple closets or hallways, 15% for diagonal installations, and 20% for herringbone patterns.',
      },
      {
        question: 'Why do I have to buy full cartons instead of exact square feet?',
        answer:
          'Flooring manufacturers package planks in factory-sealed cartons (typically 18 to 24 sq ft per box). Retailers do not break open cartons, so your order is always rounded up to the next full carton.',
      },
      {
        question: 'Do I need separate underlayment with luxury vinyl plank (LVP)?',
        answer:
          'Check the product packaging. Many modern LVP products feature pre-attached acoustic foam pads. If installing bare-backed planks over concrete or plywood, a separate 100 sq ft roll underlayment is required.',
      },
      {
        question: 'How many extra cartons should I save after installation?',
        answer:
          'Keeping 1 unopened carton (plus leftover intact planks) in climate-controlled storage protects you against future water damage, appliance leaks, or discontinued production dye lots.',
      },
    ],
    relatedGuideSlugs: [
      'how-to-calculate-flooring-material',
      'how-much-tile-do-i-need',
      'how-much-baseboard-do-i-need',
    ],
    seo: {
      metaTitle: 'Flooring Project Calculators & Material Estimators',
      metaDescription:
        'Plan residential flooring projects. Calculate cartons, tiles, grout, underlayment rolls, and trim molding with transparent waste allowances.',
      keywords: ['flooring calculator', 'tile calculator', 'vinyl plank cartons', 'baseboard linear feet'],
    },
  },
  painting: {
    id: 'painting',
    name: 'Painting & Finishes',
    slug: 'painting-finishes',
    hubPath: '/projects/painting-finishes',
    shortDescription: 'Calculate paint gallons for walls, ceilings, doors, and trim.',
    fullDescription:
      'Avoid overbuying paint by calculating true paintable wall surface areas with door/window deductions and configurable coat coverage.',
    iconName: 'Paintbrush',
    accentColor: '#8b5cf6', // Violet
    calculatorIds: ['paint-calculator'],
    relatedCategoryIds: ['walls-drywall', 'flooring'],
    commonMaterials: [
      'Interior Wall Paint (Eggshell/Satin)',
      'Ceiling Flat Paint',
      'High-Adhesion Primer/Sealer',
      'Painter Tape & Masking Film',
      'Roller Covers, Trays & Brushes',
      'Heavy Canvas Drop Cloths',
    ],
    planningWorkflowSteps: [
      'Measure wall perimeter and ceiling height to compute gross surface area.',
      'Deduct standard door (21 sq ft) and window (15 sq ft) openings from gross area.',
      'Determine the number of coats required (typically 2 coats over prepared drywall).',
      'Divide total coated square footage by the 350 sq ft/gal spread benchmark and round up to whole gallons.',
    ],
    planningQuestions: [
      {
        question: 'How many square feet does one gallon of paint cover?',
        answer:
          'Quality interior latex paint covers approximately 350 to 400 square feet per gallon on smooth, primed walls. Porous unprimed drywall or heavily textured plaster may yield only 250 to 300 sq ft per gallon.',
      },
      {
        question: 'Should I deduct doors and windows from my wall measurements?',
        answer:
          'Yes. A standard interior door opening is approximately 21 sq ft and an average residential window is about 15 sq ft. Deducting openings prevents purchasing 15% to 25% unneeded paint.',
      },
      {
        question: 'When is a separate primer coat required?',
        answer:
          'Primer is necessary over bare unpainted drywall, joint compound patches, stained surfaces, or when making an extreme color transition (e.g. deep navy to pastel off-white).',
      },
      {
        question: 'Should I buy 1-gallon cans or a 5-gallon contractor bucket?',
        answer:
          'If your calculated project requirement is 4 gallons or more of the exact same color, a 5-gallon contractor pail is typically 15% to 25% cheaper per gallon than buying single cans.',
      },
    ],
    relatedGuideSlugs: ['how-much-paint-do-i-need'],
    seo: {
      metaTitle: 'Painting & Finishes Project Tools | Gallon & Wall Estimators',
      metaDescription:
        'Calculate paint gallons for interior walls and ceilings with accurate door and window deductions and multi-coat spread rates.',
      keywords: ['paint coverage calculator', 'interior paint gallons', 'room painting estimator'],
    },
  },
  'concrete-masonry': {
    id: 'concrete-masonry',
    name: 'Concrete & Masonry',
    slug: 'concrete-masonry',
    hubPath: '/projects/concrete-masonry',
    shortDescription: 'Calculate cubic yards, pre-mixed bags, and paver layers for flatwork and posts.',
    fullDescription:
      'Plan concrete slab pours, post hole footings, and paver patios with exact cubic yardage, commercial bag yields, and subgrade allowances.',
    iconName: 'Boxes',
    accentColor: '#d97706', // Amber / Concrete
    calculatorIds: [
      'concrete-slab-calculator',
      'concrete-post-hole-calculator',
      'paver-patio-calculator',
    ],
    relatedCategoryIds: ['fencing-decking', 'landscaping'],
    commonMaterials: [
      '80-lb / 60-lb Pre-Mix Concrete Bags',
      'Ready-Mix Batch Plant Transit Concrete',
      'Crushed Dense-Grade Base Gravel (1.55 tons/yd³)',
      'Coarse Bedding Sand (1" uncompacted layer)',
      'Polymeric Jointing Sand (50-lb bags)',
      'Interlocking Concrete Paver Stones',
    ],
    planningWorkflowSteps: [
      'Calculate geometric volume from length, width, and thickness in inches.',
      'Convert volume to cubic yards (divide cubic feet by 27) and add a 10% subgrade buffer.',
      'Compare ready-mix transit truck delivery against pre-mixed bags based on pour size.',
      'For paver patios, calculate aggregate base with a 6-inch perimeter extension for edge restraints.',
    ],
    planningQuestions: [
      {
        question: 'When should I compare ready-mix truck delivery against bags?',
        answer:
          'For pours above approximately 1.5 cubic yards (68+ 80-lb bags), mixing by hand or portable mixer becomes physically exhausting and increases cold-joint risks. Ready-mix transit trucks deliver uniform, continuous concrete.',
      },
      {
        question: 'How many 80-lb bags of concrete are in one cubic yard?',
        answer:
          'One cubic yard equals 27 cubic feet. A standard 80-lb bag yields approximately 0.60 cubic feet. Therefore, 45 bags of 80-lb pre-mix equal 1 cubic yard (or 60 bags of 60-lb mix).',
      },
      {
        question: 'Why does paver patio base gravel extend beyond the pavers?',
        answer:
          'ICPI installation standards recommend extending the crushed stone base 6 inches past all exposed paver edges so snap-edge plastic restraints are spiked into compacted stone rather than loose soil.',
      },
      {
        question: 'How deep should fence post and mailbox footings be poured?',
        answer:
          'Post hole depth should extend below your regional frost line (typically 30 to 48 inches in freeze-thaw zones) or at least 1/3 of the total post height to withstand wind overturning forces.',
      },
    ],
    relatedGuideSlugs: [
      'how-much-concrete-do-i-need-for-a-slab',
      'how-much-concrete-do-i-need-for-fence-posts',
      'how-to-calculate-paver-patio-materials',
    ],
    seo: {
      metaTitle: 'Concrete & Masonry Project Tools | Slabs, Post Holes & Pavers',
      metaDescription:
        'Calculate cubic yards, 80-lb and 60-lb bags, and multi-layer paver materials for residential concrete slabs, post holes, and patios.',
      keywords: ['concrete slab calculator', 'bags of concrete', 'post hole footing', 'paver sand'],
    },
  },
  landscaping: {
    id: 'landscaping',
    name: 'Landscaping & Groundwork',
    slug: 'landscaping-groundwork',
    hubPath: '/projects/landscaping-groundwork',
    shortDescription: 'Estimate bulk cubic yards, retail bags, and sod pallets for yards and beds.',
    fullDescription:
      'Convert garden bed and lawn dimensions into bulk cubic yards, retail bags, and full sod pallets for mulch, gravel, sod, and topsoil.',
    iconName: 'Trees',
    accentColor: '#16a34a', // Emerald Green
    calculatorIds: [
      'mulch-calculator',
      'gravel-calculator',
      'sod-calculator',
      'topsoil-calculator',
    ],
    relatedCategoryIds: ['concrete-masonry', 'fencing-decking'],
    commonMaterials: [
      'Shredded Hardwood & Bark Mulch',
      'Crushed Stone (#57 / Pea Gravel / Base Rock)',
      'Farm-Fresh Turfgrass Sod Pallets (450 sq ft)',
      'Screened Topsoil & Enriched Garden Compost',
      'Permeable Landscape Weed Fabric',
      'Composite / Stone Garden Edging',
    ],
    planningWorkflowSteps: [
      'Measure length and width in feet, and determine target installed depth in inches.',
      'Calculate volume in cubic yards and apply settling (5-10%) or compaction buffers (10%).',
      'Compare retail bagged packaging against bulk landscape nursery dump truck delivery.',
      'Check site access, driveway clearance, wheelbarrow routes, and delivery drop zones.',
    ],
    planningQuestions: [
      {
        question: 'When is bulk delivery more cost-effective than retail bags?',
        answer:
          'For quantities greater than 2 to 3 cubic yards (27 to 40 two-cubic-foot bags), buying bulk material from a local landscape yard delivered by dump truck is usually significantly cheaper and saves handling dozens of plastic bags.',
      },
      {
        question: 'What is the difference between loose depth and compacted depth in gravel?',
        answer:
          'Loose aggregate compresses under plate tamping and vehicle loads. Planning calculators allow an extra 10% volume so that after mechanical compaction, the gravel settles to your intended depth.',
      },
      {
        question: 'How much lawn area does one pallet of sod cover?',
        answer:
          'A standard pallet of sod typically contains 450 to 500 square feet (consisting of 45 to 50 ten-square-foot rolls, or approximately 100 to 120 rectangular slabs depending on regional turf farms).',
      },
      {
        question: 'How quickly must fresh turfgrass sod be installed after delivery?',
        answer:
          'Sod is a living, perishable agricultural crop. Heat accumulates rapidly inside tightly stacked pallets. Suppliers recommend installing sod immediately upon delivery and soaking the lawn within hours.',
      },
    ],
    relatedGuideSlugs: [
      'how-to-calculate-mulch',
      'how-much-gravel-do-i-need',
      'how-to-calculate-paver-patio-materials',
      'how-much-topsoil-do-i-need',
      'how-much-sod-do-i-need',
    ],
    seo: {
      metaTitle: 'Landscaping & Groundwork Project Tools | Mulch, Gravel, Sod & Soil',
      metaDescription:
        'Estimate bulk cubic yards, retail bags, and sod pallets for mulch, driveway gravel, lawn turfgrass, and garden bed topsoil.',
      keywords: ['mulch calculator', 'gravel tonnage calculator', 'sod pallets', 'topsoil yards'],
    },
  },
  'walls-drywall': {
    id: 'walls-drywall',
    name: 'Walls & Drywall',
    slug: 'walls-drywall',
    hubPath: '/projects/walls-drywall',
    shortDescription: 'Estimate drywall sheets (4x8 and 4x12), joint compound, and fasteners.',
    fullDescription:
      'Plan sheetrock hanging for walls and ceilings with side-by-side sheet size comparisons, joint compound buckets, and tape rolls.',
    iconName: 'SquareStack',
    accentColor: '#64748b', // Slate
    calculatorIds: ['drywall-calculator'],
    relatedCategoryIds: ['painting', 'flooring'],
    commonMaterials: [
      '1/2" Standard Gypsum Wallboard (4x8 and 4x12)',
      '5/8" Fire-Code Type X Drywall (Garages & Basements)',
      'All-Purpose Ready-Mix Joint Compound (4.5-gal pails)',
      'Reinforced Paper Joint Tape (500-ft rolls)',
      'Coarse-Thread Drywall Screws 1-1/4"',
      'Galvanized Metal Corner Beads',
    ],
    planningWorkflowSteps: [
      'Calculate gross wall area from room perimeter and wall height, plus optional ceiling square footage.',
      'Deduct standard door and window openings to determine net wallboard requirement.',
      'Apply a 10% cutting scrap buffer and evaluate 4x8 panels vs 4x12 panels.',
      'Compute companion finishing supplies: compound buckets, joint tape rolls, and screw pounds.',
    ],
    planningQuestions: [
      {
        question: 'Should I buy 4x8 or 4x12 drywall sheets?',
        answer:
          '4x12 sheets reduce vertical butt joints by approximately 25%, resulting in smoother walls and faster mudding. However, 4x12 sheets weigh roughly 75 lbs and are difficult to maneuver around tight stairways and corners.',
      },
      {
        question: 'How much joint compound and tape do I need per drywall sheet?',
        answer:
          'A planning rule of thumb is approximately 0.05 gallons of joint compound per square foot (one 4.5-gallon bucket per 9 to 10 four-by-eight sheets) and 1 foot of tape per square foot of wallboard.',
      },
      {
        question: 'Should ceilings be hung before walls?',
        answer:
          'Yes. Professional drywallers always install ceiling panels first so that top wall sheets butt tightly underneath, supporting the ceiling edges and eliminating perimeter sag.',
      },
      {
        question: 'What thickness drywall is standard for residential walls?',
        answer:
          '1/2-inch drywall is standard for interior residential walls and ceilings on 16" on-center framing. Attached garage walls shared with living spaces typically require 5/8" Type X fire-rated board.',
      },
    ],
    relatedGuideSlugs: ['how-much-drywall-do-i-need'],
    seo: {
      metaTitle: 'Walls & Drywall Project Tools | Sheetrock, Mud & Tape Estimators',
      metaDescription:
        'Calculate 4x8 and 4x12 drywall sheets, joint compound buckets, screws, and seam tape with opening deductions for residential room finishing.',
      keywords: ['drywall sheet calculator', 'sheetrock calculator', 'drywall mud buckets'],
    },
  },
  'fencing-decking': {
    id: 'fencing-decking',
    name: 'Fencing & Decking',
    slug: 'fencing-decking',
    hubPath: '/projects/fencing-decking',
    shortDescription: 'Plan wood privacy fences, deck boards, joists, and structural hardware.',
    fullDescription:
      'Estimate complete multi-component material bills including posts, rails, pickets, surface decking boards, joists, and concrete.',
    iconName: 'Fence',
    accentColor: '#b45309', // Warm Wood
    calculatorIds: ['deck-material-calculator', 'fence-material-calculator'],
    relatedCategoryIds: ['concrete-masonry', 'landscaping'],
    commonMaterials: [
      'Pressure-Treated 4x4 Ground-Contact Posts',
      'Pressure-Treated 2x4 Backer Rails',
      'Cedar or Treated 1x6 Dog-Ear Privacy Pickets',
      '5/4x6 Wood or Composite Surface Decking Boards',
      '2x8 / 2x10 Pressure-Treated Floor Joists',
      'ACQ-Approved Polymer-Coated Deck Screws',
    ],
    planningWorkflowSteps: [
      'Measure total linear perimeter run for fences or rectangular length and width for decks.',
      'Configure post spacing (6 ft or 8 ft) and joist spacing (12" or 16" on center).',
      'Calculate structural members: line posts, gate posts, joists, rim boards, and backer rails.',
      'Estimate surface infill: vertical pickets or surface decking boards with scrap cut allowances.',
    ],
    planningQuestions: [
      {
        question: 'Should fence posts be spaced 6 feet or 8 feet apart?',
        answer:
          '8-foot spacing is standard for residential wood fences. 6-foot spacing is recommended in high-wind open areas or when using heavier solid privacy boards to prevent middle rail sagging.',
      },
      {
        question: 'How many horizontal rails are needed on a privacy fence?',
        answer:
          'Fences 6 feet and 8 feet tall require 3 horizontal backer rails (top, middle, bottom) to prevent vertical pickets from warping, twisting, or cupping. Fences 4 feet tall require 2 rails.',
      },
      {
        question: 'What joist spacing is needed for composite decking vs wood?',
        answer:
          'Natural wood decking supports 16-inch on-center joist spacing. Most composite and PVC decking manufacturers recommend 12-inch or 16-inch OC for straight runs, and 12-inch OC max for diagonal herringbone patterns.',
      },
      {
        question: 'What board length minimizes end-cut waste on a deck?',
        answer:
          'Choose commercial stock lengths (12 ft, 16 ft, 20 ft) that match or divide evenly into your deck dimensions. A 16-foot deck using 16-foot boards eliminates end-to-end butt joints entirely.',
      },
    ],
    relatedGuideSlugs: [
      'how-to-calculate-deck-materials',
      'how-to-calculate-fence-materials',
    ],
    seo: {
      metaTitle: 'Fencing & Decking Project Tools | Takeoffs & Lumber Estimators',
      metaDescription:
        'Calculate complete multi-component material bills for wood privacy fences, deck boards, joists, posts, pickets, and fasteners.',
      keywords: ['deck material calculator', 'fence material estimator', 'decking linear feet'],
    },
  },
  'roofing': {
    id: 'roofing',
    name: 'Roofing & Siding',
    slug: 'roofing-siding',
    hubPath: '/projects/roofing-siding',
    shortDescription: 'Estimate true roof surface area, roofing squares, shingle bundles, and underlayment.',
    fullDescription:
      'Convert ground footprint and roof slope pitch into actual roof squares, architectural shingle bundles, and roll underlayment.',
    iconName: 'Home',
    accentColor: '#e11d48', // Rose / Terracotta
    calculatorIds: ['roofing-calculator'],
    relatedCategoryIds: ['walls-drywall', 'fencing-decking'],
    commonMaterials: [
      'Architectural Laminate Shingles (3 bundles per square)',
      'Synthetic Roofing Underlayment (10-square rolls)',
      'Self-Adhering Ice & Water Shield Membrane',
      'Galvanized Drip Edge Flashing',
      '1-1/4" Coil Roofing Nails',
      'Hip & Ridge Cap Shingles',
    ],
    planningWorkflowSteps: [
      'Determine the ground footprint square footage of the building including roof overhangs.',
      'Measure roof pitch rise per 12 inches of run to determine the geometric pitch multiplier.',
      'Multiply ground footprint by pitch factor and apply complexity waste (10% to 20%).',
      'Convert total square footage into standard roofing squares (100 sq ft) and shingle bundles.',
    ],
    planningQuestions: [
      {
        question: 'What is a "roofing square"?',
        answer:
          'In roofing trade terminology, one "square" equals exactly 100 square feet of finished roof surface area. A 2,000 sq ft roof is referred to as 20 squares.',
      },
      {
        question: 'How does roof pitch change actual surface area?',
        answer:
          'As roof steepness increases, rafter length expands. A 6:12 pitch roof covers 1.118x the horizontal ground footprint; an 8:12 pitch covers 1.202x; and a steep 12:12 pitch covers 1.414x.',
      },
      {
        question: 'How many bundles of shingles make up one roofing square?',
        answer:
          'Standard architectural and 3-tab shingles are packaged at 3 bundles per roofing square (each bundle covers ~33.3 sq ft). Certain thick designer luxury shingles are packaged at 4 or 5 bundles per square.',
      },
      {
        question: 'How much waste should I add for hip and valley roofs?',
        answer:
          'Simple gable roofs require 10% waste for starter courses and rake cuts. Hip roofs with valleys, dormers, and chimney flashings require 15% to 20% waste allowance for diagonal trimming.',
      },
    ],
    relatedGuideSlugs: ['how-much-roofing-material-do-i-need'],
    seo: {
      metaTitle: 'Roofing Project Tools | Roofing Squares & Shingle Bundle Estimators',
      metaDescription:
        'Convert ground footprint and roof slope pitch into actual roof squares, architectural shingle bundles, and underlayment rolls.',
      keywords: ['roofing calculator', 'roofing squares', 'shingle bundles', 'roof pitch multiplier'],
    },
  },
};

export const ALL_CATEGORIES = Object.values(CATEGORIES);

export function getCategoryById(id: CategoryId | string): CategoryDefinition | undefined {
  return (CATEGORIES as Record<string, CategoryDefinition>)[id];
}

export function getCategoryBySlug(slug: string): CategoryDefinition | undefined {
  return ALL_CATEGORIES.find(
    (c) =>
      c.slug === slug ||
      c.id === slug ||
      c.hubPath === `/projects/${slug}` ||
      c.hubPath.endsWith(`/${slug}`)
  );
}

export function getCategoryByHubPath(path: string): CategoryDefinition | undefined {
  const normalized = path.replace(/\/$/, '');
  return ALL_CATEGORIES.find(
    (c) => c.hubPath === normalized || normalized.endsWith(`/${c.slug}`) || normalized.endsWith(`/${c.id}`)
  );
}

import React, { useState, useMemo } from 'react';
import { Container } from '../components/common/Container.tsx';
import { GUIDES } from '../data/guides.ts';
import { ALL_CALCULATORS } from '../data/calculators.ts';
import {
  Ruler,
  Layers,
  ArrowRight,
  Paintbrush,
  Trees,
  Box,
  Wrench,
  Compass,
  BookOpen,
  Clock,
  Search,
  CheckCircle2,
  PackageCheck,
  Calculator,
  ChevronRight,
  DollarSign,
  FileText,
  Hammer,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

// 8 Presentation Categories mapped to real canonical category hub paths
const PRESENTATION_CATEGORIES = [
  {
    id: 'painting',
    name: 'Painting',
    hubPath: '/projects/painting-finishes',
    toolCount: 1,
    description: 'Interior walls, ceilings, trim primer, and multi-coat spread rates.',
    themeGradient: 'from-amber-700/80 via-orange-800/80 to-stone-900',
    accentColor: '#d97706',
    icon: Paintbrush,
  },
  {
    id: 'flooring',
    name: 'Flooring',
    hubPath: '/projects/flooring',
    toolCount: 3,
    description: 'Vinyl plank, hardwood, tile, and perimeter baseboard trim molding.',
    themeGradient: 'from-amber-900/80 via-stone-800/80 to-stone-950',
    accentColor: '#b45309',
    icon: Layers,
  },
  {
    id: 'concrete',
    name: 'Concrete',
    hubPath: '/projects/concrete-masonry',
    toolCount: 2,
    description: 'Slabs, footings, post holes, and 80-lb / 60-lb pre-mixed bags.',
    themeGradient: 'from-slate-700/80 via-slate-800/80 to-slate-950',
    accentColor: '#64748b',
    icon: Box,
  },
  {
    id: 'landscaping',
    name: 'Landscaping',
    hubPath: '/projects/landscaping-groundwork',
    toolCount: 4,
    description: 'Bulk mulch, crushed gravel, sod rolls, and topsoil yardage.',
    themeGradient: 'from-emerald-800/80 via-stone-800/80 to-stone-950',
    accentColor: '#059669',
    icon: Trees,
  },
  {
    id: 'fencing',
    name: 'Fencing',
    hubPath: '/projects/fencing-decking',
    toolCount: 1,
    description: 'Privacy fence runs, post spacing, rails, and pickets.',
    themeGradient: 'from-stone-700/80 via-amber-900/70 to-stone-900',
    accentColor: '#78716c',
    icon: Wrench,
  },
  {
    id: 'decking',
    name: 'Decking',
    hubPath: '/projects/fencing-decking',
    toolCount: 1,
    description: 'Deck surface boards, 16" OC joists, stock lengths, and fasteners.',
    themeGradient: 'from-amber-800/80 via-stone-900/80 to-stone-950',
    accentColor: '#d97706',
    icon: Hammer,
  },
  {
    id: 'roofing',
    name: 'Roofing',
    hubPath: '/projects/roofing-siding',
    toolCount: 1,
    description: 'Roofing squares, 3-bundle shingle packs, and sloped pitch multipliers.',
    themeGradient: 'from-slate-800/80 via-zinc-800/80 to-stone-950',
    accentColor: '#475569',
    icon: Compass,
  },
  {
    id: 'drywall',
    name: 'Drywall',
    hubPath: '/projects/walls-drywall',
    toolCount: 1,
    description: '4x8 & 4x12 drywall sheets, joint compound buckets, and tape rolls.',
    themeGradient: 'from-stone-600/80 via-stone-700/80 to-stone-900',
    accentColor: '#57534e',
    icon: Box,
  },
];

// Showcase calculator data for split section
const SHOWCASE_CALCULATORS = [
  {
    id: 'flooring-calculator',
    name: 'Flooring Material & Carton Calculator',
    shortName: 'Flooring Material & Cartons',
    categoryName: 'Flooring',
    path: '/calculators/flooring-calculator',
    description: 'Calculate net square footage, 10% cut waste, and full commercial cartons.',
    sampleProject: {
      roomSize: '16 ft × 12 ft (192 sq ft)',
      material: 'Luxury Vinyl Plank (20 sq ft / carton)',
      waste: '10% Standard Cut Waste',
      netArea: '192.0 sq ft',
      recommendedArea: '211.2 sq ft',
      purchasedQuantity: '11 Full Cartons (220 sq ft)',
      cushion: '1 Reserve Carton for Future Repairs',
      priceDIY: '$660 – $880 ($3.00–$4.00/sq ft)',
      priceContractor: '$1,540 – $2,200 ($7.00–$10.00/sq ft installed)',
    },
  },
  {
    id: 'paint-calculator',
    name: 'Interior Paint Coverage Calculator',
    shortName: 'Interior Paint Coverage',
    categoryName: 'Painting & Finishes',
    path: '/calculators/paint-calculator',
    description: 'Determine wall & ceiling footage with window/door deductions and 2 coats.',
    sampleProject: {
      roomSize: '14 ft × 12 ft with 8 ft ceilings',
      material: 'Premium Eggshell Latex (350 sq ft / gallon)',
      waste: '2 Doors & 2 Windows Deducted',
      netArea: '344.0 sq ft paintable walls',
      recommendedArea: '688.0 sq ft (2 full coats)',
      purchasedQuantity: '2 One-Gallon Cans (700 sq ft coverage)',
      cushion: '0.5 Gallon Leftover for Touch-ups',
      priceDIY: '$90 – $130 ($45–$65/gallon)',
      priceContractor: '$550 – $850 (prep & 2 coats applied)',
    },
  },
  {
    id: 'concrete-slab-calculator',
    name: 'Concrete Slab & Pour Calculator',
    shortName: 'Concrete Slab & Pour',
    categoryName: 'Concrete & Masonry',
    path: '/calculators/concrete-slab-calculator',
    description: 'Calculate ready-mix cubic yards, 80-lb pre-mix bags, and subgrade buffers.',
    sampleProject: {
      roomSize: '10 ft × 10 ft at 4-inch depth',
      material: '4,000 PSI Ready-Mix or 80-lb Pre-Mix',
      waste: '10% Subgrade & Spillage Buffer',
      netArea: '100 sq ft surface (1.23 cu yds)',
      recommendedArea: '1.36 Cubic Yards Total',
      purchasedQuantity: '61 Bags (80-lb) or 1.5 cu yds Ready-Mix',
      cushion: '5 Bags Subgrade Variation Buffer',
      priceDIY: '$340 – $430 ($5.50–$7.00/bag)',
      priceContractor: '$900 – $1,400 (turnkey slab pour)',
    },
  },
  {
    id: 'mulch-calculator',
    name: 'Mulch Yardage & Bag Calculator',
    shortName: 'Mulch Yardage & Bags',
    categoryName: 'Landscaping & Groundwork',
    path: '/calculators/mulch-calculator',
    description: 'Estimate bulk cubic yards, 2 cu ft & 3 cu ft retail bags with settling.',
    sampleProject: {
      roomSize: '400 sq ft landscape bed at 3" depth',
      material: 'Double-Shredded Hardwood Bark',
      waste: '10% Compaction & Settling Buffer',
      netArea: '3.70 Cubic Yards Net Volume',
      recommendedArea: '4.07 Cubic Yards Recommended',
      purchasedQuantity: '55 Bags (2 cu ft) or 4.5 Bulk Yards',
      cushion: '4 Bags Seasonal Refresh Cushion',
      priceDIY: '$180 – $240 ($40–$55/cu yd bulk)',
      priceContractor: '$450 – $700 (delivered & spread)',
    },
  },
  {
    id: 'deck-material-calculator',
    name: 'Deck Board & Framing Estimator',
    shortName: 'Deck Board & Framing',
    categoryName: 'Fencing & Decking',
    path: '/calculators/deck-material-calculator',
    description: 'Estimate stock deck boards (12/16/20 ft), joists, and fastener counts.',
    sampleProject: {
      roomSize: '16 ft × 12 ft attached deck',
      material: '5/4x6 Pressure-Treated Pine (16 ft boards)',
      waste: '16" On-Center Joist Layout',
      netArea: '192.0 sq ft deck surface',
      recommendedArea: '28 Surface Boards (16 ft length)',
      purchasedQuantity: '13 Pressure-Treated 2x8 Joists',
      cushion: '1 Box (350 ct) #8 Coated Deck Screws',
      priceDIY: '$1,100 – $1,500 (materials package)',
      priceContractor: '$4,200 – $6,500 (turnkey built)',
    },
  },
  {
    id: 'roofing-calculator',
    name: 'Roofing Shingle & Bundle Calculator',
    shortName: 'Roofing Shingle & Bundles',
    categoryName: 'Roofing & Siding',
    path: '/calculators/roofing-calculator',
    description: 'Convert footprint & pitch into true sloped squares and 3-bundle packs.',
    sampleProject: {
      roomSize: '1,500 sq ft footprint with 6:12 slope pitch',
      material: 'Architectural Laminated Shingles',
      waste: '10% Ridge & Valley Cut Waste',
      netArea: '1,677.0 sq ft actual roof surface',
      recommendedArea: '18.45 Roofing Squares (1,845 sq ft)',
      purchasedQuantity: '56 Bundles (3 bundles per square)',
      cushion: '2 Rolls #30 Asphalt Felt Underlayment',
      priceDIY: '$1,900 – $2,500 (shingles & felt)',
      priceContractor: '$6,500 – $9,800 (turnkey tear-off & install)',
    },
  },
];

// 4 Coordinated Complete Project Plans
const PROJECT_PLANS = [
  {
    id: 'living-room-flooring',
    title: 'Living Room Flooring & Trim Refresh',
    category: 'Flooring & Trim',
    description:
      'Coordinate new luxury vinyl or hardwood floor planks with perimeter baseboards and shoe molding in a single unified planning estimate.',
    tools: [
      { name: 'Flooring Material Calculator', path: '/calculators/flooring-calculator' },
      { name: 'Baseboard Trim Calculator', path: '/calculators/baseboard-trim-calculator' },
    ],
    highlights: [
      'Net floor square footage + 10% cut scrap buffer',
      'Commercial full carton counts + 1 spare reserve box',
      'Linear feet of baseboard minus standard doorway openings',
      'Underlayment rolls & transition strips at threshold doors',
    ],
    primaryAction: {
      label: 'Open Flooring & Trim Plan',
      path: '/calculators/flooring-calculator',
    },
  },
  {
    id: 'backyard-patio-outdoor',
    title: 'Outdoor Living Patio & Deck Build',
    category: 'Hardscaping & Decking',
    description:
      'Plan durable hardscapes and outdoor entertaining spaces by coordinating stone pavers, gravel subbase tonnage, and timber decking.',
    tools: [
      { name: 'Paver Patio Calculator', path: '/calculators/paver-patio-calculator' },
      { name: 'Deck Board Calculator', path: '/calculators/deck-material-calculator' },
      { name: 'Mulch Calculator', path: '/calculators/mulch-calculator' },
    ],
    highlights: [
      'Interlocking paver surface units with 10% perimeter cut waste',
      'Crushed stone aggregate base depth & bedding sand tons',
      'Deck boards in 12/16/20 ft lengths + 16" OC joist layout',
      'Perimeter landscape mulch coverage in bulk cubic yards',
    ],
    primaryAction: {
      label: 'Open Patio & Deck Plan',
      path: '/calculators/paver-patio-calculator',
    },
  },
  {
    id: 'backyard-fence-post',
    title: 'Backyard Privacy Fence & Post Foundations',
    category: 'Fencing & Masonry',
    description:
      'Estimate the complete lumber package for privacy fencing alongside structural concrete foundations poured below the local frost depth.',
    tools: [
      { name: 'Fence Material Calculator', path: '/calculators/fence-material-calculator' },
      { name: 'Concrete Post Hole Calculator', path: '/calculators/concrete-post-hole-calculator' },
    ],
    highlights: [
      'Total linear run, corner posts, line posts, and gate framing',
      'Horizontal 2x4 rails & vertical dog-ear or flat-top pickets',
      'Concrete bags per hole (50-lb, 60-lb, or 80-lb pre-mix)',
      'Gate latch hardware sets & structural hinge post pairs',
    ],
    primaryAction: {
      label: 'Open Fence & Post Plan',
      path: '/calculators/fence-material-calculator',
    },
  },
  {
    id: 'room-addition-paint',
    title: 'Room Framing, Drywall & Paint Finishing',
    category: 'Interior Remodel',
    description:
      'Take an interior renovation from bare studs through hung drywall, taped seams, and finish painting without multiple store trips.',
    tools: [
      { name: 'Drywall Sheet Calculator', path: '/calculators/drywall-calculator' },
      { name: 'Paint Coverage Calculator', path: '/calculators/paint-calculator' },
    ],
    highlights: [
      '4x8 or 4x12 drywall sheets with ceiling and wall allocations',
      'Fastener counts, joint compound pails, and paper seam tape',
      'Net paintable wall footage with door & window deductions',
      'Primer gallons plus 2-coat wall and ceiling paint pails',
    ],
    primaryAction: {
      label: 'Open Drywall & Paint Plan',
      path: '/calculators/drywall-calculator',
    },
  },
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCalcId, setSelectedCalcId] = useState('flooring-calculator');

  const handleNavClick = (path: string) => {
    onNavigate(path);
  };

  // Filtered calculators for live search
  const filteredCalculators = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return ALL_CALCULATORS.filter(
      (calc) =>
        calc.name.toLowerCase().includes(q) ||
        calc.description.toLowerCase().includes(q) ||
        calc.seo?.targetKeywords?.some((kw: string) => kw.toLowerCase().includes(q)) ||
        calc.categoryId.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [searchQuery]);

  // Selected calculator for split showcase
  const activeShowcase = useMemo(() => {
    return SHOWCASE_CALCULATORS.find((c) => c.id === selectedCalcId) || SHOWCASE_CALCULATORS[0];
  }, [selectedCalcId]);

  // Curated 4 Key Guides
  const curatedGuides = useMemo(() => {
    const slugs = [
      'how-to-calculate-flooring-material',
      'how-much-paint-do-i-need',
      'how-much-concrete-do-i-need-for-a-slab',
      'how-to-calculate-deck-materials',
    ];
    return slugs.map((slug) => GUIDES[slug]).filter(Boolean);
  }, []);

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: WARM HOME-IMPROVEMENT EDITORIAL VISUAL */}
      {/* ========================================================================= */}
      <section aria-labelledby="hero-heading" className="relative bg-[#0f172a] text-white overflow-hidden">
        {/* Ambient warm residential lighting effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#1e293b]/90 to-[#0f172a]/95 z-10" />
        <div className="absolute -top-40 right-10 w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-3xl pointer-events-none z-10" />
        <div className="absolute -bottom-40 left-10 w-[500px] h-[500px] rounded-full bg-amber-600/10 blur-3xl pointer-events-none z-10" />

        <Container className="relative z-20 py-16 sm:py-20 lg:py-24">
          <div className="max-w-3xl space-y-6">
            {/* Tagline kicker */}
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-amber-400 font-semibold">
              <Ruler className="h-4 w-4" />
              <span>Residential Project Planning</span>
            </div>

            {/* Editorial Serif Headline */}
            <h1
              id="hero-heading"
              className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]"
              style={{ textWrap: 'balance' }}
            >
              Plan Your Next Home Project With <span className="text-amber-400">Confidence</span>
            </h1>

            {/* Concise Supporting Copy */}
            <p className="text-base sm:text-xl text-slate-300 leading-relaxed max-w-2xl font-sans">
              Calculate materials, estimate project costs, and understand what your project may require before you start.
            </p>

            {/* Project Search & Quick Entry Control */}
            <div className="pt-2 max-w-2xl space-y-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search calculators (e.g. flooring, tile, paint, mulch, deck, fence)..."
                  className="w-full pl-11 pr-24 py-3.5 rounded-lg bg-white text-slate-900 placeholder-slate-500 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-lg font-sans"
                  aria-label="Search project calculators"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-semibold text-slate-500 hover:text-slate-900"
                  >
                    Clear
                  </button>
                ) : (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <span className="text-xs font-mono text-slate-400 hidden sm:inline">15 Tools</span>
                  </div>
                )}

                {/* Floating Search Results Dropdown */}
                {searchQuery.trim() !== '' && (
                  <div className="absolute left-0 right-0 top-full mt-2 z-40 rounded-xl bg-white text-slate-900 p-2 shadow-2xl border border-slate-200 divide-y divide-slate-100 max-h-80 overflow-y-auto">
                    {filteredCalculators.length > 0 ? (
                      filteredCalculators.map((calc) => (
                        <a
                          key={calc.id}
                          href={`/calculators/${calc.slug}`}
                          onClick={(e) => {
                            e.preventDefault();
                            handleNavClick(`/calculators/${calc.slug}`);
                          }}
                          className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors group"
                        >
                          <div>
                            <div className="text-sm font-semibold text-slate-900 group-hover:text-amber-600">
                              {calc.name}
                            </div>
                            <div className="text-xs text-slate-500 line-clamp-1">{calc.description}</div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
                        </a>
                      ))
                    ) : (
                      <div className="p-4 text-xs text-slate-500 text-center">
                        No calculators found matching &quot;{searchQuery}&quot;. Browse categories below.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Keyword Jump Chips */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400 pt-1">
                <span className="font-mono text-[11px] text-slate-300">Quick Jump:</span>
                {[
                  { label: 'Flooring', path: '/calculators/flooring-calculator' },
                  { label: 'Tile', path: '/calculators/tile-calculator' },
                  { label: 'Paint', path: '/calculators/paint-calculator' },
                  { label: 'Concrete', path: '/calculators/concrete-slab-calculator' },
                  { label: 'Mulch', path: '/calculators/mulch-calculator' },
                  { label: 'Decking', path: '/calculators/deck-material-calculator' },
                  { label: 'Roofing', path: '/calculators/roofing-calculator' },
                  { label: 'Drywall', path: '/calculators/drywall-calculator' },
                ].map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => handleNavClick(chip.path)}
                    className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 transition-colors text-xs font-medium"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('project-categories');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    handleNavClick('/projects');
                  }
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 transition-colors shadow-md"
              >
                <span>Start a Project</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('/projects')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-white/10 text-white border border-white/20 font-semibold text-sm hover:bg-white/20 transition-colors"
              >
                <span>Browse All Calculators</span>
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 2. VALUE PROPOSITIONS: HOMEOWNER USER BENEFITS */}
      {/* ========================================================================= */}
      <section aria-labelledby="value-props-heading" className="-mt-6 sm:-mt-10 relative z-20">
        <Container>
          <h2 id="value-props-heading" className="sr-only">
            Core Planning Benefits
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2.5">
              <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200/60 text-amber-700 flex items-center justify-center shrink-0">
                <Calculator className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-slate-900">
                Accurate Calculations
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Precise material takeoffs for rooms, walls, yards, and roofs using verified measurements and realistic scrap rates.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2.5">
              <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200/60 text-amber-700 flex items-center justify-center shrink-0">
                <DollarSign className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-slate-900">
                Detailed Cost Estimates
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Clear planning cost benchmarks showing low, typical, and high ranges for DIY materials and turnkey contractor labor.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2.5">
              <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200/60 text-amber-700 flex items-center justify-center shrink-0">
                <PackageCheck className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-slate-900">
                Step-by-Step Planning
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Structured guidance from initial room dimensions to commercial retail packaging like full cartons, bags, and rolls.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2.5">
              <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200/60 text-amber-700 flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-slate-900">
                Expert Guides
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                In-depth methodology guides covering proper measurement, cutting allowances, code rules, and package rounding.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 3. CATEGORY SECTION: IMAGE-LED 8-CARD GRID */}
      {/* ========================================================================= */}
      <section id="project-categories" aria-labelledby="category-heading" className="scroll-mt-20">
        <Container>
          <div className="border-b border-slate-200 pb-4 mb-8">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600">
              Project Categories
            </span>
            <h2 id="category-heading" className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 mt-1">
              What are you working on?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              Start with your project, then use the right planning tools.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PRESENTATION_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <a
                  key={cat.id}
                  href={cat.hubPath}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(cat.hubPath);
                  }}
                  className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:border-amber-500 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  {/* Image-led photographic visual container */}
                  <div className={`h-36 sm:h-40 w-full bg-gradient-to-br ${cat.themeGradient} relative p-4 flex flex-col justify-between overflow-hidden`}>
                    {/* Subtle grid pattern overlay */}
                    <div
                      className="absolute inset-0 opacity-15"
                      style={{
                        backgroundImage: `
                          linear-gradient(to right, rgba(255, 255, 255, 0.3) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 1px, transparent 1px)
                        `,
                        backgroundSize: '20px 20px',
                      }}
                    />

                    {/* Top row: tool count badge */}
                    <div className="relative z-10 flex justify-between items-center">
                      <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded bg-black/40 text-white backdrop-blur-xs border border-white/10">
                        {cat.toolCount} {cat.toolCount === 1 ? 'Tool' : 'Tools'}
                      </span>
                      <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>

                    {/* Bottom row: category title in visual header */}
                    <div className="relative z-10">
                      <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-medium">
                        Trade Hub
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight">
                        {cat.name}
                      </h3>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono font-bold text-amber-700 group-hover:text-amber-800">
                      <span>Explore Tools</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => handleNavClick('/projects')}
              className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-slate-600 hover:text-amber-700 transition-colors"
            >
              <span>Looking for all tools? Browse the complete directory of 15 calculators</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 4. POPULAR CALCULATORS: SPLIT LAYOUT COMPOSITION */}
      {/* ========================================================================= */}
      <section id="popular-calculators" aria-labelledby="popular-heading" className="scroll-mt-20">
        <Container>
          <div className="border-b border-slate-200 pb-4 mb-8">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600">
              Interactive Tools
            </span>
            <h2 id="popular-heading" className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 mt-1">
              Popular Calculators
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              Representative worksheets demonstrating complete three-stage takeoff modeling.
            </p>
          </div>

          {/* Split Layout: Left List + Right Large Polished Calculator Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Compact List of Popular Calculator Links */}
            <div className="lg:col-span-5 space-y-2.5">
              <div className="space-y-2">
                {SHOWCASE_CALCULATORS.map((calc) => {
                  const isSelected = calc.id === selectedCalcId;
                  return (
                    <div
                      key={calc.id}
                      onClick={() => setSelectedCalcId(calc.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-1 pr-3">
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-mono uppercase tracking-wider font-semibold ${
                            isSelected ? 'text-amber-700' : 'text-slate-500'
                          }`}>
                            {calc.categoryName}
                          </span>
                        </div>
                        <h3 className={`font-serif text-base font-bold ${
                          isSelected ? 'text-amber-950' : 'text-slate-900'
                        }`}>
                          {calc.name}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {calc.description}
                        </p>
                      </div>

                      <ChevronRight className={`h-5 w-5 shrink-0 transition-transform ${
                        isSelected ? 'text-amber-600 translate-x-0.5' : 'text-slate-400 group-hover:text-slate-600'
                      }`} />
                    </div>
                  );
                })}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleNavClick('/projects')}
                  className="w-full py-3 px-4 rounded-xl border border-dashed border-slate-300 text-xs font-mono font-bold text-slate-700 hover:border-amber-500 hover:text-amber-700 hover:bg-white transition-all flex items-center justify-center gap-2"
                >
                  <span>View All 15 Calculators</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Right: Large Polished Calculator-Style Visual Showcase */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-amber-600 font-semibold">
                      Featured Live Takeoff
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                      {activeShowcase.name}
                    </h3>
                  </div>
                  <span className="text-xs font-mono px-3 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200 self-start sm:self-auto">
                    Interactive Preview
                  </span>
                </div>

                {/* Simulated Real Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-500 block">Dimensions</span>
                    <span className="font-semibold text-slate-900 block text-xs">{activeShowcase.sampleProject.roomSize}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-500 block">Material Selection</span>
                    <span className="font-semibold text-slate-900 block text-xs line-clamp-1">{activeShowcase.sampleProject.material}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-500 block">Planning Allowance</span>
                    <span className="font-semibold text-slate-900 block text-xs">{activeShowcase.sampleProject.waste}</span>
                  </div>
                </div>

                {/* 3-Stage Key Planning Deliverables Box */}
                <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-amber-800 font-bold">
                      Calculated Store Shopping Order
                    </span>
                    <span className="text-[11px] font-mono text-amber-700">Stage 03 Packaging</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="space-y-1">
                      <span className="text-xs text-slate-600 block">Purchase Quantity:</span>
                      <span className="font-serif text-lg sm:text-xl font-bold text-slate-900 block">
                        {activeShowcase.sampleProject.purchasedQuantity}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs text-slate-600 block">Recommended Cushion:</span>
                      <span className="font-serif text-base sm:text-lg font-bold text-emerald-800 block">
                        {activeShowcase.sampleProject.cushion}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-amber-200/60 flex flex-wrap items-center justify-between text-xs text-slate-600">
                    <span>Net: <strong>{activeShowcase.sampleProject.netArea}</strong></span>
                    <span>With Waste: <strong>{activeShowcase.sampleProject.recommendedArea}</strong></span>
                  </div>
                </div>

                {/* Separated Price Benchmarks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-500 block font-semibold">
                      DIY Material Range
                    </span>
                    <span className="font-serif text-sm font-bold text-slate-900 block">
                      {activeShowcase.sampleProject.priceDIY}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-500 block font-semibold">
                      Turnkey Contractor Range
                    </span>
                    <span className="font-serif text-sm font-bold text-slate-900 block">
                      {activeShowcase.sampleProject.priceContractor}
                    </span>
                  </div>
                </div>

                {/* Primary Launch Action */}
                <div className="pt-2">
                  <a
                    href={activeShowcase.path}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(activeShowcase.path);
                    }}
                    className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    <span>Launch {activeShowcase.shortName}</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 5. COMPLETE PROJECT PLANS: LIGHTER BLUEPRINT-INSPIRED VISUAL */}
      {/* ========================================================================= */}
      <section id="project-plans" aria-labelledby="plans-heading" className="scroll-mt-20 py-12 bg-slate-50 border-y border-slate-200">
        <Container>
          <div className="border-b border-slate-200 pb-4 mb-8">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600">
              Coordinated Workflows
            </span>
            <h2 id="plans-heading" className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 mt-1">
              Complete Project Plans
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              Home renovations rarely involve just one material. Use our complete multi-tool project plans to coordinate ordering across every phase of your build.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROJECT_PLANS.map((plan) => (
              <div
                key={plan.id}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-amber-500 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-amber-700 font-bold">
                      {plan.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      Coordinated Plan
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                      {plan.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  {/* Bundled Companion Tools */}
                  <div className="pt-2">
                    <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1.5 font-semibold">
                      Bundled Worksheets:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {plan.tools.map((tool) => (
                        <a
                          key={tool.name}
                          href={tool.path}
                          onClick={(e) => {
                            e.preventDefault();
                            handleNavClick(tool.path);
                          }}
                          className="text-xs font-medium px-2.5 py-1 rounded bg-slate-100 text-slate-800 hover:bg-amber-600 hover:text-white transition-colors border border-slate-200"
                        >
                          {tool.name}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Key Coordinated Deliverables */}
                  <div className="pt-3 border-t border-slate-100">
                    <span className="text-[10px] font-mono uppercase text-slate-500 block mb-2 font-semibold">
                      Coordinated Takeoffs:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {plan.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <a
                    href={plan.primaryAction.path}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(plan.primaryAction.path);
                    }}
                    className="inline-flex items-center justify-between w-full text-xs font-mono font-bold text-amber-700 group-hover:text-amber-800"
                  >
                    <span>{plan.primaryAction.label}</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 6. GUIDES SECTION: DARK EDITORIAL MOMENT */}
      {/* ========================================================================= */}
      <section id="planning-guides" aria-labelledby="guides-heading" className="scroll-mt-20 py-16 lg:py-20 bg-[#0f172a] text-white">
        <Container>
          <div className="border-b border-slate-800 pb-4 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                Editorial Knowledge Base
              </span>
              <h2 id="guides-heading" className="font-serif text-2xl sm:text-4xl font-bold text-white mt-1">
                Learn, Plan, and Do It Right
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-1">
                Field-tested methodologies covering measurement techniques, scrap factors, packaging realism, and building standards.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleNavClick('/projects')}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 hover:text-amber-300 hover:underline self-start sm:self-auto"
            >
              <span>Browse All 15 Guides</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {curatedGuides.map((guide) => (
              <div
                key={guide.slug}
                className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 hover:border-amber-400/50 transition-all flex flex-col justify-between group shadow-lg"
              >
                <div className="space-y-3">
                  {/* Clean unboxed metadata with separator */}
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="font-mono text-amber-400 font-semibold uppercase tracking-wider text-[11px]">
                      Field Guide
                    </span>
                    <span className="text-slate-600" aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400">
                      <Clock className="h-3 w-3" />
                      <span>{guide.readingTimeMinutes} min read</span>
                    </span>
                  </div>

                  <h3 className="font-serif text-base font-bold text-white group-hover:text-amber-400 transition-colors leading-snug">
                    {guide.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {guide.summary}
                  </p>

                  <div className="pt-2 text-xs border-t border-slate-800">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Companion Tool</span>
                    <span className="font-medium text-slate-200 line-clamp-1">{guide.targetCalculatorName}</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <a
                    href={`/guides/${guide.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(`/guides/${guide.slug}`);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 group-hover:text-amber-300"
                  >
                    <span>Read Guide</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 7. PLANNING FRAMEWORK & METHODOLOGY */}
      {/* ========================================================================= */}
      <section aria-labelledby="framework-heading" className="space-y-8">
        <Container>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs">
            <div className="max-w-2xl mb-8">
              <span className="font-mono text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                ESTIMATING ARCHITECTURE
              </span>
              <h2 id="framework-heading" className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-3">
                From Measurements to a Shopping List
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                Good project planning starts with measurements, not guesses. Every calculator on Home Project Tools follows our strict three-stage estimating model.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-700">STEP 01</span>
                    <Ruler className="h-4 w-4 text-slate-500" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-slate-900">
                    Measure the Project
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Input room dimensions, wall lengths, excavation depth, height, or roof slope pitch. We compute the exact mathematical geometric requirement without hidden inflations.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-mono text-slate-500">
                  Example: 192 sq ft net floor area
                </div>
              </div>

              {/* Step 2 */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-700">STEP 02</span>
                    <PackageCheck className="h-4 w-4 text-slate-500" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-slate-900">
                    Estimate the Requirement
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Apply realistic planning allowances for cutting scrap, pattern offsets, soil compaction, and subgrade variances. All allowances are stated transparently.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-mono text-slate-500">
                  Example: +10% cut waste = 211.2 sq ft
                </div>
              </div>

              {/* Step 3 */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-700">STEP 03</span>
                    <Box className="h-4 w-4 text-slate-500" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-slate-900">
                    Plan the Purchase
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Convert requirements into retail packaging: full cartons, pre-mixed bags, rolls, bundles, pallets, sticks, or bulk cubic yards. Never get caught short at the checkout register.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-mono text-slate-500">
                  Example: 11 full cartons (220 sq ft purchased)
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 leading-relaxed">
              <strong>Planning Notice:</strong> Our estimates are planning tools designed to assist in material takeoffs and project budgeting. They are not structural engineering specifications or guaranteed contractor bids. Always verify measurements on-site before ordering.
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

import React from 'react';
import { Container } from '../components/common/Container.tsx';
import { SectionHeading } from '../components/common/SectionHeading.tsx';
import { CalculatorCard } from '../components/calculator/CalculatorCard.tsx';
import { ALL_CATEGORIES } from '../data/categories.ts';
import { ALL_GUIDES } from '../data/guides.ts';
import {
  Ruler,
  Layers,
  ArrowRight,
  Paintbrush,
  Trees,
  Box,
  Wrench,
  Truck,
  ShieldCheck,
  FileSpreadsheet,
  HardHat,
  HelpCircle,
  PackageCheck,
  DollarSign,
  Compass,
  BookOpen,
  Clock,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  flooring: Layers,
  painting: Paintbrush,
  'concrete-masonry': Box,
  landscaping: Trees,
  'walls-drywall': Box,
  'fencing-decking': Wrench,
  roofing: Compass,
};

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const handleNavClick = (path: string) => {
    onNavigate(path);
  };

  // 6 Representative Popular Calculators (Section 7)
  const popularCalculators = [
    {
      id: 'flooring-calculator',
      name: 'Flooring Material & Carton Calculator',
      description: 'Calculate net square footage, waste-adjusted purchase area, and carton quantities for vinyl plank, laminate, and hardwood flooring.',
      categoryName: 'Flooring',
      outputSummary: 'Cartons to purchase, net sq ft, underlayment rolls, and spare plank cushion',
      href: '/calculators/flooring-calculator',
      ctaText: 'Estimate Flooring',
    },
    {
      id: 'paint-calculator',
      name: 'Interior Paint Coverage Calculator',
      description: 'Determine net paintable wall and ceiling footage with door/window deductions and multi-coat spread rates.',
      categoryName: 'Painting & Finishes',
      outputSummary: 'Whole 1-gallon cans, 5-gallon pail comparison, door & window deductions',
      href: '/calculators/paint-calculator',
      ctaText: 'Estimate Paint',
    },
    {
      id: 'concrete-slab-calculator',
      name: 'Concrete Slab & Pour Calculator',
      description: 'Calculate ready-mix cubic yards and 80-lb/60-lb pre-mixed bags with subgrade variance buffers.',
      categoryName: 'Concrete & Masonry',
      outputSummary: 'Ready-mix cubic yards, whole 80-lb & 60-lb pre-mix bags, subgrade buffer',
      href: '/calculators/concrete-slab-calculator',
      ctaText: 'Estimate Concrete',
    },
    {
      id: 'mulch-calculator',
      name: 'Mulch Yardage & Bag Calculator',
      description: 'Calculate bulk cubic yards and 2.0 / 3.0 cu ft retail bags with settling and compaction buffers.',
      categoryName: 'Landscaping & Groundwork',
      outputSummary: 'Delivered bulk cubic yards, 2 cu ft & 3 cu ft retail bags, settling buffer',
      href: '/calculators/mulch-calculator',
      ctaText: 'Estimate Mulch',
    },
    {
      id: 'deck-material-calculator',
      name: 'Deck Board & Framing Estimator',
      description: 'Estimate surface decking boards, stock lengths (12/16/20 ft), floor joists, on-center spacing, and fastener counts.',
      categoryName: 'Fencing & Decking',
      outputSummary: 'Stock deck boards (12/16/20 ft), floor joists, on-center spacing, and screws',
      href: '/calculators/deck-material-calculator',
      ctaText: 'Estimate Decking',
    },
    {
      id: 'roofing-calculator',
      name: 'Roofing Shingle & Bundle Calculator',
      description: 'Convert building footprint and roof slope pitch into actual surface area, roofing squares, shingle bundles, and underlayment.',
      categoryName: 'Roofing & Siding',
      outputSummary: 'True sloped pitch rafter area, roofing squares (100 sq ft), 3-bundle packs',
      href: '/calculators/roofing-calculator',
      ctaText: 'Estimate Roofing',
    },
  ];

  return (
    <div className="py-6 sm:py-10 space-y-16">
      <Container>
        {/* Section 1: Hero */}
        <section aria-labelledby="hero-heading" className="relative">
          <div className="rounded-xl border border-[#e3ded4] bg-[#ffffff] p-6 sm:p-12 lg:p-16 shadow-xs relative overflow-hidden">
            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#fcf4ee] border border-[#e3ded4] text-xs font-mono text-[#b8532b] font-semibold">
                <Ruler className="h-3.5 w-3.5" />
                <span>RESIDENTIAL ESTIMATING & MATERIAL PLANNING</span>
              </div>

              <h1
                id="hero-heading"
                className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1c1917] leading-[1.12]"
              >
                Plan Your Home Project With Fewer Guesswork Moments
              </h1>

              <p className="text-base sm:text-xl text-[#57534e] leading-relaxed max-w-2xl">
                Home Project Tools helps homeowners and DIYers estimate materials, quantities, packaging, and planning costs before buying. Measure your space, apply realistic allowances, and convert requirements into actual store shopping lists.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('project-entry');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      handleNavClick('/projects');
                    }
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded bg-[#b8532b] text-[#ffffff] font-semibold text-sm hover:bg-[#9e431f] transition-all shadow-xs"
                >
                  <span>Start a Project</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick('/projects')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded bg-[#ffffff] text-[#1c1917] border border-[#c8c1b2] font-semibold text-sm hover:bg-[#f7f5f0] transition-all shadow-xs"
                >
                  <span>Browse All Calculators</span>
                </button>
              </div>

              <div className="pt-4 border-t border-[#f1ede4] flex flex-wrap items-center gap-6 text-xs font-mono text-[#78716c]">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#15803d]"></span>
                  <span>15 Interactive Worksheets</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#b8532b]"></span>
                  <span>7 Project Trade Hubs</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0284c7]"></span>
                  <span>Separated Labor & Material Benchmarks</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Hero Project Entry ("What are you working on?") */}
        <section id="project-entry" aria-labelledby="entry-heading" className="space-y-4">
          <div className="border-b border-[#e3ded4] pb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#b8532b]">
              Project-First Navigation
            </span>
            <h2 id="entry-heading" className="font-serif text-2xl sm:text-3xl font-bold text-[#1c1917]">
              What are you working on?
            </h2>
            <p className="text-xs sm:text-sm text-[#57534e] mt-1">
              Start with your project intent rather than searching through disconnected formulas.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {ALL_CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.id] || Layers;
              return (
                <a
                  key={cat.id}
                  href={cat.hubPath}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(cat.hubPath);
                  }}
                  className="rounded-lg border border-[#e3ded4] bg-[#ffffff] p-4 sm:p-5 hover:border-[#b8532b] hover:shadow-xs transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded border border-[#e3ded4] bg-[#f7f5f0] text-[#b8532b] group-hover:border-[#b8532b] transition-colors">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#1c1917] group-hover:text-[#b8532b] transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-[11px] text-[#78716c] line-clamp-2 mt-0.5">
                        {cat.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#f1ede4] flex items-center justify-between text-xs font-mono text-[#b8532b]">
                    <span>{cat.calculatorIds.length} Tools</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </a>
              );
            })}

            {/* View All Projects Card */}
            <a
              href="/projects"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/projects');
              }}
              className="rounded-lg border border-dashed border-[#c8c1b2] bg-[#fdfbf7] p-4 sm:p-5 hover:border-[#b8532b] hover:bg-[#ffffff] transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex h-9 w-9 items-center justify-center rounded border border-[#c8c1b2] bg-[#ffffff] text-[#1c1917]">
                  <Ruler className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#1c1917] group-hover:text-[#b8532b] transition-colors">
                    All Categories & Tools
                  </h3>
                  <p className="text-[11px] text-[#78716c] mt-0.5">
                    Browse the complete directory of 15 estimating worksheets.
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-[#f1ede4] flex items-center justify-between text-xs font-mono font-bold text-[#1c1917] group-hover:text-[#b8532b]">
                <span>Browse All</span>
                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </a>
          </div>
        </section>

        {/* Section 3: Popular Project Estimators */}
        <section aria-labelledby="popular-heading" className="space-y-4">
          <div className="border-b border-[#e3ded4] pb-2 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#b8532b]">
                Featured Worksheets
              </span>
              <h2 id="popular-heading" className="font-serif text-2xl sm:text-3xl font-bold text-[#1c1917]">
                Popular Project Estimators
              </h2>
              <p className="text-xs sm:text-sm text-[#57534e] mt-1">
                Representative calculators demonstrating complete three-stage takeoff modeling.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleNavClick('/projects')}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#b8532b] hover:underline self-start sm:self-auto"
            >
              <span>View All 15 Calculators</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {popularCalculators.map((calc) => (
              <CalculatorCard
                key={calc.id}
                id={calc.id}
                name={calc.name}
                description={calc.description}
                categoryName={calc.categoryName}
                outputSummary={calc.outputSummary}
                href={calc.href}
                ctaText={calc.ctaText}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </section>

        {/* Section 4: Browse by Project Category ("Plan by Project") */}
        <section aria-labelledby="plan-by-project-heading" className="space-y-4">
          <SectionHeading
            title="Plan by Project"
            subtitle="Explore our seven residential improvement categories to find dedicated tools, material breakdowns, and planning guidelines."
            numberPrefix="CATEGORIES"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ALL_CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.id] || Layers;
              return (
                <div
                  key={cat.id}
                  className="rounded-lg border border-[#e3ded4] bg-[#ffffff] p-6 shadow-xs hover:border-[#b8532b] transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded border border-[#e3ded4] bg-[#f7f5f0] text-[#b8532b]">
                          <Icon className="h-4 w-4" />
                        </div>
                        <h3 className="font-serif text-xl font-bold text-[#1c1917] group-hover:text-[#b8532b] transition-colors">
                          {cat.name}
                        </h3>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f7f5f0] text-[#57534e] border border-[#e3ded4]">
                        {cat.calculatorIds.length} Tools
                      </span>
                    </div>

                    <p className="text-xs text-[#57534e] leading-relaxed">
                      {cat.shortDescription}
                    </p>

                    {/* Associated Tools Preview */}
                    <div className="pt-2">
                      <span className="text-[10px] font-mono uppercase text-[#78716c] block mb-1.5 font-semibold">
                        Included Worksheets:
                      </span>
                      <ul className="space-y-1">
                        {cat.calculatorIds.map((cid: string) => (
                          <li
                            key={cid}
                            className="text-xs text-[#44403c] flex items-center gap-1.5"
                          >
                            <span className="h-1 w-1 rounded-full bg-[#b8532b]"></span>
                            <span className="capitalize">{cid.replace(/-/g, ' ')}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#f1ede4]">
                    <a
                      href={cat.hubPath}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(cat.hubPath);
                      }}
                      className="inline-flex items-center justify-between w-full text-xs font-mono font-bold text-[#b8532b] group-hover:text-[#9e431f]"
                    >
                      <span>Open {cat.name} Hub</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 4B: Featured Project Planning Guides */}
        <section aria-labelledby="guides-heading" className="space-y-6">
          <SectionHeading
            title="Home Improvement Planning Guides"
            subtitle="Deep-dive field methodologies covering measurement techniques, scrap factors, and commercial package sizing."
            numberPrefix="KNOWLEDGE BASE"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ALL_GUIDES.map((guide) => (
              <div
                key={guide.slug}
                className="rounded-xl border border-[#e3ded4] bg-[#ffffff] p-6 hover:border-[#b8532b] hover:shadow-xs transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-semibold bg-[#f1ede4] text-[#44403c]">
                      <BookOpen className="h-3 w-3 text-[#b8532b]" />
                      Guide
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#78716c]">
                      <Clock className="h-3 w-3" />
                      {guide.readingTimeMinutes} min read
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#1c1917] group-hover:text-[#b8532b] transition-colors leading-snug">
                    {guide.title}
                  </h3>

                  <p className="text-xs text-[#57534e] leading-relaxed line-clamp-3">
                    {guide.summary}
                  </p>

                  <div className="pt-2 text-xs">
                    <span className="text-[10px] font-mono uppercase text-[#78716c] block">Companion Tool</span>
                    <span className="font-medium text-[#1c1917]">{guide.targetCalculatorName}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#f1ede4] flex items-center justify-between">
                  <a
                    href={`/guides/${guide.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(`/guides/${guide.slug}`);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#b8532b] group-hover:text-[#9e431f]"
                  >
                    <span>Read Planning Guide</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Three-Step Planning Framework */}
        <section aria-labelledby="framework-heading" className="space-y-6">
          <div className="rounded-xl border border-[#e3ded4] bg-[#ffffff] p-6 sm:p-10 shadow-xs">
            <div className="max-w-2xl mb-8">
              <span className="font-mono text-xs font-bold text-[#b8532b] bg-[#fcf4ee] px-2.5 py-1 rounded border border-[#e3ded4]">
                ESTIMATING ARCHITECTURE
              </span>
              <h2 id="framework-heading" className="font-serif text-2xl sm:text-3xl font-bold text-[#1c1917] mt-3">
                From Measurements to a Shopping List
              </h2>
              <p className="text-xs sm:text-sm text-[#57534e] mt-1.5 leading-relaxed">
                Good project planning starts with measurements, not guesses. Every calculator on Home Project Tools follows our strict three-stage estimating model.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="rounded-lg border border-[#e3ded4] bg-[#fdfbf7] p-5 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#b8532b]">STEP 01</span>
                    <Ruler className="h-4 w-4 text-[#78716c]" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#1c1917]">
                    Measure the Project
                  </h3>
                  <p className="text-xs text-[#57534e] leading-relaxed">
                    Input room dimensions, wall lengths, excavation depth, height, or roof slope pitch. We compute the exact mathematical geometric requirement without hidden inflations.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#e3ded4] text-[11px] font-mono text-[#78716c]">
                  Example: 192 sq ft net floor area
                </div>
              </div>

              {/* Step 2 */}
              <div className="rounded-lg border border-[#e3ded4] bg-[#fdfbf7] p-5 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#b8532b]">STEP 02</span>
                    <PackageCheck className="h-4 w-4 text-[#78716c]" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#1c1917]">
                    Estimate the Requirement
                  </h3>
                  <p className="text-xs text-[#57534e] leading-relaxed">
                    Apply realistic planning allowances for cutting scrap, pattern offsets, soil compaction, and subgrade variances. All allowances are stated transparently.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#e3ded4] text-[11px] font-mono text-[#78716c]">
                  Example: +10% cut waste = 211.2 sq ft
                </div>
              </div>

              {/* Step 3 */}
              <div className="rounded-lg border border-[#e3ded4] bg-[#fdfbf7] p-5 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#b8532b]">STEP 03</span>
                    <Box className="h-4 w-4 text-[#78716c]" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#1c1917]">
                    Plan the Purchase
                  </h3>
                  <p className="text-xs text-[#57534e] leading-relaxed">
                    Convert requirements into retail packaging: full cartons, pre-mixed bags, rolls, bundles, pallets, sticks, or bulk cubic yards. Never get caught short at the checkout register.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#e3ded4] text-[11px] font-mono text-[#78716c]">
                  Example: 11 full cartons (220 sq ft purchased)
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#f1ede4] text-xs text-[#78716c] leading-relaxed">
              <strong>Planning Notice:</strong> Our estimates are planning tools designed to assist in material takeoffs and project budgeting. They are not structural engineering specifications or guaranteed contractor bids. Always verify measurements on-site before ordering.
            </div>
          </div>
        </section>

        {/* Section 6: Cost Estimation Philosophy */}
        <section aria-labelledby="cost-heading" className="space-y-4">
          <div className="rounded-xl border border-[#e3ded4] bg-[#ffffff] p-6 sm:p-10 shadow-xs">
            <div className="max-w-3xl space-y-4">
              <span className="font-mono text-xs font-bold text-[#b8532b] bg-[#fcf4ee] px-2.5 py-1 rounded border border-[#e3ded4]">
                PRICING TRANSPARENCY
              </span>
              <h2 id="cost-heading" className="font-serif text-2xl sm:text-3xl font-bold text-[#1c1917]">
                What Does the Project Cost?
              </h2>
              <p className="text-xs sm:text-sm text-[#57534e] leading-relaxed">
                Rather than pretending to provide live retailer prices, Home Project Planner uses calibrated planning price benchmarks. Real-world costs vary significantly across residential markets. Here is how we think about project expenses:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded border border-[#e3ded4] bg-[#fdfbf7] space-y-1.5">
                  <h3 className="font-serif text-sm font-bold text-[#1c1917]">
                    Material Grades & Product Quality
                  </h3>
                  <p className="text-xs text-[#57534e] leading-relaxed">
                    Entry-level builder products differ drastically from premium designer lines. We show low, typical, and high material benchmarks so you can gauge entry-tier vs premium selections.
                  </p>
                </div>

                <div className="p-4 rounded border border-[#e3ded4] bg-[#fdfbf7] space-y-1.5">
                  <h3 className="font-serif text-sm font-bold text-[#1c1917]">
                    Regional & Supplier Variance
                  </h3>
                  <p className="text-xs text-[#57534e] leading-relaxed">
                    Lumber, ready-mix concrete, and bulk aggregates carry geographic price differences based on local mills, quarries, transportation freight, and seasonal demand.
                  </p>
                </div>

                <div className="p-4 rounded border border-[#e3ded4] bg-[#fdfbf7] space-y-1.5">
                  <h3 className="font-serif text-sm font-bold text-[#1c1917]">
                    Delivery & Minimum Drop Fees
                  </h3>
                  <p className="text-xs text-[#57534e] leading-relaxed">
                    Bulk materials (gravel, mulch, topsoil, and ready-mix concrete) frequently require separate dump truck delivery fees and short-load surcharges that must be budgeted separately.
                  </p>
                </div>

                <div className="p-4 rounded border border-[#e3ded4] bg-[#fdfbf7] space-y-1.5">
                  <h3 className="font-serif text-sm font-bold text-[#1c1917]">
                    Separated Contractor Labor
                  </h3>
                  <p className="text-xs text-[#57534e] leading-relaxed">
                    We strictly separate DIY materials-only purchase costs from full turnkey contractor installation costs so homeowners comparing DIY vs hiring a professional have clear numbers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: Methodology Section */}
        <section aria-labelledby="methodology-heading" className="space-y-4">
          <SectionHeading
            title="How Our Estimates Work"
            subtitle="We show our mathematical assumptions instead of hiding them inside a black-box calculator."
            numberPrefix="METHODOLOGY"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-lg border border-[#e3ded4] bg-[#ffffff] space-y-2">
              <span className="font-mono text-xs font-bold text-[#b8532b]">01</span>
              <h3 className="font-serif text-base font-bold text-[#1c1917]">
                Deterministic Math
              </h3>
              <p className="text-xs text-[#57534e] leading-relaxed">
                Calculations are executed through auditable formulas grounded in standard US residential construction math. No generative guessing.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-[#e3ded4] bg-[#ffffff] space-y-2">
              <span className="font-mono text-xs font-bold text-[#b8532b]">02</span>
              <h3 className="font-serif text-base font-bold text-[#1c1917]">
                Clear Scrap Factors
              </h3>
              <p className="text-xs text-[#57534e] leading-relaxed">
                Waste allowances are presented as selectable options with clear rationale: standard straight runs, diagonal layouts, or complex perimeter cuts.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-[#e3ded4] bg-[#ffffff] space-y-2">
              <span className="font-mono text-xs font-bold text-[#b8532b]">03</span>
              <h3 className="font-serif text-base font-bold text-[#1c1917]">
                Packaging Realism
              </h3>
              <p className="text-xs text-[#57534e] leading-relaxed">
                Store packaging rounding uses safe ceiling calculations so you purchase whole boxes, bags, or sticks without fractional shortages.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-[#e3ded4] bg-[#ffffff] space-y-2">
              <span className="font-mono text-xs font-bold text-[#b8532b]">04</span>
              <h3 className="font-serif text-base font-bold text-[#1c1917]">
                Visible Assumptions
              </h3>
              <p className="text-xs text-[#57534e] leading-relaxed">
                Every calculation card displays the underlying assumptions: door deductions, joist spacing, bag yields, and spread rates.
              </p>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
};

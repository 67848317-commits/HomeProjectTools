import React from 'react';
import { Container } from '../components/common/Container.tsx';
import { Breadcrumbs } from '../components/common/Breadcrumbs.tsx';
import {
  FileSpreadsheet,
  Calculator,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Box,
  Scale,
  DollarSign,
  Package,
} from 'lucide-react';

interface MethodologyPageProps {
  onNavigate: (path: string) => void;
}

export const MethodologyPage: React.FC<MethodologyPageProps> = ({ onNavigate }) => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <div className="py-8 md:py-12">
      <Container>
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'About', href: '/about' },
            { label: 'Methodology', href: '/methodology' },
          ]}
          onNavigate={onNavigate}
        />

        {/* Page Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#f1ede4] border border-[#e3ded4] text-xs font-mono text-[#78716c] uppercase tracking-wider mb-4">
            <Calculator className="h-3.5 w-3.5 text-[#b8532b]" />
            Estimating Standards & Formulas
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1c1917] tracking-tight mb-4">
            Calculation Methodology
          </h1>
          <p className="text-lg md:text-xl text-[#57534e] leading-relaxed font-serif">
            How Home Project Tools develops transparent, reproducible material estimates and planning budgets.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-10">
            {/* 1. The Three-Stage Mathematical Model */}
            <section className="bg-[#ffffff] border border-[#e3ded4] rounded-lg p-6 md:p-8 shadow-xs">
              <h2 className="font-serif text-2xl font-bold text-[#1c1917] mb-4 flex items-center gap-3">
                <Layers className="h-6 w-6 text-[#b8532b]" />
                The Three-Stage Calculation Architecture
              </h2>
              <p className="text-[#57534e] leading-relaxed mb-6">
                Most home estimating mistakes occur when cut waste and package rounding are blended into a single rough
                guess. Home Project Tools enforces a strict, three-stage separation across every calculator and guide:
              </p>

              <div className="space-y-6">
                <div className="border border-[#e3ded4] rounded-lg p-5 bg-[#faf8f5]">
                  <div className="flex items-center gap-2 mb-2 font-mono text-xs font-semibold text-[#b8532b] uppercase tracking-wider">
                    <span className="w-6 h-6 rounded-full bg-[#fcf4ee] border border-[#b8532b] flex items-center justify-center text-xs">
                      1
                    </span>
                    Stage 1: Mathematical Requirement (Net Geometry)
                  </div>
                  <p className="text-sm text-[#57534e] leading-relaxed mb-3">
                    Calculates pure physical geometry without any allowances or rounding. Depending on the material,
                    this utilizes standard formulas:
                  </p>
                  <ul className="text-xs space-y-1.5 text-[#78716c] font-mono pl-3 border-l-2 border-[#e3ded4]">
                    <li>• Surface Area: Length × Width (minus documented doorways, windows, or obstacles)</li>
                    <li>• Perimeter: 2 × (Length + Width) (minus door openings)</li>
                    <li>• Volume: Area × (Depth in Inches / 12) / 27 = Cubic Yards</li>
                    <li>• Pitch Slope: Multiplier = √(1 + (Rise / 12)²) for sloped roof planes</li>
                    <li>• Footing Cylinders: π × (Diameter / 24)² × (Depth / 12) minus post volume displacement</li>
                  </ul>
                </div>

                <div className="border border-[#e3ded4] rounded-lg p-5 bg-[#faf8f5]">
                  <div className="flex items-center gap-2 mb-2 font-mono text-xs font-semibold text-[#1c1917] uppercase tracking-wider">
                    <span className="w-6 h-6 rounded-full bg-[#f1ede4] border border-[#c8c1b2] flex items-center justify-center text-xs">
                      2
                    </span>
                    Stage 2: Planning Requirement (Physical Allowances)
                  </div>
                  <p className="text-sm text-[#57534e] leading-relaxed mb-3">
                    Applies a single, transparent jobsite adjustment to the net requirement. This allowance is never hidden
                    inside unit rates and can be adjusted based on room complexity:
                  </p>
                  <ul className="text-xs space-y-1.5 text-[#78716c] font-mono pl-3 border-l-2 border-[#e3ded4]">
                    <li>• Cut & Pattern Scrap: 5% to 15% for plank flooring, ceramic tile, drywall, or decking boards</li>
                    <li>• Base Compaction: 15% to 20% mechanical compaction factor for crushed stone & paver base</li>
                    <li>• Organic Settling: 10% to 15% natural settling for shredded hardwood mulch and loose topsoil</li>
                    <li>• Subgrade Slump Cushion: 5% to 10% safety buffer for uneven concrete subgrade excavation</li>
                  </ul>
                </div>

                <div className="border border-[#e3ded4] rounded-lg p-5 bg-[#faf8f5]">
                  <div className="flex items-center gap-2 mb-2 font-mono text-xs font-semibold text-[#2d6a4f] uppercase tracking-wider">
                    <span className="w-6 h-6 rounded-full bg-[#f2f8f5] border border-[#2d6a4f] flex items-center justify-center text-xs">
                      3
                    </span>
                    Stage 3: Commercial Purchase Quantity (Packaging Ceiling)
                  </div>
                  <p className="text-sm text-[#57534e] leading-relaxed mb-3">
                    Home improvement retailers do not sell partial cartons or half-bags. Stage 3 rounds up the planning
                    quantity to whole store packages:
                  </p>
                  <ul className="text-xs space-y-1.5 text-[#78716c] font-mono pl-3 border-l-2 border-[#e3ded4]">
                    <li>• Whole Cartons: <code>ceil(Planning Area / Carton Coverage Sq Ft)</code></li>
                    <li>• Pre-Mix Bags: <code>ceil(Required Cu Ft / Bag Yield Cu Ft)</code> (45 lbs, 50 lbs, 60 lbs, 80 lbs)</li>
                    <li>• Stock Sticks: <code>ceil(Perimeter Linear Ft / Stick Length)</code> (8ft, 12ft, 16ft moldings)</li>
                    <li>• Roofing Bundles: <code>ceil(Roof Area Sq Ft / 33.33)</code> (3 bundles per square)</li>
                    <li>• Sod Pallets: <code>ceil(Lawn Sq Ft / Pallet Coverage)</code> (typically 450 or 500 sq ft)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 2. Planning Assumptions & Source of Truth */}
            <section className="bg-[#ffffff] border border-[#e3ded4] rounded-lg p-6 md:p-8 shadow-xs">
              <h2 className="font-serif text-2xl font-bold text-[#1c1917] mb-4 flex items-center gap-3">
                <Scale className="h-6 w-6 text-[#b8532b]" />
                Planning Assumptions & Programmatic Source of Truth
              </h2>
              <div className="space-y-4 text-sm text-[#57534e] leading-relaxed">
                <p>
                  <strong>Calculation Engine as Source of Truth:</strong> Every calculation on this platform is executed by
                  isolated, deterministic TypeScript calculation engines located in <code>src/scripts/calculators/</code>.
                  Each engine is covered by automated unit tests verifying edge cases, boundary conditions, zero-input handling,
                  and exact arithmetic parity.
                </p>
                <p>
                  <strong>Companion Guide Parity:</strong> Companion guides (<code>/guides/*</code>) are authored to match
                  the calculation engines exactly. When a guide presents a worked example, the numbers are directly verified
                  against the corresponding engine function to prevent discrepancies between editorial text and interactive worksheets.
                </p>
                <p>
                  <strong>Configurable Assumptions:</strong> Assumptions such as waste percentages, gravel bulk density (e.g. 1.35
                  tons/cu yd for pea gravel vs 1.40 tons for crushed stone), bag yields (0.45 cu ft for 60-lb concrete vs 0.60 cu ft
                  for 80-lb concrete), and pallet sizes are exposed as user-adjustable parameters. They are planning benchmarks,
                  not rigid legal mandates.
                </p>
              </div>
            </section>

            {/* 3. Cost Estimation Methodology */}
            <section className="bg-[#ffffff] border border-[#e3ded4] rounded-lg p-6 md:p-8 shadow-xs">
              <h2 className="font-serif text-2xl font-bold text-[#1c1917] mb-4 flex items-center gap-3">
                <DollarSign className="h-6 w-6 text-[#2d6a4f]" />
                Cost Estimation Methodology
              </h2>
              <div className="space-y-4 text-sm text-[#57534e] leading-relaxed">
                <p>
                  Our budgeting tools use centralized planning price benchmarks modeled across three standard residential tiers:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
                  <div className="p-3 rounded bg-[#f7f5f0] border border-[#e3ded4]">
                    <div className="font-mono text-xs font-semibold text-[#1c1917] uppercase mb-1">Budget Tier</div>
                    <p className="text-xs text-[#78716c]">Standard contractor-grade products, economical DIY options, and basic finishes.</p>
                  </div>
                  <div className="p-3 rounded bg-[#f7f5f0] border border-[#e3ded4]">
                    <div className="font-mono text-xs font-semibold text-[#b8532b] uppercase mb-1">Mid-Range / Standard</div>
                    <p className="text-xs text-[#78716c]">Most popular residential consumer selections with balanced durability and aesthetic value.</p>
                  </div>
                  <div className="p-3 rounded bg-[#f7f5f0] border border-[#e3ded4]">
                    <div className="font-mono text-xs font-semibold text-[#1c1917] uppercase mb-1">Premium Tier</div>
                    <p className="text-xs text-[#78716c]">High-spec architectural materials, designer lines, exotic hardwoods, or commercial-grade formulas.</p>
                  </div>
                </div>
                <p>
                  <strong>Independent Labor Modeling:</strong> Where labor estimates are provided, material purchase costs
                  and professional trade installation rates are modeled independently. We never bundle labor into raw material
                  unit costs, ensuring DIYers can see exactly what they will pay at the store checkout counter.
                </p>
                <p>
                  <strong>Planning Benchmarks, Not Live Store Prices:</strong> Prices displayed are national planning benchmarks
                  and do not represent real-time inventory feeds from specific retailers. Actual prices will vary based on
                  local sales tax, delivery charges, regional demand, fuel surcharges, and current supplier promotions.
                </p>
              </div>
            </section>

            {/* 4. Accuracy Philosophy */}
            <section className="bg-[#ffffff] border border-[#e3ded4] rounded-lg p-6 md:p-8 shadow-xs">
              <h2 className="font-serif text-2xl font-bold text-[#1c1917] mb-4 flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-[#b8532b]" />
                Accuracy Philosophy & Avoiding False Precision
              </h2>
              <div className="space-y-4 text-sm text-[#57534e] leading-relaxed">
                <p>
                  In construction and residential remodeling, false precision is dangerous. Reporting that a deck requires
                  "14.37 boards" or a slab requires "3.129 bags of cement" obscures the reality of physical jobsites.
                </p>
                <p>
                  Our calculators deliberately pair net geometric answers with practical commercial recommendations:
                </p>
                <ul className="list-disc list-inside space-y-2 pl-2 text-[#57534e]">
                  <li>We round up to full commercial packages so you never run out mid-installation.</li>
                  <li>We recommend retaining a cushion or spare carton for future tile or plank repairs from the same dye lot.</li>
                  <li>We invite users to test scenarios by toggling waste percentages and stock lengths to see cost implications immediately.</li>
                </ul>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Practical Example Reference */}
            <div className="bg-[#ffffff] border border-[#e3ded4] rounded-lg p-6 shadow-xs">
              <h3 className="font-serif text-lg font-bold text-[#1c1917] mb-3">
                Sample Calculations
              </h3>
              <p className="text-xs text-[#57534e] mb-4 leading-relaxed">
                See our three-stage estimating model in action across real-world home improvement worksheets:
              </p>
              <div className="space-y-2.5">
                <a
                  href="/calculators/flooring-calculator"
                  onClick={(e) => handleNavClick(e, '/calculators/flooring-calculator')}
                  className="block p-3 rounded bg-[#f7f5f0] border border-[#e3ded4] hover:border-[#b8532b] transition-colors"
                >
                  <div className="text-xs font-semibold text-[#1c1917] mb-1">Flooring Calculator</div>
                  <div className="text-[11px] text-[#78716c]">Net sq ft → 10% cut scrap → whole cartons + cushion</div>
                </a>
                <a
                  href="/calculators/concrete-slab-calculator"
                  onClick={(e) => handleNavClick(e, '/calculators/concrete-slab-calculator')}
                  className="block p-3 rounded bg-[#f7f5f0] border border-[#e3ded4] hover:border-[#b8532b] transition-colors"
                >
                  <div className="text-xs font-semibold text-[#1c1917] mb-1">Concrete Slab Calculator</div>
                  <div className="text-[11px] text-[#78716c]">Cubic volume → subgrade buffer → 60-lb/80-lb pre-mix bags</div>
                </a>
                <a
                  href="/calculators/baseboard-trim-calculator"
                  onClick={(e) => handleNavClick(e, '/calculators/baseboard-trim-calculator')}
                  className="block p-3 rounded bg-[#f7f5f0] border border-[#e3ded4] hover:border-[#b8532b] transition-colors"
                >
                  <div className="text-xs font-semibold text-[#1c1917] mb-1">Baseboard & Trim Calculator</div>
                  <div className="text-[11px] text-[#78716c]">Perimeter minus doors → 15% miter allowance → 8ft/12ft/16ft sticks</div>
                </a>
              </div>
            </div>

            {/* Verification Link Card */}
            <div className="bg-[#f1ede4] border border-[#e3ded4] rounded-lg p-6">
              <h3 className="font-serif text-base font-bold text-[#1c1917] mb-2">
                Have Feedback on Our Math?
              </h3>
              <p className="text-xs text-[#57534e] mb-4 leading-relaxed">
                We actively review our formulas, coverage rates, and package sizing against current manufacturer specifications.
              </p>
              <a
                href="/contact"
                onClick={(e) => handleNavClick(e, '/contact')}
                className="w-full flex items-center justify-between px-3 py-2 rounded bg-[#ffffff] border border-[#e3ded4] text-xs font-medium text-[#1c1917] hover:border-[#b8532b] transition-colors"
              >
                <span>Report Errata or Suggestions</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#78716c]" />
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

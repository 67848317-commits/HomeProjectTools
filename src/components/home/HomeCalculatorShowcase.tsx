import React, { useState, useMemo } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';

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

export const HomeCalculatorShowcase: React.FC = () => {
  const [selectedCalcId, setSelectedCalcId] = useState('flooring-calculator');

  const activeShowcase = useMemo(() => {
    return SHOWCASE_CALCULATORS.find((c) => c.id === selectedCalcId) || SHOWCASE_CALCULATORS[0];
  }, [selectedCalcId]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left: Compact List of Popular Calculator Links */}
      <div className="lg:col-span-5 space-y-2.5">
        <div className="space-y-2">
          {SHOWCASE_CALCULATORS.map((calc) => {
            const isSelected = calc.id === selectedCalcId;
            return (
              <button
                key={calc.id}
                type="button"
                onClick={() => setSelectedCalcId(calc.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="space-y-1 pr-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-mono uppercase tracking-wider font-semibold ${
                        isSelected ? 'text-amber-700' : 'text-slate-500'
                      }`}
                    >
                      {calc.categoryName}
                    </span>
                  </div>
                  <h3
                    className={`font-serif text-base font-bold ${
                      isSelected ? 'text-amber-950' : 'text-slate-900'
                    }`}
                  >
                    {calc.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{calc.description}</p>
                </div>

                <ChevronRight
                  className={`h-5 w-5 shrink-0 transition-transform ${
                    isSelected ? 'text-amber-600 translate-x-0.5' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
              </button>
            );
          })}
        </div>

        <div className="pt-2">
          <a
            href="/projects"
            className="w-full py-3 px-4 rounded-xl border border-dashed border-slate-300 text-xs font-mono font-bold text-slate-700 hover:border-amber-500 hover:text-amber-700 hover:bg-white transition-all flex items-center justify-center gap-2"
          >
            <span>View All 15 Calculators</span>
            <ArrowRight className="h-4 w-4" />
          </a>
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
              <span className="font-semibold text-slate-900 block text-xs">
                {activeShowcase.sampleProject.roomSize}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Material Selection</span>
              <span className="font-semibold text-slate-900 block text-xs line-clamp-1">
                {activeShowcase.sampleProject.material}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Planning Allowance</span>
              <span className="font-semibold text-slate-900 block text-xs">
                {activeShowcase.sampleProject.waste}
              </span>
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
              <span>
                Net: <strong>{activeShowcase.sampleProject.netArea}</strong>
              </span>
              <span>
                With Waste: <strong>{activeShowcase.sampleProject.recommendedArea}</strong>
              </span>
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
              className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors shadow-sm"
            >
              <span>Launch {activeShowcase.shortName}</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

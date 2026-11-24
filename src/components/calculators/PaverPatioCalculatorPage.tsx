import React, { useState, useMemo } from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs.tsx';
import { Container } from '../../components/common/Container.tsx';
import { CalculatorHeader } from '../../components/calculator/CalculatorHeader.tsx';
import { CalculatorInput } from '../../components/calculator/CalculatorInput.tsx';
import { CalculatorSelect } from '../../components/calculator/CalculatorSelect.tsx';
import { WasteSelector } from '../../components/calculator/WasteSelector.tsx';
import { ResultMetric } from '../../components/calculator/ResultMetric.tsx';
import { BillOfMaterialsTable } from '../../components/calculator/BillOfMaterialsTable.tsx';
import { CostEstimateCard } from '../../components/calculator/CostEstimateCard.tsx';
import { CalculationExplanation, type CalculationStep } from '../../components/calculator/CalculationExplanation.tsx';
import { AssumptionsList } from '../../components/calculator/AssumptionsList.tsx';
import { PracticalTips, type PracticalTipItem } from '../../components/calculator/PracticalTips.tsx';
import { RelatedTools } from '../../components/calculator/RelatedTools.tsx';
import { CalculatorTrackerWrapper } from '../calculator/CalculatorTrackerWrapper.tsx';

import { calculatePaverPatio } from '../../scripts/calculators/paverPatio.ts';
import { CALCULATORS } from '../../data/calculators.ts';
import { CATEGORIES } from '../../data/categories.ts';
import {
  RotateCcw,
  SlidersHorizontal,
  Layers,
  HelpCircle,
  AlertTriangle,
  Compass,
  CheckCircle2,
  ShieldAlert,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

interface PaverPatioCalculatorPageProps {
  onNavigate?: (path: string) => void;
}

export const PaverPatioCalculatorPage: React.FC<PaverPatioCalculatorPageProps> = ({ onNavigate }) => {
  const metadata = CALCULATORS['paver-patio-calculator'];
  const category = CATEGORIES['concrete-masonry'];

  // Form State
  const [patioLength, setPatioLength] = useState<number>(15);
  const [patioWidth, setPatioWidth] = useState<number>(12);
  const [paverLengthInches, setPaverLengthInches] = useState<number>(8);
  const [paverWidthInches, setPaverWidthInches] = useState<number>(4);
  const [baseDepthInches, setBaseDepthInches] = useState<number>(4);
  const [wastePercentage, setWastePercentage] = useState<number>(10);

  // Live calculation
  const calculationResult = useMemo(() => {
    return calculatePaverPatio({
      patioLength,
      patioWidth,
      paverLengthInches,
      paverWidthInches,
      baseDepthInches,
      wastePercentage,
    });
  }, [patioLength, patioWidth, paverLengthInches, paverWidthInches, baseDepthInches, wastePercentage]);

  const handleReset = () => {
    setPatioLength(15);
    setPatioWidth(12);
    setPaverLengthInches(8);
    setPaverWidthInches(4);
    setBaseDepthInches(4);
    setWastePercentage(10);
  };

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: category?.name ?? 'Concrete & Masonry', href: category?.hubPath ?? '/projects/concrete-masonry' },
    { label: metadata?.name ?? 'Paver Patio & Sand Calculator' },
  ];

  const explanationSteps: CalculationStep[] = useMemo(() => {
    if (!calculationResult.success) return [];
    const out = calculationResult.outputs;

    return [
      {
        stepNumber: 1,
        title: 'Compute Patio Surface Area & Paver Units',
        description:
          'Multiply patio length by width to obtain net square footage. Divide by the area of an individual paver and apply the cutting waste allowance to pavers only. Paver material cost is estimated on the purchased paver square footage.',
        formulaDisplay: (
          <span>
            {patioLength}&apos; × {patioWidth}&apos; = <strong>{out.patioAreaSqFt} sq ft</strong> • Pavers:{' '}
            {out.patioAreaSqFt} sq ft ÷ {out.singlePaverSqFt.toFixed(4)} sq ft/unit = {out.exactPaversNeeded} net × (1 + {wastePercentage / 100}) ={' '}
            {out.recommendedPaversWithWaste} →{' '}
            <strong className="text-[#b8532b]">
              {out.recommendedPaversToPurchase} pavers ({out.purchasedPaverSqFt} sq ft ordered)
            </strong>
          </span>
        ),
      },
      {
        stepNumber: 2,
        title: 'Calculate Crushed Aggregate Base Tonnage (Finished Compacted Depth + 6" Extension)',
        description:
          'Per Interlocking Concrete Pavement Institute (ICPI) practice, the aggregate base extends 6 inches past the paver perimeter on all four sides to support edge restraints. Base depth is the target finished compacted thickness, and volume is converted using a provisional 1.55 tons/yd³ in-place compacted weight-per-volume assumption for dense-graded crusher run (not a universal conversion across aggregates; quarry gradation, moisture, and certified scale weights vary). Base cost uses the site\'s #57 crushed stone ton benchmark as an approximate substitute/reference benchmark.',
        formulaDisplay: (
          <span>
            ({patioLength} + 1)&apos; × ({patioWidth} + 1)&apos; × ({baseDepthInches}&quot; ÷ 12) ={' '}
            {out.baseVolumeCuFt} cu ft ({out.baseVolumeCuYds} yd³) × ~{out.gravelDensityTonsPerCuYd} tons/yd³ (provisional) ={' '}
            {out.gravelBaseTons} net tons →{' '}
            <strong className="text-[#b8532b]">{out.gravelBasePurchaseTons} whole tons ordered</strong>
          </span>
        ),
      },
      {
        stepNumber: 3,
        title: 'Bedding Sand Screed Layer (Net Patio Area Only)',
        description:
          'A uniform 1-inch layer of uncompacted coarse concrete sand (ASTM C33) is screeded strictly across the net patio surface—without the 6-inch perimeter extension or paver cutting waste—then rounded up to 0.1 yd³ planning increments.',
        formulaDisplay: (
          <span>
            {patioLength}&apos; × {patioWidth}&apos; × (1&quot; ÷ 12) = {out.beddingSandCubicFt} cu ft ÷ 27 ={' '}
            {out.beddingSandCubicYards} net yd³ →{' '}
            <strong className="text-[#b8532b]">{out.beddingSandPurchaseCubicYards} yd³ planning order</strong>
          </span>
        ),
      },
      {
        stepNumber: 4,
        title: 'Provisional Polymeric Jointing Sand Allowance',
        description:
          'Uses a provisional ~70 sq ft per 50-lb bag planning assumption (midpoint of an illustrative ~60–80 sq ft range for standard ~4"×8" pavers; broader illustrative ranges across styles span ~25–100 sq ft/bag). These are illustrative planning ranges, not universal manufacturer specifications—actual yield depends on paver thickness, joint width, joint depth, bevel geometry, and product-specific Technical Data Sheet (TDS) coverage charts.',
        formulaDisplay: (
          <span>
            {out.patioAreaSqFt} sq ft ÷ ~{out.polymericSandCoverageSqFtPerBag} sq ft/bag (provisional) ={' '}
            {out.polymericSandExactBags} bags →{' '}
            <strong className="text-[#b8532b]">{out.polymericSand50lbBags} bags (50-lb polymeric sand)</strong>
          </span>
        ),
      },
    ];
  }, [calculationResult, patioLength, patioWidth, baseDepthInches, wastePercentage]);

  const practicalTips: PracticalTipItem[] = [
    {
      title: 'Extend Base 6 Inches Beyond Paver Perimeter',
      desc: 'Never dig a hole the exact size of your patio. ICPI guidelines recommend extending the crushed stone base 6 inches past all exposed paver edges to anchor snap-edge plastic restraints into solid compacted rock rather than loose topsoil.',
      icon: Layers,
    },
    {
      title: 'Do Not Compact Bedding Sand Before Laying',
      desc: 'Bedding sand must be screeded flat and left loose. Pavers are set directly onto the uncompacted sand and then vibrated into the sand bed with a mechanical plate compactor from the top surface.',
      icon: Compass,
    },
    {
      title: 'Slope 1/4 Inch per Foot for Surface Drainage',
      desc: 'Always pitch the patio away from the house foundation with a gentle 1% to 2% slope (approx 1/8" to 1/4" per linear foot) to shed rainwater into turf or rain gardens.',
      icon: CheckCircle2,
    },
    {
      title: 'Apply Polymeric Sand on Completely Dry Pavers',
      desc: 'Polymeric sand contains heat- and moisture-activated bonding polymers. If pavers are damp from rain or morning dew, the polymer will activate instantly on the paver surface and create a hazy, difficult-to-remove residue.',
      icon: ShieldAlert,
    },
  ];

  return (
    <div className="py-6 sm:py-10">
      <Container>
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />

        {/* Page Header */}
        <CalculatorHeader
          title={metadata?.name ?? 'Paver Patio & Sand Calculator'}
          categoryName={category?.name ?? 'Masonry & Structural'}
          description="Calculate concrete pavers, crushed aggregate base rock, coarse bedding sand, and polymeric joint sand across multi-layer patio cross-sections."
          targetIntent={metadata?.targetIntent}
        />

        {/* Planning Disclaimer Notice */}
        <div className="mb-8 rounded-lg border border-[#e3ded4] bg-[#faf8f5] p-4 flex items-start gap-3 text-xs text-[#57534e]">
          <HelpCircle className="h-5 w-5 text-[#b8532b] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-[#1c1917] font-semibold">Planning Estimate &amp; Scope Notice (Selected Base: {baseDepthInches} in finished compacted):</strong> This tool provides a residential pedestrian patio planning estimate using provisional assumptions (1.55 tons/yd³ in-place compacted dense-grade aggregate; ~70 sq ft/bag polymeric sand) and uses the site&apos;s Crushed Stone / #57 Gravel per-ton entry ($35–$75/ton) as an approximate substitute/reference benchmark for dense-grade base cost (not a quarry-verified quote). Actual quantities and pricing vary with subgrade soil, freeze-thaw depth, quarry gradation/moisture, paver thickness, joint width, bevel geometry, and supplier minimums. Edge restraints, spikes, geotextile fabric, and delivery fees are excluded.
          </div>
        </div>

        {/* Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* LEFT COLUMN: Inputs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-lg border border-[#e3ded4] bg-[#ffffff] p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#e3ded4] pb-3 mb-5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-[#f7f5f0] border border-[#e3ded4] text-[#b8532b]">
                    <SlidersHorizontal className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#1c1917]">
                      Patio Dimensions & Paver Size
                    </h2>
                    <span className="text-[11px] text-[#78716c]">
                      Length, width, paver unit & base thickness
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1 text-xs font-mono text-[#78716c] hover:text-[#b8532b] transition-colors"
                  title="Reset to default values"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              <div className="space-y-5">
                {/* 1. Patio Dimensions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CalculatorInput
                    id="patio-length"
                    label="Patio Length"
                    value={patioLength}
                    onChange={setPatioLength}
                    unit="ft"
                    min={2}
                    max={200}
                    step={0.5}
                    required
                    error={patioLength <= 0 ? 'Length must be > 0' : undefined}
                  />

                  <CalculatorInput
                    id="patio-width"
                    label="Patio Width"
                    value={patioWidth}
                    onChange={setPatioWidth}
                    unit="ft"
                    min={2}
                    max={200}
                    step={0.5}
                    required
                    error={patioWidth <= 0 ? 'Width must be > 0' : undefined}
                  />
                </div>

                {/* 2. Individual Paver Dimensions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CalculatorInput
                    id="paver-length"
                    label="Single Paver Length"
                    value={paverLengthInches}
                    onChange={setPaverLengthInches}
                    unit="in"
                    min={3}
                    max={36}
                    step={0.5}
                    required
                    error={paverLengthInches <= 0 ? 'Paver length must be > 0' : undefined}
                  />

                  <CalculatorInput
                    id="paver-width"
                    label="Single Paver Width"
                    value={paverWidthInches}
                    onChange={setPaverWidthInches}
                    unit="in"
                    min={3}
                    max={36}
                    step={0.5}
                    required
                    error={paverWidthInches <= 0 ? 'Paver width must be > 0' : undefined}
                  />
                </div>

                {/* 3. Base Depth Selector */}
                <div className="space-y-1.5">
                  <CalculatorSelect
                    id="base-depth"
                    label="Finished Compacted Base Depth"
                    value={baseDepthInches.toString()}
                    onChange={(val) => setBaseDepthInches(Number(val))}
                    options={[
                      { label: '4 Inches Compacted (Planning Benchmark: Pedestrian Patio)', value: '4' },
                      { label: '6 Inches Compacted (Cold Climates, Heavy Clay Soil, or Soft Subgrade)', value: '6' },
                    ]}
                  />
                  <span className="text-[11px] text-[#78716c] leading-relaxed block">
                    Base depth is the target finished compacted thickness (4&quot; standard pedestrian benchmark; 6&quot; in freeze-thaw zones or wet clay). Tonnage uses a provisional 1.55 tons/yd³ in-place compacted assumption for dense-grade crusher run (not universal across aggregates; confirm gradation, moisture, and quarry scale weights locally).
                  </span>
                </div>

                {/* 4. Waste Factor */}
                <WasteSelector
                  value={wastePercentage}
                  onChange={setWastePercentage}
                  options={metadata.wasteOptions}
                  title="Paver Cutting & Pattern Waste Allowance"
                  customLabel="Allowance"
                  principleNote="Applies strictly to concrete pavers for border cuts and pattern alignment (10% straight rectangular; 15% herringbone or curves). Does not inflate gravel base, bedding sand, or polymeric sand."
                />
              </div>
            </div>

            {/* Layered Cross-Section Visualizer Card */}
            <div className="rounded-lg border border-[#e3ded4] bg-[#faf8f5] p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#b8532b]" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#1c1917]">
                  Patio Layer Construction Guide
                </h3>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded bg-[#ffffff] border border-[#e3ded4] flex items-center justify-between">
                  <span className="font-semibold text-[#1c1917]">Layer 1: Concrete Pavers</span>
                  <span className="font-mono text-[#b8532b]">{paverLengthInches}&quot; × {paverWidthInches}&quot; units</span>
                </div>
                <div className="p-2 rounded bg-[#ffffff] border border-[#e3ded4] flex items-center justify-between">
                  <span className="font-semibold text-[#1c1917]">Layer 2: Bedding Sand</span>
                  <span className="font-mono text-[#78716c]">1.0&quot; uncompacted screed sand</span>
                </div>
                <div className="p-2 rounded bg-[#ffffff] border border-[#e3ded4] flex items-center justify-between">
                  <span className="font-semibold text-[#1c1917]">Layer 3: Aggregate Base</span>
                  <span className="font-mono text-[#78716c]">{baseDepthInches}&quot; finished compacted</span>
                </div>
                <div className="p-2 rounded bg-[#ffffff] border border-[#e3ded4] flex items-center justify-between">
                  <span className="font-semibold text-[#1c1917]">Layer 4: Joint Sand</span>
                  <span className="font-mono text-[#78716c]">Polymeric lock sand</span>
                </div>
              </div>
              <p className="text-[11px] text-[#78716c] leading-relaxed">
                Illustrative layered model. Actual subgrade excavation depth and stabilization depend on local soil bearing capacity.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Results Takeoff */}
          <div className="lg:col-span-7 space-y-6" aria-live="polite">
            {calculationResult.success ? (
              (() => {
                const out = calculationResult.outputs;

                return (
                  <>
                    {/* PRIMARY RESULTS GRID */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <ResultMetric
                          label="Pavers to Buy"
                          value={out.recommendedPaversToPurchase}
                          unit="pavers"
                          subtext={`${out.purchasedPaverSqFt} sq ft (inc. ${wastePercentage}% waste)`}
                          variant="primary"
                        />
                        <ResultMetric
                          label="Gravel Base"
                          value={out.gravelBaseTons}
                          unit="tons net"
                          subtext={`${baseDepthInches}" compacted (Order ${out.gravelBasePurchaseTons} t)`}
                          variant="primary"
                        />
                        <ResultMetric
                          label="Bedding Sand"
                          value={out.beddingSandCubicYards}
                          unit="cu yds net"
                          subtext={`1" screed (Order ${out.beddingSandPurchaseCubicYards} yd³)`}
                          variant="primary"
                        />
                        <ResultMetric
                          label="Polymeric Sand"
                          value={out.polymericSand50lbBags}
                          unit="bags"
                          subtext={`Provisional (~70 sq ft/bag)`}
                          variant="primary"
                        />
                      </div>

                      {/* Area Scope Header */}
                      <div className="rounded bg-[#f7f5f0] p-3.5 border border-[#e3ded4] text-xs text-[#57534e] space-y-1.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <div>
                            <strong className="text-[#1c1917]">Finished Patio Surface:</strong> {out.patioAreaSqFt} sq ft ({patioLength}&apos; × {patioWidth}&apos;)
                            <span className="text-[11px] text-[#78716c] block sm:inline sm:ml-1.5">— used for paver counts, bedding sand &amp; joint sand</span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-1 border-t border-[#e8e4dc]">
                          <div>
                            <strong className="text-[#1c1917]">Excavation &amp; Base Footprint:</strong> {out.baseExcavationAreaSqFt} sq ft ({patioLength + 1}&apos; × {patioWidth + 1}&apos;)
                            <span className="text-[11px] text-[#78716c] block sm:inline sm:ml-1.5">— includes 6&quot; perimeter extension on all sides for edge restraint stability</span>
                          </div>
                          <span className="font-mono font-bold text-[#b8532b] text-[11px]">
                            {baseDepthInches}&quot; Compacted Depth
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* MATERIAL BILL OF MATERIALS */}
                    <div className="space-y-2">
                      <BillOfMaterialsTable items={calculationResult.billOfMaterials} />
                      <p className="text-[11px] font-mono text-[#78716c] px-1">
                        * Planning purchase orders round pavers to individual units, gravel base to whole tons, bedding sand to 0.1 yd³ increments, and polymeric sand to 50-lb bags. Local suppliers may enforce pallet minimums (100–120 sq ft/pallet), 1–3 ton or 0.5–1.0 yd³ bulk minimums, and delivery fees. Edge restraints, spikes, and geotextile fabric are excluded.
                      </p>
                    </div>

                    {/* COST ESTIMATE */}
                    <CostEstimateCard costEstimate={calculationResult.costEstimate} />
                  </>
                );
              })()
            ) : (
              /* Validation Error */
              <div className="rounded-lg border-2 border-[#b8532b] bg-[#fcf4ee] p-6 text-center space-y-3">
                <AlertTriangle className="h-8 w-8 text-[#b8532b] mx-auto" />
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-[#b8532b]">
                  Input Validation Error
                </h3>
                <p className="text-xs text-[#57534e] max-w-md mx-auto">
                  {calculationResult.errors[0]?.message ?? 'Please check your inputs and ensure patio dimensions are positive numbers.'}
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#b8532b] text-[#ffffff] font-mono text-xs font-bold hover:bg-[#9e431f] transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset to Standard Defaults</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Informational Sections */}
        {calculationResult.success && (
          <div className="space-y-10 border-t border-[#e3ded4] pt-10">
            {/* Step-by-Step Explanation */}
            <CalculationExplanation
              title="Mathematical Breakdown: How Paver Patio Materials are Calculated"
              subtitle="Surface Area to Pavers, Compacted Base Tonnage & Sand Layers"
              steps={explanationSteps}
            />

            {/* Assumptions & Boundaries */}
            <AssumptionsList
              assumptions={calculationResult.assumptions}
              notices={calculationResult.notices}
              limitations={[
                'Aggregate Price Benchmark Substitution: Dense-grade crusher-run base cost is estimated using the Crushed Stone / #57 Gravel benchmark ($35–$75/ton, ~1.4 tons/yd³) as an approximate substitute/reference benchmark rather than a quarry-verified crusher-run price.',
                'Finished Compacted Base & Provisional 1.55 tons/yd³ Factor: Base depth is target finished compacted thickness, and 1.55 tons/yd³ is a provisional in-place compacted weight-per-volume assumption—not a universal aggregate conversion. Quarry gradation, moisture, and actual scale weights change delivered tonnage.',
                'Polymeric Sand Illustrative Coverage: The ~70 sq ft/bag benchmark (illustrative ~60–80 sq ft for 4"×8" pavers; ~25–100 sq ft/bag across styles) is a provisional planning range, not a universal manufacturer specification. Confirm yield with your product\'s Technical Data Sheet (TDS) for actual paver thickness, joint width, joint depth, and bevel geometry.',
                'Supplier Minimums, Pallet Packaging & Excluded Accessories: Gravel rounds to whole tons and bedding sand to 0.1 yd³ for planning, while suppliers often enforce 1–3 ton or 0.5–1.0 yd³ minimums, delivery fees, and pallet fees. Soil excavation/disposal (typically 7"–9" total depth), plate compactor rental, snap-edge restraints, 10" steel spikes, and geotextile fabric are excluded.',
              ]}
              scopeTitle="Planning Scope, Benchmark Substitutions & Disclaimers"
            />

            {/* Comprehensive Editorial Planning Guide */}
            <div className="p-5 sm:p-6 rounded-lg bg-[#f7f5f0] border border-[#e3ded4] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-md bg-white border border-[#e3ded4] text-[#b8532b] shrink-0">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#b8532b]">
                    Project Planning Guide
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#1c1917] mt-0.5">
                    How to Calculate Paver Patio Materials: Pavers, Base Rock, Sand, and Edge Restraints
                  </h3>
                  <p className="text-xs sm:text-sm text-[#57534e] mt-1 max-w-xl leading-relaxed">
                    Estimate pavers with cut waste, calculate dense-graded aggregate base depth with 6-inch perimeter overrun, bedding coarse sand, and polymeric joint sand.
                  </p>
                </div>
              </div>
              <a
                href="/guides/how-to-calculate-paver-patio-materials"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded text-xs font-mono font-semibold bg-[#b8532b] text-white hover:bg-[#a04422] transition-colors shrink-0 shadow-xs"
              >
                <span>Read Planning Guide</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Practical Tips */}
            <PracticalTips
              title="Practical Field Tips for Building Paver Patios"
              subtitle="ICPI Certified Installation Guidelines"
              tips={practicalTips}
            />

            {/* Related Tools */}
            <RelatedTools currentCalculatorId="paver-patio-calculator" onNavigate={onNavigate} />
          </div>
        )}
      </Container>
    </div>
  );
};

export const PaverPatioCalculatorIsland: React.FC = () => {
  const meta = CALCULATORS['paver-patio-calculator'];
  return (
    <CalculatorTrackerWrapper
      calculatorSlug="paver-patio-calculator"
      calculatorName={meta.name}
      projectCategory={meta.categoryId}
    >
      <PaverPatioCalculatorPage />
    </CalculatorTrackerWrapper>
  );
};

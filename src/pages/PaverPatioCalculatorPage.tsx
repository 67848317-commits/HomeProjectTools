import React, { useState, useMemo } from 'react';
import { Breadcrumbs } from '../components/common/Breadcrumbs.tsx';
import { Container } from '../components/common/Container.tsx';
import { CalculatorHeader } from '../components/calculator/CalculatorHeader.tsx';
import { CalculatorInput } from '../components/calculator/CalculatorInput.tsx';
import { CalculatorSelect } from '../components/calculator/CalculatorSelect.tsx';
import { WasteSelector } from '../components/calculator/WasteSelector.tsx';
import { ResultMetric } from '../components/calculator/ResultMetric.tsx';
import { BillOfMaterialsTable } from '../components/calculator/BillOfMaterialsTable.tsx';
import { CostEstimateCard } from '../components/calculator/CostEstimateCard.tsx';
import { CalculationExplanation, type CalculationStep } from '../components/calculator/CalculationExplanation.tsx';
import { AssumptionsList } from '../components/calculator/AssumptionsList.tsx';
import { PracticalTips, type PracticalTipItem } from '../components/calculator/PracticalTips.tsx';
import { RelatedTools } from '../components/calculator/RelatedTools.tsx';

import { calculatePaverPatio } from '../scripts/calculators/paverPatio.ts';
import { CALCULATORS } from '../data/calculators.ts';
import { CATEGORIES } from '../data/categories.ts';
import {
  RotateCcw,
  SlidersHorizontal,
  Layers,
  HelpCircle,
  AlertTriangle,
  Compass,
  CheckCircle2,
  ShieldAlert,
  Truck,
  Box,
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
    const paverSqFt = (paverLengthInches * paverWidthInches) / 144;
    const exactPavers = Math.round(out.patioAreaSqFt / paverSqFt);

    return [
      {
        stepNumber: 1,
        title: 'Compute Patio Surface Area & Paver Units',
        description:
          'Multiply patio length by width to obtain net square footage. Divide by the area of an individual paver and apply the cutting waste factor.',
        formulaDisplay: (
          <span>
            {patioLength}&apos; × {patioWidth}&apos; = <strong>{out.patioAreaSqFt} sq ft</strong> • Pavers:{' '}
            {out.patioAreaSqFt} sq ft ÷ {paverSqFt.toFixed(3)} sq ft/unit = {exactPavers} units × (1 + {wastePercentage / 100}) ={' '}
            <strong className="text-[#b8532b]">{out.recommendedPaversToPurchase} pavers</strong>
          </span>
        ),
      },
      {
        stepNumber: 2,
        title: 'Calculate Crushed Aggregate Base Tonnage (With Perimeter Extension)',
        description:
          'Per Interlocking Concrete Pavement Institute (ICPI) guidelines, aggregate base extends 6 inches beyond the paver perimeter on each side for edge restraint stability. Compacted dense-grade gravel is estimated at 1.55 tons per cubic yard.',
        formulaDisplay: (
          <span>
            ({patioLength} + 1)&apos; × ({patioWidth} + 1)&apos; × ({baseDepthInches}&quot; ÷ 12) ={' '}
            {(((patioLength + 1) * (patioWidth + 1) * baseDepthInches) / 12).toFixed(1)} cu ft ÷ 27 × 1.55 tons/yd³ ={' '}
            <strong className="text-[#b8532b]">{out.gravelBaseTons} tons of dense-grade base gravel</strong>
          </span>
        ),
      },
      {
        stepNumber: 3,
        title: 'Bedding Sand Screed Layer',
        description:
          'A uniform 1-inch layer of uncompacted coarse concrete sand is screeded directly over the compacted aggregate base before laying pavers.',
        formulaDisplay: (
          <span>
            {patioLength}&apos; × {patioWidth}&apos; × (1&quot; ÷ 12) = {((patioLength * patioWidth) / 12).toFixed(1)} cu ft ÷ 27 ={' '}
            <strong className="text-[#b8532b]">{out.beddingSandCubicYards} cubic yards of bedding sand</strong>
          </span>
        ),
      },
      {
        stepNumber: 4,
        title: 'Polymeric Jointing Sand Allowance',
        description:
          'Standard polymeric jointing sand is swept into joints and activated with water mist. One 50-lb bag typically covers 60 to 80 sq ft for standard 4x8 pavers.',
        formulaDisplay: (
          <span>
            {out.patioAreaSqFt} sq ft ÷ 70 sq ft/bag ={' '}
            <strong className="text-[#b8532b]">{out.polymericSand50lbBags} bags (50-lb polymeric sand)</strong>
          </span>
        ),
      },
    ];
  }, [calculationResult, patioLength, patioWidth, paverLengthInches, paverWidthInches, baseDepthInches, wastePercentage]);

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
            <strong className="text-[#1c1917] font-semibold">Planning Base-Depth Benchmark: 4 in:</strong> This calculator provides a material planning estimate based on typical residential pedestrian patios. Actual base requirements vary with native subgrade soil (clay vs sand), drainage, freeze-thaw cycles, and anticipated loading (walkway vs driveway). Plastic edge restraints and geotextile stabilization fabric are estimated separately based on perimeter and area.
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
                  />
                </div>

                {/* 3. Base Depth Selector */}
                <div className="space-y-1.5">
                  <CalculatorSelect
                    id="base-depth"
                    label="Crushed Aggregate Base Depth"
                    value={baseDepthInches.toString()}
                    onChange={(val) => setBaseDepthInches(Number(val))}
                    options={[
                      { label: '4 Inches (Planning Benchmark: Pedestrian Patio)', value: '4' },
                      { label: '6 Inches (Cold Climates, Heavy Clay Soil, or Soft Subgrade)', value: '6' },
                    ]}
                  />
                  <span className="text-[11px] text-[#78716c] leading-relaxed block">
                    Planning base-depth benchmark is 4" for well-drained soils; 6" is recommended in freeze-thaw zones or wet clay soils.
                  </span>
                </div>

                {/* 4. Waste Factor */}
                <WasteSelector
                  value={wastePercentage}
                  onChange={setWastePercentage}
                  options={metadata.wasteOptions}
                  title="Cutting & Pattern Waste Allowance"
                  customLabel="Allowance"
                  principleNote="Accounts for perimeter border cuts and pattern alignment. 10% is standard for straight rectangular patios; 15% is recommended for herringbone or curved borders."
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
                  <span className="font-mono text-[#78716c]">1.0&quot; coarse screed sand</span>
                </div>
                <div className="p-2 rounded bg-[#ffffff] border border-[#e3ded4] flex items-center justify-between">
                  <span className="font-semibold text-[#1c1917]">Layer 3: Aggregate Base</span>
                  <span className="font-mono text-[#78716c]">{baseDepthInches}&quot; compacted gravel</span>
                </div>
                <div className="p-2 rounded bg-[#ffffff] border border-[#e3ded4] flex items-center justify-between">
                  <span className="font-semibold text-[#1c1917]">Layer 4: Joint Sand</span>
                  <span className="font-mono text-[#78716c]">Polymeric lock sand</span>
                </div>
              </div>
              <p className="text-[11px] text-[#78716c] leading-relaxed">
                Illustrative layered model. Actual subgrade preparation depends on local soil bearing capacity.
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
                          subtext={`Inc. ${wastePercentage}% cut buffer`}
                          variant="primary"
                        />
                        <ResultMetric
                          label="Gravel Base"
                          value={out.gravelBaseTons}
                          unit="tons"
                          subtext={`${baseDepthInches}" dense-grade rock`}
                          variant="primary"
                        />
                        <ResultMetric
                          label="Bedding Sand"
                          value={out.beddingSandCubicYards}
                          unit="cu yds"
                          subtext="1&quot; coarse sand screed"
                          variant="primary"
                        />
                        <ResultMetric
                          label="Polymeric Sand"
                          value={out.polymericSand50lbBags}
                          unit="bags"
                          subtext="50-lb joint sand bags"
                          variant="primary"
                        />
                      </div>

                      {/* Area Scope Header */}
                      <div className="rounded bg-[#f7f5f0] p-3.5 border border-[#e3ded4] text-xs text-[#57534e] space-y-1.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <div>
                            <strong className="text-[#1c1917]">Finished Patio Surface:</strong> {out.patioAreaSqFt} sq ft ({patioLength}&apos; × {patioWidth}&apos;)
                            <span className="text-[11px] text-[#78716c] block sm:inline sm:ml-1.5">— used for paver counts &amp; bedding sand</span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-1 border-t border-[#e8e4dc]">
                          <div>
                            <strong className="text-[#1c1917]">Excavation &amp; Base Footprint:</strong> {out.baseExcavationAreaSqFt} sq ft ({patioLength + 1}&apos; × {patioWidth + 1}&apos;)
                            <span className="text-[11px] text-[#78716c] block sm:inline sm:ml-1.5">— includes 6&quot; perimeter extension on all sides for edge restraint stability</span>
                          </div>
                          <span className="font-mono font-bold text-[#b8532b] text-[11px]">
                            {baseDepthInches}&quot; Base Depth
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* MATERIAL BILL OF MATERIALS */}
                    <div className="space-y-2">
                      <BillOfMaterialsTable items={calculationResult.billOfMaterials} />
                      <p className="text-[11px] font-mono text-[#78716c] px-1">
                        * Quantities represent commercial purchase units rounded up. Edge restraints, spikes, and non-woven geotextile underlayment fabric are estimated separately.
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
                'Subgrade Excavation: Total excavation depth must equal base depth + 1" sand + paver thickness (typically 7" to 9" total depth). Soil spoils removal is not included.',
                'Compaction Equipment: Dense-graded aggregate base requires mechanical compaction in 2-inch lifts using a heavy reversible plate compactor.',
                'Perimeter Restraints: Heavy-duty plastic paver edging and 10-inch galvanized steel spikes along the perimeter are required to prevent lateral spreading.',
              ]}
              scopeTitle="Excavation & Base Scope Disclaimers"
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
              <button
                onClick={() => onNavigate && onNavigate('/guides/how-to-calculate-paver-patio-materials')}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded text-xs font-mono font-semibold bg-[#b8532b] text-white hover:bg-[#a04422] transition-colors shrink-0 shadow-xs"
              >
                <span>Read Planning Guide</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
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

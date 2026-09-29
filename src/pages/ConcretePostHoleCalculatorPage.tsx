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

import { calculateConcretePostHole } from '../scripts/calculators/concretePostHole.ts';
import { CALCULATORS } from '../data/calculators.ts';
import { CATEGORIES } from '../data/categories.ts';
import {
  RotateCcw,
  SlidersHorizontal,
  Box,
  Layers,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Package,
  Wrench,
  AlertTriangle,
  Info,
  CheckCircle2,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

interface ConcretePostHoleCalculatorPageProps {
  onNavigate?: (path: string) => void;
}

export const ConcretePostHoleCalculatorPage: React.FC<ConcretePostHoleCalculatorPageProps> = ({ onNavigate }) => {
  const metadata = CALCULATORS['concrete-post-hole-calculator'];
  const category = CATEGORIES['concrete-masonry'];

  // Form State
  const [holeCount, setHoleCount] = useState<number>(10);
  const [holeDiameterInches, setHoleDiameterInches] = useState<number>(10);
  const [holeDepthInches, setHoleDepthInches] = useState<number>(36);
  const [postSize, setPostSize] = useState<'4x4' | '6x6' | 'round-2.375' | 'none'>('4x4');
  const [wastePercentage, setWastePercentage] = useState<number>(10);

  // Live calculation
  const calculationResult = useMemo(() => {
    return calculateConcretePostHole({
      holeCount,
      holeDiameterInches,
      holeDepthInches,
      postSize,
      wastePercentage,
    });
  }, [holeCount, holeDiameterInches, holeDepthInches, postSize, wastePercentage]);

  const handleReset = () => {
    setHoleCount(10);
    setHoleDiameterInches(10);
    setHoleDepthInches(36);
    setPostSize('4x4');
    setWastePercentage(10);
  };

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: category?.name ?? 'Concrete & Masonry', href: category?.hubPath ?? '/projects/concrete-masonry' },
    { label: metadata?.name ?? 'Concrete Post Hole Calculator' },
  ];

  const postSizeOptions = [
    { value: '4x4', label: '4x4 Lumber Post (Actual 3.5" x 3.5")', description: 'Standard wooden fence or pergola post' },
    { value: '6x6', label: '6x6 Heavy Timber Post (Actual 5.5" x 5.5")', description: 'Structural deck or pergola support post' },
    { value: 'round-2.375', label: '2-3/8" Round Steel Pipe', description: 'Standard chain-link or metal privacy terminal post' },
    { value: 'none', label: 'No Post Displacement (Pier / Sonotube)', description: 'Solid concrete cylinder or footing column' },
  ];

  const explanationSteps: CalculationStep[] = useMemo(() => {
    if (!calculationResult.success) return [];
    const out = calculationResult.outputs;

    return [
      {
        stepNumber: 1,
        title: 'Calculate Gross Cylindrical Hole Volume',
        description: 'Using the geometric cylinder formula (π × r² × depth), calculate the total void volume of the dug hole.',
        formulaDisplay: (
          <span>
            π × ({holeDiameterInches / 2}" ÷ 12)² × ({holeDepthInches}" ÷ 12) ={' '}
            <strong>{out.cylinderVolumePerHoleCuFt} cu ft gross per hole</strong>
          </span>
        ),
      },
      {
        stepNumber: 2,
        title: 'Deduct Embedded Post Displacement',
        description: 'The post physically displaces concrete. Subtracting post cross-sectional volume leaves the net fillable space.',
        formulaDisplay: (
          <span>
            {out.cylinderVolumePerHoleCuFt} cu ft gross − {out.postDisplacementPerHoleCuFt} cu ft post ={' '}
            <strong className="text-[#b8532b]">{out.netConcretePerHoleCuFt} cu ft net fill per hole</strong>
          </span>
        ),
      },
      {
        stepNumber: 3,
        title: 'Multiply by Hole Count and Apply Soil Buffer',
        description: 'Multiply net fill by the number of posts and apply an earth-wall irregularity buffer (default 10%).',
        formulaDisplay: (
          <span>
            ({out.netConcretePerHoleCuFt} cu ft × {holeCount} holes) × (1 + {wastePercentage / 100}) ={' '}
            <strong>{out.recommendedTotalCuFt} cu ft</strong> ({out.recommendedTotalCuYds} cu yds)
          </span>
        ),
      },
      {
        stepNumber: 4,
        title: 'Convert to Commercial Pre-Mixed Bags',
        description: 'Divide total required volume by standard bag yields (0.60 cu ft per 80-lb bag) and round upward to whole bags.',
        formulaDisplay: (
          <span>
            {out.recommendedTotalCuFt} cu ft ÷ 0.60 cu ft/bag ={' '}
            <strong>{out.totalBags80lbToPurchase} bags (80-lb)</strong> or{' '}
            <strong>{out.totalBags60lbToPurchase} bags (60-lb)</strong>
          </span>
        ),
      },
    ];
  }, [calculationResult, holeDiameterInches, holeDepthInches, holeCount, wastePercentage]);

  const practicalTips: PracticalTipItem[] = [
    {
      title: 'Confirm Local Frost Depth with Municipal Authorities',
      desc:
        'Building codes in freezing climates require footings to extend below the local frost line (often 36" to 48" in northern zones) to prevent winter frost heave from jacking posts upward.',
      icon: ShieldAlert,
    },
    {
      title: 'Maintain the 3x Post Diameter Clearance Rule',
      desc:
        'For structural stability and adequate concrete encasement, the hole diameter should measure approximately 3 times the width of the post (e.g., a 10" or 12" hole for a nominal 4x4 post).',
      icon: Box,
    },
    {
      title: 'Install a 2- to 3-Inch Crushed Gravel Footing Base',
      desc:
        'Before setting the post, pour 2 to 3 inches of coarse crushed stone into the bottom of the hole. This provides a solid base that promotes drainage beneath the end-grain, helping prevent premature wood rot.',
      icon: Layers,
    },
    {
      title: 'Evaluate Mixer Rental for Large Post Projects',
      desc:
        'Mixing more than 15 to 20 bags by hand in a wheelbarrow is exhausting and slows down setting time. Renting an electric barrel mixer ensures consistent slump and rapid placement across multiple holes.',
      icon: Wrench,
    },
  ];

  return (
    <div className="py-6 sm:py-10">
      <Container>
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />

        {/* Page Header */}
        <CalculatorHeader
          title={metadata?.name ?? 'Concrete Post Hole & Footing Calculator'}
          categoryName={category?.name ?? 'Masonry & Structural'}
          description="Calculate estimated concrete volume and commercial pre-mixed bag quantities (80-lb and 60-lb) for fence posts, deck footings, and mailbox piers with post displacement deductions."
          targetIntent={metadata?.targetIntent}
        />

        {/* Main Interactive Estimating Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* LEFT COLUMN: Hole & Post Inputs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-lg border border-[#e3ded4] bg-[#ffffff] p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#e3ded4] pb-3 mb-5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-[#f7f5f0] border border-[#e3ded4] text-[#b8532b]">
                    <SlidersHorizontal className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#1c1917]">
                      Post & Hole Specifications
                    </h2>
                    <span className="text-[11px] text-[#78716c]">
                      Hole count, cylinder dimensions & embedded post profile
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
                {/* 1. Post Count */}
                <CalculatorInput
                  id="hole-count"
                  label="Number of Post Holes"
                  value={holeCount}
                  onChange={(val) => setHoleCount(Math.max(1, Math.round(val)))}
                  unit="holes"
                  min={1}
                  max={200}
                  step={1}
                  description="Total vertical posts or footings in this run."
                  required
                />

                {/* 2. Hole Diameter and Depth */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CalculatorInput
                    id="hole-diameter"
                    label="Hole Diameter"
                    value={holeDiameterInches}
                    onChange={setHoleDiameterInches}
                    unit="inches"
                    min={6}
                    max={36}
                    step={1}
                    description="Standard rule: 3x post width (e.g. 10&quot;–12&quot; for 4x4)."
                    required
                  />

                  <CalculatorInput
                    id="hole-depth"
                    label="Hole Depth"
                    value={holeDepthInches}
                    onChange={setHoleDepthInches}
                    unit="inches"
                    min={12}
                    max={96}
                    step={2}
                    description="Depth below grade (must meet local frost line)."
                    required
                  />
                </div>

                {/* 3. Post Dimension Selector */}
                <CalculatorSelect
                  id="post-size"
                  label="Embedded Post Type & Dimension"
                  value={postSize}
                  onChange={(val) => setPostSize(val as '4x4' | '6x6' | 'round-2.375' | 'none')}
                  options={postSizeOptions}
                  description="Deducts the solid volume of the post submerged in the hole."
                  required
                />

                {/* 4. Soil Wall Variance / Form Type Selector */}
                <WasteSelector
                  value={wastePercentage}
                  onChange={setWastePercentage}
                  options={metadata.wasteOptions}
                  title="Dug Hole Irregularity Allowance"
                  customLabel="Buffer"
                  principleNote="Hand-dug or augered earth walls are never perfectly smooth cylinders. Soil pockets, root voids, and auger wobble require an earth-wall safety margin."
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Output Results & Displacement Breakdown */}
          <div className="lg:col-span-7 space-y-6" aria-live="polite">
            {calculationResult.success ? (
              (() => {
                const out = calculationResult.outputs;
                const exactBags80 = (out.recommendedTotalCuFt / 0.60).toFixed(1);
                const exactBags60 = (out.recommendedTotalCuFt / 0.45).toFixed(1);

                return (
                  <>
                    {/* Primary Commercial Metric Highlight */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <ResultMetric
                          label="Commercial 80-lb Bags"
                          value={out.totalBags80lbToPurchase}
                          unit="bags"
                          subtext={`Total weight: ${(out.totalBags80lbToPurchase * 80).toLocaleString()} lbs (${exactBags80} mathematical bags)`}
                          variant="primary"
                        />
                        <ResultMetric
                          label="Concrete Volume per Hole"
                          value={out.netConcretePerHoleCuFt}
                          unit="cu ft / hole"
                          subtext={`Approx ${out.bags80lbPerHole} bags (80-lb) per post hole`}
                          variant="primary"
                        />
                      </div>

                      {/* Secondary Metrics Bar */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        <ResultMetric
                          label="Post Count"
                          value={out.holeCount}
                          unit="holes"
                          subtext={`Total posts`}
                        />
                        <ResultMetric
                          label="Gross Hole Volume"
                          value={out.cylinderVolumePerHoleCuFt}
                          unit="cu ft / hole"
                          subtext="Before post displacement"
                        />
                        <ResultMetric
                          label="Estimated Post Displacement"
                          value={out.postDisplacementPerHoleCuFt}
                          unit="cu ft / hole"
                          subtext={`Estimated volume of ${postSize} post`}
                        />
                        <ResultMetric
                          label="Total Order Volume"
                          value={out.recommendedTotalCuYds}
                          unit="cu yds"
                          subtext={`${out.recommendedTotalCuFt} cu ft total`}
                        />
                      </div>
                    </div>

                    {/* POST-DISPLACEMENT BREAKDOWN CARD */}
                    <div className="rounded-lg border border-[#e3ded4] bg-[#ffffff] p-5 shadow-xs space-y-4">
                      <div className="flex items-center gap-2 border-b border-[#e3ded4] pb-3">
                        <div className="p-1 rounded bg-[#fcf4ee] text-[#b8532b]">
                          <Box className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#1c1917]">
                            Post Displacement & Fillable Space Breakdown
                          </h3>
                          <span className="text-[11px] text-[#78716c]">
                            Why post size directly changes concrete volume
                          </span>
                        </div>
                      </div>

                      {/* Visual Per-Hole Step Down */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                        <div className="rounded bg-[#f7f5f0] p-3 border border-[#e3ded4]">
                          <span className="text-[10px] font-mono uppercase text-[#78716c]">Dug Cylinder Volume</span>
                          <div className="text-base font-mono font-bold text-[#1c1917] mt-0.5">
                            {out.cylinderVolumePerHoleCuFt} <span className="text-xs font-normal">cu ft</span>
                          </div>
                          <span className="text-[11px] text-[#57534e]">Gross hole size</span>
                        </div>

                        <div className="rounded bg-[#fcf4ee] p-3 border border-[#ecd9cb]">
                          <span className="text-[10px] font-mono uppercase text-[#b8532b]">− Post Displacement</span>
                          <div className="text-base font-mono font-bold text-[#b8532b] mt-0.5">
                            −{out.postDisplacementPerHoleCuFt} <span className="text-xs font-normal">cu ft</span>
                          </div>
                          <span className="text-[11px] text-[#57534e]">Solid wood/steel void</span>
                        </div>

                        <div className="rounded bg-[#f0fdf4] p-3 border border-[#bbf7d0]">
                          <span className="text-[10px] font-mono uppercase text-[#166534]">= Concrete per Hole</span>
                          <div className="text-base font-mono font-bold text-[#166534] mt-0.5">
                            {out.netConcretePerHoleCuFt} <span className="text-xs font-normal">cu ft</span>
                          </div>
                          <span className="text-[11px] text-[#57534e]">Actual fill collar</span>
                        </div>
                      </div>

                      {/* Plain Language Explanation */}
                      <div className="rounded bg-[#f7f5f0] p-3 text-xs text-[#57534e] space-y-1.5 border border-[#e3ded4]">
                        <p className="leading-relaxed">
                          <strong>Understanding Post Displacement:</strong> The calculator subtracts the estimated volume occupied by the embedded post from each hole so the concrete estimate reflects the fillable space rather than the full cylinder volume.
                        </p>
                        <p className="text-[11px] text-[#78716c] leading-relaxed">
                          For {out.holeCount} posts with an earth-wall variance buffer of {out.wastePercentage}%, your project requires approximately <strong>{out.recommendedTotalCuFt} cubic feet ({out.recommendedTotalCuYds} cubic yards)</strong> of concrete.
                        </p>
                      </div>

                      {/* Bag Options Comparison */}
                      <div className="pt-2 border-t border-[#e3ded4]">
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="font-mono uppercase font-semibold text-[#57534e]">Commercial Bag Choice:</span>
                          <span className="font-mono text-[#78716c]">Planning Benchmark Yields</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded border border-[#e3ded4] p-2.5 bg-[#ffffff]">
                            <div className="flex justify-between items-baseline">
                              <span className="text-xs font-bold text-[#1c1917]">80-lb Mix Bags</span>
                              <span className="text-sm font-mono font-bold text-[#b8532b]">{out.totalBags80lbToPurchase} bags</span>
                            </div>
                            <span className="text-[11px] text-[#78716c]">0.60 cu ft/bag • {out.bags80lbPerHole} bags/hole</span>
                          </div>
                          <div className="rounded border border-[#e3ded4] p-2.5 bg-[#ffffff]">
                            <div className="flex justify-between items-baseline">
                              <span className="text-xs font-bold text-[#1c1917]">60-lb Mix Bags</span>
                              <span className="text-sm font-mono font-bold text-[#1c1917]">{out.totalBags60lbToPurchase} bags</span>
                            </div>
                            <span className="text-[11px] text-[#78716c]">0.45 cu ft/bag • Easier to lift</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Planning Notice */}
                    <div className="rounded border border-[#e3ded4] bg-[#ffffff] p-3.5 text-xs text-[#57534e] space-y-1">
                      <div className="flex items-center gap-1.5 font-mono font-bold text-[#1c1917]">
                        <ShieldAlert className="h-4 w-4 text-[#b8532b]" />
                        <span>Planning & Material Procurement Disclaimer</span>
                      </div>
                      <p className="text-[11px] text-[#78716c] leading-relaxed">
                        Bag yield values (0.60 cu ft for 80-lb bags and 0.45 cu ft for 60-lb bags) are typical manufacturer planning benchmarks. Actual yield varies by brand, aggregate gradation, and water ratio. Always verify coverage tables on your selected product packaging. This worksheet provides material planning estimates and does not serve as an engineered structural foundation design.
                      </p>
                    </div>

                    {/* Bill of Materials Takeoff */}
                    <BillOfMaterialsTable items={calculationResult.billOfMaterials} />

                    {/* Cost Estimate Range */}
                    <CostEstimateCard costEstimate={calculationResult.costEstimate} />
                  </>
                );
              })()
            ) : (
              /* Validation Error Display */
              <div className="rounded-lg border-2 border-[#b8532b] bg-[#fcf4ee] p-6 text-center space-y-3">
                <AlertTriangle className="h-8 w-8 text-[#b8532b] mx-auto" />
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-[#b8532b]">
                  Input Validation Error
                </h3>
                <p className="text-xs text-[#57534e] max-w-md mx-auto">
                  {calculationResult.errors[0]?.message ?? 'Please check your inputs and ensure all dimensions are valid.'}
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
            {/* 1. Step-by-Step Mathematical Explanation */}
            <CalculationExplanation
              title="Mathematical Breakdown: How Post Hole Concrete is Calculated"
              subtitle="Volume with Post Displacement"
              steps={explanationSteps}
            />

            {/* 2. Planning Assumptions & Boundary Notices */}
            <AssumptionsList
              assumptions={calculationResult.assumptions}
              notices={calculationResult.notices}
              limitations={[
                'Frost Depth Verification: Confirm minimum footing depth with your local municipal building authority before excavating.',
                'Gravel Drainage Pad: 2 to 3 inches of crushed stone placed at the bottom of the hole for water drainage is not included in the concrete volume.',
                'Structural Engineering: Post diameter and footing bell configurations for commercial decks, multi-story loads, or retaining walls require certified engineering calculations.',
              ]}
              scopeTitle="Out of Scope / Site Preparation"
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
                    How Much Concrete for a Post Hole? 4x4, 6x6, and Fence Post Depth Rules
                  </h3>
                  <p className="text-xs sm:text-sm text-[#57534e] mt-1 max-w-xl leading-relaxed">
                    Learn the 1/3-to-1/2 depth rule, calculate post cylinder displacement, and determine exact 50-lb, 60-lb, or 80-lb pre-mix bag counts per hole.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate && onNavigate('/guides/how-much-concrete-do-i-need-for-fence-posts')}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded text-xs font-mono font-semibold bg-[#b8532b] text-white hover:bg-[#a04422] transition-colors shrink-0 shadow-xs"
              >
                <span>Read Planning Guide</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* 3. Practical Field Tips */}
            <PracticalTips
              title="Practical Field Tips for Setting Posts in Concrete"
              subtitle="Contractor Advice"
              tips={practicalTips}
            />

            {/* 4. Related Project Calculators */}
            <RelatedTools currentCalculatorId="concrete-post-hole-calculator" onNavigate={onNavigate} />
          </div>
        )}
      </Container>
    </div>
  );
};

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

import { calculateBaseboardTrim } from '../../scripts/calculators/baseboardTrim.ts';
import { CALCULATORS } from '../../data/calculators.ts';
import { CATEGORIES } from '../../data/categories.ts';
import { ceilToPackage } from '../../scripts/core/math-utils.ts';
import {
  RotateCcw,
  SlidersHorizontal,
  Ruler,
  HelpCircle,
  AlertTriangle,
  Scissors,
  Truck,
  Layers,
  Sparkles,
  CheckCircle2,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

interface BaseboardTrimCalculatorPageProps {
  onNavigate?: (path: string) => void;
}

export const BaseboardTrimCalculatorPage: React.FC<BaseboardTrimCalculatorPageProps> = ({ onNavigate }) => {
  const metadata = CALCULATORS['baseboard-trim-calculator'];
  const category = CATEGORIES['flooring'];

  // Form State
  const [roomLength, setRoomLength] = useState<number>(16);
  const [roomWidth, setRoomWidth] = useState<number>(12);
  const [doorOpenings, setDoorOpenings] = useState<number>(2);
  const [stickLengthFeet, setStickLengthFeet] = useState<8 | 12 | 16>(12);
  const [wastePercentage, setWastePercentage] = useState<number>(15);

  // Live calculation
  const calculationResult = useMemo(() => {
    return calculateBaseboardTrim({
      roomLength,
      roomWidth,
      doorOpenings,
      stickLengthFeet,
      wastePercentage,
    });
  }, [roomLength, roomWidth, doorOpenings, stickLengthFeet, wastePercentage]);

  const handleReset = () => {
    setRoomLength(16);
    setRoomWidth(12);
    setDoorOpenings(2);
    setStickLengthFeet(12);
    setWastePercentage(15);
  };

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: category?.name ?? 'Flooring', href: category?.hubPath ?? '/projects/flooring' },
    { label: metadata?.name ?? 'Baseboard & Trim Molding Calculator' },
  ];

  // Stock length comparison data (8 ft vs 12 ft vs 16 ft sticks)
  const stockLengthComparisons = useMemo(() => {
    if (!calculationResult.success) return [];
    const recommendedLF = calculationResult.outputs.recommendedPurchaseLinearFeet;

    const lengths: Array<8 | 12 | 16> = [8, 12, 16];
    return lengths.map((len) => {
      const sticks = ceilToPackage(recommendedLF / len);
      const purchasedLF = sticks * len;
      const leftoverLF = purchasedLF - recommendedLF;
      return {
        length: len,
        sticks,
        purchasedLF,
        leftoverLF: leftoverLF.toFixed(1),
        isSelected: stickLengthFeet === len,
        handlingNote:
          len === 8
            ? 'Fits inside most SUVs; more wall seams'
            : len === 12
            ? 'Spans many bedroom walls; fewer seams, moderate transport'
            : 'Longest continuous runs; fewest seams, requires truck/rack',
      };
    });
  }, [calculationResult, stickLengthFeet]);

  const explanationSteps: CalculationStep[] = useMemo(() => {
    if (!calculationResult.success) return [];
    const out = calculationResult.outputs;

    return [
      {
        stepNumber: 1,
        title: 'Calculate Gross Perimeter & Deduct Doorways',
        description:
          'Compute total perimeter of the four walls and subtract doorway thresholds (2.5 linear feet deducted per opening).',
        formulaDisplay: (
          <span>
            Perimeter: 2 × ({roomLength}&apos; + {roomWidth}&apos;) = {out.grossPerimeterFeet} lin ft − Doorways: ({doorOpenings} × 2.5&apos; ={' '}
            {out.doorwayDeductionFeet} lin ft) = <strong>{out.netLinearFeet} net linear feet</strong>
          </span>
        ),
      },
      {
        stepNumber: 2,
        title: 'Incorporate 15% Miter & Scarf Cut Planning Allowance',
        description:
          'Trim molding requires a higher waste factor than flat sheet goods because 45-degree corner miters and 45-degree scarf joints consume off-cuts that cannot be reused on short wall sections.',
        formulaDisplay: (
          <span>
            {out.netLinearFeet} lin ft × (1 + {wastePercentage / 100}) ={' '}
            <strong className="text-[#b8532b]">{out.recommendedPurchaseLinearFeet} linear feet planning requirement</strong>
          </span>
        ),
      },
      {
        stepNumber: 3,
        title: 'Convert to Commercial Stock Molding Sticks',
        description:
          'Divide recommended linear footage by chosen stick length (8, 12, or 16 ft) and round up to whole commercial sticks.',
        formulaDisplay: (
          <span>
            {out.recommendedPurchaseLinearFeet} lin ft ÷ {stickLengthFeet}&apos; stick ={' '}
            <strong className="text-[#b8532b]">{out.sticksToPurchase} pieces ({stickLengthFeet}-foot sticks)</strong>{' '}
            ({out.purchasedLinearFeet} purchased linear feet)
          </span>
        ),
      },
    ];
  }, [calculationResult, roomLength, roomWidth, doorOpenings, wastePercentage, stickLengthFeet]);

  const practicalTips: PracticalTipItem[] = [
    {
      title: 'Planning Cutting / Miter Allowance: 15%',
      desc: 'A 15% allowance is the standard planning benchmark for baseboards. Actual scrap depends on corner count, out-of-square walls, and scarf joint placement. Straight rectangular rooms need less; bay windows or bump-outs need 20%.',
      icon: Scissors,
    },
    {
      title: 'Transporting 8-Foot vs 12-Foot vs 16-Foot Sticks',
      desc: '8-foot trim fits easily inside most hatchbacks and SUVs, but creates twice as many wall butt/scarf joints. 12-foot pieces can span most bedroom walls in a single stick, eliminating visible middle seams.',
      icon: Truck,
    },
    {
      title: 'Use 45-Degree Scarf Joints on Long Runs',
      desc: 'When a single wall exceeds your stick length, never join two pieces with a 90-degree square butt joint. Cut both mating ends at 45-degree bevels (scarf joint) and nail directly into a wall stud for an invisible seam.',
      icon: Ruler,
    },
    {
      title: 'Cope Inside Corners Rather than Miter',
      desc: 'Inside drywall corners are rarely exactly 90 degrees due to taped drywall mud buildup. Coping the profile with a handheld coping saw allows the joint to flex and stay tight even when walls shift with seasons.',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="py-6 sm:py-10">
      <Container>
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />

        {/* Page Header */}
        <CalculatorHeader
          title={metadata?.name ?? 'Baseboard & Trim Molding Calculator'}
          categoryName={category?.name ?? 'Flooring & Tile'}
          description="Calculate room perimeters, doorway deductions, miter cut allowances, and commercial molding sticks in 8 ft, 12 ft, or 16 ft stock lengths."
          targetIntent={metadata?.targetIntent}
        />

        {/* Planning Allowance Notice */}
        <div className="mb-8 rounded-lg border border-[#e3ded4] bg-[#faf8f5] p-4 flex items-start gap-3 text-xs text-[#57534e]">
          <HelpCircle className="h-5 w-5 text-[#b8532b] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-[#1c1917] font-semibold">Planning Cutting / Miter Allowance: 15%:</strong> Trim molding requires a planning allowance because 45° inside/outside corner miters and 45° scarf joints create cut off-fall that cannot be reused on short wall sections. Actual waste depends on room layout, corner count, trim profile, and installer technique.
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
                      Room Dimensions & Doorways
                    </h2>
                    <span className="text-[11px] text-[#78716c]">
                      Perimeter, openings & molding stock length
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
                {/* 1. Room Dimensions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CalculatorInput
                    id="room-length"
                    label="Room Length"
                    value={roomLength}
                    onChange={setRoomLength}
                    unit="ft"
                    min={1}
                    max={200}
                    step={0.5}
                    required
                  />

                  <CalculatorInput
                    id="room-width"
                    label="Room Width"
                    value={roomWidth}
                    onChange={setRoomWidth}
                    unit="ft"
                    min={1}
                    max={200}
                    step={0.5}
                    required
                  />
                </div>

                {/* 2. Doorways to Deduct */}
                <CalculatorInput
                  id="door-openings"
                  label="Number of Doorways to Subtract"
                  value={doorOpenings}
                  onChange={setDoorOpenings}
                  unit="doors"
                  min={0}
                  max={20}
                  step={1}
                  description="Deducts approx 2.5 linear feet per doorway opening."
                />

                {/* 3. Stock Stick Length Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase text-[#1c1917]">
                    Molding Stock Length
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {([8, 12, 16] as const).map((len) => (
                      <button
                        key={len}
                        type="button"
                        onClick={() => setStickLengthFeet(len)}
                        className={`p-2.5 rounded-lg border text-center transition-all ${
                          stickLengthFeet === len
                            ? 'border-[#b8532b] bg-[#fcf4ee] font-bold text-[#b8532b] ring-1 ring-[#b8532b]'
                            : 'border-[#e3ded4] bg-[#ffffff] text-[#1c1917] hover:bg-[#faf8f5]'
                        }`}
                      >
                        <div className="font-mono text-xs">{len}&apos; Length</div>
                        <div className="text-[10px] text-[#78716c]">{len} ft stick</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Waste Factor */}
                <WasteSelector
                  value={wastePercentage}
                  onChange={setWastePercentage}
                  options={metadata.wasteOptions}
                  title="Miter Cut & Corner Waste Allowance"
                  customLabel="Allowance"
                  principleNote="Accounts for 45° corner miters, coped joints, and 45° scarf splices. 15% is standard planning benchmark; 20% is recommended for rooms with pillars or bump-outs."
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Results */}
          <div className="lg:col-span-7 space-y-6" aria-live="polite">
            {calculationResult.success ? (
              (() => {
                const out = calculationResult.outputs;

                return (
                  <>
                    {/* PRIMARY RESULTS */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <ResultMetric
                          label="Molding Sticks to Order"
                          value={out.sticksToPurchase}
                          unit="sticks"
                          subtext={`${stickLengthFeet}-foot commercial pieces`}
                          variant="primary"
                        />
                        <ResultMetric
                          label="Purchased Linear Feet"
                          value={out.purchasedLinearFeet}
                          unit="linear ft"
                          subtext={`${out.sticksToPurchase} × ${stickLengthFeet}' = ${out.purchasedLinearFeet} lf`}
                          variant="primary"
                        />
                        <ResultMetric
                          label="Net Perimeter Need"
                          value={out.netLinearFeet}
                          unit="linear ft"
                          subtext={`Gross: ${out.grossPerimeterFeet}' (−${out.doorwayDeductionFeet}' doors)`}
                        />
                      </div>
                    </div>

                    {/* STOCK-LENGTH COMPARISON CARD */}
                    <div className="rounded-lg border border-[#e3ded4] bg-[#ffffff] p-5 shadow-xs space-y-3">
                      <div className="flex items-center justify-between border-b border-[#e3ded4] pb-2">
                        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#1c1917]">
                          Stock-Length Comparison (8&apos; vs 12&apos; vs 16&apos; Sticks)
                        </h3>
                        <span className="text-[11px] font-mono text-[#78716c]">
                          {out.recommendedPurchaseLinearFeet} linear feet needed
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-3 text-xs">
                        {stockLengthComparisons.map((item) => (
                          <div
                            key={item.length}
                            className={`p-3 rounded-lg border text-center space-y-1 ${
                              item.isSelected
                                ? 'border-[#b8532b] bg-[#fcf4ee] font-semibold text-[#1c1917]'
                                : 'border-[#e3ded4] bg-[#faf8f5] text-[#57534e]'
                            }`}
                          >
                            <div className="font-mono text-xs uppercase text-[#78716c]">
                              {item.length}&apos; Sticks
                            </div>
                            <div className="font-mono text-lg font-bold text-[#1c1917]">
                              {item.sticks} <span className="text-xs font-normal">sticks</span>
                            </div>
                            <div className="text-[10px] font-mono text-[#78716c]">
                              {item.purchasedLF} lf ({item.leftoverLF} lf spare)
                            </div>
                            <div className="text-[9px] text-[#78716c] pt-1 leading-tight">
                              {item.handlingNote}
                            </div>
                          </div>
                        ))}
                      </div>

                      <p className="text-[11px] text-[#78716c] leading-relaxed pt-1">
                        Shorter sticks are easier to transport in passenger vehicles but result in more wall joints. Longer sticks reduce visible seams on long accent walls.
                      </p>
                    </div>

                    {/* THREE-STAGE HIERARCHY BREAKDOWN */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-[#e3ded4] pb-2">
                        <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[#1c1917]">
                          Perimeter & Stock Breakdown
                        </h3>
                        <span className="text-[11px] font-mono text-[#78716c]">
                          3-Stage Estimating Standard
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-3.5 rounded border border-[#e3ded4] bg-[#ffffff]">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-mono font-bold uppercase text-[#78716c] bg-[#f1ede4] px-1.5 py-0.5 rounded">
                              Stage 1
                            </span>
                            <span className="text-[11px] text-[#78716c] font-mono">Net Perimeter</span>
                          </div>
                          <div className="text-xl sm:text-2xl font-mono font-bold text-[#1c1917] tabular-nums mb-1">
                            {out.netLinearFeet}{' '}
                            <span className="text-xs font-sans font-normal text-[#57534e]">lin ft</span>
                          </div>
                          <p className="text-xs text-[#57534e] leading-snug">
                            {out.grossPerimeterFeet} lf gross minus {out.doorwayDeductionFeet} lf ({doorOpenings} doorways).
                          </p>
                        </div>

                        <div className="p-3.5 rounded border border-[#e3ded4] bg-[#ffffff]">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-mono font-bold uppercase text-[#1e3a5f] bg-[#edf3f9] px-1.5 py-0.5 rounded">
                              Stage 2
                            </span>
                            <span className="text-[11px] text-[#1e3a5f] font-mono">+{wastePercentage}% Miters</span>
                          </div>
                          <div className="text-xl sm:text-2xl font-mono font-bold text-[#1e3a5f] tabular-nums mb-1">
                            {out.recommendedPurchaseLinearFeet}{' '}
                            <span className="text-xs font-sans font-normal text-[#57534e]">lin ft</span>
                          </div>
                          <p className="text-xs text-[#57534e] leading-snug">
                            Planning requirement for 45° corner miters and scarf cuts.
                          </p>
                        </div>

                        <div className="p-3.5 rounded border-2 border-[#b8532b] bg-[#fcf4ee]">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-mono font-bold uppercase text-[#b8532b] bg-[#ffffff] px-1.5 py-0.5 rounded border border-[#e3ded4]">
                              Stage 3
                            </span>
                            <span className="text-[11px] text-[#b8532b] font-mono font-semibold">Commercial Pieces</span>
                          </div>
                          <div className="text-xl sm:text-2xl font-mono font-bold text-[#b8532b] tabular-nums mb-1">
                            {out.sticksToPurchase}{' '}
                            <span className="text-xs font-sans font-normal text-[#b8532b]">Sticks</span>
                          </div>
                          <p className="text-xs text-[#57534e] leading-snug">
                            {out.purchasedLinearFeet} purchased linear feet of {stickLengthFeet}-foot sticks.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* MATERIAL BILL OF MATERIALS */}
                    <div className="space-y-2">
                      <BillOfMaterialsTable items={calculationResult.billOfMaterials} />
                      <p className="text-[11px] font-mono text-[#78716c] px-1">
                        * Quantities represent commercial purchase units rounded up. Painter’s caulk, 16-gauge finish nails, and semi-gloss enamel paint are estimated separately.
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
                  {calculationResult.errors[0]?.message ?? 'Please check your inputs and ensure room dimensions are positive numbers.'}
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
              title="Mathematical Breakdown: How Baseboard Materials are Calculated"
              subtitle="Perimeter to Door Deductions, Miter Allowance & Stock Sticks"
              steps={explanationSteps}
            />

            {/* Assumptions & Boundaries */}
            <AssumptionsList
              assumptions={calculationResult.assumptions}
              notices={calculationResult.notices}
              limitations={[
                'Corner Count & Waste: Rooms with multiple jogs, closets, alcoves, or pillars will generate more short off-cuts that cannot be reused on long walls.',
                'Exclusions: Quarter round shoe molding, inside/outside corner blocks, painter’s caulk, spackle, and finish enamel paint are not included in baseboard counts.',
                'Subfloor Flatness: Severely uneven subfloors will require scribing or flexible shoe molding to conceal gaps beneath the baseboard.',
              ]}
              scopeTitle="Carpentry Scope Boundaries"
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
                    How Much Baseboard Do I Need? Calculate Linear Feet, Door Deductions, and Stock Molding
                  </h3>
                  <p className="text-xs sm:text-sm text-[#57534e] mt-1 max-w-xl leading-relaxed">
                    Learn how to measure wall perimeter, deduct door casing openings, apply a 15% miter allowance, and select optimal 8-ft, 12-ft, or 16-ft stock board lengths.
                  </p>
                </div>
              </div>
              <a
                href="/guides/how-much-baseboard-do-i-need"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded text-xs font-mono font-semibold bg-[#b8532b] text-white hover:bg-[#a04422] transition-colors shrink-0 shadow-xs cursor-pointer"
              >
                <span>Read Planning Guide</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Practical Tips */}
            <PracticalTips
              title="Practical Field Tips for Baseboard Installation"
              subtitle="Finish Carpentry Best Practices"
              tips={practicalTips}
            />

            {/* Related Tools */}
            <RelatedTools currentCalculatorId="baseboard-trim-calculator" onNavigate={onNavigate} />
          </div>
        )}
      </Container>
    </div>
  );
};

export const BaseboardTrimCalculatorIsland: React.FC = () => {
  const meta = CALCULATORS['baseboard-trim-calculator'];
  return (
    <CalculatorTrackerWrapper
      calculatorSlug="baseboard-trim-calculator"
      calculatorName={meta.name}
      projectCategory={meta.categoryId}
    >
      <BaseboardTrimCalculatorPage />
    </CalculatorTrackerWrapper>
  );
};

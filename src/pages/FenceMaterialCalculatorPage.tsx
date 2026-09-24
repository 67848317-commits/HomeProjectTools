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

import { calculateFenceMaterial } from '../scripts/calculators/fenceMaterial.ts';
import { CALCULATORS } from '../data/calculators.ts';
import { CATEGORIES } from '../data/categories.ts';
import {
  RotateCcw,
  SlidersHorizontal,
  Layers,
  AlertTriangle,
  DoorOpen,
  ArrowRight,
  ShieldAlert,
  PhoneCall,
  MapPin,
  CheckCircle2,
  Package,
  BookOpen,
} from 'lucide-react';

interface FenceMaterialCalculatorPageProps {
  onNavigate?: (path: string) => void;
}

export const FenceMaterialCalculatorPage: React.FC<FenceMaterialCalculatorPageProps> = ({ onNavigate }) => {
  const metadata = CALCULATORS['fence-material-calculator'];
  const category = CATEGORIES['fencing-decking'];

  // Form State
  const [fenceLength, setFenceLength] = useState<number>(150); // total linear feet
  const [fenceHeightFeet, setFenceHeightFeet] = useState<4 | 6 | 8>(6);
  const [postSpacingFeet, setPostSpacingFeet] = useState<6 | 8>(8);
  const [picketWidthInches, setPicketWidthInches] = useState<3.5 | 5.5>(5.5);
  const [gateCount, setGateCount] = useState<number>(1);
  const [wastePercentage, setWastePercentage] = useState<number>(5);

  // Live calculation
  const calculationResult = useMemo(() => {
    return calculateFenceMaterial({
      fenceLength,
      fenceHeightFeet,
      postSpacingFeet,
      picketWidthInches,
      gateCount,
      wastePercentage,
    });
  }, [fenceLength, fenceHeightFeet, postSpacingFeet, picketWidthInches, gateCount, wastePercentage]);

  const handleReset = () => {
    setFenceLength(150);
    setFenceHeightFeet(6);
    setPostSpacingFeet(8);
    setPicketWidthInches(5.5);
    setGateCount(1);
    setWastePercentage(5);
  };

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: category?.name ?? 'Fencing & Decking', href: category?.hubPath ?? '/projects/fencing-decking' },
    { label: metadata?.name ?? 'Wood Privacy Fence Calculator' },
  ];

  const explanationSteps: CalculationStep[] = useMemo(() => {
    if (!calculationResult.success) return [];
    const out = calculationResult.outputs;

    return [
      {
        stepNumber: 1,
        title: 'Calculate Fence Sections & 4x4 Posts',
        description: 'Divide fence run by post spacing to determine bay sections. Add 1 for the terminal end post, plus 2 dedicated hinge/latch posts per walk gate.',
        formulaDisplay: (
          <span>
            Sections: ceil({fenceLength}&apos; ÷ {postSpacingFeet}&apos;) = <strong>{out.sectionCount} bays</strong> • Base Posts:{' '}
            {out.sectionCount} + 1 = {out.sectionCount + 1} posts + Gate Posts: ({gateCount} gates × 2 = {gateCount * 2} posts) ={' '}
            <strong className="text-[#b8532b]">{out.postsToPurchase} total 4x4 posts</strong>
          </span>
        ),
      },
      {
        stepNumber: 2,
        title: 'Compute Horizontal 2x4 Backer Rails',
        description:
          fenceHeightFeet <= 4
            ? 'Planning assumption: 2 horizontal rails per section (top and bottom) for 4-foot fences.'
            : 'Planning assumption: 3 horizontal rails per section (top, middle, bottom) for 6-foot and 8-foot privacy fences.',
        formulaDisplay: (
          <span>
            {out.sectionCount} sections × {out.railCountPerSection} rails/section ={' '}
            <strong className="text-[#b8532b]">{out.railsToPurchase} backer rails (2x4x{postSpacingFeet}&apos;)</strong>
          </span>
        ),
      },
      {
        stepNumber: 3,
        title: 'Calculate Vertical Pickets & Cut Allowance',
        description: 'Determine picket count from total fence run in inches divided by picket width (5.5" or 3.5"), plus cut waste buffer.',
        formulaDisplay: (
          <span>
            ({fenceLength}&apos; × 12&quot;) ÷ {picketWidthInches}&quot; = {Math.round((fenceLength * 12) / picketWidthInches)} exact pickets × (1 + {wastePercentage / 100}) ={' '}
            <strong className="text-[#b8532b]">{out.picketsToPurchase} dog-ear pickets (1x6x{fenceHeightFeet}&apos;)</strong>
          </span>
        ),
      },
      {
        stepNumber: 4,
        title: 'Planning Concrete Allowance per Post Hole',
        description: 'Planning benchmark: 1.5 sixty-pound bags of pre-mix per post hole. Actual volume varies by hole diameter, depth, frost line, and soil.',
        formulaDisplay: (
          <span>
            {out.postsToPurchase} posts × 1.5 bags/post ={' '}
            <strong className="text-[#b8532b]">{out.concrete60lbBagsToPurchase} bags (60-lb concrete mix)</strong>
          </span>
        ),
      },
    ];
  }, [calculationResult, fenceLength, postSpacingFeet, gateCount, fenceHeightFeet, picketWidthInches, wastePercentage]);

  const practicalTips: PracticalTipItem[] = [
    {
      title: 'Call 811 (Call Before You Dig) 48 Hours Before Digging',
      desc: 'Utility companies mark buried gas lines, electrical cables, water mains, and telecommunications for free. Striking an underground line is dangerous, illegal, and costly.',
      icon: PhoneCall,
    },
    {
      title: 'Confirm Property Line Setbacks and Zoning Regulations',
      desc: 'Verify boundary survey pins and municipal setback restrictions. Many municipalities restrict front yard fences to 4 feet and require finished "good" sides to face outward toward neighbors.',
      icon: MapPin,
    },
    {
      title: 'Set Gate Posts in Extra Concrete with 4-Inch Gravel Drainage',
      desc: 'Gate posts bear dynamic swinging loads. Embed gate posts 6 inches deeper than line posts and pour 3 inches of crushed stone at the bottom of the hole to protect end grain.',
      icon: DoorOpen,
    },
    {
      title: 'Maintain 2 Inches of Clearance Above Soil Level',
      desc: 'Keep bottom picket ends at least 2 inches above the lawn and mulch beds to prevent moisture wicking, rot, weed-trimmer damage, and premature mildew.',
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
          title={metadata?.name ?? 'Wood Privacy Fence Calculator'}
          categoryName={category?.name ?? 'Fencing & Decking'}
          description="Calculate 4x4 posts, 2x4 horizontal backer rails, dog-ear pickets, walk-gate allowances, and post concrete bags for residential privacy fencing."
          targetIntent={metadata?.targetIntent}
        />

        {/* Dedicated Concrete Post Hole Cross-Link Banner */}
        <div className="mb-8 rounded-lg border border-[#e3ded4] bg-[#faf8f5] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#b8532b]">
              Need Exact Hole Sizing & Soil Depth?
            </span>
            <p className="text-xs text-[#57534e]">
              Need to examine individual post-hole concrete requirements, custom depths, or hole diameters? Open the Concrete Post Hole Calculator.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate?.('/calculators/concrete-post-hole-calculator')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#b8532b] bg-[#ffffff] text-[#b8532b] font-mono text-xs font-bold hover:bg-[#b8532b] hover:text-[#ffffff] transition-colors shrink-0"
          >
            <span>Open Post Hole Tool</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
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
                      Fence Layout & Lumber Specs
                    </h2>
                    <span className="text-[11px] text-[#78716c]">
                      Length, height, post spacing & gate count
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
                {/* 1. Fence Run Length */}
                <CalculatorInput
                  id="fence-length"
                  label="Total Fence Run Length"
                  value={fenceLength}
                  onChange={setFenceLength}
                  unit="linear ft"
                  min={8}
                  max={5000}
                  step={1}
                  required
                />

                {/* 2. Height & Spacing Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CalculatorSelect
                    id="fence-height"
                    label="Fence Height"
                    value={fenceHeightFeet.toString()}
                    onChange={(val) => setFenceHeightFeet(Number(val) as 4 | 6 | 8)}
                    options={[
                      { label: '6 Foot (Standard Privacy)', value: '6' },
                      { label: '4 Foot (Garden / Front)', value: '4' },
                      { label: '8 Foot (Tall Privacy)', value: '8' },
                    ]}
                  />

                  {/* Post Spacing Highlight */}
                  <CalculatorSelect
                    id="post-spacing"
                    label="Post Spacing On-Center"
                    value={postSpacingFeet.toString()}
                    onChange={(val) => setPostSpacingFeet(Number(val) as 6 | 8)}
                    options={[
                      { label: '8 Feet (Standard)', value: '8' },
                      { label: '6 Feet (High Wind / Sturdier)', value: '6' },
                    ]}
                  />
                </div>

                <p className="text-[11px] text-[#78716c] font-mono leading-relaxed bg-[#f7f5f0] p-2.5 rounded border border-[#e3ded4]">
                  <strong>Post Spacing Impact:</strong> Changing post spacing changes the number of posts, backer rails, and related concrete requirements. 8-foot spacing uses standard lumber; 6-foot spacing provides higher wind resistance.
                </p>

                {/* 3. Picket Width & Gate Count */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CalculatorSelect
                    id="picket-width"
                    label="Picket Width"
                    value={picketWidthInches.toString()}
                    onChange={(val) => setPicketWidthInches(Number(val) as 3.5 | 5.5)}
                    options={[
                      { label: '5-1/2" (Standard 1x6)', value: '5.5' },
                      { label: '3-1/2" (Narrow 1x4)', value: '3.5' },
                    ]}
                  />

                  <div className="space-y-1.5">
                    <CalculatorInput
                      id="gate-count"
                      label="Walk Gates"
                      value={gateCount}
                      onChange={setGateCount}
                      unit="gates"
                      min={0}
                      max={10}
                      step={1}
                    />
                    <span className="text-[10px] text-[#78716c] block">
                      +2 dedicated posts per walk gate
                    </span>
                  </div>
                </div>

                {/* 4. Waste / Cut Factor */}
                <WasteSelector
                  value={wastePercentage}
                  onChange={setWastePercentage}
                  options={metadata.wasteOptions}
                  title="Picket Cut & Split Reserve Allowance"
                  customLabel="Allowance"
                  principleNote="Wood pickets can warp, split during nailing, or crack when trimmed. 5% covers standard cutting scrap; 10% provides reserve spares for future storm repairs."
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Output Takeoff & Centered BOM */}
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
                          label="4x4 Posts"
                          value={out.postsToPurchase}
                          unit="posts"
                          subtext={`Inc. ${gateCount * 2} gate posts`}
                          variant="primary"
                        />
                        <ResultMetric
                          label="2x4 Rails"
                          value={out.railsToPurchase}
                          unit="rails"
                          subtext={`${out.railCountPerSection} rails/section`}
                          variant="primary"
                        />
                        <ResultMetric
                          label="Pickets"
                          value={out.picketsToPurchase}
                          unit="pickets"
                          subtext={`${picketWidthInches}" dog-ear`}
                          variant="primary"
                        />
                        <ResultMetric
                          label="Concrete Mix"
                          value={out.concrete60lbBagsToPurchase}
                          unit="bags"
                          subtext="60-lb mix bags"
                          variant="primary"
                        />
                      </div>

                      {/* Run overview card */}
                      <div className="rounded bg-[#f7f5f0] p-3 border border-[#e3ded4] flex items-center justify-between text-xs text-[#57534e]">
                        <div>
                          <strong>Project Scope:</strong> {fenceLength} ft run • {fenceHeightFeet} ft height • {out.sectionCount} sections at {postSpacingFeet}&apos; post spacing
                        </div>
                        <span className="font-mono font-bold text-[#b8532b]">
                          {gateCount} Gate{gateCount === 1 ? '' : 's'} Included
                        </span>
                      </div>
                    </div>

                    {/* CENTERPIECE BILL OF MATERIALS */}
                    <div className="space-y-2">
                      <BillOfMaterialsTable items={calculationResult.billOfMaterials} />
                      <p className="text-[11px] font-mono text-[#78716c] px-1">
                        * Quantities represent commercial purchase units rounded up. Fasteners (3" exterior deck screws and 1-5/8" picket nails), gate hinges/latches, and post caps are estimated separately.
                      </p>
                    </div>

                    {/* COST ESTIMATE RANGE */}
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
                  {calculationResult.errors[0]?.message ?? 'Please check your inputs and ensure fence length is a positive number.'}
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
              title="Mathematical Breakdown: How Fence Materials are Calculated"
              subtitle="Linear Run to Posts, Rails, Pickets & Footing Concrete"
              steps={explanationSteps}
            />

            {/* Assumptions & Boundaries */}
            <AssumptionsList
              assumptions={calculationResult.assumptions}
              notices={calculationResult.notices}
              limitations={[
                'Sloped Ground Terrain: Building across uneven or sloping ground requires stepped sections or racked pickets, which often demands longer 9-foot or 10-foot posts.',
                'Gate Hardware Exclusions: Heavy-duty galvanized T-hinges, self-closing latches, anti-sag turnbuckle cable kits, and gate stop lumber are not included in lumber counts.',
                'Post Hole Concrete Depth: Standard estimate assumes 1.5 sixty-pound bags per hole (approx 24" depth). Northern freeze/thaw zones requiring 36" to 48" frost-depth footings will require 2.5 to 3.5 bags per post.',
              ]}
              scopeTitle="Code & Field Scope Boundaries"
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
                    How to Calculate Fence Materials: Posts, Rails, Pickets, and Concrete
                  </h3>
                  <p className="text-xs sm:text-sm text-[#57534e] mt-1 max-w-xl leading-relaxed">
                    Learn how to calculate post bays, rail quantities by fence height, picket spacing allowances, gate post isolation, and footing concrete bags without running short.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('/guides/how-to-calculate-fence-materials')}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded text-xs font-mono font-semibold bg-[#b8532b] text-white hover:bg-[#a04422] transition-colors shrink-0 shadow-xs"
              >
                <span>Read Planning Guide</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Practical Tips */}
            <PracticalTips
              title="Practical Field Tips for Building Wood Privacy Fences"
              subtitle="Fencing Contractor Guidelines"
              tips={practicalTips}
            />

            {/* Related Tools */}
            <RelatedTools currentCalculatorId="fence-material-calculator" onNavigate={onNavigate} />
          </div>
        )}
      </Container>
    </div>
  );
};

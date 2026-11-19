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

import { calculateGravel } from '../../scripts/calculators/gravel.ts';
import { CALCULATORS } from '../../data/calculators.ts';
import { CATEGORIES } from '../../data/categories.ts';
import {
  RotateCcw,
  SlidersHorizontal,
  Truck,
  Package,
  Layers,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  Info,
  Scale,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

interface GravelCalculatorPageProps {
  onNavigate?: (path: string) => void;
}

export const GravelCalculatorPage: React.FC<GravelCalculatorPageProps> = ({ onNavigate }) => {
  const metadata = CALCULATORS['gravel-calculator'];
  const category = CATEGORIES['landscaping'];

  // Form State
  const [gravelLength, setGravelLength] = useState<number>(20);
  const [gravelWidth, setGravelWidth] = useState<number>(10);
  const [gravelDepthInches, setGravelDepthInches] = useState<number>(4);
  const [stoneType, setStoneType] = useState<'crushed-stone' | 'pea-gravel' | 'dense-grade' | 'decomposed-granite'>('crushed-stone');
  const [wastePercentage, setWastePercentage] = useState<number>(10);

  // Live calculation
  const calculationResult = useMemo(() => {
    return calculateGravel({
      gravelLength,
      gravelWidth,
      gravelDepthInches,
      stoneType,
      wastePercentage,
    });
  }, [gravelLength, gravelWidth, gravelDepthInches, stoneType, wastePercentage]);

  const handleReset = () => {
    setGravelLength(20);
    setGravelWidth(10);
    setGravelDepthInches(4);
    setStoneType('crushed-stone');
    setWastePercentage(10);
  };

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: category?.name ?? 'Landscaping & Groundwork', href: category?.hubPath ?? '/projects/landscaping-groundwork' },
    { label: metadata?.name ?? 'Gravel & Crushed Stone Calculator' },
  ];

  const stoneTypeOptions = [
    { value: 'crushed-stone', label: 'Crushed Stone / #57 Gravel (Approx 1.40 tons/yd³)', description: 'Angular fractured limestone or granite for drainage and base' },
    { value: 'pea-gravel', label: 'Pea Gravel / River Rock (Approx 1.45 tons/yd³)', description: 'Smooth, rounded decorative stone for pathways and dog runs' },
    { value: 'dense-grade', label: 'Dense Grade / Crusher Run (Approx 1.55 tons/yd³)', description: 'Crushed stone blended with stone dust for high compaction' },
    { value: 'decomposed-granite', label: 'Decomposed Granite / Screenings (Approx 1.40 tons/yd³)', description: 'Fine granite particles for firm rustic garden walkways' },
  ];

  const explanationSteps: CalculationStep[] = useMemo(() => {
    if (!calculationResult.success) return [];
    const out = calculationResult.outputs;

    return [
      {
        stepNumber: 1,
        title: 'Calculate Surface Area',
        description: 'Multiply footprint length by width in feet to obtain the net ground coverage.',
        formulaDisplay: (
          <span>
            {gravelLength} ft × {gravelWidth} ft = <strong>{out.areaSqFt} sq ft net</strong>
          </span>
        ),
      },
      {
        stepNumber: 2,
        title: 'Convert Depth to Cubic Volume',
        description: 'Multiply area by depth converted to feet (inches ÷ 12) and divide by 27 to obtain cubic yards.',
        formulaDisplay: (
          <span>
            {out.areaSqFt} sq ft × ({gravelDepthInches}" ÷ 12) ÷ 27 ={' '}
            <strong>{out.geometricVolumeCuYds} cu yds geometric</strong> ({out.geometricVolumeCuFt} cu ft)
          </span>
        ),
      },
      {
        stepNumber: 3,
        title: 'Apply Compaction & Settling Allowance',
        description: 'Gravel compacts into subgrade soil under foot or vehicle traffic. Adding the buffer ensures required thickness.',
        formulaDisplay: (
          <span>
            {out.geometricVolumeCuYds} cu yds × (1 + {wastePercentage / 100}) ={' '}
            <strong>{out.recommendedVolumeCuYds} cu yds recommended</strong>
          </span>
        ),
      },
      {
        stepNumber: 4,
        title: 'Apply Material Bulk Density for Quarry Tonnage',
        description: `Multiply cubic yards by the stone density (${out.stoneDensityTonsPerYard} tons/yd³) to determine order weight.`,
        formulaDisplay: (
          <span className="text-[#b8532b]">
            {out.recommendedVolumeCuYds} cu yds × {out.stoneDensityTonsPerYard} tons/yd³ ={' '}
            <strong>{out.estimatedTons} US Tons</strong> (or {out.bags50lbToPurchase} 50-lb retail bags)
          </span>
        ),
      },
    ];
  }, [calculationResult, gravelLength, gravelWidth, gravelDepthInches, wastePercentage]);

  const practicalTips: PracticalTipItem[] = [
    {
      title: 'Measure Installed Depth Carefully',
      desc:
        'Gravel quantities change substantially with depth. A 4-inch depth requires exactly double the material of a 2-inch depth. Establish string lines or grade stakes before ordering.',
      icon: Scale,
    },
    {
      title: 'Quarries Bill by Certified Scale Weight, Not Volume',
      desc:
        'Aggregate quarries weigh delivery dump trucks on certified scale platforms when entering and exiting. Delivered weight can fluctuate with rain moisture absorbed in the quarry stockpile.',
      icon: Truck,
    },
    {
      title: 'Check Overhead Clearances for Dump Truck Delivery',
      desc:
        'Tri-axle dump trucks require 15 to 20 feet of vertical clearance when raising the dump bed. Check for overhead power lines, tree branches, and driveway slope before requesting bulk delivery.',
      icon: AlertTriangle,
    },
    {
      title: 'Differentiate Loose Depth from Compacted Depth',
      desc:
        'Dense-graded aggregate (crusher run) compacts 10% to 15% when tamped with a vibrating plate compactor. Account for this reduction if building a firm subbase for pavers or vehicles.',
      icon: Layers,
    },
  ];

  return (
    <div className="py-6 sm:py-10">
      <Container>
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />

        {/* Page Header */}
        <CalculatorHeader
          title={metadata?.name ?? 'Gravel & Crushed Stone Calculator'}
          categoryName={category?.name ?? 'Landscaping & Grounds'}
          description="Calculate cubic yards, US tons, and 50-lb retail bags for driveways, walkways, drainage trenches, and patio bases, with material density and compaction allowances."
          targetIntent={metadata?.targetIntent}
        />

        {/* Main Interactive Estimating Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* LEFT COLUMN: Dimensions & Density Inputs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-lg border border-[#e3ded4] bg-[#ffffff] p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#e3ded4] pb-3 mb-5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-[#f7f5f0] border border-[#e3ded4] text-[#b8532b]">
                    <SlidersHorizontal className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#1c1917]">
                      Project Dimensions & Stone Type
                    </h2>
                    <span className="text-[11px] text-[#78716c]">
                      Coverage dimensions, installed depth & aggregate density
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
                {/* 1. Dimensions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CalculatorInput
                    id="gravel-length"
                    label="Length"
                    value={gravelLength}
                    onChange={setGravelLength}
                    unit="ft"
                    min={1}
                    max={1000}
                    step={0.5}
                    required
                  />

                  <CalculatorInput
                    id="gravel-width"
                    label="Width"
                    value={gravelWidth}
                    onChange={setGravelWidth}
                    unit="ft"
                    min={1}
                    max={200}
                    step={0.5}
                    required
                  />
                </div>

                {/* 2. PROMINENT DEPTH INPUT */}
                <div className="rounded-lg bg-[#fcf4ee] p-4 border border-[#ecd9cb] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase text-[#b8532b]">
                      Installed Depth (Key Quantity Driver)
                    </span>
                    <span className="text-[11px] font-mono text-[#78716c]">
                      Walkway: 2–3&quot; • Driveway: 4–6&quot;
                    </span>
                  </div>

                  <CalculatorInput
                    id="gravel-depth"
                    label="Target Compacted Depth"
                    value={gravelDepthInches}
                    onChange={setGravelDepthInches}
                    unit="inches"
                    min={1}
                    max={24}
                    step={0.5}
                    description="Gravel quantities change substantially with depth. Enter your target compacted/installed depth; the compaction allowance adds volume so the layer settles to this depth."
                    required
                  />
                </div>

                {/* 3. Stone Material & Density Selector */}
                <CalculatorSelect
                  id="stone-type"
                  label="Aggregate Material & Density"
                  value={stoneType}
                  onChange={(val) => setStoneType(val as any)}
                  options={stoneTypeOptions}
                  description="Aggregate bulk weight varies by rock mineralogy, moisture, and particle size gradation."
                  required
                />

                {/* 4. Compaction Allowance */}
                <WasteSelector
                  value={wastePercentage}
                  onChange={setWastePercentage}
                  options={metadata.wasteOptions}
                  title="Compaction & Subgrade Settling Allowance"
                  customLabel="Buffer"
                  principleNote="Angular crushed stone settles into subgrade dirt and interlocks under mechanical tamping. A 10% allowance ensures you maintain desired finished grade."
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Output Results & Purchasing Comparison */}
          <div className="lg:col-span-7 space-y-6" aria-live="polite">
            {calculationResult.success ? (
              (() => {
                const out = calculationResult.outputs;

                return (
                  <>
                    {/* Primary Commercial Metrics Highlight */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <ResultMetric
                          label="Estimated Bulk Weight"
                          value={out.estimatedTons}
                          unit="US tons"
                          subtext={`Planning delivery estimate (~${(out.estimatedTons * 2000).toLocaleString()} lbs)`}
                          variant="primary"
                        />
                        <ResultMetric
                          label="Recommended Volume"
                          value={out.recommendedVolumeCuYds}
                          unit="cu yds"
                          subtext={`Geometric: ${out.geometricVolumeCuYds} cu yds (${out.geometricVolumeCuFt} cu ft)`}
                          variant="primary"
                        />
                      </div>

                      {/* Secondary Metrics Bar */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        <ResultMetric
                          label="Surface Area"
                          value={out.areaSqFt}
                          unit="sq ft"
                          subtext={`${gravelLength}' × ${gravelWidth}' footprint`}
                        />
                        <ResultMetric
                          label="Installed Depth"
                          value={out.gravelDepthInches}
                          unit="inches"
                          subtext={`Finished thickness`}
                        />
                        <ResultMetric
                          label="Stone Density"
                          value={out.stoneDensityTonsPerYard}
                          unit="tons/yd³"
                          subtext="Planning benchmark"
                        />
                        <ResultMetric
                          label="50-lb Retail Bags"
                          value={out.bags50lbToPurchase}
                          unit="bags"
                          subtext="Small DIY patches"
                        />
                      </div>
                    </div>

                    {/* BULK VS BAGGED PURCHASING COMPARISON */}
                    <div className="rounded-lg border border-[#e3ded4] bg-[#ffffff] p-5 shadow-xs space-y-4">
                      <div className="flex items-center gap-2 border-b border-[#e3ded4] pb-3">
                        <div className="p-1 rounded bg-[#fcf4ee] text-[#b8532b]">
                          <Scale className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#1c1917]">
                            Purchasing Channel Comparison: Bulk Quarry vs Retail Bags
                          </h3>
                          <span className="text-[11px] text-[#78716c]">
                            Evaluate delivery fees, minimum orders, and physical handling
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Bulk Delivery Option */}
                        <div className="rounded-lg border border-[#c5d8ea] bg-[#f4f8fc] p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 font-bold text-xs font-mono text-[#1e3a5f]">
                              <Truck className="h-4 w-4 text-[#1e3a5f]" />
                              <span>Bulk Delivery (Dump Truck)</span>
                            </div>
                            <span className="text-[10px] font-mono uppercase bg-[#ffffff] px-1.5 py-0.5 rounded border border-[#c5d8ea] text-[#1e3a5f]">
                              Best for &gt; 1.5 Tons
                            </span>
                          </div>

                          <div className="text-xl font-mono font-bold text-[#1e3a5f]">
                            {out.estimatedTons} <span className="text-sm font-normal">Tons</span> / {out.recommendedVolumeCuYds} <span className="text-sm font-normal">Cu Yds</span>
                          </div>

                          <ul className="text-[11px] text-[#33557a] space-y-1 list-disc list-inside leading-relaxed">
                            <li>Delivered by landscape supplier or quarry dump truck.</li>
                            <li>Significantly lower price per ton for medium-to-large projects.</li>
                            <li>Requires clear driveway space and check for overhead utility wires.</li>
                          </ul>
                        </div>

                        {/* Retail Bagged Option */}
                        <div className="rounded-lg border border-[#e3ded4] bg-[#f7f5f0] p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 font-bold text-xs font-mono text-[#57534e]">
                              <Package className="h-4 w-4 text-[#57534e]" />
                              <span>Retail Bagged (50-lb Bags)</span>
                            </div>
                            <span className="text-[10px] font-mono uppercase bg-[#ffffff] px-1.5 py-0.5 rounded border border-[#e3ded4] text-[#57534e]">
                              Best for Small Jobs
                            </span>
                          </div>

                          <div className="text-xl font-mono font-bold text-[#1c1917]">
                            {out.bags50lbToPurchase} <span className="text-sm font-normal">Bags</span>
                          </div>

                          <ul className="text-[11px] text-[#57534e] space-y-1 list-disc list-inside leading-relaxed">
                            <li>Sold in 50-lb bags at retail home centers.</li>
                            <li>Total weight to haul: {(out.bags50lbToPurchase * 50).toLocaleString()} lbs.</li>
                            <li>Convenient for small pathways or areas where dump trucks cannot dump.</li>
                          </ul>
                        </div>
                      </div>

                      <div className="rounded bg-[#f7f5f0] p-3 text-xs text-[#57534e] border border-[#e3ded4] leading-relaxed">
                        <strong>Procurement Advice:</strong> Compare supplier delivery fees, material price, minimum order size, and handling effort before choosing a purchase method. A single ton equals 40 bags of 50-lb stone, making retail transport in personal vehicles physically demanding beyond 20 to 30 bags.
                      </div>
                    </div>

                    {/* DYNAMIC DEPTH SENSITIVITY CALLOUT */}
                    <div className="rounded-lg border border-[#e3ded4] bg-[#ffffff] p-4 space-y-2">
                      <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#1c1917]">
                        Depth Impact at a Glance ({out.areaSqFt} sq ft footprint)
                      </h4>
                      <p className="text-xs text-[#57534e] leading-relaxed">
                        At your selected <strong>{gravelDepthInches} inches</strong>, the project requires <strong>{out.recommendedVolumeCuYds} cubic yards ({out.estimatedTons} tons)</strong>.
                        {gravelDepthInches !== 2 && (
                          <span> At a decorative 2-inch pathway depth, this same area would require only {((out.areaSqFt * (2 / 12) / 27) * (1 + wastePercentage / 100)).toFixed(2)} cubic yards.</span>
                        )}
                        {gravelDepthInches !== 4 && (
                          <span> At a standard 4-inch base depth, this area requires {((out.areaSqFt * (4 / 12) / 27) * (1 + wastePercentage / 100)).toFixed(2)} cubic yards.</span>
                        )}
                        {gravelDepthInches !== 6 && (
                          <span> At a heavy 6-inch driveway depth, this area requires {((out.areaSqFt * (6 / 12) / 27) * (1 + wastePercentage / 100)).toFixed(2)} cubic yards.</span>
                        )}
                      </p>
                    </div>

                    {/* Planning Notice */}
                    <div className="rounded border border-[#e3ded4] bg-[#ffffff] p-3.5 text-xs text-[#57534e] space-y-1">
                      <div className="flex items-center gap-1.5 font-mono font-bold text-[#1c1917]">
                        <ShieldAlert className="h-4 w-4 text-[#b8532b]" />
                        <span>Planning & Material Procurement Disclaimer</span>
                      </div>
                      <p className="text-[11px] text-[#78716c] leading-relaxed">
                        Bulk density values (e.g. 1.40 tons/yd³ for crushed stone) are standard aggregate planning benchmarks. Natural rock density varies by geology, moisture content, and compaction. Actual tonnage billed at a quarry scale may differ from theoretical volume estimates.
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
              title="Mathematical Breakdown: How Gravel Tonnage is Calculated"
              subtitle="Area to Depth to Volume to Bulk Weight"
              steps={explanationSteps}
            />

            {/* 2. Planning Assumptions & Boundary Notices */}
            <AssumptionsList
              assumptions={calculationResult.assumptions}
              notices={calculationResult.notices}
              limitations={[
                'Scale Weight vs Volume: Aggregate quarries sell by certified scale weight upon truck exit, not volumetric measurement. Water saturation from recent rain increases weight.',
                'Geotextile Underlayment: Landscape fabric or heavy woven geotextile separating subgrade dirt from gravel is not included in this rock calculation.',
                'Subbase Preparation: Excavation depth, soil grading, and edging borders must be planned separately.',
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
                    How Much Gravel Do I Need? Tonnage, Cubic Yards, and Compacted Depth
                  </h3>
                  <p className="text-xs sm:text-sm text-[#57534e] mt-1 max-w-xl leading-relaxed">
                    Convert driveway, walkway, or shed pad dimensions into cubic yards and tons. Learn bulk quarry pricing vs 50-lb retail bag thresholds and compaction allowances.
                  </p>
                </div>
              </div>
              <a
                href="/guides/how-much-gravel-do-i-need"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded text-xs font-mono font-semibold bg-[#b8532b] text-white hover:bg-[#a04422] transition-colors shrink-0 shadow-xs"
              >
                <span>Read Planning Guide</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* 3. Practical Field Tips */}
            <PracticalTips
              title="Practical Field Tips for Gravel & Crushed Stone Projects"
              subtitle="Contractor Advice"
              tips={practicalTips}
            />

            {/* 4. Related Project Calculators */}
            <RelatedTools currentCalculatorId="gravel-calculator" onNavigate={onNavigate} />
          </div>
        )}
      </Container>
    </div>
  );
};

export const GravelCalculatorIsland: React.FC = () => {
  const meta = CALCULATORS['gravel-calculator'];
  return (
    <CalculatorTrackerWrapper
      calculatorSlug="gravel-calculator"
      calculatorName={meta.name}
      projectCategory={meta.categoryId}
    >
      <GravelCalculatorPage />
    </CalculatorTrackerWrapper>
  );
};

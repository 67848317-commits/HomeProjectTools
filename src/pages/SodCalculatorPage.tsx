import React, { useState, useMemo } from 'react';
import { Breadcrumbs } from '../components/common/Breadcrumbs.tsx';
import { Container } from '../components/common/Container.tsx';
import { CalculatorHeader } from '../components/calculator/CalculatorHeader.tsx';
import { CalculatorInput } from '../components/calculator/CalculatorInput.tsx';
import { WasteSelector } from '../components/calculator/WasteSelector.tsx';
import { ResultMetric } from '../components/calculator/ResultMetric.tsx';
import { BillOfMaterialsTable } from '../components/calculator/BillOfMaterialsTable.tsx';
import { CostEstimateCard } from '../components/calculator/CostEstimateCard.tsx';
import { CalculationExplanation, type CalculationStep } from '../components/calculator/CalculationExplanation.tsx';
import { AssumptionsList } from '../components/calculator/AssumptionsList.tsx';
import { PracticalTips, type PracticalTipItem } from '../components/calculator/PracticalTips.tsx';
import { RelatedTools } from '../components/calculator/RelatedTools.tsx';

import { calculateSod } from '../scripts/calculators/sod.ts';
import { CALCULATORS } from '../data/calculators.ts';
import { CATEGORIES } from '../data/categories.ts';
import {
  RotateCcw,
  SlidersHorizontal,
  Trees,
  Truck,
  Package,
  Layers,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  Info,
  Clock,
  CheckCircle2,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

interface SodCalculatorPageProps {
  onNavigate?: (path: string) => void;
}

export const SodCalculatorPage: React.FC<SodCalculatorPageProps> = ({ onNavigate }) => {
  const metadata = CALCULATORS['sod-calculator'];
  const category = CATEGORIES['landscaping'];

  // Form State
  const [lawnLength, setLawnLength] = useState<number>(50);
  const [lawnWidth, setLawnWidth] = useState<number>(30);
  const [palletCoverage, setPalletCoverage] = useState<number>(450);
  const [wastePercentage, setWastePercentage] = useState<number>(8);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Live calculation
  const calculationResult = useMemo(() => {
    return calculateSod({
      lawnLength,
      lawnWidth,
      palletCoverageSqFt: palletCoverage,
      wastePercentage,
    });
  }, [lawnLength, lawnWidth, palletCoverage, wastePercentage]);

  const handleReset = () => {
    setLawnLength(50);
    setLawnWidth(30);
    setPalletCoverage(450);
    setWastePercentage(8);
  };

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: category?.name ?? 'Landscaping & Groundwork', href: category?.hubPath ?? '/projects/landscaping-groundwork' },
    { label: metadata?.name ?? 'Sod Roll & Pallet Calculator' },
  ];

  const explanationSteps: CalculationStep[] = useMemo(() => {
    if (!calculationResult.success) return [];
    const out = calculationResult.outputs;

    return [
      {
        stepNumber: 1,
        title: 'Calculate Net Lawn Square Footage',
        description: 'Multiply measured lawn length by width in feet to calculate true ground surface area.',
        formulaDisplay: (
          <span>
            {lawnLength} ft × {lawnWidth} ft = <strong>{out.netAreaSqFt} sq ft net</strong>
          </span>
        ),
      },
      {
        stepNumber: 2,
        title: 'Apply Perimeter Cut & Waste Allowance',
        description: 'Add a cutting buffer to account for trimming around curved borders, garden beds, trees, and sidewalks.',
        formulaDisplay: (
          <span>
            {out.netAreaSqFt} sq ft × (1 + {wastePercentage / 100}) ={' '}
            <strong className="text-[#b8532b]">{out.recommendedAreaSqFt} sq ft recommended</strong>
          </span>
        ),
      },
      {
        stepNumber: 3,
        title: 'Convert to Commercial Pallets',
        description: `Divide recommended area by your supplier's pallet yield (${palletCoverage} sq ft) and round upward to whole pallets.`,
        formulaDisplay: (
          <span>
            {out.recommendedAreaSqFt} sq ft ÷ {palletCoverage} sq ft/pallet ={' '}
            <strong>{out.palletsToPurchase} full pallet(s)</strong> ({out.purchasedSqFt} sq ft total coverage)
          </span>
        ),
      },
      {
        stepNumber: 4,
        title: 'Calculate Equivalent 10 sq ft Rolls',
        description: 'If purchasing loose pieces or patching, calculate equivalent 2 ft × 5 ft (10 sq ft) sod rolls.',
        formulaDisplay: (
          <span>
            {out.recommendedAreaSqFt} sq ft ÷ 10 sq ft/roll ={' '}
            <strong>{out.rollsEquivalent} individual rolls</strong>
          </span>
        ),
      },
    ];
  }, [calculationResult, lawnLength, lawnWidth, palletCoverage, wastePercentage]);

  const practicalTips: PracticalTipItem[] = [
    {
      title: 'Install & Water Promptly After Delivery',
      desc:
        "Follow the supplier's handling and installation guidance. Sod is a living, perishable agricultural crop where heat can build inside tightly stacked pallets. Suppliers typically recommend installing promptly after delivery and beginning watering as soon as the first section is laid.",
      icon: Clock,
    },
    {
      title: 'Stagger Roll Seams Like Brickwork',
      desc:
        'Lay rolls in a running-bond staggered pattern. Staggering seams prevents continuous lines that can catch runoff water and create erosion gullies before roots establish.',
      icon: Layers,
    },
    {
      title: 'Roll with a Water-Filled Lawn Roller',
      desc:
        'Rent a water-filled lawn roller from an equipment center and roll the entire lawn after laying. This presses sod roots into direct contact with loosened soil, eliminating air pockets that dry out roots.',
      icon: CheckCircle2,
    },
    {
      title: 'Confirm Pallet Weight & Delivery Placement',
      desc:
        'A single 450 sq ft pallet of fresh sod weighs between 1,500 and 3,000 lbs depending on soil moisture. Ask the forklift driver to place pallets close to the lawn without driving over delicate septic fields.',
      icon: Truck,
    },
  ];

  return (
    <div className="py-6 sm:py-10">
      <Container>
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />

        {/* Page Header */}
        <CalculatorHeader
          title={metadata?.name ?? 'Sod Roll & Pallet Calculator'}
          categoryName={category?.name ?? 'Landscaping & Grounds'}
          description="Calculate square footage, full commercial pallets, and 10 sq ft rolls needed to establish a fresh turfgrass lawn with perimeter cut and curve waste allowances."
          targetIntent={metadata?.targetIntent}
        />

        {/* Main Interactive Estimating Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* LEFT COLUMN: Lawn Dimensions & Waste */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-lg border border-[#e3ded4] bg-[#ffffff] p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#e3ded4] pb-3 mb-5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-[#f7f5f0] border border-[#e3ded4] text-[#b8532b]">
                    <SlidersHorizontal className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#1c1917]">
                      Lawn Dimensions & Waste Factor
                    </h2>
                    <span className="text-[11px] text-[#78716c]">
                      Measured lawn area & boundary curvature allowance
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
                {/* 1. Lawn Dimensions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CalculatorInput
                    id="lawn-length"
                    label="Lawn Length"
                    value={lawnLength}
                    onChange={setLawnLength}
                    unit="ft"
                    min={1}
                    max={1000}
                    step={1}
                    required
                  />

                  <CalculatorInput
                    id="lawn-width"
                    label="Lawn Width"
                    value={lawnWidth}
                    onChange={setLawnWidth}
                    unit="ft"
                    min={1}
                    max={500}
                    step={1}
                    required
                  />
                </div>

                {/* 2. Sod-Appropriate Waste Factor */}
                <WasteSelector
                  value={wastePercentage}
                  onChange={setWastePercentage}
                  options={metadata.wasteOptions}
                  title="Curved Border & Perimeter Cut Allowance"
                  customLabel="Allowance"
                  principleNote="Curved garden beds, tree wells, and angled sidewalk edges require cutting rolls to fit. An 8% allowance is standard for residential yards."
                />

                {/* 3. Advanced Pallet Packaging Configuration */}
                <div className="pt-2 border-t border-[#e3ded4]">
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center justify-between w-full text-xs font-mono text-[#57534e] hover:text-[#1c1917] transition-colors py-1"
                  >
                    <span>Pallet Specification Settings</span>
                    <span className="text-[#b8532b] font-bold">{showAdvanced ? '− Hide' : '+ Adjust'}</span>
                  </button>

                  {showAdvanced && (
                    <div className="mt-3 p-3.5 rounded bg-[#f7f5f0] border border-[#e3ded4] space-y-3">
                      <CalculatorInput
                        id="pallet-coverage"
                        label="Square Feet per Pallet"
                        value={palletCoverage}
                        onChange={setPalletCoverage}
                        unit="sq ft"
                        min={350}
                        max={600}
                        step={25}
                        description="US turf farms typically package 450 to 500 sq ft per pallet (approx 45 to 50 rolls)."
                      />
                      <p className="text-[11px] text-[#78716c] leading-relaxed">
                        Confirm exact pallet square footage with your local sod supplier prior to ordering, as farm harvesting machines vary.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Results & Commercial Ordering */}
          <div className="lg:col-span-7 space-y-6" aria-live="polite">
            {calculationResult.success ? (
              (() => {
                const out = calculationResult.outputs;
                const exactPallets = (out.recommendedAreaSqFt / out.palletCoverageSqFt).toFixed(2);
                const sparePalletSqFt = out.purchasedSqFt - Math.round(out.netAreaSqFt);
                const rollCoverageSqFt = out.rollsEquivalent * 10;
                const spareRollSqFt = rollCoverageSqFt - Math.round(out.netAreaSqFt);

                return (
                  <>
                    {/* Primary Commercial Metrics */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <ResultMetric
                          label="Full Sod Pallets"
                          value={out.palletsToPurchase}
                          unit="pallets"
                          subtext={`${out.purchasedSqFt} sq ft coverage (${exactPallets} exact pallets)`}
                          variant="primary"
                        />
                        <ResultMetric
                          label="Recommended Area"
                          value={out.recommendedAreaSqFt}
                          unit="sq ft"
                          subtext={`Net lawn: ${out.netAreaSqFt} sq ft (+${wastePercentage}% waste)`}
                          variant="primary"
                        />
                      </div>

                      {/* Secondary Metrics Bar */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        <ResultMetric
                          label="Net Lawn Area"
                          value={out.netAreaSqFt}
                          unit="sq ft"
                          subtext={`${lawnLength}' × ${lawnWidth}' ground`}
                        />
                        <ResultMetric
                          label="Equivalent Rolls"
                          value={out.rollsEquivalent}
                          unit="rolls"
                          subtext="10 sq ft each (2' × 5')"
                        />
                        <ResultMetric
                          label="Pallet Yield"
                          value={out.palletCoverageSqFt}
                          unit="sq ft/pallet"
                          subtext="Farm standard"
                        />
                        <ResultMetric
                          label="Estimated Spare"
                          value={sparePalletSqFt}
                          unit="sq ft"
                          subtext="Buffer coverage"
                        />
                      </div>
                    </div>

                    {/* SOD ORDERING PLANNING BLOCK */}
                    <div className="rounded-lg border border-[#e3ded4] bg-[#ffffff] p-5 shadow-xs space-y-4">
                      <div className="flex items-center gap-2 border-b border-[#e3ded4] pb-3">
                        <div className="p-1 rounded bg-[#fcf4ee] text-[#b8532b]">
                          <Truck className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#1c1917]">
                            Commercial Ordering: Pallets vs Individual Rolls
                          </h3>
                          <span className="text-[11px] text-[#78716c]">
                            Commercial packaging consequences and spare coverage
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Pallet Order Card */}
                        <div className="rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 font-bold text-xs font-mono text-[#166534]">
                              <Truck className="h-4 w-4 text-[#166534]" />
                              <span>Full Pallet Delivery</span>
                            </div>
                            <span className="text-[10px] font-mono uppercase bg-[#ffffff] px-1.5 py-0.5 rounded border border-[#bbf7d0] text-[#166534]">
                              Best for &gt; 400 Sq Ft
                            </span>
                          </div>

                          <div className="text-xl font-mono font-bold text-[#166534]">
                            {out.palletsToPurchase} <span className="text-sm font-normal">Pallet(s)</span>
                          </div>

                          <div className="text-xs text-[#166534] space-y-1">
                            <div>Total Coverage: <strong>{out.purchasedSqFt} sq ft</strong></div>
                            <div>Estimated Spare: <strong>{sparePalletSqFt} sq ft</strong> beyond net area</div>
                            <div className="text-[11px] text-[#33557a] pt-1">
                              Delivered by turf farm flatbed truck with forklift unload.
                            </div>
                          </div>
                        </div>

                        {/* Individual Roll Card */}
                        <div className="rounded-lg border border-[#e3ded4] bg-[#f7f5f0] p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 font-bold text-xs font-mono text-[#57534e]">
                              <Package className="h-4 w-4 text-[#57534e]" />
                              <span>Individual Sod Rolls</span>
                            </div>
                            <span className="text-[10px] font-mono uppercase bg-[#ffffff] px-1.5 py-0.5 rounded border border-[#e3ded4] text-[#57534e]">
                              Best for Small Patches
                            </span>
                          </div>

                          <div className="text-xl font-mono font-bold text-[#1c1917]">
                            {out.rollsEquivalent} <span className="text-sm font-normal">Rolls (2&apos; × 5&apos;)</span>
                          </div>

                          <div className="text-xs text-[#57534e] space-y-1">
                            <div>Total Coverage: <strong>{rollCoverageSqFt} sq ft</strong></div>
                            <div>Estimated Spare: <strong>{spareRollSqFt} sq ft</strong> beyond net area</div>
                            <div className="text-[11px] text-[#78716c] pt-1">
                              Available individually at garden centers; easy to haul in an SUV.
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Perishability Warning */}
                      <div className="rounded bg-[#fcf4ee] p-3.5 border border-[#ecd9cb] flex items-start gap-2.5">
                        <Clock className="h-5 w-5 text-[#b8532b] shrink-0 mt-0.5" />
                        <div className="text-xs text-[#57534e] space-y-1">
                          <span className="font-bold text-[#b8532b]">Perishable Agricultural Crop Notice:</span>
                          <p className="leading-relaxed text-[11px]">
                            Follow the supplier&apos;s handling and installation guidance. Sod is a living, perishable agricultural crop and is generally best installed promptly after delivery to prevent root drying. Have your ground fully graded and raked smooth before the delivery truck arrives.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Planning Notice */}
                    <div className="rounded border border-[#e3ded4] bg-[#ffffff] p-3.5 text-xs text-[#57534e] space-y-1">
                      <div className="flex items-center gap-1.5 font-mono font-bold text-[#1c1917]">
                        <ShieldAlert className="h-4 w-4 text-[#b8532b]" />
                        <span>Packaging & Material Benchmark Disclaimer</span>
                      </div>
                      <p className="text-[11px] text-[#78716c] leading-relaxed">
                        Packaging coverage standardly assumes 450 sq ft per pallet and 10 sq ft per individual roll. Packaging coverage varies by supplier. Confirm the actual roll or pallet coverage with your local sod farm before placing an order.
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
                  {calculationResult.errors[0]?.message ?? 'Please check your inputs and ensure all lawn dimensions are valid.'}
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
              title="Mathematical Breakdown: How Lawn Sod is Calculated"
              subtitle="Lawn Area to Waste to Pallets & Rolls"
              steps={explanationSteps}
            />

            {/* 2. Planning Assumptions & Boundary Notices */}
            <AssumptionsList
              assumptions={calculationResult.assumptions}
              notices={calculationResult.notices}
              limitations={[
                'Subsoil Preparation: Soil grading, tilling, rock clearing, starter fertilizer, and topsoil enrichment are not included in sod pallet counts.',
                'Irrigation Setup: In-ground sprinkler installation or hose placement must be tested and fully operational prior to sod arrival.',
                'Delivery Freight: Sod farm delivery freight and pallet deposit fees are billed separately by suppliers.',
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
                    How Much Sod Do I Need? Calculate Pallets, Rolls, and Lawn Area
                  </h3>
                  <p className="text-xs sm:text-sm text-[#57534e] mt-1 max-w-xl leading-relaxed">
                    Learn how to measure irregular yards, deduct non-lawn beds and patios, choose cutting waste buffers, and stage perishable sod delivery.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('/guides/how-much-sod-do-i-need')}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded text-xs font-mono font-semibold bg-[#b8532b] text-white hover:bg-[#a04422] transition-colors shrink-0 shadow-xs cursor-pointer"
              >
                <span>Read Planning Guide</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* 3. Practical Field Tips */}
            <PracticalTips
              title="Practical Field Tips for Laying Turfgrass Sod"
              subtitle="Lawn Care & Contractor Advice"
              tips={practicalTips}
            />

            {/* 4. Related Project Calculators */}
            <RelatedTools currentCalculatorId="sod-calculator" onNavigate={onNavigate} />
          </div>
        )}
      </Container>
    </div>
  );
};

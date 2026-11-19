import React, { useState, useMemo } from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs.tsx';
import { Container } from '../../components/common/Container.tsx';
import { CalculatorHeader } from '../../components/calculator/CalculatorHeader.tsx';
import { CalculatorInput } from '../../components/calculator/CalculatorInput.tsx';
import { WasteSelector } from '../../components/calculator/WasteSelector.tsx';
import { ResultMetric } from '../../components/calculator/ResultMetric.tsx';
import { BillOfMaterialsTable } from '../../components/calculator/BillOfMaterialsTable.tsx';
import { CostEstimateCard } from '../../components/calculator/CostEstimateCard.tsx';
import { CalculationExplanation, type CalculationStep } from '../../components/calculator/CalculationExplanation.tsx';
import { AssumptionsList } from '../../components/calculator/AssumptionsList.tsx';
import { PracticalTips, type PracticalTipItem } from '../../components/calculator/PracticalTips.tsx';
import { RelatedTools } from '../../components/calculator/RelatedTools.tsx';
import { CalculatorTrackerWrapper } from '../calculator/CalculatorTrackerWrapper.tsx';

import { calculateTopsoil } from '../../scripts/calculators/topsoil.ts';
import { CALCULATORS } from '../../data/calculators.ts';
import { CATEGORIES } from '../../data/categories.ts';
import {
  RotateCcw,
  SlidersHorizontal,
  Trees,
  HelpCircle,
  AlertTriangle,
  Package,
  Truck,
  Layers,
  Sprout,
  Droplets,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

interface TopsoilCalculatorPageProps {
  onNavigate?: (path: string) => void;
}

export const TopsoilCalculatorPage: React.FC<TopsoilCalculatorPageProps> = ({ onNavigate }) => {
  const metadata = CALCULATORS['topsoil-calculator'];
  const category = CATEGORIES['landscaping'];

  // Form State
  const [bedLength, setBedLength] = useState<number>(20);
  const [bedWidth, setBedWidth] = useState<number>(10);
  const [soilDepthInches, setSoilDepthInches] = useState<number>(4);
  const [wastePercentage, setWastePercentage] = useState<number>(10);

  // Live calculation
  const calculationResult = useMemo(() => {
    return calculateTopsoil({
      bedLength,
      bedWidth,
      soilDepthInches,
      wastePercentage,
    });
  }, [bedLength, bedWidth, soilDepthInches, wastePercentage]);

  const handleReset = () => {
    setBedLength(20);
    setBedWidth(10);
    setSoilDepthInches(4);
    setWastePercentage(10);
  };

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: category?.name ?? 'Landscaping & Groundwork', href: category?.hubPath ?? '/projects/landscaping-groundwork' },
    { label: metadata?.name ?? 'Topsoil & Garden Bed Calculator' },
  ];

  const explanationSteps: CalculationStep[] = useMemo(() => {
    if (!calculationResult.success) return [];
    const out = calculationResult.outputs;

    return [
      {
        stepNumber: 1,
        title: 'Calculate Surface Footprint Area',
        description: 'Multiply bed or lawn area length by width.',
        formulaDisplay: (
          <span>
            {bedLength}&apos; × {bedWidth}&apos; = <strong>{out.areaSqFt} sq ft surface coverage</strong>
          </span>
        ),
      },
      {
        stepNumber: 2,
        title: 'Calculate Geometric Volume from Final Installed Depth',
        description:
          'Convert depth in inches to fractional feet and multiply by surface area.',
        formulaDisplay: (
          <span>
            {out.areaSqFt} sq ft × ({soilDepthInches}&quot; ÷ 12) = {out.geometricVolumeCuFt} cu ft ÷ 27 ={' '}
            <strong>{out.geometricVolumeCuYds} cubic yards (geometric volume)</strong>
          </span>
        ),
      },
      {
        stepNumber: 3,
        title: 'Incorporate Organic Settling Allowance',
        description:
          'Screened topsoil and compost contain natural air pockets that compress 10% after initial deep watering and raking.',
        formulaDisplay: (
          <span>
            {out.geometricVolumeCuYds} cu yds × (1 + {wastePercentage / 100}) ={' '}
            <strong className="text-[#b8532b]">{out.recommendedVolumeCuYds} cubic yards planning requirement</strong>
          </span>
        ),
      },
      {
        stepNumber: 4,
        title: 'Determine Commercial Bulk vs Retail Bag Formats',
        description:
          'Convert total recommended cubic feet to bulk cubic yards or retail bags (0.75 cu ft / 1.0 cu ft).',
        formulaDisplay: (
          <span>
            Bulk: ceil({out.recommendedVolumeCuYds}) ={' '}
            <strong className="text-[#b8532b]">{Math.ceil(out.recommendedVolumeCuYds)} cubic yards</strong> • Bagged:{' '}
            {out.recommendedVolumeCuFt} cu ft ÷ 0.75 cu ft/bag ={' '}
            <strong className="text-[#b8532b]">{out.bags075cuftToPurchase} bags (0.75 cu ft)</strong> ({out.bags1cuftToPurchase} bags of 1.0 cu ft)
          </span>
        ),
      },
    ];
  }, [calculationResult, bedLength, bedWidth, soilDepthInches, wastePercentage]);

  const practicalTips: PracticalTipItem[] = [
    {
      title: 'Bulk Dump Truck Delivery vs Retail Bags Decision',
      desc: 'If your project requires more than 1 cubic yard (approx 36 bags of 0.75 cu ft), local landscape supply yards with dump truck delivery are almost always cheaper and spare your vehicle suspension from 1,500+ lbs of heavy soil.',
      icon: Truck,
    },
    {
      title: 'Enter Final Settled Depth, Not Loose Pour Depth',
      desc: 'Topsoil naturally settles by 10% to 15% after the first rainfall. Our calculation includes a dedicated organic settling buffer, so enter the final target depth you want in your garden bed.',
      icon: Layers,
    },
    {
      title: 'Moist Topsoil Weight Considerations',
      desc: 'One cubic yard of damp, screened topsoil weighs approximately 2,000 to 2,400 lbs (over 1 ton). A half-ton pickup truck bed can typically carry only 0.75 to 1.0 cubic yard safely in a single trip.',
      icon: Package,
    },
    {
      title: 'Screened Loam vs Fill Dirt',
      desc: 'For lawn leveling, seed beds, and vegetable gardens, always specify screened topsoil (loam) rather than unscreened fill dirt, which contains large rocks, heavy clay clumps, and weed roots.',
      icon: Sprout,
    },
  ];

  return (
    <div className="py-6 sm:py-10">
      <Container>
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />

        {/* Page Header */}
        <CalculatorHeader
          title={metadata?.name ?? 'Topsoil & Garden Bed Calculator'}
          categoryName={category?.name ?? 'Landscaping & Grounds'}
          description="Calculate bulk cubic yards and retail bags (0.75 cu ft / 1.0 cu ft) of topsoil or compost for raised garden beds, lawn top-dressing, and grading."
          targetIntent={metadata?.targetIntent}
        />

        {/* Depth Guidance Notice */}
        <div className="mb-8 rounded-lg border border-[#e3ded4] bg-[#faf8f5] p-4 flex items-start gap-3 text-xs text-[#57534e]">
          <HelpCircle className="h-5 w-5 text-[#b8532b] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-[#1c1917] font-semibold">Installed Depth Planning Notice:</strong> Enter the final installed depth you want after the soil is spread and settled. The engine includes an organic settling allowance to account for natural consolidation after watering. Typical benchmarks: Lawn top-dressing: 0.25"–0.5"; Flower beds & lawn repair: 2"–4"; New raised garden beds: 6"–12".
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
                      Bed Dimensions & Depth
                    </h2>
                    <span className="text-[11px] text-[#78716c]">
                      Length, width, settled depth & organic settling
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
                {/* 1. Bed Dimensions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CalculatorInput
                    id="bed-length"
                    label="Area Length"
                    value={bedLength}
                    onChange={setBedLength}
                    unit="ft"
                    min={1}
                    max={500}
                    step={0.5}
                    required
                  />

                  <CalculatorInput
                    id="bed-width"
                    label="Area Width"
                    value={bedWidth}
                    onChange={setBedWidth}
                    unit="ft"
                    min={1}
                    max={200}
                    step={0.5}
                    required
                  />
                </div>

                {/* 2. Soil Depth */}
                <CalculatorInput
                  id="soil-depth"
                  label="Final Installed Depth (After Settling)"
                  value={soilDepthInches}
                  onChange={setSoilDepthInches}
                  unit="in"
                  min={0.25}
                  max={36}
                  step={0.25}
                  description="Enter target depth after watering. Common: 3–4 inches for garden beds; 6–8 inches for vegetables."
                  required
                />

                {/* 3. Waste / Settling Allowance */}
                <WasteSelector
                  value={wastePercentage}
                  onChange={setWastePercentage}
                  options={metadata.wasteOptions}
                  title="Organic Soil Settling Allowance"
                  customLabel="Allowance"
                  principleNote="Accounts for soil compaction and void space reduction when loose topsoil is watered and raked. 10% is typical for screened loam."
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
                          label="Bulk Topsoil Needed"
                          value={out.recommendedVolumeCuYds}
                          unit="cu yds"
                          subtext={`${Math.ceil(out.recommendedVolumeCuYds)} full yards to order`}
                          variant="primary"
                        />
                        <ResultMetric
                          label="0.75 cu ft Bags"
                          value={out.bags075cuftToPurchase}
                          unit="bags"
                          subtext="Standard 40-lb retail bags"
                          variant="primary"
                        />
                        <ResultMetric
                          label="1.0 cu ft Bags"
                          value={out.bags1cuftToPurchase}
                          unit="bags"
                          subtext="Full 1 cubic foot bags"
                        />
                      </div>
                    </div>

                    {/* BULK VS BAGGED COMPARISON CARD */}
                    <div className="rounded-lg border-2 border-[#e3ded4] bg-[#ffffff] p-5 shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-[#e3ded4] pb-2">
                        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#1c1917]">
                          Commercial Purchasing Format Comparison
                        </h3>
                        <span className="text-[11px] font-mono text-[#78716c]">
                          {out.recommendedVolumeCuFt} cu ft total
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="p-4 rounded-lg border border-[#e3ded4] bg-[#faf8f5] space-y-2">
                          <div className="flex items-center gap-2 text-[#b8532b] font-mono font-bold uppercase text-[11px]">
                            <Truck className="h-4 w-4" />
                            <span>Bulk Delivery / Pickup</span>
                          </div>
                          <div className="font-mono text-2xl font-bold text-[#1c1917]">
                            {out.recommendedVolumeCuYds} <span className="text-xs font-normal">cu yds</span>
                          </div>
                          <p className="text-[#57534e] text-[11px] leading-relaxed">
                            Recommended when total need exceeds 1 cubic yard. Dump truck delivery drops directly onto driveway or tarp.
                          </p>
                        </div>

                        <div className="p-4 rounded-lg border border-[#e3ded4] bg-[#faf8f5] space-y-2">
                          <div className="flex items-center gap-2 text-[#1c1917] font-mono font-bold uppercase text-[11px]">
                            <Package className="h-4 w-4" />
                            <span>Retail Packaged Bags</span>
                          </div>
                          <div className="font-mono text-2xl font-bold text-[#1c1917]">
                            {out.bags075cuftToPurchase} <span className="text-xs font-normal">bags (0.75 cu ft)</span>
                          </div>
                          <p className="text-[#57534e] text-[11px] leading-relaxed">
                            Best for small garden touch-ups or sites with no dump truck access. 36 bags equal approximately 1 cubic yard.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* THREE-STAGE HIERARCHY BREAKDOWN */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-[#e3ded4] pb-2">
                        <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[#1c1917]">
                          Volume & Packaging Breakdown
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
                            <span className="text-[11px] text-[#78716c] font-mono">Geometric Volume</span>
                          </div>
                          <div className="text-xl sm:text-2xl font-mono font-bold text-[#1c1917] tabular-nums mb-1">
                            {out.geometricVolumeCuYds}{' '}
                            <span className="text-xs font-sans font-normal text-[#57534e]">cu yds</span>
                          </div>
                          <p className="text-xs text-[#57534e] leading-snug">
                            {out.areaSqFt} sq ft × {soilDepthInches}&quot; depth = {out.geometricVolumeCuFt} cu ft.
                          </p>
                        </div>

                        <div className="p-3.5 rounded border border-[#e3ded4] bg-[#ffffff]">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-mono font-bold uppercase text-[#1e3a5f] bg-[#edf3f9] px-1.5 py-0.5 rounded">
                              Stage 2
                            </span>
                            <span className="text-[11px] text-[#1e3a5f] font-mono">+{wastePercentage}% Settling</span>
                          </div>
                          <div className="text-xl sm:text-2xl font-mono font-bold text-[#1e3a5f] tabular-nums mb-1">
                            {out.recommendedVolumeCuYds}{' '}
                            <span className="text-xs font-sans font-normal text-[#57534e]">cu yds</span>
                          </div>
                          <p className="text-xs text-[#57534e] leading-snug">
                            {out.recommendedVolumeCuFt} cu ft including organic compaction allowance.
                          </p>
                        </div>

                        <div className="p-3.5 rounded border-2 border-[#b8532b] bg-[#fcf4ee]">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-mono font-bold uppercase text-[#b8532b] bg-[#ffffff] px-1.5 py-0.5 rounded border border-[#e3ded4]">
                              Stage 3
                            </span>
                            <span className="text-[11px] text-[#b8532b] font-mono font-semibold">Commercial Purchase</span>
                          </div>
                          <div className="text-xl sm:text-2xl font-mono font-bold text-[#b8532b] tabular-nums mb-1">
                            {Math.ceil(out.recommendedVolumeCuYds)}{' '}
                            <span className="text-xs font-sans font-normal text-[#b8532b]">cu yds</span>
                          </div>
                          <p className="text-xs text-[#57534e] leading-snug">
                            Or {out.bags075cuftToPurchase} retail 0.75 cu ft bags ({out.bags1cuftToPurchase} of 1.0 cu ft).
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* MATERIAL BILL OF MATERIALS */}
                    <div className="space-y-2">
                      <BillOfMaterialsTable items={calculationResult.billOfMaterials} />
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
                  {calculationResult.errors[0]?.message ?? 'Please check your inputs and ensure area dimensions and depth are positive numbers.'}
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
              title="Mathematical Breakdown: How Topsoil Quantities are Calculated"
              subtitle="Footprint to Settled Volume, Bulk Yards & Retail Bag Counts"
              steps={explanationSteps}
            />

            {/* Assumptions & Boundaries */}
            <AssumptionsList
              assumptions={calculationResult.assumptions}
              notices={calculationResult.notices}
              limitations={[
                'Weight and Vehicle Capacity: 1 cubic yard of moist screened topsoil weighs approximately 2,000 to 2,400 lbs. Check truck and trailer payload ratings before attempting self-pickup.',
                'Bulk Delivery Drops: Bulk material delivered by dump truck is unloaded in driveways or curbside. Transport from the drop zone to backyard garden beds with wheelbarrows must be planned.',
                'Subgrade Grading: Soil quantities calculated here assume a uniform, relatively level subgrade. Irregular low spots or deep ruts will demand additional volume.',
              ]}
              scopeTitle="Topsoil Scope & Material Boundaries"
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
                    How Much Topsoil Do I Need? Calculate Cubic Yards, Depth, and Bags
                  </h3>
                  <p className="text-xs sm:text-sm text-[#57534e] mt-1 max-w-xl leading-relaxed">
                    Learn how to measure bed square footage, specify final installed depth, account for organic settling, and evaluate bulk dump truck delivery versus retail bags.
                  </p>
                </div>
              </div>
              <a
                href="/guides/how-much-topsoil-do-i-need"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded text-xs font-mono font-semibold bg-[#b8532b] text-white hover:bg-[#a04422] transition-colors shrink-0 shadow-xs"
              >
                <span>Read Planning Guide</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Practical Tips */}
            <PracticalTips
              title="Practical Field Tips for Buying and Spreading Topsoil"
              subtitle="Landscape Professional Best Practices"
              tips={practicalTips}
            />

            {/* Related Tools */}
            <RelatedTools currentCalculatorId="topsoil-calculator" onNavigate={onNavigate} />
          </div>
        )}
      </Container>
    </div>
  );
};

export const TopsoilCalculatorIsland: React.FC = () => {
  const meta = CALCULATORS['topsoil-calculator'];
  return (
    <CalculatorTrackerWrapper
      calculatorSlug="topsoil-calculator"
      calculatorName={meta.name}
      projectCategory={meta.categoryId}
    >
      <TopsoilCalculatorPage />
    </CalculatorTrackerWrapper>
  );
};

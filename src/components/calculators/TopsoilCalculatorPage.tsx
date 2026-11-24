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

import { calculateTopsoil, type TopsoilPurchasingFormat } from '../../scripts/calculators/topsoil.ts';
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
  const [purchasingFormat, setPurchasingFormat] = useState<TopsoilPurchasingFormat>('bulk-yards');

  // Live calculation
  const calculationResult = useMemo(() => {
    return calculateTopsoil({
      bedLength,
      bedWidth,
      soilDepthInches,
      wastePercentage,
      purchasingFormat,
    });
  }, [bedLength, bedWidth, soilDepthInches, wastePercentage, purchasingFormat]);

  const handleReset = () => {
    setBedLength(20);
    setBedWidth(10);
    setSoilDepthInches(4);
    setWastePercentage(10);
    setPurchasingFormat('bulk-yards');
  };

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: category?.name ?? 'Landscaping & Groundwork', href: category?.hubPath ?? '/projects/landscaping-groundwork' },
    { label: metadata?.name ?? 'Topsoil & Garden Bed Calculator' },
  ];

  const fieldErrors = useMemo(() => {
    if (calculationResult.success) return {} as Record<string, string>;
    return Object.fromEntries(
      calculationResult.errors
        .filter((err) => err.field)
        .map((err) => [err.field as string, err.message])
    );
  }, [calculationResult]);

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
        title: 'Calculate Geometric Volume in Cubic Feet',
        description:
          'Convert target depth in inches to feet (depth ÷ 12) and multiply by surface area. Displayed values are rounded; internal calculations retain full precision.',
        formulaDisplay: (
          <span>
            {out.areaSqFt} sq ft × ({soilDepthInches}&quot; ÷ 12) ={' '}
            <strong>{out.geometricVolumeCuFt} cu ft</strong> (~{out.geometricVolumeCuYds} cu yds geometric)
          </span>
        ),
      },
      {
        stepNumber: 3,
        title: 'Apply Additional Volume Planning Allowance',
        description:
          `An additional ${out.wastePercentage}% planning allowance is applied to the geometric volume, then divided by 27 cu ft/yd³. Displayed values are rounded while internal calculations retain precision.`,
        formulaDisplay: (
          <span>
            {out.geometricVolumeCuFt} cu ft × (1 + {out.wastePercentage / 100}) ={' '}
            {out.recommendedVolumeCuFt} cu ft ÷ 27 ={' '}
            <strong className="text-[#b8532b]">{out.recommendedVolumeCuYds} cubic yards planning requirement</strong>
          </span>
        ),
      },
      {
        stepNumber: 4,
        title: 'Determine Commercial Bulk vs Retail Bag Formats',
        description:
          'Convert total planning cubic-foot volume into a whole-yard bulk order or full retail bags (0.75 cu ft priced option; 1.0 cu ft volume-only reference).',
        formulaDisplay: (
          <span>
            Bulk: ceil({out.recommendedVolumeCuYds}) ={' '}
            <strong className="text-[#b8532b]">{out.bulkCubicYardsToPurchase} whole cubic yards</strong> • Bagged:{' '}
            {out.recommendedVolumeCuFt} cu ft ÷ 0.75 cu ft/bag ={' '}
            <strong className="text-[#b8532b]">{out.bags075cuftToPurchase} bags (0.75 cu ft)</strong> ({out.bags1cuftToPurchase} bags of 1.0 cu ft, volume-only)
          </span>
        ),
      },
    ];
  }, [calculationResult, bedLength, bedWidth, soilDepthInches]);

  const practicalTips: PracticalTipItem[] = [
    {
      title: 'Comparing Bulk Yards vs Retail Bags',
      desc: 'One cubic yard equals thirty-six (36) 0.75 cu ft retail bags. Rather than relying on a single universal cutoff, switch between Bulk Cubic Yards and 0.75 cu ft Retail Bags above and weigh the material price difference against local dump truck delivery fees, supplier order minimums, and wheelbarrow access.',
      icon: Truck,
    },
    {
      title: 'Enter Target Finished Depth',
      desc: `Enter the finished depth you want in your garden bed. Because loose topsoil settles differently depending on moisture, texture, and tamping, the calculator applies your selected ${wastePercentage}% provisional planning allowance on top of geometric volume rather than assuming a fixed compaction rate.`,
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
            <strong className="text-[#1c1917] font-semibold">Target Depth &amp; Planning Allowance Notice:</strong> Enter the finished depth you want in your bed. An adjustable provisional planning allowance (10% default; configurable 0%–50%) is added to geometric volume to help buffer against loose soil settling and minor grade variations; actual settling varies by soil blend, moisture, and compaction. Typical target depths: Lawn top-dressing: 0.25&quot;–0.5&quot;; Flower beds &amp; lawn repair: 2&quot;–4&quot;; New raised garden beds: 6&quot;–12&quot;.
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
                      Length, width, target depth &amp; planning allowance
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
                    error={fieldErrors.bedLength}
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
                    error={fieldErrors.bedWidth}
                  />
                </div>

                {/* 2. Soil Depth */}
                <CalculatorInput
                  id="soil-depth"
                  label="Target Installed Depth"
                  value={soilDepthInches}
                  onChange={setSoilDepthInches}
                  unit="in"
                  min={0.25}
                  max={36}
                  step={0.25}
                  description="Enter desired finished depth (0.25–36 in). Common: 0.25–0.5 in top-dressing; 3–4 in garden beds; 6–8 in vegetables."
                  required
                  error={fieldErrors.soilDepthInches}
                />

                {/* 3. Waste / Settling Planning Allowance */}
                <div className="space-y-1.5">
                  <WasteSelector
                    value={wastePercentage}
                    onChange={setWastePercentage}
                    options={metadata.wasteOptions}
                    title="Provisional Planning / Settling Allowance"
                    customLabel="Allowance"
                    max={50}
                    principleNote="An adjustable additional volume allowance (10% default; 0%–50%) added once to geometric volume as a provisional planning buffer for loose soil settling and minor grading variations. Actual settling varies with soil composition, moisture, and tamping."
                  />
                  {fieldErrors.wastePercentage && (
                    <div role="alert" className="flex items-center gap-1.5 text-xs text-[#b91c1c] pt-0.5">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                      <span>{fieldErrors.wastePercentage}</span>
                    </div>
                  )}
                </div>

                {/* 4. Explicit Purchasing Format for Cost Estimate */}
                <div className="space-y-2 pt-2 border-t border-[#e3ded4]">
                  <div className="flex items-center justify-between">
                    <span className="block text-sm font-semibold text-[#1c1917]">
                      Cost Estimate Purchasing Format
                    </span>
                    <span className="text-[11px] font-mono text-[#78716c]">
                      Select 1 format
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPurchasingFormat('bulk-yards')}
                      aria-pressed={purchasingFormat === 'bulk-yards'}
                      className={`p-2.5 rounded border text-left transition-all ${
                        purchasingFormat === 'bulk-yards'
                          ? 'border-[#b8532b] bg-[#fcf4ee] ring-1 ring-[#b8532b] shadow-xs'
                          : 'border-[#c8c1b2] bg-[#ffffff] hover:border-[#a8a192] hover:bg-[#faf8f5]'
                      }`}
                    >
                      <span className="block text-xs font-bold text-[#1c1917]">
                        Bulk Cubic Yards
                      </span>
                      <span className="block text-[11px] text-[#57534e] mt-0.5">
                        Whole-yard increment (excl. freight)
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPurchasingFormat('bags-075')}
                      aria-pressed={purchasingFormat === 'bags-075'}
                      className={`p-2.5 rounded border text-left transition-all ${
                        purchasingFormat === 'bags-075'
                          ? 'border-[#b8532b] bg-[#fcf4ee] ring-1 ring-[#b8532b] shadow-xs'
                          : 'border-[#c8c1b2] bg-[#ffffff] hover:border-[#a8a192] hover:bg-[#faf8f5]'
                      }`}
                    >
                      <span className="block text-xs font-bold text-[#1c1917]">
                        0.75 cu ft Retail Bags
                      </span>
                      <span className="block text-[11px] text-[#57534e] mt-0.5">
                        Approx 40-lb home center bags
                      </span>
                    </button>
                  </div>
                  <p className="text-[11px] text-[#78716c] leading-relaxed">
                    Choose which format drives your Bill of Materials purchase order and Cost Estimate. Both options are alternative ways to fulfill the same volume, not combined purchases.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Results */}
          <div className="lg:col-span-7 space-y-6" aria-live="polite">
            {calculationResult.success ? (
              (() => {
                const out = calculationResult.outputs;
                const bulkBom = calculationResult.billOfMaterials.find((item) => item.id === 'topsoil-bulk-yards');
                const bagBom = calculationResult.billOfMaterials.find((item) => item.id === 'topsoil-bags-075');
                const isBulkSelected = out.selectedPurchasingFormat === 'bulk-yards';
                const selectedBomItem = (isBulkSelected ? bulkBom : bagBom) ?? calculationResult.billOfMaterials[0];
                const alternativeBomItem = isBulkSelected ? bagBom : bulkBom;

                return (
                  <>
                    {/* PRIMARY RESULTS */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <ResultMetric
                          label="Bulk Order (Whole Yards)"
                          value={out.bulkCubicYardsToPurchase}
                          unit="cu yds"
                          subtext={`${out.recommendedVolumeCuYds} cu yds planned`}
                          variant={isBulkSelected ? 'primary' : 'secondary'}
                        />
                        <ResultMetric
                          label="0.75 cu ft Retail Bags"
                          value={out.bags075cuftToPurchase}
                          unit="bags"
                          subtext={`${out.bags075cuftExact} exact (~40-lb bags)`}
                          variant={!isBulkSelected ? 'primary' : 'secondary'}
                        />
                        <ResultMetric
                          label="1.0 cu ft Bags"
                          value={out.bags1cuftToPurchase}
                          unit="bags"
                          subtext="Volume-only (not priced)"
                        />
                      </div>
                    </div>

                    {/* BULK VS BAGGED COMPARISON CARD */}
                    <div className="rounded-lg border-2 border-[#e3ded4] bg-[#ffffff] p-5 shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-[#e3ded4] pb-2">
                        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#1c1917]">
                          Alternative Purchasing Formats (Select 1 for Estimate)
                        </h3>
                        <span className="text-[11px] font-mono text-[#78716c]">
                          {out.recommendedVolumeCuFt} cu ft ({out.recommendedVolumeCuYds} yd³) planned
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <button
                          type="button"
                          onClick={() => setPurchasingFormat('bulk-yards')}
                          className={`p-4 rounded-lg border text-left space-y-2 transition-all ${
                            isBulkSelected
                              ? 'border-[#b8532b] bg-[#fcf4ee] ring-1 ring-[#b8532b]'
                              : 'border-[#e3ded4] bg-[#faf8f5] hover:border-[#a8a192]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="flex items-center gap-1.5 text-[#b8532b] font-mono font-bold uppercase text-[11px]">
                              <Truck className="h-4 w-4" />
                              <span>Bulk Cubic Yards</span>
                            </span>
                            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#ffffff] border border-[#e3ded4] text-[#1c1917]">
                              {isBulkSelected ? 'Selected' : 'Select'}
                            </span>
                          </div>
                          <div className="font-mono text-2xl font-bold text-[#1c1917]">
                            {out.bulkCubicYardsToPurchase} <span className="text-xs font-normal">whole cu yds</span>
                          </div>
                          <p className="text-[#57534e] text-[11px] leading-relaxed">
                            Material only: ${bulkBom?.estimatedCost?.typical.toLocaleString()} typical ($
                            {bulkBom?.estimatedCost?.low.toLocaleString()}–${bulkBom?.estimatedCost?.high.toLocaleString()}) at $26–$54/yd³. Excludes delivery freight; supplier increments &amp; minimums vary.
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPurchasingFormat('bags-075')}
                          className={`p-4 rounded-lg border text-left space-y-2 transition-all ${
                            !isBulkSelected
                              ? 'border-[#b8532b] bg-[#fcf4ee] ring-1 ring-[#b8532b]'
                              : 'border-[#e3ded4] bg-[#faf8f5] hover:border-[#a8a192]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="flex items-center gap-1.5 text-[#1c1917] font-mono font-bold uppercase text-[11px]">
                              <Package className="h-4 w-4" />
                              <span>0.75 cu ft Retail Bags</span>
                            </span>
                            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#ffffff] border border-[#e3ded4] text-[#1c1917]">
                              {!isBulkSelected ? 'Selected' : 'Select'}
                            </span>
                          </div>
                          <div className="font-mono text-2xl font-bold text-[#1c1917]">
                            {out.bags075cuftToPurchase} <span className="text-xs font-normal">bags (0.75 cu ft)</span>
                          </div>
                          <p className="text-[#57534e] text-[11px] leading-relaxed">
                            Material only: ${bagBom?.estimatedCost?.typical.toLocaleString()} typical ($
                            {bagBom?.estimatedCost?.low.toLocaleString()}–${bagBom?.estimatedCost?.high.toLocaleString()}) at $2.49–$5.29/bag. 36 bags equal 1 cu yd; 1.0 cu ft bag counts ({out.bags1cuftToPurchase} bags) are volume-only without a price benchmark.
                          </p>
                        </button>
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
                            <span className="text-[11px] text-[#1e3a5f] font-mono">+{out.wastePercentage}% Allowance</span>
                          </div>
                          <div className="text-xl sm:text-2xl font-mono font-bold text-[#1e3a5f] tabular-nums mb-1">
                            {out.recommendedVolumeCuYds}{' '}
                            <span className="text-xs font-sans font-normal text-[#57534e]">cu yds</span>
                          </div>
                          <p className="text-xs text-[#57534e] leading-snug">
                            {out.recommendedVolumeCuFt} cu ft including +{out.wastePercentage}% provisional planning allowance.
                          </p>
                        </div>

                        <div className="p-3.5 rounded border-2 border-[#b8532b] bg-[#fcf4ee]">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-mono font-bold uppercase text-[#b8532b] bg-[#ffffff] px-1.5 py-0.5 rounded border border-[#e3ded4]">
                              Stage 3
                            </span>
                            <span className="text-[11px] text-[#b8532b] font-mono font-semibold">
                              {isBulkSelected ? 'Selected: Bulk' : 'Selected: Bags'}
                            </span>
                          </div>
                          <div className="text-xl sm:text-2xl font-mono font-bold text-[#b8532b] tabular-nums mb-1">
                            {isBulkSelected ? out.bulkCubicYardsToPurchase : out.bags075cuftToPurchase}{' '}
                            <span className="text-xs font-sans font-normal text-[#b8532b]">
                              {isBulkSelected ? 'whole cu yds' : 'bags (0.75 cu ft)'}
                            </span>
                          </div>
                          <p className="text-xs text-[#57534e] leading-snug">
                            {isBulkSelected
                              ? `Alternative: ${out.bags075cuftToPurchase} bags (0.75 cu ft) or ${out.bags1cuftToPurchase} bags (1.0 cu ft, volume-only).`
                              : `Alternative: ${out.bulkCubicYardsToPurchase} whole bulk cu yds (or ${out.bags1cuftToPurchase} 1.0 cu ft bags, volume-only).`}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* MATERIAL BILL OF MATERIALS (SELECTED FORMAT ONLY) */}
                    <div className="space-y-2">
                      {selectedBomItem && <BillOfMaterialsTable items={[selectedBomItem]} />}
                      {alternativeBomItem && (
                        <p className="text-[11px] text-[#57534e] bg-[#faf8f5] border border-[#e3ded4] rounded px-3 py-2">
                          <strong className="text-[#1c1917]">Alternative Format Reference (Not Combined):</strong> Instead of{' '}
                          {selectedBomItem.purchaseQuantity} {selectedBomItem.packageUnit}, the same {out.recommendedVolumeCuFt} cu ft requirement equals{' '}
                          <span className="font-mono font-semibold text-[#1c1917]">
                            {alternativeBomItem.purchaseQuantity} {alternativeBomItem.packageUnit}
                          </span>{' '}
                          (est. ${alternativeBomItem.estimatedCost?.low.toLocaleString()}–$
                          {alternativeBomItem.estimatedCost?.high.toLocaleString()} material only).
                        </p>
                      )}
                    </div>

                    {/* COST ESTIMATE & EXPLICIT FORMAT / FREIGHT BASIS */}
                    <div className="space-y-3">
                      <div className="rounded border border-[#e3ded4] bg-[#faf8f5] p-3.5 text-xs text-[#57534e] space-y-1">
                        <div className="font-mono font-bold uppercase text-[11px] text-[#1c1917]">
                          Active Cost Basis: {isBulkSelected ? 'Bulk Cubic Yards (Material Before Freight)' : '0.75 cu ft Retail Bags (Material Only)'}
                        </div>
                        <p className="leading-relaxed">
                          Pricing <strong className="text-[#1c1917]">{selectedBomItem.purchaseQuantity} {selectedBomItem.packageUnit}</strong> using the{' '}
                          {isBulkSelected
                            ? 'Screened Loam Topsoil bulk yard benchmark ($26.00 low / $38.00 typical / $54.00 high per cu yd). Delivery freight is excluded and varies by supplier, location, order size, and drop terms; actual supplier increments (e.g., half-yard options or multi-yard minimums) and local quotes may differ.'
                            : '0.75 cu ft Retail Bag benchmark ($2.49 low / $3.79 typical / $5.29 high per bag). Store delivery, pallet freight, specialty garden-mix upgrades, and sales tax are excluded; 1.0 cu ft bag counts are volume-only and unpriced.'}
                        </p>
                      </div>
                      <CostEstimateCard costEstimate={calculationResult.costEstimate} />
                    </div>
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
                  {calculationResult.errors.map((err) => err.message).join(' ') ||
                    'Please check your inputs and ensure area dimensions and depth are positive numbers.'}
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
              subtitle="Footprint to Planning Volume, Bulk Yards & Retail Bag Counts"
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

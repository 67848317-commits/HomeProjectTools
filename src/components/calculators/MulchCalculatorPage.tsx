import React, { useState, useMemo } from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs.tsx';
import { Container } from '../../components/common/Container.tsx';
import { CalculatorHeader } from '../../components/calculator/CalculatorHeader.tsx';
import { CalculatorInput } from '../../components/calculator/CalculatorInput.tsx';
import { WasteSelector } from '../../components/calculator/WasteSelector.tsx';
import { ResultMetric } from '../../components/calculator/ResultMetric.tsx';
import { EstimatingFlow } from '../../components/calculator/EstimatingFlow.tsx';
import { BillOfMaterialsTable } from '../../components/calculator/BillOfMaterialsTable.tsx';
import { CostEstimateCard } from '../../components/calculator/CostEstimateCard.tsx';
import { CalculationExplanation, type CalculationStep } from '../../components/calculator/CalculationExplanation.tsx';
import { AssumptionsList } from '../../components/calculator/AssumptionsList.tsx';
import { PracticalTips, type PracticalTipItem } from '../../components/calculator/PracticalTips.tsx';
import { RelatedTools } from '../../components/calculator/RelatedTools.tsx';
import { CalculatorTrackerWrapper } from '../calculator/CalculatorTrackerWrapper.tsx';

import { calculateMulch } from '../../scripts/calculators/mulch.ts';
import { CALCULATORS } from '../../data/calculators.ts';
import { CATEGORIES } from '../../data/categories.ts';
import {
  RotateCcw,
  SlidersHorizontal,
  Trees,
  Truck,
  Package,
  Layers,
  Sparkles,
  ShieldCheck,
  Wrench,
  AlertTriangle,
  Info,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

interface MulchCalculatorPageProps {
  onNavigate?: (path: string) => void;
}

export const MulchCalculatorPage: React.FC<MulchCalculatorPageProps> = ({ onNavigate }) => {
  const metadata = CALCULATORS['mulch-calculator'];
  const category = CATEGORIES['landscaping'];

  // Inputs
  const [bedLength, setBedLength] = useState<number>(25);
  const [bedWidth, setBedWidth] = useState<number>(6);
  const [mulchDepthInches, setMulchDepthInches] = useState<number>(3);
  const [wastePercentage, setWastePercentage] = useState<number>(5);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Live calculation
  const calculationResult = useMemo(() => {
    return calculateMulch({
      bedLength,
      bedWidth,
      mulchDepthInches,
      wastePercentage,
    });
  }, [bedLength, bedWidth, mulchDepthInches, wastePercentage]);

  const handleReset = () => {
    setBedLength(25);
    setBedWidth(6);
    setMulchDepthInches(3);
    setWastePercentage(5);
  };

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: category?.name ?? 'Landscaping & Groundwork', href: category?.hubPath ?? '/projects/landscaping-groundwork' },
    { label: 'Mulch Yardage & Bag Calculator' },
  ];

  const depthPresets = [
    { depth: 2, label: '2" Depth', subtitle: 'Annual Refresh / Top-Dress' },
    { depth: 3, label: '3" Depth', subtitle: 'New Bed Standard / Weed Control' },
    { depth: 4, label: '4" Depth', subtitle: 'Heavy Erosion / Tree Basin' },
  ];

  const outputs = calculationResult.success ? calculationResult.outputs : undefined;

  const mulchSteps: CalculationStep[] = outputs
    ? [
        {
          stepNumber: 1,
          title: 'Calculate Landscape Bed Surface Area',
          description: 'Multiply the planting bed length by width to find total square footage.',
          formulaDisplay: (
            <span>
              {bedLength} ft × {bedWidth} ft = <strong>{outputs.bedAreaSqFt} sq ft bed area</strong>
            </span>
          ),
        },
        {
          stepNumber: 2,
          title: 'Convert Depth from Inches to Feet',
          description: 'Depth must be converted from inches into feet for cubic dimensioning.',
          formulaDisplay: (
            <span>
              {mulchDepthInches} inches ÷ 12 in/ft = <strong>{(mulchDepthInches / 12).toFixed(3)} ft depth</strong>
            </span>
          ),
        },
        {
          stepNumber: 3,
          title: 'Compute Geometric Volume in Cubic Feet',
          description: 'Multiply surface area by depth to find uncompacted volume.',
          formulaDisplay: (
            <span>
              {outputs.bedAreaSqFt} sq ft × {(mulchDepthInches / 12).toFixed(3)} ft ={' '}
              <strong>{outputs.geometricVolumeCuFt} cu ft net volume</strong>
            </span>
          ),
        },
        {
          stepNumber: 4,
          title: 'Apply Settling & Compaction Allowance',
          description: `Organic mulch settles 5% to 10% after initial watering and decomposition.`,
          formulaDisplay: (
            <span>
              {outputs.geometricVolumeCuFt} cu ft × (1 + {wastePercentage / 100}) ={' '}
              <strong>{outputs.recommendedVolumeCuFt} cu ft planning volume</strong>
            </span>
          ),
        },
        {
          stepNumber: 5,
          title: 'Convert to Commercial Purchasing Units',
          description: 'Retail stores sell 2.0 cu ft bags; bulk landscape suppliers deliver by the cubic yard (27 cu ft = 1 cu yd).',
          formulaDisplay: (
            <span className="text-[#b8532b]">
              Bulk: {outputs.recommendedVolumeCuFt} ÷ 27 = <strong>{outputs.recommendedVolumeCuYds} cubic yards</strong> | 2 cu ft Bags:{' '}
              <strong>{outputs.bags2cuftToPurchase} bags</strong>
            </span>
          ),
        },
      ]
    : [];

  const mulchTips: PracticalTipItem[] = [
    {
      title: 'Avoid Harmful "Mulch Volcanoes"',
      desc: 'Never pile mulch against tree trunks or woody stems. Keep a 2 to 3-inch gap of bare collar around tree bark to prevent bark decay, fungal disease, and rodent tunneling.',
      icon: Trees,
    },
    {
      title: 'When to Switch from Bags to Bulk Delivery',
      desc: 'If your project needs more than 2 cubic yards (~27 bags of 2 cu ft), bulk truck delivery is usually significantly cheaper, even after a $40–$80 delivery drop fee.',
      icon: Truck,
    },
    {
      title: 'Vehicle Weight Limits for Bagged Mulch',
      desc: 'One 2.0 cu ft bag of moist hardwood mulch weighs 30 to 45 lbs. A 30-bag purchase weighs over 1,000 lbs—check your car or SUV payload capacity before loading.',
      icon: Wrench,
    },
    {
      title: 'Use 3 Layers of Newspaper or Cardboard',
      desc: 'Instead of synthetic plastic sheeting (which traps stagnant moisture), lay non-glossy corrugated cardboard or 3 layers of newspaper beneath fresh mulch for natural weed suppression that turns into compost.',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="py-6 sm:py-10">
      <Container>
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />

        {/* Page Header */}
        <CalculatorHeader
          title={metadata?.name ?? 'Mulch Yardage & Bag Calculator'}
          categoryName={category?.name ?? 'Landscaping & Grounds'}
          description="Estimate cubic yardage and retail bags (2 cu ft and 3 cu ft) for planting beds, flower gardens, and tree rings, with settling and compaction allowances."
          targetIntent={metadata?.targetIntent}
        />

        {/* Main Interactive Estimating Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* LEFT COLUMN: Bed Dimensions & Depth */}
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
                      Area measurements and target mulch depth
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1 text-xs font-mono text-[#78716c] hover:text-[#b8532b] transition-colors"
                  title="Reset to 25x6 ft defaults"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset</span>
                </button>
              </div>

              <div className="space-y-5">
                {/* 1. Bed Area Dimensions */}
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase font-semibold text-[#57534e]">
                    1. Bed Dimensions
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <CalculatorInput
                      id="bed-length"
                      label="Length"
                      value={bedLength}
                      onChange={setBedLength}
                      unit="ft"
                      min={1}
                      max={1000}
                      step={0.5}
                      required
                      error={bedLength <= 0 ? 'Length must be > 0' : undefined}
                    />

                    <CalculatorInput
                      id="bed-width"
                      label="Width"
                      value={bedWidth}
                      onChange={setBedWidth}
                      unit="ft"
                      min={1}
                      max={500}
                      step={0.5}
                      required
                      error={bedWidth <= 0 ? 'Width must be > 0' : undefined}
                    />
                  </div>
                </div>

                {/* 2. PROMINENT DEPTH INPUT & PRESETS */}
                <div className="space-y-2 p-3.5 rounded bg-[#fcf4ee] border-2 border-[#b8532b]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase font-bold text-[#b8532b]">
                      2. Mulch Layer Depth
                    </span>
                    <span className="text-xs font-mono font-bold text-[#b8532b] bg-[#ffffff] px-2 py-0.5 rounded border border-[#e3ded4]">
                      {mulchDepthInches} Inches Deep
                    </span>
                  </div>

                  {/* Depth quick buttons */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {depthPresets.map((preset) => (
                      <button
                        key={preset.depth}
                        type="button"
                        onClick={() => setMulchDepthInches(preset.depth)}
                        className={`p-2 rounded border text-left transition-all ${
                          mulchDepthInches === preset.depth
                            ? 'bg-[#ffffff] border-[#b8532b] shadow-xs ring-1 ring-[#b8532b]'
                            : 'bg-[#ffffff] border-[#c8c1b2] hover:bg-[#faf8f5]'
                        }`}
                      >
                        <span className="block font-mono font-bold text-xs text-[#1c1917]">
                          {preset.label}
                        </span>
                        <span className="block text-[10px] text-[#78716c] leading-tight mt-0.5">
                          {preset.subtitle}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2">
                    <CalculatorInput
                      id="custom-depth"
                      label="Custom Depth (Inches)"
                      value={mulchDepthInches}
                      onChange={setMulchDepthInches}
                      unit="in"
                      min={0.5}
                      max={12}
                      step={0.25}
                      required
                      error={mulchDepthInches <= 0 ? 'Depth must be > 0' : undefined}
                    />
                  </div>
                </div>

                {/* 3. Settling & Compaction Allowance */}
                <WasteSelector
                  value={wastePercentage}
                  onChange={setWastePercentage}
                  options={metadata.wasteOptions}
                  title="Compaction & Settling Allowance"
                  customLabel="Buffer"
                  principleNote="Organic bark settles 5% to 10% after initial rain and natural garden tamping. Adding a 5% buffer helps prevent sparse or thin bare spots."
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Output Results, Bags vs Bulk Comparison */}
          <div className="lg:col-span-7 space-y-6" aria-live="polite">
            {calculationResult.success ? (
              (() => {
                const out = calculationResult.outputs;
                const exactBags2cuft = (out.recommendedVolumeCuFt / 2).toFixed(1);
                return (
                  <>
                    {/* Primary Metric Highlight: Dual Bulk & Bag Order */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <ResultMetric
                          label="Bulk Cubic Yards"
                          value={out.recommendedVolumeCuYds}
                          unit="cu yds"
                          subtext={`Order ~${Math.ceil(out.recommendedVolumeCuYds)} full yards from landscape supply`}
                          variant="primary"
                        />
                        <ResultMetric
                          label="2.0 Cu Ft Retail Bags"
                          value={out.bags2cuftToPurchase}
                          unit="bags"
                          subtext={`Standard retail store bags (${exactBags2cuft} mathematical bags)`}
                          variant="primary"
                        />
                      </div>

                      {/* Secondary Metrics Bar */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        <ResultMetric
                          label="Bed Footprint"
                          value={out.bedAreaSqFt}
                          unit="sq ft"
                          subtext={`${bedLength}' × ${bedWidth}'`}
                        />
                        <ResultMetric
                          label="Depth Applied"
                          value={`${mulchDepthInches}"`}
                          unit="inches"
                          subtext="Uniform coverage"
                        />
                        <ResultMetric
                          label="Cubic Feet"
                          value={out.recommendedVolumeCuFt}
                          unit="cu ft"
                          subtext={`+${out.wastePercentage}% settling`}
                        />
                        <ResultMetric
                          label="3.0 Cu Ft Bags"
                          value={out.bags3cuftToPurchase}
                          unit="bags"
                          subtext="Large landscape bags"
                        />
                      </div>
                    </div>

                    {/* VISUAL RETAIL BAGS VS BULK DELIVERY COMPARISON (Family C Specific) */}
                    <div className="rounded-lg border border-[#e3ded4] bg-[#ffffff] p-4 shadow-xs space-y-3">
                      <div className="flex items-center justify-between border-b border-[#e3ded4] pb-2">
                        <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[#1c1917] flex items-center gap-1.5">
                          <Truck className="h-3.5 w-3.5 text-[#b8532b]" />
                          <span>Retail Bags vs Bulk Delivery Comparison</span>
                        </h3>
                        <span className="text-[11px] font-mono text-[#78716c]">
                          Purchasing Decision
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        {/* 2 cu ft option */}
                        <div className="p-3 rounded bg-[#f7f5f0] border border-[#e3ded4] space-y-1">
                          <div className="flex items-center gap-1 font-bold text-[#1c1917]">
                            <Package className="h-3.5 w-3.5 text-[#b8532b]" />
                            <span>2.0 Cu Ft Retail Bags</span>
                          </div>
                          <div className="font-mono text-xl font-bold text-[#1c1917]">
                            {out.bags2cuftToPurchase} Bags
                          </div>
                          <p className="text-[#78716c] leading-tight">
                            Common 2 cu ft home center bags. Fits into trunk/hatchback or standard pickup.
                          </p>
                        </div>

                        {/* 3 cu ft option */}
                        <div className="p-3 rounded bg-[#f7f5f0] border border-[#e3ded4] space-y-1">
                          <div className="flex items-center gap-1 font-bold text-[#1c1917]">
                            <Package className="h-3.5 w-3.5 text-[#b8532b]" />
                            <span>3.0 Cu Ft Bags</span>
                          </div>
                          <div className="font-mono text-xl font-bold text-[#1c1917]">
                            {out.bags3cuftToPurchase} Bags
                          </div>
                          <p className="text-[#78716c] leading-tight">
                            Commercial nursery bags. Fewer bags to carry and open, but heavier per bag (~60 lbs).
                          </p>
                        </div>

                        {/* Bulk cubic yards */}
                        <div className="p-3 rounded bg-[#fcf4ee] border-2 border-[#b8532b] space-y-1">
                          <div className="flex items-center gap-1 font-bold text-[#b8532b]">
                            <Truck className="h-3.5 w-3.5" />
                            <span>Bulk Delivery</span>
                          </div>
                          <div className="font-mono text-xl font-bold text-[#b8532b]">
                            {out.recommendedVolumeCuYds} Cu Yds
                          </div>
                          <p className="text-[#57534e] leading-tight">
                            Dump truck drop in driveway. Best value for large gardens or multi-bed re-mulching.
                          </p>
                        </div>
                      </div>

                      {/* Tipping point guidance */}
                      <div className="p-2.5 rounded bg-[#f1ede4] border border-[#e3ded4] text-xs text-[#57534e] flex items-start gap-2">
                        <Info className="h-4 w-4 text-[#b8532b] shrink-0 mt-0.5" />
                        <div>
                          <strong>Buying Recommendation:</strong> 1 cubic yard = 27 cubic feet = 13.5 bags (2 cu ft).
                          {out.recommendedVolumeCuYds >= 2 ? (
                            <span>
                              {' '}Your project requires <strong>{out.recommendedVolumeCuYds} cubic yards</strong> ({out.bags2cuftToPurchase} bags). Bulk truck delivery is significantly more economical than buying bags at retail.
                            </span>
                          ) : (
                            <span>
                              {' '}Your project requires under 2 cubic yards (<strong>{out.bags2cuftToPurchase} bags</strong>). Purchasing bagged mulch avoids the typical $40–$80 dump truck delivery fee and allows cleaner transport.
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 3-Stage Estimating Flow */}
                    <EstimatingFlow
                      title="Dimensional Conversion Breakdown"
                      subtitle="Family C: Area × Depth → Volume"
                      stages={[
                        {
                          stageNumber: 1,
                          stageTitle: 'Net Volume',
                          badgeText: 'Stage 1',
                          badgeVariant: 'neutral',
                          primaryValue: out.geometricVolumeCuFt,
                          primaryUnit: 'cu ft',
                          secondaryNote: `${out.geometricVolumeCuYds} cu yds`,
                          description: `${out.bedAreaSqFt} sq ft bed area × ${mulchDepthInches}" depth without settling.`,
                        },
                        {
                          stageNumber: 2,
                          stageTitle: 'Settling Allowance',
                          badgeText: `+${out.wastePercentage}% Settling`,
                          badgeVariant: 'info',
                          primaryValue: out.recommendedVolumeCuFt,
                          primaryUnit: 'cu ft',
                          secondaryNote: `${out.recommendedVolumeCuYds} cu yds`,
                          description: 'Accounts for natural settling and compaction under watering.',
                        },
                        {
                          stageNumber: 3,
                          stageTitle: 'Commercial Units',
                          badgeText: 'Takeoff Options',
                          badgeVariant: 'terracotta',
                          primaryValue: out.bags2cuftToPurchase,
                          primaryUnit: 'bags (2 cu ft)',
                          secondaryNote: `Or ${out.recommendedVolumeCuYds} bulk cu yds`,
                          description: 'Rounded up to whole retail bags or bulk cubic yard scoop fractions.',
                          isCallout: true,
                        },
                      ]}
                      formulaConfirmation={
                        <span>
                          <strong>Volume Math:</strong> {out.bedAreaSqFt} sq ft × ({mulchDepthInches} ÷ 12) ft × (1 + {out.wastePercentage / 100}) = {out.recommendedVolumeCuFt} cu ft ÷ 27 = <strong>{out.recommendedVolumeCuYds} cubic yards</strong> (or <strong>{out.bags2cuftToPurchase} bags</strong> @ 2 cu ft).
                        </span>
                      }
                    />

                    {/* Bill of Materials Takeoff */}
                    <BillOfMaterialsTable items={calculationResult.billOfMaterials} />

                    {/* Cost Estimate Range */}
                    <CostEstimateCard costEstimate={calculationResult.costEstimate} />
                  </>
                );
              })()
            ) : (
              <div className="rounded-lg border-2 border-[#b91c1c] bg-[#fef2f2] p-6 text-sm text-[#991b1b]">
                <h3 className="font-bold text-base mb-1">Invalid Dimensions</h3>
                <p>
                  {calculationResult.errors[0]?.message ??
                    'Please verify that bed length, width, and depth are greater than zero.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Informational Guidance & Engineering Math */}
        {calculationResult.success && (
          <div className="space-y-8 mt-12 border-t border-[#e3ded4] pt-8">
            {/* 1. Step-by-Step Mathematical Explanation */}
            <CalculationExplanation
              title="How This Mulch Calculation Works"
              subtitle="Transparent Engineering Math"
              description="Our calculation engine executes five deterministic steps to convert garden bed dimensions and depth into bulk cubic yards and retail bags."
              steps={mulchSteps}
            />

            {/* 2. Planning Assumptions & Exclusions */}
            <AssumptionsList
              assumptions={calculationResult.assumptions}
              notices={calculationResult.notices}
              limitations={[
                'Delivery & Drop Fees: Bulk mulch delivery typically adds a flat $40 to $90 dump truck delivery charge depending on travel distance from the nursery.',
                'Bed Edging & Trenching: Trenching a 3-inch spade edge or installing stone/metal edging to retain mulch is estimated separately.',
                'Weed Fabric / Barrier: Landscape fabric or cardboard underlayment is not included in volume yardage.',
              ]}
              scopeTitle="Out of Scope / Site Logistics"
              benchmarkNote="Mulch prices reflect centralized price benchmarks for retail bag shelf averages and bulk landscape nursery delivery benchmarks."
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
                    How to Calculate Mulch: Depth, Cubic Yards, and Bagged vs Bulk
                  </h3>
                  <p className="text-xs sm:text-sm text-[#57534e] mt-1 max-w-xl leading-relaxed">
                    Learn the standard 2" to 3" depth rules, compaction allowances, how to avoid tree-bark rot volcanoes, and when 3+ yards makes bulk dump truck delivery cheaper than store bags.
                  </p>
                </div>
              </div>
              <a
                href="/guides/how-to-calculate-mulch"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded text-xs font-mono font-semibold bg-[#b8532b] text-white hover:bg-[#a04422] transition-colors shrink-0 shadow-xs"
              >
                <span>Read Planning Guide</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* 3. Practical Homeowner Field Tips */}
            <PracticalTips
              title="Practical Field Tips for Mulching Beds"
              subtitle="Landscaper Field Notes"
              tips={mulchTips}
            />

            {/* 4. Related Tools & Guides */}
            <RelatedTools currentCalculatorId="mulch-calculator" onNavigate={onNavigate} />
          </div>
        )}
      </Container>
    </div>
  );
};

export const MulchCalculatorIsland: React.FC = () => {
  const meta = CALCULATORS['mulch-calculator'];
  return (
    <CalculatorTrackerWrapper
      calculatorSlug="mulch-calculator"
      calculatorName={meta.name}
      projectCategory={meta.categoryId}
    >
      <MulchCalculatorPage />
    </CalculatorTrackerWrapper>
  );
};

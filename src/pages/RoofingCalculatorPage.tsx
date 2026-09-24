import React, { useState, useMemo } from 'react';
import { Breadcrumbs } from '../components/common/Breadcrumbs.tsx';
import { Container } from '../components/common/Container.tsx';
import { CalculatorHeader } from '../components/calculator/CalculatorHeader.tsx';
import { CalculatorInput } from '../components/calculator/CalculatorInput.tsx';
import { CalculatorSelect } from '../components/calculator/CalculatorSelect.tsx';
import { ResultMetric } from '../components/calculator/ResultMetric.tsx';
import { BillOfMaterialsTable } from '../components/calculator/BillOfMaterialsTable.tsx';
import { CostEstimateCard } from '../components/calculator/CostEstimateCard.tsx';
import { CalculationExplanation, type CalculationStep } from '../components/calculator/CalculationExplanation.tsx';
import { AssumptionsList } from '../components/calculator/AssumptionsList.tsx';
import { PracticalTips, type PracticalTipItem } from '../components/calculator/PracticalTips.tsx';
import { RelatedTools } from '../components/calculator/RelatedTools.tsx';

import { calculateRoofing } from '../scripts/calculators/roofing.ts';
import { CALCULATORS } from '../data/calculators.ts';
import { CATEGORIES } from '../data/categories.ts';
import {
  RotateCcw,
  SlidersHorizontal,
  Home,
  ShieldAlert,
  AlertTriangle,
  Compass,
  Layers,
  HelpCircle,
  Package,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

interface RoofingCalculatorPageProps {
  onNavigate?: (path: string) => void;
}

export const RoofingCalculatorPage: React.FC<RoofingCalculatorPageProps> = ({ onNavigate }) => {
  const metadata = CALCULATORS['roofing-calculator'];
  const category = CATEGORIES['roofing'];

  // Form State
  const [footprintAreaSqFt, setFootprintAreaSqFt] = useState<number>(2000);
  const [roofPitchRisePerFoot, setRoofPitchRisePerFoot] = useState<number>(6);
  const [complexityWastePercentage, setComplexityWastePercentage] = useState<number>(10);
  const [bundlesPerSquare, setBundlesPerSquare] = useState<number>(3);

  // Live calculation
  const calculationResult = useMemo(() => {
    return calculateRoofing({
      footprintAreaSqFt,
      roofPitchRisePerFoot,
      complexityWastePercentage,
      bundlesPerSquare,
    });
  }, [footprintAreaSqFt, roofPitchRisePerFoot, complexityWastePercentage, bundlesPerSquare]);

  const handleReset = () => {
    setFootprintAreaSqFt(2000);
    setRoofPitchRisePerFoot(6);
    setComplexityWastePercentage(10);
    setBundlesPerSquare(3);
  };

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: category?.name ?? 'Roofing & Siding', href: category?.hubPath ?? '/projects/roofing-siding' },
    { label: metadata?.name ?? 'Roofing Shingle & Bundle Calculator' },
  ];

  const pitchOptions = [
    { label: 'Flat / Low Slope (0:12) — Pitch Multiplier 1.000', value: '0' },
    { label: '4:12 Pitch (Moderate) — Pitch Multiplier 1.054', value: '4' },
    { label: '6:12 Pitch (Standard Residential) — Pitch Multiplier 1.118', value: '6' },
    { label: '8:12 Pitch (Steep Gable) — Pitch Multiplier 1.202', value: '8' },
    { label: '10:12 Pitch (Very Steep) — Pitch Multiplier 1.302', value: '10' },
    { label: '12:12 Pitch (45° Angle / Mansard) — Pitch Multiplier 1.414', value: '12' },
  ];

  const wasteOptions = [
    { label: 'Simple Gable (10% Waste)', value: '10' },
    { label: 'Hip Roof with Valleys (15% Waste)', value: '15' },
    { label: 'Complex with Dormers & Multiple Ridges (20% Waste)', value: '20' },
  ];

  const explanationSteps: CalculationStep[] = useMemo(() => {
    if (!calculationResult.success) return [];
    const out = calculationResult.outputs;

    return [
      {
        stepNumber: 1,
        title: 'Apply Geometric Roof Pitch Multiplier',
        description:
          'Convert the two-dimensional ground footprint into true three-dimensional sloped surface area using the pitch formula: Multiplier = √(1 + (Rise / 12)²).',
        formulaDisplay: (
          <span>
            {footprintAreaSqFt.toLocaleString()} sq ft footprint × √(1 + ({roofPitchRisePerFoot}/12)²) [{out.pitchMultiplier}] ={' '}
            <strong>{out.actualRoofAreaSqFt.toLocaleString()} sq ft actual roof surface</strong>
          </span>
        ),
      },
      {
        stepNumber: 2,
        title: 'Incorporate Cutting & Complexity Waste',
        description:
          'Apply the complexity allowance for rakes, eaves, valley cuts, and ridge scrap.',
        formulaDisplay: (
          <span>
            {out.actualRoofAreaSqFt.toLocaleString()} sq ft × (1 + {complexityWastePercentage / 100}) ={' '}
            <strong className="text-[#b8532b]">{out.recommendedRoofAreaSqFt.toLocaleString()} sq ft planning area</strong>
          </span>
        ),
      },
      {
        stepNumber: 3,
        title: 'Convert to Industry Roofing Squares',
        description:
          'In US roofing, 1 "Square" equals 100 square feet of roof surface. Materials are ordered in whole squares or whole bundles.',
        formulaDisplay: (
          <span>
            {out.recommendedRoofAreaSqFt.toLocaleString()} sq ft ÷ 100 = {out.roofingSquaresExact} squares →{' '}
            <strong className="text-[#b8532b]">{out.roofingSquaresToPurchase} roofing squares</strong>
          </span>
        ),
      },
      {
        stepNumber: 4,
        title: 'Determine Shingle Bundles & Underlayment',
        description:
          'Multiply whole roofing squares by bundles per square. Synthetic underlayment is rounded to 10-square (1,000 sq ft) rolls.',
        formulaDisplay: (
          <span>
            {out.roofingSquaresToPurchase} squares × {bundlesPerSquare} bundles/sq ={' '}
            <strong className="text-[#b8532b]">{out.shingleBundlesToPurchase} shingle bundles</strong> • Underlayment:{' '}
            ceil({out.recommendedRoofAreaSqFt.toLocaleString()} ÷ 1,000) ={' '}
            <strong>{out.syntheticUnderlaymentRolls} rolls (10 sq each)</strong>
          </span>
        ),
      },
    ];
  }, [calculationResult, footprintAreaSqFt, roofPitchRisePerFoot, complexityWastePercentage, bundlesPerSquare]);

  const practicalTips: PracticalTipItem[] = [
    {
      title: 'Ground Footprint vs Rafter Overhangs',
      desc: 'Ensure your ground footprint includes 1 to 2 feet of exterior eave and gable rafter overhangs. Measuring only the interior foundation will leave your order 8% to 12% short on steep roofs.',
      icon: Home,
    },
    {
      title: 'Typical Planning Benchmark: 3 Bundles per Square',
      desc: 'Most standard architectural shingles (e.g., GAF Timberline, Owens Corning Duration) package 3 bundles per roofing square. However, heavyweight designer shingles often require 4 or 5 bundles per square.',
      icon: Package,
    },
    {
      title: 'Inspect Rake and Valley Complexity',
      desc: 'Valleys and dormers generate significant diagonal triangular cut off-fall. Never use a 10% gable waste factor on a hip roof with dormers; use at least 15% to 20% to avoid mid-job shortages.',
      icon: Compass,
    },
    {
      title: 'Underlayment Overlap and Ice Barrier',
      desc: 'Local codes frequently require a self-adhering ice & water shield membrane extending at least 24 inches inside the warm exterior wall line in freeze/thaw climates. Synthetic underlayment covers the remaining field.',
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
          title={metadata?.name ?? 'Roofing Shingle & Bundle Calculator'}
          categoryName={category?.name ?? 'Roofing'}
          description="Convert building ground footprint and roof slope pitch into true sloped surface area, roofing squares (100 sq ft), shingle bundles, and synthetic underlayment rolls."
          targetIntent={metadata?.targetIntent}
        />

        {/* Informational Planning Banner */}
        <div className="mb-8 rounded-lg border border-[#e3ded4] bg-[#faf8f5] p-4 flex items-start gap-3 text-xs text-[#57534e]">
          <HelpCircle className="h-5 w-5 text-[#b8532b] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-[#1c1917] font-semibold">Planning Estimator Notice:</strong> This worksheet converts ground footprint and slope pitch into material ordering units for budgeting. It does not replace an on-roof tape measurement. Actual shingle bundle coverage varies by manufacturer. Starter strips, ridge caps, valley metal, flashing, and drip edges must be budgeted separately.
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
                      Roof Geometry & Pitch Inputs
                    </h2>
                    <span className="text-[11px] text-[#78716c]">
                      Footprint, slope ratio, complexity & packaging
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
                {/* 1. Ground Footprint */}
                <CalculatorInput
                  id="roof-footprint"
                  label="Ground Footprint Area (Under Roof)"
                  value={footprintAreaSqFt}
                  onChange={setFootprintAreaSqFt}
                  unit="sq ft"
                  min={100}
                  max={50000}
                  step={50}
                  description="Include 1–2 ft exterior overhangs along eaves and rakes."
                  required
                />

                {/* 2. Roof Pitch / Slope */}
                <div className="space-y-1.5">
                  <CalculatorSelect
                    id="roof-pitch"
                    label="Roof Pitch (Inches of Rise per 12 Inches Run)"
                    value={roofPitchRisePerFoot.toString()}
                    onChange={(val) => setRoofPitchRisePerFoot(Number(val))}
                    options={pitchOptions}
                  />
                  <span className="text-[11px] text-[#78716c] leading-relaxed block">
                    Roof pitch multiplier converts flat 2D footprint into true 3D sloped surface area. 6:12 is typical for modern residential construction.
                  </span>
                </div>

                {/* 3. Roof Complexity & Waste Factor */}
                <div className="space-y-1.5">
                  <CalculatorSelect
                    id="roof-complexity"
                    label="Roof Complexity & Cutting Waste"
                    value={complexityWastePercentage.toString()}
                    onChange={(val) => setComplexityWastePercentage(Number(val))}
                    options={wasteOptions}
                  />
                  <span className="text-[11px] text-[#78716c] leading-relaxed block">
                    Accounts for diagonal valley cuts, rake trim, ridge caps, and starter scrap. 10% for simple gable roofs; 15% for hips and valleys.
                  </span>
                </div>

                {/* 4. Bundles per Square (Configurable) */}
                <div className="space-y-1.5 pt-2 border-t border-[#f1ede4]">
                  <CalculatorInput
                    id="bundles-per-square"
                    label="Bundles per Roofing Square (Packaging Specification)"
                    value={bundlesPerSquare}
                    onChange={setBundlesPerSquare}
                    unit="bundles"
                    min={2}
                    max={6}
                    step={1}
                    description="Typical planning benchmark: 3 bundles per roofing square (33.3 sq ft/bundle). Actual coverage depends on manufacturer product line."
                  />
                </div>
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
                          label="Shingle Bundles"
                          value={out.shingleBundlesToPurchase}
                          unit="bundles"
                          subtext={`${bundlesPerSquare} bundles per square`}
                          variant="primary"
                        />
                        <ResultMetric
                          label="Roofing Squares"
                          value={out.roofingSquaresToPurchase}
                          unit="squares"
                          subtext={`Exact: ${out.roofingSquaresExact} sq (${out.recommendedRoofAreaSqFt.toLocaleString()} sq ft)`}
                          variant="primary"
                        />
                        <ResultMetric
                          label="Synthetic Underlayment"
                          value={out.syntheticUnderlaymentRolls}
                          unit="rolls"
                          subtext="10-square (1,000 sq ft) rolls"
                        />
                      </div>
                    </div>

                    {/* THREE-STAGE HIERARCHY BREAKDOWN */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-[#e3ded4] pb-2">
                        <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[#1c1917]">
                          Area & Packaging Breakdown
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
                            <span className="text-[11px] text-[#78716c] font-mono">Net Sloped Area</span>
                          </div>
                          <div className="text-xl sm:text-2xl font-mono font-bold text-[#1c1917] tabular-nums mb-1">
                            {out.actualRoofAreaSqFt.toLocaleString()}{' '}
                            <span className="text-xs font-sans font-normal text-[#57534e]">sq ft</span>
                          </div>
                          <p className="text-xs text-[#57534e] leading-snug">
                            {footprintAreaSqFt} sq ft footprint × {out.pitchMultiplier} pitch factor ({roofPitchRisePerFoot}:12).
                          </p>
                        </div>

                        <div className="p-3.5 rounded border border-[#e3ded4] bg-[#ffffff]">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-mono font-bold uppercase text-[#1e3a5f] bg-[#edf3f9] px-1.5 py-0.5 rounded">
                              Stage 2
                            </span>
                            <span className="text-[11px] text-[#1e3a5f] font-mono">+{complexityWastePercentage}% Cutting</span>
                          </div>
                          <div className="text-xl sm:text-2xl font-mono font-bold text-[#1e3a5f] tabular-nums mb-1">
                            {out.recommendedRoofAreaSqFt.toLocaleString()}{' '}
                            <span className="text-xs font-sans font-normal text-[#57534e]">sq ft</span>
                          </div>
                          <p className="text-xs text-[#57534e] leading-snug">
                            {out.roofingSquaresExact} exact squares required including valley and rake cutting.
                          </p>
                        </div>

                        <div className="p-3.5 rounded border-2 border-[#b8532b] bg-[#fcf4ee]">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-mono font-bold uppercase text-[#b8532b] bg-[#ffffff] px-1.5 py-0.5 rounded border border-[#e3ded4]">
                              Stage 3
                            </span>
                            <span className="text-[11px] text-[#b8532b] font-mono font-semibold">Commercial Unit</span>
                          </div>
                          <div className="text-xl sm:text-2xl font-mono font-bold text-[#b8532b] tabular-nums mb-1">
                            {out.shingleBundlesToPurchase}{' '}
                            <span className="text-xs font-sans font-normal text-[#b8532b]">Bundles</span>
                          </div>
                          <p className="text-xs text-[#57534e] leading-snug">
                            {out.roofingSquaresToPurchase} squares rounded to commercial purchase bundles.
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
                  {calculationResult.errors[0]?.message ?? 'Please check your inputs and ensure footprint area is a positive number.'}
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
              title="Mathematical Breakdown: How Roofing Materials are Calculated"
              subtitle="Ground Footprint to Pitch Multiplier, Squares & Shingle Bundles"
              steps={explanationSteps}
            />

            {/* Assumptions & Boundaries */}
            <AssumptionsList
              assumptions={calculationResult.assumptions}
              notices={calculationResult.notices}
              limitations={[
                'THIS IS A PLANNING ESTIMATOR ONLY: Slope complexity, hips, valleys, multi-tier dormers, and chimney crickets require professional on-roof verification.',
                'Exclusions: Ridge cap shingles, starter course strips, galvanized drip edge, valley flashing metal, step flashing, roof ventilation baffles, and coil roofing nails must be estimated separately.',
                'Bundle Coverage Variability: Architectural shingles are commonly 3 bundles per square (33.3 sq ft each). Heavyweight or specialized tri-laminate shingles often require 4 or 5 bundles per square.',
              ]}
              scopeTitle="Roofing Planning & Scope Boundaries"
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
                    How Much Roofing Material Do I Need? Calculate Squares, Shingle Bundles, and Underlayment
                  </h3>
                  <p className="text-xs sm:text-sm text-[#57534e] mt-1 max-w-xl leading-relaxed">
                    Learn how to convert ground footprint into true sloped rafter area, understand pitch multipliers, calculate roofing squares (100 sq ft), and order bundles and synthetic underlayment.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('/guides/how-much-roofing-material-do-i-need')}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded text-xs font-mono font-semibold bg-[#b8532b] text-white hover:bg-[#a04422] transition-colors shrink-0 shadow-xs"
              >
                <span>Read Planning Guide</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Practical Tips */}
            <PracticalTips
              title="Practical Field Tips for Roofing Estimates"
              subtitle="Contractor Material Planning Guidelines"
              tips={practicalTips}
            />

            {/* Related Tools */}
            <RelatedTools currentCalculatorId="roofing-calculator" onNavigate={onNavigate} />
          </div>
        )}
      </Container>
    </div>
  );
};

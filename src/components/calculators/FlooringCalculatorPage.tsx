import React, { useState, useMemo } from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs.tsx';
import { Container } from '../../components/common/Container.tsx';
import { CalculatorHeader } from '../../components/calculator/CalculatorHeader.tsx';
import { CalculatorInput } from '../../components/calculator/CalculatorInput.tsx';
import { CalculatorSelect } from '../../components/calculator/CalculatorSelect.tsx';
import { WasteSelector } from '../../components/calculator/WasteSelector.tsx';
import { ResultMetric } from '../../components/calculator/ResultMetric.tsx';
import { ThreeWayBreakdown } from '../../components/calculator/ThreeWayBreakdown.tsx';
import { BillOfMaterialsTable } from '../../components/calculator/BillOfMaterialsTable.tsx';
import { CostEstimateCard } from '../../components/calculator/CostEstimateCard.tsx';
import { CalculationExplanation } from '../../components/calculator/CalculationExplanation.tsx';
import { AssumptionsList } from '../../components/calculator/AssumptionsList.tsx';
import { PracticalTips } from '../../components/calculator/PracticalTips.tsx';
import { RelatedTools } from '../../components/calculator/RelatedTools.tsx';
import { CalculatorTrackerWrapper } from '../calculator/CalculatorTrackerWrapper.tsx';

import { calculateFlooring, type FlooringInputs } from '../../scripts/calculators/flooring.ts';
import { CALCULATORS } from '../../data/calculators.ts';
import { CATEGORIES } from '../../data/categories.ts';
import { RotateCcw, SlidersHorizontal, Layers, CheckCircle2, BookOpen, ArrowRight } from 'lucide-react';

interface FlooringCalculatorPageProps {
  onNavigate?: (path: string) => void;
}

export const FlooringCalculatorPage: React.FC<FlooringCalculatorPageProps> = ({ onNavigate }) => {
  const metadata = CALCULATORS['flooring-calculator'];
  const category = CATEGORIES['flooring'];

  // Input states with smart defaults matching metadata specification
  const [roomLength, setRoomLength] = useState<number>(16);
  const [roomWidth, setRoomWidth] = useState<number>(12);
  const [flooringType, setFlooringType] = useState<'lvp' | 'engineered-hardwood' | 'laminate'>('lvp');
  const [cartonCoverage, setCartonCoverage] = useState<number>(20);
  const [wastePercentage, setWastePercentage] = useState<number>(10);
  const [includeUnderlayment, setIncludeUnderlayment] = useState<boolean>(false);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Compute live calculation using Phase 2A verified calculation engine
  const calculationResult = useMemo(() => {
    return calculateFlooring({
      roomLength,
      roomWidth,
      flooringType,
      cartonCoverage,
      wastePercentage,
      includeUnderlayment,
    });
  }, [roomLength, roomWidth, flooringType, cartonCoverage, wastePercentage, includeUnderlayment]);

  // Handle reset to factory defaults
  const handleReset = () => {
    setRoomLength(16);
    setRoomWidth(12);
    setFlooringType('lvp');
    setCartonCoverage(20);
    setWastePercentage(10);
    setIncludeUnderlayment(false);
  };

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: category?.name ?? 'Flooring', href: category?.hubPath ?? '/projects/flooring' },
    { label: 'Flooring Calculator' },
  ];

  const materialOptions = [
    { value: 'lvp', label: 'Luxury Vinyl Plank (LVP)', description: 'Durable, waterproof click-lock planks (approx 20 sq ft/carton)' },
    { value: 'engineered-hardwood', label: 'Engineered Hardwood', description: 'Real hardwood veneer over plywood core (approx 22 sq ft/carton)' },
    { value: 'laminate', label: 'Laminate Flooring', description: 'High-density fiberboard with photographic wood layer' },
  ];

  return (
    <div className="py-6 sm:py-10">
      <Container>
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />

        {/* Page Header */}
        <CalculatorHeader
          title={metadata?.name ?? 'Flooring Material & Carton Calculator'}
          categoryName={category?.name ?? 'Flooring'}
          description="Calculate net floor surface area, account for layout cut waste, and estimate full commercial cartons to purchase for your room renovation."
          targetIntent={metadata?.targetIntent}
        />

        {/* Main Interactive Estimating Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* LEFT COLUMN: Project Inputs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-lg border border-[#e3ded4] bg-[#ffffff] p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#e3ded4] pb-3 mb-5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-[#f7f5f0] border border-[#e3ded4] text-[#b8532b]">
                    <SlidersHorizontal className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#1c1917]">
                      Project Inputs
                    </h2>
                    <span className="text-[11px] text-[#78716c]">
                      Room dimensions & specifications
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1 text-xs font-mono text-[#78716c] hover:text-[#b8532b] transition-colors"
                  title="Reset to 16x12 ft defaults"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset</span>
                </button>
              </div>

              <div className="space-y-5">
                {/* Room Dimensions Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <CalculatorInput
                    id="room-length"
                    label="Room Length"
                    value={roomLength}
                    onChange={setRoomLength}
                    unit="ft"
                    min={1}
                    max={500}
                    step={0.5}
                    required
                    error={roomLength <= 0 ? 'Length must be > 0' : undefined}
                  />

                  <CalculatorInput
                    id="room-width"
                    label="Room Width"
                    value={roomWidth}
                    onChange={setRoomWidth}
                    unit="ft"
                    min={1}
                    max={500}
                    step={0.5}
                    required
                    error={roomWidth <= 0 ? 'Width must be > 0' : undefined}
                  />
                </div>

                {/* Flooring Material Selection */}
                <CalculatorSelect
                  id="flooring-type"
                  label="Flooring Material"
                  value={flooringType}
                  onChange={(val) => setFlooringType(val as any)}
                  options={materialOptions}
                  description="Determines price benchmarks and typical carton packaging yields."
                  required
                />

                {/* Waste Allowance Selector */}
                <WasteSelector
                  value={wastePercentage}
                  onChange={setWastePercentage}
                  options={metadata?.wasteOptions ?? []}
                />

                {/* Advanced Options Accordion */}
                <div className="pt-2 border-t border-[#f1ede4]">
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center justify-between w-full py-1.5 text-xs font-mono font-semibold text-[#57534e] hover:text-[#b8532b]"
                  >
                    <span>{showAdvanced ? '− Hide packaging & accessory options' : '+ Custom carton sq ft & underlayment'}</span>
                    <span className="text-[11px] text-[#78716c] font-normal">
                      {showAdvanced ? '' : 'Default: 20 sq ft/box'}
                    </span>
                  </button>

                  {showAdvanced && (
                    <div className="space-y-4 pt-3 mt-1 bg-[#fbf9f5] p-3.5 rounded border border-[#e3ded4]">
                      <CalculatorInput
                        id="carton-coverage"
                        label="Carton Coverage Specification"
                        value={cartonCoverage}
                        onChange={setCartonCoverage}
                        unit="sq ft"
                        min={5}
                        max={60}
                        step={0.1}
                        description="Check the manufacturer box label. Most LVP cartons contain 18.5 to 24 sq ft."
                        required
                        error={cartonCoverage <= 0 ? 'Must be greater than 0' : undefined}
                      />

                      <div className="pt-1">
                        <label className="flex items-start gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={includeUnderlayment}
                            onChange={(e) => setIncludeUnderlayment(e.target.checked)}
                            className="h-4 w-4 rounded border-[#c8c1b2] text-[#b8532b] focus:ring-[#b8532b] mt-0.5"
                          />
                          <div className="text-xs">
                            <span className="font-semibold text-[#1c1917] block">
                              Include Underlayment Estimate
                            </span>
                            <span className="text-[#78716c] leading-normal block">
                              Check if your flooring does not include an attached acoustic/foam pad. Calculated in standard 100 sq ft rolls with seam tape.
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Live Results & Bill of Materials */}
          <div className="lg:col-span-7 space-y-6" aria-live="polite">
            {calculationResult.success ? (
              <>
                {/* Primary Highlights Card */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ResultMetric
                      label="Recommended Purchase"
                      value={calculationResult.outputs.cartonsToPurchase}
                      unit="cartons"
                      subtext={`Full factory-sealed cartons (${calculationResult.outputs.purchasedSqFt} sq ft total)`}
                      variant="primary"
                    />

                    <ResultMetric
                      label="Total Purchased Surface"
                      value={calculationResult.outputs.purchasedSqFt}
                      unit="sq ft"
                      subtext={`Net floor is ${calculationResult.outputs.netAreaSqFt} sq ft (+${calculationResult.outputs.excessSqFtOverRecommended} sq ft spare cushion)`}
                      variant="secondary"
                    />
                  </div>

                  {/* Underlayment metric if toggled */}
                  {includeUnderlayment && (
                    <div className="p-3.5 rounded border border-[#c8c1b2] bg-[#f7f5f0] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-[#b8532b]" />
                        <div>
                          <span className="font-bold text-[#1c1917] block">
                            Acoustic & Moisture Underlayment
                          </span>
                          <span className="text-[#78716c]">
                            Required for floating installation without attached pad
                          </span>
                        </div>
                      </div>
                      <div className="text-right font-mono font-bold text-sm text-[#1c1917]">
                        {calculationResult.outputs.underlaymentRolls} rolls{' '}
                        <span className="text-[11px] font-normal text-[#78716c] block">(100 sq ft/roll)</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3-Stage Mathematical Breakdown */}
                <ThreeWayBreakdown outputs={calculationResult.outputs} />

                {/* Bill of Materials (Takeoff Table) */}
                <BillOfMaterialsTable items={calculationResult.billOfMaterials} />

                {/* Cost Estimate Card */}
                <CostEstimateCard costEstimate={calculationResult.costEstimate} />
              </>
            ) : (
              /* Invalid input display */
              <div className="p-8 rounded-lg border-2 border-dashed border-[#c8c1b2] bg-[#ffffff] text-center space-y-3">
                <div className="inline-flex p-3 rounded-full bg-[#fcf4ee] text-[#b8532b]">
                  <SlidersHorizontal className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#1c1917]">
                  Enter Valid Room Dimensions
                </h3>
                <p className="text-sm text-[#57534e] max-w-md mx-auto leading-relaxed">
                  Please provide positive room length and width measurements greater than zero to calculate cartons and material takeoffs.
                </p>
                {calculationResult.errors?.map((err, i) => (
                  <div key={i} className="text-xs font-mono text-[#b91c1c]">
                    • {err.message}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* EDITORIAL CONTENT SECTION */}
        {calculationResult.success && (
          <div className="space-y-8 mt-12 border-t border-[#e3ded4] pt-10">
            {/* 1. Step-by-Step Mathematical Explanation */}
            <CalculationExplanation
              outputs={calculationResult.outputs}
              length={roomLength}
              width={roomWidth}
              cartonCoverage={cartonCoverage}
              wastePercent={wastePercentage}
            />

            {/* 2. Planning Assumptions & Exclusions */}
            <AssumptionsList
              assumptions={calculationResult.assumptions}
              notices={calculationResult.notices}
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
                    How to Calculate Flooring Material: Square Footage, Waste, and Cartons
                  </h3>
                  <p className="text-xs sm:text-sm text-[#57534e] mt-1 max-w-xl leading-relaxed">
                    Learn how to measure irregular rooms and closets, understand the 10% to 20% layout scrap factors, and convert net square feet into whole commercial cartons without running short.
                  </p>
                </div>
              </div>
              <a
                href="/guides/how-to-calculate-flooring-material"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded text-xs font-mono font-semibold bg-[#b8532b] text-white hover:bg-[#a04422] transition-colors shrink-0 shadow-xs"
              >
                <span>Read Planning Guide</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* 3. Practical Homeowner Field Tips */}
            <PracticalTips />

            {/* 4. Related Tools & Guides */}
            <RelatedTools currentCalculatorId="flooring-calculator" onNavigate={onNavigate} />
          </div>
        )}
      </Container>
    </div>
  );
};

export const FlooringCalculatorIsland: React.FC = () => {
  const meta = CALCULATORS['flooring-calculator'];
  return (
    <CalculatorTrackerWrapper
      calculatorSlug="flooring-calculator"
      calculatorName={meta.name}
      projectCategory={meta.categoryId}
    >
      <FlooringCalculatorPage />
    </CalculatorTrackerWrapper>
  );
};

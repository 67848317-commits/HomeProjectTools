import React, { useState, useMemo } from 'react';
import { Breadcrumbs } from '../components/common/Breadcrumbs.tsx';
import { Container } from '../components/common/Container.tsx';
import { CalculatorHeader } from '../components/calculator/CalculatorHeader.tsx';
import { CalculatorInput } from '../components/calculator/CalculatorInput.tsx';
import { ResultMetric } from '../components/calculator/ResultMetric.tsx';
import { EstimatingFlow } from '../components/calculator/EstimatingFlow.tsx';
import { BillOfMaterialsTable } from '../components/calculator/BillOfMaterialsTable.tsx';
import { CostEstimateCard } from '../components/calculator/CostEstimateCard.tsx';
import { CalculationExplanation, type CalculationStep } from '../components/calculator/CalculationExplanation.tsx';
import { AssumptionsList } from '../components/calculator/AssumptionsList.tsx';
import { PracticalTips, type PracticalTipItem } from '../components/calculator/PracticalTips.tsx';
import { RelatedTools } from '../components/calculator/RelatedTools.tsx';

import { calculatePaint } from '../scripts/calculators/paint.ts';
import { CALCULATORS } from '../data/calculators.ts';
import { CATEGORIES } from '../data/categories.ts';
import {
  RotateCcw,
  SlidersHorizontal,
  Paintbrush,
  CheckCircle2,
  MinusCircle,
  Layers,
  Sparkles,
  ShieldCheck,
  Wrench,
  AlertCircle,
  HelpCircle,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

interface PaintCalculatorPageProps {
  onNavigate?: (path: string) => void;
}

export const PaintCalculatorPage: React.FC<PaintCalculatorPageProps> = ({ onNavigate }) => {
  const metadata = CALCULATORS['paint-calculator'];
  const category = CATEGORIES['painting'];

  // Inputs
  const [roomLength, setRoomLength] = useState<number>(14);
  const [roomWidth, setRoomWidth] = useState<number>(12);
  const [wallHeight, setWallHeight] = useState<number>(8);
  const [doorCount, setDoorCount] = useState<number>(2);
  const [windowCount, setWindowCount] = useState<number>(2);
  const [coatCount, setCoatCount] = useState<number>(2);
  const [coveragePerGallon, setCoveragePerGallon] = useState<number>(350);
  const [includeCeiling, setIncludeCeiling] = useState<boolean>(false);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Live calculation
  const calculationResult = useMemo(() => {
    return calculatePaint({
      roomLength,
      roomWidth,
      wallHeight,
      doorCount,
      windowCount,
      coatCount,
      coveragePerGallon,
      includeCeiling,
    });
  }, [
    roomLength,
    roomWidth,
    wallHeight,
    doorCount,
    windowCount,
    coatCount,
    coveragePerGallon,
    includeCeiling,
  ]);

  const handleReset = () => {
    setRoomLength(14);
    setRoomWidth(12);
    setWallHeight(8);
    setDoorCount(2);
    setWindowCount(2);
    setCoatCount(2);
    setCoveragePerGallon(350);
    setIncludeCeiling(false);
  };

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: category?.name ?? 'Painting & Finishes', href: category?.hubPath ?? '/projects/painting-finishes' },
    { label: 'Interior Paint Calculator' },
  ];

  const outputs = calculationResult.success ? calculationResult.outputs : undefined;

  const paintSteps: CalculationStep[] = outputs
    ? [
        {
          stepNumber: 1,
          title: 'Calculate Gross Wall Perimeter Surface Area',
          description: 'Determine the total vertical wall area by measuring perimeter length times ceiling height.',
          formulaDisplay: (
            <span>
              2 × ({roomLength} ft + {roomWidth} ft) × {wallHeight} ft ={' '}
              <strong>{outputs.grossWallAreaSqFt} sq ft gross</strong>
            </span>
          ),
        },
        {
          stepNumber: 2,
          title: 'Deduct Doors and Windows',
          description: 'Standard residential doors occupy ~21 sq ft and windows occupy ~15 sq ft of non-painted space.',
          formulaDisplay: (
            <span>
              ({doorCount} doors × 21 sq ft) + ({windowCount} windows × 15 sq ft) ={' '}
              <strong>-{outputs.doorWindowDeductionsSqFt} sq ft deduction</strong> → Net Wall Area ={' '}
              <strong>{outputs.netWallAreaSqFt} sq ft</strong>
            </span>
          ),
        },
        {
          stepNumber: 3,
          title: 'Multiply by Number of Paint Coats',
          description: `Two coats are standard for uniform coverage, true color depth, and washability durability.`,
          formulaDisplay: (
            <span>
              {outputs.netWallAreaSqFt} sq ft × {coatCount} coats ={' '}
              <strong>{outputs.netWallAreaSqFt * coatCount} sq ft wall coverage</strong>
              {includeCeiling && (
                <span>
                  {' '}+ {outputs.ceilingAreaSqFt} sq ft ceiling ={' '}
                  <strong>{outputs.effectiveTotalAreaSqFt} sq ft total coated surface</strong>
                </span>
              )}
            </span>
          ),
        },
        {
          stepNumber: 4,
          title: 'Apply Rated Paint Spread Rate (Coverage)',
          description: 'Premium latex paint covers 350 to 400 sq ft per gallon on previously painted drywall.',
          formulaDisplay: (
            <span>
              Wall: {outputs.netWallAreaSqFt * coatCount} sq ft ÷ {coveragePerGallon} sq ft/gal ={' '}
              <strong>{outputs.wallGallonsExact} unrounded gallons</strong>
            </span>
          ),
        },
        {
          stepNumber: 5,
          title: 'Round Upward to Whole Commercial Gallon Cans',
          description: 'Paint stores sell full gallon cans or 5-gallon pails. Mathematical ceiling ensures you never run out mid-wall.',
          formulaDisplay: (
            <span className="text-[#b8532b]">
              ⌈{outputs.wallGallonsExact}⌉ = <strong>{outputs.wallGallonsToPurchase} gallon cans for walls</strong>
              {includeCeiling && (
                <span>
                  {' '}+ {outputs.ceilingGallonsToPurchase} gal ceiling ={' '}
                  <strong>{outputs.totalGallonsToPurchase} total gallons</strong>
                </span>
              )}
            </span>
          ),
        },
      ]
    : [];

  const paintTips: PracticalTipItem[] = [
    {
      title: 'Box Your Paint Cans Together',
      desc: 'Mix all gallon cans into a clean 5-gallon bucket before rolling ("boxing"). Even computer-tinted cans can have tiny shade variations between batches.',
      icon: Paintbrush,
    },
    {
      title: 'Select the Proper Roller Nap Thickness',
      desc: 'Use 3/8" nap for smooth interior drywall; 1/2" nap for light orange peel texture; 3/4" nap for heavy knockdown or masonry brick.',
      icon: Wrench,
    },
    {
      title: 'Prime Before Drastic Color Changes',
      desc: 'When painting a light pastel over dark burgundy or navy, or painting raw unsealed drywall/patching compound, apply a tinted primer coat first to save money.',
      icon: Layers,
    },
    {
      title: 'Save Touchup Paint in a Glass Jar',
      desc: 'Save 1 quart of paint in a small sealed glass mason jar labeled with the room name, paint brand, sheen, and formula code for future scuff touchups.',
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
          title={metadata?.name ?? 'Interior Paint Coverage Calculator'}
          categoryName={category?.name ?? 'Finishes & Decorating'}
          description="Estimate wall and ceiling paintable square footage, standard door and window deductions, multi-coat spread rates, and whole-gallon purchase quantities."
          targetIntent={metadata?.targetIntent}
        />

        {/* Main Interactive Estimating Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* LEFT COLUMN: Room & Paint Inputs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-lg border border-[#e3ded4] bg-[#ffffff] p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#e3ded4] pb-3 mb-5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-[#f7f5f0] border border-[#e3ded4] text-[#b8532b]">
                    <SlidersHorizontal className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#1c1917]">
                      Room & Paint Specifications
                    </h2>
                    <span className="text-[11px] text-[#78716c]">
                      Room dimensions and wall deductions
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1 text-xs font-mono text-[#78716c] hover:text-[#b8532b] transition-colors"
                  title="Reset to 14x12 ft defaults"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset</span>
                </button>
              </div>

              <div className="space-y-5">
                {/* Room Dimensions */}
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase font-semibold text-[#57534e]">
                    1. Room Dimensions
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <CalculatorInput
                      id="room-length"
                      label="Length"
                      value={roomLength}
                      onChange={setRoomLength}
                      unit="ft"
                      min={1}
                      max={200}
                      step={0.5}
                      required
                      error={roomLength <= 0 ? '> 0' : undefined}
                    />

                    <CalculatorInput
                      id="room-width"
                      label="Width"
                      value={roomWidth}
                      onChange={setRoomWidth}
                      unit="ft"
                      min={1}
                      max={200}
                      step={0.5}
                      required
                      error={roomWidth <= 0 ? '> 0' : undefined}
                    />

                    <CalculatorInput
                      id="wall-height"
                      label="Height"
                      value={wallHeight}
                      onChange={setWallHeight}
                      unit="ft"
                      min={6}
                      max={30}
                      step={0.5}
                      required
                      error={wallHeight <= 0 ? '> 0' : undefined}
                    />
                  </div>
                </div>

                {/* Deductions: Doors & Windows */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase font-semibold text-[#57534e]">
                      2. Openings / Deductions
                    </span>
                    <span className="text-[11px] font-mono text-[#78716c]">
                      Benchmark: 21 sq ft/door • 15 sq ft/window
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <CalculatorInput
                      id="door-count"
                      label="Doors"
                      value={doorCount}
                      onChange={setDoorCount}
                      unit="doors"
                      min={0}
                      max={20}
                      step={1}
                      description="Assumes standard 3'x7' (~21 sq ft) opening"
                    />

                    <CalculatorInput
                      id="window-count"
                      label="Windows"
                      value={windowCount}
                      onChange={setWindowCount}
                      unit="windows"
                      min={0}
                      max={30}
                      step={1}
                      description="Assumes standard 3'x5' (~15 sq ft) opening"
                    />
                  </div>
                </div>

                {/* Number of Coats */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase font-semibold text-[#57534e]">
                      3. Number of Coats
                    </span>
                    <span className="text-xs font-mono font-bold text-[#b8532b] bg-[#fcf4ee] px-2 py-0.5 rounded border border-[#e3ded4]">
                      {coatCount} {coatCount === 1 ? 'Coat' : 'Coats'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCoatCount(c)}
                        className={`py-2 px-3 rounded border text-xs font-mono transition-all text-center ${
                          coatCount === c
                            ? 'border-[#b8532b] bg-[#fcf4ee] text-[#b8532b] font-bold shadow-xs'
                            : 'border-[#c8c1b2] bg-[#ffffff] text-[#57534e] hover:bg-[#f7f5f0]'
                        }`}
                      >
                        <span className="block font-bold text-sm">{c}</span>
                        <span className="text-[10px] block text-[#78716c]">
                          {c === 1 ? 'Refresh' : c === 2 ? 'Standard' : 'Deep/Dark'}
                        </span>
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-[#78716c] leading-snug">
                    Two coats ensure uniform sheen, eliminate blotchiness, and give true paint chip color.
                  </p>
                </div>

                {/* Include Ceiling Toggle */}
                <div className="p-3.5 rounded bg-[#f7f5f0] border border-[#e3ded4] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-[#1c1917] block">
                        Paint Room Ceiling?
                      </span>
                      <span className="text-[11px] text-[#78716c]">
                        Calculates flat ceiling paint separately ({roomLength * roomWidth} sq ft)
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIncludeCeiling(!includeCeiling)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        includeCeiling ? 'bg-[#b8532b]' : 'bg-[#c8c1b2]'
                      }`}
                      role="switch"
                      aria-checked={includeCeiling}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          includeCeiling ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {includeCeiling && (
                    <div className="pt-2 border-t border-[#e3ded4] text-xs font-mono text-[#57534e]">
                      <span>Includes 1 refresh coat on flat ceiling ({roomLength * roomWidth} sq ft)</span>
                    </div>
                  )}
                </div>

                {/* Advanced Options */}
                <div className="border-t border-[#e3ded4] pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center justify-between w-full text-xs font-mono font-semibold text-[#57534e] hover:text-[#1c1917] transition-colors"
                  >
                    <span>Paint Coverage / Spread Rate Spec</span>
                    <span>{showAdvanced ? '− Hide' : '+ Show Options'}</span>
                  </button>

                  {showAdvanced && (
                    <div className="mt-4 space-y-4 rounded bg-[#f7f5f0] p-3.5 border border-[#e3ded4]">
                      <CalculatorInput
                        id="coverage-gallon"
                        label="Rated Coverage per Gallon"
                        value={coveragePerGallon}
                        onChange={setCoveragePerGallon}
                        unit="sq ft/gal"
                        min={200}
                        max={500}
                        step={10}
                        description="Listed on paint can label (typically 350 to 400 sq ft/gal for premium latex)."
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Output Results & Step-Down Deduction */}
          <div className="lg:col-span-7 space-y-6" aria-live="polite">
            {calculationResult.success ? (
              (() => {
                const out = calculationResult.outputs;
                return (
                  <>
                    {/* Primary Metric Highlight */}
                    <div className="space-y-4">
                      <ResultMetric
                        label="Commercial Paint Order"
                        value={out.totalGallonsToPurchase}
                        unit={out.totalGallonsToPurchase === 1 ? 'gallon' : 'gallons'}
                        subtext={
                          includeCeiling
                            ? `${out.wallGallonsToPurchase} gal wall paint + ${out.ceilingGallonsToPurchase} gal ceiling paint (${out.effectiveTotalAreaSqFt} sq ft total coated)`
                            : `${out.wallGallonsToPurchase} gal wall paint (${out.wallGallonsExact} unrounded gal needed for ${coatCount} coats)`
                        }
                        variant="primary"
                      />

                      {/* Secondary Metrics Bar */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        <ResultMetric
                          label="Gross Wall Area"
                          value={out.grossWallAreaSqFt}
                          unit="sq ft"
                          subtext="Perimeter × Height"
                        />
                        <ResultMetric
                          label="Deductions"
                          value={out.doorWindowDeductionsSqFt}
                          unit="sq ft"
                          subtext={`${doorCount} doors, ${windowCount} windows`}
                        />
                        <ResultMetric
                          label="Net Wall Surface"
                          value={out.netWallAreaSqFt}
                          unit="sq ft"
                          subtext="Paintable area"
                        />
                        <ResultMetric
                          label="Coated Area"
                          value={out.effectiveTotalAreaSqFt}
                          unit="sq ft"
                          subtext={`${coatCount} coats applied`}
                        />
                      </div>
                    </div>

                    {/* VISUAL STEP-DOWN DEDUCTION PIPELINE (Family B Specific) */}
                    <div className="rounded-lg border border-[#e3ded4] bg-[#ffffff] p-4 shadow-xs space-y-3">
                      <div className="flex items-center justify-between border-b border-[#e3ded4] pb-2">
                        <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[#1c1917] flex items-center gap-1.5">
                          <Layers className="h-3.5 w-3.5 text-[#b8532b]" />
                          <span>Surface Deduction & Multi-Coat Sequence</span>
                        </h3>
                        <span className="text-[11px] font-mono text-[#78716c]">
                          Surface Area → Liquid Coverage
                        </span>
                      </div>

                      {/* Step-down breakdown visual steps */}
                      <div className="space-y-2 text-xs font-mono">
                        <div className="flex items-center justify-between p-2 rounded bg-[#f7f5f0] border border-[#e3ded4]">
                          <span className="text-[#57534e]">1. Gross Wall Area (Perimeter × Height)</span>
                          <span className="font-bold text-[#1c1917]">{out.grossWallAreaSqFt} sq ft</span>
                        </div>

                        <div className="flex items-center justify-between p-2 rounded bg-[#fef2f2] border border-[#fecaca] text-[#991b1b]">
                          <span className="flex items-center gap-1">
                            <MinusCircle className="h-3.5 w-3.5" />
                            <span>Door & Window Deductions ({doorCount} doors, {windowCount} windows)</span>
                          </span>
                          <span className="font-bold">-{out.doorWindowDeductionsSqFt} sq ft</span>
                        </div>

                        <div className="flex items-center justify-between p-2 rounded bg-[#f7f5f0] border border-[#e3ded4]">
                          <span className="text-[#57534e]">3. Net Paintable Wall Surface</span>
                          <span className="font-bold text-[#1c1917]">{out.netWallAreaSqFt} sq ft</span>
                        </div>

                        <div className="flex items-center justify-between p-2 rounded bg-[#f7f5f0] border border-[#e3ded4]">
                          <span className="text-[#57534e]">4. Coated Wall Area ({coatCount} coats applied)</span>
                          <span className="font-bold text-[#1c1917]">{out.netWallAreaSqFt * coatCount} sq ft</span>
                        </div>

                        {includeCeiling && (
                          <div className="flex items-center justify-between p-2 rounded bg-[#edf3f9] border border-[#c5d8ea] text-[#1e3a5f]">
                            <span>+ Ceiling Surface ({roomLength * roomWidth} sq ft × 1 coat)</span>
                            <span className="font-bold">+{out.ceilingAreaSqFt} sq ft</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between p-2.5 rounded bg-[#fcf4ee] border-2 border-[#b8532b] text-[#b8532b]">
                          <span className="font-bold">
                            Commercial Gallons to Buy (÷ {coveragePerGallon} sq ft/gal, Ceil)
                          </span>
                          <span className="font-bold text-base">{out.totalGallonsToPurchase} Gallons</span>
                        </div>
                      </div>
                    </div>

                    {/* 4-Stage Estimating Flow */}
                    <EstimatingFlow
                      title="Liquid Coverage Breakdown"
                      subtitle="Family B: Surface to Liquid"
                      stages={[
                        {
                          stageNumber: 1,
                          stageTitle: 'Gross Walls',
                          badgeText: 'Stage 1',
                          badgeVariant: 'neutral',
                          primaryValue: out.grossWallAreaSqFt,
                          primaryUnit: 'sq ft',
                          secondaryNote: `2 × (${roomLength} + ${roomWidth}) × ${wallHeight}`,
                          description: 'Total vertical drywall envelope before openings.',
                        },
                        {
                          stageNumber: 2,
                          stageTitle: 'Net Paintable',
                          badgeText: `-${out.doorWindowDeductionsSqFt} Deductions`,
                          badgeVariant: 'info',
                          primaryValue: out.netWallAreaSqFt,
                          primaryUnit: 'sq ft',
                          secondaryNote: `${doorCount} doors, ${windowCount} windows`,
                          description: 'Physical drywall area requiring primer/paint.',
                        },
                        {
                          stageNumber: 3,
                          stageTitle: 'Total Coated Area',
                          badgeText: `${coatCount} Coats`,
                          badgeVariant: 'neutral',
                          primaryValue: out.effectiveTotalAreaSqFt,
                          primaryUnit: 'sq ft',
                          secondaryNote: includeCeiling ? 'Includes ceiling' : 'Walls only',
                          description: 'Effective square footage covered by liquid film.',
                        },
                        {
                          stageNumber: 4,
                          stageTitle: 'Commercial Gallons',
                          badgeText: 'Store Order',
                          badgeVariant: 'terracotta',
                          primaryValue: out.totalGallonsToPurchase,
                          primaryUnit: out.totalGallonsToPurchase === 1 ? 'gal can' : 'gal cans',
                          secondaryNote: `${coveragePerGallon} sq ft/gal rating`,
                          description: `Rounded up to full factory 1-gallon cans for clean batching.`,
                          isCallout: true,
                        },
                      ]}
                      formulaConfirmation={
                        <span>
                          <strong>Coverage Spread Rate:</strong> {out.effectiveTotalAreaSqFt} coated sq ft ÷ {coveragePerGallon} sq ft/gal = {(out.effectiveTotalAreaSqFt / coveragePerGallon).toFixed(2)} unrounded gal → rounded up to <strong>{out.totalGallonsToPurchase} whole 1-gallon cans</strong>.
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
                <h3 className="font-bold text-base mb-1">Invalid Room Dimensions</h3>
                <p>
                  {calculationResult.errors[0]?.message ??
                    'Please verify that room length, width, and height are greater than zero.'}
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
              title="How This Paint Coverage Calculation Works"
              subtitle="Transparent Engineering Math"
              description="Our calculation engine executes five deterministic steps to convert room measurements and opening deductions into full gallon cans."
              steps={paintSteps}
            />

            {/* 2. Planning Assumptions & Exclusions */}
            <AssumptionsList
              assumptions={calculationResult.assumptions}
              notices={calculationResult.notices}
              limitations={[
                'Trim & Baseboards: Baseboards, crown moldings, doors, and window casings require semi-gloss enamel paint and are estimated separately.',
                'Substrate Porosity: Unprimed fresh drywall, heavy texturing, or extreme color transitions (e.g. pastel over dark red) consume 15–25% more paint on the initial coat.',
                'Container Sizing: When a project requires 5 or more gallons of the same color, 5-gallon contractor buckets are typically 15–20% more economical than individual single-gallon cans.',
              ]}
              scopeTitle="Out of Scope / Separate Items"
              benchmarkNote="Paint prices reflect median national home center shelf benchmarks for premium 100% acrylic interior latex paint."
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
                    How Much Paint Do I Need? Wall Coverage, Coats, and Gallons
                  </h3>
                  <p className="text-xs sm:text-sm text-[#57534e] mt-1 max-w-xl leading-relaxed">
                    Learn the 350–400 sq ft/gal spread rate benchmark, when 2 coats are mandatory, opening deduction rules, and how to avoid mid-project paint store return runs.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate && onNavigate('/guides/how-much-paint-do-i-need')}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded text-xs font-mono font-semibold bg-[#b8532b] text-white hover:bg-[#a04422] transition-colors shrink-0 shadow-xs"
              >
                <span>Read Planning Guide</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* 3. Practical Homeowner Field Tips */}
            <PracticalTips
              title="Practical Field Tips for Interior Painting"
              subtitle="Contractor Advice"
              tips={paintTips}
            />

            {/* 4. Related Tools & Guides */}
            <RelatedTools currentCalculatorId="paint-calculator" onNavigate={onNavigate} />
          </div>
        )}
      </Container>
    </div>
  );
};

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

import { calculateDrywall } from '../scripts/calculators/drywall.ts';
import { CALCULATORS } from '../data/calculators.ts';
import { CATEGORIES } from '../data/categories.ts';
import { getBenchmarkPriceRange } from '../data/prices.ts';
import { roundToPrecision } from '../scripts/core/math-utils.ts';
import type { BillOfMaterialsItem } from '../types/index.ts';
import {
  RotateCcw,
  SlidersHorizontal,
  Layers,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  Info,
  Package,
  Wrench,
  CheckCircle2,
  Maximize2,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

interface DrywallCalculatorPageProps {
  onNavigate?: (path: string) => void;
}

export const DrywallCalculatorPage: React.FC<DrywallCalculatorPageProps> = ({ onNavigate }) => {
  const metadata = CALCULATORS['drywall-calculator'];
  const category = CATEGORIES['walls-drywall'];

  // Form State
  const [roomLength, setRoomLength] = useState<number>(16);
  const [roomWidth, setRoomWidth] = useState<number>(12);
  const [ceilingHeight, setCeilingHeight] = useState<number>(8);
  const [includeCeiling, setIncludeCeiling] = useState<boolean>(true);
  const [doorCount, setDoorCount] = useState<number>(1);
  const [windowCount, setWindowCount] = useState<number>(2);
  const [wastePercentage, setWastePercentage] = useState<number>(10);
  const [preferredSheetSize, setPreferredSheetSize] = useState<'4x8' | '4x12'>('4x8');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Live calculation
  const calculationResult = useMemo(() => {
    return calculateDrywall({
      roomLength,
      roomWidth,
      ceilingHeight,
      includeCeiling,
      doorCount,
      windowCount,
      wastePercentage,
    });
  }, [roomLength, roomWidth, ceilingHeight, includeCeiling, doorCount, windowCount, wastePercentage]);

  const handleReset = () => {
    setRoomLength(16);
    setRoomWidth(12);
    setCeilingHeight(8);
    setIncludeCeiling(true);
    setDoorCount(1);
    setWindowCount(2);
    setWastePercentage(10);
    setPreferredSheetSize('4x8');
  };

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: category?.name ?? 'Walls & Drywall', href: category?.hubPath ?? '/projects/walls-drywall' },
    { label: metadata?.name ?? 'Drywall Sheet & Mud Calculator' },
  ];

  // Companion Bill of Materials with all 4 components
  const companionBOM: BillOfMaterialsItem[] = useMemo(() => {
    if (!calculationResult.success) return [];
    const out = calculationResult.outputs;

    const sheetPricing = getBenchmarkPriceRange('drywall-sheet-4x8');
    const mudPricing = getBenchmarkPriceRange('drywall-joint-compound-bucket');
    const accessPricing = getBenchmarkPriceRange('drywall-accessories-kit');

    const selectedSheets = preferredSheetSize === '4x8' ? out.sheets4x8ToPurchase : out.sheets4x12ToPurchase;
    const sheetSqFt = preferredSheetSize === '4x8' ? 32 : 48;
    // 4x12 sheets are typically 1.5x the cost of 4x8
    const sheetMultiplier = preferredSheetSize === '4x8' ? 1 : 1.5;

    return [
      {
        id: `drywall-sheets-${preferredSheetSize}`,
        name: preferredSheetSize === '4x8' ? "4' x 8' Drywall Sheets (1/2\")" : "4' x 12' Drywall Sheets (1/2\")",
        description: preferredSheetSize === '4x8'
          ? 'Standard 1/2" residential gypsum board (32 sq ft per sheet)'
          : 'Long-span 1/2" gypsum board (48 sq ft per sheet, 33% fewer butt seams)',
        exactQuantity: roundToPrecision(out.recommendedDrywallAreaSqFt / sheetSqFt, 1),
        recommendedQuantity: roundToPrecision(out.recommendedDrywallAreaSqFt, 1),
        purchaseQuantity: selectedSheets,
        packageUnit: 'sheets',
        unitSizeDescription: `${preferredSheetSize} ft (${sheetSqFt} sq ft/sheet)`,
        wasteAppliedPercentage: wastePercentage,
        benchmarkPriceId: 'drywall-sheet-4x8',
        estimatedCost: {
          low: Math.round(selectedSheets * sheetPricing.low * sheetMultiplier),
          typical: Math.round(selectedSheets * sheetPricing.typical * sheetMultiplier),
          high: Math.round(selectedSheets * sheetPricing.high * sheetMultiplier),
        },
      },
      {
        id: 'drywall-joint-compound',
        name: 'All-Purpose Joint Compound (4.5 Gal Bucket)',
        description: 'Premixed all-purpose mud for embedding joint tape and applying 3 finish coats',
        exactQuantity: roundToPrecision(out.recommendedDrywallAreaSqFt / 400, 2),
        recommendedQuantity: roundToPrecision(out.recommendedDrywallAreaSqFt, 1),
        purchaseQuantity: out.jointCompound45GalBuckets,
        packageUnit: 'buckets',
        unitSizeDescription: '4.5-gal bucket (covers ~400 sq ft)',
        wasteAppliedPercentage: wastePercentage,
        benchmarkPriceId: 'drywall-joint-compound-bucket',
        estimatedCost: {
          low: Math.round(out.jointCompound45GalBuckets * mudPricing.low),
          typical: Math.round(out.jointCompound45GalBuckets * mudPricing.typical),
          high: Math.round(out.jointCompound45GalBuckets * mudPricing.high),
        },
      },
      {
        id: 'drywall-tape',
        name: "Joint Tape (500' Roll)",
        description: 'Reinforcing paper or fiberglass joint tape for flat seams and inside corners',
        exactQuantity: roundToPrecision(out.recommendedDrywallAreaSqFt / 600, 2),
        recommendedQuantity: roundToPrecision(out.recommendedDrywallAreaSqFt, 1),
        purchaseQuantity: out.drywallTape500ftRolls,
        packageUnit: 'rolls',
        unitSizeDescription: "500' roll (covers ~600 sq ft of board)",
        wasteAppliedPercentage: wastePercentage,
        benchmarkPriceId: 'drywall-accessories-kit',
        estimatedCost: {
          low: Math.round(out.drywallTape500ftRolls * (accessPricing.low * 0.35)),
          typical: Math.round(out.drywallTape500ftRolls * (accessPricing.typical * 0.35)),
          high: Math.round(out.drywallTape500ftRolls * (accessPricing.high * 0.35)),
        },
      },
      {
        id: 'drywall-screws',
        name: '1-1/4" Coarse Drywall Screws',
        description: 'Bugle head drywall screws for wood stud fastening (~300 screws per lb)',
        exactQuantity: roundToPrecision(out.recommendedDrywallAreaSqFt / 300, 1),
        recommendedQuantity: roundToPrecision(out.recommendedDrywallAreaSqFt, 1),
        purchaseQuantity: out.drywallScrewsLbs,
        packageUnit: 'lbs',
        unitSizeDescription: '1 lb per ~300 sq ft (16" o.c. framing)',
        wasteAppliedPercentage: wastePercentage,
        benchmarkPriceId: 'drywall-accessories-kit',
        estimatedCost: {
          low: Math.round(out.drywallScrewsLbs * (accessPricing.low * 0.65)),
          typical: Math.round(out.drywallScrewsLbs * (accessPricing.typical * 0.65)),
          high: Math.round(out.drywallScrewsLbs * (accessPricing.high * 0.65)),
        },
      },
    ];
  }, [calculationResult, preferredSheetSize, wastePercentage]);

  const explanationSteps: CalculationStep[] = useMemo(() => {
    if (!calculationResult.success) return [];
    const out = calculationResult.outputs;

    return [
      {
        stepNumber: 1,
        title: 'Calculate Gross Wall & Ceiling Area',
        description: 'Compute wall perimeter multiplied by ceiling height, plus ceiling surface area if included.',
        formulaDisplay: (
          <span>
            Walls: 2 × ({roomLength}&apos; + {roomWidth}&apos;) × {ceilingHeight}&apos; = {out.wallAreaSqFt} sq ft
            {includeCeiling ? ` + Ceiling: ${roomLength}' × ${roomWidth}' (${out.ceilingAreaSqFt} sq ft) = ${out.totalGrossAreaSqFt} sq ft gross` : ' (ceiling excluded)'}
          </span>
        ),
      },
      {
        stepNumber: 2,
        title: 'Deduct Openings (Doors & Windows)',
        description: 'Subtract standard deductions for doors (21 sq ft each) and windows (15 sq ft each).',
        formulaDisplay: (
          <span>
            {out.totalGrossAreaSqFt} sq ft gross - ({doorCount} doors × 21 + {windowCount} windows × 15 = {out.openingsDeductionSqFt} sq ft) ={' '}
            <strong>{out.netDrywallAreaSqFt} sq ft net</strong>
          </span>
        ),
      },
      {
        stepNumber: 3,
        title: 'Apply Cut Waste Allowance',
        description: 'Add cut waste buffer to account for outlet cutouts, window returns, and framing off-cuts.',
        formulaDisplay: (
          <span>
            {out.netDrywallAreaSqFt} sq ft × (1 + {wastePercentage / 100}) ={' '}
            <strong className="text-[#b8532b]">{out.recommendedDrywallAreaSqFt} sq ft recommended</strong>
          </span>
        ),
      },
      {
        stepNumber: 4,
        title: 'Derive Panels and Companion Materials',
        description: 'Divide recommended area by panel yield (32 sq ft for 4x8, 48 sq ft for 4x12) and apply standard finishing material benchmarks.',
        formulaDisplay: (
          <span>
            4×8: {out.recommendedDrywallAreaSqFt} ÷ 32 = <strong>{out.sheets4x8ToPurchase} sheets</strong> •
            4×12: {out.recommendedDrywallAreaSqFt} ÷ 48 = <strong>{out.sheets4x12ToPurchase} sheets</strong> •
            Mud: <strong>{out.jointCompound45GalBuckets} buckets</strong> (400 sq ft/bucket) •
            Tape: <strong>{out.drywallTape500ftRolls} roll(s)</strong> •
            Screws: <strong>{out.drywallScrewsLbs} lbs</strong>
          </span>
        ),
      },
    ];
  }, [calculationResult, roomLength, roomWidth, ceilingHeight, includeCeiling, doorCount, windowCount, wastePercentage]);

  const practicalTips: PracticalTipItem[] = [
    {
      title: 'Hang Ceiling Drywall First',
      desc: 'Always hang ceiling panels before walls. Wall sheets pressed tight against ceiling edges provide permanent perimeter support and prevent corner seam cracking.',
      icon: Layers,
    },
    {
      title: 'Orient Panels Horizontally Across Studs',
      desc: 'Hanging 8-ft or 12-ft sheets horizontally across studs bridges minor framing irregularities, creates continuous horizontal tape lines at comfortable waist height, and increases shear resistance.',
      icon: Wrench,
    },
    {
      title: 'Check Stairwell and Doorway Access for 12-Foot Sheets',
      desc: '12-foot sheets reduce vertical butt joints by 33%, but are difficult or impossible to navigate down narrow basement stairwells or around sharp 90-degree hallway turns.',
      icon: Maximize2,
    },
    {
      title: 'Stagger Butt Joints by at Least 4 Feet',
      desc: 'Never align butt seams on adjacent rows over the same stud. Staggering butt joints distributes stress and makes tape seams virtually invisible under raking light.',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="py-6 sm:py-10">
      <Container>
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />

        {/* Page Header */}
        <CalculatorHeader
          title={metadata?.name ?? 'Drywall Sheet & Mud Calculator'}
          categoryName={category?.name ?? 'Walls & Drywall'}
          description="Calculate drywall sheets (4x8 and 4x12), all-purpose joint compound, seam tape, and screws for rooms, basements, and additions with opening deductions."
          targetIntent={metadata?.targetIntent}
        />

        {/* Main Interactive Estimating Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* LEFT COLUMN: Dimensions & Waste Inputs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-lg border border-[#e3ded4] bg-[#ffffff] p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#e3ded4] pb-3 mb-5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-[#f7f5f0] border border-[#e3ded4] text-[#b8532b]">
                    <SlidersHorizontal className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#1c1917]">
                      Room Dimensions & Layout
                    </h2>
                    <span className="text-[11px] text-[#78716c]">
                      Wall dimensions, ceiling toggle & opening deductions
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
                {/* 1. Room Footprint */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CalculatorInput
                    id="room-length"
                    label="Room Length"
                    value={roomLength}
                    onChange={setRoomLength}
                    unit="ft"
                    min={4}
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
                    min={4}
                    max={200}
                    step={0.5}
                    required
                  />
                </div>

                {/* 2. Ceiling Height & Toggle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <CalculatorInput
                    id="ceiling-height"
                    label="Ceiling Height"
                    value={ceilingHeight}
                    onChange={setCeilingHeight}
                    unit="ft"
                    min={6}
                    max={20}
                    step={0.5}
                    required
                  />

                  <div className="pt-4">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={includeCeiling}
                        onChange={(e) => setIncludeCeiling(e.target.checked)}
                        className="h-4 w-4 rounded border-[#c8c1b2] text-[#b8532b] focus:ring-[#b8532b]"
                      />
                      <span className="text-xs font-medium text-[#1c1917]">
                        Include Ceiling Drywall
                      </span>
                    </label>
                    <span className="text-[11px] text-[#78716c] block mt-1">
                      Adds {roomLength * roomWidth} sq ft for ceiling
                    </span>
                  </div>
                </div>

                {/* 3. Openings (Doors and Windows) */}
                <div className="rounded-lg bg-[#f7f5f0] p-4 border border-[#e3ded4] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase text-[#1c1917]">
                      Openings Deductions
                    </span>
                    <span className="text-[11px] font-mono text-[#78716c]">
                      Door: 21 sq ft • Window: 15 sq ft
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <CalculatorInput
                      id="doors"
                      label="Standard Doors"
                      value={doorCount}
                      onChange={setDoorCount}
                      unit="doors"
                      min={0}
                      max={20}
                      step={1}
                    />

                    <CalculatorInput
                      id="windows"
                      label="Standard Windows"
                      value={windowCount}
                      onChange={setWindowCount}
                      unit="windows"
                      min={0}
                      max={30}
                      step={1}
                    />
                  </div>
                </div>

                {/* 4. Preferred Sheet Size Selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase text-[#1c1917]">
                    Target Sheet Size Preference
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPreferredSheetSize('4x8')}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        preferredSheetSize === '4x8'
                          ? 'border-[#b8532b] bg-[#fcf4ee] ring-1 ring-[#b8532b]'
                          : 'border-[#e3ded4] bg-[#ffffff] hover:bg-[#faf8f5]'
                      }`}
                    >
                      <div className="font-mono font-bold text-xs text-[#1c1917]">
                        4&apos; × 8&apos; Sheet (32 sq ft)
                      </div>
                      <div className="text-[11px] text-[#78716c] mt-0.5">
                        Standard DIY size; easier to haul and carry
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreferredSheetSize('4x12')}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        preferredSheetSize === '4x12'
                          ? 'border-[#b8532b] bg-[#fcf4ee] ring-1 ring-[#b8532b]'
                          : 'border-[#e3ded4] bg-[#ffffff] hover:bg-[#faf8f5]'
                      }`}
                    >
                      <div className="font-mono font-bold text-xs text-[#1c1917]">
                        4&apos; × 12&apos; Sheet (48 sq ft)
                      </div>
                      <div className="text-[11px] text-[#78716c] mt-0.5">
                        Pro size; 33% fewer vertical butt seams
                      </div>
                    </button>
                  </div>
                </div>

                {/* 5. Waste / Cut Factor */}
                <WasteSelector
                  value={wastePercentage}
                  onChange={setWastePercentage}
                  options={metadata.wasteOptions}
                  title="Drywall Cut & Edge Trimming Allowance"
                  customLabel="Allowance"
                  principleNote="Sheet goods generate scrap when cutting around electrical outlets, corners, and window headers. 10% is standard for typical rectangular rooms."
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Output Results & Companion BOM */}
          <div className="lg:col-span-7 space-y-6" aria-live="polite">
            {calculationResult.success ? (
              (() => {
                const out = calculationResult.outputs;
                const selectedSheets = preferredSheetSize === '4x8' ? out.sheets4x8ToPurchase : out.sheets4x12ToPurchase;

                return (
                  <>
                    {/* Primary Takeoff Result */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <ResultMetric
                          label={`Drywall Sheets (${preferredSheetSize})`}
                          value={selectedSheets}
                          unit="sheets"
                          subtext={preferredSheetSize === '4x8' ? '32 sq ft per sheet' : '48 sq ft per sheet'}
                          variant="primary"
                        />
                        <ResultMetric
                          label="Net Coverage Area"
                          value={out.netDrywallAreaSqFt}
                          unit="sq ft"
                          subtext={`Planning: ${out.recommendedDrywallAreaSqFt} sq ft (+${wastePercentage}% waste)`}
                          variant="primary"
                        />
                      </div>

                      {/* Secondary Metrics Bar */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        <ResultMetric
                          label="Joint Compound"
                          value={out.jointCompound45GalBuckets}
                          unit="buckets"
                          subtext="4.5-gal premix"
                        />
                        <ResultMetric
                          label="Joint Tape"
                          value={out.drywallTape500ftRolls}
                          unit="rolls"
                          subtext="500 ft rolls"
                        />
                        <ResultMetric
                          label="Drywall Screws"
                          value={out.drywallScrewsLbs}
                          unit="lbs"
                          subtext="1-1/4 in coarse"
                        />
                        <ResultMetric
                          label="Gross Area"
                          value={out.totalGrossAreaSqFt}
                          unit="sq ft"
                          subtext={`-${out.openingsDeductionSqFt} sq ft openings`}
                        />
                      </div>
                    </div>

                    {/* SHEET SIZE COMPARISON CARD */}
                    <div className="rounded-lg border border-[#e3ded4] bg-[#ffffff] p-5 shadow-xs space-y-4">
                      <div className="flex items-center gap-2 border-b border-[#e3ded4] pb-3">
                        <div className="p-1 rounded bg-[#fcf4ee] text-[#b8532b]">
                          <Maximize2 className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#1c1917]">
                            Sheet Size Comparison: 4×8 vs 4×12
                          </h3>
                          <span className="text-[11px] text-[#78716c]">
                            Balancing joint reduction against physical handling and hallway access
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* 4x8 Card */}
                        <div className={`rounded-lg border p-4 space-y-2 ${
                          preferredSheetSize === '4x8' ? 'border-[#b8532b] bg-[#fcf4ee]' : 'border-[#e3ded4] bg-[#f7f5f0]'
                        }`}>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs font-mono text-[#1c1917]">
                              4&apos; × 8&apos; Panels (32 sq ft)
                            </span>
                            {preferredSheetSize === '4x8' && (
                              <span className="text-[10px] font-mono uppercase bg-[#b8532b] text-[#ffffff] px-1.5 py-0.5 rounded">
                                Selected
                              </span>
                            )}
                          </div>

                          <div className="text-2xl font-mono font-bold text-[#1c1917]">
                            {out.sheets4x8ToPurchase} <span className="text-sm font-normal">Sheets</span>
                          </div>

                          <ul className="text-[11px] text-[#57534e] space-y-1 list-disc list-inside leading-relaxed">
                            <li>Weighs ~52 lbs per sheet; manageable for one person.</li>
                            <li>Fits easily into standard pickup beds and basement stairs.</li>
                            <li>Results in more vertical butt joints requiring finishing mud.</li>
                          </ul>
                        </div>

                        {/* 4x12 Card */}
                        <div className={`rounded-lg border p-4 space-y-2 ${
                          preferredSheetSize === '4x12' ? 'border-[#b8532b] bg-[#fcf4ee]' : 'border-[#e3ded4] bg-[#f7f5f0]'
                        }`}>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs font-mono text-[#1c1917]">
                              4&apos; × 12&apos; Panels (48 sq ft)
                            </span>
                            {preferredSheetSize === '4x12' && (
                              <span className="text-[10px] font-mono uppercase bg-[#b8532b] text-[#ffffff] px-1.5 py-0.5 rounded">
                                Selected
                              </span>
                            )}
                          </div>

                          <div className="text-2xl font-mono font-bold text-[#1c1917]">
                            {out.sheets4x12ToPurchase} <span className="text-sm font-normal">Sheets</span>
                          </div>

                          <ul className="text-[11px] text-[#57534e] space-y-1 list-disc list-inside leading-relaxed">
                            <li>Weighs ~78 lbs per sheet; strictly requires two people.</li>
                            <li>Eliminates approximately 33% of vertical butt joints.</li>
                            <li>Check tight hallway corners and stairwells before ordering.</li>
                          </ul>
                        </div>
                      </div>

                      <div className="rounded bg-[#f7f5f0] p-3 text-xs text-[#57534e] border border-[#e3ded4] leading-relaxed">
                        <strong>Planning Guidance:</strong> Compare sheet handling, room access, ceiling height, and seam count before choosing a sheet size. While 12-foot sheets produce smoother walls with fewer tapered joints, carrying them through finished doorways or down basement stairs often proves physically unfeasible for solo DIYers.
                      </div>
                    </div>

                    {/* COMPANION BILL OF MATERIALS */}
                    <div className="space-y-2">
                      <BillOfMaterialsTable items={companionBOM} />
                      <p className="text-[11px] font-mono text-[#78716c] px-1">
                        * Quantities derived mathematically from your {out.recommendedDrywallAreaSqFt} sq ft recommended coverage. Corner beads, setting-type hot mud, and shims should be estimated separately.
                      </p>
                    </div>

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
                  {calculationResult.errors[0]?.message ?? 'Please check your inputs and ensure all room dimensions are valid.'}
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
              title="Mathematical Breakdown: How Drywall Materials are Calculated"
              subtitle="Surface Area to Sheets, Mud, Tape & Fasteners"
              steps={explanationSteps}
            />

            {/* 2. Planning Assumptions & Boundary Notices */}
            <AssumptionsList
              assumptions={calculationResult.assumptions}
              notices={calculationResult.notices}
              limitations={[
                'Area-Based Estimating: This tool provides an area-based takeoff with a cutting allowance. It does not replace a CAD panel cut layout or architectural plan.',
                'Ceiling Thickness Code: Ceilings framed with joists spaced wider than 16" on center typically require 5/8" thickness or sag-resistant drywall per local building code.',
                'Level of Finish: Taping compound coverage standardly assumes a Level 4 paint-ready finish (3 coats over tape and fasteners). Level 5 skim coats require additional mud.',
              ]}
              scopeTitle="Out of Scope / Code Boundaries"
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
                    How Much Drywall Do I Need? Calculate Panels, Joint Compound, Tape, and Screws
                  </h3>
                  <p className="text-xs sm:text-sm text-[#57534e] mt-1 max-w-xl leading-relaxed">
                    Learn how to measure wall perimeter, calculate 4×8 versus 4×12 panel yields, deduct openings accurately, and estimate joint compound, tape, and screws without running short.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('/guides/how-much-drywall-do-i-need')}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded text-xs font-mono font-semibold bg-[#b8532b] text-white hover:bg-[#a04422] transition-colors shrink-0 shadow-xs"
              >
                <span>Read Planning Guide</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* 3. Practical Field Tips */}
            <PracticalTips
              title="Practical Field Tips for Hanging & Finishing Drywall"
              subtitle="Drywall Contractor Advice"
              tips={practicalTips}
            />

            {/* 4. Related Project Calculators */}
            <RelatedTools currentCalculatorId="drywall-calculator" onNavigate={onNavigate} />
          </div>
        )}
      </Container>
    </div>
  );
};

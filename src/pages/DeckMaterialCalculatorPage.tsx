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

import { calculateDeckMaterial } from '../scripts/calculators/deckMaterial.ts';
import { CALCULATORS } from '../data/calculators.ts';
import { CATEGORIES } from '../data/categories.ts';
import { ceilToPackage, roundToPrecision } from '../scripts/core/math-utils.ts';
import type { BillOfMaterialsItem } from '../types/index.ts';
import {
  RotateCcw,
  SlidersHorizontal,
  Layers,
  AlertTriangle,
  Compass,
  CheckCircle2,
  Maximize2,
  Hammer,
  ShieldAlert,
  HelpCircle,
  Truck,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

interface DeckMaterialCalculatorPageProps {
  onNavigate?: (path: string) => void;
}

export const DeckMaterialCalculatorPage: React.FC<DeckMaterialCalculatorPageProps> = ({ onNavigate }) => {
  const metadata = CALCULATORS['deck-material-calculator'];
  const category = CATEGORIES['fencing-decking'];

  // Form State
  const [deckLength, setDeckLength] = useState<number>(16); // along house wall
  const [deckWidth, setDeckWidth] = useState<number>(12); // projection out
  const [joistSpacingInches, setJoistSpacingInches] = useState<12 | 16>(16);
  const [boardLengthStockFeet, setBoardLengthStockFeet] = useState<12 | 16 | 20>(16);
  const [wastePercentage, setWastePercentage] = useState<number>(10);

  // Live calculation
  const calculationResult = useMemo(() => {
    return calculateDeckMaterial({
      deckLength,
      deckWidth,
      joistSpacingInches,
      boardLengthStockFeet,
      wastePercentage,
    });
  }, [deckLength, deckWidth, joistSpacingInches, boardLengthStockFeet, wastePercentage]);

  const handleReset = () => {
    setDeckLength(16);
    setDeckWidth(12);
    setJoistSpacingInches(16);
    setBoardLengthStockFeet(16);
    setWastePercentage(10);
  };

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: category?.name ?? 'Fencing & Decking', href: category?.hubPath ?? '/projects/fencing-decking' },
    { label: metadata?.name ?? 'Deck Board & Framing Estimator' },
  ];

  // Stock length comparison data (12, 16, 20 ft)
  const stockLengthComparisons = useMemo(() => {
    if (!calculationResult.success) return [];
    const recommendedLF = calculationResult.outputs.recommendedDeckingLinearFeet;

    const lengths: Array<12 | 16 | 20> = [12, 16, 20];
    return lengths.map((len) => {
      const boards = ceilToPackage(recommendedLF / len);
      const purchasedLF = boards * len;
      return {
        length: len,
        boards,
        purchasedLF,
        isSelected: boardLengthStockFeet === len,
      };
    });
  }, [calculationResult, boardLengthStockFeet]);

  // Integrated BOM (Decking + Framing Joists + Fasteners)
  const completeBOM: BillOfMaterialsItem[] = useMemo(() => {
    if (!calculationResult.success) return [];
    const out = calculationResult.outputs;

    // Deck boards row (with pricing from engine)
    const deckRow = calculationResult.billOfMaterials[0];

    // Framing Joists row (structural lumber takeoff)
    const totalJoistLF = out.joistCount * deckWidth;
    const joistRow: BillOfMaterialsItem = {
      id: 'deck-framing-joists',
      name: `Pressure-Treated Floor Joists (${deckWidth} ft Length)`,
      description: `Framing joists at ${joistSpacingInches}" o.c. spacing across ${deckLength} ft run (${totalJoistLF} total linear feet)`,
      exactQuantity: roundToPrecision((deckLength * 12) / joistSpacingInches + 1, 1),
      recommendedQuantity: out.joistCount,
      purchaseQuantity: out.joistCount,
      packageUnit: 'pieces',
      unitSizeDescription: `2x8 or 2x10 x ${deckWidth} ft (per span tables)`,
      wasteAppliedPercentage: 0,
      benchmarkPriceId: 'framing-joist-lumber',
      // Note: Pricing not hardcoded; reported as separate framing takeoff in cost card
    };

    // Fasteners row
    const fastenerPackages = ceilToPackage(out.fastenersEstimate / 350); // 350 screws per 5-lb box (~100 sq ft)
    const fastenerRow: BillOfMaterialsItem = {
      id: 'deck-fasteners',
      name: 'Exterior Deck Screws / Hidden Fasteners',
      description: `Corrosion-resistant exterior fasteners (approx 2 screws per joist intersection + 10% buffer)`,
      exactQuantity: out.fastenersEstimate,
      recommendedQuantity: out.fastenersEstimate,
      purchaseQuantity: fastenerPackages,
      packageUnit: 'boxes (350 ct)',
      unitSizeDescription: `~${out.fastenersEstimate} individual screws needed`,
      wasteAppliedPercentage: 10,
      benchmarkPriceId: 'deck-fasteners-box',
    };

    return [deckRow, joistRow, fastenerRow];
  }, [calculationResult, deckWidth, deckLength, joistSpacingInches]);

  const explanationSteps: CalculationStep[] = useMemo(() => {
    if (!calculationResult.success) return [];
    const out = calculationResult.outputs;

    return [
      {
        stepNumber: 1,
        title: 'Calculate Deck Surface Area & Board Rows',
        description:
          'Compute surface area and determine how many rows of boards span the projection width based on 5.5" boards plus 1/8" expansion gap (5.625" effective pitch).',
        formulaDisplay: (
          <span>
            Area: {deckLength}&apos; × {deckWidth}&apos; = <strong>{out.deckAreaSqFt} sq ft</strong> • Rows:{' '}
            ({deckWidth}&apos; × 12&quot;) ÷ 5.625&quot; = <strong>{out.boardRowsCount} parallel rows</strong>
          </span>
        ),
      },
      {
        stepNumber: 2,
        title: 'Compute Net & Recommended Decking Linear Footage',
        description: 'Multiply board rows by deck length along the house wall, then apply the cut and trim waste factor.',
        formulaDisplay: (
          <span>
            Net: {out.boardRowsCount} rows × {deckLength}&apos; = {out.netDeckingLinearFeet} lin ft • Recommended (+{wastePercentage}%):{' '}
            <strong className="text-[#b8532b]">{out.recommendedDeckingLinearFeet} linear feet</strong>
          </span>
        ),
      },
      {
        stepNumber: 3,
        title: 'Convert to Stock Board Purchase Units',
        description: 'Divide recommended linear footage by chosen stock board length (12, 16, or 20 ft) and round up to whole boards.',
        formulaDisplay: (
          <span>
            {out.recommendedDeckingLinearFeet} lin ft ÷ {boardLengthStockFeet}&apos; stick ={' '}
            <strong className="text-[#b8532b]">{out.deckBoardsToPurchase} boards ({boardLengthStockFeet}&apos; length)</strong>{' '}
            ({out.purchasedDeckingLinearFeet} purchased linear feet)
          </span>
        ),
      },
      {
        stepNumber: 4,
        title: 'Floor Joist Framing & Fasteners Takeoff',
        description:
          'Determine joist count across the deck length based on selected on-center spacing, plus 2 screws per board at each joist intersection.',
        formulaDisplay: (
          <span>
            Joists: ceil(({deckLength}&apos; × 12&quot;) ÷ {joistSpacingInches}&quot;) + 1 ={' '}
            <strong>{out.joistCount} joists</strong> ({out.joistCount * deckWidth} total lin ft) • Fasteners:{' '}
            {out.boardRowsCount} rows × {out.joistCount} joists × 2 screws × 1.10 ={' '}
            <strong>~{out.fastenersEstimate} screws</strong>
          </span>
        ),
      },
    ];
  }, [calculationResult, deckLength, deckWidth, wastePercentage, boardLengthStockFeet, joistSpacingInches]);

  const practicalTips: PracticalTipItem[] = [
    {
      title: 'Orient Deck Boards Perpendicular to Framing',
      desc: 'Deck boards run perpendicular to joists for maximum strength. If installing boards diagonally at 45 degrees, reduce joist spacing from 16" to 12" on-center to prevent board deflection.',
      icon: Compass,
    },
    {
      title: 'Verify Site Access for 16-Foot and 20-Foot Boards',
      desc: '20-foot composite boards eliminate ugly end-to-end butt joints on long decks, but require wide side-yard clearance and at least two people to carry without excessive sagging.',
      icon: Truck,
    },
    {
      title: 'Maintain 1/8" to 3/16" Gap for Thermal Expansion',
      desc: 'Composite and wood boards expand in summer heat and swelling moisture. Use spacer clips or 16d nails to establish consistent drainage and expansion gaps between board edges.',
      icon: Layers,
    },
    {
      title: 'Use ACQ-Compatible Fasteners on Pressure-Treated Joists',
      desc: 'Modern copper-rich pressure treatments corrode standard galvanized screws rapidly. Always specify 305/316 stainless steel or approved ceramic-coated polymer exterior fasteners.',
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
          title={metadata?.name ?? 'Deck Board & Framing Estimator'}
          categoryName={category?.name ?? 'Fencing & Decking'}
          description="Estimate surface decking boards, linear feet, framing floor joists, and fastener counts for attached rectangular decks."
          targetIntent={metadata?.targetIntent}
        />

        {/* Framing & Code Prominent Notice */}
        <div className="mb-8 rounded-lg border border-[#e3ded4] bg-[#fcf4ee] p-4 flex items-start gap-3 text-xs text-[#57534e]">
          <HelpCircle className="h-5 w-5 text-[#b8532b] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-[#1c1917] font-semibold">Material Planning Estimator Only:</strong> This tool estimates surface decking quantities, framing joist counts, and fastener allowances based on user-selected dimensions and spacing inputs. It does NOT design joist depth (2x8 vs 2x10), allowable cantilevers, beam sizing, ledger attachment, or footing requirements. Verify all framing layouts with the International Residential Code (IRC) and your local building department.
          </div>
        </div>

        {/* Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* LEFT COLUMN: Deck Inputs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-lg border border-[#e3ded4] bg-[#ffffff] p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#e3ded4] pb-3 mb-5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-[#f7f5f0] border border-[#e3ded4] text-[#b8532b]">
                    <SlidersHorizontal className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#1c1917]">
                      Deck Dimensions & Framing Inputs
                    </h2>
                    <span className="text-[11px] text-[#78716c]">
                      Length, projection, joist spacing & board stock
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
                    id="deck-length"
                    label="Deck Length (Along House)"
                    value={deckLength}
                    onChange={setDeckLength}
                    unit="ft"
                    min={4}
                    max={100}
                    step={1}
                    required
                  />

                  <CalculatorInput
                    id="deck-width"
                    label="Projection Out from House"
                    value={deckWidth}
                    onChange={setDeckWidth}
                    unit="ft"
                    min={4}
                    max={40}
                    step={1}
                    required
                  />
                </div>

                {/* 2. Joist Spacing On-Center */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase text-[#1c1917]">
                    Joist Spacing On-Center
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setJoistSpacingInches(16)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        joistSpacingInches === 16
                          ? 'border-[#b8532b] bg-[#fcf4ee] ring-1 ring-[#b8532b]'
                          : 'border-[#e3ded4] bg-[#ffffff] hover:bg-[#faf8f5]'
                      }`}
                    >
                      <div className="font-mono font-bold text-xs text-[#1c1917]">
                        16&quot; On-Center
                      </div>
                      <div className="text-[11px] text-[#78716c] mt-0.5">
                        Standard for perpendicular wood decking
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setJoistSpacingInches(12)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        joistSpacingInches === 12
                          ? 'border-[#b8532b] bg-[#fcf4ee] ring-1 ring-[#b8532b]'
                          : 'border-[#e3ded4] bg-[#ffffff] hover:bg-[#faf8f5]'
                      }`}
                    >
                      <div className="font-mono font-bold text-xs text-[#1c1917]">
                        12&quot; On-Center
                      </div>
                      <div className="text-[11px] text-[#78716c] mt-0.5">
                        Required for composite & diagonal layouts
                      </div>
                    </button>
                  </div>
                </div>

                {/* 3. Stock Board Length Selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase text-[#1c1917]">
                    Deck Board Stock Length
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {([12, 16, 20] as const).map((len) => (
                      <button
                        key={len}
                        type="button"
                        onClick={() => setBoardLengthStockFeet(len)}
                        className={`p-2.5 rounded-lg border text-center transition-all ${
                          boardLengthStockFeet === len
                            ? 'border-[#b8532b] bg-[#fcf4ee] font-bold text-[#b8532b] ring-1 ring-[#b8532b]'
                            : 'border-[#e3ded4] bg-[#ffffff] text-[#1c1917] hover:bg-[#faf8f5]'
                        }`}
                      >
                        <div className="font-mono text-xs">{len}&apos; Length</div>
                        <div className="text-[10px] text-[#78716c]">{len} ft stick</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Waste Factor */}
                <WasteSelector
                  value={wastePercentage}
                  onChange={setWastePercentage}
                  options={metadata.wasteOptions}
                  title="Cutting & Squaring Waste Allowance"
                  customLabel="Allowance"
                  principleNote="Accounts for end trimming, squaring factory cuts, natural lumber crown defects, and perimeter overhangs. 10% is standard; 15% is recommended for diagonal layouts."
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Results & Framing Separation */}
          <div className="lg:col-span-7 space-y-6" aria-live="polite">
            {calculationResult.success ? (
              (() => {
                const out = calculationResult.outputs;

                return (
                  <>
                    {/* PRIMARY DECKING RESULTS */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <ResultMetric
                          label="Purchased Deck Boards"
                          value={out.deckBoardsToPurchase}
                          unit="boards"
                          subtext={`${boardLengthStockFeet}-ft stock boards`}
                          variant="primary"
                        />
                        <ResultMetric
                          label="Deck Surface Area"
                          value={out.deckAreaSqFt}
                          unit="sq ft"
                          subtext={`${deckLength}' × ${deckWidth}' footprint`}
                          variant="primary"
                        />
                        <ResultMetric
                          label="Decking Requirement"
                          value={out.recommendedDeckingLinearFeet}
                          unit="linear ft"
                          subtext={`Net: ${out.netDeckingLinearFeet} lf (+${wastePercentage}%)`}
                        />
                      </div>
                    </div>

                    {/* FRAMING RESULTS CARD (Prominent Separation) */}
                    <div className="rounded-lg border-2 border-[#e3ded4] bg-[#ffffff] p-5 shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-[#e3ded4] pb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded bg-[#f7f5f0] text-[#1c1917]">
                            <Hammer className="h-4 w-4" />
                          </div>
                          <div>
                            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#1c1917]">
                              Framing Takeoff (Floor Joists & Spacing)
                            </h3>
                            <span className="text-[11px] text-[#78716c]">
                              Separate structural framing from surface boards
                            </span>
                          </div>
                        </div>

                        {/* Visually Prominent Joist Spacing Badge */}
                        <div className="px-3 py-1 rounded bg-[#f1ede4] border border-[#e3ded4] font-mono text-xs font-bold text-[#b8532b]">
                          {joistSpacingInches}&quot; OC Spacing
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <ResultMetric
                          label="Floor Joists"
                          value={out.joistCount}
                          unit="joists"
                          subtext={`Spaced ${joistSpacingInches}" on-center`}
                        />
                        <ResultMetric
                          label="Total Joist Length"
                          value={out.joistCount * deckWidth}
                          unit="linear ft"
                          subtext={`${out.joistCount} joists × ${deckWidth}' projection`}
                        />
                        <ResultMetric
                          label="Fasteners / Screws"
                          value={out.fastenersEstimate}
                          unit="screws"
                          subtext="2 per joist intersection"
                        />
                      </div>

                      <div className="rounded bg-[#f7f5f0] p-3 text-xs text-[#57534e] border border-[#e3ded4] leading-relaxed">
                        <strong>Framing Layout Note:</strong> Joist spacing is a planning input for this estimator. Verify the framing layout, allowable spans (2x8 vs 2x10), beams, footings, and applicable code requirements for your specific deck design.
                      </div>
                    </div>

                    {/* STOCK-LENGTH PLANNING COMPARISON */}
                    <div className="rounded-lg border border-[#e3ded4] bg-[#ffffff] p-5 shadow-xs space-y-3">
                      <div className="flex items-center justify-between border-b border-[#e3ded4] pb-2">
                        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#1c1917]">
                          Stock-Length Planning Comparison
                        </h3>
                        <span className="text-[11px] font-mono text-[#78716c]">
                          {out.recommendedDeckingLinearFeet} linear feet needed
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-3 text-xs">
                        {stockLengthComparisons.map((item) => (
                          <div
                            key={item.length}
                            className={`p-3 rounded-lg border text-center space-y-1 ${
                              item.isSelected
                                ? 'border-[#b8532b] bg-[#fcf4ee] font-semibold text-[#1c1917]'
                                : 'border-[#e3ded4] bg-[#faf8f5] text-[#57534e]'
                            }`}
                          >
                            <div className="font-mono text-xs uppercase text-[#78716c]">
                              {item.length}&apos; Boards
                            </div>
                            <div className="font-mono text-lg font-bold text-[#1c1917]">
                              {item.boards} <span className="text-xs font-normal">boards</span>
                            </div>
                            <div className="text-[10px] font-mono text-[#78716c]">
                              {item.purchasedLF} linear ft
                            </div>
                          </div>
                        ))}
                      </div>

                      <p className="text-[11px] text-[#78716c] leading-relaxed pt-1">
                        Purchase quantity is based on whole stock boards. Actual cutting efficiency depends on deck dimensions and board layout.
                      </p>
                    </div>

                    {/* MATERIAL BREAKDOWN (BOM) */}
                    <div className="space-y-2">
                      <BillOfMaterialsTable items={completeBOM} />
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
                  {calculationResult.errors[0]?.message ?? 'Please check your inputs and ensure deck length and width are positive.'}
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
              title="Mathematical Breakdown: How Deck Materials are Calculated"
              subtitle="Deck Area to Linear Feet, Stock Boards & Floor Joists"
              steps={explanationSteps}
            />

            {/* Assumptions & Boundaries */}
            <AssumptionsList
              assumptions={calculationResult.assumptions}
              notices={calculationResult.notices}
              limitations={[
                'THIS IS NOT A STRUCTURAL ENGINEERING DESIGN: Deck joist sizing, beam dimensions, allowable cantilevers, footing sizes, and ledger connections must be designed in accordance with the International Residential Code (IRC) and local building department codes.',
                'Exclusions: Railing posts, balusters, stair stringers, flashing ledger tapes, structural hardware brackets, and concrete footings must be engineered and estimated separately.',
                'Stock Board Utilization: Calculated board counts assume optimal cutting and splicing. Complicated deck shapes will yield higher cut off-fall scrap.',
              ]}
              scopeTitle="Engineering & Structural Disclaimers"
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
                    How to Calculate Deck Materials: Deck Boards, Joists, and Fasteners
                  </h3>
                  <p className="text-xs sm:text-sm text-[#57534e] mt-1 max-w-xl leading-relaxed">
                    Learn how to convert deck length and projection into board rows, calculate linear footage with the 1/8" gap, choose 12/16/20 ft stock boards, and estimate joists and fasteners.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('/guides/how-to-calculate-deck-materials')}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded text-xs font-mono font-semibold bg-[#b8532b] text-white hover:bg-[#a04422] transition-colors shrink-0 shadow-xs"
              >
                <span>Read Planning Guide</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Practical Tips */}
            <PracticalTips
              title="Practical Field Tips for Deck Construction"
              subtitle="Lumber & Fastener Best Practices"
              tips={practicalTips}
            />

            {/* Related Tools */}
            <RelatedTools currentCalculatorId="deck-material-calculator" onNavigate={onNavigate} />
          </div>
        )}
      </Container>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs.tsx';
import { Container } from '../../components/common/Container.tsx';
import { CalculatorHeader } from '../../components/calculator/CalculatorHeader.tsx';
import { CalculatorInput } from '../../components/calculator/CalculatorInput.tsx';
import { CalculatorSelect } from '../../components/calculator/CalculatorSelect.tsx';
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

import { calculateTile, type TileTrowelNotchSize } from '../../scripts/calculators/tile.ts';
import { CALCULATORS } from '../../data/calculators.ts';
import { CATEGORIES } from '../../data/categories.ts';
import { RotateCcw, SlidersHorizontal, Layers, Box, ShieldCheck, Wrench, AlertTriangle, BookOpen, ArrowRight } from 'lucide-react';

interface TileCalculatorPageProps {
  onNavigate?: (path: string) => void;
}

export const TileCalculatorPage: React.FC<TileCalculatorPageProps> = ({ onNavigate }) => {
  const metadata = CALCULATORS['tile-calculator'];
  const category = CATEGORIES['flooring'];

  // Inputs
  const [areaLength, setAreaLength] = useState<number>(10);
  const [areaWidth, setAreaWidth] = useState<number>(8);
  const [tileLengthInches, setTileLengthInches] = useState<number>(12);
  const [tileWidthInches, setTileWidthInches] = useState<number>(12);
  const [tileThicknessInches, setTileThicknessInches] = useState<number>(0.375);
  const [boxCoverageSqFt, setBoxCoverageSqFt] = useState<number>(15);
  const [wastePercentage, setWastePercentage] = useState<number>(10);
  const [groutJointWidthInches, setGroutJointWidthInches] = useState<string>('0.125');
  const [trowelNotchSize, setTrowelNotchSize] = useState<TileTrowelNotchSize>('auto');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Live calculation
  const calculationResult = useMemo(() => {
    return calculateTile({
      areaLength,
      areaWidth,
      tileLengthInches,
      tileWidthInches,
      tileThicknessInches,
      boxCoverageSqFt,
      wastePercentage,
      groutJointWidthInches: Number(groutJointWidthInches),
      trowelNotchSize,
    });
  }, [
    areaLength,
    areaWidth,
    tileLengthInches,
    tileWidthInches,
    tileThicknessInches,
    boxCoverageSqFt,
    wastePercentage,
    groutJointWidthInches,
    trowelNotchSize,
  ]);

  const handleReset = () => {
    setAreaLength(10);
    setAreaWidth(8);
    setTileLengthInches(12);
    setTileWidthInches(12);
    setTileThicknessInches(0.375);
    setBoxCoverageSqFt(15);
    setWastePercentage(10);
    setGroutJointWidthInches('0.125');
    setTrowelNotchSize('auto');
  };

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: category?.name ?? 'Flooring', href: category?.hubPath ?? '/projects/flooring' },
    { label: 'Tile & Grout Calculator' },
  ];

  const groutJointOptions = [
    { value: '0.0625', label: '1/16" (Narrow / Rectified Edge)', description: 'For precision-cut rectified porcelain tiles with minimal variation' },
    { value: '0.125', label: '1/8" (Standard Floor & Wall)', description: 'Most common joint width for standard ceramic and pressed porcelain' },
    { value: '0.1875', label: '3/16" (Handmade / Uneven Edge)', description: 'For artisanal tiles with slight dimensional variation' },
    { value: '0.25', label: '1/4" (Wide Quarry / Saltillo)', description: 'Wide rustic joint for pavers and Mexican terracotta tile' },
  ];

  const trowelNotchOptions = [
    {
      value: 'auto',
      label: 'Suggested Profile (Based on Tile Dimensions)',
      description: 'Preliminary planning suggestion (~65 sq ft/bag < 8", ~50 sq ft/bag 8"–14", ~35 sq ft/bag ≥ 15"); confirm with mortar TDS and tile-back profile',
    },
    {
      value: '1/4x1/4',
      label: '1/4" × 1/4" (Est. ~65 sq ft/bag — Small Tile < 8")',
      description: 'Preliminary benchmark for small subway, mosaic, or wall tiles; verify on mortar bag',
    },
    {
      value: '1/4x3/8',
      label: '1/4" × 3/8" (Est. ~50 sq ft/bag — Standard 8"–14")',
      description: 'Preliminary benchmark for standard square-notch installations; verify on mortar bag',
    },
    {
      value: '1/2x1/2',
      label: '1/2" × 1/2" (Est. ~35 sq ft/bag — Large Format ≥ 15")',
      description: 'Preliminary benchmark for Large Format Tile including back-buttering; verify on mortar bag',
    },
  ];

  const commonTileSizePresets = [
    { label: '12" × 12"', l: 12, w: 12 },
    { label: '12" × 24"', l: 24, w: 12 },
    { label: '3" × 6" (Subway)', l: 6, w: 3 },
    { label: '4" × 4"', l: 4, w: 4 },
    { label: '24" × 24"', l: 24, w: 24 },
    { label: 'Hexagon 8"', l: 8, w: 8 },
  ];

  const outputs = calculationResult.success ? calculationResult.outputs : undefined;

  const tileSteps: CalculationStep[] = outputs
    ? [
        {
          stepNumber: 1,
          title: 'Calculate Net Tiled Surface Area',
          description: 'Measure the length and width of the surface to be tiled to determine the physical footprint.',
          formulaDisplay: (
            <span>
              {areaLength} ft × {areaWidth} ft = <strong>{outputs.netAreaSqFt} sq ft net</strong>
            </span>
          ),
        },
        {
          stepNumber: 2,
          title: 'Determine Individual Tile Footprint & Net Piece Count',
          description: 'Convert tile inches to square feet to calculate theoretical pieces required before cuts.',
          formulaDisplay: (
            <span>
              ({tileLengthInches}" × {tileWidthInches}") ÷ 144 = <strong>{outputs.tileAreaSqFt} sq ft/tile</strong> →{' '}
              {outputs.netAreaSqFt} sq ft ÷ {outputs.tileAreaSqFt} sq ft = <strong>{outputs.exactTilesNeeded} net tiles</strong>
            </span>
          ),
        },
        {
          stepNumber: 3,
          title: 'Apply Pattern & Cut Waste Allowance',
          description: `Straight grids require 10% waste; diagonal, herringbone, or staggered subway patterns require 12% to 18% for perimeter cutoffs.`,
          formulaDisplay: (
            <span>
              {outputs.netAreaSqFt} sq ft × (1 + {outputs.wastePercentage / 100}) ={' '}
              <strong>{outputs.recommendedAreaSqFt} sq ft recommended</strong> ({outputs.recommendedTilesWithWaste} tiles)
            </span>
          ),
        },
        {
          stepNumber: 4,
          title: 'Round Upward to Full Commercial Boxes',
          description: 'Tile boxes cannot be purchased broken or opened at retail. Packaging rounds upward with a mathematical ceiling.',
          formulaDisplay: (
            <span className="text-[#b8532b]">
              ⌈{outputs.recommendedAreaSqFt} sq ft ÷ {outputs.boxCoverageSqFt} sq ft/box⌉ ={' '}
              <strong>{outputs.boxesToPurchase} boxes to purchase</strong> ({outputs.purchasedSqFt} sq ft purchased)
            </span>
          ),
        },
        {
          stepNumber: 5,
          title: 'Estimate Thin-Set Mortar & Dimension-Based Joint Grout (Provisional)',
          description: `Mortar uses a preliminary planning benchmark (~${outputs.mortarCoverageSqFtPerBag} sq ft/50-lb bag for a suggested ${outputs.mortarTrowelNotch}" profile) across ${outputs.netAreaSqFt} sq ft plus a provisional 10% allowance. Grout uses geometric joint volume (${outputs.groutVolumeCuIn} in³ at ${outputs.tileThicknessInches}" assumed depth) with an unverified 0.06 lb/in³ planning factor plus a provisional 10% allowance; actual consumption depends on product formulation, joint depth, edge geometry, trowel angle, and substrate flatness.`,
          formulaDisplay: (
            <span>
              Est. Mortar: ⌈({outputs.netAreaSqFt} × 1.10) ÷ {outputs.mortarCoverageSqFtPerBag}⌉ ={' '}
              <strong>{outputs.thinsetMortar50lbBags} bags (50 lb)</strong> | Est. Grout:{' '}
              ~{outputs.groutRecommendedLbs} lbs ÷ 25 = <strong>{outputs.grout25lbBags} bags (25 lb)</strong>
            </span>
          ),
        },
      ]
    : [];

  const tileTips: PracticalTipItem[] = [
    {
      title: 'Match Tile Dye Lots (Tone & Caliber)',
      desc: 'Verify that all boxes share the exact same dye lot (shade) and caliber (sizing) stamp on the carton label. Sizing variations between kiln firings can disrupt grout line alignment.',
      icon: Layers,
    },
    {
      title: 'Retain One Unopened Box for Spares',
      desc: 'Always keep at least 1 full box in dry storage. If a plumbing valve fails behind a shower wall or a tile cracks years later, finding an identical replacement from the same batch is nearly impossible.',
      icon: ShieldCheck,
    },
    {
      title: 'Use Leveling Clips for Large Format Tile',
      desc: 'Any tile with a side 15 inches or greater is classified as Large Format Tile (LFT). Use mechanical leveling spacers and a medium-bed mortar to prevent lippage between adjacent tiles.',
      icon: Wrench,
    },
    {
      title: 'Confirm Trowel Notch & Coverage on the Mortar Bag',
      desc: 'Tile dimensions alone do not determine trowel size. Smaller tiles under 8" often start with a 1/4" × 1/4" notch (~65 sq ft/bag benchmark), while 12"×24" LFTs commonly require a 1/2" × 1/2" notch (~35 sq ft/bag benchmark) and back-buttering—always confirm notch size and coverage against the mortar manufacturer\'s Technical Data Sheet, tile-back profile, and substrate flatness.',
      icon: Box,
    },
  ];

  return (
    <div className="py-6 sm:py-10">
      <Container>
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />

        {/* Page Header */}
        <CalculatorHeader
          title={metadata?.name ?? 'Tile & Grout Calculator'}
          categoryName={category?.name ?? 'Flooring & Tile'}
          description="Calculate ceramic, porcelain, or stone tile pieces, full commercial boxes, thin-set mortar bags, and grout joints for floor, wall, or backsplash installations."
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
                      Tiled area & tile size specifications
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1 text-xs font-mono text-[#78716c] hover:text-[#b8532b] transition-colors"
                  title="Reset to 10x8 ft defaults"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset</span>
                </button>
              </div>

              <div className="space-y-5">
                {/* Area Dimensions Grid */}
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase font-semibold text-[#57534e]">
                    1. Surface Dimensions
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <CalculatorInput
                      id="area-length"
                      label="Length (or Height)"
                      value={areaLength}
                      onChange={setAreaLength}
                      unit="ft"
                      min={1}
                      max={500}
                      step={0.25}
                      required
                      error={areaLength <= 0 ? 'Length must be > 0' : undefined}
                    />

                    <CalculatorInput
                      id="area-width"
                      label="Width"
                      value={areaWidth}
                      onChange={setAreaWidth}
                      unit="ft"
                      min={1}
                      max={500}
                      step={0.25}
                      required
                      error={areaWidth <= 0 ? 'Width must be > 0' : undefined}
                    />
                  </div>
                </div>

                {/* Tile Dimensions */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase font-semibold text-[#57534e]">
                      2. Tile Dimensions
                    </span>
                    <span className="text-[11px] font-mono text-[#78716c]">Inches</span>
                  </div>

                  {/* Tile size quick presets */}
                  <div className="flex flex-wrap gap-1.5 pb-1">
                    {commonTileSizePresets.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          setTileLengthInches(preset.l);
                          setTileWidthInches(preset.w);
                        }}
                        className={`text-[11px] font-mono px-2 py-0.5 rounded border transition-colors ${
                          tileLengthInches === preset.l && tileWidthInches === preset.w
                            ? 'bg-[#b8532b] text-[#ffffff] border-[#b8532b] font-bold'
                            : 'bg-[#f7f5f0] text-[#57534e] border-[#e3ded4] hover:bg-[#f1ede4]'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <CalculatorInput
                      id="tile-length"
                      label="Tile Length"
                      value={tileLengthInches}
                      onChange={setTileLengthInches}
                      unit="in"
                      min={1}
                      max={48}
                      step={0.5}
                      required
                      error={tileLengthInches <= 0 ? 'Must be > 0' : undefined}
                    />

                    <CalculatorInput
                      id="tile-width"
                      label="Tile Width"
                      value={tileWidthInches}
                      onChange={setTileWidthInches}
                      unit="in"
                      min={1}
                      max={48}
                      step={0.5}
                      required
                      error={tileWidthInches <= 0 ? 'Must be > 0' : undefined}
                    />
                  </div>
                </div>

                {/* Pattern & Waste Selector */}
                <WasteSelector
                  value={wastePercentage}
                  onChange={setWastePercentage}
                  options={metadata.wasteOptions}
                  title="Layout Pattern & Cut Waste"
                  customLabel="Allowance"
                  principleNote="Accounts for perimeter cuts, tile centering offset cuts, and complex corner fits. Diagonal and herringbone patterns generate significantly more unusable offcuts."
                />

                {/* Advanced Packaging & Grout Options Accordion */}
                <div className="border-t border-[#e3ded4] pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center justify-between w-full text-xs font-mono font-semibold text-[#57534e] hover:text-[#1c1917] transition-colors"
                  >
                    <span>Packaging & Grout Specifications</span>
                    <span>{showAdvanced ? '− Hide' : '+ Show Options'}</span>
                  </button>

                  {showAdvanced && (
                    <div className="mt-4 space-y-4 rounded bg-[#f7f5f0] p-3.5 border border-[#e3ded4]">
                      <CalculatorInput
                        id="box-coverage"
                        label="Box Coverage Specification"
                        value={boxCoverageSqFt}
                        onChange={setBoxCoverageSqFt}
                        unit="sq ft/box"
                        min={1}
                        max={60}
                        step={0.5}
                        description="Found on carton label (commonly 10 to 18 sq ft/box)."
                        required
                        error={boxCoverageSqFt <= 0 ? 'Must be > 0' : undefined}
                      />

                      <CalculatorInput
                        id="tile-thickness"
                        label="Assumed Joint Depth (Tile Thickness)"
                        value={tileThicknessInches}
                        onChange={setTileThicknessInches}
                        unit="in"
                        min={0.125}
                        max={2}
                        step={0.0625}
                        description='Used as assumed grout joint depth; actual fill depth varies with beveled or irregular tile edges. Typical: 0.25" (wall), 0.375" (3/8" floor), 0.5" (stone).'
                        required
                        error={tileThicknessInches <= 0 ? 'Must be > 0' : undefined}
                      />

                      <CalculatorSelect
                        id="grout-joint"
                        label="Grout Joint Width"
                        value={groutJointWidthInches}
                        onChange={setGroutJointWidthInches}
                        options={groutJointOptions}
                        description="Used with tile size and assumed joint depth to estimate provisional grout volume."
                      />

                      <CalculatorSelect
                        id="trowel-notch"
                        label="Trowel Notch Profile"
                        value={trowelNotchSize}
                        onChange={(val) => setTrowelNotchSize(val as TileTrowelNotchSize)}
                        options={trowelNotchOptions}
                        description="Suggested profile is based primarily on tile size; always confirm trowel notch and coverage on the mortar manufacturer's Technical Data Sheet (TDS)."
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Output Results & Bill of Materials */}
          <div className="lg:col-span-7 space-y-6" aria-live="polite">
            {calculationResult.success ? (
              (() => {
                const out = calculationResult.outputs;
                return (
                  <>
                    {/* Primary Output Highlight */}
                    <div className="space-y-4">
                      <ResultMetric
                        label="Commercial Tile Order"
                        value={out.boxesToPurchase}
                        unit="boxes"
                        subtext={`Total ${out.purchasedSqFt} sq ft purchased (${out.recommendedTilesWithWaste} recommended tiles @ ${out.boxCoverageSqFt} sq ft/box)`}
                        variant="primary"
                      />

                      {/* Secondary Metrics Bar */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        <ResultMetric
                          label="Net Tile Area"
                          value={out.netAreaSqFt}
                          unit="sq ft"
                          subtext={`${out.exactTilesNeeded} net pieces`}
                        />
                        <ResultMetric
                          label="With Waste"
                          value={out.recommendedAreaSqFt}
                          unit="sq ft"
                          subtext={`+${out.wastePercentage}% cut allowance`}
                        />
                        <ResultMetric
                          label="Thinset Mortar"
                          value={out.thinsetMortar50lbBags}
                          unit="bags (50lb)"
                          subtext={`Est. ~${out.mortarCoverageSqFtPerBag} sq ft/bag (${out.mortarTrowelNotch}" profile)`}
                        />
                        <ResultMetric
                          label="Joint Grout"
                          value={out.grout25lbBags}
                          unit="bags (25lb)"
                          subtext={`Est. ~${out.groutRecommendedLbs} lbs (provisional)`}
                        />
                      </div>
                    </div>

                    {/* 3-Stage Estimating Flow */}
                    <EstimatingFlow
                      title="Area & Packaging Breakdown"
                      subtitle="Family A: Packaged Surface Area"
                      stages={[
                        {
                          stageNumber: 1,
                          stageTitle: 'Net Geometry',
                          badgeText: 'Stage 1',
                          badgeVariant: 'neutral',
                          primaryValue: out.netAreaSqFt,
                          primaryUnit: 'sq ft',
                          secondaryNote: `${out.exactTilesNeeded} net tiles`,
                          description: 'Net physical footprint of the floor or wall before cuts and layout waste.',
                        },
                        {
                          stageNumber: 2,
                          stageTitle: 'Planning Requirement',
                          badgeText: `+${out.wastePercentage}% Waste`,
                          badgeVariant: 'info',
                          primaryValue: out.recommendedAreaSqFt,
                          primaryUnit: 'sq ft',
                          secondaryNote: `${out.recommendedTilesWithWaste} tiles needed`,
                          description: 'Minimum tile footage needed for perimeter cuts, staggering, and offcuts.',
                        },
                        {
                          stageNumber: 3,
                          stageTitle: 'Commercial Purchase',
                          badgeText: 'Store Order',
                          badgeVariant: 'terracotta',
                          primaryValue: out.boxesToPurchase,
                          primaryUnit: 'boxes',
                          secondaryNote: `${out.purchasedSqFt} sq ft total`,
                          description: `Rounded up to full factory-sealed boxes (+${(out.purchasedSqFt - out.recommendedAreaSqFt).toFixed(2)} sq ft buffer).`,
                          isCallout: true,
                        },
                      ]}
                      formulaConfirmation={
                        <span>
                          <strong>Packaging Rounding:</strong> {out.recommendedAreaSqFt} sq ft ÷ {out.boxCoverageSqFt} sq ft/box = {(out.recommendedAreaSqFt / out.boxCoverageSqFt).toFixed(2)} boxes → rounded up to <strong>{out.boxesToPurchase} whole boxes</strong>.
                        </span>
                      }
                    />

                    {/* Separate Companion Materials Panel for Mortar & Grout */}
                    <div className="rounded border border-[#e3ded4] bg-[#ffffff] p-4 space-y-3">
                      <div className="flex items-center justify-between border-b border-[#e3ded4] pb-2">
                        <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[#1c1917]">
                          Companion Installation Materials (Planning Estimates)
                        </h3>
                        <span className="text-[11px] font-mono text-[#b8532b]">
                          Mortar & Grout
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded bg-[#f7f5f0] border border-[#e3ded4] space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#1c1917]">Thinset Mortar (50 lb)</span>
                            <span className="font-mono font-bold text-[#b8532b] text-sm">
                              {out.thinsetMortar50lbBags} {out.thinsetMortar50lbBags === 1 ? 'bag' : 'bags'}
                            </span>
                          </div>
                          <p className="text-[#57534e] leading-snug">
                            Suggested {out.mortarTrowelNotch}" profile (~{out.mortarCoverageSqFtPerBag} sq ft/bag preliminary planning benchmark) over {out.netAreaSqFt} sq ft + 10% provisional allowance (~{out.mortarRecommendedBagsExact} bag equivalents before rounding). Verify trowel size and coverage against the mortar TDS, substrate flatness, and tile-back profile.
                          </p>
                        </div>

                        <div className="p-3 rounded bg-[#f7f5f0] border border-[#e3ded4] space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#1c1917]">Dry Tile Grout (25 lb)</span>
                            <span className="font-mono font-bold text-[#b8532b] text-sm">
                              {out.grout25lbBags} {out.grout25lbBags === 1 ? 'bag' : 'bags'}
                            </span>
                          </div>
                          <p className="text-[#57534e] leading-snug">
                            Provisional est. ~{out.groutRecommendedLbs} lbs ({out.groutNetLbs} lbs geometric baseline + 10% provisional allowance) for {tileLengthInches}" × {tileWidthInches}" × {out.tileThicknessInches}" assumed depth and {out.groutJointWidthInches}" joints (~{out.groutEstimatedCoverageSqFtPerBag} sq ft/bag est.). Not manufacturer-verified; varies by product formulation, joint depth, and tile edge geometry.
                          </p>
                        </div>
                      </div>

                      <div className="p-2.5 rounded bg-[#fcf4ee] border border-[#f1ede4] text-[11px] text-[#57534e] flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-[#b8532b] shrink-0 mt-0.5" />
                        <span>
                          <strong>Provisional Planning Note:</strong> Mortar coverage (~65 / ~50 / ~35 sq ft/bag), automatic trowel suggestions (based primarily on tile dimensions), the unverified 0.06 lb/in³ grout factor, and the 10% provisional allowances are planning estimates—not exact or manufacturer-verified figures. Always confirm trowel selection and coverage using the manufacturer&apos;s installation instructions and Technical Data Sheet (TDS).
                        </span>
                      </div>
                    </div>

                    {/* Bill of Materials Takeoff */}
                    <BillOfMaterialsTable items={calculationResult.billOfMaterials} />

                    {/* Cost Estimate Range */}
                    <CostEstimateCard costEstimate={calculationResult.costEstimate} />
                  </>
                );
              })()
            ) : (
              <div className="rounded-lg border-2 border-[#b91c1c] bg-[#fef2f2] p-6 text-sm text-[#991b1b]">
                <h3 className="font-bold text-base mb-1">Invalid Project Dimensions</h3>
                <p>
                  {calculationResult.errors[0]?.message ??
                    'Please verify that all dimensions are positive numbers greater than zero.'}
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
              title="How This Tile Calculation Works"
              subtitle="Transparent Engineering Math"
              description="Our calculation engine executes five deterministic steps to convert raw surface dimensions into tile boxes, mortar, and grout."
              steps={tileSteps}
            />

            {/* 2. Planning Assumptions & Exclusions */}
            <AssumptionsList
              assumptions={calculationResult.assumptions}
              notices={calculationResult.notices}
              limitations={[
                'Mortar Coverage & Trowel Disclaimer: The ~65 / ~50 / ~35 sq ft per 50-lb bag rates and automatic trowel suggestions (based primarily on tile dimensions) plus a provisional 10% allowance are preliminary planning benchmarks only. Actual coverage depends on mortar product, trowel notch, trowel angle, substrate flatness, tile-back profile, and installation technique—always verify with the mortar manufacturer\'s installation instructions and Technical Data Sheet (TDS).',
                'Grout Model Disclaimer: Grout estimates rely on an unverified 0.06 lb/in³ conversion factor and a provisional 10% planning allowance (not a universal industry standard). Calculated grout weight is not manufacturer-verified or exact; actual consumption varies with product formulation, joint depth, tile edge geometry, and field conditions.',
                'Substrate Preparation: Cement backer board (Durock/Wonderboard), uncoupling membranes (Schluter DITRA), and waterproofing are not included in square footage.',
                'Grout Yield Variations: Epoxy grouts and pre-mixed urethane grouts have very different densities and spread rates than cementitious dry powder bags.',
                'Subfloor Flatness: Subfloor must not deflect more than L/360 for ceramic or L/720 for natural stone to avoid cracked tile or broken grout bonds.',
              ]}
              scopeTitle="Out of Scope / Separate Installation Prep"
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
                    How Much Tile Do I Need? A Practical Guide to Tile Square Footage, Waste, and Boxes
                  </h3>
                  <p className="text-xs sm:text-sm text-[#57534e] mt-1 max-w-xl leading-relaxed">
                    Learn how to measure net room footage, choose pattern cut waste (10% to 18%), convert area into full factory-sealed cartons, and estimate thinset mortar and grout.
                  </p>
                </div>
              </div>
              <a
                href="/guides/how-much-tile-do-i-need"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded text-xs font-mono font-semibold bg-[#b8532b] text-white hover:bg-[#a04422] transition-colors shrink-0 shadow-xs"
              >
                <span>Read Planning Guide</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* 3. Practical Homeowner Field Tips */}
            <PracticalTips
              title="Practical Field Tips for Tile Installations"
              subtitle="Contractor Advice"
              tips={tileTips}
            />

            {/* 4. Related Tools & Guides */}
            <RelatedTools currentCalculatorId="tile-calculator" onNavigate={onNavigate} />
          </div>
        )}
      </Container>
    </div>
  );
};

export const TileCalculatorIsland: React.FC = () => {
  const meta = CALCULATORS['tile-calculator'];
  return (
    <CalculatorTrackerWrapper
      calculatorSlug="tile-calculator"
      calculatorName={meta.name}
      projectCategory={meta.categoryId}
    >
      <TileCalculatorPage />
    </CalculatorTrackerWrapper>
  );
};

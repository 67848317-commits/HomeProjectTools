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

import { calculateConcreteSlab } from '../../scripts/calculators/concreteSlab.ts';
import { CALCULATORS } from '../../data/calculators.ts';
import { CATEGORIES } from '../../data/categories.ts';
import {
  RotateCcw,
  SlidersHorizontal,
  Box,
  Truck,
  Package,
  Layers,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Wrench,
  AlertTriangle,
  Info,
  CheckCircle2,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

interface ConcreteSlabCalculatorPageProps {
  onNavigate?: (path: string) => void;
}

export const ConcreteSlabCalculatorPage: React.FC<ConcreteSlabCalculatorPageProps> = ({ onNavigate }) => {
  const metadata = CALCULATORS['concrete-slab-calculator'];
  const category = CATEGORIES['concrete-masonry'];

  // Inputs
  const [slabLength, setSlabLength] = useState<number>(12);
  const [slabWidth, setSlabWidth] = useState<number>(10);
  const [slabThicknessInches, setSlabThicknessInches] = useState<number>(4);
  const [wastePercentage, setWastePercentage] = useState<number>(10);
  const [bagYield80lbCuFt, setBagYield80lbCuFt] = useState<number>(0.6);
  const [bagYield60lbCuFt, setBagYield60lbCuFt] = useState<number>(0.45);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Live calculation
  const calculationResult = useMemo(() => {
    return calculateConcreteSlab({
      slabLength,
      slabWidth,
      slabThickness: slabThicknessInches,
      wastePercentage,
      yield80lbCuFt: bagYield80lbCuFt,
      yield60lbCuFt: bagYield60lbCuFt,
    });
  }, [slabLength, slabWidth, slabThicknessInches, wastePercentage, bagYield80lbCuFt, bagYield60lbCuFt]);

  const handleReset = () => {
    setSlabLength(12);
    setSlabWidth(10);
    setSlabThicknessInches(4);
    setWastePercentage(10);
    setBagYield80lbCuFt(0.6);
    setBagYield60lbCuFt(0.45);
  };

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: category?.name ?? 'Concrete & Masonry', href: category?.hubPath ?? '/projects/concrete-masonry' },
    { label: 'Concrete Slab & Pour Calculator' },
  ];

  const thicknessPresets = [
    { thickness: 4, label: '4" Thickness', subtitle: 'Standard Patio / Walkway / Shed' },
    { thickness: 5, label: '5" Thickness', subtitle: 'Heavy Tool Shed / Utility Pad' },
    { thickness: 6, label: '6" Thickness', subtitle: 'Driveway / Hot Tub / RV Pad' },
  ];

  const outputs = calculationResult.success ? calculationResult.outputs : undefined;

  const concreteSteps: CalculationStep[] = outputs
    ? [
        {
          stepNumber: 1,
          title: 'Calculate Slab Surface Area',
          description: 'Determine the surface area by multiplying slab length by width in feet.',
          formulaDisplay: (
            <span>
              {slabLength} ft × {slabWidth} ft = <strong>{outputs.slabAreaSqFt} sq ft surface area</strong>
            </span>
          ),
        },
        {
          stepNumber: 2,
          title: 'Convert Thickness from Inches to Feet',
          description: 'Form depth in inches must be expressed in feet for 3D volumetric math.',
          formulaDisplay: (
            <span>
              {slabThicknessInches} inches ÷ 12 in/ft ={' '}
              <strong>{(slabThicknessInches / 12).toFixed(3)} ft thickness</strong>
            </span>
          ),
        },
        {
          stepNumber: 3,
          title: 'Compute Net Geometric Volume',
          description: 'Multiply surface area by slab thickness to find theoretical cubic feet.',
          formulaDisplay: (
            <span>
              {outputs.slabAreaSqFt} sq ft × {(slabThicknessInches / 12).toFixed(3)} ft ={' '}
              <strong>{outputs.geometricVolumeCuFt} cu ft</strong> ({outputs.geometricVolumeCuYds} cu yds)
            </span>
          ),
        },
        {
          stepNumber: 4,
          title: 'Add Subgrade & Spillage Allowance Buffer',
          description: `An industry-standard ${wastePercentage}% buffer is essential to account for uneven hand-dug subgrade dips and form board flex.`,
          formulaDisplay: (
            <span>
              {outputs.geometricVolumeCuFt} cu ft × (1 + {wastePercentage / 100}) ={' '}
              <strong>{outputs.recommendedVolumeCuFt} cu ft ordering volume</strong> ({outputs.recommendedVolumeCuYds} cu yds)
            </span>
          ),
        },
        {
          stepNumber: 5,
          title: 'Convert to Commercial Bag & Truck Units',
          description: 'Calculate 80-lb pre-mix bags (0.60 cu ft/bag) and ready-mix truck cubic yards (27 cu ft = 1 cu yd).',
          formulaDisplay: (
            <span className="text-[#b8532b]">
              Ready-Mix Truck: <strong>{outputs.recommendedVolumeCuYds} cubic yards</strong> | 80-lb Bags: ⌈{outputs.recommendedVolumeCuFt} ÷ {bagYield80lbCuFt}⌉ ={' '}
              <strong>{outputs.bags80lbToPurchase} bags</strong> (~{(outputs.bags80lbToPurchase * 80).toLocaleString()} lbs)
            </span>
          ),
        },
      ]
    : [];

  const concreteTips: PracticalTipItem[] = [
    {
      title: 'Tamp a 3-4" Compacted Crushed Gravel Base',
      desc: 'Never pour concrete directly on raw dirt or clay soil. Compact 3 to 4 inches of crushed gravel (AB3 or crusher run) with a plate compactor to ensure drainage and prevent frost heave cracking.',
      icon: Wrench,
    },
    {
      title: 'Cut Control Joints Every 2 to 3 Times Thickness',
      desc: 'All concrete shrinks and cracks as it cures. Tool control joints to a depth of 1/4 slab thickness every 8 to 10 feet for a 4" slab to dictate where cracks occur neatly.',
      icon: Layers,
    },
    {
      title: 'Wait for Bleed Water Before Finishing',
      desc: 'After screeding and bull floating, water will rise to the surface ("bleed water"). Do NOT trowel while bleed water is present—troweling it in weakens the surface cream and causes dusting/flaking.',
      icon: ShieldAlert,
    },
    {
      title: 'Moist Cure for 5 to 7 Days Minimum',
      desc: 'Spray the slab with water and cover with plastic sheeting for 7 days. Hydration reaction requires water; curing properly doubles final compressive strength and prevents surface spider-cracks.',
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
          title={metadata?.name ?? 'Concrete Slab & Pour Calculator'}
          categoryName={category?.name ?? 'Masonry & Structural'}
          description="Calculate estimated cubic yards and pre-mixed bag quantities (80-lb and 60-lb) for concrete patios, walkways, garage slabs, and equipment pads, with subgrade allowances."
          targetIntent={metadata?.targetIntent}
        />

        {/* Main Interactive Estimating Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* LEFT COLUMN: Slab Dimensions & Thickness */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-lg border border-[#e3ded4] bg-[#ffffff] p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#e3ded4] pb-3 mb-5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-[#f7f5f0] border border-[#e3ded4] text-[#b8532b]">
                    <SlidersHorizontal className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#1c1917]">
                      Slab Dimensions & Forms
                    </h2>
                    <span className="text-[11px] text-[#78716c]">
                      Footprint measurements and slab thickness
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1 text-xs font-mono text-[#78716c] hover:text-[#b8532b] transition-colors"
                  title="Reset to 12x10 ft defaults"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset</span>
                </button>
              </div>

              <div className="space-y-5">
                {/* 1. Surface Footprint */}
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase font-semibold text-[#57534e]">
                    1. Slab Dimensions
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <CalculatorInput
                      id="slab-length"
                      label="Length"
                      value={slabLength}
                      onChange={setSlabLength}
                      unit="ft"
                      min={1}
                      max={500}
                      step={0.5}
                      required
                      error={slabLength <= 0 ? 'Length must be > 0' : undefined}
                    />

                    <CalculatorInput
                      id="slab-width"
                      label="Width"
                      value={slabWidth}
                      onChange={setSlabWidth}
                      unit="ft"
                      min={1}
                      max={500}
                      step={0.5}
                      required
                      error={slabWidth <= 0 ? 'Width must be > 0' : undefined}
                    />
                  </div>
                </div>

                {/* 2. PROMINENT THICKNESS INPUT & PRESETS */}
                <div className="space-y-2 p-3.5 rounded bg-[#fcf4ee] border-2 border-[#b8532b]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase font-bold text-[#b8532b]">
                      2. Slab Thickness
                    </span>
                    <span className="text-xs font-mono font-bold text-[#b8532b] bg-[#ffffff] px-2 py-0.5 rounded border border-[#e3ded4]">
                      {slabThicknessInches} Inches Thick
                    </span>
                  </div>

                  {/* Thickness quick presets */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {thicknessPresets.map((preset) => (
                      <button
                        key={preset.thickness}
                        type="button"
                        onClick={() => setSlabThicknessInches(preset.thickness)}
                        className={`p-2 rounded border text-left transition-all ${
                          slabThicknessInches === preset.thickness
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
                      id="custom-thickness"
                      label="Custom Thickness (Inches)"
                      value={slabThicknessInches}
                      onChange={setSlabThicknessInches}
                      unit="in"
                      min={2}
                      max={24}
                      step={0.25}
                      required
                      error={slabThicknessInches <= 0 ? 'Thickness must be > 0' : undefined}
                    />
                  </div>
                </div>

                {/* 3. Subgrade & Spillage Buffer Selector */}
                <WasteSelector
                  value={wastePercentage}
                  onChange={setWastePercentage}
                  options={metadata.wasteOptions}
                  title="Subgrade Variance & Spillage Allowance"
                  customLabel="Buffer"
                  principleNote="Subgrade excavations are never laser-flat. Soil dips, wooden form board deflection, and wheelbarrow spillage demand at least a 10% volume safety allowance."
                />

                {/* 4. Advanced Bag Yield Specs */}
                <div className="border-t border-[#e3ded4] pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center justify-between w-full text-xs font-mono font-semibold text-[#57534e] hover:text-[#1c1917] transition-colors"
                  >
                    <span>Advanced Bag Yield Specifications</span>
                    <span>{showAdvanced ? '− Hide' : '+ Show Options'}</span>
                  </button>

                  {showAdvanced && (
                    <div className="mt-4 space-y-4 rounded bg-[#f7f5f0] p-3.5 border border-[#e3ded4]">
                      <CalculatorInput
                        id="bag-yield-80"
                        label="80-lb Bag Yield"
                        value={bagYield80lbCuFt}
                        onChange={setBagYield80lbCuFt}
                        unit="cu ft/bag"
                        min={0.4}
                        max={0.8}
                        step={0.01}
                        description="Planning benchmark is 0.60 cu ft per 80-lb bag. Yield varies slightly by manufacturer; verify package label."
                        required
                      />

                      <CalculatorInput
                        id="bag-yield-60"
                        label="60-lb Bag Yield"
                        value={bagYield60lbCuFt}
                        onChange={setBagYield60lbCuFt}
                        unit="cu ft/bag"
                        min={0.3}
                        max={0.6}
                        step={0.01}
                        description="Planning benchmark is 0.45 cu ft per 60-lb bag. Yield varies slightly by manufacturer; verify package label."
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Output Results, Ready-Mix Alert, BOM */}
          <div className="lg:col-span-7 space-y-6" aria-live="polite">
            {calculationResult.success ? (
              (() => {
                const out = calculationResult.outputs;
                const exactBags80lb = (out.recommendedVolumeCuFt / bagYield80lbCuFt).toFixed(1);
                return (
                  <>
                    {/* Primary Metric Highlight: Ready-Mix vs Bag Order */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <ResultMetric
                          label="Ready-Mix Truck Order"
                          value={out.recommendedVolumeCuYds}
                          unit="cu yds"
                          subtext={`Order ${Math.ceil(out.recommendedVolumeCuYds * 2) / 2} to ${Math.ceil(out.recommendedVolumeCuYds)} yds from batch plant`}
                          variant="primary"
                        />
                        <ResultMetric
                          label="80-lb Concrete Bags"
                          value={out.bags80lbToPurchase}
                          unit="bags"
                          subtext={`Total weight: ${(out.bags80lbToPurchase * 80).toLocaleString()} lbs (${exactBags80lb} mathematical bags)`}
                          variant="primary"
                        />
                      </div>

                  {/* Secondary Metrics Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <ResultMetric
                      label="Slab Footprint"
                      value={out.slabAreaSqFt}
                      unit="sq ft"
                      subtext={`${slabLength}' × ${slabWidth}'`}
                    />
                    <ResultMetric
                      label="Geometric Volume"
                      value={out.geometricVolumeCuYds}
                      unit="cu yds"
                      subtext="Unbuffered"
                    />
                    <ResultMetric
                      label="Buffer Added"
                      value={`+${out.wastePercentage}%`}
                      unit="allowance"
                      subtext="Subgrade dips"
                    />
                    <ResultMetric
                      label="60-lb Bags"
                      value={out.bags60lbToPurchase}
                      unit="bags"
                      subtext="Smaller bag option"
                    />
                  </div>
                </div>

                {/* READY-MIX VS HAND-MIXING DECISION ALERT (Family D Specific) */}
                <div
                  className={`rounded-lg p-4 border transition-all ${
                    out.recommendedVolumeCuYds >= 1.5
                      ? 'bg-[#fcf4ee] border-2 border-[#b8532b]'
                      : 'bg-[#edf3f9] border border-[#c5d8ea]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {out.recommendedVolumeCuYds >= 1.5 ? (
                      <Truck className="h-5 w-5 text-[#b8532b] shrink-0 mt-0.5" />
                    ) : (
                      <Package className="h-5 w-5 text-[#1e3a5f] shrink-0 mt-0.5" />
                    )}

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`font-mono text-xs font-bold uppercase tracking-wider ${
                            out.recommendedVolumeCuYds >= 1.5 ? 'text-[#b8532b]' : 'text-[#1e3a5f]'
                          }`}
                        >
                          {out.recommendedVolumeCuYds >= 1.5
                            ? 'Planning Consideration: Ready-Mix Transit Delivery'
                            : 'Planning Consideration: Bagged Concrete Mixing'}
                        </h4>
                        <span className="text-[11px] font-mono text-[#78716c]">
                          Typical DIY Benchmark: ~1.5 Cu Yds
                        </span>
                      </div>

                      {out.recommendedVolumeCuYds >= 1.5 ? (
                        <p className="text-xs text-[#57534e] leading-relaxed">
                          This slab requires <strong>{out.recommendedVolumeCuYds} cubic yards</strong> of concrete (approximately <strong>{out.bags80lbToPurchase} bags of 80-lb pre-mix</strong> totaling <strong>{(out.bags80lbToPurchase * 80).toLocaleString()} lbs</strong>). Larger pours may be worth comparing with ready-mix delivery because of mixing time and volume. For volumes above approximately 1.5 cubic yards, homeowners and builders commonly compare ready-mix transit truck delivery against bagged pre-mix, weighing physical mixing labor and cold-joint risk against ready-mix short-load fees and driveway access.
                        </p>
                      ) : (
                        <p className="text-xs text-[#33557a] leading-relaxed">
                          This pour requires <strong>{out.recommendedVolumeCuYds} cubic yards</strong> (<strong>{out.bags80lbToPurchase} eighty-pound bags</strong>). Renting a portable electric barrel mixer from a local equipment center makes mixing this volume practical over a single morning with an adequate DIY crew.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* PROMINENT ENGINEERING PLANNING DISCLAIMER */}
                <div className="rounded border border-[#e3ded4] bg-[#ffffff] p-3.5 text-xs text-[#57534e] space-y-1">
                  <div className="flex items-center gap-1.5 font-mono font-bold text-[#1c1917]">
                    <ShieldAlert className="h-4 w-4 text-[#b8532b]" />
                    <span>Planning & Material Procurement Disclaimer</span>
                  </div>
                  <p className="text-[11px] text-[#78716c] leading-relaxed">
                    This calculator provides volumetric material requirements for budgeting and commercial order placement only. It is <strong>NOT</strong> structural engineering design, foundation load certification, or stamped architectural specification. Always check local municipal building codes for minimum slab thickness, #4 rebar / wire mesh spacing, gravel base depth, and frost depth requirements.
                  </p>
                </div>

                {/* 3-Stage Estimating Flow */}
                <EstimatingFlow
                  title="Volumetric & Ordering Breakdown"
                  subtitle="Family D: Geometric Volume to Ready-Mix & Bags"
                  stages={[
                    {
                      stageNumber: 1,
                      stageTitle: 'Net Volume',
                      badgeText: 'Stage 1',
                      badgeVariant: 'neutral',
                      primaryValue: out.geometricVolumeCuYds,
                      primaryUnit: 'cu yds',
                      secondaryNote: `${out.geometricVolumeCuFt} cu ft`,
                      description: `${out.slabAreaSqFt} sq ft area × ${slabThicknessInches}" thickness without buffer.`,
                    },
                    {
                      stageNumber: 2,
                      stageTitle: 'Ordering Buffer',
                      badgeText: `+${out.wastePercentage}% Subgrade`,
                      badgeVariant: 'info',
                      primaryValue: out.recommendedVolumeCuYds,
                      primaryUnit: 'cu yds',
                      secondaryNote: `${out.recommendedVolumeCuFt} cu ft`,
                      description: 'Accounts for subgrade soil dips and wooden form flex.',
                    },
                    {
                      stageNumber: 3,
                      stageTitle: 'Commercial Takeoff',
                      badgeText: 'Batch Order',
                      badgeVariant: 'terracotta',
                      primaryValue: out.bags80lbToPurchase,
                      primaryUnit: 'bags (80 lb)',
                      secondaryNote: `Or ${out.recommendedVolumeCuYds} truck cu yds`,
                      description: `Rounded up to full bags or ready-mix plant delivery yardage.`,
                      isCallout: true,
                    },
                  ]}
                  formulaConfirmation={
                    <span>
                      <strong>Volume Math:</strong> {out.slabAreaSqFt} sq ft × ({slabThicknessInches} ÷ 12) ft × (1 + {out.wastePercentage / 100}) = {out.recommendedVolumeCuFt} cu ft ÷ 27 = <strong>{out.recommendedVolumeCuYds} cubic yards</strong> (or <strong>{out.bags80lbToPurchase} bags</strong> @ 80 lbs).
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
            <h3 className="font-bold text-base mb-1">Invalid Slab Dimensions</h3>
            <p>
              {calculationResult.errors[0]?.message ??
                'Please verify that length, width, and thickness are greater than zero.'}
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
              title="How This Concrete Slab Calculation Works"
              subtitle="Transparent Engineering Math"
              description="Our calculation engine executes five deterministic steps to convert raw slab dimensions into ready-mix yards and pre-mixed bags."
              steps={concreteSteps}
            />

            {/* 2. Planning Assumptions & Exclusions */}
            <AssumptionsList
              assumptions={calculationResult.assumptions}
              notices={calculationResult.notices}
              limitations={[
                'Steel Reinforcement: Steel rebar (#4 / 1/2" diameter), welded wire reinforcement mesh, rebar chairs, and tie wire are calculated separately.',
                'Formwork Lumber: 2x4 or 2x6 form boards, wooden stakes, form release oil, and expansion joint felt strips are not included in concrete volume.',
                'Short-Load Fees: Ready-mix concrete dispatchers frequently add a short-load surcharge on orders under 4 to 5 cubic yards.',
                'Subgrade Excavation: Excavating earth, renting plate compactors, and purchasing crushed stone gravel base are separate line items.',
              ]}
              scopeTitle="Out of Scope / Structural Materials"
              benchmarkNote="Concrete prices reflect centralized price benchmarks for retail pre-mix 80-lb bags and ready-mix batch plant truck delivery averages."
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
                    How Much Concrete Do I Need for a Slab? Calculate Cubic Yards and Bag Counts
                  </h3>
                  <p className="text-xs sm:text-sm text-[#57534e] mt-1 max-w-xl leading-relaxed">
                    Convert slab dimensions into cubic feet and yards, compare 80-lb vs 60-lb bag yields, apply subgrade buffers, and know when ready-mix transit delivery is worth the cost.
                  </p>
                </div>
              </div>
              <a
                href="/guides/how-much-concrete-do-i-need-for-a-slab"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded text-xs font-mono font-semibold bg-[#b8532b] text-white hover:bg-[#a04422] transition-colors shrink-0 shadow-xs"
              >
                <span>Read Planning Guide</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* 3. Practical Homeowner Field Tips */}
            <PracticalTips
              title="Practical Field Tips for Concrete Slabs"
              subtitle="Finisher Field Notes"
              tips={concreteTips}
            />

            {/* 4. Related Tools & Guides */}
            <RelatedTools currentCalculatorId="concrete-slab-calculator" onNavigate={onNavigate} />
          </div>
        )}
      </Container>
    </div>
  );
};

export const ConcreteSlabCalculatorIsland: React.FC = () => {
  const meta = CALCULATORS['concrete-slab-calculator'];
  return (
    <CalculatorTrackerWrapper
      calculatorSlug="concrete-slab-calculator"
      calculatorName={meta.name}
      projectCategory={meta.categoryId}
    >
      <ConcreteSlabCalculatorPage />
    </CalculatorTrackerWrapper>
  );
};

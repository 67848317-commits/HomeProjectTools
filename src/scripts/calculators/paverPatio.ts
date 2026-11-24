/**
 * Paver Patio & Sand Calculation Engine
 */

import { getBenchmarkPriceRange, getPriceBenchmark } from '../../data/prices.ts';
import type { CalculationResult } from '../../types/index.ts';
import {
  applyWaste,
  calculateCostRange,
  calculateRectangularArea,
  calculateVolumeCubicFeet,
  ceilToPackage,
  cubicFeetToCubicYards,
  cubicYardsToTons,
  roundToPrecision,
} from '../core/math-utils.ts';

export interface PaverPatioInputs {
  patioLength: number; // feet
  patioWidth: number; // feet
  paverLengthInches?: number; // inches (default 8)
  paverWidthInches?: number; // inches (default 4)
  baseDepthInches?: number; // finished compacted depth in inches (default 4, optional 6)
  wastePercentage?: number; // paver cut waste only (default 10%)
}

export interface PaverPatioOutputs {
  patioAreaSqFt: number;
  baseExcavationAreaSqFt: number;
  paverAreaSqInches: number;
  singlePaverSqFt: number;
  exactPaversNeeded: number;
  recommendedPaversWithWaste: number;
  recommendedPaversToPurchase: number;
  purchasedPaverSqFt: number;
  baseDepthInches: number;
  baseVolumeCuFt: number;
  baseVolumeCuYds: number;
  gravelDensityTonsPerCuYd: number;
  gravelBaseTons: number;
  gravelBasePurchaseTons: number;
  beddingSandCubicFt: number;
  beddingSandCubicYards: number;
  beddingSandPurchaseCubicYards: number;
  polymericSandCoverageSqFtPerBag: number;
  polymericSandExactBags: number;
  polymericSand50lbBags: number;
  wastePercentage: number;
}

/**
 * Planning-level engineering & material benchmarks (verify against local quarry & product specs):
 * - BASE_EXTENSION_EACH_SIDE_FT: 0.5 ft (6") per side horizontal extension beyond finished paver edge.
 * - DENSE_GRADE_GRAVEL_TONS_PER_CU_YD: Provisional 1.55 tons/yd³ compacted dense-graded crushed stone benchmark.
 * - BEDDING_SAND_DEPTH_INCHES: 1.0" uncompacted coarse concrete sand screed thickness.
 * - POLYMERIC_SAND_COVERAGE_SQ_FT_PER_BAG: Preliminary ~70 sq ft/50-lb bag benchmark for standard ~4"×8" pavers.
 */
const DEFAULT_PAVER_LENGTH_IN = 8;
const DEFAULT_PAVER_WIDTH_IN = 4;
const DEFAULT_BASE_DEPTH_IN = 4;
const DEFAULT_WASTE_PERCENT = 10;
const BASE_EXTENSION_EACH_SIDE_FT = 0.5;
const DENSE_GRADE_GRAVEL_TONS_PER_CU_YD = 1.55;
const BEDDING_SAND_DEPTH_INCHES = 1.0;
const POLYMERIC_SAND_COVERAGE_SQ_FT_PER_BAG = 70;

export function calculatePaverPatio(inputs: PaverPatioInputs): CalculationResult<PaverPatioOutputs> {
  const length = Number(inputs.patioLength);
  const width = Number(inputs.patioWidth);

  if (!Number.isFinite(length) || length <= 0 || !Number.isFinite(width) || width <= 0) {
    return {
      success: false,
      calculatorId: 'paver-patio-calculator',
      errors: [
        {
          field: !Number.isFinite(length) || length <= 0 ? 'patioLength' : 'patioWidth',
          message: 'Patio length and width must be positive numbers greater than zero.',
          code: 'INVALID_NUMBER',
        },
      ],
    };
  }

  const rawPaverL =
    inputs.paverLengthInches === undefined ? DEFAULT_PAVER_LENGTH_IN : Number(inputs.paverLengthInches);
  const rawPaverW =
    inputs.paverWidthInches === undefined ? DEFAULT_PAVER_WIDTH_IN : Number(inputs.paverWidthInches);

  if (!Number.isFinite(rawPaverL) || rawPaverL <= 0 || !Number.isFinite(rawPaverW) || rawPaverW <= 0) {
    return {
      success: false,
      calculatorId: 'paver-patio-calculator',
      errors: [
        {
          field: !Number.isFinite(rawPaverL) || rawPaverL <= 0 ? 'paverLengthInches' : 'paverWidthInches',
          message: 'Paver length and width must be positive inches greater than zero.',
          code: 'INVALID_NUMBER',
        },
      ],
    };
  }

  const rawBaseDepth =
    inputs.baseDepthInches === undefined ? DEFAULT_BASE_DEPTH_IN : Number(inputs.baseDepthInches);

  if (!Number.isFinite(rawBaseDepth) || rawBaseDepth < 2 || rawBaseDepth > 24) {
    return {
      success: false,
      calculatorId: 'paver-patio-calculator',
      errors: [
        {
          field: 'baseDepthInches',
          message: 'Crushed aggregate base depth must be between 2 and 24 inches.',
          code: 'INVALID_NUMBER',
        },
      ],
    };
  }

  const rawWaste =
    inputs.wastePercentage === undefined ? DEFAULT_WASTE_PERCENT : Number(inputs.wastePercentage);

  if (!Number.isFinite(rawWaste) || rawWaste < 0 || rawWaste > 100) {
    return {
      success: false,
      calculatorId: 'paver-patio-calculator',
      errors: [
        {
          field: 'wastePercentage',
          message: 'Cutting waste percentage must be between 0% and 100%.',
          code: 'INVALID_NUMBER',
        },
      ],
    };
  }

  const paverL = rawPaverL;
  const paverW = rawPaverW;
  const baseDepth = rawBaseDepth;
  const wastePercent = rawWaste;

  // 1. Finished Patio Surface Area
  const patioArea = calculateRectangularArea(length, width);

  // 2. Paver Units & Purchased Surface Area (cut waste applies ONLY to pavers)
  const singlePaverSqFt = (paverL * paverW) / 144;
  const exactPavers = patioArea / singlePaverSqFt;
  const recommendedPavers = applyWaste(exactPavers, wastePercent);
  const paversToPurchase = ceilToPackage(recommendedPavers);
  const purchasedPaverSqFt = paversToPurchase * singlePaverSqFt;

  // 3. Crushed Gravel Base (6" horizontal perimeter extension on all sides; NO paver cut waste)
  const baseLength = length + BASE_EXTENSION_EACH_SIDE_FT * 2;
  const baseWidth = width + BASE_EXTENSION_EACH_SIDE_FT * 2;
  const baseExcavationArea = calculateRectangularArea(baseLength, baseWidth);
  const baseCuFt = calculateVolumeCubicFeet(baseLength, baseWidth, baseDepth);
  const baseCuYds = cubicFeetToCubicYards(baseCuFt);
  const gravelBaseTonsExact = cubicYardsToTons(baseCuYds, DENSE_GRADE_GRAVEL_TONS_PER_CU_YD);
  const gravelBaseTons = roundToPrecision(gravelBaseTonsExact, 2);
  const gravelBasePurchaseTons = Math.ceil(roundToPrecision(gravelBaseTons, 6));

  // 4. Bedding Sand (1" uncompacted coarse sand across net patio area ONLY; NO 6" extension or paver waste)
  const beddingCuFt = calculateVolumeCubicFeet(length, width, BEDDING_SAND_DEPTH_INCHES);
  const beddingSandYardsExact = cubicFeetToCubicYards(beddingCuFt);
  const beddingSandYards = roundToPrecision(beddingSandYardsExact, 2);
  const beddingSandPurchaseYards = roundToPrecision(
    Math.ceil(roundToPrecision(beddingSandYards * 10, 6)) / 10,
    1
  );

  // 5. Polymeric Joint Sand (provisional ~70 sq ft / 50-lb bag across net patio area)
  const polymericSandExactBags = roundToPrecision(patioArea / POLYMERIC_SAND_COVERAGE_SQ_FT_PER_BAG, 2);
  const polymericSandBags = ceilToPackage(patioArea / POLYMERIC_SAND_COVERAGE_SQ_FT_PER_BAG);

  // 6. Pricing Benchmarks (strictly driven by BOM purchase quantities & benchmark units)
  const paverBench = getPriceBenchmark('paver-concrete-unit');
  const gravelBench = getPriceBenchmark('gravel-crushed-stone-ton');
  const beddingBench = getPriceBenchmark('sand-bedding-bulk-yard');
  const sandBench = getPriceBenchmark('polymeric-sand-50lb');

  const paverPricing = getBenchmarkPriceRange('paver-concrete-unit');
  const gravelPricing = getBenchmarkPriceRange('gravel-crushed-stone-ton');
  const beddingPricing = getBenchmarkPriceRange('sand-bedding-bulk-yard');
  const sandPricing = getBenchmarkPriceRange('polymeric-sand-50lb');

  const paverCost = calculateCostRange(
    purchasedPaverSqFt,
    paverPricing.low,
    paverPricing.typical,
    paverPricing.high
  );
  const gravelCost = calculateCostRange(
    gravelBasePurchaseTons,
    gravelPricing.low,
    gravelPricing.typical,
    gravelPricing.high
  );
  const beddingCost = calculateCostRange(
    beddingSandPurchaseYards,
    beddingPricing.low,
    beddingPricing.typical,
    beddingPricing.high
  );
  const sandCost = calculateCostRange(
    polymericSandBags,
    sandPricing.low,
    sandPricing.typical,
    sandPricing.high
  );

  const totalMaterials = {
    low: paverCost.low + gravelCost.low + beddingCost.low + sandCost.low,
    typical: paverCost.typical + gravelCost.typical + beddingCost.typical + sandCost.typical,
    high: paverCost.high + gravelCost.high + beddingCost.high + sandCost.high,
  };

  const laborBench = paverBench?.contractorLabor;
  const laborLow = laborBench ? Math.round(patioArea * laborBench.laborLow) : 0;
  const laborTyp = laborBench ? Math.round(patioArea * laborBench.laborTypical) : 0;
  const laborHigh = laborBench ? Math.round(patioArea * laborBench.laborHigh) : 0;

  return {
    success: true,
    calculatorId: 'paver-patio-calculator',
    timestamp: new Date().toISOString(),
    inputs: {
      ...inputs,
      patioLength: length,
      patioWidth: width,
      paverLengthInches: paverL,
      paverWidthInches: paverW,
      baseDepthInches: baseDepth,
      wastePercentage: wastePercent,
    },
    outputs: {
      patioAreaSqFt: roundToPrecision(patioArea, 1),
      baseExcavationAreaSqFt: roundToPrecision(baseExcavationArea, 1),
      paverAreaSqInches: roundToPrecision(paverL * paverW, 2),
      singlePaverSqFt: roundToPrecision(singlePaverSqFt, 4),
      exactPaversNeeded: roundToPrecision(exactPavers, 1),
      recommendedPaversWithWaste: roundToPrecision(recommendedPavers, 1),
      recommendedPaversToPurchase: paversToPurchase,
      purchasedPaverSqFt: roundToPrecision(purchasedPaverSqFt, 2),
      baseDepthInches: baseDepth,
      baseVolumeCuFt: roundToPrecision(baseCuFt, 2),
      baseVolumeCuYds: roundToPrecision(baseCuYds, 2),
      gravelDensityTonsPerCuYd: DENSE_GRADE_GRAVEL_TONS_PER_CU_YD,
      gravelBaseTons,
      gravelBasePurchaseTons,
      beddingSandCubicFt: roundToPrecision(beddingCuFt, 2),
      beddingSandCubicYards: beddingSandYards,
      beddingSandPurchaseCubicYards: beddingSandPurchaseYards,
      polymericSandCoverageSqFtPerBag: POLYMERIC_SAND_COVERAGE_SQ_FT_PER_BAG,
      polymericSandExactBags,
      polymericSand50lbBags: polymericSandBags,
      wastePercentage: wastePercent,
    },
    billOfMaterials: [
      {
        id: 'paver-units',
        name: `Concrete Pavers (${paverL}" × ${paverW}")`,
        description: `Individual pavers for ${roundToPrecision(patioArea, 1)} sq ft net area + ${wastePercent}% cut waste (~${roundToPrecision(purchasedPaverSqFt, 1)} sq ft priced)`,
        exactQuantity: roundToPrecision(exactPavers, 1),
        recommendedQuantity: roundToPrecision(recommendedPavers, 1),
        purchaseQuantity: paversToPurchase,
        packageUnit: 'pavers',
        unitSizeDescription: `${paverL}"×${paverW}" (${roundToPrecision(singlePaverSqFt, 3)} sq ft/unit)`,
        wasteAppliedPercentage: wastePercent,
        benchmarkPriceId: 'paver-concrete-unit',
        estimatedCost: paverCost,
      },
      {
        id: 'gravel-base',
        name: `Dense-Grade Crushed Gravel Base (${baseDepth}" Compacted Depth)`,
        description: `Compactible base rock over ${roundToPrecision(baseExcavationArea, 1)} sq ft (+6" perimeter extension), rounded up to whole tons`,
        exactQuantity: gravelBaseTons,
        recommendedQuantity: gravelBaseTons,
        purchaseQuantity: gravelBasePurchaseTons,
        packageUnit: 'tons',
        unitSizeDescription: `Provisional ~${DENSE_GRADE_GRAVEL_TONS_PER_CU_YD} tons/yd³ compacted`,
        wasteAppliedPercentage: 0,
        benchmarkPriceId: 'gravel-crushed-stone-ton',
        estimatedCost: gravelCost,
      },
      {
        id: 'bedding-sand',
        name: 'Coarse Bedding Sand (1" Uncompacted Layer)',
        description: `Washed concrete sand (ASTM C33) screeded across ${roundToPrecision(patioArea, 1)} sq ft net patio area, rounded to 0.1 yd³ increment`,
        exactQuantity: beddingSandYards,
        recommendedQuantity: beddingSandYards,
        purchaseQuantity: beddingSandPurchaseYards,
        packageUnit: 'cubic yards',
        unitSizeDescription: '27 cu ft/yd³ (0.1-yd³ increment)',
        wasteAppliedPercentage: 0,
        benchmarkPriceId: 'sand-bedding-bulk-yard',
        estimatedCost: beddingCost,
      },
      {
        id: 'polymeric-sand',
        name: 'Polymeric Jointing Sand (50-lb Bags)',
        description: `Preliminary joint sand allowance across ${roundToPrecision(patioArea, 1)} sq ft (not adjusted for joint width or paver thickness)`,
        exactQuantity: polymericSandExactBags,
        recommendedQuantity: polymericSandExactBags,
        purchaseQuantity: polymericSandBags,
        packageUnit: '50-lb bags',
        unitSizeDescription: `Provisional ~${POLYMERIC_SAND_COVERAGE_SQ_FT_PER_BAG} sq ft/bag`,
        wasteAppliedPercentage: 0,
        benchmarkPriceId: 'polymeric-sand-50lb',
        estimatedCost: sandCost,
      },
    ],
    costEstimate: {
      hasPricing: true,
      currency: 'USD',
      materialsOnly: totalMaterials,
      contractorInstalledTotal: laborBench
        ? {
            low: totalMaterials.low + laborLow,
            typical: totalMaterials.typical + laborTyp,
            high: totalMaterials.high + laborHigh,
            laborOnlyLow: laborLow,
            laborOnlyTypical: laborTyp,
            laborOnlyHigh: laborHigh,
            scopeNote: laborBench.laborScopeNote,
          }
        : undefined,
      benchmarkSources: [
        paverBench?.sourceNote ?? 'Interlocking concrete paver benchmarks',
        gravelBench?.sourceNote ?? 'Quarry aggregate benchmarks',
        beddingBench?.sourceNote ?? 'Bedding sand benchmarks',
      ],
      disclaimer:
        'Excludes delivery fees, quarry/yard minimum order rules (often 1–3 tons or 0.5–1.0 yd³), full-pallet vs. split-pallet paver fees, soil excavation/disposal, plate compactor rental, snap-edge restraints, spikes, and geotextile fabric.',
    },
    assumptions: [
      {
        id: 'base-overdig',
        title: '6" Extended Horizontal Perimeter Base (Base Layer Only)',
        detail: `Per ICPI residential practice, the crushed rock base extends 6 inches past the finished paver edge on all four sides (${roundToPrecision(baseLength, 1)}' × ${roundToPrecision(baseWidth, 1)}' = ${roundToPrecision(baseExcavationArea, 1)} sq ft) to anchor snap-edge restraints. This 6" extension does not apply to pavers or bedding sand.`,
        category: 'structural',
      },
      {
        id: 'base-depth-specification',
        title: 'Finished Compacted Base Depth & Provisional Tonnage Factor',
        detail: `Uses ${baseDepth}" finished compacted base thickness (${roundToPrecision(baseCuYds, 2)} yd³ in place) converted via a provisional ${DENSE_GRADE_GRAVEL_TONS_PER_CU_YD} tons/yd³ dense-graded aggregate benchmark (${gravelBaseTons} net tons, rounded to ${gravelBasePurchaseTons} whole tons for planning). Actual quarry scale weight and loose-to-compacted shrinkage vary by rock gradation, moisture, and subgrade bearing capacity.`,
        category: 'structural',
      },
      {
        id: 'bedding-sand-thickness',
        title: '1" Uncompacted Screeded Bedding Sand (Net Patio Area Only)',
        detail: `Models 1.0" uncompacted coarse concrete sand (ASTM C33) strictly across the ${roundToPrecision(patioArea, 1)} sq ft finished patio footprint (${beddingSandYards} net yd³, rounded to ${beddingSandPurchaseYards} yd³ in 0.1-yd³ planning increments). Paver cut waste is not applied to bedding sand; check local landscape yard minimum scoop rules (often 0.5 or 1.0 yd³).`,
        category: 'structural',
      },
      {
        id: 'polymeric-sand-benchmark',
        title: 'Preliminary Polymeric Sand Coverage Benchmark',
        detail: `Uses a preliminary ${POLYMERIC_SAND_COVERAGE_SQ_FT_PER_BAG} sq ft per 50-lb bag planning assumption typical of ~4"×8" pavers with standard joints (${polymericSandExactBags} exact → ${polymericSandBags} bags). Because paver thickness, joint width, and edge bevels are not modeled, real coverage commonly ranges from ~25 to 100 sq ft/bag—confirm against the polymeric sand manufacturer's coverage chart before ordering.`,
        category: 'coverage',
      },
      {
        id: 'paver-waste-isolation',
        title: 'Paver Cut Waste & Cost Isolation',
        detail: `The ${wastePercent}% cutting waste allowance applies strictly to concrete pavers (${roundToPrecision(exactPavers, 1)} net → ${paversToPurchase} pavers ordered, covering ${roundToPrecision(purchasedPaverSqFt, 1)} sq ft priced) and does not inflate gravel base, bedding sand, or polymeric sand.`,
        category: 'waste',
      },
    ],
    notices: [
      'Ensure polymeric sand is applied ONLY when pavers and joints are completely dry, and blow all dust off paver faces before misting to prevent permanent polymer hazing.',
      'Confirm whether your supplier requires full-pallet paver purchases (typically 100–120 sq ft/pallet) or bulk delivery minimums for gravel and sand before finalizing quantities.',
    ],
  };
}

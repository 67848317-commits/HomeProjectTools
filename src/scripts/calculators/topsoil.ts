/**
 * Topsoil & Garden Bed Calculation Engine
 */

import { getBenchmarkPriceRange, getPriceBenchmark } from '../../data/prices.ts';
import type { CalculationErrorResult, CalculationResult } from '../../types/index.ts';
import {
  applyWaste,
  calculateCostRange,
  calculateVolumeCubicFeet,
  ceilToPackage,
  cubicFeetToCubicYards,
  roundToPrecision,
} from '../core/math-utils.ts';

export type TopsoilPurchasingFormat = 'bulk-yards' | 'bags-075';

export interface TopsoilInputs {
  bedLength: number; // feet
  bedWidth: number; // feet
  soilDepthInches: number; // inches
  wastePercentage?: number; // provisional planning / settling allowance (default 10%, 0–50%)
  purchasingFormat?: TopsoilPurchasingFormat; // explicit cost basis (default 'bulk-yards')
}

export interface TopsoilOutputs {
  areaSqFt: number;
  soilDepthInches: number;
  geometricVolumeCuFt: number;
  geometricVolumeCuYds: number;
  wastePercentage: number;
  recommendedVolumeCuFt: number;
  recommendedVolumeCuYds: number;
  bulkCubicYardsToPurchase: number;
  bags075cuftExact: number;
  bags075cuftToPurchase: number;
  bags1cuftToPurchase: number; // volume-only informational output (no price benchmark)
  selectedPurchasingFormat: TopsoilPurchasingFormat;
}

const DEFAULT_WASTE_PERCENT = 10;
const MAX_WASTE_PERCENT = 50;
const DEFAULT_PURCHASING_FORMAT: TopsoilPurchasingFormat = 'bulk-yards';
const BAG_075_CU_FT = 0.75;

export function calculateTopsoil(inputs: TopsoilInputs): CalculationResult<TopsoilOutputs> {
  const errors: CalculationErrorResult['errors'] = [];

  const length = typeof inputs.bedLength === 'number' ? inputs.bedLength : Number.NaN;
  const width = typeof inputs.bedWidth === 'number' ? inputs.bedWidth : Number.NaN;
  const depthInches = typeof inputs.soilDepthInches === 'number' ? inputs.soilDepthInches : Number.NaN;

  if (!Number.isFinite(length)) {
    errors.push({
      field: 'bedLength',
      message: 'Area length must be a finite number greater than zero.',
      code: 'INVALID_NUMBER',
    });
  } else if (length <= 0) {
    errors.push({
      field: 'bedLength',
      message: 'Area length must be greater than zero.',
      code: 'OUT_OF_RANGE',
    });
  }

  if (!Number.isFinite(width)) {
    errors.push({
      field: 'bedWidth',
      message: 'Area width must be a finite number greater than zero.',
      code: 'INVALID_NUMBER',
    });
  } else if (width <= 0) {
    errors.push({
      field: 'bedWidth',
      message: 'Area width must be greater than zero.',
      code: 'OUT_OF_RANGE',
    });
  }

  if (!Number.isFinite(depthInches)) {
    errors.push({
      field: 'soilDepthInches',
      message: 'Soil depth must be a finite number greater than zero.',
      code: 'INVALID_NUMBER',
    });
  } else if (depthInches <= 0) {
    errors.push({
      field: 'soilDepthInches',
      message: 'Soil depth must be greater than zero.',
      code: 'OUT_OF_RANGE',
    });
  }

  let wastePercent = DEFAULT_WASTE_PERCENT;
  if (inputs.wastePercentage !== undefined) {
    if (typeof inputs.wastePercentage !== 'number' || !Number.isFinite(inputs.wastePercentage)) {
      errors.push({
        field: 'wastePercentage',
        message: `Planning allowance must be a finite number between 0% and ${MAX_WASTE_PERCENT}%.`,
        code: 'INVALID_NUMBER',
      });
    } else if (inputs.wastePercentage < 0 || inputs.wastePercentage > MAX_WASTE_PERCENT) {
      errors.push({
        field: 'wastePercentage',
        message: `Planning allowance must be between 0% and ${MAX_WASTE_PERCENT}%.`,
        code: 'OUT_OF_RANGE',
      });
    } else {
      wastePercent = inputs.wastePercentage;
    }
  }

  let selectedFormat: TopsoilPurchasingFormat = DEFAULT_PURCHASING_FORMAT;
  if (inputs.purchasingFormat !== undefined) {
    if (inputs.purchasingFormat !== 'bulk-yards' && inputs.purchasingFormat !== 'bags-075') {
      errors.push({
        field: 'purchasingFormat',
        message: 'Purchasing format must be either "bulk-yards" or "bags-075".',
        code: 'OUT_OF_RANGE',
      });
    } else {
      selectedFormat = inputs.purchasingFormat;
    }
  }

  if (errors.length > 0) {
    return {
      success: false,
      calculatorId: 'topsoil-calculator',
      errors,
    };
  }

  // 1. Geometric Volumes
  const areaSqFt = length * width;
  const geometricCuFt = calculateVolumeCubicFeet(length, width, depthInches);
  const geometricCuYds = cubicFeetToCubicYards(geometricCuFt);

  // 2. Provisional Planning / Settling Allowance (applied once to geometric volume)
  const recommendedCuFt = applyWaste(geometricCuFt, wastePercent);
  const recommendedCuYds = cubicFeetToCubicYards(recommendedCuFt);

  // 3. Commercial Purchase Quantities (calculated once and reused identically across BOM & cost)
  // Whole cubic yards is used as the explicit planning purchase increment for bulk topsoil.
  const bulkPurchaseYards = ceilToPackage(recommendedCuYds);
  const bags075Exact = recommendedCuFt / BAG_075_CU_FT;
  const bags075cuft = ceilToPackage(bags075Exact);
  // 1.0 cu ft bag count is informational only (no price benchmark exists in prices.ts).
  const bags1cuft = ceilToPackage(recommendedCuFt / 1.0);

  // 4. Pricing Benchmarks (strictly purchase-quantity based; 1.0 cu ft bags remain unpriced)
  const soilBench = getPriceBenchmark('topsoil-bulk-yard');
  const bagBench = getPriceBenchmark('topsoil-bag-075');

  const bulkPricing = getBenchmarkPriceRange('topsoil-bulk-yard');
  const bagPricing = getBenchmarkPriceRange('topsoil-bag-075');

  const bulkCost = calculateCostRange(
    bulkPurchaseYards,
    bulkPricing.low,
    bulkPricing.typical,
    bulkPricing.high
  );

  const baggedCost = calculateCostRange(
    bags075cuft,
    bagPricing.low,
    bagPricing.typical,
    bagPricing.high
  );

  const isBulkSelected = selectedFormat === 'bulk-yards';
  const selectedCost = isBulkSelected ? bulkCost : baggedCost;

  const recommendedCuYdsDisplay = roundToPrecision(recommendedCuYds, 2);
  const bags075Display = roundToPrecision(bags075Exact, 2);

  return {
    success: true,
    calculatorId: 'topsoil-calculator',
    timestamp: new Date().toISOString(),
    inputs: {
      ...inputs,
      bedLength: length,
      bedWidth: width,
      soilDepthInches: depthInches,
      wastePercentage: wastePercent,
      purchasingFormat: selectedFormat,
    },
    outputs: {
      areaSqFt: roundToPrecision(areaSqFt, 1),
      soilDepthInches: depthInches,
      geometricVolumeCuFt: roundToPrecision(geometricCuFt, 2),
      geometricVolumeCuYds: roundToPrecision(geometricCuYds, 2),
      wastePercentage: wastePercent,
      recommendedVolumeCuFt: roundToPrecision(recommendedCuFt, 2),
      recommendedVolumeCuYds: recommendedCuYdsDisplay,
      bulkCubicYardsToPurchase: bulkPurchaseYards,
      bags075cuftExact: bags075Display,
      bags075cuftToPurchase: bags075cuft,
      bags1cuftToPurchase: bags1cuft,
      selectedPurchasingFormat: selectedFormat,
    },
    // BOM semantics: exactQuantity and recommendedQuantity express the unrounded planning requirement
    // in the exact same commercial unit as packageUnit; purchaseQuantity rounds upward to whole packages.
    billOfMaterials: [
      {
        id: 'topsoil-bulk-yards',
        name: `Screened Loam Topsoil — Bulk Cubic Yards (${isBulkSelected ? 'Selected Format' : 'Alternative Format'})`,
        description: `Whole-yard planning order (${bulkPurchaseYards} yd³) before delivery freight; supplier increments & minimums vary`,
        exactQuantity: recommendedCuYdsDisplay,
        recommendedQuantity: recommendedCuYdsDisplay,
        purchaseQuantity: bulkPurchaseYards,
        packageUnit: 'cubic yards',
        unitSizeDescription: '27 cu ft/yd³ (whole-yard increment)',
        wasteAppliedPercentage: wastePercent,
        benchmarkPriceId: 'topsoil-bulk-yard',
        estimatedCost: bulkCost,
      },
      {
        id: 'topsoil-bags-075',
        name: `0.75 cu ft Bagged Topsoil (${!isBulkSelected ? 'Selected Format' : 'Alternative Format'})`,
        description: `Retail bags (weight varies by product and moisture; ${bags075cuft} whole bags for ${roundToPrecision(recommendedCuFt, 2)} cu ft planning volume)`,
        exactQuantity: bags075Display,
        recommendedQuantity: bags075Display,
        purchaseQuantity: bags075cuft,
        packageUnit: '0.75 cu ft bags',
        unitSizeDescription: '0.75 cu ft/bag (36 bags = 1 yd³)',
        wasteAppliedPercentage: wastePercent,
        benchmarkPriceId: 'topsoil-bag-075',
        estimatedCost: baggedCost,
      },
    ],
    costEstimate: {
      hasPricing: true,
      currency: 'USD',
      materialsOnly: selectedCost,
      benchmarkSources: [
        isBulkSelected
          ? `Selected Format: Bulk Cubic Yards (${bulkPurchaseYards} yd³ × $${bulkPricing.low.toFixed(2)}–$${bulkPricing.high.toFixed(2)}/yd³, typical $${bulkPricing.typical.toFixed(2)}/yd³) — ${soilBench?.sourceNote ?? 'Screened residential topsoil and garden blend averages'}`
          : `Selected Format: 0.75 cu ft Retail Bags (${bags075cuft} bags × $${bagPricing.low.toFixed(2)}–$${bagPricing.high.toFixed(2)}/bag, typical $${bagPricing.typical.toFixed(2)}/bag) — ${bagBench?.sourceNote ?? 'Aggregated retail home center packaged topsoil'}`,
      ],
      disclaimer: isBulkSelected
        ? `Estimate reflects ${bulkPurchaseYards} whole cubic yard(s) of bulk screened topsoil material only. Delivery freight, supplier minimum order charges, half-yard billing availability, and sales tax are excluded and vary by local yard, distance, and order size.`
        : `Estimate reflects ${bags075cuft} retail 0.75 cu ft bags only (alternative bulk format is not combined). Store delivery, pallet freight, specialty garden soil upgrades, and sales tax are excluded. 1.0 cu ft bag counts are shown for volume reference only without a benchmark price.`,
    },
    assumptions: [
      {
        id: 'soil-settling-factor',
        title: 'Provisional Planning Allowance',
        detail: `Applies an adjustable ${wastePercent}% additional volume allowance to geometric volume as a provisional planning buffer for loose soil settling, raking, and minor grade variations (actual settling varies with soil blend, moisture, and compaction).`,
        category: 'waste',
      },
      {
        id: 'bag-vs-bulk-equivalence',
        title: 'Commercial Packaging & Format Comparison',
        detail: '1 cubic yard (27 cu ft) equals thirty-six (36) 0.75 cu ft retail bags or twenty-seven (27) 1.0 cu ft bags. Bulk orders use a whole-yard planning increment; compare material totals against local delivery fees, supplier minimums, and wheelbarrow/drop-zone access.',
        category: 'packaging',
      },
    ],
    notices: [
      'Moist topsoil weighs 2,000 to 2,500 lbs per cubic yard. Never overload standard pickup truck beds without verifying payload suspension ratings.',
    ],
  };
}

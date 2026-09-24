/**
 * Topsoil & Garden Bed Calculation Engine
 */

import { getBenchmarkPriceRange, getPriceBenchmark } from '../../data/prices.ts';
import type { CalculationResult } from '../../types/index.ts';
import {
  applyWaste,
  calculateCostRange,
  calculateVolumeCubicFeet,
  ceilToPackage,
  cubicFeetToCubicYards,
  roundToPrecision,
  sanitizeNumber,
} from '../core/math-utils.ts';

export interface TopsoilInputs {
  bedLength: number; // feet
  bedWidth: number; // feet
  soilDepthInches: number; // inches
  wastePercentage?: number; // settling / compaction allowance (default 10%)
}

export interface TopsoilOutputs {
  areaSqFt: number;
  soilDepthInches: number;
  geometricVolumeCuFt: number;
  geometricVolumeCuYds: number;
  wastePercentage: number;
  recommendedVolumeCuFt: number;
  recommendedVolumeCuYds: number;
  bags075cuftToPurchase: number;
  bags1cuftToPurchase: number;
}

export function calculateTopsoil(inputs: TopsoilInputs): CalculationResult<TopsoilOutputs> {
  const length = sanitizeNumber(inputs.bedLength, 0);
  const width = sanitizeNumber(inputs.bedWidth, 0);
  const depthInches = sanitizeNumber(inputs.soilDepthInches, 0);
  const wastePercent = Math.max(0, sanitizeNumber(inputs.wastePercentage, 10));

  if (length <= 0 || width <= 0 || depthInches <= 0) {
    return {
      success: false,
      calculatorId: 'topsoil-calculator',
      errors: [
        {
          field: length <= 0 ? 'bedLength' : width <= 0 ? 'bedWidth' : 'soilDepthInches',
          message: 'Area dimensions and soil depth must be positive numbers greater than zero.',
          code: 'INVALID_NUMBER',
        },
      ],
    };
  }

  // 1. Geometric Volumes
  const areaSqFt = length * width;
  const geometricCuFt = calculateVolumeCubicFeet(length, width, depthInches);
  const geometricCuYds = cubicFeetToCubicYards(geometricCuFt);

  // 2. Organic Settling Buffer (topsoil compresses after first deep watering)
  const recommendedCuFt = applyWaste(geometricCuFt, wastePercent);
  const recommendedCuYds = cubicFeetToCubicYards(recommendedCuFt);

  // 3. Commercial Retail Bag Counts (0.75 cu ft is standard 40lb bag; 1.0 cu ft)
  const bags075cuft = ceilToPackage(recommendedCuFt / 0.75);
  const bags1cuft = ceilToPackage(recommendedCuFt / 1.0);

  // 4. Pricing Benchmarks
  const soilBench = getPriceBenchmark('topsoil-bulk-yard');
  const bagBench = getPriceBenchmark('topsoil-bag-075');

  const bulkPricing = getBenchmarkPriceRange('topsoil-bulk-yard');
  const bagPricing = getBenchmarkPriceRange('topsoil-bag-075');

  const bulkCost = calculateCostRange(
    recommendedCuYds,
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

  return {
    success: true,
    calculatorId: 'topsoil-calculator',
    timestamp: new Date().toISOString(),
    inputs: { ...inputs, bedLength: length, bedWidth: width, soilDepthInches: depthInches },
    outputs: {
      areaSqFt: roundToPrecision(areaSqFt, 1),
      soilDepthInches: depthInches,
      geometricVolumeCuFt: roundToPrecision(geometricCuFt, 2),
      geometricVolumeCuYds: roundToPrecision(geometricCuYds, 2),
      wastePercentage: wastePercent,
      recommendedVolumeCuFt: roundToPrecision(recommendedCuFt, 2),
      recommendedVolumeCuYds: roundToPrecision(recommendedCuYds, 2),
      bags075cuftToPurchase: bags075cuft,
      bags1cuftToPurchase: bags1cuft,
    },
    billOfMaterials: [
      {
        id: 'topsoil-bulk-yards',
        name: 'Screened Loam Topsoil (Bulk Delivery)',
        description: 'Screened garden topsoil delivered in bulk by dump truck',
        exactQuantity: roundToPrecision(recommendedCuYds, 2),
        recommendedQuantity: roundToPrecision(recommendedCuYds, 2),
        purchaseQuantity: Math.ceil(recommendedCuYds),
        packageUnit: 'cubic yards',
        unitSizeDescription: '27 cu ft/yard',
        wasteAppliedPercentage: wastePercent,
        benchmarkPriceId: 'topsoil-bulk-yard',
        estimatedCost: bulkCost,
      },
      {
        id: 'topsoil-bags-075',
        name: '0.75 cu ft Bagged Topsoil',
        description: 'Retail bags (approx 40 lbs each)',
        exactQuantity: roundToPrecision(recommendedCuFt / 0.75, 1),
        recommendedQuantity: roundToPrecision(recommendedCuFt, 1),
        purchaseQuantity: bags075cuft,
        packageUnit: '0.75 cu ft bags',
        unitSizeDescription: '0.75 cu ft/bag (36 bags = 1 yard)',
        wasteAppliedPercentage: wastePercent,
        benchmarkPriceId: 'topsoil-bag-075',
        estimatedCost: baggedCost,
      },
    ],
    costEstimate: {
      hasPricing: true,
      currency: 'USD',
      materialsOnly: bags075cuft <= 25 ? baggedCost : bulkCost,
      benchmarkSources: [
        bags075cuft <= 25
          ? (bagBench?.sourceNote ?? 'Retail home center packaged topsoil')
          : (soilBench?.sourceNote ?? 'Screened residential topsoil and garden blend averages'),
      ],
      disclaimer: 'Bulk pricing excludes dump truck delivery freight fees ($40–$80 per drop).',
    },
    assumptions: [
      {
        id: 'soil-settling-factor',
        title: 'Settling Allowance',
        detail: `Added ${wastePercent}% to account for natural soil compression and settling after rain or initial hose soaking.`,
        category: 'waste',
      },
      {
        id: 'bag-vs-bulk-threshold',
        title: 'Bagged vs Bulk Efficiency',
        detail: '1 cubic yard of soil equals thirty-six (36) 0.75 cu ft retail bags. Any project exceeding 1.5 cubic yards is significantly cheaper ordered in bulk.',
        category: 'packaging',
      },
    ],
    notices: [
      'Moist topsoil weighs 2,000 to 2,500 lbs per cubic yard. Never overload standard pickup truck beds without verifying payload suspension ratings.',
    ],
  };
}

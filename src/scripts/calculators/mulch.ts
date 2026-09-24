/**
 * Mulch Yardage & Bag Calculation Engine
 */

import { getPriceBenchmark } from '../../data/prices.ts';
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

export interface MulchInputs {
  bedLength: number; // feet
  bedWidth: number; // feet
  mulchDepthInches: number; // inches (e.g. 2 or 3)
  wastePercentage?: number; // settling allowance (default 5%)
}

export interface MulchOutputs {
  bedAreaSqFt: number;
  mulchDepthInches: number;
  geometricVolumeCuFt: number;
  geometricVolumeCuYds: number;
  wastePercentage: number;
  recommendedVolumeCuFt: number;
  recommendedVolumeCuYds: number;
  bags2cuftToPurchase: number;
  bags3cuftToPurchase: number;
}

export function calculateMulch(inputs: MulchInputs): CalculationResult<MulchOutputs> {
  const length = sanitizeNumber(inputs.bedLength, 0);
  const width = sanitizeNumber(inputs.bedWidth, 0);
  const depthInches = sanitizeNumber(inputs.mulchDepthInches, 0);
  const wastePercent = Math.max(0, sanitizeNumber(inputs.wastePercentage, 5));

  if (length <= 0 || width <= 0 || depthInches <= 0) {
    return {
      success: false,
      calculatorId: 'mulch-calculator',
      errors: [
        {
          field: length <= 0 ? 'bedLength' : width <= 0 ? 'bedWidth' : 'mulchDepthInches',
          message: 'Garden bed dimensions and depth must be positive numbers greater than zero.',
          code: 'INVALID_NUMBER',
        },
      ],
    };
  }

  // 1. Geometric Calculations
  const areaSqFt = length * width;
  const geometricCuFt = calculateVolumeCubicFeet(length, width, depthInches);
  const geometricCuYds = cubicFeetToCubicYards(geometricCuFt);

  // 2. Settling & Waste Allowance
  const recommendedCuFt = applyWaste(geometricCuFt, wastePercent);
  const recommendedCuYds = cubicFeetToCubicYards(recommendedCuFt);

  // 3. Commercial Bag Counts
  const bags2cuft = ceilToPackage(recommendedCuFt / 2);
  const bags3cuft = ceilToPackage(recommendedCuFt / 3);

  // 4. Pricing Benchmarks (Bagged vs Bulk)
  const bulkBench = getPriceBenchmark('mulch-bulk-yard');
  const bagBench = getPriceBenchmark('mulch-bag-2cuft');

  const bulkCost = calculateCostRange(
    recommendedCuYds,
    bulkBench?.priceLow ?? 30,
    bulkBench?.priceTypical ?? 42,
    bulkBench?.priceHigh ?? 58
  );

  const bagCost = calculateCostRange(
    bags2cuft,
    bagBench?.priceLow ?? 3.25,
    bagBench?.priceTypical ?? 4.5,
    bagBench?.priceHigh ?? 6.25
  );

  return {
    success: true,
    calculatorId: 'mulch-calculator',
    timestamp: new Date().toISOString(),
    inputs: { ...inputs, bedLength: length, bedWidth: width, mulchDepthInches: depthInches },
    outputs: {
      bedAreaSqFt: roundToPrecision(areaSqFt, 1),
      mulchDepthInches: depthInches,
      geometricVolumeCuFt: roundToPrecision(geometricCuFt, 2),
      geometricVolumeCuYds: roundToPrecision(geometricCuYds, 2),
      wastePercentage: wastePercent,
      recommendedVolumeCuFt: roundToPrecision(recommendedCuFt, 2),
      recommendedVolumeCuYds: roundToPrecision(recommendedCuYds, 2),
      bags2cuftToPurchase: bags2cuft,
      bags3cuftToPurchase: bags3cuft,
    },
    billOfMaterials: [
      {
        id: 'mulch-bags-2cuft',
        name: '2 cu ft Retail Mulch Bags',
        description: 'Standard retail bagged mulch sold at home centers',
        exactQuantity: roundToPrecision(recommendedCuFt / 2, 1),
        recommendedQuantity: roundToPrecision(recommendedCuFt, 1),
        purchaseQuantity: bags2cuft,
        packageUnit: '2 cu ft bags',
        unitSizeDescription: '2.0 cu ft/bag (13.5 bags = 1 cubic yard)',
        wasteAppliedPercentage: wastePercent,
        benchmarkPriceId: 'mulch-bag-2cuft',
        estimatedCost: bagCost,
      },
      {
        id: 'mulch-bulk-cubic-yards',
        name: 'Bulk Mulch Delivery',
        description: 'Loose bulk mulch delivered by dump truck from landscape supply yard',
        exactQuantity: roundToPrecision(recommendedCuYds, 2),
        recommendedQuantity: roundToPrecision(recommendedCuYds, 2),
        purchaseQuantity: ceilToPackage(recommendedCuYds),
        packageUnit: 'cubic yards',
        unitSizeDescription: '27 cu ft/yard',
        wasteAppliedPercentage: wastePercent,
        benchmarkPriceId: 'mulch-bulk-yard',
        estimatedCost: bulkCost,
      },
    ],
    costEstimate: {
      hasPricing: true,
      currency: 'USD',
      materialsOnly: bags2cuft <= 20 ? bagCost : bulkCost,
      benchmarkSources: [
        bags2cuft <= 20
          ? (bagBench?.sourceNote ?? 'Retail home center packaged mulch')
          : (bulkBench?.sourceNote ?? 'Commercial landscape supply yard'),
      ],
      disclaimer: 'Bulk delivery typically incurs a $40 to $80 flat dump delivery fee for small orders.',
    },
    assumptions: [
      {
        id: 'depth-guidance',
        title: 'Recommended Mulch Depth',
        detail: '3 inches is the optimal depth to suppress weeds and retain soil moisture without suffocating plant root collars.',
        category: 'coverage',
      },
      {
        id: 'settling-factor',
        title: 'Natural Settling Allowance',
        detail: `Added ${wastePercent}% to volume to account for compression after initial raking and watering.`,
        category: 'waste',
      },
    ],
    notices: [
      bags2cuft > 25
        ? `You need ${bags2cuft} bags (${roundToPrecision(recommendedCuYds, 1)} cu yds). Ordering bulk delivery will save significant money and trunk trips.`
        : `At ${bags2cuft} bags, buying bagged mulch at a local store is convenient and easy to transport in your vehicle trunk.`,
    ],
  };
}

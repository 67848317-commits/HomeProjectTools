/**
 * Sod Roll & Pallet Calculation Engine
 */

import { getPriceBenchmark } from '../../data/prices.ts';
import type { CalculationResult } from '../../types/index.ts';
import {
  applyWaste,
  calculateCostRange,
  calculateRectangularArea,
  ceilToPackage,
  roundToPrecision,
  sanitizeNumber,
} from '../core/math-utils.ts';

export interface SodInputs {
  lawnLength: number; // feet
  lawnWidth: number; // feet
  palletCoverageSqFt?: number; // sq ft per pallet (default 450)
  wastePercentage?: number; // cut waste buffer (default 8%)
}

export interface SodOutputs {
  netAreaSqFt: number;
  wastePercentage: number;
  recommendedAreaSqFt: number;
  palletCoverageSqFt: number;
  palletsToPurchase: number;
  rollsEquivalent: number;
  purchasedSqFt: number;
}

export function calculateSod(inputs: SodInputs): CalculationResult<SodOutputs> {
  const length = sanitizeNumber(inputs.lawnLength, 0);
  const width = sanitizeNumber(inputs.lawnWidth, 0);
  const palletCoverage = Math.max(200, sanitizeNumber(inputs.palletCoverageSqFt, 450));
  const wastePercent = Math.max(0, sanitizeNumber(inputs.wastePercentage, 8));

  if (length <= 0 || width <= 0) {
    return {
      success: false,
      calculatorId: 'sod-calculator',
      errors: [
        {
          field: length <= 0 ? 'lawnLength' : 'lawnWidth',
          message: 'Lawn dimensions must be positive numbers greater than zero.',
          code: 'INVALID_NUMBER',
        },
      ],
    };
  }

  // 1. Net Area & Waste Area
  const netArea = calculateRectangularArea(length, width);
  const recommendedArea = applyWaste(netArea, wastePercent);

  // 2. Commercial Packaging (Pallets & 10 sq ft rolls)
  const exactPallets = recommendedArea / palletCoverage;
  const palletsToPurchase = ceilToPackage(exactPallets);
  const purchasedSqFt = palletsToPurchase * palletCoverage;

  // Standard roll is 2 ft x 5 ft (10 sq ft)
  const rollsEquivalent = ceilToPackage(recommendedArea / 10);

  // 3. Pricing Benchmarks
  const sodBench = getPriceBenchmark('sod-pallet');
  const materialCost = calculateCostRange(
    palletsToPurchase,
    sodBench?.priceLow ?? 180,
    sodBench?.priceTypical ?? 260,
    sodBench?.priceHigh ?? 380
  );

  const laborBench = sodBench?.contractorLabor;
  const laborLow = laborBench ? Math.round(netArea * laborBench.laborLow) : 0;
  const laborTyp = laborBench ? Math.round(netArea * laborBench.laborTypical) : 0;
  const laborHigh = laborBench ? Math.round(netArea * laborBench.laborHigh) : 0;

  return {
    success: true,
    calculatorId: 'sod-calculator',
    timestamp: new Date().toISOString(),
    inputs: { ...inputs, lawnLength: length, lawnWidth: width },
    outputs: {
      netAreaSqFt: roundToPrecision(netArea, 1),
      wastePercentage: wastePercent,
      recommendedAreaSqFt: roundToPrecision(recommendedArea, 1),
      palletCoverageSqFt: palletCoverage,
      palletsToPurchase,
      rollsEquivalent,
      purchasedSqFt,
    },
    billOfMaterials: [
      {
        id: 'sod-pallets',
        name: 'Turfgrass Sod Pallets',
        description: `Full commercial pallets at ${palletCoverage} sq ft per pallet`,
        exactQuantity: roundToPrecision(exactPallets, 2),
        recommendedQuantity: roundToPrecision(recommendedArea, 1),
        purchaseQuantity: palletsToPurchase,
        packageUnit: 'pallets',
        unitSizeDescription: `${palletCoverage} sq ft/pallet (~45 rolls)`,
        wasteAppliedPercentage: wastePercent,
        benchmarkPriceId: 'sod-pallet',
        estimatedCost: materialCost,
      },
    ],
    costEstimate: {
      hasPricing: true,
      currency: 'USD',
      materialsOnly: materialCost,
      contractorInstalledTotal: laborBench
        ? {
            low: materialCost.low + laborLow,
            typical: materialCost.typical + laborTyp,
            high: materialCost.high + laborHigh,
            laborOnlyLow: laborLow,
            laborOnlyTypical: laborTyp,
            laborOnlyHigh: laborHigh,
            scopeNote: laborBench.laborScopeNote,
          }
        : undefined,
      benchmarkSources: [sodBench?.sourceNote ?? 'Regional sod farm benchmarks'],
      disclaimer: 'Follow supplier handling guidance. Sod is perishable and is generally best installed promptly after delivery. Delivery freight fees are not included.',
    },
    assumptions: [
      {
        id: 'pallet-coverage-spec',
        title: 'Pallet Coverage Standard',
        detail: `Calculation uses ${palletCoverage} sq ft per pallet. Warm-season grasses (Bermuda, St. Augustine) and cool-season fescue often range from 450 to 500 sq ft per pallet.`,
        category: 'packaging',
      },
      {
        id: 'cut-waste-curved',
        title: 'Perimeter Cut Allowance',
        detail: `Applied ${wastePercent}% waste to account for trimming around garden bed curves, trees, fence posts, and sidewalks.`,
        category: 'waste',
      },
    ],
    notices: [
      'Sod is a living, perishable agricultural crop. Follow supplier handling guidance and water thoroughly promptly after installation.',
    ],
  };
}

/**
 * Roofing Shingle & Bundle Calculation Engine
 */

import { getBenchmarkPriceRange, getPriceBenchmark } from '../../data/prices.ts';
import type { CalculationResult } from '../../types/index.ts';
import {
  applyWaste,
  calculateCostRange,
  calculatePitchMultiplier,
  ceilToPackage,
  roundToPrecision,
  sanitizeNumber,
} from '../core/math-utils.ts';

export interface RoofingInputs {
  footprintAreaSqFt: number; // ground footprint area
  roofPitchRisePerFoot?: number; // e.g. 4, 6, 8, 10, 12
  complexityWastePercentage?: number; // 10% (gable), 15% (hip/valleys), 20% (complex)
  bundlesPerSquare?: number; // manufacturer packaging (default 3 bundles/square)
}

export interface RoofingOutputs {
  footprintAreaSqFt: number;
  roofPitchRisePerFoot: number;
  pitchMultiplier: number;
  actualRoofAreaSqFt: number;
  wastePercentage: number;
  recommendedRoofAreaSqFt: number;
  roofingSquaresExact: number;
  roofingSquaresToPurchase: number;
  bundlesPerSquare: number;
  shingleBundlesToPurchase: number;
  syntheticUnderlaymentRolls: number;
}

export function calculateRoofing(inputs: RoofingInputs): CalculationResult<RoofingOutputs> {
  const footprint = sanitizeNumber(inputs.footprintAreaSqFt, 0);
  const pitch = Math.max(0, sanitizeNumber(inputs.roofPitchRisePerFoot, 6));
  const wastePercent = Math.max(5, sanitizeNumber(inputs.complexityWastePercentage, 10));
  const bundlesPerSq = Math.max(2, Math.min(6, sanitizeNumber(inputs.bundlesPerSquare, 3)));

  if (footprint <= 0) {
    return {
      success: false,
      calculatorId: 'roofing-calculator',
      errors: [
        {
          field: 'footprintAreaSqFt',
          message: 'Ground footprint area must be a positive number greater than zero.',
          code: 'INVALID_NUMBER',
        },
      ],
    };
  }

  // 1. Pitch Multiplier: sqrt(1 + (pitch/12)^2)
  const pitchMultiplier = calculatePitchMultiplier(pitch);

  // 2. Actual Surface Area & Complexity Waste
  const actualRoofArea = footprint * pitchMultiplier;
  const recommendedArea = applyWaste(actualRoofArea, wastePercent);

  // 3. Industry Units: Roofing Squares (1 Square = 100 sq ft)
  const squaresExact = recommendedArea / 100;
  const roofingSquaresToPurchase = ceilToPackage(squaresExact);

  // 4. Shingle Bundles (configurable bundles per square; standard is 3 bundles per square)
  const shingleBundlesToPurchase = Math.ceil(roofingSquaresToPurchase * bundlesPerSq);

  // 5. Synthetic Underlayment (1000 sq ft / 10 square rolls)
  const underlaymentRolls = ceilToPackage(recommendedArea / 1000);

  // 6. Pricing Benchmarks
  const shingleBench = getPriceBenchmark('roofing-architectural-square');
  const underlaymentBench = getPriceBenchmark('roofing-synthetic-underlayment-roll');

  const shinglePricing = getBenchmarkPriceRange('roofing-architectural-square');
  const underlaymentPricing = getBenchmarkPriceRange('roofing-synthetic-underlayment-roll');

  const shingleCost = calculateCostRange(
    roofingSquaresToPurchase,
    shinglePricing.low,
    shinglePricing.typical,
    shinglePricing.high
  );

  const underlaymentCost = calculateCostRange(
    underlaymentRolls,
    underlaymentPricing.low,
    underlaymentPricing.typical,
    underlaymentPricing.high
  );

  const totalMaterials = {
    low: shingleCost.low + underlaymentCost.low,
    typical: shingleCost.typical + underlaymentCost.typical,
    high: shingleCost.high + underlaymentCost.high,
  };

  const laborBench = shingleBench?.contractorLabor;
  const laborLow = laborBench ? Math.round(roofingSquaresToPurchase * laborBench.laborLow) : 0;
  const laborTyp = laborBench ? Math.round(roofingSquaresToPurchase * laborBench.laborTypical) : 0;
  const laborHigh = laborBench ? Math.round(roofingSquaresToPurchase * laborBench.laborHigh) : 0;

  return {
    success: true,
    calculatorId: 'roofing-calculator',
    timestamp: new Date().toISOString(),
    inputs: { ...inputs, footprintAreaSqFt: footprint, roofPitchRisePerFoot: pitch, bundlesPerSquare: bundlesPerSq },
    outputs: {
      footprintAreaSqFt: footprint,
      roofPitchRisePerFoot: pitch,
      pitchMultiplier: roundToPrecision(pitchMultiplier, 4),
      actualRoofAreaSqFt: roundToPrecision(actualRoofArea, 1),
      wastePercentage: wastePercent,
      recommendedRoofAreaSqFt: roundToPrecision(recommendedArea, 1),
      roofingSquaresExact: roundToPrecision(squaresExact, 2),
      roofingSquaresToPurchase,
      bundlesPerSquare: bundlesPerSq,
      shingleBundlesToPurchase,
      syntheticUnderlaymentRolls: underlaymentRolls,
    },
    billOfMaterials: [
      {
        id: 'roofing-shingles',
        name: `Architectural Shingles (${bundlesPerSq} Bundles/Square)`,
        description: `${shingleBundlesToPurchase} bundles covering ${roofingSquaresToPurchase} roofing squares`,
        exactQuantity: roundToPrecision(squaresExact, 2),
        recommendedQuantity: roundToPrecision(squaresExact, 2),
        purchaseQuantity: roofingSquaresToPurchase,
        packageUnit: 'roofing squares',
        unitSizeDescription: `100 sq ft/square (${bundlesPerSq} bundles/square)`,
        wasteAppliedPercentage: wastePercent,
        benchmarkPriceId: 'roofing-architectural-square',
        estimatedCost: shingleCost,
      },
      {
        id: 'roofing-underlayment',
        name: 'Synthetic Underlayment (10 Square Rolls)',
        description: 'Standard tear-resistant synthetic roof deck moisture membrane',
        exactQuantity: roundToPrecision(recommendedArea / 1000, 2),
        recommendedQuantity: roundToPrecision(recommendedArea, 1),
        purchaseQuantity: underlaymentRolls,
        packageUnit: '10-square rolls',
        unitSizeDescription: '1,000 sq ft/roll',
        wasteAppliedPercentage: wastePercent,
        benchmarkPriceId: 'roofing-synthetic-underlayment-roll',
        estimatedCost: underlaymentCost,
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
      benchmarkSources: [shingleBench?.sourceNote ?? 'Aggregated national roofing distributor benchmarks'],
      disclaimer: 'Contractor installed estimates include tear-off, synthetic underlayment, flashings, and labor. Excludes structural plywood redecking.',
    },
    assumptions: [
      {
        id: 'pitch-geometry',
        title: 'Pitch Slope Multiplier',
        detail: `A ${pitch}/12 slope increases ground footprint by a factor of ${roundToPrecision(pitchMultiplier, 3)}x to calculate true rafter surface area.`,
        category: 'geometry',
      },
      {
        id: 'square-definition',
        title: 'Industry Roofing Square Unit',
        detail: `1 roofing square = 100 square feet of roof surface. Shingles are estimated at ${bundlesPerSq} bundles per square based on manufacturer specification.`,
        category: 'packaging',
      },
    ],
    notices: [
      'THIS IS A PRELIMINARY PLANNING ESTIMATE ONLY. Steep roofs (>8/12), multiple valleys, and dormers produce higher off-cut scrap and require detailed on-roof inspection.',
      'Remember to budget for starter strip shingles, hip & ridge cap shingles, drip edge metal, roofing coil nails, and ice & water shield.',
    ],
  };
}

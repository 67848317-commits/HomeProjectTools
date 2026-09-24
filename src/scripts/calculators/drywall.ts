/**
 * Drywall Sheet & Mud Calculation Engine
 */

import { getBenchmarkPriceRange, getPriceBenchmark } from '../../data/prices.ts';
import type { CalculationResult } from '../../types/index.ts';
import {
  applyWaste,
  calculateCostRange,
  ceilToPackage,
  roundToPrecision,
  sanitizeNumber,
} from '../core/math-utils.ts';

export interface DrywallInputs {
  roomLength: number; // feet
  roomWidth: number; // feet
  ceilingHeight: number; // feet
  includeCeiling?: boolean;
  doorCount?: number;
  windowCount?: number;
  wastePercentage?: number; // cut waste (default 10%)
}

export interface DrywallOutputs {
  wallAreaSqFt: number;
  ceilingAreaSqFt: number;
  totalGrossAreaSqFt: number;
  openingsDeductionSqFt: number;
  netDrywallAreaSqFt: number;
  wastePercentage: number;
  recommendedDrywallAreaSqFt: number;
  sheets4x8ToPurchase: number;
  sheets4x12ToPurchase: number;
  jointCompound45GalBuckets: number;
  drywallTape500ftRolls: number;
  drywallScrewsLbs: number;
}

export function calculateDrywall(inputs: DrywallInputs): CalculationResult<DrywallOutputs> {
  const length = sanitizeNumber(inputs.roomLength, 0);
  const width = sanitizeNumber(inputs.roomWidth, 0);
  const height = sanitizeNumber(inputs.ceilingHeight, 0);
  const includeCeiling = inputs.includeCeiling !== false; // default true
  const doors = Math.max(0, sanitizeNumber(inputs.doorCount, 0));
  const windows = Math.max(0, sanitizeNumber(inputs.windowCount, 0));
  const wastePercent = Math.max(0, sanitizeNumber(inputs.wastePercentage, 10));

  if (length <= 0 || width <= 0 || height <= 0) {
    return {
      success: false,
      calculatorId: 'drywall-calculator',
      errors: [
        {
          field: length <= 0 ? 'roomLength' : width <= 0 ? 'roomWidth' : 'ceilingHeight',
          message: 'Room dimensions and ceiling height must be positive numbers greater than zero.',
          code: 'INVALID_NUMBER',
        },
      ],
    };
  }

  // 1. Gross Wall & Ceiling Areas
  const perimeter = 2 * (length + width);
  const grossWallArea = perimeter * height;
  const ceilingArea = includeCeiling ? length * width : 0;
  const totalGrossArea = grossWallArea + ceilingArea;

  // 2. Openings Deductions (21 sq ft per door, 15 sq ft per window)
  const deductions = doors * 21 + windows * 15;
  const netDrywallArea = Math.max(10, totalGrossArea - deductions);

  // 3. Recommended Area with Cut Waste
  const recommendedArea = applyWaste(netDrywallArea, wastePercent);

  // 4. Panel Counts (4x8 = 32 sq ft; 4x12 = 48 sq ft)
  const sheets4x8 = ceilToPackage(recommendedArea / 32);
  const sheets4x12 = ceilToPackage(recommendedArea / 48);

  // 5. Finishing Materials: Mud, Tape, Screws
  // 1 bucket (4.5 gal) of all-purpose mud covers ~400 sq ft of board (taping, bedding, topping)
  const compoundBuckets = ceilToPackage(recommendedArea / 400);

  // Tape: approx 1 roll (500 ft) per 600 sq ft of board
  const tapeRolls = ceilToPackage(recommendedArea / 600);

  // Screws: approx 1 lb (1-1/4" bugle head, ~300 screws) per 300 sq ft
  const screwsLbs = Math.max(1, ceilToPackage(recommendedArea / 300));

  // 6. Pricing Benchmarks
  const sheetBench = getPriceBenchmark('drywall-sheet-4x8');
  const mudBench = getPriceBenchmark('drywall-joint-compound-bucket');
  const accessBench = getPriceBenchmark('drywall-accessories-kit');

  const sheetPricing = getBenchmarkPriceRange('drywall-sheet-4x8');
  const mudPricing = getBenchmarkPriceRange('drywall-joint-compound-bucket');
  const accessPricing = getBenchmarkPriceRange('drywall-accessories-kit');

  const sheetsCost = calculateCostRange(
    sheets4x8,
    sheetPricing.low,
    sheetPricing.typical,
    sheetPricing.high
  );

  const mudCost = calculateCostRange(
    compoundBuckets,
    mudPricing.low,
    mudPricing.typical,
    mudPricing.high
  );

  const accessoriesAllowance = calculateCostRange(
    1,
    accessPricing.low,
    accessPricing.typical,
    accessPricing.high
  );

  const totalMaterials = {
    low: sheetsCost.low + mudCost.low + accessoriesAllowance.low,
    typical: sheetsCost.typical + mudCost.typical + accessoriesAllowance.typical,
    high: sheetsCost.high + mudCost.high + accessoriesAllowance.high,
  };

  const laborBench = sheetBench?.contractorLabor;
  const laborLow = laborBench ? Math.round(netDrywallArea * laborBench.laborLow) : 0;
  const laborTyp = laborBench ? Math.round(netDrywallArea * laborBench.laborTypical) : 0;
  const laborHigh = laborBench ? Math.round(netDrywallArea * laborBench.laborHigh) : 0;

  return {
    success: true,
    calculatorId: 'drywall-calculator',
    timestamp: new Date().toISOString(),
    inputs: { ...inputs, roomLength: length, roomWidth: width, ceilingHeight: height },
    outputs: {
      wallAreaSqFt: roundToPrecision(grossWallArea, 1),
      ceilingAreaSqFt: roundToPrecision(ceilingArea, 1),
      totalGrossAreaSqFt: roundToPrecision(totalGrossArea, 1),
      openingsDeductionSqFt: roundToPrecision(deductions, 1),
      netDrywallAreaSqFt: roundToPrecision(netDrywallArea, 1),
      wastePercentage: wastePercent,
      recommendedDrywallAreaSqFt: roundToPrecision(recommendedArea, 1),
      sheets4x8ToPurchase: sheets4x8,
      sheets4x12ToPurchase: sheets4x12,
      jointCompound45GalBuckets: compoundBuckets,
      drywallTape500ftRolls: tapeRolls,
      drywallScrewsLbs: screwsLbs,
    },
    billOfMaterials: [
      {
        id: 'drywall-sheets-4x8',
        name: '4\' x 8\' Drywall Sheets',
        description: 'Standard 1/2" residential gypsum wallboard (32 sq ft per sheet)',
        exactQuantity: roundToPrecision(recommendedArea / 32, 1),
        recommendedQuantity: roundToPrecision(recommendedArea, 1),
        purchaseQuantity: sheets4x8,
        packageUnit: 'sheets',
        unitSizeDescription: '4x8 ft (32 sq ft/sheet)',
        wasteAppliedPercentage: wastePercent,
        benchmarkPriceId: 'drywall-sheet-4x8',
        estimatedCost: sheetsCost,
      },
      {
        id: 'drywall-joint-compound',
        name: 'Joint Compound (4.5 Gal Bucket)',
        description: 'Premixed all-purpose mud for embedding tape and 3 finish coats',
        exactQuantity: roundToPrecision(recommendedArea / 400, 2),
        recommendedQuantity: roundToPrecision(recommendedArea, 1),
        purchaseQuantity: compoundBuckets,
        packageUnit: '4.5-gal buckets',
        unitSizeDescription: 'Covers ~400 sq ft',
        wasteAppliedPercentage: wastePercent,
        benchmarkPriceId: 'drywall-joint-compound-bucket',
        estimatedCost: mudCost,
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
      benchmarkSources: [sheetBench?.sourceNote ?? 'National home improvement centers'],
      disclaimer: 'Drywall hanging and taping quotes vary based on ceiling height and Level 4 vs Level 5 finish standards.',
    },
    assumptions: [
      {
        id: 'estimating-model-disclaimer',
        title: 'Area-Based Estimating Model',
        detail: 'This tool uses an area-based estimating model with a 10% waste buffer. It is not an optimized panel cut sheet or CAD layout.',
        category: 'geometry',
      },
      {
        id: 'sheet-size-comparison',
        title: '4x8 vs 4x12 Sheet Selection',
        detail: `You need ${sheets4x8} sheets of 4x8 OR ${sheets4x12} sheets of 4x12. 4x12 sheets reduce vertical butt joints by ~33% but require two people to carry.`,
        category: 'packaging',
      },
    ],
    notices: [
      'Hang ceiling drywall first before hanging wall panels so the wall sheets support ceiling edges.',
    ],
  };
}

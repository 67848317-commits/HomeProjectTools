/**
 * Baseboard & Trim Molding Calculation Engine
 */

import { getPriceBenchmark } from '../../data/prices.ts';
import type { CalculationResult } from '../../types/index.ts';
import {
  applyWaste,
  calculateCostRange,
  ceilToPackage,
  roundToPrecision,
  sanitizeNumber,
} from '../core/math-utils.ts';

export interface BaseboardTrimInputs {
  roomLength: number; // feet
  roomWidth: number; // feet
  doorOpenings?: number; // count (deducts 2.5 ft per standard opening)
  stickLengthFeet?: 8 | 12 | 16 | number; // 8, 12, or 16 ft stock pieces
  wastePercentage?: number; // miter cut waste (default 15%)
}

export interface BaseboardTrimOutputs {
  grossPerimeterFeet: number;
  doorwayDeductionFeet: number;
  netLinearFeet: number;
  wastePercentage: number;
  recommendedPurchaseLinearFeet: number;
  stickLengthFeet: number;
  sticksToPurchase: number;
  purchasedLinearFeet: number;
}

export function calculateBaseboardTrim(inputs: BaseboardTrimInputs): CalculationResult<BaseboardTrimOutputs> {
  const length = sanitizeNumber(inputs.roomLength, 0);
  const width = sanitizeNumber(inputs.roomWidth, 0);
  const doors = Math.max(0, sanitizeNumber(inputs.doorOpenings, 0));
  const stickLength = inputs.stickLengthFeet === 8 || inputs.stickLengthFeet === 16 ? inputs.stickLengthFeet : 12;
  const wastePercent = Math.max(0, sanitizeNumber(inputs.wastePercentage, 15));

  if (length <= 0 || width <= 0) {
    return {
      success: false,
      calculatorId: 'baseboard-trim-calculator',
      errors: [
        {
          field: length <= 0 ? 'roomLength' : 'roomWidth',
          message: 'Room dimensions must be positive numbers greater than zero.',
          code: 'INVALID_NUMBER',
        },
      ],
    };
  }

  // 1. Gross Perimeter
  const grossPerimeter = 2 * (length + width);

  // 2. Doorway Deductions (approx 2.5 linear feet per door)
  const deductions = doors * 2.5;
  const netLinearFeet = Math.max(1, grossPerimeter - deductions);

  // 3. Recommended Linear Feet (15% miter allowance for outside corners & scarf joints)
  const recommendedLinearFeet = applyWaste(netLinearFeet, wastePercent);

  // 4. Commercial Stock Pieces
  const exactSticks = recommendedLinearFeet / stickLength;
  const sticksToPurchase = ceilToPackage(exactSticks);
  const purchasedLinearFeet = sticksToPurchase * stickLength;

  // 5. Pricing Benchmarks
  const trimBench = getPriceBenchmark('baseboard-mdf-primed');
  const materialCost = calculateCostRange(
    purchasedLinearFeet,
    trimBench?.priceLow ?? 0.95,
    trimBench?.priceTypical ?? 1.65,
    trimBench?.priceHigh ?? 2.75
  );

  const laborBench = trimBench?.contractorLabor;
  const laborLow = laborBench ? Math.round(netLinearFeet * laborBench.laborLow) : 0;
  const laborTyp = laborBench ? Math.round(netLinearFeet * laborBench.laborTypical) : 0;
  const laborHigh = laborBench ? Math.round(netLinearFeet * laborBench.laborHigh) : 0;

  return {
    success: true,
    calculatorId: 'baseboard-trim-calculator',
    timestamp: new Date().toISOString(),
    inputs: { ...inputs, roomLength: length, roomWidth: width, stickLengthFeet: stickLength },
    outputs: {
      grossPerimeterFeet: roundToPrecision(grossPerimeter, 1),
      doorwayDeductionFeet: roundToPrecision(deductions, 1),
      netLinearFeet: roundToPrecision(netLinearFeet, 1),
      wastePercentage: wastePercent,
      recommendedPurchaseLinearFeet: roundToPrecision(recommendedLinearFeet, 1),
      stickLengthFeet: stickLength,
      sticksToPurchase,
      purchasedLinearFeet,
    },
    billOfMaterials: [
      {
        id: 'baseboard-sticks',
        name: `Primed Baseboard Trim (${stickLength}-Foot Sticks)`,
        description: `Full commercial molding sticks at ${stickLength} linear feet each`,
        exactQuantity: roundToPrecision(exactSticks, 1),
        recommendedQuantity: roundToPrecision(recommendedLinearFeet, 1),
        purchaseQuantity: sticksToPurchase,
        packageUnit: 'pieces',
        unitSizeDescription: `${stickLength} ft stick`,
        wasteAppliedPercentage: wastePercent,
        benchmarkPriceId: 'baseboard-mdf-primed',
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
      benchmarkSources: [trimBench?.sourceNote ?? 'Standard primed composite fiberboard molding'],
      disclaimer: 'Excludes finish enamel paint, painter’s caulk, and 16-gauge finishing nails.',
    },
    assumptions: [
      {
        id: 'miter-waste-allowance',
        title: 'Higher Waste for Miter Cuts',
        detail: `Trim molding requires a higher waste factor (${wastePercent}%) than flooring because 45-degree corner miters and 45-degree scarf joints consume off-cut lengths that cannot be reused on short wall sections.`,
        category: 'waste',
      },
      {
        id: 'stick-length-selection',
        title: 'Stick Length Selection',
        detail: `Using ${stickLength}-foot sticks. 12-ft sticks reduce intermediate wall seams compared to 8-ft pieces while remaining easier to transport inside vehicles than 16-ft pieces.`,
        category: 'packaging',
      },
    ],
    notices: [
      'Paint baseboards with semi-gloss trim enamel BEFORE nailing them to the wall; only nail hole filling and caulk lines need touch-up painting after installation.',
    ],
  };
}

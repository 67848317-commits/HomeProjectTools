/**
 * Interior Paint Coverage Calculation Engine
 */

import { getPriceBenchmark } from '../../data/prices.ts';
import type { CalculationResult } from '../../types/index.ts';
import {
  calculateCostRange,
  ceilToPackage,
  roundToPrecision,
  sanitizeNumber,
} from '../core/math-utils.ts';

export interface PaintInputs {
  roomLength: number; // feet
  roomWidth: number; // feet
  wallHeight: number; // feet
  doorCount?: number;
  windowCount?: number;
  coatCount?: number; // 1, 2, or 3
  coveragePerGallon?: number; // sq ft per gallon (default 350)
  includeCeiling?: boolean;
}

export interface PaintOutputs {
  grossWallAreaSqFt: number;
  doorWindowDeductionsSqFt: number;
  netWallAreaSqFt: number;
  ceilingAreaSqFt: number;
  totalSurfaceAreaSqFt: number;
  coatCount: number;
  effectiveTotalAreaSqFt: number;
  coveragePerGallon: number;
  wallGallonsExact: number;
  wallGallonsToPurchase: number;
  ceilingGallonsToPurchase: number;
  totalGallonsToPurchase: number;
}

export function calculatePaint(inputs: PaintInputs): CalculationResult<PaintOutputs> {
  const length = sanitizeNumber(inputs.roomLength, 0);
  const width = sanitizeNumber(inputs.roomWidth, 0);
  const height = sanitizeNumber(inputs.wallHeight, 0);
  const doors = Math.max(0, sanitizeNumber(inputs.doorCount, 0));
  const windows = Math.max(0, sanitizeNumber(inputs.windowCount, 0));
  const coats = Math.max(1, sanitizeNumber(inputs.coatCount, 2));
  const coverage = Math.max(100, sanitizeNumber(inputs.coveragePerGallon, 350));
  const includeCeiling = Boolean(inputs.includeCeiling);

  if (length <= 0 || width <= 0 || height <= 0) {
    return {
      success: false,
      calculatorId: 'paint-calculator',
      errors: [
        {
          field: length <= 0 ? 'roomLength' : width <= 0 ? 'roomWidth' : 'wallHeight',
          message: 'Room dimensions and ceiling height must be positive numbers greater than zero.',
          code: 'INVALID_NUMBER',
        },
      ],
    };
  }

  // 1. Gross Wall Area
  const perimeter = 2 * (length + width);
  const grossWallArea = perimeter * height;

  // 2. Door & Window Deductions (Standard residential 21 sq ft / door, 15 sq ft / window)
  const rawDeductions = doors * 21 + windows * 15;
  // Sane bounds: Deductions cannot eliminate more than 60% of total wall area
  const doorWindowDeductions = Math.min(rawDeductions, grossWallArea * 0.6);
  const netWallArea = Math.max(0, grossWallArea - doorWindowDeductions);

  // 3. Ceiling Area
  const ceilingArea = includeCeiling ? length * width : 0;
  const totalSurfaceArea = netWallArea + ceilingArea;

  // 4. Gallon Calculations
  const wallCoatedSqFt = netWallArea * coats;
  const wallGallonsExact = wallCoatedSqFt / coverage;
  const wallGallonsPurchase = ceilToPackage(wallGallonsExact);

  // Ceiling paint typically requires 1 or 2 coats (assumes 1 coat refresh if ceiling paint)
  const ceilingGallonsExact = ceilingArea > 0 ? (ceilingArea * 1) / coverage : 0;
  const ceilingGallonsPurchase = ceilingArea > 0 ? ceilToPackage(ceilingGallonsExact) : 0;

  const totalGallonsToPurchase = wallGallonsPurchase + ceilingGallonsPurchase;
  const effectiveTotalArea = wallCoatedSqFt + (ceilingArea * 1);

  // 5. Pricing Benchmarks
  const paintBench = getPriceBenchmark('paint-interior-gallon');
  const paintCost = calculateCostRange(
    totalGallonsToPurchase,
    paintBench?.priceLow ?? 26,
    paintBench?.priceTypical ?? 48,
    paintBench?.priceHigh ?? 78
  );

  const laborBench = paintBench?.contractorLabor;
  const laborLow = laborBench ? Math.round(netWallArea * laborBench.laborLow) : 0;
  const laborTyp = laborBench ? Math.round(netWallArea * laborBench.laborTypical) : 0;
  const laborHigh = laborBench ? Math.round(netWallArea * laborBench.laborHigh) : 0;

  return {
    success: true,
    calculatorId: 'paint-calculator',
    timestamp: new Date().toISOString(),
    inputs: { ...inputs, roomLength: length, roomWidth: width, wallHeight: height, coveragePerGallon: coverage },
    outputs: {
      grossWallAreaSqFt: roundToPrecision(grossWallArea, 1),
      doorWindowDeductionsSqFt: roundToPrecision(doorWindowDeductions, 1),
      netWallAreaSqFt: roundToPrecision(netWallArea, 1),
      ceilingAreaSqFt: roundToPrecision(ceilingArea, 1),
      totalSurfaceAreaSqFt: roundToPrecision(totalSurfaceArea, 1),
      coatCount: coats,
      effectiveTotalAreaSqFt: roundToPrecision(effectiveTotalArea, 1),
      coveragePerGallon: coverage,
      wallGallonsExact: roundToPrecision(wallGallonsExact, 2),
      wallGallonsToPurchase: wallGallonsPurchase,
      ceilingGallonsToPurchase: ceilingGallonsPurchase,
      totalGallonsToPurchase,
    },
    billOfMaterials: [
      {
        id: 'wall-paint-gallons',
        name: 'Interior Wall Paint',
        description: `Full 1-gallon cans for ${coats} coats of wall coverage`,
        exactQuantity: roundToPrecision(wallGallonsExact, 2),
        recommendedQuantity: roundToPrecision(wallGallonsExact, 2),
        purchaseQuantity: wallGallonsPurchase,
        packageUnit: 'gallons',
        unitSizeDescription: `Covers ${coverage} sq ft/gal per coat`,
        wasteAppliedPercentage: 0,
        benchmarkPriceId: 'paint-interior-gallon',
        estimatedCost: calculateCostRange(
          wallGallonsPurchase,
          paintBench?.priceLow ?? 26,
          paintBench?.priceTypical ?? 48,
          paintBench?.priceHigh ?? 78
        ),
      },
      ...(ceilingGallonsPurchase > 0
        ? [
            {
              id: 'ceiling-paint-gallons',
              name: 'Ceiling Paint (Flat White)',
              description: 'Full 1-gallon cans for ceiling surface',
              exactQuantity: roundToPrecision(ceilingGallonsExact, 2),
              recommendedQuantity: roundToPrecision(ceilingGallonsExact, 2),
              purchaseQuantity: ceilingGallonsPurchase,
              packageUnit: 'gallons',
              unitSizeDescription: `Covers ${coverage} sq ft/gal`,
              wasteAppliedPercentage: 0,
              benchmarkPriceId: 'paint-interior-gallon',
              estimatedCost: calculateCostRange(
                ceilingGallonsPurchase,
                paintBench?.priceLow ?? 26,
                paintBench?.priceTypical ?? 48,
                paintBench?.priceHigh ?? 78
              ),
            },
          ]
        : []),
    ],
    costEstimate: {
      hasPricing: true,
      currency: 'USD',
      materialsOnly: paintCost,
      contractorInstalledTotal: laborBench
        ? {
            low: paintCost.low + laborLow,
            typical: paintCost.typical + laborTyp,
            high: paintCost.high + laborHigh,
            laborOnlyLow: laborLow,
            laborOnlyTypical: laborTyp,
            laborOnlyHigh: laborHigh,
            scopeNote: laborBench.laborScopeNote,
          }
        : undefined,
      benchmarkSources: [paintBench?.sourceNote ?? 'National home improvement centers'],
      disclaimer: 'Paint estimates exclude primer, tape, brushes, rollers, trays, and drop cloths.',
    },
    assumptions: [
      {
        id: 'paint-coverage-standard',
        title: 'Paint Coverage Rate',
        detail: `Calculation uses ${coverage} sq ft per gallon as a planning benchmark. Porous unprimed drywall or rough masonry may absorb 20-30% more paint on the first coat.`,
        category: 'coverage',
      },
      {
        id: 'opening-deductions',
        title: 'Door and Window Opening Planning Deductions',
        detail: `Planning benchmark deductions: 21 sq ft per door (${doors} doors) and 15 sq ft per window (${windows} windows) deducted from gross wall perimeter. Actual door and window dimensions vary.`,
        category: 'geometry',
      },
    ],
    notices: [
      'If shifting from a dark color (e.g. navy or red) to a light color (white or beige), an initial coat of dedicated PVA primer is strongly recommended.',
    ],
  };
}

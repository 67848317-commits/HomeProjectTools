/**
 * Flooring Material & Carton Calculation Engine
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

export interface FlooringInputs {
  roomLength: number; // feet
  roomWidth: number; // feet
  flooringType?: 'lvp' | 'engineered-hardwood' | 'laminate';
  cartonCoverage?: number; // sq ft per carton (default 20)
  wastePercentage?: number; // e.g. 10 for 10%
  includeUnderlayment?: boolean;
}

export interface FlooringOutputs {
  netAreaSqFt: number;
  wastePercentage: number;
  wasteAreaSqFt: number;
  recommendedPurchaseSqFt: number;
  cartonCoverage: number;
  cartonsToPurchase: number;
  purchasedSqFt: number;
  excessSqFtOverRecommended: number;
  underlaymentRolls: number;
}

export function calculateFlooring(inputs: FlooringInputs): CalculationResult<FlooringOutputs> {
  const length = sanitizeNumber(inputs.roomLength, 0);
  const width = sanitizeNumber(inputs.roomWidth, 0);
  const wastePercent = Math.max(0, sanitizeNumber(inputs.wastePercentage, 10));
  const cartonCoverage = Math.max(1, sanitizeNumber(inputs.cartonCoverage, 20));
  const flooringType = inputs.flooringType || 'lvp';
  const includeUnderlayment = Boolean(inputs.includeUnderlayment);

  if (length <= 0 || width <= 0) {
    return {
      success: false,
      calculatorId: 'flooring-calculator',
      errors: [
        {
          field: length <= 0 ? 'roomLength' : 'roomWidth',
          message: 'Room dimensions must be positive numbers greater than zero.',
          code: 'INVALID_NUMBER',
        },
      ],
    };
  }

  // 1. Mathematical Net Area
  const netArea = calculateRectangularArea(length, width);

  // 2. Planning Area with Waste applied exactly once
  const recommendedArea = applyWaste(netArea, wastePercent);
  const wasteArea = recommendedArea - netArea;

  // 3. Purchase Packaging Rounding
  const exactCartons = recommendedArea / cartonCoverage;
  const cartonsToPurchase = ceilToPackage(exactCartons);
  const purchasedSqFt = cartonsToPurchase * cartonCoverage;
  const excessSqFt = purchasedSqFt - recommendedArea;

  // 4. Underlayment (100 sq ft rolls)
  const underlaymentRolls = includeUnderlayment ? ceilToPackage(recommendedArea / 100) : 0;

  // 5. Cost Modeling from Benchmarks
  const benchmarkId = flooringType === 'engineered-hardwood' ? 'flooring-engineered-hardwood' : 'flooring-lvp';
  const priceBenchmark = getPriceBenchmark(benchmarkId);

  const lowPrice = priceBenchmark?.priceLow ?? 2.0;
  const typPrice = priceBenchmark?.priceTypical ?? 3.5;
  const highPrice = priceBenchmark?.priceHigh ?? 6.0;

  const materialCost = calculateCostRange(purchasedSqFt, lowPrice, typPrice, highPrice);

  let underlaymentCost = { low: 0, typical: 0, high: 0 };
  if (includeUnderlayment && underlaymentRolls > 0) {
    const rollBench = getPriceBenchmark('flooring-underlayment-roll');
    underlaymentCost = calculateCostRange(
      underlaymentRolls,
      rollBench?.priceLow ?? 25,
      rollBench?.priceTypical ?? 45,
      rollBench?.priceHigh ?? 75
    );
  }

  const totalMaterialsCost = {
    low: materialCost.low + underlaymentCost.low,
    typical: materialCost.typical + underlaymentCost.typical,
    high: materialCost.high + underlaymentCost.high,
  };

  // Separated Contractor Labor
  const laborBenchmark = priceBenchmark?.contractorLabor;
  const laborLow = laborBenchmark ? Math.round(netArea * laborBenchmark.laborLow) : 0;
  const laborTyp = laborBenchmark ? Math.round(netArea * laborBenchmark.laborTypical) : 0;
  const laborHigh = laborBenchmark ? Math.round(netArea * laborBenchmark.laborHigh) : 0;

  return {
    success: true,
    calculatorId: 'flooring-calculator',
    timestamp: new Date().toISOString(),
    inputs: { ...inputs, roomLength: length, roomWidth: width, cartonCoverage, wastePercentage: wastePercent },
    outputs: {
      netAreaSqFt: roundToPrecision(netArea, 2),
      wastePercentage: wastePercent,
      wasteAreaSqFt: roundToPrecision(wasteArea, 2),
      recommendedPurchaseSqFt: roundToPrecision(recommendedArea, 2),
      cartonCoverage,
      cartonsToPurchase,
      purchasedSqFt: roundToPrecision(purchasedSqFt, 2),
      excessSqFtOverRecommended: roundToPrecision(excessSqFt, 2),
      underlaymentRolls,
    },
    billOfMaterials: [
      {
        id: 'flooring-cartons',
        name: `${priceBenchmark?.materialName ?? 'Flooring'} Cartons`,
        description: `Full commercial cartons at ${cartonCoverage} sq ft per carton`,
        exactQuantity: roundToPrecision(exactCartons, 2),
        recommendedQuantity: roundToPrecision(recommendedArea, 2),
        purchaseQuantity: cartonsToPurchase,
        packageUnit: 'cartons',
        unitSizeDescription: `${cartonCoverage} sq ft/carton`,
        wasteAppliedPercentage: wastePercent,
        benchmarkPriceId: benchmarkId,
        estimatedCost: materialCost,
      },
      ...(includeUnderlayment
        ? [
            {
              id: 'underlayment-rolls',
              name: 'Underlayment Rolls',
              description: 'Standard 100 sq ft rolls with moisture barrier tape',
              exactQuantity: roundToPrecision(recommendedArea / 100, 2),
              recommendedQuantity: roundToPrecision(recommendedArea, 2),
              purchaseQuantity: underlaymentRolls,
              packageUnit: 'rolls',
              unitSizeDescription: '100 sq ft/roll',
              wasteAppliedPercentage: wastePercent,
              benchmarkPriceId: 'flooring-underlayment-roll',
              estimatedCost: underlaymentCost,
            },
          ]
        : []),
    ],
    costEstimate: {
      hasPricing: true,
      currency: 'USD',
      materialsOnly: totalMaterialsCost,
      contractorInstalledTotal: laborBenchmark
        ? {
            low: totalMaterialsCost.low + laborLow,
            typical: totalMaterialsCost.typical + laborTyp,
            high: totalMaterialsCost.high + laborHigh,
            laborOnlyLow: laborLow,
            laborOnlyTypical: laborTyp,
            laborOnlyHigh: laborHigh,
            scopeNote: laborBenchmark.laborScopeNote,
          }
        : undefined,
      benchmarkSources: [priceBenchmark?.sourceNote ?? 'National home improvement centers'],
      disclaimer: priceBenchmark?.disclaimer ?? 'Excludes transitions, quarter round, and subfloor prep.',
    },
    assumptions: [
      {
        id: 'carton-rounding',
        title: 'Commercial Carton Rounding',
        detail: `Manufacturers and retailers only sell full cartons. Your ${roundToPrecision(recommendedArea, 1)} sq ft requirement rounds up to ${cartonsToPurchase} cartons (${purchasedSqFt} sq ft total).`,
        category: 'packaging',
      },
      {
        id: 'waste-allowance',
        title: 'Cut & Stagger Waste Allowance',
        detail: `A ${wastePercent}% waste factor is applied to account for end-of-row cutoffs, plank staggering, and room perimeter trimming.`,
        category: 'waste',
      },
    ],
    notices: [
      'Keep 1 extra unopened carton stored in a dry closet for future plank replacements if water damage or gouging occurs.',
    ],
  };
}

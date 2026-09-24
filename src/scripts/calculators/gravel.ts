/**
 * Gravel & Crushed Stone Calculation Engine
 */

import { getPriceBenchmark } from '../../data/prices.ts';
import type { CalculationResult } from '../../types/index.ts';
import {
  applyWaste,
  calculateCostRange,
  calculateVolumeCubicFeet,
  ceilToPackage,
  cubicFeetToCubicYards,
  cubicYardsToTons,
  roundToPrecision,
  sanitizeNumber,
} from '../core/math-utils.ts';

export interface GravelInputs {
  gravelLength: number; // feet
  gravelWidth: number; // feet
  gravelDepthInches: number; // inches
  stoneType?: 'crushed-stone' | 'pea-gravel' | 'dense-grade' | 'decomposed-granite';
  wastePercentage?: number; // compaction / settling buffer (default 10%)
}

export interface GravelOutputs {
  areaSqFt: number;
  gravelDepthInches: number;
  geometricVolumeCuFt: number;
  geometricVolumeCuYds: number;
  wastePercentage: number;
  recommendedVolumeCuYds: number;
  stoneDensityTonsPerYard: number;
  estimatedTons: number;
  bags50lbToPurchase: number;
}

const STONE_DENSITIES: Record<string, { name: string; density: number }> = {
  'crushed-stone': { name: 'Crushed Stone / #57 Gravel', density: 1.40 },
  'pea-gravel': { name: 'Pea Gravel / River Rock', density: 1.45 },
  'dense-grade': { name: 'Dense Grade / Crusher Run (Road Base)', density: 1.55 },
  'decomposed-granite': { name: 'Decomposed Granite / Screenings', density: 1.40 },
};

export function calculateGravel(inputs: GravelInputs): CalculationResult<GravelOutputs> {
  const length = sanitizeNumber(inputs.gravelLength, 0);
  const width = sanitizeNumber(inputs.gravelWidth, 0);
  const depthInches = sanitizeNumber(inputs.gravelDepthInches, 0);
  const wastePercent = Math.max(0, sanitizeNumber(inputs.wastePercentage, 10));
  const stoneKey = inputs.stoneType && inputs.stoneType in STONE_DENSITIES ? inputs.stoneType : 'crushed-stone';
  const stoneConfig = STONE_DENSITIES[stoneKey];

  if (length <= 0 || width <= 0 || depthInches <= 0) {
    return {
      success: false,
      calculatorId: 'gravel-calculator',
      errors: [
        {
          field: length <= 0 ? 'gravelLength' : width <= 0 ? 'gravelWidth' : 'gravelDepthInches',
          message: 'Area dimensions and gravel depth must be positive numbers greater than zero.',
          code: 'INVALID_NUMBER',
        },
      ],
    };
  }

  // 1. Volume Calculation
  const areaSqFt = length * width;
  const geometricCuFt = calculateVolumeCubicFeet(length, width, depthInches);
  const geometricCuYds = cubicFeetToCubicYards(geometricCuFt);

  // 2. Compaction & Subgrade Buffer
  const recommendedCuYds = applyWaste(geometricCuYds, wastePercent);

  // 3. Tonnage Calculation by Density
  const estimatedTons = cubicYardsToTons(recommendedCuYds, stoneConfig.density);

  // 4. Retail 50-lb Bag Equivalent (1 US ton = 2,000 lbs = 40 bags of 50 lb)
  const totalWeightLbs = estimatedTons * 2000;
  const bags50lb = ceilToPackage(totalWeightLbs / 50);

  // 5. Pricing
  const gravelBench = getPriceBenchmark('gravel-crushed-stone-ton');
  const materialCost = calculateCostRange(
    estimatedTons,
    gravelBench?.priceLow ?? 35,
    gravelBench?.priceTypical ?? 52,
    gravelBench?.priceHigh ?? 75
  );

  return {
    success: true,
    calculatorId: 'gravel-calculator',
    timestamp: new Date().toISOString(),
    inputs: { ...inputs, gravelLength: length, gravelWidth: width, gravelDepthInches: depthInches },
    outputs: {
      areaSqFt: roundToPrecision(areaSqFt, 1),
      gravelDepthInches: depthInches,
      geometricVolumeCuFt: roundToPrecision(geometricCuFt, 2),
      geometricVolumeCuYds: roundToPrecision(geometricCuYds, 2),
      wastePercentage: wastePercent,
      recommendedVolumeCuYds: roundToPrecision(recommendedCuYds, 2),
      stoneDensityTonsPerYard: stoneConfig.density,
      estimatedTons: roundToPrecision(estimatedTons, 2),
      bags50lbToPurchase: bags50lb,
    },
    billOfMaterials: [
      {
        id: 'gravel-bulk-tons',
        name: `${stoneConfig.name} (Bulk Tonnage)`,
        description: `Delivered bulk tonnage at ${stoneConfig.density} tons per cubic yard`,
        exactQuantity: roundToPrecision(estimatedTons, 2),
        recommendedQuantity: roundToPrecision(estimatedTons, 2),
        purchaseQuantity: Math.ceil(estimatedTons),
        packageUnit: 'US tons',
        unitSizeDescription: '2,000 lbs/ton',
        wasteAppliedPercentage: wastePercent,
        benchmarkPriceId: 'gravel-crushed-stone-ton',
        estimatedCost: materialCost,
      },
    ],
    costEstimate: {
      hasPricing: true,
      currency: 'USD',
      materialsOnly: materialCost,
      benchmarkSources: [gravelBench?.sourceNote ?? 'Aggregated quarry and landscape supply benchmark'],
      disclaimer: 'Quarries weigh trucks on certified scales. Moisture content and stone size variation affect actual billed weight.',
    },
    assumptions: [
      {
        id: 'density-standard',
        title: 'Stone Density Assumption',
        detail: `Used ${stoneConfig.density} tons per cubic yard for ${stoneConfig.name}. Dense-graded road base with stone dust compacts tighter than washed pea gravel.`,
        category: 'coverage',
      },
      {
        id: 'compaction-allowance',
        title: 'Mechanical Compaction Allowance',
        detail: `Added ${wastePercent}% to volume to account for subgrade soil pressing and mechanical plate tamping.`,
        category: 'waste',
      },
    ],
    notices: [
      estimatedTons > 1.5
        ? 'For driveways and large patios, order by the dump truck load from an aggregate quarry to avoid paying 3x retail bag prices.'
        : 'For small garden paths or fire pit pads under 1 ton, 50-lb bags from a home center are practical to transport.',
    ],
  };
}

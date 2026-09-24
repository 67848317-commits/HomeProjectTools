/**
 * Tile & Grout Calculation Engine
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

export interface TileInputs {
  areaLength: number; // feet
  areaWidth: number; // feet
  tileLengthInches: number; // inches
  tileWidthInches: number; // inches
  boxCoverageSqFt?: number; // sq ft per box (default 15)
  groutJointWidthInches?: number; // e.g. 0.125 for 1/8"
  wastePercentage?: number; // e.g. 10 for standard, 18 for herringbone
}

export interface TileOutputs {
  netAreaSqFt: number;
  wastePercentage: number;
  recommendedAreaSqFt: number;
  tileAreaSqFt: number;
  exactTilesNeeded: number;
  recommendedTilesWithWaste: number;
  boxCoverageSqFt: number;
  boxesToPurchase: number;
  purchasedSqFt: number;
  thinsetMortar50lbBags: number;
  grout25lbBags: number;
}

export function calculateTile(inputs: TileInputs): CalculationResult<TileOutputs> {
  const length = sanitizeNumber(inputs.areaLength, 0);
  const width = sanitizeNumber(inputs.areaWidth, 0);
  const tileLIn = sanitizeNumber(inputs.tileLengthInches, 0);
  const tileWIn = sanitizeNumber(inputs.tileWidthInches, 0);
  const boxCoverage = Math.max(1, sanitizeNumber(inputs.boxCoverageSqFt, 15));
  const wastePercent = Math.max(0, sanitizeNumber(inputs.wastePercentage, 10));

  if (length <= 0 || width <= 0) {
    return {
      success: false,
      calculatorId: 'tile-calculator',
      errors: [
        {
          field: length <= 0 ? 'areaLength' : 'areaWidth',
          message: 'Tiled area dimensions must be positive numbers greater than zero.',
          code: 'INVALID_NUMBER',
        },
      ],
    };
  }

  if (tileLIn <= 0 || tileWIn <= 0) {
    return {
      success: false,
      calculatorId: 'tile-calculator',
      errors: [
        {
          field: tileLIn <= 0 ? 'tileLengthInches' : 'tileWidthInches',
          message: 'Tile dimensions must be positive inches greater than zero.',
          code: 'INVALID_NUMBER',
        },
      ],
    };
  }

  // 1. Net Area & Recommended Area with Waste
  const netArea = calculateRectangularArea(length, width);
  const recommendedArea = applyWaste(netArea, wastePercent);

  // 2. Tile Count Calculation
  const singleTileSqFt = (tileLIn * tileWIn) / 144;
  const exactTiles = netArea / singleTileSqFt;
  const recommendedTiles = ceilToPackage(recommendedArea / singleTileSqFt);

  // 3. Commercial Box Packaging
  const exactBoxes = recommendedArea / boxCoverage;
  const boxesToPurchase = ceilToPackage(exactBoxes);
  const purchasedSqFt = boxesToPurchase * boxCoverage;

  // 4. Mortar & Grout Estimating Assumptions
  // Standard modified thinset covers ~45-50 sq ft per 50-lb bag with 1/4" x 3/8" notched trowel
  const mortarBags = ceilToPackage(recommendedArea / 50);

  // Dry cement grout: approx 150-180 sq ft per 25-lb bag for 12x12 tile with 1/8" joint; more for small subway tiles
  const groutSqFtPerBag = tileLIn <= 4 || tileWIn <= 4 ? 80 : 150;
  const groutBags = ceilToPackage(recommendedArea / groutSqFtPerBag);

  // 5. Cost Benchmarks
  const tileBench = getPriceBenchmark('tile-ceramic-porcelain');
  const mortarBench = getPriceBenchmark('tile-thinset-mortar-50lb');
  const groutBench = getPriceBenchmark('tile-grout-bag');

  const tileCost = calculateCostRange(
    purchasedSqFt,
    tileBench?.priceLow ?? 1.5,
    tileBench?.priceTypical ?? 3.9,
    tileBench?.priceHigh ?? 8.5
  );

  const mortarCost = calculateCostRange(
    mortarBags,
    mortarBench?.priceLow ?? 16,
    mortarBench?.priceTypical ?? 24,
    mortarBench?.priceHigh ?? 38
  );

  const groutCost = calculateCostRange(
    groutBags,
    groutBench?.priceLow ?? 14,
    groutBench?.priceTypical ?? 22,
    groutBench?.priceHigh ?? 34
  );

  const totalMaterials = {
    low: tileCost.low + mortarCost.low + groutCost.low,
    typical: tileCost.typical + mortarCost.typical + groutCost.typical,
    high: tileCost.high + mortarCost.high + groutCost.high,
  };

  const laborBench = tileBench?.contractorLabor;
  const laborLow = laborBench ? Math.round(netArea * laborBench.laborLow) : 0;
  const laborTyp = laborBench ? Math.round(netArea * laborBench.laborTypical) : 0;
  const laborHigh = laborBench ? Math.round(netArea * laborBench.laborHigh) : 0;

  return {
    success: true,
    calculatorId: 'tile-calculator',
    timestamp: new Date().toISOString(),
    inputs: { ...inputs, areaLength: length, areaWidth: width, tileLengthInches: tileLIn, tileWidthInches: tileWIn },
    outputs: {
      netAreaSqFt: roundToPrecision(netArea, 2),
      wastePercentage: wastePercent,
      recommendedAreaSqFt: roundToPrecision(recommendedArea, 2),
      tileAreaSqFt: roundToPrecision(singleTileSqFt, 4),
      exactTilesNeeded: roundToPrecision(exactTiles, 1),
      recommendedTilesWithWaste: recommendedTiles,
      boxCoverageSqFt: boxCoverage,
      boxesToPurchase,
      purchasedSqFt: roundToPrecision(purchasedSqFt, 2),
      thinsetMortar50lbBags: mortarBags,
      grout25lbBags: groutBags,
    },
    billOfMaterials: [
      {
        id: 'tile-boxes',
        name: 'Tile Boxes',
        description: `Full commercial tile boxes at ${boxCoverage} sq ft/box`,
        exactQuantity: roundToPrecision(exactBoxes, 2),
        recommendedQuantity: roundToPrecision(recommendedArea, 2),
        purchaseQuantity: boxesToPurchase,
        packageUnit: 'boxes',
        unitSizeDescription: `${boxCoverage} sq ft/box`,
        wasteAppliedPercentage: wastePercent,
        benchmarkPriceId: 'tile-ceramic-porcelain',
        estimatedCost: tileCost,
      },
      {
        id: 'mortar-bags',
        name: 'Thinset Mortar (50 lb)',
        description: 'Polymer-modified dry thinset mortar for tile bonding',
        exactQuantity: roundToPrecision(recommendedArea / 50, 2),
        recommendedQuantity: roundToPrecision(recommendedArea, 2),
        purchaseQuantity: mortarBags,
        packageUnit: '50-lb bags',
        unitSizeDescription: 'Covers ~50 sq ft per bag',
        wasteAppliedPercentage: wastePercent,
        benchmarkPriceId: 'tile-thinset-mortar-50lb',
        estimatedCost: mortarCost,
      },
      {
        id: 'grout-bags',
        name: 'Tile Grout (25 lb)',
        description: 'Cementitious sanded/unsanded joint grout',
        exactQuantity: roundToPrecision(recommendedArea / groutSqFtPerBag, 2),
        recommendedQuantity: roundToPrecision(recommendedArea, 2),
        purchaseQuantity: groutBags,
        packageUnit: '25-lb bags',
        unitSizeDescription: `Covers ~${groutSqFtPerBag} sq ft per bag for this tile size`,
        wasteAppliedPercentage: wastePercent,
        benchmarkPriceId: 'tile-grout-bag',
        estimatedCost: groutCost,
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
      benchmarkSources: [tileBench?.sourceNote ?? 'National home improvement centers'],
      disclaimer: 'Tile prices vary widely by material (ceramic vs marble); subfloor backer board not included.',
    },
    assumptions: [
      {
        id: 'mortar-coverage',
        title: 'Mortar Coverage Assumption',
        detail: 'Assumes standard 1/4" x 3/8" square notch trowel yielding approximately 50 sq ft per 50-lb bag on flat subfloor.',
        category: 'coverage',
      },
      {
        id: 'dye-lot-matching',
        title: 'Dye Lot Matching',
        detail: 'All tile boxes must be ordered together from the same manufacturing run (dye lot) to prevent visible color variation.',
        category: 'packaging',
      },
    ],
    notices: [
      'Order at least 1 extra box of tile beyond exact requirements to keep in storage for future plumbing repairs or cracked tiles.',
    ],
  };
}

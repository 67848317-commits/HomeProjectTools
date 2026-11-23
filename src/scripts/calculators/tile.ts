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

export type TileTrowelNotchSize = 'auto' | '1/4x1/4' | '1/4x3/8' | '1/2x1/2';
export type ResolvedTrowelNotchSize = '1/4x1/4' | '1/4x3/8' | '1/2x1/2';

export interface TileInputs {
  areaLength: number; // feet
  areaWidth: number; // feet
  tileLengthInches: number; // inches
  tileWidthInches: number; // inches
  tileThicknessInches?: number; // inches (default 0.375 = 3/8")
  boxCoverageSqFt?: number; // sq ft per box (default 15)
  groutJointWidthInches?: number; // inches (default 0.125 = 1/8")
  trowelNotchSize?: TileTrowelNotchSize; // default 'auto' based on tile dimensions
  wastePercentage?: number; // e.g. 10 for standard, 18 for herringbone (default 10)
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
  groutJointWidthInches: number;
  tileThicknessInches: number;
  groutJointAreaFraction: number;
  groutVolumeCuIn: number;
  groutNetLbs: number;
  groutRecommendedLbs: number;
  groutEstimatedCoverageSqFtPerBag: number;
  mortarTrowelNotch: ResolvedTrowelNotchSize;
  mortarCoverageSqFtPerBag: number;
  mortarNetBagsExact: number;
  mortarRecommendedBagsExact: number;
}

/**
 * Planning-level engineering assumptions (awaiting specific manufacturer TDS verification):
 * - DRY_GROUT_LBS_PER_CU_IN: ~0.06 lb/in³ (~103.7 lb/ft³) cured joint volume to dry cementitious grout powder.
 * - MIXING_AND_SPREAD_LOSS_PERCENT: 10% field allowance for bucket residue, float losses, and back-buttering.
 */
const DEFAULT_TILE_THICKNESS_IN = 0.375; // 3/8" standard floor/wall porcelain & ceramic
const DEFAULT_GROUT_JOINT_IN = 0.125; // 1/8" standard spacer
const DEFAULT_BOX_COVERAGE_SQ_FT = 15;
const DRY_GROUT_LBS_PER_CU_IN = 0.06; // Planning assumption awaiting manufacturer TDS verification
const GROUT_BAG_WEIGHT_LBS = 25;
const MIXING_AND_SPREAD_LOSS_PERCENT = 10;

const TROWEL_COVERAGE_SQ_FT_PER_50LB_BAG: Record<ResolvedTrowelNotchSize, number> = {
  '1/4x1/4': 65, // Small tiles (< 8") — planning range 60–70 sq ft/bag
  '1/4x3/8': 50, // Standard tiles (8" to < 15") — planning range 45–55 sq ft/bag
  '1/2x1/2': 35, // Large Format Tile (>= 15" side) w/ back-buttering — planning range 30–40 sq ft/bag
};

function resolveTrowelNotchSize(
  requested: TileTrowelNotchSize | undefined,
  tileLIn: number,
  tileWIn: number
): ResolvedTrowelNotchSize {
  if (requested === '1/4x1/4' || requested === '1/4x3/8' || requested === '1/2x1/2') {
    return requested;
  }
  const maxSide = Math.max(tileLIn, tileWIn);
  if (maxSide >= 15) {
    return '1/2x1/2';
  }
  if (maxSide < 8) {
    return '1/4x1/4';
  }
  return '1/4x3/8';
}

export function calculateTile(inputs: TileInputs): CalculationResult<TileOutputs> {
  const length = sanitizeNumber(inputs.areaLength, 0);
  const width = sanitizeNumber(inputs.areaWidth, 0);
  const tileLIn = sanitizeNumber(inputs.tileLengthInches, 0);
  const tileWIn = sanitizeNumber(inputs.tileWidthInches, 0);

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

  const rawBoxCoverage =
    inputs.boxCoverageSqFt === undefined ? DEFAULT_BOX_COVERAGE_SQ_FT : Number(inputs.boxCoverageSqFt);
  if (!Number.isFinite(rawBoxCoverage) || rawBoxCoverage <= 0) {
    return {
      success: false,
      calculatorId: 'tile-calculator',
      errors: [
        {
          field: 'boxCoverageSqFt',
          message: 'Box coverage must be a positive number of square feet greater than zero.',
          code: 'INVALID_NUMBER',
        },
      ],
    };
  }

  const rawWaste = inputs.wastePercentage === undefined ? 10 : Number(inputs.wastePercentage);
  if (!Number.isFinite(rawWaste) || rawWaste < 0 || rawWaste > 100) {
    return {
      success: false,
      calculatorId: 'tile-calculator',
      errors: [
        {
          field: 'wastePercentage',
          message: 'Waste percentage must be between 0% and 100%.',
          code: 'INVALID_NUMBER',
        },
      ],
    };
  }

  const rawJointWidth =
    inputs.groutJointWidthInches === undefined ? DEFAULT_GROUT_JOINT_IN : Number(inputs.groutJointWidthInches);
  if (!Number.isFinite(rawJointWidth) || rawJointWidth <= 0 || rawJointWidth > 2) {
    return {
      success: false,
      calculatorId: 'tile-calculator',
      errors: [
        {
          field: 'groutJointWidthInches',
          message: 'Grout joint width must be greater than 0 and no more than 2 inches.',
          code: 'INVALID_NUMBER',
        },
      ],
    };
  }

  const rawTileThickness =
    inputs.tileThicknessInches === undefined ? DEFAULT_TILE_THICKNESS_IN : Number(inputs.tileThicknessInches);
  if (!Number.isFinite(rawTileThickness) || rawTileThickness <= 0 || rawTileThickness > 3) {
    return {
      success: false,
      calculatorId: 'tile-calculator',
      errors: [
        {
          field: 'tileThicknessInches',
          message: 'Tile thickness must be greater than 0 and no more than 3 inches.',
          code: 'INVALID_NUMBER',
        },
      ],
    };
  }

  const boxCoverage = rawBoxCoverage;
  const wastePercent = rawWaste;
  const jointWidthIn = rawJointWidth;
  const tileThicknessIn = rawTileThickness;

  // 1. Net Area & Recommended Tile Area with Pattern Cut Waste
  const netArea = calculateRectangularArea(length, width);
  const recommendedArea = applyWaste(netArea, wastePercent);

  // 2. Tile Count Calculation
  const singleTileSqFt = (tileLIn * tileWIn) / 144;
  const exactTiles = netArea / singleTileSqFt;
  const recommendedTiles = ceilToPackage(recommendedArea / singleTileSqFt);

  // 3. Commercial Box Packaging (strict unit-consistent box math)
  const exactNetBoxes = netArea / boxCoverage;
  const recommendedBoxes = recommendedArea / boxCoverage;
  const boxesToPurchase = ceilToPackage(recommendedBoxes);
  const purchasedSqFt = boxesToPurchase * boxCoverage;

  // 4. Thinset Mortar (Trowel-Tiered Coverage on Net Installation Footprint + 10% Bucket/Back-Butter Allowance)
  const resolvedTrowel = resolveTrowelNotchSize(inputs.trowelNotchSize, tileLIn, tileWIn);
  const mortarCoverageSqFtPerBag = TROWEL_COVERAGE_SQ_FT_PER_50LB_BAG[resolvedTrowel];
  const mortarNetBagsExact = netArea / mortarCoverageSqFtPerBag;
  const mortarEffectiveArea = applyWaste(netArea, MIXING_AND_SPREAD_LOSS_PERCENT);
  const mortarRecommendedBagsExact = mortarEffectiveArea / mortarCoverageSqFtPerBag;
  const mortarBags = ceilToPackage(mortarRecommendedBagsExact);

  // 5. Dimension-Based Grout Volume & Dry Powder Weight
  // Unit cell area = (L + J)(W + J); joint plan area per cell = J * (L + W + J)
  const cellAreaSqIn = (tileLIn + jointWidthIn) * (tileWIn + jointWidthIn);
  const jointPlanAreaSqIn = jointWidthIn * (tileLIn + tileWIn + jointWidthIn);
  const groutJointAreaFraction = jointPlanAreaSqIn / cellAreaSqIn;

  // Joint volume per sq ft (in³/sq ft) = 144 in²/ft² * fraction * tileThicknessIn
  const groutVolumePerSqFtCuIn = 144 * groutJointAreaFraction * tileThicknessIn;
  const groutVolumeCuIn = netArea * groutVolumePerSqFtCuIn;

  const groutNetLbs = groutVolumeCuIn * DRY_GROUT_LBS_PER_CU_IN;
  const groutRecommendedLbs = applyWaste(groutNetLbs, MIXING_AND_SPREAD_LOSS_PERCENT);
  const groutNetBagsExact = groutNetLbs / GROUT_BAG_WEIGHT_LBS;
  const groutRecommendedBagsExact = groutRecommendedLbs / GROUT_BAG_WEIGHT_LBS;
  const groutBags = ceilToPackage(groutRecommendedBagsExact);

  const groutLbsPerSqFtWithAllowance =
    groutVolumePerSqFtCuIn * DRY_GROUT_LBS_PER_CU_IN * (1 + MIXING_AND_SPREAD_LOSS_PERCENT / 100);
  const groutEstimatedCoverageSqFtPerBag = GROUT_BAG_WEIGHT_LBS / groutLbsPerSqFtWithAllowance;

  // 6. Cost Benchmarks (strictly driven by purchase quantities)
  const tileBench = getPriceBenchmark('tile-ceramic-porcelain');
  const mortarBench = getPriceBenchmark('tile-thinset-mortar-50lb');
  const groutBench = getPriceBenchmark('tile-grout-bag');

  const tileCost = calculateCostRange(
    purchasedSqFt,
    tileBench?.priceLow ?? 1.49,
    tileBench?.priceTypical ?? 3.89,
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
    inputs: {
      ...inputs,
      areaLength: length,
      areaWidth: width,
      tileLengthInches: tileLIn,
      tileWidthInches: tileWIn,
      tileThicknessInches: tileThicknessIn,
      boxCoverageSqFt: boxCoverage,
      groutJointWidthInches: jointWidthIn,
      trowelNotchSize: inputs.trowelNotchSize ?? 'auto',
      wastePercentage: wastePercent,
    },
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
      groutJointWidthInches: jointWidthIn,
      tileThicknessInches: tileThicknessIn,
      groutJointAreaFraction: roundToPrecision(groutJointAreaFraction, 4),
      groutVolumeCuIn: roundToPrecision(groutVolumeCuIn, 1),
      groutNetLbs: roundToPrecision(groutNetLbs, 2),
      groutRecommendedLbs: roundToPrecision(groutRecommendedLbs, 2),
      groutEstimatedCoverageSqFtPerBag: roundToPrecision(groutEstimatedCoverageSqFtPerBag, 1),
      mortarTrowelNotch: resolvedTrowel,
      mortarCoverageSqFtPerBag,
      mortarNetBagsExact: roundToPrecision(mortarNetBagsExact, 2),
      mortarRecommendedBagsExact: roundToPrecision(mortarRecommendedBagsExact, 2),
    },
    billOfMaterials: [
      {
        id: 'tile-boxes',
        name: 'Tile Boxes',
        description: `Full commercial tile boxes at ${boxCoverage} sq ft/box (${wastePercent}% cut waste included in order)`,
        exactQuantity: roundToPrecision(exactNetBoxes, 2),
        recommendedQuantity: roundToPrecision(recommendedBoxes, 2),
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
        description: `Polymer-modified thinset (${resolvedTrowel}" notch trowel, +${MIXING_AND_SPREAD_LOSS_PERCENT}% pot/spread allowance)`,
        exactQuantity: roundToPrecision(mortarNetBagsExact, 2),
        recommendedQuantity: roundToPrecision(mortarRecommendedBagsExact, 2),
        purchaseQuantity: mortarBags,
        packageUnit: '50-lb bags',
        unitSizeDescription: `~${mortarCoverageSqFtPerBag} sq ft/bag (${resolvedTrowel}" trowel)`,
        wasteAppliedPercentage: MIXING_AND_SPREAD_LOSS_PERCENT,
        benchmarkPriceId: 'tile-thinset-mortar-50lb',
        estimatedCost: mortarCost,
      },
      {
        id: 'grout-bags',
        name: 'Tile Grout (25 lb)',
        description: `Cementitious joint grout for ${tileLIn}"×${tileWIn}"×${tileThicknessIn}" tile, ${jointWidthIn}" joint (+${MIXING_AND_SPREAD_LOSS_PERCENT}% float loss)`,
        exactQuantity: roundToPrecision(groutNetBagsExact, 2),
        recommendedQuantity: roundToPrecision(groutRecommendedBagsExact, 2),
        purchaseQuantity: groutBags,
        packageUnit: '25-lb bags',
        unitSizeDescription: `~${roundToPrecision(groutEstimatedCoverageSqFtPerBag, 0)} sq ft/bag (${jointWidthIn}" joint)`,
        wasteAppliedPercentage: MIXING_AND_SPREAD_LOSS_PERCENT,
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
        title: 'Trowel-Based Mortar Planning Estimate',
        detail: `Uses ${resolvedTrowel}" notch trowel benchmark (~${mortarCoverageSqFtPerBag} sq ft per 50-lb bag) on ${roundToPrecision(netArea, 1)} sq ft net substrate plus ${MIXING_AND_SPREAD_LOSS_PERCENT}% pot/back-butter allowance. Coverage benchmarks are planning estimates awaiting specific manufacturer Technical Data Sheet (TDS) verification.`,
        category: 'coverage',
      },
      {
        id: 'grout-volume-model',
        title: 'Dimension-Based Grout Volume Model',
        detail: `Computes joint volume from ${tileLIn}"×${tileWIn}" tile size, ${jointWidthIn}" joint width, and ${tileThicknessIn}" tile thickness (${roundToPrecision(groutVolumeCuIn, 1)} in³), converted using an unverified planning density factor of ${DRY_GROUT_LBS_PER_CU_IN} lb/in³ plus ${MIXING_AND_SPREAD_LOSS_PERCENT}% float/bucket loss awaiting manufacturer TDS verification.`,
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

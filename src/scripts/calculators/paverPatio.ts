/**
 * Paver Patio & Sand Calculation Engine
 */

import { getBenchmarkPriceRange, getPriceBenchmark } from '../../data/prices.ts';
import type { CalculationResult } from '../../types/index.ts';
import {
  applyWaste,
  calculateCostRange,
  calculateRectangularArea,
  calculateVolumeCubicFeet,
  ceilToPackage,
  cubicFeetToCubicYards,
  cubicYardsToTons,
  roundToPrecision,
  sanitizeNumber,
} from '../core/math-utils.ts';

export interface PaverPatioInputs {
  patioLength: number; // feet
  patioWidth: number; // feet
  paverLengthInches?: number; // inches (default 8)
  paverWidthInches?: number; // inches (default 4)
  baseDepthInches?: number; // vertical depth in inches (default 4, optional 6)
  wastePercentage?: number; // cut waste (default 10%)
}

export interface PaverPatioOutputs {
  patioAreaSqFt: number;
  baseExcavationAreaSqFt: number;
  paverAreaSqInches: number;
  baseDepthInches: number;
  wastePercentage: number;
  recommendedPaversToPurchase: number;
  gravelBaseTons: number;
  beddingSandCubicYards: number;
  polymericSand50lbBags: number;
}

export function calculatePaverPatio(inputs: PaverPatioInputs): CalculationResult<PaverPatioOutputs> {
  const length = sanitizeNumber(inputs.patioLength, 0);
  const width = sanitizeNumber(inputs.patioWidth, 0);
  const paverL = sanitizeNumber(inputs.paverLengthInches, 8);
  const paverW = sanitizeNumber(inputs.paverWidthInches, 4);
  const baseDepth = Math.max(2, sanitizeNumber(inputs.baseDepthInches, 4));
  const wastePercent = Math.max(0, sanitizeNumber(inputs.wastePercentage, 10));

  if (length <= 0 || width <= 0 || paverL <= 0 || paverW <= 0) {
    return {
      success: false,
      calculatorId: 'paver-patio-calculator',
      errors: [
        {
          field: length <= 0 ? 'patioLength' : width <= 0 ? 'patioWidth' : 'paverLengthInches',
          message: 'Patio and paver dimensions must be positive numbers greater than zero.',
          code: 'INVALID_NUMBER',
        },
      ],
    };
  }

  // 1. Surface Area
  const patioArea = calculateRectangularArea(length, width);

  // 2. Paver Counts
  const singlePaverSqFt = (paverL * paverW) / 144;
  const exactPavers = patioArea / singlePaverSqFt;
  const recommendedPavers = applyWaste(exactPavers, wastePercent);
  const paversToPurchase = ceilToPackage(recommendedPavers);

  // 3. Crushed Gravel Base (ICPI recommends 6" horizontal perimeter extension on all sides)
  const baseLength = length + 1.0; // 6 inches on each end = +1 ft
  const baseWidth = width + 1.0;
  const baseCuFt = calculateVolumeCubicFeet(baseLength, baseWidth, baseDepth);
  const baseCuYds = cubicFeetToCubicYards(baseCuFt);
  // Compaction factor for dense-graded crusher run: 1.55 tons/yd³
  const gravelBaseTons = roundToPrecision(cubicYardsToTons(baseCuYds, 1.55), 2);

  // 4. Bedding Sand (1-inch layer uncompacted concrete sand screeded across patio)
  const beddingCuFt = calculateVolumeCubicFeet(length, width, 1.0);
  const beddingSandYards = roundToPrecision(cubicFeetToCubicYards(beddingCuFt), 2);

  // 5. Polymeric Joint Sand (50-lb bag covers ~70 sq ft for standard pavers)
  const polymericSandBags = ceilToPackage(patioArea / 70);

  // 6. Pricing Benchmarks (Referenced centrally from prices data layer)
  const paverBench = getPriceBenchmark('paver-concrete-unit');
  const gravelBench = getPriceBenchmark('gravel-crushed-stone-ton');
  const beddingBench = getPriceBenchmark('sand-bedding-bulk-yard');
  const sandBench = getPriceBenchmark('polymeric-sand-50lb');

  const paverPricing = getBenchmarkPriceRange('paver-concrete-unit');
  const gravelPricing = getBenchmarkPriceRange('gravel-crushed-stone-ton');
  const beddingPricing = getBenchmarkPriceRange('sand-bedding-bulk-yard');
  const sandPricing = getBenchmarkPriceRange('polymeric-sand-50lb');

  const paverCost = calculateCostRange(patioArea, paverPricing.low, paverPricing.typical, paverPricing.high);
  const gravelCost = calculateCostRange(gravelBaseTons, gravelPricing.low, gravelPricing.typical, gravelPricing.high);
  const beddingCost = calculateCostRange(beddingSandYards, beddingPricing.low, beddingPricing.typical, beddingPricing.high);
  const sandCost = calculateCostRange(polymericSandBags, sandPricing.low, sandPricing.typical, sandPricing.high);

  const totalMaterials = {
    low: paverCost.low + gravelCost.low + beddingCost.low + sandCost.low,
    typical: paverCost.typical + gravelCost.typical + beddingCost.typical + sandCost.typical,
    high: paverCost.high + gravelCost.high + beddingCost.high + sandCost.high,
  };

  const laborBench = paverBench?.contractorLabor;
  const laborLow = laborBench ? Math.round(patioArea * laborBench.laborLow) : 0;
  const laborTyp = laborBench ? Math.round(patioArea * laborBench.laborTypical) : 0;
  const laborHigh = laborBench ? Math.round(patioArea * laborBench.laborHigh) : 0;

  return {
    success: true,
    calculatorId: 'paver-patio-calculator',
    timestamp: new Date().toISOString(),
    inputs: { ...inputs, patioLength: length, patioWidth: width, baseDepthInches: baseDepth },
    outputs: {
      patioAreaSqFt: roundToPrecision(patioArea, 1),
      baseExcavationAreaSqFt: roundToPrecision(baseLength * baseWidth, 1),
      paverAreaSqInches: paverL * paverW,
      baseDepthInches: baseDepth,
      wastePercentage: wastePercent,
      recommendedPaversToPurchase: paversToPurchase,
      gravelBaseTons,
      beddingSandCubicYards: beddingSandYards,
      polymericSand50lbBags: polymericSandBags,
    },
    billOfMaterials: [
      {
        id: 'paver-units',
        name: `Concrete Pavers (${paverL}" x ${paverW}")`,
        description: `Individual pavers for ${patioArea} sq ft with ${wastePercent}% cut waste`,
        exactQuantity: roundToPrecision(exactPavers, 1),
        recommendedQuantity: roundToPrecision(recommendedPavers, 1),
        purchaseQuantity: paversToPurchase,
        packageUnit: 'pavers',
        unitSizeDescription: `${paverL}x${paverW} in`,
        wasteAppliedPercentage: wastePercent,
        benchmarkPriceId: 'paver-concrete-unit',
        estimatedCost: paverCost,
      },
      {
        id: 'gravel-base',
        name: `Dense-Grade Crushed Gravel Base (${baseDepth}" Depth)`,
        description: `Compactible base rock extending 6" horizontally past patio edge for lateral stability`,
        exactQuantity: gravelBaseTons,
        recommendedQuantity: gravelBaseTons,
        purchaseQuantity: Math.ceil(gravelBaseTons),
        packageUnit: 'tons',
        unitSizeDescription: '1.55 tons/yd³ compacted',
        wasteAppliedPercentage: 0,
        benchmarkPriceId: 'gravel-crushed-stone-ton',
        estimatedCost: gravelCost,
      },
      {
        id: 'bedding-sand',
        name: 'Coarse Bedding Sand (1" Layer)',
        description: 'Washed concrete sand (ASTM C33) screeded uncompacted across patio area',
        exactQuantity: beddingSandYards,
        recommendedQuantity: beddingSandYards,
        purchaseQuantity: Math.ceil(beddingSandYards * 10) / 10,
        packageUnit: 'cubic yards',
        unitSizeDescription: '27 cu ft/yard (~1.35 tons/yd³)',
        wasteAppliedPercentage: 0,
        benchmarkPriceId: 'sand-bedding-bulk-yard',
        estimatedCost: beddingCost,
      },
      {
        id: 'polymeric-sand',
        name: 'Polymeric Jointing Sand (50-lb Bags)',
        description: 'Hardening joint sand to lock pavers and block weed germination',
        exactQuantity: roundToPrecision(patioArea / 70, 1),
        recommendedQuantity: roundToPrecision(patioArea / 70, 1),
        purchaseQuantity: polymericSandBags,
        packageUnit: '50-lb bags',
        unitSizeDescription: 'Covers ~70 sq ft/bag',
        wasteAppliedPercentage: 0,
        benchmarkPriceId: 'polymeric-sand-50lb',
        estimatedCost: sandCost,
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
      benchmarkSources: [
        paverBench?.sourceNote ?? 'Interlocking concrete paver benchmarks',
        gravelBench?.sourceNote ?? 'Quarry aggregate benchmarks',
        beddingBench?.sourceNote ?? 'Bedding sand benchmarks',
      ],
      disclaimer: 'Excludes excavation disposal fees, plate compactor rental, snap-edge restraint spikes, and geotextile fabric.',
    },
    assumptions: [
      {
        id: 'base-overdig',
        title: '6" Extended Horizontal Perimeter Base',
        detail: 'Per ICPI technical guidelines, the crushed rock base extends 6 inches beyond the paver perimeter on all sides to anchor snap-edge restraints and prevent edge collapse.',
        category: 'structural',
      },
      {
        id: 'base-depth-specification',
        title: 'Vertical Base Depth Specification',
        detail: `Using ${baseDepth}" vertical compacted gravel depth. 4" is standard for pedestrian foot traffic; 6" is recommended for poorly draining clays or freeze-thaw climates.`,
        category: 'structural',
      },
      {
        id: 'bedding-sand-thickness',
        title: '1" Screeded Bedding Sand Layer',
        detail: 'Never compact the 1" coarse concrete sand layer before laying pavers; the pavers are compacted down into the sand with a vibratory plate after layout.',
        category: 'structural',
      },
    ],
    notices: [
      'Ensure polymeric sand is applied ONLY when pavers are completely bone dry, otherwise polymers activate and create permanent hazing on paver faces.',
    ],
  };
}

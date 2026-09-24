/**
 * Wood Privacy Fence Calculation Engine
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

export interface FenceMaterialInputs {
  fenceLength: number; // total linear feet
  fenceHeightFeet?: 4 | 6 | 8 | number;
  postSpacingFeet?: 6 | 8 | number;
  picketWidthInches?: 3.5 | 5.5 | number;
  picketGapInches?: number; // 0 for solid privacy
  gateCount?: number;
  wastePercentage?: number; // default 5%
}

export interface FenceMaterialOutputs {
  fenceLengthFeet: number;
  fenceHeightFeet: number;
  postSpacingFeet: number;
  sectionCount: number;
  postsToPurchase: number;
  railsToPurchase: number;
  railCountPerSection: number;
  wastePercentage: number;
  picketsToPurchase: number;
  concrete60lbBagsToPurchase: number;
}

export function calculateFenceMaterial(inputs: FenceMaterialInputs): CalculationResult<FenceMaterialOutputs> {
  const length = sanitizeNumber(inputs.fenceLength, 0);
  const height = inputs.fenceHeightFeet === 4 ? 4 : inputs.fenceHeightFeet === 8 ? 8 : 6;
  const postSpacing = inputs.postSpacingFeet === 6 ? 6 : 8;
  const picketWidth = inputs.picketWidthInches === 3.5 ? 3.5 : 5.5;
  const picketGap = Math.max(0, sanitizeNumber(inputs.picketGapInches, 0));
  const gateCount = Math.max(0, sanitizeNumber(inputs.gateCount, 0));
  const wastePercent = Math.max(0, sanitizeNumber(inputs.wastePercentage, 5));

  if (length <= 0) {
    return {
      success: false,
      calculatorId: 'fence-material-calculator',
      errors: [
        {
          field: 'fenceLength',
          message: 'Fence linear length must be a positive number greater than zero.',
          code: 'INVALID_NUMBER',
        },
      ],
    };
  }

  // 1. Post Sections
  const sections = Math.ceil(length / postSpacing);
  // Base line posts = sections + 1. Each walk gate requires 2 dedicated hinge/latch posts.
  const basePosts = sections + 1;
  const gatePosts = gateCount * 2;
  const totalPosts = basePosts + gatePosts;

  // 2. Horizontal Backer Rails (2x4)
  // Standard rule: 6ft and 8ft fences require 3 rails per section; 4ft fences require 2 rails
  const railsPerSection = height <= 4 ? 2 : 3;
  const totalRails = sections * railsPerSection;

  // 3. Vertical Pickets
  const effectivePicketPitch = picketWidth + picketGap;
  const exactPickets = (length * 12) / effectivePicketPitch;
  const recommendedPickets = applyWaste(exactPickets, wastePercent);
  const picketsToPurchase = ceilToPackage(recommendedPickets);

  // 4. Post Concrete (assumes 1.5 bags of 60lb mix per post for standard 24-30" depth)
  const concreteBags = ceilToPackage(totalPosts * 1.5);

  // 5. Pricing Benchmarks
  const postBench = getPriceBenchmark('fence-post-4x4x8');
  const railBench = getPriceBenchmark('fence-rail-2x4x8');
  const picketBench = getPriceBenchmark('fence-picket-dogear');
  const concreteBench = getPriceBenchmark('concrete-60lb-bag');

  const postCost = calculateCostRange(totalPosts, postBench?.priceLow ?? 9.5, postBench?.priceTypical ?? 13.75, postBench?.priceHigh ?? 18.5);
  const railCost = calculateCostRange(totalRails, railBench?.priceLow ?? 5.25, railBench?.priceTypical ?? 7.5, railBench?.priceHigh ?? 10.5);
  const picketCost = calculateCostRange(picketsToPurchase, picketBench?.priceLow ?? 1.95, picketBench?.priceTypical ?? 2.85, picketBench?.priceHigh ?? 4.25);
  const concreteCost = calculateCostRange(concreteBags, concreteBench?.priceLow ?? 4.5, concreteBench?.priceTypical ?? 5.35, concreteBench?.priceHigh ?? 6.75);

  const totalMaterials = {
    low: postCost.low + railCost.low + picketCost.low + concreteCost.low,
    typical: postCost.typical + railCost.typical + picketCost.typical + concreteCost.typical,
    high: postCost.high + railCost.high + picketCost.high + concreteCost.high,
  };

  return {
    success: true,
    calculatorId: 'fence-material-calculator',
    timestamp: new Date().toISOString(),
    inputs: { ...inputs, fenceLength: length, fenceHeightFeet: height, postSpacingFeet: postSpacing },
    outputs: {
      fenceLengthFeet: length,
      fenceHeightFeet: height,
      postSpacingFeet: postSpacing,
      sectionCount: sections,
      postsToPurchase: totalPosts,
      railsToPurchase: totalRails,
      railCountPerSection: railsPerSection,
      wastePercentage: wastePercent,
      picketsToPurchase,
      concrete60lbBagsToPurchase: concreteBags,
    },
    billOfMaterials: [
      {
        id: 'fence-posts',
        name: '4" x 4" x 8\' Pressure-Treated Posts',
        description: `Ground contact rated posts (includes ${gatePosts} gate hinge/latch posts)`,
        exactQuantity: totalPosts,
        recommendedQuantity: totalPosts,
        purchaseQuantity: totalPosts,
        packageUnit: 'posts',
        unitSizeDescription: '4x4x8 ft PT timber',
        wasteAppliedPercentage: 0,
        benchmarkPriceId: 'fence-post-4x4x8',
        estimatedCost: postCost,
      },
      {
        id: 'fence-rails',
        name: `2" x 4" x ${postSpacing}\' Backer Rails`,
        description: `${railsPerSection} horizontal rails per section`,
        exactQuantity: totalRails,
        recommendedQuantity: totalRails,
        purchaseQuantity: totalRails,
        packageUnit: 'rails',
        unitSizeDescription: `2x4x${postSpacing} ft lumber`,
        wasteAppliedPercentage: 0,
        benchmarkPriceId: 'fence-rail-2x4x8',
        estimatedCost: railCost,
      },
      {
        id: 'fence-pickets',
        name: `1" x 6" x ${height}\' Dog-Ear Fence Pickets`,
        description: `Vertical pickets at ${picketWidth}" width with 5% cut allowance`,
        exactQuantity: roundToPrecision(exactPickets, 1),
        recommendedQuantity: roundToPrecision(recommendedPickets, 1),
        purchaseQuantity: picketsToPurchase,
        packageUnit: 'pickets',
        unitSizeDescription: `${picketWidth}" x ${height}\' dog-ear pickets`,
        wasteAppliedPercentage: wastePercent,
        benchmarkPriceId: 'fence-picket-dogear',
        estimatedCost: picketCost,
      },
      {
        id: 'fence-concrete',
        name: '60 lb Concrete Mix Bags',
        description: 'Pre-mixed concrete for setting post footings',
        exactQuantity: roundToPrecision(totalPosts * 1.5, 1),
        recommendedQuantity: roundToPrecision(totalPosts * 1.5, 1),
        purchaseQuantity: concreteBags,
        packageUnit: '60-lb bags',
        unitSizeDescription: 'Planning allowance of 1.5 bags per post hole',
        wasteAppliedPercentage: 0,
        benchmarkPriceId: 'concrete-60lb-bag',
        estimatedCost: concreteCost,
      },
    ],
    costEstimate: {
      hasPricing: true,
      currency: 'USD',
      materialsOnly: totalMaterials,
      benchmarkSources: [postBench?.sourceNote ?? 'Retail lumber yard pricing'],
      disclaimer: 'Excludes fence screws/nails, gate latch hardware, and post caps.',
    },
    assumptions: [
      {
        id: 'rail-count-benchmark',
        title: 'Planning Rail Count Benchmark',
        detail: 'Assumes 3 horizontal backer rails per section for 6-foot and 8-foot privacy fences (2 rails for 4-foot fences) to prevent picket warpage and sagging.',
        category: 'structural',
      },
      {
        id: 'concrete-planning-allowance',
        title: 'Planning Concrete Allowance per Post Hole',
        detail: 'Assumes a planning benchmark of 1.5 x 60-lb bags per post. Actual footing requirements depend on local frost line, soil conditions, hole diameter, and hole depth.',
        category: 'packaging',
      },
      {
        id: 'post-spacing-choice',
        title: 'Post Spacing',
        detail: `Using ${postSpacing}-foot post spacing. 6-foot spacing is recommended in high-wind regions.`,
        category: 'geometry',
      },
    ],
    notices: [
      'Call 811 (Call Before You Dig) at least 48 hours before digging post holes to locate underground utilities.',
      'Check local HOA rules and city zoning for property line setback and height limits before ordering lumber.',
    ],
  };
}

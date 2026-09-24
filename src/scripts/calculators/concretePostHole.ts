/**
 * Concrete Post Hole & Footing Calculation Engine
 */

import { getBenchmarkPriceRange, getPriceBenchmark } from '../../data/prices.ts';
import type { CalculationResult } from '../../types/index.ts';
import {
  applyWaste,
  calculateCostRange,
  calculateCylinderVolumeCuFt,
  calculatePostDisplacementCuFt,
  ceilToPackage,
  cubicFeetToCubicYards,
  roundToPrecision,
  sanitizeNumber,
} from '../core/math-utils.ts';

export interface ConcretePostHoleInputs {
  holeCount: number;
  holeDiameterInches: number;
  holeDepthInches: number;
  postSize?: '4x4' | '6x6' | 'round-2.375' | 'none';
  wastePercentage?: number;
}

export interface ConcretePostHoleOutputs {
  holeCount: number;
  cylinderVolumePerHoleCuFt: number;
  postDisplacementPerHoleCuFt: number;
  netConcretePerHoleCuFt: number;
  totalGeometricCuFt: number;
  wastePercentage: number;
  recommendedTotalCuFt: number;
  recommendedTotalCuYds: number;
  bags80lbPerHole: number;
  totalBags80lbToPurchase: number;
  totalBags60lbToPurchase: number;
}

export function calculateConcretePostHole(
  inputs: ConcretePostHoleInputs
): CalculationResult<ConcretePostHoleOutputs> {
  const holes = sanitizeNumber(inputs.holeCount, 0);
  const diameter = sanitizeNumber(inputs.holeDiameterInches, 0);
  const depth = sanitizeNumber(inputs.holeDepthInches, 0);
  const wastePercent = Math.max(0, sanitizeNumber(inputs.wastePercentage, 10));
  const postSize = inputs.postSize || '4x4';

  if (holes <= 0 || diameter <= 0 || depth <= 0) {
    return {
      success: false,
      calculatorId: 'concrete-post-hole-calculator',
      errors: [
        {
          field: holes <= 0 ? 'holeCount' : diameter <= 0 ? 'holeDiameterInches' : 'holeDepthInches',
          message: 'Hole count, diameter, and depth must be positive numbers greater than zero.',
          code: 'INVALID_NUMBER',
        },
      ],
    };
  }

  // Physical validation: Ensure post fits inside the dug hole with adequate room for concrete
  const postDiagonalInches = postSize === '6x6' ? 7.78 : postSize === '4x4' ? 4.95 : postSize === 'round-2.375' ? 2.375 : 0;
  if (postDiagonalInches > 0 && diameter <= postDiagonalInches) {
    return {
      success: false,
      calculatorId: 'concrete-post-hole-calculator',
      errors: [
        {
          field: 'holeDiameterInches',
          message: `Hole diameter (${diameter}") must be larger than post diagonal (${postDiagonalInches}") so the post physically fits with room for a concrete collar. Standard guideline: Hole diameter should be 3x post width (e.g., 10" or 12" for a 4x4).`,
          code: 'IMPOSSIBLE_GEOMETRY',
        },
      ],
    };
  }

  // 1. Gross Cylindrical Volume per Hole
  const cylinderCuFt = calculateCylinderVolumeCuFt(diameter, depth);

  // 2. Post Displacement (deduct volume of embedded post)
  let displacementCuFt = 0;
  if (postSize === '4x4') {
    // 3.5" x 3.5" actual lumber
    displacementCuFt = calculatePostDisplacementCuFt(3.5, 3.5, depth);
  } else if (postSize === '6x6') {
    // 5.5" x 5.5" actual lumber
    displacementCuFt = calculatePostDisplacementCuFt(5.5, 5.5, depth);
  } else if (postSize === 'round-2.375') {
    // 2.375" OD steel pipe: π * (r)^2 * h
    const radiusFt = (2.375 / 2) / 12;
    displacementCuFt = Math.PI * radiusFt * radiusFt * (depth / 12);
  }

  const netCuFtPerHole = Math.max(0.1, cylinderCuFt - displacementCuFt);
  const totalGeometricCuFt = netCuFtPerHole * holes;

  // 3. Waste Factor (irregular dug earth walls)
  const recommendedTotalCuFt = applyWaste(totalGeometricCuFt, wastePercent);
  const recommendedTotalCuYds = cubicFeetToCubicYards(recommendedTotalCuFt);

  // 4. Commercial Bag Yields (80lb = 0.60 cu ft; 60lb = 0.45 cu ft)
  const bags80lbPerHole = roundToPrecision(netCuFtPerHole / 0.60, 1);
  const totalBags80lb = ceilToPackage(recommendedTotalCuFt / 0.60);
  const totalBags60lb = ceilToPackage(recommendedTotalCuFt / 0.45);

  // 5. Cost Benchmarks
  const bench80 = getPriceBenchmark('concrete-80lb-bag');
  const pricing80 = getBenchmarkPriceRange('concrete-80lb-bag');

  const bagCost = calculateCostRange(
    totalBags80lb,
    pricing80.low,
    pricing80.typical,
    pricing80.high
  );

  return {
    success: true,
    calculatorId: 'concrete-post-hole-calculator',
    timestamp: new Date().toISOString(),
    inputs: { ...inputs, holeCount: holes, holeDiameterInches: diameter, holeDepthInches: depth },
    outputs: {
      holeCount: holes,
      cylinderVolumePerHoleCuFt: roundToPrecision(cylinderCuFt, 2),
      postDisplacementPerHoleCuFt: roundToPrecision(displacementCuFt, 2),
      netConcretePerHoleCuFt: roundToPrecision(netCuFtPerHole, 2),
      totalGeometricCuFt: roundToPrecision(totalGeometricCuFt, 2),
      wastePercentage: wastePercent,
      recommendedTotalCuFt: roundToPrecision(recommendedTotalCuFt, 2),
      recommendedTotalCuYds: roundToPrecision(recommendedTotalCuYds, 2),
      bags80lbPerHole,
      totalBags80lbToPurchase: totalBags80lb,
      totalBags60lbToPurchase: totalBags60lb,
    },
    billOfMaterials: [
      {
        id: 'post-concrete-80lb',
        name: '80 lb Concrete Mix Bags',
        description: `Commercial concrete mix bags for setting ${holes} posts`,
        exactQuantity: roundToPrecision(recommendedTotalCuFt / 0.60, 1),
        recommendedQuantity: roundToPrecision(recommendedTotalCuFt, 1),
        purchaseQuantity: totalBags80lb,
        packageUnit: '80-lb bags',
        unitSizeDescription: '0.60 cu ft/bag (approx 4000 PSI)',
        wasteAppliedPercentage: wastePercent,
        benchmarkPriceId: 'concrete-80lb-bag',
        estimatedCost: bagCost,
      },
    ],
    costEstimate: {
      hasPricing: true,
      currency: 'USD',
      materialsOnly: bagCost,
      benchmarkSources: [bench80?.sourceNote ?? 'National home improvement centers'],
      disclaimer: 'Excludes posts, digging tools or auger rental, and gravel footing drain pads.',
    },
    assumptions: [
      {
        id: 'post-displacement',
        title: 'Estimated Post Displacement Deduction',
        detail: `Estimated displacement deduction of ${roundToPrecision(displacementCuFt, 2)} cu ft per hole for the space occupied by the embedded ${postSize} post. This is a planning estimate, not an exact physical displacement measurement.`,
        category: 'geometry',
      },
      {
        id: 'hole-diameter-standard',
        title: 'Hole Diameter Rule of Thumb',
        detail: 'Standard planning guideline suggests hole diameter equal to approximately 3x post thickness (e.g. 10" or 12" diameter for a 4x4 lumber post).',
        category: 'structural',
      },
    ],
    notices: [
      'In cold climates, hole depth must extend at least 6 inches below the local frost line to prevent frost heave from lifting posts.',
      'Pour 2 to 3 inches of crushed gravel into the bottom of each hole before setting posts to promote drainage and prevent post-bottom rot.',
    ],
  };
}

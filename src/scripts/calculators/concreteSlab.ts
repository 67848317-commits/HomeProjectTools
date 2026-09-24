/**
 * Concrete Slab & Pour Calculation Engine
 */

import { getPriceBenchmark } from '../../data/prices.ts';
import type { CalculationResult } from '../../types/index.ts';
import {
  applyWaste,
  calculateCostRange,
  calculateVolumeCubicFeet,
  ceilToPackage,
  cubicFeetToCubicYards,
  roundToPrecision,
  sanitizeNumber,
} from '../core/math-utils.ts';

export interface ConcreteSlabInputs {
  slabLength: number; // feet
  slabWidth: number; // feet
  slabThickness: number; // inches
  wastePercentage?: number; // e.g. 10 for 10%
  yield80lbCuFt?: number; // cu ft per 80lb bag (default 0.60)
  yield60lbCuFt?: number; // cu ft per 60lb bag (default 0.45)
}

export interface ConcreteSlabOutputs {
  slabAreaSqFt: number;
  slabThicknessInches: number;
  geometricVolumeCuFt: number;
  geometricVolumeCuYds: number;
  wastePercentage: number;
  recommendedVolumeCuFt: number;
  recommendedVolumeCuYds: number;
  bags80lbToPurchase: number;
  bags60lbToPurchase: number;
  isReadyMixRecommended: boolean;
}

export function calculateConcreteSlab(inputs: ConcreteSlabInputs): CalculationResult<ConcreteSlabOutputs> {
  const length = sanitizeNumber(inputs.slabLength, 0);
  const width = sanitizeNumber(inputs.slabWidth, 0);
  const thicknessInches = sanitizeNumber(inputs.slabThickness, 0);
  const wastePercent = Math.max(0, sanitizeNumber(inputs.wastePercentage, 10));
  const yield80 = Math.max(0.4, sanitizeNumber(inputs.yield80lbCuFt, 0.60));
  const yield60 = Math.max(0.3, sanitizeNumber(inputs.yield60lbCuFt, 0.45));

  if (length <= 0 || width <= 0 || thicknessInches <= 0) {
    return {
      success: false,
      calculatorId: 'concrete-slab-calculator',
      errors: [
        {
          field: length <= 0 ? 'slabLength' : width <= 0 ? 'slabWidth' : 'slabThickness',
          message: 'Slab dimensions and thickness must be positive numbers greater than zero.',
          code: 'INVALID_NUMBER',
        },
      ],
    };
  }

  // 1. Geometric Volume
  const areaSqFt = length * width;
  const geometricCuFt = calculateVolumeCubicFeet(length, width, thicknessInches);
  const geometricCuYds = cubicFeetToCubicYards(geometricCuFt);

  // 2. Ordering Buffer / Waste
  const recommendedCuFt = applyWaste(geometricCuFt, wastePercent);
  const recommendedCuYds = cubicFeetToCubicYards(recommendedCuFt);

  // 3. Bag Yields & Rounding (Ceil to whole bag)
  const exact80Bags = recommendedCuFt / yield80;
  const bags80lb = ceilToPackage(exact80Bags);

  const exact60Bags = recommendedCuFt / yield60;
  const bags60lb = ceilToPackage(exact60Bags);

  // Ready-Mix threshold: jobs > 1.5 cu yds (approx 68+ 80lb bags) are exhausting to hand-mix
  const isReadyMixRecommended = recommendedCuYds >= 1.5;

  // 4. Pricing Benchmarks
  const bench80 = getPriceBenchmark('concrete-80lb-bag');
  const benchReadyMix = getPriceBenchmark('concrete-readymix-yard');

  const bagsCost = calculateCostRange(
    bags80lb,
    bench80?.priceLow ?? 5.6,
    bench80?.priceTypical ?? 6.65,
    bench80?.priceHigh ?? 8.2
  );

  const readyMixCost = calculateCostRange(
    recommendedCuYds,
    benchReadyMix?.priceLow ?? 135,
    benchReadyMix?.priceTypical ?? 165,
    benchReadyMix?.priceHigh ?? 210
  );

  // Separated Contractor Labor
  const laborBench = bench80?.contractorLabor;
  const laborLow = laborBench ? Math.round(areaSqFt * laborBench.laborLow) : 0;
  const laborTyp = laborBench ? Math.round(areaSqFt * laborBench.laborTypical) : 0;
  const laborHigh = laborBench ? Math.round(areaSqFt * laborBench.laborHigh) : 0;

  return {
    success: true,
    calculatorId: 'concrete-slab-calculator',
    timestamp: new Date().toISOString(),
    inputs: { ...inputs, slabLength: length, slabWidth: width, slabThickness: thicknessInches },
    outputs: {
      slabAreaSqFt: roundToPrecision(areaSqFt, 1),
      slabThicknessInches: thicknessInches,
      geometricVolumeCuFt: roundToPrecision(geometricCuFt, 2),
      geometricVolumeCuYds: roundToPrecision(geometricCuYds, 2),
      wastePercentage: wastePercent,
      recommendedVolumeCuFt: roundToPrecision(recommendedCuFt, 2),
      recommendedVolumeCuYds: roundToPrecision(recommendedCuYds, 2),
      bags80lbToPurchase: bags80lb,
      bags60lbToPurchase: bags60lb,
      isReadyMixRecommended,
    },
    billOfMaterials: [
      {
        id: 'concrete-bags-80lb',
        name: '80 lb High-Strength Concrete Bags',
        description: `Commercial 80-lb pre-mix bags at ${yield80} cu ft yield per bag`,
        exactQuantity: roundToPrecision(exact80Bags, 1),
        recommendedQuantity: roundToPrecision(recommendedCuFt, 1),
        purchaseQuantity: bags80lb,
        packageUnit: '80-lb bags',
        unitSizeDescription: `${yield80} cu ft/bag`,
        wasteAppliedPercentage: wastePercent,
        benchmarkPriceId: 'concrete-80lb-bag',
        estimatedCost: bagsCost,
      },
    ],
    costEstimate: {
      hasPricing: true,
      currency: 'USD',
      materialsOnly: isReadyMixRecommended ? readyMixCost : bagsCost,
      contractorInstalledTotal: laborBench
        ? {
            low: (isReadyMixRecommended ? readyMixCost.low : bagsCost.low) + laborLow,
            typical: (isReadyMixRecommended ? readyMixCost.typical : bagsCost.typical) + laborTyp,
            high: (isReadyMixRecommended ? readyMixCost.high : bagsCost.high) + laborHigh,
            laborOnlyLow: laborLow,
            laborOnlyTypical: laborTyp,
            laborOnlyHigh: laborHigh,
            scopeNote: laborBench.laborScopeNote,
          }
        : undefined,
      benchmarkSources: [bench80?.sourceNote ?? 'National home improvement centers'],
      disclaimer: isReadyMixRecommended
        ? 'Showing ready-mix truck material pricing. Suppliers may charge short-load fees for deliveries under 3–4 yards.'
        : 'Showing bagged concrete material pricing. Excludes mixer rental, forms, and reinforcement rebar/mesh.',
    },
    assumptions: [
      {
        id: 'bag-yield-assumption',
        title: 'Bag Yield Standards',
        detail: `Calculation assumes an 80-lb bag yields ${yield80} cu ft (approx 45 bags/yd³) and a 60-lb bag yields ${yield60} cu ft (approx 60 bags/yd³).`,
        category: 'packaging',
      },
      {
        id: 'ordering-buffer',
        title: '10% Subgrade & Spillage Buffer',
        detail: `Added ${wastePercent}% to geometric volume (${roundToPrecision(geometricCuYds, 2)} yd³) to absorb uneven excavation depth, form deflection, and screed spillage.`,
        category: 'waste',
      },
    ],
    notices: [
      isReadyMixRecommended
        ? `This pour requires approximately ${bags80lb} bags (approx ${(bags80lb * 80).toLocaleString()} lbs). Larger pours may be worth comparing with ready-mix delivery because of mixing time and volume.`
        : 'For small pours under 1.5 yards, hand-mixing or renting a portable electric mixer from a tool center is cost-effective.',
    ],
  };
}

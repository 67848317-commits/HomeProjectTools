import test from 'node:test';
import assert from 'node:assert/strict';

import { calculatePaverPatio } from '../src/scripts/calculators/paverPatio.ts';
import { getPriceBenchmark } from '../src/data/prices.ts';
import { CALCULATORS } from '../src/data/calculators.ts';
import { getGuideBySlug } from '../src/data/guides.ts';

test('Paver Patio - 1. Paver waste application, ceilToPackage rounding, and purchased paver sq ft pricing', () => {
  // 13 ft x 11 ft = 143 sq ft; 6x9 paver = 54 sq in = 0.375 sq ft
  // Exact pavers = 143 / 0.375 = 381.333...
  // 10% waste = 381.333... * 1.1 = 419.466... -> ceilToPackage = 420 pavers
  // Purchased sq ft = 420 * 0.375 = 157.5 sq ft
  const res = calculatePaverPatio({
    patioLength: 13,
    patioWidth: 11,
    paverLengthInches: 9,
    paverWidthInches: 6,
    baseDepthInches: 4,
    wastePercentage: 10,
  });

  assert.equal(res.success, true);
  if (!res.success) return;

  assert.equal(res.outputs.patioAreaSqFt, 143);
  assert.equal(res.outputs.exactPaversNeeded, 381.3);
  assert.equal(res.outputs.recommendedPaversWithWaste, 419.5);
  assert.equal(res.outputs.recommendedPaversToPurchase, 420);
  assert.equal(res.outputs.purchasedPaverSqFt, 157.5);

  const paverBom = res.billOfMaterials.find((b) => b.id === 'paver-units')!;
  const paverBench = getPriceBenchmark('paver-concrete-unit')!;
  assert.equal(paverBom.purchaseQuantity, 420);
  assert.equal(paverBom.estimatedCost?.low, Math.round(157.5 * paverBench.priceLow));
  assert.equal(paverBom.estimatedCost?.typical, Math.round(157.5 * paverBench.priceTypical));
  assert.equal(paverBom.estimatedCost?.high, Math.round(157.5 * paverBench.priceHigh));

  // Exact integer paver boundary with 0% waste should not over-round
  const exactRes = calculatePaverPatio({
    patioLength: 15,
    patioWidth: 12,
    paverLengthInches: 8,
    paverWidthInches: 4,
    wastePercentage: 0,
  });
  assert.equal(exactRes.success, true);
  if (exactRes.success) {
    assert.equal(exactRes.outputs.recommendedPaversToPurchase, 810);
    assert.equal(exactRes.outputs.purchasedPaverSqFt, 180);
  }
});

test('Paver Patio - 2. Gravel theoretical volume vs whole-ton purchase quantity and 6" perimeter extension', () => {
  // 15x12 patio => base footprint 16x13 = 208 sq ft; 4" compacted depth = 69.333 cu ft = 2.5679 cu yds
  // Provisional 1.55 tons/cu yd => 3.98 net tons -> 4 whole tons purchased
  const res4 = calculatePaverPatio({
    patioLength: 15,
    patioWidth: 12,
    baseDepthInches: 4,
  });
  assert.equal(res4.success, true);
  if (res4.success) {
    assert.equal(res4.outputs.baseExcavationAreaSqFt, 208);
    assert.equal(res4.outputs.baseVolumeCuFt, 69.33);
    assert.equal(res4.outputs.baseVolumeCuYds, 2.57);
    assert.equal(res4.outputs.gravelBaseTons, 3.98);
    assert.equal(res4.outputs.gravelBasePurchaseTons, 4);
    const gravelBom = res4.billOfMaterials.find((b) => b.id === 'gravel-base')!;
    assert.equal(gravelBom.exactQuantity, 3.98);
    assert.equal(gravelBom.purchaseQuantity, 4);
  }

  // 20x15 patio @ 4" => 21x16 = 336 sq ft => 112 cu ft = 4.148 cu yds => 6.43 net tons -> 7 whole tons
  const resGolden = calculatePaverPatio({
    patioLength: 20,
    patioWidth: 15,
    baseDepthInches: 4,
  });
  assert.equal(resGolden.success, true);
  if (resGolden.success) {
    assert.equal(resGolden.outputs.gravelBaseTons, 6.43);
    assert.equal(resGolden.outputs.gravelBasePurchaseTons, 7);
    const gravelBom = resGolden.billOfMaterials.find((b) => b.id === 'gravel-base')!;
    assert.equal(gravelBom.purchaseQuantity, 7);
  }
});

test('Paver Patio - 3. Gravel cost consistency strictly matches purchased whole-ton BOM quantity', () => {
  const res = calculatePaverPatio({
    patioLength: 20,
    patioWidth: 15,
    baseDepthInches: 4,
  });
  assert.equal(res.success, true);
  if (!res.success) return;

  const gravelBom = res.billOfMaterials.find((b) => b.id === 'gravel-base')!;
  const gravelBench = getPriceBenchmark('gravel-crushed-stone-ton')!;

  assert.equal(gravelBom.purchaseQuantity, 7);
  assert.equal(gravelBom.estimatedCost?.low, Math.round(7 * gravelBench.priceLow));
  assert.equal(gravelBom.estimatedCost?.typical, Math.round(7 * gravelBench.priceTypical));
  assert.equal(gravelBom.estimatedCost?.high, Math.round(7 * gravelBench.priceHigh));
});

test('Paver Patio - 4. Compaction, finished depth & provisional assumption disclosures in engine, metadata, and guide', () => {
  const res = calculatePaverPatio({
    patioLength: 15,
    patioWidth: 12,
    baseDepthInches: 6,
  });
  assert.equal(res.success, true);
  if (!res.success) return;

  const baseAssumption = res.assumptions.find((a) => a.id === 'base-depth-specification');
  const polymericAssumption = res.assumptions.find((a) => a.id === 'polymeric-sand-benchmark');
  assert.ok(baseAssumption?.detail.includes('finished compacted'));
  assert.ok(baseAssumption?.detail.includes('provisional 1.55 tons/yd³'));
  assert.ok(polymericAssumption?.detail.includes('preliminary 70 sq ft per 50-lb bag'));
  assert.ok(polymericAssumption?.detail.includes('paver thickness, joint width'));

  const meta = CALCULATORS['paver-patio-calculator'];
  assert.ok(meta.assumptions.some((a) => a.includes('finished compacted')));
  assert.ok(meta.assumptions.some((a) => a.includes('preliminary ~70 sq ft per 50-lb bag')));
  assert.ok(meta.limitations.some((l) => l.includes('Delivery fees')));

  const guide = getGuideBySlug('how-to-calculate-paver-patio-materials')!;
  assert.ok(guide.methodologyAssumptions.some((a) => a.includes('finished compacted thickness')));
  assert.ok(guide.methodologyAssumptions.some((a) => a.includes('preliminary ~70 sq ft per 50-lb bag')));
  assert.ok(!guide.threeStageExplanation.stage3Description.includes('loose cubic yard'));
});

test('Paver Patio - 5. Bedding sand 1" uncompacted screed math & cost matches 0.1-yd3 purchase increment', () => {
  // 20x15 = 300 sq ft => 300 * (1/12) = 25 cu ft => 25 / 27 = 0.9259 -> 0.93 net yd3 -> 1.0 yd3 purchase order
  const res = calculatePaverPatio({
    patioLength: 20,
    patioWidth: 15,
    baseDepthInches: 4,
  });
  assert.equal(res.success, true);
  if (!res.success) return;

  assert.equal(res.outputs.beddingSandCubicFt, 25);
  assert.equal(res.outputs.beddingSandCubicYards, 0.93);
  assert.equal(res.outputs.beddingSandPurchaseCubicYards, 1.0);

  const beddingBom = res.billOfMaterials.find((b) => b.id === 'bedding-sand')!;
  const beddingBench = getPriceBenchmark('sand-bedding-bulk-yard')!;
  assert.equal(beddingBom.exactQuantity, 0.93);
  assert.equal(beddingBom.purchaseQuantity, 1.0);
  assert.equal(beddingBom.estimatedCost?.low, Math.round(1.0 * beddingBench.priceLow));
  assert.equal(beddingBom.estimatedCost?.typical, Math.round(1.0 * beddingBench.priceTypical));
  assert.equal(beddingBom.estimatedCost?.high, Math.round(1.0 * beddingBench.priceHigh));
});

test('Paver Patio - 6. Paver cutting waste affects ONLY pavers & paver cost, NOT gravel base, bedding sand, or polymeric sand', () => {
  const lowWaste = calculatePaverPatio({
    patioLength: 15,
    patioWidth: 12,
    paverLengthInches: 8,
    paverWidthInches: 4,
    baseDepthInches: 4,
    wastePercentage: 5,
  });
  const highWaste = calculatePaverPatio({
    patioLength: 15,
    patioWidth: 12,
    paverLengthInches: 8,
    paverWidthInches: 4,
    baseDepthInches: 4,
    wastePercentage: 20,
  });

  assert.equal(lowWaste.success, true);
  assert.equal(highWaste.success, true);
  if (!lowWaste.success || !highWaste.success) return;

  assert.ok(highWaste.outputs.recommendedPaversToPurchase > lowWaste.outputs.recommendedPaversToPurchase);
  assert.ok(highWaste.outputs.purchasedPaverSqFt > lowWaste.outputs.purchasedPaverSqFt);

  // Gravel base, bedding sand, and polymeric sand MUST remain strictly invariant
  assert.equal(highWaste.outputs.gravelBaseTons, lowWaste.outputs.gravelBaseTons);
  assert.equal(highWaste.outputs.gravelBasePurchaseTons, lowWaste.outputs.gravelBasePurchaseTons);
  assert.equal(highWaste.outputs.beddingSandCubicYards, lowWaste.outputs.beddingSandCubicYards);
  assert.equal(highWaste.outputs.beddingSandPurchaseCubicYards, lowWaste.outputs.beddingSandPurchaseCubicYards);
  assert.equal(highWaste.outputs.polymericSand50lbBags, lowWaste.outputs.polymericSand50lbBags);

  const gravelLowBom = lowWaste.billOfMaterials.find((b) => b.id === 'gravel-base')!;
  const gravelHighBom = highWaste.billOfMaterials.find((b) => b.id === 'gravel-base')!;
  assert.deepEqual(gravelHighBom.estimatedCost, gravelLowBom.estimatedCost);
});

test('Paver Patio - 7. Polymeric sand coverage calculation and disclosed planning limitation', () => {
  // Exact boundary 140 sq ft / 70 = 2.00 -> 2 bags; 141 sq ft / 70 = 2.014 -> 3 bags
  const exactRes = calculatePaverPatio({ patioLength: 14, patioWidth: 10 });
  const overRes = calculatePaverPatio({ patioLength: 14.1, patioWidth: 10 });

  assert.equal(exactRes.success, true);
  assert.equal(overRes.success, true);
  if (!exactRes.success || !overRes.success) return;

  assert.equal(exactRes.outputs.polymericSandCoverageSqFtPerBag, 70);
  assert.equal(exactRes.outputs.polymericSandExactBags, 2);
  assert.equal(exactRes.outputs.polymericSand50lbBags, 2);

  assert.equal(overRes.outputs.polymericSandExactBags, 2.01);
  assert.equal(overRes.outputs.polymericSand50lbBags, 3);

  const sandBom = overRes.billOfMaterials.find((b) => b.id === 'polymeric-sand')!;
  assert.ok(sandBom.unitSizeDescription.includes('Provisional'));
  assert.ok(sandBom.description.includes('not adjusted for joint width or paver thickness'));
});

test('Paver Patio - 8. BOM unit consistency (exactQuantity <= recommendedQuantity <= purchaseQuantity)', () => {
  const scenarios = [
    { patioLength: 15, patioWidth: 12, paverLengthInches: 8, paverWidthInches: 4, baseDepthInches: 4, wastePercentage: 10 },
    { patioLength: 12.5, patioWidth: 9.75, paverLengthInches: 12, paverWidthInches: 12, baseDepthInches: 6, wastePercentage: 15 },
    { patioLength: 30, patioWidth: 20, paverLengthInches: 6, paverWidthInches: 9, baseDepthInches: 4, wastePercentage: 0 },
  ];

  for (const input of scenarios) {
    const res = calculatePaverPatio(input);
    assert.equal(res.success, true);
    if (!res.success) continue;

    assert.equal(res.billOfMaterials.length, 4);
    for (const item of res.billOfMaterials) {
      assert.ok(item.exactQuantity <= item.recommendedQuantity, `${item.id}: exact <= recommended`);
      assert.ok(item.recommendedQuantity <= item.purchaseQuantity, `${item.id}: recommended <= purchase`);
      assert.ok(item.packageUnit.length > 0);
    }
  }
});

test('Paver Patio - 9. Cost aggregation consistency (materialsOnly equals exact sum of BOM item costs)', () => {
  const scenarios = [
    { patioLength: 15, patioWidth: 12, baseDepthInches: 4, wastePercentage: 10 },
    { patioLength: 20, patioWidth: 15, baseDepthInches: 6, wastePercentage: 15 },
    { patioLength: 8.5, patioWidth: 6.25, paverLengthInches: 12, paverWidthInches: 8, baseDepthInches: 4, wastePercentage: 12 },
  ];

  for (const input of scenarios) {
    const res = calculatePaverPatio(input);
    assert.equal(res.success, true);
    if (!res.success) continue;

    const sumLow = res.billOfMaterials.reduce((acc, item) => acc + (item.estimatedCost?.low ?? 0), 0);
    const sumTyp = res.billOfMaterials.reduce((acc, item) => acc + (item.estimatedCost?.typical ?? 0), 0);
    const sumHigh = res.billOfMaterials.reduce((acc, item) => acc + (item.estimatedCost?.high ?? 0), 0);

    assert.equal(res.costEstimate.materialsOnly.low, sumLow);
    assert.equal(res.costEstimate.materialsOnly.typical, sumTyp);
    assert.equal(res.costEstimate.materialsOnly.high, sumHigh);
  }
});

test('Paver Patio - 10. Invalid and boundary inputs fail cleanly with INVALID_NUMBER instead of silent clamping', () => {
  const invalidCases = [
    { patioLength: 0, patioWidth: 10 },
    { patioLength: -10, patioWidth: 10 },
    { patioLength: Number.NaN, patioWidth: 10 },
    { patioLength: 15, patioWidth: 0 },
    { patioLength: 15, patioWidth: Number.POSITIVE_INFINITY },
    { patioLength: 15, patioWidth: 12, paverLengthInches: 0 },
    { patioLength: 15, patioWidth: 12, paverWidthInches: -4 },
    { patioLength: 15, patioWidth: 12, paverLengthInches: Number.NaN },
    { patioLength: 15, patioWidth: 12, baseDepthInches: 0 },
    { patioLength: 15, patioWidth: 12, baseDepthInches: -4 },
    { patioLength: 15, patioWidth: 12, baseDepthInches: 1 },
    { patioLength: 15, patioWidth: 12, baseDepthInches: 30 },
    { patioLength: 15, patioWidth: 12, baseDepthInches: Number.NaN },
    { patioLength: 15, patioWidth: 12, wastePercentage: -5 },
    { patioLength: 15, patioWidth: 12, wastePercentage: 120 },
    { patioLength: 15, patioWidth: 12, wastePercentage: Number.NaN },
  ];

  for (const input of invalidCases) {
    const res = calculatePaverPatio(input);
    assert.equal(res.success, false, `Expected failure for ${JSON.stringify(input)}`);
    if (!res.success) {
      assert.ok(res.errors.length > 0);
      assert.equal(res.errors[0].code, 'INVALID_NUMBER');
    }
  }
});

import test from 'node:test';
import assert from 'node:assert/strict';

import { calculateTile } from '../src/scripts/calculators/tile.ts';
import { getPriceBenchmark } from '../src/data/prices.ts';

test('Tile Calculator - grout joint width directly drives grout weight and bag count', () => {
  // 600 sq ft floor with 12x12x3/8" tile across 4 joint widths
  const jointWidths = [0.0625, 0.125, 0.1875, 0.25];
  const results = jointWidths.map((groutJointWidthInches) =>
    calculateTile({
      areaLength: 30,
      areaWidth: 20,
      tileLengthInches: 12,
      tileWidthInches: 12,
      tileThicknessInches: 0.375,
      groutJointWidthInches,
    })
  );

  for (const r of results) {
    assert.equal(r.success, true);
  }

  const outs = results.map((r) => (r.success ? r.outputs : null)!);

  // Strictly increasing grout volume, weight, and bag counts across 1/16", 1/8", 3/16", 1/4"
  assert.ok(outs[1].groutVolumeCuIn > outs[0].groutVolumeCuIn);
  assert.ok(outs[2].groutVolumeCuIn > outs[1].groutVolumeCuIn);
  assert.ok(outs[3].groutVolumeCuIn > outs[2].groutVolumeCuIn);

  assert.ok(outs[1].groutRecommendedLbs > outs[0].groutRecommendedLbs);
  assert.ok(outs[2].groutRecommendedLbs > outs[1].groutRecommendedLbs);
  assert.ok(outs[3].groutRecommendedLbs > outs[2].groutRecommendedLbs);

  // At 600 sq ft: 1/16" => 1 bag, 1/8" => 2 bags, 3/16" => 3 bags, 1/4" => 4 bags
  assert.equal(outs[0].grout25lbBags, 1);
  assert.equal(outs[1].grout25lbBags, 2);
  assert.equal(outs[2].grout25lbBags, 3);
  assert.equal(outs[3].grout25lbBags, 4);
});

test('Tile Calculator - tile dimensions inversely affect grout consumption', () => {
  // Same 150 sq ft area, 1/8" joint, 3/8" thickness: 3x6 subway vs 12x12 vs 24x24
  const subway = calculateTile({
    areaLength: 15,
    areaWidth: 10,
    tileLengthInches: 6,
    tileWidthInches: 3,
    groutJointWidthInches: 0.125,
    tileThicknessInches: 0.375,
  });
  const standard = calculateTile({
    areaLength: 15,
    areaWidth: 10,
    tileLengthInches: 12,
    tileWidthInches: 12,
    groutJointWidthInches: 0.125,
    tileThicknessInches: 0.375,
  });
  const large = calculateTile({
    areaLength: 15,
    areaWidth: 10,
    tileLengthInches: 24,
    tileWidthInches: 24,
    groutJointWidthInches: 0.125,
    tileThicknessInches: 0.375,
  });

  assert.equal(subway.success, true);
  assert.equal(standard.success, true);
  assert.equal(large.success, true);

  if (subway.success && standard.success && large.success) {
    assert.ok(subway.outputs.groutRecommendedLbs > standard.outputs.groutRecommendedLbs);
    assert.ok(standard.outputs.groutRecommendedLbs > large.outputs.groutRecommendedLbs);
    // 150 sq ft of 3x6 subway at 1/8" uses > 25 lbs => 2 bags, whereas 12x12 and 24x24 need 1 bag
    assert.equal(subway.outputs.grout25lbBags, 2);
    assert.equal(standard.outputs.grout25lbBags, 1);
    assert.equal(large.outputs.grout25lbBags, 1);
  }
});

test('Tile Calculator - tile thickness sensitivity scales grout consumption linearly', () => {
  const thinWall = calculateTile({
    areaLength: 20,
    areaWidth: 10,
    tileLengthInches: 6,
    tileWidthInches: 3,
    tileThicknessInches: 0.25,
    groutJointWidthInches: 0.125,
  });
  const thickStone = calculateTile({
    areaLength: 20,
    areaWidth: 10,
    tileLengthInches: 6,
    tileWidthInches: 3,
    tileThicknessInches: 0.5,
    groutJointWidthInches: 0.125,
  });

  assert.equal(thinWall.success, true);
  assert.equal(thickStone.success, true);
  if (thinWall.success && thickStone.success) {
    assert.ok(Math.abs(thickStone.outputs.groutVolumeCuIn - thinWall.outputs.groutVolumeCuIn * 2) <= 0.2);
    assert.ok(Math.abs(thickStone.outputs.groutRecommendedLbs - thinWall.outputs.groutRecommendedLbs * 2) <= 0.05);
    assert.ok(thickStone.outputs.grout25lbBags > thinWall.outputs.grout25lbBags);
  }
});

test('Tile Calculator - trowel notch auto-selection and manual override affect mortar bags', () => {
  // 100 sq ft net (+10% bucket allowance = 110 sq ft effective)
  // < 8" tile => 1/4x1/4 (65 sq ft/bag => 110/65 = 1.69 => 2 bags)
  const smallTile = calculateTile({
    areaLength: 10,
    areaWidth: 10,
    tileLengthInches: 6,
    tileWidthInches: 3,
  });
  // 12x12 => 1/4x3/8 (50 sq ft/bag => 110/50 = 2.2 => 3 bags)
  const medTile = calculateTile({
    areaLength: 10,
    areaWidth: 10,
    tileLengthInches: 12,
    tileWidthInches: 12,
  });
  // 12x24 (>= 15") => 1/2x1/2 (35 sq ft/bag => 110/35 = 3.14 => 4 bags)
  const lftTile = calculateTile({
    areaLength: 10,
    areaWidth: 10,
    tileLengthInches: 24,
    tileWidthInches: 12,
  });
  // Manual override on 12x12 to 1/2x1/2
  const manualOverride = calculateTile({
    areaLength: 10,
    areaWidth: 10,
    tileLengthInches: 12,
    tileWidthInches: 12,
    trowelNotchSize: '1/2x1/2',
  });

  assert.equal(smallTile.success, true);
  assert.equal(medTile.success, true);
  assert.equal(lftTile.success, true);
  assert.equal(manualOverride.success, true);

  if (smallTile.success && medTile.success && lftTile.success && manualOverride.success) {
    assert.equal(smallTile.outputs.mortarTrowelNotch, '1/4x1/4');
    assert.equal(smallTile.outputs.thinsetMortar50lbBags, 2);

    assert.equal(medTile.outputs.mortarTrowelNotch, '1/4x3/8');
    assert.equal(medTile.outputs.thinsetMortar50lbBags, 3);

    assert.equal(lftTile.outputs.mortarTrowelNotch, '1/2x1/2');
    assert.equal(lftTile.outputs.thinsetMortar50lbBags, 4);

    assert.equal(manualOverride.outputs.mortarTrowelNotch, '1/2x1/2');
    assert.equal(manualOverride.outputs.thinsetMortar50lbBags, 4);
  }
});

test('Tile Calculator - package rounding boundaries and pattern waste separation', () => {
  // Exact boundary: 90 sq ft net, 0% waste, 15 sq ft/box => exactly 6 boxes
  const exactBox = calculateTile({
    areaLength: 10,
    areaWidth: 9,
    tileLengthInches: 12,
    tileWidthInches: 12,
    boxCoverageSqFt: 15,
    wastePercentage: 0,
  });
  assert.equal(exactBox.success, true);
  if (exactBox.success) {
    assert.equal(exactBox.outputs.boxesToPurchase, 6);
    assert.equal(exactBox.outputs.purchasedSqFt, 90);
  }

  // Just over boundary: 90.25 sq ft => 7 boxes
  const overBox = calculateTile({
    areaLength: 9.5,
    areaWidth: 9.5,
    tileLengthInches: 12,
    tileWidthInches: 12,
    boxCoverageSqFt: 15,
    wastePercentage: 0,
  });
  assert.equal(overBox.success, true);
  if (overBox.success) {
    assert.equal(overBox.outputs.boxesToPurchase, 7);
    assert.equal(overBox.outputs.purchasedSqFt, 105);
  }

  // Changing tile pattern cut waste (10% vs 18%) increases tile boxes without inflating subfloor mortar/grout
  const grid = calculateTile({
    areaLength: 10,
    areaWidth: 10,
    tileLengthInches: 12,
    tileWidthInches: 12,
    boxCoverageSqFt: 15,
    wastePercentage: 10,
  });
  const herringbone = calculateTile({
    areaLength: 10,
    areaWidth: 10,
    tileLengthInches: 12,
    tileWidthInches: 12,
    boxCoverageSqFt: 15,
    wastePercentage: 18,
  });
  assert.equal(grid.success, true);
  assert.equal(herringbone.success, true);
  if (grid.success && herringbone.success) {
    assert.equal(grid.outputs.boxesToPurchase, 8); // 110 / 15 = 7.33 => 8
    assert.equal(herringbone.outputs.boxesToPurchase, 8); // 118 / 15 = 7.87 => 8 (check 150 sq ft for clear step)
    assert.equal(grid.outputs.thinsetMortar50lbBags, herringbone.outputs.thinsetMortar50lbBags);
    assert.equal(grid.outputs.groutRecommendedLbs, herringbone.outputs.groutRecommendedLbs);
  }
});

test('Tile Calculator - Bill of Materials and Cost Estimate mathematical consistency', () => {
  const res = calculateTile({
    areaLength: 15,
    areaWidth: 12, // 180 sq ft net
    tileLengthInches: 12,
    tileWidthInches: 24,
    boxCoverageSqFt: 16,
    groutJointWidthInches: 0.1875,
    tileThicknessInches: 0.375,
    wastePercentage: 12,
  });

  assert.equal(res.success, true);
  if (!res.success) return;

  assert.equal(res.billOfMaterials.length, 3);
  const tileBom = res.billOfMaterials.find((b) => b.id === 'tile-boxes')!;
  const mortarBom = res.billOfMaterials.find((b) => b.id === 'mortar-bags')!;
  const groutBom = res.billOfMaterials.find((b) => b.id === 'grout-bags')!;

  // Invariant: exactQuantity <= recommendedQuantity <= purchaseQuantity (all in same packageUnit)
  for (const item of res.billOfMaterials) {
    assert.ok(item.exactQuantity <= item.recommendedQuantity, `${item.id}: exact <= recommended`);
    assert.ok(item.recommendedQuantity <= item.purchaseQuantity, `${item.id}: recommended <= purchase`);
  }

  assert.equal(tileBom.purchaseQuantity, res.outputs.boxesToPurchase);
  assert.equal(mortarBom.purchaseQuantity, res.outputs.thinsetMortar50lbBags);
  assert.equal(groutBom.purchaseQuantity, res.outputs.grout25lbBags);

  // Cost verification against prices.ts benchmarks
  const tileBench = getPriceBenchmark('tile-ceramic-porcelain')!;
  const mortarBench = getPriceBenchmark('tile-thinset-mortar-50lb')!;
  const groutBench = getPriceBenchmark('tile-grout-bag')!;

  assert.equal(tileBom.estimatedCost?.typical, Math.round(res.outputs.purchasedSqFt * tileBench.priceTypical));
  assert.equal(mortarBom.estimatedCost?.typical, Math.round(mortarBom.purchaseQuantity * mortarBench.priceTypical));
  assert.equal(groutBom.estimatedCost?.typical, Math.round(groutBom.purchaseQuantity * groutBench.priceTypical));

  // Total materialsOnly must equal exact sum of BOM item costs
  const sumLow = res.billOfMaterials.reduce((acc, item) => acc + (item.estimatedCost?.low ?? 0), 0);
  const sumTyp = res.billOfMaterials.reduce((acc, item) => acc + (item.estimatedCost?.typical ?? 0), 0);
  const sumHigh = res.billOfMaterials.reduce((acc, item) => acc + (item.estimatedCost?.high ?? 0), 0);

  assert.equal(res.costEstimate?.materialsOnly.low, sumLow);
  assert.equal(res.costEstimate?.materialsOnly.typical, sumTyp);
  assert.equal(res.costEstimate?.materialsOnly.high, sumHigh);
});

test('Tile Calculator - invalid optional and core inputs fail cleanly without NaN or Infinity', () => {
  const invalidCases = [
    { areaLength: 10, areaWidth: 8, tileLengthInches: 12, tileWidthInches: 12, boxCoverageSqFt: 0 },
    { areaLength: 10, areaWidth: 8, tileLengthInches: 12, tileWidthInches: 12, boxCoverageSqFt: -15 },
    { areaLength: 10, areaWidth: 8, tileLengthInches: 12, tileWidthInches: 12, groutJointWidthInches: 0 },
    { areaLength: 10, areaWidth: 8, tileLengthInches: 12, tileWidthInches: 12, groutJointWidthInches: -0.125 },
    { areaLength: 10, areaWidth: 8, tileLengthInches: 12, tileWidthInches: 12, groutJointWidthInches: 5 },
    { areaLength: 10, areaWidth: 8, tileLengthInches: 12, tileWidthInches: 12, tileThicknessInches: 0 },
    { areaLength: 10, areaWidth: 8, tileLengthInches: 12, tileWidthInches: 12, tileThicknessInches: -0.375 },
    { areaLength: 10, areaWidth: 8, tileLengthInches: 12, tileWidthInches: 12, wastePercentage: -5 },
    { areaLength: 10, areaWidth: 8, tileLengthInches: 12, tileWidthInches: 12, wastePercentage: 150 },
    { areaLength: 10, areaWidth: 8, tileLengthInches: 12, tileWidthInches: 12, groutJointWidthInches: Number.NaN },
  ];

  for (const input of invalidCases) {
    const res = calculateTile(input);
    assert.equal(res.success, false, `Expected failure for ${JSON.stringify(input)}`);
    if (!res.success) {
      assert.ok(res.errors.length > 0);
      assert.equal(res.errors[0].code, 'INVALID_NUMBER');
    }
  }
});

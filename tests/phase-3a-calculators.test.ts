import test from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateConcretePostHole,
  calculateGravel,
  calculateSod,
} from '../src/scripts/calculators/index.ts';

// -------------------------------------------------------------
// CONCRETE POST HOLE CALCULATOR TESTS
// -------------------------------------------------------------
test('Concrete Post Hole - single hole with 4x4 post', () => {
  const res = calculateConcretePostHole({
    holeCount: 1,
    holeDiameterInches: 10,
    holeDepthInches: 36,
    postSize: '4x4',
    wastePercentage: 10,
  });

  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.outputs.holeCount, 1);
    // 10" diameter, 36" depth cylinder: π * (5/12)^2 * 3 = 1.636 cu ft
    assert.equal(res.outputs.cylinderVolumePerHoleCuFt, 1.64);
    // 4x4 post (3.5" x 3.5") 36" deep: (3.5/12) * (3.5/12) * 3 = 0.255 cu ft
    assert.equal(res.outputs.postDisplacementPerHoleCuFt, 0.26);
    // Net per hole: 1.64 - 0.26 = 1.38 cu ft
    assert.equal(res.outputs.netConcretePerHoleCuFt, 1.38);
    // Recommended with 10% buffer: 1.38 * 1.10 = 1.52 cu ft
    assert.equal(res.outputs.recommendedTotalCuFt, 1.52);
    // 80lb bags (0.60 cu ft/bag): 1.52 / 0.60 = 2.53 => 3 bags
    assert.equal(res.outputs.totalBags80lbToPurchase, 3);
    // 60lb bags (0.45 cu ft/bag): 1.52 / 0.45 = 3.38 => 4 bags
    assert.equal(res.outputs.totalBags60lbToPurchase, 4);
  }
});

test('Concrete Post Hole - multiple holes (10 holes) with 6x6 post', () => {
  const res = calculateConcretePostHole({
    holeCount: 10,
    holeDiameterInches: 12,
    holeDepthInches: 42,
    postSize: '6x6',
    wastePercentage: 10,
  });

  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.outputs.holeCount, 10);
    // 6x6 post (5.5" x 5.5") 42" deep: (5.5/12) * (5.5/12) * 3.5 = 0.735 cu ft
    assert.ok(res.outputs.postDisplacementPerHoleCuFt > 0.7);
    assert.equal(res.outputs.totalBags80lbToPurchase, 37);
    assert.ok(res.outputs.totalBags60lbToPurchase > res.outputs.totalBags80lbToPurchase);
  }
});

test('Concrete Post Hole - post displacement types (round steel pipe vs none)', () => {
  // Round steel pipe 2-3/8" OD
  const roundRes = calculateConcretePostHole({
    holeCount: 1,
    holeDiameterInches: 10,
    holeDepthInches: 36,
    postSize: 'round-2.375',
    wastePercentage: 0,
  });
  assert.equal(roundRes.success, true);
  if (roundRes.success) {
    // Pipe displacement is approx 0.11 cu ft
    assert.ok(roundRes.outputs.postDisplacementPerHoleCuFt > 0.08 && roundRes.outputs.postDisplacementPerHoleCuFt < 0.15);
  }

  // No post (Sonotube / Pier)
  const noneRes = calculateConcretePostHole({
    holeCount: 1,
    holeDiameterInches: 10,
    holeDepthInches: 36,
    postSize: 'none',
    wastePercentage: 0,
  });
  assert.equal(noneRes.success, true);
  if (noneRes.success) {
    assert.equal(noneRes.outputs.postDisplacementPerHoleCuFt, 0);
    assert.equal(noneRes.outputs.netConcretePerHoleCuFt, noneRes.outputs.cylinderVolumePerHoleCuFt);
  }
});

test('Concrete Post Hole - invalid geometry (hole smaller than post diagonal)', () => {
  // 6x6 post diagonal is 7.78 inches. A 6-inch diameter hole cannot fit it.
  const failRes = calculateConcretePostHole({
    holeCount: 5,
    holeDiameterInches: 6,
    holeDepthInches: 36,
    postSize: '6x6',
  });
  assert.equal(failRes.success, false);
  if (!failRes.success) {
    assert.equal(failRes.errors[0].code, 'IMPOSSIBLE_GEOMETRY');
  }
});

test('Concrete Post Hole - zero or negative dimensions', () => {
  const failCount = calculateConcretePostHole({ holeCount: 0, holeDiameterInches: 10, holeDepthInches: 36 });
  assert.equal(failCount.success, false);

  const failDepth = calculateConcretePostHole({ holeCount: 1, holeDiameterInches: 10, holeDepthInches: -10 });
  assert.equal(failDepth.success, false);
});

// -------------------------------------------------------------
// GRAVEL & CRUSHED STONE CALCULATOR TESTS
// -------------------------------------------------------------
test('Gravel - area x depth conversion & cubic yard calculation', () => {
  // 30 ft x 15 ft = 450 sq ft
  // Depth 3 inches = 0.25 ft
  // Geometric cu ft = 450 * 0.25 = 112.5 cu ft
  // Geometric cu yds = 112.5 / 27 = 4.167 cu yds
  const res = calculateGravel({
    gravelLength: 30,
    gravelWidth: 15,
    gravelDepthInches: 3,
    stoneType: 'crushed-stone',
    wastePercentage: 0,
  });

  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.outputs.areaSqFt, 450);
    assert.equal(res.outputs.geometricVolumeCuFt, 112.5);
    assert.equal(res.outputs.geometricVolumeCuYds, 4.17);
    assert.equal(res.outputs.recommendedVolumeCuYds, 4.17);
  }
});

test('Gravel - density selection affects total tonnage', () => {
  const input = { gravelLength: 20, gravelWidth: 10, gravelDepthInches: 4, wastePercentage: 10 };

  const crushed = calculateGravel({ ...input, stoneType: 'crushed-stone' });
  const dense = calculateGravel({ ...input, stoneType: 'dense-grade' });
  const pea = calculateGravel({ ...input, stoneType: 'pea-gravel' });

  assert.equal(crushed.success, true);
  assert.equal(dense.success, true);
  assert.equal(pea.success, true);

  if (crushed.success && dense.success && pea.success) {
    assert.equal(crushed.outputs.stoneDensityTonsPerYard, 1.40);
    assert.equal(pea.outputs.stoneDensityTonsPerYard, 1.45);
    assert.equal(dense.outputs.stoneDensityTonsPerYard, 1.55);

    // Dense grade must yield heavier tonnage than crushed stone for same volume
    assert.ok(dense.outputs.estimatedTons > crushed.outputs.estimatedTons);
    assert.ok(pea.outputs.estimatedTons > crushed.outputs.estimatedTons);
  }
});

test('Gravel - 50-lb bag rounding (1 ton = 40 bags)', () => {
  const res = calculateGravel({
    gravelLength: 10,
    gravelWidth: 10,
    gravelDepthInches: 2,
    stoneType: 'crushed-stone', // 1.40 tons/yd
    wastePercentage: 0,
  });

  assert.equal(res.success, true);
  if (res.success) {
    // 100 sq ft * (2/12) / 27 = 0.617 cu yds.
    // 0.617 * 1.40 = 0.864 tons = 1,728 lbs.
    // 1,728 / 50 = 34.57 => 35 bags of 50-lb.
    assert.equal(res.outputs.bags50lbToPurchase, 35);
  }
});

test('Gravel - zero and invalid inputs', () => {
  const failLength = calculateGravel({ gravelLength: 0, gravelWidth: 10, gravelDepthInches: 4 });
  assert.equal(failLength.success, false);

  const failDepth = calculateGravel({ gravelLength: 20, gravelWidth: 10, gravelDepthInches: -4 });
  assert.equal(failDepth.success, false);
});

// -------------------------------------------------------------
// SOD ROLL & PALLET CALCULATOR TESTS
// -------------------------------------------------------------
test('Sod - lawn area & waste application', () => {
  // 40 ft x 25 ft = 1,000 sq ft.
  // 10% waste => 1,100 sq ft recommended.
  const res = calculateSod({
    lawnLength: 40,
    lawnWidth: 25,
    palletCoverageSqFt: 450,
    wastePercentage: 10,
  });

  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.outputs.netAreaSqFt, 1000);
    assert.equal(res.outputs.recommendedAreaSqFt, 1100);
    // 1,100 / 450 = 2.44 pallets => 3 full pallets
    assert.equal(res.outputs.palletsToPurchase, 3);
    // Purchased coverage: 3 * 450 = 1,350 sq ft
    assert.equal(res.outputs.purchasedSqFt, 1350);
    // Rolls equivalent: 1,100 / 10 = 110 rolls
    assert.equal(res.outputs.rollsEquivalent, 110);
  }
});

test('Sod - exact boundary rounding for pallets and rolls', () => {
  // Exactly 450 sq ft with 0% waste => exactly 1 pallet
  const exactRes = calculateSod({
    lawnLength: 45,
    lawnWidth: 10,
    palletCoverageSqFt: 450,
    wastePercentage: 0,
  });

  assert.equal(exactRes.success, true);
  if (exactRes.success) {
    assert.equal(exactRes.outputs.netAreaSqFt, 450);
    assert.equal(exactRes.outputs.palletsToPurchase, 1);
    assert.equal(exactRes.outputs.purchasedSqFt, 450);
    assert.equal(exactRes.outputs.rollsEquivalent, 45);
  }

  // 451 sq ft with 0% waste => 2 pallets
  const overRes = calculateSod({
    lawnLength: 45.1,
    lawnWidth: 10,
    palletCoverageSqFt: 450,
    wastePercentage: 0,
  });

  assert.equal(overRes.success, true);
  if (overRes.success) {
    assert.equal(overRes.outputs.palletsToPurchase, 2);
    assert.equal(overRes.outputs.purchasedSqFt, 900);
  }
});

test('Sod - zero or negative dimensions', () => {
  const failLength = calculateSod({ lawnLength: -50, lawnWidth: 30 });
  assert.equal(failLength.success, false);

  const failZeroWidth = calculateSod({ lawnLength: 50, lawnWidth: 0 });
  assert.equal(failZeroWidth.success, false);
});

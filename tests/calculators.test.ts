import test from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateFlooring,
  calculateTile,
  calculatePaint,
  calculateConcreteSlab,
  calculateConcretePostHole,
  calculateMulch,
  calculateGravel,
  calculateSod,
  calculateDrywall,
  calculateDeckMaterial,
  calculateFenceMaterial,
  calculateRoofing,
  calculatePaverPatio,
  calculateTopsoil,
  calculateBaseboardTrim,
  runCalculator,
} from '../src/scripts/calculators/index.ts';

// 1. Flooring Calculator Tests
test('1. Flooring Calculator - realistic room & edge cases', () => {
  // Realistic: 16x12 room = 192 sq ft. 10% waste => 211.2 sq ft. 20 sq ft/carton => 10.56 cartons => 11 cartons.
  const res = calculateFlooring({
    roomLength: 16,
    roomWidth: 12,
    cartonCoverage: 20,
    wastePercentage: 10,
    includeUnderlayment: true,
  });

  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.outputs.netAreaSqFt, 192);
    assert.equal(res.outputs.recommendedPurchaseSqFt, 211.2);
    assert.equal(res.outputs.cartonsToPurchase, 11);
    assert.equal(res.outputs.purchasedSqFt, 220);
    assert.equal(res.outputs.underlaymentRolls, 3); // 211.2 / 100 => 3 rolls
    assert.ok(res.costEstimate?.hasPricing);
    assert.ok(res.billOfMaterials && res.billOfMaterials.length >= 2);
  }

  // Edge Case: Zero / Negative
  const failRes = calculateFlooring({ roomLength: 0, roomWidth: 12 });
  assert.equal(failRes.success, false);
  if (!failRes.success) {
    assert.equal(failRes.errors[0].code, 'INVALID_NUMBER');
  }
});

// 2. Tile Calculator Tests
test('2. Tile Calculator - realistic bathroom floor & pattern waste', () => {
  // 10x8 room = 80 sq ft. 12x12 tile (1 sq ft each). 15 sq ft/box. 10% waste => 88 sq ft => 6 boxes.
  const res = calculateTile({
    areaLength: 10,
    areaWidth: 8,
    tileLengthInches: 12,
    tileWidthInches: 12,
    boxCoverageSqFt: 15,
    wastePercentage: 10,
  });

  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.outputs.netAreaSqFt, 80);
    assert.equal(res.outputs.recommendedAreaSqFt, 88);
    assert.equal(res.outputs.recommendedTilesWithWaste, 88);
    assert.equal(res.outputs.boxesToPurchase, 6);
    assert.ok(res.outputs.thinsetMortar50lbBags >= 2);
  }

  // Edge case: Negative tile dimension
  const failRes = calculateTile({
    areaLength: 10,
    areaWidth: 8,
    tileLengthInches: -12,
    tileWidthInches: 12,
  });
  assert.equal(failRes.success, false);
});

// 3. Paint Calculator Tests
test('3. Paint Calculator - standard bedroom with door and window deductions', () => {
  // 14x12 room, 8ft ceilings: Perimeter = 52 ft. Gross wall = 416 sq ft.
  // 2 doors (-42 sq ft), 2 windows (-30 sq ft) => Net wall = 344 sq ft.
  // 2 coats = 688 coated sq ft. At 350 sq ft/gal => 1.965 gal => 2 gallons to purchase.
  const res = calculatePaint({
    roomLength: 14,
    roomWidth: 12,
    wallHeight: 8,
    doorCount: 2,
    windowCount: 2,
    coatCount: 2,
    coveragePerGallon: 350,
  });

  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.outputs.grossWallAreaSqFt, 416);
    assert.equal(res.outputs.doorWindowDeductionsSqFt, 72);
    assert.equal(res.outputs.netWallAreaSqFt, 344);
    assert.equal(res.outputs.wallGallonsToPurchase, 2);
  }

  // Edge case: Missing/zero wall height
  const failRes = calculatePaint({ roomLength: 14, roomWidth: 12, wallHeight: 0 });
  assert.equal(failRes.success, false);
});

// 4. Concrete Slab Calculator Tests
test('4. Concrete Slab Calculator - 10x10 patio 4 inches thick', () => {
  // 10 x 10 x 4" = 100 sq ft * 0.333 ft = 33.33 cu ft = 1.235 cu yds.
  // 10% waste => 36.67 cu ft = 1.358 cu yds.
  // 80lb bags (0.6 cu ft/bag) => 36.67 / 0.6 = 61.11 => 62 bags.
  const res = calculateConcreteSlab({
    slabLength: 10,
    slabWidth: 10,
    slabThickness: 4,
    wastePercentage: 10,
  });

  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.outputs.slabAreaSqFt, 100);
    assert.equal(res.outputs.bags80lbToPurchase, 62);
    assert.equal(res.outputs.isReadyMixRecommended, false); // < 1.5 yds
  }

  // Large pour triggering ready-mix recommendation
  const largeRes = calculateConcreteSlab({
    slabLength: 20,
    slabWidth: 20,
    slabThickness: 4,
    wastePercentage: 10,
  });
  assert.equal(largeRes.success, true);
  if (largeRes.success) {
    assert.equal(largeRes.outputs.isReadyMixRecommended, true);
  }
});

// 5. Concrete Post Hole Calculator Tests
test('5. Concrete Post Hole Calculator - 10 fence posts at 10" diameter and 36" depth', () => {
  const res = calculateConcretePostHole({
    holeCount: 10,
    holeDiameterInches: 10,
    holeDepthInches: 36,
    postSize: '4x4',
    wastePercentage: 10,
  });

  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.outputs.holeCount, 10);
    assert.ok(res.outputs.cylinderVolumePerHoleCuFt > 1.6);
    assert.ok(res.outputs.postDisplacementPerHoleCuFt > 0.2);
    assert.ok(res.outputs.totalBags80lbToPurchase >= 24);
  }

  // Edge case: Negative depth
  const failRes = calculateConcretePostHole({
    holeCount: 10,
    holeDiameterInches: 10,
    holeDepthInches: -36,
  });
  assert.equal(failRes.success, false);
});

// 6. Mulch Calculator Tests
test('6. Mulch Calculator - 30x6 flower bed at 3 inches depth', () => {
  // 30 x 6 = 180 sq ft. At 3" depth (0.25 ft) = 45 cu ft = 1.667 cu yds.
  // 5% settling => 47.25 cu ft = 1.75 cu yds.
  // 2 cu ft bags => 47.25 / 2 = 23.625 => 24 bags.
  const res = calculateMulch({
    bedLength: 30,
    bedWidth: 6,
    mulchDepthInches: 3,
    wastePercentage: 5,
  });

  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.outputs.bedAreaSqFt, 180);
    assert.equal(res.outputs.bags2cuftToPurchase, 24);
    assert.equal(res.outputs.bags3cuftToPurchase, 16);
  }
});

// 7. Gravel Calculator Tests
test('7. Gravel Calculator - 20x10 driveway pad at 4 inches depth with dense-grade stone', () => {
  // 20 x 10 = 200 sq ft. 4" depth = 66.67 cu ft = 2.469 cu yds.
  // 10% compaction => 2.716 cu yds. Dense grade (1.55 tons/yd) => 4.21 tons.
  const res = calculateGravel({
    gravelLength: 20,
    gravelWidth: 10,
    gravelDepthInches: 4,
    stoneType: 'dense-grade',
    wastePercentage: 10,
  });

  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.outputs.areaSqFt, 200);
    assert.equal(res.outputs.stoneDensityTonsPerYard, 1.55);
    assert.ok(res.outputs.estimatedTons >= 4.0 && res.outputs.estimatedTons <= 4.5);
  }
});

// 8. Sod Calculator Tests
test('8. Sod Calculator - 50x30 lawn with 8% waste', () => {
  // 50 x 30 = 1500 sq ft. 8% waste => 1620 sq ft.
  // 450 sq ft per pallet => 1620 / 450 = 3.6 pallets => 4 pallets.
  const res = calculateSod({
    lawnLength: 50,
    lawnWidth: 30,
    palletCoverageSqFt: 450,
    wastePercentage: 8,
  });

  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.outputs.netAreaSqFt, 1500);
    assert.equal(res.outputs.recommendedAreaSqFt, 1620);
    assert.equal(res.outputs.palletsToPurchase, 4);
    assert.equal(res.outputs.rollsEquivalent, 162);
  }
});

// 9. Drywall Calculator Tests
test('9. Drywall Calculator - 16x12 room with 8ft ceiling & ceiling included', () => {
  // Walls: 2*(16+12)*8 = 448 sq ft. Ceiling: 16*12 = 192 sq ft. Total = 640 sq ft.
  // 1 door (21) + 2 windows (30) = 51 deduction => 589 net.
  // 10% waste => 647.9 sq ft.
  // 4x8 sheets (32 sq ft) => 647.9 / 32 = 20.24 => 21 sheets.
  // 4x12 sheets (48 sq ft) => 647.9 / 48 = 13.49 => 14 sheets.
  const res = calculateDrywall({
    roomLength: 16,
    roomWidth: 12,
    ceilingHeight: 8,
    includeCeiling: true,
    doorCount: 1,
    windowCount: 2,
    wastePercentage: 10,
  });

  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.outputs.sheets4x8ToPurchase, 21);
    assert.equal(res.outputs.sheets4x12ToPurchase, 14);
    assert.ok(res.outputs.jointCompound45GalBuckets >= 2);
  }
});

// 10. Deck Material Calculator Tests
test('10. Deck Material Calculator - 16x12 rectangular deck', () => {
  // Length 16, Projection 12 (144 inches). Rows = ceil(144 / 5.625) = 26 rows.
  // Linear feet = 26 * 16 = 416 ft. 10% waste => 457.6 ft.
  // 16 ft boards => 457.6 / 16 = 28.6 => 29 boards.
  // Joists at 16" on-center = ceil(16*12 / 16) + 1 = 13 joists.
  const res = calculateDeckMaterial({
    deckLength: 16,
    deckWidth: 12,
    joistSpacingInches: 16,
    boardLengthStockFeet: 16,
    wastePercentage: 10,
  });

  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.outputs.deckAreaSqFt, 192);
    assert.equal(res.outputs.boardRowsCount, 26);
    assert.equal(res.outputs.deckBoardsToPurchase, 29);
    assert.equal(res.outputs.joistCount, 13);
  }
});

// 11. Fence Material Calculator Tests
test('11. Fence Material Calculator - 150 ft of 6ft privacy fence with 1 gate', () => {
  // 150 ft / 8ft spacing = 19 sections => 20 posts + (1 gate * 2) = 22 posts.
  // 6ft fence requires 3 rails per section => 19 * 3 = 57 rails.
  // 5.5" pickets: (150 * 12) / 5.5 = 327.27. 5% waste => 343.6 => 344 pickets.
  const res = calculateFenceMaterial({
    fenceLength: 150,
    fenceHeightFeet: 6,
    postSpacingFeet: 8,
    picketWidthInches: 5.5,
    gateCount: 1,
    wastePercentage: 5,
  });

  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.outputs.postsToPurchase, 22);
    assert.equal(res.outputs.railsToPurchase, 57);
    assert.equal(res.outputs.picketsToPurchase, 344);
    assert.equal(res.outputs.concrete60lbBagsToPurchase, 33); // 22 * 1.5 = 33 bags
  }
});

// 12. Roofing Calculator Tests
test('12. Roofing Calculator - 2000 sq ft footprint with 6/12 pitch', () => {
  // Pitch multiplier for 6/12 = 1.11803 => 2236.07 sq ft.
  // 10% waste => 2459.68 sq ft.
  // Squares = 2459.68 / 100 = 24.59 => 25 squares.
  // Shingle bundles = 25 * 3 = 75 bundles.
  // Underlayment (10 squares/roll) => 3 rolls.
  const res = calculateRoofing({
    footprintAreaSqFt: 2000,
    roofPitchRisePerFoot: 6,
    complexityWastePercentage: 10,
  });

  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.outputs.roofingSquaresToPurchase, 25);
    assert.equal(res.outputs.shingleBundlesToPurchase, 75);
    assert.equal(res.outputs.syntheticUnderlaymentRolls, 3);
  }
});

// 13. Paver Patio Calculator Tests
test('13. Paver Patio Calculator - 15x12 patio with 4x8 pavers and 4" base', () => {
  // 15x12 = 180 sq ft. Paver is 8x4 = 32 sq in (0.222 sq ft) => 810 pavers.
  // 10% waste => 891 pavers.
  // Polymeric sand (70 sq ft/bag) => 3 bags.
  const res = calculatePaverPatio({
    patioLength: 15,
    patioWidth: 12,
    paverLengthInches: 8,
    paverWidthInches: 4,
    baseDepthInches: 4,
    wastePercentage: 10,
  });

  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.outputs.patioAreaSqFt, 180);
    assert.equal(res.outputs.recommendedPaversToPurchase, 891);
    assert.ok(res.outputs.gravelBaseTons > 3.0);
    assert.equal(res.outputs.polymericSand50lbBags, 3);
  }
});

// 14. Topsoil Calculator Tests
test('14. Topsoil Calculator - 20x10 garden bed at 4 inches depth', () => {
  // 20 x 10 = 200 sq ft. 4" depth = 66.67 cu ft = 2.469 cu yds.
  // 10% settling => 73.33 cu ft = 2.716 cu yds.
  // 0.75 cu ft retail bags => 73.33 / 0.75 = 97.77 => 98 bags.
  const res = calculateTopsoil({
    bedLength: 20,
    bedWidth: 10,
    soilDepthInches: 4,
    wastePercentage: 10,
  });

  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.outputs.areaSqFt, 200);
    assert.equal(res.outputs.bags075cuftToPurchase, 98);
  }
});

// 15. Baseboard Trim Calculator Tests
test('15. Baseboard Trim Calculator - 16x12 room with 2 doors and 12-ft sticks', () => {
  // Perimeter = 2 * (16 + 12) = 56 linear ft.
  // 2 doors (-5 ft) => 51 net linear ft.
  // 15% miter waste => 58.65 linear ft.
  // 12-ft sticks => 58.65 / 12 = 4.88 => 5 sticks (60 linear ft).
  const res = calculateBaseboardTrim({
    roomLength: 16,
    roomWidth: 12,
    doorOpenings: 2,
    stickLengthFeet: 12,
    wastePercentage: 15,
  });

  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.outputs.grossPerimeterFeet, 56);
    assert.equal(res.outputs.doorwayDeductionFeet, 5);
    assert.equal(res.outputs.netLinearFeet, 51);
    assert.equal(res.outputs.sticksToPurchase, 5);
    assert.equal(res.outputs.purchasedLinearFeet, 60);
  }
});

// 16. Universal Dispatcher Test
test('Universal Calculator Dispatcher (runCalculator)', () => {
  const result = runCalculator('flooring-calculator', {
    roomLength: 10,
    roomWidth: 10,
    cartonCoverage: 20,
    wastePercentage: 10,
  });

  assert.equal(result.success, true);
  assert.equal(result.calculatorId, 'flooring-calculator');

  // Unknown calculator
  const unknown = runCalculator('non-existent-calc', {});
  assert.equal(unknown.success, false);
  if (!unknown.success) {
    assert.equal(unknown.errors[0].code, 'CALCULATOR_NOT_FOUND');
  }
});

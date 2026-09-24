import test from 'node:test';
import assert from 'node:assert/strict';

import { calculateDrywall } from '../src/scripts/calculators/drywall.ts';
import { calculateDeckMaterial } from '../src/scripts/calculators/deckMaterial.ts';
import { calculateFenceMaterial } from '../src/scripts/calculators/fenceMaterial.ts';

// ---------------------------------------------------------------------------
// 1. DRYWALL SHEET & MUD CALCULATOR TESTS
// ---------------------------------------------------------------------------

test('Drywall - 16x12 room with 8ft ceilings and ceiling included (4x8 vs 4x12)', () => {
  // Walls: 2 * (16 + 12) * 8 = 56 * 8 = 448 sq ft
  // Ceiling: 16 * 12 = 192 sq ft
  // Total Gross: 448 + 192 = 640 sq ft
  // Deductions: 1 door (21) + 2 windows (30) = 51 sq ft
  // Net: 640 - 51 = 589 sq ft
  // 10% waste: 589 * 1.10 = 647.9 sq ft
  // 4x8 (32 sq ft): ceil(647.9 / 32) = 21 sheets
  // 4x12 (48 sq ft): ceil(647.9 / 48) = 14 sheets
  // Compound buckets (400 sq ft/bucket): ceil(647.9 / 400) = 2 buckets
  // Tape rolls (600 sq ft/roll): ceil(647.9 / 600) = 2 rolls
  // Screws lbs (300 sq ft/lb): ceil(647.9 / 300) = 3 lbs
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
    assert.equal(res.outputs.wallAreaSqFt, 448);
    assert.equal(res.outputs.ceilingAreaSqFt, 192);
    assert.equal(res.outputs.totalGrossAreaSqFt, 640);
    assert.equal(res.outputs.openingsDeductionSqFt, 51);
    assert.equal(res.outputs.netDrywallAreaSqFt, 589);
    assert.equal(res.outputs.recommendedDrywallAreaSqFt, 647.9);
    assert.equal(res.outputs.sheets4x8ToPurchase, 21);
    assert.equal(res.outputs.sheets4x12ToPurchase, 14);
    assert.equal(res.outputs.jointCompound45GalBuckets, 2);
    assert.equal(res.outputs.drywallTape500ftRolls, 2);
    assert.equal(res.outputs.drywallScrewsLbs, 3);
  }
});

test('Drywall - Exclude ceiling toggle leaves only wall area', () => {
  const resWithCeiling = calculateDrywall({
    roomLength: 14,
    roomWidth: 10,
    ceilingHeight: 9,
    includeCeiling: true,
    wastePercentage: 10,
  });

  const resWithoutCeiling = calculateDrywall({
    roomLength: 14,
    roomWidth: 10,
    ceilingHeight: 9,
    includeCeiling: false,
    wastePercentage: 10,
  });

  assert.equal(resWithCeiling.success, true);
  assert.equal(resWithoutCeiling.success, true);

  if (resWithCeiling.success && resWithoutCeiling.success) {
    assert.equal(resWithoutCeiling.outputs.ceilingAreaSqFt, 0);
    assert.ok(resWithCeiling.outputs.netDrywallAreaSqFt > resWithoutCeiling.outputs.netDrywallAreaSqFt);
    assert.ok(resWithCeiling.outputs.sheets4x8ToPurchase > resWithoutCeiling.outputs.sheets4x8ToPurchase);
  }
});

test('Drywall - Invalid or zero dimensions return validation error', () => {
  const zeroLen = calculateDrywall({ roomLength: 0, roomWidth: 12, ceilingHeight: 8 });
  const zeroHeight = calculateDrywall({ roomLength: 14, roomWidth: 12, ceilingHeight: 0 });
  const negWidth = calculateDrywall({ roomLength: 14, roomWidth: -5, ceilingHeight: 8 });

  assert.equal(zeroLen.success, false);
  assert.equal(zeroHeight.success, false);
  assert.equal(negWidth.success, false);
});

// ---------------------------------------------------------------------------
// 2. DECK BOARD & FRAMING ESTIMATOR TESTS
// ---------------------------------------------------------------------------

test('Deck - 16x12 rectangular deck with 16" joist spacing and 16ft stock boards', () => {
  // Area: 16 * 12 = 192 sq ft
  // Projection inches: 12 * 12 = 144"
  // Rows: ceil(144 / 5.625) = ceil(25.6) = 26 rows
  // Net LF: 26 * 16 = 416 linear ft
  // 10% waste: 416 * 1.10 = 457.6 linear ft
  // 16ft boards: ceil(457.6 / 16) = ceil(28.6) = 29 boards
  // Purchased LF: 29 * 16 = 464 linear ft
  // Joists (16" OC across 16ft = 192"): ceil(192 / 16) + 1 = 12 + 1 = 13 joists
  // Fasteners: 26 rows * 13 joists * 2 screws * 1.10 = 743.6 => 744 screws
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
    assert.equal(res.outputs.netDeckingLinearFeet, 416);
    assert.equal(res.outputs.recommendedDeckingLinearFeet, 457.6);
    assert.equal(res.outputs.stockBoardLengthFeet, 16);
    assert.equal(res.outputs.deckBoardsToPurchase, 29);
    assert.equal(res.outputs.purchasedDeckingLinearFeet, 464);
    assert.equal(res.outputs.joistCount, 13);
    assert.equal(res.outputs.fastenersEstimate, 744);
  }
});

test('Deck - Joist spacing comparison (12" OC vs 16" OC)', () => {
  const res16 = calculateDeckMaterial({
    deckLength: 20,
    deckWidth: 14,
    joistSpacingInches: 16,
  });

  const res12 = calculateDeckMaterial({
    deckLength: 20,
    deckWidth: 14,
    joistSpacingInches: 12,
  });

  assert.equal(res16.success, true);
  assert.equal(res12.success, true);

  if (res16.success && res12.success) {
    // 20 ft = 240 inches. 16" OC: ceil(240/16)+1 = 16 joists. 12" OC: ceil(240/12)+1 = 21 joists.
    assert.equal(res16.outputs.joistCount, 16);
    assert.equal(res12.outputs.joistCount, 21);
    // 12" OC also requires more fasteners
    assert.ok(res12.outputs.fastenersEstimate > res16.outputs.fastenersEstimate);
  }
});

test('Deck - Stock board lengths (12ft vs 16ft vs 20ft)', () => {
  const input = { deckLength: 24, deckWidth: 16, wastePercentage: 10 };

  const res12 = calculateDeckMaterial({ ...input, boardLengthStockFeet: 12 });
  const res16 = calculateDeckMaterial({ ...input, boardLengthStockFeet: 16 });
  const res20 = calculateDeckMaterial({ ...input, boardLengthStockFeet: 20 });

  assert.equal(res12.success, true);
  assert.equal(res16.success, true);
  assert.equal(res20.success, true);

  if (res12.success && res16.success && res20.success) {
    // Shorter stock boards require a higher piece count to fulfill the same recommended linear footage
    assert.ok(res12.outputs.deckBoardsToPurchase > res16.outputs.deckBoardsToPurchase);
    assert.ok(res16.outputs.deckBoardsToPurchase > res20.outputs.deckBoardsToPurchase);
  }
});

test('Deck - Invalid or zero dimensions return validation error', () => {
  const zeroLength = calculateDeckMaterial({ deckLength: 0, deckWidth: 12 });
  const negWidth = calculateDeckMaterial({ deckLength: 16, deckWidth: -8 });

  assert.equal(zeroLength.success, false);
  assert.equal(negWidth.success, false);
});

// ---------------------------------------------------------------------------
// 3. WOOD PRIVACY FENCE CALCULATOR TESTS
// ---------------------------------------------------------------------------

test('Fence - 150 ft of 6ft privacy fence with 8ft spacing and 1 gate', () => {
  // Length: 150 ft. Post Spacing: 8 ft.
  // Sections: ceil(150 / 8) = 19 sections
  // Base posts: 19 + 1 = 20. Gate posts: 1 * 2 = 2. Total posts: 22 posts
  // Rails: 6ft fence requires 3 rails/section. 19 sections * 3 = 57 rails
  // Pickets (5.5" width + 0" gap): exact = (150 * 12) / 5.5 = 327.27. 5% waste: 327.27 * 1.05 = 343.64 => 344 pickets
  // Concrete bags: ceil(22 * 1.5) = ceil(33) = 33 bags (60-lb)
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
    assert.equal(res.outputs.fenceLengthFeet, 150);
    assert.equal(res.outputs.fenceHeightFeet, 6);
    assert.equal(res.outputs.postSpacingFeet, 8);
    assert.equal(res.outputs.sectionCount, 19);
    assert.equal(res.outputs.postsToPurchase, 22);
    assert.equal(res.outputs.railCountPerSection, 3);
    assert.equal(res.outputs.railsToPurchase, 57);
    assert.equal(res.outputs.picketsToPurchase, 344);
    assert.equal(res.outputs.concrete60lbBagsToPurchase, 33);
    // Bill of Materials has 4 items
    assert.equal(res.billOfMaterials.length, 4);
  }
});

test('Fence - 4ft height uses 2 rails per section vs 6ft/8ft height uses 3 rails', () => {
  const res4ft = calculateFenceMaterial({ fenceLength: 80, fenceHeightFeet: 4, postSpacingFeet: 8 });
  const res6ft = calculateFenceMaterial({ fenceLength: 80, fenceHeightFeet: 6, postSpacingFeet: 8 });
  const res8ft = calculateFenceMaterial({ fenceLength: 80, fenceHeightFeet: 8, postSpacingFeet: 8 });

  assert.equal(res4ft.success, true);
  assert.equal(res6ft.success, true);
  assert.equal(res8ft.success, true);

  if (res4ft.success && res6ft.success && res8ft.success) {
    assert.equal(res4ft.outputs.railCountPerSection, 2);
    assert.equal(res6ft.outputs.railCountPerSection, 3);
    assert.equal(res8ft.outputs.railCountPerSection, 3);
    assert.ok(res6ft.outputs.railsToPurchase > res4ft.outputs.railsToPurchase);
  }
});

test('Fence - Post spacing (6ft vs 8ft) affects post count, rails, and concrete', () => {
  const res8ft = calculateFenceMaterial({ fenceLength: 120, postSpacingFeet: 8, gateCount: 0 });
  const res6ft = calculateFenceMaterial({ fenceLength: 120, postSpacingFeet: 6, gateCount: 0 });

  assert.equal(res8ft.success, true);
  assert.equal(res6ft.success, true);

  if (res8ft.success && res6ft.success) {
    // 120 / 8 = 15 sections => 16 posts
    assert.equal(res8ft.outputs.sectionCount, 15);
    assert.equal(res8ft.outputs.postsToPurchase, 16);

    // 120 / 6 = 20 sections => 21 posts
    assert.equal(res6ft.outputs.sectionCount, 20);
    assert.equal(res6ft.outputs.postsToPurchase, 21);

    // 6ft post spacing requires more concrete bags
    assert.ok(res6ft.outputs.concrete60lbBagsToPurchase > res8ft.outputs.concrete60lbBagsToPurchase);
  }
});

test('Fence - Gate count adds 2 posts per gate', () => {
  const zeroGate = calculateFenceMaterial({ fenceLength: 100, gateCount: 0 });
  const twoGates = calculateFenceMaterial({ fenceLength: 100, gateCount: 2 });

  assert.equal(zeroGate.success, true);
  assert.equal(twoGates.success, true);

  if (zeroGate.success && twoGates.success) {
    assert.equal(twoGates.outputs.postsToPurchase - zeroGate.outputs.postsToPurchase, 4);
  }
});

test('Fence - Picket width comparison (3.5" vs 5.5")', () => {
  const resNarrow = calculateFenceMaterial({ fenceLength: 100, picketWidthInches: 3.5 });
  const resWide = calculateFenceMaterial({ fenceLength: 100, picketWidthInches: 5.5 });

  assert.equal(resNarrow.success, true);
  assert.equal(resWide.success, true);

  if (resNarrow.success && resWide.success) {
    assert.ok(resNarrow.outputs.picketsToPurchase > resWide.outputs.picketsToPurchase);
  }
});

test('Fence - Zero or negative length returns validation error', () => {
  const zeroLen = calculateFenceMaterial({ fenceLength: 0 });
  const negLen = calculateFenceMaterial({ fenceLength: -50 });

  assert.equal(zeroLen.success, false);
  assert.equal(negLen.success, false);
});

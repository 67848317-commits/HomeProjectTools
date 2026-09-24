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
} from '../src/scripts/calculators/index.ts';

import { getPriceBenchmark } from '../src/data/prices.ts';

test('Golden 1: Flooring - Net Area vs Purchase Quantity Separation', () => {
  // 20 ft x 15 ft = 300 sq ft net
  // 10% waste => 330 sq ft recommended
  // Carton coverage: 24 sq ft => 330 / 24 = 13.75 cartons => 14 cartons
  // Total purchased: 14 * 24 = 336 sq ft
  const res = calculateFlooring({
    roomLength: 20,
    roomWidth: 15,
    cartonCoverage: 24,
    wastePercentage: 10,
    includeUnderlayment: true,
  });

  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.outputs.netAreaSqFt, 300);
    assert.equal(res.outputs.recommendedPurchaseSqFt, 330);
    assert.equal(res.outputs.cartonsToPurchase, 14);
    assert.equal(res.outputs.purchasedSqFt, 336);
    assert.equal(res.outputs.underlaymentRolls, 4); // 330 / 100 = 3.3 => 4 rolls
    // Verify pricing applied to purchased cartons (336 sq ft)
    const lvpBench = getPriceBenchmark('flooring-lvp')!;
    const expectedMaterialTypical = Math.round(336 * lvpBench.priceTypical) + Math.round(4 * getPriceBenchmark('flooring-underlayment-roll')!.priceTypical);
    assert.equal(res.costEstimate?.materialsOnly.typical, expectedMaterialTypical);
  }
});

test('Golden 2: Tile - Pattern Waste & Packaging Separation', () => {
  // 12 ft x 10 ft = 120 sq ft net
  // Diagonal pattern: 15% waste => 138 sq ft recommended
  // 12" x 24" tile = 2 sq ft per tile => 60 net tiles, 69 recommended tiles
  // Box coverage: 16 sq ft => 138 / 16 = 8.625 boxes => 9 boxes
  // Purchased tile area: 9 * 16 = 144 sq ft
  const res = calculateTile({
    areaLength: 12,
    areaWidth: 10,
    tileLengthInches: 12,
    tileWidthInches: 24,
    boxCoverageSqFt: 16,
    wastePercentage: 15,
  });

  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.outputs.netAreaSqFt, 120);
    assert.equal(res.outputs.recommendedAreaSqFt, 138);
    assert.equal(res.outputs.exactTilesNeeded, 60);
    assert.equal(res.outputs.recommendedTilesWithWaste, 69);
    assert.equal(res.outputs.boxesToPurchase, 9);
    assert.equal(res.outputs.purchasedSqFt, 144);
    assert.equal(res.outputs.thinsetMortar50lbBags, 3); // 138 / 50 = 2.76 => 3 bags
    assert.equal(res.outputs.grout25lbBags, 1); // 138 / 150 = 0.92 => 1 bag
  }
});

test('Golden 3: Paint - Coat Multiplier Applied After Deductions', () => {
  // Room: 15 ft x 15 ft, 9 ft height
  // Perimeter: 60 ft, Gross Wall: 540 sq ft
  // Deductions: 1 door (21 sq ft) + 2 windows (30 sq ft) = 51 sq ft
  // Net Wall Area: 540 - 51 = 489 sq ft
  // 2 coats: 489 * 2 = 978 coated sq ft
  // Coverage: 350 sq ft/gal => 978 / 350 = 2.79 => 3 gallons wall paint
  // Ceiling: 15 x 15 = 225 sq ft => 225 / 350 = 0.64 => 1 gallon ceiling paint
  // Total: 4 gallons
  const res = calculatePaint({
    roomLength: 15,
    roomWidth: 15,
    wallHeight: 9,
    includeCeiling: true,
    doorCount: 1,
    windowCount: 2,
    coatCount: 2,
    coveragePerGallon: 350,
  });

  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.outputs.grossWallAreaSqFt, 540);
    assert.equal(res.outputs.doorWindowDeductionsSqFt, 51);
    assert.equal(res.outputs.netWallAreaSqFt, 489);
    assert.equal(res.outputs.ceilingAreaSqFt, 225);
    assert.equal(res.outputs.wallGallonsToPurchase, 3);
    assert.equal(res.outputs.ceilingGallonsToPurchase, 1);
    assert.equal(res.outputs.totalGallonsToPurchase, 4);
  }
});

test('Golden 4: Concrete Slab - Bag vs Ready-Mix Threshold & Exact Volume', () => {
  // 12 ft x 12 ft slab at 4" depth
  // Volume: 144 * (4/12) = 48 cu ft = 1.7778 cu yds
  // 10% ordering waste => 48 * 1.1 = 52.8 cu ft = 1.9556 cu yds
  // 80lb bags (0.60 cu ft yield): 52.8 / 0.60 = 88 bags
  // Over 1.5 yards threshold => ready-mix recommended
  const res = calculateConcreteSlab({
    slabLength: 12,
    slabWidth: 12,
    slabThickness: 4,
    wastePercentage: 10,
  });

  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.outputs.slabAreaSqFt, 144);
    assert.equal(res.outputs.geometricVolumeCuFt, 48);
    assert.equal(res.outputs.recommendedVolumeCuFt, 52.8);
    assert.equal(res.outputs.recommendedVolumeCuYds, 1.96);
    assert.equal(res.outputs.bags80lbToPurchase, 88);
    assert.equal(res.outputs.isReadyMixRecommended, true);
  }
});

test('Golden 5: Concrete Post Hole - Displacement, Geometry & Clearance Error', () => {
  // 12 holes, 12" diameter, 36" depth, 4x4 post
  // Cylinder: π * (0.5)^2 * 3 = 2.35619 cu ft per hole
  // Post displacement (3.5" x 3.5" x 36"): (3.5 * 3.5 * 36) / 1728 = 0.2552 cu ft per hole
  // Net concrete per hole: 2.35619 - 0.2552 = 2.10099 cu ft
  // 12 holes = 25.2119 cu ft
  // 10% waste => 27.733 cu ft
  // 80-lb bags (0.60 cu ft): 27.733 / 0.60 = 46.22 => 47 bags
  const res = calculateConcretePostHole({
    holeCount: 12,
    holeDiameterInches: 12,
    holeDepthInches: 36,
    postSize: '4x4',
    wastePercentage: 10,
  });

  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.outputs.cylinderVolumePerHoleCuFt, 2.36);
    assert.equal(res.outputs.postDisplacementPerHoleCuFt, 0.26);
    assert.equal(res.outputs.netConcretePerHoleCuFt, 2.1);
    assert.equal(res.outputs.totalBags80lbToPurchase, 47);
  }

  // Physical clearance validation: 4" hole for 4x4 post (diagonal 4.95") must fail gracefully
  const failRes = calculateConcretePostHole({
    holeCount: 5,
    holeDiameterInches: 4,
    holeDepthInches: 36,
    postSize: '4x4',
  });
  assert.equal(failRes.success, false);
  if (!failRes.success) {
    assert.equal(failRes.errors[0].code, 'IMPOSSIBLE_GEOMETRY');
  }
});

test('Golden 6: Mulch - Depth Conversion & Retail Bag Derivations', () => {
  // 40 ft x 5 ft bed = 200 sq ft at 3" depth
  // Volume: 200 * (3/12) = 50 cu ft = 1.8519 cu yds
  // 5% settling/waste => 52.5 cu ft = 1.944 cu yds => 1.94 cu yds
  // 2 cu ft retail bags: 52.5 / 2 = 26.25 => 27 bags
  // 3 cu ft bags: 52.5 / 3 = 17.5 => 18 bags
  const res = calculateMulch({
    bedLength: 40,
    bedWidth: 5,
    mulchDepthInches: 3,
    wastePercentage: 5,
  });

  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.outputs.bedAreaSqFt, 200);
    assert.equal(res.outputs.geometricVolumeCuFt, 50);
    assert.equal(res.outputs.recommendedVolumeCuFt, 52.5);
    assert.equal(res.outputs.recommendedVolumeCuYds, 1.94);
    assert.equal(res.outputs.bags2cuftToPurchase, 27);
    assert.equal(res.outputs.bags3cuftToPurchase, 18);
  }
});

test('Golden 7: Gravel - Stone Density & Ton Conversions', () => {
  // 30 ft x 10 ft driveway = 300 sq ft at 4" depth
  // Volume: 300 * (4/12) = 100 cu ft = 3.7037 cu yds
  // 10% compaction/waste => 4.074 cu yds
  // Dense grade base stone density: 1.55 tons/yd³
  // Weight: 4.074 * 1.55 = 6.3148 tons => 6.31 tons
  // 50-lb bags: (6.3148 * 2000) / 50 = 252.59 => 253 bags
  const res = calculateGravel({
    gravelLength: 30,
    gravelWidth: 10,
    gravelDepthInches: 4,
    stoneType: 'dense-grade',
    wastePercentage: 10,
  });

  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.outputs.areaSqFt, 300);
    assert.equal(res.outputs.recommendedVolumeCuYds, 4.07);
    assert.equal(res.outputs.stoneDensityTonsPerYard, 1.55);
    assert.equal(res.outputs.estimatedTons, 6.31);
    assert.equal(res.outputs.bags50lbToPurchase, 253);
  }
});

test('Golden 8: Sod - Pallet Packaging & Roll Equivalents', () => {
  // 40 ft x 25 ft lawn = 1,000 sq ft
  // 10% waste => 1,100 sq ft recommended
  // Standard pallet: 450 sq ft => 1100 / 450 = 2.44 pallets => 3 pallets
  // Purchased area: 3 * 450 = 1,350 sq ft
  // Equivalent 10 sq ft rolls: 1100 / 10 = 110 rolls
  const res = calculateSod({
    lawnLength: 40,
    lawnWidth: 25,
    wastePercentage: 10,
  });

  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.outputs.netAreaSqFt, 1000);
    assert.equal(res.outputs.recommendedAreaSqFt, 1100);
    assert.equal(res.outputs.palletsToPurchase, 3);
    assert.equal(res.outputs.purchasedSqFt, 1350);
    assert.equal(res.outputs.rollsEquivalent, 110);
  }
});

test('Golden 9: Drywall - Panel Counts, Compound Buckets & Benchmark Allowance', () => {
  // 20 ft x 15 ft room, 9 ft ceilings, ceiling included
  // Perimeter: 70 ft. Gross wall: 630 sq ft. Ceiling: 300 sq ft.
  // Deductions: 1 door (21) + 2 windows (30) = 51 sq ft
  // Net drywall area: 630 + 300 - 51 = 879 sq ft
  // 10% waste => 966.9 sq ft
  // 4x8 sheets (32 sq ft): 966.9 / 32 = 30.21 => 31 sheets
  // 4x12 sheets (48 sq ft): 966.9 / 48 = 20.14 => 21 sheets
  // Compound buckets (400 sq ft/bucket): 966.9 / 400 = 2.42 => 3 buckets
  const res = calculateDrywall({
    roomLength: 20,
    roomWidth: 15,
    ceilingHeight: 9,
    includeCeiling: true,
    doorCount: 1,
    windowCount: 2,
    wastePercentage: 10,
  });

  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.outputs.wallAreaSqFt, 630);
    assert.equal(res.outputs.ceilingAreaSqFt, 300);
    assert.equal(res.outputs.netDrywallAreaSqFt, 879);
    assert.equal(res.outputs.sheets4x8ToPurchase, 31);
    assert.equal(res.outputs.sheets4x12ToPurchase, 21);
    assert.equal(res.outputs.jointCompound45GalBuckets, 3);
    assert.equal(res.outputs.drywallTape500ftRolls, 2); // 966.9 / 600 => 2 rolls
    // Verify accessories benchmark pricing is active
    assert.ok(res.costEstimate?.materialsOnly.typical! > 500);
  }
});

test('Golden 10: Deck Material - Purchased Linear Feet & Framing Joists', () => {
  // Deck: 20 ft along house, 14 ft projection
  // Rows: projection 168" / 5.625" = 29.86 => 30 rows
  // Net linear feet: 30 * 20 = 600 linear ft
  // 10% waste => 660 linear ft
  // 16 ft stock boards: 660 / 16 = 41.25 => 42 boards
  // Purchased linear feet: 42 * 16 = 672 linear ft
  // Joists at 16" spacing: ceil(20*12 / 16) + 1 = 15 + 1 = 16 joists
  const res = calculateDeckMaterial({
    deckLength: 20,
    deckWidth: 14,
    joistSpacingInches: 16,
    boardLengthStockFeet: 16,
    wastePercentage: 10,
  });

  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.outputs.deckAreaSqFt, 280);
    assert.equal(res.outputs.boardRowsCount, 30);
    assert.equal(res.outputs.netDeckingLinearFeet, 600);
    assert.equal(res.outputs.recommendedDeckingLinearFeet, 660);
    assert.equal(res.outputs.deckBoardsToPurchase, 42);
    assert.equal(res.outputs.purchasedDeckingLinearFeet, 672);
    assert.equal(res.outputs.joistCount, 16);
    // Pricing must be based on purchased linear feet (672)
    const deckBench = getPriceBenchmark('deck-board-composite-lf')!;
    assert.equal(res.costEstimate?.materialsOnly.typical, Math.round(672 * deckBench.priceTypical));
  }
});

test('Golden 11: Fence Material - Rails by Height & Picket Pitch', () => {
  // 160 ft fence, 6 ft high, 8 ft spacing, 5.5" pickets with 0.5" gap (6" pitch)
  // Sections: 160 / 8 = 20 sections
  // Base posts: 20 + 1 = 21 posts. 2 gates (+4 posts) => 25 posts
  // 6 ft high => 3 rails per section => 20 * 3 = 60 rails
  // Pickets: (160 * 12) / 6 = 320 exact pickets
  // 5% waste => 336 pickets to purchase
  // Concrete: 25 posts * 1.5 = 37.5 => 38 bags
  const res = calculateFenceMaterial({
    fenceLength: 160,
    fenceHeightFeet: 6,
    postSpacingFeet: 8,
    picketWidthInches: 5.5,
    picketGapInches: 0.5,
    gateCount: 2,
    wastePercentage: 5,
  });

  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.outputs.sectionCount, 20);
    assert.equal(res.outputs.postsToPurchase, 25);
    assert.equal(res.outputs.railsToPurchase, 60);
    assert.equal(res.outputs.picketsToPurchase, 336);
    assert.equal(res.outputs.concrete60lbBagsToPurchase, 38);
  }
});

test('Golden 12: Roofing - Pitch Multiplier, Squares & Bundles Configuration', () => {
  // 1,800 sq ft footprint with 8/12 pitch
  // Pitch multiplier for 8/12: sqrt(1 + (8/12)^2) = sqrt(1 + 0.44444) = 1.20185
  // Actual roof area: 1800 * 1.20185 = 2163.33 sq ft
  // 15% complexity waste => 2487.83 sq ft
  // Roofing squares: 2487.83 / 100 = 24.88 => 25 squares
  // Configured bundles per square = 3 => 25 * 3 = 75 bundles
  // Synthetic underlayment (1000 sq ft rolls): 2487.83 / 1000 = 2.49 => 3 rolls
  const res = calculateRoofing({
    footprintAreaSqFt: 1800,
    roofPitchRisePerFoot: 8,
    complexityWastePercentage: 15,
    bundlesPerSquare: 3,
  });

  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.outputs.pitchMultiplier, 1.2019);
    assert.equal(res.outputs.actualRoofAreaSqFt, 2163.3);
    assert.equal(res.outputs.roofingSquaresToPurchase, 25);
    assert.equal(res.outputs.bundlesPerSquare, 3);
    assert.equal(res.outputs.shingleBundlesToPurchase, 75);
    assert.equal(res.outputs.syntheticUnderlaymentRolls, 3);
  }
});

test('Golden 13: Paver Patio - Extended Base, Bedding Sand & Polymeric Sand', () => {
  // 20 ft x 15 ft patio = 300 sq ft
  // Paver size 4x8 = 32 sq in (0.2222 sq ft) => 1350 exact pavers
  // 10% waste => 1485 pavers to purchase
  // Crushed base (6" horizontal extension): 21 ft x 16 ft x (4/12) = 112 cu ft = 4.148 cu yds
  // Compacted tons at 1.55 tons/yd³: 4.148 * 1.55 = 6.43 tons
  // Bedding sand (1" uncompacted layer): 20 x 15 x (1/12) = 25 cu ft = 0.9259 cu yds => 0.93 cu yds
  // Polymeric sand (70 sq ft/bag): 300 / 70 = 4.28 => 5 bags
  const res = calculatePaverPatio({
    patioLength: 20,
    patioWidth: 15,
    paverLengthInches: 8,
    paverWidthInches: 4,
    baseDepthInches: 4,
    wastePercentage: 10,
  });

  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.outputs.patioAreaSqFt, 300);
    assert.equal(res.outputs.recommendedPaversToPurchase, 1485);
    assert.equal(res.outputs.gravelBaseTons, 6.43);
    assert.equal(res.outputs.beddingSandCubicYards, 0.93);
    assert.equal(res.outputs.polymericSand50lbBags, 5);
    // Verify Bedding Sand is present in Bill of Materials
    const beddingItem = res.billOfMaterials.find((item) => item.id === 'bedding-sand');
    assert.ok(beddingItem, 'Bedding sand must be included in Bill of Materials');
    assert.equal(beddingItem?.benchmarkPriceId, 'sand-bedding-bulk-yard');
  }
});

test('Golden 14: Topsoil - Bulk Yards vs Retail Bags Benchmark', () => {
  // 25 ft x 12 ft garden bed = 300 sq ft at 6" depth
  // Volume: 300 * (6/12) = 150 cu ft = 5.556 cu yds
  // 10% settling factor => 165 cu ft = 6.111 cu yds => 6.11 cu yds
  // 0.75 cu ft bags: 165 / 0.75 = 220 bags
  // 1.0 cu ft bags: 165 / 1.0 = 165 bags
  const res = calculateTopsoil({
    bedLength: 25,
    bedWidth: 12,
    soilDepthInches: 6,
    wastePercentage: 10,
  });

  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.outputs.areaSqFt, 300);
    assert.equal(res.outputs.geometricVolumeCuFt, 150);
    assert.equal(res.outputs.recommendedVolumeCuFt, 165);
    assert.equal(res.outputs.recommendedVolumeCuYds, 6.11);
    assert.equal(res.outputs.bags075cuftToPurchase, 220);
    assert.equal(res.outputs.bags1cuftToPurchase, 165);
    // Since bags > 25, bulk pricing is selected
    const bulkBench = getPriceBenchmark('topsoil-bulk-yard')!;
    assert.equal(res.costEstimate?.materialsOnly.typical, Math.round(6.111 * bulkBench.priceTypical));
  }
});

test('Golden 15: Baseboard Trim - Miter Cut Allowance & Stock Piece Rounding', () => {
  // Room: 18 ft x 14 ft
  // Perimeter: 2 * (18 + 14) = 64 linear ft
  // Deductions: 3 doorways (3 * 2.5 = 7.5 ft) => 56.5 net linear ft
  // 15% miter waste => 56.5 * 1.15 = 64.975 linear ft
  // 12-ft sticks: 64.975 / 12 = 5.41 => 6 sticks
  // Purchased linear feet: 6 * 12 = 72 linear ft
  const res = calculateBaseboardTrim({
    roomLength: 18,
    roomWidth: 14,
    doorOpenings: 3,
    stickLengthFeet: 12,
    wastePercentage: 15,
  });

  assert.equal(res.success, true);
  if (res.success) {
    assert.equal(res.outputs.grossPerimeterFeet, 64);
    assert.equal(res.outputs.doorwayDeductionFeet, 7.5);
    assert.equal(res.outputs.netLinearFeet, 56.5);
    assert.equal(res.outputs.recommendedPurchaseLinearFeet, 65);
    assert.equal(res.outputs.sticksToPurchase, 6);
    assert.equal(res.outputs.purchasedLinearFeet, 72);
    const mdfBench = getPriceBenchmark('baseboard-mdf-primed')!;
    assert.equal(res.costEstimate?.materialsOnly.typical, Math.round(72 * mdfBench.priceTypical));
  }
});

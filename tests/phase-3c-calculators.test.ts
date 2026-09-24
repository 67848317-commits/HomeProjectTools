import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRoofing } from '../src/scripts/calculators/roofing.ts';
import { calculatePaverPatio } from '../src/scripts/calculators/paverPatio.ts';
import { calculateTopsoil } from '../src/scripts/calculators/topsoil.ts';
import { calculateBaseboardTrim } from '../src/scripts/calculators/baseboardTrim.ts';

// -----------------------------------------------------------------------------
// 1. ROOFING SHINGLE & BUNDLE CALCULATOR TESTS
// -----------------------------------------------------------------------------
test('Roofing - standard 2000 sq ft footprint with 6:12 pitch and 10% waste', () => {
  const res = calculateRoofing({
    footprintAreaSqFt: 2000,
    roofPitchRisePerFoot: 6,
    complexityWastePercentage: 10,
    bundlesPerSquare: 3,
  });

  assert.equal(res.success, true);
  if (!res.success) return;

  const out = res.outputs;
  // Pitch multiplier for 6:12 is sqrt(1 + (6/12)^2) = sqrt(1 + 0.25) = sqrt(1.25) ~= 1.11803
  assert.ok(Math.abs(out.pitchMultiplier - 1.118) < 0.001);

  // Actual roof area = 2000 * 1.1180339887 ~= 2236.1 sq ft
  assert.equal(out.actualRoofAreaSqFt, 2236.1);

  // Recommended area with 10% waste = 2236.0679 * 1.10 = 2459.67 sq ft -> 2459.7
  assert.equal(out.recommendedRoofAreaSqFt, 2459.7);

  // Roofing squares exact = 2459.67 / 100 = 24.60
  assert.equal(out.roofingSquaresExact, 24.6);

  // Commercial squares to purchase = ceil(24.60) = 25
  assert.equal(out.roofingSquaresToPurchase, 25);

  // Bundles to purchase = 25 * 3 = 75 bundles
  assert.equal(out.shingleBundlesToPurchase, 75);

  // Synthetic underlayment rolls (10 sq / 1000 sq ft rolls) = ceil(2459.7 / 1000) = 3 rolls
  assert.equal(out.syntheticUnderlaymentRolls, 3);
});

test('Roofing - flat roof (0:12 pitch) multiplier is exactly 1.0', () => {
  const res = calculateRoofing({
    footprintAreaSqFt: 1000,
    roofPitchRisePerFoot: 0,
    complexityWastePercentage: 10,
    bundlesPerSquare: 3,
  });

  assert.equal(res.success, true);
  if (!res.success) return;

  assert.equal(res.outputs.pitchMultiplier, 1.0);
  assert.equal(res.outputs.actualRoofAreaSqFt, 1000);
});

test('Roofing - configurable bundlesPerSquare (e.g. 4 bundles/square for designer shingles)', () => {
  const res = calculateRoofing({
    footprintAreaSqFt: 2000,
    roofPitchRisePerFoot: 6,
    complexityWastePercentage: 10,
    bundlesPerSquare: 4,
  });

  assert.equal(res.success, true);
  if (!res.success) return;

  assert.equal(res.outputs.bundlesPerSquare, 4);
  // 25 squares * 4 bundles/square = 100 bundles
  assert.equal(res.outputs.shingleBundlesToPurchase, 100);
});

test('Roofing - validation rejects zero or negative footprint', () => {
  const res = calculateRoofing({
    footprintAreaSqFt: 0,
    roofPitchRisePerFoot: 6,
  });

  assert.equal(res.success, false);
  if (res.success) return;

  assert.ok(res.errors && res.errors.length > 0);
  assert.equal(res.errors[0].field, 'footprintAreaSqFt');
});

// -----------------------------------------------------------------------------
// 2. PAVER PATIO CALCULATOR TESTS
// -----------------------------------------------------------------------------
test('Paver Patio - standard 15x12 patio with 4x8 pavers and 4" base depth', () => {
  const res = calculatePaverPatio({
    patioLength: 15,
    patioWidth: 12,
    paverLengthInches: 8,
    paverWidthInches: 4,
    baseDepthInches: 4,
    wastePercentage: 10,
  });

  assert.equal(res.success, true);
  if (!res.success) return;

  const out = res.outputs;
  // Patio area = 15 * 12 = 180 sq ft
  assert.equal(out.patioAreaSqFt, 180);

  // Single paver area = (8 * 4) / 144 = 32 / 144 = 0.2222 sq ft (4.5 pavers/sq ft)
  // Exact pavers = 180 * 4.5 = 810 pavers
  // Recommended pavers with 10% waste = 810 * 1.10 = 891 pavers
  assert.equal(out.recommendedPaversToPurchase, 891);

  // Crushed gravel base:
  // Base footprint with 6" extension on each side = (15 + 1) * (12 + 1) = 16 * 13 = 208 sq ft
  // Volume at 4" (1/3 ft) = 208 * 0.333333 = 69.333 cu ft
  // Cubic yards = 69.333 / 27 = 2.5679 cu yds
  // Tons at 1.55 tons/yd3 = 2.5679 * 1.55 = 3.98 tons
  assert.equal(out.gravelBaseTons, 3.98);

  // Bedding sand:
  // 1" layer across 180 sq ft = 180 * (1/12) = 15 cu ft
  // Cubic yards = 15 / 27 = 0.555... -> 0.56 cu yds
  assert.equal(out.beddingSandCubicYards, 0.56);

  // Polymeric joint sand: ceil(180 / 70) = ceil(2.57) = 3 bags
  assert.equal(out.polymericSand50lbBags, 3);
});

test('Paver Patio - configurable 6" base depth increases base tonnage without double-counting surface area', () => {
  const res = calculatePaverPatio({
    patioLength: 15,
    patioWidth: 12,
    paverLengthInches: 8,
    paverWidthInches: 4,
    baseDepthInches: 6,
    wastePercentage: 10,
  });

  assert.equal(res.success, true);
  if (!res.success) return;

  const out = res.outputs;
  assert.equal(out.baseDepthInches, 6);
  assert.equal(out.patioAreaSqFt, 180); // surface area remains identical
  assert.equal(out.recommendedPaversToPurchase, 891); // paver count unchanged

  // Base at 6" (0.5 ft): 208 sq ft * 0.5 = 104 cu ft / 27 = 3.8518 yd3 * 1.55 = 5.97 tons
  assert.equal(out.gravelBaseTons, 5.97);
});

test('Paver Patio - rejects non-positive dimensions', () => {
  const res = calculatePaverPatio({
    patioLength: -5,
    patioWidth: 10,
  });

  assert.equal(res.success, false);
});

// -----------------------------------------------------------------------------
// 3. TOPSOIL & GARDEN BED CALCULATOR TESTS
// -----------------------------------------------------------------------------
test('Topsoil - standard 20x10 bed at 4" installed depth with 10% organic settling', () => {
  const res = calculateTopsoil({
    bedLength: 20,
    bedWidth: 10,
    soilDepthInches: 4,
    wastePercentage: 10,
  });

  assert.equal(res.success, true);
  if (!res.success) return;

  const out = res.outputs;
  // Area = 20 * 10 = 200 sq ft
  assert.equal(out.areaSqFt, 200);

  // Geometric volume: 200 sq ft * (4 / 12) = 66.67 cu ft
  assert.equal(out.geometricVolumeCuFt, 66.67);

  // Geometric cubic yards = 66.6666 / 27 = 2.47 cu yds
  assert.equal(out.geometricVolumeCuYds, 2.47);

  // Organic settling 10%:
  // Recommended cu ft = 66.6666 * 1.10 = 73.33 cu ft
  assert.equal(out.recommendedVolumeCuFt, 73.33);

  // Recommended cu yds = 73.3333 / 27 = 2.72 cu yds
  assert.equal(out.recommendedVolumeCuYds, 2.72);

  // Commercial bags (0.75 cu ft): ceil(73.333 / 0.75) = ceil(97.77) = 98 bags
  assert.equal(out.bags075cuftToPurchase, 98);

  // Commercial bags (1.0 cu ft): ceil(73.333 / 1.0) = 74 bags
  assert.equal(out.bags1cuftToPurchase, 74);
});

test('Topsoil - rejects zero or negative depth', () => {
  const res = calculateTopsoil({
    bedLength: 10,
    bedWidth: 10,
    soilDepthInches: 0,
  });

  assert.equal(res.success, false);
});

// -----------------------------------------------------------------------------
// 4. BASEBOARD & TRIM MOLDING CALCULATOR TESTS
// -----------------------------------------------------------------------------
test('Baseboard - 16x12 room with 2 doorways and 12-foot stock sticks', () => {
  const res = calculateBaseboardTrim({
    roomLength: 16,
    roomWidth: 12,
    doorOpenings: 2,
    stickLengthFeet: 12,
    wastePercentage: 15,
  });

  assert.equal(res.success, true);
  if (!res.success) return;

  const out = res.outputs;
  // Gross perimeter = 2 * (16 + 12) = 56 linear feet
  assert.equal(out.grossPerimeterFeet, 56);

  // Doorway deduction = 2 * 2.5 = 5.0 linear feet
  assert.equal(out.doorwayDeductionFeet, 5);

  // Net linear feet = 56 - 5 = 51 linear feet
  assert.equal(out.netLinearFeet, 51);

  // Recommended with 15% miter allowance = 51 * 1.15 = 58.65 -> 58.7 lf
  assert.equal(out.recommendedPurchaseLinearFeet, 58.7);

  // Sticks of 12-ft molding = ceil(58.65 / 12) = ceil(4.8875) = 5 sticks
  assert.equal(out.sticksToPurchase, 5);

  // Purchased linear feet = 5 * 12 = 60 lf
  assert.equal(out.purchasedLinearFeet, 60);
});

test('Baseboard - stock length comparison across 8 ft, 12 ft, and 16 ft', () => {
  // Same 51 net linear feet, 58.65 recommended linear feet
  const res8 = calculateBaseboardTrim({
    roomLength: 16,
    roomWidth: 12,
    doorOpenings: 2,
    stickLengthFeet: 8,
    wastePercentage: 15,
  });
  const res12 = calculateBaseboardTrim({
    roomLength: 16,
    roomWidth: 12,
    doorOpenings: 2,
    stickLengthFeet: 12,
    wastePercentage: 15,
  });
  const res16 = calculateBaseboardTrim({
    roomLength: 16,
    roomWidth: 12,
    doorOpenings: 2,
    stickLengthFeet: 16,
    wastePercentage: 15,
  });

  assert.equal(res8.success, true);
  assert.equal(res12.success, true);
  assert.equal(res16.success, true);
  if (!res8.success || !res12.success || !res16.success) return;

  // 58.65 / 8 = 7.33 -> 8 sticks of 8-ft (64 lf)
  assert.equal(res8.outputs.sticksToPurchase, 8);
  assert.equal(res8.outputs.purchasedLinearFeet, 64);

  // 58.65 / 12 = 4.88 -> 5 sticks of 12-ft (60 lf)
  assert.equal(res12.outputs.sticksToPurchase, 5);
  assert.equal(res12.outputs.purchasedLinearFeet, 60);

  // 58.65 / 16 = 3.66 -> 4 sticks of 16-ft (64 lf)
  assert.equal(res16.outputs.sticksToPurchase, 4);
  assert.equal(res16.outputs.purchasedLinearFeet, 64);
});

test('Baseboard - zero doorways preserves full perimeter', () => {
  const res = calculateBaseboardTrim({
    roomLength: 10,
    roomWidth: 10,
    doorOpenings: 0,
    stickLengthFeet: 12,
    wastePercentage: 15,
  });

  assert.equal(res.success, true);
  if (!res.success) return;

  assert.equal(res.outputs.grossPerimeterFeet, 40);
  assert.equal(res.outputs.doorwayDeductionFeet, 0);
  assert.equal(res.outputs.netLinearFeet, 40);
});

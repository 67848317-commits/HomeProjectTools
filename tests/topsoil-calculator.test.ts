import test from 'node:test';
import assert from 'node:assert/strict';

import { calculateTopsoil } from '../src/scripts/calculators/topsoil.ts';
import { CALCULATORS } from '../src/data/calculators.ts';
import { getPriceBenchmark } from '../src/data/prices.ts';

test('Topsoil 1B.3.1 - 1. Default omitted wastePercentage resolves to 10% and normalizes result.inputs', () => {
  const res = calculateTopsoil({
    bedLength: 20,
    bedWidth: 10,
    soilDepthInches: 4,
  });

  assert.equal(res.success, true);
  if (!res.success) return;

  assert.equal(res.inputs.bedLength, 20);
  assert.equal(res.inputs.bedWidth, 10);
  assert.equal(res.inputs.soilDepthInches, 4);
  assert.equal(res.inputs.wastePercentage, 10);
  assert.equal(res.outputs.wastePercentage, 10);
  assert.equal(res.outputs.recommendedVolumeCuFt, 73.33);
  assert.equal(res.outputs.recommendedVolumeCuYds, 2.72);
});

test('Topsoil 1B.3.1 - 2. Explicit valid 0% and 50% allowances succeed and normalize result.inputs', () => {
  const resZero = calculateTopsoil({
    bedLength: 20,
    bedWidth: 10,
    soilDepthInches: 4,
    wastePercentage: 0,
  });
  assert.equal(resZero.success, true);
  if (resZero.success) {
    assert.equal(resZero.inputs.wastePercentage, 0);
    assert.equal(resZero.outputs.wastePercentage, 0);
    assert.equal(resZero.outputs.geometricVolumeCuFt, 66.67);
    assert.equal(resZero.outputs.recommendedVolumeCuFt, 66.67);
    assert.equal(resZero.outputs.recommendedVolumeCuYds, 2.47);
    assert.equal(resZero.outputs.bags075cuftToPurchase, 89);
    assert.equal(resZero.outputs.bags1cuftToPurchase, 67);
  }

  const resMax = calculateTopsoil({
    bedLength: 20,
    bedWidth: 10,
    soilDepthInches: 4,
    wastePercentage: 50,
  });
  assert.equal(resMax.success, true);
  if (resMax.success) {
    assert.equal(resMax.inputs.wastePercentage, 50);
    assert.equal(resMax.outputs.wastePercentage, 50);
    // 66.6667 * 1.5 = 100 cu ft = 3.7037 cu yds
    assert.equal(resMax.outputs.recommendedVolumeCuFt, 100);
    assert.equal(resMax.outputs.recommendedVolumeCuYds, 3.7);
    assert.equal(resMax.outputs.bags075cuftToPurchase, 134);
    assert.equal(resMax.outputs.bags1cuftToPurchase, 100);
  }
});

test('Topsoil 1B.3.1 - 3. Out-of-range wastePercentage (negative or > 50%) is rejected with OUT_OF_RANGE', () => {
  for (const invalidWaste of [-0.1, -10, 50.1, 100, 5000]) {
    const res = calculateTopsoil({
      bedLength: 20,
      bedWidth: 10,
      soilDepthInches: 4,
      wastePercentage: invalidWaste,
    });

    assert.equal(res.success, false, `Expected failure for wastePercentage=${invalidWaste}`);
    if (!res.success) {
      assert.equal(res.errors.length, 1);
      assert.equal(res.errors[0].field, 'wastePercentage');
      assert.equal(res.errors[0].code, 'OUT_OF_RANGE');
    }
  }
});

test('Topsoil 1B.3.1 - 4. Non-finite or non-numeric wastePercentage (NaN, +/-Infinity, bad type) is rejected with INVALID_NUMBER', () => {
  for (const invalidWaste of [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, '10', null]) {
    const res = calculateTopsoil({
      bedLength: 20,
      bedWidth: 10,
      soilDepthInches: 4,
      wastePercentage: invalidWaste as unknown as number,
    });

    assert.equal(res.success, false, `Expected failure for wastePercentage=${String(invalidWaste)}`);
    if (!res.success) {
      assert.equal(res.errors.length, 1);
      assert.equal(res.errors[0].field, 'wastePercentage');
      assert.equal(res.errors[0].code, 'INVALID_NUMBER');
    }
  }
});

test('Topsoil 1B.3.1 - 5. Invalid dimensions (bedLength, bedWidth, soilDepthInches) reject with exact field & error code', () => {
  const cases: Array<{
    name: string;
    input: Record<string, unknown>;
    field: 'bedLength' | 'bedWidth' | 'soilDepthInches';
    code: 'INVALID_NUMBER' | 'OUT_OF_RANGE';
  }> = [
    { name: 'zero bedLength', input: { bedLength: 0, bedWidth: 10, soilDepthInches: 4 }, field: 'bedLength', code: 'OUT_OF_RANGE' },
    { name: 'negative bedLength', input: { bedLength: -5, bedWidth: 10, soilDepthInches: 4 }, field: 'bedLength', code: 'OUT_OF_RANGE' },
    { name: 'NaN bedLength', input: { bedLength: Number.NaN, bedWidth: 10, soilDepthInches: 4 }, field: 'bedLength', code: 'INVALID_NUMBER' },
    { name: '+Infinity bedLength', input: { bedLength: Number.POSITIVE_INFINITY, bedWidth: 10, soilDepthInches: 4 }, field: 'bedLength', code: 'INVALID_NUMBER' },
    { name: '-Infinity bedLength', input: { bedLength: Number.NEGATIVE_INFINITY, bedWidth: 10, soilDepthInches: 4 }, field: 'bedLength', code: 'INVALID_NUMBER' },
    { name: 'zero bedWidth', input: { bedLength: 10, bedWidth: 0, soilDepthInches: 4 }, field: 'bedWidth', code: 'OUT_OF_RANGE' },
    { name: 'negative bedWidth', input: { bedLength: 10, bedWidth: -2, soilDepthInches: 4 }, field: 'bedWidth', code: 'OUT_OF_RANGE' },
    { name: 'NaN bedWidth', input: { bedLength: 10, bedWidth: Number.NaN, soilDepthInches: 4 }, field: 'bedWidth', code: 'INVALID_NUMBER' },
    { name: '+Infinity bedWidth', input: { bedLength: 10, bedWidth: Number.POSITIVE_INFINITY, soilDepthInches: 4 }, field: 'bedWidth', code: 'INVALID_NUMBER' },
    { name: '-Infinity bedWidth', input: { bedLength: 10, bedWidth: Number.NEGATIVE_INFINITY, soilDepthInches: 4 }, field: 'bedWidth', code: 'INVALID_NUMBER' },
    { name: 'zero depth', input: { bedLength: 10, bedWidth: 10, soilDepthInches: 0 }, field: 'soilDepthInches', code: 'OUT_OF_RANGE' },
    { name: 'negative depth', input: { bedLength: 10, bedWidth: 10, soilDepthInches: -1 }, field: 'soilDepthInches', code: 'OUT_OF_RANGE' },
    { name: 'NaN depth', input: { bedLength: 10, bedWidth: 10, soilDepthInches: Number.NaN }, field: 'soilDepthInches', code: 'INVALID_NUMBER' },
    { name: '+Infinity depth', input: { bedLength: 10, bedWidth: 10, soilDepthInches: Number.POSITIVE_INFINITY }, field: 'soilDepthInches', code: 'INVALID_NUMBER' },
    { name: '-Infinity depth', input: { bedLength: 10, bedWidth: 10, soilDepthInches: Number.NEGATIVE_INFINITY }, field: 'soilDepthInches', code: 'INVALID_NUMBER' },
  ];

  for (const tc of cases) {
    const res = calculateTopsoil(tc.input as unknown as Parameters<typeof calculateTopsoil>[0]);
    assert.equal(res.success, false, `${tc.name} should fail`);
    if (!res.success) {
      assert.equal(res.errors[0].field, tc.field, `${tc.name} field`);
      assert.equal(res.errors[0].code, tc.code, `${tc.name} code`);
    }
  }
});

test('Topsoil 1B.3.1 - 6. Existing valid Topsoil geometric outputs remain mathematically unchanged', () => {
  // Default 20x10 @ 4"
  const defRes = calculateTopsoil({ bedLength: 20, bedWidth: 10, soilDepthInches: 4, wastePercentage: 10 });
  assert.equal(defRes.success, true);
  if (defRes.success) {
    assert.equal(defRes.outputs.areaSqFt, 200);
    assert.equal(defRes.outputs.geometricVolumeCuFt, 66.67);
    assert.equal(defRes.outputs.geometricVolumeCuYds, 2.47);
    assert.equal(defRes.outputs.recommendedVolumeCuFt, 73.33);
    assert.equal(defRes.outputs.recommendedVolumeCuYds, 2.72);
    assert.equal(defRes.outputs.bags075cuftToPurchase, 98);
    assert.equal(defRes.outputs.bags1cuftToPurchase, 74);
  }

  // Thin top-dressing 100 sq ft @ 0.5"
  const topDress = calculateTopsoil({ bedLength: 10, bedWidth: 10, soilDepthInches: 0.5, wastePercentage: 10 });
  assert.equal(topDress.success, true);
  if (topDress.success) {
    assert.equal(topDress.outputs.areaSqFt, 100);
    assert.equal(topDress.outputs.geometricVolumeCuFt, 4.17);
    assert.equal(topDress.outputs.geometricVolumeCuYds, 0.15);
    assert.equal(topDress.outputs.recommendedVolumeCuFt, 4.58);
    assert.equal(topDress.outputs.recommendedVolumeCuYds, 0.17);
    assert.equal(topDress.outputs.bags075cuftToPurchase, 7);
    assert.equal(topDress.outputs.bags1cuftToPurchase, 5);
  }

  // Golden 14 purchase-order pricing (7 whole yards)
  const golden = calculateTopsoil({ bedLength: 25, bedWidth: 12, soilDepthInches: 6, wastePercentage: 10 });
  assert.equal(golden.success, true);
  if (golden.success) {
    const bulkBench = getPriceBenchmark('topsoil-bulk-yard')!;
    assert.equal(golden.outputs.bulkCubicYardsToPurchase, 7);
    assert.equal(golden.costEstimate.materialsOnly.typical, Math.round(7 * bulkBench.priceTypical));
  }
});

test('Topsoil 1B.3.1 - 7. Depth metadata matches UI range/step and allowance wording uses provisional planning framing', () => {
  const meta = CALCULATORS['topsoil-calculator'];
  const depthField = meta.inputFields.find((f) => f.id === 'depth');
  assert.ok(depthField, 'depth field should exist in metadata');
  assert.equal(depthField.min, 0.25);
  assert.equal(depthField.max, 36);
  assert.equal(depthField.step, 0.25);

  const res = calculateTopsoil({ bedLength: 20, bedWidth: 10, soilDepthInches: 4, wastePercentage: 15 });
  assert.equal(res.success, true);
  if (res.success) {
    const allowanceAssumption = res.assumptions.find((a) => a.id === 'soil-settling-factor');
    assert.ok(allowanceAssumption);
    assert.ok(allowanceAssumption.detail.includes('15%'));
    assert.ok(allowanceAssumption.detail.toLowerCase().includes('provisional'));
  }
});

test('Topsoil 1B.3.2 - 1. BOM quantity fields use consistent units and purchaseQuantity >= recommendedQuantity', () => {
  const cases = [
    { bedLength: 10, bedWidth: 10, soilDepthInches: 0.5, wastePercentage: 10 }, // 0.17 yd3
    { bedLength: 8, bedWidth: 4, soilDepthInches: 8, wastePercentage: 10 }, // 0.87 yd3
    { bedLength: 20, bedWidth: 10, soilDepthInches: 4, wastePercentage: 10 }, // 2.72 yd3
    { bedLength: 25, bedWidth: 12, soilDepthInches: 6, wastePercentage: 10 }, // 6.11 yd3
    { bedLength: 40, bedWidth: 20, soilDepthInches: 6, wastePercentage: 10 }, // 16.30 yd3
  ];

  for (const input of cases) {
    const res = calculateTopsoil(input);
    assert.equal(res.success, true);
    if (!res.success) continue;

    const bulkBom = res.billOfMaterials.find((item) => item.id === 'topsoil-bulk-yards')!;
    const bagBom = res.billOfMaterials.find((item) => item.id === 'topsoil-bags-075')!;

    // Bulk BOM in cubic yards
    assert.equal(bulkBom.packageUnit, 'cubic yards');
    assert.equal(bulkBom.exactQuantity, res.outputs.recommendedVolumeCuYds);
    assert.equal(bulkBom.recommendedQuantity, res.outputs.recommendedVolumeCuYds);
    assert.equal(bulkBom.purchaseQuantity, res.outputs.bulkCubicYardsToPurchase);
    assert.ok(bulkBom.purchaseQuantity >= bulkBom.recommendedQuantity);
    assert.ok(Number.isInteger(bulkBom.purchaseQuantity));

    // 0.75 cu ft BOM strictly in bags (never cubic feet!)
    assert.equal(bagBom.packageUnit, '0.75 cu ft bags');
    assert.equal(bagBom.exactQuantity, res.outputs.bags075cuftExact);
    assert.equal(bagBom.recommendedQuantity, res.outputs.bags075cuftExact);
    assert.equal(bagBom.purchaseQuantity, res.outputs.bags075cuftToPurchase);
    assert.ok(bagBom.purchaseQuantity >= bagBom.recommendedQuantity);
    assert.ok(Number.isInteger(bagBom.purchaseQuantity));

    // Confirm 1.0 cu ft bags are NOT in BOM or priced
    assert.equal(
      res.billOfMaterials.some((item) => item.id.includes('1cuft') || item.packageUnit.includes('1.0')),
      false
    );
  }
});

test('Topsoil 1B.3.2 - 2. Bulk & Bagged cost parity across all 5 required volumes and all 3 price tiers', () => {
  const bulkBench = getPriceBenchmark('topsoil-bulk-yard')!;
  const bagBench = getPriceBenchmark('topsoil-bag-075')!;

  const scenarios = [
    { label: '0.17 yd3 (10x10 @ 0.5")', input: { bedLength: 10, bedWidth: 10, soilDepthInches: 0.5, wastePercentage: 10 }, expectedCuYds: 0.17, expectedBulkPurch: 1, expectedBags075: 7 },
    { label: '0.87 yd3 (8x4 @ 8")', input: { bedLength: 8, bedWidth: 4, soilDepthInches: 8, wastePercentage: 10 }, expectedCuYds: 0.87, expectedBulkPurch: 1, expectedBags075: 32 },
    { label: '2.72 yd3 (20x10 @ 4")', input: { bedLength: 20, bedWidth: 10, soilDepthInches: 4, wastePercentage: 10 }, expectedCuYds: 2.72, expectedBulkPurch: 3, expectedBags075: 98 },
    { label: '6.11 yd3 (25x12 @ 6")', input: { bedLength: 25, bedWidth: 12, soilDepthInches: 6, wastePercentage: 10 }, expectedCuYds: 6.11, expectedBulkPurch: 7, expectedBags075: 220 },
    { label: '16.30 yd3 (40x20 @ 6")', input: { bedLength: 40, bedWidth: 20, soilDepthInches: 6, wastePercentage: 10 }, expectedCuYds: 16.3, expectedBulkPurch: 17, expectedBags075: 587 },
  ];

  for (const sc of scenarios) {
    const bulkRes = calculateTopsoil({ ...sc.input, purchasingFormat: 'bulk-yards' });
    assert.equal(bulkRes.success, true, sc.label);
    if (!bulkRes.success) continue;

    assert.equal(bulkRes.outputs.recommendedVolumeCuYds, sc.expectedCuYds, sc.label);
    assert.equal(bulkRes.outputs.bulkCubicYardsToPurchase, sc.expectedBulkPurch, sc.label);
    assert.equal(bulkRes.outputs.bags075cuftToPurchase, sc.expectedBags075, sc.label);

    const bulkBom = bulkRes.billOfMaterials.find((b) => b.id === 'topsoil-bulk-yards')!;
    const bagBom = bulkRes.billOfMaterials.find((b) => b.id === 'topsoil-bags-075')!;

    assert.equal(bulkBom.estimatedCost?.low, Math.round(sc.expectedBulkPurch * bulkBench.priceLow));
    assert.equal(bulkBom.estimatedCost?.typical, Math.round(sc.expectedBulkPurch * bulkBench.priceTypical));
    assert.equal(bulkBom.estimatedCost?.high, Math.round(sc.expectedBulkPurch * bulkBench.priceHigh));

    assert.equal(bagBom.estimatedCost?.low, Math.round(sc.expectedBags075 * bagBench.priceLow));
    assert.equal(bagBom.estimatedCost?.typical, Math.round(sc.expectedBags075 * bagBench.priceTypical));
    assert.equal(bagBom.estimatedCost?.high, Math.round(sc.expectedBags075 * bagBench.priceHigh));

    // Bulk costSummary strictly matches bulk BOM
    assert.deepEqual(bulkRes.costEstimate.materialsOnly, bulkBom.estimatedCost);
    assert.equal(bulkRes.outputs.selectedPurchasingFormat, 'bulk-yards');

    // Bagged format costSummary strictly matches bag BOM
    const bagRes = calculateTopsoil({ ...sc.input, purchasingFormat: 'bags-075' });
    assert.equal(bagRes.success, true, `${sc.label} bags`);
    if (bagRes.success) {
      const bagResBom = bagRes.billOfMaterials.find((b) => b.id === 'topsoil-bags-075')!;
      assert.deepEqual(bagRes.costEstimate.materialsOnly, bagResBom.estimatedCost);
      assert.equal(bagRes.outputs.selectedPurchasingFormat, 'bags-075');
      assert.equal(bagRes.inputs.purchasingFormat, 'bags-075');
    }
  }
});

test('Topsoil 1B.3.2 - 3. Explicit format selection eliminates the 25-bag cost cliff and discloses format & freight exclusion', () => {
  // Exact 25 bags vs 26 bags (5x5 @ 9" vs 5x5 @ 9.1", 0% allowance)
  const res25Default = calculateTopsoil({ bedLength: 5, bedWidth: 5, soilDepthInches: 9, wastePercentage: 0 });
  const res26Default = calculateTopsoil({ bedLength: 5, bedWidth: 5, soilDepthInches: 9.1, wastePercentage: 0 });
  assert.equal(res25Default.success, true);
  assert.equal(res26Default.success, true);

  if (res25Default.success && res26Default.success) {
    assert.equal(res25Default.outputs.bags075cuftToPurchase, 25);
    assert.equal(res26Default.outputs.bags075cuftToPurchase, 26);
    // Both stay consistently on bulk-yards (1 whole yard = $38 typical) — no sudden drop
    assert.equal(res25Default.outputs.selectedPurchasingFormat, 'bulk-yards');
    assert.equal(res26Default.outputs.selectedPurchasingFormat, 'bulk-yards');
    assert.deepEqual(res25Default.costEstimate.materialsOnly, res26Default.costEstimate.materialsOnly);
    assert.equal(res25Default.costEstimate.materialsOnly.typical, 38);
  }

  // In bags-075 format, 25 -> 26 bags increases monotonically by 1 bag
  const res25Bags = calculateTopsoil({ bedLength: 5, bedWidth: 5, soilDepthInches: 9, wastePercentage: 0, purchasingFormat: 'bags-075' });
  const res26Bags = calculateTopsoil({ bedLength: 5, bedWidth: 5, soilDepthInches: 9.1, wastePercentage: 0, purchasingFormat: 'bags-075' });
  assert.equal(res25Bags.success, true);
  assert.equal(res26Bags.success, true);
  if (res25Bags.success && res26Bags.success) {
    assert.ok(res26Bags.costEstimate.materialsOnly.typical > res25Bags.costEstimate.materialsOnly.typical);
    assert.ok(res25Bags.costEstimate.benchmarkSources[0].includes('0.75 cu ft Retail Bags'));
  }

  // Invalid purchasingFormat rejected cleanly
  const badFormat = calculateTopsoil({
    bedLength: 10,
    bedWidth: 10,
    soilDepthInches: 4,
    purchasingFormat: 'invalid-format' as unknown as 'bulk-yards',
  });
  assert.equal(badFormat.success, false);
  if (!badFormat.success) {
    assert.equal(badFormat.errors[0].field, 'purchasingFormat');
    assert.equal(badFormat.errors[0].code, 'OUT_OF_RANGE');
  }
});

test('Topsoil 1B.3.2 - 4. Edge volumes (exact whole yard, just above whole yard, tiny) & freight/1.0 cu ft scope', () => {
  // Exact 1.00 cubic yard (6 x 4.5 @ 12", 0%) -> 1 whole yard, 36 bags (0.75), 27 bags (1.0)
  const exactOneYard = calculateTopsoil({ bedLength: 6, bedWidth: 4.5, soilDepthInches: 12, wastePercentage: 0 });
  assert.equal(exactOneYard.success, true);
  if (exactOneYard.success) {
    assert.equal(exactOneYard.outputs.recommendedVolumeCuYds, 1);
    assert.equal(exactOneYard.outputs.bulkCubicYardsToPurchase, 1);
    assert.equal(exactOneYard.outputs.bags075cuftToPurchase, 36);
    assert.equal(exactOneYard.outputs.bags1cuftToPurchase, 27);
    assert.equal(exactOneYard.costEstimate.materialsOnly.typical, 38);
  }

  // Just above 1.00 cubic yard (6.1 x 4.5 @ 12", 0%) -> 1.02 cu yds -> rounds UP to 2 whole yards
  const justOverOne = calculateTopsoil({ bedLength: 6.1, bedWidth: 4.5, soilDepthInches: 12, wastePercentage: 0 });
  assert.equal(justOverOne.success, true);
  if (justOverOne.success) {
    assert.equal(justOverOne.outputs.recommendedVolumeCuYds, 1.02);
    assert.equal(justOverOne.outputs.bulkCubicYardsToPurchase, 2);
    assert.equal(justOverOne.costEstimate.materialsOnly.typical, 76);
  }

  // Very small volume (1 x 1 @ 0.25", 0%) -> 1 bulk yard, 1 retail bag
  const tiny = calculateTopsoil({ bedLength: 1, bedWidth: 1, soilDepthInches: 0.25, wastePercentage: 0, purchasingFormat: 'bags-075' });
  assert.equal(tiny.success, true);
  if (tiny.success) {
    assert.equal(tiny.outputs.bulkCubicYardsToPurchase, 1);
    assert.equal(tiny.outputs.bags075cuftToPurchase, 1);
    assert.equal(tiny.costEstimate.materialsOnly.typical, 4); // round(1 * 3.79)
  }

  // Delivery freight scope & 1.0 cu ft unpriced verification
  const bulkBench = getPriceBenchmark('topsoil-bulk-yard')!;
  assert.ok(bulkBench.priceBasis.toLowerCase().includes('before delivery freight'));
  assert.equal(getPriceBenchmark('topsoil-bag-100'), undefined);
});


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

test('Topsoil 1B.3.1 - 6. Existing valid Topsoil calculation outputs and cost behavior remain mathematically unchanged', () => {
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

  // Golden 14 compatibility (purchasing/cost model untouched in 1B.3.1)
  const golden = calculateTopsoil({ bedLength: 25, bedWidth: 12, soilDepthInches: 6, wastePercentage: 10 });
  assert.equal(golden.success, true);
  if (golden.success) {
    const bulkBench = getPriceBenchmark('topsoil-bulk-yard')!;
    assert.equal(golden.costEstimate.materialsOnly.typical, Math.round(6.111 * bulkBench.priceTypical));
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

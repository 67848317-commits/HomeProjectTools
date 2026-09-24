import test from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateConcretePostHole,
  calculateConcreteSlab,
  calculateDeckMaterial,
  calculateDrywall,
  calculateFenceMaterial,
  calculateFlooring,
  calculateGravel,
  calculateMulch,
  calculatePaint,
  calculatePaverPatio,
  calculateRoofing,
  calculateSod,
  calculateTile,
  calculateTopsoil,
  calculateBaseboardTrim,
} from '../src/scripts/calculators/index.ts';

test('Edge Cases - Zero and Negative Inputs gracefully return error structures (no throw)', () => {
  const badInputs = [
    { fn: calculateFlooring, name: 'flooring', input: { roomLength: -5, roomWidth: 10 } },
    { fn: calculateTile, name: 'tile', input: { areaLength: 0, areaWidth: 10, tileLengthInches: 12, tileWidthInches: 12 } },
    { fn: calculatePaint, name: 'paint', input: { roomLength: 10, roomWidth: -10, wallHeight: 8 } },
    { fn: calculateConcreteSlab, name: 'concrete-slab', input: { slabLength: 10, slabWidth: 10, slabThickness: 0 } },
    { fn: calculateConcretePostHole, name: 'concrete-post', input: { holeCount: 0, holeDiameterInches: 10, holeDepthInches: 36 } },
    { fn: calculateMulch, name: 'mulch', input: { bedLength: -10, bedWidth: 5, mulchDepthInches: 3 } },
    { fn: calculateGravel, name: 'gravel', input: { gravelLength: 20, gravelWidth: 0, gravelDepthInches: 4 } },
    { fn: calculateSod, name: 'sod', input: { lawnLength: 0, lawnWidth: 0 } },
    { fn: calculateDrywall, name: 'drywall', input: { roomLength: 0, roomWidth: 10, ceilingHeight: 8 } },
    { fn: calculateDeckMaterial, name: 'deck', input: { deckLength: -16, deckWidth: 12 } },
    { fn: calculateFenceMaterial, name: 'fence', input: { fenceLength: 0 } },
    { fn: calculateRoofing, name: 'roofing', input: { footprintAreaSqFt: 0 } },
    { fn: calculatePaverPatio, name: 'paver', input: { patioLength: 0, patioWidth: 10 } },
    { fn: calculateTopsoil, name: 'topsoil', input: { bedLength: 10, bedWidth: 10, soilDepthInches: 0 } },
    { fn: calculateBaseboardTrim, name: 'baseboard', input: { roomLength: 0, roomWidth: 0 } },
  ];

  for (const { fn, name, input } of badInputs) {
    const res = fn(input as any);
    assert.equal(res.success, false, `${name} should fail gracefully`);
    assert.ok(res.errors && res.errors.length > 0, `${name} should have error messages`);
  }
});

test('Edge Cases - Large values and fractional numbers do not yield NaN or Infinity', () => {
  // Very large room
  const largeFlooring = calculateFlooring({
    roomLength: 250.75,
    roomWidth: 180.25,
    cartonCoverage: 21.3,
    wastePercentage: 12.5,
  });
  assert.equal(largeFlooring.success, true);
  if (largeFlooring.success) {
    assert.ok(Number.isFinite(largeFlooring.outputs.cartonsToPurchase));
    assert.ok(!Number.isNaN(largeFlooring.outputs.cartonsToPurchase));
    assert.ok(largeFlooring.outputs.cartonsToPurchase > 2000);
  }

  // Fractional concrete slab
  const fracSlab = calculateConcreteSlab({
    slabLength: 12.75,
    slabWidth: 8.5,
    slabThickness: 3.75,
    wastePercentage: 7.5,
  });
  assert.equal(fracSlab.success, true);
  if (fracSlab.success) {
    assert.ok(Number.isFinite(fracSlab.outputs.recommendedVolumeCuYds));
    assert.ok(!Number.isNaN(fracSlab.outputs.bags80lbToPurchase));
  }
});

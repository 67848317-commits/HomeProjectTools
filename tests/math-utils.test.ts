import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyWaste,
  calculateCostRange,
  calculateCylinderVolumeCuFt,
  calculatePitchMultiplier,
  calculatePostDisplacementCuFt,
  calculateRectangularArea,
  calculateVolumeCubicFeet,
  ceilToPackage,
  clampInput,
  cubicFeetToCubicYards,
  cubicYardsToCubicFeet,
  cubicYardsToTons,
  feetToInches,
  inchesToFeet,
  isPositiveNumber,
  roundCurrency,
  roundToPrecision,
  sanitizeNumber,
  squareFeetToSquareYards,
} from '../src/scripts/core/math-utils.ts';

test('Math Utils - sanitizeNumber and isPositiveNumber', () => {
  assert.equal(sanitizeNumber(10), 10);
  assert.equal(sanitizeNumber('25.5'), 25.5);
  assert.equal(sanitizeNumber(null, 5), 5);
  assert.equal(sanitizeNumber(undefined, 0), 0);
  assert.equal(sanitizeNumber(NaN, 100), 100);
  assert.equal(sanitizeNumber(Infinity, 0), 0);
  assert.equal(sanitizeNumber(-Infinity, 0), 0);

  assert.equal(isPositiveNumber(10), true);
  assert.equal(isPositiveNumber(0), false);
  assert.equal(isPositiveNumber(-5), false);
  assert.equal(isPositiveNumber('abc'), false);
  assert.equal(isPositiveNumber(NaN), false);
});

test('Math Utils - clampInput', () => {
  assert.equal(clampInput(5, 1, 10), 5);
  assert.equal(clampInput(-2, 0, 100), 0);
  assert.equal(clampInput(150, 0, 100), 100);
});

test('Math Utils - ceilToPackage', () => {
  assert.equal(ceilToPackage(0), 0);
  assert.equal(ceilToPackage(-5), 0);
  assert.equal(ceilToPackage(7.0), 7);
  assert.equal(ceilToPackage(7.01), 8);
  assert.equal(ceilToPackage(7.99), 8);
  assert.equal(ceilToPackage(1), 1);
});

test('Math Utils - applyWaste', () => {
  assert.equal(applyWaste(100, 10), 110);
  assert.equal(applyWaste(200, 15), 230);
  assert.equal(applyWaste(100, 0), 100);
  assert.equal(applyWaste(0, 10), 0);
  assert.equal(applyWaste(-50, 10), 0);
});

test('Math Utils - rounding helpers', () => {
  assert.equal(roundToPrecision(3.14159, 2), 3.14);
  assert.equal(roundToPrecision(3.145, 2), 3.15);
  assert.equal(roundToPrecision(10, 2), 10);

  assert.equal(roundCurrency(123.456, true), 123);
  assert.equal(roundCurrency(123.6, true), 124);
  assert.equal(roundCurrency(123.456, false), 123.46);
});

test('Math Utils - unit conversions', () => {
  assert.equal(inchesToFeet(12), 1);
  assert.equal(inchesToFeet(6), 0.5);
  assert.equal(feetToInches(1), 12);
  assert.equal(feetToInches(2.5), 30);

  assert.equal(calculateRectangularArea(10, 15), 150);
  assert.equal(squareFeetToSquareYards(90), 10);

  // 10 ft x 10 ft x 4 inches (1/3 ft) = 33.333 cu ft
  const volCuFt = calculateVolumeCubicFeet(10, 10, 4);
  assert.ok(Math.abs(volCuFt - 33.333) < 0.01);

  assert.equal(cubicFeetToCubicYards(27), 1);
  assert.equal(cubicYardsToCubicFeet(2), 54);
});

test('Math Utils - cylinder and post displacement', () => {
  // 10 inch diameter, 36 inch depth
  // radius = 5 in = 5/12 ft. depth = 3 ft.
  // volume = π * (5/12)^2 * 3 = π * 25/144 * 3 = π * 75/144 ≈ 1.636 cu ft
  const cylVol = calculateCylinderVolumeCuFt(10, 36);
  assert.ok(cylVol > 1.6 && cylVol < 1.7);

  // 4x4 actual 3.5" x 3.5" x 36" = 441 cu in / 1728 ≈ 0.255 cu ft
  const disp = calculatePostDisplacementCuFt(3.5, 3.5, 36);
  assert.ok(disp > 0.25 && disp < 0.26);
});

test('Math Utils - pitch multiplier & tons', () => {
  // 6/12 pitch: sqrt(1 + (6/12)^2) = sqrt(1 + 0.25) = sqrt(1.25) ≈ 1.11803
  const pitchMult = calculatePitchMultiplier(6);
  assert.ok(Math.abs(pitchMult - 1.118) < 0.001);

  // 2 cubic yards at 1.4 tons/yard = 2.8 tons
  assert.equal(cubicYardsToTons(2, 1.4), 2.8);
});

test('Math Utils - calculateCostRange', () => {
  const cost = calculateCostRange(10, 2, 4, 6);
  assert.deepEqual(cost, { low: 20, typical: 40, high: 60 });
});

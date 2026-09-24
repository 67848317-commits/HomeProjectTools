/**
 * Shared Mathematical & Unit Conversion Utilities for Home Project Tools
 * 
 * DESIGN PRINCIPLES:
 * 1. Deterministic & pure functions (zero side-effects).
 * 2. Strict input validation preventing NaN, Infinity, and negative outputs.
 * 3. Clear distinction between:
 *    - Mathematical exact values
 *    - Planning estimates
 *    - Commercial packaging ceilings (ceilToPackage)
 */

/**
 * Validates and sanitizes numeric inputs.
 * If value is null, undefined, NaN, or non-finite, returns the fallback.
 */
export function sanitizeNumber(value: unknown, fallback = 0): number {
  if (value === null || value === undefined) return fallback;
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(num) || Number.isNaN(num)) return fallback;
  return num;
}

/**
 * Validates that an input is a positive number strictly greater than zero.
 */
export function isPositiveNumber(value: unknown): value is number {
  const num = sanitizeNumber(value, -1);
  return num > 0;
}

/**
 * Clamps a number within an inclusive min/max range.
 */
export function clampInput(value: number, min: number, max: number): number {
  const safe = sanitizeNumber(value, min);
  return Math.min(Math.max(safe, min), max);
}

/**
 * Commercial Package Rounding
 * Always rounds upward to the nearest whole integer package.
 * Never rounds down or keeps fractions for physical cartons/bags.
 * Eliminates floating point micro-artifacts (e.g. 891.0000000000001).
 * Example: 7.01 bags -> 8 bags; 0 bags -> 0 bags; 891.0000000000001 -> 891.
 */
export function ceilToPackage(quantity: number): number {
  const safe = sanitizeNumber(quantity, 0);
  if (safe <= 0) return 0;
  const normalized = Math.round((safe + Number.EPSILON) * 1e6) / 1e6;
  return Math.ceil(normalized);
}

/**
 * Applies a percentage waste factor to a base quantity.
 * Waste factor is applied EXACTLY ONCE.
 * Eliminates floating point artifacts (e.g. 100 * 1.1 => 110).
 * Example: applyWaste(100, 10) => 110
 */
export function applyWaste(baseQuantity: number, wastePercentage: number): number {
  const safeBase = Math.max(0, sanitizeNumber(baseQuantity, 0));
  const safeWaste = Math.max(0, sanitizeNumber(wastePercentage, 0));
  const result = safeBase * (1 + safeWaste / 100);
  return Math.round((result + Number.EPSILON) * 1e6) / 1e6;
}

/**
 * Rounds a number to a specified number of decimal places for display.
 */
export function roundToPrecision(value: number, decimals = 2): number {
  const safe = sanitizeNumber(value, 0);
  const factor = 10 ** decimals;
  return Math.round((safe + Number.EPSILON) * factor) / factor;
}

/**
 * Rounds currency to the nearest integer dollar for high-dollar projects,
 * or 2 decimal places for per-unit pricing.
 */
export function roundCurrency(value: number, roundToWholeDollar = true): number {
  const safe = Math.max(0, sanitizeNumber(value, 0));
  if (roundToWholeDollar) {
    return Math.round(safe);
  }
  return roundToPrecision(safe, 2);
}

// ==========================================
// GEOMETRIC & UNIT CONVERSIONS
// ==========================================

/**
 * Converts inches to feet.
 * 1 ft = 12 inches
 */
export function inchesToFeet(inches: number): number {
  const safeInches = Math.max(0, sanitizeNumber(inches, 0));
  return safeInches / 12;
}

/**
 * Converts feet to inches.
 */
export function feetToInches(feet: number): number {
  const safeFeet = Math.max(0, sanitizeNumber(feet, 0));
  return safeFeet * 12;
}

/**
 * Calculates rectangular area in square feet.
 */
export function calculateRectangularArea(lengthFeet: number, widthFeet: number): number {
  const l = Math.max(0, sanitizeNumber(lengthFeet, 0));
  const w = Math.max(0, sanitizeNumber(widthFeet, 0));
  return l * w;
}

/**
 * Converts square feet to square yards.
 * 1 sq yd = 9 sq ft
 */
export function squareFeetToSquareYards(sqFt: number): number {
  const safe = Math.max(0, sanitizeNumber(sqFt, 0));
  return safe / 9;
}

/**
 * Calculates 3D rectangular volume in cubic feet.
 * Length (ft) x Width (ft) x Depth (inches converted to ft)
 */
export function calculateVolumeCubicFeet(lengthFeet: number, widthFeet: number, depthInches: number): number {
  const l = Math.max(0, sanitizeNumber(lengthFeet, 0));
  const w = Math.max(0, sanitizeNumber(widthFeet, 0));
  const dFt = inchesToFeet(depthInches);
  return l * w * dFt;
}

/**
 * Converts cubic feet to cubic yards.
 * 1 cubic yard = 27 cubic feet
 */
export function cubicFeetToCubicYards(cubicFeet: number): number {
  const safe = Math.max(0, sanitizeNumber(cubicFeet, 0));
  return safe / 27;
}

/**
 * Converts cubic yards to cubic feet.
 */
export function cubicYardsToCubicFeet(cubicYards: number): number {
  const safe = Math.max(0, sanitizeNumber(cubicYards, 0));
  return safe * 27;
}

/**
 * Calculates vertical cylinder volume in cubic feet.
 * Used for concrete post holes and footings.
 * Hole diameter (inches) and hole depth (inches).
 * Volume = π * (diameter/24)^2 * (depth/12)
 */
export function calculateCylinderVolumeCuFt(diameterInches: number, depthInches: number): number {
  const dIn = Math.max(0, sanitizeNumber(diameterInches, 0));
  const hIn = Math.max(0, sanitizeNumber(depthInches, 0));
  const radiusFeet = inchesToFeet(dIn) / 2;
  const depthFeet = inchesToFeet(hIn);
  return Math.PI * radiusFeet * radiusFeet * depthFeet;
}

/**
 * Calculates rectangular post displacement in cubic feet.
 * Example: 4x4 actual dimensions are 3.5" x 3.5"
 */
export function calculatePostDisplacementCuFt(
  postWidthInches: number,
  postThicknessInches: number,
  embeddedDepthInches: number
): number {
  const wIn = Math.max(0, sanitizeNumber(postWidthInches, 0));
  const tIn = Math.max(0, sanitizeNumber(postThicknessInches, 0));
  const dIn = Math.max(0, sanitizeNumber(embeddedDepthInches, 0));
  const cubicInches = wIn * tIn * dIn;
  return cubicInches / 1728; // 1728 cubic inches in 1 cubic foot
}

/**
 * Calculates roof pitch slope multiplier.
 * Multiplier = sqrt(1 + (pitch / 12)^2)
 * Example: 6/12 pitch => sqrt(1 + 0.5^2) = 1.11803
 */
export function calculatePitchMultiplier(riseInchesPerFoot: number): number {
  const rise = Math.max(0, sanitizeNumber(riseInchesPerFoot, 0));
  return Math.sqrt(1 + (rise / 12) ** 2);
}

/**
 * Converts cubic yards of aggregate stone to US tons.
 * Density factor: typically 1.35 to 1.60 tons per cubic yard.
 */
export function cubicYardsToTons(cubicYards: number, densityTonsPerYard = 1.4): number {
  const safeYards = Math.max(0, sanitizeNumber(cubicYards, 0));
  const safeDensity = Math.max(0.5, sanitizeNumber(densityTonsPerYard, 1.4));
  return safeYards * safeDensity;
}

/**
 * Standard Cost Range Estimator
 * Multiplies purchase quantity by benchmark low, typical, and high unit prices.
 */
export function calculateCostRange(
  quantity: number,
  priceLow: number,
  priceTypical: number,
  priceHigh: number
): { low: number; typical: number; high: number } {
  const q = Math.max(0, sanitizeNumber(quantity, 0));
  return {
    low: roundCurrency(q * Math.max(0, priceLow)),
    typical: roundCurrency(q * Math.max(0, priceTypical)),
    high: roundCurrency(q * Math.max(0, priceHigh)),
  };
}

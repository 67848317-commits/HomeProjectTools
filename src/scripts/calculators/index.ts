/**
 * Calculation Engine Module Exports
 * Central registry of all 15 pure calculator functions
 */

export * from './flooring.ts';
export * from './tile.ts';
export * from './paint.ts';
export * from './concreteSlab.ts';
export * from './concretePostHole.ts';
export * from './mulch.ts';
export * from './gravel.ts';
export * from './sod.ts';
export * from './drywall.ts';
export * from './deckMaterial.ts';
export * from './fenceMaterial.ts';
export * from './roofing.ts';
export * from './paverPatio.ts';
export * from './topsoil.ts';
export * from './baseboardTrim.ts';

import { calculateFlooring } from './flooring.ts';
import { calculateTile } from './tile.ts';
import { calculatePaint } from './paint.ts';
import { calculateConcreteSlab } from './concreteSlab.ts';
import { calculateConcretePostHole } from './concretePostHole.ts';
import { calculateMulch } from './mulch.ts';
import { calculateGravel } from './gravel.ts';
import { calculateSod } from './sod.ts';
import { calculateDrywall } from './drywall.ts';
import { calculateDeckMaterial } from './deckMaterial.ts';
import { calculateFenceMaterial } from './fenceMaterial.ts';
import { calculateRoofing } from './roofing.ts';
import { calculatePaverPatio } from './paverPatio.ts';
import { calculateTopsoil } from './topsoil.ts';
import { calculateBaseboardTrim } from './baseboardTrim.ts';
import type { CalculationResult } from '../../types/index.ts';

/**
 * Universal calculation dispatcher
 */
export const ENGINE_REGISTRY: Record<string, (inputs: any) => CalculationResult<any>> = {
  'flooring-calculator': calculateFlooring,
  'tile-calculator': calculateTile,
  'paint-calculator': calculatePaint,
  'concrete-slab-calculator': calculateConcreteSlab,
  'concrete-post-hole-calculator': calculateConcretePostHole,
  'mulch-calculator': calculateMulch,
  'gravel-calculator': calculateGravel,
  'sod-calculator': calculateSod,
  'drywall-calculator': calculateDrywall,
  'deck-material-calculator': calculateDeckMaterial,
  'fence-material-calculator': calculateFenceMaterial,
  'roofing-calculator': calculateRoofing,
  'paver-patio-calculator': calculatePaverPatio,
  'topsoil-calculator': calculateTopsoil,
  'baseboard-trim-calculator': calculateBaseboardTrim,
};

export function runCalculator(calculatorId: string, inputs: any): CalculationResult<any> {
  const runner = ENGINE_REGISTRY[calculatorId];
  if (!runner) {
    return {
      success: false,
      calculatorId,
      errors: [
        {
          field: 'calculatorId',
          message: `Calculator engine '${calculatorId}' not found.`,
          code: 'CALCULATOR_NOT_FOUND',
        },
      ],
    };
  }
  return runner(inputs);
}

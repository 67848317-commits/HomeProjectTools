/**
 * Deck Board & Framing Calculation Engine
 */

import { getBenchmarkPriceRange, getPriceBenchmark } from '../../data/prices.ts';
import type { CalculationResult } from '../../types/index.ts';
import {
  applyWaste,
  calculateCostRange,
  ceilToPackage,
  roundToPrecision,
  sanitizeNumber,
} from '../core/math-utils.ts';

export interface DeckMaterialInputs {
  deckLength: number; // along house wall (feet)
  deckWidth: number; // projection out from house (feet)
  joistSpacingInches?: 12 | 16 | number; // 12" or 16" on-center
  boardLengthStockFeet?: 12 | 16 | 20 | number; // 12, 16, or 20 ft boards
  wastePercentage?: number; // cut/trim waste (default 10%)
}

export interface DeckMaterialOutputs {
  deckAreaSqFt: number;
  boardRowsCount: number;
  netDeckingLinearFeet: number;
  wastePercentage: number;
  recommendedDeckingLinearFeet: number;
  purchasedDeckingLinearFeet: number;
  stockBoardLengthFeet: number;
  deckBoardsToPurchase: number;
  joistCount: number;
  fastenersEstimate: number;
}

export function calculateDeckMaterial(inputs: DeckMaterialInputs): CalculationResult<DeckMaterialOutputs> {
  const length = sanitizeNumber(inputs.deckLength, 0);
  const width = sanitizeNumber(inputs.deckWidth, 0);
  const joistSpacing = inputs.joistSpacingInches === 12 ? 12 : 16;
  const stockLength = inputs.boardLengthStockFeet === 12 || inputs.boardLengthStockFeet === 20 ? inputs.boardLengthStockFeet : 16;
  const wastePercent = Math.max(0, sanitizeNumber(inputs.wastePercentage, 10));

  if (length <= 0 || width <= 0) {
    return {
      success: false,
      calculatorId: 'deck-material-calculator',
      errors: [
        {
          field: length <= 0 ? 'deckLength' : 'deckWidth',
          message: 'Deck length and projection width must be positive numbers greater than zero.',
          code: 'INVALID_NUMBER',
        },
      ],
    };
  }

  // 1. Deck Area
  const deckArea = length * width;

  // 2. Decking Board Rows (5.5" actual nominal 6" board + 1/8" expansion gap = 5.625" effective pitch)
  const projectionInches = width * 12;
  const boardRows = Math.ceil(projectionInches / 5.625);

  // 3. Decking Linear Footage
  const netLinearFeet = boardRows * length;
  const recommendedLinearFeet = applyWaste(netLinearFeet, wastePercent);

  // 4. Board Counts at chosen stock length & Actual Purchased Linear Feet
  const deckBoardsToPurchase = ceilToPackage(recommendedLinearFeet / stockLength);
  const purchasedLinearFeet = deckBoardsToPurchase * stockLength;

  // 5. Framing: Floor Joists
  // Number of joists = ceil((length * 12) / joistSpacing) + 1 (plus rim joist framing)
  const joistCount = Math.ceil((length * 12) / joistSpacing) + 1;

  // 6. Fasteners (2 screws per board at each joist intersection + 10% buffer)
  const intersections = boardRows * joistCount;
  const fastenersEstimate = Math.ceil(intersections * 2 * 1.10);

  // 7. Pricing Benchmarks
  const deckBench = getPriceBenchmark('deck-board-composite-lf');
  const deckPricing = getBenchmarkPriceRange('deck-board-composite-lf');

  const deckingCost = calculateCostRange(
    purchasedLinearFeet,
    deckPricing.low,
    deckPricing.typical,
    deckPricing.high
  );

  const laborBench = deckBench?.contractorLabor;
  const laborLow = laborBench ? Math.round(deckArea * laborBench.laborLow) : 0;
  const laborTyp = laborBench ? Math.round(deckArea * laborBench.laborTypical) : 0;
  const laborHigh = laborBench ? Math.round(deckArea * laborBench.laborHigh) : 0;

  return {
    success: true,
    calculatorId: 'deck-material-calculator',
    timestamp: new Date().toISOString(),
    inputs: { ...inputs, deckLength: length, deckWidth: width, joistSpacingInches: joistSpacing },
    outputs: {
      deckAreaSqFt: roundToPrecision(deckArea, 1),
      boardRowsCount: boardRows,
      netDeckingLinearFeet: roundToPrecision(netLinearFeet, 1),
      wastePercentage: wastePercent,
      recommendedDeckingLinearFeet: roundToPrecision(recommendedLinearFeet, 1),
      purchasedDeckingLinearFeet: purchasedLinearFeet,
      stockBoardLengthFeet: stockLength,
      deckBoardsToPurchase,
      joistCount,
      fastenersEstimate,
    },
    billOfMaterials: [
      {
        id: 'deck-surface-boards',
        name: `Deck Surface Boards (${stockLength}-Foot Sticks)`,
        description: `Nominal 6" boards at ${stockLength} ft length (${purchasedLinearFeet} linear feet purchased)`,
        exactQuantity: roundToPrecision(recommendedLinearFeet / stockLength, 1),
        recommendedQuantity: roundToPrecision(recommendedLinearFeet, 1),
        purchaseQuantity: deckBoardsToPurchase,
        packageUnit: 'boards',
        unitSizeDescription: `${stockLength} ft / board`,
        wasteAppliedPercentage: wastePercent,
        benchmarkPriceId: 'deck-board-composite-lf',
        estimatedCost: deckingCost,
      },
    ],
    costEstimate: {
      hasPricing: true,
      currency: 'USD',
      materialsOnly: deckingCost,
      contractorInstalledTotal: laborBench
        ? {
            low: deckingCost.low + laborLow,
            typical: deckingCost.typical + laborTyp,
            high: deckingCost.high + laborHigh,
            laborOnlyLow: laborLow,
            laborOnlyTypical: laborTyp,
            laborOnlyHigh: laborHigh,
            scopeNote: laborBench.laborScopeNote,
          }
        : undefined,
      benchmarkSources: [deckBench?.sourceNote ?? 'Retail home center lumber yard benchmark'],
      disclaimer: 'Showing surface decking material only. Framing lumber (2x8/2x10), hardware, footings, and railings estimated separately.',
    },
    assumptions: [
      {
        id: 'structural-code-disclaimer',
        title: 'Not a Structural Engineering Design',
        detail: 'THIS IS A PRELIMINARY ESTIMATING TAKEOFF. Actual joist depth (2x8 vs 2x10), allowable cantilever, footing size, beam sizing, and ledger flashing must comply with the International Residential Code (IRC) and local building department codes.',
        category: 'structural',
      },
      {
        id: 'board-spacing-standard',
        title: 'Effective Board Spacing',
        detail: 'Assumes standard 5.5" board width with 1/8" expansion gap between parallel deck runs (5.625" effective pitch).',
        category: 'geometry',
      },
    ],
    notices: [
      joistSpacing === 12
        ? '12" joist spacing selected as a planning input assumption. Often specified for diagonal deck patterns or certain composite decking brands; verify manufacturer requirements.'
        : '16" joist spacing selected as a planning input assumption. Common for perpendicular wood boards; check manufacturer guidelines if installing composite.',
    ],
  };
}

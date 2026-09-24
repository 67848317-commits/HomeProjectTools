import React from 'react';
import { Calculator, ArrowRight, Check } from 'lucide-react';
import type { FlooringOutputs } from '../../scripts/calculators/flooring.ts';

export interface CalculationStep {
  stepNumber: number;
  title: string;
  description: string;
  formulaDisplay?: React.ReactNode;
}

interface CalculationExplanationProps {
  outputs?: FlooringOutputs;
  length?: number;
  width?: number;
  cartonCoverage?: number;
  wastePercent?: number;
  title?: string;
  subtitle?: string;
  description?: string;
  steps?: CalculationStep[];
}

export const CalculationExplanation: React.FC<CalculationExplanationProps> = ({
  outputs,
  length = 16,
  width = 12,
  cartonCoverage = 20,
  wastePercent = 10,
  title = 'How This Flooring Calculation Works',
  subtitle = 'Transparent Engineering Math',
  description = 'Our calculation engine executes deterministic steps to produce your purchase takeoff.',
  steps,
}) => {
  const flooringSteps: CalculationStep[] = outputs
    ? [
        {
          stepNumber: 1,
          title: 'Compute Net Geometric Floor Area',
          description: 'The bare physical footprint of the room is calculated using length times width.',
          formulaDisplay: (
            <span>
              {length} ft × {width} ft = <strong>{outputs.netAreaSqFt} sq ft net</strong>
            </span>
          ),
        },
        {
          stepNumber: 2,
          title: 'Apply the Cut & Stagger Waste Factor Once',
          description: `During plank installation, pieces cut at the end of a row cannot always be reused if under 8 inches. The ${wastePercent}% planning buffer is applied directly to the net area.`,
          formulaDisplay: (
            <span>
              {outputs.netAreaSqFt} sq ft × (1 + {wastePercent / 100}) ={' '}
              <strong>{outputs.recommendedPurchaseSqFt} sq ft recommended</strong> (+{outputs.wasteAreaSqFt} sq ft waste)
            </span>
          ),
        },
        {
          stepNumber: 3,
          title: 'Divide by Commercial Carton Packaging Spec',
          description: 'Flooring cartons typically contain between 18 and 24 square feet per box depending on plank thickness and manufacturer.',
          formulaDisplay: (
            <span>
              {outputs.recommendedPurchaseSqFt} sq ft ÷ {cartonCoverage} sq ft/box ={' '}
              <strong>{(outputs.recommendedPurchaseSqFt / cartonCoverage).toFixed(2)} exact cartons</strong>
            </span>
          ),
        },
        {
          stepNumber: 4,
          title: 'Round Upward to Whole Commercial Cartons',
          description: 'Retailers and distributors will not break open factory-sealed boxes. The purchase order rounds strictly upward using a mathematical ceiling.',
          formulaDisplay: (
            <span className="text-[#b8532b]">
              ⌈{(outputs.recommendedPurchaseSqFt / cartonCoverage).toFixed(2)}⌉ ={' '}
              <strong>{outputs.cartonsToPurchase} cartons to purchase</strong> ({outputs.purchasedSqFt} sq ft purchased, providing a +{outputs.excessSqFtOverRecommended} sq ft spare cushion)
            </span>
          ),
        },
        {
          stepNumber: 5,
          title: 'Calculate Purchase Cost Using Pricing Registry',
          description: `Material cost is derived from full purchased carton footage (${outputs.purchasedSqFt} sq ft), not the fractional net requirement, multiplied by low, typical, and premium national benchmarks.`,
        },
      ]
    : [];

  const activeSteps = steps && steps.length > 0 ? steps : flooringSteps;

  return (
    <div className="rounded border border-[#e3ded4] bg-[#ffffff] p-6 shadow-xs space-y-5">
      <div className="border-b border-[#e3ded4] pb-3">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#b8532b]">
          {subtitle}
        </span>
        <h3 className="font-serif text-xl font-bold text-[#1c1917]">
          {title}
        </h3>
        <p className="text-xs text-[#57534e] mt-1">
          {description}
        </p>
      </div>

      <div className="space-y-4">
        {activeSteps.map((step) => (
          <div key={step.stepNumber} className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f1ede4] border border-[#e3ded4] font-mono text-xs font-bold text-[#1c1917] shrink-0 mt-0.5">
              {step.stepNumber}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-[#1c1917]">
                {step.title}
              </h4>
              <p className="text-xs text-[#57534e] leading-relaxed mt-0.5">
                {step.description}
              </p>
              {step.formulaDisplay && (
                <div className="mt-1.5 p-2 rounded bg-[#f7f5f0] border border-[#e3ded4] font-mono text-xs text-[#1c1917]">
                  {step.formulaDisplay}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

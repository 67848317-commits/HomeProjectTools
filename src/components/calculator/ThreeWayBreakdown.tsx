import React from 'react';
import { ArrowRight, Box, CheckCircle2 } from 'lucide-react';
import type { FlooringOutputs } from '../../scripts/calculators/flooring.ts';

interface ThreeWayBreakdownProps {
  outputs: FlooringOutputs;
}

export const ThreeWayBreakdown: React.FC<ThreeWayBreakdownProps> = ({ outputs }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-[#e3ded4] pb-2">
        <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[#1c1917]">
          Area & Packaging Breakdown
        </h3>
        <span className="text-[11px] font-mono text-[#78716c]">
          3-Stage Estimating Standard
        </span>
      </div>

      {/* 3-Stage Estimating Visual Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Stage 1: Mathematical Net */}
        <div className="p-3.5 rounded border border-[#e3ded4] bg-[#ffffff] relative">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-mono font-bold uppercase text-[#78716c] bg-[#f1ede4] px-1.5 py-0.5 rounded">
              Stage 1
            </span>
            <span className="text-[11px] text-[#78716c] font-mono">Net Geometry</span>
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-[#1c1917] tabular-nums mb-1">
            {outputs.netAreaSqFt}{' '}
            <span className="text-xs font-sans font-normal text-[#57534e]">sq ft</span>
          </div>
          <p className="text-xs text-[#57534e] leading-snug">
            Exact floor surface area of the room without any waste added.
          </p>
        </div>

        {/* Stage 2: Planning with Waste */}
        <div className="p-3.5 rounded border border-[#e3ded4] bg-[#ffffff] relative">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-mono font-bold uppercase text-[#1e3a5f] bg-[#edf3f9] px-1.5 py-0.5 rounded">
              Stage 2
            </span>
            <span className="text-[11px] text-[#1e3a5f] font-mono font-semibold">
              +{outputs.wastePercentage}% Waste
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-[#1e3a5f] tabular-nums mb-1">
            {outputs.recommendedPurchaseSqFt}{' '}
            <span className="text-xs font-sans font-normal text-[#57534e]">sq ft</span>
          </div>
          <p className="text-xs text-[#57534e] leading-snug">
            Minimum raw material needed for cuts, staggering, and perimeter joints (+{outputs.wasteAreaSqFt} sq ft).
          </p>
        </div>

        {/* Stage 3: Store Purchase Package */}
        <div className="p-3.5 rounded border-2 border-[#b8532b] bg-[#fcf4ee] relative">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-mono font-bold uppercase text-[#b8532b] bg-[#ffffff] px-1.5 py-0.5 rounded border border-[#e3ded4]">
              Stage 3
            </span>
            <span className="text-[11px] text-[#b8532b] font-mono font-semibold">
              Commercial Order
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-[#b8532b] tabular-nums mb-1">
            {outputs.cartonsToPurchase}{' '}
            <span className="text-xs font-sans font-normal text-[#1c1917]">cartons</span>
          </div>
          <p className="text-xs text-[#57534e] leading-snug">
            Total full boxes purchased ({outputs.purchasedSqFt} sq ft total, providing +{outputs.excessSqFtOverRecommended} sq ft spare cushion).
          </p>
        </div>
      </div>

      {/* Equation confirmation banner */}
      <div className="flex items-center gap-2 p-2.5 rounded bg-[#f1ede4] border border-[#e3ded4] text-xs font-mono text-[#57534e]">
        <CheckCircle2 className="h-4 w-4 text-[#15803d] shrink-0" />
        <span className="leading-snug">
          <strong>Packaging Rounding:</strong> {outputs.recommendedPurchaseSqFt} sq ft ÷ {outputs.cartonCoverage} sq ft/carton = {(outputs.recommendedPurchaseSqFt / outputs.cartonCoverage).toFixed(2)} boxes → rounded up to <strong>{outputs.cartonsToPurchase} cartons</strong>.
        </span>
      </div>
    </div>
  );
};

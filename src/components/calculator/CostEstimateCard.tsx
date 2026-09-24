import React, { useState } from 'react';
import { DollarSign, Info, Wrench, ShieldAlert } from 'lucide-react';
import type { CostEstimateSummary } from '../../types/index.ts';

interface CostEstimateCardProps {
  costEstimate?: CostEstimateSummary;
}

export const CostEstimateCard: React.FC<CostEstimateCardProps> = ({ costEstimate }) => {
  const [showInstalled, setShowInstalled] = useState(false);

  if (!costEstimate || !costEstimate.hasPricing) {
    return null;
  }

  const { materialsOnly, contractorInstalledTotal, benchmarkSources, disclaimer } = costEstimate;
  const activeCost = showInstalled && contractorInstalledTotal ? contractorInstalledTotal : materialsOnly;

  return (
    <div className="rounded border border-[#e3ded4] bg-[#ffffff] p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e3ded4] pb-3">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#b8532b]">
            Budget Planning
          </span>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1c1917]">
            Estimated Project Cost Range
          </h3>
        </div>

        {/* Materials vs Full Installation toggle */}
        {contractorInstalledTotal && (
          <div className="inline-flex rounded border border-[#c8c1b2] p-0.5 bg-[#f1ede4] text-xs font-mono">
            <button
              type="button"
              onClick={() => setShowInstalled(false)}
              className={`px-3 py-1.5 rounded transition-all ${
                !showInstalled
                  ? 'bg-[#ffffff] text-[#1c1917] font-bold shadow-xs'
                  : 'text-[#57534e] hover:text-[#1c1917]'
              }`}
            >
              Materials Only
            </button>
            <button
              type="button"
              onClick={() => setShowInstalled(true)}
              className={`px-3 py-1.5 rounded transition-all ${
                showInstalled
                  ? 'bg-[#ffffff] text-[#1c1917] font-bold shadow-xs'
                  : 'text-[#57534e] hover:text-[#1c1917]'
              }`}
            >
              + Contractor Labor
            </button>
          </div>
        )}
      </div>

      {/* Primary Cost Highlights */}
      <div className="grid grid-cols-3 gap-2.5 text-center">
        <div className="p-3 rounded bg-[#f7f5f0] border border-[#e3ded4]">
          <span className="block text-[11px] font-mono text-[#78716c] uppercase">
            Low DIY
          </span>
          <span className="block font-mono text-lg sm:text-2xl font-bold text-[#1c1917] tabular-nums mt-0.5">
            ${activeCost.low.toLocaleString()}
          </span>
          <span className="text-[10px] text-[#78716c] block mt-0.5">Budget material tier</span>
        </div>

        <div className="p-3 rounded bg-[#fcf4ee] border-2 border-[#b8532b]">
          <span className="block text-[11px] font-mono font-bold text-[#b8532b] uppercase">
            Typical / Average
          </span>
          <span className="block font-mono text-xl sm:text-3xl font-bold text-[#b8532b] tabular-nums mt-0.5">
            ${activeCost.typical.toLocaleString()}
          </span>
          <span className="text-[10px] text-[#57534e] font-medium block mt-0.5">Most common mid-tier</span>
        </div>

        <div className="p-3 rounded bg-[#f7f5f0] border border-[#e3ded4]">
          <span className="block text-[11px] font-mono text-[#78716c] uppercase">
            Premium
          </span>
          <span className="block font-mono text-lg sm:text-2xl font-bold text-[#1c1917] tabular-nums mt-0.5">
            ${activeCost.high.toLocaleString()}
          </span>
          <span className="text-[10px] text-[#78716c] block mt-0.5">Architectural / High-spec</span>
        </div>
      </div>

      {/* Labor detail callout if active */}
      {showInstalled && contractorInstalledTotal && (
        <div className="p-3 rounded bg-[#edf3f9] border border-[#c5d8ea] text-xs text-[#1e3a5f] space-y-1">
          <div className="font-semibold flex items-center gap-1.5 font-mono">
            <Wrench className="h-3.5 w-3.5" />
            <span>Labor Component Included: ${contractorInstalledTotal.laborOnlyTypical.toLocaleString()} typical (${contractorInstalledTotal.laborOnlyLow.toLocaleString()} – ${contractorInstalledTotal.laborOnlyHigh.toLocaleString()})</span>
          </div>
          <p className="text-[11px] text-[#33557a] leading-relaxed">
            {contractorInstalledTotal.scopeNote}
          </p>
        </div>
      )}

      {/* Benchmark Methodology & Disclaimers */}
      <div className="pt-2 border-t border-[#e3ded4] text-xs text-[#78716c] space-y-1">
        <div className="flex items-start gap-1.5">
          <Info className="h-3.5 w-3.5 text-[#57534e] shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>Benchmark Basis:</strong> {benchmarkSources.join(', ')}. Prices are regional planning benchmarks, not real-time store shelf quotes. Actual local sales tax, delivery charges, and supplier promotions will adjust final totals.
          </p>
        </div>
        {disclaimer && (
          <p className="text-[11px] text-[#78716c] italic pl-5">
            Note: {disclaimer}
          </p>
        )}
      </div>
    </div>
  );
};

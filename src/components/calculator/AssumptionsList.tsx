import React from 'react';
import { AlertCircle, CheckCircle2, PackageCheck } from 'lucide-react';
import type { CalculationAssumption } from '../../types/index.ts';

interface AssumptionsListProps {
  assumptions: CalculationAssumption[];
  notices?: string[];
  limitations?: string[];
  title?: string;
  scopeTitle?: string;
  benchmarkNote?: string;
}

export const AssumptionsList: React.FC<AssumptionsListProps> = ({
  assumptions,
  notices = [],
  limitations,
  title = 'Calculation Assumptions & Limitations',
  scopeTitle = 'Out of Scope / Separate Items',
  benchmarkNote = 'Costs reflect US median retail shelf and trade indices, updated periodically for planning budgeting.',
}) => {
  const defaultLimitations = [
    'Trim & Transitions: T-moldings, reducers, stair noses, and quarter-round base shoes are not included in primary material quantities.',
    'Substrate Preparation: Surface leveling, patching, moisture barriers, and subfloor repairs must be evaluated prior to installation.',
  ];

  const activeLimitations = limitations && limitations.length > 0 ? limitations : defaultLimitations;

  return (
    <div className="rounded border border-[#e3ded4] bg-[#ffffff] p-5 shadow-xs space-y-4">
      <div className="border-b border-[#e3ded4] pb-2.5">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#b8532b]">
          Planning Constraints
        </span>
        <h3 className="font-serif text-lg font-bold text-[#1c1917]">
          {title}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="space-y-3">
          <div className="font-mono uppercase font-semibold text-[#57534e] text-[11px]">
            Engine Assumptions
          </div>
          <ul className="space-y-2 text-[#57534e]">
            {assumptions.map((item) => (
              <li key={item.id} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#b8532b] shrink-0 mt-1.5"></span>
                <span>
                  <strong className="text-[#1c1917]">{item.title}:</strong> {item.detail}
                </span>
              </li>
            ))}
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#b8532b] shrink-0 mt-1.5"></span>
              <span>
                <strong className="text-[#1c1917]">Benchmark Nature:</strong> {benchmarkNote}
              </span>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <div className="font-mono uppercase font-semibold text-[#57534e] text-[11px]">
            {scopeTitle}
          </div>
          <ul className="space-y-2 text-[#57534e]">
            {activeLimitations.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#78716c] shrink-0 mt-1.5"></span>
                <span>{item}</span>
              </li>
            ))}
            {notices.map((notice, idx) => (
              <li key={idx} className="flex items-start gap-2 text-[#b8532b] bg-[#fcf4ee] p-2 rounded border border-[#f1ede4]">
                <PackageCheck className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="font-medium">{notice}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

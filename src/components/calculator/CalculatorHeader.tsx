import React from 'react';
import { Layers, HelpCircle, Package, ShieldCheck } from 'lucide-react';

interface CalculatorHeaderProps {
  title: string;
  categoryName: string;
  description: string;
  targetIntent?: string;
}

export const CalculatorHeader: React.FC<CalculatorHeaderProps> = ({
  title,
  categoryName,
  description,
  targetIntent,
}) => {
  return (
    <div className="border-b border-[#e3ded4] pb-6 mb-8">
      {/* Category badge */}
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#f1ede4] border border-[#e3ded4] text-xs font-mono text-[#57534e] mb-3">
        <Layers className="h-3.5 w-3.5 text-[#b8532b]" />
        <span>{categoryName} Estimating Worksheet</span>
      </div>

      {/* Primary Page Heading */}
      <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#1c1917] mb-3">
        {title}
      </h1>

      {/* Supporting Copy */}
      <p className="text-base sm:text-lg text-[#57534e] leading-relaxed max-w-3xl mb-4">
        {description}
      </p>

      {/* Worksheet Key Facts Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#f1ede4] text-xs font-mono text-[#57534e]">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#b8532b]"></span>
          <span>Output: Full Cartons</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1e3a5f]"></span>
          <span>Waste: 10% Std / 15% Diag</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#57534e]"></span>
          <span>Pricing: US National Tier</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#15803d]"></span>
          <span>Standard: Ceiling Rounding</span>
        </div>
      </div>
    </div>
  );
};

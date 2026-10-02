import React from 'react';
import { ArrowRight } from 'lucide-react';

export interface CalculatorCardProps {
  id: string;
  name: string;
  description: string;
  categoryName: string;
  outputSummary: string;
  href: string;
  ctaText?: string;
  onNavigate?: (path: string) => void;
  className?: string;
}

export const CalculatorCard: React.FC<CalculatorCardProps> = ({
  name,
  description,
  categoryName,
  outputSummary,
  href,
  ctaText = 'Open Estimator',
  onNavigate,
  className = '',
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  return (
    <div
      className={`rounded-xl border border-[#e3ded4] bg-[#ffffff] p-5 sm:p-6 shadow-2xs hover:border-[#b8532b] hover:shadow-sm transition-all flex flex-col justify-between group ${className}`}
    >
      <div className="space-y-3">
        {/* Unboxed Metadata Header */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-mono text-[#b8532b] font-semibold uppercase tracking-wider text-[11px]">
            {categoryName}
          </span>
          <span className="text-[#c8c1b2]" aria-hidden="true">·</span>
          <span className="text-[11px] font-mono text-[#78716c]">
            Interactive Worksheet
          </span>
        </div>

        {/* Title */}
        <div>
          <h3 className="font-serif text-lg font-bold text-[#1c1917] group-hover:text-[#b8532b] transition-colors leading-snug">
            {name}
          </h3>
        </div>

        {/* Homeowner Description */}
        <p className="text-xs text-[#57534e] leading-relaxed line-clamp-3">
          {description}
        </p>

        {/* Key Planning Outputs Box */}
        <div className="pt-2">
          <div className="rounded-lg bg-[#fdfbf7] border border-[#f1ede4] p-3 space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#78716c] block font-semibold">
              Key Deliverables
            </span>
            <span className="text-xs font-mono font-medium text-[#1c1917] block leading-snug">
              {outputSummary}
            </span>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="mt-5 pt-3 border-t border-[#f1ede4] flex items-center justify-between">
        <a
          href={href}
          onClick={handleClick}
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#b8532b] group-hover:text-[#9e431f] transition-colors"
        >
          <span>{ctaText}</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </div>
  );
};

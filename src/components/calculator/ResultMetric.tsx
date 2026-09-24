import React from 'react';

interface ResultMetricProps {
  label: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  variant?: 'primary' | 'secondary' | 'accent';
  className?: string;
}

export const ResultMetric: React.FC<ResultMetricProps> = ({
  label,
  value,
  unit,
  subtext,
  variant = 'secondary',
  className = '',
}) => {
  if (variant === 'primary') {
    return (
      <div className={`p-5 rounded-lg border-2 border-[#b8532b] bg-[#fcf4ee] shadow-xs ${className}`}>
        <span className="block text-xs font-mono uppercase tracking-wider font-semibold text-[#b8532b] mb-1">
          {label}
        </span>
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#1c1917] tabular-nums">
            {value}
          </span>
          {unit && (
            <span className="font-serif text-xl sm:text-2xl font-bold text-[#b8532b]">
              {unit}
            </span>
          )}
        </div>
        {subtext && (
          <p className="mt-2 text-xs font-medium text-[#57534e] leading-snug">
            {subtext}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`p-4 rounded border border-[#e3ded4] bg-[#ffffff] ${className}`}>
      <span className="block text-xs font-mono uppercase tracking-wider text-[#78716c] mb-1">
        {label}
      </span>
      <div className="flex items-baseline gap-1.5">
        <span className="font-mono text-2xl sm:text-3xl font-bold text-[#1c1917] tabular-nums">
          {value}
        </span>
        {unit && (
          <span className="text-sm font-semibold text-[#57534e]">
            {unit}
          </span>
        )}
      </div>
      {subtext && (
        <p className="mt-1 text-xs text-[#78716c]">
          {subtext}
        </p>
      )}
    </div>
  );
};

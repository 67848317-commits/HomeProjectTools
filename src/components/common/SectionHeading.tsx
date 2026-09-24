import React from 'react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  numberPrefix?: string;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  numberPrefix,
  className = '',
}) => {
  return (
    <div className={`border-b border-[#e3ded4] pb-3 mb-6 ${className}`}>
      <div className="flex items-center gap-2">
        {numberPrefix && (
          <span className="font-mono text-xs font-bold text-[#b8532b] bg-[#fcf4ee] px-2 py-0.5 rounded border border-[#e3ded4]">
            {numberPrefix}
          </span>
        )}
        <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1c1917]">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="mt-1.5 text-sm text-[#57534e] leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

import React from 'react';

export interface SelectOptionItem {
  value: string;
  label: string;
  description?: string;
}

interface CalculatorSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOptionItem[];
  description?: string;
  required?: boolean;
}

export const CalculatorSelect: React.FC<CalculatorSelectProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  description,
  required = false,
}) => {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-[#1c1917]">
        {label}
        {required && <span className="text-[#b8532b] ml-1">*</span>}
      </label>

      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full rounded border border-[#c8c1b2] bg-[#ffffff] py-2.5 pl-3.5 pr-10 text-[#1c1917] text-sm font-medium transition-colors hover:border-[#a8a192] focus:outline-none focus:ring-2 focus:ring-[#b8532b] focus:border-[#b8532b] h-11"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {description && (
        <p className="text-xs text-[#78716c] leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

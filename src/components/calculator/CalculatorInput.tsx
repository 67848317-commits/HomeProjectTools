import React from 'react';
import { AlertCircle } from 'lucide-react';

interface CalculatorInputProps {
  id: string;
  label: string;
  value: number | string;
  onChange: (value: number) => void;
  unit?: string;
  description?: string;
  min?: number;
  max?: number;
  step?: number;
  error?: string;
  required?: boolean;
}

export const CalculatorInput: React.FC<CalculatorInputProps> = ({
  id,
  label,
  value,
  onChange,
  unit,
  description,
  min = 0,
  max,
  step = 1,
  error,
  required = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    if (rawVal === '') {
      onChange(0);
      return;
    }
    const num = parseFloat(rawVal);
    onChange(isNaN(num) ? 0 : num);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-[#1c1917]"
        >
          {label}
          {required && <span className="text-[#b8532b] ml-1">*</span>}
        </label>
        {unit && (
          <span className="text-xs font-mono text-[#78716c] uppercase tracking-wider">
            in {unit}
          </span>
        )}
      </div>

      <div className="relative rounded-md shadow-xs">
        <input
          type="number"
          id={id}
          name={id}
          value={value === 0 ? '' : value}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          placeholder="0"
          className={`block w-full rounded border bg-[#ffffff] py-2.5 pl-3.5 pr-12 text-[#1c1917] font-mono text-base sm:text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#b8532b] focus:border-[#b8532b] h-11 ${
            error
              ? 'border-[#b91c1c] text-[#b91c1c] focus:ring-[#b91c1c] focus:border-[#b91c1c]'
              : 'border-[#c8c1b2] hover:border-[#a8a192]'
          }`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : description ? `${id}-desc` : undefined}
        />
        {unit && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-xs font-mono font-medium text-[#57534e] bg-[#f1ede4] px-2 py-1 rounded border border-[#e3ded4]">
              {unit}
            </span>
          </div>
        )}
      </div>

      {description && !error && (
        <p id={`${id}-desc`} className="text-xs text-[#78716c] leading-relaxed">
          {description}
        </p>
      )}

      {error && (
        <div id={`${id}-error`} className="flex items-center gap-1.5 text-xs text-[#b91c1c] pt-0.5">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

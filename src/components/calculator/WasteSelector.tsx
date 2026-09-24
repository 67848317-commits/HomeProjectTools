import React, { useState } from 'react';
import { HelpCircle, Percent } from 'lucide-react';
import type { WasteOption } from '../../types/index.ts';

interface WasteSelectorProps {
  value: number;
  onChange: (percentage: number) => void;
  options: WasteOption[];
  title?: string;
  customLabel?: string;
  principleNote?: string;
  unitLabel?: string;
  max?: number;
}

export const WasteSelector: React.FC<WasteSelectorProps> = ({
  value,
  onChange,
  options,
  title = 'Cut & Pattern Waste Factor',
  customLabel = 'Allowance',
  principleNote,
  unitLabel = '%',
  max = 50,
}) => {
  const [isCustom, setIsCustom] = useState(() => !options.some((o) => o.percentage === value));

  const handlePresetClick = (pct: number) => {
    setIsCustom(false);
    onChange(pct);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const num = parseFloat(raw);
    onChange(isNaN(num) ? 0 : Math.max(0, Math.min(max, num)));
  };

  const defaultPrinciple = 'Waste accounts for material cutoffs, pattern matching, joint overlaps, and perimeter trimming. It is applied once to the net requirement before commercial packages are counted.';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-[#1c1917]">
          {title}
        </label>
        <span className="text-xs font-mono font-bold text-[#b8532b] bg-[#fcf4ee] px-2 py-0.5 rounded border border-[#e3ded4]">
          {value}{unitLabel} {customLabel}
        </span>
      </div>

      {/* Preset tiles */}
      {options.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {options.map((option) => {
            const isSelected = !isCustom && value === option.percentage;
            return (
              <button
                type="button"
                key={option.percentage}
                onClick={() => handlePresetClick(option.percentage)}
                className={`flex flex-col text-left p-2.5 rounded border transition-all ${
                  isSelected
                    ? 'border-[#b8532b] bg-[#fcf4ee] shadow-xs ring-1 ring-[#b8532b]'
                    : 'border-[#c8c1b2] bg-[#ffffff] hover:border-[#a8a192] hover:bg-[#faf8f5]'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xs font-semibold text-[#1c1917]">
                    {option.label}
                  </span>
                  <span className={`text-xs font-mono font-bold ${isSelected ? 'text-[#b8532b]' : 'text-[#57534e]'}`}>
                    {option.percentage}%
                  </span>
                </div>
                <p className="text-[11px] text-[#78716c] leading-normal">
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {/* Custom waste input toggle */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={() => setIsCustom(!isCustom)}
          className="text-xs font-mono text-[#57534e] hover:text-[#b8532b] underline"
        >
          {isCustom ? 'Use standard layout presets' : 'Enter custom percentage...'}
        </button>

        {isCustom && (
          <div className="flex items-center gap-1.5 w-32">
            <input
              type="number"
              min={0}
              max={max}
              step={1}
              value={value}
              onChange={handleCustomChange}
              className="w-full rounded border border-[#b8532b] bg-[#ffffff] py-1 px-2 text-right font-mono text-sm font-semibold text-[#1c1917] focus:outline-none focus:ring-2 focus:ring-[#b8532b]"
            />
            <span className="text-xs font-mono text-[#57534e]">{unitLabel}</span>
          </div>
        )}
      </div>

      <p className="text-xs text-[#78716c] leading-relaxed bg-[#f1ede4] p-2.5 rounded border border-[#e3ded4]">
        <strong className="text-[#1c1917] font-semibold">Estimating Principle:</strong> {principleNote ?? defaultPrinciple}
      </p>
    </div>
  );
};

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export interface EstimatingStage {
  stageNumber: number | string;
  stageTitle: string;
  badgeText?: string;
  badgeVariant?: 'neutral' | 'info' | 'accent' | 'warning' | 'terracotta';
  primaryValue: string | number;
  primaryUnit: string;
  secondaryNote?: string;
  description: string;
  isCallout?: boolean;
}

interface EstimatingFlowProps {
  title?: string;
  subtitle?: string;
  stages: EstimatingStage[];
  formulaConfirmation?: React.ReactNode;
}

export const EstimatingFlow: React.FC<EstimatingFlowProps> = ({
  title = 'Area & Packaging Breakdown',
  subtitle = 'Multi-Stage Estimating Standard',
  stages,
  formulaConfirmation,
}) => {
  const getBadgeStyle = (variant?: string) => {
    switch (variant) {
      case 'info':
        return 'text-[#1e3a5f] bg-[#edf3f9] border-[#c5d8ea]';
      case 'accent':
      case 'terracotta':
        return 'text-[#b8532b] bg-[#fcf4ee] border-[#f1ede4]';
      case 'warning':
        return 'text-[#854d0e] bg-[#fef9c3] border-[#fde047]';
      case 'neutral':
      default:
        return 'text-[#78716c] bg-[#f1ede4] border-[#e3ded4]';
    }
  };

  const gridColsClass =
    stages.length === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : stages.length === 3
      ? 'grid-cols-1 md:grid-cols-3'
      : stages.length === 4
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      : 'grid-cols-1 md:grid-cols-3';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-[#e3ded4] pb-2">
        <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[#1c1917]">
          {title}
        </h3>
        <span className="text-[11px] font-mono text-[#78716c]">
          {subtitle}
        </span>
      </div>

      {/* Multi-Stage Estimating Visual Cards */}
      <div className={`grid ${gridColsClass} gap-3`}>
        {stages.map((stage, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded relative transition-all ${
              stage.isCallout
                ? 'border-2 border-[#b8532b] bg-[#fcf4ee]'
                : 'border border-[#e3ded4] bg-[#ffffff]'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span
                className={`text-[11px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border ${
                  stage.isCallout
                    ? 'bg-[#ffffff] text-[#b8532b] border-[#e3ded4]'
                    : 'bg-[#f1ede4] text-[#78716c] border-[#e3ded4]'
                }`}
              >
                Stage {stage.stageNumber}
              </span>
              {stage.badgeText && (
                <span
                  className={`text-[11px] font-mono font-semibold px-1.5 py-0.2 rounded border ${getBadgeStyle(
                    stage.badgeVariant
                  )}`}
                >
                  {stage.badgeText}
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-1.5 mb-1">
              <span
                className={`font-mono text-xl sm:text-2xl font-bold tabular-nums ${
                  stage.isCallout ? 'text-[#b8532b]' : 'text-[#1c1917]'
                }`}
              >
                {stage.primaryValue}
              </span>
              <span
                className={`text-xs font-sans ${
                  stage.isCallout
                    ? 'font-medium text-[#1c1917]'
                    : 'font-normal text-[#57534e]'
                }`}
              >
                {stage.primaryUnit}
              </span>
            </div>

            {stage.secondaryNote && (
              <div className="text-[11px] font-mono text-[#78716c] mb-1">
                {stage.secondaryNote}
              </div>
            )}

            <p className="text-xs text-[#57534e] leading-snug">
              {stage.description}
            </p>
          </div>
        ))}
      </div>

      {/* Formula Confirmation Banner */}
      {formulaConfirmation && (
        <div className="flex items-start sm:items-center gap-2 p-2.5 rounded bg-[#f1ede4] border border-[#e3ded4] text-xs font-mono text-[#57534e]">
          <CheckCircle2 className="h-4 w-4 text-[#15803d] shrink-0 mt-0.5 sm:mt-0" />
          <div className="leading-snug">{formulaConfirmation}</div>
        </div>
      )}
    </div>
  );
};

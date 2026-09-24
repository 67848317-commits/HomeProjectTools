import React from 'react';
import { Lightbulb, Layers, ShieldCheck, ThermometerSnowflake, Wrench } from 'lucide-react';

export interface PracticalTipItem {
  title: string;
  desc: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface PracticalTipsProps {
  title?: string;
  subtitle?: string;
  tips?: PracticalTipItem[];
}

export const PracticalTips: React.FC<PracticalTipsProps> = ({
  title = 'Practical Homeowner Tips for Flooring Purchases',
  subtitle = 'Contractor Field Notes',
  tips,
}) => {
  const defaultTips: PracticalTipItem[] = [
    {
      title: 'Match Production Dye Lots & Run Numbers',
      desc: 'Verify that every carton has the identical run/dye lot stamp before leaving the retailer. Subtle sheen and shade variations occur between manufacturing batches.',
      icon: Layers,
    },
    {
      title: 'Acclimate Material In The Room',
      desc: 'Store flooring flat in the installation room for 48 hours (especially engineered wood and laminate) to equilibrate to ambient temperature and relative humidity.',
      icon: ThermometerSnowflake,
    },
    {
      title: 'Retain One Sealed Spare Box',
      desc: 'Always save one unopened carton in a dry storage closet. If a plank is gouged by moving furniture or dishwasher leaks occur years later, identical replacements are invaluable.',
      icon: ShieldCheck,
    },
    {
      title: 'Check Subfloor Flatness Standards',
      desc: 'Click-lock floating floors require a subfloor deviation of no more than 3/16" over a 10-foot radius. High spots must be sanded down and dips filled before laying.',
      icon: Wrench,
    },
  ];

  const activeTips = tips && tips.length > 0 ? tips : defaultTips;

  return (
    <div className="rounded border border-[#e3ded4] bg-[#ffffff] p-5 shadow-xs space-y-4">
      <div className="border-b border-[#e3ded4] pb-2.5">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#b8532b]">
          {subtitle}
        </span>
        <h3 className="font-serif text-lg font-bold text-[#1c1917]">
          {title}
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {activeTips.map((tip, idx) => {
          const Icon = tip.icon ?? Lightbulb;
          return (
            <div key={idx} className="p-3.5 rounded bg-[#f7f5f0] border border-[#e3ded4] space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-sm text-[#1c1917]">
                <div className="p-1 rounded bg-[#ffffff] border border-[#e3ded4] text-[#b8532b]">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <span>{tip.title}</span>
              </div>
              <p className="text-[#57534e] leading-relaxed pl-7">
                {tip.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

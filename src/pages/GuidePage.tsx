import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calculator,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  HelpCircle,
  Info,
  Layers,
  Ruler,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import type { GuideDefinition, CalculatorDefinition } from '../types/index.ts';
import { getCategoryById } from '../data/categories.ts';
import { getCalculatorById } from '../data/calculators.ts';
import { getGuideBySlug } from '../data/guides.ts';
import { trackGuideCalculatorClick } from '../lib/analytics.ts';

interface GuidePageProps {
  guide: GuideDefinition;
  onNavigate: (path: string) => void;
}

export const GuidePage: React.FC<GuidePageProps> = ({ guide, onNavigate }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const category = getCategoryById(guide.categoryId);
  const primaryCalculator = getCalculatorById(guide.targetCalculatorId);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const relatedGuidesList = guide.relatedGuideSlugs
    .map((slug) => getGuideBySlug(slug))
    .filter((g): g is GuideDefinition => g !== undefined);

  const relatedCalculatorsList = guide.relatedCalculatorIds
    .map((id) => getCalculatorById(id))
    .filter((c): c is CalculatorDefinition => c !== undefined && c.id !== guide.targetCalculatorId);

  return (
    <article className="min-h-screen bg-[#fcfbf9] text-[#1c1917] pb-24 font-sans">
      {/* Editorial Top Navigation & Breadcrumbs */}
      <div className="border-b border-[#e3ded4] bg-[#f7f5f0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <nav aria-label="Breadcrumb" className="flex items-center text-xs text-[#78716c] font-mono">
            <button
              onClick={() => onNavigate('/')}
              className="hover:text-[#b8532b] transition-colors"
            >
              Home
            </button>
            <span className="mx-2 text-[#a8a29e]">/</span>
            {category && (
              <>
                <button
                  onClick={() => onNavigate(category.hubPath)}
                  className="hover:text-[#b8532b] transition-colors"
                >
                  {category.name}
                </button>
                <span className="mx-2 text-[#a8a29e]">/</span>
              </>
            )}
            <span className="text-[#1c1917] font-semibold truncate max-w-[260px] sm:max-w-none">
              {guide.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Guide Header */}
      <header className="border-b border-[#e3ded4] bg-white py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {category && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-semibold uppercase tracking-wider bg-[#f1ede4] text-[#44403c]">
                <Layers className="h-3 w-3 text-[#b8532b]" />
                {category.name}
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono text-[#78716c] bg-[#faf8f5]">
              <Clock className="h-3 w-3" />
              {guide.readingTimeMinutes} min read
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono text-[#78716c] bg-[#faf8f5]">
              <Calendar className="h-3 w-3" />
              Updated {guide.lastReviewedDate}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1c1917] leading-[1.15]">
            {guide.title}
          </h1>

          {guide.subtitle && (
            <p className="mt-4 text-lg sm:text-xl text-[#57534e] leading-relaxed font-serif italic">
              {guide.subtitle}
            </p>
          )}

          {/* Quick Primary Calculator Jump Card */}
          <div className="mt-8 p-4 rounded-lg bg-[#f7f5f0] border border-[#e3ded4] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2 rounded bg-white border border-[#e3ded4] text-[#b8532b]">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#78716c]">Companion Estimator</span>
                <p className="font-semibold text-sm text-[#1c1917]">
                  {guide.targetCalculatorName}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                trackGuideCalculatorClick({
                  guide_slug: guide.slug,
                  calculator_slug: guide.targetCalculatorId,
                });
                onNavigate(guide.targetCalculatorPath);
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded font-mono text-xs font-semibold bg-[#b8532b] text-white hover:bg-[#a04422] transition-colors shadow-xs"
            >
              <span>Open Calculator</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10">
        <div className="space-y-12">
          {/* Quick Answer / Takeaways Box */}
          <section className="p-5 sm:p-6 rounded-lg bg-[#f4efe6] border border-[#dfd6c5] shadow-xs">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#b8532b] mb-2">
              <Sparkles className="h-4 w-4" />
              <span>Quick Answer & Key Formula</span>
            </div>
            <p className="text-base sm:text-lg text-[#1c1917] font-medium leading-relaxed">
              {guide.quickAnswer}
            </p>
          </section>

          {/* Introduction */}
          <section className="space-y-4 text-base sm:text-lg text-[#44403c] leading-relaxed">
            {guide.introduction.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </section>

          {/* What You Need to Measure */}
          <section className="space-y-6 pt-4 border-t border-[#e3ded4]">
            <div className="flex items-center gap-2">
              <Ruler className="h-5 w-5 text-[#b8532b]" />
              <h2 className="font-serif text-2xl font-bold text-[#1c1917]">
                What You Need to Measure
              </h2>
            </div>
            <p className="text-sm text-[#57534e]">
              Before running any numbers, take these specific field measurements with a reliable steel tape measure or laser distance meter:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guide.measurementsNeeded.map((meas, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-white border border-[#e3ded4] hover:border-[#b8532b]/40 transition-colors shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm text-[#1c1917]">
                      {meas.item}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#f1ede4] text-[#57534e]">
                      {meas.unit}
                    </span>
                  </div>
                  <p className="text-xs text-[#57534e] mb-2 leading-relaxed">
                    {meas.description}
                  </p>
                  <div className="pt-2 border-t border-[#f7f5f0] text-xs text-[#78716c]">
                    <span className="font-mono font-medium text-[#44403c]">How to measure: </span>
                    {meas.howToMeasure}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* The Three-Stage Estimating Method */}
          <section className="space-y-6 pt-4 border-t border-[#e3ded4]">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-[#b8532b]" />
              <h2 className="font-serif text-2xl font-bold text-[#1c1917]">
                The Three-Stage Estimating Method
              </h2>
            </div>
            <p className="text-sm text-[#57534e] leading-relaxed">
              Every calculator on Home Project Tools follows this rigorous 3-stage model. Never skip straight to ordering material without completing all three stages:
            </p>

            <div className="grid grid-cols-1 gap-4">
              {/* Stage 1 */}
              <div className="p-5 rounded-lg bg-white border-l-4 border-l-[#78716c] border border-[#e3ded4] shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-wider font-bold text-[#78716c]">
                    Stage 1
                  </span>
                  <span className="text-xs font-mono text-[#78716c]">Geometry Output</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#1c1917]">
                  {guide.threeStageExplanation.stage1Title}
                </h3>
                <div className="p-2.5 rounded bg-[#f7f5f0] font-mono text-xs text-[#1c1917] border border-[#e3ded4]">
                  {guide.threeStageExplanation.stage1Formula}
                </div>
                <p className="text-sm text-[#57534e] leading-relaxed">
                  {guide.threeStageExplanation.stage1Description}
                </p>
              </div>

              {/* Stage 2 */}
              <div className="p-5 rounded-lg bg-white border-l-4 border-l-[#d97706] border border-[#e3ded4] shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-wider font-bold text-[#d97706]">
                    Stage 2
                  </span>
                  <span className="text-xs font-mono text-[#d97706]">Field Reality Factor</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#1c1917]">
                  {guide.threeStageExplanation.stage2Title}
                </h3>
                <div className="p-2.5 rounded bg-[#fffbeb] font-mono text-xs text-[#92400e] border border-[#fef3c7]">
                  {guide.threeStageExplanation.stage2Formula}
                </div>
                <p className="text-sm text-[#57534e] leading-relaxed">
                  {guide.threeStageExplanation.stage2Description}
                </p>
              </div>

              {/* Stage 3 */}
              <div className="p-5 rounded-lg bg-white border-l-4 border-l-[#b8532b] border border-[#e3ded4] shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-wider font-bold text-[#b8532b]">
                    Stage 3
                  </span>
                  <span className="text-xs font-mono text-[#b8532b]">Commercial Ceiling</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#1c1917]">
                  {guide.threeStageExplanation.stage3Title}
                </h3>
                <div className="p-2.5 rounded bg-[#fdf2ee] font-mono text-xs text-[#b8532b] border border-[#fbdcd2]">
                  {guide.threeStageExplanation.stage3Formula}
                </div>
                <p className="text-sm text-[#57534e] leading-relaxed">
                  {guide.threeStageExplanation.stage3Description}
                </p>
              </div>
            </div>
          </section>

          {/* Practical Worked Example */}
          <section className="space-y-6 pt-4 border-t border-[#e3ded4]">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-[#b8532b]" />
              <h2 className="font-serif text-2xl font-bold text-[#1c1917]">
                Practical Worked Example
              </h2>
            </div>

            <div className="rounded-lg border border-[#e3ded4] bg-white overflow-hidden shadow-xs">
              <div className="p-5 bg-[#f7f5f0] border-b border-[#e3ded4]">
                <span className="text-xs font-mono uppercase tracking-wider text-[#78716c]">Real-World Scenario</span>
                <p className="font-medium text-base text-[#1c1917] mt-1">
                  {guide.practicalExample.scenario}
                </p>
              </div>

              {/* Inputs summary */}
              <div className="p-5 border-b border-[#e3ded4] bg-[#faf8f5]">
                <span className="text-xs font-mono uppercase tracking-wider text-[#78716c] block mb-3">Project Inputs</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(guide.practicalExample.inputs).map(([key, value]) => (
                    <div key={key} className="p-2.5 rounded bg-white border border-[#e3ded4] text-xs">
                      <span className="text-[#78716c] block">{key}</span>
                      <span className="font-mono font-semibold text-[#1c1917] mt-0.5 block">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step by step calculations */}
              <div className="p-5 space-y-4">
                <span className="text-xs font-mono uppercase tracking-wider text-[#78716c] block">Calculation Steps</span>
                <div className="space-y-3">
                  {guide.practicalExample.steps.map((st, idx) => (
                    <div key={idx} className="p-3.5 rounded bg-[#fcfbf9] border border-[#e3ded4] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[#b8532b]">{st.step}</span>
                        <span className="text-xs font-medium text-[#78716c]">{st.title}</span>
                      </div>
                      <div className="p-2 rounded bg-white font-mono text-xs text-[#1c1917] border border-[#e8e4dc]">
                        {st.calculation}
                      </div>
                      <p className="text-xs text-[#57534e] italic">
                        {st.note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Result Summary */}
              <div className="p-5 bg-[#f4efe6] border-t border-[#dfd6c5]">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-[#15803d] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#15803d]">Purchasing Plan</span>
                    <p className="text-sm font-semibold text-[#1c1917] mt-1 leading-relaxed">
                      {guide.practicalExample.resultSummary}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Deep Dive Editorial Sections */}
          {guide.sections.map((section) => (
            <section key={section.id} className="space-y-4 pt-4 border-t border-[#e3ded4]">
              <h2 className="font-serif text-2xl font-bold text-[#1c1917]">
                {section.title}
              </h2>
              <div className="text-base text-[#44403c] leading-relaxed whitespace-pre-line">
                {section.content}
              </div>

              {/* Optional Table */}
              {section.table && (
                <div className="mt-4 overflow-x-auto rounded-lg border border-[#e3ded4]">
                  <table className="w-full text-left text-sm">
                    {section.table.caption && (
                      <caption className="p-2 text-xs font-mono text-[#78716c] bg-[#f7f5f0] text-left border-b border-[#e3ded4]">
                        {section.table.caption}
                      </caption>
                    )}
                    <thead className="bg-[#f7f5f0] font-mono text-xs text-[#44403c] uppercase">
                      <tr>
                        {section.table.headers.map((h, i) => (
                          <th key={i} className="px-4 py-3 border-b border-[#e3ded4]">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e3ded4] bg-white">
                      {section.table.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-[#faf8f5] transition-colors">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="px-4 py-3 text-xs sm:text-sm text-[#44403c]">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Optional Callout */}
              {section.callout && (
                <div
                  className={`mt-4 p-4 rounded-lg border flex items-start gap-3 ${
                    section.callout.type === 'warning'
                      ? 'bg-[#fffbeb] border-[#fde68a] text-[#92400e]'
                      : section.callout.type === 'tip'
                      ? 'bg-[#f0fdf4] border-[#bbf7d0] text-[#166534]'
                      : 'bg-[#f7f5f0] border-[#e3ded4] text-[#44403c]'
                  }`}
                >
                  <Info className="h-5 w-5 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-sm block">
                      {section.callout.title}
                    </span>
                    <p className="text-xs sm:text-sm mt-0.5 leading-relaxed">
                      {section.callout.text}
                    </p>
                  </div>
                </div>
              )}
            </section>
          ))}

          {/* Cost Planning & Benchmark Pricing */}
          <section className="space-y-6 pt-4 border-t border-[#e3ded4]">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-[#b8532b]" />
              <h2 className="font-serif text-2xl font-bold text-[#1c1917]">
                Cost Planning & Benchmark Pricing
              </h2>
            </div>
            <p className="text-sm text-[#57534e] leading-relaxed">
              {guide.costPlanning.overview}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {guide.costPlanning.materialTiers.map((tier, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-white border border-[#e3ded4] flex flex-col justify-between shadow-2xs"
                >
                  <div>
                    <span className="text-xs font-mono font-bold text-[#b8532b] block mb-1">
                      Tier {idx + 1}
                    </span>
                    <h3 className="font-semibold text-sm text-[#1c1917]">
                      {tier.tier}
                    </h3>
                    <p className="text-xs text-[#57534e] mt-2 leading-relaxed">
                      {tier.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#f7f5f0] font-mono text-xs font-bold text-[#1c1917]">
                    {tier.range}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-lg bg-[#faf8f5] border border-[#e3ded4]">
              <span className="text-xs font-mono uppercase tracking-wider text-[#78716c] block mb-1">
                DIY vs. Contractor Labor
              </span>
              <p className="text-xs sm:text-sm text-[#57534e] leading-relaxed">
                {guide.costPlanning.diyVsContractor}
              </p>
            </div>

            <p className="text-xs text-[#78716c] italic">
              Note: {guide.costPlanning.benchmarksNote}
            </p>
          </section>

          {/* Common Homeowner Mistakes */}
          <section className="space-y-6 pt-4 border-t border-[#e3ded4]">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-[#dc2626]" />
              <h2 className="font-serif text-2xl font-bold text-[#1c1917]">
                Common Mistakes to Avoid
              </h2>
            </div>
            <p className="text-sm text-[#57534e]">
              Field reports show these errors account for over 80% of project delays, re-trips, and budget overruns:
            </p>

            <div className="space-y-3">
              {guide.commonMistakes.map((cm, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-white border border-[#e3ded4] space-y-2 shadow-2xs"
                >
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-xs font-bold text-[#dc2626] bg-[#fef2f2] px-2 py-0.5 rounded">
                      Mistake #{idx + 1}
                    </span>
                    <h3 className="font-semibold text-sm text-[#1c1917]">
                      {cm.mistake}
                    </h3>
                  </div>
                  <p className="text-xs text-[#57534e] leading-relaxed pl-1">
                    <strong className="text-[#44403c]">Why it matters: </strong>
                    {cm.whyItMatters}
                  </p>
                  <p className="text-xs text-[#15803d] font-medium leading-relaxed pl-1 pt-1 border-t border-[#f7f5f0]">
                    <strong>Prevention: </strong>
                    {cm.prevention}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* When the Estimate Changes */}
          <section className="space-y-4 pt-4 border-t border-[#e3ded4]">
            <h2 className="font-serif text-2xl font-bold text-[#1c1917]">
              When the Estimate Changes
            </h2>
            <p className="text-sm text-[#57534e]">
              Field conditions that will alter your calculated purchase quantities:
            </p>
            <ul className="space-y-2">
              {guide.whenEstimateChanges.map((change, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-[#44403c]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#b8532b] mt-2 shrink-0" />
                  <span>{change}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Primary Calculator CTA Banner */}
          <section className="p-6 sm:p-8 rounded-xl bg-[#1c1917] text-white space-y-4 shadow-lg">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#d57a53]">
              <Calculator className="h-4 w-4" />
              <span>Ready to Run Your Project?</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Launch the {guide.targetCalculatorName}
            </h2>
            <p className="text-sm text-[#d6d3d1] max-w-2xl leading-relaxed">
              Use our verified calculation engine with your room dimensions, customizable cut waste allowance, commercial carton/bag rounding, and local benchmark pricing.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  trackGuideCalculatorClick({
                    guide_slug: guide.slug,
                    calculator_slug: guide.targetCalculatorId,
                  });
                  onNavigate(guide.targetCalculatorPath);
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-mono text-sm font-semibold bg-[#b8532b] text-white hover:bg-[#a04422] transition-colors shadow-md"
              >
                <span>Calculate My Project Now</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>

          {/* Complementary Calculators */}
          {relatedCalculatorsList.length > 0 && (
            <section className="space-y-4 pt-4 border-t border-[#e3ded4]">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl font-bold text-[#1c1917]">
                  Related Project Calculators
                </h2>
                <span className="text-xs font-mono text-[#78716c]">Companion Tools</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedCalculatorsList.map((calc) => (
                  <div
                    key={calc.id}
                    onClick={() => {
                      trackGuideCalculatorClick({
                        guide_slug: guide.slug,
                        calculator_slug: calc.slug,
                      });
                      onNavigate(`/calculators/${calc.slug}`);
                    }}
                    className="p-4 rounded-lg bg-white border border-[#e3ded4] hover:border-[#b8532b] transition-all cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-sm text-[#1c1917] group-hover:text-[#b8532b] transition-colors">
                        {calc.name}
                      </h3>
                      <ArrowRight className="h-3.5 w-3.5 text-[#78716c] group-hover:text-[#b8532b] group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-xs text-[#57534e] line-clamp-2">
                      {calc.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Related Pilot Guides (Only Live Ones) */}
          {relatedGuidesList.length > 0 && (
            <section className="space-y-4 pt-4 border-t border-[#e3ded4]">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl font-bold text-[#1c1917]">
                  Related Planning Guides
                </h2>
                <span className="text-xs font-mono text-[#78716c]">Editorial References</span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {relatedGuidesList.map((rg) => (
                  <div
                    key={rg.slug}
                    onClick={() => onNavigate(`/guides/${rg.slug}`)}
                    className="p-4 rounded-lg bg-white border border-[#e3ded4] hover:border-[#b8532b] transition-all cursor-pointer group shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <BookOpen className="h-3.5 w-3.5 text-[#b8532b]" />
                        <span className="text-xs font-mono text-[#78716c]">{rg.readingTimeMinutes} min read</span>
                      </div>
                      <h3 className="font-semibold text-sm text-[#1c1917] group-hover:text-[#b8532b] transition-colors">
                        {rg.title}
                      </h3>
                      <p className="text-xs text-[#57534e] mt-1 line-clamp-1">
                        {rg.summary}
                      </p>
                    </div>
                    <span className="font-mono text-xs font-semibold text-[#b8532b] shrink-0">
                      Read Guide →
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Frequently Asked Questions */}
          <section className="space-y-4 pt-4 border-t border-[#e3ded4]">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-[#b8532b]" />
              <h2 className="font-serif text-2xl font-bold text-[#1c1917]">
                Frequently Asked Questions
              </h2>
            </div>
            <p className="text-sm text-[#57534e]">
              Real-world answers to questions homeowners ask during project planning:
            </p>

            <div className="space-y-3">
              {guide.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-lg border border-[#e3ded4] bg-white overflow-hidden shadow-2xs"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-[#faf8f5] transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span className="font-medium text-sm text-[#1c1917]">
                        {faq.question}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-[#78716c] shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-[#78716c] shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="p-4 pt-0 text-xs sm:text-sm text-[#57534e] leading-relaxed border-t border-[#f7f5f0] bg-[#faf8f5]">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Methodology & Assumptions */}
          <section className="p-5 rounded-lg bg-[#f7f5f0] border border-[#e3ded4] space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-[#78716c]">
              Methodology & Technical Assumptions
            </span>
            <ul className="space-y-1.5 text-xs text-[#57534e]">
              {guide.methodologyAssumptions.map((assump, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#a8a29e]">•</span>
                  <span>{assump}</span>
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-[#78716c] pt-2 border-t border-[#e3ded4]">
              Estimates are provided for residential material budgeting purposes only. Always verify critical structural dimensions and consult manufacturer warranty specifications prior to permanent installation.
            </p>
          </section>

          {/* Bottom Back Button */}
          <div className="pt-6 flex justify-start">
            <button
              onClick={() => onNavigate(category ? category.hubPath : '/')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded text-xs font-mono font-medium text-[#57534e] bg-white border border-[#e3ded4] hover:bg-[#faf8f5] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to {category ? category.name : 'Home'}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

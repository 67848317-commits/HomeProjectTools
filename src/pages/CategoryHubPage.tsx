import React from 'react';
import { Container } from '../components/common/Container.tsx';
import { Breadcrumbs } from '../components/common/Breadcrumbs.tsx';
import { SectionHeading } from '../components/common/SectionHeading.tsx';
import { CalculatorCard } from '../components/calculator/CalculatorCard.tsx';
import { getCategoryById } from '../data/categories.ts';
import type { CategoryDefinition, PlanningQuestion } from '../types/index.ts';
import { CALCULATORS } from '../data/calculators.ts';
import { getGuideBySlug } from '../data/guides.ts';
import type { CalculatorDefinition, GuideDefinition } from '../types/index.ts';
import {
  Ruler,
  Layers,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  PackageCheck,
  ShieldCheck,
  DollarSign,
  ChevronRight,
  BookOpen,
  Clock,
} from 'lucide-react';

interface CategoryHubPageProps {
  category: CategoryDefinition;
  onNavigate: (path: string) => void;
}

const CALCULATOR_SUMMARIES: Record<string, { output: string; cta: string }> = {
  'flooring-calculator': {
    output: 'Cartons to purchase, net sq ft, underlayment rolls, and spare plank cushion',
    cta: 'Estimate Flooring',
  },
  'tile-calculator': {
    output: 'Full tile cartons, companion thin-set mortar bags, and grout powder bags',
    cta: 'Estimate Tile & Grout',
  },
  'baseboard-trim-calculator': {
    output: 'Linear feet, doorway deductions, and commercial 8ft/12ft/16ft molding sticks',
    cta: 'Estimate Trim Molding',
  },
  'paint-calculator': {
    output: 'Whole 1-gallon cans, 5-gallon pail comparison, door & window deductions',
    cta: 'Estimate Paint Gallons',
  },
  'concrete-slab-calculator': {
    output: 'Ready-mix cubic yards, whole 80-lb & 60-lb pre-mix bags, subgrade buffer',
    cta: 'Calculate Slab Concrete',
  },
  'concrete-post-hole-calculator': {
    output: '80-lb & 60-lb bags per hole, total footing bags, and post displacement',
    cta: 'Calculate Post Footings',
  },
  'paver-patio-calculator': {
    output: 'Finished pavers, 6" extended gravel base tons, bedding & polymeric sand',
    cta: 'Estimate Paver Patio',
  },
  'mulch-calculator': {
    output: 'Delivered bulk cubic yards, 2 cu ft & 3 cu ft retail bags, settling buffer',
    cta: 'Estimate Mulch',
  },
  'gravel-calculator': {
    output: 'Target compacted depth, estimated bulk tons, and 50-lb retail bags',
    cta: 'Estimate Gravel Base',
  },
  'sod-calculator': {
    output: 'Commercial turfgrass pallets, 10 sq ft rolls, and perimeter trimming cut waste',
    cta: 'Estimate Sod Pallets',
  },
  'topsoil-calculator': {
    output: 'Bulk garden cubic yards, 0.75 cu ft retail bags, settled bed volume',
    cta: 'Estimate Topsoil',
  },
  'drywall-calculator': {
    output: 'Side-by-side 4x8 vs 4x12 panels, joint compound buckets, tape, and screws',
    cta: 'Estimate Drywall & Mud',
  },
  'deck-material-calculator': {
    output: 'Stock deck boards (12/16/20 ft), floor joists, on-center spacing, and screws',
    cta: 'Estimate Deck Lumber',
  },
  'fence-material-calculator': {
    output: '4x4 posts, 2x4 horizontal backer rails, dog-ear pickets, and concrete bags',
    cta: 'Estimate Wood Fence',
  },
  'roofing-calculator': {
    output: 'True sloped pitch rafter area, roofing squares (100 sq ft), 3-bundle packs',
    cta: 'Estimate Roofing Squares',
  },
};

export const CategoryHubPage: React.FC<CategoryHubPageProps> = ({ category, onNavigate }) => {
  const categoryCalculators: CalculatorDefinition[] = category.calculatorIds
    .map((id: string) => CALCULATORS[id])
    .filter((c): c is CalculatorDefinition => Boolean(c));

  const relatedCategories: CategoryDefinition[] = (category.relatedCategoryIds || [])
    .map((id: string) => getCategoryById(id))
    .filter((c): c is CategoryDefinition => c !== undefined);

  const categoryGuides: GuideDefinition[] = (category.relatedGuideSlugs || [])
    .map((slug: string) => getGuideBySlug(slug))
    .filter((g): g is GuideDefinition => g !== undefined);

  return (
    <div className="py-6 sm:py-10 space-y-12">
      <Container>
        {/* Breadcrumb Trail */}
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Projects', href: '/projects' },
            { label: category.name },
          ]}
          onNavigate={onNavigate}
        />

        {/* Hero Section */}
        <div className="mt-4 rounded-xl border border-[#e3ded4] bg-[#ffffff] p-6 sm:p-10 shadow-xs relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#fcf4ee] border border-[#e3ded4] text-xs font-mono text-[#b8532b] font-semibold">
              <span className="uppercase tracking-wider">Project Category Hub</span>
              <span className="text-[#c8c1b2]">•</span>
              <span>{category.calculatorIds.length} Estimating Tool{category.calculatorIds.length > 1 ? 's' : ''}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1c1917] leading-tight">
              {category.name} Project Planning & Estimating
            </h1>

            <p className="text-base sm:text-lg text-[#57534e] leading-relaxed">
              {category.fullDescription}
            </p>

            {/* Common Materials List */}
            {category.commonMaterials && category.commonMaterials.length > 0 && (
              <div className="pt-2">
                <span className="text-xs font-mono uppercase text-[#78716c] block mb-2 font-semibold">
                  Common Materials Estimated in this Category:
                </span>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {category.commonMaterials.map((mat: string) => (
                    <span
                      key={mat}
                      className="text-xs px-2.5 py-1 rounded bg-[#f7f5f0] text-[#44403c] border border-[#e3ded4] font-medium"
                    >
                      {mat}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section B: Category Calculators */}
        <div className="mt-10 space-y-4">
          <div className="border-b border-[#e3ded4] pb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#b8532b]">
              Interactive Estimating Worksheets
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#1c1917] mt-0.5">
              Start With Your {category.name} Project
            </h2>
            <p className="text-xs sm:text-sm text-[#57534e] mt-1">
              Select an estimator below to calculate mathematical requirements, realistic scrap allowances, and store purchase quantities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {categoryCalculators.map((calc: CalculatorDefinition) => {
              const summaryData = CALCULATOR_SUMMARIES[calc.id] || {
                output: calc.outputDefinitions.map((o) => o.label).slice(0, 3).join(', '),
                cta: 'Open Estimator',
              };

              return (
                <CalculatorCard
                  key={calc.id}
                  id={calc.id}
                  name={calc.name}
                  description={calc.description}
                  categoryName={category.name}
                  outputSummary={summaryData.output}
                  href={`/calculators/${calc.slug}`}
                  ctaText={summaryData.cta}
                  onNavigate={onNavigate}
                />
              );
            })}
          </div>
        </div>

        {/* Section B-2: Category Planning Guides */}
        {categoryGuides.length > 0 && (
          <div className="mt-12 space-y-4">
            <SectionHeading
              title={`${category.name} Planning & Material Guides`}
              subtitle="Deep-dive tutorials on field measurement, waste factors, and commercial package sizing."
              numberPrefix="KNOWLEDGE BASE"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {categoryGuides.map((guide) => (
                <div
                  key={guide.slug}
                  className="rounded-xl border border-[#e3ded4] bg-[#ffffff] p-6 hover:border-[#b8532b] hover:shadow-xs transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-semibold bg-[#f1ede4] text-[#44403c]">
                        <BookOpen className="h-3 w-3 text-[#b8532b]" />
                        Planning Guide
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#78716c]">
                        <Clock className="h-3 w-3" />
                        {guide.readingTimeMinutes} min read
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-[#1c1917] group-hover:text-[#b8532b] transition-colors leading-snug">
                      {guide.title}
                    </h3>

                    <p className="text-xs text-[#57534e] leading-relaxed line-clamp-3">
                      {guide.summary}
                    </p>

                    <div className="pt-2 text-xs">
                      <span className="text-[10px] font-mono uppercase text-[#78716c] block">Companion Tool</span>
                      <span className="font-medium text-[#1c1917]">{guide.targetCalculatorName}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#f1ede4]">
                    <a
                      href={`/guides/${guide.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(`/guides/${guide.slug}`);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#b8532b] group-hover:text-[#9e431f]"
                    >
                      <span>Read Planning Guide</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section C: Planning Questions */}
        {category.planningQuestions && category.planningQuestions.length > 0 && (
          <div className="mt-12 space-y-4">
            <SectionHeading
              title={`Key Planning Questions for ${category.name}`}
              subtitle="Practical considerations homeowners should review before placing a material order."
              numberPrefix="GUIDANCE"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.planningQuestions.map((item: PlanningQuestion, idx: number) => (
                <div
                  key={idx}
                  className="rounded-lg border border-[#e3ded4] bg-[#ffffff] p-5 shadow-xs space-y-2"
                >
                  <div className="flex items-start gap-2.5">
                    <HelpCircle className="h-4 w-4 text-[#b8532b] shrink-0 mt-0.5" />
                    <h3 className="font-serif text-base font-bold text-[#1c1917] leading-snug">
                      {item.question}
                    </h3>
                  </div>
                  <p className="text-xs text-[#57534e] leading-relaxed pl-6.5">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section D: Planning Workflow */}
        <div className="mt-12 space-y-4">
          <SectionHeading
            title="The 5-Step Planning Workflow"
            subtitle="How to transform rough field measurements into an accurate commercial purchase order."
            numberPrefix="WORKFLOW"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              {
                step: '01',
                title: 'Measure Field Dimensions',
                desc: 'Record length, width, depth, height, or slope pitch with a physical tape or laser measure.',
              },
              {
                step: '02',
                title: 'Calculate Net Geometry',
                desc: 'Determine mathematical surface area, linear run, or cubic volume without arbitrary guessing.',
              },
              {
                step: '03',
                title: 'Add Planning Allowance',
                desc: 'Factor in layout cut scrap, edge trimming, compaction, and irregular subgrade conditions.',
              },
              {
                step: '04',
                title: 'Round to Packaging',
                desc: 'Convert total requirements into whole commercial cartons, bags, rolls, bundles, or pallets.',
              },
              {
                step: '05',
                title: 'Estimate Project Budget',
                desc: 'Model realistic materials costs alongside separated professional contractor labor ranges.',
              },
            ].map((wf) => (
              <div
                key={wf.step}
                className="rounded-lg border border-[#e3ded4] bg-[#ffffff] p-4 flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-xs font-bold text-[#b8532b] bg-[#fcf4ee] px-2 py-0.5 rounded border border-[#e3ded4]">
                    {wf.step}
                  </span>
                  <h4 className="font-serif text-sm font-bold text-[#1c1917] mt-2 mb-1">
                    {wf.title}
                  </h4>
                  <p className="text-xs text-[#57534e] leading-relaxed">
                    {wf.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section E: Related Project Categories */}
        {relatedCategories.length > 0 && (
          <div className="mt-12 space-y-4">
            <SectionHeading
              title="Related Project Categories"
              subtitle="Home improvements often involve interconnected trades. Explore companion project planning hubs."
              numberPrefix="RELATED"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedCategories.map((relCat: CategoryDefinition) => (
                <div
                  key={relCat.id}
                  className="rounded-lg border border-[#e3ded4] bg-[#ffffff] p-5 hover:border-[#b8532b] transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#f7f5f0] text-[#57534e]">
                        {relCat.calculatorIds.length} Tools
                      </span>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-[#1c1917] group-hover:text-[#b8532b] transition-colors">
                      {relCat.name}
                    </h3>
                    <p className="text-xs text-[#57534e] leading-relaxed">
                      {relCat.shortDescription}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#f1ede4]">
                    <a
                      href={relCat.hubPath}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(relCat.hubPath);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#b8532b] hover:text-[#9e431f]"
                    >
                      <span>Explore {relCat.name}</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};


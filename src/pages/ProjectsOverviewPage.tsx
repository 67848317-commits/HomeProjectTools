import React from 'react';
import { Container } from '../components/common/Container.tsx';
import { Breadcrumbs } from '../components/common/Breadcrumbs.tsx';
import { SectionHeading } from '../components/common/SectionHeading.tsx';
import { CalculatorCard } from '../components/calculator/CalculatorCard.tsx';
import { ALL_CATEGORIES, getCategoryById } from '../data/categories.ts';
import { CALCULATORS } from '../data/calculators.ts';
import {
  Ruler,
  Layers,
  ArrowRight,
  Paintbrush,
  Trees,
  Box,
  Wrench,
  Compass,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react';

interface ProjectsOverviewPageProps {
  onNavigate: (path: string) => void;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  flooring: Layers,
  painting: Paintbrush,
  'concrete-masonry': Box,
  landscaping: Trees,
  'walls-drywall': Box,
  'fencing-decking': Wrench,
  roofing: Compass,
};

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

export const ProjectsOverviewPage: React.FC<ProjectsOverviewPageProps> = ({ onNavigate }) => {
  return (
    <div className="py-6 sm:py-10 space-y-12">
      <Container>
        {/* Breadcrumb Trail */}
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Projects' },
          ]}
          onNavigate={onNavigate}
        />

        {/* Hero Banner */}
        <div className="mt-4 rounded-xl border border-[#e3ded4] bg-[#ffffff] p-6 sm:p-10 shadow-xs relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#fcf4ee] border border-[#e3ded4] text-xs font-mono text-[#b8532b] font-semibold">
              <span>PROJECT DIRECTORY</span>
              <span className="text-[#c8c1b2]">•</span>
              <span>7 Categories • 15 Active Estimators</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1c1917] leading-tight">
              Browse Home Projects
            </h1>

            <p className="text-base sm:text-lg text-[#57534e] leading-relaxed">
              Find the right estimating worksheet for your residential renovation. Each project hub provides tailored guidance, common material checklists, and transparent mathematical calculators.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="#all-calculators"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-[#b8532b] text-[#ffffff] font-semibold text-xs sm:text-sm hover:bg-[#9e431f] transition-all shadow-xs"
              >
                <span>Jump to All 15 Calculators</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* The 7 Project Trade Categories */}
        <div className="mt-10 space-y-6">
          <SectionHeading
            title="Project Trade Categories"
            subtitle="Explore comprehensive hubs organized around specific trades and materials."
            numberPrefix="CATEGORIES"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ALL_CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.id] || Layers;
              return (
                <div
                  key={cat.id}
                  className="rounded-lg border border-[#e3ded4] bg-[#ffffff] p-6 shadow-xs hover:border-[#b8532b] transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded border border-[#e3ded4] bg-[#f7f5f0] text-[#b8532b]">
                          <Icon className="h-4.5 w-4.5" />
                        </div>
                        <h3 className="font-serif text-xl font-bold text-[#1c1917] group-hover:text-[#b8532b] transition-colors">
                          {cat.name}
                        </h3>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f7f5f0] text-[#57534e] border border-[#e3ded4]">
                        {cat.calculatorIds.length} Tools
                      </span>
                    </div>

                    <p className="text-xs text-[#57534e] leading-relaxed">
                      {cat.shortDescription}
                    </p>

                    {/* Common Materials */}
                    {cat.commonMaterials && (
                      <div className="pt-2">
                        <span className="text-[10px] font-mono uppercase text-[#78716c] block mb-1 font-semibold">
                          Materials Estimated:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {cat.commonMaterials.slice(0, 3).map((mat: string) => (
                            <span
                              key={mat}
                              className="text-[11px] px-2 py-0.5 rounded bg-[#f7f5f0] text-[#44403c] border border-[#e3ded4]"
                            >
                              {mat}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#f1ede4] flex items-center justify-between">
                    <a
                      href={cat.hubPath}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(cat.hubPath);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#b8532b] group-hover:text-[#9e431f]"
                    >
                      <span>Open {cat.name} Hub</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Full Directory of All 15 Calculators Grouped by Trade */}
        <div id="all-calculators" className="mt-14 space-y-10">
          <SectionHeading
            title="Complete Directory of 15 Estimating Worksheets"
            subtitle="Every calculator follows our transparent three-stage estimating model: net requirement, scrap allowance, and store packaging."
            numberPrefix="DIRECTORY"
          />

          <div className="space-y-10">
            {ALL_CATEGORIES.map((cat) => {
              const catCalcs = cat.calculatorIds
                .map((id: string) => CALCULATORS[id])
                .filter(Boolean);

              return (
                <div key={cat.id} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#e3ded4] pb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-xl font-bold text-[#1c1917]">
                        {cat.name}
                      </h3>
                      <span className="text-xs font-mono text-[#78716c]">
                        ({catCalcs.length} tool{catCalcs.length > 1 ? 's' : ''})
                      </span>
                    </div>
                    <a
                      href={cat.hubPath}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(cat.hubPath);
                      }}
                      className="text-xs font-mono font-bold text-[#b8532b] hover:underline flex items-center gap-1"
                    >
                      <span>View Category Hub</span>
                      <ArrowRight className="h-3 w-3" />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {catCalcs.map((calc) => {
                      const summary = CALCULATOR_SUMMARIES[calc.id] || {
                        output: calc.outputDefinitions.map((o: { label: string }) => o.label).slice(0, 3).join(', '),
                        cta: 'Open Estimator',
                      };

                      return (
                        <CalculatorCard
                          key={calc.id}
                          id={calc.id}
                          name={calc.name}
                          description={calc.description}
                          categoryName={cat.name}
                          outputSummary={summary.output}
                          href={`/calculators/${calc.slug}`}
                          ctaText={summary.cta}
                          onNavigate={onNavigate}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </div>
  );
};

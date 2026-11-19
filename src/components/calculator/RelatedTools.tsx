import React from 'react';
import { ArrowUpRight, BookOpen, Calculator, Layers, Paintbrush, Ruler, Trees, Box, Home } from 'lucide-react';
import { getGuidesForCalculator } from '../../data/guides.ts';

interface RelatedItem {
  id: string;
  name: string;
  desc: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  isLive: boolean;
  path?: string;
  badge: string;
}

interface RelatedToolsProps {
  currentCalculatorId: string;
  onNavigate?: (path: string) => void;
}

export const RelatedTools: React.FC<RelatedToolsProps> = ({ currentCalculatorId, onNavigate }) => {
  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path?: string) => {
    if (!path) return;
    if (onNavigate) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  // Map of related calculators tailored to each current calculator
  const getRelatedCalculators = (calcId: string): RelatedItem[] => {
    switch (calcId) {
      case 'tile-calculator':
        return [
          {
            id: 'flooring-calculator',
            name: 'Flooring Material Calculator',
            desc: 'Calculate carton quantities and cut waste for luxury vinyl, laminate, and hardwood.',
            category: 'Flooring',
            icon: Layers,
            isLive: true,
            path: '/calculators/flooring-calculator',
            badge: 'Live Calculator',
          },
          {
            id: 'paint-calculator',
            name: 'Interior Paint Calculator',
            desc: 'Calculate wall and ceiling paint gallons with door and window deductions.',
            category: 'Finishes',
            icon: Paintbrush,
            isLive: true,
            path: '/calculators/paint-calculator',
            badge: 'Live Calculator',
          },
          {
            id: 'baseboard-trim-calculator',
            name: 'Baseboard & Trim Calculator',
            desc: 'Calculate linear footage, doorway deductions, and molding sticks for room perimeters.',
            category: 'Finishes',
            icon: Ruler,
            isLive: true,
            path: '/calculators/baseboard-trim-calculator',
            badge: 'Live Calculator',
          },
        ];

      case 'paint-calculator':
        return [
          {
            id: 'drywall-calculator',
            name: 'Drywall Sheet & Mud Calculator',
            desc: 'Calculate 4x8/4x12 drywall panels, joint compound buckets, tape, and screws.',
            category: 'Building Envelope',
            icon: Box,
            isLive: true,
            path: '/calculators/drywall-calculator',
            badge: 'Live Calculator',
          },
          {
            id: 'tile-calculator',
            name: 'Tile & Grout Calculator',
            desc: 'Estimate ceramic or porcelain tile boxes, thin-set mortar bags, and grout joints.',
            category: 'Flooring',
            icon: Layers,
            isLive: true,
            path: '/calculators/tile-calculator',
            badge: 'Live Calculator',
          },
          {
            id: 'flooring-calculator',
            name: 'Flooring Material Calculator',
            desc: 'Calculate carton quantities and cut waste for luxury vinyl, laminate, and hardwood.',
            category: 'Flooring',
            icon: Layers,
            isLive: true,
            path: '/calculators/flooring-calculator',
            badge: 'Live Calculator',
          },
        ];

      case 'mulch-calculator':
        return [
          {
            id: 'topsoil-calculator',
            name: 'Topsoil & Garden Bed Calculator',
            desc: 'Calculate bulk cubic yards and retail bags of topsoil or compost for planting beds.',
            category: 'Landscaping',
            icon: Trees,
            isLive: true,
            path: '/calculators/topsoil-calculator',
            badge: 'Live Calculator',
          },
          {
            id: 'sod-calculator',
            name: 'Sod Roll & Pallet Calculator',
            desc: 'Calculate square footage, full pallets, and individual rolls for new lawns.',
            category: 'Landscaping',
            icon: Trees,
            isLive: true,
            path: '/calculators/sod-calculator',
            badge: 'Live Calculator',
          },
          {
            id: 'gravel-calculator',
            name: 'Gravel & Crushed Stone Calculator',
            desc: 'Calculate tons and cubic yards for driveways, drainage trenches, and subbases.',
            category: 'Landscaping',
            icon: Box,
            isLive: true,
            path: '/calculators/gravel-calculator',
            badge: 'Live Calculator',
          },
        ];

      case 'concrete-slab-calculator':
        return [
          {
            id: 'concrete-post-hole-calculator',
            name: 'Concrete Post Hole Calculator',
            desc: 'Calculate concrete bags and cylinder volume for fence posts and deck footings.',
            category: 'Masonry',
            icon: Box,
            isLive: true,
            path: '/calculators/concrete-post-hole-calculator',
            badge: 'Live Calculator',
          },
          {
            id: 'paver-patio-calculator',
            name: 'Paver Patio Calculator',
            desc: 'Calculate pavers, crushed aggregate base rock, bedding sand, and polymeric joint sand.',
            category: 'Masonry',
            icon: Box,
            isLive: true,
            path: '/calculators/paver-patio-calculator',
            badge: 'Live Calculator',
          },
          {
            id: 'gravel-calculator',
            name: 'Gravel & Crushed Stone Calculator',
            desc: 'Calculate crushed stone and dense-grade base tonnage for slab subbases.',
            category: 'Landscaping',
            icon: Box,
            isLive: true,
            path: '/calculators/gravel-calculator',
            badge: 'Live Calculator',
          },
        ];

      case 'concrete-post-hole-calculator':
        return [
          {
            id: 'fence-material-calculator',
            name: 'Wood Privacy Fence Calculator',
            desc: 'Calculate 4x4 posts, 2x4 backer rails, pickets, and post footing concrete.',
            category: 'Fencing & Decking',
            icon: Box,
            isLive: true,
            path: '/calculators/fence-material-calculator',
            badge: 'Live Calculator',
          },
          {
            id: 'deck-material-calculator',
            name: 'Deck Board & Framing Estimator',
            desc: 'Estimate decking boards, joists, and concrete footing pier requirements.',
            category: 'Fencing & Decking',
            icon: Box,
            isLive: true,
            path: '/calculators/deck-material-calculator',
            badge: 'Live Calculator',
          },
          {
            id: 'concrete-slab-calculator',
            name: 'Concrete Slab & Pour Calculator',
            desc: 'Calculate cubic yards and pre-mixed bags for patio slabs, footings, and flatwork.',
            category: 'Masonry',
            icon: Box,
            isLive: true,
            path: '/calculators/concrete-slab-calculator',
            badge: 'Live Calculator',
          },
        ];

      case 'gravel-calculator':
        return [
          {
            id: 'paver-patio-calculator',
            name: 'Paver Patio Calculator',
            desc: 'Calculate pavers, crushed aggregate base rock, bedding sand, and polymeric sand.',
            category: 'Masonry',
            icon: Box,
            isLive: true,
            path: '/calculators/paver-patio-calculator',
            badge: 'Live Calculator',
          },
          {
            id: 'topsoil-calculator',
            name: 'Topsoil & Garden Bed Calculator',
            desc: 'Calculate bulk cubic yards and retail bags for landscape grading and garden beds.',
            category: 'Landscaping',
            icon: Trees,
            isLive: true,
            path: '/calculators/topsoil-calculator',
            badge: 'Live Calculator',
          },
          {
            id: 'concrete-slab-calculator',
            name: 'Concrete Slab & Pour Calculator',
            desc: 'Calculate cubic yards and pre-mixed bags for patio slabs and walkways.',
            category: 'Masonry',
            icon: Box,
            isLive: true,
            path: '/calculators/concrete-slab-calculator',
            badge: 'Live Calculator',
          },
        ];

      case 'sod-calculator':
        return [
          {
            id: 'topsoil-calculator',
            name: 'Topsoil & Garden Bed Calculator',
            desc: 'Calculate bulk cubic yards and retail bags for leveling soil before laying turf.',
            category: 'Landscaping',
            icon: Trees,
            isLive: true,
            path: '/calculators/topsoil-calculator',
            badge: 'Live Calculator',
          },
          {
            id: 'mulch-calculator',
            name: 'Mulch Yardage & Bag Calculator',
            desc: 'Calculate bulk mulch for landscape beds bordering newly installed lawn turf.',
            category: 'Landscaping',
            icon: Trees,
            isLive: true,
            path: '/calculators/mulch-calculator',
            badge: 'Live Calculator',
          },
          {
            id: 'gravel-calculator',
            name: 'Gravel & Crushed Stone Calculator',
            desc: 'Calculate crushed stone or pea gravel for walkways bordering your lawn.',
            category: 'Landscaping',
            icon: Box,
            isLive: true,
            path: '/calculators/gravel-calculator',
            badge: 'Live Calculator',
          },
        ];

      case 'drywall-calculator':
        return [
          {
            id: 'paint-calculator',
            name: 'Interior Paint Calculator',
            desc: 'Calculate primer and finish paint gallons for fresh hung drywall surfaces.',
            category: 'Finishes',
            icon: Paintbrush,
            isLive: true,
            path: '/calculators/paint-calculator',
            badge: 'Live Calculator',
          },
          {
            id: 'flooring-calculator',
            name: 'Flooring Material Calculator',
            desc: 'Calculate carton quantities and cut waste for finished room floors.',
            category: 'Flooring',
            icon: Layers,
            isLive: true,
            path: '/calculators/flooring-calculator',
            badge: 'Live Calculator',
          },
          {
            id: 'tile-calculator',
            name: 'Tile & Grout Calculator',
            desc: 'Estimate ceramic or porcelain tile boxes and mortar for bathroom or kitchen walls.',
            category: 'Flooring',
            icon: Layers,
            isLive: true,
            path: '/calculators/tile-calculator',
            badge: 'Live Calculator',
          },
        ];

      case 'deck-material-calculator':
        return [
          {
            id: 'fence-material-calculator',
            name: 'Wood Privacy Fence Calculator',
            desc: 'Calculate 4x4 posts, 2x4 rails, pickets, and post concrete for backyard fencing.',
            category: 'Fencing & Decking',
            icon: Box,
            isLive: true,
            path: '/calculators/fence-material-calculator',
            badge: 'Live Calculator',
          },
          {
            id: 'concrete-post-hole-calculator',
            name: 'Concrete Post Hole Calculator',
            desc: 'Calculate footing concrete bags and cylinder volumes for structural deck piers.',
            category: 'Masonry',
            icon: Box,
            isLive: true,
            path: '/calculators/concrete-post-hole-calculator',
            badge: 'Live Calculator',
          },
          {
            id: 'paver-patio-calculator',
            name: 'Paver Patio Calculator',
            desc: 'Calculate pavers, crushed aggregate base rock, and sand for ground-level patios.',
            category: 'Masonry',
            icon: Box,
            isLive: true,
            path: '/calculators/paver-patio-calculator',
            badge: 'Live Calculator',
          },
        ];

      case 'fence-material-calculator':
        return [
          {
            id: 'concrete-post-hole-calculator',
            name: 'Concrete Post Hole Calculator',
            desc: 'Calculate concrete bags and cylinder volume for fence posts and footings.',
            category: 'Masonry',
            icon: Box,
            isLive: true,
            path: '/calculators/concrete-post-hole-calculator',
            badge: 'Live Calculator',
          },
          {
            id: 'deck-material-calculator',
            name: 'Deck Board & Framing Estimator',
            desc: 'Estimate decking boards, joists, and screws for attached backyard decks.',
            category: 'Fencing & Decking',
            icon: Box,
            isLive: true,
            path: '/calculators/deck-material-calculator',
            badge: 'Live Calculator',
          },
          {
            id: 'gravel-calculator',
            name: 'Gravel & Crushed Stone Calculator',
            desc: 'Calculate coarse crushed stone for post hole drainage pads and fence borders.',
            category: 'Landscaping',
            icon: Box,
            isLive: true,
            path: '/calculators/gravel-calculator',
            badge: 'Live Calculator',
          },
        ];

      case 'roofing-calculator':
        return [
          {
            id: 'paver-patio-calculator',
            name: 'Paver Patio Calculator',
            desc: 'Calculate pavers, crushed gravel base, bedding sand, and polymeric joint sand.',
            category: 'Masonry',
            icon: Box,
            isLive: true,
            path: '/calculators/paver-patio-calculator',
            badge: 'Live Calculator',
          },
          {
            id: 'gravel-calculator',
            name: 'Gravel & Crushed Stone Calculator',
            desc: 'Calculate tons and cubic yards for drainage and base beds.',
            category: 'Landscaping',
            icon: Box,
            isLive: true,
            path: '/calculators/gravel-calculator',
            badge: 'Live Calculator',
          },
          {
            id: 'drywall-calculator',
            name: 'Drywall Sheet & Mud Calculator',
            desc: 'Calculate wall and ceiling drywall panels, joint compound buckets, and tape.',
            category: 'Building Envelope',
            icon: Box,
            isLive: true,
            path: '/calculators/drywall-calculator',
            badge: 'Live Calculator',
          },
        ];

      case 'paver-patio-calculator':
        return [
          {
            id: 'gravel-calculator',
            name: 'Gravel & Crushed Stone Calculator',
            desc: 'Calculate tons and cubic yards for driveway and patio crushed stone base.',
            category: 'Landscaping',
            icon: Box,
            isLive: true,
            path: '/calculators/gravel-calculator',
            badge: 'Live Calculator',
          },
          {
            id: 'topsoil-calculator',
            name: 'Topsoil & Garden Bed Calculator',
            desc: 'Calculate bulk cubic yards and retail bags for grading around new patios.',
            category: 'Landscaping',
            icon: Trees,
            isLive: true,
            path: '/calculators/topsoil-calculator',
            badge: 'Live Calculator',
          },
          {
            id: 'concrete-slab-calculator',
            name: 'Concrete Slab & Pour Calculator',
            desc: 'Calculate cubic yards and pre-mixed bags for subfloors, patios, and slabs.',
            category: 'Masonry',
            icon: Box,
            isLive: true,
            path: '/calculators/concrete-slab-calculator',
            badge: 'Live Calculator',
          },
        ];

      case 'topsoil-calculator':
        return [
          {
            id: 'mulch-calculator',
            name: 'Mulch Coverage Calculator',
            desc: 'Calculate bulk cubic yards and 2 cu ft retail bags for garden beds.',
            category: 'Landscaping',
            icon: Trees,
            isLive: true,
            path: '/calculators/mulch-calculator',
            badge: 'Live Calculator',
          },
          {
            id: 'sod-calculator',
            name: 'Sod Roll & Pallet Calculator',
            desc: 'Calculate square footage, full pallets, and individual rolls for new lawns.',
            category: 'Landscaping',
            icon: Trees,
            isLive: true,
            path: '/calculators/sod-calculator',
            badge: 'Live Calculator',
          },
          {
            id: 'gravel-calculator',
            name: 'Gravel & Crushed Stone Calculator',
            desc: 'Calculate tons and cubic yards for landscape drainage and pathways.',
            category: 'Landscaping',
            icon: Box,
            isLive: true,
            path: '/calculators/gravel-calculator',
            badge: 'Live Calculator',
          },
        ];

      case 'baseboard-trim-calculator':
        return [
          {
            id: 'flooring-calculator',
            name: 'Flooring Material Calculator',
            desc: 'Calculate carton quantities and cut waste for luxury vinyl, laminate, and hardwood.',
            category: 'Flooring',
            icon: Layers,
            isLive: true,
            path: '/calculators/flooring-calculator',
            badge: 'Live Calculator',
          },
          {
            id: 'drywall-calculator',
            name: 'Drywall Sheet & Mud Calculator',
            desc: 'Calculate 4x8/4x12 drywall panels, joint compound buckets, tape, and screws.',
            category: 'Building Envelope',
            icon: Box,
            isLive: true,
            path: '/calculators/drywall-calculator',
            badge: 'Live Calculator',
          },
          {
            id: 'paint-calculator',
            name: 'Interior Paint Calculator',
            desc: 'Calculate wall, trim, and ceiling paint gallons with door/window deductions.',
            category: 'Finishes',
            icon: Paintbrush,
            isLive: true,
            path: '/calculators/paint-calculator',
            badge: 'Live Calculator',
          },
        ];

      case 'flooring-calculator':
      default:
        return [
          {
            id: 'tile-calculator',
            name: 'Tile & Grout Calculator',
            desc: 'Estimate ceramic or porcelain tile boxes, thin-set mortar bags, and grout joints.',
            category: 'Flooring',
            icon: Layers,
            isLive: true,
            path: '/calculators/tile-calculator',
            badge: 'Live Calculator',
          },
          {
            id: 'paint-calculator',
            name: 'Interior Paint Calculator',
            desc: 'Calculate wall and ceiling paint gallons with door and window deductions.',
            category: 'Finishes',
            icon: Paintbrush,
            isLive: true,
            path: '/calculators/paint-calculator',
            badge: 'Live Calculator',
          },
          {
            id: 'baseboard-trim-calculator',
            name: 'Baseboard & Trim Calculator',
            desc: 'Calculate linear footage, doorway deductions, and molding sticks for room perimeters.',
            category: 'Finishes',
            icon: Ruler,
            isLive: true,
            path: '/calculators/baseboard-trim-calculator',
            badge: 'Live Calculator',
          },
        ];
    }
  };

  const relatedCalculators = getRelatedCalculators(currentCalculatorId);
  const liveGuides = getGuidesForCalculator(currentCalculatorId);

  return (
    <div className="border-t border-[#e3ded4] pt-8 mt-8 space-y-6">
      {/* Related Calculators */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-serif text-lg font-bold text-[#1c1917] flex items-center gap-2">
            <Calculator className="h-4 w-4 text-[#b8532b]" />
            <span>Complementary Project Estimators</span>
          </h3>
          <span className="text-xs font-mono text-[#78716c]">
            Planning Suite
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {relatedCalculators.map((calc) => {
            const Icon = calc.icon;
            if (calc.isLive && calc.path) {
              return (
                <a
                  key={calc.id}
                  href={calc.path}
                  onClick={(e) => handleNav(e, calc.path)}
                  className="p-3.5 rounded border border-[#e3ded4] bg-[#ffffff] hover:border-[#b8532b] hover:shadow-xs transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#f1ede4] text-[#57534e]">
                        {calc.category}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#15803d] bg-[#dcfce7] px-1.5 py-0.5 rounded">
                        {calc.badge}
                      </span>
                    </div>
                    <h4 className="font-semibold text-sm text-[#1c1917] group-hover:text-[#b8532b] transition-colors flex items-center justify-between">
                      <span>{calc.name}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#b8532b]" />
                    </h4>
                    <p className="text-xs text-[#78716c] mt-1 leading-relaxed">
                      {calc.desc}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#f1ede4] flex items-center text-xs font-medium text-[#b8532b]">
                    <span>Open Calculator →</span>
                  </div>
                </a>
              );
            }

            return (
              <div
                key={calc.id}
                className="p-3.5 rounded border border-[#e3ded4] bg-[#ffffff] opacity-75 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#f1ede4] text-[#57534e]">
                      {calc.category}
                    </span>
                    <span className="text-[10px] font-mono text-[#78716c]">
                      {calc.badge}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm text-[#1c1917]">
                    {calc.name}
                  </h4>
                  <p className="text-xs text-[#78716c] mt-1 leading-relaxed">
                    {calc.desc}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#f1ede4] flex items-center text-xs font-mono text-[#78716c]">
                  <span>Engine Ready</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Related Planning Guides (Rendered only when live pilot guides exist) */}
      {liveGuides.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-serif text-lg font-bold text-[#1c1917] flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#b8532b]" />
              <span>Recommended Project Planning Guides</span>
            </h3>
            <span className="text-xs font-mono text-[#78716c]">
              Editorial Guide
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {liveGuides.map((guide) => (
              <a
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                onClick={(e) => handleNav(e, `/guides/${guide.slug}`)}
                className="p-3.5 rounded border border-[#e3ded4] bg-[#f7f5f0] hover:border-[#b8532b] hover:bg-white transition-all space-y-1.5 group block"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-[#1c1917] group-hover:text-[#b8532b] transition-colors flex items-center gap-1.5">
                    <span>{guide.title}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#b8532b]" />
                  </span>
                  <span className="text-[10px] font-mono text-[#78716c] shrink-0">
                    {guide.readingTimeMinutes} min read
                  </span>
                </div>
                <p className="text-xs text-[#57534e] leading-relaxed line-clamp-2">
                  {guide.summary}
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-[#b8532b] pt-1">
                  <span>Read Full Guide</span>
                  <span>→</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

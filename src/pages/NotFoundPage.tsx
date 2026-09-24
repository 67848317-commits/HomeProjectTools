import React from 'react';
import { Container } from '../components/common/Container.tsx';
import { Ruler, Home, Layers, Calculator, ArrowRight } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <div className="py-16 md:py-24">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#f1ede4] border border-[#e3ded4] text-xs font-mono text-[#78716c] uppercase tracking-wider mb-6">
            <Ruler className="h-3.5 w-3.5 text-[#b8532b]" />
            Error 404 • Missing Measurement
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1c1917] tracking-tight mb-4">
            Page Not Found
          </h1>

          <p className="text-base sm:text-lg text-[#57534e] leading-relaxed mb-8">
            The page or worksheet you requested does not exist, was removed, or may have had its address updated.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <a
              href="/"
              onClick={(e) => handleNavClick(e, '/')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded bg-[#b8532b] text-white font-medium text-sm hover:bg-[#9c4320] transition-colors shadow-xs"
            >
              <Home className="h-4 w-4" />
              Return to Homepage
            </a>
            <a
              href="/projects"
              onClick={(e) => handleNavClick(e, '/projects')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded bg-[#ffffff] border border-[#e3ded4] text-[#1c1917] font-medium text-sm hover:border-[#b8532b] transition-colors shadow-xs"
            >
              <Layers className="h-4 w-4 text-[#78716c]" />
              Browse All Projects
            </a>
          </div>

          {/* Quick links to popular calculators */}
          <div className="bg-[#ffffff] border border-[#e3ded4] rounded-lg p-6 text-left">
            <h2 className="font-serif text-base font-bold text-[#1c1917] mb-3 flex items-center gap-2">
              <Calculator className="h-4 w-4 text-[#b8532b]" />
              Popular Estimating Worksheets
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <a
                href="/calculators/flooring-calculator"
                onClick={(e) => handleNavClick(e, '/calculators/flooring-calculator')}
                className="flex items-center justify-between p-2.5 rounded bg-[#f7f5f0] border border-[#e3ded4] text-[#1c1917] hover:border-[#b8532b] transition-colors"
              >
                <span>Flooring & Cartons</span>
                <ArrowRight className="h-3 w-3 text-[#78716c]" />
              </a>
              <a
                href="/calculators/concrete-slab-calculator"
                onClick={(e) => handleNavClick(e, '/calculators/concrete-slab-calculator')}
                className="flex items-center justify-between p-2.5 rounded bg-[#f7f5f0] border border-[#e3ded4] text-[#1c1917] hover:border-[#b8532b] transition-colors"
              >
                <span>Concrete Slab & Bags</span>
                <ArrowRight className="h-3 w-3 text-[#78716c]" />
              </a>
              <a
                href="/calculators/paint-calculator"
                onClick={(e) => handleNavClick(e, '/calculators/paint-calculator')}
                className="flex items-center justify-between p-2.5 rounded bg-[#f7f5f0] border border-[#e3ded4] text-[#1c1917] hover:border-[#b8532b] transition-colors"
              >
                <span>Interior Paint Gallons</span>
                <ArrowRight className="h-3 w-3 text-[#78716c]" />
              </a>
              <a
                href="/calculators/mulch-calculator"
                onClick={(e) => handleNavClick(e, '/calculators/mulch-calculator')}
                className="flex items-center justify-between p-2.5 rounded bg-[#f7f5f0] border border-[#e3ded4] text-[#1c1917] hover:border-[#b8532b] transition-colors"
              >
                <span>Garden Mulch & Yards</span>
                <ArrowRight className="h-3 w-3 text-[#78716c]" />
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

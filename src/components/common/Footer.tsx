import React from 'react';
import { Ruler, ShieldCheck, FileSpreadsheet, HardHat } from 'lucide-react';
import { Container } from './Container.tsx';

interface FooterProps {
  onNavigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <footer className="mt-auto border-t border-[#e3ded4] bg-[#ffffff] text-[#57534e]">
      {/* Top Banner: Estimating Principles */}
      <div className="border-b border-[#e3ded4] bg-[#f7f5f0] py-6">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="flex items-start gap-3">
              <div className="rounded p-2 bg-[#ffffff] border border-[#e3ded4] text-[#b8532b] shrink-0 shadow-2xs">
                <FileSpreadsheet className="h-4 w-4" />
              </div>
              <div>
                <div className="font-semibold text-[#1c1917] font-mono uppercase tracking-wider text-[11px] mb-1">
                  1. Transparent Math
                </div>
                <p className="text-[#78716c] leading-relaxed">
                  Net geometric requirements, cut waste allowances, and commercial package rounding are kept distinct.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded p-2 bg-[#ffffff] border border-[#e3ded4] text-[#b8532b] shrink-0 shadow-2xs">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <div className="font-semibold text-[#1c1917] font-mono uppercase tracking-wider text-[11px] mb-1">
                  2. Planning Benchmarks
                </div>
                <p className="text-[#78716c] leading-relaxed">
                  Costs represent realistic US DIY and contractor planning ranges, never disguised as live store inventory.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded p-2 bg-[#ffffff] border border-[#e3ded4] text-[#b8532b] shrink-0 shadow-2xs">
                <HardHat className="h-4 w-4" />
              </div>
              <div>
                <div className="font-semibold text-[#1c1917] font-mono uppercase tracking-wider text-[11px] mb-1">
                  3. Contractor-Separated
                </div>
                <p className="text-[#78716c] leading-relaxed">
                  Material purchase quantities and professional installation labor rates are always modeled independently.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Footer Links */}
      <div className="py-12">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8">
            {/* Col 1: Brand & Philosophy */}
            <div className="md:col-span-4 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded border border-[#c8c1b2] bg-[#f7f5f0] text-[#b8532b]">
                  <Ruler className="h-4 w-4" />
                </div>
                <span className="font-serif font-bold text-base text-[#1c1917]">Home Project Tools</span>
              </div>
              <p className="text-xs text-[#78716c] leading-relaxed">
                Plan your residential project. Estimate materials. Understand the cost. Designed for homeowners and DIY remodelers who need accurate estimating worksheets before buying.
              </p>
              <div className="font-mono text-[11px] text-[#78716c]">
                Built for US residential estimating standards.
              </div>
            </div>

            {/* Col 2: Project Categories */}
            <div className="md:col-span-3">
              <div className="font-mono uppercase tracking-wider text-xs font-semibold text-[#1c1917] mb-3">
                Project Categories
              </div>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <a
                    href="/projects/flooring"
                    onClick={(e) => handleNavClick(e, '/projects/flooring')}
                    className="text-[#57534e] hover:text-[#b8532b] transition-colors"
                  >
                    Flooring & Tile
                  </a>
                </li>
                <li>
                  <a
                    href="/projects/painting-finishes"
                    onClick={(e) => handleNavClick(e, '/projects/painting-finishes')}
                    className="text-[#57534e] hover:text-[#b8532b] transition-colors"
                  >
                    Painting & Finishes
                  </a>
                </li>
                <li>
                  <a
                    href="/projects/concrete-masonry"
                    onClick={(e) => handleNavClick(e, '/projects/concrete-masonry')}
                    className="text-[#57534e] hover:text-[#b8532b] transition-colors"
                  >
                    Concrete & Masonry
                  </a>
                </li>
                <li>
                  <a
                    href="/projects/landscaping-groundwork"
                    onClick={(e) => handleNavClick(e, '/projects/landscaping-groundwork')}
                    className="text-[#57534e] hover:text-[#b8532b] transition-colors"
                  >
                    Landscaping & Groundwork
                  </a>
                </li>
                <li>
                  <a
                    href="/projects/walls-drywall"
                    onClick={(e) => handleNavClick(e, '/projects/walls-drywall')}
                    className="text-[#57534e] hover:text-[#b8532b] transition-colors"
                  >
                    Walls & Drywall
                  </a>
                </li>
                <li>
                  <a
                    href="/projects/fencing-decking"
                    onClick={(e) => handleNavClick(e, '/projects/fencing-decking')}
                    className="text-[#57534e] hover:text-[#b8532b] transition-colors"
                  >
                    Fencing & Decking
                  </a>
                </li>
                <li>
                  <a
                    href="/projects/roofing-siding"
                    onClick={(e) => handleNavClick(e, '/projects/roofing-siding')}
                    className="text-[#57534e] hover:text-[#b8532b] transition-colors"
                  >
                    Roofing & Siding
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Trust & Foundation Pages */}
            <div className="md:col-span-2">
              <div className="font-mono uppercase tracking-wider text-xs font-semibold text-[#1c1917] mb-3">
                About & Trust
              </div>
              <ul className="space-y-2 text-xs">
                <li>
                  <a
                    href="/about"
                    onClick={(e) => handleNavClick(e, '/about')}
                    className="text-[#57534e] hover:text-[#b8532b] transition-colors font-medium"
                  >
                    About the Site
                  </a>
                </li>
                <li>
                  <a
                    href="/methodology"
                    onClick={(e) => handleNavClick(e, '/methodology')}
                    className="text-[#57534e] hover:text-[#b8532b] transition-colors font-medium"
                  >
                    Methodology
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    onClick={(e) => handleNavClick(e, '/contact')}
                    className="text-[#57534e] hover:text-[#b8532b] transition-colors font-medium"
                  >
                    Contact & Feedback
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy"
                    onClick={(e) => handleNavClick(e, '/privacy')}
                    className="text-[#57534e] hover:text-[#b8532b] transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    onClick={(e) => handleNavClick(e, '/terms')}
                    className="text-[#57534e] hover:text-[#b8532b] transition-colors"
                  >
                    Terms of Use
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Planning Standards */}
            <div className="md:col-span-3">
              <div className="font-mono uppercase tracking-wider text-xs font-semibold text-[#1c1917] mb-3">
                Planning Standards
              </div>
              <ul className="space-y-1.5 text-xs text-[#78716c]">
                <li>• Measure physical field dimensions first</li>
                <li>• Apply documented scrap and cut allowances</li>
                <li>• Round up to whole commercial store units</li>
                <li>• Retain 1 spare carton or cushion for repairs</li>
                <li>• Separate material costs from contractor labor</li>
                <li>• Verify local building code & frost line depth</li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-6 border-t border-[#e3ded4] flex flex-col sm:flex-row items-center justify-between text-xs text-[#78716c] gap-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>© {new Date().getFullYear()} Home Project Tools. For planning and estimating purposes only.</span>
              <span className="text-[#c8c1b2] hidden sm:inline">|</span>
              <a
                href="/privacy"
                onClick={(e) => handleNavClick(e, '/privacy')}
                className="hover:text-[#b8532b] transition-colors"
              >
                Privacy
              </a>
              <span className="text-[#c8c1b2]">·</span>
              <a
                href="/terms"
                onClick={(e) => handleNavClick(e, '/terms')}
                className="hover:text-[#b8532b] transition-colors"
              >
                Terms
              </a>
              <span className="text-[#c8c1b2]">·</span>
              <a
                href="/contact"
                onClick={(e) => handleNavClick(e, '/contact')}
                className="hover:text-[#b8532b] transition-colors"
              >
                Contact
              </a>
            </div>
            <div className="font-mono text-[11px]">
              Planning Estimators • Not Structural Engineering Specifications
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};

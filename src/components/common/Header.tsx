import React from 'react';
import { Ruler, Hammer, ChevronRight } from 'lucide-react';
import { Container } from './Container.tsx';

interface HeaderProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath = '/calculators/flooring-calculator', onNavigate }) => {
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
    <header className="border-b border-[#e3ded4] bg-[#ffffff] sticky top-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* Top micro-bar: workflow reminder */}
      <div className="bg-[#f1ede4] border-b border-[#e3ded4] py-1 text-xs text-[#57534e]">
        <Container>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-[11px] tracking-wide">
              <span className="font-semibold text-[#b8532b]">HOME IMPROVEMENT PLANNING</span>
              <span className="text-[#c8c1b2]">|</span>
              <span className="hidden sm:inline text-[#78716c]">Measure → Calculate → Purchase → Estimate Cost</span>
            </div>
            <div className="text-[11px] text-[#78716c] font-mono">
              US Residential Benchmarks
            </div>
          </div>
        </Container>
      </div>

      {/* Main navigation header */}
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <a
              href="/"
              onClick={(e) => handleNavClick(e, '/')}
              className="group flex items-center gap-3 text-[#1c1917] transition-colors focus:outline-none focus:ring-2 focus:ring-[#b8532b] focus:ring-offset-2 rounded"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded border border-[#c8c1b2] bg-[#f7f5f0] text-[#b8532b] group-hover:border-[#b8532b] transition-colors shadow-xs">
                <Ruler className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-lg leading-tight tracking-tight text-[#1c1917] group-hover:text-[#b8532b] transition-colors">
                  Home Project Planner
                </span>
                <span className="text-[11px] font-mono text-[#78716c] uppercase tracking-wider">
                  Planning & Cost Estimation
                </span>
              </div>
            </a>
          </div>

          <nav className="flex items-center gap-1 sm:gap-3 text-sm font-medium" aria-label="Main Navigation">
            <a
              href="/"
              onClick={(e) => handleNavClick(e, '/')}
              className={`px-3 py-1.5 rounded transition-colors ${
                currentPath === '/'
                  ? 'text-[#b8532b] bg-[#fcf4ee] font-semibold'
                  : 'text-[#57534e] hover:text-[#1c1917] hover:bg-[#f7f5f0]'
              }`}
            >
              Home
            </a>
            <a
              href="/projects"
              onClick={(e) => handleNavClick(e, '/projects')}
              className={`px-3 py-1.5 rounded transition-colors ${
                currentPath.startsWith('/projects')
                  ? 'text-[#b8532b] bg-[#fcf4ee] font-semibold'
                  : 'text-[#57534e] hover:text-[#1c1917] hover:bg-[#f7f5f0]'
              }`}
            >
              Projects
            </a>
            <a
              href="/projects#all-calculators"
              onClick={(e) => {
                e.preventDefault();
                if (currentPath === '/projects') {
                  const el = document.getElementById('all-calculators');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                } else if (onNavigate) {
                  onNavigate('/projects');
                  setTimeout(() => {
                    const el = document.getElementById('all-calculators');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }}
              className={`px-3 py-1.5 rounded transition-colors ${
                currentPath.startsWith('/calculators')
                  ? 'text-[#b8532b] bg-[#fcf4ee] font-semibold'
                  : 'text-[#57534e] hover:text-[#1c1917] hover:bg-[#f7f5f0]'
              }`}
            >
              Calculators
            </a>
            <span className="hidden md:inline text-xs font-mono text-[#78716c] border-l border-[#e3ded4] pl-3 py-1">
              15 Worksheets
            </span>
          </nav>
        </div>
      </Container>
    </header>
  );
};

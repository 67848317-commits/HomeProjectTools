import React, { useState } from 'react';
import { Ruler, Menu, X, ArrowRight } from 'lucide-react';
import { Container } from './Container.tsx';

interface HeaderProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath = '/', onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (window.location.pathname === '/') {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    if (onNavigate) {
      onNavigate(`/${hash ? `#${hash}` : ''}`);
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <header className="border-b border-[#e3ded4] bg-[#ffffff] sticky top-0 z-40 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Zone 1: Wordmark / Brand */}
          <div className="flex items-center gap-3">
            <a
              href="/"
              onClick={(e) => handleNavClick(e, '/')}
              className="group flex items-center gap-2.5 text-[#1c1917] focus:outline-none focus:ring-2 focus:ring-[#b8532b] focus:ring-offset-2 rounded"
              aria-label="Home Project Tools Homepage"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#c8c1b2] bg-[#f7f5f0] text-[#b8532b] group-hover:border-[#b8532b] transition-colors shadow-2xs">
                <Ruler className="h-4.5 w-4.5" />
              </div>
              <span className="font-serif font-bold text-lg leading-tight tracking-tight text-[#1c1917] group-hover:text-[#b8532b] transition-colors whitespace-nowrap">
                Home Project Tools
              </span>
            </a>
          </div>

          {/* Zone 2: Navigation Links (Clean text links with hover underline/color) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#57534e]" aria-label="Main Navigation">
            <a
              href="/projects"
              onClick={(e) => handleNavClick(e, '/projects')}
              className={`hover:text-[#1c1917] transition-colors ${
                currentPath.startsWith('/projects') ? 'text-[#b8532b] font-semibold' : ''
              }`}
            >
              Projects & Tools
            </a>
            <a
              href="#popular-calculators"
              onClick={(e) => handleAnchorClick(e, 'popular-calculators')}
              className="hover:text-[#1c1917] transition-colors"
            >
              Calculators
            </a>
            <a
              href="#project-plans"
              onClick={(e) => handleAnchorClick(e, 'project-plans')}
              className="hover:text-[#1c1917] transition-colors"
            >
              Project Plans
            </a>
            <a
              href="#planning-guides"
              onClick={(e) => handleAnchorClick(e, 'planning-guides')}
              className={`hover:text-[#1c1917] transition-colors ${
                currentPath.startsWith('/guides') ? 'text-[#b8532b] font-semibold' : ''
              }`}
            >
              Guides
            </a>
            <a
              href="/methodology"
              onClick={(e) => handleNavClick(e, '/methodology')}
              className={`hover:text-[#1c1917] transition-colors ${
                currentPath === '/methodology' ? 'text-[#b8532b] font-semibold' : ''
              }`}
            >
              Methodology
            </a>
            <a
              href="/about"
              onClick={(e) => handleNavClick(e, '/about')}
              className={`hover:text-[#1c1917] transition-colors ${
                currentPath === '/about' ? 'text-[#b8532b] font-semibold' : ''
              }`}
            >
              About
            </a>
          </nav>

          {/* Zone 3: Primary Action CTA & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={(e) => {
                if (window.location.pathname === '/') {
                  const el = document.getElementById('project-categories');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                    return;
                  }
                }
                if (onNavigate) onNavigate('/projects');
              }}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded bg-[#b8532b] text-[#ffffff] font-semibold text-xs hover:bg-[#9e431f] transition-colors shadow-2xs whitespace-nowrap"
            >
              <span>Start a Project</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded text-[#57534e] hover:text-[#1c1917] hover:bg-[#f7f5f0] border border-[#e3ded4]"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#e3ded4] py-4 px-2 space-y-2 bg-[#ffffff]">
            <a
              href="/projects"
              onClick={(e) => handleNavClick(e, '/projects')}
              className="block px-3 py-2 text-sm font-medium rounded text-[#57534e] hover:bg-[#f7f5f0] hover:text-[#1c1917]"
            >
              Projects & Tools
            </a>
            <a
              href="#popular-calculators"
              onClick={(e) => handleAnchorClick(e, 'popular-calculators')}
              className="block px-3 py-2 text-sm font-medium rounded text-[#57534e] hover:bg-[#f7f5f0] hover:text-[#1c1917]"
            >
              Popular Calculators
            </a>
            <a
              href="#project-plans"
              onClick={(e) => handleAnchorClick(e, 'project-plans')}
              className="block px-3 py-2 text-sm font-medium rounded text-[#57534e] hover:bg-[#f7f5f0] hover:text-[#1c1917]"
            >
              Complete Project Plans
            </a>
            <a
              href="#planning-guides"
              onClick={(e) => handleAnchorClick(e, 'planning-guides')}
              className="block px-3 py-2 text-sm font-medium rounded text-[#57534e] hover:bg-[#f7f5f0] hover:text-[#1c1917]"
            >
              Planning Guides
            </a>
            <a
              href="/methodology"
              onClick={(e) => handleNavClick(e, '/methodology')}
              className="block px-3 py-2 text-sm font-medium rounded text-[#57534e] hover:bg-[#f7f5f0] hover:text-[#1c1917]"
            >
              Methodology
            </a>
            <a
              href="/about"
              onClick={(e) => handleNavClick(e, '/about')}
              className="block px-3 py-2 text-sm font-medium rounded text-[#57534e] hover:bg-[#f7f5f0] hover:text-[#1c1917]"
            >
              About
            </a>
            <div className="pt-2 border-t border-[#f1ede4]">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onNavigate) onNavigate('/projects');
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-[#b8532b] text-[#ffffff] font-semibold text-xs hover:bg-[#9e431f]"
              >
                <span>Start a Project</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
};

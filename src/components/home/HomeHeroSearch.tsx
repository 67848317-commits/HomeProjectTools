import React, { useState, useMemo } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { ALL_CALCULATORS } from '../../data/calculators.ts';

export const HomeHeroSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCalculators = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return ALL_CALCULATORS.filter(
      (calc) =>
        calc.name.toLowerCase().includes(q) ||
        calc.description.toLowerCase().includes(q) ||
        calc.seo?.targetKeywords?.some((kw: string) => kw.toLowerCase().includes(q)) ||
        calc.categoryId.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [searchQuery]);

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
        <Search className="h-5 w-5" />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search calculators (e.g. flooring, tile, paint, mulch, deck, fence)..."
        className="w-full pl-11 pr-24 py-3.5 rounded-lg bg-white text-slate-900 placeholder-slate-500 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-lg font-sans"
        aria-label="Search project calculators"
      />
      {searchQuery ? (
        <button
          type="button"
          onClick={() => setSearchQuery('')}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-semibold text-slate-500 hover:text-slate-900"
        >
          Clear
        </button>
      ) : (
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">15 Tools</span>
        </div>
      )}

      {searchQuery.trim() !== '' && (
        <div className="absolute left-0 right-0 top-full mt-2 z-40 rounded-xl bg-white text-slate-900 p-2 shadow-2xl border border-slate-200 divide-y divide-slate-100 max-h-80 overflow-y-auto">
          {filteredCalculators.length > 0 ? (
            filteredCalculators.map((calc) => (
              <a
                key={calc.id}
                href={`/calculators/${calc.slug}`}
                className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors group"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-900 group-hover:text-amber-600">
                    {calc.name}
                  </div>
                  <div className="text-xs text-slate-500 line-clamp-1">{calc.description}</div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
              </a>
            ))
          ) : (
            <div className="p-4 text-xs text-slate-500 text-center">
              No calculators found matching &quot;{searchQuery}&quot;. Browse categories below.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

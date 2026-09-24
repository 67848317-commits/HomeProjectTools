import React from 'react';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate?: (path: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href?: string) => {
    if (!href) return;
    e.preventDefault();
    if (onNavigate) {
      onNavigate(href);
    } else {
      window.history.pushState({}, '', href);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center space-x-1.5 text-xs font-mono text-[#78716c]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const targetUrl = item.href || item.path;
          return (
            <li key={index} className="flex items-center space-x-1.5">
              {index > 0 && (
                <ChevronRight className="h-3 w-3 text-[#c8c1b2] shrink-0" aria-hidden="true" />
              )}
              {isLast ? (
                <span className="font-medium text-[#1c1917]" aria-current="page">
                  {item.label}
                </span>
              ) : targetUrl ? (
                <a
                  href={targetUrl}
                  onClick={(e) => handleClick(e, targetUrl)}
                  className="hover:text-[#b8532b] hover:underline transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <span>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

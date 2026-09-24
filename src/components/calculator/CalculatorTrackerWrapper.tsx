import React, { useEffect, useRef } from 'react';
import { trackCalculatorStart, trackCalculatorComplete } from '../../lib/analytics.ts';

interface CalculatorTrackerWrapperProps {
  calculatorSlug: string;
  calculatorName: string;
  projectCategory: string;
  children: React.ReactNode;
}

/**
 * CalculatorTrackerWrapper wraps any calculator page:
 * - Detects user-initiated interaction (input, change, click inside interactive elements)
 *   and fires `calculator_start` (deduplicated per calculator per session)
 * - Observes DOM updates in result containers to fire `calculator_complete`
 *   once valid calculation outputs appear after the user has interacted (deduplicated per session)
 */
export const CalculatorTrackerWrapper: React.FC<CalculatorTrackerWrapperProps> = ({
  calculatorSlug,
  calculatorName,
  projectCategory,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasInteractedRef = useRef<boolean>(false);
  const completedFiredRef = useRef<boolean>(false);

  useEffect(() => {
    // Reset component-level flags when slug changes
    hasInteractedRef.current = false;
    completedFiredRef.current = false;
  }, [calculatorSlug]);

  const markInteraction = () => {
    if (!hasInteractedRef.current) {
      hasInteractedRef.current = true;
      trackCalculatorStart({
        calculator_slug: calculatorSlug,
        calculator_name: calculatorName,
        project_category: projectCategory,
      });
      // Check immediately if results already exist and complete should fire
      checkForCompletion();
    }
  };

  const checkForCompletion = () => {
    if (!hasInteractedRef.current || completedFiredRef.current) {
      return;
    }

    if (containerRef.current) {
      // Check for live results container or bill of materials or result metrics
      const resultsRegion = containerRef.current.querySelector('[aria-live="polite"]');
      const hasError = containerRef.current.querySelector('[aria-invalid="true"]');

      // If results region exists and doesn't contain error banners
      if (resultsRegion && !hasError) {
        completedFiredRef.current = true;
        trackCalculatorComplete({
          calculator_slug: calculatorSlug,
          calculator_name: calculatorName,
          project_category: projectCategory,
        });
      }
    }
  };

  // Listen for user interactions (change, input) on the container
  const handleInput = (e: React.FormEvent) => {
    const target = e.target as HTMLElement | null;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA')) {
      markInteraction();
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (
      target &&
      (target.tagName === 'BUTTON' ||
        target.closest('button') ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT')
    ) {
      markInteraction();
    }
  };

  // MutationObserver to detect when calculation outputs update after an interaction
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new MutationObserver(() => {
      if (hasInteractedRef.current && !completedFiredRef.current) {
        checkForCompletion();
      }
    });

    observer.observe(el, { childList: true, subtree: true, characterData: true });

    return () => {
      observer.disconnect();
    };
  }, [calculatorSlug, calculatorName, projectCategory]);

  return (
    <div
      ref={containerRef}
      onInput={handleInput}
      onChange={handleInput}
      onClick={handleClick}
      className="calculator-tracker-container"
    >
      {children}
    </div>
  );
};

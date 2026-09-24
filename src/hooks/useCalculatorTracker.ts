import { useEffect, useRef, useCallback } from 'react';
import { trackCalculatorStart, trackCalculatorComplete } from '../lib/analytics.ts';

export interface UseCalculatorTrackerOptions {
  calculatorSlug: string;
  calculatorName: string;
  projectCategory: string;
  hasValidResult: boolean;
}

/**
 * Reusable hook to track calculator engagement without boilerplate across calculator components:
 * 1. Tracks calculator_start when user first interacts (triggered on interaction callback)
 * 2. Tracks calculator_complete once when a valid result is computed after user interaction
 * 3. Enforces session-level deduplication so re-renders never flood analytics
 */
export function useCalculatorTracker({
  calculatorSlug,
  calculatorName,
  projectCategory,
  hasValidResult,
}: UseCalculatorTrackerOptions) {
  const hasInteractedRef = useRef<boolean>(false);
  const completedFiredRef = useRef<boolean>(false);

  // Triggered when any user input changes
  const onInteraction = useCallback(() => {
    if (!hasInteractedRef.current) {
      hasInteractedRef.current = true;
      trackCalculatorStart({
        calculator_slug: calculatorSlug,
        calculator_name: calculatorName,
        project_category: projectCategory,
      });
    }
  }, [calculatorSlug, calculatorName, projectCategory]);

  // Track completion only when user has interacted and a valid result exists
  useEffect(() => {
    if (hasInteractedRef.current && hasValidResult && !completedFiredRef.current) {
      completedFiredRef.current = true;
      trackCalculatorComplete({
        calculator_slug: calculatorSlug,
        calculator_name: calculatorName,
        project_category: projectCategory,
      });
    }
  }, [hasValidResult, calculatorSlug, calculatorName, projectCategory]);

  return {
    onInteraction,
    hasInteracted: hasInteractedRef.current,
  };
}

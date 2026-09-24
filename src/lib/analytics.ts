/**
 * Google Analytics 4 (GA4) & Lightweight Product Analytics Utility
 * Home Project Tools - Phase 5B-2
 *
 * Requirements:
 * - Read GA4 Measurement ID from PUBLIC_GA4_MEASUREMENT_ID (Vercel / Vite env / runtime window)
 * - Safe for browser-only execution (never throws during SSR, Node tests, or build)
 * - Idempotent script injection & initialization
 * - Minimal, strongly typed API
 * - Privacy-first: strictly low-cardinality metadata (slugs/categories), never user measurements or exact prices
 */

// Global type declarations for window.dataLayer and window.gtag
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    PUBLIC_GA4_MEASUREMENT_ID?: string;
  }
}

export interface CalculatorEventParams {
  calculator_slug: string;
  calculator_name: string;
  project_category: string;
}

export interface GuideCalculatorClickParams {
  guide_slug: string;
  calculator_slug: string;
}

export interface CategoryViewParams {
  category_slug: string;
}

export interface PageViewParams {
  page_path: string;
  page_title: string;
  page_location?: string;
}

/**
 * Safely resolves the GA4 Measurement ID without throwing.
 * Checks import.meta.env (Vite standard), process.env (Node/test/SSR), and window globals.
 */
export function getMeasurementId(): string | null {
  try {
    // 1. Vite env (with fallback if PUBLIC_GA4_MEASUREMENT_ID is defined via vite define or env)
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      const viteVal =
        (import.meta.env.PUBLIC_GA4_MEASUREMENT_ID as string) ||
        (import.meta.env.VITE_PUBLIC_GA4_MEASUREMENT_ID as string);
      if (viteVal && typeof viteVal === 'string' && viteVal.trim() !== '') {
        return viteVal.trim();
      }
    }
  } catch {
    // Ignore environment access errors
  }

  try {
    // 2. Browser window global fallback (e.g. injected via script or HTML)
    if (typeof window !== 'undefined' && window.PUBLIC_GA4_MEASUREMENT_ID) {
      const winVal = window.PUBLIC_GA4_MEASUREMENT_ID;
      if (typeof winVal === 'string' && winVal.trim() !== '') {
        return winVal.trim();
      }
    }
  } catch {
    // Ignore window access errors
  }

  try {
    // 3. Node / process.env fallback (for tests and SSR runtimes)
    if (typeof process !== 'undefined' && process.env) {
      const procVal =
        process.env.PUBLIC_GA4_MEASUREMENT_ID ||
        process.env.VITE_PUBLIC_GA4_MEASUREMENT_ID;
      if (procVal && typeof procVal === 'string' && procVal.trim() !== '') {
        return procVal.trim();
      }
    }
  } catch {
    // Ignore process access errors
  }

  return null;
}

// Module-level state tracking
let isInitialized = false;
let lastPagePath: string | null = null;
const completedCalculatorsInSession = new Set<string>();
const startedCalculatorsInSession = new Set<string>();

/**
 * Initializes the GA4 gtag script tag in the document head if:
 * 1. Environment is browser-ready (`window` and `document` exist)
 * 2. Measurement ID is present and valid
 * 3. Script hasn't already been injected
 *
 * Returns boolean indicating whether initialization succeeded or was already active.
 */
export function initGA(overrideId?: string): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }

  const measurementId = overrideId || getMeasurementId();
  if (!measurementId || typeof measurementId !== 'string') {
    return false;
  }

  if (isInitialized) {
    return true;
  }

  try {
    // Ensure dataLayer exists
    window.dataLayer = window.dataLayer || [];

    // Ensure gtag function exists
    if (!window.gtag) {
      window.gtag = function gtag(...args: unknown[]) {
        if (window.dataLayer) {
          window.dataLayer.push(args);
        }
      };
    }

    // Check if script tag is already in DOM
    const existingScript = document.querySelector(
      `script[src*="googletagmanager.com/gtag/js?id=${measurementId}"]`
    );

    if (!existingScript) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);
    }

    // Configure GA4 with send_page_view: false so we control SPA page views explicitly
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      send_page_view: false,
    });

    isInitialized = true;
    return true;
  } catch {
    // Fail silently without disrupting user experience
    return false;
  }
}

/**
 * Generic event tracker dispatcher.
 * Safely forwards event and params to window.gtag if available.
 */
export function trackEvent(eventName: string, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return;

  // Lazily attempt initialization if not done yet
  if (!isInitialized) {
    initGA();
  }

  if (typeof window.gtag === 'function') {
    try {
      window.gtag('event', eventName, params);
    } catch {
      // Never throw from analytics
    }
  }
}

/**
 * Tracks a client-side page view in a single-page architecture.
 * Deduplicates consecutive calls to the exact same page path.
 */
export function trackPageView(params: PageViewParams): void {
  if (typeof window === 'undefined') return;

  const cleanPath = params.page_path.split('?')[0].split('#')[0] || '/';

  // Prevent immediate duplicate page views for identical paths
  if (lastPagePath === cleanPath) {
    return;
  }
  lastPagePath = cleanPath;

  const measurementId = getMeasurementId();

  trackEvent('page_view', {
    page_title: params.page_title,
    page_path: cleanPath,
    page_location: params.page_location || (typeof window !== 'undefined' ? window.location.href : cleanPath),
    ...(measurementId ? { send_to: measurementId } : {}),
  });
}

/**
 * Tracks when a user begins meaningfully interacting with a calculator.
 * Deduplicated per calculator per session so repeated input changes don't spam events.
 */
export function trackCalculatorStart(params: CalculatorEventParams): void {
  if (!params.calculator_slug) return;

  if (startedCalculatorsInSession.has(params.calculator_slug)) {
    return;
  }
  startedCalculatorsInSession.add(params.calculator_slug);

  trackEvent('calculator_start', {
    calculator_slug: params.calculator_slug,
    calculator_name: params.calculator_name,
    project_category: params.project_category,
  });
}

/**
 * Tracks when a calculator produces a valid result after user interaction.
 * Deduplicated per calculator session so re-renders/continuous recalculation do not spam events.
 */
export function trackCalculatorComplete(params: CalculatorEventParams): void {
  if (!params.calculator_slug) return;

  if (completedCalculatorsInSession.has(params.calculator_slug)) {
    return;
  }
  completedCalculatorsInSession.add(params.calculator_slug);

  trackEvent('calculator_complete', {
    calculator_slug: params.calculator_slug,
    calculator_name: params.calculator_name,
    project_category: params.project_category,
  });
}

/**
 * Tracks when a user clicks a calculator CTA link from a guide page.
 */
export function trackGuideCalculatorClick(params: GuideCalculatorClickParams): void {
  if (!params.guide_slug || !params.calculator_slug) return;

  trackEvent('guide_calculator_click', {
    guide_slug: params.guide_slug,
    calculator_slug: params.calculator_slug,
  });
}

/**
 * Optional lightweight category view event to understand hub engagement.
 */
export function trackCategoryView(params: CategoryViewParams): void {
  if (!params.category_slug) return;

  trackEvent('category_view', {
    category_slug: params.category_slug,
  });
}

/**
 * Helper to reset session deduplication cache (useful for testing).
 */
export function _resetAnalyticsSessionForTesting(): void {
  isInitialized = false;
  lastPagePath = null;
  startedCalculatorsInSession.clear();
  completedCalculatorsInSession.clear();
}

/**
 * Core Type Definitions for Home Project Tools
 * Version: 2.0.0
 * Architecture: Phase 2A Core Infrastructure & Calculation Engine
 */

/**
 * 7 Canonical Residential Project Categories
 */
export type CategoryId =
  | 'flooring'
  | 'painting'
  | 'concrete-masonry'
  | 'landscaping'
  | 'walls-drywall'
  | 'fencing-decking'
  | 'roofing';

/**
 * Category Metadata Definition
 */
export interface PlanningQuestion {
  question: string;
  answer: string;
}

export interface CategoryDefinition {
  id: CategoryId;
  name: string;
  slug: string;
  hubPath: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  accentColor: string;
  calculatorIds: string[];
  relatedCategoryIds?: CategoryId[];
  planningQuestions?: PlanningQuestion[];
  commonMaterials?: string[];
  planningWorkflowSteps?: string[];
  relatedGuideSlugs: string[];
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

/**
 * Material Price Benchmark Data Structure
 * Used for transparent, range-based cost modeling.
 */
export interface PriceBenchmark {
  id: string;
  materialName: string;
  category: CategoryId;
  unit: string; // e.g. "sq ft", "80-lb bag", "cu yd", "gallon", "sheet"
  priceLow: number; // Low DIY retail benchmark (USD)
  priceTypical: number; // Mid/Typical DIY retail benchmark (USD)
  priceHigh: number; // High/Premium DIY retail benchmark (USD)
  priceBasis: string; // e.g. "National big-box store retail shelf benchmark"
  packagingAssumption: string; // e.g. "Sold in 20 sq ft cartons", "Sold in 80 lb bags"
  sourceNote: string;
  lastReviewedDate: string; // ISO date e.g. "2026-01-15"
  disclaimer: string;
  /**
   * Optional separated contractor labor estimates.
   * Kept strictly decoupled from material pricing.
   */
  contractorLabor?: {
    laborLow: number;
    laborTypical: number;
    laborHigh: number;
    unit: string; // e.g. "per sq ft installed", "per square"
    laborScopeNote: string;
  };
}

/**
 * Input Field Types for Calculators
 */
export type InputFieldType = 'number' | 'select' | 'boolean' | 'radio';

export interface SelectOption {
  label: string;
  value: string | number;
  description?: string;
}

export interface CalculatorInputField {
  id: string;
  name: string;
  label: string;
  type: InputFieldType;
  defaultValue: number | string | boolean;
  unit?: string; // e.g. "ft", "in", "sq ft", "coats"
  description?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: SelectOption[];
  required: boolean;
  group?: 'primary' | 'advanced' | 'pricing';
}

export interface WasteOption {
  label: string;
  percentage: number; // e.g. 10 for 10%
  description: string;
  isDefault?: boolean;
}

export interface OutputDefinition {
  id: string;
  label: string;
  unit: string;
  description: string;
  isPrimary?: boolean;
}

/**
 * Calculator Definition Metadata
 * Does NOT contain calculation logic.
 */
export interface CalculatorDefinition {
  id: string;
  slug: string;
  name: string;
  categoryId: CategoryId;
  description: string;
  targetIntent: string;
  inputFields: CalculatorInputField[];
  defaultWastePercentage: number;
  wasteOptions: WasteOption[];
  outputDefinitions: OutputDefinition[];
  priceBenchmarkIds: string[];
  assumptions: string[];
  limitations: string[];
  relatedCalculatorIds: string[];
  relatedGuideSlugs: string[];
  seo: {
    metaTitle: string;
    metaDescription: string;
    targetKeywords: string[];
    schemaType: 'SoftwareApplication';
  };
}

/**
 * Calculation Assumption Model
 */
export interface CalculationAssumption {
  id: string;
  title: string;
  detail: string;
  category: 'geometry' | 'packaging' | 'waste' | 'coverage' | 'structural';
}

/**
 * Bill of Materials (BOM) Item
 */
export interface BillOfMaterialsItem {
  id: string;
  name: string;
  description: string;
  exactQuantity: number; // Mathematical fractional quantity
  recommendedQuantity: number; // Planning quantity with waste applied
  purchaseQuantity: number; // Commercial package count rounded up
  packageUnit: string; // e.g. "cartons", "80-lb bags", "rolls", "sheets"
  unitSizeDescription: string; // e.g. "20 sq ft per carton", "0.60 cu ft per bag"
  wasteAppliedPercentage: number; // Exact waste percentage used
  benchmarkPriceId?: string;
  estimatedCost?: {
    low: number;
    typical: number;
    high: number;
  };
}

/**
 * Cost Breakdown Summary
 */
export interface CostEstimateSummary {
  hasPricing: boolean;
  currency: 'USD';
  materialsOnly: {
    low: number;
    typical: number;
    high: number;
  };
  /**
   * Optional separated labor & installation estimate.
   * Clearly marked as separate from materials.
   */
  contractorInstalledTotal?: {
    low: number;
    typical: number;
    high: number;
    laborOnlyLow: number;
    laborOnlyTypical: number;
    laborOnlyHigh: number;
    scopeNote: string;
  };
  benchmarkSources: string[];
  disclaimer: string;
}

/**
 * Standard Result Structure for ALL Calculation Engines
 */
export interface CalculationSuccessResult<TOutputs = Record<string, number | string>> {
  success: true;
  calculatorId: string;
  timestamp: string;
  inputs: Record<string, unknown>;
  /**
   * Primary mathematical & planning outputs
   */
  outputs: TOutputs;
  /**
   * Detailed Bill of Materials with packaging rounding
   */
  billOfMaterials: BillOfMaterialsItem[];
  /**
   * Transparent cost estimates using decoupled benchmarks
   */
  costEstimate: CostEstimateSummary;
  /**
   * Explicit list of all engineering & estimating assumptions
   */
  assumptions: CalculationAssumption[];
  /**
   * Practical warnings or notices (e.g. frost line depths, ready-mix minimums)
   */
  notices: string[];
}

export interface CalculationErrorResult {
  success: false;
  calculatorId: string;
  errors: Array<{
    field?: string;
    message: string;
    code: 'INVALID_NUMBER' | 'OUT_OF_RANGE' | 'REQUIRED' | 'IMPOSSIBLE_GEOMETRY' | 'CALCULATOR_NOT_FOUND';
  }>;
}

export type CalculationResult<TOutputs = Record<string, number | string>> =
  | CalculationSuccessResult<TOutputs>
  | CalculationErrorResult;

/**
 * Guide & Content Data Types
 */
export interface FaqItem {
  question: string;
  answer: string;
}

export interface GuideMeasurement {
  item: string;
  unit: string;
  description: string;
  howToMeasure: string;
}

export interface GuideWorkedStep {
  step: string;
  title: string;
  calculation: string;
  note: string;
}

export interface GuidePracticalExample {
  scenario: string;
  inputs: Record<string, string | number>;
  steps: GuideWorkedStep[];
  resultSummary: string;
}

export interface GuideSection {
  id: string;
  title: string;
  content: string;
  callout?: {
    type: 'note' | 'warning' | 'tip';
    title: string;
    text: string;
  };
  table?: {
    caption?: string;
    headers: string[];
    rows: string[][];
  };
}

export interface GuideCommonMistake {
  mistake: string;
  whyItMatters: string;
  prevention: string;
}

export interface GuideCostPlanning {
  overview: string;
  benchmarksNote: string;
  materialTiers: Array<{
    tier: string;
    range: string;
    description: string;
  }>;
  diyVsContractor: string;
}

export interface GuideThreeStageExplanation {
  stage1Title: string;
  stage1Formula: string;
  stage1Description: string;
  stage2Title: string;
  stage2Formula: string;
  stage2Description: string;
  stage3Title: string;
  stage3Formula: string;
  stage3Description: string;
}

export interface GuideDefinition {
  slug: string;
  title: string;
  subtitle?: string;
  metaTitle: string;
  metaDescription: string;
  categoryId: CategoryId;
  targetCalculatorId: string;
  targetCalculatorPath: string;
  targetCalculatorName: string;
  guideType: 'how-to-calculate' | 'planning' | 'cost' | 'project';
  summary: string;
  readingTimeMinutes: number;
  publishedDate: string;
  lastReviewedDate: string;
  quickAnswer: string;
  introduction: string[];
  measurementsNeeded: GuideMeasurement[];
  threeStageExplanation: GuideThreeStageExplanation;
  practicalExample: GuidePracticalExample;
  sections: GuideSection[];
  costPlanning: GuideCostPlanning;
  commonMistakes: GuideCommonMistake[];
  whenEstimateChanges: string[];
  methodologyAssumptions: string[];
  faqs: FaqItem[];
  relatedCalculatorIds: string[];
  relatedGuideSlugs: string[];
}

/**
 * SEO & OpenGraph Structured Metadata
 */
export interface PageSeoMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType: 'website' | 'article';
  ogImage?: string;
  schemaType: 'WebPage' | 'Article' | 'SoftwareApplication' | 'FAQPage';
  jsonLd: Record<string, unknown>[];
}

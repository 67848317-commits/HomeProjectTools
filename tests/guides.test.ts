import test from 'node:test';
import assert from 'node:assert/strict';
import { GUIDES, ALL_GUIDES, getAllGuides, getGuideBySlug } from '../src/data/guides.ts';
import { CALCULATORS } from '../src/data/calculators.ts';
import { CATEGORIES } from '../src/data/categories.ts';

test('Guides registry contains all 15 defined guides', () => {
  const expectedSlugs = [
    'how-to-calculate-flooring-material',
    'how-much-paint-do-i-need',
    'how-to-calculate-mulch',
    'how-much-tile-do-i-need',
    'how-much-concrete-do-i-need-for-a-slab',
    'how-much-concrete-do-i-need-for-fence-posts',
    'how-to-calculate-paver-patio-materials',
    'how-much-gravel-do-i-need',
    'how-much-drywall-do-i-need',
    'how-to-calculate-deck-materials',
    'how-to-calculate-fence-materials',
    'how-much-roofing-material-do-i-need',
    'how-much-topsoil-do-i-need',
    'how-much-sod-do-i-need',
    'how-much-baseboard-do-i-need',
  ];

  assert.equal(ALL_GUIDES.length, 15);
  assert.equal(getAllGuides().length, 15);

  for (const slug of expectedSlugs) {
    const guide = getGuideBySlug(slug);
    assert.ok(guide, `Guide not found for slug: ${slug}`);
    assert.equal(guide.slug, slug);
    assert.ok(guide.title.length > 10, `Guide title too short: ${slug}`);
    assert.ok(guide.metaTitle.length > 10, `Meta title too short: ${slug}`);
    assert.ok(guide.metaDescription.length > 20, `Meta desc too short: ${slug}`);
    assert.ok(CATEGORIES[guide.categoryId], `Invalid category ${guide.categoryId} for ${slug}`);
    assert.ok(CALCULATORS[guide.targetCalculatorId], `Invalid calculator ${guide.targetCalculatorId} for ${slug}`);
    assert.ok(guide.quickAnswer.length > 50, `Quick answer too short for ${slug}`);
    assert.ok(guide.introduction.length >= 2, `Introduction must have at least 2 paragraphs: ${slug}`);
    assert.ok(guide.measurementsNeeded.length >= 3, `Must have measurements needed: ${slug}`);
    assert.ok(guide.threeStageExplanation.stage1Title, `Missing stage1Title: ${slug}`);
    assert.ok(guide.threeStageExplanation.stage2Title, `Missing stage2Title: ${slug}`);
    assert.ok(guide.threeStageExplanation.stage3Title, `Missing stage3Title: ${slug}`);
    assert.ok(guide.practicalExample.steps.length >= 3, `Must have at least 3 practical example steps: ${slug}`);
    assert.ok(guide.sections.length >= 3, `Must have at least 3 guide sections: ${slug}`);
    assert.ok(guide.commonMistakes.length >= 3, `Must have at least 3 common mistakes: ${slug}`);
    assert.ok(guide.costPlanning.materialTiers.length >= 2, `Must have cost planning tiers: ${slug}`);
    assert.ok(guide.faqs.length >= 4, `Must have at least 4 FAQs: ${slug}`);

    // Verify all related guides exist in the registry
    for (const relSlug of guide.relatedGuideSlugs) {
      assert.ok(
        expectedSlugs.includes(relSlug),
        `Related guide slug '${relSlug}' in guide '${slug}' does not exist in registry`
      );
    }

    // Verify all related calculators exist
    for (const relCalcId of guide.relatedCalculatorIds) {
      assert.ok(
        CALCULATORS[relCalcId],
        `Related calculator id '${relCalcId}' in guide '${slug}' does not exist in registry`
      );
    }
  }
});

test('Phase 4B-2B guides are bidirectionally cross-linked in categories and calculators', () => {
  const newGuideSlugs = [
    'how-much-drywall-do-i-need',
    'how-to-calculate-deck-materials',
    'how-to-calculate-fence-materials',
    'how-much-roofing-material-do-i-need',
    'how-much-topsoil-do-i-need',
  ];

  for (const slug of newGuideSlugs) {
    const guide = getGuideBySlug(slug);
    assert.ok(guide, `Guide ${slug} not found`);

    // Verify category has guide in relatedGuideSlugs
    const category = CATEGORIES[guide.categoryId];
    assert.ok(category, `Category ${guide.categoryId} not found`);
    assert.ok(
      category.relatedGuideSlugs.includes(slug),
      `Category ${category.id} should include guide ${slug} in relatedGuideSlugs`
    );

    // Verify target calculator has guide in relatedGuideSlugs
    const calculator = CALCULATORS[guide.targetCalculatorId];
    assert.ok(calculator, `Calculator ${guide.targetCalculatorId} not found`);
    assert.ok(
      calculator.relatedGuideSlugs.includes(slug),
      `Calculator ${calculator.id} should include guide ${slug} in relatedGuideSlugs`
    );
  }
});

test('Phase 4B-2B worked examples match calculator engine outputs exactly', async () => {
  const { calculateDrywall } = await import('../src/scripts/calculators/drywall.ts');
  const { calculateDeckMaterial } = await import('../src/scripts/calculators/deckMaterial.ts');
  const { calculateFenceMaterial } = await import('../src/scripts/calculators/fenceMaterial.ts');
  const { calculateRoofing } = await import('../src/scripts/calculators/roofing.ts');
  const { calculateTopsoil } = await import('../src/scripts/calculators/topsoil.ts');

  // 1. Drywall parity
  const dwResult = calculateDrywall({
    roomLength: 16,
    roomWidth: 12,
    ceilingHeight: 8,
    includeCeiling: true,
    doorCount: 2,
    windowCount: 2,
    wastePercentage: 10,
  });
  assert.equal(dwResult.success, true);
  assert.equal(dwResult.outputs.netDrywallAreaSqFt, 568);
  assert.equal(dwResult.outputs.recommendedDrywallAreaSqFt, 624.8);
  assert.equal(dwResult.outputs.sheets4x8ToPurchase, 20);
  assert.equal(dwResult.outputs.sheets4x12ToPurchase, 14);
  assert.equal(dwResult.outputs.jointCompound45GalBuckets, 2);
  assert.equal(dwResult.outputs.drywallTape500ftRolls, 2);
  assert.equal(dwResult.outputs.drywallScrewsLbs, 3);

  // 2. Deck parity
  const deckResult = calculateDeckMaterial({
    deckLength: 16,
    deckWidth: 12,
    joistSpacingInches: 16,
    boardLengthStockFeet: 16,
    wastePercentage: 10,
  });
  assert.equal(deckResult.success, true);
  assert.equal(deckResult.outputs.boardRowsCount, 26);
  assert.equal(deckResult.outputs.netDeckingLinearFeet, 416);
  assert.equal(deckResult.outputs.recommendedDeckingLinearFeet, 457.6);
  assert.equal(deckResult.outputs.purchasedDeckingLinearFeet, 464);
  assert.equal(deckResult.outputs.deckBoardsToPurchase, 29);
  assert.equal(deckResult.outputs.joistCount, 13);
  assert.equal(deckResult.outputs.fastenersEstimate, 744);

  // 3. Fence parity
  const fenceResult = calculateFenceMaterial({
    fenceLength: 150,
    fenceHeightFeet: 6,
    postSpacingFeet: 8,
    picketWidthInches: 5.5,
    picketGapInches: 0,
    gateCount: 1,
    wastePercentage: 5,
  });
  assert.equal(fenceResult.success, true);
  assert.equal(fenceResult.outputs.postsToPurchase, 22);
  assert.equal(fenceResult.outputs.railsToPurchase, 57);
  assert.equal(fenceResult.outputs.picketsToPurchase, 344);
  assert.equal(fenceResult.outputs.concrete60lbBagsToPurchase, 33);

  // 4. Roofing parity
  const roofResult = calculateRoofing({
    footprintAreaSqFt: 2000,
    roofPitchRisePerFoot: 6,
    complexityWastePercentage: 10,
    bundlesPerSquare: 3,
  });
  assert.equal(roofResult.success, true);
  assert.equal(roofResult.outputs.pitchMultiplier, 1.118);
  assert.equal(roofResult.outputs.actualRoofAreaSqFt, 2236.1);
  assert.equal(roofResult.outputs.recommendedRoofAreaSqFt, 2459.7);
  assert.equal(roofResult.outputs.roofingSquaresToPurchase, 25);
  assert.equal(roofResult.outputs.shingleBundlesToPurchase, 75);
  assert.equal(roofResult.outputs.syntheticUnderlaymentRolls, 3);

  // 5. Topsoil parity
  const topsoilResult = calculateTopsoil({
    bedLength: 20,
    bedWidth: 10,
    soilDepthInches: 4,
    wastePercentage: 10,
  });
  assert.equal(topsoilResult.success, true);
  assert.equal(topsoilResult.outputs.geometricVolumeCuFt, 66.67);
  assert.equal(topsoilResult.outputs.geometricVolumeCuYds, 2.47);
  assert.equal(topsoilResult.outputs.recommendedVolumeCuFt, 73.33);
  assert.equal(topsoilResult.outputs.recommendedVolumeCuYds, 2.72);
  assert.equal(topsoilResult.outputs.bags075cuftToPurchase, 98);
  assert.equal(topsoilResult.outputs.bags1cuftToPurchase, 74);
});

test('Phase 4B-2D guides are bidirectionally cross-linked in categories and calculators', () => {
  const newGuideSlugs = [
    'how-much-sod-do-i-need',
    'how-much-baseboard-do-i-need',
  ];

  for (const slug of newGuideSlugs) {
    const guide = getGuideBySlug(slug);
    assert.ok(guide, `Guide ${slug} not found`);

    // Verify category has guide in relatedGuideSlugs
    const category = CATEGORIES[guide.categoryId];
    assert.ok(category, `Category ${guide.categoryId} not found`);
    assert.ok(
      category.relatedGuideSlugs.includes(slug),
      `Category ${category.id} should include guide ${slug} in relatedGuideSlugs`
    );

    // Verify target calculator has guide in relatedGuideSlugs
    const calculator = CALCULATORS[guide.targetCalculatorId];
    assert.ok(calculator, `Calculator ${guide.targetCalculatorId} not found`);
    assert.ok(
      calculator.relatedGuideSlugs.includes(slug),
      `Calculator ${calculator.id} should include guide ${slug} in relatedGuideSlugs`
    );
  }
});

test('Phase 4B-2D worked examples match calculator engine outputs exactly', async () => {
  const { calculateSod } = await import('../src/scripts/calculators/sod.ts');
  const { calculateBaseboardTrim } = await import('../src/scripts/calculators/baseboardTrim.ts');

  // 1. Sod parity
  const sodResult = calculateSod({
    lawnLength: 50,
    lawnWidth: 30,
    palletCoverageSqFt: 450,
    wastePercentage: 8,
  });
  assert.equal(sodResult.success, true);
  assert.equal(sodResult.outputs.netAreaSqFt, 1500);
  assert.equal(sodResult.outputs.wastePercentage, 8);
  assert.equal(sodResult.outputs.recommendedAreaSqFt, 1620);
  assert.equal(sodResult.outputs.palletsToPurchase, 4);
  assert.equal(sodResult.outputs.purchasedSqFt, 1800);
  assert.equal(sodResult.outputs.rollsEquivalent, 162);

  // 2. Baseboard parity
  const bbResult = calculateBaseboardTrim({
    roomLength: 16,
    roomWidth: 12,
    doorOpenings: 2,
    stickLengthFeet: 12,
    wastePercentage: 15,
  });
  assert.equal(bbResult.success, true);
  assert.equal(bbResult.outputs.grossPerimeterFeet, 56);
  assert.equal(bbResult.outputs.doorwayDeductionFeet, 5);
  assert.equal(bbResult.outputs.netLinearFeet, 51);
  assert.equal(bbResult.outputs.wastePercentage, 15);
  assert.equal(bbResult.outputs.recommendedPurchaseLinearFeet, 58.7);
  assert.equal(bbResult.outputs.sticksToPurchase, 5);
  assert.equal(bbResult.outputs.purchasedLinearFeet, 60);
});


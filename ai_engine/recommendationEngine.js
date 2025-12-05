// Product recommendation engine based on skin type and issues

function generateRecommendations(skinType, issues) {
  const recommendations = {
    products: [],
    routine: { morning: [], night: [] },
    diet: [],
    lifestyle: [],
    safetyWarnings: []
  };

  // Base products for all skin types
  recommendations.routine.morning.push({
    step: 1,
    type: 'Cleanser',
    product: getSuitableCleanser(skinType),
    when: 'Morning',
    howToUse: 'Wet face, apply cleanser, massage gently for 30-60 seconds, rinse with lukewarm water'
  });

  // Add issue-specific products
  issues.forEach(issue => {
    const category = issue.category.toLowerCase();
    
    if (category.includes('acne')) {
      addAcneProducts(recommendations, skinType, issue.severity);
    }
    
    if (category.includes('pigmentation') || category.includes('dark spot')) {
      addPigmentationProducts(recommendations, skinType);
    }
    
    if (category.includes('texture') || category.includes('pore')) {
      addTextureProducts(recommendations, skinType);
    }
    
    if (category.includes('hydration') || category.includes('dry')) {
      addHydrationProducts(recommendations, skinType);
    }
    
    if (category.includes('aging') || category.includes('wrinkle')) {
      addAntiAgingProducts(recommendations, skinType);
    }
    
    if (category.includes('under-eye')) {
      addUnderEyeProducts(recommendations);
    }
  });

  // Always add sunscreen (mandatory)
  recommendations.routine.morning.push({
    step: 99,
    type: 'Sunscreen',
    product: 'Broad-spectrum SPF 30-50 sunscreen',
    activeIngredients: ['Zinc oxide or chemical filters'],
    when: 'Morning (last step)',
    howToUse: 'Apply generously 15 minutes before sun exposure. Reapply every 2 hours.',
    importance: 'CRITICAL - Prevents sun damage, aging, and pigmentation'
  });

  // Add moisturizer
  recommendations.routine.morning.push({
    step: 4,
    type: 'Moisturizer',
    product: getSuitableMoisturizer(skinType),
    when: 'Morning & Night',
    howToUse: 'Apply to damp skin after serums, massage gently until absorbed'
  });

  // Generate diet recommendations
  recommendations.diet = generateDietPlan(issues);
  
  // Generate lifestyle tips
  recommendations.lifestyle = generateLifestyleTips(issues);
  
  // Add safety warnings
  recommendations.safetyWarnings = generateSafetyWarnings(recommendations.products);

  // Sort routine by step number
  recommendations.routine.morning.sort((a, b) => a.step - b.step);
  recommendations.routine.night.sort((a, b) => a.step - b.step);

  return recommendations;
}

// Helper functions
function getSuitableCleanser(skinType) {
  const cleansers = {
    'Oily': 'Salicylic acid or foaming gel cleanser (oil-control)',
    'Dry': 'Gentle cream or milk cleanser (hydrating)',
    'Combination': 'Balanced gel cleanser',
    'Normal': 'Gentle foaming or gel cleanser',
    'Sensitive': 'Fragrance-free gentle cleanser with ceramides',
    'Dehydrated': 'Hydrating cream cleanser with hyaluronic acid'
  };
  return cleansers[skinType] || 'Gentle cleanser';
}

function getSuitableMoisturizer(skinType) {
  const moisturizers = {
    'Oily': 'Oil-free gel moisturizer with niacinamide',
    'Dry': 'Rich cream moisturizer with ceramides and hyaluronic acid',
    'Combination': 'Lightweight lotion moisturizer',
    'Normal': 'Balanced cream or lotion moisturizer',
    'Sensitive': 'Fragrance-free barrier repair cream with centella',
    'Dehydrated': 'Hydrating cream with hyaluronic acid and glycerin'
  };
  return moisturizers[skinType] || 'Balanced moisturizer';
}

function addAcneProducts(recommendations, skinType, severity) {
  recommendations.products.push({
    type: 'Acne Treatment Serum',
    product: '2% Salicylic acid serum or 2.5% Benzoyl peroxide',
    activeIngredients: ['Salicylic acid', 'Niacinamide'],
    purpose: 'Unclogs pores, reduces acne, controls oil',
    when: 'Night',
    frequency: 'Start 2-3x per week, increase gradually',
    precautions: 'May cause dryness initially. Use sunscreen daily.',
    expectedResults: '4-8 weeks'
  });

  recommendations.routine.night.push({
    step: 2,
    type: 'Spot Treatment',
    product: 'Benzoyl peroxide 2.5% spot gel',
    when: 'Night (on active breakouts)',
    howToUse: 'Apply small amount directly on pimples after cleansing'
  });

  recommendations.diet.push('Reduce dairy intake', 'Increase omega-3 foods (fish, walnuts)', 'Stay hydrated (8+ glasses water)');
}

function addPigmentationProducts(recommendations, skinType) {
  recommendations.products.push({
    type: 'Brightening Serum',
    product: 'Vitamin C serum (10-20%) or Alpha arbutin serum',
    activeIngredients: ['Vitamin C', 'Alpha arbutin', 'Niacinamide'],
    purpose: 'Fades dark spots, evens skin tone, brightens',
    when: 'Morning',
    frequency: 'Daily',
    precautions: 'Store in cool, dark place. Use sunscreen mandatory.',
    expectedResults: '8-12 weeks'
  });

  recommendations.routine.morning.push({
    step: 2,
    type: 'Vitamin C Serum',
    product: '10-15% L-ascorbic acid serum',
    when: 'Morning (after cleansing)',
    howToUse: 'Apply 3-4 drops to face and neck, let absorb before moisturizer'
  });

  recommendations.diet.push('Vitamin C rich foods (citrus, berries)', 'Antioxidant foods (green tea, dark chocolate)');
  recommendations.safetyWarnings.push('⚠️ SUNSCREEN MANDATORY with Vitamin C - prevents further pigmentation');
}

function addTextureProducts(recommendations, skinType) {
  recommendations.products.push({
    type: 'Chemical Exfoliant',
    product: 'BHA (2% Salicylic acid) or AHA (8-10% Glycolic acid)',
    activeIngredients: ['Salicylic acid or Glycolic acid'],
    purpose: 'Smooths texture, minimizes pores, removes dead skin',
    when: 'Night',
    frequency: '1-2x per week (beginners), 3x per week (advanced)',
    precautions: 'Do NOT use with retinol on same night. Sunscreen mandatory.',
    expectedResults: '4-6 weeks'
  });

  recommendations.routine.night.push({
    step: 2,
    type: 'Exfoliant',
    product: '2% BHA liquid exfoliant',
    when: 'Night (2-3x per week)',
    howToUse: 'Apply with cotton pad after cleansing, wait 20 min before next step'
  });
}

function addHydrationProducts(recommendations, skinType) {
  recommendations.products.push({
    type: 'Hydrating Serum',
    product: 'Hyaluronic acid serum',
    activeIngredients: ['Hyaluronic acid', 'Glycerin', 'Ceramides'],
    purpose: 'Deep hydration, plumps skin, repairs barrier',
    when: 'Morning & Night',
    frequency: 'Daily',
    precautions: 'Apply on damp skin for best results',
    expectedResults: '2-4 weeks'
  });

  recommendations.routine.morning.push({
    step: 3,
    type: 'Hydrating Serum',
    product: 'Hyaluronic acid + B5 serum',
    when: 'Morning & Night',
    howToUse: 'Apply to damp skin, pat gently'
  });

  recommendations.diet.push('Water-rich fruits (watermelon, cucumber)', 'Increase water intake to 10+ glasses');
}

function addAntiAgingProducts(recommendations, skinType) {
  recommendations.products.push({
    type: 'Retinol Serum',
    product: 'Retinol 0.25-0.5% (beginners) or 1% (advanced)',
    activeIngredients: ['Retinol', 'Peptides'],
    purpose: 'Reduces fine lines, boosts collagen, improves firmness',
    when: 'Night ONLY',
    frequency: 'Start 1x per week, increase to 3-4x per week',
    precautions: 'NEVER use in morning. Causes sun sensitivity. Avoid with AHA/BHA.',
    expectedResults: '12-16 weeks'
  });

  recommendations.routine.night.push({
    step: 3,
    type: 'Retinol',
    product: '0.5% Retinol serum',
    when: 'Night (start slow)',
    howToUse: 'Pea-sized amount on dry skin. Wait 20 min before moisturizer.'
  });

  recommendations.diet.push('Collagen-boosting foods (bone broth, vitamin C)', 'Antioxidants (berries, green tea)');
  recommendations.safetyWarnings.push('⚠️ RETINOL: Night only, causes sun sensitivity, do NOT combine with AHA/BHA');
}

function addUnderEyeProducts(recommendations) {
  recommendations.products.push({
    type: 'Under-eye Cream',
    product: 'Caffeine + peptides eye cream',
    activeIngredients: ['Caffeine', 'Peptides', 'Hyaluronic acid'],
    purpose: 'Reduces puffiness, dark circles, fine lines',
    when: 'Morning & Night',
    frequency: 'Daily',
    precautions: 'Use gentle tapping motion, avoid pulling skin',
    expectedResults: '6-8 weeks'
  });
}

function generateDietPlan(issues) {
  const diet = [
    'Drink 8-10 glasses of water daily',
    'Include omega-3 foods (salmon, walnuts, flaxseeds)',
    'Eat antioxidant-rich foods (berries, green tea, dark chocolate)',
    'Vitamin C foods (citrus, bell peppers, broccoli)',
    'Reduce sugar and processed foods'
  ];

  issues.forEach(issue => {
    if (issue.category.toLowerCase().includes('acne')) {
      diet.push('Limit dairy products', 'Reduce high-glycemic foods');
    }
    if (issue.category.toLowerCase().includes('aging')) {
      diet.push('Collagen-rich foods (bone broth)', 'Vitamin E foods (almonds, avocado)');
    }
  });

  return [...new Set(diet)]; // Remove duplicates
}

function generateLifestyleTips(issues) {
  return [
    '💤 Sleep 7-8 hours nightly for skin repair',
    '☀️ Wear sunscreen daily, even indoors',
    '💧 Stay hydrated throughout the day',
    '🧘 Manage stress (meditation, exercise)',
    '📱 Limit screen time before bed',
    '🧼 Change pillowcases weekly',
    '🚿 Avoid hot water on face',
    '✋ Don\'t touch your face frequently',
    '🏃 Exercise regularly for circulation',
    '🚭 Avoid smoking and excessive alcohol'
  ];
}

function generateSafetyWarnings(products) {
  const warnings = [];
  const hasRetinol = products.some(p => p.type.toLowerCase().includes('retinol'));
  const hasAHA = products.some(p => p.activeIngredients?.some(i => i.toLowerCase().includes('glycolic') || i.toLowerCase().includes('aha')));
  const hasBHA = products.some(p => p.activeIngredients?.some(i => i.toLowerCase().includes('salicylic') || i.toLowerCase().includes('bha')));
  const hasVitaminC = products.some(p => p.activeIngredients?.some(i => i.toLowerCase().includes('vitamin c')));

  if (hasRetinol && (hasAHA || hasBHA)) {
    warnings.push('⚠️ CRITICAL: Do NOT use Retinol and AHA/BHA on the same night. Alternate nights.');
  }

  if (hasVitaminC && (hasAHA || hasBHA)) {
    warnings.push('⚠️ Use Vitamin C in morning, acids at night to avoid irritation');
  }

  warnings.push('✅ Always patch test new products on inner arm for 24 hours');
  warnings.push('✅ Introduce one new active ingredient at a time (wait 2 weeks)');
  warnings.push('✅ Sunscreen is MANDATORY when using any active ingredients');

  return warnings;
}

module.exports = { generateRecommendations };

// Product recommendation engine based on skin type and issues
// Includes medical safety logic and ingredient conflict resolution

// Medical disclaimer template for all recommendations
const MEDICAL_DISCLAIMER = "⚠️ MEDICAL DISCLAIMER: The following information is educational and informational only. Ingredients mentioned are commonly suggested for these skin concerns, but individual results may vary. Always consult with a licensed dermatologist or healthcare provider before starting any new skincare routine, especially if you have sensitive skin, allergies, or medical conditions. This is not medical advice, diagnosis, or treatment.";

// Educational language helper - converts prescriptive to educational
function makeEducational(text) {
  // Replace prescriptive language with educational language
  const replacements = [
    [/^Use this/gi, 'Ingredients like this are often suggested for'],
    [/^Apply/gi, 'Many people find it helpful to apply'],
    [/^You should/gi, 'Some individuals may benefit from'],
    [/^You must/gi, 'It is generally recommended to'],
    [/^Do this/gi, 'A common approach is to'],
    [/^Start with/gi, 'Many skincare routines begin with'],
    [/^Always/gi, 'It is typically recommended to'],
    [/^Never/gi, 'It is generally advised to avoid'],
  ];
  
  let educational = text;
  replacements.forEach(([pattern, replacement]) => {
    educational = educational.replace(pattern, replacement);
  });
  
  return educational;
}

// Detect ingredient conflicts
function detectConflicts(issues) {
  const conflicts = {
    hasAcne: false,
    hasAging: false,
    hasPigmentation: false,
    hasSensitivity: false
  };
  
  issues.forEach(issue => {
    const category = issue.category.toLowerCase();
    if (category.includes('acne')) conflicts.hasAcne = true;
    if (category.includes('aging') || category.includes('wrinkle') || category.includes('fine line')) conflicts.hasAging = true;
    if (category.includes('pigmentation') || category.includes('dark spot')) conflicts.hasPigmentation = true;
    if (category.includes('sensitive') || category.includes('redness') || category.includes('inflammation')) conflicts.hasSensitivity = true;
  });
  
  return conflicts;
}

// Generate skin cycling schedule for conflicting ingredients
function generateSkinCyclingSchedule(conflicts) {
  if (conflicts.hasAcne && conflicts.hasAging) {
    return {
      enabled: true,
      schedule: {
        monday: { type: 'retinol', description: 'Retinol night routine' },
        tuesday: { type: 'acne', description: 'BHA/Acne treatment night routine' },
        wednesday: { type: 'retinol', description: 'Retinol night routine' },
        thursday: { type: 'acne', description: 'BHA/Acne treatment night routine' },
        friday: { type: 'retinol', description: 'Retinol night routine' },
        saturday: { type: 'rest', description: 'Gentle barrier repair night routine' },
        sunday: { type: 'rest', description: 'Gentle barrier repair night routine' }
      },
      explanation: "Since you have both acne and aging concerns, we recommend 'Skin Cycling' to avoid ingredient conflicts. This alternates Retinol (anti-aging) and BHA/Acne treatments (acne-fighting) on different nights, with rest days for barrier repair."
    };
  }
  return { enabled: false };
}

function generateRecommendations(skinType, issues) {
  const recommendations = {
    products: [],
    routine: { morning: [], night: [], cycling: null }, // Added cycling schedule
    diet: [],
    lifestyle: [],
    safetyWarnings: [],
    medicalDisclaimer: MEDICAL_DISCLAIMER
  };
  
  // Detect conflicts early
  const conflicts = detectConflicts(issues);
  const cyclingSchedule = generateSkinCyclingSchedule(conflicts);
  if (cyclingSchedule.enabled) {
    recommendations.routine.cycling = cyclingSchedule;
  }

  // Base products for all skin types (educational language)
  recommendations.routine.morning.push({
    step: 1,
    type: 'Cleanser',
    product: getSuitableCleanser(skinType),
    when: 'Morning',
    howToUse: makeEducational('Many people find it helpful to wet face, apply cleanser, massage gently for 30-60 seconds, then rinse with lukewarm water'),
    educationalNote: 'A gentle cleanser appropriate for your skin type is typically the foundation of any skincare routine.'
  });

  // Add issue-specific products
  // IMPORTANT: Process acne BEFORE aging to detect conflicts early
  const hasAcne = issues.some(issue => issue.category.toLowerCase().includes('acne'));
  const hasAging = issues.some(issue => {
    const cat = issue.category.toLowerCase();
    return cat.includes('aging') || cat.includes('wrinkle') || cat.includes('fine line');
  });
  
  // If both acne and aging, we'll use skin cycling
  if (hasAcne && hasAging) {
    // Add both but mark for cycling
    issues.forEach(issue => {
      const category = issue.category.toLowerCase();
      if (category.includes('acne')) {
        addAcneProducts(recommendations, skinType, issue.severity);
      }
    });
    
    issues.forEach(issue => {
      const category = issue.category.toLowerCase();
      if (category.includes('aging') || category.includes('wrinkle')) {
        addAntiAgingProducts(recommendations, skinType);
      }
    });
  } else {
    // Normal flow - no conflicts
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
  }

  // Always add sunscreen (mandatory) - educational language
  recommendations.routine.morning.push({
    step: 99,
    type: 'Sunscreen',
    product: 'Broad-spectrum SPF 30-50 sunscreen',
    activeIngredients: ['Zinc oxide or chemical filters'],
    when: 'Morning (last step)',
    howToUse: makeEducational('It is generally recommended to apply generously 15 minutes before sun exposure and reapply every 2 hours'),
    importance: 'CRITICAL - Sunscreen is widely recognized as essential for preventing sun damage, premature aging, and pigmentation. Consult your dermatologist for the best SPF for your skin type.',
    educationalNote: 'Dermatologists consistently recommend daily sunscreen use as the most important step in any skincare routine.'
  });

  // Add moisturizer (educational language)
  recommendations.routine.morning.push({
    step: 4,
    type: 'Moisturizer',
    product: getSuitableMoisturizer(skinType),
    when: 'Morning & Night',
    howToUse: makeEducational('Many people find it helpful to apply to damp skin after serums, massaging gently until absorbed'),
    educationalNote: 'Moisturizers appropriate for your skin type help maintain the skin barrier and prevent moisture loss.'
  });

  // Generate diet recommendations
  recommendations.diet = generateDietPlan(issues);
  
  // Generate lifestyle tips
  recommendations.lifestyle = generateLifestyleTips(issues);
  
  // Add safety warnings (pass cycling status)
  recommendations.safetyWarnings = generateSafetyWarnings(recommendations.products, cyclingSchedule.enabled);

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
  // Check if skin cycling is needed (conflict with retinol)
  const needsCycling = recommendations.routine.cycling?.enabled;
  
  recommendations.products.push({
    type: 'Acne Treatment Serum',
    product: '2% Salicylic acid serum or 2.5% Benzoyl peroxide',
    activeIngredients: ['Salicylic acid', 'Niacinamide'],
    purpose: 'Ingredients like salicylic acid and benzoyl peroxide are commonly suggested for unclogging pores, reducing acne, and controlling oil production',
    when: needsCycling ? 'Night (on cycling days - see schedule)' : 'Night',
    frequency: 'Many people start with 2-3x per week and gradually increase',
    precautions: 'These ingredients may cause dryness initially. It is generally recommended to use sunscreen daily. Consult a dermatologist before use, especially if you have sensitive skin.',
    expectedResults: 'Individual results vary, but many people see improvements within 4-8 weeks of consistent use',
    educationalNote: 'Salicylic acid (BHA) and benzoyl peroxide are FDA-approved ingredients for acne treatment, but individual responses vary. Always patch test first.'
  });

  if (!needsCycling) {
    // Only add to routine if not cycling (cycling schedule handles this separately)
    recommendations.routine.night.push({
      step: 2,
      type: 'Spot Treatment',
      product: 'Benzoyl peroxide 2.5% spot gel',
      when: 'Night (on active breakouts)',
      howToUse: makeEducational('Some individuals may benefit from applying a small amount directly on pimples after cleansing'),
      educationalNote: 'Spot treatments with benzoyl peroxide are commonly used for targeted acne treatment. Consult your dermatologist for proper usage.'
    });
  }

  recommendations.diet.push('Some research suggests reducing dairy intake may help some individuals with acne', 'Omega-3 foods (fish, walnuts) are often recommended for their anti-inflammatory properties', 'Staying hydrated (8+ glasses water daily) is generally beneficial for skin health');
}

function addPigmentationProducts(recommendations, skinType) {
  recommendations.products.push({
    type: 'Brightening Serum',
    product: 'Vitamin C serum (10-20%) or Alpha arbutin serum',
    activeIngredients: ['Vitamin C', 'Alpha arbutin', 'Niacinamide'],
    purpose: 'Ingredients like Vitamin C and alpha arbutin are commonly suggested for fading dark spots, evening skin tone, and brightening the complexion',
    when: 'Morning',
    frequency: 'Many people use these ingredients daily',
    precautions: 'It is generally recommended to store Vitamin C in a cool, dark place. Sunscreen is essential when using brightening ingredients. Consult a dermatologist before use.',
    expectedResults: 'Individual results vary, but many people see improvements within 8-12 weeks of consistent use',
    educationalNote: 'Vitamin C and alpha arbutin are popular ingredients for hyperpigmentation, but individual responses vary. Always patch test first.'
  });

  recommendations.routine.morning.push({
    step: 2,
    type: 'Vitamin C Serum',
    product: '10-15% L-ascorbic acid serum',
    when: 'Morning (after cleansing)',
    howToUse: makeEducational('Many people find it helpful to apply 3-4 drops to face and neck, allowing it to absorb before applying moisturizer'),
    educationalNote: 'Vitamin C serums are typically used in the morning for their antioxidant benefits. Consult your dermatologist for the right concentration.'
  });

  recommendations.diet.push('Vitamin C rich foods (citrus, berries) are often recommended for their antioxidant properties', 'Some research suggests antioxidant foods (green tea, dark chocolate) may support skin health');
  recommendations.safetyWarnings.push('⚠️ SUNSCREEN ESSENTIAL: When using Vitamin C or other brightening ingredients, daily sunscreen use is widely recommended to prevent further pigmentation. Consult your dermatologist.');
}

function addTextureProducts(recommendations, skinType) {
  recommendations.products.push({
    type: 'Chemical Exfoliant',
    product: 'BHA (2% Salicylic acid) or AHA (8-10% Glycolic acid)',
    activeIngredients: ['Salicylic acid or Glycolic acid'],
    purpose: 'Chemical exfoliants like BHA and AHA are commonly suggested for smoothing texture, minimizing pores, and removing dead skin cells',
    when: 'Night',
    frequency: 'Many people start with 1-2x per week (beginners) and gradually increase to 3x per week (advanced) as tolerated',
    precautions: 'It is generally advised to avoid using these exfoliants with retinol on the same night. Sunscreen is essential. Consult a dermatologist before use, especially if you have sensitive skin.',
    expectedResults: 'Individual results vary, but many people see improvements within 4-6 weeks of consistent use',
    educationalNote: 'BHA (salicylic acid) and AHA (glycolic acid) are FDA-approved exfoliants, but overuse can cause irritation. Always patch test first.'
  });

  recommendations.routine.night.push({
    step: 2,
    type: 'Exfoliant',
    product: '2% BHA liquid exfoliant',
    when: 'Night (2-3x per week)',
    howToUse: makeEducational('Many people find it helpful to apply with a cotton pad after cleansing, waiting 20 minutes before the next step'),
    educationalNote: 'Chemical exfoliants should be introduced gradually to minimize irritation. Consult your dermatologist for proper usage.'
  });
}

function addHydrationProducts(recommendations, skinType) {
  recommendations.products.push({
    type: 'Hydrating Serum',
    product: 'Hyaluronic acid serum',
    activeIngredients: ['Hyaluronic acid', 'Glycerin', 'Ceramides'],
    purpose: 'Hyaluronic acid, glycerin, and ceramides are commonly suggested for deep hydration, plumping the skin, and supporting barrier repair',
    when: 'Morning & Night',
    frequency: 'Many people use hydrating serums daily',
    precautions: 'Many people find it helpful to apply on damp skin for best results. Consult a dermatologist if you experience any irritation.',
    expectedResults: 'Individual results vary, but many people notice improvements within 2-4 weeks',
    educationalNote: 'Hyaluronic acid is a humectant that can hold up to 1000x its weight in water. It is generally well-tolerated by most skin types.'
  });

  recommendations.routine.morning.push({
    step: 3,
    type: 'Hydrating Serum',
    product: 'Hyaluronic acid + B5 serum',
    when: 'Morning & Night',
    howToUse: makeEducational('Many people find it helpful to apply to damp skin, patting gently'),
    educationalNote: 'Hydrating serums are typically applied to damp skin to maximize moisture retention.'
  });

  recommendations.diet.push('Water-rich fruits (watermelon, cucumber) are often recommended for hydration', 'Many healthcare providers suggest increasing water intake to 10+ glasses daily for overall health');
}

function addAntiAgingProducts(recommendations, skinType) {
  // Check if skin cycling is needed (conflict with acne treatments)
  const needsCycling = recommendations.routine.cycling?.enabled;
  const conflicts = detectConflicts(recommendations.products.map(p => ({ category: p.type })));
  
  recommendations.products.push({
    type: 'Retinol Serum',
    product: 'Retinol 0.25-0.5% (beginners) or 1% (advanced)',
    activeIngredients: ['Retinol', 'Peptides'],
    purpose: 'Retinol is a vitamin A derivative that is commonly suggested for reducing fine lines, supporting collagen production, and improving skin firmness',
    when: needsCycling ? 'Night ONLY (on cycling days - see schedule)' : 'Night ONLY',
    frequency: 'Many people start with 1x per week and gradually increase to 3-4x per week as tolerated',
    precautions: 'Retinol should only be used at night. It increases sun sensitivity, so daily sunscreen is essential. It is generally advised to avoid combining retinol with AHA/BHA on the same night. Consult a dermatologist before starting retinol, especially if you have sensitive skin.',
    expectedResults: 'Individual results vary, but many people see improvements within 12-16 weeks of consistent use',
    educationalNote: 'Retinol is FDA-approved for anti-aging but requires careful introduction and sun protection. Always patch test first.'
  });

  if (!needsCycling) {
    // Only add to routine if not cycling (cycling schedule handles this separately)
    recommendations.routine.night.push({
      step: 3,
      type: 'Retinol',
      product: '0.5% Retinol serum',
      when: 'Night (start slow)',
      howToUse: makeEducational('Many people find it helpful to use a pea-sized amount on dry skin, waiting 20 minutes before applying moisturizer'),
      educationalNote: 'Retinol should be introduced gradually to minimize irritation. Consult your dermatologist for the right strength and frequency.'
    });
  }

  recommendations.diet.push('Some research suggests collagen-boosting foods (bone broth, vitamin C) may support skin health', 'Antioxidants (berries, green tea) are often recommended for their potential anti-aging benefits');
  
  if (needsCycling) {
    recommendations.safetyWarnings.push('⚠️ SKIN CYCLING ACTIVE: Retinol and BHA/Acne treatments are scheduled on alternate nights to prevent ingredient conflicts. Follow the cycling schedule provided.');
  } else {
    recommendations.safetyWarnings.push('⚠️ RETINOL SAFETY: Retinol should only be used at night and increases sun sensitivity. It is generally advised to avoid combining with AHA/BHA on the same night. Consult a dermatologist before use.');
  }
}

function addUnderEyeProducts(recommendations) {
  recommendations.products.push({
    type: 'Under-eye Cream',
    product: 'Caffeine + peptides eye cream',
    activeIngredients: ['Caffeine', 'Peptides', 'Hyaluronic acid'],
    purpose: 'Ingredients like caffeine and peptides are commonly suggested for reducing puffiness, dark circles, and fine lines around the eyes',
    when: 'Morning & Night',
    frequency: 'Many people use eye creams daily',
    precautions: 'It is generally recommended to use a gentle tapping motion and avoid pulling the delicate eye area. Consult a dermatologist if you experience irritation.',
    expectedResults: 'Individual results vary, but many people see improvements within 6-8 weeks',
    educationalNote: 'The eye area is delicate and requires gentle care. Caffeine can temporarily reduce puffiness, while peptides may support collagen production.'
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

function generateSafetyWarnings(products, hasCycling = false) {
  const warnings = [];
  const hasRetinol = products.some(p => p.type.toLowerCase().includes('retinol'));
  const hasAHA = products.some(p => p.activeIngredients?.some(i => i.toLowerCase().includes('glycolic') || i.toLowerCase().includes('aha')));
  const hasBHA = products.some(p => p.activeIngredients?.some(i => i.toLowerCase().includes('salicylic') || i.toLowerCase().includes('bha')));
  const hasVitaminC = products.some(p => p.activeIngredients?.some(i => i.toLowerCase().includes('vitamin c')));
  
  if (hasRetinol && (hasAHA || hasBHA) && !hasCycling) {
    warnings.push('⚠️ INGREDIENT CONFLICT: It is generally advised to avoid using Retinol and AHA/BHA on the same night. Many people alternate nights or use a skin cycling schedule. Consult your dermatologist for personalized guidance.');
  }

  if (hasVitaminC && (hasAHA || hasBHA)) {
    warnings.push('⚠️ TIMING RECOMMENDATION: Many dermatologists suggest using Vitamin C in the morning and acids at night to minimize potential irritation. Individual responses vary.');
  }

  warnings.push('✅ SAFETY FIRST: It is generally recommended to patch test new products on the inner arm for 24 hours before facial use');
  warnings.push('✅ GRADUAL INTRODUCTION: Many skincare experts suggest introducing one new active ingredient at a time, waiting 2 weeks between additions');
  warnings.push('✅ SUN PROTECTION: Daily sunscreen use is widely recommended when using any active ingredients. Consult your dermatologist for the best SPF for your skin type');

  return warnings;
}

module.exports = { generateRecommendations };

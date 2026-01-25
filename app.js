/**
 * WeightGain - Main Application
 * Brand: Warrior/Gains positioning
 * "Built for Warriors" - TRT & Hormone Testing for Teens & Young Adults
 */

// =============================================================================
// Safe JSON.parse wrapper
// =============================================================================
function safeJSONParse(str, fallback = null) {
  try {
    return str ? JSON.parse(str) : fallback;
  } catch (e) {
    console.warn('Failed to parse JSON:', e);
    return fallback;
  }
}

// =============================================================================
// Test Catalog Data - Performance Biomarker Tests
// =============================================================================

const testCatalog = [
  // Performance Hormones
  {
    id: 'total-testosterone',
    name: 'Total Testosterone',
    category: 'hormones',
    description: 'The primary male sex hormone crucial for muscle mass, strength, energy, and overall performance. Essential baseline for any optimization protocol.',
    price: 49,
    biomarkers: ['Total T'],
    turnaround: '24-48 hours',
    fasting: false,
    popular: true
  },
  {
    id: 'free-testosterone',
    name: 'Free Testosterone',
    category: 'hormones',
    description: 'Measures the bioavailable testosterone not bound to proteins. More accurate indicator of actual testosterone activity in the body.',
    price: 69,
    biomarkers: ['Free T', 'Bioavailable T'],
    turnaround: '24-48 hours',
    fasting: false,
    popular: true
  },
  {
    id: 'testosterone-complete',
    name: 'Testosterone Complete Panel',
    category: 'hormones',
    description: 'Comprehensive testosterone assessment including total T, free T, SHBG, and albumin. The gold standard for hormone optimization.',
    price: 129,
    biomarkers: ['Total T', 'Free T', 'SHBG', 'Albumin'],
    turnaround: '24-48 hours',
    fasting: false,
    popular: true
  },
  {
    id: 'estradiol',
    name: 'Estradiol (E2)',
    category: 'hormones',
    description: 'Essential estrogen marker for men on TRT. Optimal E2 levels are crucial for mood, libido, joint health, and cardiovascular protection.',
    price: 59,
    biomarkers: ['Estradiol Sensitive'],
    turnaround: '24-48 hours',
    fasting: false,
    popular: true
  },
  {
    id: 'estradiol-ultrasensitive',
    name: 'Estradiol Ultrasensitive (LC/MS)',
    category: 'hormones',
    description: 'Gold-standard LC/MS method for accurate estradiol measurement. Recommended for men where precise E2 monitoring is critical.',
    price: 79,
    biomarkers: ['Estradiol (LC/MS)'],
    turnaround: '3-5 days',
    fasting: false
  },
  {
    id: 'shbg',
    name: 'SHBG (Sex Hormone Binding Globulin)',
    category: 'hormones',
    description: 'Protein that binds testosterone. High SHBG reduces free testosterone availability. Key marker for understanding hormone bioavailability.',
    price: 49,
    biomarkers: ['SHBG'],
    turnaround: '24-48 hours',
    fasting: false
  },
  {
    id: 'lh-fsh',
    name: 'LH & FSH Panel',
    category: 'hormones',
    description: 'Pituitary hormones that regulate testosterone production. Essential for diagnosing primary vs secondary hypogonadism.',
    price: 69,
    biomarkers: ['LH', 'FSH'],
    turnaround: '24-48 hours',
    fasting: false
  },
  {
    id: 'prolactin',
    name: 'Prolactin',
    category: 'hormones',
    description: 'Elevated prolactin can suppress testosterone and cause sexual dysfunction. Important marker for hormone optimization.',
    price: 49,
    biomarkers: ['Prolactin'],
    turnaround: '24-48 hours',
    fasting: false
  },
  {
    id: 'dhea-s',
    name: 'DHEA-S',
    category: 'hormones',
    description: 'Precursor hormone that converts to testosterone and estrogen. Declines with age and affects energy, mood, and body composition.',
    price: 49,
    biomarkers: ['DHEA-Sulfate'],
    turnaround: '24-48 hours',
    fasting: false
  },
  {
    id: 'progesterone',
    name: 'Progesterone',
    category: 'hormones',
    description: 'Important neurosteroid for sleep, mood, and as a precursor to other hormones. Often overlooked in male hormone panels.',
    price: 49,
    biomarkers: ['Progesterone'],
    turnaround: '24-48 hours',
    fasting: false
  },
  {
    id: 'cortisol-am',
    name: 'Cortisol (Morning)',
    category: 'hormones',
    description: 'Primary stress hormone. Chronically elevated cortisol impairs testosterone production, recovery, and body composition.',
    price: 49,
    biomarkers: ['Cortisol AM'],
    turnaround: '24-48 hours',
    fasting: false
  },
  {
    id: 'igf-1',
    name: 'HGH Qualification Test (IGF-1)',
    category: 'hormones',
    description: 'REQUIRED before HGH therapy. Measures IGF-1, the key biomarker for growth hormone activity and HGH qualification.',
    price: 79,
    biomarkers: ['IGF-1'],
    turnaround: '24-48 hours',
    fasting: false,
    popular: true
  },
  {
    id: 'dht',
    name: 'DHT (Dihydrotestosterone)',
    category: 'hormones',
    description: 'Potent androgen converted from testosterone. Affects hair, prostate, and masculinization. Important for 5-alpha reductase assessment.',
    price: 89,
    biomarkers: ['DHT'],
    turnaround: '3-5 days',
    fasting: false
  },

  // Thyroid Tests
  {
    id: 'tsh',
    name: 'TSH',
    category: 'thyroid',
    description: 'Primary screening marker for thyroid function. Affects metabolism, energy, body composition, and cognitive function.',
    price: 39,
    biomarkers: ['TSH'],
    turnaround: '24-48 hours',
    fasting: false
  },
  {
    id: 'thyroid-basic',
    name: 'Thyroid Basic Panel',
    category: 'thyroid',
    description: 'TSH plus Free T4 for basic thyroid assessment. Good starting point for evaluating thyroid health.',
    price: 59,
    biomarkers: ['TSH', 'Free T4'],
    turnaround: '24-48 hours',
    fasting: false
  },
  {
    id: 'thyroid-complete',
    name: 'Thyroid Complete Panel',
    category: 'thyroid',
    description: 'Comprehensive thyroid assessment including TSH, Free T3, Free T4, and thyroid antibodies for autoimmune screening.',
    price: 129,
    biomarkers: ['TSH', 'Free T3', 'Free T4', 'TPO Antibodies', 'Thyroglobulin Ab'],
    turnaround: '24-48 hours',
    fasting: false,
    popular: true
  },
  {
    id: 'free-t3',
    name: 'Free T3',
    category: 'thyroid',
    description: 'Active thyroid hormone at the cellular level. Low T3 can cause fatigue, weight gain, and poor performance despite normal TSH.',
    price: 49,
    biomarkers: ['Free T3'],
    turnaround: '24-48 hours',
    fasting: false
  },
  {
    id: 'free-t4',
    name: 'Free T4',
    category: 'thyroid',
    description: 'Storage form of thyroid hormone. Converted to active T3 in tissues. Important for full thyroid picture.',
    price: 49,
    biomarkers: ['Free T4'],
    turnaround: '24-48 hours',
    fasting: false
  },
  {
    id: 'reverse-t3',
    name: 'Reverse T3',
    category: 'thyroid',
    description: 'Inactive thyroid metabolite. Elevated rT3 can indicate stress, illness, or conversion issues despite normal TSH.',
    price: 69,
    biomarkers: ['Reverse T3'],
    turnaround: '3-5 days',
    fasting: false
  },
  {
    id: 'thyroid-antibodies',
    name: 'Thyroid Antibodies',
    category: 'thyroid',
    description: 'Tests for Hashimoto\'s and other autoimmune thyroid conditions. Important if you have family history or symptoms.',
    price: 79,
    biomarkers: ['TPO Antibodies', 'Thyroglobulin Ab'],
    turnaround: '24-48 hours',
    fasting: false
  },

  // Metabolic Tests
  {
    id: 'cmp',
    name: 'Comprehensive Metabolic Panel',
    category: 'metabolic',
    description: 'Standard 14-marker panel covering blood sugar, kidney function, electrolytes, and liver enzymes. Essential baseline.',
    price: 39,
    biomarkers: ['Glucose', 'BUN', 'Creatinine', 'Sodium', 'Potassium', 'Chloride', 'CO2', 'Calcium', 'Protein', 'Albumin', 'Bilirubin', 'Alk Phos', 'AST', 'ALT'],
    turnaround: '24-48 hours',
    fasting: true
  },
  {
    id: 'lipid-panel',
    name: 'Lipid Panel',
    category: 'metabolic',
    description: 'Complete cholesterol assessment including total cholesterol, LDL, HDL, and triglycerides. Important for cardiovascular health.',
    price: 39,
    biomarkers: ['Total Cholesterol', 'LDL', 'HDL', 'Triglycerides', 'VLDL'],
    turnaround: '24-48 hours',
    fasting: true,
    popular: true
  },
  {
    id: 'lipid-advanced',
    name: 'Advanced Lipid Panel (NMR)',
    category: 'metabolic',
    description: 'Advanced particle testing including LDL-P, small dense LDL, and LP(a). Superior cardiovascular risk assessment.',
    price: 99,
    biomarkers: ['LDL-P', 'Small Dense LDL', 'LP(a)', 'ApoB', 'HDL-P'],
    turnaround: '3-5 days',
    fasting: true
  },
  {
    id: 'hba1c',
    name: 'HbA1c',
    category: 'metabolic',
    description: '3-month average blood sugar marker. Essential for detecting insulin resistance and diabetes risk.',
    price: 39,
    biomarkers: ['HbA1c'],
    turnaround: '24-48 hours',
    fasting: false
  },
  {
    id: 'fasting-insulin',
    name: 'Fasting Insulin',
    category: 'metabolic',
    description: 'Early marker of insulin resistance before blood sugar changes. Important for metabolic health optimization.',
    price: 49,
    biomarkers: ['Insulin'],
    turnaround: '24-48 hours',
    fasting: true
  },
  {
    id: 'glucose-insulin',
    name: 'Glucose & Insulin Panel',
    category: 'metabolic',
    description: 'Fasting glucose and insulin with HOMA-IR calculation for insulin resistance assessment.',
    price: 69,
    biomarkers: ['Glucose', 'Insulin', 'HOMA-IR'],
    turnaround: '24-48 hours',
    fasting: true
  },
  {
    id: 'liver-panel',
    name: 'Liver Function Panel',
    category: 'metabolic',
    description: 'Comprehensive liver assessment. Important for anyone using oral medications, supplements, or alcohol.',
    price: 49,
    biomarkers: ['AST', 'ALT', 'GGT', 'Bilirubin', 'Alk Phos', 'Albumin'],
    turnaround: '24-48 hours',
    fasting: false
  },
  {
    id: 'kidney-panel',
    name: 'Kidney Function Panel',
    category: 'metabolic',
    description: 'Assess kidney health with creatinine, BUN, eGFR, and urinalysis. Important for high protein diets and creatine users.',
    price: 49,
    biomarkers: ['Creatinine', 'BUN', 'eGFR', 'BUN/Creatinine Ratio'],
    turnaround: '24-48 hours',
    fasting: false
  },
  {
    id: 'uric-acid',
    name: 'Uric Acid',
    category: 'metabolic',
    description: 'Elevated levels associated with gout, kidney stones, and cardiovascular risk. Affected by diet and fructose intake.',
    price: 29,
    biomarkers: ['Uric Acid'],
    turnaround: '24-48 hours',
    fasting: false
  },
  {
    id: 'homocysteine',
    name: 'Homocysteine',
    category: 'metabolic',
    description: 'Cardiovascular risk marker affected by B-vitamin status. Elevated levels associated with heart disease and cognitive decline.',
    price: 59,
    biomarkers: ['Homocysteine'],
    turnaround: '24-48 hours',
    fasting: false
  },
  {
    id: 'crp-hs',
    name: 'hs-CRP (High Sensitivity)',
    category: 'metabolic',
    description: 'Systemic inflammation marker. Elevated hs-CRP associated with cardiovascular disease and chronic inflammation.',
    price: 49,
    biomarkers: ['hs-CRP'],
    turnaround: '24-48 hours',
    fasting: false
  },
  {
    id: 'ferritin',
    name: 'Ferritin',
    category: 'metabolic',
    description: 'Iron storage protein. Low ferritin causes fatigue even with normal hemoglobin. Important for energy and performance.',
    price: 39,
    biomarkers: ['Ferritin'],
    turnaround: '24-48 hours',
    fasting: false
  },
  {
    id: 'iron-panel',
    name: 'Iron Panel Complete',
    category: 'metabolic',
    description: 'Comprehensive iron assessment including ferritin, serum iron, TIBC, and transferrin saturation.',
    price: 69,
    biomarkers: ['Ferritin', 'Iron', 'TIBC', 'Transferrin Sat'],
    turnaround: '24-48 hours',
    fasting: false
  },
  {
    id: 'vitamin-d',
    name: 'Vitamin D, 25-Hydroxy',
    category: 'metabolic',
    description: 'Essential for testosterone production, immune function, bone health, and mood. Most people are deficient.',
    price: 59,
    biomarkers: ['Vitamin D'],
    turnaround: '24-48 hours',
    fasting: false,
    popular: true
  },
  {
    id: 'vitamin-b12',
    name: 'Vitamin B12',
    category: 'metabolic',
    description: 'Essential for energy, nerve function, and red blood cell production. Deficiency causes fatigue and cognitive issues.',
    price: 39,
    biomarkers: ['B12'],
    turnaround: '24-48 hours',
    fasting: false
  },
  {
    id: 'folate',
    name: 'Folate (Folic Acid)',
    category: 'metabolic',
    description: 'B-vitamin important for DNA synthesis, methylation, and homocysteine metabolism.',
    price: 39,
    biomarkers: ['Folate'],
    turnaround: '24-48 hours',
    fasting: false
  },
  {
    id: 'magnesium-rbc',
    name: 'Magnesium (RBC)',
    category: 'metabolic',
    description: 'More accurate than serum magnesium. Essential for 300+ enzymatic reactions including testosterone production.',
    price: 49,
    biomarkers: ['Magnesium RBC'],
    turnaround: '24-48 hours',
    fasting: false
  },
  {
    id: 'zinc',
    name: 'Zinc',
    category: 'metabolic',
    description: 'Critical mineral for testosterone synthesis, immune function, and protein synthesis. Often depleted in athletes.',
    price: 49,
    biomarkers: ['Zinc'],
    turnaround: '24-48 hours',
    fasting: false
  },
  {
    id: 'copper-zinc',
    name: 'Copper & Zinc Ratio',
    category: 'metabolic',
    description: 'Copper/zinc balance affects hormone function, inflammation, and immune health. Important ratio to monitor.',
    price: 69,
    biomarkers: ['Copper', 'Zinc', 'Cu/Zn Ratio'],
    turnaround: '24-48 hours',
    fasting: false
  },

  // Blood Health
  {
    id: 'cbc',
    name: 'Complete Blood Count (CBC)',
    category: 'metabolic',
    description: 'Standard blood cell analysis including RBC, WBC, hemoglobin, hematocrit, and platelets. Essential baseline.',
    price: 29,
    biomarkers: ['WBC', 'RBC', 'Hemoglobin', 'Hematocrit', 'Platelets', 'MCV', 'MCH', 'MCHC'],
    turnaround: '24-48 hours',
    fasting: false
  },
  {
    id: 'cbc-diff',
    name: 'CBC with Differential',
    category: 'metabolic',
    description: 'Complete blood count plus white blood cell differential for immune function assessment.',
    price: 39,
    biomarkers: ['WBC', 'RBC', 'Hemoglobin', 'Hematocrit', 'Platelets', 'Neutrophils', 'Lymphocytes', 'Monocytes', 'Eosinophils', 'Basophils'],
    turnaround: '24-48 hours',
    fasting: false
  },
  {
    id: 'psa',
    name: 'PSA (Prostate Specific Antigen)',
    category: 'metabolic',
    description: 'Prostate health marker. Baseline recommended for men over 40 and those on testosterone therapy.',
    price: 49,
    biomarkers: ['PSA'],
    turnaround: '24-48 hours',
    fasting: false
  },

  // Complete Panels
  {
    id: 'male-hormone-basic',
    name: 'TRT Screening Panel',
    category: 'panels',
    description: 'REQUIRED before starting TRT. Essential screening: Total T, Free T, Estradiol, and SHBG for therapy qualification.',
    price: 149,
    biomarkers: ['Total T', 'Free T', 'Estradiol', 'SHBG'],
    turnaround: '24-48 hours',
    fasting: false,
    popular: true
  },
  {
    id: 'male-hormone-complete',
    name: 'TRT Qualification Panel',
    category: 'panels',
    description: 'REQUIRED before starting TRT. Complete qualification assessment with testosterone, estradiol, LH, FSH, prolactin, and thyroid.',
    price: 249,
    biomarkers: ['Total T', 'Free T', 'Estradiol', 'SHBG', 'LH', 'FSH', 'Prolactin', 'TSH', 'Free T4'],
    turnaround: '24-48 hours',
    fasting: false,
    popular: true
  },
  {
    id: 'performance-baseline',
    name: 'TRT/HGH Pre-Therapy Panel',
    category: 'panels',
    description: 'REQUIRED before TRT or HGH therapy. Complete pre-therapy screening: hormones, thyroid, metabolic panel, lipids, and key vitamins.',
    price: 299,
    biomarkers: ['Total T', 'Free T', 'Estradiol', 'TSH', 'Free T3', 'CMP', 'Lipid Panel', 'CBC', 'Vitamin D', 'Ferritin'],
    turnaround: '24-48 hours',
    fasting: true,
    popular: true
  },
  {
    id: 'complete-performance',
    name: 'Full Injection Therapy Panel',
    category: 'panels',
    description: 'REQUIRED before TRT or HGH therapy. Our most comprehensive qualification panel with 15 key biomarkers for injection therapy approval.',
    price: 179,
    biomarkers: ['Total T', 'Free T', 'Estradiol', 'SHBG', 'LH', 'FSH', 'Prolactin', 'TSH', 'Free T3', 'Free T4', 'CMP', 'Lipid Panel', 'CBC', 'Vitamin D', 'hs-CRP'],
    turnaround: '24-48 hours',
    fasting: true,
    popular: true,
    featured: true
  },
  {
    id: 'trt-monitoring',
    name: 'TRT Monitoring Panel',
    category: 'panels',
    description: 'Designed for men on testosterone therapy. Includes testosterone, estradiol, hematocrit, PSA, and liver function.',
    price: 199,
    biomarkers: ['Total T', 'Free T', 'Estradiol', 'Hematocrit', 'Hemoglobin', 'PSA', 'AST', 'ALT', 'Lipid Panel'],
    turnaround: '24-48 hours',
    fasting: true
  },
  {
    id: 'athlete-advanced',
    name: 'Athlete Advanced Panel',
    category: 'panels',
    description: 'Advanced panel for competitive athletes: hormones, inflammation markers, iron panel, and recovery biomarkers.',
    price: 349,
    biomarkers: ['Total T', 'Free T', 'Cortisol', 'IGF-1', 'TSH', 'Free T3', 'Iron Panel', 'Ferritin', 'hs-CRP', 'Vitamin D', 'Magnesium RBC', 'Zinc'],
    turnaround: '24-48 hours',
    fasting: true
  },
  {
    id: 'longevity-panel',
    name: 'Longevity Panel',
    category: 'panels',
    description: 'Focus on healthspan markers: insulin sensitivity, inflammation, cardiovascular, and metabolic health.',
    price: 279,
    biomarkers: ['HbA1c', 'Fasting Insulin', 'HOMA-IR', 'hs-CRP', 'Homocysteine', 'Advanced Lipid', 'Vitamin D', 'TSH', 'Total T'],
    turnaround: '3-5 days',
    fasting: true
  },
  {
    id: 'weight-loss',
    name: 'Weight Loss Panel',
    category: 'panels',
    description: 'Key markers affecting metabolism and body composition: thyroid, hormones, insulin, and inflammation.',
    price: 199,
    biomarkers: ['TSH', 'Free T3', 'Free T4', 'Total T', 'Estradiol', 'Fasting Insulin', 'HbA1c', 'hs-CRP', 'Cortisol'],
    turnaround: '24-48 hours',
    fasting: true
  },
  {
    id: 'energy-fatigue',
    name: 'Energy & Fatigue Panel',
    category: 'panels',
    description: 'Comprehensive fatigue workup: thyroid, hormones, iron, B12, and adrenal markers.',
    price: 229,
    biomarkers: ['TSH', 'Free T3', 'Free T4', 'Total T', 'Free T', 'Cortisol', 'Iron Panel', 'B12', 'Folate', 'Vitamin D', 'CBC'],
    turnaround: '24-48 hours',
    fasting: false
  },
  {
    id: 'stress-recovery',
    name: 'Stress & Recovery Panel',
    category: 'panels',
    description: 'Assess stress impact on your body: cortisol, DHEA, testosterone, thyroid, and inflammation.',
    price: 199,
    biomarkers: ['Cortisol', 'DHEA-S', 'Total T', 'TSH', 'Free T3', 'hs-CRP', 'Magnesium RBC'],
    turnaround: '24-48 hours',
    fasting: false
  },
  {
    id: 'sleep-optimization',
    name: 'Sleep Optimization Panel',
    category: 'panels',
    description: 'Markers affecting sleep quality: hormones, thyroid, iron, and magnesium.',
    price: 179,
    biomarkers: ['Total T', 'Cortisol', 'TSH', 'Ferritin', 'Iron', 'B12', 'Magnesium RBC', 'Vitamin D'],
    turnaround: '24-48 hours',
    fasting: false
  },
  {
    id: 'heart-health',
    name: 'Heart Health Panel',
    category: 'panels',
    description: 'Comprehensive cardiovascular risk assessment with advanced lipids and inflammation markers.',
    price: 199,
    biomarkers: ['Advanced Lipid', 'hs-CRP', 'Homocysteine', 'HbA1c', 'Fasting Insulin', 'LP(a)'],
    turnaround: '3-5 days',
    fasting: true
  },
  {
    id: 'immunity-panel',
    name: 'Immunity Panel',
    category: 'panels',
    description: 'Assess immune function: CBC with differential, vitamin D, zinc, and inflammation markers.',
    price: 149,
    biomarkers: ['CBC with Diff', 'Vitamin D', 'Zinc', 'hs-CRP', 'Ferritin'],
    turnaround: '24-48 hours',
    fasting: false
  }
];

// =============================================================================
// Restricted States (where direct-to-consumer testing is not available)
// =============================================================================

const restrictedStates = ['NY', 'NJ', 'HI', 'RI'];

const stateNames = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
  'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
  'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
  'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
  'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
  'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
  'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
  'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
  'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
  'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
  'WI': 'Wisconsin', 'WY': 'Wyoming', 'DC': 'District of Columbia'
};

// =============================================================================
// Application State
// =============================================================================

// =============================================================================
// Cart Data Validation
// =============================================================================

function validateCartItem(item) {
  if (!item || typeof item !== 'object') return null;

  // Validate required fields
  if (typeof item.id !== 'string' || !item.id.match(/^[a-z0-9-]+$/)) return null;
  if (typeof item.name !== 'string' || item.name.length > 200) return null;
  if (typeof item.price !== 'number' || item.price < 0 || item.price > 10000) return null;
  if (item.quantity !== undefined && (typeof item.quantity !== 'number' || item.quantity < 1 || item.quantity > 100)) return null;

  // Return sanitized item
  return {
    id: item.id,
    name: item.name.substring(0, 200),
    price: Math.round(item.price * 100) / 100,
    quantity: item.quantity || 1
  };
}

function validateCartData(data) {
  if (!Array.isArray(data)) return [];
  return data.map(validateCartItem).filter(item => item !== null).slice(0, 50);
}

// =============================================================================
// Application State
// =============================================================================

const state = {
  cart: validateCartData(safeJSONParse(localStorage.getItem('wg_cart'), [])),
  user: null, // User data should not be stored in localStorage - use sessionStorage or server-side sessions
  currentCategory: 'all',
  testsDisplayed: 6,
  chatOpen: false,
  mobileMenuOpen: false
};

// =============================================================================
// DOM Elements
// =============================================================================

const elements = {
  testGrid: document.getElementById('test-grid'),
  cartCount: document.getElementById('cart-count'),
  cartToggle: document.getElementById('cart-toggle'),
  mobileToggle: document.getElementById('mobile-toggle'),
  mobileNav: document.getElementById('mobile-nav'),
  chatbotToggle: document.getElementById('chatbot-toggle'),
  chatbotWindow: document.getElementById('chatbot-window'),
  chatbotClose: document.getElementById('chatbot-close'),
  chatbotMessages: document.getElementById('chatbot-messages'),
  chatbotInput: document.getElementById('chatbot-input'),
  chatbotSend: document.getElementById('chatbot-send'),
  chatbotSuggestions: document.getElementById('chatbot-suggestions'),
  loadMore: document.getElementById('load-more'),
  openChatbot: document.getElementById('open-chatbot'),
  ctaChatbot: document.getElementById('cta-chatbot')
};

// =============================================================================
// Cart Functions
// =============================================================================

function addToCart(testId) {
  const test = testCatalog.find(t => t.id === testId);
  if (!test) return;

  const existingItem = state.cart.find(item => item.id === testId);
  if (existingItem) {
    showNotification('This test is already in your cart', 'info');
    return;
  }

  state.cart.push({
    id: test.id,
    name: test.name,
    price: test.price,
    quantity: 1
  });

  saveCart();
  updateCartUI();
  showNotification(`${test.name} added to cart`, 'success');
}

function removeFromCart(testId) {
  state.cart = state.cart.filter(item => item.id !== testId);
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('wg_cart', JSON.stringify(state.cart));
}

function getCartTotal() {
  return state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function updateCartUI() {
  const count = state.cart.length;
  if (elements.cartCount) {
    elements.cartCount.textContent = count;
    elements.cartCount.style.display = count > 0 ? 'flex' : 'none';
  }
}

// =============================================================================
// Test Rendering Functions
// =============================================================================

function createTestCard(test) {
  const article = document.createElement('article');
  article.className = 'test-card';
  article.setAttribute('role', 'listitem');
  article.dataset.testId = test.id;

  // Header
  const header = document.createElement('div');
  header.className = 'test-card__header';

  const category = document.createElement('span');
  category.className = 'test-card__category';
  category.textContent = getCategoryLabel(test.category);

  const title = document.createElement('h3');
  title.className = 'test-card__title';
  title.textContent = test.name;

  header.appendChild(category);
  header.appendChild(title);

  // Body
  const body = document.createElement('div');
  body.className = 'test-card__body';

  const description = document.createElement('p');
  description.className = 'test-card__description';
  description.textContent = test.description;

  const biomarkers = document.createElement('div');
  biomarkers.className = 'test-card__biomarkers';
  test.biomarkers.slice(0, 4).forEach(b => {
    const span = document.createElement('span');
    span.className = 'test-card__biomarker';
    span.textContent = b;
    biomarkers.appendChild(span);
  });
  if (test.biomarkers.length > 4) {
    const more = document.createElement('span');
    more.className = 'test-card__biomarker';
    more.textContent = `+${test.biomarkers.length - 4} more`;
    biomarkers.appendChild(more);
  }

  const info = document.createElement('div');
  info.style.cssText = 'display: flex; gap: var(--space-4); font-size: var(--text-xs); color: var(--text-tertiary);';
  const turnaround = document.createElement('span');
  turnaround.textContent = test.turnaround;
  const fasting = document.createElement('span');
  fasting.textContent = test.fasting ? 'Fasting required' : 'No fasting';
  info.appendChild(turnaround);
  info.appendChild(fasting);

  body.appendChild(description);
  body.appendChild(biomarkers);
  body.appendChild(info);

  // Footer
  const footer = document.createElement('div');
  footer.className = 'test-card__footer';

  const priceWrapper = document.createElement('div');
  const price = document.createElement('span');
  price.className = 'test-card__price';
  price.textContent = `$${test.price}`;
  const priceLabel = document.createElement('span');
  priceLabel.className = 'test-card__price-label';
  priceLabel.textContent = ' per test';
  priceWrapper.appendChild(price);
  priceWrapper.appendChild(priceLabel);

  const button = document.createElement('button');
  button.className = 'btn btn--primary btn--sm';
  button.setAttribute('aria-label', `Add ${test.name} to cart`);
  button.dataset.action = 'addToCart';
  button.dataset.testId = test.id;
  button.textContent = 'Add to Cart';

  footer.appendChild(priceWrapper);
  footer.appendChild(button);

  article.appendChild(header);
  article.appendChild(body);
  article.appendChild(footer);

  return article;
}

function renderTests(category = 'all', limit = 6) {
  if (!elements.testGrid) return;

  let filteredTests = category === 'all'
    ? testCatalog
    : testCatalog.filter(test => test.category === category);

  const testsToShow = filteredTests.slice(0, limit);

  // Clear existing content safely
  elements.testGrid.textContent = '';

  // Use DocumentFragment for better performance
  const fragment = document.createDocumentFragment();
  testsToShow.forEach(test => {
    fragment.appendChild(createTestCard(test));
  });
  elements.testGrid.appendChild(fragment);

  // Update load more button visibility
  if (elements.loadMore) {
    elements.loadMore.style.display = limit >= filteredTests.length ? 'none' : 'inline-flex';
  }
}

function getCategoryLabel(category) {
  const labels = {
    'hormones': 'Performance Hormone',
    'thyroid': 'Thyroid',
    'metabolic': 'Metabolic',
    'panels': 'Complete Panel'
  };
  return labels[category] || category;
}

// =============================================================================
// Category Filter Functions
// =============================================================================

function initCategoryFilters() {
  const filters = document.querySelectorAll('.test-filter');
  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      // Update active state
      filters.forEach(f => {
        f.classList.remove('active');
        f.setAttribute('aria-selected', 'false');
      });
      filter.classList.add('active');
      filter.setAttribute('aria-selected', 'true');

      // Update state and render
      state.currentCategory = filter.dataset.category;
      state.testsDisplayed = 6;
      renderTests(state.currentCategory, state.testsDisplayed);
    });
  });
}

// =============================================================================
// AI Chatbot Functions
// =============================================================================

const chatResponses = {
  testosterone: {
    keywords: ['testosterone', 'test', 't levels', 'low t', 'trt', 'hypogonadism'],
    response: `For testosterone optimization, I'd recommend starting with our **Testosterone Complete Panel** ($129). It includes Total T, Free T, SHBG, and Albumin - giving you the full picture of your testosterone status.

If you're already on TRT, our **TRT Monitoring Panel** ($199) adds estradiol, hematocrit, PSA, and liver function.

Would you like me to add either of these to your cart?`,
    suggestions: ['Add Testosterone Complete', 'Add TRT Monitoring', 'Tell me more about Free T']
  },
  fatigue: {
    keywords: ['fatigue', 'tired', 'energy', 'exhausted', 'low energy'],
    response: `Fatigue can have many causes. Our **Energy & Fatigue Panel** ($229) is designed specifically for this - it covers:

- Thyroid (TSH, Free T3, Free T4)
- Hormones (Testosterone)
- Iron panel & B12
- Cortisol (adrenal function)
- Vitamin D

This comprehensive approach helps identify the root cause. Would you like to add it to your cart?`,
    suggestions: ['Add Energy Panel', 'Check thyroid only', 'What about iron?']
  },
  baseline: {
    keywords: ['baseline', 'complete', 'full', 'comprehensive', 'everything', 'all'],
    response: `For a complete baseline, I recommend our **Complete Performance Panel** ($179) - it's our most popular option and includes 15 key biomarkers:

- Full testosterone panel (Total, Free, SHBG)
- Estradiol
- Thyroid (TSH, Free T3, Free T4)
- Metabolic panel
- Lipids & inflammation (hs-CRP)
- Vitamin D

It's the gold standard for performance optimization. Ready to add it?`,
    suggestions: ['Add Complete Panel', 'What tests are included?', 'Something more basic']
  },
  estrogen: {
    keywords: ['estrogen', 'estradiol', 'e2', 'aromatase', 'high estrogen'],
    response: `For estrogen monitoring, I recommend the **Estradiol Ultrasensitive** test ($79) using LC/MS methodology - it's the most accurate method for men.

If you're on TRT, estrogen management is crucial. Optimal E2 levels support mood, libido, joint health, and cardiovascular protection.

Should I add this to your cart?`,
    suggestions: ['Add Estradiol test', 'What\'s optimal E2?', 'Full hormone panel instead']
  },
  thyroid: {
    keywords: ['thyroid', 'metabolism', 'tsh', 't3', 't4', 'hashimotos'],
    response: `For comprehensive thyroid assessment, our **Thyroid Complete Panel** ($129) includes:

- TSH (pituitary signal)
- Free T3 (active hormone)
- Free T4 (storage hormone)
- Thyroid antibodies (autoimmune screening)

This covers all bases including Hashimoto's detection. Want me to add it?`,
    suggestions: ['Add Thyroid Panel', 'Basic TSH only', 'Include hormones too']
  },
  weight: {
    keywords: ['weight', 'lose weight', 'fat loss', 'body composition', 'metabolism'],
    response: `For weight loss optimization, our **Weight Loss Panel** ($199) targets key metabolic markers:

- Thyroid function (metabolism)
- Testosterone & estradiol
- Fasting insulin & HbA1c (blood sugar)
- hs-CRP (inflammation)
- Cortisol (stress hormone)

These markers directly affect your ability to lose fat. Should I add it to your cart?`,
    suggestions: ['Add Weight Loss Panel', 'Focus on insulin', 'Thyroid only']
  },
  sleep: {
    keywords: ['sleep', 'insomnia', 'rest', 'recovery'],
    response: `Poor sleep often has underlying biochemical causes. Our **Sleep Optimization Panel** ($179) checks:

- Testosterone & cortisol
- Thyroid function
- Iron & ferritin
- B12 & magnesium
- Vitamin D

All of these can significantly impact sleep quality. Want to add it?`,
    suggestions: ['Add Sleep Panel', 'Check magnesium', 'Full baseline instead']
  },
  default: {
    response: `I can help you find the right tests for your goals. Here are some common starting points:

**Performance Baseline** ($299) - Complete overview for athletes
**Male Hormone Panel** ($149) - Essential testosterone assessment
**Complete Performance** ($179) - Our most comprehensive panel

What specific aspect of your health are you looking to optimize?`,
    suggestions: ['Testosterone optimization', 'Fatigue & energy', 'Full baseline']
  }
};

function getChatResponse(message) {
  const lowerMessage = message.toLowerCase();

  for (const [key, data] of Object.entries(chatResponses)) {
    if (key === 'default') continue;
    if (data.keywords && data.keywords.some(kw => lowerMessage.includes(kw))) {
      return data;
    }
  }

  return chatResponses.default;
}

function addChatMessage(content, isUser = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `chatbot__message chatbot__message--${isUser ? 'user' : 'bot'}`;

  if (isUser) {
    // User messages: always use textContent for safety
    messageDiv.textContent = content;
  } else {
    // Bot messages: may contain markdown, sanitize and convert
    // Simple markdown to text conversion (bold only for safety)
    const sanitized = escapeHtml(content)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
    messageDiv.innerHTML = sanitized;
  }

  elements.chatbotMessages.appendChild(messageDiv);
  elements.chatbotMessages.scrollTop = elements.chatbotMessages.scrollHeight;
}

function updateChatSuggestions(suggestions) {
  if (!elements.chatbotSuggestions) return;

  if (suggestions && suggestions.length > 0) {
    // Clear existing content safely
    elements.chatbotSuggestions.textContent = '';

    suggestions.forEach(s => {
      const button = document.createElement('button');
      button.className = 'chatbot__suggestion';
      button.dataset.message = s;
      button.textContent = s;
      elements.chatbotSuggestions.appendChild(button);
    });
    elements.chatbotSuggestions.style.display = 'flex';
  } else {
    elements.chatbotSuggestions.style.display = 'none';
  }
}

function handleChatMessage(message) {
  if (!message.trim()) return;

  // Add user message
  addChatMessage(message, true);

  // Clear input
  if (elements.chatbotInput) {
    elements.chatbotInput.value = '';
  }

  // Get response
  const response = getChatResponse(message);

  // Simulate typing delay
  setTimeout(() => {
    addChatMessage(response.response);
    updateChatSuggestions(response.suggestions);
  }, 500);
}

function toggleChatbot(open) {
  state.chatOpen = open !== undefined ? open : !state.chatOpen;

  if (elements.chatbotWindow) {
    elements.chatbotWindow.classList.toggle('open', state.chatOpen);
    elements.chatbotWindow.setAttribute('aria-hidden', !state.chatOpen);
  }

  if (elements.chatbotToggle) {
    elements.chatbotToggle.setAttribute('aria-expanded', state.chatOpen);
  }
}

// =============================================================================
// Mobile Menu Functions
// =============================================================================

function toggleMobileMenu(open) {
  state.mobileMenuOpen = open !== undefined ? open : !state.mobileMenuOpen;

  if (elements.mobileNav) {
    elements.mobileNav.classList.toggle('open', state.mobileMenuOpen);
    elements.mobileNav.setAttribute('aria-hidden', !state.mobileMenuOpen);
  }

  if (elements.mobileToggle) {
    elements.mobileToggle.setAttribute('aria-expanded', state.mobileMenuOpen);
  }
}

// =============================================================================
// Notification System
// =============================================================================

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `alert alert--${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    z-index: 9999;
    max-width: 300px;
    animation: slideIn 0.3s ease;
  `;

  // Create SVG icon
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'alert__icon');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');

  if (type === 'success') {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M20 6L9 17l-5-5');
    svg.appendChild(path);
  } else {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '12');
    circle.setAttribute('cy', '12');
    circle.setAttribute('r', '10');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M12 16v-4M12 8h.01');
    svg.appendChild(circle);
    svg.appendChild(path);
  }

  const span = document.createElement('span');
  span.textContent = message; // Safe: textContent

  notification.appendChild(svg);
  notification.appendChild(span);

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// =============================================================================
// Navbar Scroll Effect
// =============================================================================

function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

function initFloatingButtons() {
  const backBtn = document.getElementById('backToTop');
  const helpBtn = document.getElementById('helpButton');

  if (!backBtn && !helpBtn) return;

  window.addEventListener('scroll', () => {
    const visible = window.scrollY > 500;
    if (backBtn) {
      backBtn.style.opacity = visible ? '1' : '0';
      backBtn.style.visibility = visible ? 'visible' : 'hidden';
    }
    if (helpBtn) {
      helpBtn.style.opacity = visible ? '1' : '0';
      helpBtn.style.visibility = visible ? 'visible' : 'hidden';
    }
  });
}

// =============================================================================
// State Restriction Check
// =============================================================================

function checkStateRestriction(state) {
  return restrictedStates.includes(state.toUpperCase());
}

// =============================================================================
// Event Listeners
// =============================================================================

function initEventListeners() {
  // Mobile menu toggle
  if (elements.mobileToggle) {
    elements.mobileToggle.addEventListener('click', () => toggleMobileMenu());
  }

  // Chatbot toggle
  if (elements.chatbotToggle) {
    elements.chatbotToggle.addEventListener('click', () => toggleChatbot());
  }

  // Chatbot close
  if (elements.chatbotClose) {
    elements.chatbotClose.addEventListener('click', () => toggleChatbot(false));
  }

  // Chatbot send
  if (elements.chatbotSend) {
    elements.chatbotSend.addEventListener('click', () => {
      handleChatMessage(elements.chatbotInput.value);
    });
  }

  // Chatbot input enter key
  if (elements.chatbotInput) {
    elements.chatbotInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleChatMessage(elements.chatbotInput.value);
      }
    });
  }

  // Chatbot suggestions
  if (elements.chatbotSuggestions) {
    elements.chatbotSuggestions.addEventListener('click', (e) => {
      if (e.target.classList.contains('chatbot__suggestion')) {
        handleChatMessage(e.target.dataset.message);
      }
    });
  }

  // Open chatbot buttons
  if (elements.openChatbot) {
    elements.openChatbot.addEventListener('click', () => toggleChatbot(true));
  }
  if (elements.ctaChatbot) {
    elements.ctaChatbot.addEventListener('click', () => toggleChatbot(true));
  }

  // Load more tests
  if (elements.loadMore) {
    elements.loadMore.addEventListener('click', () => {
      state.testsDisplayed += 6;
      renderTests(state.currentCategory, state.testsDisplayed);
    });
  }

  // Cart toggle
  if (elements.cartToggle) {
    elements.cartToggle.addEventListener('click', () => {
      window.location.href = 'checkout.html';
    });
  }

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-nav__link').forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(false));
  });

  // Featured panel add to cart
  const featuredBtn = document.querySelector('[data-test-id="complete-panel"]');
  if (featuredBtn) {
    featuredBtn.addEventListener('click', () => addToCart('complete-performance'));
  }
}

// =============================================================================
// AI Chat - Gains Assistant Responses
// =============================================================================

const aiResponses = {
  // TRT & Testosterone specific
  trt: {
    message: "💉 Ready to start TRT? These tests are REQUIRED before starting testosterone therapy. Get your baseline now!",
    tests: ['testosterone-complete', 'estradiol', 'male-hormone-complete', 'lipid-panel']
  },
  testosterone: {
    message: "💪 Check your T levels! Low testosterone = low gains. These tests reveal if TRT could transform your physique:",
    tests: ['total-testosterone', 'free-testosterone', 'testosterone-complete', 'male-hormone-basic']
  },
  lowt: {
    message: "🔬 Symptoms of Low T: fatigue, low libido, can't build muscle? Get tested and see if you qualify for TRT:",
    tests: ['testosterone-complete', 'lh-fsh', 'prolactin', 'shbg']
  },

  // HGH specific
  hgh: {
    message: "🚀 HGH optimization starts with knowing your IGF-1 levels! These tests are essential before starting growth hormone therapy:",
    tests: ['igf-1', 'testosterone-complete', 'fasting-insulin', 'cmp']
  },
  growth: {
    message: "📈 Growth hormone is KEY for muscle, recovery, and anti-aging. Check your levels:",
    tests: ['igf-1', 'testosterone-complete', 'cmp', 'thyroid-complete']
  },
  igf: {
    message: "🧬 IGF-1 is the biomarker for growth hormone activity. Low IGF-1 = slower gains. Get tested:",
    tests: ['igf-1', 'testosterone-complete', 'fasting-insulin', 'cmp']
  },

  // Muscle & Fitness
  muscle: {
    message: "🏋️ Can't build muscle? Your hormones might be the problem. TRT + HGH optimization starts here:",
    tests: ['testosterone-complete', 'igf-1', 'estradiol', 'thyroid-complete']
  },
  gains: {
    message: "📈 No gains? 90% of hardgainers have suboptimal testosterone or IGF-1. Find out if you need TRT/HGH:",
    tests: ['testosterone-complete', 'igf-1', 'thyroid-complete', 'male-hormone-complete']
  },
  bodybuilding: {
    message: "🏆 Key tests for serious bodybuilders:",
    tests: ['testosterone-complete', 'estradiol', 'igf-1', 'lipid-panel']
  },
  performance: {
    message: "⚡ Athletic performance optimization tests:",
    tests: ['testosterone-complete', 'cbc', 'iron-panel', 'vitamin-d']
  },
  recovery: {
    message: "🔄 Tests for optimal recovery:",
    tests: ['cortisol-am', 'testosterone-complete', 'cbc', 'cmp']
  },

  // Energy & Fatigue
  tired: {
    message: "😴 Tests for low energy and tiredness:",
    tests: ['thyroid-complete', 'vitamin-b12', 'iron-panel', 'vitamin-d']
  },
  fatigue: {
    message: "⚡ Comprehensive fatigue panel to find the cause:",
    tests: ['thyroid-complete', 'cbc', 'cmp', 'testosterone-complete']
  },
  energy: {
    message: "🔋 Tests to evaluate your energy levels:",
    tests: ['thyroid-complete', 'vitamin-b12', 'iron-panel', 'testosterone-complete']
  },

  // Hormones general
  hormone: {
    message: "⚗️ Comprehensive hormone panels:",
    tests: ['male-hormone-complete', 'testosterone-complete', 'thyroid-complete', 'cortisol-am']
  },
  estrogen: {
    message: "🔬 Estrogen testing options for hormone balance:",
    tests: ['estradiol', 'estradiol-ultrasensitive', 'male-hormone-complete', 'shbg']
  },

  // Thyroid
  thyroid: {
    message: "🦋 Thyroid testing options:",
    tests: ['thyroid-complete', 'tsh', 'thyroid-basic', 'reverse-t3']
  },
  metabolism: {
    message: "🔥 Tests for metabolic health:",
    tests: ['thyroid-complete', 'hba1c', 'cmp', 'fasting-insulin']
  },

  // Weight
  weight: {
    message: "⚖️ Tests for weight management:",
    tests: ['thyroid-complete', 'testosterone-complete', 'hba1c', 'fasting-insulin']
  },

  // General wellness
  checkup: {
    message: "✅ Essential wellness panel:",
    tests: ['cmp', 'cbc', 'lipid-panel', 'thyroid-basic']
  },

  // Complete panels
  complete: {
    message: "🏆 Our most comprehensive panels for serious optimization:",
    tests: ['complete-performance', 'male-hormone-complete', 'athlete-advanced']
  },

  default: {
    message: "💉 Ready to get qualified for TRT or HGH? I'll help you pick the right screening panel. These are REQUIRED before starting injection therapy:",
    tests: ['male-hormone-complete', 'igf-1', 'complete-performance', 'performance-baseline']
  },
  offTopic: {
    message: "💉 I help warriors get qualified for TRT and HGH therapy! Ask me about TRT qualification, HGH screening, or which panels you need to start injection therapy!",
    tests: []
  }
};

// Priority keyword mappings for AI chat
const priorityKeywords = {
  'trt': 'trt', 'testosterone replacement': 'trt', 'on trt': 'trt', 'start trt': 'trt',
  'hgh': 'hgh', 'growth hormone': 'hgh', 'human growth': 'hgh', 'gh therapy': 'hgh',
  'igf': 'igf', 'igf-1': 'igf', 'igf1': 'igf',
  'low t': 'lowt', 'low testosterone': 'lowt',
  'build muscle': 'muscle', 'muscle building': 'muscle', 'bulking': 'muscle',
  'gains': 'gains', 'maximize gains': 'gains', 'making gains': 'gains', 'no gains': 'gains',
  'bodybuilding': 'bodybuilding', 'bodybuilder': 'bodybuilding',
  'lifting': 'muscle', 'gym': 'muscle', 'workout': 'performance',
  'recovery': 'recovery', 'overtraining': 'recovery',
  'estrogen': 'estrogen', 'e2': 'estrogen', 'estradiol': 'estrogen',
  'testosterone': 'testosterone', 'test levels': 'testosterone',
  'no energy': 'energy', 'low energy': 'energy', 'always tired': 'tired',
  'fatigue': 'fatigue', 'exhausted': 'fatigue',
  'thyroid': 'thyroid', 'metabolism': 'metabolism',
  'weight': 'weight', 'lose weight': 'weight',
  'checkup': 'checkup', 'baseline': 'checkup', 'full panel': 'complete',
  'injection': 'trt', 'injections': 'trt'
};

function handleAiKeypress(event) {
  if (event.key === 'Enter') {
    sendAiMessage();
  }
}

function createAiTestCard(test) {
  const card = document.createElement('div');
  card.className = 'ai-test-card';
  card.style.cssText = 'display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: rgba(0, 245, 255, 0.05); border: 1px solid rgba(0, 245, 255, 0.3); border-radius: 12px; margin-top: 0.5rem; transition: all 0.2s;';

  const emoji = document.createElement('span');
  emoji.style.fontSize = '1.25rem';
  emoji.textContent = '🧪';

  const info = document.createElement('div');
  info.style.flex = '1';
  const name = document.createElement('div');
  name.style.cssText = 'font-weight: 600; color: #fff; font-size: 0.85rem;';
  name.textContent = test.name;
  const priceText = document.createElement('div');
  priceText.style.cssText = 'color: #00f5ff; font-weight: 700; font-size: 0.9rem;';
  priceText.textContent = `$${test.price}`;
  info.appendChild(name);
  info.appendChild(priceText);

  const addBtn = document.createElement('button');
  addBtn.style.cssText = 'padding: 0.5rem 1rem; background: linear-gradient(135deg, #00f5ff 0%, #bf00ff 100%); border: none; border-radius: 50px; color: #000; font-weight: 700; font-size: 0.75rem; cursor: pointer; transition: all 0.2s; box-shadow: 0 0 10px rgba(0, 245, 255, 0.4);';
  addBtn.textContent = '+ Add';
  addBtn.dataset.action = 'addToCartFromAI';
  addBtn.dataset.testId = test.id;
  addBtn.onmouseover = () => { addBtn.style.transform = 'scale(1.05)'; addBtn.style.boxShadow = '0 0 20px rgba(0, 245, 255, 0.6)'; };
  addBtn.onmouseout = () => { addBtn.style.transform = 'scale(1)'; addBtn.style.boxShadow = '0 0 10px rgba(0, 245, 255, 0.4)'; };

  card.appendChild(emoji);
  card.appendChild(info);
  card.appendChild(addBtn);

  return card;
}

function createTypingIndicator() {
  const wrapper = document.createElement('div');
  wrapper.className = 'ai-message bot';
  wrapper.id = 'typingIndicator';

  const content = document.createElement('div');
  content.className = 'message-content';

  const indicator = document.createElement('div');
  indicator.className = 'typing-indicator';
  for (let i = 0; i < 3; i++) {
    indicator.appendChild(document.createElement('span'));
  }

  content.appendChild(indicator);
  wrapper.appendChild(content);
  return wrapper;
}

function sendAiMessage(presetMessage = null) {
  const input = document.getElementById('aiChatInput');
  const messagesContainer = document.getElementById('aiChatMessages');
  const message = presetMessage || (input ? input.value.trim() : '');

  if (!message || !messagesContainer) return;

  // Add user message using DOM methods
  const userMsg = document.createElement('div');
  userMsg.className = 'ai-message user';
  const userContent = document.createElement('div');
  userContent.className = 'message-content';
  const userP = document.createElement('p');
  userP.textContent = message; // Safe: textContent
  userContent.appendChild(userP);
  userMsg.appendChild(userContent);
  messagesContainer.appendChild(userMsg);

  // Clear input
  if (input) input.value = '';

  // Add typing indicator using DOM methods
  messagesContainer.appendChild(createTypingIndicator());
  // Scroll to bottom after user message
  requestAnimationFrame(() => {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  });

  // Get response after delay
  setTimeout(() => {
    document.getElementById('typingIndicator')?.remove();
    const response = getAiResponse(message);

    // Get recommended tests
    const recommendedTests = testCatalog.filter(test => response.tests.includes(test.id)).slice(0, 4);

    // Build AI response using DOM methods
    const aiMsg = document.createElement('div');
    aiMsg.className = 'ai-message bot';
    const aiContent = document.createElement('div');
    aiContent.className = 'message-content';

    const aiP = document.createElement('p');
    aiP.textContent = response.message;
    aiContent.appendChild(aiP);

    // Add test cards safely
    recommendedTests.forEach(test => {
      aiContent.appendChild(createAiTestCard(test));
    });

    aiMsg.appendChild(aiContent);
    messagesContainer.appendChild(aiMsg);
    // Scroll to bottom after DOM update
    requestAnimationFrame(() => {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      aiMsg.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
  }, 1200);
}

function getAiResponse(message) {
  const lowerMessage = message.toLowerCase();

  // Check priority keywords first
  for (const [phrase, category] of Object.entries(priorityKeywords)) {
    if (lowerMessage.includes(phrase) && aiResponses[category]) {
      return aiResponses[category];
    }
  }

  // Check direct category matches
  for (const [keyword, response] of Object.entries(aiResponses)) {
    if (keyword !== 'default' && keyword !== 'offTopic' && lowerMessage.includes(keyword)) {
      return response;
    }
  }

  // Health-related keywords
  const healthKeywords = ['test', 'blood', 'health', 'symptom', 'level', 'panel', 'lab', 'fitness', 'optimize', 'improve'];
  if (healthKeywords.some(kw => lowerMessage.includes(kw))) {
    return aiResponses.default;
  }

  return aiResponses.offTopic;
}

function addToCartFromAI(testId) {
  addToCart(testId);
  showToast('Added to cart!');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// =============================================================================
// Welcome Popup
// =============================================================================

function initWelcomePopup() {
  // Check if already shown this session or dismissed permanently
  if (sessionStorage.getItem('welcomeShown') || localStorage.getItem('welcomeDismissed')) {
    return;
  }

  // Show after 3 seconds
  setTimeout(() => {
    const overlay = document.getElementById('welcomeOverlay');
    const popup = document.getElementById('welcomePopup');
    if (overlay && popup) {
      overlay.classList.add('active');
      popup.classList.add('active');
      sessionStorage.setItem('welcomeShown', 'true');
    }
  }, 3000);
}

function closeWelcomePopup() {
  const overlay = document.getElementById('welcomeOverlay');
  const popup = document.getElementById('welcomePopup');
  const dontShow = document.getElementById('dontShowAgain');

  if (overlay) overlay.classList.remove('active');
  if (popup) popup.classList.remove('active');

  if (dontShow && dontShow.checked) {
    localStorage.setItem('welcomeDismissed', 'true');
  }
}

function copyWelcomeCode() {
  navigator.clipboard.writeText('TRTWARRIOR').then(() => {
    showToast('Code copied to clipboard!');
  });
}

// =============================================================================
// Exit Intent Popup
// =============================================================================

let exitIntentShown = false;

function initExitIntent() {
  if (sessionStorage.getItem('exitIntentShown')) return;

  document.addEventListener('mouseout', (e) => {
    if (e.clientY <= 0 && !exitIntentShown) {
      showExitPopup();
    }
  });
}

function showExitPopup() {
  if (exitIntentShown || sessionStorage.getItem('exitIntentShown')) return;
  exitIntentShown = true;
  sessionStorage.setItem('exitIntentShown', 'true');

  const overlay = document.getElementById('exitPopupOverlay');
  const popup = document.getElementById('exitPopup');

  if (overlay && popup) {
    overlay.classList.add('active');
    popup.classList.add('active');
  }
}

function closeExitPopup() {
  const overlay = document.getElementById('exitPopupOverlay');
  const popup = document.getElementById('exitPopup');

  if (overlay) overlay.classList.remove('active');
  if (popup) popup.classList.remove('active');
}

function submitExitEmail() {
  const input = document.getElementById('exitEmail');
  const email = input ? input.value.trim() : '';

  if (email && email.includes('@')) {
    showToast('Check your email for 25% OFF code!');
    closeExitPopup();
  } else if (input) {
    input.style.borderColor = '#ef4444';
  }
}


// =============================================================================
// Page Transitions
// =============================================================================

function initPageTransitions() {
  // Add click handlers to internal links
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.endsWith('.html') && !href.startsWith('http')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        navigateWithTransition(href);
      });
    }
  });
}

function navigateWithTransition(url) {
  const overlay = document.getElementById('pageTransition');
  if (overlay) {
    overlay.classList.add('active');
    setTimeout(() => {
      window.location.href = url;
    }, 600);
  } else {
    window.location.href = url;
  }
}

// =============================================================================
// Sticky Cart Bar
// =============================================================================

function initStickyCartBar() {
  const testsSection = document.getElementById('tests');
  const stickyBar = document.getElementById('stickyCartBar');

  if (!testsSection || !stickyBar) return;

  window.addEventListener('scroll', () => {
    const rect = testsSection.getBoundingClientRect();
    if (rect.bottom < 0 && state.cart.length > 0) {
      stickyBar.classList.add('active');
    } else {
      stickyBar.classList.remove('active');
    }
  });
}

function updateStickyCart() {
  const countEl = document.getElementById('stickyCartCount');
  const totalEl = document.getElementById('stickyCartTotal');

  if (countEl) countEl.textContent = state.cart.length;
  if (totalEl) totalEl.textContent = getCartTotal();
}

// =============================================================================
// Toast Notifications
// =============================================================================

function showToast(message) {
  const toast = document.getElementById('toast');
  const messageEl = document.getElementById('toastMessage');

  if (toast && messageEl) {
    messageEl.textContent = message;
    toast.classList.add('active');

    setTimeout(() => {
      toast.classList.remove('active');
    }, 3000);
  }
}

// =============================================================================
// Auth Modal
// =============================================================================

function openAuthModal(type = 'signin') {
  const overlay = document.getElementById('authOverlay');
  const modal = document.getElementById('authModal');

  if (overlay && modal) {
    overlay.classList.add('active');
    modal.classList.add('active');
    switchAuthForm(type);
  }
}

function closeAuthModal() {
  const overlay = document.getElementById('authOverlay');
  const modal = document.getElementById('authModal');

  if (overlay) overlay.classList.remove('active');
  if (modal) modal.classList.remove('active');
}

function switchAuthForm(type) {
  const signinForm = document.getElementById('signinForm');
  const signupForm = document.getElementById('signupForm');

  if (type === 'signup') {
    if (signinForm) signinForm.style.display = 'none';
    if (signupForm) signupForm.style.display = 'block';
  } else {
    if (signinForm) signinForm.style.display = 'block';
    if (signupForm) signupForm.style.display = 'none';
  }
}

function handleSignIn(event) {
  event.preventDefault();
  showToast('Sign in functionality coming soon!');
  closeAuthModal();
}

function handleSignUp(event) {
  event.preventDefault();
  showToast('Sign up functionality coming soon!');
  closeAuthModal();
}

function showForgotPassword(event) {
  if (event) event.preventDefault();
  const signinForm = document.getElementById('signinForm');
  const signupForm = document.getElementById('signupForm');
  const forgotForm = document.getElementById('forgotPasswordForm');

  if (signinForm) signinForm.style.display = 'none';
  if (signupForm) signupForm.style.display = 'none';
  if (forgotForm) forgotForm.style.display = 'block';
}

function handleForgotPassword(event) {
  event.preventDefault();
  const successEl = document.getElementById('resetSuccess');
  if (successEl) {
    successEl.style.display = 'flex';
  }
  showToast('Password reset link sent!');
}

// =============================================================================
// Cookie Banner
// =============================================================================

function initCookieBanner() {
  if (localStorage.getItem('cookiesAccepted') || localStorage.getItem('cookiesDeclined')) {
    return;
  }

  const banner = document.getElementById('cookieBanner');
  if (banner) {
    setTimeout(() => {
      banner.classList.add('active');
    }, 2000);
  }
}

function acceptCookies() {
  localStorage.setItem('cookiesAccepted', 'true');
  const banner = document.getElementById('cookieBanner');
  if (banner) banner.classList.remove('active');
}

function declineCookies() {
  localStorage.setItem('cookiesDeclined', 'true');
  const banner = document.getElementById('cookieBanner');
  if (banner) banner.classList.remove('active');
}

// =============================================================================
// Upsell Modal
// =============================================================================

let pendingUpsellTests = [];

function showUpsellModal(tests) {
  pendingUpsellTests = tests || [];
  const overlay = document.getElementById('upsellOverlay');
  const modal = document.getElementById('upsellModal');
  const productsEl = document.getElementById('upsellProducts');
  const totalEl = document.getElementById('upsellTotal');
  const savingsEl = document.getElementById('upsellSavings');

  if (!overlay || !modal || !productsEl) return;

  // Build products using DOM methods
  productsEl.textContent = ''; // Clear safely
  let total = 0;

  pendingUpsellTests.forEach(test => {
    total += test.price;

    const product = document.createElement('div');
    product.style.cssText = 'display: flex; align-items: center; gap: 1rem; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 0.75rem;';

    const emoji = document.createElement('span');
    emoji.style.fontSize = '1.5rem';
    emoji.textContent = '💪';

    const info = document.createElement('div');
    info.style.flex = '1';

    const name = document.createElement('div');
    name.style.cssText = 'font-weight: 600; color: #fff;';
    name.textContent = test.name;

    const price = document.createElement('div');
    price.style.cssText = 'font-size: 0.85rem; color: rgba(255,255,255,0.6);';
    price.textContent = `$${test.price}`;

    info.appendChild(name);
    info.appendChild(price);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = true;
    checkbox.style.cssText = 'width: 20px; height: 20px; accent-color: var(--spartan-gold);';

    product.appendChild(emoji);
    product.appendChild(info);
    product.appendChild(checkbox);
    productsEl.appendChild(product);
  });

  if (totalEl) totalEl.textContent = total;
  if (savingsEl) savingsEl.textContent = Math.round(total * 0.1);

  overlay.classList.add('active');
  modal.classList.add('active');
}

function closeUpsellModal() {
  const overlay = document.getElementById('upsellOverlay');
  const modal = document.getElementById('upsellModal');

  if (overlay) overlay.classList.remove('active');
  if (modal) modal.classList.remove('active');
  pendingUpsellTests = [];
}

function addUpsellToCart() {
  pendingUpsellTests.forEach(test => addToCart(test.id));
  closeUpsellModal();
  showToast('Items added to cart!');
}

// =============================================================================
// Lab Selection Modal
// =============================================================================

function openLabModal() {
  const overlay = document.getElementById('labModalOverlay');
  const modal = document.getElementById('labModal');

  if (overlay && modal) {
    overlay.classList.add('active');
    modal.classList.add('active');
  }
}

function closeLabModal() {
  const overlay = document.getElementById('labModalOverlay');
  const modal = document.getElementById('labModal');

  if (overlay) overlay.classList.remove('active');
  if (modal) modal.classList.remove('active');
}

function searchLabsInModal() {
  const input = document.getElementById('labModalZipInput');
  const resultsDiv = document.getElementById('labModalResults');

  if (!input || !resultsDiv) return;

  const zip = input.value.trim();
  if (!zip || zip.length < 5) {
    showToast('Please enter a valid ZIP code');
    return;
  }

  // Check restricted states
  const restrictedZips = ['10', '11', '07', '08', '02', '96', '97'];
  if (restrictedZips.some(prefix => zip.startsWith(prefix))) {
    resultsDiv.innerHTML = '<p style="color: #f59e0b; text-align: center; padding: 2rem;">Sorry, services are not available in NY, NJ, RI, or HI due to state regulations.</p>';
    return;
  }

  // Show sample results
  resultsDiv.innerHTML = `
    <div style="padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 0.75rem; cursor: pointer;" onclick="selectLab(this)">
      <strong style="color: #D4AF37;">Quest Diagnostics</strong>
      <p style="font-size: 0.85rem; color: rgba(255,255,255,0.7); margin: 0.25rem 0;">123 Medical Center Dr - 0.8 miles</p>
      <p style="font-size: 0.8rem; color: rgba(255,255,255,0.5);">Mon-Fri 7AM-5PM, Sat 8AM-12PM</p>
    </div>
    <div style="padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 8px; cursor: pointer;" onclick="selectLab(this)">
      <strong style="color: #D4AF37;">LabCorp</strong>
      <p style="font-size: 0.85rem; color: rgba(255,255,255,0.7); margin: 0.25rem 0;">456 Health Plaza - 1.2 miles</p>
      <p style="font-size: 0.8rem; color: rgba(255,255,255,0.5);">Mon-Fri 6:30AM-4PM</p>
    </div>
  `;
}

function selectLab(element) {
  showToast('Lab location selected!');
  closeLabModal();
}

// =============================================================================
// Quick View Modal
// =============================================================================

function openQuickView(testId) {
  const test = testCatalog.find(t => t.id === testId);
  if (!test) return;

  const isInCart = state.cart.some(item => item.id === testId);

  const contentEl = document.getElementById('quickViewContent');
  const overlayEl = document.getElementById('quickViewOverlay');
  const modalEl = document.getElementById('quickViewModal');

  if (!contentEl) return;

  // Build content using DOM methods
  contentEl.textContent = ''; // Clear safely

  // Emoji header
  const emojiDiv = document.createElement('div');
  emojiDiv.style.cssText = 'text-align: center; margin-bottom: 1.5rem;';
  const emoji = document.createElement('span');
  emoji.style.fontSize = '3rem';
  emoji.textContent = '💪';
  emojiDiv.appendChild(emoji);

  // Title
  const title = document.createElement('h2');
  title.id = 'quickViewTitle';
  title.style.cssText = 'color: white; font-size: 1.5rem; margin-bottom: 0.5rem; text-align: center;';
  title.textContent = test.name;

  // Description
  const desc = document.createElement('p');
  desc.style.cssText = 'color: rgba(255,255,255,0.7); text-align: center; margin-bottom: 1.5rem; line-height: 1.6;';
  desc.textContent = test.description;

  // Info box
  const infoBox = document.createElement('div');
  infoBox.style.cssText = 'background: rgba(255,255,255,0.05); border-radius: 12px; padding: 1rem; margin-bottom: 1.5rem;';

  const createInfoRow = (label, value, valueStyle = 'color: white;') => {
    const row = document.createElement('div');
    row.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;';
    const labelSpan = document.createElement('span');
    labelSpan.style.color = 'rgba(255,255,255,0.6)';
    labelSpan.textContent = label;
    const valueSpan = document.createElement('span');
    valueSpan.style.cssText = valueStyle;
    valueSpan.textContent = value;
    row.appendChild(labelSpan);
    row.appendChild(valueSpan);
    return row;
  };

  infoBox.appendChild(createInfoRow('Price', `$${test.price}`, 'color: #D4AF37; font-size: 1.5rem; font-weight: 700;'));
  infoBox.appendChild(createInfoRow('Results', test.turnaround || '24-72 hours'));
  const labRow = createInfoRow('Lab Visit', 'No appointment needed');
  labRow.style.marginBottom = '0';
  infoBox.appendChild(labRow);

  // Button
  const button = document.createElement('button');
  button.className = 'btn btn-primary';
  button.style.cssText = 'width: 100%; padding: 1rem; font-size: 1rem;';
  button.textContent = isInCart ? '✓ Already in Cart' : `Add to Cart - $${test.price}`;
  button.dataset.action = 'addToCartAndClose';
  button.dataset.testId = test.id;

  // Disclaimer
  const disclaimer = document.createElement('p');
  disclaimer.style.cssText = 'text-align: center; margin-top: 1rem; font-size: 0.75rem; color: rgba(255,255,255,0.5);';
  disclaimer.textContent = 'Consult your healthcare provider for medical advice.';

  contentEl.appendChild(emojiDiv);
  contentEl.appendChild(title);
  contentEl.appendChild(desc);
  contentEl.appendChild(infoBox);
  contentEl.appendChild(button);
  contentEl.appendChild(disclaimer);

  if (overlayEl) overlayEl.style.display = 'block';
  if (modalEl) modalEl.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeQuickView() {
  const overlayEl = document.getElementById('quickViewOverlay');
  const modalEl = document.getElementById('quickViewModal');

  if (overlayEl) overlayEl.style.display = 'none';
  if (modalEl) modalEl.style.display = 'none';
  document.body.style.overflow = '';
}

// Note: Escape key handling moved to initKeyboardNavigation()

// =============================================================================
// Lab Locator
// =============================================================================

function findLabs() {
  const input = document.getElementById('zipInput');
  const resultsDiv = document.getElementById('labResults');
  const listDiv = document.getElementById('labList');

  if (!input || !resultsDiv || !listDiv) return;

  const zip = input.value.trim();
  if (!zip) {
    showToast('Please enter a ZIP code');
    return;
  }

  // Check restricted states
  const restrictedZips = ['10', '11', '07', '08', '02', '96', '97'];
  if (restrictedZips.some(prefix => zip.startsWith(prefix))) {
    listDiv.innerHTML = '<p style="color: #f59e0b;">Sorry, services are not available in NY, NJ, RI, or HI due to state regulations.</p>';
    resultsDiv.style.display = 'block';
    return;
  }

  // Show sample results
  listDiv.innerHTML = `
    <div style="padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 0.75rem;">
      <strong style="color: #D4AF37;">Quest Diagnostics</strong>
      <p style="font-size: 0.85rem; color: rgba(255,255,255,0.7); margin: 0.25rem 0;">123 Medical Center Dr - 0.8 miles</p>
      <p style="font-size: 0.8rem; color: rgba(255,255,255,0.5);">Mon-Fri 7AM-5PM, Sat 8AM-12PM</p>
    </div>
    <div style="padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 8px;">
      <strong style="color: #D4AF37;">LabCorp</strong>
      <p style="font-size: 0.85rem; color: rgba(255,255,255,0.7); margin: 0.25rem 0;">456 Health Plaza - 1.2 miles</p>
      <p style="font-size: 0.8rem; color: rgba(255,255,255,0.5);">Mon-Fri 6:30AM-4PM</p>
    </div>
  `;
  resultsDiv.style.display = 'block';
}

// =============================================================================
// Cart Sidebar Toggle
// =============================================================================

function toggleCart() {
  window.location.href = 'checkout.html';
}

// =============================================================================
// Test Filtering
// =============================================================================

function filterTests(category, buttonElement) {
  // Update active tab
  document.querySelectorAll('.category-tab').forEach(tab => tab.classList.remove('active'));
  if (buttonElement) buttonElement.classList.add('active');

  state.currentCategory = category;
  state.testsDisplayed = 12;
  renderTests(category, state.testsDisplayed);
}

function searchTests(query) {
  const searchQuery = query.toLowerCase().trim();

  if (!searchQuery) {
    renderTests('all', state.testsDisplayed);
    return;
  }

  const filtered = testCatalog.filter(test =>
    test.name.toLowerCase().includes(searchQuery) ||
    test.description.toLowerCase().includes(searchQuery)
  );

  renderFilteredTests(filtered);
}

function renderFilteredTests(tests) {
  const grid = document.getElementById('testsGrid');
  if (!grid) return;

  if (tests.length === 0) {
    grid.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.6); grid-column: 1/-1;">No tests found matching your search.</p>';
    return;
  }

  grid.innerHTML = tests.map(test => createTestCardHTML(test)).join('');
}

function createTestCardHTML(test) {
  const badgeHtml = test.popular ? '<span class="test-badge">Popular</span>' : (test.featured ? '<span class="test-badge">Best Value</span>' : '');

  return `
    <div class="test-card" data-category="${test.category}">
      <div class="test-card-header">
        <h3>${test.name}</h3>
        ${badgeHtml}
      </div>
      <div class="test-card-body">
        <p>${test.description}</p>
      </div>
      <div class="test-card-footer">
        <span class="test-price">$${test.price}</span>
        <button class="btn btn-primary btn-small" onclick="addToCart('${test.id}')">Add to Cart</button>
      </div>
    </div>
  `;
}

// =============================================================================
// Animations CSS (injected)
// =============================================================================

function injectAnimationStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(100px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideOut {
      from { opacity: 1; transform: translateX(0); }
      to { opacity: 0; transform: translateX(100px); }
    }
    .typing-indicator {
      display: flex;
      gap: 4px;
      padding: 0.5rem;
    }
    .typing-indicator span {
      width: 8px;
      height: 8px;
      background: var(--spartan-gold, #D4AF37);
      border-radius: 50%;
      animation: typingBounce 1.4s infinite ease-in-out;
    }
    .typing-indicator span:nth-child(1) { animation-delay: 0s; }
    .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
    .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typingBounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }
  `;
  document.head.appendChild(style);
}

// =============================================================================
// CSRF Protection
// =============================================================================

function generateCSRFToken() {
  const token = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);
  sessionStorage.setItem('csrf_token', token);
  return token;
}

function getCSRFToken() {
  let token = sessionStorage.getItem('csrf_token');
  if (!token) {
    token = generateCSRFToken();
  }
  return token;
}

function populateCSRFTokens() {
  const token = getCSRFToken();
  // Populate all CSRF token inputs (by name or class)
  document.querySelectorAll('input[name="_csrf"], .csrf-token').forEach(input => {
    input.value = token;
  });
}

function validateCSRFToken(formToken) {
  const sessionToken = sessionStorage.getItem('csrf_token');
  return formToken && sessionToken && formToken === sessionToken;
}

// =============================================================================
// Centralized Event Delegation (replaces inline onclick handlers)
// =============================================================================

const actions = {
  addToCart: (e) => {
    const testId = e.target.closest('[data-test-id]')?.dataset.testId;
    if (testId) addToCart(testId);
  },
  addToCartFromAI: (e) => {
    const testId = e.target.closest('[data-test-id]')?.dataset.testId;
    if (testId) addToCartFromAI(testId);
  },
  addToCartAndClose: (e) => {
    const testId = e.target.dataset.testId;
    if (testId) {
      addToCart(testId);
      closeQuickView();
    }
  },
  toggleMobileMenu: () => toggleMobileMenu(),
  toggleCart: () => toggleCart(),
  openAuthModal: (e) => {
    const type = e.target.closest('[data-auth-type]')?.dataset.authType || 'signin';
    openAuthModal(type);
  },
  closeAuthModal: () => closeAuthModal(),
  switchAuthForm: (e) => {
    const type = e.target.closest('[data-form-type]')?.dataset.formType;
    if (type) switchAuthForm(type);
  },
  showForgotPassword: (e) => {
    e.preventDefault();
    showForgotPassword();
  },
  sendAiMessage: () => sendAiMessage(),
  sendAiPreset: (e) => {
    const message = e.target.closest('[data-message]')?.dataset.message;
    if (message) sendAiMessage(message);
  },
  closeWelcomePopup: () => closeWelcomePopup(),
  copyWelcomeCode: () => copyWelcomeCode(),
  closeExitPopup: () => closeExitPopup(),
  submitExitEmail: () => submitExitEmail(),
  closeSocialProof: () => closeSocialProof(),
  acceptCookies: () => acceptCookies(),
  declineCookies: () => declineCookies(),
  findLabs: () => findLabs(),
  filterTests: (e) => {
    const category = e.target.closest('[data-category]')?.dataset.category;
    if (category) filterTests(category, e.target);
  },
  closeUpsellModal: () => closeUpsellModal(),
  addUpsellToCart: () => addUpsellToCart(),
  openLabModal: () => openLabModal(),
  closeLabModal: () => closeLabModal(),
  searchLabsInModal: () => searchLabsInModal(),
  closeQuickView: () => closeQuickView(),
  openQuickView: (e) => {
    const testId = e.target.closest('[data-test-id]')?.dataset.testId;
    if (testId) openQuickView(testId);
  },
  scrollToTop: () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
  scrollToChat: () => {
    const input = document.getElementById('aiChatInput');
    if (input) {
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => input.focus(), 500);
    }
  }
};

function initEventDelegation() {
  document.addEventListener('click', (e) => {
    const actionEl = e.target.closest('[data-action]');
    if (actionEl) {
      const action = actionEl.dataset.action;
      if (actions[action]) {
        e.preventDefault();
        actions[action](e);
      }
    }
  });

  // Handle Enter key for inputs with data-action-enter
  document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const actionEl = e.target.closest('[data-action-enter]');
      if (actionEl) {
        const action = actionEl.dataset.actionEnter;
        if (actions[action]) {
          e.preventDefault();
          actions[action](e);
        }
      }
    }
  });

  // Handle input events for search
  document.addEventListener('input', (e) => {
    const actionEl = e.target.closest('[data-action-input]');
    if (actionEl) {
      const action = actionEl.dataset.actionInput;
      if (action === 'searchTests') {
        searchTests(e.target.value);
      }
    }
  });
}

// =============================================================================
// Keyboard Navigation & Focus Management
// =============================================================================

function initKeyboardNavigation() {
  // Close modals on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeQuickView();
      closeLabModal();
      closeUpsellModal();
      closeAuthModal();
      closeWelcomePopup();
      closeExitPopup();
      if (state.mobileMenuOpen) toggleMobileMenu(false);
    }
  });

  // Focus trap for modals
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;

    const activeModal = document.querySelector('.auth-modal.active, .lab-modal.active, .welcome-popup.active, #quickViewModal[style*="block"]');
    if (!activeModal) return;

    const focusableElements = activeModal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  });
}

// =============================================================================
// Initialize Application
// =============================================================================

function init() {
  // Scroll to top on page load (except checkout and lab finder sections)
  const currentPath = window.location.pathname;
  const currentHash = window.location.hash;
  const isCheckout = currentPath.includes('checkout');
  const isLabSection = currentHash === '#locations';

  if (!isCheckout && !isLabSection) {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  injectAnimationStyles();
  renderTests();
  initCategoryFilters();
  initEventListeners();
  initEventDelegation(); // Centralized event handling
  initKeyboardNavigation(); // Accessibility
  initNavbarScroll();
  initFloatingButtons(); // Floating button visibility
  updateCartUI();

  // Initialize interactive features
  initWelcomePopup();
  initExitIntent();
  // initPageTransitions(); // Disabled - research shows users prefer instant navigation
  initStickyCartBar();
  initCookieBanner();

  // Security: Populate CSRF tokens
  populateCSRFTokens();

  console.log('WeightGain - Built for Warriors initialized');
  console.log(`${testCatalog.length} tests available`);
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// =============================================================================
// Exports for other pages
// =============================================================================

window.WeightGain = {
  addToCart,
  removeFromCart,
  getCartTotal,
  state,
  testCatalog,
  restrictedStates,
  checkStateRestriction
};

// Global function exports for HTML onclick handlers
window.sendAiMessage = sendAiMessage;
window.handleAiKeypress = handleAiKeypress;
window.closeWelcomePopup = closeWelcomePopup;
window.copyWelcomeCode = copyWelcomeCode;
window.closeExitPopup = closeExitPopup;
window.submitExitEmail = submitExitEmail;
window.closeSocialProof = closeSocialProof;
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.switchAuthForm = switchAuthForm;
window.handleSignIn = handleSignIn;
window.handleSignUp = handleSignUp;
window.showForgotPassword = showForgotPassword;
window.handleForgotPassword = handleForgotPassword;
window.acceptCookies = acceptCookies;
window.declineCookies = declineCookies;
window.findLabs = findLabs;
window.toggleCart = toggleCart;
window.filterTests = filterTests;
window.searchTests = searchTests;
window.toggleMobileMenu = toggleMobileMenu;
window.showUpsellModal = showUpsellModal;
window.closeUpsellModal = closeUpsellModal;
window.addUpsellToCart = addUpsellToCart;
window.openLabModal = openLabModal;
window.closeLabModal = closeLabModal;
window.searchLabsInModal = searchLabsInModal;
window.selectLab = selectLab;
window.openQuickView = openQuickView;
window.closeQuickView = closeQuickView;

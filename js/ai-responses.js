/**
 * WeightGain - AI Chat Response Data
 * Response patterns for Total Optimization membership
 */

// =============================================================================
// AI Response Templates - Single Membership Model
// =============================================================================

const aiResponses = {
  // How it works / Personalization
  howworks: {
    message: "Here's how it works: 1) Get your comprehensive blood panel at 4,500+ labs. 2) Our medical team analyzes your results. 3) We design YOUR personalized protocol - TRT, HGH, or both - based on what your body actually needs. 4) Medication ships monthly. One membership, zero guesswork.",
    plan: 'optimization'
  },
  personalized: {
    message: "Your body is unique - your protocol should be too. We start with comprehensive labs, then our medical team designs a protocol tailored to YOUR results. You might need testosterone optimization, growth hormone, or both. We figure it out so you don't have to.",
    plan: 'optimization'
  },

  // What's included
  included: {
    message: "Everything's included in the $249/mo membership: Comprehensive blood panel, personalized hormone protocol (TRT, HGH, or both based on YOUR labs), monthly medication delivery, quarterly monitoring labs, unlimited telehealth visits, AI progress tracking, and priority support. No hidden fees.",
    plan: 'optimization'
  },
  whatsincluded: {
    message: "$249/mo gets you EVERYTHING: comprehensive labs, personalized protocol, monthly medication delivery, ongoing monitoring, unlimited telehealth, AI tracking, and priority support. We analyze your labs and give you exactly what your body needs.",
    plan: 'optimization'
  },

  // Testosterone-related
  trt: {
    message: "Wondering about testosterone? Our Total Optimization membership ($249/mo) includes comprehensive labs - if your testosterone is low, that'll be part of your personalized protocol. We don't guess - we test, analyze, and optimize.",
    plan: 'optimization'
  },
  testosterone: {
    message: "Low testosterone symptoms? Fatigue, can't build muscle, low libido? Our $249/mo membership starts with comprehensive labs. If testosterone is the issue, it'll be part of your personalized protocol. Everything included.",
    plan: 'optimization'
  },
  lowt: {
    message: "Symptoms of Low T: fatigue, low libido, can't build muscle? Don't guess - let's test. Our Total Optimization membership ($249/mo) includes comprehensive labs and a personalized protocol based on YOUR results.",
    plan: 'optimization'
  },

  // HGH-related
  hgh: {
    message: "Growth hormone is powerful for recovery and body comp. Our Total Optimization membership ($249/mo) tests your full hormone panel. If HGH would benefit you, it's included in your personalized protocol. No extra cost.",
    plan: 'optimization'
  },
  growth: {
    message: "Growth hormone = recovery, body composition, anti-aging. Our $249/mo membership includes comprehensive labs. If HGH is right for your goals, it's part of your personalized protocol. Everything included, nothing extra.",
    plan: 'optimization'
  },

  // Muscle & Fitness
  muscle: {
    message: "Can't build muscle? Could be testosterone, growth hormone, or both. Our Total Optimization membership ($249/mo) tests everything, then designs a protocol for YOUR body. No guessing - just results.",
    plan: 'optimization'
  },
  gains: {
    message: "No gains? 90% of hardgainers have suboptimal hormones. Our $249/mo membership tests your full panel, then creates a personalized protocol. You get exactly what your body needs - nothing more, nothing less.",
    plan: 'optimization'
  },

  // Energy & Fatigue
  tired: {
    message: "Always tired? Could be testosterone, thyroid, or other factors. Our Total Optimization membership ($249/mo) includes comprehensive labs - we find the issue and fix it with a personalized protocol.",
    plan: 'optimization'
  },
  fatigue: {
    message: "Fatigue killing your gains? Let's find out why. $249/mo gets you comprehensive labs, personalized protocol, monthly medication, and unlimited telehealth. We optimize what YOUR body needs.",
    plan: 'optimization'
  },
  energy: {
    message: "Want more energy? Our Total Optimization membership ($249/mo) starts with comprehensive labs, then designs YOUR personalized protocol. Could be testosterone, HGH, or both - we figure it out.",
    plan: 'optimization'
  },

  // Pricing
  price: {
    message: "$249/mo - that's it. Everything included: comprehensive labs, personalized protocol (TRT, HGH, or both), monthly medication delivery, quarterly monitoring, unlimited telehealth, and priority support. No hidden fees, no surprises.",
    plan: 'optimization'
  },
  cost: {
    message: "Total Optimization: $249/mo or $2,490/yr (save $498). Includes comprehensive labs, personalized protocol, monthly medication, monitoring, and unlimited telehealth. One price, everything included.",
    plan: 'optimization'
  },

  // Timeline & Results
  timeline: {
    message: "Your timeline: Sign up TODAY - Labs within 48hrs at 4,500+ locations - Our team analyzes and designs your protocol - Provider consult same day - Ships immediately. TOTAL TIME: ~7 DAYS. Week 1-2: Energy improves. Week 6-8: Visible gains. Week 12+: Full optimization!",
    plan: 'optimization'
  },
  fast: {
    message: "How fast? Most members see: Week 1-2: Energy boost, better sleep. Week 3-4: Mood improvement, strength returning. Week 6-8: VISIBLE gains. Week 12+: Full optimization. 94% see results by week 6!",
    plan: 'optimization'
  },
  results: {
    message: "Real results: Our members average +287 ng/dL testosterone increase when needed. 94% see results within 6 weeks. Your personalized protocol is designed for YOUR body - that's why it works.",
    plan: 'optimization'
  },

  // Safety & Quality
  sides: {
    message: "Side effects are minimal when properly monitored. That's why we include quarterly labs - your doctor watches your levels and adjusts as needed. Unlimited telehealth means you can ask questions anytime. 12,847 members trust us.",
    plan: null
  },
  safe: {
    message: "Safety first: Your membership includes quarterly blood panels, licensed physician oversight, unlimited telehealth, and FDA-registered pharmacy compounds. We monitor and adjust your protocol as needed.",
    plan: null
  },
  legit: {
    message: "100% pharma-grade compounds from FDA-registered US pharmacies. Same quality used by elite athletes. No underdosed garbage. Your labs prove it's working. This is the real deal.",
    plan: 'optimization'
  },
  quality: {
    message: "Pharma-grade quality: Made in FDA-registered US facilities, every batch tested for purity and potency. Quarterly labs verify it's working. 12,847 members trust us with their optimization.",
    plan: 'optimization'
  },

  // Privacy
  discreet: {
    message: "Total discretion: Plain packaging, no logos or labels indicating contents. Generic medical billing name on statements. HIPAA-protected records. No one knows your business but you and your doctor.",
    plan: null
  },
  private: {
    message: "Your privacy is locked down: HIPAA-protected medical records, discreet plain packaging, generic billing name. We treat your info like it's ours.",
    plan: null
  },

  default: {
    message: "Total Optimization: $249/mo. We analyze your labs and create a personalized hormone protocol for YOUR body. Everything included - labs, medication, monitoring, telehealth. ~7 days to start. Ready?",
    plan: 'optimization'
  },
  offTopic: {
    message: "I help with hormone optimization! Our Total Optimization membership ($249/mo) includes comprehensive labs, personalized protocol, monthly medication, and unlimited telehealth. What would you like to know?",
    plan: 'optimization'
  }
};

// Priority keyword mappings for AI chat
const priorityKeywords = {
  // How it works
  'how does it work': 'howworks', 'how it works': 'howworks', 'personalized': 'personalized', 'personalization': 'personalized',
  // What's included
  'what\'s included': 'included', 'whats included': 'included', 'what is included': 'included', 'included': 'included',
  // TRT/Testosterone
  'trt': 'trt', 'testosterone': 'testosterone', 'low t': 'lowt', 'low testosterone': 'lowt',
  // HGH
  'hgh': 'hgh', 'growth hormone': 'hgh', 'human growth': 'hgh',
  // Fitness
  'build muscle': 'muscle', 'muscle': 'muscle', 'gains': 'gains', 'no gains': 'gains',
  // Energy
  'tired': 'tired', 'fatigue': 'fatigue', 'energy': 'energy', 'always tired': 'tired',
  // Pricing
  'price': 'price', 'cost': 'cost', 'how much': 'price', 'pricing': 'price',
  // Timeline
  'timeline': 'timeline', 'how fast': 'fast', 'how quickly': 'fast', 'results': 'results', 'how long': 'timeline',
  // Safety
  'side effect': 'sides', 'sides': 'sides', 'safe': 'safe', 'safety': 'safe',
  // Quality
  'legit': 'legit', 'real': 'legit', 'pharma grade': 'quality', 'quality': 'quality',
  // Privacy
  'discreet': 'discreet', 'private': 'private', 'privacy': 'private', 'packaging': 'discreet'
};

// Export for use in other modules
window.WeightGainAIResponses = {
  aiResponses,
  priorityKeywords
};

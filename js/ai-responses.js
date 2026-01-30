/**
 * WeightGain - AI Chat Response Data
 * Response patterns for Total Optimization membership
 */

// =============================================================================
// AI Response Templates - Single Membership Model
// =============================================================================

const aiResponses = {
  howworks: {
    message:
      "Get labs at 4,500+ locations, our doctors analyze your results, then we design your personalized protocol — TRT, HGH, or both. Medication ships monthly. $249/mo, everything included.",
    plan: "optimization",
  },
  personalized: {
    message:
      "We start with comprehensive labs, then build a protocol tailored to YOUR results. You might need TRT, HGH, or both — we figure it out based on your bloodwork, not guesswork.",
    plan: "optimization",
  },
  included: {
    message:
      "$249/mo includes: comprehensive labs, personalized protocol, monthly medication delivery, quarterly monitoring, unlimited telehealth, and priority support. No hidden fees.",
    plan: "optimization",
  },
  whatsincluded: {
    message:
      "$249/mo — everything included. Labs, personalized protocol, monthly meds, monitoring, unlimited telehealth. One price, no surprises.",
    plan: "optimization",
  },
  trt: {
    message:
      "Our $249/mo membership includes full labs. If your testosterone is low, TRT becomes part of your personalized protocol. We test first, then optimize.",
    plan: "optimization",
  },
  testosterone: {
    message:
      "Fatigue, can't build muscle, low libido? Could be low T. $249/mo gets you labs, diagnosis, and a personalized protocol. Everything included.",
    plan: "optimization",
  },
  lowt: {
    message:
      "Low T symptoms? Don't guess — let's test. $249/mo includes comprehensive labs and a personalized protocol based on YOUR results.",
    plan: "optimization",
  },
  hgh: {
    message:
      "HGH is great for recovery and body composition. $249/mo covers your full hormone panel — if HGH would help, it's included in your protocol. No extra cost.",
    plan: "optimization",
  },
  growth: {
    message:
      "Growth hormone helps with recovery, body comp, and anti-aging. If your labs show you'd benefit, HGH is part of your $249/mo protocol.",
    plan: "optimization",
  },
  muscle: {
    message:
      "Can't build muscle? Could be testosterone, growth hormone, or both. $249/mo — we test everything and design a protocol for YOUR body.",
    plan: "optimization",
  },
  gains: {
    message:
      "Most hardgainers have suboptimal hormones. $249/mo gets your full panel tested, then we build a protocol to fix what's holding you back.",
    plan: "optimization",
  },
  tired: {
    message:
      "Always tired? Could be testosterone, thyroid, or other factors. $249/mo includes comprehensive labs — we find the issue and build your protocol.",
    plan: "optimization",
  },
  fatigue: {
    message:
      "Fatigue killing your progress? $249/mo gets you labs, a personalized protocol, monthly meds, and unlimited telehealth. We optimize what YOUR body needs.",
    plan: "optimization",
  },
  energy: {
    message:
      "Want more energy? $249/mo starts with labs, then we design your protocol — could be TRT, HGH, or both based on your results.",
    plan: "optimization",
  },
  price: {
    message:
      "$249/mo — everything included. Labs, personalized protocol, monthly meds, quarterly monitoring, unlimited telehealth. No hidden fees. Or $2,490/yr to save $498.",
    plan: "optimization",
  },
  cost: {
    message:
      "$249/mo or $2,490/yr (save $498). Includes labs, protocol, meds, monitoring, and telehealth. One price, everything included.",
    plan: "optimization",
  },
  timeline: {
    message:
      "Sign up today → labs within 48hrs → doctor reviews in 24-48hrs → ships same day after approval. ~7 days to your first injection.",
    plan: "optimization",
  },
  fast: {
    message:
      "Week 1-2: energy boost. Week 3-4: mood and strength improving. Week 6-8: visible gains. Most members notice real changes by week 6. Individual results vary.",
    plan: "optimization",
  },
  results: {
    message:
      "Most members report changes by week 6. Energy first, then strength, then visible results. Your protocol is personalized to YOUR labs — that's why it works. Individual results vary.",
    plan: "optimization",
  },
  sides: {
    message:
      "Side effects are minimal when properly monitored. That's why we include quarterly labs and unlimited telehealth — your doctor watches your levels and adjusts as needed.",
    plan: null,
  },
  safe: {
    message:
      "Your membership includes quarterly blood panels, licensed physician oversight, unlimited telehealth, and pharma-grade compounds. We monitor and adjust your protocol as needed.",
    plan: null,
  },
  legit: {
    message:
      "100% pharma-grade from licensed US pharmacies. Every batch tested for purity and potency. Your labs prove it's working.",
    plan: "optimization",
  },
  quality: {
    message:
      "Pharma-grade compounds from licensed US facilities. Every batch tested. Quarterly labs verify it's working.",
    plan: "optimization",
  },
  discreet: {
    message:
      "Plain brown box, no logos, no indication of contents. Generic billing name on statements. HIPAA-protected records. Total discretion.",
    plan: null,
  },
  private: {
    message:
      "HIPAA-protected records, discreet plain packaging, generic billing name. Your privacy is locked down.",
    plan: null,
  },
  default: {
    message:
      "$249/mo — we analyze your labs and create a personalized hormone protocol. Everything included. ~7 days to start.",
    plan: "optimization",
  },
  offTopic: {
    message:
      "I help with hormone optimization! $249/mo includes labs, personalized protocol, monthly meds, and unlimited telehealth. What would you like to know?",
    plan: "optimization",
  },
};

// Priority keyword mappings for AI chat
const priorityKeywords = {
  "how does it work": "howworks",
  "how it works": "howworks",
  personalized: "personalized",
  personalization: "personalized",
  "what's included": "included",
  "whats included": "included",
  "what is included": "included",
  included: "included",
  trt: "trt",
  testosterone: "testosterone",
  "low t": "lowt",
  "low testosterone": "lowt",
  hgh: "hgh",
  "growth hormone": "hgh",
  "human growth": "hgh",
  "build muscle": "muscle",
  muscle: "muscle",
  gains: "gains",
  "no gains": "gains",
  tired: "tired",
  fatigue: "fatigue",
  energy: "energy",
  "always tired": "tired",
  price: "price",
  cost: "cost",
  "how much": "price",
  pricing: "price",
  timeline: "timeline",
  "how fast": "fast",
  "how quickly": "fast",
  results: "results",
  "how long": "timeline",
  "side effect": "sides",
  sides: "sides",
  safe: "safe",
  safety: "safe",
  legit: "legit",
  real: "legit",
  "pharma grade": "quality",
  quality: "quality",
  discreet: "discreet",
  private: "private",
  privacy: "private",
  packaging: "discreet",
};

// Export for use in other modules
window.WeightGainAIResponses = {
  aiResponses,
  priorityKeywords,
};

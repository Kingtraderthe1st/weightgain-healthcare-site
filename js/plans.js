/**
 * WeightGain - Subscription Plans Management
 * Two-tier membership: TRT Essentials and Total Optimization (TRT + HGH)
 */

// Dependencies: WeightGainState, WeightGainCart, WeightGainUI

// =============================================================================
// Subscription Plans
// =============================================================================

const subscriptionPlans = {
  essentials: {
    id: "trt-essentials",
    name: "TRT Essentials",
    tagline: "Testosterone optimization, all-inclusive",
    description:
      "Everything you need for testosterone replacement therapy. Labs, medication, and provider visits included.",
    includes: [
      "Comprehensive blood panel (initial + quarterly)",
      "Personalized TRT protocol",
      "Testosterone delivered monthly",
      "Unlimited telehealth with licensed providers",
      "AI-powered progress dashboard",
      "90-day money-back guarantee",
    ],
    pricing: {
      monthly: 249,
      yearly: 2490,
    },
    yearlySavings: 498,
    monthlyEquivalent: 207,
    popular: true,
  },
  optimization: {
    id: "total-optimization",
    name: "Total Optimization",
    tagline: "TRT + HGH for peak performance",
    description:
      "The complete protocol. Testosterone and growth hormone therapy combined for maximum results.",
    includes: [
      "Everything in TRT Essentials",
      "Growth hormone (HGH) therapy",
      "Monthly body composition tracking",
      "Priority provider access",
      "Quarterly protocol optimization",
    ],
    pricing: {
      monthly: 449,
      yearly: 4490,
    },
    yearlySavings: 898,
    monthlyEquivalent: 374,
    popular: false,
  },
};

// Legacy test catalog (empty - app uses subscription plans)
const testCatalog = [];

// =============================================================================
// Billing Toggle & Pricing Functions
// =============================================================================

function initBillingToggle() {
  const billingOptions = document.querySelectorAll(".billing-option");
  if (!billingOptions.length) {
    return;
  }

  const state = window.WeightGainState?.state;
  if (!state) {
    window.WeightGainLogger?.warn("State not initialized yet");
    return;
  }

  billingOptions.forEach((option) => {
    option.addEventListener("click", () => {
      billingOptions.forEach((opt) => opt.classList.remove("active"));
      option.classList.add("active");
      state.billingCycle = option.dataset.billing;
      updatePricingDisplay();
    });
  });
}

function updatePricingDisplay() {
  const state = window.WeightGainState?.state;
  if (!state) {
    return;
  }

  const cycle = state.billingCycle;

  // Update all plan cards on the page
  Object.keys(subscriptionPlans).forEach((key) => {
    const plan = subscriptionPlans[key];
    const card = document.querySelector(`[data-plan="${key}"]`);
    if (!card) {
      return;
    }

    const priceEl = card.querySelector(".subscription-price");
    const periodEl = card.querySelector(".subscription-period");
    const savingsEl = card.querySelector(".subscription-savings");

    if (priceEl) {
      if (cycle === "monthly") {
        priceEl.textContent = `$${plan.pricing.monthly}`;
        if (periodEl) {
          periodEl.textContent = "/month";
        }
        if (savingsEl) {
          savingsEl.style.display = "none";
        }
      } else if (cycle === "yearly") {
        priceEl.textContent = `$${plan.pricing.yearly}`;
        if (periodEl) {
          periodEl.textContent = "/year";
        }
        if (savingsEl) {
          savingsEl.textContent = `Save $${plan.yearlySavings}`;
          savingsEl.style.display = "inline-block";
        }
      }
    }
  });
}

function selectPlan(planId) {
  const plan = subscriptionPlans[planId] || subscriptionPlans.essentials;

  if (window.WeightGainLogger) {
    window.WeightGainLogger.log("selectPlan called for: " + (planId || "essentials"));
  }

  const state = window.WeightGainState?.state;
  if (!state) {
    window.WeightGainLogger?.warn("State not initialized yet");
    return;
  }

  state.selectedPlan = planId || "essentials";

  // Default to monthly billing
  const price = plan.pricing.monthly;
  const billingLabel = "Monthly";

  // If already in cart, go straight to checkout
  const existingItem = state.cart.find((item) => item.id === plan.id);
  if (existingItem) {
    window.location.href = "checkout.html";
    return;
  }

  // Clear cart and add the single plan
  state.cart = [
    {
      id: plan.id,
      name: plan.name,
      price: price,
      billingCycle: "monthly",
      billingLabel: billingLabel,
      includes: plan.includes,
      quantity: 1,
    },
  ];

  if (window.WeightGainCart?.saveCart) {
    window.WeightGainCart.saveCart();
  }
  if (window.WeightGainCart?.updateCartUI) {
    window.WeightGainCart.updateCartUI();
  }

  // Go directly to checkout - no upsell needed with single plan
  window.location.href = "checkout.html";
}

// Legacy function - no longer needed with single plan
function addPairingToCart(_planId) {
  // No-op - single plan model doesn't need pairing
  window.WeightGainLogger?.log("Pairing not needed with single plan model");
}

// Export for use in other modules
window.WeightGainPlans = {
  subscriptionPlans,
  testCatalog,
  initBillingToggle,
  updatePricingDisplay,
  selectPlan,
  addPairingToCart,
};

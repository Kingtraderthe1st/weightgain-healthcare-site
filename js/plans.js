/**
 * WeightGain - Subscription Plans Management
 * Single unified membership - personalized protocol based on your labs
 */

// Dependencies: WeightGainState, WeightGainCart, WeightGainUI

// =============================================================================
// Single Subscription Plan - Simple like Function Health
// =============================================================================

const subscriptionPlans = {
  optimization: {
    id: "total-optimization",
    name: "Total Optimization",
    tagline: "Your personalized hormone protocol",
    description:
      "We analyze your labs and create a protocol tailored to your body. You get exactly what you need - nothing more, nothing less.",
    includes: [
      "Comprehensive blood panel",
      "Personalized hormone protocol",
      "Monthly medication delivery",
      "Quarterly monitoring labs",
      "Unlimited telehealth visits",
      "AI-powered progress tracking",
      "Priority support",
    ],
    pricing: {
      monthly: 249,
      yearly: 2490,
    },
    yearlySavings: 498,
    monthlyEquivalent: 207,
    popular: true,
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
  const plan = subscriptionPlans.optimization;

  const card = document.querySelector('[data-plan="optimization"]');
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
}

function selectPlan(_planId) {
  // All plan selections now go to the single optimization plan
  const plan = subscriptionPlans.optimization;

  if (window.WeightGainLogger) {
    window.WeightGainLogger.log("selectPlan called, using optimization plan");
  }

  const state = window.WeightGainState?.state;
  if (!state) {
    window.WeightGainLogger?.warn("State not initialized yet");
    return;
  }

  state.selectedPlan = "optimization";

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

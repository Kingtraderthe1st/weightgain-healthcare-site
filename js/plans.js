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
  const toggleTracks = document.querySelectorAll(".billing-toggle-track");
  if (!toggleTracks.length) {
    return;
  }

  const state = window.WeightGainState?.state;
  if (!state) {
    window.WeightGainLogger?.warn("State not initialized yet");
    return;
  }

  toggleTracks.forEach((track) => {
    const options = track.querySelectorAll(".billing-option");
    options.forEach((option) => {
      option.addEventListener("click", () => {
        const billing = option.dataset.billing;
        // Update active states within this track
        options.forEach((opt) => {
          opt.classList.remove("active");
          opt.setAttribute("aria-checked", "false");
        });
        option.classList.add("active");
        option.setAttribute("aria-checked", "true");
        // Slide the thumb
        track.setAttribute("data-active", billing);
        // Update savings badge visibility
        const card = track.closest("[data-plan]");
        if (card) {
          const badge = card.querySelector(".billing-savings-badge");
          if (badge) {
            badge.classList.toggle("visible", billing === "yearly");
          }
        }
        state.billingCycle = billing;
        updatePricingDisplay();
      });
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

// =============================================================================
// Plan Detail Modal (homepage only)
// =============================================================================

function showPlanDetail(planId) {
  const plan = subscriptionPlans[planId];
  if (!plan) {
    return;
  }

  const overlay = document.getElementById("planDetailOverlay");
  const modal = document.getElementById("planDetailModal");
  const content = document.getElementById("planDetailContent");
  if (!overlay || !modal || !content) {
    return;
  }

  // Build modal content using DOM methods for security
  content.textContent = "";

  // Badge
  const badge = document.createElement("div");
  badge.className = `plan-detail-badge${plan.popular ? "" : " plan-detail-badge--premium"}`;
  badge.textContent = plan.popular ? "Most Popular" : "Peak Performance";
  content.appendChild(badge);

  // Name
  const nameEl = document.createElement("h2");
  nameEl.className = "plan-detail-name";
  nameEl.id = "planDetailTitle";
  nameEl.textContent = plan.name;
  content.appendChild(nameEl);

  // Tagline
  const tagline = document.createElement("p");
  tagline.className = "plan-detail-tagline";
  tagline.textContent = plan.tagline;
  content.appendChild(tagline);

  // Description
  const desc = document.createElement("p");
  desc.className = "plan-detail-description";
  desc.textContent = plan.description;
  content.appendChild(desc);

  // Price block
  const priceBlock = document.createElement("div");
  priceBlock.className = "plan-detail-price-block";

  const priceAmount = document.createElement("span");
  priceAmount.className = "plan-detail-price";
  priceAmount.id = "planDetailPrice";
  priceAmount.textContent = `$${plan.pricing.monthly}`;

  const pricePeriod = document.createElement("span");
  pricePeriod.className = "plan-detail-period";
  pricePeriod.id = "planDetailPeriod";
  pricePeriod.textContent = "/month";

  priceBlock.appendChild(priceAmount);
  priceBlock.appendChild(pricePeriod);
  content.appendChild(priceBlock);

  // Billing toggle
  const toggleWrap = document.createElement("div");
  toggleWrap.className = "billing-toggle";
  toggleWrap.setAttribute("role", "radiogroup");
  toggleWrap.setAttribute("aria-label", "Billing frequency");

  const track = document.createElement("div");
  track.className = "billing-toggle-track";
  track.setAttribute("data-active", "monthly");

  const thumb = document.createElement("div");
  thumb.className = "billing-toggle-thumb";
  track.appendChild(thumb);

  const monthlyBtn = document.createElement("button");
  monthlyBtn.className = "billing-option active";
  monthlyBtn.setAttribute("data-billing", "monthly");
  monthlyBtn.setAttribute("role", "radio");
  monthlyBtn.setAttribute("aria-checked", "true");
  monthlyBtn.textContent = "Monthly";
  track.appendChild(monthlyBtn);

  const yearlyBtn = document.createElement("button");
  yearlyBtn.className = "billing-option";
  yearlyBtn.setAttribute("data-billing", "yearly");
  yearlyBtn.setAttribute("role", "radio");
  yearlyBtn.setAttribute("aria-checked", "false");
  yearlyBtn.textContent = "Yearly";
  track.appendChild(yearlyBtn);

  toggleWrap.appendChild(track);
  content.appendChild(toggleWrap);

  // Savings badge
  const savingsBadge = document.createElement("div");
  savingsBadge.className = "billing-savings-badge";
  savingsBadge.textContent = `Save $${plan.yearlySavings}/yr with annual billing`;
  content.appendChild(savingsBadge);

  // Toggle click handlers
  [monthlyBtn, yearlyBtn].forEach((btn) => {
    btn.addEventListener("click", () => {
      const billing = btn.dataset.billing;
      monthlyBtn.classList.toggle("active", billing === "monthly");
      yearlyBtn.classList.toggle("active", billing === "yearly");
      monthlyBtn.setAttribute("aria-checked", billing === "monthly" ? "true" : "false");
      yearlyBtn.setAttribute("aria-checked", billing === "yearly" ? "true" : "false");
      track.setAttribute("data-active", billing);
      savingsBadge.classList.toggle("visible", billing === "yearly");

      if (billing === "monthly") {
        priceAmount.textContent = `$${plan.pricing.monthly}`;
        pricePeriod.textContent = "/month";
      } else {
        priceAmount.textContent = `$${plan.pricing.yearly}`;
        pricePeriod.textContent = "/year";
      }
    });
  });

  // Features list
  const featuresList = document.createElement("ul");
  featuresList.className = "plan-detail-features";
  plan.includes.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML =
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
    const span = document.createElement("span");
    span.textContent = item;
    li.appendChild(span);
    featuresList.appendChild(li);
  });
  content.appendChild(featuresList);

  // CTA button
  const cta = document.createElement("button");
  cta.className = "btn btn-primary btn-large plan-detail-cta";
  cta.setAttribute("data-action", "selectPlan");
  cta.setAttribute("data-plan-id", planId);
  cta.textContent = "Start My Plan";
  content.appendChild(cta);

  // Compare link
  const compare = document.createElement("a");
  compare.href = "pricing.html";
  compare.className = "plan-detail-compare";
  compare.textContent = "Compare both plans \u2192";
  content.appendChild(compare);

  // Show modal
  overlay.classList.add("active");
  modal.classList.add("active");
  overlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  // Focus the modal for accessibility
  modal.focus();
}

function closePlanDetail() {
  const overlay = document.getElementById("planDetailOverlay");
  const modal = document.getElementById("planDetailModal");
  if (!overlay || !modal) {
    return;
  }

  overlay.classList.remove("active");
  modal.classList.remove("active");
  overlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// Export for use in other modules
window.WeightGainPlans = {
  subscriptionPlans,
  testCatalog,
  initBillingToggle,
  updatePricingDisplay,
  selectPlan,
  addPairingToCart,
  showPlanDetail,
  closePlanDetail,
};

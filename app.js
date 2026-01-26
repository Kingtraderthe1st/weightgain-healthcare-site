/**
 * WeightGain - Main Application
 * Brand: Warrior/Gains positioning
 * "Built for Warriors" - TRT & Hormone Testing for Teens & Young Adults
 *
 * This is the main initialization file. Most functionality has been split into modules:
 * - js/utils.js - Utility functions
 * - js/cart.js - Cart management
 * - js/plans.js - Subscription plan management
 * - js/ai-responses.js - AI response data
 * - js/ai-chat.js - AI chat functionality
 * - js/ui.js - UI interactions and modals
 */

// =============================================================================
// Application State
// =============================================================================

// State is initialized in cart.js module, but we reference it here
// If state wasn't initialized by cart.js, create it now
if (!window.WeightGainState) {
  window.WeightGainState = {
    state: {
      cart: window.WeightGainCart?.validateCartData
        ? window.WeightGainCart.validateCartData(
            window.WeightGainUtils?.safeJSONParse(localStorage.getItem("wg_cart"), [])
          )
        : [],
      user: null,
      selectedPlan: null,
      billingCycle: "monthly",
      chatOpen: false,
      mobileMenuOpen: false,
      currentCategory: "all",
      testsDisplayed: 12,
    },
    elements: {},
    cachedQueries: {},
  };
}

// Reference to state for convenience
const state = window.WeightGainState.state;

// =============================================================================
// DOM Elements
// =============================================================================

const elements = {
  testGrid: document.getElementById("testsGrid"),
  cartCount: document.getElementById("cartCount"),
  cartToggle: document.getElementById("cart-toggle"),
  mobileToggle: document.getElementById("mobile-toggle"),
  mobileNav: document.getElementById("mobileMenu"),
  chatbotToggle: document.getElementById("chatbot-toggle"),
  chatbotWindow: document.getElementById("chatbot-window"),
  chatbotClose: document.getElementById("chatbot-close"),
  chatbotMessages: document.getElementById("chatbot-messages"),
  chatbotInput: document.getElementById("chatbot-input"),
  chatbotSend: document.getElementById("chatbot-send"),
  chatbotSuggestions: document.getElementById("chatbot-suggestions"),
  loadMore: document.getElementById("load-more"),
  openChatbot: document.getElementById("open-chatbot"),
  ctaChatbot: document.getElementById("cta-chatbot"),
};

// =============================================================================
// Cached DOM Queries (Performance Optimization)
// =============================================================================
const cachedQueries = {
  _categoryTabs: null,
  _mobileNavLinks: null,

  get categoryTabs() {
    if (!this._categoryTabs) {
      this._categoryTabs = document.querySelectorAll(".category-tab");
    }
    return this._categoryTabs;
  },

  get mobileNavLinks() {
    if (!this._mobileNavLinks) {
      this._mobileNavLinks = document.querySelectorAll(".mobile-menu a");
    }
    return this._mobileNavLinks;
  },

  // Clear cache if DOM changes dynamically
  invalidate() {
    this._categoryTabs = null;
    this._mobileNavLinks = null;
  },
};

// =============================================================================
// Optimized Scroll Handling (Combined for Performance)
// =============================================================================

// Single scroll handler for all scroll-based effects (reduces event listener overhead)
const scrollState = {
  handler: null,
  navbar: null,
  backBtn: null,
  helpBtn: null,
  testsSection: null,
  stickyBar: null,
  mobileCTA: null,
  lastScrollY: 0,
  ticking: false,
};

function initCombinedScrollHandler() {
  // Cache DOM references
  scrollState.navbar = document.querySelector(".navbar");
  scrollState.mobileCTA =
    document.getElementById("mobileStickyCta") || document.querySelector(".mobile-sticky-cta");
  scrollState.backBtn = document.getElementById("backToTop");
  scrollState.helpBtn = document.getElementById("helpButton");
  scrollState.testsSection = document.getElementById("tests");
  scrollState.stickyBar = document.getElementById("stickyCartBar");

  // Remove existing handler if any
  if (scrollState.handler) {
    window.removeEventListener("scroll", scrollState.handler);
  }

  // Combined scroll handler using requestAnimationFrame for performance
  scrollState.handler = () => {
    scrollState.lastScrollY = window.scrollY;

    if (!scrollState.ticking) {
      window.requestAnimationFrame(() => {
        handleScrollEffects(scrollState.lastScrollY);
        scrollState.ticking = false;
      });
      scrollState.ticking = true;
    }
  };

  window.addEventListener("scroll", scrollState.handler, { passive: true });
}

function handleScrollEffects(scrollY) {
  // Navbar scrolled effect
  if (scrollState.navbar) {
    if (scrollY > 50) {
      scrollState.navbar.classList.add("scrolled");
    } else {
      scrollState.navbar.classList.remove("scrolled");
    }
  }

  // Floating buttons visibility (using CSS classes instead of inline styles)
  const floatingVisible = scrollY > 500;
  if (scrollState.backBtn) {
    scrollState.backBtn.classList.toggle("js-float-visible", floatingVisible);
    scrollState.backBtn.classList.toggle("js-float-hidden", !floatingVisible);
  }
  if (scrollState.helpBtn) {
    scrollState.helpBtn.classList.toggle("js-float-visible", floatingVisible);
    scrollState.helpBtn.classList.toggle("js-float-hidden", !floatingVisible);
  }

  // Sticky cart bar
  if (scrollState.testsSection && scrollState.stickyBar) {
    const rect = scrollState.testsSection.getBoundingClientRect();
    if (rect.bottom < 0 && state.cart.length > 0) {
      scrollState.stickyBar.classList.add("active");
    } else {
      scrollState.stickyBar.classList.remove("active");
    }
  }

  // Mobile sticky CTA (consolidated from ui.js)
  if (scrollState.mobileCTA && !window.location.pathname.includes("checkout")) {
    scrollState.mobileCTA.classList.toggle("active", scrollY > 400);
  }
}

// Cleanup function for page unload (memory leak prevention)
function cleanupScrollHandlers() {
  if (scrollState.handler) {
    window.removeEventListener("scroll", scrollState.handler);
  }
}

// Cleanup on page unload
window.addEventListener("pagehide", cleanupScrollHandlers);

// =============================================================================
// Legacy Test Rendering Functions (kept for compatibility)
// =============================================================================

function createTestCard(test) {
  const article = document.createElement("article");
  article.className = "test-card";
  article.setAttribute("role", "listitem");
  article.dataset.testId = test.id;

  // Header
  const header = document.createElement("div");
  header.className = "test-card__header";

  const category = document.createElement("span");
  category.className = "test-card__category";
  category.textContent = getCategoryLabel(test.category);

  const title = document.createElement("h3");
  title.className = "test-card__title";
  title.textContent = test.name;

  header.appendChild(category);
  header.appendChild(title);

  // Body
  const body = document.createElement("div");
  body.className = "test-card__body";

  const description = document.createElement("p");
  description.className = "test-card__description";
  description.textContent = test.description;

  const biomarkers = document.createElement("div");
  biomarkers.className = "test-card__biomarkers";
  test.biomarkers.slice(0, 4).forEach((b) => {
    const span = document.createElement("span");
    span.className = "test-card__biomarker";
    span.textContent = b;
    biomarkers.appendChild(span);
  });
  if (test.biomarkers.length > 4) {
    const more = document.createElement("span");
    more.className = "test-card__biomarker";
    more.textContent = `+${test.biomarkers.length - 4} more`;
    biomarkers.appendChild(more);
  }

  const info = document.createElement("div");
  info.className = "js-test-card-info";
  const turnaround = document.createElement("span");
  turnaround.textContent = test.turnaround;
  const fasting = document.createElement("span");
  fasting.textContent = test.fasting ? "Fasting required" : "No fasting";
  info.appendChild(turnaround);
  info.appendChild(fasting);

  body.appendChild(description);
  body.appendChild(biomarkers);
  body.appendChild(info);

  // Footer
  const footer = document.createElement("div");
  footer.className = "test-card__footer";

  const priceWrapper = document.createElement("div");
  const price = document.createElement("span");
  price.className = "test-card__price";
  price.textContent = `$${test.price}`;
  const priceLabel = document.createElement("span");
  priceLabel.className = "test-card__price-label";
  priceLabel.textContent = " per test";
  priceWrapper.appendChild(price);
  priceWrapper.appendChild(priceLabel);

  const button = document.createElement("button");
  button.className = "btn btn--primary btn--sm";
  button.setAttribute("aria-label", `Add ${test.name} to cart`);
  button.dataset.action = "addToCart";
  button.dataset.testId = test.id;
  button.textContent = "Add to Cart";

  footer.appendChild(priceWrapper);
  footer.appendChild(button);

  article.appendChild(header);
  article.appendChild(body);
  article.appendChild(footer);

  return article;
}

function renderTests(category = "all", limit = 6) {
  if (!elements.testGrid) {
    return;
  }

  const testCatalog = window.WeightGainPlans?.testCatalog || [];
  const filteredTests =
    category === "all" ? testCatalog : testCatalog.filter((test) => test.category === category);

  const testsToShow = filteredTests.slice(0, limit);

  // Clear existing content safely
  elements.testGrid.textContent = "";

  // Use DocumentFragment for better performance
  const fragment = document.createDocumentFragment();
  testsToShow.forEach((test) => {
    fragment.appendChild(createTestCard(test));
  });
  elements.testGrid.appendChild(fragment);

  // Update load more button visibility
  if (elements.loadMore) {
    elements.loadMore.style.display = limit >= filteredTests.length ? "none" : "inline-flex";
  }
}

function getCategoryLabel(category) {
  const labels = {
    hormones: "Performance Hormone",
    thyroid: "Thyroid",
    metabolic: "Metabolic",
    panels: "Complete Panel",
  };
  return labels[category] || category;
}

// =============================================================================
// Legacy Chatbot Functions (kept for compatibility)
// =============================================================================

const chatResponses = {
  testosterone: {
    keywords: ["testosterone", "test", "t levels", "low t", "trt", "hypogonadism"],
    response: `For testosterone optimization, I'd recommend starting with our **Testosterone Complete Panel** ($129). It includes Total T, Free T, SHBG, and Albumin - giving you the full picture of your testosterone status.

If you're already on TRT, our **TRT Monitoring Panel** ($199) adds estradiol, hematocrit, PSA, and liver function.

Would you like me to add either of these to your cart?`,
    suggestions: ["Add Testosterone Complete", "Add TRT Monitoring", "Tell me more about Free T"],
  },
  default: {
    response: `I can help you find the right tests for your goals. Here are some common starting points:

**Performance Baseline** ($299) - Complete overview for athletes
**Male Hormone Panel** ($149) - Essential testosterone assessment
**Complete Performance** ($179) - Our most comprehensive panel

What specific aspect of your health are you looking to optimize?`,
    suggestions: ["Testosterone optimization", "Fatigue & energy", "Full baseline"],
  },
};

function getChatResponse(message) {
  const lowerMessage = message.toLowerCase();

  for (const [key, data] of Object.entries(chatResponses)) {
    if (key === "default") {
      continue;
    }
    if (data.keywords && data.keywords.some((kw) => lowerMessage.includes(kw))) {
      return data;
    }
  }

  return chatResponses.default;
}

function addChatMessage(content, isUser = false) {
  const chatbotMessages = elements.chatbotMessages;
  if (!chatbotMessages) {
    return;
  }

  const messageDiv = document.createElement("div");
  messageDiv.className = `chatbot__message chatbot__message--${isUser ? "user" : "bot"}`;

  if (isUser) {
    messageDiv.textContent = content;
  } else {
    // Parse markdown safely using DOM methods to prevent XSS
    const lines = content.split('\n');
    lines.forEach((line, i) => {
      const span = document.createElement('span');
      // Handle **bold** safely by splitting on the pattern
      const parts = line.split(/\*\*([^*]+)\*\*/g);
      parts.forEach((part, j) => {
        if (j % 2 === 1) {
          // Odd indices are the captured bold text
          const strong = document.createElement('strong');
          strong.textContent = part;
          span.appendChild(strong);
        } else {
          // Even indices are regular text
          span.appendChild(document.createTextNode(part));
        }
      });
      messageDiv.appendChild(span);
      if (i < lines.length - 1) {
        messageDiv.appendChild(document.createElement('br'));
      }
    });
  }

  chatbotMessages.appendChild(messageDiv);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function updateChatSuggestions(suggestions) {
  if (!elements.chatbotSuggestions) {
    return;
  }

  if (suggestions && suggestions.length > 0) {
    elements.chatbotSuggestions.textContent = "";

    suggestions.forEach((s) => {
      const button = document.createElement("button");
      button.className = "chatbot__suggestion";
      button.dataset.message = s;
      button.textContent = s;
      elements.chatbotSuggestions.appendChild(button);
    });
    elements.chatbotSuggestions.style.display = "flex";
  } else {
    elements.chatbotSuggestions.style.display = "none";
  }
}

function handleChatMessage(message) {
  if (!message.trim()) {
    return;
  }

  addChatMessage(message, true);

  if (elements.chatbotInput) {
    elements.chatbotInput.value = "";
  }

  const response = getChatResponse(message);

  setTimeout(() => {
    addChatMessage(response.response);
    updateChatSuggestions(response.suggestions);
  }, 500);
}

function toggleChatbot(open) {
  state.chatOpen = open !== undefined ? open : !state.chatOpen;

  if (elements.chatbotWindow) {
    elements.chatbotWindow.classList.toggle("open", state.chatOpen);
    elements.chatbotWindow.setAttribute("aria-hidden", !state.chatOpen);
  }

  if (elements.chatbotToggle) {
    elements.chatbotToggle.setAttribute("aria-expanded", state.chatOpen);
  }
}

// =============================================================================
// Centralized Event Delegation (replaces inline onclick handlers)
// =============================================================================

const actions = {
  addToCart: (e) => {
    const actionEl = e.target.closest("[data-action]");
    const testId = actionEl?.dataset.testId;
    if (testId && window.WeightGainCart?.addToCart) {
      window.WeightGainCart.addToCart(testId);
    }
  },
  addToCartFromAI: (e) => {
    const actionEl = e.target.closest("[data-action]");
    const testId = actionEl?.dataset.testId;
    if (testId && window.WeightGainCart?.addToCartFromAI) {
      window.WeightGainCart.addToCartFromAI(testId);
    }
  },
  addToCartAndClose: (e) => {
    const actionEl = e.target.closest("[data-action]");
    const testId = actionEl?.dataset.testId;
    if (testId && window.WeightGainCart?.addToCart) {
      window.WeightGainCart.addToCart(testId);
      if (window.WeightGainUI?.closeQuickView) {
        window.WeightGainUI.closeQuickView();
      }
    }
  },
  selectLab: (e) => {
    if (window.WeightGainUI?.selectLab) {
      window.WeightGainUI.selectLab(e.target.closest("[data-action]"));
    }
  },
  toggleMobileMenu: () => {
    if (window.WeightGainUI?.toggleMobileMenu) {
      window.WeightGainUI.toggleMobileMenu();
    }
  },
  toggleCart: () => {
    if (window.WeightGainCart?.toggleCart) {
      window.WeightGainCart.toggleCart();
    }
  },
  openAuthModal: (e) => {
    const type = e.target.closest("[data-auth-type]")?.dataset.authType || "signin";
    if (window.WeightGainUI?.openAuthModal) {
      window.WeightGainUI.openAuthModal(type);
    }
  },
  closeAuthModal: () => {
    if (window.WeightGainUI?.closeAuthModal) {
      window.WeightGainUI.closeAuthModal();
    }
  },
  switchAuthForm: (e) => {
    const type = e.target.closest("[data-form-type]")?.dataset.formType;
    if (type && window.WeightGainUI?.switchAuthForm) {
      window.WeightGainUI.switchAuthForm(type);
    }
  },
  showForgotPassword: (e) => {
    e.preventDefault();
    if (window.WeightGainUI?.showForgotPassword) {
      window.WeightGainUI.showForgotPassword(e);
    }
  },
  sendAiMessage: () => {
    if (window.WeightGainAIChat?.sendAiMessage) {
      window.WeightGainAIChat.sendAiMessage();
    }
  },
  sendAiPreset: (e) => {
    const message = e.target.closest("[data-message]")?.dataset.message;
    if (message && window.WeightGainAIChat?.sendAiMessage) {
      window.WeightGainAIChat.sendAiMessage(message);
    }
  },
  closeWelcomePopup: () => {
    if (window.WeightGainUI?.closeWelcomePopup) {
      window.WeightGainUI.closeWelcomePopup();
    }
  },
  copyWelcomeCode: () => {
    if (window.WeightGainUI?.copyWelcomeCode) {
      window.WeightGainUI.copyWelcomeCode();
    }
  },
  submitWelcomeEmail: () => {
    if (window.WeightGainUI?.submitWelcomeEmail) {
      window.WeightGainUI.submitWelcomeEmail();
    }
  },
  closeExitPopup: () => {
    if (window.WeightGainUI?.closeExitPopup) {
      window.WeightGainUI.closeExitPopup();
    }
  },
  submitExitEmail: () => {
    if (window.WeightGainUI?.submitExitEmail) {
      window.WeightGainUI.submitExitEmail();
    }
  },
  closeSocialProof: () => {
    if (window.WeightGainUI?.closeSocialProof) {
      window.WeightGainUI.closeSocialProof();
    }
  },
  acceptCookies: () => {
    if (window.WeightGainUI?.acceptCookies) {
      window.WeightGainUI.acceptCookies();
    }
  },
  declineCookies: () => {
    if (window.WeightGainUI?.declineCookies) {
      window.WeightGainUI.declineCookies();
    }
  },
  findLabs: () => {
    if (window.WeightGainUI?.findLabs) {
      window.WeightGainUI.findLabs();
    }
  },
  filterTests: (e) => {
    const category = e.target.closest("[data-category]")?.dataset.category;
    if (category && window.WeightGainUI?.filterTests) {
      window.WeightGainUI.filterTests(category, e.target);
    }
  },
  selectPlan: (e) => {
    const planId = e.target.closest("[data-plan-id]")?.dataset.planId;
    if (planId && window.WeightGainPlans?.selectPlan) {
      window.WeightGainPlans.selectPlan(planId);
    }
  },
  closeUpsellModal: () => {
    if (window.WeightGainUI?.closeUpsellModal) {
      window.WeightGainUI.closeUpsellModal();
    }
  },
  addUpsellToCart: () => {
    if (window.WeightGainUI?.addUpsellToCart) {
      window.WeightGainUI.addUpsellToCart();
    }
  },
  openLabModal: () => {
    if (window.WeightGainUI?.openLabModal) {
      window.WeightGainUI.openLabModal();
    }
  },
  closeLabModal: () => {
    if (window.WeightGainUI?.closeLabModal) {
      window.WeightGainUI.closeLabModal();
    }
  },
  searchLabsInModal: () => {
    if (window.WeightGainUI?.searchLabsInModal) {
      window.WeightGainUI.searchLabsInModal();
    }
  },
  closeQuickView: () => {
    if (window.WeightGainUI?.closeQuickView) {
      window.WeightGainUI.closeQuickView();
    }
  },
  closeCartSidebar: () => {
    if (window.WeightGainCart?.closeCartSidebar) {
      window.WeightGainCart.closeCartSidebar();
    }
  },
  closePairingModal: () => {
    if (window.WeightGainUI?.closePairingModal) {
      window.WeightGainUI.closePairingModal();
    }
  },
  goToCheckout: () => {
    if (window.WeightGainCart?.closeCartSidebar) {
      window.WeightGainCart.closeCartSidebar();
    }
    window.location.href = "checkout.html";
  },
  openQuickView: (e) => {
    const testId = e.target.closest("[data-test-id]")?.dataset.testId;
    if (testId && window.WeightGainUI?.openQuickView) {
      window.WeightGainUI.openQuickView(testId);
    }
  },
  scrollToTop: () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  },
  scrollToChat: () => {
    const input = document.getElementById("aiChatInput");
    if (input) {
      input.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => input.focus(), 500);
    }
  },
};

function initEventDelegation() {
  document.addEventListener("click", (e) => {
    const actionEl = e.target.closest("[data-action]");
    if (actionEl) {
      const action = actionEl.dataset.action;
      if (actions[action]) {
        e.preventDefault();
        actions[action](e);
      }
    }
  });

  // Handle Enter key for inputs with data-action-enter
  document.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const actionEl = e.target.closest("[data-action-enter]");
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
  document.addEventListener("input", (e) => {
    const actionEl = e.target.closest("[data-action-input]");
    if (actionEl) {
      const action = actionEl.dataset.actionInput;
      if (action === "searchTests" && window.WeightGainUI?.searchTests) {
        window.WeightGainUI.searchTests(e.target.value);
      }
    }
  });
}

// =============================================================================
// Keyboard Navigation & Focus Management
// =============================================================================

function initKeyboardNavigation() {
  // Close modals on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (window.WeightGainUI?.closeQuickView) {
        window.WeightGainUI.closeQuickView();
      }
      if (window.WeightGainUI?.closeLabModal) {
        window.WeightGainUI.closeLabModal();
      }
      if (window.WeightGainUI?.closeUpsellModal) {
        window.WeightGainUI.closeUpsellModal();
      }
      if (window.WeightGainUI?.closeAuthModal) {
        window.WeightGainUI.closeAuthModal();
      }
      if (window.WeightGainUI?.closeWelcomePopup) {
        window.WeightGainUI.closeWelcomePopup();
      }
      if (window.WeightGainUI?.closeExitPopup) {
        window.WeightGainUI.closeExitPopup();
      }
      if (state.mobileMenuOpen && window.WeightGainUI?.toggleMobileMenu) {
        window.WeightGainUI.toggleMobileMenu(false);
      }
    }
  });

  // Focus trap for modals
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") {
      return;
    }

    const activeModal = document.querySelector(
      '.auth-modal.active, .lab-modal.active, .welcome-popup.active, #quickViewModal[style*="block"]'
    );
    if (!activeModal) {
      return;
    }

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
// Event Listeners
// =============================================================================

function initEventListeners() {
  // Mobile menu toggle
  if (elements.mobileToggle) {
    elements.mobileToggle.addEventListener("click", () => {
      if (window.WeightGainUI?.toggleMobileMenu) {
        window.WeightGainUI.toggleMobileMenu();
      }
    });
  }

  // Chatbot toggle
  if (elements.chatbotToggle) {
    elements.chatbotToggle.addEventListener("click", () => toggleChatbot());
  }

  // Chatbot close
  if (elements.chatbotClose) {
    elements.chatbotClose.addEventListener("click", () => toggleChatbot(false));
  }

  // Chatbot send
  if (elements.chatbotSend) {
    elements.chatbotSend.addEventListener("click", () => {
      if (elements.chatbotInput) {
        handleChatMessage(elements.chatbotInput.value);
      }
    });
  }

  // Chatbot input enter key
  if (elements.chatbotInput) {
    elements.chatbotInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleChatMessage(elements.chatbotInput.value);
      }
    });
  }

  // Chatbot suggestions
  if (elements.chatbotSuggestions) {
    elements.chatbotSuggestions.addEventListener("click", (e) => {
      if (e.target.classList.contains("chatbot__suggestion")) {
        handleChatMessage(e.target.dataset.message);
      }
    });
  }

  // Open chatbot buttons
  if (elements.openChatbot) {
    elements.openChatbot.addEventListener("click", () => toggleChatbot(true));
  }
  if (elements.ctaChatbot) {
    elements.ctaChatbot.addEventListener("click", () => toggleChatbot(true));
  }

  // Load more tests
  if (elements.loadMore) {
    elements.loadMore.addEventListener("click", () => {
      state.testsDisplayed += 6;
      renderTests(state.currentCategory, state.testsDisplayed);
    });
  }

  // Cart toggle
  if (elements.cartToggle) {
    elements.cartToggle.addEventListener("click", () => {
      window.location.href = "checkout.html";
    });
  }

  // Close mobile menu on link click (uses cached query)
  cachedQueries.mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.WeightGainUI?.toggleMobileMenu) {
        window.WeightGainUI.toggleMobileMenu(false);
      }
    });
  });

  // Featured panel add to cart
  const featuredBtn = document.querySelector('[data-test-id="complete-panel"]');
  if (featuredBtn && window.WeightGainCart?.addToCart) {
    featuredBtn.addEventListener("click", () =>
      window.WeightGainCart.addToCart("complete-performance")
    );
  }
}

// =============================================================================
// Animations CSS (injected)
// =============================================================================

function injectAnimationStyles() {
  const style = document.createElement("style");
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
// Initialize Application
// =============================================================================

function init() {
  // Scroll to top on page load (except checkout and lab finder sections)
  const currentPath = window.location.pathname;
  const currentHash = window.location.hash;
  const isCheckout = currentPath.includes("checkout");
  const isLabSection = currentHash === "#locations";

  if (!isCheckout && !isLabSection) {
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  injectAnimationStyles();

  // Initialize billing toggle for subscription pricing
  if (window.WeightGainPlans?.initBillingToggle) {
    window.WeightGainPlans.initBillingToggle();
  }
  if (window.WeightGainPlans?.updatePricingDisplay) {
    window.WeightGainPlans.updatePricingDisplay();
  }

  initEventListeners();
  initEventDelegation(); // Centralized event handling
  initKeyboardNavigation(); // Accessibility
  initCombinedScrollHandler(); // Single optimized scroll handler

  if (window.WeightGainCart?.updateCartUI) {
    window.WeightGainCart.updateCartUI();
  }

  // Initialize interactive features
  if (window.WeightGainUI?.initWelcomePopup) {
    window.WeightGainUI.initWelcomePopup();
  }
  if (window.WeightGainUI?.initExitIntent) {
    window.WeightGainUI.initExitIntent();
  }
  if (window.WeightGainUI?.initMobileStickyCTA) {
    window.WeightGainUI.initMobileStickyCTA();
  }
  if (window.WeightGainUI?.initStickyCartBar) {
    window.WeightGainUI.initStickyCartBar();
  }
  if (window.WeightGainUI?.initCookieBanner) {
    window.WeightGainUI.initCookieBanner();
  }

  // Security: Populate CSRF tokens
  if (window.WeightGainUtils?.populateCSRFTokens) {
    window.WeightGainUtils.populateCSRFTokens();
  }
}

// Run on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// =============================================================================
// Exports for other pages
// =============================================================================

// Make state and modules available globally
window.WeightGainState = {
  state,
  elements,
  cachedQueries,
};

// Legacy exports for backward compatibility
window.WeightGain = {
  addToCart: window.WeightGainCart?.addToCart,
  removeFromCart: window.WeightGainCart?.removeFromCart,
  getCartTotal: window.WeightGainCart?.getCartTotal,
  selectPlan: window.WeightGainPlans?.selectPlan,
  state,
  subscriptionPlans: window.WeightGainPlans?.subscriptionPlans,
  restrictedStates: window.WeightGainUtils?.restrictedStates,
  checkStateRestriction: window.WeightGainUtils?.checkStateRestriction,
};

// Global function exports for HTML onclick handlers
window.sendAiMessage = window.WeightGainAIChat?.sendAiMessage;
window.handleAiKeypress = window.WeightGainAIChat?.handleAiKeypress;
window.closeWelcomePopup = window.WeightGainUI?.closeWelcomePopup;
window.copyWelcomeCode = window.WeightGainUI?.copyWelcomeCode;
window.closeExitPopup = window.WeightGainUI?.closeExitPopup;
window.submitExitEmail = window.WeightGainUI?.submitExitEmail;
window.closeSocialProof = window.WeightGainUI?.closeSocialProof;
window.openAuthModal = window.WeightGainUI?.openAuthModal;
window.closeAuthModal = window.WeightGainUI?.closeAuthModal;
window.switchAuthForm = window.WeightGainUI?.switchAuthForm;
window.handleSignIn = window.WeightGainUI?.handleSignIn;
window.handleSignUp = window.WeightGainUI?.handleSignUp;
window.showForgotPassword = window.WeightGainUI?.showForgotPassword;
window.handleForgotPassword = window.WeightGainUI?.handleForgotPassword;
window.acceptCookies = window.WeightGainUI?.acceptCookies;
window.declineCookies = window.WeightGainUI?.declineCookies;
window.findLabs = window.WeightGainUI?.findLabs;
window.toggleCart = window.WeightGainCart?.toggleCart;
window.filterTests = window.WeightGainUI?.filterTests;
window.searchTests = window.WeightGainUI?.searchTests;
window.selectPlan = window.WeightGainPlans?.selectPlan;
window.initBillingToggle = window.WeightGainPlans?.initBillingToggle;
window.updatePricingDisplay = window.WeightGainPlans?.updatePricingDisplay;
window.toggleMobileMenu = window.WeightGainUI?.toggleMobileMenu;
window.showUpsellModal = window.WeightGainUI?.showUpsellModal;
window.closeUpsellModal = window.WeightGainUI?.closeUpsellModal;
window.addUpsellToCart = window.WeightGainUI?.addUpsellToCart;
window.openLabModal = window.WeightGainUI?.openLabModal;
window.closeLabModal = window.WeightGainUI?.closeLabModal;
window.searchLabsInModal = window.WeightGainUI?.searchLabsInModal;
window.selectLab = window.WeightGainUI?.selectLab;
window.openQuickView = window.WeightGainUI?.openQuickView;
window.closeQuickView = window.WeightGainUI?.closeQuickView;
window.openCartSidebar = window.WeightGainCart?.openCartSidebar;
window.closeCartSidebar = window.WeightGainCart?.closeCartSidebar;
window.renderCartSidebar = window.WeightGainCart?.renderCartSidebar;
window.showPairingModal = window.WeightGainUI?.showPairingModal;
window.closePairingModal = window.WeightGainUI?.closePairingModal;
window.addPairingToCart = window.WeightGainPlans?.addPairingToCart;

// =============================================================================
// Lab Prep Toggle Function
// =============================================================================

/**
 * Toggle lab preparation info visibility
 */
function toggleLabPrep() {
  const content = document.getElementById("lab-info-content");
  const toggleBtn = document.querySelector(".lab-info-toggle");

  if (content && toggleBtn) {
    const isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
    toggleBtn.setAttribute("aria-expanded", !isExpanded);
    content.classList.toggle("collapsed", isExpanded);
  }
}

window.toggleLabPrep = toggleLabPrep;

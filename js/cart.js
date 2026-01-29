/**
 * WeightGain - Cart Management
 * Handles cart operations, validation, and UI updates
 */

// Dependencies: WeightGainUtils, WeightGainUI

// =============================================================================
// Cached DOM Elements (Performance Optimization)
// =============================================================================

const cartElements = {
  _cache: {},
  get(id) {
    if (!this._cache[id]) {
      this._cache[id] = document.getElementById(id);
    }
    return this._cache[id];
  },
  invalidate(id) {
    if (id) {
      delete this._cache[id];
    } else {
      this._cache = {};
    }
  },
};

// =============================================================================
// Cart Data Validation
// =============================================================================

function validateCartItem(item) {
  if (!item || typeof item !== "object") {
    return null;
  }

  // Validate required fields
  if (typeof item.id !== "string" || !item.id.match(/^[a-z0-9-]+$/)) {
    return null;
  }
  if (typeof item.name !== "string" || item.name.length > 200) {
    return null;
  }
  if (typeof item.price !== "number" || item.price < 0 || item.price > 10000) {
    return null;
  }
  if (
    item.quantity !== undefined &&
    (typeof item.quantity !== "number" || item.quantity < 1 || item.quantity > 100)
  ) {
    return null;
  }

  // Return sanitized item (preserve subscription fields)
  const sanitized = {
    id: item.id,
    name: item.name.substring(0, 200),
    price: Math.round(item.price * 100) / 100,
    quantity: item.quantity || 1,
  };

  // Preserve subscription-specific fields if present
  if (item.billingCycle && ["monthly", "yearly", "one-time"].includes(item.billingCycle)) {
    sanitized.billingCycle = item.billingCycle;
  }
  if (item.billingLabel && typeof item.billingLabel === "string") {
    sanitized.billingLabel = item.billingLabel.substring(0, 50);
  }
  if (Array.isArray(item.includes)) {
    sanitized.includes = item.includes
      .filter((i) => typeof i === "string")
      .slice(0, 20)
      .map((i) => i.substring(0, 200));
  }

  return sanitized;
}

function validateCartData(data) {
  if (!Array.isArray(data)) {
    return [];
  }
  return data
    .map(validateCartItem)
    .filter((item) => item !== null)
    .slice(0, 50);
}

// =============================================================================
// Cart Functions
// =============================================================================

function addToCart(testId) {
  const state = window.WeightGainState?.state;
  if (!state) {
    window.WeightGainLogger?.warn("State not initialized");
    return;
  }

  const testCatalog = window.WeightGainPlans?.testCatalog || [];
  const test = testCatalog.find((t) => t.id === testId);
  if (!test) {
    return;
  }

  const existingItem = state.cart.find((item) => item.id === testId);
  if (existingItem) {
    if (window.WeightGainUI?.showNotification) {
      window.WeightGainUI.showNotification("This test is already in your cart", "info");
    }
    return;
  }

  state.cart.push({
    id: test.id,
    name: test.name,
    price: test.price,
    quantity: 1,
  });

  // Track "Added to Cart" in Klaviyo
  if (window.WeightGainKlaviyo?.trackAddedToCart) {
    window.WeightGainKlaviyo.trackAddedToCart({ id: test.id, name: test.name, price: test.price, quantity: 1 });
  }

  saveCart();
  updateCartUI();
  if (window.WeightGainUI?.showNotification) {
    window.WeightGainUI.showNotification(`${test.name} added to cart`, "success");
  }
}

function removeFromCart(testId) {
  const state = window.WeightGainState?.state;
  if (!state) {
    return;
  }
  state.cart = state.cart.filter((item) => item.id !== testId);
  saveCart();
  updateCartUI();
}

function saveCart() {
  const state = window.WeightGainState?.state;
  if (!state) {
    return;
  }

  try {
    if (window.WeightGainLogger) {
      window.WeightGainLogger.log("Saving cart:", state.cart);
    }
    localStorage.setItem("wg_cart", JSON.stringify(state.cart));
  } catch (error) {
    if (window.WeightGainLogger) {
      window.WeightGainLogger.error("Failed to save cart:", error);
    }
  }
}

function getCartTotal() {
  const state = window.WeightGainState?.state;
  if (!state) {
    return 0;
  }
  return state.cart.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
}

function updateCartUI() {
  const state = window.WeightGainState?.state;
  if (!state) {
    return;
  }

  const count = state.cart.length;
  const total = getCartTotal();

  // Update header cart count
  const cartCount = cartElements.get("cartCount");
  if (cartCount) {
    cartCount.textContent = count;
    cartCount.style.display = count > 0 ? "flex" : "none";
  }

  // Update sticky cart bar
  const stickyCount = cartElements.get("stickyCartCount");
  const stickyTotal = cartElements.get("stickyCartTotal");
  if (stickyCount) {
    stickyCount.textContent = count;
  }
  if (stickyTotal) {
    stickyTotal.textContent = total.toFixed(2);
  }
}

// =============================================================================
// Cart Sidebar Functions
// =============================================================================

function toggleCart() {
  const sidebar = cartElements.get("cartSidebar");
  const overlay = cartElements.get("cartSidebarOverlay");

  if (!sidebar || !overlay) {
    // Fallback to checkout if sidebar doesn't exist
    window.location.href = "checkout.html";
    return;
  }

  const isOpen = sidebar.classList.contains("active");

  if (isOpen) {
    closeCartSidebar();
  } else {
    openCartSidebar();
  }
}

function openCartSidebar() {
  const sidebar = cartElements.get("cartSidebar");
  const overlay = cartElements.get("cartSidebarOverlay");

  if (sidebar && overlay) {
    sidebar.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
    renderCartSidebar();
  }
}

function closeCartSidebar() {
  const sidebar = cartElements.get("cartSidebar");
  const overlay = cartElements.get("cartSidebarOverlay");

  if (sidebar) {
    sidebar.classList.remove("active");
  }
  if (overlay) {
    overlay.classList.remove("active");
  }
  document.body.style.overflow = "";
}

function renderCartSidebar() {
  const state = window.WeightGainState?.state;
  if (!state) {
    return;
  }

  const itemsContainer = cartElements.get("cartSidebarItems");
  const totalEl = cartElements.get("cartSidebarTotal");
  const emptyState = cartElements.get("cartSidebarEmpty");
  const cartContent = cartElements.get("cartSidebarContent");

  if (!itemsContainer) {
    return;
  }

  // Clear existing items
  itemsContainer.textContent = "";

  if (state.cart.length === 0) {
    if (emptyState) {
      emptyState.style.display = "block";
    }
    if (cartContent) {
      cartContent.style.display = "none";
    }
    return;
  }

  if (emptyState) {
    emptyState.style.display = "none";
  }
  if (cartContent) {
    cartContent.style.display = "block";
  }

  state.cart.forEach((item) => {
    const isSubscription = item.billingCycle;
    const suffix =
      item.billingCycle === "monthly" ? "/mo" : item.billingCycle === "yearly" ? "/yr" : "";

    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-sidebar-item";

    const itemInfo = document.createElement("div");
    itemInfo.className = "cart-sidebar-item-info";

    const nameDiv = document.createElement("div");
    nameDiv.className = "cart-sidebar-item-name";
    nameDiv.textContent = item.name;

    const priceDiv = document.createElement("div");
    priceDiv.className = "cart-sidebar-item-price";
    priceDiv.textContent = `$${item.price}${suffix}`;

    if (isSubscription && item.billingLabel) {
      const badge = document.createElement("span");
      badge.className = "cart-sidebar-item-badge";
      badge.textContent = item.billingLabel;
      nameDiv.appendChild(badge);
    }

    itemInfo.appendChild(nameDiv);
    itemInfo.appendChild(priceDiv);

    const removeBtn = document.createElement("button");
    removeBtn.className = "cart-sidebar-item-remove";
    removeBtn.textContent = "×";
    removeBtn.setAttribute("aria-label", `Remove ${item.name}`);
    removeBtn.addEventListener("click", () => {
      removeFromCartSidebar(item.id);
    });

    itemDiv.appendChild(itemInfo);
    itemDiv.appendChild(removeBtn);
    itemsContainer.appendChild(itemDiv);
  });

  // Update total
  const total = getCartTotal();
  const hasMonthly = state.cart.some((item) => item.billingCycle === "monthly");
  if (totalEl) {
    totalEl.textContent = `$${total.toFixed(2)}${hasMonthly ? "/mo" : ""}`;
  }
}

function removeFromCartSidebar(itemId) {
  removeFromCart(itemId);
  renderCartSidebar();
}

function addToCartFromAI(testId) {
  addToCart(testId);
  if (window.WeightGainUI?.showToast) {
    window.WeightGainUI.showToast("Added to cart!");
  }
}

// =============================================================================
// Initialize State (after validation functions are defined)
// =============================================================================

if (!window.WeightGainState) {
  window.WeightGainState = {
    state: {
      cart: [],
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

  // Initialize cart from localStorage if utils are available
  if (window.WeightGainUtils?.safeJSONParse) {
    const cartData = window.WeightGainUtils.safeJSONParse(localStorage.getItem("wg_cart"), []);
    window.WeightGainState.state.cart = validateCartData(cartData);
  }
}

// Export for use in other modules
window.WeightGainCart = {
  addToCart,
  removeFromCart,
  saveCart,
  getCartTotal,
  updateCartUI,
  toggleCart,
  openCartSidebar,
  closeCartSidebar,
  renderCartSidebar,
  removeFromCartSidebar,
  addToCartFromAI,
  validateCartItem,
  validateCartData,
};

/**
 * WeightGain - Klaviyo Integration
 * Email marketing tracking and user identification via Klaviyo public JS SDK
 */

// =============================================================================
// Configuration
// =============================================================================

const KLAVIYO_PUBLIC_API_KEY = "YOUR_PUBLIC_API_KEY"; // TODO: Replace with real Klaviyo public API key

const KLAVIYO_LISTS = {
  newsletter: "NEWSLETTER_LIST_ID", // TODO: Replace with real list ID
  welcomePopup: "WELCOME_POPUP_LIST_ID", // TODO: Replace with real list ID
  exitIntent: "EXIT_INTENT_LIST_ID", // TODO: Replace with real list ID
  checkout: "CHECKOUT_LIST_ID", // TODO: Replace with real list ID
};

// =============================================================================
// Klaviyo Initialization Queue (handles async SDK loading race condition)
// =============================================================================

// Klaviyo's SDK loads asynchronously. This proxy-based queue captures method
// calls made before the SDK is ready, then replays them once it loads.

const _klaviyoQueue = [];
let _klaviyoReady = false;

function _getKlaviyoProxy() {
  // If Klaviyo SDK is loaded, return it directly
  if (typeof window.klaviyo !== "undefined" && window.klaviyo.identify) {
    _klaviyoReady = true;
    return window.klaviyo;
  }

  // Return a proxy that queues method calls
  return new Proxy(
    {},
    {
      get(_target, prop) {
        return function (...args) {
          _klaviyoQueue.push({ method: prop, args });
          if (window.WeightGainLogger) {
            window.WeightGainLogger.log(`Klaviyo: queued ${prop}`, args);
          }
        };
      },
    }
  );
}

// Flush queued calls once SDK loads
function _flushKlaviyoQueue() {
  if (_klaviyoReady || typeof window.klaviyo === "undefined") {
    return;
  }
  _klaviyoReady = true;

  if (window.WeightGainLogger) {
    window.WeightGainLogger.log(`Klaviyo: flushing ${_klaviyoQueue.length} queued calls`);
  }

  _klaviyoQueue.forEach(({ method, args }) => {
    if (typeof window.klaviyo[method] === "function") {
      window.klaviyo[method](...args);
    }
  });
  _klaviyoQueue.length = 0;
}

// Poll for SDK readiness
const _klaviyoPollInterval = setInterval(() => {
  if (typeof window.klaviyo !== "undefined" && window.klaviyo.identify) {
    clearInterval(_klaviyoPollInterval);
    _flushKlaviyoQueue();
  }
}, 500);

// Stop polling after 30 seconds
setTimeout(() => {
  clearInterval(_klaviyoPollInterval);
  if (!_klaviyoReady && window.WeightGainLogger) {
    window.WeightGainLogger.warn("Klaviyo: SDK did not load within 30s");
  }
}, 30000);

// =============================================================================
// Public API
// =============================================================================

/**
 * Identify a user in Klaviyo with email and optional properties
 */
function identifyUser(email, properties) {
  if (!email) {
    return;
  }

  const klaviyo = _getKlaviyoProxy();
  const payload = { $email: email };

  if (properties) {
    if (properties.firstName) payload.$first_name = properties.firstName;
    if (properties.lastName) payload.$last_name = properties.lastName;
    if (properties.phone) payload.$phone_number = properties.phone;
    Object.keys(properties).forEach((key) => {
      if (!["firstName", "lastName", "phone"].includes(key)) {
        payload[key] = properties[key];
      }
    });
  }

  klaviyo.identify(payload);
  if (window.WeightGainLogger) {
    window.WeightGainLogger.log("Klaviyo: identify", payload);
  }
}

/**
 * Track a generic event in Klaviyo
 */
function trackEvent(name, properties) {
  const klaviyo = _getKlaviyoProxy();
  klaviyo.track(name, properties || {});
  if (window.WeightGainLogger) {
    window.WeightGainLogger.log("Klaviyo: track", name, properties);
  }
}

/**
 * Track a "Viewed Product" event (for a plan)
 */
function trackViewedProduct(plan) {
  if (!plan) return;
  trackEvent("Viewed Product", {
    ProductName: plan.name || "Total Optimization",
    ProductID: plan.id || "optimization",
    Price: plan.price || 249,
    URL: window.location.href,
  });
}

/**
 * Track an "Added to Cart" event
 */
function trackAddedToCart(item) {
  if (!item) return;
  trackEvent("Added to Cart", {
    ProductName: item.name,
    ProductID: item.id,
    Price: item.price,
    Quantity: item.quantity || 1,
    URL: window.location.href,
  });
}

/**
 * Track a "Started Checkout" event
 */
function trackStartedCheckout(cart) {
  if (!cart || !Array.isArray(cart)) return;
  const total = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  trackEvent("Started Checkout", {
    ItemNames: cart.map((item) => item.name),
    ItemCount: cart.length,
    TotalPrice: total,
    URL: window.location.href,
  });
}

/**
 * Track a "Placed Order" event
 */
function trackPlacedOrder(orderData) {
  if (!orderData) return;
  trackEvent("Placed Order", {
    OrderID: orderData.orderNumber,
    TotalPrice: orderData.total,
    ItemNames: orderData.itemNames || [],
    ItemCount: orderData.itemCount || 1,
    BillingCycle: orderData.billingCycle || "monthly",
    URL: window.location.href,
  });
}

/**
 * Track an email capture (identifies user + fires event)
 */
function trackEmailCapture(email, source) {
  if (!email) return;
  identifyUser(email);
  trackEvent("Email Captured", {
    Source: source || "Unknown",
    URL: window.location.href,
    Timestamp: new Date().toISOString(),
  });
}

/**
 * Track a contact form submission (identifies user + fires event)
 */
function trackContactSubmission(formData) {
  if (!formData || !formData.email) return;
  identifyUser(formData.email, {
    firstName: formData.name,
  });
  trackEvent("Submitted Contact Form", {
    Name: formData.name || "",
    Email: formData.email,
    Subject: formData.subject || "",
    Message: formData.message || "",
    URL: window.location.href,
    Timestamp: new Date().toISOString(),
  });
}

/**
 * Track a page view event (auto-called on init)
 */
function trackPageView() {
  trackEvent("Viewed Page", {
    PageTitle: document.title,
    URL: window.location.href,
    Path: window.location.pathname,
    Referrer: document.referrer || "(direct)",
    Timestamp: new Date().toISOString(),
  });
}

// =============================================================================
// Auto-initialize: track page view
// =============================================================================

trackPageView();

if (window.WeightGainLogger) {
  window.WeightGainLogger.log("Klaviyo: module initialized (key: " + KLAVIYO_PUBLIC_API_KEY + ")");
}

// =============================================================================
// Export
// =============================================================================

window.WeightGainKlaviyo = {
  identifyUser,
  trackEvent,
  trackViewedProduct,
  trackAddedToCart,
  trackStartedCheckout,
  trackPlacedOrder,
  trackEmailCapture,
  trackContactSubmission,
  trackPageView,
};

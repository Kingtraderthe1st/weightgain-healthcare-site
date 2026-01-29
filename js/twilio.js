/**
 * WeightGain - Twilio SMS Integration
 * Stubbed SMS functionality for order confirmations, verification, and marketing
 * TODO: Connect to real Twilio backend endpoints when server is available
 */

// =============================================================================
// Configuration
// =============================================================================

const TWILIO_CONFIG = {
  // TODO: Replace with real backend API base URL
  apiBase: "/api/sms",
  maxVerificationAttempts: 3,
  verificationCodeLength: 6,
  resendCooldownSeconds: 30,
};

// =============================================================================
// Internal Verification State
// =============================================================================

let _verificationState = {
  phone: null,
  status: "unverified", // unverified | pending | verified
  attempts: 0,
};

// =============================================================================
// Simulated Fetch (Stub for backend API calls)
// =============================================================================

/**
 * Simulates a fetch call to a backend endpoint.
 * Returns a simulated success response after a short delay.
 * TODO: Replace with real fetch() calls to your Twilio backend
 */
function _simulatedFetch(endpoint, payload) {
  return new Promise((resolve) => {
    if (window.WeightGainLogger) {
      window.WeightGainLogger.log("Twilio (stub): " + endpoint, payload);
    }

    setTimeout(() => {
      resolve({
        ok: true,
        status: 200,
        data: {
          success: true,
          message: "Simulated success for " + endpoint,
          sid: "SM" + Math.random().toString(36).substr(2, 32),
        },
      });
    }, 800);
  });
}

// =============================================================================
// Phone Utility Functions
// =============================================================================

/**
 * Normalize a phone number to E.164 format (+1XXXXXXXXXX)
 */
function normalizePhone(phone) {
  if (!phone) return "";
  // Strip all non-digit characters
  let digits = phone.replace(/\D/g, "");
  // Remove leading 1 if 11 digits
  if (digits.length === 11 && digits.startsWith("1")) {
    digits = digits.substring(1);
  }
  // Must be 10 digits for US
  if (digits.length !== 10) {
    return "";
  }
  return "+1" + digits;
}

/**
 * Format a phone number for display with masking: (XXX) XXX-4567
 */
function formatPhoneForDisplay(phone) {
  const normalized = normalizePhone(phone);
  if (!normalized) return "";
  // Mask all but last 4 digits
  const last4 = normalized.slice(-4);
  return "(XXX) XXX-" + last4;
}

// =============================================================================
// SMS Sending Methods
// =============================================================================

/**
 * Send an order confirmation SMS
 * TODO: Replace with real Twilio backend endpoint
 */
function sendOrderConfirmation(phone, orderNumber) {
  const normalized = normalizePhone(phone);
  if (!normalized || !orderNumber) {
    return Promise.reject(new Error("Invalid phone or order number"));
  }

  // TODO: Replace with real Twilio backend endpoint
  return _simulatedFetch(TWILIO_CONFIG.apiBase + "/send", {
    to: normalized,
    type: "order_confirmation",
    orderNumber: orderNumber,
    message:
      "WeightGain: Your order " +
      orderNumber +
      " is confirmed! Check your email for lab requisition details. Reply STOP to opt out.",
  });
}

// =============================================================================
// Phone Verification Methods
// =============================================================================

/**
 * Send a verification code to the given phone number
 * TODO: Replace with real Twilio Verify endpoint
 */
function sendVerificationCode(phone) {
  const normalized = normalizePhone(phone);
  if (!normalized) {
    return Promise.reject(new Error("Invalid phone number"));
  }

  if (_verificationState.attempts >= TWILIO_CONFIG.maxVerificationAttempts) {
    return Promise.reject(
      new Error("Maximum verification attempts reached. Please try again later.")
    );
  }

  _verificationState.phone = normalized;
  _verificationState.status = "pending";
  _verificationState.attempts += 1;

  // TODO: Replace with real Twilio Verify endpoint
  return _simulatedFetch(TWILIO_CONFIG.apiBase + "/verify/send", {
    to: normalized,
    channel: "sms",
  }).then((response) => {
    if (!response.ok) {
      return Promise.reject(
        new Error(response.data?.message || "Failed to send verification code")
      );
    }
    if (window.WeightGainLogger) {
      window.WeightGainLogger.log(
        "Twilio: verification code sent to " + formatPhoneForDisplay(normalized)
      );
    }
    return response;
  });
}

/**
 * Check a verification code entered by the user
 * TODO: Replace with real Twilio Verify check endpoint
 */
function checkVerificationCode(phone, code) {
  const normalized = normalizePhone(phone);
  if (!normalized || !code) {
    return Promise.reject(new Error("Phone and code are required"));
  }

  if (code.length !== TWILIO_CONFIG.verificationCodeLength) {
    return Promise.reject(
      new Error("Please enter a " + TWILIO_CONFIG.verificationCodeLength + "-digit code")
    );
  }

  // TODO: Replace with real Twilio Verify check endpoint
  return _simulatedFetch(TWILIO_CONFIG.apiBase + "/verify/check", {
    to: normalized,
    code: code,
  }).then((response) => {
    // Simulated: always succeeds. In production, check response.data.status === 'approved'
    _verificationState.status = "verified";
    _verificationState.phone = normalized;

    // Persist verification in session
    try {
      sessionStorage.setItem("wg_phone_verified", "true");
      sessionStorage.setItem("wg_verified_phone", normalized);
    } catch (e) {
      // sessionStorage may not be available
    }

    if (window.WeightGainLogger) {
      window.WeightGainLogger.log("Twilio: phone verified - " + formatPhoneForDisplay(normalized));
    }
    return response;
  });
}

// =============================================================================
// Marketing Opt-in
// =============================================================================

/**
 * Subscribe a phone number to SMS marketing list
 * TODO: Replace with real Twilio backend endpoint
 */
function addToMarketingList(phone, firstName) {
  const normalized = normalizePhone(phone);
  if (!normalized) {
    return Promise.reject(new Error("Invalid phone number"));
  }

  // TODO: Replace with real Twilio backend endpoint
  return _simulatedFetch(TWILIO_CONFIG.apiBase + "/marketing/subscribe", {
    to: normalized,
    firstName: firstName || "",
    source: "checkout",
    message:
      "WeightGain: You're subscribed to updates! Expect tips, promos & order updates. Msg & data rates apply. Reply STOP to opt out, HELP for help.",
  });
}

// =============================================================================
// Verification State Management
// =============================================================================

/**
 * Get the current verification status
 */
function getVerificationStatus() {
  // Check sessionStorage first for page-reload persistence
  try {
    if (sessionStorage.getItem("wg_phone_verified") === "true") {
      const verifiedPhone = sessionStorage.getItem("wg_verified_phone");
      if (verifiedPhone) {
        _verificationState.status = "verified";
        _verificationState.phone = verifiedPhone;
      }
    }
  } catch (e) {
    // sessionStorage may not be available
  }

  return {
    phone: _verificationState.phone,
    status: _verificationState.status,
    attempts: _verificationState.attempts,
    maxAttempts: TWILIO_CONFIG.maxVerificationAttempts,
    isVerified: _verificationState.status === "verified",
    isPending: _verificationState.status === "pending",
  };
}

/**
 * Reset verification state (e.g., when phone number changes)
 */
function resetVerification() {
  _verificationState = {
    phone: null,
    status: "unverified",
    attempts: 0,
  };

  try {
    sessionStorage.removeItem("wg_phone_verified");
    sessionStorage.removeItem("wg_verified_phone");
  } catch (e) {
    // sessionStorage may not be available
  }

  if (window.WeightGainLogger) {
    window.WeightGainLogger.log("Twilio: verification state reset");
  }
}

// =============================================================================
// Initialize
// =============================================================================

if (window.WeightGainLogger) {
  window.WeightGainLogger.log("Twilio: module initialized (stub mode)");
}

// =============================================================================
// Export
// =============================================================================

window.WeightGainTwilio = {
  sendOrderConfirmation,
  sendVerificationCode,
  checkVerificationCode,
  addToMarketingList,
  formatPhoneForDisplay,
  normalizePhone,
  getVerificationStatus,
  resetVerification,
};

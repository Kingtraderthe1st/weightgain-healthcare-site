/**
 * WeightGain - Utility Functions
 * Security-focused utility module
 */

// =============================================================================
// WeightGainUtils - Global Utility Object
// =============================================================================

window.WeightGainUtils = {
  /**
   * Escape HTML to prevent XSS attacks
   * @param {string} str - String to escape
   * @returns {string} - Escaped string
   */
  escapeHtml(str) {
    if (typeof str !== "string") {
      return "";
    }
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  },

  /**
   * Safely parse JSON with fallback
   * @param {string} json - JSON string to parse
   * @param {*} fallback - Fallback value if parsing fails
   * @returns {*} - Parsed value or fallback
   */
  safeJSONParse(json, fallback = null) {
    if (!json || typeof json !== "string") {
      return fallback;
    }
    try {
      return JSON.parse(json);
    } catch (e) {
      console.warn("JSON parse error:", e);
      return fallback;
    }
  },

  /**
   * Generate a CSRF token
   * @returns {string} - Random CSRF token
   */
  generateCSRFToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      ""
    );
  },

  /**
   * Populate all CSRF token inputs on the page
   * Creates and stores a token if one doesn't exist
   */
  populateCSRFTokens() {
    // Get or create CSRF token for this session
    let token = sessionStorage.getItem("csrf_token");
    if (!token) {
      token = this.generateCSRFToken();
      sessionStorage.setItem("csrf_token", token);
    }

    // Populate all CSRF token inputs
    const csrfInputs = document.querySelectorAll(
      'input[name="_csrf"], input[id="csrf-token"]'
    );
    csrfInputs.forEach((input) => {
      input.value = token;
    });
  },

  /**
   * Validate CSRF token
   * @param {string} token - Token to validate
   * @returns {boolean} - True if valid
   */
  validateCSRFToken(token) {
    const storedToken = sessionStorage.getItem("csrf_token");
    return storedToken && token === storedToken;
  },

  /**
   * Sanitize user input for display
   * @param {string} input - User input to sanitize
   * @returns {string} - Sanitized string
   */
  sanitizeInput(input) {
    if (typeof input !== "string") {
      return "";
    }
    return input
      .replace(/[<>]/g, "") // Remove angle brackets
      .replace(/javascript:/gi, "") // Remove javascript: protocol
      .replace(/on\w+=/gi, "") // Remove event handlers
      .trim();
  },

  /**
   * Format currency safely
   * @param {number} amount - Amount to format
   * @returns {string} - Formatted currency string
   */
  formatCurrency(amount) {
    const num = parseFloat(amount);
    if (isNaN(num)) {
      return "$0.00";
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(num);
  },

  /**
   * Debounce function for performance
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in ms
   * @returns {Function} - Debounced function
   */
  debounce(func, wait = 250) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
};

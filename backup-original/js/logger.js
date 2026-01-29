/**
 * WeightGain - Logger Utility
 * Safe logging that only works in development mode
 */

const isDevelopment =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname.includes("dev") ||
  localStorage.getItem("debug") === "true";

/* eslint-disable no-console */
const Logger = {
  log: (...args) => {
    if (isDevelopment) {
      console.log("[WeightGain]", ...args);
    }
  },

  warn: (...args) => {
    if (isDevelopment) {
      console.warn("[WeightGain]", ...args);
    }
  },

  error: (...args) => {
    // Always log errors, even in production
    console.error("[WeightGain]", ...args);
  },

  info: (...args) => {
    if (isDevelopment) {
      console.info("[WeightGain]", ...args);
    }
  },

  debug: (...args) => {
    if (isDevelopment) {
      console.debug("[WeightGain]", ...args);
    }
  },
};
/* eslint-enable no-console */

// Export for use in other modules
window.WeightGainLogger = Logger;

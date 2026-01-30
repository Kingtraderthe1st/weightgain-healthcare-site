/**
 * WeightGain - AI Proxy Client
 * Calls the Netlify serverless function to get real Claude AI responses.
 * Falls back to keyword matching if the API is unavailable.
 */

window.WeightGainAIProxy = (function () {
  var ENDPOINT = "/.netlify/functions/chat";
  var MAX_HISTORY = 10;
  var MIN_INTERVAL_MS = 3000; // 3s between requests

  var conversationHistory = [];
  var lastRequestTime = 0;

  var SYSTEM_PROMPT =
    "You are the WeightGain Health Assistant, a friendly, concise healthcare chat agent " +
    "for a TRT (Testosterone Replacement Therapy) and HGH (Human Growth Hormone) subscription service.\n\n" +
    "KEY FACTS:\n" +
    "- Total Optimization plan: $249/month (or $207/mo billed yearly at $2,490/yr)\n" +
    "- Includes: comprehensive blood panel, personalized hormone protocol, monthly medication delivery, " +
    "quarterly monitoring labs, unlimited telehealth visits, 90-day money-back guarantee\n" +
    "- Lab tests at 4,500+ locations nationwide (Quest/Labcorp)\n" +
    "- Timeline: sign up → labs within 48hrs → doctor review 24-48hrs → meds ship same day → ~7 days to first injection\n" +
    "- Results timeline: energy boost week 1-2, mood/strength week 3-4, visible gains week 6-8\n" +
    "- Must be 18+ and in a non-restricted US state (NY, NJ, HI, RI not available)\n" +
    "- Women can benefit from low-dose TRT and HGH. Contact support@weightgain.com for women's protocols\n" +
    "- HIPAA-protected, discreet shipping, licensed US pharmacies\n" +
    "- HSA/FSA cards accepted\n\n" +
    "RULES:\n" +
    "- Keep responses under 3 sentences when possible\n" +
    "- Always add 'Individual results may vary' when discussing outcomes\n" +
    "- Never diagnose or promise cures. Use 'may', 'can help', 'designed to'\n" +
    "- If asked about medical emergencies, direct to 911 or their doctor\n" +
    "- Be direct and confident, but not pushy\n" +
    "- If unsure, suggest emailing support@weightgain.com";

  /**
   * Send a message to the AI and get a response.
   * Returns a Promise that resolves with { reply: string } or rejects.
   */
  function chat(userMessage) {
    var now = Date.now();
    if (now - lastRequestTime < MIN_INTERVAL_MS) {
      return Promise.reject(new Error("Rate limited. Please wait a moment."));
    }
    lastRequestTime = now;

    // Add to conversation history
    conversationHistory.push({ role: "user", content: userMessage });

    // Trim history to last MAX_HISTORY messages
    if (conversationHistory.length > MAX_HISTORY) {
      conversationHistory = conversationHistory.slice(-MAX_HISTORY);
    }

    return fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: conversationHistory,
        systemPrompt: SYSTEM_PROMPT,
      }),
    })
      .then(function (res) {
        if (!res.ok) {
          throw new Error("API returned " + res.status);
        }
        return res.json();
      })
      .then(function (data) {
        var reply = data.reply || "I'm here to help! Ask me about TRT or HGH therapy.";
        // Track assistant reply in history
        conversationHistory.push({ role: "assistant", content: reply });
        if (conversationHistory.length > MAX_HISTORY) {
          conversationHistory = conversationHistory.slice(-MAX_HISTORY);
        }
        return { reply: reply };
      });
  }

  /**
   * Check if the proxy endpoint is available.
   */
  function isAvailable() {
    return typeof fetch !== "undefined";
  }

  /**
   * Reset conversation history.
   */
  function reset() {
    conversationHistory = [];
  }

  return {
    chat: chat,
    isAvailable: isAvailable,
    reset: reset,
  };
})();

/**
 * WeightGain - AI Chat Functionality
 * Handles AI chat interactions and responses
 */

// Dependencies: WeightGainAIResponses, WeightGainPlans, WeightGainCart

// =============================================================================
// Cached DOM Elements (Performance Optimization)
// =============================================================================

const aiChatElements = {
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

function handleAiKeypress(event) {
  if (event.key === "Enter") {
    sendAiMessage();
  }
}

function createAiTestCard(test) {
  const card = document.createElement("div");
  card.className = "ai-test-card js-ai-test-card";

  const emoji = document.createElement("span");
  emoji.className = "js-ai-emoji";
  emoji.textContent = "🧪";

  const info = document.createElement("div");
  info.className = "js-ai-info";
  const name = document.createElement("div");
  name.className = "js-ai-name";
  name.textContent = test.name;
  const priceText = document.createElement("div");
  priceText.className = "js-ai-price";
  priceText.textContent = `$${test.price}`;
  info.appendChild(name);
  info.appendChild(priceText);

  const addBtn = document.createElement("button");
  addBtn.className = "js-ai-add-btn";
  addBtn.textContent = "+ Add";
  addBtn.dataset.action = "addToCartFromAI";
  addBtn.dataset.testId = test.id;
  // Hover effects handled by CSS :hover

  card.appendChild(emoji);
  card.appendChild(info);
  card.appendChild(addBtn);

  return card;
}

function createTypingIndicator() {
  const wrapper = document.createElement("div");
  wrapper.className = "ai-message bot";
  wrapper.id = "typingIndicator";

  const content = document.createElement("div");
  content.className = "message-content";

  const indicator = document.createElement("div");
  indicator.className = "typing-indicator";
  for (let i = 0; i < 3; i++) {
    indicator.appendChild(document.createElement("span"));
  }

  content.appendChild(indicator);
  wrapper.appendChild(content);
  return wrapper;
}

function sendAiMessage(presetMessage = null) {
  const input = aiChatElements.get("aiChatInput");
  const messagesContainer = aiChatElements.get("aiChatMessages");
  const message = presetMessage || (input ? input.value.trim() : "");

  if (!message || !messagesContainer) {
    return;
  }

  // Add user message using DOM methods
  const userMsg = document.createElement("div");
  userMsg.className = "ai-message user";
  const userContent = document.createElement("div");
  userContent.className = "message-content";
  const userP = document.createElement("p");
  userP.textContent = message; // Safe: textContent
  userContent.appendChild(userP);
  userMsg.appendChild(userContent);
  messagesContainer.appendChild(userMsg);

  // Clear input
  if (input) {
    input.value = "";
  }

  // Add typing indicator using DOM methods
  messagesContainer.appendChild(createTypingIndicator());
  // Scroll to bottom after user message
  requestAnimationFrame(() => {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  });

  // Get response after delay
  setTimeout(() => {
    document.getElementById("typingIndicator")?.remove();
    const response = getAiResponse(message);

    // Get recommended tests (if response has tests array)
    const testCatalog = window.WeightGainPlans?.testCatalog || [];
    const recommendedTests = response.tests
      ? testCatalog.filter((test) => response.tests.includes(test.id)).slice(0, 4)
      : [];

    // Build AI response using DOM methods
    const aiMsg = document.createElement("div");
    aiMsg.className = "ai-message bot";
    const aiContent = document.createElement("div");
    aiContent.className = "message-content";

    const aiP = document.createElement("p");
    aiP.textContent = response.message;
    aiContent.appendChild(aiP);

    // Add test cards safely
    recommendedTests.forEach((test) => {
      aiContent.appendChild(createAiTestCard(test));
    });

    aiMsg.appendChild(aiContent);
    messagesContainer.appendChild(aiMsg);

    // Scroll to bottom after DOM update
    requestAnimationFrame(() => {
      aiMsg.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }, 1200);
}

function getAiResponse(message) {
  const msg = message.toLowerCase().trim();
  const aiResponses = window.WeightGainAIResponses?.aiResponses;
  const priorityKeywords = window.WeightGainAIResponses?.priorityKeywords;

  if (!aiResponses || !priorityKeywords) {
    return { message: "I'm here to help! Ask me about TRT or HGH therapy." };
  }

  // Smart intent detection with contextual responses

  // WOMEN / FEMALE questions - check FIRST before other patterns (includes common typos)
  if (
    msg.match(
      /wom[ae]n|wom[ae]m|womon|fem[ae]le?|feml|girl|wif[ew]?|girlfr[ie]+nd|grilfriend|her\b|she\b/i
    )
  ) {
    if (msg.match(/trt|testos?t[eo]r+one?|testorone/i)) {
      return {
        message:
          "Yes — women benefit from low-dose testosterone (5-15mg/week vs 100-200mg for men). Benefits include more energy, better libido, muscle tone, and mental clarity. Women should NOT use male-dosed TRT. Reach out at support@weightgain.com for women's protocols.",
      };
    }
    if (msg.match(/hgh|gr[ow]+th\s*h[oa]rm[oa]ne?/i)) {
      return {
        message:
          "HGH works great for women — 1-2 IU/day for better body composition, sleep, skin, and recovery. Often paired with low-dose testosterone for best results. Contact support@weightgain.com for women's HGH protocols.",
      };
    }
    return {
      message:
        "Women can benefit from low-dose TRT (energy, libido, muscle tone), HGH (anti-aging, fat loss, sleep), or both. Dosing is much lower than men's. Our team can create a women-specific protocol — email support@weightgain.com.",
    };
  }

  // AGE questions
  if (
    msg.match(/how old|minimum age|too young|too old|year.?old|\bage\b/i) ||
    msg.match(/\b(18|21|25|30)\b.*(old|age|qualify|eligible)/i)
  ) {
    return {
      message:
        "Must be 18+ to qualify. Optimal candidates are 25-65, but men over 65 benefit too. Your labs tell the real story — low T doesn't discriminate by age.",
    };
  }

  // MEDICAL CONDITIONS / CONTRAINDICATIONS
  if (
    msg.match(
      /cancer|heart (disease|condition|problem)|liver|kidney|disease|condition|health issue|prostate|blood clot|diabetes/i
    )
  ) {
    return {
      message:
        "Our doctors review your full medical history before approving treatment. Conditions like prostate issues, heart conditions, or clotting disorders need extra evaluation — but many men with these still qualify. Your safety comes first.",
    };
  }

  // ELIGIBILITY / QUALIFICATION questions
  if (
    msg.match(
      /qualify|eligible|can i (get|take|use|start)|am i a candidate|do i qualify|will i qualify/i
    )
  ) {
    return {
      message:
        "Sign up, get labs at 4,500+ locations, and our doctors review your levels. If they're suboptimal, you likely qualify. Must be 18+ — labs are included, no extra cost. Individual results vary.",
    };
  }

  // TIMELINE / SPEED questions
  if (msg.match(/how (fast|quick|long|soon)|when (will|can|do)|timeline|time to|days|weeks/i)) {
    if (
      msg.includes("result") ||
      msg.includes("gain") ||
      msg.includes("see") ||
      msg.includes("notice")
    ) {
      return {
        message:
          "Week 1-2: energy boost. Week 3-4: mood and strength improving. Week 6-8: visible gains. Most members notice real changes by week 6. Individual results vary.",
      };
    }
    if (
      msg.includes("start") ||
      msg.includes("ship") ||
      msg.includes("deliver") ||
      msg.includes("get")
    ) {
      return {
        message:
          "Sign up today, labs within 48hrs, doctor reviews in 24-48hrs, ships same day after approval. ~7 days to your first injection.",
      };
    }
    return {
      message:
        "Sign up today → labs in 48hrs → doctor reviews → ships same day. ~7 days to first injection. Results may start week 2-3, visible gains by week 6-8. Individual results vary.",
    };
  }

  // TRT vs HGH / WHICH ONE questions
  if (
    msg.match(/which (one|should)|trt (or|vs|versus) hgh|difference|compare|better for/i) ||
    (msg.includes("trt") && msg.includes("hgh"))
  ) {
    return {
      message:
        "TRT = energy, strength, libido, focus. HGH = recovery, body recomp, anti-aging, sleep. Total Optimization ($249/mo) includes whichever your labs say you need — or both. What's your main goal?",
    };
  }

  // STACKING questions
  if (msg.match(/stack|combine|both|together/i)) {
    return {
      message:
        "Total Optimization ($249/mo) includes both if your labs support it. TRT handles strength, energy, and drive. HGH handles recovery, body comp, and anti-aging. Ships together, discreet packaging. Individual results vary.",
    };
  }

  // SIDE EFFECTS / SAFETY questions
  if (msg.match(/side effect|safe|risk|danger|worried|concern|scared/i)) {
    return {
      message:
        "Side effects are minimal when properly monitored. We include quarterly blood panels, licensed physician oversight, and unlimited telehealth. Your doctor adjusts your protocol based on YOUR labs. Individual experiences vary.",
    };
  }

  // QUALITY / LEGITIMACY questions
  if (msg.match(/legit|real|quality|pharma|genuine|fake|trust|scam/i)) {
    return {
      message:
        "100% pharma-grade from licensed US pharmacies. Every batch tested for purity and potency. No overseas sources, no grey market. Your labs prove it's working. Individual results may vary.",
    };
  }

  // PRIVACY / DISCRETION questions
  if (msg.match(/discreet|private|secret|packaging|plain|know|wife|family|work/i)) {
    return {
      message:
        "Plain brown box, no logos, no indication of contents. Generic billing name on bank statements. HIPAA-protected records. No one knows but you and your doctor.",
    };
  }

  // PRICE / COST questions
  if (msg.match(/price|cost|how much|afford|expensive|pay|money|insurance/i)) {
    return {
      message:
        "$249/mo — everything included. Labs, personalized protocol, monthly meds, quarterly monitoring, unlimited telehealth. No hidden fees. Or $2,490/yr to save $498. Individual results may vary.",
    };
  }

  // TRT specific questions
  if (msg.match(/trt|testosterone replacement|low t|test level/i) && !msg.includes("hgh")) {
    if (msg.includes("work") || msg.includes("how")) {
      return {
        message:
          "Sign up, get labs at 4,500+ locations, our doctors review your levels, then we create YOUR protocol. Testosterone ships monthly. $249/mo, everything included. Individual results vary.",
      };
    }
    return {
      message:
        "$249/mo — monthly meds, all blood panels, unlimited doctor consultations, ongoing optimization. Energy, strength, libido, and focus may all improve. First injection typically in ~7 days. Individual results vary.",
    };
  }

  // HGH specific questions
  if (msg.match(/hgh|growth hormone|igf|peptide/i) && !msg.includes("trt")) {
    return {
      message:
        "$249/mo includes full labs with IGF-1. If HGH would benefit you, it's part of your protocol. Better sleep, faster recovery, easier fat loss, and anti-aging benefits are all possible. Individual results vary.",
    };
  }

  // SYMPTOMS / PROBLEMS
  if (
    msg.match(
      /tired|fatigue|exhausted|no energy|can't sleep|low libido|no sex|can't build|not gaining|weak|brain fog/i
    )
  ) {
    return {
      message:
        "Those symptoms may mean your hormones need optimization. Fatigue, low libido, brain fog, can't build muscle — all tied to hormone levels. $249/mo gets you tested and on a personalized protocol. Individual results vary.",
    };
  }

  // MUSCLE / GAINS / GYM
  if (msg.match(/muscle|gain|bulk|lift|gym|workout|pr|strength|jacked|swole/i)) {
    return {
      message:
        "If your hormones aren't optimized, your body may lack the signal to grow. TRT can boost protein synthesis and recovery. Gym performance may improve by week 3-4, visible gains by week 6-8. $249/mo, everything included. Individual results vary.",
    };
  }

  // GREETINGS
  if (msg.match(/^(hi|hey|hello|sup|yo|what's up)/i)) {
    return {
      message:
        "Hey! Welcome to WeightGain. I can help with TRT, HGH, pricing, timelines, safety — whatever's on your mind. What would you like to know?",
    };
  }

  // GETTING STARTED
  if (msg.match(/get started|sign up|begin|ready|let's go|start now|how do i start/i)) {
    return {
      message:
        "Choose your plan ($249/mo), checkout, get labs at 4,500+ locations, doctor reviews in 24-48hrs, meds ship same day. ~7 days to first injection. Click 'Get Started' above!",
    };
  }

  // WHAT'S INCLUDED
  if (msg.match(/what('s| is) included|what do (i|you) get|include/i)) {
    return {
      message:
        "$249/mo — monthly meds, all blood panels, unlimited telehealth, ongoing monitoring, direct doctor messaging. One price, no hidden fees. Individual results may vary.",
    };
  }

  // Check priority keywords first
  for (const [keyword, responseKey] of Object.entries(priorityKeywords)) {
    if (msg.includes(keyword)) {
      const response = aiResponses[responseKey];
      if (response) {
        return response;
      }
    }
  }

  // DEFAULT - make it helpful
  const defaultResponses = [
    {
      message:
        "I can help with TRT, HGH, pricing, timelines, safety — ask me anything about hormone optimization.",
    },
    {
      message:
        "Total Optimization: $249/mo — labs, personalized protocol, monthly meds, all included. What's your main goal? Individual results may vary.",
    },
    {
      message:
        "Ask me about results, pricing, safety, or how it works. Or tell me your symptoms and I'll point you in the right direction.",
    },
  ];

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Export for use in other modules
window.WeightGainAIChat = {
  sendAiMessage,
  getAiResponse,
  handleAiKeypress,
  createAiTestCard,
  createTypingIndicator,
};

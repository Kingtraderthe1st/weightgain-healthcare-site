/**
 * WeightGain - AI Chat Functionality
 * Handles AI chat interactions and responses
 */

// Dependencies: WeightGainAIResponses, WeightGainPlans, WeightGainCart

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
  const input = document.getElementById("aiChatInput");
  const messagesContainer = document.getElementById("aiChatMessages");
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
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      aiMsg.scrollIntoView({ behavior: "smooth", block: "end" });
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
          "Yes, women can absolutely benefit from testosterone therapy! Here's what you need to know:\n\n💉 DOSING FOR WOMEN:\n• Women use MUCH lower doses: 5-15mg/week (vs 100-200mg for men)\n• Typically delivered via cream, pellets, or micro-dose injections\n• Goal: Restore to optimal female range (15-70 ng/dL)\n\n✨ BENEFITS FOR WOMEN:\n• Increased energy and motivation\n• Improved libido and sexual function\n• Better muscle tone and reduced body fat\n• Mental clarity and mood stability\n• Stronger bones\n\n🔬 BEST PAIRED WITH:\n• Progesterone (balances hormones, improves sleep)\n• DHEA (precursor hormone, supports adrenals)\n• Thyroid optimization if needed\n\n⚠️ IMPORTANT: Women should NOT use male-dosed TRT. Always work with a provider experienced in female hormone optimization.\n\nWant to learn more? Our team can discuss women's protocols - reach out at support@weightgain.com",
      };
    }
    if (msg.match(/hgh|gr[ow]+th\s*h[oa]rm[oa]ne?/i)) {
      return {
        message:
          "HGH is actually excellent for women - here's the full breakdown:\n\n💉 DOSING FOR WOMEN:\n• Typical dose: 1-2 IU per day (similar to men, sometimes slightly lower)\n• Usually taken before bed to mimic natural release\n• Start low (0.5-1 IU) and titrate up based on IGF-1 levels\n\n✨ BENEFITS FOR WOMEN:\n• Improved body composition (less fat, more lean mass)\n• Better skin elasticity and reduced wrinkles\n• Deeper, more restorative sleep\n• Faster recovery from workouts\n• Stronger hair and nails\n• Enhanced collagen production\n\n🔬 BEST PAIRED WITH:\n• Low-dose testosterone (5-10mg/week) for synergistic fat loss\n• Progesterone for sleep and hormone balance\n• Peptides like Ipamorelin for natural GH stimulation\n\n📊 WHAT TO MONITOR:\n• IGF-1 levels (target 200-250 ng/mL)\n• Fasting glucose (HGH can affect insulin sensitivity)\n• Thyroid function\n\nWomen often see dramatic anti-aging and body composition results with HGH. Contact support@weightgain.com to discuss women's HGH protocols.",
      };
    }
    return {
      message:
        "Great question about women's hormone optimization! Here's what you should know:\n\n🔬 WOMEN'S HORMONE THERAPY OPTIONS:\n\n1️⃣ TESTOSTERONE (Low-Dose)\n• 5-15mg/week via cream or pellets\n• Boosts energy, libido, muscle tone, mental clarity\n• Must be female-appropriate dosing\n\n2️⃣ HGH (Growth Hormone)\n• 1-2 IU daily\n• Anti-aging, fat loss, better sleep, skin quality\n• Works great for women\n\n3️⃣ PROGESTERONE\n• Often the missing piece for women\n• Improves sleep, reduces anxiety, balances estrogen\n• Usually 100-200mg at bedtime\n\n4️⃣ DHEA\n• Precursor to testosterone and estrogen\n• 10-25mg daily for women\n• Supports adrenal function\n\n💡 BEST STACK FOR WOMEN:\nMost women see best results combining low-dose testosterone + progesterone, adding HGH if anti-aging/body comp is the goal.\n\n⚠️ KEY DIFFERENCE FROM MEN:\nWomen need MUCH lower testosterone doses and should always include progesterone for balance.\n\nOur team can create a women-specific protocol. Email support@weightgain.com with your goals!",
    };
  }

  // AGE questions
  if (
    msg.match(/how old|minimum age|too young|too old|year.?old|\bage\b/i) ||
    msg.match(/\b(18|21|25|30)\b.*(old|age|qualify|eligible)/i)
  ) {
    return {
      message:
        "Age requirements:\n\n✅ Must be 18+ to qualify\n✅ Optimal candidates are typically 25-65\n✅ Men under 25 may have naturally fluctuating T levels\n✅ Men over 65 can absolutely benefit - we have many warriors in that range\n\nYour labs will tell the real story. Low T doesn't discriminate by age. If you're experiencing symptoms, it's worth getting tested.",
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
        "Great question - we take safety seriously.\n\nOur doctors will review your complete medical history before approving any treatment. Some conditions require additional evaluation:\n\n⚠️ Conditions that need careful review:\n• Prostate issues\n• Heart conditions\n• Blood clotting disorders\n• Liver or kidney problems\n• History of certain cancers\n\n✅ Many men WITH these conditions still qualify - it depends on specifics.\n\nYour safety comes first. The doctor will discuss your individual situation during the consultation and may request additional tests if needed.",
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
        "Here's how qualification works:\n\n1️⃣ You sign up and get labs done (4,500+ locations)\n2️⃣ Our doctors review your hormone levels\n3️⃣ If your levels are suboptimal, you qualify\n\n📊 Who typically qualifies:\n• Men with T levels below optimal range\n• Men experiencing low T symptoms (fatigue, low libido, brain fog, muscle loss)\n• Men 18+ in reasonable health\n\n✅ 87% of men who complete labs qualify for treatment.\n\nThe only way to know for sure is to get tested. Labs are included in your plan - no extra cost.",
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
          "Great question! Here's what most warriors experience:\n\n📅 Week 1-2: Energy boost kicks in, better sleep\n📅 Week 3-4: Mood improves, strength returning\n📅 Week 6-8: VISIBLE gains, PRs coming back\n📅 Week 12+: Full transformation mode\n\n94% of our guys notice real changes by week 6. The first injection? That's only ~7 days away from right now.",
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
          "Speed is our thing 💨\n\n• Sign up: TODAY\n• Labs: Within 48 hours (4,500+ locations)\n• Doctor review: 24-48 hours after labs\n• Ships: SAME DAY after approval\n• At your door: 2-3 days\n\nTotal time to first injection: ~7 days. We don't make you wait.",
      };
    }
    return {
      message:
        "Here's the full timeline:\n\n⚡ TODAY: Choose your plan\n⚡ 48 HRS: Complete labs\n⚡ 24-48 HRS: Doctor reviews\n⚡ SAME DAY: Ships after approval\n\nFirst injection in ~7 days. Results start showing week 2-3, and by week 6-8 you'll be seeing real gains in the mirror.",
    };
  }

  // TRT vs HGH / WHICH ONE questions
  if (
    msg.match(/which (one|should)|trt (or|vs|versus) hgh|difference|compare|better for/i) ||
    (msg.includes("trt") && msg.includes("hgh"))
  ) {
    return {
      message:
        "Let me break it down for you:\n\n💉 TRT ($149/mo) - Testosterone optimization\n• Best for: Energy, strength, libido, mood, focus\n• You'll feel: More drive, better recovery, mental clarity\n\n🧬 HGH ($199/mo) - Growth hormone therapy\n• Best for: Recovery, body recomp, anti-aging, sleep\n• You'll feel: Faster recovery, leaner body, better skin\n\n🔥 STACK BOTH ($299/mo) - Maximum gains\n• 2.3x faster results on average\n• Save $49/mo vs buying separately\n\nWhat's your main goal? I can give you a specific recommendation.",
    };
  }

  // STACKING questions
  if (msg.match(/stack|combine|both|together/i)) {
    return {
      message:
        "Smart thinking! Stacking TRT + HGH is how serious warriors maximize results.\n\n📊 The data: Guys who stack see 2.3x faster results on average\n\n💪 TRT handles: Testosterone, strength, energy, drive\n🧬 HGH handles: Recovery, body comp, sleep, anti-aging\n\n💰 Stack pricing: $299/mo (vs $348 separately)\nYou save $49 EVERY month.\n\nSame discreet packaging, ships together. Want me to set you up with the stack?",
    };
  }

  // SIDE EFFECTS / SAFETY questions
  if (msg.match(/side effect|safe|risk|danger|worried|concern|scared/i)) {
    return {
      message:
        "Real talk - I respect you asking.\n\n✅ When properly monitored, side effects are minimal. That's exactly why we include:\n• Monthly blood panels (we watch your levels)\n• Licensed physician oversight\n• Unlimited telehealth (ask anything, anytime)\n\n📋 What some guys experience early on:\n• Slight water retention (temporary)\n• Increased appetite (your body wants to grow)\n• Better mood, more energy (the good stuff)\n\nWe've helped 12,847 warriors. Safety through monitoring is how we got here. Your doc adjusts your protocol based on YOUR labs.",
    };
  }

  // QUALITY / LEGITIMACY questions
  if (msg.match(/legit|real|quality|pharma|genuine|fake|trust|scam/i)) {
    return {
      message:
        "100% legit, and I'll prove it:\n\n✅ Pharma-grade compounds from FDA-registered US pharmacies\n✅ Same quality used by elite athletes and clinics\n✅ Every batch tested for purity and potency\n✅ Monthly blood work PROVES it's working\n\n🚫 No underdosed garbage\n🚫 No sketchy overseas sources\n🚫 No grey market stuff\n\n12,847 warriors trust us with their gains. Your labs will show the results. That's the proof that matters.",
    };
  }

  // PRIVACY / DISCRETION questions
  if (msg.match(/discreet|private|secret|packaging|plain|know|wife|family|work/i)) {
    return {
      message:
        "Your privacy is locked down tight 🔒\n\n📦 Packaging: Plain brown box, NO logos, NO indication of contents\n🏷️ Return address: Generic medical supply company\n💳 Bank statement: Shows generic medical billing name\n📋 Medical records: HIPAA protected, always\n\nNo one knows your business but you and your doctor. Not your mailman, not your roommate, not anyone. We get it - discretion matters.",
    };
  }

  // PRICE / COST questions
  if (msg.match(/price|cost|how much|afford|expensive|pay|money|insurance/i)) {
    return {
      message:
        "Here's exactly what you pay:\n\n💉 TRT Gains: $149/mo\n• Or $1,490/year (save $298)\n\n🧬 HGH Gains: $199/mo  \n• Or $1,990/year (save $398)\n\n🔥 TRT + HGH Stack: $299/mo\n• Save $49/mo vs separate\n\n✅ ALL plans include:\n• Monthly medication delivery\n• Blood work & monitoring\n• Unlimited telehealth visits\n• No hidden fees, ever\n\nThat's less than most guys spend on supplements that don't work.",
    };
  }

  // TRT specific questions
  if (msg.match(/trt|testosterone replacement|low t|test level/i) && !msg.includes("hgh")) {
    if (msg.includes("work") || msg.includes("how")) {
      return {
        message:
          "Here's how TRT works:\n\n1️⃣ You sign up and get labs at 4,500+ locations\n2️⃣ Our doctors review your testosterone levels\n3️⃣ If you qualify, we create YOUR protocol\n4️⃣ Testosterone ships to your door monthly\n5️⃣ We monitor your levels with regular blood work\n\n📈 Most guys go from 200-400 ng/dL → 700-900+ ng/dL\n\nThat's the difference between dragging and DOMINATING. $149/mo, everything included.",
      };
    }
    return {
      message:
        "TRT Gains - $149/mo 💉\n\nWhat you get:\n• Monthly testosterone delivery\n• All required blood panels\n• Unlimited doctor consultations\n• Ongoing protocol optimization\n\nWhat you'll feel:\n⚡ Energy through the roof\n💪 Strength and muscle gains\n🔥 Libido back online\n🧠 Mental clarity and focus\n\nAverage T increase: +287 ng/dL. First injection in ~7 days. Ready to start?",
    };
  }

  // HGH specific questions
  if (msg.match(/hgh|growth hormone|igf|peptide/i) && !msg.includes("trt")) {
    return {
      message:
        "HGH Gains - $199/mo 🧬\n\nWhat you get:\n• Monthly HGH delivery\n• Blood panels & IGF-1 monitoring\n• Body composition tracking\n• Unlimited telehealth access\n\nWhat you'll feel:\n😴 Deep, restorative sleep\n💪 Faster workout recovery\n📉 Easier fat loss\n✨ Better skin, anti-aging benefits\n\nHGH is the recovery and body recomp accelerator. Stack it with TRT ($299/mo) for 2.3x faster results.",
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
        "Those symptoms? Classic signs your hormones need optimization.\n\n😴 Fatigue, low energy → Low testosterone tanks your mitochondria\n🏋️ Can't build muscle → Your body lacks the hormonal signal to grow\n😑 Low libido, mood issues → T directly affects both\n🧠 Brain fog → Testosterone is crucial for cognitive function\n\nThe good news: These are FIXABLE. Most warriors feel the energy shift in week 1-2, and by week 6-8 they're wondering why they waited so long.\n\nTRT Gains: $149/mo. Let's fix this.",
    };
  }

  // MUSCLE / GAINS / GYM
  if (msg.match(/muscle|gain|bulk|lift|gym|workout|pr|strength|jacked|swole/i)) {
    return {
      message:
        "Can't build muscle no matter how hard you train? 🏋️\n\nHere's the truth: If your hormones aren't optimized, you're fighting uphill. Your body literally lacks the chemical signal to grow.\n\n📊 What happens on TRT:\n• Protein synthesis increases\n• Recovery time drops\n• Strength goes up week over week\n• PRs start falling again\n\nMost guys see gym performance improve by week 3-4, and visible gains by week 6-8.\n\nTRT: $149/mo | HGH: $199/mo | Stack both: $299/mo\n\nWhich fits your goals?",
    };
  }

  // GREETINGS
  if (msg.match(/^(hi|hey|hello|sup|yo|what's up)/i)) {
    return {
      message:
        "Hey! 👊 Welcome to WeightGain.\n\nI'm here to help you understand TRT and HGH therapy. What's on your mind?\n\nQuick options:\n• How fast will I see results?\n• TRT vs HGH - what's the difference?\n• What does it cost?\n• Is it safe?\n\nOr just ask me anything about hormone optimization.",
    };
  }

  // GETTING STARTED
  if (msg.match(/get started|sign up|begin|ready|let's go|start now|how do i start/i)) {
    return {
      message:
        "Let's get you started! 💪\n\nHere's what happens next:\n\n1️⃣ Choose your plan:\n   • TRT Gains: $149/mo\n   • HGH Gains: $199/mo\n   • Stack both: $299/mo\n\n2️⃣ Complete quick checkout\n3️⃣ Get labs at 4,500+ locations (within 48hrs)\n4️⃣ Doctor reviews results (24-48hrs)\n5️⃣ Medication ships SAME DAY\n\n~7 days to your first injection. Click 'Get TRT Gains' or 'Get HGH Gains' above to start!",
    };
  }

  // WHAT'S INCLUDED
  if (msg.match(/what('s| is) included|what do (i|you) get|include/i)) {
    return {
      message:
        "Everything's included - no hidden fees:\n\n📦 Monthly medication delivery\n🔬 All required blood panels\n👨‍⚕️ Unlimited telehealth consultations\n📊 Ongoing monitoring & optimization\n📱 Direct doctor messaging\n\nTRT: $149/mo | HGH: $199/mo | Stack: $299/mo\n\nNo surprise charges. No lab fees. No consultation fees. One price, everything included.",
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
        "I'm here to help you understand TRT and HGH therapy! 💪\n\nPopular questions:\n• How fast will I see results?\n• TRT vs HGH - which one?\n• What does it cost?\n• Is it safe and legit?\n\nWhat would you like to know? Or tell me what symptoms/goals you have and I'll point you in the right direction.",
    },
    {
      message:
        "Hey! I can help you figure out if TRT or HGH is right for you.\n\n💉 TRT ($149/mo) - Testosterone optimization\n🧬 HGH ($199/mo) - Growth hormone therapy\n🔥 Stack both ($299/mo) - Maximum results\n\nWhat's your main goal? More energy? Building muscle? Better recovery? Tell me what you're dealing with.",
    },
    {
      message:
        "Let me help you out! I specialize in TRT and HGH therapy questions.\n\nTell me:\n• What symptoms are you experiencing?\n• What are your fitness goals?\n• Any specific concerns?\n\nOr ask me about timelines, pricing, safety, or how it all works. I've got answers.",
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

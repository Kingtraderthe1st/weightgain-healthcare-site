/**
 * WeightGain - Floating Chat Widget
 * Independent from hero chat, uses its own DOM + message history
 */

(function () {
  var toggle = document.getElementById("chatToggle");
  var panel = document.getElementById("chatPanel");
  var closeBtn = document.getElementById("chatClose");
  var badge = toggle ? toggle.querySelector(".chat-widget__badge") : null;
  var iconOpen = toggle
    ? toggle.querySelector(".chat-widget__icon-open")
    : null;
  var iconClose = toggle
    ? toggle.querySelector(".chat-widget__icon-close")
    : null;
  var widgetMessages = document.getElementById("widgetChatMessages");
  var widgetInput = document.getElementById("widgetChatInput");
  var widgetSendBtn = document.getElementById("widgetSendBtn");

  function openPanel() {
    if (panel) panel.classList.add("active");
    if (badge) badge.style.display = "none";
    if (iconOpen) iconOpen.style.display = "none";
    if (iconClose) iconClose.style.display = "block";
  }

  function closePanel() {
    if (panel) panel.classList.remove("active");
    if (iconOpen) iconOpen.style.display = "block";
    if (iconClose) iconClose.style.display = "none";
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      if (panel && panel.classList.contains("active")) {
        closePanel();
      } else {
        openPanel();
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closePanel);
  }

  // Widget send: builds DOM messages and calls getAiResponse directly
  function widgetSend(message) {
    if (!message || !widgetMessages) return;

    // Add user message
    var userMsg = document.createElement("div");
    userMsg.className = "ai-message user";
    var userContent = document.createElement("div");
    userContent.className = "message-content";
    var userP = document.createElement("p");
    userP.textContent = message;
    userContent.appendChild(userP);
    userMsg.appendChild(userContent);
    widgetMessages.appendChild(userMsg);

    if (widgetInput) widgetInput.value = "";

    // Typing indicator
    var typing = document.createElement("div");
    typing.className = "ai-message bot";
    typing.id = "widgetTypingIndicator";
    var typingContent = document.createElement("div");
    typingContent.className = "message-content";
    var dots = document.createElement("div");
    dots.className = "typing-indicator";
    for (var i = 0; i < 3; i++) dots.appendChild(document.createElement("span"));
    typingContent.appendChild(dots);
    typing.appendChild(typingContent);
    widgetMessages.appendChild(typing);

    requestAnimationFrame(function () {
      widgetMessages.scrollTop = widgetMessages.scrollHeight;
    });

    setTimeout(function () {
      var indicator = document.getElementById("widgetTypingIndicator");
      if (indicator) indicator.remove();

      var getAiResponse =
        window.WeightGainAIChat && window.WeightGainAIChat.getAiResponse;
      var response = getAiResponse
        ? getAiResponse(message)
        : {
            message:
              "I'm here to help! Ask me about TRT or HGH therapy.",
          };

      var aiMsg = document.createElement("div");
      aiMsg.className = "ai-message bot";
      var aiContent = document.createElement("div");
      aiContent.className = "message-content";
      var aiP = document.createElement("p");
      aiP.textContent = response.message;
      aiContent.appendChild(aiP);
      aiMsg.appendChild(aiContent);
      widgetMessages.appendChild(aiMsg);

      requestAnimationFrame(function () {
        aiMsg.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    }, 1200);
  }

  // Send button
  if (widgetSendBtn) {
    widgetSendBtn.addEventListener("click", function () {
      var msg = widgetInput ? widgetInput.value.trim() : "";
      if (msg) widgetSend(msg);
    });
  }

  // Enter key on widget input
  if (widgetInput) {
    widgetInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        var msg = widgetInput.value.trim();
        if (msg) widgetSend(msg);
      }
    });
  }

  // Quick preset buttons in widget
  document.addEventListener("click", function (e) {
    var presetBtn = e.target.closest("[data-widget-preset]");
    if (presetBtn) {
      e.preventDefault();
      var msg = presetBtn.getAttribute("data-widget-preset");
      if (msg) widgetSend(msg);
    }
  });
})();

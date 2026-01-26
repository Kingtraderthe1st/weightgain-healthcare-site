/**
 * WeightGain - UI Functions
 * Handles modals, notifications, popups, and UI interactions
 */

// Dependencies: WeightGainState, WeightGainCart, WeightGainPlans

// =============================================================================
// Modal Focus Trapping (Accessibility)
// =============================================================================

let activeModalFocusTrap = null;
let previousActiveElement = null;

function trapFocusInModal(modal) {
  if (!modal) {
    return;
  }

  previousActiveElement = document.activeElement;

  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const focusableArray = Array.from(focusableElements);

  if (focusableArray.length === 0) {
    return;
  }

  const firstFocusable = focusableArray[0];
  const lastFocusable = focusableArray[focusableArray.length - 1];

  // Focus the first focusable element
  setTimeout(() => firstFocusable.focus(), 50);

  // Create the trap handler
  activeModalFocusTrap = function (e) {
    if (e.key === "Tab") {
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    }

    // Close on Escape
    if (e.key === "Escape") {
      const closeBtn = modal.querySelector(
        '[data-action*="close"], .modal-close, [aria-label*="close"], [aria-label*="Close"]'
      );
      if (closeBtn) {
        closeBtn.click();
      }
    }
  };

  modal.addEventListener("keydown", activeModalFocusTrap);
}

function releaseFocusTrap(modal) {
  if (modal && activeModalFocusTrap) {
    modal.removeEventListener("keydown", activeModalFocusTrap);
    activeModalFocusTrap = null;
  }

  // Return focus to previous element
  if (previousActiveElement && typeof previousActiveElement.focus === "function") {
    previousActiveElement.focus();
    previousActiveElement = null;
  }
}

// =============================================================================
// Notification System
// =============================================================================

function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `alert alert--${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    z-index: 9999;
    max-width: 300px;
    animation: slideIn 0.3s ease;
  `;

  // Create SVG icon
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "alert__icon");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");

  if (type === "success") {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M20 6L9 17l-5-5");
    svg.appendChild(path);
  } else {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", "12");
    circle.setAttribute("cy", "12");
    circle.setAttribute("r", "10");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M12 16v-4M12 8h.01");
    svg.appendChild(circle);
    svg.appendChild(path);
  }

  const span = document.createElement("span");
  span.textContent = message; // Safe: textContent

  notification.appendChild(svg);
  notification.appendChild(span);

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// =============================================================================
// Toast Notifications
// =============================================================================

function showToast(message) {
  const toast = document.getElementById("toast");
  const messageEl = document.getElementById("toastMessage");

  if (toast && messageEl) {
    messageEl.textContent = message;
    toast.classList.add("active");

    setTimeout(() => {
      toast.classList.remove("active");
    }, 3000);
  }
}

// =============================================================================
// Mobile Menu Functions
// =============================================================================

function toggleMobileMenu(open) {
  const state = window.WeightGainState?.state;
  if (!state) {
    return;
  }

  state.mobileMenuOpen = open !== undefined ? open : !state.mobileMenuOpen;

  const mobileNav = document.getElementById("mobileMenu");
  if (mobileNav) {
    mobileNav.classList.toggle("active", state.mobileMenuOpen);
    mobileNav.setAttribute("aria-hidden", !state.mobileMenuOpen);
  }

  const mobileToggle = document.querySelector('[data-action="toggleMobileMenu"]');
  if (mobileToggle) {
    mobileToggle.setAttribute("aria-expanded", state.mobileMenuOpen);
  }
}

// =============================================================================
// Pairing Modal (Legacy - No longer used with single plan model)
// =============================================================================

function showPairingModal(_addedPlanId) {
  // Single plan model - no pairing needed
  // User goes directly to checkout
  window.WeightGainLogger?.log("Pairing modal disabled - single plan model");
}

function closePairingModal() {
  const overlay = document.getElementById("pairingModalOverlay");
  if (overlay) {
    overlay.classList.remove("active");
    const modal = overlay.querySelector(".pairing-modal");
    if (modal) {
      modal.classList.remove("active");
    }
    setTimeout(() => overlay.remove(), 300);
  }
}

// =============================================================================
// Welcome Popup
// =============================================================================

function initWelcomePopup() {
  // Check if already shown this session or dismissed permanently
  if (sessionStorage.getItem("welcomeShown") || localStorage.getItem("welcomeDismissed")) {
    return;
  }

  // Don't show on checkout page
  if (window.location.pathname.includes("checkout")) {
    return;
  }

  let welcomeShown = false;

  function showWelcomePopup() {
    if (welcomeShown) {
      return;
    }
    welcomeShown = true;

    const overlay = document.getElementById("welcomeOverlay");
    const popup = document.getElementById("welcomePopup");
    if (overlay && popup) {
      overlay.classList.add("active");
      popup.classList.add("active");
      sessionStorage.setItem("welcomeShown", "true");
    }
  }

  // Show after 10 seconds
  const timeoutId = setTimeout(showWelcomePopup, 10000);

  // OR show at 50% scroll
  function handleScroll() {
    const scrollPercent =
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    if (scrollPercent >= 50 && !welcomeShown) {
      clearTimeout(timeoutId);
      showWelcomePopup();
      window.removeEventListener("scroll", handleScroll);
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
}

function closeWelcomePopup() {
  const overlay = document.getElementById("welcomeOverlay");
  const popup = document.getElementById("welcomePopup");
  const dontShow = document.getElementById("dontShowAgain");

  if (overlay) {
    overlay.classList.remove("active");
  }
  if (popup) {
    popup.classList.remove("active");
  }

  if (dontShow && dontShow.checked) {
    localStorage.setItem("welcomeDismissed", "true");
  }
}

function copyWelcomeCode() {
  navigator.clipboard.writeText("TRTWARRIOR").then(() => {
    showToast("Code copied to clipboard!");
  });
}

function submitWelcomeEmail() {
  const emailInput = document.getElementById("welcomeEmail");
  const email = emailInput?.value?.trim();

  if (!email || !email.includes("@")) {
    showToast("Please enter a valid email address");
    return;
  }

  // Simulate email submission
  showToast("Guide sent! Check your inbox.");
  closeWelcomePopup();

  // Store that user provided email
  localStorage.setItem("welcomeEmailProvided", "true");
}

// =============================================================================
// Exit Intent Popup
// =============================================================================

let exitIntentShown = false;

function initExitIntent() {
  if (sessionStorage.getItem("exitIntentShown")) {
    return;
  }

  // Don't show on checkout page - let them focus
  if (window.location.pathname.includes("checkout")) {
    return;
  }

  document.addEventListener("mouseout", (e) => {
    if (e.clientY <= 0 && !exitIntentShown) {
      showExitPopup();
    }
  });
}

function showExitPopup() {
  if (exitIntentShown || sessionStorage.getItem("exitIntentShown")) {
    return;
  }
  exitIntentShown = true;
  sessionStorage.setItem("exitIntentShown", "true");

  const overlay = document.getElementById("exitPopupOverlay");
  const popup = document.getElementById("exitPopup");

  if (overlay && popup) {
    overlay.classList.add("active");
    popup.classList.add("active");
  }
}

function closeExitPopup() {
  const overlay = document.getElementById("exitPopupOverlay");
  const popup = document.getElementById("exitPopup");

  if (overlay) {
    overlay.classList.remove("active");
  }
  if (popup) {
    popup.classList.remove("active");
  }
}

function submitExitEmail() {
  const input = document.getElementById("exitEmail");
  const email = input ? input.value.trim() : "";

  // Proper email validation regex (RFC 5322 compliant for common cases)
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  if (email && emailRegex.test(email)) {
    showToast("Check your email for 25% OFF code!");
    closeExitPopup();
  } else if (input) {
    input.style.borderColor = "#ef4444";
  }
}

function closeSocialProof() {
  const socialProof = document.getElementById("socialProofPopup");
  if (socialProof) {
    socialProof.classList.remove("active");
  }
}

// =============================================================================
// Auth Modal
// =============================================================================

function openAuthModal(type = "signin") {
  const overlay = document.getElementById("authOverlay");
  const modal = document.getElementById("authModal");

  if (overlay && modal) {
    overlay.classList.add("active");
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    switchAuthForm(type);
    trapFocusInModal(modal);
  }
}

function closeAuthModal() {
  const overlay = document.getElementById("authOverlay");
  const modal = document.getElementById("authModal");

  if (overlay) {
    overlay.classList.remove("active");
  }
  if (modal) {
    modal.classList.remove("active");
    releaseFocusTrap(modal);
  }
  document.body.style.overflow = "";
}

function switchAuthForm(type) {
  const signinForm = document.getElementById("signinForm");
  const signupForm = document.getElementById("signupForm");

  if (type === "signup") {
    if (signinForm) {
      signinForm.style.display = "none";
    }
    if (signupForm) {
      signupForm.style.display = "block";
    }
  } else {
    if (signinForm) {
      signinForm.style.display = "block";
    }
    if (signupForm) {
      signupForm.style.display = "none";
    }
  }
}

function handleSignIn(event) {
  event.preventDefault();
  showToast("Sign in functionality coming soon!");
  closeAuthModal();
}

function handleSignUp(event) {
  event.preventDefault();
  showToast("Sign up functionality coming soon!");
  closeAuthModal();
}

function showForgotPassword(event) {
  if (event) {
    event.preventDefault();
  }
  const signinForm = document.getElementById("signinForm");
  const signupForm = document.getElementById("signupForm");
  const forgotForm = document.getElementById("forgotPasswordForm");

  if (signinForm) {
    signinForm.style.display = "none";
  }
  if (signupForm) {
    signupForm.style.display = "none";
  }
  if (forgotForm) {
    forgotForm.style.display = "block";
  }
}

function handleForgotPassword(event) {
  event.preventDefault();
  const successEl = document.getElementById("resetSuccess");
  if (successEl) {
    successEl.style.display = "flex";
  }
  showToast("Password reset link sent!");
}

// =============================================================================
// Cookie Banner
// =============================================================================

function initCookieBanner() {
  if (localStorage.getItem("cookiesAccepted") || localStorage.getItem("cookiesDeclined")) {
    return;
  }

  const banner = document.getElementById("cookieBanner");
  if (banner) {
    setTimeout(() => {
      banner.classList.add("active");
    }, 2000);
  }
}

function acceptCookies() {
  localStorage.setItem("cookiesAccepted", "true");
  const banner = document.getElementById("cookieBanner");
  if (banner) {
    banner.classList.remove("active");
  }
}

function declineCookies() {
  localStorage.setItem("cookiesDeclined", "true");
  const banner = document.getElementById("cookieBanner");
  if (banner) {
    banner.classList.remove("active");
  }
}

// =============================================================================
// Upsell Modal
// =============================================================================

let pendingUpsellTests = [];

function showUpsellModal(tests) {
  pendingUpsellTests = tests || [];
  const overlay = document.getElementById("upsellOverlay");
  const modal = document.getElementById("upsellModal");
  const productsEl = document.getElementById("upsellProducts");
  const totalEl = document.getElementById("upsellTotal");
  const savingsEl = document.getElementById("upsellSavings");

  if (!overlay || !modal || !productsEl) {
    return;
  }

  // Build products using DOM methods
  productsEl.textContent = ""; // Clear safely
  let total = 0;

  pendingUpsellTests.forEach((test) => {
    total += test.price;

    const product = document.createElement("div");
    product.style.cssText =
      "display: flex; align-items: center; gap: 1rem; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 0.75rem;";

    const emoji = document.createElement("span");
    emoji.style.fontSize = "1.5rem";
    emoji.textContent = "💪";

    const info = document.createElement("div");
    info.style.flex = "1";

    const name = document.createElement("div");
    name.style.cssText = "font-weight: 600; color: #fff;";
    name.textContent = test.name;

    const price = document.createElement("div");
    price.style.cssText = "font-size: 0.85rem; color: rgba(255,255,255,0.6);";
    price.textContent = `$${test.price}`;

    info.appendChild(name);
    info.appendChild(price);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = true;
    checkbox.style.cssText = "width: 20px; height: 20px; accent-color: var(--spartan-gold);";

    product.appendChild(emoji);
    product.appendChild(info);
    product.appendChild(checkbox);
    productsEl.appendChild(product);
  });

  if (totalEl) {
    totalEl.textContent = total;
  }
  if (savingsEl) {
    savingsEl.textContent = Math.round(total * 0.1);
  }

  overlay.classList.add("active");
  modal.classList.add("active");
}

function closeUpsellModal() {
  const overlay = document.getElementById("upsellOverlay");
  const modal = document.getElementById("upsellModal");

  if (overlay) {
    overlay.classList.remove("active");
  }
  if (modal) {
    modal.classList.remove("active");
  }
  pendingUpsellTests = [];
}

function addUpsellToCart() {
  if (window.WeightGainCart?.addToCart) {
    pendingUpsellTests.forEach((test) => window.WeightGainCart.addToCart(test.id));
  }
  closeUpsellModal();
  showToast("Items added to cart!");
}

// =============================================================================
// Lab Selection Modal
// =============================================================================

function openLabModal() {
  const overlay = document.getElementById("labModalOverlay");
  const modal = document.getElementById("labModal");

  if (overlay && modal) {
    overlay.classList.add("active");
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    trapFocusInModal(modal);
  }
}

function closeLabModal() {
  const overlay = document.getElementById("labModalOverlay");
  const modal = document.getElementById("labModal");

  if (overlay) {
    overlay.classList.remove("active");
  }
  if (modal) {
    modal.classList.remove("active");
    releaseFocusTrap(modal);
  }
  document.body.style.overflow = "";
}

function searchLabsInModal() {
  const input = document.getElementById("labModalZipInput");
  const resultsDiv = document.getElementById("labModalResults");

  if (!input || !resultsDiv) {
    return;
  }

  const zip = input.value.trim();
  // Validate ZIP code format (5 digits)
  const zipRegex = /^\d{5}$/;
  if (!zip || !zipRegex.test(zip)) {
    showToast("Please enter a valid 5-digit ZIP code");
    return;
  }

  // Check restricted states
  const restrictedZips = ["10", "11", "07", "08", "02", "96", "97"];
  if (restrictedZips.some((prefix) => zip.startsWith(prefix))) {
    resultsDiv.textContent = "";
    const errorP = document.createElement("p");
    errorP.style.cssText = "color: #f59e0b; text-align: center; padding: 2rem;";
    errorP.textContent =
      "Sorry, services are not available in NY, NJ, RI, or HI due to state regulations.";
    resultsDiv.appendChild(errorP);
    return;
  }

  // Show sample results using safe DOM methods
  resultsDiv.textContent = "";

  const createLabCard = (name, address, hours) => {
    const card = document.createElement("div");
    card.style.cssText =
      "padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 0.75rem; cursor: pointer;";
    card.dataset.action = "selectLab";

    const nameEl = document.createElement("strong");
    nameEl.style.color = "#D4AF37";
    nameEl.textContent = name;

    const addressP = document.createElement("p");
    addressP.style.cssText = "font-size: 0.85rem; color: rgba(255,255,255,0.7); margin: 0.25rem 0;";
    addressP.textContent = address;

    const hoursP = document.createElement("p");
    hoursP.style.cssText = "font-size: 0.8rem; color: rgba(255,255,255,0.5);";
    hoursP.textContent = hours;

    card.appendChild(nameEl);
    card.appendChild(addressP);
    card.appendChild(hoursP);
    return card;
  };

  resultsDiv.appendChild(
    createLabCard(
      "Quest Diagnostics",
      "123 Medical Center Dr - 0.8 miles",
      "Mon-Fri 7AM-5PM, Sat 8AM-12PM"
    )
  );
  resultsDiv.appendChild(
    createLabCard("LabCorp", "456 Health Plaza - 1.2 miles", "Mon-Fri 6:30AM-4PM")
  );
}

function selectLab(_element) {
  showToast("Lab location selected!");
  closeLabModal();
}

// =============================================================================
// Lab Locator
// =============================================================================

function findLabs() {
  const input = document.getElementById("zipInput");
  const resultsDiv = document.getElementById("labResults");
  const listDiv = document.getElementById("labList");

  if (!input || !resultsDiv || !listDiv) {
    return;
  }

  const zip = input.value.trim();
  // Validate ZIP code format (5 digits)
  const zipRegex = /^\d{5}$/;
  if (!zip || !zipRegex.test(zip)) {
    showToast("Please enter a valid 5-digit ZIP code");
    return;
  }

  // Check restricted states
  const restrictedZips = ["10", "11", "07", "08", "02", "96", "97"];
  if (restrictedZips.some((prefix) => zip.startsWith(prefix))) {
    listDiv.textContent = "";
    const errorP = document.createElement("p");
    errorP.style.color = "#f59e0b";
    errorP.textContent =
      "Sorry, services are not available in NY, NJ, RI, or HI due to state regulations.";
    listDiv.appendChild(errorP);
    resultsDiv.style.display = "block";
    return;
  }

  // Show sample results using safe DOM methods
  listDiv.textContent = "";

  const createLabCard = (name, address, hours) => {
    const card = document.createElement("div");
    card.className = "lab-card";
    card.style.cssText =
      "padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 0.75rem; cursor: pointer; border: 2px solid transparent; transition: all 0.2s;";

    const nameEl = document.createElement("strong");
    nameEl.style.color = "#D4AF37";
    nameEl.textContent = name;

    const addressP = document.createElement("p");
    addressP.style.cssText = "font-size: 0.85rem; color: rgba(255,255,255,0.7); margin: 0.25rem 0;";
    addressP.textContent = address;

    const hoursP = document.createElement("p");
    hoursP.style.cssText = "font-size: 0.8rem; color: rgba(255,255,255,0.5);";
    hoursP.textContent = hours;

    card.appendChild(nameEl);
    card.appendChild(addressP);
    card.appendChild(hoursP);

    // Make lab card selectable
    card.addEventListener("click", () => selectLabFromFinder(card, name));
    card.addEventListener("mouseenter", () => {
      if (!card.classList.contains("selected")) {
        card.style.borderColor = "rgba(212, 175, 55, 0.3)";
        card.style.background = "rgba(212, 175, 55, 0.1)";
      }
    });
    card.addEventListener("mouseleave", () => {
      if (!card.classList.contains("selected")) {
        card.style.borderColor = "transparent";
        card.style.background = "rgba(255,255,255,0.05)";
      }
    });

    return card;
  };

  listDiv.appendChild(
    createLabCard(
      "Quest Diagnostics",
      "123 Medical Center Dr - 0.8 miles",
      "Mon-Fri 7AM-5PM, Sat 8AM-12PM"
    )
  );
  listDiv.appendChild(
    createLabCard("LabCorp", "456 Health Plaza - 1.2 miles", "Mon-Fri 6:30AM-4PM")
  );

  // Add "Continue to Checkout" button container (hidden until lab selected)
  const ctaContainer = document.createElement("div");
  ctaContainer.id = "lab-cta-container";
  ctaContainer.style.cssText =
    "margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(212, 175, 55, 0.2); display: none;";

  const selectedText = document.createElement("p");
  selectedText.id = "selected-lab-text";
  selectedText.style.cssText =
    "font-size: 0.9rem; color: #22c55e; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;";

  const checkSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  checkSvg.setAttribute("viewBox", "0 0 24 24");
  checkSvg.setAttribute("width", "18");
  checkSvg.setAttribute("height", "18");
  checkSvg.setAttribute("fill", "#22c55e");
  const checkPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  checkPath.setAttribute("d", "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z");
  checkSvg.appendChild(checkPath);

  const labNameSpan = document.createElement("span");
  selectedText.appendChild(checkSvg);
  selectedText.appendChild(labNameSpan);

  const ctaBtn = document.createElement("a");
  ctaBtn.href = "checkout.html";
  ctaBtn.className = "btn btn-primary";
  ctaBtn.style.cssText = "width: 100%; text-align: center; display: block;";
  ctaBtn.textContent = "Continue to Checkout";

  ctaContainer.appendChild(selectedText);
  ctaContainer.appendChild(ctaBtn);
  listDiv.appendChild(ctaContainer);

  resultsDiv.style.display = "block";
}

function selectLabFromFinder(card, labName) {
  // Deselect all other cards
  const allCards = document.querySelectorAll(".lab-card");
  allCards.forEach((c) => {
    c.classList.remove("selected");
    c.style.borderColor = "transparent";
    c.style.background = "rgba(255,255,255,0.05)";
  });

  // Select this card
  card.classList.add("selected");
  card.style.borderColor = "#D4AF37";
  card.style.background = "rgba(212, 175, 55, 0.15)";

  // Show the CTA container
  const ctaContainer = document.getElementById("lab-cta-container");
  const selectedText = document.getElementById("selected-lab-text");
  if (ctaContainer && selectedText) {
    ctaContainer.style.display = "block";
    const labNameSpan = selectedText.querySelector("span");
    if (labNameSpan) {
      labNameSpan.textContent = `${labName} selected`;
    }
  }

  // Store selected lab
  localStorage.setItem("wg_selected_lab", labName);
  showToast(`${labName} selected!`);
}

// =============================================================================
// Quick View Modal
// =============================================================================

function openQuickView(testId) {
  const testCatalog = window.WeightGainPlans?.testCatalog || [];
  const state = window.WeightGainState?.state;
  if (!state) {
    return;
  }

  const test = testCatalog.find((t) => t.id === testId);
  if (!test) {
    return;
  }

  const isInCart = state.cart.some((item) => item.id === testId);

  const contentEl = document.getElementById("quickViewContent");
  const overlayEl = document.getElementById("quickViewOverlay");
  const modalEl = document.getElementById("quickViewModal");

  if (!contentEl) {
    return;
  }

  // Build content using DOM methods
  contentEl.textContent = ""; // Clear safely

  // Emoji header
  const emojiDiv = document.createElement("div");
  emojiDiv.style.cssText = "text-align: center; margin-bottom: 1.5rem;";
  const emoji = document.createElement("span");
  emoji.style.fontSize = "3rem";
  emoji.textContent = "💪";
  emojiDiv.appendChild(emoji);

  // Title
  const title = document.createElement("h2");
  title.id = "quickViewTitle";
  title.style.cssText =
    "color: white; font-size: 1.5rem; margin-bottom: 0.5rem; text-align: center;";
  title.textContent = test.name;

  // Description
  const desc = document.createElement("p");
  desc.style.cssText =
    "color: rgba(255,255,255,0.7); text-align: center; margin-bottom: 1.5rem; line-height: 1.6;";
  desc.textContent = test.description;

  // Info box
  const infoBox = document.createElement("div");
  infoBox.style.cssText =
    "background: rgba(255,255,255,0.05); border-radius: 12px; padding: 1rem; margin-bottom: 1.5rem;";

  const createInfoRow = (label, value, valueStyle = "color: white;") => {
    const row = document.createElement("div");
    row.style.cssText =
      "display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;";
    const labelSpan = document.createElement("span");
    labelSpan.style.color = "rgba(255,255,255,0.6)";
    labelSpan.textContent = label;
    const valueSpan = document.createElement("span");
    valueSpan.style.cssText = valueStyle;
    valueSpan.textContent = value;
    row.appendChild(labelSpan);
    row.appendChild(valueSpan);
    return row;
  };

  infoBox.appendChild(
    createInfoRow("Price", `$${test.price}`, "color: #D4AF37; font-size: 1.5rem; font-weight: 700;")
  );
  infoBox.appendChild(createInfoRow("Results", test.turnaround || "24-72 hours"));
  const labRow = createInfoRow("Lab Visit", "No appointment needed");
  labRow.style.marginBottom = "0";
  infoBox.appendChild(labRow);

  // Button
  const button = document.createElement("button");
  button.className = "btn btn-primary";
  button.style.cssText = "width: 100%; padding: 1rem; font-size: 1rem;";
  button.textContent = isInCart ? "✓ Already in Cart" : `Add to Cart - $${test.price}`;
  button.dataset.action = "addToCartAndClose";
  button.dataset.testId = test.id;

  // Disclaimer
  const disclaimer = document.createElement("p");
  disclaimer.style.cssText =
    "text-align: center; margin-top: 1rem; font-size: 0.75rem; color: rgba(255,255,255,0.5);";
  disclaimer.textContent = "Consult your healthcare provider for medical advice.";

  contentEl.appendChild(emojiDiv);
  contentEl.appendChild(title);
  contentEl.appendChild(desc);
  contentEl.appendChild(infoBox);
  contentEl.appendChild(button);
  contentEl.appendChild(disclaimer);

  if (overlayEl) {
    overlayEl.style.display = "block";
  }
  if (modalEl) {
    modalEl.style.display = "block";
  }
  document.body.style.overflow = "hidden";
}

function closeQuickView() {
  const overlayEl = document.getElementById("quickViewOverlay");
  const modalEl = document.getElementById("quickViewModal");

  if (overlayEl) {
    overlayEl.style.display = "none";
  }
  if (modalEl) {
    modalEl.style.display = "none";
  }
  document.body.style.overflow = "";
}

// =============================================================================
// Test Filtering
// =============================================================================

function filterTests(category, buttonElement) {
  const state = window.WeightGainState?.state;
  if (!state) {
    return;
  }

  // Update active tab
  document.querySelectorAll(".category-tab").forEach((tab) => tab.classList.remove("active"));
  if (buttonElement) {
    buttonElement.classList.add("active");
  }

  state.currentCategory = category;
  state.testsDisplayed = 12;
  // renderTests would be called here if needed
}

function searchTests(query) {
  const state = window.WeightGainState?.state;
  if (!state) {
    return;
  }

  const searchQuery = query.toLowerCase().trim();

  if (!searchQuery) {
    // renderTests('all', state.testsDisplayed);
    return;
  }

  const testCatalog = window.WeightGainPlans?.testCatalog || [];
  const _filtered = testCatalog.filter(
    (test) =>
      test.name.toLowerCase().includes(searchQuery) ||
      test.description.toLowerCase().includes(searchQuery)
  );

  // renderFilteredTests(_filtered);
}

// =============================================================================
// Mobile Sticky CTA
// =============================================================================

function initMobileStickyCTA() {
  const mobileCTA =
    document.getElementById("mobileStickyCta") || document.querySelector(".mobile-sticky-cta");
  if (!mobileCTA) {
    return;
  }

  // Don't show on checkout page
  if (window.location.pathname.includes("checkout")) {
    mobileCTA.style.display = "none";
    return;
  }

  const showAfterScroll = 400; // Show after scrolling 400px

  function handleMobileCTAScroll() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > showAfterScroll) {
      mobileCTA.classList.add("active");
    } else {
      mobileCTA.classList.remove("active");
    }
  }

  window.addEventListener("scroll", handleMobileCTAScroll, { passive: true });
}

// =============================================================================
// Page Transitions
// =============================================================================

function initPageTransitions() {
  // Add click handlers to internal links
  document.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href");
    if (href && href.endsWith(".html") && !href.startsWith("http")) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        navigateWithTransition(href);
      });
    }
  });
}

function navigateWithTransition(url) {
  const overlay = document.getElementById("pageTransition");
  if (overlay) {
    overlay.classList.add("active");
    setTimeout(() => {
      window.location.href = url;
    }, 600);
  } else {
    window.location.href = url;
  }
}

// =============================================================================
// Sticky Cart Bar
// =============================================================================

function initStickyCartBar() {
  // Now handled by combined scroll handler
  // Keep function for compatibility but scroll logic is centralized
}

function updateStickyCart() {
  const state = window.WeightGainState?.state;
  if (!state) {
    return;
  }

  const countEl = document.getElementById("stickyCartCount");
  const totalEl = document.getElementById("stickyCartTotal");

  if (countEl) {
    countEl.textContent = state.cart.length;
  }
  if (totalEl && window.WeightGainCart?.getCartTotal) {
    totalEl.textContent = window.WeightGainCart.getCartTotal().toFixed(2);
  }
}

// Export for use in other modules
window.WeightGainUI = {
  showNotification,
  showToast,
  toggleMobileMenu,
  showPairingModal,
  closePairingModal,
  initWelcomePopup,
  closeWelcomePopup,
  copyWelcomeCode,
  submitWelcomeEmail,
  initExitIntent,
  showExitPopup,
  closeExitPopup,
  submitExitEmail,
  closeSocialProof,
  openAuthModal,
  closeAuthModal,
  switchAuthForm,
  handleSignIn,
  handleSignUp,
  showForgotPassword,
  handleForgotPassword,
  initCookieBanner,
  acceptCookies,
  declineCookies,
  showUpsellModal,
  closeUpsellModal,
  addUpsellToCart,
  openLabModal,
  closeLabModal,
  searchLabsInModal,
  selectLab,
  findLabs,
  selectLabFromFinder,
  openQuickView,
  closeQuickView,
  filterTests,
  searchTests,
  initMobileStickyCTA,
  initPageTransitions,
  navigateWithTransition,
  initStickyCartBar,
  updateStickyCart,
  trapFocusInModal,
  releaseFocusTrap,
};

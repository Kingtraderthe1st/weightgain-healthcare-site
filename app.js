/**
 * WeightGain - Main Application
 * Brand: Warrior/Gains positioning
 * "Built for Warriors" - TRT & Hormone Testing for Teens & Young Adults
 */

// =============================================================================
// Safe JSON.parse wrapper
// =============================================================================
function safeJSONParse(str, fallback = null) {
  try {
    return str ? JSON.parse(str) : fallback;
  } catch (e) {
    console.warn('Failed to parse JSON:', e);
    return fallback;
  }
}

// =============================================================================
// Subscription Plans Data - TRT & HGH Gains
// =============================================================================

const subscriptionPlans = {
  trt: {
    id: 'trt-therapy',
    name: 'TRT Gains',
    tagline: 'Testosterone Replacement Therapy',
    includes: [
      'Monthly testosterone delivery',
      'Quarterly blood monitoring',
      'Unlimited telehealth visits',
      'AI-powered progress tracking',
      'Priority support'
    ],
    pricing: {
      oneTime: 199,
      monthly: 149,
      yearly: 1490
    },
    yearlySavings: 298,
    monthlyEquivalent: 124,
    popular: true
  },
  hgh: {
    id: 'hgh-therapy',
    name: 'HGH Gains',
    tagline: 'Human Growth Hormone Therapy',
    includes: [
      'Monthly HGH delivery',
      'Monthly blood panels',
      'Unlimited telehealth visits',
      'Body composition tracking',
      'AI-powered progress tracking',
      'Priority support'
    ],
    pricing: {
      oneTime: 249,
      monthly: 199,
      yearly: 1990
    },
    yearlySavings: 398,
    monthlyEquivalent: 166,
    popular: false
  }
};

// =============================================================================
// Legacy Test Catalog (empty - app now uses subscription plans)
// =============================================================================
const testCatalog = [];

// =============================================================================
// Restricted States (where direct-to-consumer testing is not available)
// =============================================================================

const restrictedStates = ['NY', 'NJ', 'HI', 'RI'];

const stateNames = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
  'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
  'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
  'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
  'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
  'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
  'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
  'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
  'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
  'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
  'WI': 'Wisconsin', 'WY': 'Wyoming', 'DC': 'District of Columbia'
};

// =============================================================================
// Application State
// =============================================================================

// =============================================================================
// Cart Data Validation
// =============================================================================

function validateCartItem(item) {
  if (!item || typeof item !== 'object') return null;

  // Validate required fields
  if (typeof item.id !== 'string' || !item.id.match(/^[a-z0-9-]+$/)) return null;
  if (typeof item.name !== 'string' || item.name.length > 200) return null;
  if (typeof item.price !== 'number' || item.price < 0 || item.price > 10000) return null;
  if (item.quantity !== undefined && (typeof item.quantity !== 'number' || item.quantity < 1 || item.quantity > 100)) return null;

  // Return sanitized item (preserve subscription fields)
  const sanitized = {
    id: item.id,
    name: item.name.substring(0, 200),
    price: Math.round(item.price * 100) / 100,
    quantity: item.quantity || 1
  };

  // Preserve subscription-specific fields if present
  if (item.billingCycle && ['monthly', 'yearly', 'one-time'].includes(item.billingCycle)) {
    sanitized.billingCycle = item.billingCycle;
  }
  if (item.billingLabel && typeof item.billingLabel === 'string') {
    sanitized.billingLabel = item.billingLabel.substring(0, 50);
  }
  if (Array.isArray(item.includes)) {
    sanitized.includes = item.includes.filter(i => typeof i === 'string').slice(0, 20).map(i => i.substring(0, 200));
  }

  return sanitized;
}

function validateCartData(data) {
  if (!Array.isArray(data)) return [];
  return data.map(validateCartItem).filter(item => item !== null).slice(0, 50);
}

// =============================================================================
// Application State
// =============================================================================

const state = {
  cart: validateCartData(safeJSONParse(localStorage.getItem('wg_cart'), [])),
  user: null, // User data should not be stored in localStorage - use sessionStorage or server-side sessions
  selectedPlan: null,
  billingCycle: 'monthly',
  chatOpen: false,
  mobileMenuOpen: false
};

// =============================================================================
// DOM Elements
// =============================================================================

const elements = {
  testGrid: document.getElementById('testsGrid'),
  cartCount: document.getElementById('cartCount'),
  cartToggle: document.getElementById('cart-toggle'),
  mobileToggle: document.getElementById('mobile-toggle'),
  mobileNav: document.getElementById('mobile-nav'),
  chatbotToggle: document.getElementById('chatbot-toggle'),
  chatbotWindow: document.getElementById('chatbot-window'),
  chatbotClose: document.getElementById('chatbot-close'),
  chatbotMessages: document.getElementById('chatbot-messages'),
  chatbotInput: document.getElementById('chatbot-input'),
  chatbotSend: document.getElementById('chatbot-send'),
  chatbotSuggestions: document.getElementById('chatbot-suggestions'),
  loadMore: document.getElementById('load-more'),
  openChatbot: document.getElementById('open-chatbot'),
  ctaChatbot: document.getElementById('cta-chatbot')
};

// =============================================================================
// Cached DOM Queries (Performance Optimization)
// =============================================================================
const cachedQueries = {
  _categoryTabs: null,
  _mobileNavLinks: null,

  get categoryTabs() {
    if (!this._categoryTabs) {
      this._categoryTabs = document.querySelectorAll('.category-tab');
    }
    return this._categoryTabs;
  },

  get mobileNavLinks() {
    if (!this._mobileNavLinks) {
      this._mobileNavLinks = document.querySelectorAll('.mobile-nav__link');
    }
    return this._mobileNavLinks;
  },

  // Clear cache if DOM changes dynamically
  invalidate() {
    this._categoryTabs = null;
    this._mobileNavLinks = null;
  }
};

// =============================================================================
// Cart Functions
// =============================================================================

function addToCart(testId) {
  const test = testCatalog.find(t => t.id === testId);
  if (!test) return;

  const existingItem = state.cart.find(item => item.id === testId);
  if (existingItem) {
    showNotification('This test is already in your cart', 'info');
    return;
  }

  // Use the selected billing cycle from state
  const cycle = state.billingCycle || 'monthly';
  let price = test.price;
  let billingLabel = 'One-Time';
  let billingCycleValue = 'one-time';

  // If test has subscription pricing, use it
  if (test.pricing) {
    if (cycle === 'yearly' && test.pricing.yearly) {
      price = test.pricing.yearly;
      billingLabel = 'Yearly';
      billingCycleValue = 'yearly';
    } else if (cycle === 'monthly' && test.pricing.monthly) {
      price = test.pricing.monthly;
      billingLabel = 'Monthly';
      billingCycleValue = 'monthly';
    }
  }

  state.cart.push({
    id: test.id,
    name: test.name,
    price: price,
    billingCycle: billingCycleValue,
    billingLabel: billingLabel,
    includes: test.includes || [],
    quantity: 1
  });

  saveCart();
  updateCartUI();
  showNotification(`${test.name} added to cart`, 'success');
}

function removeFromCart(testId) {
  state.cart = state.cart.filter(item => item.id !== testId);
  saveCart();
  updateCartUI();
}

function saveCart() {
  console.log('Saving cart:', state.cart);
  localStorage.setItem('wg_cart', JSON.stringify(state.cart));
  console.log('Saved to localStorage:', localStorage.getItem('wg_cart'));
}

function getCartTotal() {
  return state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function updateCartUI() {
  const count = state.cart.length;
  const total = getCartTotal();

  // Update header cart count
  if (elements.cartCount) {
    elements.cartCount.textContent = count;
    elements.cartCount.style.display = count > 0 ? 'flex' : 'none';
  }

  // Update sticky cart bar
  const stickyCount = document.getElementById('stickyCartCount');
  const stickyTotal = document.getElementById('stickyCartTotal');
  if (stickyCount) stickyCount.textContent = count;
  if (stickyTotal) stickyTotal.textContent = total.toFixed(2);
}

// =============================================================================
// Billing Toggle & Pricing Functions
// =============================================================================

function initBillingToggle() {
  const billingOptions = document.querySelectorAll('.billing-option');
  if (!billingOptions.length) return;

  billingOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Update active state
      billingOptions.forEach(opt => opt.classList.remove('active'));
      option.classList.add('active');

      // Update state
      state.billingCycle = option.dataset.billing;

      // Update pricing display
      updatePricingDisplay();
    });
  });
}

function updatePricingDisplay() {
  const cycle = state.billingCycle;

  Object.entries(subscriptionPlans).forEach(([key, plan]) => {
    const card = document.querySelector(`[data-plan="${key}"]`);
    if (!card) return;

    const priceEl = card.querySelector('.subscription-price');
    const periodEl = card.querySelector('.subscription-period');
    const savingsEl = card.querySelector('.subscription-savings');

    if (priceEl) {
      if (cycle === 'oneTime') {
        priceEl.textContent = `$${plan.pricing.oneTime}`;
        if (periodEl) periodEl.textContent = 'one-time';
        if (savingsEl) savingsEl.style.display = 'none';
      } else if (cycle === 'monthly') {
        priceEl.textContent = `$${plan.pricing.monthly}`;
        if (periodEl) periodEl.textContent = '/month';
        if (savingsEl) savingsEl.style.display = 'none';
      } else if (cycle === 'yearly') {
        priceEl.textContent = `$${plan.pricing.yearly}`;
        if (periodEl) periodEl.textContent = '/year';
        if (savingsEl) {
          savingsEl.textContent = `Save $${plan.yearlySavings}`;
          savingsEl.style.display = 'inline-block';
        }
      }
    }
  });
}

function selectPlan(planId) {
  console.log('selectPlan called with:', planId);
  const plan = subscriptionPlans[planId];
  if (!plan) {
    console.log('Plan not found!');
    return;
  }

  state.selectedPlan = planId;

  // Use the selected billing cycle from state
  const cycle = state.billingCycle || 'monthly';
  let price, billingLabel, billingCycleValue;

  if (cycle === 'yearly') {
    price = plan.pricing.yearly;
    billingLabel = 'Yearly';
    billingCycleValue = 'yearly';
  } else if (cycle === 'oneTime') {
    price = plan.pricing.oneTime;
    billingLabel = 'One-Time';
    billingCycleValue = 'one-time';
  } else {
    price = plan.pricing.monthly;
    billingLabel = 'Monthly';
    billingCycleValue = 'monthly';
  }

  // If already in cart, go straight to checkout
  const existingItem = state.cart.find(item => item.id === plan.id);
  if (existingItem) {
    window.location.href = 'checkout.html';
    return;
  }

  // Add to cart (don't clear existing items)
  state.cart.push({
    id: plan.id,
    name: plan.name,
    price: price,
    billingCycle: billingCycleValue,
    billingLabel: billingLabel,
    includes: plan.includes,
    quantity: 1
  });

  saveCart();
  updateCartUI();

  // Show pairing modal instead of simple confirmation
  showPairingModal(planId);
}

function showPlanAddedModal(plan) {
  // Create modal overlay
  const overlay = document.createElement('div');
  overlay.id = 'planAddedOverlay';
  overlay.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px);';

  // Create modal content
  const modal = document.createElement('div');
  modal.style.cssText = 'background: linear-gradient(135deg, #1a1a1a, #0d0d0d); border: 2px solid #D4AF37; border-radius: 16px; padding: 2rem; max-width: 450px; width: 90%; text-align: center; box-shadow: 0 25px 50px rgba(0,0,0,0.5);';

  const emoji = plan.id === 'trt-therapy' ? '💉' : '🧬';
  const otherPlan = plan.id === 'trt-therapy' ? 'hgh' : 'trt';

  modal.innerHTML = `
    <div style="font-size: 3rem; margin-bottom: 1rem;">${emoji}</div>
    <h2 style="color: #D4AF37; font-size: 1.5rem; margin-bottom: 0.5rem;">Let's Get You Jacked!</h2>
    <p style="color: #fff; font-size: 1.1rem; margin-bottom: 0.5rem;"><strong>${plan.name}</strong> added to cart</p>
    <p style="color: rgba(255,255,255,0.7); margin-bottom: 1.5rem;">$${plan.pricing.monthly}/mo - Everything included</p>
    <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
      <button id="goToCheckout" class="btn btn-primary btn-large" style="min-width: 150px;">Checkout Now</button>
      <button id="keepBrowsing" class="btn btn-secondary" style="min-width: 150px;">Keep Browsing</button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Event listeners
  document.getElementById('goToCheckout').addEventListener('click', () => {
    window.location.href = 'checkout.html';
  });

  document.getElementById('keepBrowsing').addEventListener('click', () => {
    overlay.remove();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });
}

// =============================================================================
// TRT/HGH Pairing Modal
// =============================================================================

function showPairingModal(addedPlanId) {
  const plan = subscriptionPlans[addedPlanId];
  if (!plan) return;

  // Determine which product to suggest
  const suggestHGH = addedPlanId === 'trt';
  const suggestedPlan = suggestHGH ? subscriptionPlans.hgh : subscriptionPlans.trt;

  // Check if user already has the suggested item in cart
  const alreadyHas = state.cart.some(item => item.id === suggestedPlan.id);
  if (alreadyHas) return;

  // Create modal overlay
  const overlay = document.createElement('div');
  overlay.id = 'pairingModalOverlay';
  overlay.className = 'pairing-modal-overlay';
  overlay.dataset.action = 'closePairingModal';

  // Create modal content
  const modal = document.createElement('div');
  modal.className = 'pairing-modal';

  modal.innerHTML = `
    <button class="pairing-modal-close" data-action="closePairingModal" aria-label="Close">&times;</button>

    <div class="pairing-modal-header">
      <span class="pairing-badge">MAXIMIZE YOUR GAINS</span>
      <h2>Stack for 2.3x Faster Results</h2>
    </div>

    <div class="pairing-toggle">
      <button class="pairing-toggle-btn active" data-gender="men">For Men</button>
      <button class="pairing-toggle-btn" data-gender="women">For Women</button>
    </div>

    <div class="pairing-content" id="pairingContentMen">
      ${suggestHGH ? `
        <div class="pairing-suggestion">
          <div class="pairing-icon">🧬</div>
          <h3>Add HGH Gains</h3>
          <p class="pairing-desc">Growth hormone supercharges recovery and accelerates lean muscle gains. Men who stack TRT + HGH see dramatically faster body recomposition.</p>
          <ul class="pairing-benefits">
            <li>Faster workout recovery</li>
            <li>Enhanced fat loss</li>
            <li>Better sleep quality</li>
            <li>Improved skin & anti-aging</li>
          </ul>
          <div class="pairing-price">
            <span class="pairing-price-label">Add for just</span>
            <span class="pairing-price-value">+$199/mo</span>
          </div>
          <div class="pairing-stack-price">
            <span>Stack price: $299/mo</span>
            <span class="pairing-savings">Save $49/mo</span>
          </div>
        </div>
      ` : `
        <div class="pairing-suggestion">
          <div class="pairing-icon">💉</div>
          <h3>Add TRT Gains</h3>
          <p class="pairing-desc">Testosterone optimization is the foundation of male hormone health. Combined with HGH, you'll maximize strength, energy, and recovery.</p>
          <ul class="pairing-benefits">
            <li>Increased strength & energy</li>
            <li>Improved libido & mood</li>
            <li>Enhanced muscle building</li>
            <li>Mental clarity & focus</li>
          </ul>
          <div class="pairing-price">
            <span class="pairing-price-label">Add for just</span>
            <span class="pairing-price-value">+$149/mo</span>
          </div>
          <div class="pairing-stack-price">
            <span>Stack price: $299/mo</span>
            <span class="pairing-savings">Save $49/mo</span>
          </div>
        </div>
      `}
    </div>

    <div class="pairing-content" id="pairingContentWomen" style="display: none;">
      ${suggestHGH ? `
        <div class="pairing-suggestion">
          <div class="pairing-icon">🧬</div>
          <h3>Add HGH Gains</h3>
          <p class="pairing-desc">HGH works beautifully for women, enhancing body composition, skin quality, and recovery without virilizing effects.</p>
          <ul class="pairing-benefits">
            <li>Enhanced body composition</li>
            <li>Better skin elasticity</li>
            <li>Improved sleep & recovery</li>
            <li>Anti-aging benefits</li>
          </ul>
          <p class="pairing-women-note">Women typically use similar HGH doses (1-2 IU/day) with excellent results.</p>
          <div class="pairing-price">
            <span class="pairing-price-label">Add for just</span>
            <span class="pairing-price-value">+$199/mo</span>
          </div>
        </div>
      ` : `
        <div class="pairing-suggestion">
          <div class="pairing-icon">💊</div>
          <h3>Consider Low-Dose TRT</h3>
          <p class="pairing-desc">Women benefit from much lower testosterone doses (5-15mg/week). Combined with HGH, it creates a powerful synergy for energy and body composition.</p>
          <ul class="pairing-benefits">
            <li>Increased energy & vitality</li>
            <li>Improved libido</li>
            <li>Better muscle tone</li>
            <li>Enhanced mood stability</li>
          </ul>
          <p class="pairing-women-note">Women's protocols use micro-doses - completely different from male TRT. Often paired with progesterone for hormonal balance.</p>
          <div class="pairing-price">
            <span class="pairing-price-label">Add for just</span>
            <span class="pairing-price-value">+$149/mo</span>
          </div>
        </div>
      `}
    </div>

    <div class="pairing-actions">
      <button class="btn btn-primary btn-large" id="addPairingBtn">Add to My Stack</button>
      <button class="btn btn-secondary" data-action="closePairingModal">No Thanks, Continue</button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Activate overlay
  requestAnimationFrame(() => {
    overlay.classList.add('active');
    modal.classList.add('active');
  });

  // Handle toggle between men/women
  modal.querySelectorAll('.pairing-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      modal.querySelectorAll('.pairing-toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const menContent = document.getElementById('pairingContentMen');
      const womenContent = document.getElementById('pairingContentWomen');

      if (btn.dataset.gender === 'men') {
        menContent.style.display = 'block';
        womenContent.style.display = 'none';
      } else {
        menContent.style.display = 'none';
        womenContent.style.display = 'block';
      }
    });
  });

  // Handle add to stack
  document.getElementById('addPairingBtn').addEventListener('click', () => {
    addPairingToCart(suggestHGH ? 'hgh' : 'trt');
    closePairingModal();
  });
}

function addPairingToCart(planId) {
  const plan = subscriptionPlans[planId];
  if (!plan) return;

  // Check if already in cart
  if (state.cart.some(item => item.id === plan.id)) {
    showToast('Already in your cart!');
    return;
  }

  // Use the selected billing cycle from state
  const cycle = state.billingCycle || 'monthly';
  let price, billingLabel, billingCycleValue;

  if (cycle === 'yearly') {
    price = plan.pricing.yearly;
    billingLabel = 'Yearly';
    billingCycleValue = 'yearly';
  } else if (cycle === 'oneTime') {
    price = plan.pricing.oneTime;
    billingLabel = 'One-Time';
    billingCycleValue = 'one-time';
  } else {
    price = plan.pricing.monthly;
    billingLabel = 'Monthly';
    billingCycleValue = 'monthly';
  }

  state.cart.push({
    id: plan.id,
    name: plan.name,
    price: price,
    billingCycle: billingCycleValue,
    billingLabel: billingLabel,
    includes: plan.includes,
    quantity: 1
  });

  saveCart();
  updateCartUI();
  showToast(`${plan.name} added to your stack!`);
}

function closePairingModal() {
  const overlay = document.getElementById('pairingModalOverlay');
  if (overlay) {
    overlay.classList.remove('active');
    const modal = overlay.querySelector('.pairing-modal');
    if (modal) modal.classList.remove('active');
    setTimeout(() => overlay.remove(), 300);
  }
}

// =============================================================================
// Test Rendering Functions (Legacy - kept for compatibility)
// =============================================================================

function createTestCard(test) {
  const article = document.createElement('article');
  article.className = 'test-card';
  article.setAttribute('role', 'listitem');
  article.dataset.testId = test.id;

  // Header
  const header = document.createElement('div');
  header.className = 'test-card__header';

  const category = document.createElement('span');
  category.className = 'test-card__category';
  category.textContent = getCategoryLabel(test.category);

  const title = document.createElement('h3');
  title.className = 'test-card__title';
  title.textContent = test.name;

  header.appendChild(category);
  header.appendChild(title);

  // Body
  const body = document.createElement('div');
  body.className = 'test-card__body';

  const description = document.createElement('p');
  description.className = 'test-card__description';
  description.textContent = test.description;

  const biomarkers = document.createElement('div');
  biomarkers.className = 'test-card__biomarkers';
  test.biomarkers.slice(0, 4).forEach(b => {
    const span = document.createElement('span');
    span.className = 'test-card__biomarker';
    span.textContent = b;
    biomarkers.appendChild(span);
  });
  if (test.biomarkers.length > 4) {
    const more = document.createElement('span');
    more.className = 'test-card__biomarker';
    more.textContent = `+${test.biomarkers.length - 4} more`;
    biomarkers.appendChild(more);
  }

  const info = document.createElement('div');
  info.style.cssText = 'display: flex; gap: var(--space-4); font-size: var(--text-xs); color: var(--text-tertiary);';
  const turnaround = document.createElement('span');
  turnaround.textContent = test.turnaround;
  const fasting = document.createElement('span');
  fasting.textContent = test.fasting ? 'Fasting required' : 'No fasting';
  info.appendChild(turnaround);
  info.appendChild(fasting);

  body.appendChild(description);
  body.appendChild(biomarkers);
  body.appendChild(info);

  // Footer
  const footer = document.createElement('div');
  footer.className = 'test-card__footer';

  const priceWrapper = document.createElement('div');
  const price = document.createElement('span');
  price.className = 'test-card__price';
  price.textContent = `$${test.price}`;
  const priceLabel = document.createElement('span');
  priceLabel.className = 'test-card__price-label';
  priceLabel.textContent = ' per test';
  priceWrapper.appendChild(price);
  priceWrapper.appendChild(priceLabel);

  const button = document.createElement('button');
  button.className = 'btn btn--primary btn--sm';
  button.setAttribute('aria-label', `Add ${test.name} to cart`);
  button.dataset.action = 'addToCart';
  button.dataset.testId = test.id;
  button.textContent = 'Add to Cart';

  footer.appendChild(priceWrapper);
  footer.appendChild(button);

  article.appendChild(header);
  article.appendChild(body);
  article.appendChild(footer);

  return article;
}

function renderTests(category = 'all', limit = 6) {
  if (!elements.testGrid) return;

  let filteredTests = category === 'all'
    ? testCatalog
    : testCatalog.filter(test => test.category === category);

  const testsToShow = filteredTests.slice(0, limit);

  // Clear existing content safely
  elements.testGrid.textContent = '';

  // Use DocumentFragment for better performance
  const fragment = document.createDocumentFragment();
  testsToShow.forEach(test => {
    fragment.appendChild(createTestCard(test));
  });
  elements.testGrid.appendChild(fragment);

  // Update load more button visibility
  if (elements.loadMore) {
    elements.loadMore.style.display = limit >= filteredTests.length ? 'none' : 'inline-flex';
  }
}

function getCategoryLabel(category) {
  const labels = {
    'hormones': 'Performance Hormone',
    'thyroid': 'Thyroid',
    'metabolic': 'Metabolic',
    'panels': 'Complete Panel'
  };
  return labels[category] || category;
}

// =============================================================================
// AI Chatbot Functions
// =============================================================================

const chatResponses = {
  testosterone: {
    keywords: ['testosterone', 'test', 't levels', 'low t', 'trt', 'hypogonadism'],
    response: `For testosterone optimization, I'd recommend starting with our **Testosterone Complete Panel** ($129). It includes Total T, Free T, SHBG, and Albumin - giving you the full picture of your testosterone status.

If you're already on TRT, our **TRT Monitoring Panel** ($199) adds estradiol, hematocrit, PSA, and liver function.

Would you like me to add either of these to your cart?`,
    suggestions: ['Add Testosterone Complete', 'Add TRT Monitoring', 'Tell me more about Free T']
  },
  fatigue: {
    keywords: ['fatigue', 'tired', 'energy', 'exhausted', 'low energy'],
    response: `Fatigue can have many causes. Our **Energy & Fatigue Panel** ($229) is designed specifically for this - it covers:

- Thyroid (TSH, Free T3, Free T4)
- Hormones (Testosterone)
- Iron panel & B12
- Cortisol (adrenal function)
- Vitamin D

This comprehensive approach helps identify the root cause. Would you like to add it to your cart?`,
    suggestions: ['Add Energy Panel', 'Check thyroid only', 'What about iron?']
  },
  baseline: {
    keywords: ['baseline', 'complete', 'full', 'comprehensive', 'everything', 'all'],
    response: `For a complete baseline, I recommend our **Complete Performance Panel** ($179) - it's our most popular option and includes 15 key biomarkers:

- Full testosterone panel (Total, Free, SHBG)
- Estradiol
- Thyroid (TSH, Free T3, Free T4)
- Metabolic panel
- Lipids & inflammation (hs-CRP)
- Vitamin D

It's the gold standard for performance optimization. Ready to add it?`,
    suggestions: ['Add Complete Panel', 'What tests are included?', 'Something more basic']
  },
  estrogen: {
    keywords: ['estrogen', 'estradiol', 'e2', 'aromatase', 'high estrogen'],
    response: `For estrogen monitoring, I recommend the **Estradiol Ultrasensitive** test ($79) using LC/MS methodology - it's the most accurate method for men.

If you're on TRT, estrogen management is crucial. Optimal E2 levels support mood, libido, joint health, and cardiovascular protection.

Should I add this to your cart?`,
    suggestions: ['Add Estradiol test', 'What\'s optimal E2?', 'Full hormone panel instead']
  },
  thyroid: {
    keywords: ['thyroid', 'metabolism', 'tsh', 't3', 't4', 'hashimotos'],
    response: `For comprehensive thyroid assessment, our **Thyroid Complete Panel** ($129) includes:

- TSH (pituitary signal)
- Free T3 (active hormone)
- Free T4 (storage hormone)
- Thyroid antibodies (autoimmune screening)

This covers all bases including Hashimoto's detection. Want me to add it?`,
    suggestions: ['Add Thyroid Panel', 'Basic TSH only', 'Include hormones too']
  },
  weight: {
    keywords: ['weight', 'lose weight', 'fat loss', 'body composition', 'metabolism'],
    response: `For weight loss optimization, our **Weight Loss Panel** ($199) targets key metabolic markers:

- Thyroid function (metabolism)
- Testosterone & estradiol
- Fasting insulin & HbA1c (blood sugar)
- hs-CRP (inflammation)
- Cortisol (stress hormone)

These markers directly affect your ability to lose fat. Should I add it to your cart?`,
    suggestions: ['Add Weight Loss Panel', 'Focus on insulin', 'Thyroid only']
  },
  sleep: {
    keywords: ['sleep', 'insomnia', 'rest', 'recovery'],
    response: `Poor sleep often has underlying biochemical causes. Our **Sleep Optimization Panel** ($179) checks:

- Testosterone & cortisol
- Thyroid function
- Iron & ferritin
- B12 & magnesium
- Vitamin D

All of these can significantly impact sleep quality. Want to add it?`,
    suggestions: ['Add Sleep Panel', 'Check magnesium', 'Full baseline instead']
  },
  default: {
    response: `I can help you find the right tests for your goals. Here are some common starting points:

**Performance Baseline** ($299) - Complete overview for athletes
**Male Hormone Panel** ($149) - Essential testosterone assessment
**Complete Performance** ($179) - Our most comprehensive panel

What specific aspect of your health are you looking to optimize?`,
    suggestions: ['Testosterone optimization', 'Fatigue & energy', 'Full baseline']
  }
};

function getChatResponse(message) {
  const lowerMessage = message.toLowerCase();

  for (const [key, data] of Object.entries(chatResponses)) {
    if (key === 'default') continue;
    if (data.keywords && data.keywords.some(kw => lowerMessage.includes(kw))) {
      return data;
    }
  }

  return chatResponses.default;
}

function addChatMessage(content, isUser = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `chatbot__message chatbot__message--${isUser ? 'user' : 'bot'}`;

  if (isUser) {
    // User messages: always use textContent for safety
    messageDiv.textContent = content;
  } else {
    // Bot messages: may contain markdown, sanitize and convert
    // Simple markdown to text conversion (bold only for safety)
    const sanitized = escapeHtml(content)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
    messageDiv.innerHTML = sanitized;
  }

  elements.chatbotMessages.appendChild(messageDiv);
  elements.chatbotMessages.scrollTop = elements.chatbotMessages.scrollHeight;
}

function updateChatSuggestions(suggestions) {
  if (!elements.chatbotSuggestions) return;

  if (suggestions && suggestions.length > 0) {
    // Clear existing content safely
    elements.chatbotSuggestions.textContent = '';

    suggestions.forEach(s => {
      const button = document.createElement('button');
      button.className = 'chatbot__suggestion';
      button.dataset.message = s;
      button.textContent = s;
      elements.chatbotSuggestions.appendChild(button);
    });
    elements.chatbotSuggestions.style.display = 'flex';
  } else {
    elements.chatbotSuggestions.style.display = 'none';
  }
}

function handleChatMessage(message) {
  if (!message.trim()) return;

  // Add user message
  addChatMessage(message, true);

  // Clear input
  if (elements.chatbotInput) {
    elements.chatbotInput.value = '';
  }

  // Get response
  const response = getChatResponse(message);

  // Simulate typing delay
  setTimeout(() => {
    addChatMessage(response.response);
    updateChatSuggestions(response.suggestions);
  }, 500);
}

function toggleChatbot(open) {
  state.chatOpen = open !== undefined ? open : !state.chatOpen;

  if (elements.chatbotWindow) {
    elements.chatbotWindow.classList.toggle('open', state.chatOpen);
    elements.chatbotWindow.setAttribute('aria-hidden', !state.chatOpen);
  }

  if (elements.chatbotToggle) {
    elements.chatbotToggle.setAttribute('aria-expanded', state.chatOpen);
  }
}

// =============================================================================
// Mobile Menu Functions
// =============================================================================

function toggleMobileMenu(open) {
  state.mobileMenuOpen = open !== undefined ? open : !state.mobileMenuOpen;

  if (elements.mobileNav) {
    elements.mobileNav.classList.toggle('open', state.mobileMenuOpen);
    elements.mobileNav.setAttribute('aria-hidden', !state.mobileMenuOpen);
  }

  if (elements.mobileToggle) {
    elements.mobileToggle.setAttribute('aria-expanded', state.mobileMenuOpen);
  }
}

// =============================================================================
// Notification System
// =============================================================================

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
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
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'alert__icon');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');

  if (type === 'success') {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M20 6L9 17l-5-5');
    svg.appendChild(path);
  } else {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '12');
    circle.setAttribute('cy', '12');
    circle.setAttribute('r', '10');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M12 16v-4M12 8h.01');
    svg.appendChild(circle);
    svg.appendChild(path);
  }

  const span = document.createElement('span');
  span.textContent = message; // Safe: textContent

  notification.appendChild(svg);
  notification.appendChild(span);

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// =============================================================================
// Optimized Scroll Handling (Combined for Performance)
// =============================================================================

// Single scroll handler for all scroll-based effects (reduces event listener overhead)
const scrollState = {
  handler: null,
  navbar: null,
  backBtn: null,
  helpBtn: null,
  testsSection: null,
  stickyBar: null,
  lastScrollY: 0,
  ticking: false
};

function initCombinedScrollHandler() {
  // Cache DOM references
  scrollState.navbar = document.querySelector('.navbar');
  scrollState.backBtn = document.getElementById('backToTop');
  scrollState.helpBtn = document.getElementById('helpButton');
  scrollState.testsSection = document.getElementById('tests');
  scrollState.stickyBar = document.getElementById('stickyCartBar');

  // Remove existing handler if any
  if (scrollState.handler) {
    window.removeEventListener('scroll', scrollState.handler);
  }

  // Combined scroll handler using requestAnimationFrame for performance
  scrollState.handler = () => {
    scrollState.lastScrollY = window.scrollY;

    if (!scrollState.ticking) {
      window.requestAnimationFrame(() => {
        handleScrollEffects(scrollState.lastScrollY);
        scrollState.ticking = false;
      });
      scrollState.ticking = true;
    }
  };

  window.addEventListener('scroll', scrollState.handler, { passive: true });
}

function handleScrollEffects(scrollY) {
  // Navbar scrolled effect
  if (scrollState.navbar) {
    if (scrollY > 50) {
      scrollState.navbar.classList.add('scrolled');
    } else {
      scrollState.navbar.classList.remove('scrolled');
    }
  }

  // Floating buttons visibility
  const floatingVisible = scrollY > 500;
  if (scrollState.backBtn) {
    scrollState.backBtn.style.opacity = floatingVisible ? '1' : '0';
    scrollState.backBtn.style.visibility = floatingVisible ? 'visible' : 'hidden';
  }
  if (scrollState.helpBtn) {
    scrollState.helpBtn.style.opacity = floatingVisible ? '1' : '0';
    scrollState.helpBtn.style.visibility = floatingVisible ? 'visible' : 'hidden';
  }

  // Sticky cart bar
  if (scrollState.testsSection && scrollState.stickyBar) {
    const rect = scrollState.testsSection.getBoundingClientRect();
    if (rect.bottom < 0 && state.cart.length > 0) {
      scrollState.stickyBar.classList.add('active');
    } else {
      scrollState.stickyBar.classList.remove('active');
    }
  }
}

// Legacy function names for compatibility
function initNavbarScroll() {
  // Now handled by combined scroll handler
}

function initFloatingButtons() {
  // Now handled by combined scroll handler
}

// Cleanup function for page unload (memory leak prevention)
function cleanupScrollHandlers() {
  if (scrollState.handler) {
    window.removeEventListener('scroll', scrollState.handler);
  }
}

// Cleanup on page unload
window.addEventListener('pagehide', cleanupScrollHandlers);

// =============================================================================
// State Restriction Check
// =============================================================================

function checkStateRestriction(state) {
  return restrictedStates.includes(state.toUpperCase());
}

// =============================================================================
// Event Listeners
// =============================================================================

function initEventListeners() {
  // Mobile menu toggle
  if (elements.mobileToggle) {
    elements.mobileToggle.addEventListener('click', () => toggleMobileMenu());
  }

  // Chatbot toggle
  if (elements.chatbotToggle) {
    elements.chatbotToggle.addEventListener('click', () => toggleChatbot());
  }

  // Chatbot close
  if (elements.chatbotClose) {
    elements.chatbotClose.addEventListener('click', () => toggleChatbot(false));
  }

  // Chatbot send
  if (elements.chatbotSend) {
    elements.chatbotSend.addEventListener('click', () => {
      if (elements.chatbotInput) {
        handleChatMessage(elements.chatbotInput.value);
      }
    });
  }

  // Chatbot input enter key
  if (elements.chatbotInput) {
    elements.chatbotInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleChatMessage(elements.chatbotInput.value);
      }
    });
  }

  // Chatbot suggestions
  if (elements.chatbotSuggestions) {
    elements.chatbotSuggestions.addEventListener('click', (e) => {
      if (e.target.classList.contains('chatbot__suggestion')) {
        handleChatMessage(e.target.dataset.message);
      }
    });
  }

  // Open chatbot buttons
  if (elements.openChatbot) {
    elements.openChatbot.addEventListener('click', () => toggleChatbot(true));
  }
  if (elements.ctaChatbot) {
    elements.ctaChatbot.addEventListener('click', () => toggleChatbot(true));
  }

  // Load more tests
  if (elements.loadMore) {
    elements.loadMore.addEventListener('click', () => {
      state.testsDisplayed += 6;
      renderTests(state.currentCategory, state.testsDisplayed);
    });
  }

  // Cart toggle
  if (elements.cartToggle) {
    elements.cartToggle.addEventListener('click', () => {
      window.location.href = 'checkout.html';
    });
  }

  // Close mobile menu on link click (uses cached query)
  cachedQueries.mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(false));
  });

  // Featured panel add to cart
  const featuredBtn = document.querySelector('[data-test-id="complete-panel"]');
  if (featuredBtn) {
    featuredBtn.addEventListener('click', () => addToCart('complete-performance'));
  }
}

// =============================================================================
// AI Chat - Gains Assistant Responses
// =============================================================================

const aiResponses = {
  // TRT specific
  trt: {
    message: "💉 Ready to transform with TRT? Our TRT Gains subscription includes monthly testosterone delivery, blood monitoring, and unlimited telehealth visits - all for $149/mo. Everything you need to optimize your hormones!",
    plan: 'trt'
  },
  testosterone: {
    message: "💪 Low testosterone holding you back? Our TRT Gains plan gets you monthly testosterone delivery, required blood tests, and doctor consultations - all included for $149/mo!",
    plan: 'trt'
  },
  lowt: {
    message: "🔬 Symptoms of Low T: fatigue, low libido, can't build muscle? Our TRT Gains subscription ($149/mo) includes everything - medication, blood monitoring, and telehealth visits!",
    plan: 'trt'
  },

  // HGH specific
  hgh: {
    message: "🚀 Ready for HGH therapy? Our HGH Gains subscription ($199/mo) includes monthly HGH delivery, monthly blood panels, body composition tracking, and unlimited telehealth visits!",
    plan: 'hgh'
  },
  growth: {
    message: "📈 Growth hormone is KEY for muscle, recovery, and anti-aging. Our HGH Gains plan ($199/mo) includes everything - monthly delivery, blood monitoring, and doctor access!",
    plan: 'hgh'
  },
  igf: {
    message: "🧬 Want to optimize your IGF-1 and growth hormone? Our HGH Gains subscription includes monthly HGH delivery plus all the monitoring you need - $199/mo!",
    plan: 'hgh'
  },

  // Muscle & Fitness
  muscle: {
    message: "🏋️ Can't build muscle? Hormones are likely the issue. TRT Gains ($149/mo) or HGH Gains ($199/mo) - both include medication delivery, blood tests, and telehealth!",
    plan: 'trt'
  },
  gains: {
    message: "📈 No gains? 90% of hardgainers have suboptimal hormones. Start TRT ($149/mo) or HGH ($199/mo) therapy - medication, monitoring, and doctor visits all included!",
    plan: 'trt'
  },
  bodybuilding: {
    message: "🏆 Serious about bodybuilding? TRT Gains ($149/mo) for testosterone optimization or HGH Gains ($199/mo) for growth hormone - both include everything you need!",
    plan: 'trt'
  },

  // Energy & Fatigue
  tired: {
    message: "😴 Always tired? Low testosterone is often the cause. Our TRT Gains ($149/mo) includes monthly medication, blood monitoring, and unlimited doctor consultations!",
    plan: 'trt'
  },
  fatigue: {
    message: "⚡ Fatigue killing your gains? TRT Gains can help! $149/mo gets you monthly testosterone, blood tests, and telehealth visits - all included!",
    plan: 'trt'
  },
  energy: {
    message: "🔋 Want more energy? TRT Gains ($149/mo) includes monthly testosterone delivery, required blood monitoring, and unlimited telehealth - everything to optimize your levels!",
    plan: 'trt'
  },

  // Pricing questions
  price: {
    message: "💰 Our plans: TRT Gains is $149/mo (or $1,490/yr - save $298!). HGH Gains is $199/mo (or $1,990/yr - save $398!). Both include medication, blood tests, and telehealth!",
    plan: null
  },
  cost: {
    message: "💰 TRT Gains: $149/mo or $1,490/yr (save $298). HGH Gains: $199/mo or $1,990/yr (save $398). Everything included - no hidden fees!",
    plan: null
  },

  // Fitness-specific responses
  timeline: {
    message: "⚡ Here's your timeline: Choose plan TODAY → Labs within 48hrs at 4,500+ locations → Doctor review in 24-48hrs → Ships same day. TOTAL TIME TO FIRST INJECTION: ~7 DAYS. Week 1-2: Energy improves. Week 3-4: Better sleep, mood lifting. Week 6-8: Visible gains, PRs returning. Week 12+: Full transformation!",
    plan: 'trt'
  },
  fast: {
    message: "🚀 How fast? Most warriors see: Week 1-2: Energy boost, better sleep. Week 3-4: Mood improvement, strength returning. Week 6-8: VISIBLE gains, hitting PRs again. Week 12+: Full optimization. 94% of our guys see results by week 6!",
    plan: 'trt'
  },
  results: {
    message: "📊 Real results: Our warriors average +287 ng/dL testosterone increase. 94% see results within 6 weeks. Week 6-8 is when most guys start destroying PRs again. Ready to start your transformation?",
    plan: 'trt'
  },
  stack: {
    message: "💪 STACKING TRT + HGH = 2.3x faster results on average! TRT handles testosterone ($149/mo), HGH accelerates recovery and lean mass ($199/mo). Together: $299/mo (save $49/mo vs. separate). Same discreet packaging, ships together!",
    plan: null
  },
  both: {
    message: "🔥 Smart choice asking about both! TRT + HGH stack = maximum gains. TRT for testosterone optimization, HGH for recovery and muscle. Stack price: $299/mo (save $49 vs buying separately). 2.3x faster results on average!",
    plan: null
  },
  sides: {
    message: "⚕️ Real talk: Side effects are minimal when properly monitored. That's why we include monthly blood work - your doctor watches your levels and adjusts as needed. Common early sides (if any): slight water retention, increased appetite. Most guys feel BETTER, not worse. Questions? Your doc is always available via telehealth.",
    plan: null
  },
  safe: {
    message: "🛡️ Safety first, always. Your plan includes: Monthly blood panels to monitor levels, licensed physician oversight, unlimited telehealth access, and FDA-registered pharmacy compounds. We catch any issues early. 12,847 warriors strong - safety is how we got here.",
    plan: null
  },
  legit: {
    message: "✅ 100% legit pharma-grade compounds from FDA-registered US pharmacies. Same quality used by elite athletes. No underdosed garbage, no sketchy overseas stuff. Every batch tested. Your doc monitors your bloods monthly to verify it's working. This is the real deal.",
    plan: 'trt'
  },
  quality: {
    message: "💉 Pharma-grade quality: Made in FDA-registered US facilities, same compounds used by elite athletes, every batch tested for purity and potency. No underdosed garbage. Monthly blood panels prove it's working. 12,847 warriors trust us with their gains.",
    plan: 'trt'
  },
  discreet: {
    message: "📦 Total discretion: Plain brown packaging, no logos or labels indicating contents. Shipped from a generic medical supply address. Your bank statement shows a generic medical billing name. No one knows your business but you and your doctor.",
    plan: null
  },
  private: {
    message: "🔒 Your privacy is locked down: HIPAA-protected medical records, discreet plain packaging, generic billing name on statements. We treat your info like it's ours. No one knows your business.",
    plan: null
  },
  which: {
    message: "🤔 TRT vs HGH? Here's the breakdown: TRT ($149/mo) = testosterone optimization. Best for: energy, strength, libido, mood. HGH ($199/mo) = growth hormone. Best for: recovery, body comp, anti-aging. Want MAXIMUM gains? Stack both for $299/mo and see 2.3x faster results!",
    plan: null
  },

  default: {
    message: "💉 Ready to transform? We offer TRT Gains ($149/mo) and HGH Gains ($199/mo) subscriptions. Both include monthly medication delivery, blood monitoring, and unlimited telehealth visits. ~7 days to first injection. Which interests you?",
    plan: null
  },
  offTopic: {
    message: "💉 I help warriors start TRT and HGH therapy! Our subscriptions include medication delivery, blood tests, and telehealth - all in one plan. Ships in ~7 days. Ask me about TRT ($149/mo) or HGH ($199/mo)!",
    plan: null
  }
};

// Priority keyword mappings for AI chat
const priorityKeywords = {
  'trt': 'trt', 'testosterone replacement': 'trt', 'on trt': 'trt', 'start trt': 'trt',
  'hgh': 'hgh', 'growth hormone': 'hgh', 'human growth': 'hgh', 'gh therapy': 'hgh',
  'igf': 'igf', 'igf-1': 'igf', 'igf1': 'igf',
  'low t': 'lowt', 'low testosterone': 'lowt',
  'build muscle': 'muscle', 'muscle building': 'muscle', 'bulking': 'muscle',
  'gains': 'gains', 'maximize gains': 'gains', 'making gains': 'gains', 'no gains': 'gains',
  'bodybuilding': 'bodybuilding', 'bodybuilder': 'bodybuilding',
  'lifting': 'muscle', 'gym': 'muscle', 'workout': 'performance',
  'recovery': 'recovery', 'overtraining': 'recovery',
  'estrogen': 'estrogen', 'e2': 'estrogen', 'estradiol': 'estrogen',
  'testosterone': 'testosterone', 'test levels': 'testosterone',
  'no energy': 'energy', 'low energy': 'energy', 'always tired': 'tired',
  'fatigue': 'fatigue', 'exhausted': 'fatigue',
  'thyroid': 'thyroid', 'metabolism': 'metabolism',
  'weight': 'weight', 'lose weight': 'weight',
  'checkup': 'checkup', 'baseline': 'checkup', 'full panel': 'complete',
  'injection': 'trt', 'injections': 'trt',
  // Fitness-specific keywords
  'how fast': 'fast', 'how quickly': 'fast', 'see gains': 'fast', 'see results': 'results',
  'timeline': 'timeline', 'how long': 'timeline', 'when will': 'timeline',
  'stack': 'stack', 'stacking': 'stack', 'combine': 'stack', 'trt and hgh': 'both', 'both': 'both',
  'side effect': 'sides', 'sides': 'sides', 'safe': 'safe', 'safety': 'safe',
  'legit': 'legit', 'real': 'legit', 'pharma grade': 'quality', 'pharma-grade': 'quality', 'quality': 'quality',
  'discreet': 'discreet', 'discrete': 'discreet', 'packaging': 'discreet', 'private': 'private', 'privacy': 'private',
  'which one': 'which', 'trt or hgh': 'which', 'difference': 'which'
};

function handleAiKeypress(event) {
  if (event.key === 'Enter') {
    sendAiMessage();
  }
}

function createAiTestCard(test) {
  const card = document.createElement('div');
  card.className = 'ai-test-card';
  card.style.cssText = 'display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: rgba(212, 175, 55, 0.05); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 12px; margin-top: 0.5rem; transition: all 0.2s;';

  const emoji = document.createElement('span');
  emoji.style.fontSize = '1.25rem';
  emoji.textContent = '🧪';

  const info = document.createElement('div');
  info.style.flex = '1';
  const name = document.createElement('div');
  name.style.cssText = 'font-weight: 600; color: #fff; font-size: 0.85rem;';
  name.textContent = test.name;
  const priceText = document.createElement('div');
  priceText.style.cssText = 'color: #D4AF37; font-weight: 700; font-size: 0.9rem;';
  priceText.textContent = `$${test.price}`;
  info.appendChild(name);
  info.appendChild(priceText);

  const addBtn = document.createElement('button');
  addBtn.style.cssText = 'padding: 0.5rem 1rem; background: linear-gradient(135deg, #D4AF37 0%, #8B0000 100%); border: none; border-radius: 50px; color: #fff; font-weight: 700; font-size: 0.75rem; cursor: pointer; transition: all 0.2s; box-shadow: 0 0 10px rgba(212, 175, 55, 0.4);';
  addBtn.textContent = '+ Add';
  addBtn.dataset.action = 'addToCartFromAI';
  addBtn.dataset.testId = test.id;
  addBtn.onmouseover = () => { addBtn.style.transform = 'scale(1.05)'; addBtn.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.6)'; };
  addBtn.onmouseout = () => { addBtn.style.transform = 'scale(1)'; addBtn.style.boxShadow = '0 0 10px rgba(212, 175, 55, 0.4)'; };

  card.appendChild(emoji);
  card.appendChild(info);
  card.appendChild(addBtn);

  return card;
}

function createTypingIndicator() {
  const wrapper = document.createElement('div');
  wrapper.className = 'ai-message bot';
  wrapper.id = 'typingIndicator';

  const content = document.createElement('div');
  content.className = 'message-content';

  const indicator = document.createElement('div');
  indicator.className = 'typing-indicator';
  for (let i = 0; i < 3; i++) {
    indicator.appendChild(document.createElement('span'));
  }

  content.appendChild(indicator);
  wrapper.appendChild(content);
  return wrapper;
}

function sendAiMessage(presetMessage = null) {
  const input = document.getElementById('aiChatInput');
  const messagesContainer = document.getElementById('aiChatMessages');
  const message = presetMessage || (input ? input.value.trim() : '');

  if (!message || !messagesContainer) return;

  // Add user message using DOM methods
  const userMsg = document.createElement('div');
  userMsg.className = 'ai-message user';
  const userContent = document.createElement('div');
  userContent.className = 'message-content';
  const userP = document.createElement('p');
  userP.textContent = message; // Safe: textContent
  userContent.appendChild(userP);
  userMsg.appendChild(userContent);
  messagesContainer.appendChild(userMsg);

  // Clear input
  if (input) input.value = '';

  // Add typing indicator using DOM methods
  messagesContainer.appendChild(createTypingIndicator());
  // Scroll to bottom after user message
  requestAnimationFrame(() => {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  });

  // Get response after delay
  setTimeout(() => {
    document.getElementById('typingIndicator')?.remove();
    const response = getAiResponse(message);

    // Get recommended tests (if response has tests array)
    const recommendedTests = response.tests
      ? testCatalog.filter(test => response.tests.includes(test.id)).slice(0, 4)
      : [];

    // Build AI response using DOM methods
    const aiMsg = document.createElement('div');
    aiMsg.className = 'ai-message bot';
    const aiContent = document.createElement('div');
    aiContent.className = 'message-content';

    const aiP = document.createElement('p');
    aiP.textContent = response.message;
    aiContent.appendChild(aiP);

    // Add test cards safely
    recommendedTests.forEach(test => {
      aiContent.appendChild(createAiTestCard(test));
    });

    aiMsg.appendChild(aiContent);
    messagesContainer.appendChild(aiMsg);
    // Scroll to bottom after DOM update
    requestAnimationFrame(() => {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      aiMsg.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
  }, 1200);
}

function getAiResponse(message) {
  const msg = message.toLowerCase().trim();

  // Smart intent detection with contextual responses

  // WOMEN / FEMALE questions - check FIRST before other patterns (includes common typos)
  if (msg.match(/wom[ae]n|wom[ae]m|womon|fem[ae]le?|feml|girl|wif[ew]?|girlfr[ie]+nd|grilfriend|her\b|she\b/i)) {
    if (msg.match(/trt|testos?t[eo]r+one?|testorone/i)) {
      return { message: "Yes, women can absolutely benefit from testosterone therapy! Here's what you need to know:\n\n💉 DOSING FOR WOMEN:\n• Women use MUCH lower doses: 5-15mg/week (vs 100-200mg for men)\n• Typically delivered via cream, pellets, or micro-dose injections\n• Goal: Restore to optimal female range (15-70 ng/dL)\n\n✨ BENEFITS FOR WOMEN:\n• Increased energy and motivation\n• Improved libido and sexual function\n• Better muscle tone and reduced body fat\n• Mental clarity and mood stability\n• Stronger bones\n\n🔬 BEST PAIRED WITH:\n• Progesterone (balances hormones, improves sleep)\n• DHEA (precursor hormone, supports adrenals)\n• Thyroid optimization if needed\n\n⚠️ IMPORTANT: Women should NOT use male-dosed TRT. Always work with a provider experienced in female hormone optimization.\n\nWant to learn more? Our team can discuss women's protocols - reach out at support@weightgain.com" };
    }
    if (msg.match(/hgh|gr[ow]+th\s*h[oa]rm[oa]ne?/i)) {
      return { message: "HGH is actually excellent for women - here's the full breakdown:\n\n💉 DOSING FOR WOMEN:\n• Typical dose: 1-2 IU per day (similar to men, sometimes slightly lower)\n• Usually taken before bed to mimic natural release\n• Start low (0.5-1 IU) and titrate up based on IGF-1 levels\n\n✨ BENEFITS FOR WOMEN:\n• Improved body composition (less fat, more lean mass)\n• Better skin elasticity and reduced wrinkles\n• Deeper, more restorative sleep\n• Faster recovery from workouts\n• Stronger hair and nails\n• Enhanced collagen production\n\n🔬 BEST PAIRED WITH:\n• Low-dose testosterone (5-10mg/week) for synergistic fat loss\n• Progesterone for sleep and hormone balance\n• Peptides like Ipamorelin for natural GH stimulation\n\n📊 WHAT TO MONITOR:\n• IGF-1 levels (target 200-250 ng/mL)\n• Fasting glucose (HGH can affect insulin sensitivity)\n• Thyroid function\n\nWomen often see dramatic anti-aging and body composition results with HGH. Contact support@weightgain.com to discuss women's HGH protocols." };
    }
    return { message: "Great question about women's hormone optimization! Here's what you should know:\n\n🔬 WOMEN'S HORMONE THERAPY OPTIONS:\n\n1️⃣ TESTOSTERONE (Low-Dose)\n• 5-15mg/week via cream or pellets\n• Boosts energy, libido, muscle tone, mental clarity\n• Must be female-appropriate dosing\n\n2️⃣ HGH (Growth Hormone)\n• 1-2 IU daily\n• Anti-aging, fat loss, better sleep, skin quality\n• Works great for women\n\n3️⃣ PROGESTERONE\n• Often the missing piece for women\n• Improves sleep, reduces anxiety, balances estrogen\n• Usually 100-200mg at bedtime\n\n4️⃣ DHEA\n• Precursor to testosterone and estrogen\n• 10-25mg daily for women\n• Supports adrenal function\n\n💡 BEST STACK FOR WOMEN:\nMost women see best results combining low-dose testosterone + progesterone, adding HGH if anti-aging/body comp is the goal.\n\n⚠️ KEY DIFFERENCE FROM MEN:\nWomen need MUCH lower testosterone doses and should always include progesterone for balance.\n\nOur team can create a women-specific protocol. Email support@weightgain.com with your goals!" };
  }

  // AGE questions
  if (msg.match(/how old|minimum age|too young|too old|year.?old|\bage\b/i) || msg.match(/\b(18|21|25|30)\b.*(old|age|qualify|eligible)/i)) {
    return { message: "Age requirements:\n\n✅ Must be 18+ to qualify\n✅ Optimal candidates are typically 25-65\n✅ Men under 25 may have naturally fluctuating T levels\n✅ Men over 65 can absolutely benefit - we have many warriors in that range\n\nYour labs will tell the real story. Low T doesn't discriminate by age. If you're experiencing symptoms, it's worth getting tested." };
  }

  // MEDICAL CONDITIONS / CONTRAINDICATIONS
  if (msg.match(/cancer|heart (disease|condition|problem)|liver|kidney|disease|condition|health issue|prostate|blood clot|diabetes/i)) {
    return { message: "Great question - we take safety seriously.\n\nOur doctors will review your complete medical history before approving any treatment. Some conditions require additional evaluation:\n\n⚠️ Conditions that need careful review:\n• Prostate issues\n• Heart conditions\n• Blood clotting disorders\n• Liver or kidney problems\n• History of certain cancers\n\n✅ Many men WITH these conditions still qualify - it depends on specifics.\n\nYour safety comes first. The doctor will discuss your individual situation during the consultation and may request additional tests if needed." };
  }

  // ELIGIBILITY / QUALIFICATION questions
  if (msg.match(/qualify|eligible|can i (get|take|use|start)|am i a candidate|do i qualify|will i qualify/i)) {
    return { message: "Here's how qualification works:\n\n1️⃣ You sign up and get labs done (4,500+ locations)\n2️⃣ Our doctors review your hormone levels\n3️⃣ If your levels are suboptimal, you qualify\n\n📊 Who typically qualifies:\n• Men with T levels below optimal range\n• Men experiencing low T symptoms (fatigue, low libido, brain fog, muscle loss)\n• Men 18+ in reasonable health\n\n✅ 87% of men who complete labs qualify for treatment.\n\nThe only way to know for sure is to get tested. Labs are included in your plan - no extra cost." };
  }

  // TIMELINE / SPEED questions
  if (msg.match(/how (fast|quick|long|soon)|when (will|can|do)|timeline|time to|days|weeks/i)) {
    if (msg.includes('result') || msg.includes('gain') || msg.includes('see') || msg.includes('notice')) {
      return { message: "Great question! Here's what most warriors experience:\n\n📅 Week 1-2: Energy boost kicks in, better sleep\n📅 Week 3-4: Mood improves, strength returning\n📅 Week 6-8: VISIBLE gains, PRs coming back\n📅 Week 12+: Full transformation mode\n\n94% of our guys notice real changes by week 6. The first injection? That's only ~7 days away from right now." };
    }
    if (msg.includes('start') || msg.includes('ship') || msg.includes('deliver') || msg.includes('get')) {
      return { message: "Speed is our thing 💨\n\n• Sign up: TODAY\n• Labs: Within 48 hours (4,500+ locations)\n• Doctor review: 24-48 hours after labs\n• Ships: SAME DAY after approval\n• At your door: 2-3 days\n\nTotal time to first injection: ~7 days. We don't make you wait." };
    }
    return { message: "Here's the full timeline:\n\n⚡ TODAY: Choose your plan\n⚡ 48 HRS: Complete labs\n⚡ 24-48 HRS: Doctor reviews\n⚡ SAME DAY: Ships after approval\n\nFirst injection in ~7 days. Results start showing week 2-3, and by week 6-8 you'll be seeing real gains in the mirror." };
  }

  // TRT vs HGH / WHICH ONE questions
  if (msg.match(/which (one|should)|trt (or|vs|versus) hgh|difference|compare|better for/i) || (msg.includes('trt') && msg.includes('hgh'))) {
    return { message: "Let me break it down for you:\n\n💉 TRT ($149/mo) - Testosterone optimization\n• Best for: Energy, strength, libido, mood, focus\n• You'll feel: More drive, better recovery, mental clarity\n\n🧬 HGH ($199/mo) - Growth hormone therapy\n• Best for: Recovery, body recomp, anti-aging, sleep\n• You'll feel: Faster recovery, leaner body, better skin\n\n🔥 STACK BOTH ($299/mo) - Maximum gains\n• 2.3x faster results on average\n• Save $49/mo vs buying separately\n\nWhat's your main goal? I can give you a specific recommendation." };
  }

  // STACKING questions
  if (msg.match(/stack|combine|both|together/i)) {
    return { message: "Smart thinking! Stacking TRT + HGH is how serious warriors maximize results.\n\n📊 The data: Guys who stack see 2.3x faster results on average\n\n💪 TRT handles: Testosterone, strength, energy, drive\n🧬 HGH handles: Recovery, body comp, sleep, anti-aging\n\n💰 Stack pricing: $299/mo (vs $348 separately)\nYou save $49 EVERY month.\n\nSame discreet packaging, ships together. Want me to set you up with the stack?" };
  }

  // SIDE EFFECTS / SAFETY questions
  if (msg.match(/side effect|safe|risk|danger|worried|concern|scared/i)) {
    return { message: "Real talk - I respect you asking.\n\n✅ When properly monitored, side effects are minimal. That's exactly why we include:\n• Monthly blood panels (we watch your levels)\n• Licensed physician oversight\n• Unlimited telehealth (ask anything, anytime)\n\n📋 What some guys experience early on:\n• Slight water retention (temporary)\n• Increased appetite (your body wants to grow)\n• Better mood, more energy (the good stuff)\n\nWe've helped 12,847 warriors. Safety through monitoring is how we got here. Your doc adjusts your protocol based on YOUR labs." };
  }

  // QUALITY / LEGITIMACY questions
  if (msg.match(/legit|real|quality|pharma|genuine|fake|trust|scam/i)) {
    return { message: "100% legit, and I'll prove it:\n\n✅ Pharma-grade compounds from FDA-registered US pharmacies\n✅ Same quality used by elite athletes and clinics\n✅ Every batch tested for purity and potency\n✅ Monthly blood work PROVES it's working\n\n🚫 No underdosed garbage\n🚫 No sketchy overseas sources\n🚫 No grey market stuff\n\n12,847 warriors trust us with their gains. Your labs will show the results. That's the proof that matters." };
  }

  // PRIVACY / DISCRETION questions
  if (msg.match(/discreet|private|secret|packaging|plain|know|wife|family|work/i)) {
    return { message: "Your privacy is locked down tight 🔒\n\n📦 Packaging: Plain brown box, NO logos, NO indication of contents\n🏷️ Return address: Generic medical supply company\n💳 Bank statement: Shows generic medical billing name\n📋 Medical records: HIPAA protected, always\n\nNo one knows your business but you and your doctor. Not your mailman, not your roommate, not anyone. We get it - discretion matters." };
  }

  // PRICE / COST questions
  if (msg.match(/price|cost|how much|afford|expensive|pay|money|insurance/i)) {
    return { message: "Here's exactly what you pay:\n\n💉 TRT Gains: $149/mo\n• Or $1,490/year (save $298)\n\n🧬 HGH Gains: $199/mo  \n• Or $1,990/year (save $398)\n\n🔥 TRT + HGH Stack: $299/mo\n• Save $49/mo vs separate\n\n✅ ALL plans include:\n• Monthly medication delivery\n• Blood work & monitoring\n• Unlimited telehealth visits\n• No hidden fees, ever\n\nThat's less than most guys spend on supplements that don't work." };
  }

  // TRT specific questions
  if (msg.match(/trt|testosterone replacement|low t|test level/i) && !msg.includes('hgh')) {
    if (msg.includes('work') || msg.includes('how')) {
      return { message: "Here's how TRT works:\n\n1️⃣ You sign up and get labs at 4,500+ locations\n2️⃣ Our doctors review your testosterone levels\n3️⃣ If you qualify, we create YOUR protocol\n4️⃣ Testosterone ships to your door monthly\n5️⃣ We monitor your levels with regular blood work\n\n📈 Most guys go from 200-400 ng/dL → 700-900+ ng/dL\n\nThat's the difference between dragging and DOMINATING. $149/mo, everything included." };
    }
    return { message: "TRT Gains - $149/mo 💉\n\nWhat you get:\n• Monthly testosterone delivery\n• All required blood panels\n• Unlimited doctor consultations\n• Ongoing protocol optimization\n\nWhat you'll feel:\n⚡ Energy through the roof\n💪 Strength and muscle gains\n🔥 Libido back online\n🧠 Mental clarity and focus\n\nAverage T increase: +287 ng/dL. First injection in ~7 days. Ready to start?" };
  }

  // HGH specific questions
  if (msg.match(/hgh|growth hormone|igf|peptide/i) && !msg.includes('trt')) {
    return { message: "HGH Gains - $199/mo 🧬\n\nWhat you get:\n• Monthly HGH delivery\n• Blood panels & IGF-1 monitoring\n• Body composition tracking\n• Unlimited telehealth access\n\nWhat you'll feel:\n😴 Deep, restorative sleep\n💪 Faster workout recovery\n📉 Easier fat loss\n✨ Better skin, anti-aging benefits\n\nHGH is the recovery and body recomp accelerator. Stack it with TRT ($299/mo) for 2.3x faster results." };
  }

  // SYMPTOMS / PROBLEMS
  if (msg.match(/tired|fatigue|exhausted|no energy|can't sleep|low libido|no sex|can't build|not gaining|weak|brain fog/i)) {
    return { message: "Those symptoms? Classic signs your hormones need optimization.\n\n😴 Fatigue, low energy → Low testosterone tanks your mitochondria\n🏋️ Can't build muscle → Your body lacks the hormonal signal to grow\n😑 Low libido, mood issues → T directly affects both\n🧠 Brain fog → Testosterone is crucial for cognitive function\n\nThe good news: These are FIXABLE. Most warriors feel the energy shift in week 1-2, and by week 6-8 they're wondering why they waited so long.\n\nTRT Gains: $149/mo. Let's fix this." };
  }

  // MUSCLE / GAINS / GYM
  if (msg.match(/muscle|gain|bulk|lift|gym|workout|pr|strength|jacked|swole/i)) {
    return { message: "Can't build muscle no matter how hard you train? 🏋️\n\nHere's the truth: If your hormones aren't optimized, you're fighting uphill. Your body literally lacks the chemical signal to grow.\n\n📊 What happens on TRT:\n• Protein synthesis increases\n• Recovery time drops\n• Strength goes up week over week\n• PRs start falling again\n\nMost guys see gym performance improve by week 3-4, and visible gains by week 6-8.\n\nTRT: $149/mo | HGH: $199/mo | Stack both: $299/mo\n\nWhich fits your goals?" };
  }

  // GREETINGS
  if (msg.match(/^(hi|hey|hello|sup|yo|what's up)/i)) {
    return { message: "Hey! 👊 Welcome to WeightGain.\n\nI'm here to help you understand TRT and HGH therapy. What's on your mind?\n\nQuick options:\n• How fast will I see results?\n• TRT vs HGH - what's the difference?\n• What does it cost?\n• Is it safe?\n\nOr just ask me anything about hormone optimization." };
  }

  // GETTING STARTED
  if (msg.match(/get started|sign up|begin|ready|let's go|start now|how do i start/i)) {
    return { message: "Let's get you started! 💪\n\nHere's what happens next:\n\n1️⃣ Choose your plan:\n   • TRT Gains: $149/mo\n   • HGH Gains: $199/mo\n   • Stack both: $299/mo\n\n2️⃣ Complete quick checkout\n3️⃣ Get labs at 4,500+ locations (within 48hrs)\n4️⃣ Doctor reviews results (24-48hrs)\n5️⃣ Medication ships SAME DAY\n\n~7 days to your first injection. Click 'Get TRT Gains' or 'Get HGH Gains' above to start!" };
  }

  // WHAT'S INCLUDED
  if (msg.match(/what('s| is) included|what do (i|you) get|include/i)) {
    return { message: "Everything's included - no hidden fees:\n\n📦 Monthly medication delivery\n🔬 All required blood panels\n👨‍⚕️ Unlimited telehealth consultations\n📊 Ongoing monitoring & optimization\n📱 Direct doctor messaging\n\nTRT: $149/mo | HGH: $199/mo | Stack: $299/mo\n\nNo surprise charges. No lab fees. No consultation fees. One price, everything included." };
  }

  // DEFAULT - make it helpful
  const defaultResponses = [
    { message: "I'm here to help you understand TRT and HGH therapy! 💪\n\nPopular questions:\n• How fast will I see results?\n• TRT vs HGH - which one?\n• What does it cost?\n• Is it safe and legit?\n\nWhat would you like to know? Or tell me what symptoms/goals you have and I'll point you in the right direction." },
    { message: "Hey! I can help you figure out if TRT or HGH is right for you.\n\n💉 TRT ($149/mo) - Testosterone optimization\n🧬 HGH ($199/mo) - Growth hormone therapy\n🔥 Stack both ($299/mo) - Maximum results\n\nWhat's your main goal? More energy? Building muscle? Better recovery? Tell me what you're dealing with." },
    { message: "Let me help you out! I specialize in TRT and HGH therapy questions.\n\nTell me:\n• What symptoms are you experiencing?\n• What are your fitness goals?\n• Any specific concerns?\n\nOr ask me about timelines, pricing, safety, or how it all works. I've got answers." }
  ];

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

function addToCartFromAI(testId) {
  addToCart(testId);
  showToast('Added to cart!');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// =============================================================================
// Welcome Popup
// =============================================================================

function initWelcomePopup() {
  // Check if already shown this session or dismissed permanently
  if (sessionStorage.getItem('welcomeShown') || localStorage.getItem('welcomeDismissed')) {
    return;
  }

  // Don't show on checkout page
  if (window.location.pathname.includes('checkout')) {
    return;
  }

  let welcomeShown = false;

  function showWelcomePopup() {
    if (welcomeShown) return;
    welcomeShown = true;

    const overlay = document.getElementById('welcomeOverlay');
    const popup = document.getElementById('welcomePopup');
    if (overlay && popup) {
      overlay.classList.add('active');
      popup.classList.add('active');
      sessionStorage.setItem('welcomeShown', 'true');
    }
  }

  // Show after 10 seconds
  const timeoutId = setTimeout(showWelcomePopup, 10000);

  // OR show at 50% scroll
  function handleScroll() {
    const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    if (scrollPercent >= 50 && !welcomeShown) {
      clearTimeout(timeoutId);
      showWelcomePopup();
      window.removeEventListener('scroll', handleScroll);
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
}

function closeWelcomePopup() {
  const overlay = document.getElementById('welcomeOverlay');
  const popup = document.getElementById('welcomePopup');
  const dontShow = document.getElementById('dontShowAgain');

  if (overlay) overlay.classList.remove('active');
  if (popup) popup.classList.remove('active');

  if (dontShow && dontShow.checked) {
    localStorage.setItem('welcomeDismissed', 'true');
  }
}

function copyWelcomeCode() {
  navigator.clipboard.writeText('TRTWARRIOR').then(() => {
    showToast('Code copied to clipboard!');
  });
}

// =============================================================================
// Exit Intent Popup
// =============================================================================

let exitIntentShown = false;

function initExitIntent() {
  if (sessionStorage.getItem('exitIntentShown')) return;

  // Don't show on checkout page - let them focus
  if (window.location.pathname.includes('checkout')) {
    return;
  }

  document.addEventListener('mouseout', (e) => {
    if (e.clientY <= 0 && !exitIntentShown) {
      showExitPopup();
    }
  });
}

function showExitPopup() {
  if (exitIntentShown || sessionStorage.getItem('exitIntentShown')) return;
  exitIntentShown = true;
  sessionStorage.setItem('exitIntentShown', 'true');

  const overlay = document.getElementById('exitPopupOverlay');
  const popup = document.getElementById('exitPopup');

  if (overlay && popup) {
    overlay.classList.add('active');
    popup.classList.add('active');
  }
}

function closeExitPopup() {
  const overlay = document.getElementById('exitPopupOverlay');
  const popup = document.getElementById('exitPopup');

  if (overlay) overlay.classList.remove('active');
  if (popup) popup.classList.remove('active');
}

function submitExitEmail() {
  const input = document.getElementById('exitEmail');
  const email = input ? input.value.trim() : '';

  // Proper email validation regex (RFC 5322 compliant for common cases)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  if (email && emailRegex.test(email)) {
    showToast('Check your email for 25% OFF code!');
    closeExitPopup();
  } else if (input) {
    input.style.borderColor = '#ef4444';
  }
}

// =============================================================================
// Social Proof Popup
// =============================================================================

function closeSocialProof() {
  const socialProof = document.getElementById('socialProofPopup');
  if (socialProof) {
    socialProof.classList.remove('active');
  }
}


// =============================================================================
// Page Transitions
// =============================================================================

function initPageTransitions() {
  // Add click handlers to internal links
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.endsWith('.html') && !href.startsWith('http')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        navigateWithTransition(href);
      });
    }
  });
}

function navigateWithTransition(url) {
  const overlay = document.getElementById('pageTransition');
  if (overlay) {
    overlay.classList.add('active');
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
  const countEl = document.getElementById('stickyCartCount');
  const totalEl = document.getElementById('stickyCartTotal');

  if (countEl) countEl.textContent = state.cart.length;
  if (totalEl) totalEl.textContent = getCartTotal();
}

// =============================================================================
// Toast Notifications
// =============================================================================

function showToast(message) {
  const toast = document.getElementById('toast');
  const messageEl = document.getElementById('toastMessage');

  if (toast && messageEl) {
    messageEl.textContent = message;
    toast.classList.add('active');

    setTimeout(() => {
      toast.classList.remove('active');
    }, 3000);
  }
}

// =============================================================================
// Auth Modal
// =============================================================================

function openAuthModal(type = 'signin') {
  const overlay = document.getElementById('authOverlay');
  const modal = document.getElementById('authModal');

  if (overlay && modal) {
    overlay.classList.add('active');
    modal.classList.add('active');
    switchAuthForm(type);
  }
}

function closeAuthModal() {
  const overlay = document.getElementById('authOverlay');
  const modal = document.getElementById('authModal');

  if (overlay) overlay.classList.remove('active');
  if (modal) modal.classList.remove('active');
}

function switchAuthForm(type) {
  const signinForm = document.getElementById('signinForm');
  const signupForm = document.getElementById('signupForm');

  if (type === 'signup') {
    if (signinForm) signinForm.style.display = 'none';
    if (signupForm) signupForm.style.display = 'block';
  } else {
    if (signinForm) signinForm.style.display = 'block';
    if (signupForm) signupForm.style.display = 'none';
  }
}

function handleSignIn(event) {
  event.preventDefault();
  showToast('Sign in functionality coming soon!');
  closeAuthModal();
}

function handleSignUp(event) {
  event.preventDefault();
  showToast('Sign up functionality coming soon!');
  closeAuthModal();
}

function showForgotPassword(event) {
  if (event) event.preventDefault();
  const signinForm = document.getElementById('signinForm');
  const signupForm = document.getElementById('signupForm');
  const forgotForm = document.getElementById('forgotPasswordForm');

  if (signinForm) signinForm.style.display = 'none';
  if (signupForm) signupForm.style.display = 'none';
  if (forgotForm) forgotForm.style.display = 'block';
}

function handleForgotPassword(event) {
  event.preventDefault();
  const successEl = document.getElementById('resetSuccess');
  if (successEl) {
    successEl.style.display = 'flex';
  }
  showToast('Password reset link sent!');
}

// =============================================================================
// Cookie Banner
// =============================================================================

function initCookieBanner() {
  if (localStorage.getItem('cookiesAccepted') || localStorage.getItem('cookiesDeclined')) {
    return;
  }

  const banner = document.getElementById('cookieBanner');
  if (banner) {
    setTimeout(() => {
      banner.classList.add('active');
    }, 2000);
  }
}

function acceptCookies() {
  localStorage.setItem('cookiesAccepted', 'true');
  const banner = document.getElementById('cookieBanner');
  if (banner) banner.classList.remove('active');
}

function declineCookies() {
  localStorage.setItem('cookiesDeclined', 'true');
  const banner = document.getElementById('cookieBanner');
  if (banner) banner.classList.remove('active');
}

// =============================================================================
// Upsell Modal
// =============================================================================

let pendingUpsellTests = [];

function showUpsellModal(tests) {
  pendingUpsellTests = tests || [];
  const overlay = document.getElementById('upsellOverlay');
  const modal = document.getElementById('upsellModal');
  const productsEl = document.getElementById('upsellProducts');
  const totalEl = document.getElementById('upsellTotal');
  const savingsEl = document.getElementById('upsellSavings');

  if (!overlay || !modal || !productsEl) return;

  // Build products using DOM methods
  productsEl.textContent = ''; // Clear safely
  let total = 0;

  pendingUpsellTests.forEach(test => {
    total += test.price;

    const product = document.createElement('div');
    product.style.cssText = 'display: flex; align-items: center; gap: 1rem; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 0.75rem;';

    const emoji = document.createElement('span');
    emoji.style.fontSize = '1.5rem';
    emoji.textContent = '💪';

    const info = document.createElement('div');
    info.style.flex = '1';

    const name = document.createElement('div');
    name.style.cssText = 'font-weight: 600; color: #fff;';
    name.textContent = test.name;

    const price = document.createElement('div');
    price.style.cssText = 'font-size: 0.85rem; color: rgba(255,255,255,0.6);';
    price.textContent = `$${test.price}`;

    info.appendChild(name);
    info.appendChild(price);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = true;
    checkbox.style.cssText = 'width: 20px; height: 20px; accent-color: var(--spartan-gold);';

    product.appendChild(emoji);
    product.appendChild(info);
    product.appendChild(checkbox);
    productsEl.appendChild(product);
  });

  if (totalEl) totalEl.textContent = total;
  if (savingsEl) savingsEl.textContent = Math.round(total * 0.1);

  overlay.classList.add('active');
  modal.classList.add('active');
}

function closeUpsellModal() {
  const overlay = document.getElementById('upsellOverlay');
  const modal = document.getElementById('upsellModal');

  if (overlay) overlay.classList.remove('active');
  if (modal) modal.classList.remove('active');
  pendingUpsellTests = [];
}

function addUpsellToCart() {
  pendingUpsellTests.forEach(test => addToCart(test.id));
  closeUpsellModal();
  showToast('Items added to cart!');
}

// =============================================================================
// Lab Selection Modal
// =============================================================================

function openLabModal() {
  const overlay = document.getElementById('labModalOverlay');
  const modal = document.getElementById('labModal');

  if (overlay && modal) {
    overlay.classList.add('active');
    modal.classList.add('active');
  }
}

function closeLabModal() {
  const overlay = document.getElementById('labModalOverlay');
  const modal = document.getElementById('labModal');

  if (overlay) overlay.classList.remove('active');
  if (modal) modal.classList.remove('active');
}

function searchLabsInModal() {
  const input = document.getElementById('labModalZipInput');
  const resultsDiv = document.getElementById('labModalResults');

  if (!input || !resultsDiv) return;

  const zip = input.value.trim();
  // Validate ZIP code format (5 digits)
  const zipRegex = /^\d{5}$/;
  if (!zip || !zipRegex.test(zip)) {
    showToast('Please enter a valid 5-digit ZIP code');
    return;
  }

  // Check restricted states
  const restrictedZips = ['10', '11', '07', '08', '02', '96', '97'];
  if (restrictedZips.some(prefix => zip.startsWith(prefix))) {
    resultsDiv.textContent = '';
    const errorP = document.createElement('p');
    errorP.style.cssText = 'color: #f59e0b; text-align: center; padding: 2rem;';
    errorP.textContent = 'Sorry, services are not available in NY, NJ, RI, or HI due to state regulations.';
    resultsDiv.appendChild(errorP);
    return;
  }

  // Show sample results using safe DOM methods
  resultsDiv.textContent = '';

  const createLabCard = (name, address, hours) => {
    const card = document.createElement('div');
    card.style.cssText = 'padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 0.75rem; cursor: pointer;';
    card.dataset.action = 'selectLab';

    const nameEl = document.createElement('strong');
    nameEl.style.color = '#D4AF37';
    nameEl.textContent = name;

    const addressP = document.createElement('p');
    addressP.style.cssText = 'font-size: 0.85rem; color: rgba(255,255,255,0.7); margin: 0.25rem 0;';
    addressP.textContent = address;

    const hoursP = document.createElement('p');
    hoursP.style.cssText = 'font-size: 0.8rem; color: rgba(255,255,255,0.5);';
    hoursP.textContent = hours;

    card.appendChild(nameEl);
    card.appendChild(addressP);
    card.appendChild(hoursP);
    return card;
  };

  resultsDiv.appendChild(createLabCard('Quest Diagnostics', '123 Medical Center Dr - 0.8 miles', 'Mon-Fri 7AM-5PM, Sat 8AM-12PM'));
  resultsDiv.appendChild(createLabCard('LabCorp', '456 Health Plaza - 1.2 miles', 'Mon-Fri 6:30AM-4PM'));
}

function selectLab(element) {
  showToast('Lab location selected!');
  closeLabModal();
}

// =============================================================================
// Quick View Modal
// =============================================================================

function openQuickView(testId) {
  const test = testCatalog.find(t => t.id === testId);
  if (!test) return;

  const isInCart = state.cart.some(item => item.id === testId);

  const contentEl = document.getElementById('quickViewContent');
  const overlayEl = document.getElementById('quickViewOverlay');
  const modalEl = document.getElementById('quickViewModal');

  if (!contentEl) return;

  // Build content using DOM methods
  contentEl.textContent = ''; // Clear safely

  // Emoji header
  const emojiDiv = document.createElement('div');
  emojiDiv.style.cssText = 'text-align: center; margin-bottom: 1.5rem;';
  const emoji = document.createElement('span');
  emoji.style.fontSize = '3rem';
  emoji.textContent = '💪';
  emojiDiv.appendChild(emoji);

  // Title
  const title = document.createElement('h2');
  title.id = 'quickViewTitle';
  title.style.cssText = 'color: white; font-size: 1.5rem; margin-bottom: 0.5rem; text-align: center;';
  title.textContent = test.name;

  // Description
  const desc = document.createElement('p');
  desc.style.cssText = 'color: rgba(255,255,255,0.7); text-align: center; margin-bottom: 1.5rem; line-height: 1.6;';
  desc.textContent = test.description;

  // Info box
  const infoBox = document.createElement('div');
  infoBox.style.cssText = 'background: rgba(255,255,255,0.05); border-radius: 12px; padding: 1rem; margin-bottom: 1.5rem;';

  const createInfoRow = (label, value, valueStyle = 'color: white;') => {
    const row = document.createElement('div');
    row.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;';
    const labelSpan = document.createElement('span');
    labelSpan.style.color = 'rgba(255,255,255,0.6)';
    labelSpan.textContent = label;
    const valueSpan = document.createElement('span');
    valueSpan.style.cssText = valueStyle;
    valueSpan.textContent = value;
    row.appendChild(labelSpan);
    row.appendChild(valueSpan);
    return row;
  };

  infoBox.appendChild(createInfoRow('Price', `$${test.price}`, 'color: #D4AF37; font-size: 1.5rem; font-weight: 700;'));
  infoBox.appendChild(createInfoRow('Results', test.turnaround || '24-72 hours'));
  const labRow = createInfoRow('Lab Visit', 'No appointment needed');
  labRow.style.marginBottom = '0';
  infoBox.appendChild(labRow);

  // Button
  const button = document.createElement('button');
  button.className = 'btn btn-primary';
  button.style.cssText = 'width: 100%; padding: 1rem; font-size: 1rem;';
  button.textContent = isInCart ? '✓ Already in Cart' : `Add to Cart - $${test.price}`;
  button.dataset.action = 'addToCartAndClose';
  button.dataset.testId = test.id;

  // Disclaimer
  const disclaimer = document.createElement('p');
  disclaimer.style.cssText = 'text-align: center; margin-top: 1rem; font-size: 0.75rem; color: rgba(255,255,255,0.5);';
  disclaimer.textContent = 'Consult your healthcare provider for medical advice.';

  contentEl.appendChild(emojiDiv);
  contentEl.appendChild(title);
  contentEl.appendChild(desc);
  contentEl.appendChild(infoBox);
  contentEl.appendChild(button);
  contentEl.appendChild(disclaimer);

  if (overlayEl) overlayEl.style.display = 'block';
  if (modalEl) modalEl.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeQuickView() {
  const overlayEl = document.getElementById('quickViewOverlay');
  const modalEl = document.getElementById('quickViewModal');

  if (overlayEl) overlayEl.style.display = 'none';
  if (modalEl) modalEl.style.display = 'none';
  document.body.style.overflow = '';
}

// Note: Escape key handling moved to initKeyboardNavigation()

// =============================================================================
// Lab Locator
// =============================================================================

function findLabs() {
  const input = document.getElementById('zipInput');
  const resultsDiv = document.getElementById('labResults');
  const listDiv = document.getElementById('labList');

  if (!input || !resultsDiv || !listDiv) return;

  const zip = input.value.trim();
  // Validate ZIP code format (5 digits)
  const zipRegex = /^\d{5}$/;
  if (!zip || !zipRegex.test(zip)) {
    showToast('Please enter a valid 5-digit ZIP code');
    return;
  }

  // Check restricted states
  const restrictedZips = ['10', '11', '07', '08', '02', '96', '97'];
  if (restrictedZips.some(prefix => zip.startsWith(prefix))) {
    listDiv.textContent = '';
    const errorP = document.createElement('p');
    errorP.style.color = '#f59e0b';
    errorP.textContent = 'Sorry, services are not available in NY, NJ, RI, or HI due to state regulations.';
    listDiv.appendChild(errorP);
    resultsDiv.style.display = 'block';
    return;
  }

  // Show sample results using safe DOM methods
  listDiv.textContent = '';

  const createLabCard = (name, address, hours, isLast = false) => {
    const card = document.createElement('div');
    card.style.cssText = `padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 8px;${isLast ? '' : ' margin-bottom: 0.75rem;'}`;

    const nameEl = document.createElement('strong');
    nameEl.style.color = '#D4AF37';
    nameEl.textContent = name;

    const addressP = document.createElement('p');
    addressP.style.cssText = 'font-size: 0.85rem; color: rgba(255,255,255,0.7); margin: 0.25rem 0;';
    addressP.textContent = address;

    const hoursP = document.createElement('p');
    hoursP.style.cssText = 'font-size: 0.8rem; color: rgba(255,255,255,0.5);';
    hoursP.textContent = hours;

    card.appendChild(nameEl);
    card.appendChild(addressP);
    card.appendChild(hoursP);
    return card;
  };

  listDiv.appendChild(createLabCard('Quest Diagnostics', '123 Medical Center Dr - 0.8 miles', 'Mon-Fri 7AM-5PM, Sat 8AM-12PM'));
  listDiv.appendChild(createLabCard('LabCorp', '456 Health Plaza - 1.2 miles', 'Mon-Fri 6:30AM-4PM', true));
  resultsDiv.style.display = 'block';
}

// =============================================================================
// Cart Sidebar Toggle
// =============================================================================

function toggleCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartSidebarOverlay');

  if (!sidebar || !overlay) {
    // Fallback to checkout if sidebar doesn't exist
    window.location.href = 'checkout.html';
    return;
  }

  const isOpen = sidebar.classList.contains('active');

  if (isOpen) {
    closeCartSidebar();
  } else {
    openCartSidebar();
  }
}

function openCartSidebar() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartSidebarOverlay');

  if (sidebar && overlay) {
    sidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    renderCartSidebar();
  }
}

function closeCartSidebar() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartSidebarOverlay');

  if (sidebar) sidebar.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function renderCartSidebar() {
  const itemsContainer = document.getElementById('cartSidebarItems');
  const totalEl = document.getElementById('cartSidebarTotal');
  const emptyState = document.getElementById('cartSidebarEmpty');
  const cartContent = document.getElementById('cartSidebarContent');

  if (!itemsContainer) return;

  // Clear existing items
  itemsContainer.textContent = '';

  if (state.cart.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    if (cartContent) cartContent.style.display = 'none';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  if (cartContent) cartContent.style.display = 'block';

  state.cart.forEach(item => {
    const isSubscription = item.billingCycle;
    const suffix = item.billingCycle === 'monthly' ? '/mo' : (item.billingCycle === 'yearly' ? '/yr' : '');

    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-sidebar-item';

    const itemInfo = document.createElement('div');
    itemInfo.className = 'cart-sidebar-item-info';

    const nameDiv = document.createElement('div');
    nameDiv.className = 'cart-sidebar-item-name';
    nameDiv.textContent = item.name;

    const priceDiv = document.createElement('div');
    priceDiv.className = 'cart-sidebar-item-price';
    priceDiv.textContent = `$${item.price}${suffix}`;

    if (isSubscription && item.billingLabel) {
      const badge = document.createElement('span');
      badge.className = 'cart-sidebar-item-badge';
      badge.textContent = item.billingLabel;
      nameDiv.appendChild(badge);
    }

    itemInfo.appendChild(nameDiv);
    itemInfo.appendChild(priceDiv);

    const removeBtn = document.createElement('button');
    removeBtn.className = 'cart-sidebar-item-remove';
    removeBtn.textContent = '×';
    removeBtn.setAttribute('aria-label', `Remove ${item.name}`);
    removeBtn.addEventListener('click', () => {
      removeFromCartSidebar(item.id);
    });

    itemDiv.appendChild(itemInfo);
    itemDiv.appendChild(removeBtn);
    itemsContainer.appendChild(itemDiv);
  });

  // Update total
  const total = getCartTotal();
  const hasMonthly = state.cart.some(item => item.billingCycle === 'monthly');
  if (totalEl) {
    totalEl.textContent = `$${total.toFixed(2)}${hasMonthly ? '/mo' : ''}`;
  }
}

function removeFromCartSidebar(itemId) {
  state.cart = state.cart.filter(item => item.id !== itemId);
  saveCart();
  updateCartUI();
  renderCartSidebar();

  if (state.cart.length === 0) {
    // Optionally close sidebar if cart is empty
    // closeCartSidebar();
  }
}

// =============================================================================
// Test Filtering
// =============================================================================

function filterTests(category, buttonElement) {
  // Update active tab
  document.querySelectorAll('.category-tab').forEach(tab => tab.classList.remove('active'));
  if (buttonElement) buttonElement.classList.add('active');

  state.currentCategory = category;
  state.testsDisplayed = 12;
  renderTests(category, state.testsDisplayed);
}

function searchTests(query) {
  const searchQuery = query.toLowerCase().trim();

  if (!searchQuery) {
    renderTests('all', state.testsDisplayed);
    return;
  }

  const filtered = testCatalog.filter(test =>
    test.name.toLowerCase().includes(searchQuery) ||
    test.description.toLowerCase().includes(searchQuery)
  );

  renderFilteredTests(filtered);
}

function renderFilteredTests(tests) {
  const grid = document.getElementById('testsGrid');
  if (!grid) return;

  grid.textContent = '';

  if (tests.length === 0) {
    const noResultsP = document.createElement('p');
    noResultsP.style.cssText = 'text-align: center; color: rgba(255,255,255,0.6); grid-column: 1/-1;';
    noResultsP.textContent = 'No tests found matching your search.';
    grid.appendChild(noResultsP);
    return;
  }

  // Use safe DOM methods via createTestCard (existing safe function)
  const fragment = document.createDocumentFragment();
  tests.forEach(test => {
    fragment.appendChild(createTestCard(test));
  });
  grid.appendChild(fragment);
}


// =============================================================================
// Animations CSS (injected)
// =============================================================================

function injectAnimationStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(100px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideOut {
      from { opacity: 1; transform: translateX(0); }
      to { opacity: 0; transform: translateX(100px); }
    }
    .typing-indicator {
      display: flex;
      gap: 4px;
      padding: 0.5rem;
    }
    .typing-indicator span {
      width: 8px;
      height: 8px;
      background: var(--spartan-gold, #D4AF37);
      border-radius: 50%;
      animation: typingBounce 1.4s infinite ease-in-out;
    }
    .typing-indicator span:nth-child(1) { animation-delay: 0s; }
    .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
    .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typingBounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }
  `;
  document.head.appendChild(style);
}

// =============================================================================
// CSRF Protection
// =============================================================================

function generateCSRFToken() {
  const token = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);
  sessionStorage.setItem('csrf_token', token);
  return token;
}

function getCSRFToken() {
  let token = sessionStorage.getItem('csrf_token');
  if (!token) {
    token = generateCSRFToken();
  }
  return token;
}

function populateCSRFTokens() {
  const token = getCSRFToken();
  // Populate all CSRF token inputs (by name or class)
  document.querySelectorAll('input[name="_csrf"], .csrf-token').forEach(input => {
    input.value = token;
  });
}

function validateCSRFToken(formToken) {
  const sessionToken = sessionStorage.getItem('csrf_token');
  return formToken && sessionToken && formToken === sessionToken;
}

// =============================================================================
// Centralized Event Delegation (replaces inline onclick handlers)
// =============================================================================

const actions = {
  addToCart: (e) => {
    const actionEl = e.target.closest('[data-action]');
    const testId = actionEl?.dataset.testId;
    if (testId) addToCart(testId);
  },
  addToCartFromAI: (e) => {
    const actionEl = e.target.closest('[data-action]');
    const testId = actionEl?.dataset.testId;
    if (testId) addToCartFromAI(testId);
  },
  addToCartAndClose: (e) => {
    const actionEl = e.target.closest('[data-action]');
    const testId = actionEl?.dataset.testId;
    if (testId) {
      addToCart(testId);
      closeQuickView();
    }
  },
  selectLab: (e) => {
    selectLab(e.target.closest('[data-action]'));
  },
  toggleMobileMenu: () => toggleMobileMenu(),
  toggleCart: () => toggleCart(),
  openAuthModal: (e) => {
    const type = e.target.closest('[data-auth-type]')?.dataset.authType || 'signin';
    openAuthModal(type);
  },
  closeAuthModal: () => closeAuthModal(),
  switchAuthForm: (e) => {
    const type = e.target.closest('[data-form-type]')?.dataset.formType;
    if (type) switchAuthForm(type);
  },
  showForgotPassword: (e) => {
    e.preventDefault();
    showForgotPassword();
  },
  sendAiMessage: () => sendAiMessage(),
  sendAiPreset: (e) => {
    const message = e.target.closest('[data-message]')?.dataset.message;
    if (message) sendAiMessage(message);
  },
  closeWelcomePopup: () => closeWelcomePopup(),
  copyWelcomeCode: () => copyWelcomeCode(),
  submitWelcomeEmail: () => submitWelcomeEmail(),
  closeExitPopup: () => closeExitPopup(),
  submitExitEmail: () => submitExitEmail(),
  closeSocialProof: () => closeSocialProof(),
  acceptCookies: () => acceptCookies(),
  declineCookies: () => declineCookies(),
  findLabs: () => findLabs(),
  filterTests: (e) => {
    const category = e.target.closest('[data-category]')?.dataset.category;
    if (category) filterTests(category, e.target);
  },
  selectPlan: (e) => {
    const planId = e.target.closest('[data-plan-id]')?.dataset.planId;
    if (planId) selectPlan(planId);
  },
  closeUpsellModal: () => closeUpsellModal(),
  addUpsellToCart: () => addUpsellToCart(),
  openLabModal: () => openLabModal(),
  closeLabModal: () => closeLabModal(),
  searchLabsInModal: () => searchLabsInModal(),
  closeQuickView: () => closeQuickView(),
  closeCartSidebar: () => closeCartSidebar(),
  closePairingModal: () => closePairingModal(),
  goToCheckout: () => {
    closeCartSidebar();
    window.location.href = 'checkout.html';
  },
  openQuickView: (e) => {
    const testId = e.target.closest('[data-test-id]')?.dataset.testId;
    if (testId) openQuickView(testId);
  },
  scrollToTop: () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
  scrollToChat: () => {
    const input = document.getElementById('aiChatInput');
    if (input) {
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => input.focus(), 500);
    }
  }
};

function initEventDelegation() {
  document.addEventListener('click', (e) => {
    const actionEl = e.target.closest('[data-action]');
    if (actionEl) {
      const action = actionEl.dataset.action;
      if (actions[action]) {
        e.preventDefault();
        actions[action](e);
      }
    }
  });

  // Handle Enter key for inputs with data-action-enter
  document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const actionEl = e.target.closest('[data-action-enter]');
      if (actionEl) {
        const action = actionEl.dataset.actionEnter;
        if (actions[action]) {
          e.preventDefault();
          actions[action](e);
        }
      }
    }
  });

  // Handle input events for search
  document.addEventListener('input', (e) => {
    const actionEl = e.target.closest('[data-action-input]');
    if (actionEl) {
      const action = actionEl.dataset.actionInput;
      if (action === 'searchTests') {
        searchTests(e.target.value);
      }
    }
  });
}

// =============================================================================
// Keyboard Navigation & Focus Management
// =============================================================================

function initKeyboardNavigation() {
  // Close modals on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeQuickView();
      closeLabModal();
      closeUpsellModal();
      closeAuthModal();
      closeWelcomePopup();
      closeExitPopup();
      if (state.mobileMenuOpen) toggleMobileMenu(false);
    }
  });

  // Focus trap for modals
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;

    const activeModal = document.querySelector('.auth-modal.active, .lab-modal.active, .welcome-popup.active, #quickViewModal[style*="block"]');
    if (!activeModal) return;

    const focusableElements = activeModal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  });
}

// =============================================================================
// Mobile Sticky CTA
// =============================================================================

function initMobileStickyCTA() {
  const mobileCTA = document.getElementById('mobileStickyCta') || document.querySelector('.mobile-sticky-cta');
  if (!mobileCTA) return;

  // Don't show on checkout page
  if (window.location.pathname.includes('checkout')) {
    mobileCTA.style.display = 'none';
    return;
  }

  let lastScrollY = 0;
  const showAfterScroll = 400; // Show after scrolling 400px

  function handleMobileCTAScroll() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > showAfterScroll) {
      mobileCTA.classList.add('active');
    } else {
      mobileCTA.classList.remove('active');
    }

    lastScrollY = currentScrollY;
  }

  window.addEventListener('scroll', handleMobileCTAScroll, { passive: true });
}

// =============================================================================
// Welcome Email Submission
// =============================================================================

function submitWelcomeEmail() {
  const emailInput = document.getElementById('welcomeEmail');
  const email = emailInput?.value?.trim();

  if (!email || !email.includes('@')) {
    showToast('Please enter a valid email address');
    return;
  }

  // Simulate email submission
  showToast('Guide sent! Check your inbox.');
  closeWelcomePopup();

  // Store that user provided email
  localStorage.setItem('welcomeEmailProvided', 'true');
}

// =============================================================================
// Initialize Application
// =============================================================================

function init() {
  // Scroll to top on page load (except checkout and lab finder sections)
  const currentPath = window.location.pathname;
  const currentHash = window.location.hash;
  const isCheckout = currentPath.includes('checkout');
  const isLabSection = currentHash === '#locations';

  if (!isCheckout && !isLabSection) {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  injectAnimationStyles();

  // Initialize billing toggle for subscription pricing
  initBillingToggle();
  updatePricingDisplay();

  initEventListeners();
  initEventDelegation(); // Centralized event handling
  initKeyboardNavigation(); // Accessibility
  initCombinedScrollHandler(); // Single optimized scroll handler
  updateCartUI();

  // Initialize interactive features
  initWelcomePopup();
  initExitIntent();
  initMobileStickyCTA(); // Mobile sticky CTA bar
  // initPageTransitions(); // Disabled - research shows users prefer instant navigation
  initStickyCartBar();
  initCookieBanner();

  // Security: Populate CSRF tokens
  populateCSRFTokens();
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// =============================================================================
// Exports for other pages
// =============================================================================

window.WeightGain = {
  addToCart,
  removeFromCart,
  getCartTotal,
  selectPlan,
  state,
  subscriptionPlans,
  restrictedStates,
  checkStateRestriction
};

// Global function exports for HTML onclick handlers
window.sendAiMessage = sendAiMessage;
window.handleAiKeypress = handleAiKeypress;
window.closeWelcomePopup = closeWelcomePopup;
window.copyWelcomeCode = copyWelcomeCode;
window.closeExitPopup = closeExitPopup;
window.submitExitEmail = submitExitEmail;
window.closeSocialProof = closeSocialProof;
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.switchAuthForm = switchAuthForm;
window.handleSignIn = handleSignIn;
window.handleSignUp = handleSignUp;
window.showForgotPassword = showForgotPassword;
window.handleForgotPassword = handleForgotPassword;
window.acceptCookies = acceptCookies;
window.declineCookies = declineCookies;
window.findLabs = findLabs;
window.toggleCart = toggleCart;
window.filterTests = filterTests;
window.searchTests = searchTests;
window.selectPlan = selectPlan;
window.initBillingToggle = initBillingToggle;
window.updatePricingDisplay = updatePricingDisplay;
window.toggleMobileMenu = toggleMobileMenu;
window.showUpsellModal = showUpsellModal;
window.closeUpsellModal = closeUpsellModal;
window.addUpsellToCart = addUpsellToCart;
window.openLabModal = openLabModal;
window.closeLabModal = closeLabModal;
window.searchLabsInModal = searchLabsInModal;
window.selectLab = selectLab;
window.openQuickView = openQuickView;
window.closeQuickView = closeQuickView;
window.openCartSidebar = openCartSidebar;
window.closeCartSidebar = closeCartSidebar;
window.renderCartSidebar = renderCartSidebar;
window.showPairingModal = showPairingModal;
window.closePairingModal = closePairingModal;
window.addPairingToCart = addPairingToCart;

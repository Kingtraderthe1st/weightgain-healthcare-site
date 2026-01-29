# CLAUDE.md — Project Instructions

## Project Overview

Static healthcare website for **TRT (Testosterone Replacement Therapy) & HGH (Human Growth Hormone)** subscription services. Single $249/month "Total Optimization" membership.

## Tech Stack

- **Frontend**: Vanilla HTML5 / CSS3 / JavaScript (no framework)
- **Build**: Vite (multi-page HTML bundler)
- **Linting**: ESLint + Prettier
- **Payments**: Stripe Elements
- **Hosting**: Static deployment (Netlify-ready)

## Architecture

### JavaScript Module Pattern

All JS uses a global namespace pattern — no ES module imports:

```js
window.WeightGainPlans = { ... };
window.WeightGainCart = { ... };
window.WeightGainUI = { ... };
```

Do NOT introduce `import`/`export` statements in JS files. Keep the existing namespace pattern.

### Key Directories

```
/                   → HTML pages (10 multi-page entries)
/js/                → JavaScript modules (app.js, cart.js, plans.js, ai-chat.js, etc.)
/css/               → Design tokens (variables.css)
styles.css          → Main stylesheet (consolidated)
vite.config.js      → Vite multi-page build config
```

### Key Files

| File | Purpose |
|------|---------|
| `js/app.js` | Main app init, state management, event delegation |
| `js/cart.js` | Shopping cart logic, localStorage persistence |
| `js/plans.js` | Subscription plan definitions & management |
| `js/ai-chat.js` | AI chatbot functionality |
| `js/chat-widget.js` | Floating chat widget (separate from hero chat) |
| `js/utils.js` | Security: CSRF tokens, HTML escaping, sanitization |
| `js/ui.js` | Modals, animations, UI interactions |
| `css/variables.css` | Design tokens (colors, spacing, typography) |
| `styles.css` | All styles (9700+ lines, consolidated) |

## Coding Conventions

- **No frameworks** — keep vanilla JS. No React, Vue, jQuery.
- **Event delegation** — use `data-action` attributes, not inline handlers.
- **Security first** — always use `WeightGainUtils.escapeHtml()` for user content. Never use `innerHTML` with unsanitized input.
- **CSS custom properties** — use `var(--brand-primary)`, `var(--spacing-md)`, etc. from `css/variables.css`.
- **No inline scripts** — CSP blocks them. All JS must be in external files.
- **Accessibility** — WCAG 2.1 AA: semantic HTML, ARIA labels, 44px touch targets, focus management.

## Common Commands

```bash
npm run dev          # Start Vite dev server (localhost:5173)
npm run build        # Production build → /dist
npm run preview      # Preview production build
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
npm run format       # Prettier format all files
npm run format:check # Check formatting without changing
```

## Healthcare Compliance

- **HIPAA awareness**: Never store PHI (Protected Health Information) in localStorage or client-side code.
- **Medical disclaimers**: All health claims must include appropriate disclaimers.
- **Payment security**: Stripe handles PCI DSS compliance — never handle raw card numbers in our code.
- **Privacy**: Privacy policy at `/privacy.html`, terms at `/terms.html`. Keep these up to date with any feature changes.

## Competitive Positioning

Reference `.cursorrules` for competitive analysis. Key points:
- All-inclusive pricing (labs included, unlike competitors)
- HGH at $199/month (55% cheaper than competitors)
- Emphasize transparency — no hidden fees, easy cancellation

## Security Headers

Each HTML page has CSP meta tags. When adding new external resources:
1. Add the domain to the relevant CSP directive (`script-src`, `connect-src`, etc.)
2. Update ALL HTML pages that use the resource
3. Never use `unsafe-inline` for scripts — use external files instead

## Design System

- **Primary color**: `--brand-primary` (blue #2563eb)
- **Font**: Inter (Google Fonts)
- **Spacing scale**: `--spacing-xs` through `--spacing-3xl` (8px base)
- **Border radius**: `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`
- **Shadows**: `--shadow-sm` through `--shadow-xl`

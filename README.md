# WeightGain

A modern, responsive healthcare website for hormone optimization services. Built with vanilla HTML, CSS, and JavaScript, bundled with Vite.

## Tech Stack

- **HTML5** - Semantic markup with accessibility best practices
- **CSS3** - Custom properties, Grid, Flexbox, animations
- **Vanilla JavaScript** - No framework dependencies
- **Vite** - Fast development server and optimized builds
- **ESLint + Prettier** - Code quality and formatting

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/weightgain-healthcare-site.git
cd weightgain-healthcare-site

# Install dependencies
npm install
```

### Development

```bash
# Start development server with hot reload
npm run dev
```

The site will be available at `http://localhost:5173`

### Production Build

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix auto-fixable lint issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |

## Project Structure

```
weightgain-healthcare-site/
├── index.html          # Homepage
├── checkout.html       # Checkout page
├── account.html        # User account dashboard
├── results.html        # Lab results display
├── 404.html           # Error page
├── privacy.html       # Privacy policy
├── terms.html         # Terms of service
├── about.html         # About us page
├── faq.html           # FAQ page
├── contact.html       # Contact page
├── app.js             # Main application JavaScript
├── styles.css         # Global styles
├── js/
│   ├── utils.js       # Utility functions
│   ├── cart.js        # Shopping cart logic
│   ├── plans.js       # Pricing plans data
│   └── ui.js          # UI components
├── robots.txt         # Search engine directives
├── sitemap.xml        # XML sitemap
├── manifest.json      # PWA manifest
└── vite.config.js     # Vite configuration
```

## Features

- Responsive design (mobile-first)
- Dark theme with gold accent colors
- Accessible (WCAG 2.1 AA compliant)
- SEO optimized with meta tags and structured data
- Security headers (CSP, X-Frame-Options, etc.)
- Cookie consent banner
- Form validation with real-time feedback
- Scroll animations with IntersectionObserver
- Cart persistence with localStorage

## Deployment

### Netlify

The site is configured for Netlify deployment:

1. Connect your repository to Netlify
2. Build settings are auto-detected from `netlify.toml`
3. Deploy!

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy the 'dist' folder to your hosting provider
```

### Environment Variables

For production, set the following environment variables:

- `STRIPE_PUBLISHABLE_KEY` - Stripe public key for payments

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- iOS Safari
- Chrome for Android

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Proprietary - All rights reserved.

# WeightGain Site - Issues & Preferences Tracker

## User Preferences (Always Follow These)

### Health Assistant / AI Chat Card

- Keep neon/colorful styling with dark background
- Avatar emoji should be 💪
- Buttons should be PILL/CIRCULAR shape (border-radius: 50px), NOT square
- Buttons should all be the SAME SIZE
- Hover effect should have GLOW that spreads out (multiple box-shadows)
- Message bubbles should not be too big (max-width: 85%)

### General Styling

- Professional healthcare look for the rest of the site
- No "warrior" or "jacked" aggressive language
- Use "members" or "men" instead of "warriors"
- Light, clean backgrounds (not dark theme)
- Subtle hover effects (translateY -1px to -2px, not dramatic)
- Clean card shadows (softer, more professional)

### Animations & Performance

- Keep animations LIGHT - heavy animations cause slow scrolling
- Simple fade transitions, not circular reveals
- No particle animations outside the AI chat card
- Remove custom scrollbar styling (use system default)

### Popups

- NO exit-intent popup
- Welcome popup should be simple, not aggressive
- Exit popup hidden entirely on mobile

### Mobile

- Min 44px touch targets
- Smooth slide transitions for mobile menu
- Simplified mobile sticky CTA

### Navigation

- "Find a Lab" should open the lab modal (data-action="openLabModal")

### Content Removed

- "Real Results" / Transformations section - REMOVED
- Exit intent popup - REMOVED

---

## Issues Fixed Log

### January 2026

1. Restored original files from backup
2. Removed neon effects from main site, kept for AI chat
3. Updated aggressive language ("warrior", "jacked")
4. Fixed "Find a Lab" button to open modal
5. Removed Real Results section
6. Fixed FAQ text cutoff (increased max-height)
7. Added neon styling back to Health Assistant
8. Made AI buttons circular with glow hover effect
9. Changed avatar emoji to 💪
10. **SEO/meta:** OG, Twitter, structured data aligned with $249 TRT & HGH
11. **Find a Lab:** Added `#locations` section on homepage; pricing links to it, then "Search by ZIP" opens lab modal
12. **Live Chat:** Replaced with "Health Assistant" (links to homepage AI chat); updated top bar, footer, contact
13. **ai-chat.js:** Replaced "warriors" with "members" in symptoms response
14. **FAQ:** "1–2 weeks" → "~7 days"; Quest "2,000+" → "4,500+ Quest & LabCorp" (faq.html and index)

---

## Known Issues to Watch

- Check scrolling performance after CSS changes
- Ensure all buttons have consistent sizing
- Verify mobile experience after changes

---

_Last Updated: January 2026_

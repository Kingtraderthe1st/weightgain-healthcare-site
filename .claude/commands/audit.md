Run a comprehensive audit of the healthcare site covering accessibility, security, and code quality.

Steps:

1. **Accessibility Audit**:
   - Check all HTML pages for missing alt attributes on images
   - Verify proper heading hierarchy (h1 → h2 → h3, no skipped levels)
   - Check for ARIA labels on interactive elements
   - Verify skip navigation link exists
   - Check color contrast references in CSS variables
   - Verify form inputs have associated labels

2. **Security Audit**:
   - Review CSP meta tags across all HTML pages for consistency
   - Check for any inline scripts or event handlers that violate CSP
   - Verify CSRF token usage in forms
   - Check for unsanitized innerHTML usage
   - Verify no sensitive data in localStorage
   - Check that Stripe integration doesn't expose keys

3. **Code Quality**:
   - Run `npm run lint`
   - Run `npm run format:check`
   - Check for console.log statements that should be removed
   - Verify no TODO/FIXME comments left unresolved

4. **SEO Check**:
   - Verify each page has unique title and meta description
   - Check for Open Graph tags
   - Verify structured data (JSON-LD) is valid
   - Check robots.txt and sitemap.xml

5. Provide a summary report with PASS/WARN/FAIL for each category and actionable fixes.

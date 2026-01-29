Run the full deployment checklist for the healthcare site.

Steps:

1. **Pre-flight checks**:
   - Run `npm run lint` — must pass with zero errors
   - Run `npm run format:check` — must pass
   - Run `npm run build` — must succeed

2. **Build verification**:
   - Check that `/dist` directory was created
   - Verify all 10 HTML pages are present in the build output
   - Report output file sizes

3. **Content verification**:
   - Verify CSP headers are present in all HTML files
   - Check that no development-only code is present (console.log, debug flags)
   - Verify meta tags (title, description, OG tags) on each page

4. **Git status**:
   - Run `git status` to check for uncommitted changes
   - If there are changes, list them and ask if I should commit before deploying

5. **Deployment summary**:
   - Report: all checks passed / X issues found
   - List the contents of `/dist` ready for deployment
   - Remind about environment variables needed (STRIPE_PUBLISHABLE_KEY)

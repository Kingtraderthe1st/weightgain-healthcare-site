Run all quality checks on the project: lint, format, and build.

Steps:
1. Run `npm run lint` — report any ESLint errors/warnings
2. Run `npm run format:check` — report any formatting issues
3. Run `npm run build` — verify production build succeeds
4. Provide a summary:
   - Lint: PASS/FAIL (X errors, Y warnings)
   - Format: PASS/FAIL (list files with issues)
   - Build: PASS/FAIL (output size)
5. If any check fails, suggest the fix command

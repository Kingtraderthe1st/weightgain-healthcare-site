# 🔧 Troubleshooting Guide

## Issue 1: "Could not read package.json" Error

### Problem
You're running npm commands from the wrong directory (your home folder instead of the project folder).

### Solution
**Always navigate to your project directory first:**

```bash
# Navigate to your project
cd /Users/london/weightgain-healthcare-site

# Now you can run npm commands
npm run lint
npm run format
```

### Pro Tip: Create an Alias
Add this to your `~/.zshrc` or `~/.bash_profile`:
```bash
alias wg="cd /Users/london/weightgain-healthcare-site"
```

Then just type `wg` to go to your project!

---

## Issue 2: "eslint: command not found"

### Problem
Dependencies aren't installed. You need to run `npm install` first.

### Solution
```bash
# Navigate to project
cd /Users/london/weightgain-healthcare-site

# Install dependencies
npm install
```

---

## Issue 3: Network/Connection Errors

### Problem
npm can't connect to the internet to download packages.

### Common Causes:
1. **No internet connection** - Check your WiFi/network
2. **Firewall blocking npm** - Check firewall settings
3. **Proxy settings** - If you're behind a corporate proxy
4. **DNS issues** - Can't resolve registry.npmjs.org

### Solutions:

#### 1. Check Internet Connection
```bash
# Test internet
ping google.com

# Test npm registry
ping registry.npmjs.org
```

#### 2. Check npm Configuration
```bash
# View npm config
npm config list

# If behind proxy, set it:
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080
```

#### 3. Clear npm Cache
```bash
npm cache clean --force
```

#### 4. Try Different Registry (if npmjs.org is blocked)
```bash
# Use a different registry (like Taobao in China)
npm config set registry https://registry.npmmirror.com
```

#### 5. Use VPN (if network is restricted)
- Connect to VPN if your network blocks npm
- Then try `npm install` again

---

## Issue 4: Working Without npm (Temporary)

If you can't install dependencies right now, you can still:

### ✅ Use VS Code Extensions
- ESLint extension works even without npm install
- Prettier extension works standalone
- These will still help you write better code

### ✅ Manual Code Review
- Read your code carefully
- Check for common mistakes
- Use browser DevTools to test

### ✅ Use Online Tools
- **ESLint Playground**: https://eslint.org/play
- **Prettier Playground**: https://prettier.io/playground/
- Paste your code and check it

---

## Quick Reference: Common Commands

```bash
# Navigate to project
cd /Users/london/weightgain-healthcare-site

# Install dependencies (first time only)
npm install

# Check code quality
npm run lint

# Auto-fix issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

---

## Still Having Issues?

### Check These:
1. ✅ Are you in the project directory? (`pwd` should show `/Users/london/weightgain-healthcare-site`)
2. ✅ Is `package.json` in the current directory? (`ls package.json`)
3. ✅ Do you have internet? (`ping google.com`)
4. ✅ Are dependencies installed? (`ls node_modules`)

### Get Help:
- Check npm logs: `~/.npm/_logs/`
- Run with verbose: `npm install --loglevel=verbose`
- Check npm version: `npm --version`
- Check node version: `node --version`

---

## Beginner Tip: Always Check Your Directory

**Before running any npm command, always check:**
```bash
# See where you are
pwd

# See what files are here
ls

# If you don't see package.json, you're in the wrong place!
```

**The fix:**
```bash
cd /Users/london/weightgain-healthcare-site
```

---

## Summary

1. **Directory Issue** ✅ Fixed - Always `cd` to project first
2. **Dependencies** ⚠️ Need internet - Run `npm install` when connected
3. **Network** ⚠️ Check connection/proxy/firewall
4. **Workaround** ✅ Use VS Code extensions in the meantime

**Most important:** Always run commands from `/Users/london/weightgain-healthcare-site` directory!

# 🌐 Network Issue - Can't Install npm Packages

## The Problem
npm can't connect to `registry.npmjs.org` to download packages. This is a network connectivity issue.

## Quick Solutions

### ✅ Solution 1: Use VS Code Extensions (Works Right Now!)

**You don't need npm installed to use ESLint and Prettier!**

1. **Open VS Code**
2. **Press `Cmd+Shift+X`** (Extensions)
3. **Install these extensions:**
   - **ESLint** (by Microsoft)
   - **Prettier** (by Prettier)
   - **Error Lens** (by Alexander)

These extensions work **without npm install** and will:
- ✅ Show errors in real-time
- ✅ Auto-format on save
- ✅ Fix issues automatically

**This is the fastest solution!**

---

### ✅ Solution 2: Fix Network Connection

#### Check 1: Internet Connection
```bash
# Test if you have internet
ping google.com

# Test npm registry
ping registry.npmjs.org
```

#### Check 2: DNS Issues
```bash
# Try using Google DNS
# (You'll need to change this in System Preferences → Network)
```

#### Check 3: Proxy Settings
If you're behind a corporate proxy or VPN:

```bash
# Check if you need proxy settings
npm config get proxy
npm config get https-proxy

# If you need to set proxy:
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080
```

#### Check 4: Firewall
- Check if your firewall is blocking npm
- Try temporarily disabling firewall to test

#### Check 5: Try Different Registry
```bash
# Use a mirror (if npmjs.org is blocked)
npm config set registry https://registry.npmmirror.com

# Then try install again
npm install
```

---

### ✅ Solution 3: Use npx (Bypass Local Install)

You can run tools directly without installing:

```bash
# Run ESLint directly
npx eslint js/*.js app.js

# Run Prettier directly
npx prettier --write "**/*.{js,html,css}"
```

**Note:** This still requires internet, but might work if the issue is with local installs.

---

### ✅ Solution 4: Manual Installation (If Network Works Later)

When your network is working:

```bash
cd /Users/london/weightgain-healthcare-site
npm install
```

Then you can use:
```bash
npm run lint
npm run format
```

---

## What You Can Do Right Now (Without npm)

### 1. Use VS Code Extensions ✅
- Install ESLint, Prettier, Error Lens extensions
- They work immediately without npm install
- Auto-format and show errors in real-time

### 2. Use Browser DevTools
- Press F12 in browser
- Check Console for errors
- Use Network tab to debug

### 3. Manual Code Review
- Read your code carefully
- Check for common mistakes
- Use online tools (ESLint Playground)

### 4. Online Tools
- **ESLint Playground**: https://eslint.org/play
- **Prettier Playground**: https://prettier.io/playground/
- Paste your code to check it

---

## Testing Your Network

Run these commands to diagnose:

```bash
# Test basic internet
ping google.com

# Test npm registry
ping registry.npmjs.org

# Check DNS
nslookup registry.npmjs.org

# Check npm config
npm config list

# Try with verbose logging
npm install --loglevel=verbose
```

---

## Common Network Issues & Fixes

### Issue: "getaddrinfo ENOTFOUND"
**Cause:** Can't resolve DNS for npm registry

**Fixes:**
1. Check internet connection
2. Try different DNS (8.8.8.8, 1.1.1.1)
3. Check proxy settings
4. Try VPN if network is restricted

### Issue: "ETIMEDOUT"
**Cause:** Connection timeout

**Fixes:**
1. Check firewall settings
2. Try different network (mobile hotspot)
3. Check if corporate proxy is needed

### Issue: "ECONNREFUSED"
**Cause:** Connection refused

**Fixes:**
1. Check proxy settings
2. Try different registry mirror
3. Check firewall rules

---

## Recommended Action Plan

1. **Right Now:** Install VS Code extensions (works without npm!)
2. **Next:** Check internet connection (`ping google.com`)
3. **Then:** Try `npm install` again
4. **If still fails:** Check proxy/firewall settings
5. **Alternative:** Use `npx` to run tools directly

---

## Summary

**You have 2 options:**

1. **Use VS Code Extensions** ✅ (Works immediately, no npm needed)
   - Install ESLint, Prettier, Error Lens
   - They work right away!

2. **Fix Network & Install npm** ⚠️ (Requires internet)
   - Check connection
   - Fix proxy/firewall
   - Run `npm install`

**Best approach:** Use VS Code extensions now, fix network later for full npm support.

---

## Need More Help?

- Check `TROUBLESHOOTING.md` for more details
- Check npm logs: `~/.npm/_logs/`
- Check npm version: `npm --version`
- Check node version: `node --version`

# ⚡ Quick Fix for Your Error

## The Problem
You're running npm commands from your home directory (`~`) instead of your project directory.

## The Solution (2 Steps)

### Step 1: Navigate to Your Project
```bash
cd /Users/london/weightgain-healthcare-site
```

### Step 2: Now Run Commands
```bash
# Check code quality
npm run lint

# Format code
npm run format
```

---

## Why This Happened

When you open Terminal, you start in your home directory (`~` or `/Users/london/`).

Your project is in a **subfolder**: `/Users/london/weightgain-healthcare-site/`

npm looks for `package.json` in the **current directory**, so you need to be in the project folder.

---

## Pro Tip: Never Get Lost Again

### Option 1: Always Check First
```bash
# Before running npm, check where you are:
pwd

# If it doesn't show "weightgain-healthcare-site", navigate:
cd /Users/london/weightgain-healthcare-site
```

### Option 2: Create a Shortcut
Add this to your `~/.zshrc` file:
```bash
alias wg="cd /Users/london/weightgain-healthcare-site"
```

Then just type `wg` to go to your project!

### Option 3: Open Terminal in Project Folder
1. Open Finder
2. Navigate to your project folder
3. Right-click → "New Terminal at Folder"
4. Terminal opens in the right place automatically!

---

## About the Network Error

If you also see network errors when running `npm install`:

1. **Check internet connection** - Make sure you're online
2. **Try again later** - Sometimes npm registry is slow
3. **Use VS Code extensions** - They work without npm install
4. **See TROUBLESHOOTING.md** - For more help

---

## Summary

**Always do this:**
```bash
cd /Users/london/weightgain-healthcare-site
npm run lint
```

**Not this:**
```bash
# ❌ Don't run from home directory
npm run lint  # Error: no package.json
```

---

**That's it!** Just remember to `cd` to your project folder first. 🚀

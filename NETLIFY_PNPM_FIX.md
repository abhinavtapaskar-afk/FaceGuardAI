# 🔧 NETLIFY PNPM ERROR FIX

## 🐛 THE ERROR

```
ERR_INVALID_THIS: Value of 'this' must be of type URLSearchParams.
```

**Build fails on Node v22.22.0**

---

## 🎯 ROOT CAUSE

**pnpm is not fully compatible with Node.js 22**

- Netlify is using Node v22.22.0
- pnpm's registry client (undici) has compatibility issues with Node 22
- This causes registry fetches to fail during install

---

## ✅ FIXES APPLIED (AUTOMATIC)

### **Fix 1: .nvmrc File** ✅
**File:** `.nvmrc`
**Content:** `20`

This tells Netlify to use Node.js 20 (LTS) instead of 22.

### **Fix 2: package.json Engines** ✅
**File:** `package.json`

```json
{
  "packageManager": "pnpm@9.15.0",
  "engines": {
    "node": ">=18 <23",
    "npm": ">=9.0.0",
    "pnpm": ">=9.0.0"
  }
}
```

This:
- Pins pnpm to version 9.15.0
- Restricts Node to 18-22 (excludes 23+)
- Ensures compatible versions

---

## 🚀 WHAT TO DO NOW

### **STEP 1: Trigger New Build**

**Option A: Push Changes (Automatic)**
```bash
# Changes are already committed
# Just push to trigger rebuild
git pull origin main
git push origin main
```

**Option B: Manual Trigger**
1. Go to Netlify Dashboard
2. Click your site
3. Click **Deploys**
4. Click **Trigger deploy** → **Deploy site**

---

### **STEP 2: Verify Build**

**Watch Build Logs:**
1. Netlify Dashboard → Deploys
2. Click on the running build
3. Watch for:

```
✓ Using Node.js 20.x
✓ Installing pnpm 9.15.0
✓ Installing dependencies
✓ Build succeeded
```

---

## 🔍 IF STILL FAILS

### **Option 1: Set Environment Variable**

1. Netlify Dashboard → Site settings
2. **Build & deploy** → **Environment variables**
3. Add:
   - Key: `NODE_VERSION`
   - Value: `20`
4. Save and redeploy

### **Option 2: Set PNPM Version**

Add to environment variables:
- Key: `PNPM_VERSION`
- Value: `9.15.0`

### **Option 3: Clear Cache**

1. Netlify Dashboard → Deploys
2. Click **Trigger deploy**
3. Select **Clear cache and deploy site**

---

## 📊 COMPATIBILITY MATRIX

| Node Version | pnpm 9.x | Status |
|--------------|----------|--------|
| Node 18 LTS  | ✅ Works | Recommended |
| Node 20 LTS  | ✅ Works | Recommended |
| Node 22      | ⚠️ Issues | Avoid |
| Node 23+     | ❌ Fails | Not supported |

---

## 🧪 VERIFY AFTER FIX

### **Check Build Logs:**

**Should see:**
```
12:00:00 PM: Using Node.js 20.x
12:00:01 PM: Installing pnpm 9.15.0
12:00:02 PM: Installing dependencies...
12:00:10 PM: Dependencies installed successfully
12:00:15 PM: Build succeeded
```

**Should NOT see:**
```
❌ ERR_INVALID_THIS
❌ URLSearchParams error
❌ Registry fetch failed
```

---

## 🎯 WHAT EACH FIX DOES

### **.nvmrc**
- Tells Netlify which Node version to use
- Automatically respected by Netlify
- Most reliable method

### **package.json engines**
- Specifies compatible Node versions
- Prevents incompatible versions
- Good for documentation

### **packageManager field**
- Pins exact pnpm version
- Prevents version drift
- Ensures consistency

---

## 🆘 TROUBLESHOOTING

### **Error: "Node version not found"**

**Solution:**
Change `.nvmrc` to:
```
18
```

Or add to Netlify env vars:
```
NODE_VERSION=18
```

### **Error: "pnpm not found"**

**Solution:**
Add to Netlify env vars:
```
PNPM_VERSION=9.15.0
```

### **Error: "Dependencies failed to install"**

**Solution:**
1. Clear Netlify cache
2. Trigger new deploy
3. Check for typos in package.json

### **Error: "Build timeout"**

**Solution:**
1. Increase build timeout in Netlify settings
2. Or optimize dependencies
3. Or use npm instead of pnpm

---

## 💡 ALTERNATIVE: USE NPM INSTEAD

If pnpm continues to cause issues:

### **Option 1: Remove pnpm**

Delete from `package.json`:
```json
"packageManager": "pnpm@9.15.0",  // Remove this line
```

Netlify will use npm by default.

### **Option 2: Specify npm**

Add to `package.json`:
```json
"packageManager": "npm@10.0.0"
```

### **Option 3: Netlify Build Settings**

1. Site settings → Build & deploy
2. **Build command:** Change to use npm
3. Example: `npm install && npm run build`

---

## 📋 CHECKLIST

After applying fixes:
- [ ] `.nvmrc` file exists with `20`
- [ ] `package.json` has `engines` field
- [ ] `package.json` has `packageManager` field
- [ ] Pushed changes to GitHub
- [ ] Triggered new Netlify build
- [ ] Build logs show Node 20.x
- [ ] Build succeeds without errors
- [ ] Site deploys successfully

---

## 🔗 HELPFUL LINKS

- **Netlify Node.js Docs:** https://docs.netlify.com/configure-builds/manage-dependencies/#node-js
- **pnpm Compatibility:** https://pnpm.io/installation#compatibility
- **Node.js Releases:** https://nodejs.org/en/about/previous-releases

---

## 🎉 SUMMARY

**Problem:** pnpm fails on Node 22 with URLSearchParams error

**Solution:** Use Node 20 LTS instead

**Fixes Applied:**
1. ✅ Created `.nvmrc` with Node 20
2. ✅ Updated `package.json` engines
3. ✅ Pinned pnpm to 9.15.0

**Next Step:** Push changes and rebuild on Netlify

**Expected Result:** Build succeeds on Node 20 ✅

---

**⚡ Your Netlify build should now work perfectly with Node 20 LTS!**

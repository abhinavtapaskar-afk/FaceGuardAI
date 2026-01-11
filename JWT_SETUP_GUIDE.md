# 🔐 JWT Secret Setup Guide

## ✅ For Testing (Simple Setup)

**You only need `JWT_SECRET`** - refresh tokens are optional.

### Minimum Required Setup:

Add to your `config.env`:

```env
JWT_SECRET=test-secret-key-for-development-only-min-32-chars-long
```

**That's it!** You can test everything with just this.

---

## 🔒 For Production (Recommended)

### Option 1: Simple (Current Implementation)
- ✅ Only `JWT_SECRET` needed
- ✅ Tokens expire in 24 hours
- ✅ Users re-login after expiration

**Setup:**
```env
JWT_SECRET=your-production-secret-at-least-32-characters-long-random-string
```

**Generate a secure secret:**
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

---

### Option 2: With Refresh Tokens (More Secure)

If you want refresh token support (better security):

**Setup:**
```env
JWT_SECRET=your-access-token-secret-32-chars-min
JWT_REFRESH_SECRET=your-refresh-token-secret-32-chars-min
```

**Benefits:**
- ✅ Shorter access token lifetime (15 min)
- ✅ Longer refresh token lifetime (7 days)
- ✅ Better security (stolen tokens expire quickly)
- ✅ Better user experience (auto-refresh)

**Note:** Refresh tokens are not yet implemented. If you want this feature, let me know!

---

## 📝 Quick Setup for Testing

### Step 1: Generate a Test Secret

**Option A: Use any random string (32+ characters)**
```env
JWT_SECRET=test-secret-key-for-development-only-min-32-chars-long
```

**Option B: Generate random secret**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 2: Add to `config.env`

```env
JWT_SECRET=your-generated-secret-here
```

### Step 3: Start Server

```bash
npm run dev
```

---

## ⚠️ Important Notes

1. **JWT_SECRET is REQUIRED**
   - App won't start without it
   - Must be at least 32 characters for production
   - Can be shorter for testing (but not recommended)

2. **JWT_REFRESH_SECRET is OPTIONAL**
   - Only needed if refresh tokens are implemented
   - Currently not used in the codebase

3. **Never Commit Secrets**
   - Add `config.env` to `.gitignore`
   - Use environment variables in production
   - Never share your secrets

4. **Production Secrets**
   - Use different secrets for production
   - Generate strong random secrets
   - Rotate secrets periodically

---

## 🎯 Summary

**For Testing:**
- ✅ Only need `JWT_SECRET`
- ✅ Use any 32+ character string
- ✅ Example: `JWT_SECRET=test-secret-key-for-development-only-min-32-chars-long`

**For Production:**
- ✅ Only need `JWT_SECRET` (current setup)
- ✅ Generate strong random secret
- ✅ Keep it secure and private

**Refresh Tokens:**
- ⏳ Not implemented yet
- ⏳ Would require `JWT_REFRESH_SECRET`
- ⏳ Can be added if needed

---

## 🔧 Troubleshooting

### Error: "Missing required environment variables: JWT_SECRET"
- ✅ Add `JWT_SECRET` to `config.env`
- ✅ Make sure it's at least 32 characters

### Error: "JWT_SECRET is too short"
- ✅ Use at least 32 characters
- ✅ This is a warning in development, error in production

### Token Expired
- ✅ Tokens expire after 24 hours
- ✅ User needs to login again
- ✅ This is normal behavior

---

**You're all set! Just add `JWT_SECRET` to your `config.env` and you're good to go! 🚀**


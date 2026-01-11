# 🚀 Quick Start in Cursor IDE

## Step-by-Step in Cursor

### Step 1: Open Terminal in Cursor

**Method 1: Keyboard Shortcut (Fastest)**
- Press: `Ctrl + ~` (Control + backtick/tilde key)
- OR: `Ctrl + Shift + ~`

**Method 2: Menu**
- Click: `Terminal` → `New Terminal` (top menu)
- OR: `View` → `Terminal`

**Method 3: Command Palette**
- Press: `Ctrl + Shift + P`
- Type: "Terminal: Create New Terminal"
- Press Enter

---

### Step 2: Check You're in the Right Folder

In the terminal, you should see something like:
```
C:\Users\pc\Documents\GitHub\FaceGuardAI>
```

If you're NOT in the FaceGuardAI folder, type:
```bash
cd C:\Users\pc\Documents\GitHub\FaceGuardAI
```

---

### Step 3: Install Dependencies

In the Cursor terminal, type:

```bash
npm install
```

**Press Enter**

**What you'll see:**
```
npm WARN deprecated ...
added 150 packages in 2m
```

**Wait for it to finish** (1-2 minutes)

---

### Step 4: Start the Server

After `npm install` completes, type:

```bash
npm run dev
```

**Press Enter**

**Expected Output:**
```
⚠️  WARNING: Some environment variables are missing
📝 Running in TEST/MOCK mode - API calls will be mocked.
🔧 MOCK MODE: Using mock skin analyzer
🔧 MOCK MODE: Using mock database
✅ Environment variables validated successfully
🚀 FaceGuard AI Server running on port 3000
```

**✅ Server is now running!**

---

### Step 5: Test It

**Keep the terminal open** (server is running), then:

**Option A: Test in Browser**
1. Open any browser (Chrome, Edge, Firefox)
2. Go to: `http://localhost:3000/health`
3. You should see: `{"status":"ok",...}`

**Option B: Test in Cursor Terminal (New Terminal)**
1. In Cursor, open a **NEW terminal** (Terminal → New Terminal)
2. Type:
   ```bash
   curl http://localhost:3000/health
   ```

---

## 📸 Visual Guide for Cursor

```
1. Press Ctrl + ~          → Terminal opens at bottom
   ↓
2. Type: npm install       → Wait 1-2 minutes
   ↓
3. Type: npm run dev       → Server starts
   ↓
4. Open browser: localhost:3000/health
   ↓
   ✅ Success!
```

---

## 🎯 Quick Commands (Copy-Paste)

In Cursor terminal, run these one by one:

```bash
npm install
```

Wait for it to finish, then:

```bash
npm run dev
```

---

## 💡 Cursor Tips

### Split Terminal
- Click the `+` button in terminal panel
- OR: `Ctrl + Shift + ~` to create new terminal
- Useful: Keep server running in one, test in another

### Terminal Panel
- Click terminal panel to focus it
- Press `Ctrl + ~` again to hide/show terminal
- Drag to resize terminal panel

### Stop Server
- In terminal, press: `Ctrl + C`
- This stops the server

---

## 🐛 Common Issues in Cursor

### Terminal not opening
- Try: `Ctrl + Shift + ~`
- OR: Menu → Terminal → New Terminal

### "npm is not recognized"
- Install Node.js: https://nodejs.org/
- Restart Cursor after installing

### "Cannot find module"
- Make sure you're in `FaceGuardAI` folder
- Check terminal path shows: `...\FaceGuardAI>`

### Port already in use
- Change `PORT=3001` in `config.env`
- OR: Close other programs using port 3000

---

## ✅ Success Checklist

- [ ] Terminal opened in Cursor (Ctrl + ~)
- [ ] `npm install` completed
- [ ] `npm run dev` started
- [ ] Server shows "running on port 3000"
- [ ] Browser shows health check response

---

## 🎉 You're Done!

Once you see "Server running on port 3000", you're all set!

**Next:** Test the API endpoints or connect your frontend!

---

**Just press `Ctrl + ~` in Cursor and run those 2 commands! 🚀**


const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure uploads folder exists
const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// Serve static frontend
app.use(express.static("public"));

// Multer setup (save files to uploads folder)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `photo-${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

// HEALTH / ROOT
app.get("/", (req, res) => {
  res.send("FaceGuard AI is running 🚀");
});

// Upload endpoint
app.post("/upload", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });

    const savedPath = req.file.path; // local file path
    // Placeholder analysis - replace with AI call later
    const analysis = await simpleAnalyze(savedPath);

    // Optionally: delete file after analyze if you don't need to store it
    // fs.unlinkSync(savedPath);

    return res.json({ ok: true, file: req.file.filename, analysis });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
});

// A simple placeholder analysis function that inspects image brightness / variance etc.
// Keeps your app working now. Replace with real vision model later.
const Jimp = require("jimp"); // we will add to package.json, Jimp is pure-js image lib

async function simpleAnalyze(imagePath) {
  try {
    const img = await Jimp.read(imagePath);
    img.resize(256, 256); // small for speed

    // compute average brightness and variance as naive metrics
    let sum = 0, sumSq = 0, count = 0;
    img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      const lum = 0.2126*r + 0.7152*g + 0.0722*b;
      sum += lum; sumSq += lum*lum; count++;
    });
    const mean = sum / count;
    const variance = sumSq / count - mean*mean;

    // naive rules
    const issues = [];
    if (mean < 70) issues.push("Dull skin / low brightness");
    if (variance > 1500) issues.push("Texture/roughness likely");
    if (mean > 170) issues.push("High brightness (possible oily shine)");
    // other dummy rules
    if (issues.length === 0) issues.push("No strong issues detected — needs AI for deeper analysis");

    return { meanLum: Math.round(mean), variance: Math.round(variance), issues };
  } catch (e) {
    console.error("simpleAnalyze error:", e);
    return { error: "analysis failed", details: e.message };
  }
}

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

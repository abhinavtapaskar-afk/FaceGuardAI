const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/auth');
const { analyzeSkin } = require('../../ai_engine/skinAnalyzer');
const { generateRecommendations } = require('../../ai_engine/recommendationEngine');
const { db } = require('../config/database');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `scan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/jpg').split(',');
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and JPG are allowed.'));
    }
  }
});

// POST /api/scan - Upload and analyze skin
router.post('/', authMiddleware, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: true,
        message: 'No photo uploaded'
      });
    }

    const imagePath = req.file.path;
    const imageUrl = `/uploads/${req.file.filename}`;

    // Step 1: Analyze skin using AI
    console.log('Analyzing skin...');
    const analysis = await analyzeSkin(imagePath);

    // Step 2: Generate recommendations
    console.log('Generating recommendations...');
    const recommendations = generateRecommendations(analysis.skinType, analysis.issues);

    // Step 3: Save scan to database
    const scanData = {
      skinType: analysis.skinType,
      issues: analysis.issues,
      analysis: {
        confidence: analysis.confidence,
        detectedIssues: analysis.issues.length
      },
      imageUrl
    };

    const scan = await db.createScan(req.user.id, scanData);

    // Step 4: Save recommendations
    await db.saveRecommendations(scan.id, recommendations);

    // Clean up: optionally delete image after processing
    // fs.unlinkSync(imagePath);

    res.json({
      success: true,
      message: 'Skin analysis completed',
      data: {
        scanId: scan.id,
        skinType: analysis.skinType,
        issues: analysis.issues,
        confidence: analysis.confidence,
        recommendations,
        imageUrl
      }
    });
  } catch (error) {
    console.error('Scan error:', error);
    
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: true,
      message: error.message || 'Error analyzing skin'
    });
  }
});

// GET /api/scan/:scanId - Get scan details
router.get('/:scanId', authMiddleware, async (req, res) => {
  try {
    const scan = await db.getScanById(req.params.scanId);
    
    if (!scan) {
      return res.status(404).json({
        error: true,
        message: 'Scan not found'
      });
    }

    // Check if scan belongs to user
    if (scan.user_id !== req.user.id) {
      return res.status(403).json({
        error: true,
        message: 'Access denied'
      });
    }

    // Get recommendations
    const recommendations = await db.getRecommendationsByScanId(scan.id);

    res.json({
      success: true,
      data: {
        scan,
        recommendations
      }
    });
  } catch (error) {
    console.error('Get scan error:', error);
    res.status(500).json({
      error: true,
      message: 'Error fetching scan'
    });
  }
});

// GET /api/scan - Get user's scan history
router.get('/', authMiddleware, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const scans = await db.getUserScans(req.user.id, limit);

    res.json({
      success: true,
      data: {
        scans,
        count: scans.length
      }
    });
  } catch (error) {
    console.error('Get scans error:', error);
    res.status(500).json({
      error: true,
      message: 'Error fetching scans'
    });
  }
});

module.exports = router;

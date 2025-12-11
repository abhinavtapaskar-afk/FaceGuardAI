const express = require('express');
const authMiddleware = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { db } = require('../config/database');
const logger = require('../utils/logger');

const router = express.Router();

// GET /api/products - Get all active products
router.get('/',
  asyncHandler(async (req, res) => {
    const { category, skinType } = req.query;

    let query = `
      SELECT 
        id,
        name,
        description,
        category,
        brand,
        price,
        currency,
        image_url,
        active_ingredients,
        skin_types,
        concerns,
        priority
      FROM affiliate_products
      WHERE is_active = true
    `;

    const params = [];
    let paramIndex = 1;

    if (category) {
      query += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (skinType) {
      query += ` AND skin_types @> $${paramIndex}::jsonb`;
      params.push(JSON.stringify([skinType]));
      paramIndex++;
    }

    query += ` ORDER BY priority DESC, name ASC`;

    const { rows } = await db.query(query, params);

    res.json({
      success: true,
      data: {
        products: rows,
        total: rows.length,
      },
    });
  })
);

// GET /api/products/recommendations/:scanId - Get recommended products for a scan
router.get('/recommendations/:scanId',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { scanId } = req.params;

    // Get scan data
    const scan = await db.getScanById(scanId);
    if (!scan || scan.user_id !== req.user.id) {
      return res.status(404).json({
        error: true,
        message: 'Scan not found',
      });
    }

    // Get recommended products based on skin type and concerns
    const { rows: products } = await db.query(
      `SELECT 
        p.id,
        p.name,
        p.description,
        p.category,
        p.brand,
        p.price,
        p.currency,
        p.image_url,
        p.active_ingredients,
        p.amazon_url,
        p.amazon_affiliate_tag,
        p.flipkart_url,
        p.flipkart_affiliate_id,
        spr.recommendation_reason,
        spr.priority
      FROM affiliate_products p
      LEFT JOIN scan_product_recommendations spr ON p.id = spr.product_id AND spr.scan_id = $1
      WHERE p.is_active = true
        AND (p.skin_types @> $2::jsonb OR p.concerns && $3)
      ORDER BY spr.priority DESC NULLS LAST, p.priority DESC
      LIMIT 10`,
      [
        scanId,
        JSON.stringify([scan.skin_type]),
        scan.analysis?.issues ? Object.keys(scan.analysis.issues) : []
      ]
    );

    // Generate affiliate links
    const productsWithLinks = products.map(product => ({
      ...product,
      affiliateLinks: {
        amazon: product.amazon_url 
          ? `${product.amazon_url}?tag=${process.env.AFFILIATE_TAG}`
          : null,
        flipkart: product.flipkart_url
          ? `${product.flipkart_url}?affid=${process.env.FLIPKART_ID}`
          : null,
      },
    }));

    res.json({
      success: true,
      data: {
        products: productsWithLinks,
        total: productsWithLinks.length,
        scanId,
      },
    });
  })
);

// POST /api/products/:productId/click - Track affiliate click
router.post('/:productId/click',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { platform, scanId } = req.body; // 'amazon' or 'flipkart'

    if (!platform || !['amazon', 'flipkart'].includes(platform)) {
      return res.status(400).json({
        error: true,
        message: 'Invalid platform. Must be amazon or flipkart',
      });
    }

    // Get product
    const { rows: products } = await db.query(
      'SELECT * FROM affiliate_products WHERE id = $1',
      [productId]
    );

    if (products.length === 0) {
      return res.status(404).json({
        error: true,
        message: 'Product not found',
      });
    }

    const product = products[0];

    // Track click
    await db.query(
      `INSERT INTO affiliate_clicks (user_id, product_id, scan_id, platform, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        req.user.id,
        productId,
        scanId || null,
        platform,
        req.ip,
        req.get('user-agent')
      ]
    );

    // Generate affiliate link
    let affiliateLink;
    if (platform === 'amazon') {
      affiliateLink = `${product.amazon_url}?tag=${process.env.AFFILIATE_TAG}`;
    } else {
      affiliateLink = `${product.flipkart_url}?affid=${process.env.FLIPKART_ID}`;
    }

    logger.info('Affiliate click tracked', {
      userId: req.user.id,
      productId,
      platform,
      scanId,
    });

    res.json({
      success: true,
      message: 'Click tracked successfully',
      data: {
        affiliateLink,
        platform,
      },
    });
  })
);

// GET /api/products/categories - Get all product categories
router.get('/categories',
  asyncHandler(async (req, res) => {
    const { rows } = await db.query(
      `SELECT DISTINCT category, COUNT(*) as count
       FROM affiliate_products
       WHERE is_active = true
       GROUP BY category
       ORDER BY category`
    );

    res.json({
      success: true,
      data: {
        categories: rows,
      },
    });
  })
);

// GET /api/products/stats - Get affiliate stats (admin/user)
router.get('/stats',
  authMiddleware,
  asyncHandler(async (req, res) => {
    // Get user's click stats
    const { rows: clickStats } = await db.query(
      `SELECT 
        COUNT(*) as total_clicks,
        COUNT(DISTINCT product_id) as unique_products,
        COUNT(CASE WHEN platform = 'amazon' THEN 1 END) as amazon_clicks,
        COUNT(CASE WHEN platform = 'flipkart' THEN 1 END) as flipkart_clicks
      FROM affiliate_clicks
      WHERE user_id = $1`,
      [req.user.id]
    );

    // Get most clicked products
    const { rows: topProducts } = await db.query(
      `SELECT 
        p.name,
        p.brand,
        p.category,
        COUNT(*) as click_count
      FROM affiliate_clicks ac
      JOIN affiliate_products p ON ac.product_id = p.id
      WHERE ac.user_id = $1
      GROUP BY p.id, p.name, p.brand, p.category
      ORDER BY click_count DESC
      LIMIT 5`,
      [req.user.id]
    );

    res.json({
      success: true,
      data: {
        stats: clickStats[0],
        topProducts,
      },
    });
  })
);

module.exports = router;

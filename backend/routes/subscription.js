const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const authMiddleware = require('../middleware/auth');
const { db } = require('../config/database');

const router = express.Router();

// Initialize Razorpay (only if enabled)
let razorpay = null;
if (process.env.RAZORPAY_ENABLED === 'true' && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// Subscription plans
const PLANS = {
  monthly: {
    name: 'Premium Monthly',
    amount: 9900, // ₹99 in paise
    currency: 'INR',
    duration_days: 30,
  },
  yearly: {
    name: 'Premium Yearly',
    amount: 99900, // ₹999 in paise
    currency: 'INR',
    duration_days: 365,
  },
};

// POST /api/subscription/create-order - Create Razorpay order
router.post('/create-order', authMiddleware, async (req, res) => {
  try {
    // Check if Razorpay is enabled
    if (!razorpay) {
      return res.status(503).json({
        error: true,
        message: 'Payment system is currently unavailable'
      });
    }

    const { plan_type } = req.body; // 'monthly' or 'yearly'

    if (!plan_type || !PLANS[plan_type]) {
      return res.status(400).json({
        error: true,
        message: 'Invalid plan type. Choose monthly or yearly'
      });
    }

    const plan = PLANS[plan_type];

    // Create Razorpay order
    const options = {
      amount: plan.amount,
      currency: plan.currency,
      receipt: `order_${req.user.id}_${Date.now()}`,
      notes: {
        user_id: req.user.id,
        plan_type: plan_type,
      },
    };

    const order = await razorpay.orders.create(options);

    // Save transaction to database
    await db.createPaymentTransaction({
      user_id: req.user.id,
      razorpay_order_id: order.id,
      amount: plan.amount / 100, // Convert paise to rupees
      currency: plan.currency,
      status: 'created',
      plan_type: plan_type,
      plan_duration_days: plan.duration_days,
    });

    res.json({
      success: true,
      data: {
        order_id: order.id,
        amount: plan.amount,
        currency: plan.currency,
        key_id: process.env.RAZORPAY_KEY_ID,
        plan: plan,
      },
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      error: true,
      message: 'Error creating payment order'
    });
  }
});

// POST /api/subscription/verify-payment - Verify Razorpay payment
router.post('/verify-payment', authMiddleware, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan_type,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        error: true,
        message: 'Missing payment verification data'
      });
    }

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({
        error: true,
        message: 'Invalid payment signature'
      });
    }

    // Payment verified! Update user to premium
    const plan = PLANS[plan_type];
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + plan.duration_days);

    await db.updateUserPremiumStatus(req.user.id, {
      is_premium: true,
      premium_expires_at: expiresAt,
      razorpay_customer_id: razorpay_payment_id,
    });

    // Update transaction status
    await db.updatePaymentTransaction(razorpay_order_id, {
      razorpay_payment_id,
      razorpay_signature,
      status: 'captured',
    });

    res.json({
      success: true,
      message: 'Payment successful! You are now premium 🎉',
      data: {
        is_premium: true,
        expires_at: expiresAt,
      },
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      error: true,
      message: 'Error verifying payment'
    });
  }
});

// GET /api/subscription/status - Get subscription status
router.get('/status', authMiddleware, async (req, res) => {
  try {
    const user = await db.getUserById(req.user.id);

    res.json({
      success: true,
      data: {
        is_premium: user.is_premium || false,
        premium_expires_at: user.premium_expires_at,
        days_remaining: user.premium_expires_at
          ? Math.ceil((new Date(user.premium_expires_at) - new Date()) / (1000 * 60 * 60 * 24))
          : 0,
      },
    });
  } catch (error) {
    console.error('Get status error:', error);
    res.status(500).json({
      error: true,
      message: 'Error fetching subscription status'
    });
  }
});

// GET /api/subscription/plans - Get available plans
router.get('/plans', async (req, res) => {
  try {
    const plans = Object.entries(PLANS).map(([key, plan]) => ({
      id: key,
      name: plan.name,
      price: plan.amount / 100, // Convert to rupees
      currency: plan.currency,
      duration_days: plan.duration_days,
      features: [
        'Unlimited scans',
        'Before/After comparison',
        'Weekly PDF reports',
        'Advanced analytics',
        'Product recommendations',
        'Priority support',
        'Ad-free experience',
      ],
    }));

    res.json({
      success: true,
      data: { plans },
    });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({
      error: true,
      message: 'Error fetching plans'
    });
  }
});

// POST /api/subscription/cancel - Cancel subscription
router.post('/cancel', authMiddleware, async (req, res) => {
  try {
    // Update user premium status
    await db.updateUserPremiumStatus(req.user.id, {
      is_premium: false,
      premium_expires_at: null,
    });

    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      error: true,
      message: 'Error cancelling subscription'
    });
  }
});

module.exports = router;

const express = require('express');
const { db } = require('../config/database');
const logger = require('../utils/logger');

const router = express.Router();

// Simple health check
router.get('/health', async (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Detailed health check with database connectivity
router.get('/health/detailed', async (req, res) => {
  const health = {
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    checks: {
      database: 'unknown',
      memory: 'unknown',
      openai: 'unknown',
    },
  };

  try {
    // Check database connection
    try {
      await db.query('SELECT 1');
      health.checks.database = 'healthy';
    } catch (error) {
      health.checks.database = 'unhealthy';
      health.success = false;
      health.status = 'degraded';
      logger.error('Database health check failed:', error);
    }

    // Check memory usage
    const memoryUsage = process.memoryUsage();
    const memoryUsageMB = {
      rss: Math.round(memoryUsage.rss / 1024 / 1024),
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      external: Math.round(memoryUsage.external / 1024 / 1024),
    };

    health.checks.memory = {
      status: memoryUsageMB.heapUsed < 500 ? 'healthy' : 'warning',
      usage: memoryUsageMB,
    };

    // Check OpenAI API (optional - only if key is set)
    if (process.env.OPENAI_API_KEY) {
      health.checks.openai = 'configured';
    } else {
      health.checks.openai = 'not_configured';
    }

    const statusCode = health.success ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (error) {
    logger.error('Health check error:', error);
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
    });
  }
});

// Readiness probe (for Kubernetes/Docker)
router.get('/ready', async (req, res) => {
  try {
    // Check if database is ready
    await db.query('SELECT 1');
    res.status(200).json({
      success: true,
      ready: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Readiness check failed:', error);
    res.status(503).json({
      success: false,
      ready: false,
      timestamp: new Date().toISOString(),
    });
  }
});

// Liveness probe (for Kubernetes/Docker)
router.get('/live', (req, res) => {
  res.status(200).json({
    success: true,
    alive: true,
    timestamp: new Date().toISOString(),
  });
});

// System metrics
router.get('/metrics', (req, res) => {
  const metrics = {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    platform: process.platform,
    nodeVersion: process.version,
    pid: process.pid,
  };

  res.status(200).json({
    success: true,
    metrics,
  });
});

module.exports = router;

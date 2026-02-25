const express = require('express');
const router = express.Router();
const awsService = require('../services/aws-service');
const { requireAdmin } = require('../middleware/auth');
const db = require('../database/db');

/**
 * GET /api/monitoring/status
 * Get AWS connection status
 */
router.get('/api/monitoring/status', requireAdmin, async (req, res) => {
    const status = await awsService.verifyAWSConfig();
    res.json(status);
});

/**
 * GET /api/monitoring/stats
 * Get server load and activity stats
 */
router.get('/api/monitoring/stats', requireAdmin, async (req, res) => {
    try {
        const [load, logs] = await Promise.all([
            awsService.getServerLoad(),
            awsService.getLoginLogs()
        ]);

        // Also fetch from local DB for login history if AWS logs aren't available
        const localLoginResult = await db.query(`
            SELECT username, last_login, failed_login_attempts
            FROM users
            WHERE last_login IS NOT NULL
            ORDER BY last_login DESC
            LIMIT 10
        `);

        res.json({
            load,
            logs,
            localLogins: localLoginResult.rows
        });
    } catch (error) {
        console.error('Monitoring stats error:', error);
        res.status(500).json({ error: 'Failed to fetch monitoring stats' });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../database/db');
const awsService = require('../services/aws-service');
const { requireAdmin } = require('../middleware/auth');

/**
 * GET /api/system/logins
 * Pulls recent login activity including IPs
 */
router.get('/api/system/logins', requireAdmin, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                timestamp, ip_address, endpoint, 
                auth_success, failed_attempts_count,
                (SELECT username FROM users WHERE id = user_id) as username
            FROM security_logs
            WHERE endpoint LIKE '%login%'
            ORDER BY timestamp DESC
            LIMIT 100
        `);

        res.json({
            status: 'success',
            count: result.rows.length,
            data: result.rows
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

/**
 * GET /api/system/metrics
 * Pulls server health metrics (AWS CloudWatch)
 */
router.get('/api/system/metrics', requireAdmin, async (req, res) => {
    try {
        const load = await awsService.getServerLoad();
        res.json({
            status: 'success',
            metrics: {
                cpu_utilization: load,
                memory_usage: 'N/A', // CloudWatch would need custom metrics for RAM
                timestamp: new Date()
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

/**
 * GET /api/system/raw
 * Data dump of all security logs
 */
router.get('/api/system/raw', requireAdmin, async (req, res) => {
    try {
        const limit = req.query.limit || 50;
        const result = await db.query('SELECT * FROM security_logs ORDER BY timestamp DESC LIMIT $1', [limit]);
        res.json({
            status: 'success',
            data: result.rows
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;

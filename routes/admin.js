const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { requireAdmin } = require('../middleware/auth');

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 */
router.get('/api/admin/dashboard', requireAdmin, async (req, res) => {
    try {
        // Get counts
        const userCount = await db.query('SELECT COUNT(*) FROM users');
        const courseCount = await db.query('SELECT COUNT(*) FROM courses');
        const enrollmentCount = await db.query('SELECT COUNT(*) FROM enrollments');
        const commentCount = await db.query('SELECT COUNT(*) FROM comments');

        // Get recent security events
        const recentLogs = await db.query(`
      SELECT * FROM security_logs 
      WHERE flagged_for_review = true 
         OR xss_patterns_detected = true 
         OR sql_injection_patterns_detected = true
         OR directory_traversal_detected = true
      ORDER BY timestamp DESC 
      LIMIT 10
    `);

        res.json({
            statistics: {
                users: parseInt(userCount.rows[0].count),
                courses: parseInt(courseCount.rows[0].count),
                enrollments: parseInt(enrollmentCount.rows[0].count),
                comments: parseInt(commentCount.rows[0].count)
            },
            recentSecurityEvents: recentLogs.rows
        });

    } catch (error) {
        console.error('Admin dashboard error:', error);
        res.status(500).json({ error: 'Failed to load admin dashboard' });
    }
});

/**
 * GET /api/admin/users
 * Get all users
 */
router.get('/api/admin/users', requireAdmin, async (req, res) => {
    try {
        const result = await db.query(`
      SELECT id, username, email, role, created_at, last_login, failed_login_attempts, account_locked
      FROM users
      ORDER BY created_at DESC
    `);

        res.json({ users: result.rows });

    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

/**
 * GET /api/admin/logs
 * Get security logs with filtering
 */
router.get('/api/admin/logs', requireAdmin, async (req, res) => {
    try {
        const { limit = 50, flagged_only = false } = req.query;

        let query = 'SELECT * FROM security_logs';
        const params = [];

        if (flagged_only === 'true') {
            query += ` WHERE flagged_for_review = true 
                    OR xss_patterns_detected = true 
                    OR sql_injection_patterns_detected = true
                    OR directory_traversal_detected = true`;
        }

        query += ' ORDER BY timestamp DESC LIMIT $1';
        params.push(parseInt(limit));

        const result = await db.query(query, params);

        res.json({ logs: result.rows });

    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { requireAuth } = require('../middleware/auth');

/**
 * GET /api/dashboard
 * Get student dashboard data
 */
router.get('/api/dashboard', requireAuth, async (req, res) => {
    try {
        const userId = req.session.user.id;

        // Get enrolled courses
        const enrollments = await db.query(`
      SELECT e.id, e.enrolled_at, e.progress, c.*
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.user_id = $1
      ORDER BY e.enrolled_at DESC
    `, [userId]);

        res.json({
            user: req.session.user,
            enrollments: enrollments.rows
        });

    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ error: 'Failed to load dashboard' });
    }
});

/**
 * POST /api/enroll
 * Enroll in a course
 */
router.post('/api/enroll', requireAuth, async (req, res) => {
    try {
        const userId = req.session.user.id;
        const { course_id } = req.body;

        if (!course_id) {
            return res.status(400).json({ error: 'Course ID required' });
        }

        // Check if course exists
        const courseCheck = await db.query(
            'SELECT id FROM courses WHERE id = $1',
            [course_id]
        );

        if (courseCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Check if already enrolled
        const enrollmentCheck = await db.query(
            'SELECT id FROM enrollments WHERE user_id = $1 AND course_id = $2',
            [userId, course_id]
        );

        if (enrollmentCheck.rows.length > 0) {
            return res.status(400).json({ error: 'Already enrolled in this course' });
        }

        // Create enrollment
        const result = await db.query(
            'INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2) RETURNING *',
            [userId, course_id]
        );

        res.status(201).json({
            message: 'Enrollment successful',
            enrollment: result.rows[0]
        });

    } catch (error) {
        console.error('Enrollment error:', error);
        res.status(500).json({ error: 'Enrollment failed' });
    }
});

/**
 * GET /api/comments
 * Get comments for a course
 */
router.get('/api/comments', async (req, res) => {
    try {
        const { course_id } = req.query;

        if (!course_id) {
            return res.status(400).json({ error: 'Course ID required' });
        }

        const result = await db.query(`
      SELECT c.id, c.content, c.created_at, u.username
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.course_id = $1
      ORDER BY c.created_at DESC
    `, [course_id]);

        res.json({ comments: result.rows });

    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

/**
 * POST /api/comments
 * Add a comment to a course
 */
router.post('/api/comments', requireAuth, async (req, res) => {
    try {
        const userId = req.session.user.id;
        const { course_id, content } = req.body;

        if (!course_id || !content) {
            return res.status(400).json({ error: 'Course ID and content required' });
        }

        // Simple escaping for safety (basic protection)
        const sanitizedContent = content.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        const result = await db.query(
            'INSERT INTO comments (user_id, course_id, content) VALUES ($1, $2, $3) RETURNING *',
            [userId, course_id, sanitizedContent]
        );

        res.status(201).json({
            message: 'Comment posted',
            comment: result.rows[0]
        });

    } catch (error) {
        console.error('Comment error:', error);
        res.status(500).json({ error: 'Failed to post comment' });
    }
});

module.exports = router;

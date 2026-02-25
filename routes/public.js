const express = require('express');
const router = express.Router();
const db = require('../database/db');

/**
 * GET /api/courses
 * Get all courses with optional filtering
 */
router.get('/api/courses', async (req, res) => {
    try {
        const { category, level, page = 1, limit = 12 } = req.query;

        let query = 'SELECT * FROM courses WHERE 1=1';
        const params = [];
        let paramCount = 0;

        if (category) {
            paramCount++;
            query += ` AND category = $${paramCount}`;
            params.push(category);
        }

        if (level) {
            paramCount++;
            query += ` AND level = $${paramCount}`;
            params.push(level);
        }

        query += ' ORDER BY created_at DESC';

        // Pagination
        const offset = (page - 1) * limit;
        paramCount++;
        query += ` LIMIT $${paramCount}`;
        params.push(limit);

        paramCount++;
        query += ` OFFSET $${paramCount}`;
        params.push(offset);

        const result = await db.query(query, params);

        res.json({
            courses: result.rows,
            page: parseInt(page),
            limit: parseInt(limit)
        });

    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
});

/**
 * GET /api/courses/featured
 * Get featured courses for landing page
 */
router.get('/api/courses/featured', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM courses WHERE featured = true ORDER BY created_at DESC LIMIT 6'
        );

        res.json({ courses: result.rows });

    } catch (error) {
        console.error('Error fetching featured courses:', error);
        res.status(500).json({ error: 'Failed to fetch featured courses' });
    }
});

/**
 * GET /api/courses/:id
 * Get course by ID with topics
 */
router.get('/api/courses/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Use parameterized query to prevent SQL injection
        const courseQuery = 'SELECT * FROM courses WHERE id = $1';
        const courseResult = await db.query(courseQuery, [id]);

        if (courseResult.rows.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const course = courseResult.rows[0];

        // Fetch course topics
        const topicsQuery = `
            SELECT section_title, topic_title, duration, order_index 
            FROM course_topics 
            WHERE course_id = $1 
            ORDER BY order_index ASC
        `;
        const topicsResult = await db.query(topicsQuery, [id]);
        const topics = topicsResult.rows;

        // Parse JSON fields
        if (course.prerequisites && typeof course.prerequisites === 'string') {
            try {
                course.prerequisites = JSON.parse(course.prerequisites);
            } catch (e) {
                console.log('Error parsing prerequisites:', e);
            }
        }

        if (course.learning_outcomes && typeof course.learning_outcomes === 'string') {
            try {
                course.learning_outcomes = JSON.parse(course.learning_outcomes);
            } catch (e) {
                console.log('Error parsing learning_outcomes:', e);
            }
        }

        res.json({
            course,
            topics: topics || []
        });

    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ error: 'Failed to fetch course' });
    }
});

/**
 * GET /api/search
 * Search courses by keyword
 */
router.get('/api/search', async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({ error: 'Search query required' });
        }

        // Use parameterized query to prevent SQL injection
        const query = 'SELECT * FROM courses WHERE title ILIKE $1 OR description ILIKE $1';
        const searchPattern = `%${q}%`;
        const result = await db.query(query, [searchPattern]);

        res.json({
            query: q,
            results: result.rows,
            count: result.rows.length
        });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Search failed' });
    }
});

module.exports = router;

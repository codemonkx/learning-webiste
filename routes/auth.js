const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../database/db');

/**
 * POST /register
 * Register a new user
 */
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Basic validation
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await db.query(
            'SELECT id FROM users WHERE username = $1 OR email = $2',
            [username, email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Insert user
        const result = await db.query(
            'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role',
            [username, email, passwordHash, 'student']
        );

        const user = result.rows[0];

        res.status(201).json({
            message: 'Registration successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

/**
 * POST /login
 * Authenticate user (student login)
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        // Get user from database
        const result = await db.query(
            'SELECT id, username, email, password_hash, role, failed_login_attempts, account_locked FROM users WHERE username = $1',
            [username]
        );

        if (result.rows.length === 0) {
            console.log('DEBUG: No user found in DB for:', username);
            // Update log entry with failed auth
            if (req.logEntry) {
                req.logEntry.authSuccess = false;
                req.logEntry.failedAttempts = 1;
            }
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];
        console.log('DEBUG: Login attempt for:', username);
        console.log('DEBUG: User found:', user ? user.username : 'No user');
        console.log('DEBUG: Stored hash:', user ? user.password_hash : 'No hash');
        console.log('DEBUG: Input password:', password);

        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        console.log('DEBUG: Password match result:', passwordMatch);

        if (!passwordMatch) {
            // Increment failed attempts
            const newFailedAttempts = user.failed_login_attempts + 1;
            await db.query(
                'UPDATE users SET failed_login_attempts = $1 WHERE id = $2',
                [newFailedAttempts, user.id]
            );

            // Update log entry
            if (req.logEntry) {
                req.logEntry.authSuccess = false;
                req.logEntry.failedAttempts = newFailedAttempts;
            }

            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Successful login - reset failed attempts
        await db.query(
            'UPDATE users SET failed_login_attempts = 0, last_login = CURRENT_TIMESTAMP WHERE id = $1',
            [user.id]
        );

        // Create session
        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        };

        // Update log entry
        if (req.logEntry) {
            req.logEntry.authSuccess = true;
            req.logEntry.failedAttempts = 0;
        }

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

/**
 * POST /admin/login
 * Authenticate admin user (separate endpoint for admin)
 */
router.post('/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        // Get admin user from database
        const result = await db.query(
            'SELECT id, username, email, password_hash, role, failed_login_attempts FROM users WHERE username = $1 AND role = $2',
            [username, 'admin']
        );

        if (result.rows.length === 0) {
            if (req.logEntry) {
                req.logEntry.auth_success = false;
                req.logEntry.failed_attempts_count = 1;
            }
            return res.status(401).json({ error: 'Invalid admin credentials' });
        }

        const user = result.rows[0];

        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            const newFailedAttempts = user.failed_login_attempts + 1;
            await db.query(
                'UPDATE users SET failed_login_attempts = $1 WHERE id = $2',
                [newFailedAttempts, user.id]
            );

            if (req.logEntry) {
                req.logEntry.auth_success = false;
                req.logEntry.failed_attempts_count = newFailedAttempts;
            }

            return res.status(401).json({ error: 'Invalid admin credentials' });
        }

        // Successful admin login
        await db.query(
            'UPDATE users SET failed_login_attempts = 0, last_login = CURRENT_TIMESTAMP WHERE id = $1',
            [user.id]
        );

        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        };

        if (req.logEntry) {
            req.logEntry.auth_success = true;
            req.logEntry.failed_attempts_count = 0;
        }

        res.json({
            message: 'Admin login successful',
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

/**
 * GET /api/auth/status
 * Check authentication status
 */
router.get('/api/auth/status', (req, res) => {
    if (req.session && req.session.user) {
        res.json({
            authenticated: true,
            user: {
                id: req.session.user.id,
                username: req.session.user.username,
                email: req.session.user.email,
                role: req.session.user.role
            }
        });
    } else {
        res.json({
            authenticated: false
        });
    }
});

/**
 * POST /logout
 * Logout user
 */
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ message: 'Logout successful' });
    });
});

module.exports = router;

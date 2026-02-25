require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const helmet = require('helmet');
const db = require('./database/db');

// Import routes
const authRoutes = require('./routes/auth');
const publicRoutes = require('./routes/public');
const studentRoutes = require('./routes/student');
const adminRoutes = require('./routes/admin');
const monitoringRoutes = require('./routes/monitoring');
const systemApi = require('./routes/system-api');
const securityLogger = require('./middleware/securityLogger');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Serve static files (Efficiently)
app.use(express.static(path.join(__dirname, 'public')));

// 2. Security Logging
app.use(securityLogger);

// 3. Security Middleware (Production Ready)
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "script-src": ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            "font-src": ["'self'", "https://fonts.gstatic.com"],
            "img-src": ["'self'", "data:", "https://images.unsplash.com"],
        },
    },
}));

// 4. Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 5. Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key_change_this',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    }
}));

// API Routes
app.use('/', authRoutes);
app.use('/', publicRoutes);
app.use('/', studentRoutes);
app.use('/', adminRoutes);
app.use('/', monitoringRoutes);
app.use('/', systemApi);

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/courses', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'courses.html'));
});

app.get('/courses/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'course-detail.html'));
});

app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'search.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/admin/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin-login.html'));
});

app.get('/admin/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin-dashboard.html'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║   LearnHub - Online Learning Portal                     ║
╚═══════════════════════════════════════════════════════════╝

✓ Server running on port ${PORT}
✓ Environment: ${process.env.NODE_ENV || 'development'}

Access the portal at: http://localhost:${PORT}
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, closing server...');
    db.pool.end(() => {
        console.log('Database pool closed');
        process.exit(0);
    });
});

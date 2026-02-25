const db = require('../database/db');
const { v4: uuidv4 } = require('uuid');

/**
 * Security Logger Middleware
 * Captures request details and persists them to the security_logs table
 */
async function securityLogger(req, res, next) {
    // Generate a unique request ID
    const requestId = uuidv4();
    req.requestId = requestId;

    // Capture the original end function to log after response is sent
    const originalEnd = res.end;
    const startTime = Date.now();

    // Attach a log entry object to the request for other routes to populate
    req.logEntry = {
        requestId,
        ip: req.ip || req.connection.remoteAddress,
        endpoint: req.originalUrl || req.url,
        method: req.method,
        userAgent: req.get('User-Agent'),
        referer: req.get('Referer'),
        authSuccess: null,
        failedAttempts: null
    };

    res.end = async function (chunk, encoding) {
        res.end = originalEnd;
        res.end(chunk, encoding);

        // Calculate response time
        const responseTimeMs = Date.now() - startTime;

        try {
            await db.query(`
                INSERT INTO security_logs (
                    request_id, ip_address, endpoint, http_method, 
                    user_id, user_agent, referer, response_status, 
                    response_time_ms, auth_success, failed_attempts_count
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            `, [
                req.logEntry.requestId,
                req.logEntry.ip,
                req.logEntry.endpoint,
                req.logEntry.method,
                req.session && req.session.user ? req.session.user.id : null,
                req.logEntry.userAgent,
                req.logEntry.referer,
                res.statusCode,
                responseTimeMs,
                req.logEntry.authSuccess,
                req.logEntry.failedAttempts
            ]);
        } catch (error) {
            console.error('Failed to save security log:', error);
        }
    };

    next();
}

module.exports = securityLogger;

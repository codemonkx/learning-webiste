// In-memory request frequency tracking
// Maps IP addresses to arrays of timestamps

const requestTracker = new Map();

// Clean up old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;

    for (const [ip, timestamps] of requestTracker.entries()) {
        // Remove timestamps older than 1 hour
        const recentTimestamps = timestamps.filter(ts => ts > oneHourAgo);

        if (recentTimestamps.length === 0) {
            requestTracker.delete(ip);
        } else {
            requestTracker.set(ip, recentTimestamps);
        }
    }
}, 5 * 60 * 1000);

/**
 * Track a request from an IP address
 * @param {string} ip - IP address
 */
function trackRequest(ip) {
    const now = Date.now();

    if (!requestTracker.has(ip)) {
        requestTracker.set(ip, []);
    }

    requestTracker.get(ip).push(now);
}

/**
 * Get request frequency for an IP in the last N minutes
 * @param {string} ip - IP address
 * @param {number} minutes - Time window in minutes (default: 1)
 * @returns {number} Number of requests in the time window
 */
function getRequestFrequency(ip, minutes = 1) {
    if (!requestTracker.has(ip)) {
        return 0;
    }

    const now = Date.now();
    const windowStart = now - (minutes * 60 * 1000);
    const timestamps = requestTracker.get(ip);

    return timestamps.filter(ts => ts >= windowStart).length;
}

/**
 * Get time since last request from an IP
 * @param {string} ip - IP address
 * @returns {number|null} Milliseconds since last request, or null if no previous request
 */
function getTimeSinceLastRequest(ip) {
    if (!requestTracker.has(ip)) {
        return null;
    }

    const timestamps = requestTracker.get(ip);
    if (timestamps.length < 2) {
        return null;
    }

    const sortedTimestamps = timestamps.sort((a, b) => b - a);
    return sortedTimestamps[0] - sortedTimestamps[1];
}

/**
 * Get statistics for an IP
 * @param {string} ip - IP address
 * @returns {object} Statistics object
 */
function getIPStatistics(ip) {
    return {
        requests_per_minute: getRequestFrequency(ip, 1),
        requests_per_hour: getRequestFrequency(ip, 60),
        time_since_last_request_ms: getTimeSinceLastRequest(ip),
        total_tracked_requests: requestTracker.has(ip) ? requestTracker.get(ip).length : 0
    };
}

module.exports = {
    trackRequest,
    getRequestFrequency,
    getTimeSinceLastRequest,
    getIPStatistics
};

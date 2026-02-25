// Client-side JavaScript utilities

// API helper function
async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Show alert message
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;

    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(alertDiv, container.firstChild);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Get query parameter
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Check if user is logged in (basic check)
function isLoggedIn() {
    // This is a simple client-side check
    // Real authentication is handled server-side
    return document.cookie.includes('connect.sid');
}

// Logout function
async function logout() {
    try {
        await apiCall('/logout', { method: 'POST' });
        window.location.href = '/';
    } catch (error) {
        showAlert('Logout failed', 'error');
    }
}

// Export for use in other scripts
window.utils = {
    apiCall,
    showAlert,
    formatDate,
    getQueryParam,
    isLoggedIn,
    logout
};

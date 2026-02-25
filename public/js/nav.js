// Dynamic Navigation Component
// This script updates the navigation bar based on user authentication status

(function () {
    'use strict';

    // Check if user is authenticated by making an API call
    async function checkAuthStatus() {
        try {
            const response = await fetch('/api/auth/status');
            if (response.ok) {
                const data = await response.json();
                return data.authenticated ? data.user : null;
            }
            return null;
        } catch (error) {
            console.error('Error checking auth status:', error);
            return null;
        }
    }

    // Update navbar based on authentication status
    function updateNavbar(user) {
        const navbarActions = document.querySelector('.navbar-actions');
        if (!navbarActions) return;

        if (user) {
            // User is logged in - show Logout only
            navbarActions.innerHTML = `
                <a href="#" onclick="utils.logout(); return false;" class="btn btn-primary btn-small">Logout</a>
            `;
        } else {
            // User is not logged in - show Sign In and Get Started
            navbarActions.innerHTML = `
                <a href="/login.html" class="btn btn-secondary btn-small">Sign In</a>
                <a href="/register.html" class="btn btn-primary btn-small">Get Started</a>
            `;
        }
    }

    // Initialize navigation on page load
    async function initNavigation() {
        const user = await checkAuthStatus();
        updateNavbar(user);
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavigation);
    } else {
        initNavigation();
    }
})();

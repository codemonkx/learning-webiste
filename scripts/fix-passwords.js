/**
 * Fix User Passwords
 * This script updates the user passwords in the database with proper bcrypt hashes
 * Run this after database initialization to fix the fake password hashes from seed.sql
 */

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const bcrypt = require('bcrypt');
const db = require('../database/db');

async function fixUserPasswords() {
    try {
        console.log('🔐 Fixing user passwords...\n');

        // Define the correct users and passwords
        const users = [
            { username: 'admin', password: 'admin123', role: 'admin', email: 'admin@learningportal.com' },
            { username: 'student', password: 'password123', role: 'student', email: 'student@example.com' }
        ];

        for (const user of users) {
            // Check if user exists
            const existing = await db.query('SELECT id, username FROM users WHERE username = $1', [user.username]);

            if (existing.rows.length > 0) {
                // User exists, update password
                const passwordHash = await bcrypt.hash(user.password, 10);
                await db.query(
                    'UPDATE users SET password_hash = $1 WHERE username = $2',
                    [passwordHash, user.username]
                );
                console.log(`✅ Updated password for existing user: ${user.username}`);
            } else {
                // User doesn't exist, create it
                const passwordHash = await bcrypt.hash(user.password, 10);
                await db.query(
                    'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4)',
                    [user.username, user.email, passwordHash, user.role]
                );
                console.log(`✅ Created new user: ${user.username}`);
            }
        }

        console.log('\n✨ User passwords fixed successfully!');
        console.log('\nYou can now login with:');
        console.log('  Admin: admin / admin123');
        console.log('  Student: student / password123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error fixing passwords:', error);
        process.exit(1);
    }
}

fixUserPasswords();

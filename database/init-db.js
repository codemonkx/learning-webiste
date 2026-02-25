const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'learning_portal',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres'
});

async function runSqlFile(filename) {
    const filePath = path.join(__dirname, filename);
    console.log(`📄 Reading ${filename}...`);
    const sql = fs.readFileSync(filePath, 'utf8');

    console.log(`▶️ Executing ${filename}...`);
    try {
        await pool.query(sql);
        console.log(`✅ Successfully executed ${filename}`);
    } catch (err) {
        console.error(`❌ Error executing ${filename}:`, err.message);
        throw err;
    }
}

async function seedPremiumCourses() {
    console.log('🌱 Seeding premium courses...');

    const courses = [
        {
            title: 'Machine Learning A-Z: AI, Python & R + ChatGPT Prize',
            description: 'Learn to create Machine Learning Algorithms in Python and R from two Data Science experts. Includes code templates.',
            category: 'Data Science',
            level: 'Advanced',
            featured: true
        },
        {
            title: 'The Full Stack Web Development Bootcamp 2026',
            description: 'Become a full-stack web developer with just one course. HTML, CSS, Javascript, Node, React, MongoDB, Web3 and DApps.',
            category: 'Programming',
            level: 'Intermediate',
            featured: true
        },
        {
            title: 'DevOps & Cloud Computing: The Complete Guide',
            description: 'Master DevOps with Docker, Kubernetes, Jenkins, Terraform, Ansible, Chef, Puppet, and AWS Cloud.',
            category: 'Programming',
            level: 'Advanced',
            featured: true
        },
        {
            title: 'Complete Cyber Security Course: Network Security',
            description: 'Volume 1 : Become a Cyber Security Specialist, Learn How to Stop Hackers, Prevent Hacking, Learn IT Security & INFOSEC.',
            category: 'Programming',
            level: 'Beginner',
            featured: true
        },
        {
            title: 'iOS & Swift - The Complete iOS App Development Bootcamp',
            description: 'From Beginner to iOS App Developer with Just One Course! Fully Updated with a Comprehensive Module Dedicated to SwiftUI!',
            category: 'Programming',
            level: 'Intermediate',
            featured: false
        },
        {
            title: 'Modern React with Redux',
            description: 'Master React and Redux with React Router, Webpack, and Create-React-App. Includes Hooks!',
            category: 'Programming',
            level: 'Intermediate',
            featured: false
        },
        {
            title: 'The Ultimate MySQL Bootcamp: Go from SQL Beginner to Expert',
            description: 'Become an SQL Master! Join the highest rated SQL course on Udemy! Learn to write complex queries and build databases.',
            category: 'Data Science',
            level: 'Beginner',
            featured: false
        },
        {
            title: 'UX/UI Design Specialization',
            description: 'Design high-impact user experiences. Research, design, and prototype effective, visually-driven websites and apps.',
            category: 'Design',
            level: 'Intermediate',
            featured: true
        }
    ];

    for (const course of courses) {
        // Check if course already exists to avoid duplicates
        const check = await pool.query('SELECT id FROM courses WHERE title = $1', [course.title]);

        if (check.rows.length === 0) {
            await pool.query(
                'INSERT INTO courses (title, description, category, level, featured) VALUES ($1, $2, $3, $4, $5)',
                [course.title, course.description, course.category, course.level, course.featured]
            );
            console.log(`✅ Added course: ${course.title}`);
        } else {
            console.log(`⚠️  Skipped (exists): ${course.title}`);
        }
    }
}

async function init() {
    try {
        console.log('🔌 Connecting to database...');
        // Test connection
        await pool.query('SELECT NOW()');
        console.log('✅ Connected to database');

        // Run Schema
        await runSqlFile('schema.sql');

        // Run Migration for Course Details
        await runSqlFile('migration-add-course-details.sql');

        // Run Rich Seed with Details
        await runSqlFile('seed-with-details.sql');

        // Note: skip basic seed.sql and manual seedPremiumCourses as seed-with-details covers it

        console.log('\n✨ Database initialization complete!');
        process.exit(0);
    } catch (error) {
        console.error('\n🛑 Database initialization failed:', error);
        process.exit(1);
    }
}

init();

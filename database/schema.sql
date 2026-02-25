-- Mini Online Learning Portal Database Schema
-- PostgreSQL Database Schema for Security Testing Environment

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS security_logs CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'student', -- 'student' or 'admin'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    failed_login_attempts INT DEFAULT 0,
    account_locked BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Courses Table
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    level VARCHAR(20), -- 'beginner', 'intermediate', 'advanced'
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_level ON courses(level);
CREATE INDEX idx_courses_featured ON courses(featured);

-- Enrollments Table
CREATE TABLE enrollments (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    progress INT DEFAULT 0, -- 0-100
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE(user_id, course_id)
);

CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);

-- Comments Table
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE INDEX idx_comments_course ON comments(course_id);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_comments_created ON comments(created_at);

-- Security Logs Table
CREATE TABLE security_logs (
    id SERIAL PRIMARY KEY,
    request_id VARCHAR(36) UNIQUE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45) NOT NULL, -- IPv4 or IPv6
    endpoint VARCHAR(255) NOT NULL,
    http_method VARCHAR(10) NOT NULL,
    user_id INT, -- NULL for unauthenticated requests
    session_token VARCHAR(255),
    user_agent TEXT,
    referer TEXT,
    request_payload JSONB, -- Store as JSON for flexibility
    query_params JSONB,
    path_params JSONB,
    response_status INT,
    response_time_ms INT,
    auth_success BOOLEAN,
    failed_attempts_count INT,
    xss_patterns_detected BOOLEAN DEFAULT FALSE,
    sql_injection_patterns_detected BOOLEAN DEFAULT FALSE,
    directory_traversal_detected BOOLEAN DEFAULT FALSE,
    request_frequency_per_minute INT,
    anomaly_score FLOAT, -- Populated by ML model
    threat_classification VARCHAR(50), -- 'normal', 'ddos', 'brute_force', 'sqli', 'xss', etc.
    flagged_for_review BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_security_logs_timestamp ON security_logs(timestamp);
CREATE INDEX idx_security_logs_ip ON security_logs(ip_address);
CREATE INDEX idx_security_logs_endpoint ON security_logs(endpoint);
CREATE INDEX idx_security_logs_user ON security_logs(user_id);
CREATE INDEX idx_security_logs_flagged ON security_logs(flagged_for_review);
CREATE INDEX idx_security_logs_anomaly ON security_logs(anomaly_score);
CREATE INDEX idx_security_logs_request_id ON security_logs(request_id);

-- Success message
SELECT 'Database schema created successfully!' AS message;

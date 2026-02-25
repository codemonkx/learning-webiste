-- Migration: Add Course Details and Topics
-- This migration adds comprehensive course information fields

-- Add new columns to courses table
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS duration VARCHAR(50),
ADD COLUMN IF NOT EXISTS instructor_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS instructor_title VARCHAR(100),
ADD COLUMN IF NOT EXISTS instructor_bio TEXT,
ADD COLUMN IF NOT EXISTS prerequisites TEXT, -- JSON array
ADD COLUMN IF NOT EXISTS learning_outcomes TEXT, -- JSON array
ADD COLUMN IF NOT EXISTS student_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 4.5;

-- Create course_topics table for curriculum/syllabus
CREATE TABLE IF NOT EXISTS course_topics (
    id SERIAL PRIMARY KEY,
    course_id INT NOT NULL,
    section_title VARCHAR(200) NOT NULL,
    topic_title VARCHAR(200) NOT NULL,
    duration VARCHAR(50),
    order_index INT NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_course_topics_course ON course_topics(course_id);
CREATE INDEX IF NOT EXISTS idx_course_topics_order ON course_topics(course_id, order_index);

SELECT 'Migration completed: Course details and topics added successfully!' AS message;

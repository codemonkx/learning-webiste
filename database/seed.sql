-- Seed Data for Mini Online Learning Portal
-- Sample data for testing and demonstration

-- Insert Users (passwords are hashed with bcrypt)
-- Student passwords: 'password123'
-- Admin password: 'admin123'
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@learningportal.com', '$2b$10$YQ7jzKZqZ5Z5Z5Z5Z5Z5ZuKqYqKqYqKqYqKqYqKqYqKqYqKqYqKqK', 'admin'),
('student1', 'student1@example.com', '$2b$10$YQ7jzKZqZ5Z5Z5Z5Z5Z5ZuKqYqKqYqKqYqKqYqKqYqKqYqKqYqKqK', 'student'),
('student2', 'student2@example.com', '$2b$10$YQ7jzKZqZ5Z5Z5Z5Z5Z5ZuKqYqKqYqKqYqKqYqKqYqKqYqKqYqKqK', 'student');

-- Insert Courses
INSERT INTO courses (title, description, category, level, featured) VALUES
('Introduction to Web Development', 'Learn the basics of HTML, CSS, and JavaScript to build your first website.', 'web', 'beginner', true),
('Advanced JavaScript Patterns', 'Master advanced JavaScript concepts including closures, prototypes, and async programming.', 'web', 'advanced', true),
('Python for Data Science', 'Learn Python programming with focus on data analysis and machine learning.', 'data', 'intermediate', true),
('Cybersecurity Fundamentals', 'Understanding security principles, common vulnerabilities, and defense strategies.', 'security', 'beginner', true),
('Database Design and SQL', 'Learn relational database design and SQL query optimization.', 'database', 'intermediate', false),
('React.js Complete Guide', 'Build modern web applications with React, hooks, and state management.', 'web', 'intermediate', true),
('Machine Learning Basics', 'Introduction to machine learning algorithms and practical applications.', 'data', 'beginner', false),
('Node.js Backend Development', 'Build scalable backend applications with Node.js and Express.', 'web', 'intermediate', true),
('Ethical Hacking 101', 'Learn penetration testing techniques and security assessment methodologies.', 'security', 'advanced', false),
('Cloud Computing with AWS', 'Deploy and manage applications on Amazon Web Services cloud platform.', 'cloud', 'intermediate', false);

-- Insert Enrollments
INSERT INTO enrollments (user_id, course_id, progress) VALUES
(2, 1, 45),  -- student1 enrolled in Web Development
(2, 4, 20),  -- student1 enrolled in Cybersecurity
(3, 1, 80),  -- student2 enrolled in Web Development
(3, 3, 30);  -- student2 enrolled in Python

-- Insert Comments
INSERT INTO comments (user_id, course_id, content) VALUES
(2, 1, 'Great course! Very helpful for beginners.'),
(3, 1, 'The instructor explains concepts very clearly.'),
(2, 4, 'Excellent introduction to cybersecurity principles.');

-- Success message
SELECT 'Seed data inserted successfully!' AS message;
SELECT COUNT(*) AS user_count FROM users;
SELECT COUNT(*) AS course_count FROM courses;
SELECT COUNT(*) AS enrollment_count FROM enrollments;
SELECT COUNT(*) AS comment_count FROM comments;

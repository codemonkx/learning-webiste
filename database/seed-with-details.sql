-- Seed Data for Mini Online Learning Portal
-- Sample data for testing and demonstration

-- Insert Users (passwords are hashed with bcrypt)
-- Student passwords: 'password123'
-- Admin password: 'admin123'
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@learningportal.com', '$2b$10$YQ7jzKZqZ5Z5Z5Z5Z5Z5ZuKqYqKqYqKqYqKqYqKqYqKqYqKqYqKqK', 'admin'),
('student1', 'student1@example.com', '$2b$10$YQ7jzKZqZ5Z5Z5Z5Z5Z5ZuKqYqKqYqKqYqKqYqKqYqKqYqKqYqKqK', 'student'),
('student2', 'student2@example.com', '$2b$10$YQ7jzKZqZ5Z5Z5Z5Z5Z5ZuKqYqKqYqKqYqKqYqKqYqKqYqKqYqKqK', 'student');

-- Insert Courses with detailed information
INSERT INTO courses (title, description, category, level, featured, duration, instructor_name, instructor_title, instructor_bio, prerequisites, learning_outcomes, student_count, rating) VALUES
(
  'Introduction to Web Development', 
  'Learn the basics of HTML, CSS, and JavaScript to build your first website. This comprehensive course covers everything from basic HTML tags to responsive design and interactive JavaScript.', 
  'web', 
  'beginner', 
  true,
  '8 weeks',
  'Sarah Johnson',
  'Senior Web Developer',
  'Sarah has over 10 years of experience in web development and has taught thousands of students worldwide. She specializes in making complex concepts easy to understand.',
  '["Basic computer skills", "Text editor installed", "Web browser"]',
  '["Build responsive websites from scratch", "Understand HTML5 semantic elements", "Style websites with modern CSS3", "Create interactive features with JavaScript", "Deploy websites to the internet"]',
  4523,
  4.8
),
(
  'Advanced JavaScript Patterns', 
  'Master advanced JavaScript concepts including closures, prototypes, and async programming. Deep dive into design patterns and best practices used by professional developers.', 
  'web', 
  'advanced', 
  true,
  '6 weeks',
  'Michael Chen',
  'JavaScript Architect',
  'Michael is a JavaScript expert with 15 years of experience building large-scale applications. He contributes to open-source projects and speaks at international conferences.',
  '["Solid understanding of JavaScript basics", "Experience with ES6+ features", "Familiarity with Node.js"]',
  '["Master closures and scope", "Understand prototypal inheritance", "Implement design patterns", "Write asynchronous code effectively", "Optimize JavaScript performance"]',
  3210,
  4.9
),
(
  'Python for Data Science', 
  'Learn Python programming with focus on data analysis and machine learning. Work with real datasets and build predictive models using popular libraries like Pandas, NumPy, and Scikit-learn.', 
  'data', 
  'intermediate', 
  true,
  '10 weeks',
  'Emily Rodriguez',
  'Data Scientist',
  'Emily holds a PhD in Computer Science and has worked as a data scientist at Fortune 500 companies. She loves teaching and making data science accessible to everyone.',
  '["Basic programming knowledge", "High school mathematics", "Python installed on your computer"]',
  '["Analyze data with Pandas and NumPy", "Create visualizations with Matplotlib", "Build machine learning models", "Clean and preprocess data", "Apply statistical analysis techniques"]',
  5678,
  4.7
),
(
  'Cybersecurity Fundamentals', 
  'Understanding security principles, common vulnerabilities, and defense strategies. Learn how to protect systems and data from cyber threats through hands-on labs and real-world scenarios.', 
  'security', 
  'beginner', 
  true,
  '7 weeks',
  'David Kim',
  'Security Consultant',
  'David is a certified ethical hacker (CEH) and security consultant with experience in penetration testing and security auditing for government and private sector clients.',
  '["Basic networking knowledge", "Understanding of operating systems", "Interest in cybersecurity"]',
  '["Identify common security vulnerabilities", "Implement security best practices", "Understand encryption and cryptography", "Perform basic security assessments", "Protect against common attacks"]',
  2890,
  4.6
),
(
  'Database Design and SQL', 
  'Learn relational database design and SQL query optimization. Master the art of designing efficient databases and writing complex queries for data retrieval and manipulation.', 
  'database', 
  'intermediate', 
  false,
  '6 weeks',
  'Jessica Lee',
  'Database Administrator',
  'Jessica has 12 years of experience managing enterprise databases. She specializes in database optimization and has helped companies improve their query performance by up to 10x.',
  '["Basic SQL knowledge", "Understanding of data structures", "Database software installed (PostgreSQL or MySQL)"]',
  '["Design normalized database schemas", "Write complex SQL queries", "Optimize query performance", "Understand indexing strategies", "Implement database security"]',
  1567,
  4.5
),
(
  'React.js Complete Guide', 
  'Build modern web applications with React, hooks, and state management. Learn to create dynamic, high-performance user interfaces using the most popular JavaScript library.', 
  'web', 
  'intermediate', 
  true,
  '9 weeks',
  'Alex Thompson',
  'Frontend Engineer',
  'Alex is a frontend engineer at a leading tech company and has built production React applications serving millions of users. He is passionate about modern web development.',
  '["JavaScript fundamentals", "HTML and CSS knowledge", "Understanding of ES6+ features", "Node.js and npm installed"]',
  '["Build React applications from scratch", "Master React Hooks", "Manage state with Context API and Redux", "Create reusable components", "Optimize React performance"]',
  6234,
  4.9
),
(
  'Machine Learning Basics', 
  'Introduction to machine learning algorithms and practical applications. Learn the fundamentals of ML and build your first predictive models using Python and popular ML libraries.', 
  'data', 
  'beginner', 
  false,
  '8 weeks',
  'Rachel Martinez',
  'ML Engineer',
  'Rachel is a machine learning engineer with a background in mathematics and computer science. She has deployed ML models in production and loves teaching beginners.',
  '["Basic Python programming", "High school mathematics (algebra, statistics)", "Curiosity about AI and ML"]',
  '["Understand ML fundamentals", "Build classification models", "Create regression models", "Evaluate model performance", "Apply ML to real-world problems"]',
  3456,
  4.6
),
(
  'Node.js Backend Development', 
  'Build scalable backend applications with Node.js and Express. Learn to create RESTful APIs, work with databases, implement authentication, and deploy production-ready applications.', 
  'web', 
  'intermediate', 
  true,
  '10 weeks',
  'James Wilson',
  'Backend Developer',
  'James has built backend systems for startups and enterprises. He specializes in Node.js and has contributed to several popular npm packages.',
  '["JavaScript proficiency", "Understanding of HTTP and REST", "Basic database knowledge", "Node.js installed"]',
  '["Build RESTful APIs with Express", "Implement authentication and authorization", "Work with MongoDB and PostgreSQL", "Handle file uploads and processing", "Deploy Node.js applications"]',
  4890,
  4.8
),
(
  'Ethical Hacking 101', 
  'Learn penetration testing techniques and security assessment methodologies. Discover how hackers think and learn to defend systems by understanding attack vectors.', 
  'security', 
  'advanced', 
  false,
  '12 weeks',
  'Sarah Johnson',
  'Penetration Tester',
  'Sarah is a certified penetration tester with experience conducting security assessments for Fortune 500 companies. She teaches ethical hacking to help build better defenses.',
  '["Cybersecurity fundamentals", "Linux command line proficiency", "Networking knowledge", "Programming basics"]',
  '["Perform penetration testing", "Use security testing tools", "Identify and exploit vulnerabilities", "Write security reports", "Understand legal and ethical boundaries"]',
  1234,
  4.7
),
(
  'Cloud Computing with AWS', 
  'Deploy and manage applications on Amazon Web Services cloud platform. Learn to leverage AWS services for building scalable, reliable, and cost-effective cloud solutions.', 
  'cloud', 
  'intermediate', 
  false,
  '8 weeks',
  'Michael Chen',
  'Cloud Architect',
  'Michael is an AWS certified solutions architect who has designed cloud infrastructure for companies of all sizes. He helps organizations migrate to the cloud successfully.',
  '["Basic Linux knowledge", "Understanding of networking", "Programming experience (any language)", "AWS account (free tier available)"]',
  '["Deploy applications on AWS", "Use EC2, S3, and RDS services", "Implement auto-scaling", "Set up cloud security", "Optimize cloud costs"]',
  2345,
  4.6
);

-- Insert Course Topics
INSERT INTO course_topics (course_id, section_title, topic_title, duration, order_index) VALUES
-- Course 1: Introduction to Web Development
(1, 'Getting Started', 'Introduction to Web Development', '30 min', 1),
(1, 'Getting Started', 'Setting Up Your Development Environment', '45 min', 2),
(1, 'HTML Fundamentals', 'HTML Basics and Structure', '1 hour', 3),
(1, 'HTML Fundamentals', 'Semantic HTML Elements', '1 hour', 4),
(1, 'HTML Fundamentals', 'Forms and Input Elements', '1.5 hours', 5),
(1, 'CSS Styling', 'CSS Selectors and Properties', '1 hour', 6),
(1, 'CSS Styling', 'Box Model and Layout', '1.5 hours', 7),
(1, 'CSS Styling', 'Flexbox and Grid', '2 hours', 8),
(1, 'CSS Styling', 'Responsive Design', '2 hours', 9),
(1, 'JavaScript Basics', 'Variables and Data Types', '1 hour', 10),
(1, 'JavaScript Basics', 'Functions and Control Flow', '1.5 hours', 11),
(1, 'JavaScript Basics', 'DOM Manipulation', '2 hours', 12),
(1, 'Final Project', 'Build Your Portfolio Website', '4 hours', 13),

-- Course 2: Advanced JavaScript Patterns
(2, 'Core Concepts', 'Execution Context and Scope', '1.5 hours', 1),
(2, 'Core Concepts', 'Closures Deep Dive', '2 hours', 2),
(2, 'Core Concepts', 'Prototypes and Inheritance', '2 hours', 3),
(2, 'Asynchronous JavaScript', 'Callbacks and Promises', '1.5 hours', 4),
(2, 'Asynchronous JavaScript', 'Async/Await', '1 hour', 5),
(2, 'Asynchronous JavaScript', 'Event Loop', '1.5 hours', 6),
(2, 'Design Patterns', 'Module Pattern', '1 hour', 7),
(2, 'Design Patterns', 'Observer Pattern', '1 hour', 8),
(2, 'Design Patterns', 'Factory and Singleton', '1.5 hours', 9),
(2, 'Performance', 'Memory Management', '1 hour', 10),
(2, 'Performance', 'Code Optimization', '2 hours', 11),

-- Course 3: Python for Data Science
(3, 'Python Basics', 'Python Fundamentals Review', '1 hour', 1),
(3, 'Python Basics', 'Data Structures in Python', '1.5 hours', 2),
(3, 'NumPy', 'NumPy Arrays and Operations', '2 hours', 3),
(3, 'NumPy', 'Array Manipulation', '1.5 hours', 4),
(3, 'Pandas', 'DataFrames and Series', '2 hours', 5),
(3, 'Pandas', 'Data Cleaning and Preprocessing', '2 hours', 6),
(3, 'Pandas', 'Data Aggregation and Grouping', '1.5 hours', 7),
(3, 'Visualization', 'Matplotlib Basics', '1.5 hours', 8),
(3, 'Visualization', 'Advanced Plotting', '2 hours', 9),
(3, 'Machine Learning', 'Introduction to Scikit-learn', '2 hours', 10),
(3, 'Machine Learning', 'Building Your First Model', '3 hours', 11),

-- Course 6: React.js Complete Guide
(6, 'React Fundamentals', 'Introduction to React', '1 hour', 1),
(6, 'React Fundamentals', 'JSX and Components', '1.5 hours', 2),
(6, 'React Fundamentals', 'Props and State', '2 hours', 3),
(6, 'React Hooks', 'useState and useEffect', '2 hours', 4),
(6, 'React Hooks', 'useContext and useReducer', '2 hours', 5),
(6, 'React Hooks', 'Custom Hooks', '1.5 hours', 6),
(6, 'State Management', 'Context API', '2 hours', 7),
(6, 'State Management', 'Redux Fundamentals', '2.5 hours', 8),
(6, 'Advanced Topics', 'React Router', '2 hours', 9),
(6, 'Advanced Topics', 'Performance Optimization', '2 hours', 10),
(6, 'Final Project', 'Build a Full-Stack App', '6 hours', 11);

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
SELECT COUNT(*) AS topic_count FROM course_topics;

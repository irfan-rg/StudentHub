-- ============================================================================
-- DATABASE SCHEMA & SQL QUERIES FOR AI-POWERED STUDENT HUB
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. DATABASE TABLES CREATION
-- ----------------------------------------------------------------------------

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    college VARCHAR(255),
    education_level VARCHAR(50),
    avatar TEXT,
    points INTEGER DEFAULT 0,
    level VARCHAR(50) DEFAULT 'Beginner',
    sessions_completed INTEGER DEFAULT 0,
    questions_answered INTEGER DEFAULT 0,
    questions_asked INTEGER DEFAULT 0,
    is_online BOOLEAN DEFAULT false,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Skills table
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User skills (many-to-many relationship)
CREATE TABLE user_skills (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE,
    can_teach BOOLEAN DEFAULT false,
    wants_to_learn BOOLEAN DEFAULT false,
    proficiency_level INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, skill_id)
);

-- Badges table
CREATE TABLE badges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(255),
    requirements JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User badges (many-to-many relationship)
CREATE TABLE user_badges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    badge_id INTEGER REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, badge_id)
);

-- Questions table
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    is_answered BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tags table
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Question tags (many-to-many relationship)
CREATE TABLE question_tags (
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (question_id, tag_id)
);

-- Answers table
CREATE TABLE answers (
    id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    is_accepted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    teacher_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    skill_id INTEGER REFERENCES skills(id),
    session_type VARCHAR(50), -- 'video', 'inperson', 'group'
    duration INTEGER, -- in minutes
    scheduled_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
    location VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Connections table
CREATE TABLE connections (
    id SERIAL PRIMARY KEY,
    requester_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    recipient_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(requester_id, recipient_id)
);

-- User settings table
CREATE TABLE user_settings (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(20) DEFAULT 'light',
    font_size VARCHAR(20) DEFAULT 'medium',
    compact_mode BOOLEAN DEFAULT false,
    notifications_enabled BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Votes table
CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    target_type VARCHAR(20) NOT NULL, -- 'question' or 'answer'
    target_id INTEGER NOT NULL,
    vote_type INTEGER NOT NULL, -- 1 for upvote, -1 for downvote
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, target_type, target_id)
);

-- Activity log table
CREATE TABLE activity_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(100) NOT NULL,
    description TEXT,
    target_type VARCHAR(50),
    target_id INTEGER,
    points_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 2. AUTHENTICATION QUERIES (AuthModal.tsx)
-- ----------------------------------------------------------------------------

-- User Registration
INSERT INTO users (name, email, password_hash, college, education_level)
VALUES ($1, $2, $3, $4, $5)
RETURNING id, name, email, college, education_level, points, level;

-- Add user skills during registration
INSERT INTO user_skills (user_id, skill_id, can_teach, wants_to_learn)
VALUES ($1, $2, $3, $4);

-- User Login
SELECT id, name, email, college, education_level, avatar, points, level, 
       sessions_completed, questions_answered, questions_asked
FROM users 
WHERE email = $1 AND password_hash = $2;

-- Update user online status
UPDATE users 
SET is_online = $1, last_active = CURRENT_TIMESTAMP 
WHERE id = $2;

-- ----------------------------------------------------------------------------
-- 3. DASHBOARD QUERIES (Dashboard.tsx)
-- ----------------------------------------------------------------------------

-- Get user stats
SELECT points, sessions_completed, questions_answered, 
       (SELECT COUNT(*) FROM user_badges WHERE user_id = $1) as badge_count
FROM users 
WHERE id = $1;

-- Get suggested connections (skill matching algorithm)
SELECT DISTINCT u.id, u.name, u.college, u.avatar, u.points, u.sessions_completed,
       ARRAY_AGG(DISTINCT s1.name) as skills_can_teach,
       COUNT(DISTINCT us1.skill_id) as common_skills
FROM users u
JOIN user_skills us1 ON u.id = us1.user_id AND us1.can_teach = true
JOIN user_skills us2 ON us1.skill_id = us2.skill_id AND us2.wants_to_learn = true
JOIN skills s1 ON us1.skill_id = s1.id
WHERE us2.user_id = $1 AND u.id != $1
GROUP BY u.id, u.name, u.college, u.avatar, u.points, u.sessions_completed
ORDER BY common_skills DESC, u.points DESC
LIMIT 5;

-- Get upcoming sessions
SELECT s.id, s.title, s.scheduled_at, s.session_type, s.status,
       CASE 
         WHEN s.teacher_id = $1 THEN u2.name 
         ELSE u1.name 
       END as partner_name
FROM sessions s
JOIN users u1 ON s.teacher_id = u1.id
JOIN users u2 ON s.student_id = u2.id
WHERE (s.teacher_id = $1 OR s.student_id = $1) 
  AND s.scheduled_at > CURRENT_TIMESTAMP
  AND s.status IN ('pending', 'confirmed')
ORDER BY s.scheduled_at ASC
LIMIT 5;

-- Get recent activity
SELECT activity_type, description, created_at
FROM activity_log
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT 10;

-- Create new session
INSERT INTO sessions (title, description, teacher_id, student_id, skill_id, 
                     session_type, duration, scheduled_at, location, notes)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
RETURNING id;

-- ----------------------------------------------------------------------------
-- 4. PROFILE QUERIES (Profile.tsx)
-- ----------------------------------------------------------------------------

-- Get complete user profile
SELECT u.*, 
       ARRAY_AGG(DISTINCT CASE WHEN us.can_teach = true THEN s.name END) as skills_can_teach,
       ARRAY_AGG(DISTINCT CASE WHEN us.wants_to_learn = true THEN s.name END) as skills_want_to_learn,
       ARRAY_AGG(DISTINCT b.name) as badges
FROM users u
LEFT JOIN user_skills us ON u.id = us.user_id
LEFT JOIN skills s ON us.skill_id = s.id
LEFT JOIN user_badges ub ON u.id = ub.user_id
LEFT JOIN badges b ON ub.badge_id = b.id
WHERE u.id = $1
GROUP BY u.id;

-- Update user profile
UPDATE users 
SET name = $1, college = $2, education_level = $3, avatar = $4, updated_at = CURRENT_TIMESTAMP
WHERE id = $5;

-- Add/Update user skills
INSERT INTO user_skills (user_id, skill_id, can_teach, wants_to_learn)
VALUES ($1, $2, $3, $4)
ON CONFLICT (user_id, skill_id) 
DO UPDATE SET can_teach = $3, wants_to_learn = $4;

-- Remove user skill
DELETE FROM user_skills 
WHERE user_id = $1 AND skill_id = $2;

-- Get learning progress (based on sessions and activity)
SELECT s.name as skill_name,
       COUNT(DISTINCT sess.id) as sessions_taken,
       COUNT(DISTINCT a.id) as questions_answered,
       CASE 
         WHEN COUNT(DISTINCT sess.id) >= 10 THEN 100
         ELSE COUNT(DISTINCT sess.id) * 10
       END as progress_percentage
FROM skills s
JOIN user_skills us ON s.id = us.skill_id AND us.wants_to_learn = true
LEFT JOIN sessions sess ON s.id = sess.skill_id AND sess.student_id = $1 AND sess.status = 'completed'
LEFT JOIN answers a ON EXISTS (
    SELECT 1 FROM question_tags qt 
    JOIN tags t ON qt.tag_id = t.id 
    WHERE qt.question_id = a.question_id AND t.name = s.name
) AND a.user_id = $1
WHERE us.user_id = $1
GROUP BY s.id, s.name;

-- ----------------------------------------------------------------------------
-- 5. SKILL MATCHING QUERIES (SkillMatching.tsx)
-- ----------------------------------------------------------------------------

-- Get all students with skills and availability
SELECT u.id, u.name, u.college, u.avatar, u.points, u.sessions_completed, u.is_online,
       ARRAY_AGG(DISTINCT s.name) as skills_can_teach,
       AVG(CASE WHEN sess.teacher_id = u.id THEN 5.0 ELSE NULL END) as rating,
       STRING_AGG(DISTINCT 
         CASE WHEN u.is_online THEN 'Available now' 
              ELSE 'Check availability' END, ', ') as availability
FROM users u
JOIN user_skills us ON u.id = us.user_id AND us.can_teach = true
JOIN skills s ON us.skill_id = s.id
LEFT JOIN sessions sess ON u.id = sess.teacher_id AND sess.status = 'completed'
WHERE u.id != $1
GROUP BY u.id, u.name, u.college, u.avatar, u.points, u.sessions_completed, u.is_online
ORDER BY u.points DESC;

-- Search students by skill or name
SELECT u.id, u.name, u.college, u.avatar, u.points, u.sessions_completed,
       ARRAY_AGG(DISTINCT s.name) as skills_can_teach
FROM users u
JOIN user_skills us ON u.id = us.user_id AND us.can_teach = true
JOIN skills s ON us.skill_id = s.id
WHERE u.id != $1 
  AND (LOWER(u.name) LIKE LOWER($2) OR LOWER(s.name) LIKE LOWER($2))
GROUP BY u.id, u.name, u.college, u.avatar, u.points, u.sessions_completed;

-- Create connection request
INSERT INTO connections (requester_id, recipient_id, status)
VALUES ($1, $2, 'pending')
ON CONFLICT (requester_id, recipient_id) 
DO UPDATE SET status = 'pending', updated_at = CURRENT_TIMESTAMP;

-- Send session booking request
INSERT INTO sessions (title, description, teacher_id, student_id, skill_id, 
                     session_type, duration, scheduled_at, status, notes)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', $9)
RETURNING id;

-- ----------------------------------------------------------------------------
-- 6. Q&A FORUM QUERIES (QAForum.tsx)
-- ----------------------------------------------------------------------------

-- Get all questions with pagination
SELECT q.id, q.title, q.content, q.upvotes, q.views, q.is_answered, q.created_at,
       u.name as author_name, u.avatar as author_avatar, u.points as author_points, u.college,
       COUNT(a.id) as answer_count,
       ARRAY_AGG(DISTINCT t.name) as tags
FROM questions q
JOIN users u ON q.user_id = u.id
LEFT JOIN answers a ON q.id = a.question_id
LEFT JOIN question_tags qt ON q.id = qt.question_id
LEFT JOIN tags t ON qt.tag_id = t.id
GROUP BY q.id, u.name, u.avatar, u.points, u.college
ORDER BY q.created_at DESC
LIMIT $1 OFFSET $2;

-- Search questions
SELECT q.id, q.title, q.content, q.upvotes, q.views, q.is_answered, q.created_at,
       u.name as author_name, u.avatar as author_avatar,
       COUNT(a.id) as answer_count
FROM questions q
JOIN users u ON q.user_id = u.id
LEFT JOIN answers a ON q.id = a.question_id
WHERE LOWER(q.title) LIKE LOWER($1) OR LOWER(q.content) LIKE LOWER($1)
GROUP BY q.id, u.name, u.avatar
ORDER BY q.created_at DESC;

-- Get questions by tag
SELECT q.id, q.title, q.content, q.upvotes, q.views, q.is_answered, q.created_at,
       u.name as author_name, u.avatar as author_avatar,
       COUNT(a.id) as answer_count
FROM questions q
JOIN users u ON q.user_id = u.id
JOIN question_tags qt ON q.id = qt.question_id
JOIN tags t ON qt.tag_id = t.id
LEFT JOIN answers a ON q.id = a.question_id
WHERE t.name = $1
GROUP BY q.id, u.name, u.avatar
ORDER BY q.created_at DESC;

-- Create new question
INSERT INTO questions (title, content, user_id)
VALUES ($1, $2, $3)
RETURNING id;

-- Add tags to question
INSERT INTO question_tags (question_id, tag_id)
SELECT $1, id FROM tags WHERE name = ANY($2);

-- Get question with answers
SELECT q.id, q.title, q.content, q.upvotes, q.views, q.is_answered, q.created_at,
       u.name as author_name, u.avatar as author_avatar, u.points as author_points,
       ARRAY_AGG(DISTINCT t.name) as tags
FROM questions q
JOIN users u ON q.user_id = u.id
LEFT JOIN question_tags qt ON q.id = qt.question_id
LEFT JOIN tags t ON qt.tag_id = t.id
WHERE q.id = $1
GROUP BY q.id, u.name, u.avatar, u.points;

-- Get answers for a question
SELECT a.id, a.content, a.upvotes, a.is_accepted, a.created_at,
       u.name as author_name, u.avatar as author_avatar, u.points as author_points
FROM answers a
JOIN users u ON a.user_id = u.id
WHERE a.question_id = $1
ORDER BY a.is_accepted DESC, a.upvotes DESC, a.created_at ASC;

-- Create new answer
INSERT INTO answers (question_id, user_id, content)
VALUES ($1, $2, $3)
RETURNING id;

-- Vote on question or answer
INSERT INTO votes (user_id, target_type, target_id, vote_type)
VALUES ($1, $2, $3, $4)
ON CONFLICT (user_id, target_type, target_id)
DO UPDATE SET vote_type = $4;

-- Update vote counts (trigger or scheduled job)
UPDATE questions 
SET upvotes = (
    SELECT COUNT(*) FROM votes 
    WHERE target_type = 'question' AND target_id = questions.id AND vote_type = 1
)
WHERE id = $1;

-- Increment question views
UPDATE questions SET views = views + 1 WHERE id = $1;

-- ----------------------------------------------------------------------------
-- 7. LEADERBOARD QUERIES (Leaderboard.tsx)
-- ----------------------------------------------------------------------------

-- Get top users by points
SELECT u.id, u.name, u.college, u.avatar, u.points, u.level, u.sessions_completed,
       COUNT(DISTINCT ub.badge_id) as badge_count,
       RANK() OVER (ORDER BY u.points DESC) as rank
FROM users u
LEFT JOIN user_badges ub ON u.id = ub.user_id
GROUP BY u.id, u.name, u.college, u.avatar, u.points, u.level, u.sessions_completed
ORDER BY u.points DESC
LIMIT $1;

-- Get top contributors by questions answered
SELECT u.id, u.name, u.college, u.avatar, u.questions_answered,
       RANK() OVER (ORDER BY u.questions_answered DESC) as rank
FROM users u
WHERE u.questions_answered > 0
ORDER BY u.questions_answered DESC
LIMIT $1;

-- Get most active users by sessions
SELECT u.id, u.name, u.college, u.avatar, u.sessions_completed,
       RANK() OVER (ORDER BY u.sessions_completed DESC) as rank
FROM users u
WHERE u.sessions_completed > 0
ORDER BY u.sessions_completed DESC
LIMIT $1;

-- Get user's ranking position
SELECT COUNT(*) + 1 as rank
FROM users 
WHERE points > (SELECT points FROM users WHERE id = $1);

-- ----------------------------------------------------------------------------
-- 8. SETTINGS QUERIES (Settings.tsx)
-- ----------------------------------------------------------------------------

-- Get user settings
SELECT theme, font_size, compact_mode, notifications_enabled, email_notifications
FROM user_settings
WHERE user_id = $1;

-- Update user settings
INSERT INTO user_settings (user_id, theme, font_size, compact_mode, notifications_enabled, email_notifications)
VALUES ($1, $2, $3, $4, $5, $6)
ON CONFLICT (user_id)
DO UPDATE SET 
    theme = $2, 
    font_size = $3, 
    compact_mode = $4, 
    notifications_enabled = $5, 
    email_notifications = $6,
    updated_at = CURRENT_TIMESTAMP;

-- Delete user account (cascade will handle related data)
DELETE FROM users WHERE id = $1;

-- Change password
UPDATE users 
SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
WHERE id = $2;

-- ----------------------------------------------------------------------------
-- 9. GENERAL UTILITY QUERIES
-- ----------------------------------------------------------------------------

-- Get all skills
SELECT id, name, category FROM skills ORDER BY name;

-- Create new skill
INSERT INTO skills (name, category) 
VALUES ($1, $2) 
ON CONFLICT (name) DO NOTHING
RETURNING id;

-- Get all tags
SELECT id, name FROM tags ORDER BY name;

-- Create new tag
INSERT INTO tags (name) 
VALUES ($1) 
ON CONFLICT (name) DO NOTHING
RETURNING id;

-- Award badge to user
INSERT INTO user_badges (user_id, badge_id)
VALUES ($1, $2)
ON CONFLICT (user_id, badge_id) DO NOTHING;

-- Log user activity
INSERT INTO activity_log (user_id, activity_type, description, target_type, target_id, points_earned)
VALUES ($1, $2, $3, $4, $5, $6);

-- Update user points
UPDATE users 
SET points = points + $1, updated_at = CURRENT_TIMESTAMP
WHERE id = $2;

-- Get platform statistics (for landing page)
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM sessions WHERE status = 'completed') as total_sessions,
    (SELECT COUNT(DISTINCT college) FROM users WHERE college IS NOT NULL) as total_universities,
    (SELECT AVG(rating)::DECIMAL(3,1) FROM (
        SELECT AVG(5.0) as rating FROM sessions WHERE status = 'completed'
    ) as ratings) as satisfaction_rate;

-- ----------------------------------------------------------------------------
-- 10. INDEXES FOR PERFORMANCE
-- ----------------------------------------------------------------------------

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_points ON users(points DESC);
CREATE INDEX idx_questions_created_at ON questions(created_at DESC);
CREATE INDEX idx_questions_upvotes ON questions(upvotes DESC);
CREATE INDEX idx_answers_question_id ON answers(question_id);
CREATE INDEX idx_votes_target ON votes(target_type, target_id);
CREATE INDEX idx_sessions_user_dates ON sessions(teacher_id, student_id, scheduled_at);
CREATE INDEX idx_user_skills_lookup ON user_skills(user_id, skill_id, can_teach, wants_to_learn);
CREATE INDEX idx_activity_log_user_date ON activity_log(user_id, created_at DESC);
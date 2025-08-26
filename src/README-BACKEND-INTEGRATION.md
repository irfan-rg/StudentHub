# Backend Integration Guide for Student Hub

This document provides everything the backend team needs to know for integrating with the React.js frontend.

## Project Overview

- **Frontend**: React.js (JavaScript, not TypeScript)
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/UI
- **State Management**: React useState/useEffect
- **Authentication**: JWT tokens (stored in localStorage)

## Quick Start for Backend Team

### 1. Required API Endpoints

All API endpoints are documented in `/config/api.js`. The frontend expects these routes:

```javascript
// Authentication
POST /api/auth/login
POST /api/auth/signup
POST /api/auth/logout
GET  /api/auth/verify

// User Management
GET  /api/users/profile
PUT  /api/users/profile
GET  /api/users/:id
PUT  /api/users/settings

// Skills Management
GET  /api/skills
POST /api/users/skills
DELETE /api/users/skills/:skillId

// Skill Matching
GET  /api/matching/find
GET  /api/matching/suggestions
POST /api/matching/connect

// Sessions
POST /api/sessions
GET  /api/sessions/user/:userId
PUT  /api/sessions/:sessionId

// Q&A Forum
GET  /api/questions
POST /api/questions
POST /api/questions/:id/answers
POST /api/questions/:id/vote

// Leaderboard
GET  /api/leaderboard/users
GET  /api/leaderboard/mentors
```

### 2. Expected Response Format

All API responses should follow this structure:

```javascript
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Actual data here
  },
  "pagination": { // For paginated responses only
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

For errors:

```javascript
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### 3. Authentication Flow

The frontend handles JWT tokens as follows:

1. User logs in → Backend returns `{ user: {}, token: "jwt-token" }`
2. Frontend stores token in `localStorage.setItem('authToken', token)`
3. All subsequent API calls include `Authorization: Bearer ${token}` header
4. Backend should verify token and return user data or 401 if invalid

### 4. Key Data Structures

#### User Registration Data

```javascript
{
  "name": "John Doe",
  "email": "john@university.edu",
  "password": "securepassword",
  "college": "MIT",
  "educationLevel": "undergraduate", // 'high-school', 'undergraduate', 'graduate', 'phd'
  "bio": "Optional bio text",
  "skillsCanTeach": [
    {
      "name": "React",
      "level": "advanced" // 'beginner', 'intermediate', 'advanced', 'expert'
    }
  ],
  "skillsWantToLearn": ["Machine Learning", "DevOps"]
}
```

#### User Profile Response

```javascript
{
  "id": 1,
  "name": "John Doe",
  "email": "john@university.edu",
  "college": "MIT",
  "educationLevel": "undergraduate",
  "bio": "Student passionate about technology",
  "avatar": "https://example.com/avatar.jpg",
  "skillsCanTeach": [
    {
      "id": 1,
      "name": "React",
      "level": "advanced",
      "category": "Programming & Development",
      "verified": false
    }
  ],
  "skillsWantToLearn": ["Machine Learning"],
  "points": 1250,
  "badges": ["Helper", "Quick Learner"],
  "level": "Intermediate",
  "sessionsCompleted": 5,
  "questionsAnswered": 12,
  "questionsAsked": 8,
  "rating": 4.8,
  "joinedAt": "2024-01-15T10:30:00Z",
  "lastActive": "2024-01-20T15:45:00Z"
}
```

### 5. Database Schema Suggestions

Based on the frontend requirements, you'll need these main tables:

```sql
-- Users table
users (
  id, name, email, password_hash, college, education_level,
  bio, avatar_url, points, level, rating, created_at, updated_at
)

-- Skills table
skills (
  id, name, category, description, created_at
)

-- User Skills (many-to-many)
user_skills (
  id, user_id, skill_id, level, skill_type, verified, created_at
) -- skill_type: 'can_teach' or 'want_to_learn'

-- Sessions table
sessions (
  id, title, description, mentor_id, student_id, skill_id,
  type, duration, scheduled_at, status, meeting_link,
  rating, feedback, created_at, updated_at
)

-- Questions table
questions (
  id, title, content, author_id, votes, view_count,
  answer_count, is_answered, accepted_answer_id, created_at
)

-- Answers table
answers (
  id, question_id, content, author_id, votes, is_accepted, created_at
)

-- User connections
connections (
  id, requester_id, recipient_id, status, message, created_at
) -- status: 'pending', 'accepted', 'rejected'
```

### 6. Environment Variables

Set these in your backend `.env` file:

```bash
# Backend
PORT=5000
MONGODB_URI=mongodb://localhost:27017/studenthub
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Frontend will use
REACT_APP_API_URL=http://localhost:5000/api
```

### 7. CORS Configuration

Make sure your backend allows requests from the frontend:

```javascript
// Express.js example
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'], // React dev server
  credentials: true
}));
```

### 8. File Upload Handling

For avatar uploads, the frontend sends FormData to `/api/users/avatar`:

```javascript
// Frontend sends this
const formData = new FormData();
formData.append('avatar', imageFile);

// Backend should return
{
  "success": true,
  "data": {
    "avatarUrl": "https://your-storage/avatar.jpg"
  }
}
```

### 9. Skill Categories

Pre-populate your skills database with these categories:

- Programming & Development
- Data Science & Analytics
- Design & Creative
- Business & Management
- Cloud & DevOps
- Other Skills

See `/config/api.js` for the complete list of skills in each category.

### 10. Testing the Integration

You can test the frontend without a complete backend by:

1. The frontend currently uses mock data (see `mockUser` in `App.jsx`)
2. All API calls are wrapped in try-catch with fallbacks
3. Replace the mock responses in `/services/api.js` with real API calls

### 11. API Integration Steps

1. **Start with Authentication**: Implement login/signup endpoints first
2. **User Profile**: Get/update user profile data
3. **Skills Management**: CRUD operations for user skills
4. **Skill Matching**: Algorithm to find compatible users
5. **Sessions**: Booking and management system
6. **Q&A Forum**: Questions, answers, and voting
7. **Leaderboard**: Points and ranking system

### 12. Common Pitfalls to Avoid

- **CORS Issues**: Make sure to configure CORS properly
- **Token Expiration**: Handle JWT expiration gracefully
- **Data Validation**: Validate all input data on the backend
- **Error Messages**: Return user-friendly error messages
- **Rate Limiting**: Implement rate limiting for API endpoints
- **Input Sanitization**: Sanitize all user inputs to prevent XSS

### 13. Contact Points for Frontend Team

When implementing backend features, coordinate with the frontend team on:

- API response structures
- Error handling formats
- New endpoint requirements
- Data validation rules
- File upload specifications

## Ready to Start?

1. Review `/config/api.js` for all endpoint specifications
2. Check `/services/api.js` for how the frontend calls your APIs
3. Look at the mock data in `App.jsx` to understand expected data structures
4. Start with authentication endpoints and gradually build other features

The frontend is designed to be flexible and will work with your backend as soon as you implement the expected API structure!

````

## MongoDB Connection Example

If using MongoDB with Mongoose:

```javascript
// User Schema example
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  college: { type: String, required: true },
  educationLevel: {
    type: String,
    enum: ['high-school', 'undergraduate', 'graduate', 'phd'],
    required: true
  },
  bio: String,
  avatar: String,
  skillsCanTeach: [{
    name: String,
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'] },
    category: String
  }],
  skillsWantToLearn: [String],
  points: { type: Number, default: 0 },
  badges: [String],
  level: { type: String, default: 'Beginner' },
  sessionsCompleted: { type: Number, default: 0 },
  questionsAnswered: { type: Number, default: 0 },
  questionsAsked: { type: Number, default: 0 },
  rating: { type: Number, default: 0 }
}, { timestamps: true });
````
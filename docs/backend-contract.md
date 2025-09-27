## AI-Powered Student Hub — Backend API Contract

This document specifies the HTTP API that the backend should expose to support the existing frontend. It is derived from `src/config/api.js` and the service calls in `src/services/api.js`.

### Base
- Base URL: `http://localhost:5000/api`
- Content-Type: `application/json` for JSON requests; `multipart/form-data` for file uploads
- Auth: Bearer tokens via `Authorization: Bearer <JWT>` on protected routes
- Standard response envelope:
```json
{ "success": true, "message": "OK", "data": {}, "error": null, "pagination": null }
```

### Error semantics
- 400 Validation error — include field-level messages
- 401 Unauthorized — missing/invalid/expired token
- 403 Forbidden — not permitted
- 404 Not Found — resource missing
- 409 Conflict — duplicates/business rule conflict
- 500 Internal Server Error — unexpected

When `success` is false, include `error` as a human-readable string and may include `details` for field errors.

---

## Authentication

### POST /auth/signup
- Body (JSON):
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "college": "string",
  "educationLevel": "high-school|undergraduate|graduate|phd",
  "bio": "string",
  "skillsCanTeach": [{ "name": "string", "level": "beginner|intermediate|advanced|expert" }],
  "skillsWantToLearn": ["string"]
}
```
- Validation:
  - name, email, password, college, educationLevel required
  - password length ≥ 6
  - email unique
  - skillsCanTeach.level ∈ enum
- Responses:
  - 201 Created
```json
{ "success": true, "message": "Created", "data": { "token": "jwt", "user": { /* USER_PROFILE */ } } }
```
  - 409 Conflict if email exists

### POST /auth/login
- Body:
```json
{ "email": "string", "password": "string" }
```
- Responses:
  - 200 OK: `{ data: { token, user: USER_PROFILE } }`
  - 401 if invalid

### POST /auth/logout (auth)
- Clears refresh session server-side if applicable
- 204 No Content or `{ success: true }`

### GET /auth/verify (auth)
- 200: `{ data: { valid: true, user: USER_PROFILE } }`

### POST /auth/refresh
- Body (optional refresh token cookie/JSON depending on backend design)
- 200: `{ data: { token } }`

---

## Users

### GET /users/profile (auth)
- Returns the authenticated user's profile
- 200: `{ data: USER_PROFILE }`

### PUT /users/profile (auth)
- Body: partial subset of profile fields to update
- 200: `{ data: USER_PROFILE }`

### GET /users/:id (auth)
- Path params: `id` numeric/string UUID
- 200: `{ data: USER_PROFILE }`

### PUT /users/settings (auth)
- Body: free-form settings object, e.g. `{ theme: "dark", notifications: { email: true } }`
- 200: `{ data: settings }`

### POST /users/avatar (auth, multipart)
- multipart/form-data: field `file`
- 200: `{ data: { avatar: "https://cdn/..." } }`

---

## Skills

### GET /skills
- 200: `{ data: Skill[] }`

### GET /skills/category/:category
- 200: `{ data: Skill[] }`

### GET /skills/search?q=...
- 200: `{ data: Skill[] }`

### POST /users/skills (auth)
- Body:
```json
{ "name": "string", "level": "beginner|intermediate|advanced|expert" }
```
- 201: `{ data: UserSkill }`

### DELETE /users/skills/:skillId (auth)
- 204

### PUT /users/skills/:skillId (auth)
- Body: `{ "level": "beginner|intermediate|advanced|expert" }`
- 200: `{ data: UserSkill }`

Skill model (example):
```json
{ "id": 1, "name": "React", "category": "Programming & Development" }
```

UserSkill model:
```json
{ "id": 10, "name": "React", "level": "advanced", "category": "Programming & Development", "verified": false }
```

---

## Matching

### GET /matching/find (auth)
- Query params: `skill?`, `level?`, `college?`, `page?`, `limit?`
- 200: `{ data: USER_PROFILE[], pagination }`

### GET /matching/suggestions (auth)
- 200: `{ data: USER_PROFILE[] }`

### POST /matching/connect (auth)
- Body:
```json
{ "targetUserId": 123, "message": "Hi!" }
```
- 201: `{ data: { requestId: 1, status: "pending" } }`

### GET /users/connections (auth)
- 200: `{ data: Connection[] }`

Connection model:
```json
{ "id": 7, "userId": 1, "targetUserId": 2, "status": "pending|accepted|rejected", "createdAt": "2024-01-01T00:00:00Z" }
```

---

## Sessions

### POST /sessions (auth)
- Body:
```json
{
  "title": "string",
  "description": "string",
  "mentorId": 1,
  "studentId": 2,
  "skillName": "string",
  "type": "video|in-person|group",
  "duration": 60,
  "scheduledAt": "2024-06-01T10:00:00Z",
  "meetingLink": "string"
}
```
- 201: `{ data: SESSION }`

### GET /sessions/user/:userId (auth)
- 200: `{ data: SESSION[] }`

### PUT /sessions/:sessionId (auth)
- Body: partial updates — `status`, `scheduledAt`, `notes`, etc.
- 200: `{ data: SESSION }`

### POST /sessions/:sessionId/cancel (auth)
- Body: `{ "reason": "string" }`
- 200: `{ data: SESSION }`

### POST /sessions/:sessionId/complete (auth)
- Body: `{ "rating": 5, "feedback": "Great session" }`
- 200: `{ data: SESSION }`

SESSION model:
```json
{
  "id": 1,
  "title": "Intro to React",
  "description": "Basics",
  "mentorId": 1,
  "studentId": 2,
  "skillName": "React",
  "type": "video",
  "duration": 60,
  "scheduledAt": "2024-06-01T10:00:00Z",
  "status": "pending|confirmed|completed|cancelled",
  "meetingLink": "https://...",
  "notes": "string",
  "rating": 5,
  "feedback": "string",
  "createdAt": "2024-05-01T00:00:00Z",
  "updatedAt": "2024-05-01T00:00:00Z"
}
```

---

## Q&A

### GET /questions
- Query params: `page=1`, `limit=10`, `tag?`, `search?`
- 200: `{ data: QUESTION[], pagination }`

### POST /questions (auth)
- Body: `{ "title": "string", "content": "string", "tags": ["string"] }`
- 201: `{ data: QUESTION }`

### GET /questions/:id
- 200: `{ data: { question: QUESTION, answers: ANSWER[] } }`

### POST /questions/:id/answers (auth)
- Body: `{ "content": "string" }`
- 201: `{ data: ANSWER }`

### POST /questions/:id/vote (auth)
- Body: `{ "vote": "up" | "down" }`
- 200: `{ data: { votes: number } }`

### POST /answers/:id/vote (auth)
- Body: `{ "vote": "up" | "down" }`
- 200: `{ data: { votes: number } }`

QUESTION model:
```json
{
  "id": 1,
  "title": "How to learn React?",
  "content": "...",
  "authorId": 1,
  "tags": ["react", "frontend"],
  "votes": 3,
  "viewCount": 120,
  "answerCount": 2,
  "isAnswered": false,
  "acceptedAnswerId": null,
  "createdAt": "2024-05-01T00:00:00Z",
  "updatedAt": "2024-05-01T00:00:00Z"
}
```

ANSWER model:
```json
{
  "id": 10,
  "questionId": 1,
  "content": "...",
  "authorId": 2,
  "votes": 5,
  "isAccepted": false,
  "createdAt": "2024-05-01T00:00:00Z",
  "updatedAt": "2024-05-01T00:00:00Z"
}
```

---

## Leaderboard

### GET /leaderboard/users?limit=50
- 200: `{ data: UserRank[] }`

### GET /leaderboard/mentors?limit=50
- 200: `{ data: MentorRank[] }`

### GET /leaderboard/rank/:userId
- 200: `{ data: { rank: number, points: number } }`

UserRank/MentorRank example:
```json
{ "userId": 1, "name": "Alice", "points": 1230, "rank": 5 }
```

---

## Notifications

### GET /notifications (auth)
- Query params: `page=1`, `limit=20`, `unread_only?`
- 200: `{ data: NOTIFICATION[], pagination }`

### PUT /notifications/:id/read (auth)
- Mark single notification as read
- 200: `{ success: true }`

### PUT /notifications/read-all (auth)
- Mark all notifications as read
- 200: `{ success: true }`

### DELETE /notifications/:id (auth)
- Delete single notification
- 204 No Content

### DELETE /notifications (auth)
- Clear all notifications
- 204 No Content

### GET /notifications/unread-count (auth)
- 200: `{ data: { count: number } }`

### PUT /notifications/preferences (auth)
- Body: `{ email: boolean, push: boolean, types: [string] }`
- 200: `{ data: preferences }`

NOTIFICATION model (3 main categories):
```json
{
  "id": 1,
  "type": "session_reminder|connection_request|qa_activity",
  "title": "Session Starting Soon",
  "message": "React session with John Doe starts in 15 minutes",
  "read": false,
  "actionUrl": "/sessions",
  "metadata": {
    "sessionId": 123,
    "mentorName": "John Doe"
  },
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

**Notification Types:**
- `session_reminder` - Session starting soon, scheduled, cancelled
- `connection_request` - New connection requests, accepted/rejected
- `qa_activity` - Questions answered, upvoted, comments

---

## Security & Auth Notes
- Use HTTP-only refresh tokens if implementing refresh; short-lived JWT for access
- All modifying endpoints require auth
- Rate-limit login and content creation
- CORS: allow `http://localhost:5173` (default Vite) during development

---

## Pagination Conventions
- Query: `page` (1-based), `limit` (default 10, max 100)
- Response `pagination` object:
```json
{ "page": 1, "limit": 10, "total": 123, "totalPages": 13 }
```

---

## cURL Examples

Signup:
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"a@b.com","password":"secret123","college":"ABC","educationLevel":"undergraduate"}'
```

Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"a@b.com","password":"secret123"}'
```

Get Profile:
```bash
curl http://localhost:5000/api/users/profile -H "Authorization: Bearer $TOKEN"
```

Add User Skill:
```bash
curl -X POST http://localhost:5000/api/users/skills \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"React","level":"advanced"}'
```

Create Session:
```bash
curl -X POST http://localhost:5000/api/sessions \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"title":"Intro","mentorId":1,"studentId":2,"skillName":"React","type":"video","duration":60,"scheduledAt":"2024-06-01T10:00:00Z"}'
```

Ask Question:
```bash
curl -X POST http://localhost:5000/api/questions \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"title":"How?","content":"...","tags":["react"]}'
```

---

## Data Contracts (Authoritative)

USER_PROFILE:
```json
{
  "id": 1,
  "name": "string",
  "email": "string",
  "college": "string",
  "educationLevel": "string",
  "bio": "string",
  "avatar": "string",
  "skillsCanTeach": [{ "id": 1, "name": "string", "level": "string", "category": "string", "verified": false }],
  "skillsWantToLearn": ["string"],
  "points": 0,
  "badges": ["string"],
  "level": "string",
  "sessionsCompleted": 0,
  "questionsAnswered": 0,
  "questionsAsked": 0,
  "rating": 0,
  "joinedAt": "2024-01-01T00:00:00Z",
  "lastActive": "2024-01-01T00:00:00Z"
}
```

---

If the backend needs additional fields or different naming, please coordinate changes in `src/config/api.js` and update this document accordingly.



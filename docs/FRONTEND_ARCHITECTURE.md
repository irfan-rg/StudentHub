# Frontend Architecture & Backend Integration Guide

## Table of Contents
1. [Overview](#overview)
2. [Architecture Patterns](#architecture-patterns)
3. [State Management](#state-management)
4. [API Integration Layer](#api-integration-layer)
5. [Component Documentation](#component-documentation)
6. [Data Flow](#data-flow)
7. [Authentication Flow](#authentication-flow)

---

## Overview

The AI-Powered Student Hub is a React-based single-page application (SPA) built with modern web technologies. It provides a platform for students to connect, share knowledge, schedule learning sessions, and engage in Q&A discussions.

### Tech Stack
- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **State Management**: Zustand with persistence
- **UI Components**: Custom components built with Radix UI primitives
- **Styling**: Tailwind CSS with dark mode support
- **HTTP Client**: Native Fetch API with custom wrapper
- **Notifications**: Sonner toast library

### Project Structure
```
frontend/
├── src/
│   ├── components/          # React components
│   ├── stores/             # Zustand state stores
│   ├── services/           # API service layer
│   ├── config/             # Configuration files
│   ├── contexts/           # React contexts (Theme)
│   ├── styles/             # Global styles
│   └── App.jsx             # Main application component
```

---

## Architecture Patterns

### 1. Component-Based Architecture
The application follows a modular component-based architecture where each feature is encapsulated in its own component with clear responsibilities.

### 2. Service Layer Pattern
All API calls are abstracted into a service layer (`services/api.js`), separating business logic from UI components.

### 3. Centralized State Management
Application state is managed using Zustand stores, with persistence for critical data like authentication.

### 4. Route-Based Code Splitting
The application uses React Router for client-side routing with protected and public route guards.

---

## State Management

### Zustand Stores

#### 1. **useAuthStore** (`stores/useAuthStore.js`)
Manages authentication state and user session.

**State:**
```javascript
{
  user: Object | null,           // Current user data
  token: string | null,          // JWT authentication token
  loading: boolean,              // Loading state
  error: string | null,          // Error messages
  sessionExpired: boolean,       // Session expiration flag
  initialized: boolean           // Hydration complete flag
}
```

**Actions:**
- `login(credentials)` - Authenticate user
- `signup(userData)` - Register new user
- `logout()` - Clear session and logout
- `updateUser(userData)` - Update user data locally
- `setSessionExpired(val)` - Set session expiration flag
- `initialize()` - Initialize persisted state

**Persistence:** Uses Zustand persist middleware to save user and token to localStorage.

#### 2. **useSessionStore** (`stores/useSessionStore.js`)
Manages learning sessions between students.

**State:**
```javascript
{
  sessions: Array,               // All user sessions
  upcomingSessions: Array,       // Filtered upcoming sessions
  loading: boolean,
  error: string | null
}
```

**Actions:**
- `loadSessions()` - Fetch all sessions from backend
- `createSession(data)` - Create new learning session
- `updateSession(id, data)` - Update existing session
- `deleteSession(id)` - Delete a session
- `inviteToSession(sessionId, userId)` - Send session invite

#### 3. **useConnectionsStore** (`stores/useConnectionsStore.js`)
Manages student connections and matching.

**State:**
```javascript
{
  connections: Array,            // Connected students
  connectionRequests: Array,     // Pending connection requests
  suggested: Array,              // ML-suggested matches
  loading: boolean,
  error: string | null
}
```

**Actions:**
- `loadConnections()` - Fetch user's connections
- `loadSuggestedConnections()` - Fetch ML-based suggestions
- `sendConnectionRequest(userId, message)` - Send connection request
- `acceptConnection(requestId)` - Accept pending request
- `rejectConnection(requestId)` - Reject pending request
- `deleteConnection(userId)` - Remove connection

#### 4. **useQAStore** (`stores/useQAStore.js`)
Manages Q&A forum questions and answers.

**State:**
```javascript
{
  questions: Array,              // All forum questions
  loading: boolean,
  error: string | null,
  currentUserId: string          // For vote tracking
}
```

**Actions:**
- `loadQuestions()` - Fetch all questions
- `askQuestion(data)` - Post new question
- `addAnswer(questionId, answer)` - Post answer
- `voteQuestion(questionId, voteType)` - Upvote/downvote question
- `voteAnswer(answerId, voteType)` - Upvote/downvote answer

---

## API Integration Layer

### Configuration (`config/api.js`)

**API Base URL Configuration:**
```javascript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
  }
};
```

**Endpoint Collections:**
- `AUTH_ENDPOINTS` - Authentication routes
- `USER_ENDPOINTS` - User profile management
- `SKILL_ENDPOINTS` - Skill management
- `MATCHING_ENDPOINTS` - Student matching
- `SESSION_ENDPOINTS` - Learning sessions
- `QA_ENDPOINTS` - Q&A forum
- `LEADERBOARD_ENDPOINTS` - Points and rankings
- `POINTS_ENDPOINTS` - Points management
- `NOTIFICATION_ENDPOINTS` - Notifications

### API Service (`services/api.js`)

**Core Request Handler:**
```javascript
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  const token = localStorage.getItem('authToken');
  
  const config = {
    method: 'GET',
    headers: {
      ...API_CONFIG.HEADERS,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    },
    credentials: 'include', // Include cookies for auth
    ...options
  };

  // Handle FormData (for file uploads)
  if (config.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  const response = await fetch(url, config);
  
  // Handle authentication errors
  if (response.status === 401 || response.status === 403) {
    useAuthStore.getState().setSessionExpired(true);
  }
  
  return await response.json();
};
```

**Service Modules:**

1. **authService** - Login, signup, logout, token refresh
2. **userService** - Profile management, settings, avatar upload
3. **skillsService** - Skill CRUD operations
4. **matchingService** - Find matches, manage connections
5. **sessionService** - Session CRUD, invitations, documents
6. **qaService** - Questions, answers, voting
7. **leaderboardService** - Rankings and points
8. **pointsService** - Points transactions
9. **notificationService** - Fetch and mark notifications

---

## Component Documentation

### Core Components

#### **App.jsx**
Main application component that handles routing and layout.

**Responsibilities:**
- Initialize authentication state
- Define routes (public and protected)
- Manage session expiration dialogs
- Render sidebar for authenticated users

**Key Features:**
- Route transition loading indicators
- Protected route guards
- Session expiration handling
- Conditional sidebar rendering

**Routes:**
```javascript
Public Routes:
- / - Landing page
- /signup - User registration

Protected Routes:
- /dashboard - User dashboard
- /profile - User profile
- /skill-matching - Find study partners
- /qa-forum - Q&A discussions
- /sessions - Learning sessions
- /leaderboard - Points leaderboard
- /settings - User settings
```

---

#### **Dashboard.jsx**
Central hub showing user overview and quick actions.

**Backend Integration:**
- `GET /api/session/user-sessions` - Fetch user sessions
- `GET /api/matching/connections` - Fetch connections
- `POST /api/session/create` - Create new session
- `GET /api/points/balance` - Get user points

**State Management:**
- Uses `useSessionStore` for session data
- Uses `useConnectionsStore` for connection data
- Local state for forms and modals

**Key Features:**
1. **Quick Stats Cards**
   - Total connections count
   - Active sessions count
   - Points balance
   - Questions answered

2. **Upcoming Sessions**
   - Lists next 3 sessions
   - Join session button
   - Edit/delete actions

3. **Recent Connections**
   - Shows latest connections
   - Profile preview
   - View profile link

4. **Quick Actions**
   - Create session modal
   - Find study partners link
   - Ask question link

**Data Flow:**
```
Component Mount
    ↓
Load Sessions Store → API Call → Update Store
    ↓
Load Connections Store → API Call → Update Store
    ↓
Render UI with Data
    ↓
User Actions → Update Backend → Refresh Store
```

---

#### **Profile.jsx**
User profile management with skills and achievements.

**Backend Integration:**
- `GET /api/user/profile` - Fetch user profile
- `PUT /api/user/update-details` - Update profile
- `GET /api/skill/all-skills` - Fetch available skills
- `PUT /api/skill/update-skills-to-teach` - Update teaching skills
- `PUT /api/skill/update-skills-to-learn` - Update learning skills
- `POST /api/user/avatar` - Upload profile picture (FormData)

**State Management:**
- Uses `useAuthStore` for user data
- Local state for edit mode and forms
- Skill selection state

**Key Features:**
1. **Profile Header**
   - Avatar with upload capability
   - User name and bio
   - Education level badge
   - Points display

2. **Skills Management**
   - **Skills to Teach**: Skills user can mentor in
   - **Skills to Learn**: Skills user wants to learn
   - Add/remove skills with level selection
   - Visual skill badges with levels

3. **Stats Section**
   - Connections count
   - Sessions completed
   - Questions answered
   - Points earned

4. **Edit Mode**
   - Toggle between view and edit
   - Form validation
   - Save/cancel actions

**Data Flow:**
```
Load Profile
    ↓
Fetch User Data → API Call
    ↓
Fetch All Skills → API Call
    ↓
Render Profile View
    ↓
Edit Mode Enabled
    ↓
Update Skills → API Calls
    ↓
Update Profile → API Call → Update Auth Store
    ↓
Exit Edit Mode
```

---

#### **SkillMatching.jsx**
Student matching system for finding study partners.

**Backend Integration:**
- `GET /api/matching/suggestions` - Get ML-based suggestions
- `GET /api/matching/connections` - Fetch connections
- `POST /api/matching/connect` - Send connection request
- `DELETE /api/matching/connections/:userId` - Remove connection

**State Management:**
- Uses `useConnectionsStore`
- Local state for filters and modals
- Search and filter state

**Key Features:**
1. **Discover Tab**
   - ML-based student suggestions
   - Filter by skill, university, level
   - Search by name
   - Match score display
   - Send connection request

2. **Connected Tab**
   - List of connected students
   - Filter and search
   - Remove connection action
   - View profile
   - Schedule session

3. **Connection Request Modal**
   - Personalized message
   - Send request to backend
   - Real-time UI update

4. **Filtering System**
   - Skill filter dropdown
   - University filter
   - Proficiency level filter
   - Real-time search

**Match Score Calculation:**
- Backend ML algorithm calculates compatibility
- Considers skills overlap
- Considers education level
- Considers activity level

**Data Flow:**
```
Component Mount
    ↓
Load Connections → API Call
    ↓
Load Suggestions → API Call (ML Backend)
    ↓
Apply Filters (Client-side)
    ↓
Render Filtered List
    ↓
Send Connection Request → API Call → Update Store
    ↓
Real-time UI Update
```

---

#### **Sessions.jsx**
Learning session management with PDF quiz generation.

**Backend Integration:**
- `GET /api/session/user-sessions` - Fetch all sessions
- `POST /api/session/create` - Create session (with FormData for PDFs)
- `PUT /api/session/:id` - Update session
- `DELETE /api/session/:id` - Delete session
- `POST /api/session/invite` - Send session invitation
- `POST /api/points/create` - Award points after session

**Python Backend Integration:**
- `POST /python-api/generate-quiz` - Generate quiz from PDF

**State Management:**
- Uses `useSessionStore`
- Local state for forms and filters
- File upload state

**Key Features:**
1. **Session List View**
   - Upcoming sessions
   - Past sessions (with completion status)
   - Filter by status, type, partner
   - Search by title

2. **Create Session Modal**
   - Session title and description
   - Session type (video/in-person)
   - Duration selection
   - Date and time picker
   - Partner selection
   - Meeting link/address
   - **PDF Upload** (up to 3 files)
   - Document names

3. **Session Details**
   - Session information
   - Partner info
   - Documents list
   - Join session button
   - Mark as complete
   - Generate quiz from PDFs

4. **PDF Quiz Generation**
   - Upload PDFs to backend
   - Send to Python service
   - Generate AI questions
   - Display quiz modal
   - Answer questions
   - Show results

**File Upload Flow:**
```
User Selects PDFs (max 3)
    ↓
Create FormData Object
    ↓
Append session data + files
    ↓
POST to /api/session/create (multipart/form-data)
    ↓
Backend saves files to /uploads/sessions/
    ↓
Store file paths in sessionDocument model
    ↓
Return session with documents
    ↓
Update SessionStore
```

**Quiz Generation Flow:**
```
User Clicks "Generate Quiz"
    ↓
Fetch session documents
    ↓
Send document paths to Python backend
    ↓
Python service extracts text (PyMuPDF)
    ↓
LLM generates questions (Ollama)
    ↓
Return quiz JSON
    ↓
Display quiz modal
    ↓
User answers questions
    ↓
Calculate score
    ↓
Award points → API Call
```

---

#### **QAForum.jsx**
Q&A discussion forum with voting system.

**Backend Integration:**
- `GET /api/qna/questions` - Fetch all questions
- `POST /api/qna/questions` - Post new question
- `POST /api/qna/questions/:id/answers` - Post answer
- `POST /api/qna/questions/:id/vote` - Vote on question
- `POST /api/qna/answers/:id/vote` - Vote on answer

**State Management:**
- Uses `useQAStore`
- Local state for forms and filters
- Pagination state

**Key Features:**
1. **Question List**
   - All questions tab
   - Popular questions tab
   - My questions tab
   - Pagination (10 per page)

2. **Ask Question Modal**
   - Question title
   - Detailed description
   - Tags (up to 5)
   - Tag suggestions

3. **Question Thread**
   - Full question details
   - Vote buttons (upvote/downvote)
   - Answer list
   - Add answer form
   - Answer voting

4. **Filtering**
   - Search by title/content
   - Filter by tag
   - Filter by answered status
   - Time filter (today, week, month, all)

5. **Voting System**
   - Upvote/downvote questions
   - Upvote/downvote answers
   - Visual vote count
   - User vote tracking (can't vote twice)

**Data Flow:**
```
Load Questions → API Call → Store
    ↓
Apply Filters (Client-side)
    ↓
Render Question List
    ↓
User Votes → API Call → Update Store → Re-render
    ↓
User Posts Answer → API Call → Update Store → Re-render
```

---

#### **Leaderboard.jsx**
Points-based ranking system.

**Backend Integration:**
- `GET /api/leaderboard/top` - Fetch top users
- `GET /api/leaderboard/rank` - Get current user rank
- `GET /api/points/history` - Get points transaction history

**State Management:**
- Local state for leaderboard data
- Uses `useAuthStore` for current user

**Key Features:**
1. **Top Users List**
   - Rank, avatar, name
   - Points balance
   - Medals for top 3

2. **Current User Rank Card**
   - User's position
   - Points balance
   - Progress to next rank

3. **Points History**
   - Transaction list
   - Reason for points
   - Date and time

**Points System:**
- Complete session: +50 points
- Answer question: +10 points
- Best answer (selected): +25 points
- Create connection: +5 points
- Daily login: +2 points

---

#### **NotificationWidget.jsx**
Real-time notification system.

**Backend Integration:**
- `GET /api/notification/all` - Fetch notifications
- `PUT /api/notification/:id/read` - Mark as read
- `PUT /api/notification/read-all` - Mark all as read

**State Management:**
- Local state for notifications
- Polling interval (30 seconds)

**Key Features:**
1. **Notification Bell**
   - Unread count badge
   - Click to open dropdown

2. **Notification List**
   - Connection requests
   - Session invitations
   - Q&A interactions
   - Points earned
   - Accept/reject actions
   - Mark as read

3. **Auto-refresh**
   - Polls backend every 30 seconds
   - Updates unread count

**Notification Types:**
- `CONNECTION_REQUEST` - New connection request
- `CONNECTION_ACCEPTED` - Connection accepted
- `SESSION_INVITE` - Session invitation
- `SESSION_REMINDER` - Upcoming session
- `QUESTION_ANSWERED` - New answer on your question
- `ANSWER_VOTED` - Vote on your answer
- `POINTS_EARNED` - Points transaction

---

#### **ChatbotWidget.jsx**
AI-powered chatbot assistant.

**Backend Integration:**
- `POST /python-api/chat` - Send message to AI

**Features:**
- Floating chat bubble
- Message history
- AI-powered responses (Ollama)
- Contextual help

---

#### **Navigation.jsx** (Sidebar)
Main navigation component for authenticated users.

**Features:**
- Dashboard link
- Profile link
- Skill Matching link
- Sessions link
- Q&A Forum link
- Leaderboard link
- Settings link
- Theme toggle
- Logout button

---

## Data Flow

### Global Application Flow

```
1. App Initialization
   ├─ App.jsx mounts
   ├─ Initialize auth store (rehydrate from localStorage)
   ├─ Check authentication status
   └─ Render appropriate route

2. Authentication Flow
   ├─ User submits login form
   ├─ Call authService.login()
   ├─ Backend validates credentials
   ├─ Return JWT token + user data
   ├─ Store in localStorage + Zustand
   └─ Redirect to dashboard

3. Protected Route Access
   ├─ User navigates to protected route
   ├─ ProtectedRoute checks auth store
   ├─ If not authenticated → redirect to landing
   └─ If authenticated → render component

4. Component Data Loading
   ├─ Component mounts
   ├─ useEffect triggers
   ├─ Load data from Zustand store
   ├─ If empty → call API service
   ├─ API service makes HTTP request
   ├─ Backend processes request
   ├─ Return data
   ├─ Update Zustand store
   └─ Component re-renders with data

5. User Action Flow
   ├─ User interacts with UI (button click, form submit)
   ├─ Call action from Zustand store
   ├─ Store calls API service
   ├─ API service makes HTTP request
   ├─ Backend processes and returns response
   ├─ Store updates state
   ├─ Components re-render
   └─ Show toast notification

6. Session Expiration
   ├─ API request returns 401/403
   ├─ apiRequest sets sessionExpired flag
   ├─ App.jsx detects flag
   ├─ Show "Session Expired" dialog
   ├─ User clicks "Login Again"
   ├─ Logout and redirect to landing
   └─ User re-authenticates
```

### API Request Flow

```
Component Action
    ↓
Zustand Store Action
    ↓
API Service Function
    ↓
apiRequest() Helper
    ↓
Add Authorization Header (JWT)
    ↓
Add credentials: 'include' (cookies)
    ↓
Fetch Request → Backend
    ↓
Backend Middleware: verifyUser
    ↓
Backend Controller Logic
    ↓
Database Operation
    ↓
Return JSON Response
    ↓
apiRequest() parses response
    ↓
Handle errors (401/403)
    ↓
Return data to service
    ↓
Service returns to store
    ↓
Store updates state
    ↓
Component re-renders
```

---

## Authentication Flow

### Registration Flow

```
1. User fills signup form
   - Full name
   - Email
   - Password
   - University
   - Education level

2. Submit to authService.signup()

3. Backend: POST /api/auth/signup
   - Validate input
   - Hash password (bcrypt)
   - Create user in database
   - Generate JWT token
   - Return user + token

4. Frontend receives response
   - Store token in localStorage
   - Store user in Zustand
   - Redirect to dashboard
```

### Login Flow

```
1. User enters credentials
   - Email
   - Password

2. Submit to authService.login()

3. Backend: POST /api/auth/login
   - Find user by email
   - Compare password hash
   - Generate JWT token
   - Set httpOnly cookie (optional)
   - Return user + token

4. Frontend receives response
   - Store token in localStorage
   - Store user in Zustand
   - Redirect to dashboard
```

### Token Refresh Flow

```
1. API request fails with 401

2. Try to refresh token
   - Call authService.refresh()

3. Backend: POST /api/auth/refresh
   - Validate refresh token (from cookie)
   - Generate new access token
   - Return new token

4. Frontend receives new token
   - Update localStorage
   - Retry original request

5. If refresh fails
   - Set sessionExpired flag
   - Show login dialog
   - User re-authenticates
```

### Logout Flow

```
1. User clicks logout

2. Call authStore.logout()

3. Backend: POST /api/auth/logout
   - Clear server-side session
   - Clear cookies

4. Frontend cleanup
   - Remove token from localStorage
   - Clear user from Zustand
   - Clear all store data
   - Redirect to landing page
```

---

## Error Handling

### Global Error Handling

```javascript
// In apiRequest helper
try {
  const response = await fetch(url, config);
  
  if (!response.ok) {
    // Handle authentication errors
    if (response.status === 401 || response.status === 403) {
      useAuthStore.getState().setSessionExpired(true);
    }
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
} catch (error) {
  console.error('API Error:', error);
  throw error;
}
```

### Component Error Handling

```javascript
try {
  await store.someAction();
  toast.success('Action completed successfully');
} catch (error) {
  console.error('Error:', error);
  toast.error(error.message || 'Something went wrong');
}
```

### Error Boundary

The app uses `ErrorBoundary.jsx` to catch React errors:
- Catches component rendering errors
- Displays fallback UI
- Logs error details
- Provides "Go to Dashboard" button

---

## Performance Optimizations

1. **Code Splitting**
   - Route-based splitting with React Router
   - Lazy loading for large components

2. **Memoization**
   - useMemo for expensive computations
   - React.memo for pure components
   - useCallback for event handlers

3. **Zustand Optimization**
   - Selective subscription to store slices
   - Shallow comparison for arrays

4. **API Optimization**
   - Request debouncing for search
   - Caching in Zustand stores
   - Pagination for large lists

5. **Image Optimization**
   - Lazy loading images
   - Fallback for missing avatars
   - Responsive image sizes

---

## Testing Strategy

### Unit Tests
- Test individual components in isolation
- Mock API calls and stores
- Test user interactions

### Integration Tests
- Test component interactions
- Test store updates
- Test API integration

### E2E Tests
- Test complete user flows
- Test authentication
- Test critical paths

---

## Development Guidelines

### Adding a New Component

1. Create component file in `src/components/`
2. Define props and TypeScript types (if using TS)
3. Add backend integration if needed
4. Create or use existing Zustand store
5. Add route in App.jsx if needed
6. Add navigation link if needed
7. Test component functionality
8. Add to documentation

### Adding a New API Endpoint

1. Define endpoint in `config/api.js`
2. Create service function in `services/api.js`
3. Add to appropriate Zustand store action
4. Handle loading and error states
5. Update component to use new endpoint
6. Test integration
7. Document changes

### Adding a New Store

1. Create store file in `stores/`
2. Define state shape
3. Define actions
4. Add persistence if needed
5. Use in components
6. Test store logic
7. Document store

---

## Deployment Checklist

- [ ] Update API_CONFIG.BASE_URL for production
- [ ] Enable production build optimizations
- [ ] Test all API integrations
- [ ] Verify authentication flow
- [ ] Test file uploads
- [ ] Check responsive design
- [ ] Test dark mode
- [ ] Verify error handling
- [ ] Check loading states
- [ ] Test session expiration
- [ ] Verify notification system
- [ ] Test all CRUD operations
- [ ] Check browser compatibility
- [ ] Optimize bundle size
- [ ] Add analytics (optional)
- [ ] Set up error tracking (optional)

---

## Troubleshooting

### Common Issues

**1. "Session Expired" on every request**
- Check if JWT token is valid
- Verify Authorization header
- Check backend token verification
- Ensure credentials: 'include' is set

**2. CORS errors**
- Ensure backend has correct CORS config
- Verify API_CONFIG.BASE_URL
- Check credentials: 'include'

**3. Store not updating**
- Check if action is called
- Verify API response format
- Check store update logic
- Ensure component subscribes correctly

**4. Images not loading**
- Check image URLs
- Verify backend serves static files
- Check CORS for images
- Add fallback images

**5. File upload failing**
- Check FormData construction
- Verify Content-Type is removed for FormData
- Check backend file size limits
- Ensure multipart/form-data handling

---

## Future Enhancements

1. **Real-time Features**
   - WebSocket for live notifications
   - Real-time chat in sessions
   - Live Q&A updates

2. **Advanced Matching**
   - Machine learning improvements
   - Personality matching
   - Learning style compatibility

3. **Analytics Dashboard**
   - Learning progress tracking
   - Session analytics
   - Engagement metrics

4. **Mobile App**
   - React Native version
   - Push notifications
   - Offline mode

5. **Gamification**
   - Achievements/badges
   - Streaks
   - Challenges

---

## Support & Contact

For questions or issues, contact the development team:
- Frontend Lead: [Your Name]
- Backend Lead: [Backend Team Lead]
- DevOps: [DevOps Team Lead]

---

**Last Updated**: November 23, 2025
**Version**: 1.0.0

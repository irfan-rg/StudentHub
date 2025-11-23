// API Configuration for Backend Team
// This file contains all the API endpoints and data structures needed for backend integration

// Base API URL - Update this to match your backend server
export const API_CONFIG = {
  BASE_URL: (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || 'http://localhost:5000/api',
  TIMEOUT: 10000, // 10 seconds
  HEADERS: {
    'Content-Type': 'application/json',
  }
};

// Authentication Endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup', 
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  VERIFY: '/auth/verify'
};

// User Endpoints
export const USER_ENDPOINTS = {
  PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/update-details',
  GET_USER: '/user/:id',
  UPDATE_SETTINGS: '/user/settings',
  UPLOAD_AVATAR: '/user/avatar'
};

// Skills Endpoints
export const SKILL_ENDPOINTS = {
  GET_ALL: '/skill/all-skills',
  GET_BY_CATEGORY: '/skill/category/:category',
  SEARCH: '/skill/search',
  ADD_USER_SKILL: '/skill/add-skill-to-learn',
  ADD_SKILL_TO_TEACH: '/skill/add-skill-can-teach',
  REMOVE_USER_SKILL: '/skill/delete-skill-to-learn',
  REMOVE_SKILL_TO_TEACH: '/skill/delete-skill-can-teach',
  UPDATE_SKILL_LEVEL: '/skill/update-skill',
  UPDATE_SKILLS_TO_TEACH: '/skill/update-skills-to-teach',
  UPDATE_SKILLS_TO_LEARN: '/skill/update-skills-to-learn'
};

// Matching Endpoints
export const MATCHING_ENDPOINTS = {
  FIND_MATCHES: '/matching/find',
  GET_SUGGESTIONS: '/matching/suggestions',
  SEND_CONNECTION: '/matching/connect',
  GET_CONNECTIONS: '/matching/connections'
};

// Session Endpoints
export const SESSION_ENDPOINTS = {
  GET_SESSION_BY_ID: '/session/get-session/:sessionId',
  GET_CREATED_SESSIONS: '/session/created-session',
  GET_JOINED_SESSIONS: '/session/joined-session',
  CREATE_SESSION: '/session/create-session',
  CREATE_WITH_DOCUMENTS: '/session/create-with-documents',
  ACCEPT_SESSION: '/session/accept-session',
  CANCEL_SESSION: '/session/cancel-session',
  DELETE_SESSION: '/session/delete-session',
  RATE_SESSION: '/session/rate-session'
};

// Q&A Forum Endpoints
export const QA_ENDPOINTS = {
  GET_ALL_QUESTIONS: '/qna/all-questions',
  GET_QUESTIONS_BY_USER: '/qna/questions-by-user',
  ASK_QUESTION: '/qna/askQuestion',
  ANSWER_QUESTION: '/qna/answer',
  UPVOTE_QUESTION: '/qna/upvoteQuestion',
  DOWNVOTE_QUESTION: '/qna/downvoteQuestion',
  UPVOTE_ANSWER: '/qna/upvoteAnswer',
  DOWNVOTE_ANSWER: '/qna/downvoteAnswer'
};

// Leaderboard Endpoints
export const LEADERBOARD_ENDPOINTS = {
  GET_LEADERBOARD: '/user/leaderboard/:filter',
  GET_USER_RANK: '/user/leaderboard/rank/:userId'
};

// Points Endpoints
export const POINTS_ENDPOINTS = {
  QUIZ_COMPLETE: '/points/quiz-complete',
  GET_CONFIG: '/points/config'
};

// Notification Endpoints
export const NOTIFICATION_ENDPOINTS = {
  GET_NOTIFICATIONS: '/notifications',
  GET_UNREAD_COUNT: '/notifications/unread-count',
  MARK_AS_READ: '/notifications/:notificationId/read',
  MARK_ALL_READ: '/notifications/read-all',
  DELETE_NOTIFICATION: '/notifications/:notificationId',
  CLEAR_ALL: '/notifications/clear-all',
  HANDLE_SESSION_INVITE: '/notifications/session-invite-response'
};

// Expected Data Structures for Backend Team

// User Registration Data
export const SIGNUP_DATA_STRUCTURE = {
  name: 'string', // required
  email: 'string', // required, unique
  password: 'string', // required, min 6 chars
  college: 'string', // required
  educationLevel: 'string', // required: 'high-school', 'undergraduate', 'graduate', 'phd'
  bio: 'string', // optional
  skillsCanTeach: [
    {
      name: 'string', // skill name
      level: 'string' // 'beginner', 'intermediate', 'advanced', 'expert'
    }
  ],
  skillsWantToLearn: ['string'] // array of skill names
};

// User Login Data
export const LOGIN_DATA_STRUCTURE = {
  email: 'string', // required
  password: 'string' // required
};

// User Profile Data
export const USER_PROFILE_STRUCTURE = {
  id: 'number',
  name: 'string',
  email: 'string',
  college: 'string',
  educationLevel: 'string',
  bio: 'string',
  avatar: 'string', // URL to profile image
  skillsCanTeach: [
    {
      id: 'number',
      name: 'string',
      level: 'string',
      category: 'string',
      verified: 'boolean'
    }
  ],
  skillsWantToLearn: ['string'],
  points: 'number',
  badges: ['string'],
  level: 'string',
  sessionsCompleted: 'number',
  questionsAnswered: 'number',
  questionsAsked: 'number',
  rating: 'number',
  joinedAt: 'date',
  lastActive: 'date'
};

// Session Data Structure
export const SESSION_STRUCTURE = {
  id: 'number',
  title: 'string',
  description: 'string',
  mentorId: 'number',
  studentId: 'number',
  skillName: 'string',
  type: 'string', // 'video', 'in-person', 'group'
  duration: 'number', // minutes
  scheduledAt: 'date',
  status: 'string', // 'pending', 'confirmed', 'completed', 'cancelled'
  meetingLink: 'string', // for video sessions
  notes: 'string',
  rating: 'number', // 1-5
  feedback: 'string',
  createdAt: 'date',
  updatedAt: 'date'
};

// Question Data Structure
export const QUESTION_STRUCTURE = {
  id: 'number',
  title: 'string',
  content: 'string',
  authorId: 'number',
  tags: ['string'],
  votes: 'number',
  viewCount: 'number',
  answerCount: 'number',
  isAnswered: 'boolean',
  acceptedAnswerId: 'number',
  createdAt: 'date',
  updatedAt: 'date'
};

// Answer Data Structure
export const ANSWER_STRUCTURE = {
  id: 'number',
  questionId: 'number',
  content: 'string',
  authorId: 'number',
  votes: 'number',
  isAccepted: 'boolean',
  createdAt: 'date',
  updatedAt: 'date'
};

// Notification Data Structure (3 main categories)
export const NOTIFICATION_STRUCTURE = {
  id: 'number',
  type: 'string', // 'session_reminder', 'connection_request', 'qa_activity'
  title: 'string',
  message: 'string',
  read: 'boolean',
  actionUrl: 'string', // Optional URL to navigate to when clicked
  metadata: 'object', // Additional data specific to notification type
  createdAt: 'date',
  updatedAt: 'date'
};

// API Response Format
export const API_RESPONSE_FORMAT = {
  success: 'boolean',
  message: 'string',
  data: 'object', // The actual data
  error: 'string', // Error message if success is false
  pagination: { // For paginated responses
    page: 'number',
    limit: 'number',
    total: 'number',
    totalPages: 'number'
  }
};

// Error Codes
export const ERROR_CODES = {
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409, // For duplicate emails, etc.
  INTERNAL_SERVER_ERROR: 500
};

// Skills Categories (populate in backend database)
export const SKILL_CATEGORIES = {
  'Programming & Development': [
    'JavaScript', 'Python', 'Java', 'C++', 'C#', 'React', 'Vue.js', 'Angular', 
    'Node.js', 'Django', 'Flask', 'Spring Boot', 'TypeScript', 'PHP', 'Ruby', 
    'Go', 'Rust', 'Swift', 'Kotlin', 'Flutter', 'React Native'
  ],
  'Data Science & Analytics': [
    'Machine Learning', 'Deep Learning', 'Data Analysis', 'Statistics', 
    'SQL', 'R', 'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'PyTorch', 
    'Data Visualization', 'Tableau', 'Power BI', 'Big Data', 'Hadoop', 'Spark'
  ],
  'Design & Creative': [
    'UI/UX Design', 'Graphic Design', 'Figma', 'Adobe Creative Suite', 
    'Sketch', 'Prototyping', 'User Research', 'Design Systems', 'Branding', 
    'Illustration', 'Photography', 'Video Editing', 'Animation', '3D Modeling'
  ],
  'Business & Management': [
    'Project Management', 'Digital Marketing', 'SEO', 'Content Marketing', 
    'Social Media Marketing', 'Business Analysis', 'Finance', 'Accounting', 
    'Entrepreneurship', 'Strategy', 'Operations', 'Product Management', 
    'Sales', 'Customer Service'
  ],
  'Cloud & DevOps': [
    'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'DevOps', 
    'CI/CD', 'Infrastructure as Code', 'Terraform', 'Monitoring', 
    'Linux', 'System Administration', 'Networking', 'Security'
  ],
  'Other Skills': [
    'Writing', 'Research', 'Public Speaking', 'Teaching', 'Languages', 
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Psychology', 
    'Economics', 'Law', 'Music', 'Art History', 'Philosophy'
  ]
};
// API Configuration for Backend Team
// This file contains all the API endpoints and data structures needed for backend integration

// Base API URL - Update this to match your backend server
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
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
  PROFILE: '/users/profile',
  UPDATE_PROFILE: '/users/profile',
  GET_USER: '/users/:id',
  UPDATE_SETTINGS: '/users/settings',
  UPLOAD_AVATAR: '/users/avatar'
};

// Skills Endpoints
export const SKILL_ENDPOINTS = {
  GET_ALL: '/skills',
  GET_BY_CATEGORY: '/skills/category/:category',
  SEARCH: '/skills/search',
  ADD_USER_SKILL: '/users/skills',
  REMOVE_USER_SKILL: '/users/skills/:skillId',
  UPDATE_SKILL_LEVEL: '/users/skills/:skillId'
};

// Matching Endpoints
export const MATCHING_ENDPOINTS = {
  FIND_MATCHES: '/matching/find',
  GET_SUGGESTIONS: '/matching/suggestions',
  SEND_CONNECTION: '/matching/connect',
  GET_CONNECTIONS: '/users/connections'
};

// Session Endpoints
export const SESSION_ENDPOINTS = {
  CREATE: '/sessions',
  GET_USER_SESSIONS: '/sessions/user/:userId',
  UPDATE_SESSION: '/sessions/:sessionId',
  CANCEL_SESSION: '/sessions/:sessionId/cancel',
  COMPLETE_SESSION: '/sessions/:sessionId/complete'
};

// Q&A Forum Endpoints
export const QA_ENDPOINTS = {
  GET_QUESTIONS: '/questions',
  CREATE_QUESTION: '/questions',
  GET_QUESTION: '/questions/:id',
  ANSWER_QUESTION: '/questions/:id/answers',
  VOTE_QUESTION: '/questions/:id/vote',
  VOTE_ANSWER: '/answers/:id/vote'
};

// Leaderboard Endpoints
export const LEADERBOARD_ENDPOINTS = {
  GET_TOP_USERS: '/leaderboard/users',
  GET_TOP_MENTORS: '/leaderboard/mentors',
  GET_USER_RANK: '/leaderboard/rank/:userId'
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
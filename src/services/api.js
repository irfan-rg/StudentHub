// API Service Functions for Frontend-Backend Communication
// This file contains all the API calls that the frontend components will use

import { API_CONFIG, AUTH_ENDPOINTS, USER_ENDPOINTS, SKILL_ENDPOINTS, MATCHING_ENDPOINTS, SESSION_ENDPOINTS, QA_ENDPOINTS, LEADERBOARD_ENDPOINTS } from '../config/api.js';

// Helper function to make HTTP requests
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
    ...options
  };

  // If sending FormData, let the browser set the Content-Type with boundary
  if (config.body instanceof FormData) {
    const headers = { ...config.headers };
    delete headers['Content-Type'];
    delete headers['content-type'];
    config.headers = headers;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Authentication Services
export const authService = {
  // User login
  login: async (credentials) => {
    try {
      const response = await apiRequest(AUTH_ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
      return response;
    } catch (error) {
      throw new Error('Login failed. Please check your credentials.');
    }
  },

  // User registration
  signup: async (userData) => {
    try {
      const response = await apiRequest(AUTH_ENDPOINTS.SIGNUP, {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      return response;
    } catch (error) {
      throw new Error('Registration failed. Please try again.');
    }
  },

  // User logout
  logout: async () => {
    try {
      await apiRequest(AUTH_ENDPOINTS.LOGOUT, {
        method: 'POST'
      });
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    } catch (error) {
      // Even if API call fails, clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  // Verify token
  verifyToken: async () => {
    try {
      const response = await apiRequest(AUTH_ENDPOINTS.VERIFY);
      return response;
    } catch (error) {
      throw new Error('Token verification failed');
    }
  }
};

// User Services
export const userService = {
  // Get user profile
  getProfile: async () => {
    try {
      const response = await apiRequest(USER_ENDPOINTS.PROFILE);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch user profile');
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await apiRequest(USER_ENDPOINTS.UPDATE_PROFILE, {
        method: 'PUT',
        body: JSON.stringify(userData)
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to update profile');
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await apiRequest(USER_ENDPOINTS.GET_USER.replace(':id', userId));
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch user data');
    }
  },

  // Update user settings
  updateSettings: async (settings) => {
    try {
      const response = await apiRequest(USER_ENDPOINTS.UPDATE_SETTINGS, {
        method: 'PUT',
        body: JSON.stringify(settings)
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to update settings');
    }
  },

  // Upload user avatar
  uploadAvatar: async (formData) => {
    try {
      const response = await apiRequest(USER_ENDPOINTS.UPLOAD_AVATAR, {
        method: 'POST',
        headers: {}, // Don't set content-type for FormData
        body: formData
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to upload avatar');
    }
  }
};

// Skills Services
export const skillsService = {
  // Get all skills
  getAllSkills: async () => {
    try {
      const response = await apiRequest(SKILL_ENDPOINTS.GET_ALL);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch skills');
    }
  },

  // Get skills by category
  getSkillsByCategory: async (category) => {
    try {
      const response = await apiRequest(SKILL_ENDPOINTS.GET_BY_CATEGORY.replace(':category', category));
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch skills by category');
    }
  },

  // Search skills
  searchSkills: async (query) => {
    try {
      const response = await apiRequest(`${SKILL_ENDPOINTS.SEARCH}?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to search skills');
    }
  },

  // Add skill to user profile
  addUserSkill: async (skillData) => {
    try {
      const response = await apiRequest(SKILL_ENDPOINTS.ADD_USER_SKILL, {
        method: 'POST',
        body: JSON.stringify(skillData)
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to add skill');
    }
  },

  // Remove skill from user profile
  removeUserSkill: async (skillId) => {
    try {
      await apiRequest(SKILL_ENDPOINTS.REMOVE_USER_SKILL.replace(':skillId', skillId), {
        method: 'DELETE'
      });
    } catch (error) {
      throw new Error('Failed to remove skill');
    }
  },

  // Update skill level
  updateSkillLevel: async (skillId, level) => {
    try {
      const response = await apiRequest(SKILL_ENDPOINTS.UPDATE_SKILL_LEVEL.replace(':skillId', skillId), {
        method: 'PUT',
        body: JSON.stringify({ level })
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to update skill level');
    }
  },

  // Bulk update skills to teach
  updateSkillsToTeach: async (skills) => {
    try {
      const response = await apiRequest(SKILL_ENDPOINTS.UPDATE_SKILLS_TO_TEACH, {
        method: 'PUT',
        body: JSON.stringify({ skills })
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to update teaching skills');
    }
  },

  // Bulk update skills to learn
  updateSkillsToLearn: async (skills) => {
    try {
      const response = await apiRequest(SKILL_ENDPOINTS.UPDATE_SKILLS_TO_LEARN, {
        method: 'PUT',
        body: JSON.stringify({ skills })
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to update learning skills');
    }
  }
};

// Matching Services
export const matchingService = {
  // Find potential matches
  findMatches: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await apiRequest(`${MATCHING_ENDPOINTS.FIND_MATCHES}?${queryParams}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to find matches');
    }
  },

  // Get match suggestions
  getSuggestions: async () => {
    try {
      const response = await apiRequest(MATCHING_ENDPOINTS.GET_SUGGESTIONS);
      return response.data;
    } catch (error) {
      throw new Error('Failed to get suggestions');
    }
  },

  // Send connection request
  sendConnection: async (targetUserId, message) => {
    try {
      const response = await apiRequest(MATCHING_ENDPOINTS.SEND_CONNECTION, {
        method: 'POST',
        body: JSON.stringify({ targetUserId, message })
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to send connection request');
    }
  },

  // Get user connections
  getConnections: async () => {
    try {
      const response = await apiRequest(MATCHING_ENDPOINTS.GET_CONNECTIONS);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch connections');
    }
  }
};

// Session Services
export const sessionService = {
  // Create new session
  createSession: async (sessionData) => {
    try {
      const response = await apiRequest(SESSION_ENDPOINTS.CREATE_SESSION, {
        method: 'POST',
        body: JSON.stringify(sessionData)
      });
      return response.data?.session || response.data;
    } catch (error) {
      throw new Error('Failed to create session');
    }
  },

  // Get sessions created by the authenticated user
  getCreatedSessions: async () => {
    try {
      const response = await apiRequest(SESSION_ENDPOINTS.GET_CREATED_SESSIONS);
      return response.data?.sessions || [];
    } catch (error) {
      throw new Error('Failed to fetch sessions');
    }
  },

  // Get sessions the user has joined
  getJoinedSessions: async () => {
    try {
      const response = await apiRequest(SESSION_ENDPOINTS.GET_JOINED_SESSIONS);
      return response.data?.sessions || [];
    } catch (error) {
      throw new Error('Failed to fetch joined sessions');
    }
  },

  // Get a session by id
  getSessionById: async (sessionId) => {
    try {
      const response = await apiRequest(SESSION_ENDPOINTS.GET_SESSION_BY_ID.replace(':sessionId', sessionId));
      return response.data?.session || response.data;
    } catch (error) {
      throw new Error('Failed to fetch session');
    }
  },

  // Accept session invite
  acceptSession: async (sessionId) => {
    try {
      const response = await apiRequest(SESSION_ENDPOINTS.ACCEPT_SESSION, {
        method: 'POST',
        body: JSON.stringify({ sessionId })
      });
      return response.data?.session || response.data;
    } catch (error) {
      throw new Error('Failed to accept session');
    }
  },

  // Cancel session participation
  cancelSession: async (sessionId) => {
    try {
      const response = await apiRequest(SESSION_ENDPOINTS.CANCEL_SESSION, {
        method: 'POST',
        body: JSON.stringify({ sessionId })
      });
      return response.data?.session || response.data;
    } catch (error) {
      throw new Error('Failed to cancel session');
    }
  },

  // Delete a session created by the user
  deleteSession: async (sessionId) => {
    try {
      const response = await apiRequest(SESSION_ENDPOINTS.DELETE_SESSION, {
        method: 'POST',
        body: JSON.stringify({ sessionId })
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to delete session');
    }
  },

  // Update a session
  updateSession: async (sessionId, updates) => {
    try {
      const response = await apiRequest(SESSION_ENDPOINTS.UPDATE_SESSION || `/session/${sessionId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      return response.data?.session || response.data;
    } catch (error) {
      throw new Error('Failed to update session');
    }
  },

  // Rate a session
  rateSession: async ({ sessionId, rating, comment }) => {
    try {
      const response = await apiRequest(SESSION_ENDPOINTS.RATE_SESSION, {
        method: 'POST',
        body: JSON.stringify({ sessionId, rating, comment })
      });
      return response.data?.session || response.data;
    } catch (error) {
      throw new Error('Failed to rate session');
    }
  }
};

// Q&A Forum Services
export const qaService = {
  // Get all questions
  getAllQuestions: async () => {
    try {
      const response = await apiRequest(QA_ENDPOINTS.GET_ALL_QUESTIONS);
      return response.data?.outputQuestions || [];
    } catch (error) {
      throw new Error('Failed to fetch questions');
    }
  },

  // Get questions by current user
  getMyQuestions: async () => {
    try {
      const response = await apiRequest(QA_ENDPOINTS.GET_QUESTIONS_BY_USER);
      return response.data?.outputQuestions || [];
    } catch (error) {
      throw new Error('Failed to fetch your questions');
    }
  },

  // Ask a new question
  askQuestion: async (questionData) => {
    try {
      const response = await apiRequest(QA_ENDPOINTS.ASK_QUESTION, {
        method: 'POST',
        body: JSON.stringify(questionData)
      });
      return response.data?.question || response.data;
    } catch (error) {
      throw new Error('Failed to ask question');
    }
  },

  // Submit answer to question
  answerQuestion: async (questionId, answer) => {
    try {
      const response = await apiRequest(QA_ENDPOINTS.ANSWER_QUESTION, {
        method: 'POST',
        body: JSON.stringify({ questionId, answer })
      });
      return response.data?.question || response.data;
    } catch (error) {
      throw new Error('Failed to submit answer');
    }
  },

  // Upvote a question
  upvoteQuestion: async (questionId) => {
    try {
      const response = await apiRequest(QA_ENDPOINTS.UPVOTE_QUESTION, {
        method: 'PUT',
        body: JSON.stringify({ questionId })
      });
      return response.data?.question || response.data;
    } catch (error) {
      throw new Error('Failed to upvote question');
    }
  },

  // Downvote a question
  downvoteQuestion: async (questionId) => {
    try {
      const response = await apiRequest(QA_ENDPOINTS.DOWNVOTE_QUESTION, {
        method: 'PUT',
        body: JSON.stringify({ questionId })
      });
      return response.data?.question || response.data;
    } catch (error) {
      throw new Error('Failed to downvote question');
    }
  },

  // Upvote an answer
  upvoteAnswer: async (questionId, answerId) => {
    try {
      const response = await apiRequest(QA_ENDPOINTS.UPVOTE_ANSWER, {
        method: 'PUT',
        body: JSON.stringify({ questionId, answerId })
      });
      return response.data?.question || response.data;
    } catch (error) {
      throw new Error('Failed to upvote answer');
    }
  },

  // Downvote an answer
  downvoteAnswer: async (questionId, answerId) => {
    try {
      const response = await apiRequest(QA_ENDPOINTS.DOWNVOTE_ANSWER, {
        method: 'PUT',
        body: JSON.stringify({ questionId, answerId })
      });
      return response.data?.question || response.data;
    } catch (error) {
      throw new Error('Failed to downvote answer');
    }
  }
};

// Leaderboard Services
export const leaderboardService = {
  // Get top users
  getTopUsers: async (limit = 50) => {
    try {
      const response = await apiRequest(`${LEADERBOARD_ENDPOINTS.GET_TOP_USERS}?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch leaderboard');
    }
  },

  // Get top mentors
  getTopMentors: async (limit = 50) => {
    try {
      const response = await apiRequest(`${LEADERBOARD_ENDPOINTS.GET_TOP_MENTORS}?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch top mentors');
    }
  },

  // Get user rank
  getUserRank: async (userId) => {
    try {
      const response = await apiRequest(LEADERBOARD_ENDPOINTS.GET_USER_RANK.replace(':userId', userId));
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch user rank');
    }
  }
};

// Notification Services
export const notificationService = {
  // Get user notifications
  getNotifications: async (page = 1, limit = 20) => {
    try {
      const response = await apiRequest(`/notifications?page=${page}&limit=${limit}`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch notifications');
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      await apiRequest(`/notifications/${notificationId}/read`, {
        method: 'PUT'
      });
    } catch (error) {
      throw new Error('Failed to mark notification as read');
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      await apiRequest('/notifications/read-all', {
        method: 'PUT'
      });
    } catch (error) {
      throw new Error('Failed to mark all notifications as read');
    }
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    try {
      await apiRequest(`/notifications/${notificationId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      throw new Error('Failed to delete notification');
    }
  },

  // Clear all notifications
  clearAll: async () => {
    try {
      await apiRequest('/notifications', {
        method: 'DELETE'
      });
    } catch (error) {
      throw new Error('Failed to clear all notifications');
    }
  },

  // Get unread count
  getUnreadCount: async () => {
    try {
      const response = await apiRequest('/notifications/unread-count');
      return response.data;
    } catch (error) {
      throw new Error('Failed to get unread count');
    }
  },

  // Respond to session invite (accept/decline)
  respondToSessionInvite: async (notificationId, action) => {
    try {
      const response = await apiRequest(`/notifications/${notificationId}/respond`, {
        method: 'POST',
        body: JSON.stringify({ action })
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to respond to session invite');
    }
  },
};

// Utility function to handle API errors globally
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  // Handle common error scenarios
  if (error.message.includes('401') || error.message.includes('Unauthorized')) {
    // Token expired or invalid
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/';
  } else if (error.message.includes('403')) {
    // Forbidden - user doesn't have permission
    return 'You do not have permission to perform this action.';
  } else if (error.message.includes('404')) {
    // Not found
    return 'The requested resource was not found.';
  } else if (error.message.includes('500')) {
    // Server error
    return 'Server error. Please try again later.';
  }
  
  return error.message || 'An unexpected error occurred.';
};
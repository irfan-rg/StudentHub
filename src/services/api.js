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
      const response = await apiRequest(SESSION_ENDPOINTS.CREATE, {
        method: 'POST',
        body: JSON.stringify(sessionData)
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to create session');
    }
  },

  // Get user sessions
  getUserSessions: async (userId) => {
    try {
      const response = await apiRequest(SESSION_ENDPOINTS.GET_USER_SESSIONS.replace(':userId', userId));
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch sessions');
    }
  },

  // Update session
  updateSession: async (sessionId, updates) => {
    try {
      const response = await apiRequest(SESSION_ENDPOINTS.UPDATE_SESSION.replace(':sessionId', sessionId), {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to update session');
    }
  },

  // Cancel session
  cancelSession: async (sessionId, reason) => {
    try {
      await apiRequest(SESSION_ENDPOINTS.CANCEL_SESSION.replace(':sessionId', sessionId), {
        method: 'POST',
        body: JSON.stringify({ reason })
      });
    } catch (error) {
      throw new Error('Failed to cancel session');
    }
  },

  // Complete session
  completeSession: async (sessionId, feedback) => {
    try {
      const response = await apiRequest(SESSION_ENDPOINTS.COMPLETE_SESSION.replace(':sessionId', sessionId), {
        method: 'POST',
        body: JSON.stringify(feedback)
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to complete session');
    }
  }
};

// Q&A Forum Services
export const qaService = {
  // Get questions with pagination
  getQuestions: async (page = 1, limit = 10, filters = {}) => {
    try {
      const queryParams = new URLSearchParams({ page, limit, ...filters }).toString();
      const response = await apiRequest(`${QA_ENDPOINTS.GET_QUESTIONS}?${queryParams}`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch questions');
    }
  },

  // Create new question
  createQuestion: async (questionData) => {
    try {
      const response = await apiRequest(QA_ENDPOINTS.CREATE_QUESTION, {
        method: 'POST',
        body: JSON.stringify(questionData)
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to create question');
    }
  },

  // Get single question with answers
  getQuestion: async (questionId) => {
    try {
      const response = await apiRequest(QA_ENDPOINTS.GET_QUESTION.replace(':id', questionId));
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch question');
    }
  },

  // Submit answer to question
  answerQuestion: async (questionId, content) => {
    try {
      const response = await apiRequest(QA_ENDPOINTS.ANSWER_QUESTION.replace(':id', questionId), {
        method: 'POST',
        body: JSON.stringify({ content })
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to submit answer');
    }
  },

  // Vote on question
  voteQuestion: async (questionId, vote) => {
    try {
      const response = await apiRequest(QA_ENDPOINTS.VOTE_QUESTION.replace(':id', questionId), {
        method: 'POST',
        body: JSON.stringify({ vote }) // vote: 'up' or 'down'
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to vote on question');
    }
  },

  // Vote on answer
  voteAnswer: async (answerId, vote) => {
    try {
      const response = await apiRequest(QA_ENDPOINTS.VOTE_ANSWER.replace(':id', answerId), {
        method: 'POST',
        body: JSON.stringify({ vote }) // vote: 'up' or 'down'
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to vote on answer');
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
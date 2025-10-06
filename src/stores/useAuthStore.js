import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Temporary mock user until backend is connected
const mockUser = {
  id: 1,
  name: 'Alex Chen',
  email: 'alex.chen@university.edu',
  college: 'MIT',
  educationLevel: 'Undergraduate',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  skillsCanTeach: [
    { name: 'React', level: 'advanced' },
    { name: 'JavaScript', level: 'expert' },
    { name: 'Python', level: 'intermediate' },
    { name: 'Data Analysis', level: 'intermediate' },
    { name: 'UI/UX Design', level: 'advanced' },
    { name: 'Machine Learning', level: 'beginner' },
    { name: 'TypeScript', level: 'advanced' },
    { name: 'Node.js', level: 'intermediate' }
  ],
  skillsWantToLearn: ['Machine Learning', 'DevOps', 'System Design', 'Advanced Statistics'],
  points: 2450,
  badges: ['Helper', 'Quick Learner', 'Top Contributor'],
  level: 'Advanced',
  sessionsCompleted: 12,
  questionsAnswered: 34,
  questionsAsked: 18
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      initialized: false,

      initialize: () => {
        // Rehydration handled by persist; just mark initialized
        if (!get().initialized) {
          set({ initialized: true });
        }
      },

      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          // Replace with real API call when backend is ready
          const response = { user: mockUser, token: 'mock-token' };
          set({ user: response.user, token: response.token, loading: false });
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          return response;
        } catch (e) {
          set({ error: 'Login failed. Please check your credentials.', loading: false });
          throw e;
        }
      },

      signup: async (userData) => {
        set({ loading: true, error: null });
        try {
          // Replace with real API call when backend is ready
          const response = { user: { ...mockUser, ...userData }, token: 'mock-token' };
          set({ user: response.user, token: response.token, loading: false });
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          return response;
        } catch (e) {
          set({ error: 'Signup failed. Please try again.', loading: false });
          throw e;
        }
      },

      logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        set({ user: null, token: null, error: null });
      },

      updateUser: (userData) => {
        const updatedUser = { ...get().user, ...userData };
        set({ user: updatedUser });
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);



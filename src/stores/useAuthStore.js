import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/api.js';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      sessionExpired: false,
      setSessionExpired: (val) => set({ sessionExpired: val }),
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
          const response = await authService.login(credentials);
          set({ user: response.user, token: response.token, loading: false });
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          return response;
        } catch (e) {
          set({ error: e.message || 'Login failed. Please check your credentials.', loading: false });
          throw e;
        }
      },

      signup: async (userData) => {
        set({ loading: true, error: null });
        try {
          const response = await authService.signup(userData);
          set({ user: response.user, token: response.token, loading: false });
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          return response;
        } catch (e) {
          set({ error: e.message || 'Signup failed. Please try again.', loading: false });
          throw e;
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch (e) {
          console.error('Logout API call failed:', e);
        } finally {
          localStorage.removeItem('authToken');
          // Reset session expired flag on logout
          set({ sessionExpired: false });
          localStorage.removeItem('user');
          set({ user: null, token: null, error: null });
        }
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



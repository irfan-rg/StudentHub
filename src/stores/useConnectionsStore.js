import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Mock data for fallback (when backend is not available)
const MOCK_SUGGESTED_CONNECTIONS = [
  {
    id: 1,
    name: 'Emma Watson',
    college: 'Harvard University',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=150&h=150&fit=crop&crop=face',
    skillsCanTeach: [
      { name: 'Machine Learning', level: 'expert' },
      { name: 'Python', level: 'advanced' }
    ],
    points: 3250,
    sessions: 28,
    matchPercentage: 95
  },
  {
    id: 2,
    name: 'David Kim',
    college: 'Stanford University',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    skillsCanTeach: [
      { name: 'UI/UX Design', level: 'expert' },
      { name: 'Figma', level: 'advanced' }
    ],
    points: 2890,
    sessions: 22,
    matchPercentage: 88
  },
  {
    id: 3,
    name: 'Sarah Chen',
    college: 'MIT',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    skillsCanTeach: [
      { name: 'DevOps', level: 'advanced' },
      { name: 'Docker', level: 'intermediate' }
    ],
    points: 2150,
    sessions: 15,
    matchPercentage: 82
  }
];

export const useConnectionsStore = create(
  persist(
    (set, get) => ({
      suggested: MOCK_SUGGESTED_CONNECTIONS,
      connections: [],
      connectionRequests: {},
      isLoading: false,
      error: null,

      setConnections: (connections) => set({ connections }),

      // Fetch suggested connections from backend
      loadSuggestedConnections: async () => {
        set({ isLoading: true, error: null });
        try {
          const token = localStorage.getItem('authToken');
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/matching/suggestions`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              ...(token && { Authorization: `Bearer ${token}` })
            }
          });

          if (!response.ok) {
            throw new Error('Failed to fetch suggested connections');
          }

          const data = await response.json();
          set({ suggested: data.data || data, isLoading: false });
          return data.data || data;
        } catch (error) {
          console.error('Error loading suggested connections:', error);
          set({ error: error.message, isLoading: false });
          // Fallback to mock data
          set({ suggested: MOCK_SUGGESTED_CONNECTIONS });
          return MOCK_SUGGESTED_CONNECTIONS;
        }
      },

      // Fetch user's connections from backend
      loadConnections: async () => {
        set({ isLoading: true, error: null });
        try {
          const token = localStorage.getItem('authToken');
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/matching/connections`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              ...(token && { Authorization: `Bearer ${token}` })
            }
          });

          if (!response.ok) {
            throw new Error('Failed to fetch connections');
          }

          const data = await response.json();
          set({ connections: data.data || data, isLoading: false });
          return data.data || data;
        } catch (error) {
          console.error('Error loading connections:', error);
          set({ error: error.message, isLoading: false });
          return get().connections;
        }
      },

      // Fetch connection requests from backend
      loadConnectionRequests: async () => {
        try {
          const token = localStorage.getItem('authToken');
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/matching/connection-requests`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              ...(token && { Authorization: `Bearer ${token}` })
            }
          });

          if (!response.ok) {
            throw new Error('Failed to fetch connection requests');
          }

          const data = await response.json();
          const requestsMap = {};
          if (Array.isArray(data.data)) {
            data.data.forEach(req => {
              requestsMap[req.userId] = req.status === 'pending';
            });
          }
          set({ connectionRequests: requestsMap });
          return requestsMap;
        } catch (error) {
          console.error('Error loading connection requests:', error);
          return get().connectionRequests;
        }
      },

      // Send connection request to backend
      sendConnectionRequest: async (partnerId, message = '') => {
        try {
          const token = localStorage.getItem('authToken');
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/matching/connect`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token && { Authorization: `Bearer ${token}` })
            },
            body: JSON.stringify({ partnerId, message })
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to send connection request');
          }

          const data = await response.json();
          
          // Update local state
          set({
            connectionRequests: {
              ...get().connectionRequests,
              [partnerId]: true
            }
          });

          return data;
        } catch (error) {
          console.error('Error sending connection request:', error);
          throw error;
        }
      },

      // Delete connection from backend
      deleteConnection: async (connectionId) => {
        try {
          const token = localStorage.getItem('authToken');
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/matching/connections/${connectionId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              ...(token && { Authorization: `Bearer ${token}` })
            }
          });

          if (!response.ok) {
            throw new Error('Failed to delete connection');
          }

          // Update local state
          set({
            connections: get().connections.filter(c => c.id !== connectionId)
          });

          return true;
        } catch (error) {
          console.error('Error deleting connection:', error);
          throw error;
        }
      },

      // Accept connection request
      acceptConnectionRequest: async (requesterId) => {
        try {
          const token = localStorage.getItem('authToken');
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/matching/accept-request`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token && { Authorization: `Bearer ${token}` })
            },
            body: JSON.stringify({ requesterId })
          });

          if (!response.ok) {
            throw new Error('Failed to accept connection request');
          }

          const data = await response.json();
          
          // Remove from pending requests and add to connections
          const newRequests = { ...get().connectionRequests };
          delete newRequests[requesterId];
          set({ connectionRequests: newRequests });

          // Reload connections to get the new connection
          await get().loadConnections();

          return data;
        } catch (error) {
          console.error('Error accepting connection request:', error);
          throw error;
        }
      },

      // Reject connection request
      rejectConnectionRequest: async (requesterId) => {
        try {
          const token = localStorage.getItem('authToken');
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/matching/reject-request`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token && { Authorization: `Bearer ${token}` })
            },
            body: JSON.stringify({ requesterId })
          });

          if (!response.ok) {
            throw new Error('Failed to reject connection request');
          }

          // Remove from pending requests
          const newRequests = { ...get().connectionRequests };
          delete newRequests[requesterId];
          set({ connectionRequests: newRequests });

          return true;
        } catch (error) {
          console.error('Error rejecting connection request:', error);
          throw error;
        }
      }
    }),
    {
      name: 'connections-storage'
    }
  )
);



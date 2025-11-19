import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useConnectionsStore = create(
  persist(
    (set, get) => ({
      suggested: [],
      connections: [],
      connectionRequests: {},
      isLoading: false,
      error: null,

      setConnections: (connections) => set({ connections }),

      // Fetch suggested connections (ML-based) from backend
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
          const rawSuggestions = data.data?.matches || data.data || data || [];

          // Normalize shape so components can rely on id/matchPercentage etc.
          const suggestedData = rawSuggestions.map((u) => ({
            id: u._id || u.id,
            _id: u._id || u.id,
            name: u.name,
            email: u.email,
            college: u.college,
            educationLevel: u.educationLevel,
            avatar: u.avatar,
            skillsCanTeach: u.skillsCanTeach || [],
            skillsWantToLearn: u.skillsWantToLearn || [],
            points: u.points ?? 0,
            sessionsCompleted: u.sessionsCompleted ?? 0,
            questionsAnswered: u.questionsAnswered ?? 0,
            rating: u.rating ?? 0,
            // similarity is 0–100 from backend; keep and expose as matchPercentage
            similarity: u.similarity ?? 0,
            matchPercentage: Math.round(u.similarity ?? 0)
          }));

          set({ suggested: suggestedData, isLoading: false });
          return suggestedData;
        } catch (error) {
          console.error('Error loading suggested connections:', error);
          set({ error: error.message, isLoading: false, suggested: [] });
          return [];
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
          // Backend returns data.data.connections
          const connectionsData = data.data?.connections || data.data || data || [];
          const connArray = Array.isArray(connectionsData) ? connectionsData : [];
          // Normalize connections to ensure consistent id/_id fields as strings
          const normalizedConnections = connArray.map(c => ({
            ...c,
            id: String(c._id || c.id || ''),
            _id: String(c._id || c.id || '')
          }));
          // Remove any pending requests for users who are now connected
          const connectionIds = normalizedConnections.map(c => (c.id || c._id || '').toString());
          const currentRequests = get().connectionRequests || {};
          const cleanedRequests = { ...currentRequests };
          Object.keys(cleanedRequests).forEach(k => {
            if (connectionIds.includes(k.toString())) delete cleanedRequests[k];
          });
          set({ connections: normalizedConnections, connectionRequests: cleanedRequests, isLoading: false });
          return connArray;
        } catch (error) {
          console.error('Error loading connections:', error);
          set({ error: error.message, isLoading: false, connections: [] });
          return [];
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



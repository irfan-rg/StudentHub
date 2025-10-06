import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSessionStore = create(
  persist(
    (set, get) => ({
      sessions: [
        {
          id: 1,
          title: 'React Hooks Deep Dive',
          partner: 'Emma Watson',
          date: 'Today',
          time: '2:00 PM',
          type: 'Video Call',
          status: 'confirmed',
          sessionLink: ''
        },
        {
          id: 2,
          title: 'Python Data Analysis',
          partner: 'David Kim',
          date: 'Tomorrow',
          time: '10:00 AM',
          type: 'Video Call',
          status: 'pending',
          sessionLink: ''
        }
      ],

      setSessions: (sessions) => set({ sessions }),

      createSession: (session) => {
        const newSession = { id: Date.now(), status: 'pending', ...session };
        set({ sessions: [...get().sessions, newSession] });
        return newSession;
      },

      updateSession: (sessionId, updates) => {
        set({
          sessions: get().sessions.map(s => (s.id === sessionId ? { ...s, ...updates } : s))
        });
      },

      deleteSession: (sessionId) => {
        set({ sessions: get().sessions.filter(s => s.id !== sessionId) });
      },

      // Placeholder for backend
      loadSessions: async (userId) => {
        // Replace with API call when backend is ready
        return get().sessions;
      }
    }),
    {
      name: 'sessions-storage'
    }
  )
);



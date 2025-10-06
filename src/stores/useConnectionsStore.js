import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const suggestedConnections = [
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
      suggested: suggestedConnections,
      connections: [
        { id: 1, name: 'Emma Watson', college: 'Harvard University', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=150&h=150&fit=crop&crop=face', status: 'connected' },
        { id: 2, name: 'David Kim', college: 'Stanford University', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', status: 'connected' }
      ],
      connectionRequests: {},

      setConnections: (connections) => set({ connections }),

      sendConnectionRequest: (partnerId) => {
        const partner = get().suggested.find(c => c.id === partnerId);
        if (!partner) return false;
        if (get().connections.some(c => c.id === partnerId)) return true;
        set({ connectionRequests: { ...get().connectionRequests, [partnerId]: true } });
        // Simulate acceptance
        setTimeout(() => {
          set({
            connections: [
              ...get().connections,
              { id: partner.id, name: partner.name, college: partner.college, avatar: partner.avatar, status: 'connected' }
            ],
            connectionRequests: Object.fromEntries(Object.entries(get().connectionRequests).filter(([id]) => parseInt(id) !== partnerId))
          });
        }, 1500);
        return true;
      },

      deleteConnection: (connectionId) => {
        set({ connections: get().connections.filter(c => c.id !== connectionId) });
      },

      // Placeholder for backend
      loadConnections: async () => {
        return get().connections;
      }
    }),
    {
      name: 'connections-storage'
    }
  )
);



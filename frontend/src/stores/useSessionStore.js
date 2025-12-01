import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { sessionService, userService } from '../services/api.js'

const normalizeSession = (session) => {
  if (!session) return null

  const sessionDoc = session.session || session.sessionData || session.sessionDetails || session
  if (!sessionDoc) return null

  const sessionType = sessionDoc.sessionType || sessionDoc.type || ''
  const typeSource = typeof sessionType === 'string' ? sessionType.toLowerCase() : ''
  const type = typeSource.includes('video') ? 'video' : 'inperson'

  const sessionOn = sessionDoc.sessionOn || sessionDoc.date || sessionDoc.dateIso || ''
  let isoDate = ''
  if (sessionOn) {
    if (typeof sessionOn === 'string' && sessionOn.includes('T')) {
      isoDate = sessionOn
    } else {
      const parsed = new Date(sessionOn)
      if (!isNaN(parsed.getTime())) {
        isoDate = parsed.toISOString()
      }
    }
  }

  const statusSource = sessionDoc.status || 'upcoming'
  const normalizedStatus = typeof statusSource === 'string' ? statusSource.toLowerCase() : 'upcoming'

  const normalized = {
    id: sessionDoc._id || sessionDoc.id,
    title: sessionDoc.topic || sessionDoc.title || '',
    description: sessionDoc.details || sessionDoc.description || '',
    type,
    duration: sessionDoc.duration || '',
    preferredTimes: sessionDoc.preferedTimings || sessionDoc.preferredTimes || '',
    meetingLink: sessionDoc.link || sessionDoc.meetingLink || '',
    sessionLink: sessionDoc.sessionLink || sessionDoc.link || sessionDoc.meetingLink || '',
    meetingAddress: sessionDoc.location || sessionDoc.meetingAddress || '',
    dateIso: isoDate,
    status: normalizedStatus,
    averageRating: sessionDoc.averageRating || 0,
    ratings: sessionDoc.ratings || [],
    raw: sessionDoc,
    original: session
  }

  const otherUser = session.otherUser || session.connectionUser || session.connection || session.partner || sessionDoc.otherUser || null
  if (otherUser) {
    normalized.otherUser = otherUser
    normalized.partner = otherUser.name || otherUser.fullName || otherUser?.displayName || (typeof otherUser === 'string' ? otherUser : '')
  }

  // Also include createdBy (creator) if available for easier UI access
  // creator can be named differently or be on the original/source doc
  const creatorSource = sessionDoc.createdBy || sessionDoc.creator || session.original?.createdBy || session.raw?.createdBy || session.createdBy || session.owner || session.host;
  if (creatorSource) {
    normalized.creator = creatorSource
  }

  // Populate a readable date/time for convenience
  if (normalized.dateIso) {
    try {
      const d = new Date(normalized.dateIso)
      if (!isNaN(d.getTime())) {
        normalized.date = d.toLocaleDateString();
        normalized.time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    } catch (err) {
      // ignore formatting errors
    }
  }

  // If no partner provided, try to populate from creator if available (for joined sessions)
  if (!normalized.partner && normalized.creator) {
    normalized.partner = normalized.creator.name || normalized.creator.fullName || (typeof normalized.creator === 'string' ? normalized.creator : '')
  }

  return normalized
}

export const useSessionStore = create(
  persist(
    (set, get) => ({
      sessions: [],
      joinedSessions: [],
      loading: false,
      error: null,

      setSessions: (sessions) => set({ sessions }),
      setHighlightedSessionId: (id) => set({ highlightedSessionId: id }),

      loadSessions: async () => {
        set({ loading: true, error: null })
        try {
          const data = await sessionService.getCreatedSessions()
          const normalized = Array.isArray(data) ? data.map(normalizeSession).filter(Boolean) : []
          // If partner is an ObjectId string, try to resolve the partner name from userService
          const normalizedWithNames = await Promise.all(normalized.map(async (s) => {
            if (s && s.partner && typeof s.partner === 'string' && /^[a-fA-F0-9]{24}$/.test(s.partner)) {
              try {
                const user = await userService.getUserById(s.partner)
                if (user) {
                  const n = user.name || user.user?.name || user.fullName || user.displayName
                  if (n) s.partner = n
                }
              } catch (err) {
                // ignore errors, leave ID as-is
              }
            }
            return s
          }))
          set({ sessions: normalizedWithNames, loading: false })
          return normalizedWithNames;
        } catch (error) {
          console.error('Error loading sessions:', error);
          set({ error: error.message || 'Failed to load sessions', loading: false, sessions: [] })
          return [];
        }
      },

      loadJoinedSessions: async () => {
        set({ loading: true, error: null })
        try {
          const data = await sessionService.getJoinedSessions()
          let normalized = Array.isArray(data) ? data.map(normalizeSession).filter(Boolean) : []

          // If any session does not have a populated createdBy (creator), try to rehydrate
          // by fetching session details that may include the populated createdBy
          const rehydrated = await Promise.all(normalized.map(async (session) => {
            const hasCreator = session.creator || (session.raw && session.raw.createdBy && typeof session.raw.createdBy === 'object' && session.raw.createdBy !== null)
            if (hasCreator) return session
            try {
              const full = await sessionService.getSessionById(session.id)
              const re = normalizeSession(full)
              return re || session
            } catch (err) {
              return session
            }
          }))
          normalized = rehydrated
          // Resolve partner names for any entries where partner is an objectId
          const normalizedWithNames = await Promise.all(normalized.map(async (s) => {
            if (s && s.partner && typeof s.partner === 'string' && /^[a-fA-F0-9]{24}$/.test(s.partner)) {
              try {
                const user = await userService.getUserById(s.partner)
                if (user) {
                  const n = user.name || user.user?.name || user.fullName || user.displayName
                  if (n) s.partner = n
                }
              } catch (err) {
                // ignore
              }
            }
            return s
          }))
          normalized = normalizedWithNames
          set({ joinedSessions: normalized, loading: false })
          return normalized
        } catch (error) {
          set({ error: error.message || 'Failed to load joined sessions', loading: false })
          throw error
        }
      },

      createSession: async (sessionPayload) => {
        set({ loading: true, error: null })
        try {
          const created = await sessionService.createSession(sessionPayload)
          let normalized = normalizeSession(created)
          if (normalized && normalized.partner && typeof normalized.partner === 'string' && /^[a-fA-F0-9]{24}$/.test(normalized.partner)) {
            try {
              const user = await userService.getUserById(normalized.partner)
              if (user) normalized.partner = user.name || user.fullName || user.displayName || normalized.partner
            } catch (err) {
              // ignore
            }
          }
          set({ sessions: normalized ? [normalized, ...get().sessions] : get().sessions, loading: false })
          // Refresh current user profile in case server awarded points for creating a session
          try {
            const { userService } = await import('../services/api.js');
            const profile = await userService.getProfile();
            const { useAuthStore } = await import('./useAuthStore.js');
            useAuthStore.getState().updateUser(profile?.user || {});
          } catch (err) {
            // non-blocking
            console.warn('Failed to refresh profile after creating session', err);
          }
          return normalized
        } catch (error) {
          set({ error: error.message || 'Failed to create session', loading: false })
          throw error
        }
      },

      deleteSession: async (sessionId) => {
        set({ loading: true, error: null })
        try {
          await sessionService.deleteSession(sessionId)
          set({
            sessions: get().sessions.filter((session) => session.id !== sessionId),
            loading: false
          })
        } catch (error) {
          set({ error: error.message || 'Failed to delete session', loading: false })
          throw error
        }
      },

      updateSession: async (sessionId, updates) => {
        set({ loading: true, error: null })
        try {
          const updated = await sessionService.updateSession(sessionId, updates)
          let normalized = normalizeSession(updated)
          if (normalized && normalized.partner && typeof normalized.partner === 'string' && /^[a-fA-F0-9]{24}$/.test(normalized.partner)) {
            try {
              const user = await userService.getUserById(normalized.partner)
              if (user) normalized.partner = user.name || user.fullName || user.displayName || normalized.partner
            } catch (err) {
              // ignore
            }
          }
          if (normalized) {
            set({
              sessions: get().sessions.map(session => session.id === normalized.id ? normalized : session),
              loading: false
            })
          } else {
            set({ loading: false })
          }
          return normalized
        } catch (error) {
          set({ error: error.message || 'Failed to update session', loading: false })
          throw error
        }
      },

      rateSession: async ({ sessionId, rating, comment }) => {
        set({ loading: true, error: null })
        try {
          const updated = await sessionService.rateSession({ sessionId, rating, comment })
          let normalized = normalizeSession(updated)
          if (normalized && normalized.partner && typeof normalized.partner === 'string' && /^[a-fA-F0-9]{24}$/.test(normalized.partner)) {
            try {
              const user = await userService.getUserById(normalized.partner)
              if (user) normalized.partner = user.name || user.fullName || user.displayName || normalized.partner
            } catch (err) {
              // ignore
            }
          }
          if (normalized) {
            set({
              sessions: get().sessions.map(session => session.id === normalized.id ? normalized : session),
              joinedSessions: get().joinedSessions.map(session => session.id === normalized.id ? normalized : session),
              loading: false
            })
          } else {
            set({ loading: false })
          }
          return normalized
        } catch (error) {
          set({ error: error.message || 'Failed to rate session', loading: false })
          throw error
        }
      },

      resetSessions: () => {
        set({ sessions: [], joinedSessions: [], error: null })
      }
    }),
    {
      name: 'sessions-storage',
      partialize: (state) => ({ sessions: state.sessions, joinedSessions: state.joinedSessions, highlightedSessionId: state.highlightedSessionId })
    }
  )
)

// Export normalizeSession for tests and external utilities
export { normalizeSession };



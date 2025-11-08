import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { sessionService } from '../services/api.js'

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

      loadSessions: async () => {
        set({ loading: true, error: null })
        try {
          const data = await sessionService.getCreatedSessions()
          const normalized = Array.isArray(data) ? data.map(normalizeSession).filter(Boolean) : []
          set({ sessions: normalized, loading: false })
          return normalized
        } catch (error) {
          set({ error: error.message || 'Failed to load sessions', loading: false })
          throw error
        }
      },

      loadJoinedSessions: async () => {
        set({ loading: true, error: null })
        try {
          const data = await sessionService.getJoinedSessions()
          const normalized = Array.isArray(data) ? data.map(normalizeSession).filter(Boolean) : []
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
          const normalized = normalizeSession(created)
          set({ sessions: normalized ? [normalized, ...get().sessions] : get().sessions, loading: false })
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

      rateSession: async ({ sessionId, rating, comment }) => {
        set({ loading: true, error: null })
        try {
          const updated = await sessionService.rateSession({ sessionId, rating, comment })
          const normalized = normalizeSession(updated)
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
      partialize: (state) => ({ sessions: state.sessions, joinedSessions: state.joinedSessions })
    }
  )
)



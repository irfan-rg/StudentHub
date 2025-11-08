import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { qaService } from '../services/api.js';

// Helper to normalize backend question data to frontend format
const normalizeQuestion = (backendQuestion, currentUserId) => {
  if (!backendQuestion) return null;

  const upvotesArray = Array.isArray(backendQuestion.upVotes) ? backendQuestion.upVotes : [];
  const downvotesArray = Array.isArray(backendQuestion.downVotes) ? backendQuestion.downVotes : [];
  
  // Calculate user vote: 1 for upvote, -1 for downvote, 0 for none
  let userVote = 0;
  if (currentUserId) {
    const userIdStr = String(currentUserId);
    if (upvotesArray.some(id => String(id) === userIdStr)) userVote = 1;
    else if (downvotesArray.some(id => String(id) === userIdStr)) userVote = -1;
  }

  const answers = Array.isArray(backendQuestion.answers) ? backendQuestion.answers : [];
  
  return {
    id: backendQuestion.id || backendQuestion._id,
    title: backendQuestion.title || '',
    content: backendQuestion.description || backendQuestion.content || '',
    author: {
      name: backendQuestion.askedBy?.name || 'Anonymous',
      avatar: backendQuestion.askedBy?.avatar || '',
      points: backendQuestion.askedBy?.points || 0,
      college: backendQuestion.askedBy?.college || ''
    },
    tags: Array.isArray(backendQuestion.tags) ? backendQuestion.tags : [],
    upvotes: upvotesArray.length,
    downvotes: downvotesArray.length,
    answerCount: answers.length,
    views: backendQuestion.views || 0,
    timeAgo: formatTimeAgo(backendQuestion.askedAt || backendQuestion.createdAt),
    createdAt: new Date(backendQuestion.askedAt || backendQuestion.createdAt || Date.now()),
    isAnswered: answers.length > 0,
    userVote,
    answerList: answers.map(answer => normalizeAnswer(answer, currentUserId)),
    raw: backendQuestion
  };
};

// Helper to normalize answer data
const normalizeAnswer = (backendAnswer, currentUserId) => {
  if (!backendAnswer) return null;

  const upvotesArray = Array.isArray(backendAnswer.upVotes) ? backendAnswer.upVotes : [];
  const downvotesArray = Array.isArray(backendAnswer.downVotes) ? backendAnswer.downVotes : [];
  
  let userVote = 0;
  if (currentUserId) {
    const userIdStr = String(currentUserId);
    if (upvotesArray.some(id => String(id) === userIdStr)) userVote = 1;
    else if (downvotesArray.some(id => String(id) === userIdStr)) userVote = -1;
  }

  return {
    id: backendAnswer.id || backendAnswer._id,
    content: backendAnswer.answer || backendAnswer.content || '',
    author: {
      name: backendAnswer.answeredBy?.name || 'Anonymous',
      avatar: backendAnswer.answeredBy?.avatar || '',
      points: backendAnswer.answeredBy?.points || 0,
      college: backendAnswer.answeredBy?.college || ''
    },
    upvotes: upvotesArray.length,
    downvotes: downvotesArray.length,
    timeAgo: formatTimeAgo(backendAnswer.answeredAt || backendAnswer.createdAt),
    isAccepted: backendAnswer.isAccepted || false,
    userVote,
    raw: backendAnswer
  };
};

// Helper to format time ago
const formatTimeAgo = (date) => {
  if (!date) return 'Just now';
  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return then.toLocaleDateString();
};

export const useQAStore = create(
  persist(
    (set, get) => ({
      questions: [],
      loading: false,
      error: null,
      currentUserId: null,

      setCurrentUserId: (userId) => set({ currentUserId: userId }),

      // Load all questions from backend
      loadQuestions: async () => {
        set({ loading: true, error: null });
        try {
          const backendQuestions = await qaService.getAllQuestions();
          const currentUserId = get().currentUserId;
          const normalized = backendQuestions.map(q => normalizeQuestion(q, currentUserId)).filter(Boolean);
          set({ questions: normalized, loading: false });
          return normalized;
        } catch (error) {
          set({ error: error.message || 'Failed to load questions', loading: false });
          throw error;
        }
      },

      // Ask a new question
      askQuestion: async (questionData) => {
        set({ loading: true, error: null });
        try {
          const newQuestion = await qaService.askQuestion(questionData);
          const currentUserId = get().currentUserId;
          const normalized = normalizeQuestion(newQuestion, currentUserId);
          if (normalized) {
            set({ questions: [normalized, ...get().questions], loading: false });
          } else {
            set({ loading: false });
          }
          return normalized;
        } catch (error) {
          set({ error: error.message || 'Failed to ask question', loading: false });
          throw error;
        }
      },

      // Add answer to a question
      addAnswer: async (questionId, answerText) => {
        set({ loading: true, error: null });
        try {
          const updatedQuestion = await qaService.answerQuestion(questionId, answerText);
          const currentUserId = get().currentUserId;
          const normalized = normalizeQuestion(updatedQuestion, currentUserId);
          
          if (normalized) {
            set({
              questions: get().questions.map(q => 
                q.id === questionId ? normalized : q
              ),
              loading: false
            });
          } else {
            set({ loading: false });
          }
          
          return normalized;
        } catch (error) {
          set({ error: error.message || 'Failed to add answer', loading: false });
          throw error;
        }
      },

      // Vote on question
      voteQuestion: async (questionId, direction) => {
        const currentUserId = get().currentUserId;
        if (!currentUserId) {
          throw new Error('Must be logged in to vote');
        }

        // Optimistic update
        const originalQuestions = get().questions;
        set({
          questions: get().questions.map(q => {
            if (q.id === questionId) {
              const currentVote = q.userVote || 0;
              const newVote = direction === 'up' ? (currentVote === 1 ? 0 : 1) : (currentVote === -1 ? 0 : -1);
              const voteDiff = newVote - currentVote;
              return { ...q, upvotes: Math.max(0, (q.upvotes || 0) + voteDiff), userVote: newVote };
            }
            return q;
          })
        });

        try {
          const updatedQuestion = direction === 'up' 
            ? await qaService.upvoteQuestion(questionId)
            : await qaService.downvoteQuestion(questionId);
          
          const normalized = normalizeQuestion(updatedQuestion, currentUserId);
          if (normalized) {
            set({
              questions: get().questions.map(q => 
                q.id === questionId ? normalized : q
              )
            });
          }
        } catch (error) {
          // Revert on error
          set({ questions: originalQuestions });
          throw error;
        }
      },

      // Vote on answer
      voteAnswer: async (questionId, answerId, direction) => {
        const currentUserId = get().currentUserId;
        if (!currentUserId) {
          throw new Error('Must be logged in to vote');
        }

        // Optimistic update
        const originalQuestions = get().questions;
        set({
          questions: get().questions.map(q => {
            if (q.id === questionId) {
              return {
                ...q,
                answerList: q.answerList.map(a => {
                  if (a.id === answerId) {
                    const currentVote = a.userVote || 0;
                    const newVote = direction === 'up' ? (currentVote === 1 ? 0 : 1) : (currentVote === -1 ? 0 : -1);
                    const voteDiff = newVote - currentVote;
                    return { ...a, upvotes: Math.max(0, (a.upvotes || 0) + voteDiff), userVote: newVote };
                  }
                  return a;
                })
              };
            }
            return q;
          })
        });

        try {
          const updatedQuestion = direction === 'up'
            ? await qaService.upvoteAnswer(questionId, answerId)
            : await qaService.downvoteAnswer(questionId, answerId);
          
          const normalized = normalizeQuestion(updatedQuestion, currentUserId);
          if (normalized) {
            set({
              questions: get().questions.map(q => 
                q.id === questionId ? normalized : q
              )
            });
          }
        } catch (error) {
          // Revert on error
          set({ questions: originalQuestions });
          throw error;
        }
      },

      // Get question by ID
      getQuestionById: (id) => get().questions.find(q => q.id === id) || null,

      // Reset store
      resetQuestions: () => {
        set({ questions: [], error: null });
      }
    }),
    { 
      name: 'qa-storage',
      partialize: (state) => ({ questions: state.questions })
    }
  )
);


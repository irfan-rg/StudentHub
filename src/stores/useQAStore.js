import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useQAStore = create(
  persist(
    (set, get) => ({
      questions: [
        {
          id: 1,
          title: 'How to optimize React component re-renders?',
          content: "I'm working on a large React application and noticing performance issues. What are the best practices for preventing unnecessary re-renders?",
          author: {
            name: 'Alex Thompson',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            points: 1234,
            college: 'MIT'
          },
          tags: ['React', 'Performance', 'JavaScript'],
          upvotes: 24,
          answerCount: 8,
          views: 156,
          timeAgo: '2 hours ago',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isAnswered: true,
          userVote: 0,
          answerList: [
            {
              id: 1,
              content: 'Use React.memo for functional components and useMemo/useCallback hooks to prevent unnecessary re-renders. Also consider using React DevTools Profiler to identify bottlenecks.',
              author: {
                name: 'Sarah Chen',
                avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=face',
                points: 3456,
                college: 'Stanford'
              },
              upvotes: 15,
              timeAgo: '1 hour ago',
              isAccepted: true,
              userVote: 0
            },
            {
              id: 2,
              content: "Don't forget about proper component structure. Sometimes lifting state up or using context can help reduce prop drilling and unnecessary renders.",
              author: {
                name: 'Mike Johnson',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
                points: 2890,
                college: 'UC Berkeley'
              },
              upvotes: 8,
              timeAgo: '45 minutes ago',
              isAccepted: false,
              userVote: 0
            }
          ]
        },
        {
          id: 2,
          title: 'Best practices for machine learning model deployment?',
          content: 'I\'ve trained a TensorFlow model and want to deploy it to production. What are the recommended approaches for model serving and monitoring?',
          author: {
            name: 'Emily Rodriguez',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
            points: 2156,
            college: 'Harvard'
          },
          tags: ['Machine Learning', 'TensorFlow', 'DevOps'],
          upvotes: 18,
          answerCount: 5,
          views: 89,
          timeAgo: '4 hours ago',
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
          isAnswered: false,
          userVote: 0,
          answerList: []
        },
        {
          id: 3,
          title: 'CSS Grid vs Flexbox: When to use which?',
          content: "I'm confused about when to use CSS Grid versus Flexbox. Can someone explain the differences and best use cases?",
          author: {
            name: 'David Kim',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            points: 987,
            college: 'NYU'
          },
          tags: ['CSS', 'Frontend', 'Design'],
          upvotes: 12,
          answerCount: 3,
          views: 67,
          timeAgo: '1 day ago',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          isAnswered: true,
          userVote: 0,
          answerList: []
        },
        {
          id: 4,
          title: 'How to handle authentication in a microservices architecture?',
          content: "Working on a project with multiple microservices. What's the best way to handle user authentication across all services?",
          author: {
            name: 'Lisa Wang',
            avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face',
            points: 3421,
            college: 'Stanford'
          },
          tags: ['Architecture', 'Authentication', 'Backend'],
          upvotes: 31,
          answerCount: 12,
          views: 234,
          timeAgo: '2 days ago',
          createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
          isAnswered: true,
          userVote: 0,
          answerList: []
        }
      ],

      setQuestions: (questions) => set({ questions }),

      addQuestion: (question) => {
        set({ questions: [question, ...get().questions] });
      },

      addAnswer: (questionId, answer) => {
        set({
          questions: get().questions.map(q => {
            if (q.id === questionId) {
              return {
                ...q,
                answerList: [answer, ...q.answerList],
                answerCount: (q.answerCount || 0) + 1
              };
            }
            return q;
          })
        });
      },

      voteQuestion: (questionId, direction) => {
        set({
          questions: get().questions.map(q => {
            if (q.id === questionId) {
              const currentVote = q.userVote || 0;
              const newVote = direction === 'up' ? (currentVote === 1 ? 0 : 1) : (currentVote === -1 ? 0 : -1);
              const voteDiff = newVote - currentVote;
              return { ...q, upvotes: (q.upvotes || 0) + voteDiff, userVote: newVote };
            }
            return q;
          })
        });
      },

      voteAnswer: (questionId, answerId, direction) => {
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
                    return { ...a, upvotes: (a.upvotes || 0) + voteDiff, userVote: newVote };
                  }
                  return a;
                })
              };
            }
            return q;
          })
        });
      },

      getQuestionById: (id) => get().questions.find(q => q.id === id) || null
    }),
    { name: 'qa-storage' }
  )
);



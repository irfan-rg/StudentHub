import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Calendar, Video, MapPin, Plus, List, User, Clock, CheckCircle, PlayCircle, Star, Loader2, Inbox, Sparkles, Check, Award } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Calendar as CalendarComponent } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { format } from 'date-fns';
import { useSessionStore } from '../stores/useSessionStore.js';
import { notificationService, sessionService } from '../services/api.js';
import { pdfService } from '../services/pdfService.js';

const DEFAULT_HOST_NAME = 'Session host';

const HOURS_12 = Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, '0'));
const MINUTES = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
const PERIODS = ['AM', 'PM'];
const QUIZ_MAX_QUESTIONS = 6;
const QUIZ_PASSING_SCORE = 4;
const QUIZ_POINTS_PER_CORRECT = 10;

const buildUniqueOptions = (options = []) => Array.from(new Set(options.filter(Boolean)));

const createQuizQuestions = (session = {}) => {
  const safeTitle = session?.title || 'This session';
  const safeDuration = session?.duration ? `${session.duration} minutes` : '60 minutes';
  const safeType = session?.type === 'video' ? 'Video session' : 'In person meetup';
  const alternateType = session?.type === 'video' ? 'In person meetup' : 'Video session';
  const safeDate = session?.dateLabel || 'Date to be decided';
  const safeTime = session?.timeLabel || 'Time to be decided';

  const questions = [
    {
      question: `What was the main focus of "${safeTitle}"?`,
      options: buildUniqueOptions([
        safeTitle,
        'Building a growth mindset',
        'Mastering exam routines',
        'Planning a study schedule'
      ]),
      answer: safeTitle
    },
    {
      question: 'How long was the session scheduled for?',
      options: buildUniqueOptions([
        safeDuration,
        '30 minutes',
        '45 minutes',
        '90 minutes'
      ]),
      answer: safeDuration
    },
    {
      question: 'Which delivery format best fits this session?',
      options: buildUniqueOptions([
        safeType,
        alternateType,
        'Self-paced course',
        'Email series'
      ]),
      answer: safeType
    },
    {
      question: 'When was this session held?',
      options: buildUniqueOptions([
        `${safeDate} (${safeTime})`,
        'Next Monday at 9:00 AM',
        'Last Friday evening',
        'Scheduled asynchronously'
      ]),
      answer: `${safeDate} (${safeTime})`
    },
    {
      question: 'What is a strong follow-up action after attending a session?',
      options: [
        'Write down two key takeaways',
        'Ignore the new information',
        'Stop communicating with your partner',
        'Avoid reviewing the shared notes'
      ],
      answer: 'Write down two key takeaways'
    },
    {
      question: 'How can you support your study partner after the session?',
      options: [
        'Share helpful resources or notes',
        'Criticize their questions',
        'Discourage future collaboration',
        'Delete the meeting recording'
      ],
      answer: 'Share helpful resources or notes'
    }
  ];

  return questions
    .slice(0, QUIZ_MAX_QUESTIONS)
    .map((item, index) => ({ ...item, id: `quiz-${index + 1}` }));
};

const buildInitials = (value = '') => {
  const target = (value || '').trim();
  if (!target) {
    return 'SH';
  }

  const parts = target
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase());

  return parts.join('') || 'SH';
};

const formatUserInfo = (info) => {
  if (!info) {
    return {
      name: DEFAULT_HOST_NAME,
      email: '',
      avatar: '',
      initials: buildInitials(DEFAULT_HOST_NAME)
    };
  }

  const source = info.user || info.profile || info.member || info.target || info;

  if (typeof source === 'string') {
    const name = source.trim() || DEFAULT_HOST_NAME;
    return {
      name,
      email: '',
      avatar: '',
      initials: buildInitials(name)
    };
  }

  const firstName = source.firstName || source.firstname;
  const lastName = source.lastName || source.lastname;
  let name = source.name || source.fullName || [firstName, lastName].filter(Boolean).join(' ');
  name = (name || DEFAULT_HOST_NAME).trim();

  const email = source.email || source.mail || '';
  const avatar = source.avatar || source.profileImage || source.image || source.picture || '';

  return {
    name,
    email,
    avatar,
    initials: buildInitials(name)
  };
};

export function Sessions({ user }) {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('create');

  // Check for tab parameter in URL and set active tab accordingly
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'manage' || tabParam === 'invites') {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const [sessionForm, setSessionForm] = useState({
    title: '',
    description: '',
    type: 'video',
    date: undefined,
    startHour: '09',
    startMinute: '00',
    startPeriod: 'AM',
    duration: '60',
    meetingLink: '',
    meetingAddress: '',
    documents: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const sessionsStore = useSessionStore((state) => state.sessions);
  const joinedSessions = useSessionStore((state) => state.joinedSessions);
  const loadSessions = useSessionStore((state) => state.loadSessions);
  const loadJoinedSessions = useSessionStore((state) => state.loadJoinedSessions);
  const createSessionStore = useSessionStore((state) => state.createSession);
  const deleteSessionStore = useSessionStore((state) => state.deleteSession);
  const rateSessionStore = useSessionStore((state) => state.rateSession);
  const sessionsLoading = useSessionStore((state) => state.loading);
  const sessionsError = useSessionStore((state) => state.error);

  const [sessionInvites, setSessionInvites] = useState([]);
  const [invitesLoading, setInvitesLoading] = useState(false);
  const [invitesError, setInvitesError] = useState(null);
  const [pendingActions, setPendingActions] = useState({});
  const [claimedPoints, setClaimedPoints] = useState({});

  const [quizDialogOpen, setQuizDialogOpen] = useState(false);
  const [quizSession, setQuizSession] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizStep, setQuizStep] = useState(0);
  const [quizScore, setQuizScore] = useState(null);
  const [quizResultPoints, setQuizResultPoints] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState(null);
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const highlightedSessionId = useSessionStore((state) => state.highlightedSessionId);
  const setHighlightedSessionId = useSessionStore((state) => state.setHighlightedSessionId);

  const currentUserId = user?._id || user?.id;

  const fetchSessionInvites = useCallback(async () => {
    if (!currentUserId) return;
    setInvitesLoading(true);
    setInvitesError(null);
    try {
      const response = await notificationService.getNotifications(1, 50);
      const notifications = response?.data?.notifications || [];
      const invites = notifications.filter((item) => item.type === 'session_invite' && !item.isRead);

      // Hydrate session metadata if it's an id string (backend may not always populate session data)
      const hydrated = await Promise.all(invites.map(async (invite) => {
        const sessionId = invite?.metadata?.sessionId;
        if (!sessionId) return invite;
        if (typeof sessionId === 'string') {
          try {
            const session = await sessionService.getSessionById(sessionId);
            return { ...invite, metadata: { ...invite.metadata, sessionId: session } };
          } catch (err) {
            return invite;
          }
        }
        // already an object
        return invite;
      }));

      setSessionInvites(hydrated);
    } catch (error) {
      setInvitesError(error.message || 'Failed to load session invites');
    } finally {
      setInvitesLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    if (!currentUserId) return;
    const loadAll = async () => {
      await loadSessions().catch(() => {});
      await loadJoinedSessions().catch(() => {});
      await fetchSessionInvites();
    };
    loadAll();
  }, [currentUserId, loadSessions, loadJoinedSessions, fetchSessionInvites]);

  // Scroll to and highlight accepted session when it's added
  useEffect(() => {
    if (!highlightedSessionId) return;
    if (activeTab !== 'manage') return;
    const el = document.getElementById(`session-card-${highlightedSessionId}`);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
    }
  }, [highlightedSessionId, activeTab]);

  const resetQuizState = useCallback(() => {
    setQuizSession(null);
    setQuizQuestions([]);
    setQuizAnswers({});
    setQuizStep(0);
    setQuizScore(null);
    setQuizResultPoints(0);
    setQuizCompleted(false);
  }, []);

  const openQuizDialogForSession = (session) => {
    if (!session) return;

    resetQuizState();
    
    // Check if session has AI-generated questions stored
    const aiQuestions = session?.quizQuestions || session?.raw?.quizQuestions;
    
    if (!aiQuestions || aiQuestions.length === 0) {
      // No quiz available for this session
      toast.error('This session does not have a quiz. The creator did not upload a PDF document for quiz generation.');
      return;
    }

    // Use AI-generated questions from the session
    toast.success('Loading AI-generated quiz from session document');
    setQuizSession(session);
    setQuizQuestions(aiQuestions);
    setQuizDialogOpen(true);
  };

  const handleQuizDialogChange = (open) => {
    setQuizDialogOpen(open);
    if (!open) {
      resetQuizState();
    }
  };

  const handleQuizAnswerChange = (value) => {
    const activeQuestion = quizQuestions[quizStep];
    if (!activeQuestion) return;

    setQuizAnswers((prev) => ({
      ...prev,
      [activeQuestion.id]: value
    }));
  };

  const handleQuizNext = () => {
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep((prev) => prev + 1);
    }
  };

  const handleQuizBack = () => {
    setQuizStep((prev) => Math.max(prev - 1, 0));
  };

  const handleQuizSubmit = () => {
    if (quizQuestions.length === 0) return;

    const unanswered = quizQuestions.filter((question) => !quizAnswers[question.id]);

    if (unanswered.length > 0) {
      toast.error('Please answer every question before submitting.');
      return;
    }

    const score = quizQuestions.reduce((total, question) => {
      return total + (quizAnswers[question.id] === question.answer ? 1 : 0);
    }, 0);

    setQuizScore(score);
    setQuizResultPoints(score * QUIZ_POINTS_PER_CORRECT);
    setQuizCompleted(true);
  };

  const handleQuizRetake = () => {
    setQuizAnswers({});
    setQuizStep(0);
    setQuizScore(null);
    setQuizResultPoints(0);
    setQuizCompleted(false);
  };

  const handleQuizClaimPoints = async () => {
    if (!quizSession) return;

    const sessionId = quizSession?.raw?._id || quizSession?.id;

    if (!sessionId) {
      toast.error('Unable to determine which session to reward.');
      return;
    }

    if (quizScore === null || quizScore === undefined) {
      toast.error('Please complete the quiz first.');
      return;
    }

    try {
      // Import pointsService
      const { pointsService } = await import('../services/api.js');
      
      // Submit quiz completion to backend
      const result = await pointsService.submitQuizCompletion(
        sessionId,
        quizScore,
        quizQuestions.length
      );

      if (result.passed) {
        setClaimedPoints((prev) => ({
          ...prev,
          [sessionId]: true
        }));

        toast.success(`🎉 Quiz passed! You earned ${result.pointsAwarded} points!`);
        
        // Show new badges if any
        if (result.newBadges && result.newBadges.length > 0) {
          toast.success(`🏆 New badge${result.newBadges.length > 1 ? 's' : ''}: ${result.newBadges.join(', ')}`);
        }
        
        setQuizDialogOpen(false);
        resetQuizState();
        
        // Reload user data to show updated points
        window.location.reload();
      } else {
        toast.error(`Quiz score too low. You need ${result.passingScore}/${result.totalQuestions} to pass.`);
      }
    } catch (error) {
      console.error('Error claiming points:', error);
      toast.error('Failed to claim points. Please try again.');
    }
  };

  const currentUserIdStr = currentUserId ? String(currentUserId) : null;

  const getScheduleMeta = useCallback((isoDate) => {
    if (!isoDate) {
      return {
        dateLabel: 'Date to be decided',
        timeLabel: '',
        isPast: false
      };
    }

    try {
      const parsed = new Date(isoDate);
      if (Number.isNaN(parsed.getTime())) {
        return {
          dateLabel: 'Date to be decided',
          timeLabel: '',
          isPast: false
        };
      }
      return {
        dateLabel: format(parsed, 'PPP'),
        timeLabel: format(parsed, 'p'),
        isPast: parsed.getTime() < Date.now()
      };
    } catch (error) {
      return {
        dateLabel: 'Date to be decided',
        timeLabel: '',
        isPast: false
      };
    }
  }, []);

  const extractUserRating = useCallback((sessionRaw) => {
    if (!sessionRaw || !currentUserIdStr) return null;
    const ratings = Array.isArray(sessionRaw.ratings) ? sessionRaw.ratings : [];
    const entry = ratings.find((item) => {
      const userField = item.user;
      if (!userField) return false;
      if (typeof userField === 'string') {
        return userField === currentUserIdStr;
      }
      if (typeof userField === 'object') {
        const value = userField._id || userField.id;
        return value ? String(value) === currentUserIdStr : false;
      }
      return false;
    });
    return entry ? { rating: entry.rating || 0, comment: entry.comment || '' } : null;
  }, [currentUserIdStr]);

  const createdSessions = useMemo(() => {
    return sessionsStore.map((session) => {
      const schedule = getScheduleMeta(session?.dateIso);

      return {
        id: session.id,
        title: session.title,
        description: session.description,
        type: session.type,
        duration: session.duration,
        date: schedule.dateLabel,
        time: schedule.timeLabel || session.preferredTimes,
        meetingLink: session.meetingLink,
        meetingAddress: session.meetingAddress,
        status: session.status,
        averageRating: session.averageRating || 0,
        raw: session.raw,
        schedule
      };
    });
  }, [sessionsStore, getScheduleMeta]);

  const joinedSessionsByStatus = useMemo(() => {
    const normalized = joinedSessions.map((session) => {
      const schedule = getScheduleMeta(session?.dateIso);
      const userRating = session.userRating || extractUserRating(session.raw);
      const statusCandidate = typeof session.status === 'string' ? session.status.toLowerCase() : '';
      const baseStatus = ['completed', 'cancelled'].includes(statusCandidate)
        ? statusCandidate
        : schedule.isPast
          ? 'completed'
          : 'upcoming';

      const hostSource = session.creator || session.otherUser || session.original?.otherUser || session.raw?.createdBy || session.raw?.owner || session.raw?.host;
      const creator = formatUserInfo(hostSource);

      return {
        id: session.id,
        title: session.title,
        description: session.description,
        type: session.type,
        duration: session.duration,
        meetingLink: session.meetingLink,
        meetingAddress: session.meetingAddress,
        preferredTimes: session.preferredTimes,
        schedule,
        status: baseStatus,
        averageRating: session.averageRating || session.raw?.averageRating || 0,
        creator,
        userRating,
        raw: session.raw,
        otherUser: session.otherUser,
        dateLabel: schedule.dateLabel,
        timeLabel: schedule.timeLabel || session.preferredTimes
      };
    });

    return {
      upcoming: normalized.filter((session) => !['completed', 'cancelled'].includes(session.status)),
      completed: normalized.filter((session) => session.status === 'completed'),
      cancelled: normalized.filter((session) => session.status === 'cancelled')
    };
  }, [joinedSessions, getScheduleMeta, extractUserRating]);

  const totalJoinedSessions = joinedSessions.length;
  const pendingJoinedSessions = joinedSessionsByStatus.upcoming || [];
  const completedJoinedSessions = joinedSessionsByStatus.completed || [];

  const quizTotalQuestions = quizQuestions.length;
  const activeQuizQuestion = quizQuestions[quizStep] ?? null;
  const activeQuizAnswer = activeQuizQuestion ? (quizAnswers[activeQuizQuestion.id] || '') : '';
  const answeredQuizCount = Object.values(quizAnswers).filter(Boolean).length;
  const quizHasPassed = quizScore !== null && quizScore >= QUIZ_PASSING_SCORE;
  const activeQuizSessionId = quizSession?.raw?._id || quizSession?.id;
  const quizPointsAlreadyClaimed = activeQuizSessionId ? Boolean(claimedPoints[activeQuizSessionId]) : false;

  // Compute smart session status based on time + duration
  const computeSessionStatus = useCallback((session) => {
    const now = new Date();
    const sessionDate = new Date(session.dateIso || session.sessionOn);
    const durationMinutes = parseInt(session.duration) || 60;
    const endTime = new Date(sessionDate.getTime() + durationMinutes * 60 * 1000);
    const oneHourAfterEnd = new Date(endTime.getTime() + 60 * 60 * 1000);

    // Respect manual cancellation
    if (session.status === 'cancelled') {
      return 'cancelled';
    }

    // Auto-complete sessions that ended >1 hour ago
    if (now > oneHourAfterEnd) {
      return 'completed';
    }

    // Show "in-progress" during session window
    if (now >= sessionDate && now <= endTime) {
      return 'in-progress';
    }

    // Upcoming
    if (now < sessionDate) {
      return 'upcoming';
    }

    return 'completed';
  }, []);

  // Generate quiz questions from uploaded PDF
  const handleGenerateQuestionsFromPDF = async (pdfFile) => {
    if (!pdfFile || pdfFile.type !== 'application/pdf') {
      toast.error('Please upload a PDF file to generate quiz questions');
      throw new Error('Invalid file type');
    }

    try {
      setGeneratingQuestions(true);
      toast.info('Generating quiz questions from PDF... This may take a moment.');
      
      const questions = await pdfService.generateQuestionsFromPDF(pdfFile);
      
      if (questions && questions.length > 0) {
        // Format questions to match our quiz structure
        const formattedQuestions = questions.slice(0, 6).map((q, index) => ({
          id: `pdf-quiz-${index + 1}`,
          question: q.question,
          options: q.options || [],
          answer: q.answer
        }));
        
        setGeneratedQuestions(formattedQuestions);
        toast.success(`Generated ${formattedQuestions.length} quiz questions from PDF!`);
        return formattedQuestions;
      } else {
        toast.error('No questions could be generated from this PDF');
        throw new Error('No questions generated');
      }
    } catch (error) {
      console.error('Error generating questions from PDF:', error);
      toast.error('Failed to generate quiz questions. Make sure Python backend is running.');
      throw error;
    } finally {
      setGeneratingQuestions(false);
    }
  };

  const handleCreateSession = async () => {
    if (!sessionForm.title.trim()) {
      toast.error('Please provide a session title');
      return;
    }
    if (!sessionForm.date) {
      toast.error('Please select a session date');
      return;
    }
    if (!sessionForm.startHour || !sessionForm.startMinute || !sessionForm.startPeriod) {
      toast.error('Please select a session start time');
      return;
    }
    if (sessionForm.type === 'video' && !sessionForm.meetingLink.trim()) {
      toast.error('Please provide a meeting link for a video session');
      return;
    }
    if (sessionForm.type === 'inperson' && !sessionForm.meetingAddress.trim()) {
      toast.error('Please provide a location for an in-person session');
      return;
    }

    setIsSubmitting(true);

    const baseDate = sessionForm.date instanceof Date ? new Date(sessionForm.date) : new Date(sessionForm.date);
    const rawHour = Number(sessionForm.startHour);
    const minutes = Number(sessionForm.startMinute);

    if (Number.isNaN(baseDate.getTime()) || Number.isNaN(rawHour) || Number.isNaN(minutes)) {
      toast.error('Please provide a valid date and time');
      setIsSubmitting(false);
      return;
    }

    let hours24 = rawHour % 12;
    if (sessionForm.startPeriod === 'PM') {
      hours24 += 12;
    }
    baseDate.setHours(hours24, minutes, 0, 0);

    const payload = {
      topic: sessionForm.title.trim(),
      details: sessionForm.description.trim(),
      sessionType: sessionForm.type === 'video' ? 'Video Session' : 'In Person',
      duration: sessionForm.duration,
      sessionOn: baseDate.toISOString()
    };

    // Include AI-generated quiz questions if available
    if (generatedQuestions && generatedQuestions.length > 0) {
      payload.quizQuestions = generatedQuestions;
    }

    if (sessionForm.type === 'video') {
      payload.link = sessionForm.meetingLink.trim();
    } else {
      payload.location = sessionForm.meetingAddress.trim();
    }

    // Handle document uploads if there are any
    if (sessionForm.documents.length > 0) {
      const formData = new FormData();
      formData.append('sessionData', JSON.stringify(payload));
      
      sessionForm.documents.forEach((doc, index) => {
        formData.append(`documents`, doc);
      });

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/session/create-with-documents`, {
          method: 'POST',
          body: formData,
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to create session with documents');
        }

        toast.success('Session created with documents');
        setGeneratedQuestions(null); // Reset generated questions
        setSessionForm({
          title: '',
          description: '',
          type: 'video',
          date: undefined,
          startHour: '09',
          startMinute: '00',
          startPeriod: 'AM',
          duration: '60',
          meetingLink: '',
          meetingAddress: '',
          documents: []
        });
      } catch (error) {
        toast.error(error.message || 'Failed to create session');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // No documents, use regular API call
      try {
        await createSessionStore(payload);
        toast.success('Session created');
        setGeneratedQuestions(null); // Reset generated questions
        setSessionForm({
          title: '',
          description: '',
          type: 'video',
          date: undefined,
          startHour: '09',
          startMinute: '00',
          startPeriod: 'AM',
          duration: '60',
          meetingLink: '',
          meetingAddress: '',
          documents: []
        });
      } catch (error) {
        toast.error(error.message || 'Failed to create session');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Cancel/remove handlers
  const cancelJoinedSession = async (sessionId) => {
    if (!sessionId) return;
    setPendingActions((prev) => ({ ...prev, [sessionId]: true }));
    try {
      await sessionService.cancelSession(sessionId);
      await loadJoinedSessions();
      toast.success('Session cancelled');
    } catch (error) {
      toast.error(error.message || 'Failed to cancel session');
    } finally {
      setPendingActions((prev) => ({ ...prev, [sessionId]: false }));
    }
  };

  const removeCreatedSession = async (id) => {
    if (!id) return;
    setPendingActions((prev) => ({ ...prev, [id]: true }));
    try {
      await deleteSessionStore(id);
      toast.success('Removed from your created sessions');
    } catch (error) {
      toast.error(error.message || 'Failed to remove session');
    } finally {
      setPendingActions((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Rating handlers
  const openRatingDialog = (session) => {
    if (!session) return;
    setSelectedSession(session);
    const existing = session.userRating || extractUserRating(session.raw);
    setRating(existing?.rating || 0);
    setRatingComment(existing?.comment || '');
    setRatingDialogOpen(true);
  };

  const handleRatingSubmit = async () => {
    if (!selectedSession) return;
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    const sessionId = selectedSession.raw?._id || selectedSession.id;
    if (!sessionId) {
      toast.error('Invalid session reference');
      return;
    }

    setPendingActions((prev) => ({ ...prev, [sessionId]: true }));
    try {
      await rateSessionStore({ sessionId, rating, comment: ratingComment });
      await loadJoinedSessions();
      toast.success('Rating submitted successfully!');
      setRatingDialogOpen(false);
      setSelectedSession(null);
      setRating(0);
      setRatingComment('');
    } catch (error) {
      toast.error(error.message || 'Failed to submit rating');
    } finally {
      setPendingActions((prev) => ({ ...prev, [sessionId]: false }));
    }
  };

  const handleRatingCancel = () => {
    setRatingDialogOpen(false);
    setSelectedSession(null);
    setRating(0);
    setRatingComment('');
  };

  const handleInviteResponse = async (invite, action) => {
    if (!invite || !action) return;
    const inviteId = invite._id;
    const sessionId = invite.metadata?.sessionId?._id || invite.metadata?.sessionId;

    setPendingActions((prev) => ({ ...prev, [inviteId]: true }));
    try {
      await notificationService.respondToSessionInvite(inviteId, action);

      if (action === 'accept' && sessionId) {
        // Backend will accept the session as part of responding to invitation
        await loadJoinedSessions();
        // Switch to My Sessions tab after accepting
        setActiveTab('manage');
        // Flash highlight on the newly accepted session in Manage tab
        setHighlightedSessionId(sessionId);
        setTimeout(() => setHighlightedSessionId(null), 2000);
      }

      setSessionInvites((prev) => prev.filter((item) => item._id !== inviteId));
      await fetchSessionInvites();
      toast.success(action === 'accept' ? 'Session invite accepted! Check My Sessions.' : 'Session invite declined');
    } catch (error) {
      toast.error(error.message || 'Failed to process invite');
    } finally {
      setPendingActions((prev) => ({ ...prev, [inviteId]: false }));
    }
  };

  const openInNewTab = (url) => {
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      toast.error('Could not open link');
    }
  };

  const handleOpenGoogleMeet = () => {
    openInNewTab('https://meet.new');
    toast.message('Google Meet', {
      description: 'A new Google Meet tab has been opened. Create the meeting, copy the link, then click Paste to auto-fill.',
    });
  };

  const handleOpenZoom = () => {
    openInNewTab('https://zoom.us/start/videomeeting');
    toast.message('Zoom', {
      description: 'A Zoom tab has been opened. Create the meeting, copy the link, then click Paste to auto-fill.',
    });
  };

  const copyMeetingLinkToClipboard = async () => {
    try {
      const link = sessionForm.meetingLink?.trim();
      if (!link) {
        toast.error('No meeting link to copy');
        return;
      }
      await navigator.clipboard.writeText(link);
      toast.success('Meeting link copied');
    } catch (err) {
      toast.error('Clipboard access denied');
    }
  };

  const pasteMeetingLinkFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) {
        toast.error('Clipboard is empty');
        return;
      }
      const trimmed = text.trim();
      const looksLikeMeeting = /https?:\/\/meet\.google\.com\/[a-z0-9-]+/i.test(trimmed) || /https?:\/\/(?:[a-z0-9.-]*zoom\.us)\/[a-zA-Z0-9/?=&_.-]+/i.test(trimmed);
      setSessionForm(prev => ({ ...prev, meetingLink: trimmed }));
      if (looksLikeMeeting) {
        toast.success('Meeting link pasted');
      } else {
        toast.warning('Pasted text may not be a meeting link');
      }
    } catch (err) {
      toast.error('Clipboard access denied');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sessions</h1>
          <p className="text-muted-foreground mt-4">Create and track your study sessions</p>
        </div>
      </div>

      {/* Sessions Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-card border-border">
          <TabsTrigger value="create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Session
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            My Sessions
          </TabsTrigger>
          <TabsTrigger value="invites" className="flex items-center gap-2">
            <Inbox className="h-4 w-4" />
            Invites
            {sessionInvites.length > 0 && (
              <Badge variant="destructive" className="ml-1 px-1.5 py-0 text-xs h-5 min-w-[20px]">
                {sessionInvites.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

                 {/* Create Session Tab */}
         <TabsContent value="create" className="space-y-6">
           <div className="flex flex-col lg:flex-row gap-6">
             {/* Create Session Form - 50% width */}
             <div className="lg:w-1/2 flex-1">
               <Card className="bg-card border-border">
                 <CardHeader>
                   <CardTitle className="font-bold text-2xl">Create a new session</CardTitle>
                   <CardDescription className="mt-2">Set details and share with a study partner</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   <div className="space-y-3">
                     <Label htmlFor="session-title">Session Topic</Label>
                     <Input
                       id="session-title"
                       value={sessionForm.title}
                       onChange={(e) => setSessionForm(prev => ({ ...prev, title: e.target.value }))}
                       placeholder="What would you like to learn?"
                     />
                   </div>

                   <div className="space-y-3">
                     <Label htmlFor="session-description">Additional Details</Label>
                     <Textarea
                       id="session-description"
                       value={sessionForm.description}
                       onChange={(e) => setSessionForm(prev => ({ ...prev, description: e.target.value }))}
                       placeholder="Any specific topics or questions you'd like to cover?"
                       rows={3}
                     />
                   </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="session-type">Session Type</Label>
                      <Select value={sessionForm.type} onValueChange={(value) => setSessionForm(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="video">Video Session</SelectItem>
                          <SelectItem value="inperson">In Person</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label>Session Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${!sessionForm.date && "text-muted-foreground"}`}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {sessionForm.date ? format(sessionForm.date, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={sessionForm.date}
                            onSelect={(date) => setSessionForm(prev => ({ ...prev, date }))}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="session-start-time">Start Time</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Select
                          value={sessionForm.startHour}
                          onValueChange={(value) => setSessionForm(prev => ({ ...prev, startHour: value }))}
                        >
                          <SelectTrigger id="session-start-hour">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {HOURS_12.map((hour) => (
                              <SelectItem key={hour} value={hour}>
                                {hour}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={sessionForm.startMinute}
                          onValueChange={(value) => setSessionForm(prev => ({ ...prev, startMinute: value }))}
                        >
                          <SelectTrigger id="session-start-minute">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {MINUTES.map((minute) => (
                              <SelectItem key={minute} value={minute}>
                                {minute}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={sessionForm.startPeriod}
                          onValueChange={(value) => setSessionForm(prev => ({ ...prev, startPeriod: value }))}
                        >
                          <SelectTrigger id="session-start-period">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PERIODS.map((period) => (
                              <SelectItem key={period} value={period}>
                                {period}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="session-duration">Duration</Label>
                      <Select value={sessionForm.duration} onValueChange={(value) => setSessionForm(prev => ({ ...prev, duration: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="90">1.5 hours</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-3">
                   {sessionForm.type === 'video' && (
                     <div className="space-y-3">
                       <Label htmlFor="meeting-link">Meeting Link</Label>
                       <div className="flex gap-2 items-center">
                         <div className="relative flex-1">
                           <Input
                             id="meeting-link"
                             value={sessionForm.meetingLink}
                             onChange={(e) => setSessionForm(prev => ({ ...prev, meetingLink: e.target.value }))}
                             placeholder="Paste Google Meet/Zoom link"
                             className="pr-10"
                           />
                           <button
                             type="button"
                             onClick={pasteMeetingLinkFromClipboard}
                             title="Paste meeting link"
                             aria-label="Paste meeting link"
                             className="absolute right-2 top-1/2 -translate-y-1/2 z-10 text-foreground bg-muted px-2 py-1 rounded border border-border hover:bg-muted/80"
                           >
                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                               <path d="M19 2h-3.18C15.4.84 14.3 0 13 0h-2c-1.3 0-2.4.84-2.82 2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm0 18H5V4h2v2h10V4h2v16z"/>
                               <path d="M7 7h10v2H7zm0 4h10v2H7zm0 4h6v2H7z"/>
                             </svg>
                           </button>
                         </div>
                         <Button variant="outline" size="icon" onClick={handleOpenGoogleMeet} title="Create Google Meet" aria-label="Create Google Meet">
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
                             <path fill="#1e8e3e" d="M6 14c0-2.21 1.79-4 4-4h14v28H10c-2.21 0-4-1.79-4-4V14z"/>
                             <path fill="#34a853" d="M24 10h8l6 6v16l-6 6h-8z"/>
                             <path fill="#fbbc05" d="M38 16h4c2.21 0 4 1.79 4 4v8c0 2.21-1.79 4-4 4h-4z"/>
                             <path fill="#ea4335" d="M24 38h8l6-6H24z" opacity=".8"/>
                           </svg>
                         </Button>
                         <Button variant="outline" size="icon" onClick={handleOpenZoom} title="Create Zoom Meeting" aria-label="Create Zoom Meeting">
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
                             <path fill="#2D8CFF" d="M6 16c0-3.314 2.686-6 6-6h12c3.314 0 6 2.686 6 6v16c0 3.314-2.686 6-6 6H12c-3.314 0-6-2.686-6-6V16z"/>
                             <path fill="#2D8CFF" d="M30 22l10-6v16l-10-6z" opacity=".8"/>
                           </svg>
                         </Button>
                       </div>
                       <div className="text-xs text-muted-foreground flex items-center gap-2"><Video className="h-3 w-3" /> Use the icons to create a meeting, then click Paste</div>
                     </div>
                   )}
                   {sessionForm.type === 'inperson' && (
                     <div className="space-y-3">
                       <Label htmlFor="meeting-address">Location</Label>
                       <Input
                         id="meeting-address"
                         value={sessionForm.meetingAddress}
                         onChange={(e) => setSessionForm(prev => ({ ...prev, meetingAddress: e.target.value }))}
                         placeholder="Enter address or location to meet"
                       />
                       <div className="text-xs text-muted-foreground flex items-center gap-2"><MapPin className="h-3 w-3" /> Provide a clear address</div>
                     </div>
                   )}

                   {/* Document Upload Section */}
                   <div className="space-y-3 border-t border-border pt-4">
                     <div className="flex items-center justify-between">
                       <Label htmlFor="session-documents">Attach Document (PDF for Quiz Generation)</Label>
                       {generatingQuestions && (
                         <div className="flex items-center gap-2 text-sm text-blue-600">
                           <Loader2 className="h-4 w-4 animate-spin" />
                           Generating questions...
                         </div>
                       )}
                     </div>
                     <div className="flex items-center gap-2">
                       <input
                         id="session-documents"
                         type="file"
                         accept=".pdf,.doc,.docx,.txt,.pptx,.xlsx"
                         onChange={async (e) => {
                           const files = Array.from(e.target.files || []);
                           if (files.length > 0) {
                             // Auto-generate quiz if PDF is uploaded
                             const pdfFile = files.find(f => f.type === 'application/pdf');
                             if (pdfFile) {
                               try {
                                 await handleGenerateQuestionsFromPDF(pdfFile);
                                 // Only add document if generation succeeded
                                 setSessionForm(prev => ({
                                   ...prev,
                                   documents: [...prev.documents, ...files]
                                 }));
                               } catch (error) {
                                 // Don't add the document if generation failed
                                 toast.error('Document not uploaded. Quiz generation failed.');
                               }
                             } else {
                               // Non-PDF files can be added without quiz generation
                               setSessionForm(prev => ({
                                 ...prev,
                                 documents: [...prev.documents, ...files]
                               }));
                             }
                           }
                           e.target.value = ''; // Reset input
                         }}
                         className="hidden"
                       />
                       <Button
                         type="button"
                         variant="outline"
                         onClick={() => document.getElementById('session-documents').click()}
                         className="flex-1"
                         disabled={generatingQuestions}
                       >
                         {generatingQuestions ? (
                           <>
                             <Loader2 className="h-4 w-4 animate-spin mr-2" />
                             Processing PDF...
                           </>
                         ) : (
                           <>📎 Add Documents (PDF for Quiz)</>
                         )}
                       </Button>
                     </div>
                     
                     {/* Show generated questions info */}
                     {generatedQuestions && generatedQuestions.length > 0 && (
                       <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                         <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
                           <CheckCircle className="h-4 w-4" />
                           <span className="font-medium">
                             {generatedQuestions.length} quiz questions generated from PDF!
                           </span>
                         </div>
                         <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                           Participants will take this quiz after the session
                         </p>
                       </div>
                     )}
                     
                     {/* Display uploaded documents */}
                     {sessionForm.documents.length > 0 && (
                       <div className="space-y-2">
                         <p className="text-sm font-medium text-foreground">Attached Documents ({sessionForm.documents.length})</p>
                         <div className="space-y-2">
                           {sessionForm.documents.map((doc, index) => (
                             <div key={index} className="flex items-center justify-between p-2 bg-muted rounded border border-border">
                               <span className="text-sm text-foreground truncate flex-1">
                                 📄 {doc.name || `Document ${index + 1}`}
                               </span>
                               <Button
                                 type="button"
                                 variant="ghost"
                                 size="sm"
                                 onClick={() => {
                                   setSessionForm(prev => ({
                                     ...prev,
                                     documents: prev.documents.filter((_, i) => i !== index)
                                   }));
                                 }}
                                 className="h-6 w-6 p-0"
                               >
                                 ✕
                               </Button>
                             </div>
                           ))}
                         </div>
                       </div>
                     )}
                     <div className="text-xs text-muted-foreground">Supported: PDF, DOC, DOCX, TXT, PPTX, XLSX (Max 10MB each)</div>
                   </div>
                  </div>

                   <div className="flex gap-3">
                     <Button onClick={handleCreateSession} className="flex-1" disabled={isSubmitting}>
                       <Calendar className="h-4 w-4 mr-2" />
                       {isSubmitting ? 'Creating...' : 'Create Session'}
                     </Button>
                   </div>
                 </CardContent>
               </Card>
             </div>

             {/* Created Sessions List - 50% width */}
             <div className="lg:w-1/2 flex-1">
               <Card className="bg-card border-border h-fit">
                 <CardHeader>
                   <CardTitle className="text-2xl font-bold">Your Created Sessions</CardTitle>
                   <CardDescription className="text-m mt-2">Recently created sessions</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-3">
                   {sessionsLoading && (
                     <div className="text-sm text-muted-foreground text-center py-4">Loading sessions...</div>
                   )}
                   {!sessionsLoading && sessionsError && (
                     <div className="text-sm text-red-500 text-center py-2">{sessionsError}</div>
                   )}
                   {!sessionsLoading && !sessionsError && createdSessions.length === 0 && (
                     <div className="text-m text-muted-foreground text-center py-4">No sessions created yet</div>
                   )}
                   {createdSessions.slice(0, 5).map((s) => {
                     const sessionId = s.raw?._id || s.id;
                     const removeLoading = Boolean(pendingActions[sessionId]);
                     const statusLabel = s.status === 'upcoming' ? 'Upcoming' : s.status === 'completed' ? 'Completed' : 'Pending';

                     return (
                       <div key={s.id} className="p-4 rounded-lg border bg-muted/40">
                         <div className="flex items-start justify-between gap-4">
                           <div className="flex-1">
                             <div className="flex items-center gap-3 mb-2">
                               <Avatar className="w-9 h-9">
                                 <AvatarImage src={user?.avatar} alt={user?.name || 'You'} />
                                 <AvatarFallback>{buildInitials(user?.name || 'You')}</AvatarFallback>
                               </Avatar>
                               <div>
                                 <div className="font-medium text-foreground leading-tight">{s.title}</div>
                                 <div className="text-xs text-muted-foreground">
                                   Hosted by you
                                   {' • '}
                                   {s.type === 'video' ? 'Video' : 'In Person'} • {s.duration} mins
                                 </div>
                               </div>
                             </div>
                             {s.description && (
                               <div className="text-sm text-muted-foreground mb-2 leading-snug">{s.description}</div>
                             )}
                             <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                               <div className="flex items-center gap-1 whitespace-nowrap">
                                 <Calendar className="h-3 w-3" />
                                 {s.date}
                                 {s.time && <span>&nbsp;at {s.time}</span>}
                               </div>
                               {s.type === 'video' && s.meetingLink && (
                                 <button
                                   type="button"
                                   onClick={() => openInNewTab(s.meetingLink)}
                                   className="text-blue-600 hover:underline flex items-center gap-1"
                                 >
                                   <Video className="h-3 w-3" />
                                   Join Meeting
                                 </button>
                               )}
                               {s.type === 'inperson' && s.meetingAddress && (
                                 <div className="flex items-center gap-1 text-foreground">
                                   <MapPin className="h-3 w-3" />
                                   <span className="truncate max-w-[180px]" title={s.meetingAddress}>{s.meetingAddress}</span>
                                 </div>
                               )}
                             </div>
                           </div>
                           <div className="flex flex-col items-center gap-2">
                             <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 flex items-center gap-1">
                               <Clock className="h-3 w-3" />
                               {statusLabel}
                             </Badge>
                             <Button
                               variant="outline"
                               onClick={() => removeCreatedSession(s.id)}
                               disabled={removeLoading}
                               className="h-8 mt-2 px-3 text-xs text-red-600 border-red-200 hover:bg-red-50 dark:text-red-300 dark:border-red-800 dark:hover:bg-red-900/20"
                             >
                               {removeLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Remove'}
                             </Button>
                           </div>
                         </div>
                       </div>
                     );
                   })}
                   {createdSessions.length > 5 && (
                     <div className="text-xs text-muted-foreground text-center py-2">
                       +{createdSessions.length - 5} more sessions
                     </div>
                   )}
                 </CardContent>
               </Card>
             </div>
           </div>
         </TabsContent>

        {/* Manage Sessions Tab */}
         <TabsContent value="manage" className="space-y-6">
           {/* Joined Sessions */}
           <Card className="bg-card border-border">
             <CardHeader>
               <CardTitle className="font-bold text-2xl">Sessions You've Joined</CardTitle>
               <CardDescription className="mt-2">Sessions you've signed up for from other creators</CardDescription>
             </CardHeader>
            <CardContent className="space-y-4">
              {totalJoinedSessions === 0 && (
                <div className="text-sm text-muted-foreground">No joined sessions yet. Find sessions in the Skill Matching section.</div>
              )}

              {totalJoinedSessions > 0 && (
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Pending (left) */}
                  <div className="lg:w-1/2 flex-1">
                    <Card className="bg-card border-border h-fit">
                      <CardHeader>
                        <CardTitle className="text-xl font-bold flex items-center gap-2"><Clock className="h-4 w-4" /> Pending</CardTitle>
                        <CardDescription className="mt-1">Upcoming and in-progress sessions</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {pendingJoinedSessions.map((session) => {
                          const sessionId = session.raw?._id || session.id;
                          const cancelLoading = Boolean(pendingActions[sessionId]);
                          const computedStatus = computeSessionStatus(session);
                          
                          let statusLabel = 'Upcoming';
                          let statusClass = 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
                          let StatusIcon = Clock;

                          if (computedStatus === 'in-progress') {
                            statusLabel = 'In Progress';
                            statusClass = 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
                            StatusIcon = PlayCircle;
                          }

                          return (
                            <div
                              key={session.id}
                              id={`session-card-${sessionId}`}
                              className={`p-4 rounded-lg border bg-muted/40 transition-shadow duration-100 transform ${sessionId === highlightedSessionId ? 'ring-2 ring-green-300/40 bg-green-50 shadow-lg scale-105 transition-transform transition-opacity duration-200 ease-out' : 'scale-100'}`}>
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <Avatar className="w-9 h-9">
                                      <AvatarImage src={session.creator.avatar} alt={session.creator.name} />
                                      <AvatarFallback>{session.creator.initials}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <div className="font-medium text-foreground leading-tight">{session.title}</div>
                                      <div className="text-xs text-muted-foreground">
                                        Hosted by {session.creator.name}
                                        {' • '}
                                        {session.type === 'video' ? 'Video' : 'In Person'} • {session.duration} mins
                                      </div>
                                    </div>
                                  </div>
                                  {session.description && (
                                    <div className="text-sm text-muted-foreground mb-2 leading-snug">{session.description}</div>
                                  )}
                                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1 whitespace-nowrap">
                                      <Calendar className="h-3 w-3" />
                                      {session.dateLabel}
                                      {session.timeLabel && <span>&nbsp;at {session.timeLabel}</span>}
                                    </div>
                                    {session.type === 'video' && session.meetingLink && (
                                      <button
                                        type="button"
                                        onClick={() => openInNewTab(session.meetingLink)}
                                        className="text-blue-600 hover:underline flex items-center gap-1"
                                      >
                                        <Video className="h-3 w-3" />
                                        Join Meeting
                                      </button>
                                    )}
                                    {session.type === 'inperson' && session.meetingAddress && (
                                      <div className="flex items-center gap-1 text-foreground">
                                        <MapPin className="h-3 w-3" />
                                        <span className="truncate max-w-[180px]" title={session.meetingAddress}>{session.meetingAddress}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                  <Badge className={`${statusClass} flex items-center gap-1`}>
                                    <StatusIcon className="h-3 w-3" />
                                    {statusLabel}
                                  </Badge>
                                  <Button
                                    variant="outline"
                                    onClick={() => cancelJoinedSession(session.id)}
                                    disabled={cancelLoading}
                                    className="h-8 mt-2 px-3 text-xs text-red-600 border-red-200 hover:bg-red-50 dark:text-red-300 dark:border-red-800 dark:hover:bg-red-900/20"
                                  >
                                    {cancelLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Cancel'}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {pendingJoinedSessions.length === 0 && (
                          <div className="text-sm text-muted-foreground">No pending sessions.</div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Completed (right) */}
                  <div className="lg:w-1/2 flex-1">
                    <Card className="bg-card border-border h-fit">
                      <CardHeader>
                        <CardTitle className="text-xl font-bold flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Completed</CardTitle>
                        <CardDescription className="mt-1">Sessions you've already finished</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {completedJoinedSessions.map((session) => {
                          const sessionId = session.raw?._id || session.id;
                          const ratingLoading = Boolean(pendingActions[sessionId]);
                          const userRatingValue = session.userRating?.rating || 0;
                          const userHasRating = Boolean(userRatingValue);

                          return (
                            <div key={session.id} className="p-4 rounded-lg border bg-muted/40">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <Avatar className="w-9 h-9">
                                      <AvatarImage src={session.creator.avatar} alt={session.creator.name} />
                                      <AvatarFallback>{session.creator.initials}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <div className="font-medium text-foreground leading-tight">{session.title}</div>
                                      <div className="text-xs text-muted-foreground">
                                        Hosted by {session.creator.name}
                                        {' • '}
                                        {session.type === 'video' ? 'Video' : 'In Person'} • {session.duration} mins
                                      </div>
                                    </div>
                                  </div>
                                  {session.description && (
                                    <div className="text-sm text-muted-foreground mb-2 leading-snug">{session.description}</div>
                                  )}
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    {session.dateLabel}
                                    {session.timeLabel && <span>&nbsp;at {session.timeLabel}</span>}
                                  </div>
                                  {/* Move rating below date/time as requested */}
                                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                                    <Star className="h-4 w-4 text-yellow-400" />
                                    <span className="text-base font-semibold text-foreground">
                                      {session.averageRating > 0 ? `${session.averageRating.toFixed(1)}/5` : 'No ratings yet'}
                                    </span>
                                    <Button
                                      variant="link"
                                      onClick={() => openRatingDialog(session)}
                                      disabled={ratingLoading}
                                      className="h-auto p-0 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200"
                                    >
                                      {ratingLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : userHasRating ? 'Rate' : 'Rate session'}
                                    </Button>
                                    {/* {userHasRating && (
                                      <span className="block text-xs text-muted-foreground">Your rating: {userRatingValue}/5</span>
                                    )} */}
                                  </div>
                                </div>
                                <div className="flex flex-col items-center gap-2 min-w-[140px]">
                                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 mb-1 flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    Completed
                                  </Badge>
                                <div className="text-center space-y-3">
                                  {/* Move claim points up above the rating update link */}
                                  <div className="flex flex-col items-center gap-1">
                                      <Button
                                        size="sm"
                                        onClick={() => openQuizDialogForSession(session)}
                                        disabled={Boolean(claimedPoints[sessionId])}
                                        className={`h-8 px-3 mt-8 text-xs font-medium ${
                                          claimedPoints[sessionId]
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                                            : 'bg-purple-600 text-white hover:bg-purple-500'
                                        }`}
                                      >
                                        <span className="flex items-center gap-1">
                                          {claimedPoints[sessionId] ? (
                                            <>
                                              <Check className="h-3 w-3" />
                                              Points claimed
                                            </>
                                          ) : (
                                            <>
                                              <Sparkles className="h-3 w-3" />
                                              Claim points
                                            </>
                                          )}
                                        </span>
                                      </Button>
                                      <p className={`text-xs ${claimedPoints[sessionId] ? 'text-green-600 dark:text-green-300' : 'text-muted-foreground'}`}>
                                        {claimedPoints[sessionId]
                                          ? 'Your reward has been added.'
                                          : 'Answer a quick quiz to unlock points.'}
                                      </p>
                                    </div>
                                  <div className="space-y-2">
                                    
                                  </div>
                                </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {completedJoinedSessions.length === 0 && (
                          <div className="text-sm text-muted-foreground">No completed sessions yet.</div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

        </TabsContent>

        {/* Invites Tab */}
        <TabsContent value="invites" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-bold text-2xl flex items-center gap-2">
                <Inbox className="h-6 w-6" />
                Session Invites
              </CardTitle>
              <CardDescription className="mt-2">
                Pending invitations from your connections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {invitesLoading && (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-2">Loading invites...</p>
                </div>
              )}

              {!invitesLoading && invitesError && (
                <div className="text-center py-8">
                  <p className="text-sm text-red-500">{invitesError}</p>
                </div>
              )}

              {!invitesLoading && !invitesError && sessionInvites.length === 0 && (
                <div className="text-center py-12">
                  <Inbox className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
                  <p className="text-lg font-medium text-muted-foreground">No pending invites</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    When someone invites you to a session, it will appear here
                  </p>
                </div>
              )}

              {!invitesLoading && !invitesError && sessionInvites.length > 0 && (
                <div className="space-y-3">
                  {sessionInvites.map((invite) => {
                    const inviteId = invite._id;
                    const isLoading = Boolean(pendingActions[inviteId]);
                    const sessionData = invite.metadata?.sessionId || {};
                    const senderData = invite.sender || {};

                    const hostInfo = formatUserInfo(senderData);
                    const sessionTitle = sessionData.topic || sessionData.title || 'Untitled Session';
                    const sessionDescription = sessionData.details || sessionData.description || '';
                    const sessionType = (sessionData.sessionType || '').toLowerCase().includes('video') ? 'video' : 'inperson';
                    const duration = sessionData.duration || '60';
                    const meetingLink = sessionData.link || '';
                    const meetingAddress = sessionData.location || '';
                    
                    const sessionDate = sessionData.sessionOn || sessionData.date;
                    const schedule = getScheduleMeta(sessionDate);

                    return (
                      <div key={inviteId} className="p-4 rounded-lg border bg-muted/40">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Avatar className="w-9 h-9">
                                <AvatarImage src={hostInfo.avatar} alt={hostInfo.name} />
                                <AvatarFallback>{hostInfo.initials}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-foreground leading-tight">{sessionTitle}</div>
                                <div className="text-xs text-muted-foreground">
                                  Invited by {hostInfo.name}
                                  {' • '}
                                  {sessionType === 'video' ? 'Video' : 'In Person'} • {duration} mins
                                </div>
                              </div>
                            </div>
                            {sessionDescription && (
                              <div className="text-sm text-muted-foreground mb-2 leading-snug">{sessionDescription}</div>
                            )}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1 whitespace-nowrap">
                                <Calendar className="h-3 w-3" />
                                {schedule.dateLabel}
                                {schedule.timeLabel && <span>&nbsp;at {schedule.timeLabel}</span>}
                              </div>
                              {sessionType === 'video' && meetingLink && (
                                <div className="flex items-center gap-1 text-blue-600">
                                  <Video className="h-3 w-3" />
                                  <span className="text-xs">Video call</span>
                                </div>
                              )}
                              {sessionType === 'inperson' && meetingAddress && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  <span className="truncate max-w-[150px]" title={meetingAddress}>{meetingAddress}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-center gap-2 min-w-[120px]">
                            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300 mb-1">
                              Pending
                            </Badge>
                            <div className="flex gap-2 w-full">
                              <Button
                                size="sm"
                                onClick={() => handleInviteResponse(invite, 'accept')}
                                disabled={isLoading}
                                className="flex-1 h-8 text-xs bg-green-600 hover:bg-green-700 text-white"
                              >
                                {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleInviteResponse(invite, 'decline')}
                                disabled={isLoading}
                                className="flex-1 h-8 text-xs border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/20"
                              >
                                {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : '✕'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

      {/* Rating Dialog */}
      <Dialog open={ratingDialogOpen} onOpenChange={setRatingDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Rate Session</DialogTitle>
            <DialogDescription>
              How was your experience with "{selectedSession?.title}"?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Star Rating */}
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {rating === 0 && 'Select a rating'}
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </p>
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <Label htmlFor="rating-comment">Comment (Optional)</Label>
              <Textarea
                id="rating-comment"
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                placeholder="Share your thoughts about the session..."
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button onClick={handleRatingSubmit} className="flex-1">
                Submit Rating
              </Button>
              <Button variant="outline" onClick={handleRatingCancel} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quiz Dialog */}
      <Dialog open={quizDialogOpen} onOpenChange={handleQuizDialogChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Claim Your Session Points</DialogTitle>
            <DialogDescription>
              {quizSession
                ? `Answer a short quiz about "${quizSession.title}" to unlock your reward.`
                : 'Answer a short quiz to unlock your reward.'}
            </DialogDescription>
          </DialogHeader>

          {quizTotalQuestions === 0 && !quizSession && (
            <div className="text-sm text-muted-foreground">
              No quiz is available right now.
            </div>
          )}

          {quizTotalQuestions > 0 && !quizCompleted && activeQuizQuestion && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Badge variant="outline">Question {quizStep + 1} of {quizTotalQuestions}</Badge>
                <span className="text-xs text-muted-foreground">
                  {answeredQuizCount}/{quizTotalQuestions} answered
                </span>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  {activeQuizQuestion.question}
                </h3>
                <RadioGroup
                  value={activeQuizAnswer}
                  onValueChange={handleQuizAnswerChange}
                  className="space-y-2"
                >
                  {activeQuizQuestion.options.map((option, optionIndex) => {
                    const optionId = `${activeQuizQuestion.id}-option-${optionIndex}`;
                    const isSelected = activeQuizAnswer === option;
                    return (
                      <div
                        key={optionId}
                        className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:bg-muted/60'
                        }`}
                      >
                        <RadioGroupItem value={option} id={optionId} />
                        <Label
                          htmlFor={optionId}
                          className="flex-1 cursor-pointer text-sm text-foreground"
                        >
                          {option}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button variant="ghost" onClick={handleQuizBack} disabled={quizStep === 0}>
                  Back
                </Button>
                <div className="flex gap-2">
                  <Button
                    onClick={handleQuizRetake}
                    variant="outline"
                    disabled={quizStep === 0 && answeredQuizCount === 0}
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={quizStep === quizTotalQuestions - 1 ? handleQuizSubmit : handleQuizNext}
                    disabled={!activeQuizAnswer}
                  >
                    {quizStep === quizTotalQuestions - 1 ? 'Submit Quiz' : 'Next Question'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {quizTotalQuestions > 0 && quizCompleted && (
            <div className="space-y-6">
              <div className="flex flex-col items-center gap-3 text-center">
                <Badge className={quizHasPassed ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300'}>
                  {quizHasPassed ? 'Quiz passed' : 'Keep trying'}
                </Badge>
                <div>
                  <p className="text-xl font-semibold text-foreground">
                    You scored {quizScore} out of {quizTotalQuestions}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    You need at least {QUIZ_PASSING_SCORE} correct answers to unlock your reward.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {quizQuestions.map((question) => {
                  const userAnswer = quizAnswers[question.id];
                  const isCorrect = userAnswer === question.answer;
                  return (
                    <div
                      key={question.id}
                      className={`rounded-lg border p-3 text-sm ${
                        isCorrect
                          ? 'border-green-200 bg-green-50 dark:border-green-900/40 dark:bg-green-900/10'
                          : 'border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-900/10'
                      }`}
                    >
                      <p className="font-medium text-foreground">{question.question}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Your answer: <span className={`font-medium ${isCorrect ? 'text-green-600 dark:text-green-300' : 'text-red-600 dark:text-red-300'}`}>{userAnswer}</span>
                      </p>
                      {!isCorrect && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Correct answer: <span className="font-medium text-foreground">{question.answer}</span>
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Award className="h-4 w-4 text-primary" />
                  <span>
                    {quizHasPassed
                      ? `Reward unlocked: ${quizResultPoints} points`
                      : 'Reward locked until you pass the quiz.'}
                  </span>
                </div>

                {quizHasPassed ? (
                  <div className="flex flex-col gap-2 w-full md:w-auto">
                    <Button
                      onClick={handleQuizClaimPoints}
                      disabled={quizPointsAlreadyClaimed}
                      className="bg-purple-600 text-white hover:bg-purple-500"
                    >
                      {quizPointsAlreadyClaimed ? 'Points already claimed' : `Claim ${quizResultPoints} points`}
                    </Button>
                    {!quizPointsAlreadyClaimed && (
                      <Button variant="ghost" onClick={handleQuizRetake}>
                        Retake quiz
                      </Button>
                    )}
                  </div>
                ) : (
                  <Button onClick={handleQuizRetake}>Try again</Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}

import User from '../models/user.model.js';
import { errorHandler } from '../utils/errorHandler.js';

// Points configuration
const POINTS_CONFIG = {
    ASK_QUESTION: 5,
    ANSWER_QUESTION: 10,
    ANSWER_UPVOTE: 2,
    QUESTION_UPVOTE: 1,
    CREATE_SESSION: 15,
    ATTEND_SESSION: 20,
    COMPLETE_SESSION_QUIZ: 50,
    RATE_SESSION: 5
};

// Badge thresholds
const BADGE_THRESHOLDS = {
    'First Step': { points: 1 },
    'Helper': { sessionsCompleted: 3 },
    'Quick Learner': { points: 200 },
    'Knowledge Sharer': { questionsAnswered: 10 },
    'Mentor': { sessionsCompleted: 10 },
    'Legend': { points: 400 }
};

/**
 * Award points to a user and update their stats
 */
export const awardPoints = async (userId, pointsToAward, reason, statsUpdate = {}) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Update points
        user.points = (user.points || 0) + pointsToAward;

        // Update additional stats
        if (statsUpdate.sessionsCompleted) {
            user.sessionsCompleted = (user.sessionsCompleted || 0) + statsUpdate.sessionsCompleted;
        }
        if (statsUpdate.questionsAnswered) {
            user.questionsAnswered = (user.questionsAnswered || 0) + statsUpdate.questionsAnswered;
        }
        if (statsUpdate.questionsAsked) {
            user.questionsAsked = (user.questionsAsked || 0) + statsUpdate.questionsAsked;
        }

        // Check and award badges
        const newBadges = checkAndAwardBadges(user);
        
        await user.save();

        return {
            points: user.points,
            pointsAwarded: pointsToAward,
            newBadges,
            reason
        };
    } catch (error) {
        console.error('Error awarding points:', error);
        throw error;
    }
};

/**
 * Check if user qualifies for new badges
 */
const checkAndAwardBadges = (user) => {
    const currentBadges = user.badges || [];
    const newBadges = [];

    for (const [badgeName, threshold] of Object.entries(BADGE_THRESHOLDS)) {
        // Skip if user already has this badge
        if (currentBadges.includes(badgeName)) {
            continue;
        }

        // Check if user meets threshold
        let qualifies = true;
        if (threshold.points && user.points < threshold.points) {
            qualifies = false;
        }
        if (threshold.sessionsCompleted && user.sessionsCompleted < threshold.sessionsCompleted) {
            qualifies = false;
        }
        if (threshold.questionsAnswered && user.questionsAnswered < threshold.questionsAnswered) {
            qualifies = false;
        }

        if (qualifies) {
            user.badges.push(badgeName);
            newBadges.push(badgeName);
        }
    }

    return newBadges;
};

/**
 * Award points for completing a session quiz
 */
export const awardQuizPoints = async (req, res, next) => {
    try {
        const { id } = req.user;
        const { sessionId, score, totalQuestions } = req.body;

        if (!sessionId || typeof score === 'undefined' || !totalQuestions) {
            return next(errorHandler(400, 'Missing required fields'));
        }


        // No minimum passing requirement — award points based on correct answers
        // and ensure we do not award more than once (idempotent).

        // Points per correct answer (keep in sync with frontend QUIZ_POINTS_PER_CORRECT)
        const POINTS_PER_CORRECT = 10;

        // Check whether the user already has a completion record for this session
        const user = await User.findById(id);
        if (!user) return next(errorHandler(404, 'User not found'));

        const already = Array.isArray(user.quizCompletions) && user.quizCompletions.find((c) => String(c.sessionId) === String(sessionId));
        if (already) {
            // Return the existing award info and do not duplicate
            return res.status(200).json({
                success: true,
                message: 'Quiz already completed',
                data: {
                    passed: true,
                    score,
                    totalQuestions,
                    pointsAwarded: already.awardedPoints,
                    alreadyAwarded: true,
                    existing: already
                }
            });
        }

        // Compute awarded points directly from number of correct answers
        const totalPoints = (Number(score) || 0) * POINTS_PER_CORRECT;

        // Use awardPoints helper to persist points and stats
        const result = await awardPoints(
            id,
            totalPoints,
            'Completed session quiz',
            { sessionsCompleted: 1 }
        );

        // Persist a quiz completion record on the user so we don't double award later.
        // Use an atomic update to avoid overwriting fields modified by awardPoints.
        await User.findByIdAndUpdate(id, {
            $push: { quizCompletions: { sessionId, score, awardedPoints: totalPoints } }
        }, { new: true });

        res.status(200).json({
            success: true,
            message: 'Quiz completed successfully!',
            data: {
                passed: true,
                score,
                totalQuestions,
                pointsAwarded: totalPoints,
                ...result
            }
        });

    } catch (error) {
        next(errorHandler(500, error.message));
    }
};

/**
 * Get points configuration (for frontend reference)
 */
export const getPointsConfig = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            data: {
                points: POINTS_CONFIG,
                badges: BADGE_THRESHOLDS
            }
        });
    } catch (error) {
        next(errorHandler(500, error.message));
    }
};

export { POINTS_CONFIG, BADGE_THRESHOLDS };

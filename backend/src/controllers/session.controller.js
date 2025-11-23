import { errorHandler } from '../utils/errorHandler.js'
import User from '../models/user.model.js'
import Session from '../models/session.model.js'
import Notification from '../models/notification.model.js'
import { createSessionInvites } from './notification.controller.js'
import SessionDocument from '../models/sessionDocument.model.js'
import { awardPoints, POINTS_CONFIG } from './points.controller.js'

const calculateAverageRating = (ratings = []) => {
    if (!ratings.length) return 0
    const total = ratings.reduce((sum, entry) => sum + (entry.rating || 0), 0)
    return Number((total / ratings.length).toFixed(2))
}

export const createSession = async (req, res, next) => {

    try {

        const { id } = req.user;

        const user = await User.findById(id)
        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        const {
            topic,
            details,
            sessionType,
            duration,
            preferedTimings,
            sessionOn,
            location,
            link,
            quizQuestions
        } = req.body

        if (!topic || !sessionType || !duration || !sessionOn) {
            return next(errorHandler(400, 'Missing required session fields'))
        }

        const parsedSessionDate = new Date(sessionOn)
        if (isNaN(parsedSessionDate.getTime())) {
            return next(errorHandler(400, 'Invalid session date'))
        }

    const sessionOnValue = parsedSessionDate

        const normalizedSessionType = sessionType === 'In Person' || sessionType === 'In person'
            ? 'In Person'
            : 'Video Session'

        const sessionData = {
            createdBy: id,
            topic,
            details,
            sessionType: normalizedSessionType,
            duration,
            preferedTimings,
            sessionOn: sessionOnValue
        }

        // Add quiz questions if provided
        if (quizQuestions && Array.isArray(quizQuestions) && quizQuestions.length > 0) {
            sessionData.quizQuestions = quizQuestions;
        }

        if (normalizedSessionType === 'In Person') {
            sessionData.location = location || ''
            sessionData.link = ''
        } else {
            sessionData.link = link || ''
            sessionData.location = ''
        }
        const newSession = new Session(sessionData)

        await newSession.save()
        
        // Award points for creating a session
        try {
            await awardPoints(id, POINTS_CONFIG.CREATE_SESSION, 'Created a session');
        } catch (error) {
            console.error('Failed to award points for creating session:', error);
        }

        // Create notifications for all connections
        await createSessionInvites(newSession, id)

        res
            .status(201)
            .json({
                success: true,
                message: "Session created successfully",
                data: { session: newSession }
            })

    } catch (error) {
        next(errorHandler(500, error.message));
    }
}

export const acceptSessionInvite = async (req, res, next) => {

    try {

        const { id } = req.user
        const { sessionId } = req.body

        const user = await User.findById(id)
        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }
        const session = await Session.findById(sessionId).populate('createdBy', 'name email avatar')
        if (!session) {
            return next(errorHandler(404, 'Session not found'));
        }

        if (session.members.some(member => member.toString() === id)) {
            return next(errorHandler(400, 'User already a member of the session'));
        }
        session.members.push(id)
        user.sessions.push(sessionId)
        await user.save()
        await session.save()
        
        // Award points for attending a session
        try {
            await awardPoints(id, POINTS_CONFIG.ATTEND_SESSION, 'Attended a session');
        } catch (error) {
            console.error('Failed to award points for attending session:', error);
        }

        res
            .status(200)
            .json({
                success: true,
                message: "Session joined successfully",
                data: { session: session }
            })

    } catch (error) {
        next(errorHandler(500, error.message));
    }
}

export const cancelSession = async (req, res, next) => {

    try {
        const { id } = req.user
        const { sessionId } = req.body

        const user = await User.findById(id)
        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }
        const session = await Session.findById(sessionId)
        if (!session) {
            return next(errorHandler(404, 'Session not found'));
        }

        if (!session.members.some(member => member.toString() === id)) {
            return next(errorHandler(400, 'User not a member of the session'));
        }

        session.members = session.members.filter(memberId => memberId.toString() !== id);
        user.sessions = user.sessions.filter(sId => sId.toString() !== sessionId);
        await user.save()
        await session.save()

        res
            .status(200)
            .json({
                success: true,
                message: "Session cancelled successfully",
                data: { session: session }
            })


    } catch (error) {
        next(errorHandler(500, error.message));
    }

}

export const getSessionsCreated = async (req, res, next) => {

    try {

        const { id } = req.user

        const user = await User.findById(id)
        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

    const sessions = await Session.find({ createdBy: id }).sort({ sessionOn: 1 })

        res
            .status(200)
            .json({
                success: true,
                message: "Sessions fetched successfully",
                data: { sessions: sessions }
            })

    } catch (error) {
        next(errorHandler(500, error.message));
    }
}

export const getSessionById = async (req, res, next) => {

    try {

        const { sessionId } = req.params
        const session = await Session.findById(sessionId)
        if (!session) {
            return next(errorHandler(404, 'Session not found'));
        }

        res
            .status(200)
            .json({
                success: true,
                message: "Session fetched successfully",
                data: { session: session }
            })

    } catch (error) {
        next(errorHandler(500, error.message));
    }

}

export const deleteSessionById = async (req, res, next) => {

    try {
        const { sessionId } = req.body
        const session = await Session.findById(sessionId)
        if (!session) {
            return next(errorHandler(404, 'Session not found'));
        }

        for (const memberId of session.members) {

            const user = await User.findById(memberId)
            if (!user) {
                return next(errorHandler(404, 'User not found'));
            } else {
                user.sessions = user.sessions.filter(sId => sId._id.toString() !== sessionId);
                await user.save()
            }

        }
    await Notification.deleteMany({ 'metadata.sessionId': sessionId })
        await Session.findByIdAndDelete(sessionId)
        res
            .status(200)
            .json({
                success: true,
                message: "Session deleted successfully",
            })

    } catch (error) {
        next(errorHandler(500, error.message));
    }

}

export const getSessionsJoined = async (req, res, next) => {

    try {

        const { id } = req.user

        const user = await User.findById(id)
        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        const sessions = await Session.find({ members: id })
            .populate('createdBy', 'name email avatar')
            .sort({ sessionOn: 1 })

        res
            .status(200)
            .json({
                success: true,
                message: "Joined sessions fetched successfully",
                data: { sessions }
            })

    } catch (error) {
        next(errorHandler(500, error.message));
    }
}

export const rateSession = async (req, res, next) => {
    try {
        const { id } = req.user
        const { sessionId, rating, comment } = req.body

        if (!sessionId || typeof rating === 'undefined') {
            return next(errorHandler(400, 'Session ID and rating are required'))
        }

        const numericRating = Number(rating)
        if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
            return next(errorHandler(400, 'Rating must be between 1 and 5'))
        }

        const session = await Session.findById(sessionId)
        if (!session) {
            return next(errorHandler(404, 'Session not found'))
        }

        const isParticipant = session.createdBy.toString() === id || session.members.some(member => member.toString() === id)
        if (!isParticipant) {
            return next(errorHandler(403, 'You are not part of this session'))
        }

        const existingIndex = session.ratings.findIndex(r => r.user.toString() === id)
        const isNewRating = existingIndex === -1;
        
        if (existingIndex > -1) {
            session.ratings[existingIndex].rating = numericRating
            session.ratings[existingIndex].comment = comment || ''
            session.ratings[existingIndex].createdAt = new Date()
        } else {
            session.ratings.push({
                user: id,
                rating: numericRating,
                comment: comment || ''
            })
        }

        session.averageRating = calculateAverageRating(session.ratings)
        await session.save()
        
        // Award points for rating a session (only for new ratings)
        if (isNewRating) {
            try {
                await awardPoints(id, POINTS_CONFIG.RATE_SESSION, 'Rated a session');
            } catch (error) {
                console.error('Failed to award points for rating session:', error);
            }
        }

        const invitations = await Notification.find({
            'metadata.sessionId': sessionId,
            type: 'session_invite'
        })

        for (const invite of invitations) {
            const exists = await Notification.exists({
                recipient: invite.recipient,
                type: 'session_rating',
                'metadata.inviteId': invite._id
            })

            if (!exists) {
                await Notification.create({
                    recipient: invite.recipient,
                    sender: id,
                    type: 'session_rating',
                    title: 'Rate your session',
                    message: 'Share your feedback for the session you attended.',
                    metadata: {
                        sessionId,
                        inviteId: invite._id,
                        actionType: 'view'
                    }
                })
            }
        }

        res.status(200).json({
            success: true,
            message: 'Session rated successfully',
            data: { session }
        })

    } catch (error) {
        next(errorHandler(500, error.message))
    }
}

// Create session with documents (multipart/form-data)
export const createSessionWithDocuments = async (req, res, next) => {
    try {
    console.log('[createSessionWithDocuments] headers.authorization present:', !!req.headers.authorization, 'cookie.userToken present:', !!req.cookies?.userToken);
    console.log('[createSessionWithDocuments] req.headers:', JSON.stringify(req.headers));
    console.log('[createSessionWithDocuments] verifyUser populated req.user:', !!req.user, 'userId:', req.user?.id || 'none');
        const { id } = req.user;

        const sessionDataJson = req.body.sessionData;
        if (!sessionDataJson) {
            return next(errorHandler(400, 'Missing session data'));
        }

        const sessionDataParsed = JSON.parse(sessionDataJson);
        const {
            topic,
            details,
            sessionType,
            duration,
            preferedTimings,
            sessionOn,
            location,
            link,
            quizQuestions
        } = sessionDataParsed;

        if (!topic || !sessionType || !duration || !sessionOn) {
            return next(errorHandler(400, 'Missing required session fields'));
        }

        const parsedSessionDate = new Date(sessionOn);
        if (isNaN(parsedSessionDate.getTime())) {
            return next(errorHandler(400, 'Invalid session date'));
        }

        const normalizedSessionType = sessionType === 'In Person' || sessionType === 'In person'
            ? 'In Person'
            : 'Video Session'

        const sessionData = {
            createdBy: id,
            topic,
            details,
            sessionType: normalizedSessionType,
            duration,
            preferedTimings,
            sessionOn: parsedSessionDate
        }

        if (quizQuestions && Array.isArray(quizQuestions) && quizQuestions.length > 0) {
            sessionData.quizQuestions = quizQuestions;
        }

        if (normalizedSessionType === 'In Person') {
            sessionData.location = location || ''
            sessionData.link = ''
        } else {
            sessionData.link = link || ''
            sessionData.location = ''
        }

        const newSession = new Session(sessionData)
        await newSession.save()

        // Handle uploaded files
        const files = req.files || [];
        const MAX_FILES = 10;
        const savedDocuments = [];

        if (files.length > MAX_FILES) {
            return next(errorHandler(400, 'Cannot upload more than 10 files'));
        }

        for (const file of files) {
            const doc = await SessionDocument.create({
                sessionId: newSession._id,
                filename: file.originalname,
                fileType: file.mimetype,
                fileSize: file.size,
                uploadedBy: id,
                uploadUrl: `/uploads/sessions/${file.filename}`
            });
            savedDocuments.push(doc);
        }

        // Award points for creating a session
        try {
            await awardPoints(id, POINTS_CONFIG.CREATE_SESSION, 'Created a session');
        } catch (error) {
            console.error('Failed to award points for creating session:', error);
        }

        // Invite connections
        await createSessionInvites(newSession, id)

        res.status(201).json({ success: true, message: 'Session created with documents', data: { session: newSession, documents: savedDocuments } })
    } catch (error) {
        next(errorHandler(500, error.message))
    }
}
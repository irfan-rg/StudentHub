import User from '../models/user.model.js'
import Notification from '../models/notification.model.js'
import { errorHandler } from '../utils/errorHandler.js'
import fetch from 'node-fetch'

// Get ML-based user recommendations from Python backend
export const getSuggestions = async (req, res, next) => {
    try {
        const { id } = req.user

        const currentUser = await User.findById(id).select('-password')
        if (!currentUser) {
            return next(errorHandler(404, 'User not found'))
        }

        // Prepare user data for Python ML model
        // Default to finding teachers for the skills the user wants to learn, but allow mode query param
        const mode = req.query.mode || 'learn'; // 'learn' (find teachers) or 'teach' (find similar teachers)
        const skillsToMatch = (mode === 'teach')
            ? currentUser.skillsCanTeach?.map(s => s.name) || []
            : currentUser.skillsWantToLearn?.map(s => s.name) || currentUser.skillsCanTeach?.map(s => s.name) || [];

        const userData = {
            educationLevel: currentUser.educationLevel,
            // ML backend expects field 'skillsCanTeach' for the features matrix; pass skillsToMatch under that field
            skillsCanTeach: skillsToMatch,
            badges: currentUser.badges,
            points: currentUser.points,
            sessionsCompleted: currentUser.sessionsCompleted,
            questionsAnswered: currentUser.questionsAnswered,
            rating: currentUser.rating || 0
        }

        // Call Python ML backend for recommendations
        try {
            const mlResponse = await fetch('http://localhost:4444/get-recomendations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user: userData,
                    nums: 10
                })
            })

            if (!mlResponse.ok) {
                throw new Error('ML service unavailable')
            }

            const mlData = await mlResponse.json()
            const recommendedUserIds = mlData.result || []

            // Fetch full user details for recommended users
            const userIds = recommendedUserIds.map(u => u._id)
            const recommendedUsers = await User.find({
                _id: { $in: userIds },
                _id: { $ne: id } // Exclude current user
            }).select('name email college educationLevel avatar skillsCanTeach rating points badges sessionsCompleted')
            // If we're in 'learn' mode (finding teachers), ensure recommended users actually teach the skill the requester wants to learn
            if (mode === 'learn' && skillsToMatch && skillsToMatch.length > 0) {
                const filteredBySkill = recommendedUsers.filter(u => {
                    const teaches = Array.isArray(u.skillsCanTeach) ? u.skillsCanTeach.map(s => s.name) : [];
                    return skillsToMatch.some(sk => teaches.includes(sk));
                });
                // If any recommended users match the skill requirement, use them; otherwise keep the original set
                if (filteredBySkill.length > 0) {
                    recommendedUsers.splice(0, recommendedUsers.length, ...filteredBySkill);
                }
            }
            // Merge with similarity scores
            const usersWithSimilarity = recommendedUsers.map(user => {
                const mlUser = recommendedUserIds.find(u => u._id === user._id.toString())
                return {
                    ...user.toObject(),
                    similarity: mlUser?.similarity || 0
                }
            })

            res.status(200).json({
                success: true,
                message: 'Suggestions fetched successfully',
                data: { matches: usersWithSimilarity }
            })

        } catch (mlError) {
            console.error('ML service error:', mlError)
            // Fallback: return random users if ML service is down
            const fallbackUsers = await User.find({
                _id: { $ne: id }
            })
                .limit(10)
                .select('name email college educationLevel avatar skillsCanTeach rating points badges sessionsCompleted')
            // Include a similarity field (if already computed in DB as matchPercentage) so front-end can display match percentage even in fallback
            const fallbackWithSimilarity = fallbackUsers.map(u => ({
                ...u.toObject(),
                similarity: u.matchPercentage || 0
            }));

            res.status(200).json({
                success: true,
                message: 'Suggestions fetched (fallback mode)',
                data: { matches: fallbackWithSimilarity }
            })
        }

    } catch (error) {
        next(errorHandler(500, error.message))
    }
}

// Find users by skill/filter (for discovery page)
export const findUsers = async (req, res, next) => {
    try {
        const { id } = req.user
        const { skill, university, level, search } = req.query

        const currentUser = await User.findById(id)
        if (!currentUser) {
            return next(errorHandler(404, 'User not found'))
        }

        // Build filter query
        const filter = {
            _id: { $ne: id } // Exclude current user
        }

        // Handle skill filter
        if (skill && skill !== 'all') {
            filter['skillsCanTeach.name'] = { $regex: skill, $options: 'i' }
        }

        // Handle university filter
        if (university && university !== 'all') {
            filter.college = { $regex: university, $options: 'i' }
        }

        // Handle level filter
        if (level && level !== 'all') {
            filter['skillsCanTeach.level'] = level
        }

        // Handle search (separate from other filters)
        if (search && search.trim() !== '') {
            const searchRegex = { $regex: search, $options: 'i' }
            filter.$or = [
                { name: searchRegex },
                { college: searchRegex },
                { 'skillsCanTeach.name': searchRegex },
                { bio: searchRegex }
            ]
        }

        const users = await User.find(filter)
            .select('name email college educationLevel avatar skillsCanTeach skillsWantToLearn rating points badges bio connections sessionsCompleted')
            .limit(50)
            .sort({ rating: -1, points: -1 }) // Sort by rating and points

        res.status(200).json({
            success: true,
            message: `Found ${users.length} users`,
            data: users
        })

    } catch (error) {
        next(errorHandler(500, error.message))
    }
}

// Get user's connections
export const getConnections = async (req, res, next) => {
    try {
        const { id } = req.user

        const user = await User.findById(id)
            .populate('connections', 'name email college educationLevel avatar skillsCanTeach rating points sessionsCompleted')

        if (!user) {
            return next(errorHandler(404, 'User not found'))
        }

        res.status(200).json({
            success: true,
            message: 'Connections retrieved successfully',
            data: { connections: user.connections }
        })

    } catch (error) {
        next(errorHandler(500, error.message))
    }
}

// Get pending connection requests
export const getConnectionRequests = async (req, res, next) => {
    try {
        const { id } = req.user

        // Get requests received by the user
        const receivedRequests = await Notification.find({
            recipient: id,
            type: 'connection_request',
            isRead: false
        })
            .populate('sender', 'name email college educationLevel avatar skillsCanTeach rating points sessionsCompleted')
            .sort({ createdAt: -1 })

        // Get requests sent by the user (still pending)
        const sentRequests = await Notification.find({
            sender: id,
            type: 'connection_request',
            isRead: false
        })
            .populate('recipient', 'name email college educationLevel avatar skillsCanTeach rating points sessionsCompleted')
            .sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            message: 'Connection requests retrieved successfully',
            data: { 
                requests: receivedRequests,
                sentRequests: sentRequests
            }
        })

    } catch (error) {
        next(errorHandler(500, error.message))
    }
}

// Send connection request (creates a notification)
export const sendConnectionRequest = async (req, res, next) => {
    try {
        const { id } = req.user
        const { partnerId, message } = req.body

        if (!partnerId) {
            return next(errorHandler(400, 'Partner ID is required'))
        }

        if (partnerId === id) {
            return next(errorHandler(400, 'Cannot connect with yourself'))
        }

        const currentUser = await User.findById(id)
        const partnerUser = await User.findById(partnerId)

        if (!currentUser || !partnerUser) {
            return next(errorHandler(404, 'User not found'))
        }

        // Check if already connected
        if (currentUser.connections.includes(partnerId)) {
            return next(errorHandler(400, 'Already connected with this user'))
        }

        // Check if request already exists from this sender to recipient (avoid double-sending)
        const existingRequest = await Notification.findOne({
            sender: id,
            recipient: partnerId,
            type: 'connection_request'
        })

        if (existingRequest) {
            return next(errorHandler(400, 'Connection request already sent'))
        }

        // Create notification for connection request
        const notification = await Notification.create({
            recipient: partnerId,
            sender: id,
            type: 'connection_request',
            title: 'New Connection Request',
            message: message || `${currentUser.name} wants to connect with you`,
            metadata: {
                actionType: 'accept',
                actionUrl: `/connections/${id}`
            }
        })

        res.status(200).json({
            success: true,
            message: 'Connection request sent successfully',
            data: { notification }
        })

    } catch (error) {
        next(errorHandler(500, error.message))
    }
}

// Accept connection request
export const acceptConnectionRequest = async (req, res, next) => {
    try {
        const { id } = req.user
        // Accept either notificationId (from notifications UI) or requesterId (when accepting from matching page)
        let { notificationId, requesterId } = req.body
        if (!notificationId && requesterId) {
            // find the notification by sender/recipient
            const notif = await Notification.findOne({ sender: requesterId, recipient: id, type: 'connection_request' }).sort({ createdAt: -1 })
            notificationId = notif?._id
        }
        if (!notificationId) {
            return next(errorHandler(400, 'Notification ID is required'))
        }

        if (!notificationId) {
            return next(errorHandler(400, 'Notification ID is required'))
        }

        // Find the notification
        const notification = await Notification.findById(notificationId)
        if (!notification) {
            return next(errorHandler(404, 'Notification not found'))
        }

        if (notification.recipient.toString() !== id) {
            return next(errorHandler(403, 'Unauthorized'))
        }

        if (notification.type !== 'connection_request') {
            return next(errorHandler(400, 'Not a connection request'))
        }

        const senderId = notification.sender
        const currentUser = await User.findById(id)
        const senderUser = await User.findById(senderId)

        if (!currentUser || !senderUser) {
            return next(errorHandler(404, 'User not found'))
        }

        // Add to both users' connections (bi-directional)
        if (!currentUser.connections.includes(senderId)) {
            currentUser.connections.push(senderId)
        }
        if (!senderUser.connections.includes(id)) {
            senderUser.connections.push(id)
        }

        await currentUser.save()
        await senderUser.save()

        // Delete the original connection request notification
        await Notification.findByIdAndDelete(notificationId)

        // Create notification for the sender
        await Notification.create({
            recipient: senderId,
            sender: id,
            type: 'connection_accepted',
            title: 'Connection Accepted',
            message: `${currentUser.name} accepted your connection request`,
            metadata: {
                actionType: 'view',
                actionUrl: `/connections`
            }
        })

        res.status(200).json({
            success: true,
            message: 'Connection request accepted',
            data: { connection: senderUser }
        })

    } catch (error) {
        next(errorHandler(500, error.message))
    }
}

// Decline connection request
export const declineConnectionRequest = async (req, res, next) => {
    try {
        const { id } = req.user
        // Decline can be called with notificationId or requesterId
        let { notificationId, requesterId } = req.body
        if (!notificationId && requesterId) {
            const notif = await Notification.findOne({ sender: requesterId, recipient: id, type: 'connection_request' }).sort({ createdAt: -1 })
            notificationId = notif?._id
        }
        if (!notificationId) {
            return next(errorHandler(400, 'Notification ID is required'))
        }

        if (!notificationId) {
            return next(errorHandler(400, 'Notification ID is required'))
        }

        // Find the notification
        const notification = await Notification.findById(notificationId)
        if (!notification) {
            return next(errorHandler(404, 'Notification not found'))
        }

        if (notification.recipient.toString() !== id) {
            return next(errorHandler(403, 'Unauthorized'))
        }

        if (notification.type !== 'connection_request') {
            return next(errorHandler(400, 'Not a connection request'))
        }

        const senderIdDecline = notification.sender
        const currentUserDecline = await User.findById(id)
        const senderUserDecline = await User.findById(senderIdDecline)

        if (!currentUserDecline || !senderUserDecline) {
            return next(errorHandler(404, 'User not found'))
        }

        // Delete the original notification (instead of just marking as read)
        await Notification.findByIdAndDelete(notificationId)

        // Notify the sender the request has been declined
        await Notification.create({
            recipient: senderIdDecline,
            sender: id,
            type: 'connection_declined',
            title: 'Connection Declined',
            message: `${currentUserDecline.name} declined your connection request`,
            metadata: {
                actionType: 'view',
                actionUrl: `/connections`
            }
        })

        res.status(200).json({
            success: true,
            message: 'Connection request declined'
        })

    } catch (error) {
        next(errorHandler(500, error.message))
    }
}

// Delete/remove connection
export const deleteConnection = async (req, res, next) => {
    try {
        const { id } = req.user
        const { connectionId } = req.params

        const currentUser = await User.findById(id)
        const partnerUser = await User.findById(connectionId)

        if (!currentUser || !partnerUser) {
            return next(errorHandler(404, 'User not found'))
        }

        // Remove from both users' connections
        currentUser.connections = currentUser.connections.filter(
            c => c.toString() !== connectionId
        )
        partnerUser.connections = partnerUser.connections.filter(
            c => c.toString() !== id
        )

        await currentUser.save()
        await partnerUser.save()

        res.status(200).json({
            success: true,
            message: 'Connection removed successfully'
        })

    } catch (error) {
        next(errorHandler(500, error.message))
    }
}

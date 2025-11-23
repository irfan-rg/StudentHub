import Notification from '../models/notification.model.js'
import User from '../models/user.model.js'
import Session from '../models/session.model.js'
import { errorHandler } from '../utils/errorHandler.js'

// Get user notifications
export const getUserNotifications = async (req, res, next) => {
    try {
        const { id } = req.user
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 20
        const skip = (page - 1) * limit

        const notifications = await Notification.find({ recipient: id })
            .populate('sender', 'name avatar')
            .populate({ path: 'metadata.sessionId', populate: { path: 'createdBy', select: 'name email avatar' } })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        // Rebuild messages for 'session_accepted' and 'session_declined' to ensure sender name shows correctly
        const sanitizedNotifications = notifications.map((n) => {
            if (n.type === 'session_accepted' || n.type === 'session_declined') {
                const actorName = n.sender?.name || 'Someone';
                const sessionTitle = n.metadata?.sessionId?.topic || n.metadata?.sessionId?.title || '';
                n.message = `${actorName} has ${n.type === 'session_accepted' ? 'accepted' : 'declined'} your session invitation${sessionTitle ? `: "${sessionTitle}"` : ''}`;
            }
            return n;
        })

        const total = await Notification.countDocuments({ recipient: id })

        res.status(200).json({
            success: true,
            message: 'Notifications fetched successfully',
            data: {
                notifications,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalNotifications: total,
                    hasNextPage: page * limit < total,
                    hasPrevPage: page > 1
                }
            }
        })

    } catch (error) {
        next(errorHandler(500, error.message))
    }
}

// Get unread notification count
export const getUnreadCount = async (req, res, next) => {
    try {
        const { id } = req.user
        const count = await Notification.countDocuments({
            recipient: id,
            isRead: false
        })

        res.status(200).json({
            success: true,
            data: { unreadCount: count }
        })

    } catch (error) {
        next(errorHandler(500, error.message))
    }
}

// Mark notification as read
export const markAsRead = async (req, res, next) => {
    try {
        const { notificationId } = req.params
        const { id } = req.user

        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, recipient: id },
            { isRead: true },
            { new: true }
        )

        if (!notification) {
            return next(errorHandler(404, 'Notification not found'))
        }

        res.status(200).json({
            success: true,
            message: 'Notification marked as read',
            data: { notification }
        })

    } catch (error) {
        next(errorHandler(500, error.message))
    }
}

// Mark all notifications as read
export const markAllAsRead = async (req, res, next) => {
    try {
        const { id } = req.user

        await Notification.updateMany(
            { recipient: id, isRead: false },
            { isRead: true }
        )

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read'
        })

    } catch (error) {
        next(errorHandler(500, error.message))
    }
}

// Delete notification
export const deleteNotification = async (req, res, next) => {
    try {
        const { notificationId } = req.params
        const { id } = req.user

        const notification = await Notification.findOneAndDelete({
            _id: notificationId,
            recipient: id
        })

        if (!notification) {
            return next(errorHandler(404, 'Notification not found'))
        }

        res.status(200).json({
            success: true,
            message: 'Notification deleted successfully'
        })

    } catch (error) {
        next(errorHandler(500, error.message))
    }
}

// Clear all notifications
export const clearAllNotifications = async (req, res, next) => {
    try {
        const { id } = req.user

        await Notification.deleteMany({ recipient: id })

        res.status(200).json({
            success: true,
            message: 'All notifications cleared'
        })

    } catch (error) {
        next(errorHandler(500, error.message))
    }
}

// Create session invite notifications for all connections
export const createSessionInvites = async (session, creator) => {
    try {
        const creatorUser = await User.findById(creator).populate('connections')

        if (!creatorUser) {
            return // No connections to notify
        }

        console.log('[createSessionInvites] creatorUser:', creatorUser.name, 'connectionsCount:', (creatorUser.connections || []).length);

        const notifications = creatorUser.connections.map(connection => ({
            recipient: connection._id,
            sender: creator,
            type: 'session_invite',
            title: 'Session Invitation',
            message: `${creatorUser.name} invited you to join a session: "${session.topic}"`,
            metadata: {
                sessionId: session._id,
                actionType: 'accept'
            }
        }))

        const result = await Notification.insertMany(notifications)
        console.log('[createSessionInvites] created notifications:', result.length);

    } catch (error) {
        console.error('Error creating session invites:', error)
    }
}

// Handle session invite response (accept/decline)
export const handleSessionInviteResponse = async (req, res, next) => {
    try {
        const { notificationId } = req.params
        const { action } = req.body // 'accept' or 'decline'
        const { id } = req.user

        const notification = await Notification.findOne({
            _id: notificationId,
            recipient: id,
            type: 'session_invite'
        }).populate('metadata.sessionId')

        if (!notification) {
            return next(errorHandler(404, 'Notification not found'))
        }

        if (!notification.metadata.sessionId) {
            return next(errorHandler(400, 'Session not found'))
        }

        // Delete the original session invite notification after processing
        await Notification.findByIdAndDelete(notificationId)

        // If the user accepted the invite, add the user to the session members and to the user's sessions
        if (action === 'accept') {
            const sessionObj = await Session.findById(notification.metadata.sessionId._id || notification.metadata.sessionId);
            if (sessionObj && !sessionObj.members.some(m => m.toString() === id)) {
                sessionObj.members.push(id);
                await sessionObj.save();
            }

            const u = await User.findById(id);
            if (u && !u.sessions.some(s => s.toString() === (notification.metadata.sessionId._id || notification.metadata.sessionId).toString())) {
                u.sessions.push(notification.metadata.sessionId._id || notification.metadata.sessionId);
                await u.save();
            }
        }

        // Create response notification for session creator
        const currentUser = await User.findById(id);
        // Avoid duplicate response notifications for the same session + sender
        const existsResponse = await Notification.exists({
            recipient: notification.sender,
            type: action === 'accept' ? 'session_accepted' : 'session_declined',
            'metadata.sessionId': notification.metadata.sessionId._id || notification.metadata.sessionId
        })

        let responseNotification = null
        if (!existsResponse) {
            responseNotification = new Notification({
            recipient: notification.sender,
            sender: id,
            type: action === 'accept' ? 'session_accepted' : 'session_declined',
            title: `Session ${action === 'accept' ? 'Accepted' : 'Declined'}`,
            message: `${currentUser?.name || 'Someone'} has ${action === 'accept' ? 'accepted' : 'declined'} your session invitation: "${notification.metadata.sessionId.topic}"`,
            metadata: {
                sessionId: notification.metadata.sessionId._id,
                actionType: 'view'
            }
        })

            await responseNotification.save()
        }

        res.status(200).json({
            success: true,
            message: `Session invitation ${action}ed successfully`,
            data: { notification: responseNotification }
        })

    } catch (error) {
        next(errorHandler(500, error.message))
    }
}
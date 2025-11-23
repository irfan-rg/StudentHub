import express from 'express'
import { verifyToken } from '../utils/verifyUser.js'
import {
    getUserNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    handleSessionInviteResponse
} from '../controllers/notification.controller.js'

const router = express()

router.get('/', (req, res) => {
    res.send("From Notification Page")
})

// Get user notifications with pagination
router.get('/notifications', verifyToken, getUserNotifications)

// Get unread notification count
router.get('/notifications/unread-count', verifyToken, getUnreadCount)

// Mark notification as read
router.put('/notifications/:notificationId/read', verifyToken, markAsRead)

// Mark all notifications as read
router.put('/notifications/read-all', verifyToken, markAllAsRead)

// Delete notification
router.delete('/notifications/:notificationId', verifyToken, deleteNotification)

// Clear all notifications
router.delete('/notifications', verifyToken, clearAllNotifications)

// Handle session invite response (accept/decline)
router.post('/notifications/:notificationId/respond', verifyToken, handleSessionInviteResponse)

export default router
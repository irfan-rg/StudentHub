import express from 'express'
import { verifyToken } from '../utils/verifyUser.js'
import {
    getSuggestions,
    findUsers,
    getConnections,
    getConnectionRequests,
    sendConnectionRequest,
    acceptConnectionRequest,
    declineConnectionRequest,
    deleteConnection
} from '../controllers/matching.controller.js'

const router = express()

router.get('/', (req, res) => {
    res.send("From Matching Page")
})

// Get ML-based user recommendations
router.get('/suggestions', verifyToken, getSuggestions)

// Find users by skill/filter
router.get('/find', verifyToken, findUsers)

// Get user's connections
router.get('/connections', verifyToken, getConnections)

// Get pending connection requests
router.get('/connection-requests', verifyToken, getConnectionRequests)

// Send connection request
router.post('/connect', verifyToken, sendConnectionRequest)

// Accept connection request
router.post('/accept-request', verifyToken, acceptConnectionRequest)

// Decline connection request
router.post('/decline-request', verifyToken, declineConnectionRequest)

// Delete connection
router.delete('/connections/:connectionId', verifyToken, deleteConnection)

export default router
import express from 'express'
import {
    deleteUser,
    getUserById,
    getUserProfile,
    updateUserDetails,
    verifyUser,
    getLeaderboard,
    getUserRank
} from '../controllers/user.controller.js'
import { verifyToken } from '../utils/verifyUser.js'

const router = express()

router.get('/', (req, res) => {
    res.send("From User Page")
})

router.get('/profile', verifyToken, getUserProfile)
router.get('/leaderboard/:filter', verifyToken, getLeaderboard)
router.get('/leaderboard/rank/:userId', verifyToken, getUserRank)
router.get('/:id', verifyToken, getUserById)
router.get('/verify-user/:id', verifyToken, verifyUser)
router.put('/update-details', verifyToken, updateUserDetails)
router.delete('/delete-account', verifyToken, deleteUser)

export default router
import express from 'express'
import { signin, signout, signup, addUserDetails, verify, refresh } from "../controllers/auth.controller.js"
import { verifyToken } from '../utils/verifyUser.js'

const router = express.Router()

router.get('/', (req, res) => {
    res.send("From Auth Page")
})

router.post('/signup', signup)
router.post('/addUser', addUserDetails) // For seeding test users
router.post('/login', signin)
router.post('/signin', signin) // Keep both for backward compatibility
router.post('/logout', signout)
router.get('/signout', signout) // Keep both for backward compatibility
router.get('/verify', verifyToken, verify)
router.post('/refresh', refresh)

export default router
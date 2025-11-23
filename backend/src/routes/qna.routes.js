import express from 'express'
import { 
    answerQuestion, 
    askQuestion, 
    downvoteAnswer, 
    downvoteQuestion, 
    getAllQuestions, 
    getQuestionsByUser, 
    upvoteAnswer, 
    upvoteQuestion 
} from '../controllers/qna.controller.js'
import { verifyToken } from '../utils/verifyUser.js'

const router = express()

router.get('/', (req, res) => {
    res.send("From QNA Page")
})

router.get('/all-questions', verifyToken, getAllQuestions)
router.get('/questions-by-user', verifyToken, getQuestionsByUser)
router.post('/askQuestion', verifyToken, askQuestion)
router.post('/answer', verifyToken, answerQuestion)
router.put('/upvoteQuestion', verifyToken, upvoteQuestion)
router.put('/downvoteQuestion', verifyToken, downvoteQuestion)
router.put('/upvoteAnswer', verifyToken, upvoteAnswer)
router.put('/downvoteAnswer', verifyToken, downvoteAnswer)

export default router
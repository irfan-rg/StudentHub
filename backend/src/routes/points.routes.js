import express from 'express';
import { awardQuizPoints, getPointsConfig } from '../controllers/points.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Award points for completing quiz
router.post('/quiz-complete', verifyToken, awardQuizPoints);

// Get points configuration
router.get('/config', getPointsConfig);

export default router;

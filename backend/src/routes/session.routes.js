import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { verifyToken } from '../utils/verifyUser.js'
import {
    acceptSessionInvite,
    cancelSession,
    createSession,
    createSessionWithDocuments,
    deleteSessionById,
    getSessionById,
    getSessionsCreated,
    getSessionsJoined,
    rateSession
} from '../controllers/session.controller.js';

const router = express.Router()

// Storage for session documents
const uploadsDir = path.join(process.cwd(), 'uploads', 'sessions');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        if (allowed.includes(file.mimetype)) cb(null, true);
        else cb(new Error('Invalid file type'), false);
    }
});

router.get('/', (req, res) => {
    res.send("From Sessin Page")
})

router.get('/get-session/:sessionId', verifyToken, getSessionById);
router.get('/created-session', verifyToken, getSessionsCreated);
router.get('/joined-session', verifyToken, getSessionsJoined);
router.post('/create-session', verifyToken, createSession);
// Create session with files using multipart/form-data
router.post('/create-with-documents', verifyToken, upload.array('documents', 10), createSessionWithDocuments);
router.post('/accept-session', verifyToken, acceptSessionInvite);
router.post('/cancel-session', verifyToken, cancelSession);
router.post('/delete-session', verifyToken, deleteSessionById);
router.post('/rate-session', verifyToken, rateSession);

export default router
import 'dotenv/config';
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.routes.js'
import userRouter from './routes/user.routes.js'
import skillRouter from './routes/skill.routes.js'
import sessionRouter from './routes/session.routes.js'
import matchingRouter from './routes/matching.routes.js'
import qnaRouter from './routes/qna.routes.js'
import notificationRouter from './routes/notification.routes.js'
import pointsRouter from './routes/points.routes.js'
import { handleErrors } from "./middlewares/error.middleware.js"
import path from 'path'

const app = express()

// CORS Configuration for Frontend Integration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

// Root route for testing
app.get('/', (req, res) => {
    res.json({
        message: "🚀 Student Hub Backend Server is Running!",
        version: "1.0.0",
        endpoints: {
            api: "/api",
            auth: "/api/auth",
            users: "/api/user",
            skills: "/api/skill",
            sessions: "/api/session",
            matching: "/api/matching",
            qna: "/api/qna",
            notifications: "/api/notifications",
            points: "/api/points"
        }
    })
})

app.get('/api', (req, res) => {
    res.send("From Main Page")
})

app.use('/api/auth', authRouter)
// Print useful route map on startup to aid debugging.
const listRoutes = () => {
    try {
        const routes = [];
        app._router.stack.forEach((middleware) => {
            if (middleware.route) {
                const method = Object.keys(middleware.route.methods)[0].toUpperCase();
                routes.push(`${method} ${middleware.route.path}`);
            } else if (middleware.name === 'router' && middleware.handle?.stack) {
                middleware.handle.stack.forEach((handler) => {
                    if (handler.route) {
                        const m = Object.keys(handler.route.methods)[0].toUpperCase();
                        routes.push(`${m} ${handler.route.path}`);
                    }
                });
            }
        });
        console.log('[app] Registered routes:', routes);
    } catch (e) {
        console.log('[app] Could not list routes', e.message);
    }
}
listRoutes();
app.use('/api/user', userRouter)
app.use('/api/skill', skillRouter)
app.use('/api/session', sessionRouter)
app.use('/api/matching', matchingRouter)
app.use('/api/qna', qnaRouter)
app.use('/api/points', pointsRouter)
app.use('/api', notificationRouter)

// Serve uploaded files from uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

app.use(handleErrors)

export default app
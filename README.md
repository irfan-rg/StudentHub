# 🎓 AI-Powered Student Hub

> A comprehensive platform connecting students for collaborative learning, knowledge sharing, and skill development.

[![Made with React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green.svg)](https://www.mongodb.com/)
[![Python](https://img.shields.io/badge/Python-3.11-blue.svg)](https://www.python.org/)

---

## Overview

**AI-Powered Student Hub** is a modern web application that helps students connect with peers, share knowledge, schedule learning sessions, and grow together. Built with a dual backend architecture combining Node.js for core functionality and Python for AI/ML features.

###  Key Features

- **Smart Matching**: ML-powered student matching based on skills and learning goals
- **Learning Sessions**: Schedule and manage collaborative learning sessions
- **Q&A Forum**: Ask questions, share knowledge, and help each other
- **AI Quiz Generator**: Upload PDFs and automatically generate quizzes using AI
- **Gamification**: Earn points, climb the leaderboard, and track progress
- **Real-time Notifications**: Stay updated on connections, sessions, and interactions
- **Dark Mode**: Beautiful UI with light and dark themes
- **Modern Tech Stack**: React, Node.js, Python, MongoDB

---

##  Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  React Router • Zustand • Tailwind CSS • Radix UI          │
└───────────────────┬─────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼───────┐      ┌────────▼────────┐
│  Node Backend │      │ Python Backend  │
│   (Port 5000) │      │   (Port 4444)   │
│               │      │                 │
│ • Auth        │      │ • ML Matching   │
│ • Sessions    │      │ • Quiz Gen      │
│ • Q&A         │      │ • Navigation Assistant (menu-driven)       │
│ • Points      │      │ • AI Features   │
└───────┬───────┘      └────────┬────────┘
        │                       │
        └───────────┬───────────┘
                    │
            ┌───────▼────────┐
            │   MongoDB      │
            │  (Atlas/Local) │
            └────────────────┘
```

### Technology Stack

#### Frontend
- **Framework**: React 18 with Vite
- **State Management**: Zustand with persistence
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Notifications**: Sonner

#### Backend (Node.js)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcrypt
- **File Upload**: Multer
- **Validation**: Express Validator

-#### Backend (Python)
- **Framework**: Flask
- **AI/ML**: Google Gemini
- **ML Library**: Scikit-learn (K-means clustering)
- **PDF Processing**: PyMuPDF
- **Database**: PyMongo

---

##  Project Structure

```
AI-Powered-Student-Hub/
├── frontend/                  # React application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── stores/          # Zustand state stores
│   │   ├── services/        # API service layer
│   │   ├── config/          # Configuration
│   │   └── App.jsx          # Main app component
│   └── package.json
│
├── backend/                   # Node.js API server
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── middlewares/     # Custom middleware
│   │   └── utils/           # Utility functions
│   ├── uploads/             # Uploaded files
│   └── server.js
│
├── python-backend/            # Python AI/ML services
│   ├── app.py               # Flask server
│   ├── ml.py                # ML matching algorithm
│   ├── llm.py               # Assistant/navigation service (LLM/AI features optional)
│   ├── generate_qna.py      # Quiz generator
│   └── requirements.txt
│
└── docs/                      # Documentation
    ├── README.md             # Documentation index
    ├── FRONTEND_ARCHITECTURE.md  # Frontend guide
    ├── backend/              # Backend docs
    ├── implementation/       # Feature docs
    └── guides/               # Setup guides
```

---

##  Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.11+) - [Download](https://www.python.org/)
- **MongoDB** (v6.0+) - [Download](https://www.mongodb.com/) or use MongoDB Atlas
- **Git** - [Download](https://git-scm.com/)
<!-- Ollama removed from the core prerequisites — the assistant no longer requires a local LLM setup -->

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/irfan-rg/StudentHub.git
cd StudentHub
```

#### 2. Setup Node Backend

```bash
cd backend
npm install

# Create .env file (Windows PowerShell)
@"
MONGODB_URI=mongodb://localhost:27017/studenthub
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
"@ | Out-File -FilePath .env -Encoding utf8

# Seed the database with sample data
npm run seed

# Start the server
npm run dev
```

Backend will run on **http://localhost:5000**

#### 3. Setup Python Backend

```bash
cd python-backend
pip install -r requirements.txt

# Create .env file (optional - add your Gemini API key)
@"
GEMINI_API_KEY=your-gemini-api-key-here
"@ | Out-File -FilePath .env -Encoding utf8

<!-- Ollama model installation removed: not required for the navigation assistant -->

# Start the server
python app.py
```

Python backend will run on **http://localhost:4444**

#### 4. Setup Frontend

```bash
cd frontend
npm install

# Create .env file
@"
VITE_API_URL=http://localhost:5000/api
"@ | Out-File -FilePath .env -Encoding utf8

# Start the development server
npm run dev
```

Frontend will run on **http://localhost:5173**

###  Quick Start (All Services)

For convenience, start all services in separate terminals:

**Terminal 1 - Node Backend:**
```powershell
cd backend; npm run dev
```

**Terminal 2 - Python Backend:**
```powershell
cd python-backend; python app.py
```

**Terminal 3 - Frontend:**
```powershell
cd frontend; npm run dev
```

Then open **http://localhost:5173** in your browser!

###  Start everything at once (VS Code)

If you're using VS Code, you can use the VS Code tasks configuration to start all services in integrated terminals:

1. Open the project in VS Code
2. Press `Ctrl+Shift+P` (Command Palette)
3. Type "Tasks: Run Task"
4. Select "Start All Services"

This will run frontend, backend, and python-backend in separate integrated terminals within VS Code.

**Individual Services:** You can also run individual services using "Start Frontend", "Start Backend", or "Start Python Backend" tasks.

**Note:** You'll need to create a VS Code tasks configuration file at `.vscode/tasks.json` to define these tasks. Each task should run the appropriate command (`npm run dev` or `python app.py`) in the correct directory (frontend, backend, or python-backend).

###  Test Accounts

After seeding the database, you can use these test accounts:

| Email | Password | Role |
|-------|----------|------|
| john@student.com | password123 | Student |
| sarah@student.com | password123 | Student |
| mike@student.com | password123 | Student |

---

##  Features in Detail

### 1.  Smart Student Matching

Uses machine learning (K-means clustering + cosine similarity) to suggest the best study partners based on:
- Skills overlap (what you want to learn vs what they can teach)
- Education level compatibility
- University affiliation
- Activity and engagement level

**How it works:**
- Python backend clusters users by skills and attributes
- Calculates similarity scores between users
- Returns top matches sorted by compatibility
- Frontend displays with match percentage

### 2.  Learning Sessions

Create and manage collaborative learning sessions:
- **Schedule sessions** with specific partners
- **Upload PDFs** (up to 3 files per session)
- **Set meeting details** (video link or physical location)
- **Track attendance** and completion
- **Generate AI quizzes** from uploaded materials
- **Earn points** after completing sessions

### 3.  AI-Powered Quiz Generation

Automatically generate quizzes from study materials:
- Upload PDF documents during session creation
- AI extracts text and generates relevant questions
- Multiple-choice format with 4 options
- Automatic grading with instant feedback
- Points awarded based on performance (60%+ to pass)
- Uses Google Gemini for intelligent question generation

### 4.  Q&A Forum

Community-driven knowledge sharing:
- **Ask questions** with detailed descriptions
- **Tag questions** for easy discovery
- **Answer questions** and help peers
- **Vote on questions and answers** (upvote/downvote)
- **Search and filter** by tags, status, time
- **Pagination** for browsing large discussions
- **Points system** for participation

### 5.  Gamification & Points

Earn points for active participation:
- **+50 points**: Complete a learning session
- **+10 points**: Answer a question
- **+25 points**: Get best answer (marked by asker)
- **+5 points**: Make a new connection
- **+2 points**: Daily login bonus

Track your progress on the **Leaderboard**:
- See top performers
- View your rank
- Check points history
- Compete with peers

### 6.  Notification System

Stay updated with real-time notifications:
- **Connection requests** - Accept or decline
- **Session invitations** - Join upcoming sessions
- **Q&A updates** - New answers on your questions
- **Points earned** - Track your rewards
- **Session reminders** - Don't miss scheduled sessions

Polls backend every 30 seconds for new notifications.

### 7.  In-app Navigation Assistant

Quickly navigate the platform and launch common actions using a lightweight, menu-driven assistant:
- Jump to relevant pages (Matching, Sessions, Q&A, Leaderboard, Profile)
- Create or join sessions, post questions, and view matches
- Client-side navigation assistant; not powered by a local LLM

### 8.  Profile Management

Customize your learning profile:
- **Skills to Learn**: What you want to master
- **Skills to Teach**: What you can mentor others in
- **Proficiency Levels**: Beginner, Intermediate, Advanced, Expert
- **Bio and Info**: Share about yourself
- **Avatar Upload**: Personalize your profile
- **Stats Display**: Connections, sessions, points

---

##  User Interface

### Modern & Responsive Design
- Clean, intuitive interface
- Mobile-responsive layouts
- Smooth animations and transitions
- Accessible components (ARIA labels)

### Dark Mode Support
- Toggle between light and dark themes
- Persistent theme preference
- Optimized color schemes for both modes

### Component Library
- Custom components built with Radix UI
- Shadcn/ui inspired design system
- Consistent styling with Tailwind CSS

---

##  Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Protected Routes**: Frontend route guards
- **CORS Protection**: Configured for specific origins
- **Input Validation**: Server-side validation
- **SQL Injection Prevention**: MongoDB parameterized queries
- **XSS Protection**: React automatic escaping
- **Session Management**: Token expiration and refresh

---

##  Documentation

Comprehensive documentation is available in the `docs/` folder:

- **[Documentation Index](docs/README.md)** - Start here for navigation
- **[Frontend Architecture](docs/FRONTEND_ARCHITECTURE.md)** - Complete frontend guide
  - Component documentation
  - State management patterns
  - API integration guide
  - Data flow diagrams
- **[Backend Guide](docs/backend/BACKEND_TEAM_GUIDE.md)** - Backend API reference
- **[Setup Guide](docs/guides/START_HERE.md)** - Step-by-step setup
- **[API Contract](docs/backend-contract.md)** - API endpoints and schemas
- **[Feature Implementation](docs/implementation/)** - Feature-specific docs

### Quick Links
- [How Authentication Works](docs/FRONTEND_ARCHITECTURE.md#authentication-flow)
- [How Matching Algorithm Works](docs/implementation/CONNECTION_SYSTEM.md)
- [How PDF Quiz Generation Works](docs/implementation/PDF_QUIZ_IMPLEMENTATION.md)
- [How Points System Works](docs/implementation/POINTS_SYSTEM_IMPLEMENTATION.md)

---

##  Testing

### Run Tests

**Backend Tests:**
```bash
cd backend
npm test
```

**Frontend Tests:**
```bash
cd frontend
npm test
```

### API Testing

Use the provided Postman collection:
- Located at `docs/postman_collection.json`
- Import into Postman
- Test all API endpoints
- Includes sample requests and responses

---

##  Deployment

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy the `dist/` folder to your hosting service

3. Set environment variable:
```
VITE_API_URL=https://your-backend-url.com/api
```

### Backend Deployment (Heroku/Railway)

1. Ensure MongoDB Atlas is setup

2. Set environment variables:
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-production-secret
PORT=5000
NODE_ENV=production
```

3. Deploy using Git:
```bash
git push heroku main
```

### Python Backend Deployment

1. Deploy to a Python hosting service (PythonAnywhere, Railway)

2. Set environment variables:
```
GEMINI_API_KEY=your-api-key
MONGODB_URI=your-mongodb-uri
```

3. LLM support is optional: if you plan to use AI-based features (e.g., quiz generation enhancements), ensure your deployment has the required LLM runtime or API available and configured.

---

##  Development

### Code Structure

**Frontend follows:**
- Component-based architecture
- Service layer for API calls
- Zustand for state management
- Custom hooks for reusable logic

**Backend follows:**
- MVC (Model-View-Controller) pattern
- RESTful API design
- Middleware for auth and error handling
- Clean separation of concerns

### Adding New Features

1. **Frontend Component:**
   - Create component in `frontend/src/components/`
   - Add route in `App.jsx`
   - Create/use Zustand store for state
   - Integrate with API service

2. **Backend Endpoint:**
   - Define route in `backend/src/routes/`
   - Create controller in `backend/src/controllers/`
   - Add model if needed in `backend/src/models/`
   - Update API documentation

3. **Python AI Feature:**
   - Add function in appropriate module
   - Create Flask endpoint in `app.py`
   - Update frontend to call new endpoint

### Best Practices

- Write clean, documented code
- Follow existing code style
- Test thoroughly before committing
- Update documentation for changes
- Use meaningful commit messages

---

##  Troubleshooting

### Common Issues

**"Cannot connect to MongoDB"**
- Ensure MongoDB is running: `mongod` or check Atlas connection
- Verify `MONGODB_URI` in `.env`
- Check firewall settings

**"CORS error when calling API"**
- Verify `VITE_API_URL` matches backend URL
- Check backend CORS configuration
- Ensure `credentials: 'include'` in API requests

**"Session expired" dialog keeps appearing"**
- Check JWT token validity
- Verify token not expired
- Check backend `/api/auth/verify` endpoint

**"PDF quiz generation failing"**
- Ensure Python backend is running
- Check Gemini API key is valid
- Verify PDF files are readable (not scanned images)

**"No ML recommendations showing"**
- Python backend must be running
- Ensure sufficient users in database (min 3)
- Check Python backend logs for errors

### Getting Help

1. Check [Troubleshooting Guide](docs/FRONTEND_ARCHITECTURE.md#troubleshooting)
2. Review [Documentation](docs/README.md)
3. Check backend logs for errors
4. Open an issue on GitHub

---

##  Team Members

This project was built collaboratively by a dedicated team:

- Dheemanth SH
- Md. Irfan G
- Mohan Kumar S
- Monisha Aradhya CM

*Thank you to all contributors for your hard work and creativity!*

##  Contributing

We welcome contributions! Here's how:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Contribution Guidelines

- Follow existing code style
- Write clear commit messages
- Add tests for new features
- Update documentation
- Keep PRs focused on single features

---

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

##  Acknowledgments

- **Radix UI** - Accessible component primitives
- **Shadcn/ui** - Beautiful UI components
<!-- Ollama (optional) removed from main setup instructions -->
- **Google Gemini** - AI quiz generation
- **MongoDB** - Database platform
- **Vercel** - Hosting and deployment

### Third-Party Attributions

See [docs/reference/Attributions.md](docs/reference/Attributions.md) for complete list of third-party libraries and resources.

---

##  Contact & Support

- **Repository**: [github.com/irfan-rg/StudentHub](https://github.com/irfan-rg/StudentHub)
- **Issues**: [GitHub Issues](https://github.com/irfan-rg/StudentHub/issues)
- **Documentation**: [docs/README.md](docs/README.md)

---

##  Roadmap

### Planned Features

- [ ] **Real-time Chat**: WebSocket-based messaging between students
- [ ] **Video Conferencing**: Built-in video calls for sessions
- [ ] **Mobile App**: React Native mobile application
- [ ] **Advanced Analytics**: Learning progress dashboards
- [ ] **Calendar Integration**: Sync with Google Calendar
- [ ] **Email Notifications**: Alternative to in-app notifications
- [ ] **File Sharing**: Upload and share study materials
- [ ] **Study Groups**: Create persistent learning groups
- [ ] **Achievements System**: Badges and milestones
- [ ] **Course Integration**: Connect with LMS platforms

---

##  Project Stats

- **Frontend Components**: 20+ React components
- **API Endpoints**: 50+ REST endpoints
- **Database Collections**: 6 MongoDB collections
- **State Stores**: 4 Zustand stores
- **Lines of Code**: ~10,000+ lines
- **Features**: 8 major features

---

##  Learning Resources

Built while learning:
- React and modern frontend patterns
- RESTful API design
- MongoDB and Mongoose
- JWT authentication
- Machine learning integration
- AI/LLM integration (Google Gemini; LLM runtime optional)
- Full-stack development

---

**Built with ❤️ by the StudentHub Team**

*Empowering students to learn together, grow together.*

**Last Updated**: November 23, 2025  
**Version**: 1.0.0

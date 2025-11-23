# 📚 Documentation Index

Welcome to the AI-Powered Student Hub documentation. This index will help you find the information you need.

## 🚀 Quick Start

**New to the project?** Start here:
1. [Project README](../README.md) - Project overview and setup
2. [Getting Started Guide](guides/START_HERE.md) - Step-by-step setup instructions
3. [Frontend Architecture](FRONTEND_ARCHITECTURE.md) - Frontend structure and flow

## 📖 Documentation Structure

```
docs/
├── README.md                      # This file - Documentation index
├── FRONTEND_ARCHITECTURE.md       # Detailed frontend documentation
├── backend/                       # Backend documentation
│   ├── BACKEND_TEAM_GUIDE.md     # Backend team reference
│   ├── BACKEND_QUICK_START.md    # Quick start for backend
│   ├── SEEDING_GUIDE.md          # Database seeding guide
│   ├── BACKEND_COMPARISON.md     # Backend architecture comparison
│   └── INTEGRATION_SUMMARY.md    # Integration overview
├── implementation/                # Feature implementation docs
│   ├── BACKEND_INTEGRATION_COMPLETE.md
│   ├── CONNECTION_SYSTEM.md
│   ├── PDF_QUIZ_IMPLEMENTATION.md
│   ├── PDF_QUIZ_FIXES.md
│   ├── POINTS_SYSTEM_IMPLEMENTATION.md
│   ├── SESSION_NOTIFICATIONS_IMPLEMENTATION.md
│   └── SESSION_INVITES_IMPLEMENTATION.md
├── guides/                        # Setup and usage guides
│   └── START_HERE.md             # Getting started guide
├── reference/                     # Reference materials
│   ├── Attributions.md           # Third-party attributions
│   ├── database-queries.sql      # Database queries reference
│   └── ...migration docs
├── backend-contract.md            # API contract
├── openapi.yaml                  # OpenAPI specification
└── postman_collection.json       # Postman API collection
```

## 🎯 Documentation by Role

### For Frontend Developers
- **Start Here**: [Frontend Architecture](FRONTEND_ARCHITECTURE.md)
- **Components**: Detailed component documentation with data flow
- **State Management**: Zustand stores and patterns
- **API Integration**: How to integrate with backend APIs
- **Routing**: React Router setup and protected routes

### For Backend Developers
- **Start Here**: [Backend Team Guide](backend/BACKEND_TEAM_GUIDE.md)
- **Quick Start**: [Backend Quick Start](backend/BACKEND_QUICK_START.md)
- **API Contract**: [Backend Contract](backend-contract.md)
- **Database**: [Seeding Guide](backend/SEEDING_GUIDE.md)
- **Integration**: [Integration Summary](backend/INTEGRATION_SUMMARY.md)

### For Full-Stack Developers
- **Frontend-Backend Flow**: [Frontend Architecture](FRONTEND_ARCHITECTURE.md) - Section on "Data Flow"
- **API Integration**: [Backend Contract](backend-contract.md)
- **Authentication**: Both frontend and backend auth flow documentation

### For Project Managers
- **Project Overview**: [Main README](../README.md)
- **Features**: Implementation status in [Backend Integration](implementation/BACKEND_INTEGRATION_COMPLETE.md)
- **Getting Started**: [START_HERE.md](guides/START_HERE.md)

### For DevOps/Deployment
- **Backend Setup**: [Backend Quick Start](backend/BACKEND_QUICK_START.md)
- **Database**: [Seeding Guide](backend/SEEDING_GUIDE.md)
- **Environment Variables**: See backend and frontend READMEs

## 🔑 Key Features Documentation

### Core Features

#### 1. Authentication & Authorization
- **Frontend**: [FRONTEND_ARCHITECTURE.md](FRONTEND_ARCHITECTURE.md#authentication-flow)
- **Backend**: [BACKEND_TEAM_GUIDE.md](backend/BACKEND_TEAM_GUIDE.md)
- **Flow**: Login → JWT Token → Protected Routes

#### 2. Student Matching System
- **Frontend Component**: [SkillMatching.jsx](FRONTEND_ARCHITECTURE.md#skillmatchingjsx)
- **Backend**: [CONNECTION_SYSTEM.md](implementation/CONNECTION_SYSTEM.md)
- **ML Integration**: Python backend with K-means clustering
- **Features**: ML-based suggestions, connection requests, search & filter

#### 3. Learning Sessions
- **Frontend Component**: [Sessions.jsx](FRONTEND_ARCHITECTURE.md#sessionsjsx)
- **Implementation**: [SESSION_INVITES_IMPLEMENTATION.md](implementation/SESSION_INVITES_IMPLEMENTATION.md)
- **Notifications**: [SESSION_NOTIFICATIONS_IMPLEMENTATION.md](implementation/SESSION_NOTIFICATIONS_IMPLEMENTATION.md)
- **Features**: Create sessions, invite students, schedule meetings, track attendance

#### 4. PDF Quiz Generation
- **Documentation**: [PDF_QUIZ_IMPLEMENTATION.md](implementation/PDF_QUIZ_IMPLEMENTATION.md)
- **Fixes**: [PDF_QUIZ_FIXES.md](implementation/PDF_QUIZ_FIXES.md)
- **Features**: Upload PDFs, AI generates questions, interactive quiz, automatic grading

#### 5. Q&A Forum
- **Frontend Component**: [QAForum.jsx](FRONTEND_ARCHITECTURE.md#qaforumjsx)
- **Features**: Post questions, answer questions, voting system, tags, search

#### 6. Points & Leaderboard
- **Implementation**: [POINTS_SYSTEM_IMPLEMENTATION.md](implementation/POINTS_SYSTEM_IMPLEMENTATION.md)
- **Frontend Component**: [Leaderboard.jsx](FRONTEND_ARCHITECTURE.md#leaderboardjsx)
- **Features**: Earn points, rankings, points history

#### 7. Notifications
- **Implementation**: [SESSION_NOTIFICATIONS_IMPLEMENTATION.md](implementation/SESSION_NOTIFICATIONS_IMPLEMENTATION.md)
- **Frontend Component**: [NotificationWidget.jsx](FRONTEND_ARCHITECTURE.md#notificationwidgetjsx)
- **Features**: Real-time notifications, connection requests, session invites, Q&A updates

## 🛠️ Technical Documentation

### Architecture
- **Frontend**: React + Vite + Zustand + React Router
- **Backend**: Node.js + Express + MongoDB
- **Python Backend**: Flask + Ollama + Gemini + Scikit-learn
- **Database**: MongoDB Atlas

### API Documentation
- **OpenAPI Spec**: [openapi.yaml](openapi.yaml)
- **Postman Collection**: [postman_collection.json](postman_collection.json)
- **Backend Contract**: [backend-contract.md](backend-contract.md)

### State Management
- **Pattern**: Zustand with persistence
- **Stores**:
  - `useAuthStore` - Authentication
  - `useSessionStore` - Learning sessions
  - `useConnectionsStore` - Student connections
  - `useQAStore` - Q&A forum

### Data Flow
See [Frontend Architecture - Data Flow](FRONTEND_ARCHITECTURE.md#data-flow) for detailed diagrams.

## 📝 Implementation Notes

### Completed Features
- ✅ Dual backend architecture (Node + Python)
- ✅ User authentication with JWT
- ✅ Profile management with skills
- ✅ ML-powered student matching
- ✅ Learning session management
- ✅ Session invitations with notifications
- ✅ PDF upload and quiz generation
- ✅ Q&A forum with voting
- ✅ Points system and leaderboard
- ✅ Real-time notifications
- ✅ Dark mode support

### Implementation Details
- [Backend Integration](implementation/BACKEND_INTEGRATION_COMPLETE.md)
- [Connection System](implementation/CONNECTION_SYSTEM.md)
- [PDF Quiz System](implementation/PDF_QUIZ_IMPLEMENTATION.md)
- [Points System](implementation/POINTS_SYSTEM_IMPLEMENTATION.md)
- [Session Notifications](implementation/SESSION_NOTIFICATIONS_IMPLEMENTATION.md)

## 🔍 Search by Topic

### Authentication
- Frontend: [FRONTEND_ARCHITECTURE.md#authentication-flow](FRONTEND_ARCHITECTURE.md#authentication-flow)
- Backend: [BACKEND_TEAM_GUIDE.md](backend/BACKEND_TEAM_GUIDE.md)

### API Integration
- Frontend Services: [FRONTEND_ARCHITECTURE.md#api-integration-layer](FRONTEND_ARCHITECTURE.md#api-integration-layer)
- API Contract: [backend-contract.md](backend-contract.md)

### Database
- Models: [BACKEND_TEAM_GUIDE.md](backend/BACKEND_TEAM_GUIDE.md)
- Seeding: [SEEDING_GUIDE.md](backend/SEEDING_GUIDE.md)

### Components
- All Components: [FRONTEND_ARCHITECTURE.md#component-documentation](FRONTEND_ARCHITECTURE.md#component-documentation)

### State Management
- Stores: [FRONTEND_ARCHITECTURE.md#state-management](FRONTEND_ARCHITECTURE.md#state-management)

### Deployment
- Backend: [BACKEND_QUICK_START.md](backend/BACKEND_QUICK_START.md)
- Frontend: [FRONTEND_ARCHITECTURE.md#deployment-checklist](FRONTEND_ARCHITECTURE.md#deployment-checklist)

## 🆘 Troubleshooting

### Common Issues
See [FRONTEND_ARCHITECTURE.md#troubleshooting](FRONTEND_ARCHITECTURE.md#troubleshooting) for common problems and solutions.

### Error Handling
- Frontend: [FRONTEND_ARCHITECTURE.md#error-handling](FRONTEND_ARCHITECTURE.md#error-handling)
- Backend: [BACKEND_TEAM_GUIDE.md](backend/BACKEND_TEAM_GUIDE.md)

## 🤝 Contributing

When adding new features:
1. Update the relevant documentation
2. Add to this index if creating new docs
3. Document API changes in `backend-contract.md`
4. Update the main README if needed

## 📞 Support

For questions about:
- **Frontend**: See [FRONTEND_ARCHITECTURE.md](FRONTEND_ARCHITECTURE.md)
- **Backend**: See [BACKEND_TEAM_GUIDE.md](backend/BACKEND_TEAM_GUIDE.md)
- **Setup**: See [START_HERE.md](guides/START_HERE.md)

---

**Last Updated**: November 23, 2025  
**Version**: 1.0.0

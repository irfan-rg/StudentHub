# 🚀 Backend Implementation Quick Start

## Overview
This file contains the essential API endpoints and data structures needed for backend implementation. For detailed specifications, see `BACKEND_IMPLEMENTATION_READY.md`.

---

## 📌 API Endpoints Summary

| Method | Endpoint | Purpose | Priority |
|--------|----------|---------|----------|
| POST | `/api/connections/send-request` | Send connection request | HIGH |
| GET | `/api/connections` | Get user's connections | HIGH |
| POST | `/api/connections/accept/:requestId` | Accept connection | HIGH |
| POST | `/api/connections/reject/:requestId` | Reject connection | HIGH |
| DELETE | `/api/connections/:connectionId` | Remove connection | HIGH |
| GET | `/api/users/discover` | Find study partners | HIGH |
| GET | `/api/users/discover/filters` | Get filter options | HIGH |
| POST | `/api/sessions/create` | Create session (with files) | HIGH |
| GET | `/api/sessions/:sessionId/documents` | List session documents | MEDIUM |
| GET | `/api/sessions/:sessionId/documents/:docId/download` | Download document | MEDIUM |
| DELETE | `/api/sessions/:sessionId/documents/:docId` | Delete document | MEDIUM |

---

## 🔐 Authentication
All endpoints (except login/signup) require:
```
Header: Authorization: Bearer {JWT_TOKEN}
```

---

## 1️⃣ Connection Endpoints

### POST /api/connections/send-request
```javascript
// REQUEST
{
  "receiverId": "user_id"
}

// RESPONSE (200)
{
  "success": true,
  "data": {
    "requestId": "request_uuid",
    "senderId": "current_user_id",
    "receiverId": "receiver_id",
    "status": "pending",
    "createdAt": "2025-11-08T10:30:00Z"
  }
}

// ERROR (400)
{
  "success": false,
  "message": "Connection already exists or request pending"
}
```

---

### GET /api/connections
```javascript
// QUERY PARAMS
?status=accepted&page=1&limit=20

// RESPONSE (200)
{
  "success": true,
  "data": [
    {
      "id": "connection_id",
      "user": {
        "id": "user_id",
        "name": "Emma Watson",
        "email": "emma@example.com",
        "avatar": "url",
        "college": "Harvard University",
        "skillsCanTeach": [
          { "name": "Machine Learning", "level": "expert" }
        ],
        "rating": { "average": 4.8, "count": 24 },
        "availability": "Weekdays 3-6 PM"
      },
      "status": "accepted",
      "connectedAt": "2025-11-01T14:20:00Z"
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 20
  }
}
```

---

### POST /api/connections/accept/:requestId
```javascript
// RESPONSE (200)
{
  "success": true,
  "message": "Connection request accepted",
  "data": {
    "connectionId": "uuid",
    "status": "accepted",
    "acceptedAt": "2025-11-08T10:35:00Z"
  }
}
```

---

### POST /api/connections/reject/:requestId & DELETE /api/connections/:connectionId
```javascript
// RESPONSE (200)
{
  "success": true,
  "message": "Operation successful"
}
```

---

## 2️⃣ Discovery Endpoints

### GET /api/users/discover
```javascript
// QUERY PARAMS
?searchTerm=python&skill=Python&university=MIT&level=expert&page=1&limit=20

// RESPONSE (200)
{
  "success": true,
  "data": [
    {
      "id": "user_id",
      "name": "Emma Watson",
      "email": "emma@example.com",
      "avatar": "url",
      "college": "Harvard University",
      "skillsCanTeach": [
        { "name": "Machine Learning", "level": "expert" },
        { "name": "Python", "level": "advanced" }
      ],
      "rating": { "average": 4.8, "count": 24 },
      "availability": "Weekdays 3-6 PM",
      "matchPercentage": 95,
      "sessions": 28,
      "points": 3250
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 20
  }
}
```

### GET /api/users/discover/filters
```javascript
// RESPONSE (200)
{
  "success": true,
  "data": {
    "skills": ["Python", "Machine Learning", "UI/UX Design", "DevOps", ...],
    "universities": ["Harvard", "Stanford", "MIT", "Berkeley", ...],
    "levels": ["beginner", "intermediate", "advanced", "expert"]
  }
}
```

---

## 3️⃣ Session Documents Endpoint

### POST /api/sessions/create
```javascript
// REQUEST (multipart/form-data)
FormData:
- title: "Python Basics Workshop"
- description: "Learn Python fundamentals"
- topic: "Python"
- startTime: "2025-11-15T10:00:00Z"
- endTime: "2025-11-15T11:30:00Z"
- maxParticipants: 5
- documents: [File1, File2, ...] (optional, max 10 files)

// SUPPORTED FILE TYPES
- .pdf (application/pdf)
- .doc, .docx (application/msword, application/vnd.ms-word)
- .txt (text/plain)
- .pptx (application/vnd.ms-powerpoint)
- .xlsx (application/vnd.ms-excel)

// CONSTRAINTS
- Max 10 files per session
- Max 10MB per file

// RESPONSE (201)
{
  "success": true,
  "data": {
    "id": "session_id",
    "title": "Python Basics Workshop",
    "topic": "Python",
    "createdBy": { "id": "user_id", "name": "John Doe" },
    "startTime": "2025-11-15T10:00:00Z",
    "endTime": "2025-11-15T11:30:00Z",
    "documents": [
      {
        "id": "doc_id",
        "filename": "Python_Basics.pdf",
        "fileType": "application/pdf",
        "fileSize": 2048000,
        "uploadedAt": "2025-11-08T10:30:00Z",
        "url": "/api/sessions/session_id/documents/doc_id/download"
      }
    ],
    "status": "active",
    "createdAt": "2025-11-08T10:30:00Z"
  }
}

// ERROR RESPONSE (400)
{
  "success": false,
  "message": "Invalid file type or file size exceeds limit",
  "errors": ["File 'image.jpg' is not supported", "File 'large.pdf' exceeds 10MB"]
}
```

---

### GET /api/sessions/:sessionId/documents
```javascript
// RESPONSE (200)
{
  "success": true,
  "data": [
    {
      "id": "doc_id",
      "filename": "Python_Basics.pdf",
      "fileType": "application/pdf",
      "fileSize": 2048000,
      "uploadedAt": "2025-11-08T10:30:00Z",
      "uploadedBy": { "id": "user_id", "name": "John Doe" },
      "url": "/api/sessions/session_id/documents/doc_id/download"
    }
  ]
}
```

---

## 📊 Database Collections

### connections
```javascript
{
  _id: ObjectId,
  user1Id: ObjectId,      // Current user
  user2Id: ObjectId,      // Connection recipient
  status: "pending|accepted|rejected",
  requestInitiatorId: ObjectId,
  createdAt: Date,
  acceptedAt: Date,
  updatedAt: Date
}

// Indexes:
db.connections.createIndex({ "user1Id": 1, "status": 1 })
db.connections.createIndex({ "user2Id": 1, "status": 1 })
```

### sessionDocuments
```javascript
{
  _id: ObjectId,
  sessionId: ObjectId,
  filename: String,
  fileType: String,       // MIME type
  fileSize: Number,
  uploadedBy: ObjectId,
  uploadUrl: String,      // Cloud URL or local path
  uploadedAt: Date,
  createdAt: Date
}

// Index:
db.sessionDocuments.createIndex({ "sessionId": 1 })
```

---

## ✅ Frontend Expectations

### Connections Store Data
```javascript
connections: [
  {
    id: "user_id",
    name: "Emma Watson",
    college: "Harvard University",
    avatar: "url",
    status: "connected"
  }
]

connectionRequests: {
  "user_id": true  // Boolean for pending requests
}
```

### Student Discovery Data
```javascript
{
  id: "user_id",
  name: "Emma Watson",
  college: "Harvard University",
  avatar: "url",
  skillsCanTeach: [
    { name: "Machine Learning", level: "expert" }
  ],
  rating: { average: 4.8, count: 24 },
  availability: "Weekdays 3-6 PM",
  matchPercentage: 95,
  sessions: 28,
  points: 3250
}
```

---

## 🛠️ Implementation Checklist

### Phase 1 (MVP)
- [ ] Connection request endpoint
- [ ] Get connections endpoint with full user data
- [ ] Accept/reject connection endpoints
- [ ] Delete connection endpoint
- [ ] Discover users endpoint with filters
- [ ] Filter options endpoint
- [ ] Session creation with file upload

### Phase 2 (Post-MVP)
- [ ] Document download endpoint
- [ ] Document delete endpoint
- [ ] Connection recommendations
- [ ] User suggestions algorithm

### Testing
- [ ] All endpoints return correct status codes
- [ ] File upload validation (size, type)
- [ ] Pagination works correctly
- [ ] Auth token validation on all endpoints
- [ ] Error messages are user-friendly

---

## 📞 Integration Point

Once backend is deployed, update:

**File**: `frontend/src/stores/useConnectionsStore.js`
```javascript
// Replace mock with API calls
loadConnections: async () => {
  const response = await fetch('/api/connections', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  set({ connections: data.data });
}

// Similar updates for:
// - sendConnectionRequest
// - acceptConnectionRequest
// - deleteConnection
```

---

## 🎯 Success Criteria

✅ All endpoints follow REST conventions
✅ Consistent JSON response format
✅ Proper error handling with meaningful messages
✅ File validation and security
✅ Pagination support
✅ Indexed database queries for performance
✅ JWT auth on all endpoints
✅ All 13 test cases passing

---

**Questions?** Contact frontend team before implementation.

# 🌱 Database Seeding Guide

## Overview

The seed script populates your database with realistic test data including:
- **20 Indian university students** from various states
- **15-20 study sessions** (upcoming and completed)
- **15 Q&A forum questions** with answers
- **Random connections** between users
- **Realistic activity data** (points, badges, ratings)

---

## 🚀 How to Run

### Prerequisites
Make sure MongoDB is running and backend `.env` is configured.

### Run the Seed Script

```bash
cd backend
npm run seed
```

That's it! The script will:
1. Clear existing data (users, sessions, questions)
2. Generate 20 diverse users
3. Create random connections
4. Generate sessions with ratings
5. Create Q&A questions with answers

---

## 👥 Generated Data

### Users
- **20 students** from 15 different Indian universities
- **States covered**: Delhi, Maharashtra, Tamil Nadu, Karnataka, West Bengal, etc.
- **Skills**: 40+ different skills across programming, web, mobile, data science, DevOps
- **Activity levels**: Mix of active and new users
- **Realistic profiles**: Proper bios, avatars, skill levels

### Universities Included:
- IIT Delhi, IIT Bombay, IIT Madras, IIT Kanpur
- BITS Pilani, NIT Trichy, VIT Vellore
- IIIT Hyderabad, Manipal University
- Delhi University, Pune University, Anna University
- And more...

### Sessions:
- **15-20 sessions** on various topics
- Mix of "Video Session" and "In Person" types
- Some completed (with ratings), some upcoming
- 2-5 members per session
- Realistic topics: React, Node.js, ML, System Design, etc.

### Questions:
- **15 questions** with technical topics
- Each has 1-3 answers
- Upvotes and downvotes
- Relevant tags (React, Python, Database, etc.)

### Connections:
- **10-15 random connections** between users
- Bi-directional (both users connected)

---

## 🔐 Test Login Credentials

**All users have the same password**: `password123`

### Sample Login Accounts:

```
Email: arjun.sharma@iitdelhi.edu.in
Password: password123

Email: priya.patel@iitbombay.edu.in
Password: password123

Email: rahul.verma@bitspilani.edu.in
Password: password123
```

**Email Format**: `firstname.lastname@universityname.edu.in`

---

## 📊 Data Statistics

After seeding, you'll have:

| Resource | Count |
|----------|-------|
| Users | 20 |
| Connections | 10-15 |
| Sessions | 15-20 |
| Questions | 15 |
| Answers | 15-45 |

### User Activity Distribution:
- **High Activity** (30%): 200-500 points, multiple badges, high ratings
- **Medium Activity** (35%): 50-199 points, few badges
- **Low Activity** (35%): 0-49 points, minimal engagement

---

## 🎯 What You Can Test

### 1. Authentication
- Login with any seeded user
- View profile with complete data

### 2. Skill Discovery
- Search users by skill (Python, React, etc.)
- Filter by university or level
- View skill-based recommendations

### 3. Connections
- Send connection requests
- View connected users
- ML-powered suggestions

### 4. Sessions
- View upcoming sessions
- Check completed sessions with ratings
- See sessions you're part of

### 5. Q&A Forum
- Browse questions
- Read answers
- See voting data

### 6. Leaderboard
- View top users by points
- Check by sessions completed
- Filter by questions answered

---

## 🔄 Re-running the Seed Script

**Warning**: Running the seed script again will:
- ❌ **Delete ALL existing data**
- ✅ Create fresh test data

If you want to keep some data and just add more users, you'll need to modify the script to skip the deletion step.

---

## 🛠️ Customization

### Want More Users?
Edit `seed.js` and add more names to the `indianNames` array.

### Want Different Skills?
Modify the `skills` object with your own categories and skills.

### Want More Sessions/Questions?
Change the numbers in:
```javascript
const sessionCount = getRandomNumber(15, 20); // Increase these
const questionTemplates = [...]; // Add more templates
```

---

## ✅ Verification

After seeding, verify data:

### Check Users:
```bash
# In MongoDB shell or Compass
db.users.countDocuments()
db.users.find().limit(5).pretty()
```

### Check Sessions:
```bash
db.sessions.countDocuments()
db.sessions.find().limit(3).pretty()
```

### Check Questions:
```bash
db.questions.countDocuments()
db.questions.find().limit(3).pretty()
```

---

## 🐛 Troubleshooting

### Error: "Cannot find module"
```bash
cd backend
npm install
```

### Error: "Connection refused"
- Make sure MongoDB is running
- Check `.env` for correct MONGO_URI

### Error: "Duplicate key error"
- The database already has users with same emails
- Run the seed script again (it clears data first)

---

## 🎉 Next Steps

After seeding:
1. Start the backend: `npm start`
2. Start the Python backend: `cd ../python-backend && python app.py`
3. Start the frontend: `cd ../frontend && npm run dev`
4. Login with any test account
5. Test all features with realistic data!

---

**Note**: This is test data for development. In production, you'd use real user registrations.

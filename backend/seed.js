import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from './src/config/db.js';
import User from './src/models/user.model.js';
import Session from './src/models/session.model.js';
import Question from './src/models/questions.model.js';
import Notification from './src/models/notification.model.js';

// Indian Universities and States
const indianUniversities = [
    { name: 'IIT Delhi', state: 'Delhi' },
    { name: 'IIT Bombay', state: 'Maharashtra' },
    { name: 'IIT Madras', state: 'Tamil Nadu' },
    { name: 'IIT Kanpur', state: 'Uttar Pradesh' },
    { name: 'BITS Pilani', state: 'Rajasthan' },
    { name: 'NIT Trichy', state: 'Tamil Nadu' },
    { name: 'VIT Vellore', state: 'Tamil Nadu' },
    { name: 'Delhi University', state: 'Delhi' },
    { name: 'Pune University', state: 'Maharashtra' },
    { name: 'Anna University', state: 'Tamil Nadu' },
    { name: 'Jadavpur University', state: 'West Bengal' },
    { name: 'IIIT Hyderabad', state: 'Telangana' },
    { name: 'Manipal University', state: 'Karnataka' },
    { name: 'Amity University', state: 'Uttar Pradesh' },
    { name: 'SRM University', state: 'Tamil Nadu' }
];

const indianNames = [
    { first: 'Arjun', last: 'Sharma' },
    { first: 'Priya', last: 'Patel' },
    { first: 'Rahul', last: 'Verma' },
    { first: 'Ananya', last: 'Reddy' },
    { first: 'Vikram', last: 'Singh' },
    { first: 'Sneha', last: 'Iyer' },
    { first: 'Rohan', last: 'Kumar' },
    { first: 'Neha', last: 'Gupta' },
    { first: 'Aditya', last: 'Desai' },
    { first: 'Kavya', last: 'Nair' },
    { first: 'Karan', last: 'Mehta' },
    { first: 'Isha', last: 'Joshi' },
    { first: 'Siddharth', last: 'Banerjee' },
    { first: 'Riya', last: 'Kapoor' },
    { first: 'Aman', last: 'Malhotra' },
    { first: 'Divya', last: 'Pillai' },
    { first: 'Varun', last: 'Chopra' },
    { first: 'Pooja', last: 'Rao' },
    { first: 'Nikhil', last: 'Agarwal' },
    { first: 'Sanya', last: 'Krishnan' }
];

const skills = {
    programming: ['Python', 'JavaScript', 'Java', 'C++', 'Go', 'Rust', 'TypeScript', 'PHP'],
    web: ['React', 'Node.js', 'Angular', 'Vue.js', 'Django', 'Flask', 'Spring Boot', 'Express'],
    mobile: ['React Native', 'Flutter', 'Android', 'iOS', 'Kotlin', 'Swift'],
    data: ['Machine Learning', 'Data Science', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'SQL', 'MongoDB'],
    devops: ['Docker', 'Kubernetes', 'AWS', 'Azure', 'CI/CD', 'Jenkins', 'Git'],
    design: ['UI/UX Design', 'Figma', 'Adobe XD', 'Photoshop', 'Illustrator'],
    other: ['Blockchain', 'Cybersecurity', 'Cloud Computing', 'GraphQL', 'Redis', 'System Design']
};

const educationLevels = ['Bachelor', 'Master', 'PhD'];
const skillLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
const badges = ['Helper', 'First Step', 'Quick Learner', 'Knowledge Sharer', 'Mentor', 'Legend', 'Noble'];

// Helper functions
const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];
const getRandomItems = (array, count) => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate realistic bio
const generateBio = (name, university, skills) => {
    const bios = [
        `${name.split(' ')[0]} | ${university} | Passionate about ${skills[0]} and ${skills[1]}`,
        `CS Student at ${university} | Love coding and building projects | ${skills[0]} enthusiast`,
        `Tech geek from ${university} | Always learning ${skills[0]}, ${skills[1]} | Open to collaborate`,
        `${university} | Final year student | Interested in ${skills[0]} and ${skills[1]} development`,
        `Software Developer in making | ${university} | Exploring ${skills[0]}, ${skills[1]}, and more`
    ];
    return getRandomItem(bios);
};

// Generate users with realistic join dates and activity patterns
const generateUsers = () => {
    const users = [];
    const allSkills = Object.values(skills).flat();
    const now = new Date();
    
    indianNames.forEach((name, index) => {
        const university = getRandomItem(indianUniversities);
        const fullName = `${name.first} ${name.last}`;
        const email = `${name.first.toLowerCase()}.${name.last.toLowerCase()}@${university.name.toLowerCase().replace(/\s+/g, '')}.edu.in`;
        
        // User joined platform between 2-12 months ago (realistic timeline)
        const monthsAgo = getRandomNumber(2, 12);
        const joinDate = new Date(now);
        joinDate.setMonth(joinDate.getMonth() - monthsAgo);
        joinDate.setDate(getRandomNumber(1, 28));
        joinDate.setHours(getRandomNumber(8, 22), getRandomNumber(0, 59));
        
        // Activity profiles: veteran (20%), active (35%), moderate (30%), new (15%)
        const rand = Math.random();
        let activityProfile;
        if (rand < 0.20) {
            activityProfile = { type: 'veteran', monthsActive: monthsAgo, avgSessionsPerMonth: 4, avgQuestionsPerMonth: 3 };
        } else if (rand < 0.55) {
            activityProfile = { type: 'active', monthsActive: Math.floor(monthsAgo * 0.8), avgSessionsPerMonth: 2, avgQuestionsPerMonth: 1.5 };
        } else if (rand < 0.85) {
            activityProfile = { type: 'moderate', monthsActive: Math.floor(monthsAgo * 0.5), avgSessionsPerMonth: 1, avgQuestionsPerMonth: 0.5 };
        } else {
            activityProfile = { type: 'new', monthsActive: Math.min(2, monthsAgo), avgSessionsPerMonth: 0.5, avgQuestionsPerMonth: 0.3 };
        }
        
        // Select skills based on activity level
        const teachCount = activityProfile.type === 'veteran' ? getRandomNumber(5, 8) : 
                          activityProfile.type === 'active' ? getRandomNumber(4, 6) : 
                          getRandomNumber(2, 4);
        const teachSkillNames = getRandomItems(allSkills, teachCount);
        const skillsCanTeach = teachSkillNames.map(skillName => ({
            name: skillName,
            level: activityProfile.type === 'veteran' ? getRandomItem(['intermediate', 'advanced', 'expert']) :
                   activityProfile.type === 'active' ? getRandomItem(['beginner', 'intermediate', 'advanced']) :
                   getRandomItem(['beginner', 'intermediate']),
            category: Object.keys(skills).find(key => skills[key].includes(skillName))
        }));
        
        const learnSkills = allSkills.filter(s => !teachSkillNames.includes(s));
        const learnCount = getRandomNumber(2, 5);
        const skillsWantToLearn = getRandomItems(learnSkills, learnCount).map(skillName => ({
            name: skillName,
            category: Object.keys(skills).find(key => skills[key].includes(skillName))
        }));
        
        // Points accumulated over time (realistic for activity level)
        const basePoints = activityProfile.type === 'veteran' ? getRandomNumber(400, 800) :
                          activityProfile.type === 'active' ? getRandomNumber(150, 400) :
                          activityProfile.type === 'moderate' ? getRandomNumber(50, 150) :
                          getRandomNumber(0, 50);
        
        const estimatedSessions = Math.floor(activityProfile.monthsActive * activityProfile.avgSessionsPerMonth);
        const estimatedQuestions = Math.floor(activityProfile.monthsActive * activityProfile.avgQuestionsPerMonth);
        
        // Assign badges based on realistic activity
        const userBadges = [];
        if (basePoints > 0) userBadges.push('First Step');
        if (estimatedSessions > 3) userBadges.push('Helper');
        if (estimatedQuestions > 5) userBadges.push('Knowledge Sharer');
        if (basePoints > 200) userBadges.push('Quick Learner');
        if (estimatedSessions > 10) userBadges.push('Mentor');
        if (basePoints > 500) userBadges.push('Legend');
        
        const rating = estimatedSessions > 5 ? Number((3.8 + Math.random() * 1.2).toFixed(1)) : 
                       estimatedSessions > 0 ? Number((3.5 + Math.random() * 1.0).toFixed(1)) : 0;
        
        users.push({
            name: fullName,
            email: email,
            password: bcrypt.hashSync('password123', 10),
            college: university.name,
            educationLevel: getRandomItem(educationLevels),
            bio: generateBio(fullName, university.name, teachSkillNames),
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.first}${name.last}`,
            skillsCanTeach,
            skillsWantToLearn,
            points: basePoints,
            badges: userBadges,
            sessionsCompleted: estimatedSessions,
            questionsAnswered: estimatedQuestions,
            questionsAsked: Math.floor(estimatedQuestions * 0.6),
            rating,
            connections: [],
            createdAt: joinDate,
            _activityProfile: activityProfile // temp metadata for seed logic
        });
    });
    
    return users;
};

// Generate sessions spread over realistic timeline (past 6 months + next 2 months)
const generateSessions = (users) => {
    const sessions = [];
    const now = new Date();
    const topics = [
        'Introduction to React Hooks',
        'Building RESTful APIs with Node.js',
        'Machine Learning Basics',
        'Data Structures and Algorithms',
        'System Design Interview Prep',
        'Getting Started with Docker',
        'Frontend Development Best Practices',
        'Database Design Principles',
        'Git and GitHub Workflow',
        'Cloud Computing with AWS',
        'Python for Data Science',
        'Mobile App Development',
        'Cybersecurity Fundamentals',
        'UI/UX Design Principles',
        'Blockchain Technology Overview',
        'Advanced JavaScript Patterns',
        'Testing and TDD Strategies',
        'GraphQL Deep Dive',
        'DevOps Best Practices',
        'React Native Essentials'
    ];
    
    const sessionTypes = ['Video Session', 'In Person'];
    const durations = ['30 minutes', '60 minutes', '90 minutes', '2 hours'];
    
    // Create 40-50 sessions (realistic for a growing platform)
    const sessionCount = getRandomNumber(40, 50);
    
    for (let i = 0; i < sessionCount; i++) {
        // Pick creator weighted by activity level (active users create more)
        const activeUsers = users.filter(u => u.sessionsCompleted > 5 || u.points > 150);
        const creator = Math.random() < 0.7 && activeUsers.length > 0 ? getRandomItem(activeUsers) : getRandomItem(users);
        
        // Pick topic relevant to creator's skills (60% of the time)
        const relevantTopics = topics.filter(t => 
            creator.skillsCanTeach.some(s => t.toLowerCase().includes(s.name.toLowerCase()))
        );
        const topic = relevantTopics.length > 0 && Math.random() < 0.6 ? getRandomItem(relevantTopics) : getRandomItem(topics);
        
        const sessionType = getRandomItem(sessionTypes);
        const duration = getRandomItem(durations);
        
        // Sessions distributed over past 6 months and next 2 months
        const daysOffset = getRandomNumber(-180, 60);
        const sessionDate = new Date(now);
        sessionDate.setDate(sessionDate.getDate() + daysOffset);
        sessionDate.setHours(getRandomNumber(9, 20), [0, 15, 30, 45][getRandomNumber(0, 3)]);
        
        const isPast = sessionDate < now;
        const isCompleted = isPast && Math.random() > 0.1; // 90% of past sessions completed
        
        // Members: prefer same university, similar skills
        const sameUniversity = users.filter(u => u.college === creator.college && u.email !== creator.email);
        const similarSkills = users.filter(u => 
            u.email !== creator.email && 
            u.skillsWantToLearn.some(learn => creator.skillsCanTeach.some(teach => teach.name === learn.name))
        );
        
        const memberCount = getRandomNumber(3, 7);
        let memberPool = [...new Set([...sameUniversity, ...similarSkills, ...users])];
        memberPool = memberPool.filter(u => u.email !== creator.email);
        const members = getRandomItems(memberPool, Math.min(memberCount, memberPool.length)).map(u => u._id);
        
        // Ratings for completed sessions (70-90% of participants rate)
        const ratings = isCompleted ? members.slice(0, Math.floor(members.length * (0.7 + Math.random() * 0.2))).map(memberId => ({
            user: memberId,
            rating: getRandomNumber(3, 5),
            comment: getRandomItem([
                'Great session! Learned a lot.',
                'Very informative and well-structured.',
                'Excellent explanation of concepts.',
                'Would love more sessions like this.',
                'Clear and helpful session.',
                'Perfect pace and coverage.',
                'Answered all my doubts.',
                'Really enjoyed this!',
                'Highly recommend.',
                'Practical examples were great.'
            ]),
            createdAt: new Date(sessionDate.getTime() + getRandomNumber(1, 24) * 60 * 60 * 1000)
        })) : [];
        
        const averageRating = ratings.length > 0 
            ? Number((ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(2))
            : 0;
        
        // Quiz questions for completed sessions (60% have quizzes)
        const hasQuiz = isCompleted && Math.random() < 0.6;
        const quizQuestions = hasQuiz ? Array(getRandomNumber(3, 6)).fill().map((_, idx) => ({
            id: `q${i}_${idx}`,
            question: `Question ${idx + 1} about ${topic}`,
            options: [`Option A`, `Option B`, `Option C`, `Option D`],
            answer: getRandomItem([`Option A`, `Option B`, `Option C`, `Option D`])
        })) : [];
        
        sessions.push({
            createdBy: creator._id,
            topic,
            details: `Join us for an interactive session on ${topic}. ${isPast ? 'Session completed successfully!' : 'All skill levels welcome!'}`,
            sessionType,
            duration,
            location: sessionType === 'In Person' ? `${creator.college} Campus, Room ${getRandomNumber(101, 599)}` : undefined,
            link: sessionType === 'Video Session' ? `https://meet.google.com/${Math.random().toString(36).substring(7)}` : undefined,
            preferedTimings: `${getRandomNumber(10, 18)}:00 - ${getRandomNumber(19, 21)}:00`,
            members,
            sessionOn: sessionDate,
            ratings,
            averageRating,
            quizQuestions,
            status: isCompleted ? 'Completed' : isPast ? 'Cancelled' : 'Upcoming',
            createdAt: new Date(sessionDate.getTime() - getRandomNumber(3, 14) * 24 * 60 * 60 * 1000)
        });
    }
    
    return sessions;
};

// Generate questions
const generateQuestions = (users) => {
    const questions = [];
    const questionTemplates = [
        { title: 'How to implement JWT authentication in Node.js?', tags: ['Node.js', 'Authentication', 'JWT'] },
        { title: 'Best practices for React state management?', tags: ['React', 'State Management'] },
        { title: 'Difference between SQL and NoSQL databases?', tags: ['Database', 'SQL', 'NoSQL'] },
        { title: 'How to deploy a Django app on AWS?', tags: ['Django', 'AWS', 'Deployment'] },
        { title: 'What are React Hooks and when to use them?', tags: ['React', 'Hooks'] },
        { title: 'How to optimize Python code for performance?', tags: ['Python', 'Performance'] },
        { title: 'Understanding Docker containers vs virtual machines?', tags: ['Docker', 'DevOps'] },
        { title: 'How to prepare for coding interviews?', tags: ['Interview', 'DSA'] },
        { title: 'Best resources to learn Machine Learning?', tags: ['Machine Learning', 'Resources'] },
        { title: 'How to handle asynchronous operations in JavaScript?', tags: ['JavaScript', 'Async'] },
        { title: 'What is the difference between Git merge and rebase?', tags: ['Git', 'Version Control'] },
        { title: 'How to secure a REST API?', tags: ['API', 'Security'] },
        { title: 'Understanding CSS Flexbox vs Grid?', tags: ['CSS', 'Layout'] },
        { title: 'How to implement real-time features with WebSockets?', tags: ['WebSocket', 'Real-time'] },
        { title: 'What are design patterns in software engineering?', tags: ['Design Patterns', 'Software Engineering'] }
    ];
    
    questionTemplates.forEach(template => {
        const asker = getRandomItem(users);
        
        // Questions spread over past 12 months (weighted toward recent)
        const daysAgo = Math.random() < 0.5 ? getRandomNumber(1, 30) : getRandomNumber(31, 365);
        const askedAt = new Date();
        askedAt.setDate(askedAt.getDate() - daysAgo);
        askedAt.setHours(getRandomNumber(8, 23), getRandomNumber(0, 59));
        
        const question = {
            title: template.title,
            description: `I'm working on a project and need help understanding ${template.tags[0]}. Can someone explain this concept or share resources?`,
            tags: template.tags,
            askedBy: asker._id,
            askedAt,
            upVotes: Array(getRandomNumber(0, 8)).fill().map(() => getRandomItem(users)._id),
            downVotes: Array(getRandomNumber(0, 2)).fill().map(() => getRandomItem(users)._id),
            answers: []
        };
        
        // Add 0-5 answers (some questions unanswered, popular ones have more)
        const answerCount = Math.random() < 0.15 ? 0 : getRandomNumber(1, 5);
        for (let i = 0; i < answerCount; i++) {
            // Answerers more likely to have relevant skills
            const skilledAnswerers = users.filter(u => 
                u.email !== asker.email && 
                u.skillsCanTeach.some(s => template.tags.some(tag => tag.toLowerCase().includes(s.name.toLowerCase())))
            );
            const answerer = skilledAnswerers.length > 0 && Math.random() < 0.7 ? 
                getRandomItem(skilledAnswerers) : 
                getRandomItem(users.filter(u => u.email !== asker.email));
            const answerTexts = [
                `Here's a detailed explanation: ${template.tags[0]} is commonly used for... I recommend checking out the official documentation.`,
                `I've worked with this before. The key concept is... Let me know if you need more clarification.`,
                `Great question! From my experience, the best approach is... Hope this helps!`,
                `I had the same doubt earlier. What worked for me was... Feel free to ask if you have questions.`
            ];
            
            // create answer timestamp after question askedAt (within a few days)
            const answerDelayDays = getRandomNumber(0, Math.max(1, Math.floor(daysAgo / 2)));
            const answeredAt = new Date(askedAt.getTime());
            answeredAt.setDate(answeredAt.getDate() + answerDelayDays + getRandomNumber(0, 2));

            question.answers.push({
                answer: getRandomItem(answerTexts),
                answeredBy: answerer._id,
                answeredAt,
                upVotes: Array(getRandomNumber(0, 8)).fill().map(() => getRandomItem(users)._id),
                downVotes: Array(getRandomNumber(0, 1)).fill().map(() => getRandomItem(users)._id)
            });
        }
        
        questions.push(question);
    });
    
    return questions;
};

// Main seed function
const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...\n');
        
        // Connect to database
        await connectDB();
        
        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Session.deleteMany({});
        await Question.deleteMany({});
        await Notification.deleteMany({});
        console.log('✅ Existing data cleared\n');
        
        // Generate and insert users
        console.log('👥 Generating users...');
        const usersData = generateUsers();
        const users = await User.insertMany(usersData);
        console.log(`✅ Created ${users.length} users\n`);
        
        // Give each user some connections (friends on platform)
        console.log('🔗 Setting up user connections...');
        
        for (const user of users) {
            // Each user gets 3-8 connections (existing friends)
            const connectionCount = getRandomNumber(3, 8);
            
            // Prefer connecting with users from same university or with shared skills
            const sameUni = users.filter(u => 
                u._id.toString() !== user._id.toString() && 
                u.college === user.college &&
                !user.connections.includes(u._id)
            );
            
            const withSharedSkills = users.filter(u => 
                u._id.toString() !== user._id.toString() && 
                !user.connections.includes(u._id) &&
                (u.skillsCanTeach.some(s1 => user.skillsWantToLearn.some(s2 => s2.name === s1.name)) ||
                 u.skillsWantToLearn.some(s1 => user.skillsCanTeach.some(s2 => s2.name === s1.name)))
            );
            
            // 60% from preferred pool, 40% random
            const preferredPool = [...new Set([...sameUni, ...withSharedSkills])];
            const potentialConnections = [];
            
            for (let i = 0; i < connectionCount; i++) {
                let newConnection;
                if (preferredPool.length > 0 && Math.random() < 0.6) {
                    newConnection = getRandomItem(preferredPool);
                    preferredPool.splice(preferredPool.indexOf(newConnection), 1);
                } else {
                    const available = users.filter(u => 
                        u._id.toString() !== user._id.toString() && 
                        !user.connections.includes(u._id) &&
                        !potentialConnections.includes(u._id)
                    );
                    if (available.length > 0) {
                        newConnection = getRandomItem(available);
                    }
                }
                
                if (newConnection && !user.connections.includes(newConnection._id)) {
                    user.connections.push(newConnection._id);
                    potentialConnections.push(newConnection._id);
                }
            }
            
            await user.save();
        }
        
        console.log(`✅ Users now have connections\n`);

        // --- New: Add matchPercentage + ensure alternate users share skills with a base user ---
        console.log('🔬 Adjusting match percentages and skills to create realistic matches...');
        // Choose a base user to be the reference for matches (use the first user)
        const baseUser = users[0];
        const baseSkills = Array.isArray(baseUser.skillsCanTeach) ? baseUser.skillsCanTeach.map(s => s.name) : [];

        for (let idx = 0; idx < users.length; idx++) {
            const u = users[idx];
            // Skip base user from changes
            if (String(u._id) === String(baseUser._id)) {
                // assign a high match percentage for base user as reference
                await User.findByIdAndUpdate(u._id, { matchPercentage: 100 });
                continue;
            }

            // For every other user (even indices), enforce skill overlap with baseUser
            if (idx % 2 === 0) {
                // pick 1-3 base skills to ensure overlap
                const overlapCount = Math.min(baseSkills.length, getRandomNumber(1, Math.min(3, baseSkills.length)));
                const chosenOverlap = getRandomItems(baseSkills, overlapCount);

                // Add chosen base skills to the user's teach skills if missing
                const existingTeachNames = (u.skillsCanTeach || []).map(s => s.name);
                const toAdd = chosenOverlap.filter(s => !existingTeachNames.includes(s));
                for (const skillToAdd of toAdd) {
                    const skillCategory = Object.keys(skills).find(key => skills[key].includes(skillToAdd));
                    const newSkill = {
                        name: skillToAdd,
                        level: getRandomItem(['intermediate', 'advanced', 'expert']),
                        category: skillCategory || ''
                    };
                    u.skillsCanTeach.push(newSkill);
                }
            }

            // Now compute a realistic match percentage based on overlap, skill levels, points, sessions, and rating
            const otherTeach = (u.skillsCanTeach || []).map(s => s.name);
            const overlap = baseSkills.filter(s => otherTeach.includes(s)).length;

            // base score and contributions
            let score = 30; // baseline
            score += overlap * 12; // overlap is strong signal

            // boost based on levels for the overlapped skills
            let levelBoost = 0;
            for (const s of u.skillsCanTeach || []) {
                if (baseSkills.includes(s.name)) {
                    if (s.level === 'expert') levelBoost += 8;
                    else if (s.level === 'advanced') levelBoost += 5;
                    else if (s.level === 'intermediate') levelBoost += 3;
                }
            }
            score += levelBoost;

            // normalize points and sessions contribution (small)
            score += Math.min(18, Math.floor((u.points || 0) / 40));
            score += Math.min(10, Math.floor((u.sessionsCompleted || 0) / 2));
            score += Math.min(6, Math.floor(((u.rating || 0) - 3.0) * 2)); // small boost for higher rating

            // random small noise so percentages vary per person
            score += getRandomNumber(-6, 6);

            // clamp, but keep > 10
            const finalPct = Math.max(8, Math.min(98, Math.round(score)));

            u.matchPercentage = finalPct;
            // save updates to DB: replace document skillsCanTeach and matchPercentage
            await User.findByIdAndUpdate(u._id, { skillsCanTeach: u.skillsCanTeach, matchPercentage: u.matchPercentage });
        }
        console.log('✅ Match percentages and skills adjusted\n');
        
        // Create some pending connection requests (incoming requests for each user)
        console.log('📨 Creating connection requests...');
        let totalRequests = 0;
        
        for (const user of users) {
            // Each user gets 2-5 incoming connection requests
            const requestCount = getRandomNumber(2, 5);
            
            for (let i = 0; i < requestCount; i++) {
                const sender = getRandomItem(users.filter(u => 
                    u._id.toString() !== user._id.toString() && 
                    !user.connections.includes(u._id)
                ));
                
                if (sender) {
                    // Check if request already exists
                    const existingRequest = await Notification.findOne({
                        sender: sender._id,
                        recipient: user._id,
                        type: 'connection_request'
                    });
                    
                    if (!existingRequest) {
                        await Notification.create({
                            recipient: user._id,
                            sender: sender._id,
                            type: 'connection_request',
                            title: 'New Connection Request',
                            message: `${sender.name} wants to connect with you`,
                            metadata: {
                                actionType: 'accept',
                                actionUrl: `/connections/${sender._id}`
                            }
                        });
                        totalRequests++;
                    }
                }
            }
        }
        
        console.log(`✅ Created ${totalRequests} pending connection requests\n`);
        
        // Generate and insert sessions
        console.log('📅 Generating sessions...');
        const sessionsData = generateSessions(users);
        const sessions = await Session.insertMany(sessionsData);
        console.log(`✅ Created ${sessions.length} sessions\n`);
        
        // Update users with session references
        console.log('🔄 Linking sessions to users...');
        for (const session of sessions) {
            await User.findByIdAndUpdate(session.createdBy, {
                $push: { sessions: session._id }
            });
            
            for (const memberId of session.members) {
                await User.findByIdAndUpdate(memberId, {
                    $push: { sessions: session._id }
                });
            }
        }
        console.log('✅ Sessions linked to users\n');

        // Recalculate and update sessionsCompleted for users based on linked sessions
        console.log('🔁 Recalculating sessionsCompleted from linked sessions...');
        for (const u of users) {
            // Count completed sessions where the user is creator or a member
            const completedCount = sessions.filter(s => s.status === 'Completed' && (String(s.createdBy) === String(u._id) || (s.members || []).some(m => String(m) === String(u._id)))).length;
            // If we don't have any completed sessions, keep the previous sessionsCompleted as a fallback
            const newCount = completedCount || u.sessionsCompleted || 0;
            await User.findByIdAndUpdate(u._id, { sessionsCompleted: newCount });
        }
        console.log('✅ sessionsCompleted updated from sessions\n');

        // Add some quiz completion records for active users (30% of users have quiz completions)
        console.log('🧪 Adding sample quiz completion records for some users...');
        const completedSessions = sessions.filter(s => s.status === 'Completed');
        if (completedSessions.length > 0) {
            for (const u of users) {
                if (Math.random() < 0.30) { // 30% users have quiz completions
                    const sampleCount = getRandomNumber(1, Math.min(4, completedSessions.length));
                    const chosen = getRandomItems(completedSessions, sampleCount);
                    const qrs = chosen.map(sess => ({
                        sessionId: sess._id,
                        score: getRandomNumber(60, 100),
                        awardedPoints: getRandomNumber(10, 50),
                        createdAt: new Date(sess.sessionOn.getTime() + (1000 * 60 * 60 * getRandomNumber(2, 6)))
                    }));
                    await User.findByIdAndUpdate(u._id, { $push: { quizCompletions: { $each: qrs } } });
                }
            }
        }
        console.log('✅ Sample quiz completion records added\n');
        
        // Generate and insert questions
        console.log('❓ Generating questions...');
        const questionsData = generateQuestions(users);
        const questions = await Question.insertMany(questionsData);
        console.log(`✅ Created ${questions.length} questions\n`);

        // Create notifications for some QA activity (question answered / qa_activity)
        console.log('🔔 Creating sample QA notifications...');
        for (const q of questions) {
            if (!Array.isArray(q.answers) || q.answers.length === 0) continue;
            for (const a of q.answers) {
                // 40% chance to create a notification for the asker
                if (Math.random() < 0.4) {
                    await Notification.create({
                        recipient: q.askedBy,
                        sender: a.answeredBy,
                        type: 'question_answered',
                        title: 'Your question received an answer',
                        message: 'Someone answered your question — check it out!',
                        isRead: Math.random() < 0.5,
                        metadata: { questionId: q._id, answerId: a._id, actionType: 'view', actionUrl: `/qna?questionId=${q._id}` }
                    });
                }

                // 25% chance to create a 'qa_activity' (upvote/mention) for the answer owner
                if (Math.random() < 0.25) {
                    const possibleRecipient = q.askedBy;
                    await Notification.create({
                        recipient: possibleRecipient,
                        sender: a.answeredBy,
                        type: 'qa_activity',
                        title: 'QA activity',
                        message: 'There was activity on a question you care about',
                        isRead: Math.random() < 0.6,
                        metadata: { questionId: q._id, answerId: a._id, actionType: 'view', actionUrl: `/qna?questionId=${q._id}` }
                    });
                }
            }
        }
        console.log('✅ Sample QA notifications created\n');

        // Create some session_invite notifications for a few sessions (simulate invites not accepted yet)
        console.log('📨 Creating sample session_invite notifications...');
        const upcomingSessions = sessions.filter(s => s.status === 'Upcoming');
        for (const s of upcomingSessions.slice(0, Math.min(5, upcomingSessions.length))) {
            // invite up to 2 users not in the session
            const notIn = users.filter(u => !s.members.map(m => String(m)).includes(String(u._id)) && String(u._id) !== String(s.createdBy));
            const toInvite = getRandomItems(notIn, Math.min(2, notIn.length));
            for (const invitee of toInvite) {
                await Notification.create({
                    recipient: invitee._id,
                    sender: s.createdBy,
                    type: 'session_invite',
                    title: 'You have been invited to a session',
                    message: `${getRandomItem(users).name} invited you to join a session on ${s.topic}`,
                    isRead: false,
                    metadata: { sessionId: s._id, actionType: 'accept', actionUrl: `/sessions/${s._id}` }
                });
            }
        }
        console.log('✅ Sample session_invite notifications created\n');
        
        // Summary
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🎉 DATABASE SEEDING COMPLETED!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('📊 Summary:');
        console.log(`   👥 Users: ${users.length}`);
        console.log(`   📅 Sessions: ${sessions.length}`);
        console.log(`   ❓ Questions: ${questions.length}`);
        console.log(`   📬 Connection Requests: ${totalRequests}\n`);
        
        console.log('🔐 Test Login Credentials:');
        console.log('   Email: arjun.sharma@iitdelhi.edu.in');
        console.log('   Password: password123\n');
        
        console.log('💡 All users have the same password: password123');
        console.log('💡 Each user has 3-8 connections and 2-5 pending requests\n');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run seeding
seedDatabase();

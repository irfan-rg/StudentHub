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

// Generate users
const generateUsers = () => {
    const users = [];
    const allSkills = Object.values(skills).flat();
    
    indianNames.forEach((name, index) => {
        const university = getRandomItem(indianUniversities);
        const fullName = `${name.first} ${name.last}`;
        const email = `${name.first.toLowerCase()}.${name.last.toLowerCase()}@${university.name.toLowerCase().replace(/\s+/g, '')}.edu.in`;
        
        // Select random skills to teach (3-6 skills)
        const teachCount = getRandomNumber(3, 6);
        const teachSkillNames = getRandomItems(allSkills, teachCount);
        const skillsCanTeach = teachSkillNames.map(skillName => ({
            name: skillName,
            level: getRandomItem(skillLevels),
            category: Object.keys(skills).find(key => skills[key].includes(skillName))
        }));
        
        // Select random skills to learn (2-4 skills, different from teaching)
        const learnSkills = allSkills.filter(s => !teachSkillNames.includes(s));
        const learnCount = getRandomNumber(2, 4);
        const skillsWantToLearn = getRandomItems(learnSkills, learnCount).map(skillName => ({
            name: skillName,
            category: Object.keys(skills).find(key => skills[key].includes(skillName))
        }));
        
        // Random points, sessions, questions based on activity level
        const activityLevel = Math.random();
        const points = activityLevel > 0.7 ? getRandomNumber(200, 500) : 
                       activityLevel > 0.4 ? getRandomNumber(50, 199) : 
                       getRandomNumber(0, 49);
        
        const sessionsCompleted = Math.floor(points / 50);
        const questionsAnswered = Math.floor(points / 25);
        const questionsAsked = getRandomNumber(0, 10);
        
        // Assign badges based on activity
        const userBadges = [];
        if (points > 0) userBadges.push('First Step');
        if (sessionsCompleted > 3) userBadges.push('Helper');
        if (questionsAnswered > 10) userBadges.push('Knowledge Sharer');
        if (points > 200) userBadges.push('Quick Learner');
        if (sessionsCompleted > 10) userBadges.push('Mentor');
        if (points > 400) userBadges.push('Legend');
        
        const rating = points > 100 ? Number((3.5 + Math.random() * 1.5).toFixed(1)) : 0;
        
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
            points,
            badges: userBadges,
            sessionsCompleted,
            questionsAnswered,
            questionsAsked,
            rating,
            connections: []
        });
    });
    
    return users;
};

// Generate sessions
const generateSessions = (users) => {
    const sessions = [];
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
        'Blockchain Technology Overview'
    ];
    
    const sessionTypes = ['Video Session', 'In Person'];
    const durations = ['30 minutes', '60 minutes', '90 minutes', '2 hours'];
    
    // Create 15-20 sessions
    const sessionCount = getRandomNumber(15, 20);
    
    for (let i = 0; i < sessionCount; i++) {
        const creator = getRandomItem(users);
        const topic = getRandomItem(topics);
        const sessionType = getRandomItem(sessionTypes);
        const duration = getRandomItem(durations);
        
        // Random date in next 30 days
        const daysAhead = getRandomNumber(1, 30);
        const sessionDate = new Date();
        sessionDate.setDate(sessionDate.getDate() + daysAhead);
        
        // Some sessions are past (completed)
        const isPast = Math.random() > 0.6;
        if (isPast) {
            sessionDate.setDate(sessionDate.getDate() - getRandomNumber(1, 60));
        }
        
        // Random members (2-5 people)
        const memberCount = getRandomNumber(2, 5);
        const possibleMembers = users.filter(u => u.email !== creator.email);
        const members = getRandomItems(possibleMembers, memberCount).map(u => u._id);
        
        // Ratings for completed sessions
        const ratings = isPast ? members.slice(0, getRandomNumber(1, memberCount)).map(memberId => ({
            user: memberId,
            rating: getRandomNumber(3, 5),
            comment: getRandomItem([
                'Great session! Learned a lot.',
                'Very informative and well-structured.',
                'Excellent explanation of concepts.',
                'Would love more sessions like this.',
                'Clear and helpful session.'
            ]),
            createdAt: new Date(sessionDate.getTime() + 2 * 60 * 60 * 1000)
        })) : [];
        
        const averageRating = ratings.length > 0 
            ? Number((ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(2))
            : 0;
        
        sessions.push({
            createdBy: creator._id,
            topic,
            details: `Join us for an interactive session on ${topic}. All skill levels welcome!`,
            sessionType,
            duration,
            location: sessionType === 'In Person' ? `${creator.college} Campus, Room ${getRandomNumber(101, 599)}` : undefined,
            link: sessionType === 'Video Session' ? `https://meet.google.com/${Math.random().toString(36).substring(7)}` : undefined,
            preferedTimings: `${getRandomNumber(10, 18)}:00 - ${getRandomNumber(19, 21)}:00`,
            members,
            sessionOn: sessionDate,
            ratings,
            averageRating,
            status: isPast ? 'Completed' : 'Upcoming'
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
        
        // Create question
        const question = {
            title: template.title,
            description: `I'm working on a project and need help understanding ${template.tags[0]}. Can someone explain this concept or share resources?`,
            tags: template.tags,
            askedBy: asker._id,
            upVotes: Array(getRandomNumber(0, 5)).fill().map(() => getRandomItem(users)._id),
            downVotes: Array(getRandomNumber(0, 2)).fill().map(() => getRandomItem(users)._id),
            answers: []
        };
        
        // Add 1-3 answers
        const answerCount = getRandomNumber(1, 3);
        for (let i = 0; i < answerCount; i++) {
            const answerer = getRandomItem(users.filter(u => u.email !== asker.email));
            const answerTexts = [
                `Here's a detailed explanation: ${template.tags[0]} is commonly used for... I recommend checking out the official documentation.`,
                `I've worked with this before. The key concept is... Let me know if you need more clarification.`,
                `Great question! From my experience, the best approach is... Hope this helps!`,
                `I had the same doubt earlier. What worked for me was... Feel free to ask if you have questions.`
            ];
            
            question.answers.push({
                answer: getRandomItem(answerTexts),
                answeredBy: answerer._id,
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
        
        // Generate connections and connection requests
        console.log('🔗 Creating connections and connection requests...');
        let connectionCount = 0;
        let requestCount = 0;
        let acceptedNotifCount = 0;
        let declinedNotifCount = 0;
        
        // Create some direct connections (5-7 connections)
        for (let i = 0; i < 7; i++) {
            const user1 = getRandomItem(users);
            const user2 = getRandomItem(users.filter(u => u._id.toString() !== user1._id.toString()));
            
            if (!user1.connections.includes(user2._id) && !user2.connections.includes(user1._id)) {
                user1.connections.push(user2._id);
                user2.connections.push(user1._id);
                await user1.save();
                await user2.save();
                connectionCount++;
                
                // 40% chance to create a connection_accepted notification
                if (Math.random() < 0.4) {
                    await Notification.create({
                        recipient: user1._id,
                        sender: user2._id,
                        type: 'connection_accepted',
                        title: 'Connection Accepted',
                        message: `${user2.name} accepted your connection request`,
                        isRead: Math.random() < 0.5,
                        metadata: {
                            actionType: 'view',
                            actionUrl: `/connections`
                        }
                    });
                    acceptedNotifCount++;
                }
            }
        }
        
        // Create pending connection requests (8-10 requests)
        for (let i = 0; i < 10; i++) {
            const sender = getRandomItem(users);
            const recipient = getRandomItem(users.filter(u => 
                u._id.toString() !== sender._id.toString() && 
                !sender.connections.includes(u._id)
            ));
            
            if (recipient) {
                // Check if request already exists
                const existingRequest = await Notification.findOne({
                    sender: sender._id,
                    recipient: recipient._id,
                    type: 'connection_request'
                });
                
                if (!existingRequest) {
                    await Notification.create({
                        recipient: recipient._id,
                        sender: sender._id,
                        type: 'connection_request',
                        title: 'New Connection Request',
                        message: `${sender.name} wants to connect with you`,
                        metadata: {
                            actionType: 'accept',
                            actionUrl: `/connections/${sender._id}`
                        }
                    });
                    requestCount++;
                }
            }
        }
        
        // Create some connection_declined notifications (3-5)
        for (let i = 0; i < 4; i++) {
            const decliner = getRandomItem(users);
            const declined = getRandomItem(users.filter(u => 
                u._id.toString() !== decliner._id.toString() && 
                !decliner.connections.includes(u._id)
            ));
            
            if (declined) {
                await Notification.create({
                    recipient: declined._id,
                    sender: decliner._id,
                    type: 'connection_declined',
                    title: 'Connection Declined',
                    message: `${decliner.name} declined your connection request`,
                    isRead: Math.random() < 0.6,
                    metadata: {
                        actionType: 'view',
                        actionUrl: `/connections`
                    }
                });
                declinedNotifCount++;
            }
        }
        
        console.log(`✅ Created ${connectionCount} connections, ${requestCount} pending requests`);
        console.log(`✅ Created ${acceptedNotifCount} accepted and ${declinedNotifCount} declined notifications\n`);
        
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
        
        // Generate and insert questions
        console.log('❓ Generating questions...');
        const questionsData = generateQuestions(users);
        const questions = await Question.insertMany(questionsData);
        console.log(`✅ Created ${questions.length} questions\n`);
        
        // Summary
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🎉 DATABASE SEEDING COMPLETED!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('📊 Summary:');
        console.log(`   👥 Users: ${users.length}`);
        console.log(`   🔗 Connections: ${connectionCount}`);
        console.log(`   📬 Pending Requests: ${requestCount}`);
        console.log(`   ✅ Accepted Notifications: ${acceptedNotifCount}`);
        console.log(`   ❌ Declined Notifications: ${declinedNotifCount}`);
        console.log(`   📅 Sessions: ${sessions.length}`);
        console.log(`   ❓ Questions: ${questions.length}\n`);
        
        console.log('🔐 Test Login Credentials:');
        console.log('   Email: arjun.sharma@iitdelhi.edu.in');
        console.log('   Password: password123\n');
        
        console.log('💡 All users have the same password: password123');
        console.log('💡 Check notifications to see pending connection requests!\n');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run seeding
seedDatabase();

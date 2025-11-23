import mongoose from 'mongoose'

const SkillTeachSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert']
    },
    category: {
        type: String,
    }
})

const SkillLearnSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    category: {
        type: String,
    }
})

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
    college: {
        type: String,
        required: true,
    },
    educationLevel: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
    },
    avatar: {
        type: String,
        default: "https://tse3.mm.bing.net/th/id/OIP.VTn0NAxal8BSB5W3ZTSdUAHaHT?rs=1&pid=ImgDetMain&o=7&rm=3"
    },
    skillsCanTeach: [SkillTeachSchema], // Each item now has _id
    skillsWantToLearn: [SkillLearnSchema], // Each item now has _id
    points: {
        type: Number,
        default: 0,
    },
    badges: [
        {
            type: String,
            enum: ['Helper', 'First Step', 'Quick Learner', 'Knowledge Sharer', 'Mentor', 'Legend', 'Noble']
        }
    ],
    sessionsCompleted: {
        type: Number,
        default: 0,
    },
    questionsAnswered: {
        type: Number,
        default: 0,
    },
    questionsAsked: {
        type: Number,
    },
    connections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    sessions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session"
    }],
    rating: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

export default mongoose.model("User", userSchema)
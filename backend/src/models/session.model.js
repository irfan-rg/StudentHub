import mongoose from 'mongoose'

const sessionModel = mongoose.Schema({

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    details: {
        type: String,
    },
    sessionType: {
        type: String,
        enum: ["Video Session", "In Person"]
    },
    duration: {
        type: String,
        required: true
    },
    location: {
        type: String,
    },
    link: {
        type: String,
    },
    preferedTimings: {
        type: String
    },
    ratings: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            rating: {
                type: Number,
                min: 1,
                max: 5,
                required: true
            },
            comment: {
                type: String,
                default: ""
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    sessionOn: {
        type: Date,
        required: true
    },
    quizQuestions: [
        {
            id: String,
            question: String,
            options: [String],
            answer: String
        }
    ],
    averageRating: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["Upcoming", "Completed", "Cancelled"],
        default: "Upcoming"
    }

}, { timestamps: true })

export default mongoose.model("Session", sessionModel)
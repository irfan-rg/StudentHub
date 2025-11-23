import mongoose from 'mongoose'

const notificationSchema = mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: ["session_invite", "session_accepted", "session_declined", "question_answered", "connection_request", "connection_accepted", "connection_declined", "qa_activity", "general"],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    metadata: {
        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Session"
        },
        inviteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Notification"
        },
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question"
        },
        actionUrl: String,
        actionType: {
            type: String,
            enum: ["accept", "decline", "view", "none"]
        }
    }
}, { timestamps: true })

export default mongoose.model("Notification", notificationSchema)
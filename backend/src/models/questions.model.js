import mongoose from 'mongoose'

const answerSchema = new mongoose.Schema({
    answer: {
        type: String,
        required: true
    },
    answeredBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    answeredAt:{
        type:Date,
        default:Date.now
    },
    upVotes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    downVotes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }]
})

const questionSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tags: [String],
    askedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    askedAt: {
        type: Date,
        default: Date.now
    },
    upVotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    downVotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    answers: [answerSchema]
}, { timestamps: true })

export default mongoose.model("Question", questionSchema)
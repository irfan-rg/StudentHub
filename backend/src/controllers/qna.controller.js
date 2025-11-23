import Question from "../models/questions.model.js";
import User from '../models/user.model.js'
import Notification from '../models/notification.model.js'
import { errorHandler } from '../utils/errorHandler.js'
import { awardPoints, POINTS_CONFIG } from './points.controller.js'

export const askQuestion = async (req, res, next) => {
    try {

        const { title, description, tags } = req.body;
        const { id } = req.user

        const user = await User.findById(id)

        if (!user) {
            return next(errorHandler(404, 'User not found'))
        }

        const question = new Question({
            title,
            description,
            tags,
            askedBy: id,
        })

        await question.save();
        
        // Award points for asking a question
        try {
            await awardPoints(id, POINTS_CONFIG.ASK_QUESTION, 'Asked a question', { questionsAsked: 1 });
        } catch (error) {
            console.error('Failed to award points:', error);
        }
        
        // Return populated question so we can include author details
        const populated = await Question.findById(question._id)
            .populate('askedBy', 'name avatar points')
            .populate('answers.answeredBy', 'name avatar')

        // Create a notification for all users about the new question
        try {
            const currentUser = await User.findById(id);
            const recipients = await User.find({ _id: { $ne: id } }).select('_id');
                const notifications = recipients.map(r => ({
                recipient: r._id,
                sender: id,
                type: 'qa_activity',
                title: 'New Question',
                    message: `${currentUser?.name || 'Someone'} asked a new question: "${populated.title}"`,
                    metadata: { questionId: populated._id, actionType: 'view', actionUrl: `/qa?questionId=${populated._id}` },
            }));
            await Notification.insertMany(notifications);
        } catch (err) {
            console.error('Failed to broadcast new question notifications:', err.message || err);
        }

        res
            .status(200)
            .json({
                success: true,
                message: 'Question asked successfully',
                data: { question: populated }
            })

    } catch (error) {
        next(errorHandler(500, error.message));
    }
}

export const answerQuestion = async (req, res, next) => {

    try {

        const { questionId, answer } = req.body;
        const { id } = req.user

        const user = await User.findById(id)
        if (!user) {
            return next(errorHandler(404, 'User not found'))
        }

        const question = await Question.findById(questionId)
        if (!question) {
            return next(errorHandler(404, 'Question not found'))
        }

        const newAnswer = {
            answer,
            answeredBy: id
        }

        question.answers.push(newAnswer)
        await question.save()
        
        // Award points for answering a question
        try {
            await awardPoints(id, POINTS_CONFIG.ANSWER_QUESTION, 'Answered a question', { questionsAnswered: 1 });
        } catch (error) {
            console.error('Failed to award points:', error);
        }
        
        // return populated object so frontend can show answer author name
        const populated = await Question.findById(question._id)
            .populate('askedBy', 'name avatar points')
            .populate('answers.answeredBy', 'name avatar')
        // Create a notification for the question owner about the new answer
        try {
            const currentUser = await User.findById(id);
            if (String(populated.askedBy.id) !== String(id)) {
                const exists = await Notification.exists({ recipient: populated.askedBy.id, sender: id, type: 'qa_activity', 'metadata.questionId': populated._id });
                if (!exists) {
                    await Notification.create({
                        recipient: populated.askedBy.id,
                        sender: id,
                        type: 'question_answered',
                        title: 'New Answer',
                        message: `${currentUser?.name || 'Someone'} answered your question: "${populated.title}"`,
                        metadata: { questionId: populated._id, actionType: 'view', actionUrl: `/qa?questionId=${populated._id}` }
                    });
                }
            }
        } catch (err) {
            console.error('Failed to create downvote notification:', err.message || err);
        }

        res
            .status(200)
            .json({
                success: true,
                message: 'Answered successfully',
                data: { question: populated }
            })

    } catch (error) {
        next(errorHandler(500, error.message));
    }

}

export const getAllQuestions = async (req, res, next) => {

    try {
        let outputQuestions = []
        const questions = await Question.find()

        for (const question of questions) {

            let tempQuestion = {
                id: question._id,
                title: question.title,
                description: question.description,
                tags: question.tags,
                askedAt: question.askedAt,
                upVotes: question.upVotes,
                downVotes: question.downVotes,
                answers: []
            }
            const user = await User.findById(question.askedBy)
            tempQuestion.askedBy = {
                id: user._id,
                name: user.name,
                avatar: user.avatar,
                points: user.points,
            }
            for (const answer of question.answers) {
                const user = await User.findById(answer.answeredBy)
                let tempAnswer = {
                    id: answer._id,
                    answer: answer.answer,
                    answeredAt: answer.answeredAt,
                    upVotes: answer.upVotes,
                    downVotes: answer.downVotes,
                    answeredBy: {
                        id: user._id,
                        name: user.name,
                        avatar: user.avatar,
                    }
                }
                tempQuestion.answers.push(tempAnswer)
            }

            outputQuestions.push(tempQuestion)
        }

        res
            .status(200)
            .json({
                success: true,
                message: 'Questions fetched successfully',
                data: { outputQuestions }
            });

    } catch (error) {
        next(errorHandler(500, error.message));
    }

}

export const upvoteQuestion = async (req, res, next) => {

    try {

        const { questionId } = req.body;
        const { id } = req.user

        const question = await Question.findById(questionId)
        if (!question) {
            return next(errorHandler(404, 'Question not found'))
        }

        // If already upvoted, do nothing (no toggling/unvote)
        if (question.upVotes.includes(id)) {
            // already upvoted - no change
        } else if (question.downVotes.includes(id)) {
            // move vote from down to up
            question.downVotes = question.downVotes.filter(userId => userId.toString() !== id)
            question.upVotes.push(id)
        } else {
            // add upvote
            question.upVotes.push(id)
        }
        await question.save()
        // Return populated question so frontend has author/answerer info
        const populated = await Question.findById(question._id)
            .populate('askedBy', 'name avatar points')
            .populate('answers.answeredBy', 'name avatar')
        // Create a notification for the question owner about the upvote
        try {
            const currentUser = await User.findById(id);
            const questionOwnerId = populated.askedBy?.id || populated.askedBy;
            if (questionOwnerId && String(questionOwnerId) !== String(id)) {
                const exists = await Notification.exists({ recipient: questionOwnerId, sender: id, type: 'qa_activity', 'metadata.questionId': populated._id });
                    if (!exists) {
                    await Notification.create({
                        recipient: questionOwnerId,
                        sender: id,
                        type: 'qa_activity',
                        title: 'Question Upvoted',
                        message: `${currentUser?.name || 'Someone'} upvoted your question`,
                        metadata: { questionId: populated._id, actionType: 'view', actionUrl: `/qa?questionId=${populated._id}` }
                    });
                }
            }
        } catch (err) {
            console.error('Failed to create upvote notification:', err.message || err);
        }
        // Avoid creating duplicate notification if there already was a qa_activity for this user+question recently
        res
            .status(200)
            .json({
                success: true,
                message: 'Upvote Updated successfully',
                data: { question: populated }
            })

    } catch (error) {
        next(errorHandler(500, error.message));
    }
}

export const downvoteQuestion = async (req, res, next) => {

    try {

        const { questionId } = req.body;
        const { id } = req.user

        const question = await Question.findById(questionId)
        if (!question) {
            return next(errorHandler(404, 'Question not found'))
        }

        // If already downvoted, do nothing (no toggling / remove)
        if (question.downVotes.includes(id)) {
            // already downvoted - no change
        } else if (question.upVotes.includes(id)) {
            // move from up to down
            question.upVotes = question.upVotes.filter(userId => userId.toString() !== id)
            question.downVotes.push(id)
        } else {
            question.downVotes.push(id)
        }
        await question.save()

        const populated = await Question.findById(question._id)
            .populate('askedBy', 'name avatar points')
            .populate('answers.answeredBy', 'name avatar')

        res
            .status(200)
            .json({
                success: true,
                message: 'Downvote Updated successfully',
                data: { question: populated }
            })
    } catch (error) {
        next(errorHandler(500, error.message));
    }

}

export const upvoteAnswer = async (req, res, next) => {

    try {

        const { answerId, questionId } = req.body;
        const { id } = req.user

        const question = await Question.findById(questionId)
        if (!question) {
            return next(errorHandler(404, 'Question not found'))
        }

        for (const answer of question.answers) {
            if (answer._id.toString() === answerId) {

                // Check if this is a new upvote (to award points)
                const isNewUpvote = !answer.upVotes.includes(id) && !answer.downVotes.includes(id);
                
                // prevent toggling (no un-upvote)
                if (answer.upVotes.includes(id)) {
                    // already upvoted
                } else if (answer.downVotes.includes(id)) {
                    answer.downVotes = answer.downVotes.filter(userId => userId.toString() !== id)
                    answer.upVotes.push(id)
                } else {
                    answer.upVotes.push(id)
                }
                await question.save()
                
                // Award points to the answer author for receiving an upvote
                if (isNewUpvote && answer.answeredBy) {
                    try {
                        await awardPoints(answer.answeredBy, POINTS_CONFIG.ANSWER_UPVOTE, 'Answer upvoted');
                    } catch (error) {
                        console.error('Failed to award upvote points:', error);
                    }
                }
            }
        }

        const populated = await Question.findById(question._id)
            .populate('askedBy', 'name avatar points')
            .populate('answers.answeredBy', 'name avatar')
        try {
            const currentUser = await User.findById(id);
            const answerObj = populated.answers.find(a => a._id.toString() === answerId);
            const answerOwnerId = answerObj?.answeredBy?.id || answerObj?.answeredBy;
            if (answerOwnerId && String(answerOwnerId) !== String(id)) {
                const exists = await Notification.exists({ recipient: answerOwnerId, sender: id, type: 'qa_activity', 'metadata.questionId': populated._id, 'metadata.answerId': answerId });
                    if (!exists) {
                    await Notification.create({
                        recipient: answerOwnerId,
                        sender: id,
                        type: 'qa_activity',
                        title: 'Answer Upvoted',
                        message: `${currentUser?.name || 'Someone'} upvoted your answer`,
                        metadata: { questionId: populated._id, answerId: answerId, actionType: 'view', actionUrl: `/qa?questionId=${populated._id}` }
                    });
                }
            }
        } catch (err) {
            console.error('Failed to create upvote notification:', err.message || err);
        }
        res
            .status(200)
            .json({
                success: true,
                message: 'Upvoted Updated successfully',
                data: { question: populated }
            })

    } catch (error) {
        next(errorHandler(500, error.message));
    }

}

export const downvoteAnswer = async (req, res, next) => {

    try {
        const { answerId, questionId } = req.body;
        const { id } = req.user
        const question = await Question.findById(questionId)
        if (!question) {
            return next(errorHandler(404, 'Question not found'))
        }

        for (const answer of question.answers) {
            if (answer._id.toString() === answerId) {
                if (answer.downVotes.includes(id)) {
                    // already downvoted
                } else if (answer.upVotes.includes(id)) {
                    answer.upVotes = answer.upVotes.filter(userId => userId.toString() !== id)
                    answer.downVotes.push(id)
                } else {
                    answer.downVotes.push(id)
                }
                await question.save()
            }
        }

        const populated = await Question.findById(question._id)
            .populate('askedBy', 'name avatar points')
            .populate('answers.answeredBy', 'name avatar')
        try {
            const currentUser = await User.findById(id);
            const answerObj = populated.answers.find(a => a._id.toString() === answerId);
            const answerOwnerId = answerObj?.answeredBy?.id || answerObj?.answeredBy;
            if (answerOwnerId && String(answerOwnerId) !== String(id)) {
                const exists = await Notification.exists({ recipient: answerOwnerId, sender: id, type: 'qa_activity', 'metadata.questionId': populated._id, 'metadata.answerId': answerId });
                    if (!exists) {
                    await Notification.create({
                        recipient: answerOwnerId,
                        sender: id,
                        type: 'qa_activity',
                        title: 'Answer Downvoted',
                        message: `${currentUser?.name || 'Someone'} downvoted your answer`,
                        metadata: { questionId: populated._id, answerId: answerId, actionType: 'view', actionUrl: `/qa?questionId=${populated._id}` }
                    });
                }
            }
        } catch (err) {
            console.error('Failed to create downvote notification:', err.message || err);
        }
        res
            .status(200)
            .json({
                success: true,
                message: 'Downvote Updated successfully',
                data: { question: populated }
            })

    } catch (error) {
        next(errorHandler(500, error.message));
    }
}

export const getQuestionsByUser = async (req, res, next) => {

    try {

        const { id } = req.user
        const questions = await Question.find({ askedBy: id })

        res
            .status(200)
            .json({
                success: true,
                message: 'Questions fetched successfully',
                data: { questions }
            })

    } catch (error) {
        next(errorHandler(500, error.message));
    }

}
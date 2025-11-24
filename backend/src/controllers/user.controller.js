// Search users by name or email (for Discover)
export const searchUsers = async (req, res, next) => {
    try {
        const { q } = req.query;
        const currentUserId = req.user?.id;
        if (!q || q.trim().length < 2) {
            return res.status(400).json({ success: false, message: 'Search query too short' });
        }
        // Case-insensitive partial match on name or email
        const regex = new RegExp(q, 'i');
        const users = await User.find({
            $or: [
                { name: regex },
                { email: regex }
            ],
            _id: { $ne: currentUserId }
        }).select('name email avatar college skillsCanTeach skillsWantToLearn badges points sessionsCompleted rating');
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        next(errorHandler(500, error.message));
    }
};
import User from '../models/user.model.js'
import { errorHandler } from '../utils/errorHandler.js'

export const getUserProfile = async (req, res, next) => {
    try {
        // req.user.id comes from the verifyToken middleware
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        res
            .status(200)
            .json({
                success: true,
                message: 'Profile fetched successfully',
                user: user
            });

    } catch (error) {
        next(errorHandler(500, error.message));
    }
};

export const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password');

        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        res
            .status(200)
            .json({
                success: true,
                message: 'User fetched successfully',
                data: { user }
            });

    } catch (error) {
        next(errorHandler(500, error.message));
    }
};

export const verifyUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: 'User not found',
                    data: { isVerified: false }
                });
        }

        res
            .status(200)
            .json({
                success: true,
                message: 'User verification status checked',
                data: { isVerified: true }
            });

    } catch (error) {
        next(errorHandler(500, error.message));
    }
};

export const updateUserDetails = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const updates = req.body;

        const allowedUpdates = Object.keys(updates).filter(field => 
            ['name', 'email', 'college', 'educationLevel', 'bio', 'avatar'].includes(field)
        )

        const updateData = {};
        allowedUpdates.forEach(field => {
            updateData[field] = updates[field]
        });

        if (updates.avatar && typeof updates.avatar === 'string') {
            updateData.avatar = updates.avatar
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password')

        if (!updatedUser) {
            return next(errorHandler(404, 'User not found'))
        }

        res.status(200).json({
            success: true,
            message: 'User details updated successfully',
            data: { user: updatedUser }
        });

    } catch (error) {
        next(errorHandler(500, error.message));
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.user;
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        res
            .status(200)
            .json({
                success: true,
                message: 'User deleted successfully'
            });

    } catch (error) {
        next(errorHandler(500, error.message));
    }
};

export const getLeaderboard = async (req, res, next) => {
    try {
        const { id } = req.user;
        const { filter } = req.params;

        const validFilters = ['points', 'sessionsCompleted', 'questionsAnswered'];
        const sortField = validFilters.includes(filter) ? filter : 'points';

        const currentUser = await User.findById(id);
        if (!currentUser) {
            return next(errorHandler(404, 'User not found'));
        }

        const limitVal = parseInt(req.query.limit, 10) || 50;

        const topUsers = await User.find()
            .sort({ [sortField]: -1 })
            .limit(limitVal)
            .select('name email avatar college points sessionsCompleted questionsAnswered badges rating')
            .lean(); // Use lean() to get plain JavaScript objects

        // Calculate rank for current user
        const higherCount = await User.countDocuments({ [sortField]: { $gt: currentUser[sortField] } });
        const currentUserRank = higherCount + 1;

        const isCurrentUserInTop = topUsers.some(user => user._id.toString() === currentUser._id.toString());

        let responseData = {
            topUsers: topUsers.map((user, index) => ({
                ...user,
                rank: index + 1
            })),
            filter: sortField,
            currentUserRank
        };

        // Add current user separately if not in top list
        if (!isCurrentUserInTop) {
            responseData.currentUser = {
                _id: currentUser._id,
                name: currentUser.name,
                avatar: currentUser.avatar,
                college: currentUser.college,
                points: currentUser.points,
                sessionsCompleted: currentUser.sessionsCompleted,
                questionsAnswered: currentUser.questionsAnswered,
                badges: currentUser.badges,
                rating: currentUser.rating,
                rank: currentUserRank
            };
        }

        res
            .status(200)
            .json({
                success: true,
                message: 'Leaderboard fetched successfully',
                data: responseData
            });

    } catch (error) {
        next(errorHandler(500, error.message));
    }
};

export const getUserRank = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select('points');

        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        const higherCount = await User.countDocuments({ points: { $gt: user.points } });
        const rank = higherCount + 1;

        res.status(200).json({
            success: true,
            message: 'User rank fetched successfully',
            data: { rank }
        });
    } catch (error) {
        next(errorHandler(500, error.message));
    }
};
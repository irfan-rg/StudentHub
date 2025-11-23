import User from '../models/user.model.js'
import { errorHandler } from '../utils/errorHandler.js'

export const getAllSkills = async (req, res, next) => {
    try {

        const { id } = req.user;
        const user = await User.findById(id);

        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        res
            .status(200)
            .json({
                success: true,
                message: 'Skills fetched successfully',
                data: {
                    skillsCanTeach: user.skillsCanTeach,
                    skillsWantToLearn: user.skillsWantToLearn
                }
            })

    } catch (error) {
        next(errorHandler(500, error.message));
    }
}

export const addSkillToTeach = async (req, res, next) => {
    try {

        const { id } = req.user;
        const user = await User.findById(id);

        const { name, category, level } = req.body
        user.skillsCanTeach.push({ name, category, level });
        await user.save();

        res
            .status(200)
            .json({
                success: true,
                message: 'Skill added successfully',
                data: { skillsCanTeach: user.skillsCanTeach }
            })


    } catch (error) {
        return next(errorHandler(500, error.message));
    }
}

export const addSkillToLearn = async (req, res, next) => {
    try {

        const { id } = req.user;
        const user = await User.findById(id);

        const { name, category } = req.body
        user.skillsWantToLearn.push({ name, category });
        await user.save();

        res
            .status(200)
            .json({
                success: true,
                message: 'Skill added successfully',
                data: { skillsWantToLearn: user.skillsWantToLearn }
            })

    } catch (error) {
        return next(errorHandler(500, error.message));
    }
}

export const updateSkill = async (req, res, next) => {
    try {

        const skillId = req.params.id;
        const { id } = req.user
        const user = await User.findById(id);

        const { level } = req.body

        user.skillsCanTeach.forEach(skill => {
            if (skill._id.toString() === skillId) {
                skill.level = level;
            }
        });

        await user.save();

        res
            .status(200)
            .json({
                success: true,
                message: 'Skill Updated successfully',
                data: { skillsCanTeach: user.skillsCanTeach }
            })

    } catch (error) {
        return next(errorHandler(500, error.message));
    }
}

export const deleteSkillCanTeach = async (req, res, next) => {
    try {

        const skillId = req.params.id;
        const { id } = req.user
        const user = await User.findById(id);

        user.skillsCanTeach = user.skillsCanTeach.filter(skill => skill._id.toString() !== skillId);
        await user.save();

        res
            .status(200)
            .json({
                success: true,
                message: 'Skill deleted successfully',
                data: { skillsCanTeach: user.skillsCanTeach }
            })

    } catch (error) {
        return next(errorHandler(500, error.message));
    }
}

export const deleteSkillToLearn = async (req, res, next) => {
    try {

        const skillId = req.params.id;
        const { id } = req.user
        const user = await User.findById(id);

        user.skillsWantToLearn = user.skillsWantToLearn.filter(skill => skill._id.toString() !== skillId);
        await user.save();

        res
            .status(200)
            .json({
                success: true,
                message: 'Skill deleted successfully',
                data: { skillsWantToLearn: user.skillsWantToLearn }
            })

        
    } catch (error) {
        return next(errorHandler(500, error.message));
    }
}

// Bulk update skills to teach
export const updateSkillsToTeach = async (req, res, next) => {
    try {
        const { id } = req.user;
        const user = await User.findById(id);

        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        const { skills } = req.body; // Expecting array of { name, category, level }

        if (!Array.isArray(skills)) {
            return next(errorHandler(400, 'Skills must be an array'));
        }

        // Replace entire skillsCanTeach array
        user.skillsCanTeach = skills;
        await user.save();

        res
            .status(200)
            .json({
                success: true,
                message: 'Teaching skills updated successfully',
                data: { skillsCanTeach: user.skillsCanTeach }
            });

    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};

// Bulk update skills to learn
export const updateSkillsToLearn = async (req, res, next) => {
    try {
        const { id } = req.user;
        const user = await User.findById(id);

        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        const { skills } = req.body; // Expecting array of { name, category }

        if (!Array.isArray(skills)) {
            return next(errorHandler(400, 'Skills must be an array'));
        }

        // Replace entire skillsWantToLearn array
        user.skillsWantToLearn = skills;
        await user.save();

        res
            .status(200)
            .json({
                success: true,
                message: 'Learning skills updated successfully',
                data: { skillsWantToLearn: user.skillsWantToLearn }
            });

    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};
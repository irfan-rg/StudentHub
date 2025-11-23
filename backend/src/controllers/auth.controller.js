import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import { errorHandler } from '../utils/errorHandler.js'

export const signup = async (req, res, next) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return next(errorHandler(409, "User already exists with this email"));
        }

        const hashedPassword = bcrypt.hashSync(req.body.password, 10);

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            college: req.body.college,
            educationLevel: req.body.educationLevel,
            bio: req.body.bio || "",
            skillsCanTeach: Array.isArray(req.body.skillsCanTeach) ?
                req.body.skillsCanTeach.map(skill => ({
                    name: skill.name,
                    level: skill.level || "beginner",
                    category: skill.category || "",
                    verified: skill.verified || false
                })) : [],
            skillsWantToLearn: Array.isArray(req.body.skillsWantToLearn) ?
                req.body.skillsWantToLearn.map(skill => ({
                    name: skill.name,
                    category: skill.category || ""
                })) : []
        });

        await newUser.save();

        const token = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        const { password, ...userData } = newUser.toObject();

        const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        res
            .status(201)
            .cookie('userToken', token, {
                httpOnly: true,
                expires: expiryDate,
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                secure: process.env.NODE_ENV === 'production'
            })
            .json({
                success: true,
                message: "Account created successfully",
                user: userData,
                token: token
            });

    } catch (error) {
        next(errorHandler(500, "Internal server error during signup"));
    }
};

export const signin = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return next(errorHandler(404, "User not found"));
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            return next(errorHandler(400, "Invalid credentials"));
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        const { password, ...userData } = user._doc;

        const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        res
            .status(200)
            .cookie('userToken', token, {
                httpOnly: true,
                expires: expiryDate,
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                secure: process.env.NODE_ENV === 'production'
            })
            .json({
                success: true,
                message: "Login successful",
                user: userData,
                token: token
            });

    } catch (error) {
        next(errorHandler(500, "Internal server error during login"));
    }
};

export const addUserDetails = async (req, res, next) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return next(errorHandler(409, "User already exists with this email"));
        }

        const hashedPassword = bcrypt.hashSync(req.body.password, 10);

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            college: req.body.college,
            educationLevel: req.body.educationLevel,
            bio: req.body.bio || "",
            skillsCanTeach: Array.isArray(req.body.skillsCanTeach)
                ? req.body.skillsCanTeach.map(skill => ({
                    name: skill.name,
                    level: skill.level || "beginner",
                    category: skill.category || ""
                }))
                : [],
            skillsWantToLearn: Array.isArray(req.body.skillsWantToLearn)
                ? req.body.skillsWantToLearn.map(skill => ({
                    name: skill.name,
                    category: skill.category || "",
                }))
                : [],
            points: req.body.points || 0,
            badges: Array.isArray(req.body.badges) ? req.body.badges : [],
            sessionsCompleted: req.body.sessionsCompleted || 0,
            questionsAnswered: req.body.questionsAnswered || 0,
            rating: typeof req.body.rating === "number" ? req.body.rating : 0
        });

        await newUser.save();

        res
            .status(201)
            .json({
                success: true,
                message: "User added successfully",
                data: { userId: newUser._id }
            });

    } catch (error) {
        next(errorHandler(500, "Internal server error while adding user details"));
    }
};

export const signout = (req, res, next) => {

    res
        .status(200)
        .clearCookie('userToken')
        .json({
            success: true,
            message: 'Signout success!',
            data: null
        })

}

export const verify = (req, res, next) => {
    // This endpoint can be used by frontend to check token validity.
    try {
        // verifyToken middleware will populate req.user
        const userId = req.user && req.user.id;
        if (!userId) return next(errorHandler(401, 'Invalid or expired token'));

        res.status(200).json({ success: true, message: 'Token valid', data: { id: userId } });
    } catch (error) {
        next(errorHandler(500, error.message));
    }
}

export const refresh = (req, res, next) => {
    try {
        // The refresh endpoint relies on the httpOnly cookie 'userToken'
        // Accept refresh token from cookie, but fall back to Authorization header
        const tokenFromCookie = req.cookies && req.cookies.userToken;
        const tokenFromHeader = (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) ? req.headers.authorization.substring(7) : null;
        const token = tokenFromCookie || tokenFromHeader;
        if (!token) return next(errorHandler(401, 'No refresh token present'));

        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return next(errorHandler(401, 'Invalid or expired refresh token'));
        }

        const newToken = jwt.sign({ id: payload.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        res
            .status(200)
            .cookie('userToken', newToken, {
                httpOnly: true,
                expires: expiryDate,
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                secure: process.env.NODE_ENV === 'production'
            })
            .json({ success: true, message: 'Token refreshed', token: newToken });

    } catch (error) {
        next(errorHandler(500, error.message));
    }
}
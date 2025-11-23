import jwt from 'jsonwebtoken'
import { errorHandler } from './errorHandler.js'

export const verifyToken = (req, res, next) => {
    // Extract token from Authorization header and cookie (if present)
    // We'll try header first, but if the header token fails verification
    // we'll fall back to the cookie (useful when localStorage is stale)
    const headerToken = (req.headers.authorization && req.headers.authorization.startsWith('Bearer '))
        ? req.headers.authorization.substring(7)
        : null;
    const cookieToken = req.cookies && req.cookies.userToken ? req.cookies.userToken : null;
    
    if (!headerToken && !cookieToken) {
        console.log('[verifyToken] No token present. header present:', !!req.headers.authorization, 'cookie present:', !!req.cookies?.userToken)
        return next(errorHandler(403, "User Not authenticated"))
    }

    // Helper to verify token and call next
    const verifyAndContinue = (tkn, source) => {
        jwt.verify(tkn, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                console.log(`[verifyToken] Token verification failed for ${source}:`, err.message);
                return false;
            }
            req.user = user;
            return true;
        });
        return null; // fallback
    }

    // Try header token first, but if it fails try cookie token
    if (headerToken) {
        try {
            const ok = jwt.verify(headerToken, process.env.JWT_SECRET);
            req.user = ok;
            return next();
        } catch (err) {
            console.log('[verifyToken] Header token invalid, trying cookie token if available');
            if (cookieToken) {
                try {
                    const ok = jwt.verify(cookieToken, process.env.JWT_SECRET);
                    req.user = ok;
                    return next();
                } catch (err2) {
                    console.log('[verifyToken] Cookie token verification failed:', err2.message);
                    return next(errorHandler(401, "Invalid or expired token"));
                }
            }
            return next(errorHandler(401, "Invalid or expired token"));
        }
    } else {
        try {
            const ok = jwt.verify(cookieToken, process.env.JWT_SECRET);
            req.user = ok;
            return next();
        } catch (err) {
            console.log('[verifyToken] Cookie token verification failed:', err.message);
            return next(errorHandler(401, "Invalid or expired token"));
        }
    }
}
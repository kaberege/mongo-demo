import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/config.js";
import TokenBlacklist from "../models/token-blacklist.js";
export const isAuth = async (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        const error = new Error("Authorization header is missing!");
        error.statusCode = 401;
        return next(error);
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        const error = new Error("Token is missing in the header!");
        error.statusCode = 401;
        return next(error);
    }
    try {
        const isBlacklisted = await TokenBlacklist.findOne({ token });
        if (isBlacklisted) {
            const error = new Error("Session key invalid or revoked.");
            error.statusCode = 401;
            return next(error);
        }
        const secretKey = JWT_SECRET || "";
        if (!secretKey) {
            throw new Error("JWT Secret configuration missing.");
        }
        const decodedToken = jwt.verify(token, secretKey);
        if (!decodedToken) {
            const error = new Error("Cryptographic verification failed.");
            error.statusCode = 401;
            return next(error);
        }
        if (!decodedToken.userId || !decodedToken.role) {
            const error = new Error("Malformed token payload.");
            error.statusCode = 401;
            return next(error);
        }
        req.userId = decodedToken.userId;
        req.userRole = decodedToken.role;
        next();
    }
    catch (error) {
        error.statusCode = 401;
        return next(error);
    }
};
//# sourceMappingURL=is-auth.js.map
import jwt from "jsonwebtoken";
export const isAuth = (req, res, next) => {
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
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET || "secrettoken");
    }
    catch (error) {
        error.statusCode = 401;
        return next(error);
    }
    if (!decodedToken) {
        const error = new Error("Not authenticated.");
        error.statusCode = 401;
        return next(error);
    }
    req.userId = decodedToken.userId;
    next();
};
//# sourceMappingURL=is-auth.js.map
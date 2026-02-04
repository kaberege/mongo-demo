import jwt from "jsonwebtoken";
export const isAuth = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        return res
            .status(404)
            .json({ message: "Authorisation header is missing!" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(404).json({ message: "Token is missing in the header!" });
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET || "secrettoken");
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        return res.status(500).json({ message: errorMessage });
    }
    req.userId = decodedToken.userId;
    next();
};
//# sourceMappingURL=is-auth.js.map
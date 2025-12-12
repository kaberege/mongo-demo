"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        return res
            .status(404)
            .json({ message: "Authorisation header is missing!" });
    }
    const token = authHeader.split(" ")[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, "secrettoken");
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
    if (!decodedToken) {
        return res.status(400).json({ message: "Token is not valid" });
    }
    req.userId = decodedToken.userId;
    next();
};
//# sourceMappingURL=is-auth.js.map
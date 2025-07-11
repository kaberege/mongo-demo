const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        console.log("Authorisation header is missing!");
    }
    const token = authHeader.split(" ")[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, "secrettoken");
    } catch (error) {
        console.log(error);
    }
    if (!decodedToken) {
        console.log("Not authenticated.");
    }
    req.userId = decodedToken.userId;
    next();
}
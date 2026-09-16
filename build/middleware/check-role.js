export const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.userId || !req.userRole || !allowedRoles.includes(req.userRole)) {
            const error = new Error("Privilege Escalation Blocked: Insufficient scope clearances.");
            error.statusCode = 403;
            return next(error);
        }
        next();
    };
};
//# sourceMappingURL=check-role.js.map
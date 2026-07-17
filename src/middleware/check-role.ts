import type { Request, Response, NextFunction } from "express";
import type { UserRole } from "../utils/interfaces.js";
import type { HttpError } from "../utils/interfaces.js";

export const checkRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userId || !req.userRole || !allowedRoles.includes(req.userRole)) {
      const error = new Error(
        "Privilege Escalation Blocked: Insufficient scope clearances.",
      ) as HttpError;
      error.statusCode = 403;
      return next(error);
    }
    next();
  };
};

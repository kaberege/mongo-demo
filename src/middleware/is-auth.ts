import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import type { HttpError, DecodedToken } from "../utils/interfaces.js";
import { JWT_SECRET } from "../utils/config.js";
import TokenBlacklist from "../models/token-blacklist.js";

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader: string | undefined = req.get("Authorization");

  if (!authHeader) {
    const error = new Error("Authorization header is missing!") as HttpError;
    error.statusCode = 401;
    return next(error);
  }

  const token: string | undefined = authHeader.split(" ")[1];

  if (!token) {
    const error = new Error("Token is missing in the header!") as HttpError;
    error.statusCode = 401;
    return next(error);
  }

  try {
    const isBlacklisted = await TokenBlacklist.findOne({ token });

    if (isBlacklisted) {
      const error = new Error("Session key invalid or revoked.") as HttpError;
      error.statusCode = 401;
      return next(error);
    }

    const secretKey = JWT_SECRET || "";

    if (!secretKey) {
      throw new Error("JWT Secret configuration missing.");
    }

    const decodedToken = jwt.verify(token, secretKey) as DecodedToken;

    if (!decodedToken) {
      const error = new Error(
        "Cryptographic verification failed.",
      ) as HttpError;
      error.statusCode = 401;
      return next(error);
    }

    req.userId = decodedToken.userId as string;
    req.userRole = decodedToken.role;
    next();
  } catch (error: any) {
    error.statusCode = 401;
    return next(error);
  }
};

import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import type { HttpError } from "../utils/interfaces.js";

interface JwtPayload {
  userId: string;
}

interface CustomRequest extends Request {
  userId?: string;
}

export const isAuth = (
  req: CustomRequest,
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

  let decodedToken;

  try {
    decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET || "secrettoken",
    ) as JwtPayload;
  } catch (error: any) {
    error.statusCode = 401;
    return next(error);
  }

  if (!decodedToken) {
    const error = new Error("Not authenticated.") as HttpError;
    error.statusCode = 401;
    return next(error);
  }

  req.userId = decodedToken.userId as string;
  next();
};

import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

interface JwtPayload {
  userId: string;
}

interface AuthRequest extends Request {
  userId?: string;
}

export const isAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader: string | undefined = req.get("Authorization");

  if (!authHeader) {
    return res
      .status(404)
      .json({ message: "Authorisation header is missing!" });
  }

  const token: string | undefined = authHeader.split(" ")[1];

  if (!token) {
    return res.status(404).json({ message: "Token is missing in the header!" });
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET || "secrettoken"
    ) as JwtPayload;
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "Authentication failed" });
  }

  req.userId = decodedToken.userId as string;
  next();
};

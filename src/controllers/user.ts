import type { NextFunction, Request, Response } from "express";
import User from "../models/user.js";
import Post from "../models/post.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { DecodedToken, HttpError } from "../utils/interfaces.js";
import { JWT_SECRET, JWT_REFRESH_SECRET, NODE_ENV } from "../utils/config.js";
import type { UserRole } from "../utils/interfaces.js";

interface RequestBody {
  name: string;
  email: string;
  password: string;
}

interface UserData {
  name?: string;
  email?: string;
  role?: UserRole;
  id?: string;
}

export const userRegister = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, email, password } = (req.body || {}) as RequestBody;

  try {
    const collides = await User.findOne({ email });

    if (collides) {
      const error = new Error(
        "Unique context collision: Email already exists.",
      ) as HttpError;
      error.statusCode = 422;
      throw error;
    }

    const secureHash = await bcrypt.hash(password, 12);
    const newUser: RequestBody = {
      name: name,
      email: email,
      password: secureHash,
      // role: "user"
    };

    const user = await User.create(newUser);
    const userData: UserData = {};
    userData.name = user.name;
    userData.email = user.email;
    userData.role = user.role;
    userData.id = user._id.toString();

    res
      .status(201)
      .json({ message: "User created successfully.", user: userData });
  } catch (error) {
    next(error);
  }
};

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // If req.body is undefined, it defaults to {}, avoiding the destructure crash
  const { email, password } = (req.body || {}) as RequestBody;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error("User with that email not found!") as HttpError;
      error.statusCode = 401;
      throw error;
    }

    const isEqual: boolean = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      const error = new Error("Password did not match!") as HttpError;
      error.statusCode = 401;
      throw error;
    }

    const accessToken = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      JWT_SECRET || "secretetoken",
      { expiresIn: "15m" },
    );
    const refreshToken = jwt.sign(
      { userId: user._id.toString() },
      JWT_REFRESH_SECRET || "refreshtoken",
      { expiresIn: "7d" },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userData: UserData = {};
    userData.name = user.name;
    userData.email = user.email;
    userData.role = user.role;
    userData.id = user._id.toString();

    res.status(200).json({ token: accessToken, user: userData });
  } catch (error) {
    next(error);
  }
};

export const tokenRefreshRotation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const cookies = req.headers.cookie;
  const cookieMap = Object.fromEntries(
    cookies?.split("; ").map((c) => c.split("=")) || [],
  );
  const refreshToken = cookieMap["refreshToken"];

  if (!refreshToken) {
    const error = new Error(
      "Session trace lost. Login sequence forced.",
    ) as HttpError;
    error.statusCode = 401;
    return next(error);
  }

  const secretRefreshTokenkey = JWT_REFRESH_SECRET || "";

  if (!secretRefreshTokenkey) {
    throw new Error("Refresh Token Secret configuration missing.");
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      secretRefreshTokenkey,
    ) as DecodedToken;

    const user = await User.findById(decoded.userId);

    if (!user) {
      const error = new Error(
        "Target core identity mapping resolved out of system context bounds.",
      ) as HttpError;
      error.statusCode = 401;
      throw error;
    }

    const newAccessToken = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      JWT_SECRET || "secretetoken",
      { expiresIn: "15m" },
    );

    res.status(200).json({ token: newAccessToken });
  } catch (err) {
    const error = new Error(
      "Session signature verification failed.",
    ) as HttpError;
    error.statusCode = 401;
    next(error);
  }
};

//============================================
export const userUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, email, password } = req.body as RequestBody;

  if (!req.userId) {
    const error = new Error("Not authenticated") as HttpError;
    error.statusCode = 401;
    return next(error);
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("User not found.") as HttpError;
      error.statusCode = 404;
      throw error;
    }
    user.email = email || user.email;
    user.name = name || user.name;
    if (password) {
      const hashedPW = await bcrypt.hash(password, 12);
      user.password = hashedPW;
    }
    const updatedUser = await user.save();
    const userData: Omit<UserData, "id"> = {};
    userData.name = updatedUser.name;
    userData.email = updatedUser.email;
    res
      .status(200)
      .json({ message: "User updated successfully.", user: userData });
  } catch (error) {
    next(error);
  }
};

export const userDelete = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.userId) {
    const error = new Error("Not authenticated") as HttpError;
    error.statusCode = 401;
    return next(error);
  }

  try {
    await User.findByIdAndDelete(req.userId);
    await Post.deleteMany({ creator: req.userId });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

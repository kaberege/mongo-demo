import type { NextFunction, Request, Response } from "express";
import User from "../models/user.js";
import Post from "../models/post.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { DecodedToken, HttpError } from "../utils/interfaces.js";
import { JWT_SECRET, JWT_REFRESH_SECRET, NODE_ENV } from "../utils/config.js";
import type { UserRole } from "../utils/interfaces.js";
import TokenBlacklist from "../models/token-blacklist.js";

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
      const error = new Error(
        "Invalid authentication parameters mapped.",
      ) as HttpError;
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
    const error = new Error(
      "Refresh Token Secret configuration missing.",
    ) as HttpError;
    error.statusCode = 401;
    return next(error);
  }

  try {
    const decodedToken = jwt.verify(
      refreshToken,
      secretRefreshTokenkey,
    ) as DecodedToken;

    if (!decodedToken) {
      const error = new Error(
        "Cryptographic verification failed.",
      ) as HttpError;
      error.statusCode = 401;
      throw error;
    }

    const user = await User.findById(decodedToken.userId);

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
    error.statusCode ? error.statusCode : 401;
    next(error);
  }
};

export const userLogout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.get("Authorization")?.split(" ")[1];
  try {
    await TokenBlacklist.create({ token });
    res.clearCookie("refreshToken");
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    // Silent return if user does NOT exist
    if (!user) {
      return res.status(200).json({
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    }

    // Generate token and save if user DOES exist
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.passwordResetExpiry = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // Send email asynchronously
    //await sendPasswordResetEmail(user.email, resetToken);

    return res.status(200).json({
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { token, newPassword } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  try {
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpiry: { $gt: new Date() },
    });

    if (!user) {
      const error = new Error(
        "Verification string expired or context is invalid.",
      ) as HttpError;
      error.statusCode = 400;
      throw error;
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.passwordResetToken = null;
    user.passwordResetExpiry = null;
    await user.save();

    res.status(200).json({
      message: "Security parameter reconfiguration verified successfully.",
    });
  } catch (err) {
    next(err);
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

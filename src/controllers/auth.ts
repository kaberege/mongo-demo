import type { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import User from "../models/user.js";
import Post from "../models/model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { HttpError } from "../utils/interfaces.js";

interface RequestBody {
  name: string;
  email: string;
  password: string;
}

interface UserData {
  name?: string;
  email?: string;
  id?: Types.ObjectId;
}

export const userAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, email, password } = req.body as RequestBody;

  try {
    const hashedPW: string = await bcrypt.hash(password, 12);
    const newUser: RequestBody = {
      name: name,
      email: email,
      password: hashedPW,
    };

    const user = await User.create(newUser);
    const userData: UserData = {};
    userData.name = user.name;
    userData.email = user.email;
    userData.id = user._id;

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
  const { email, password } = req.body as RequestBody;

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

    const token: string = jwt.sign(
      { email: user.email, userId: user._id.toString() },
      process.env.JWT_SECRET || "secrettoken",
      { expiresIn: "1h" },
    );

    const userData: UserData = {};
    userData.name = user.name;
    userData.email = user.email;
    userData.id = user._id;

    res.status(200).json({ token: token, user: userData });
  } catch (error) {
    next(error);
  }
};

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

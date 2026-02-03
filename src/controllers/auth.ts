import type { Request, Response } from "express";
import { Types } from "mongoose";
import User from "../models/user.js";
import Post from "../models/model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

interface CustomRequest extends Request {
  userId: string;
}

export const userAuth = async (req: Request, res: Response) => {
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
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error.";
    res.status(500).json({ message: errorMessage });
  }
};

export const userLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body as RequestBody;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User with that email not found!" });
    }

    const isEqual: boolean = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      return res.status(400).json({ message: "Password did not match!" });
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
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error.";
    res.status(500).json({ message: errorMessage });
  }
};

export const userUpdate = async (req: CustomRequest, res: Response) => {
  const { name, email, password } = req.body as RequestBody;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.send(404).json({ message: "User not found." });
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
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error.";
    res.status(500).json({ message: errorMessage });
  }
};

export const userDelete = async (req: CustomRequest, res: Response) => {
  try {
    await User.findByIdAndDelete(req.userId);
    await Post.deleteMany({ creator: req.userId });
    res.status(204).json({ message: "User deleted successfully." });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error.";
    res.status(500).json({ message: errorMessage });
  }
};

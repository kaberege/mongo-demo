import { Types } from "mongoose";
import User from "../models/user.js";
import Post from "../models/model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const userAuth = async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        const hashedPW = await bcrypt.hash(password, 12);
        const newUser = {
            name: name,
            email: email,
            password: hashedPW,
        };
        const user = await User.create(newUser);
        const userData = {};
        userData.name = user.name;
        userData.email = user.email;
        userData.id = user._id;
        res
            .status(201)
            .json({ message: "User created successfully.", user: userData });
    }
    catch (error) {
        next(error);
    }
};
export const userLogin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            const error = new Error("User with that email not found!");
            error.statusCode = 401;
            throw error;
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            const error = new Error("Password did not match!");
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({ email: user.email, userId: user._id.toString() }, process.env.JWT_SECRET || "secrettoken", { expiresIn: "1h" });
        const userData = {};
        userData.name = user.name;
        userData.email = user.email;
        userData.id = user._id;
        res.status(200).json({ token: token, user: userData });
    }
    catch (error) {
        next(error);
    }
};
export const userUpdate = async (req, res, next) => {
    const { name, email, password } = req.body;
    if (!req.userId) {
        const error = new Error("Not authenticated");
        error.statusCode = 401;
        return next(error);
    }
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            const error = new Error("User not found.");
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
        const userData = {};
        userData.name = updatedUser.name;
        userData.email = updatedUser.email;
        res
            .status(200)
            .json({ message: "User updated successfully.", user: userData });
    }
    catch (error) {
        next(error);
    }
};
export const userDelete = async (req, res, next) => {
    if (!req.userId) {
        const error = new Error("Not authenticated");
        error.statusCode = 401;
        return next(error);
    }
    try {
        await User.findByIdAndDelete(req.userId);
        await Post.deleteMany({ creator: req.userId });
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=auth.js.map
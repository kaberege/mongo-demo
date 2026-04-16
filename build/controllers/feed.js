import { Types } from "mongoose";
import User from "../models/user.js";
import Post from "../models/model.js";
export const feedResponse = (req, res) => {
    console.log("I got data with accurate responses.");
    res.json({ id: 1, name: "kgn", age: 20 });
};
export const feedPost = async (req, res, next) => {
    const { title, content } = req.body;
    const image = req.file ? req.file.path : null;
    if (!req.userId) {
        const error = new Error("Not authenticated");
        error.statusCode = 401;
        return next(error);
    }
    if (!title || !content) {
        const error = new Error("Title and content are required.");
        error.statusCode = 400;
        return next(error);
    }
    const newPost = {
        title: title,
        imageURL: image,
        content: content,
        creator: req.userId,
    };
    try {
        const post = await Post.create(newPost);
        const user = await User.findById(post.creator);
        if (!user) {
            const error = new Error("User not found.");
            error.statusCode = 404;
            throw error;
        }
        user.posts.push(post._id);
        const results = await user.save();
        res.status(201).json({
            message: "Data saved to the server successfully!",
            data: post,
            creatorName: results.name,
        });
    }
    catch (error) {
        next(error);
    }
};
export const getPost = async (req, res, next) => {
    const postId = req.params.postId;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            const error = new Error("No post found!");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json(post);
    }
    catch (error) {
        next(error);
    }
};
export const updatePost = async (req, res, next) => {
    const postId = req.params.postId;
    const { title, content } = req.body;
    const image = req.file ? req.file.path : null;
    if (!req.userId) {
        const error = new Error("Not authenticated");
        error.statusCode = 401;
        return next(error);
    }
    try {
        const post = await Post.findById(postId);
        if (!post) {
            const error = new Error("No post found!");
            error.statusCode = 404;
            throw error;
        }
        if (post.creator.toString() !== req.userId) {
            const error = new Error("You can only update your own posts");
            error.statusCode = 403;
            throw error;
        }
        post.title = title || post.title;
        post.content = content || post.content;
        post.imageURL = image || post.imageURL;
        const result = await post.save();
        res.status(200).json({ message: "Post updated.", data: result });
    }
    catch (error) {
        next(error);
    }
};
export const deletePost = async (req, res, next) => {
    const postId = req.params.postId;
    if (!req.userId) {
        const error = new Error("Not authenticated");
        error.statusCode = 401;
        return next(error);
    }
    try {
        const post = await Post.findById(postId);
        if (!post) {
            const error = new Error("No post found!");
            error.statusCode = 404;
            throw error;
        }
        if (post.creator.toString() !== req.userId) {
            const error = new Error("You can only delete your own posts");
            error.statusCode = 403;
            throw error;
        }
        await Post.findByIdAndDelete(postId);
        const user = await User.findById(req.userId);
        if (!user) {
            const error = new Error("User not found.");
            error.statusCode = 404;
            throw error;
        }
        user.posts.pull(postId);
        await user.save();
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=feed.js.map
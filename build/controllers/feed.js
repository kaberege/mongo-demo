import { Types } from "mongoose";
import User from "../models/user.js";
import Post from "../models/model.js";
export const feedResponse = (req, res) => {
    console.log("I got data with accurate responses.");
    res.json({ id: 1, name: "kgn", age: 20 });
};
export const feedPost = async (req, res) => {
    const { title, content } = req.body;
    const image = req.file ? req.file.path : null;
    if (!req.userId) {
        return res.status(401).json({ message: "Not authenticated" });
    }
    if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required." });
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
            return res.status(404).json({ message: "User not found." });
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
        const errorMessage = error instanceof Error ? error.message : "Internal server error.";
        res.status(500).json({ message: errorMessage });
    }
};
export const getPost = async (req, res) => {
    const postId = req.params.postId;
    try {
        const response = await Post.findById(postId);
        res.status(200).json(response);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Internal server error.";
        res.status(500).json({ message: errorMessage });
    }
};
export const updatePost = async (req, res) => {
    const postId = req.params.postId;
    const { title, content } = req.body;
    const image = req.file ? req.file.path : null;
    if (!req.userId) {
        return res.status(401).json({ message: "Not authenticated" });
    }
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "No post found!" });
        }
        if (post.creator.toString() !== req.userId) {
            return res
                .status(403)
                .json({ message: "You can only update your own posts" });
        }
        post.title = title || post.title;
        post.content = content || post.content;
        post.imageURL = image || post.imageURL;
        const result = await post.save();
        res.status(200).json({ message: "Post updated.", data: result });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Internal server error.";
        res.status(500).json({ message: errorMessage });
    }
};
export const deletePost = async (req, res) => {
    const postId = req.params.postId;
    if (!req.userId) {
        return res.status(401).json({ message: "Not authenticated" });
    }
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "No post found!" });
        }
        if (post.creator.toString() !== req.userId) {
            return res
                .status(403)
                .json({ message: "You can only delete your own posts" });
        }
        await Post.findByIdAndDelete(postId);
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        user.posts.pull(postId);
        await user.save();
        res.status(204).send();
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Internal server error.";
        res.status(500).json({ message: errorMessage });
    }
};
//# sourceMappingURL=feed.js.map
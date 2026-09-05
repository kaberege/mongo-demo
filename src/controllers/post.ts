import type { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { User } from "../models/user.js";
import { Post } from "../models/post.js";
import { clearImage } from "../utils/file-upload.js";
import type { HttpError } from "../utils/interfaces.js";

interface RequestBody {
  title: string;
  content: string;
}

interface PostProps {
  title: string;
  imageURL: string | null;
  content: string;
  creator: string;
}

export const getAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const searchString = req.query.search as string;

  // Multi-variant Search/Filtering Layer Design Matrix
  const filteringQuery = searchString
    ? { $text: { $search: searchString } }
    : {};

  try {
    const totalItems = await Post.find(filteringQuery).countDocuments();
    const posts = await Post.find(filteringQuery)
      .populate("creator", "name email role")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      posts,
      totalItems,
      page,
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (err) {
    next(err);
  }
};

export const feedPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { title, content } = (req.body || {}) as RequestBody;
  const image: string | null = req.file ? req.file.path : null;

  if (!req.userId) {
    const error = new Error("Not authenticated") as HttpError;
    error.statusCode = 401;
    return next(error);
  }

  if (!title || !content) {
    const error = new Error("Title and content are required.") as HttpError;
    error.statusCode = 400;
    return next(error);
  }

  const newPost: PostProps = {
    title: title,
    imageURL: image,
    content: content,
    creator: req.userId,
  };

  try {
    const post = await Post.create(newPost);
    const user = await User.findById(post.creator);
    if (!user) {
      const error = new Error("User not found.") as HttpError;
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
  } catch (error) {
    next(error);
  }
};

export const getPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);

    if (!post) {
      const error = new Error("No post found!") as HttpError;
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const postId: string | undefined = req.params.postId;
  const { title, content } = (req.body || {}) as RequestBody;
  const image = req.file ? req.file.path : null;

  if (!req.userId) {
    const error = new Error("Not authenticated") as HttpError;
    error.statusCode = 401;
    return next(error);
  }

  try {
    const post = await Post.findById(postId);

    if (!post) {
      const error = new Error("No post found!") as HttpError;
      error.statusCode = 404;
      throw error;
    }

    if (post.creator.toString() !== req.userId) {
      const error = new Error(
        "You can only update your own posts",
      ) as HttpError;
      error.statusCode = 403;
      throw error;
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.imageURL = image || post.imageURL;
    const result = await post.save();

    res.status(200).json({ message: "Post updated.", data: result });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const postId: string | undefined = req.params.postId;

  if (!req.userId) {
    const error = new Error("Not authenticated") as HttpError;
    error.statusCode = 401;
    return next(error);
  }

  try {
    const post = await Post.findById(postId);

    if (!post) {
      const error = new Error("No post found!") as HttpError;
      error.statusCode = 404;
      throw error;
    }

    if (post.creator.toString() !== req.userId) {
      const error = new Error(
        "You can only delete your own posts",
      ) as HttpError;
      error.statusCode = 403;
      throw error;
    }

    await Post.findByIdAndDelete(postId);
    const user = await User.findById(req.userId);

    if (!user) {
      const error = new Error("User not found.") as HttpError;
      error.statusCode = 404;
      throw error;
    }

    (user.posts as Types.DocumentArray<Types.ObjectId>).pull(postId);
    await user.save();

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

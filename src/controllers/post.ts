import type { NextFunction, Request, Response } from "express";
import { Post } from "../models/post.js";
import { clearImage } from "../utils/file-upload.js";
import { canModifyPost } from "../utils/permissions.js";
import type { HttpError } from "../utils/interfaces.js";

interface RequestBody {
  title: string;
  content: string;
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
  const imageURL = req.file ? req.file.path.replace(/\\/g, "/") : null;

  if (!imageURL) {
    const error = new Error(
      "Multi-part processing parsing error: File field mapping unresolved.",
    ) as HttpError;
    error.statusCode = 422;
    return next(error);
  }

  const newPost = {
    title: title,
    imageURL: imageURL,
    content: content,
    creator: req.userId,
  };

  try {
    const post = await Post.create(newPost);

    await post.populate("creator");

    res.status(201).json({
      message: "Data saved to the server successfully!",
      post,
    });
  } catch (error) {
    clearImage(imageURL);
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
    const post = await Post.findById(postId).populate("creator");

    if (!post) {
      const error = new Error("Target record not found.") as HttpError;
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
  let newImage = req.file ? req.file.path.replace(/\\/g, "/") : null;

  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      if (newImage) clearImage(newImage);
      const error = new Error(
        "Target document target mapping unresolved.",
      ) as HttpError;
      error.statusCode = 404;
      throw error;
    }

    if (
      !canModifyPost(req.userId!, req.userRole!, post.creator.toString(), [
        "admin",
        "editor",
      ])
    ) {
      if (newImage) clearImage(newImage);

      const error = new Error(
        "Not authorized to modify this resource.",
      ) as HttpError;
      error.statusCode = 403;
      throw error;
    }

    if (newImage) {
      clearImage(post.imageURL);
      post.imageURL = newImage;
    }
    if (title) post.title = title;
    if (content) post.content = content;

    const savedResult = await post.save();
    res
      .status(200)
      .json({ message: "Content revision verified.", data: savedResult });
  } catch (error) {
    if (newImage) {
      clearImage(newImage);
    }

    next(error);
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      const error = new Error(
        "Purge cancellation: Target entity does not exist.",
      ) as HttpError;
      error.statusCode = 404;
      throw error;
    }

    if (
      !canModifyPost(req.userId!, req.userRole!, post.creator.toString(), [
        "admin",
      ])
    ) {
      const error = new Error(
        "Modification scope permissions lock matched access mismatch.",
      ) as HttpError;
      error.statusCode = 403;
      throw error;
    }

    clearImage(post.imageURL);
    await Post.findByIdAndDelete(req.params.postId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

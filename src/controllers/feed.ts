import type { Request, Response } from "express";
import { Types } from "mongoose";
import User from "../models/user.js";
import Post from "../models/model.js";

interface CustomRequest extends Request {
  userId: string;
}

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

export const feedResponse = (req: Request, res: Response) => {
  console.log("I got data with accurate responses.");
  res.json({ id: 1, name: "kgn", age: 20 });
};

export const feedPost = async (req: CustomRequest, res: Response) => {
  const { title, content } = req.body as RequestBody;
  const image: string | null = req.file ? req.file.path : null;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required." });
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
      return res.status(404).json({ message: "User not found." });
    }
    user.posts.push(post._id);
    const results = await user.save();

    res.status(201).json({
      message: "Data saved to the server successfully!",
      data: post,
      creatorName: results.name,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error.";
    res.status(500).json({ message: errorMessage });
  }
};

export const getPost = async (req: Request, res: Response) => {
  const postId = req.params.postId;
  try {
    const response = await Post.findById(postId);
    res.status(200).json(response);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error.";
    res.status(500).json({ message: errorMessage });
  }
};

export const updatePost = async (req: CustomRequest, res: Response) => {
  const postId: string | undefined = req.params.postId;
  const { title, content } = req.body as RequestBody;
  const image = req.file ? req.file.path : null;

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
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error.";
    res.status(500).json({ message: errorMessage });
  }
};

export const deletePost = async (req: CustomRequest, res: Response) => {
  const postId: string | undefined = req.params.postId;

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

    (user.posts as Types.DocumentArray<Types.ObjectId>).pull(postId);
    await user.save();

    res.status(204).send();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error.";
    res.status(500).json({ message: errorMessage });
  }
};

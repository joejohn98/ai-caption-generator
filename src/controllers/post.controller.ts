import path from "path";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import generateCaption from "../services/ai.service";
import { uploadImage } from "../services/storage.service";
import Post from "../models/post.model";
import mongoose from "mongoose";
import {
  createPostSchema,
  updatePostSchema,
} from "../validators/post.validators";

const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

const getPosts = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user._id;

  if (!isValidObjectId(userId)) {
    res.status(400).json({
      status: "failed",
      error: "Invalid user ID",
    });
    return;
  }

  try {
    const posts = await Post.find({ user: userId })
      .populate("user", "username email")
      .select("-__v");
    res.status(200).json({
      status: "success",
      message: "Posts fetched successfully",
      posts,
    });
  } catch (error) {
    console.log("error fetching posts", error);
    res.status(500).json({
      status: "failed",
      error: "Internal server error, failed to fetch posts",
    });
  }
};

const createPost = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user._id;
  const file = req.file;

  if (!isValidObjectId(userId)) {
    res.status(400).json({
      status: "failed",
      error: "Invalid user ID",
    });
    return;
  }

  if (!file) {
    res.status(400).json({
      status: "failed",
      error: "Image is required",
    });
    return;
  }

  try {
    // Convert buffer to base64 for Gemini AI
    const base64Image = file.buffer.toString("base64");

    const fileName = `${uuidv4()}${path.extname(file.originalname)}`;

    const [caption, uploadResult] = await Promise.all([
      generateCaption(base64Image),
      uploadImage(file, fileName),
    ]);

    if (!uploadResult.url) {
      throw new Error("Image upload failed: no URL returned");
    }
    if (!caption) {
      throw new Error("Caption generation failed: no caption returned");
    }

    const validate = createPostSchema.safeParse({
      image: uploadResult.url,
      caption: caption,
      user: userId,
    });

    if (!validate.success) {
      res.status(400).json({
        status: "failed",
        error: validate.error?.issues[0]?.message || "Invalid post data",
      });
      return;
    }

    const post = await Post.create({
      image: uploadResult.url,
      caption: caption,
      user: userId,
    });

    res.status(201).json({
      status: "success",
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.log("error creating post", error);
    res.status(500).json({
      status: "failed",
      error: "Internal server error, failed to create post",
    });
  }
};

const updatePost = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user._id;
  const file = req.file;
  const { postId } = req.params as { postId: string };

  if (!isValidObjectId(userId)) {
    res.status(400).json({ status: "failed", error: "Invalid user ID" });
    return;
  }

  if (!postId || !isValidObjectId(postId)) {
    res.status(400).json({ status: "failed", error: "Invalid post ID" });
    return;
  }

  try {
    // Check the post exists and belongs to this user
    const existingPost = await Post.findById(postId);

    if (!existingPost) {
      res.status(404).json({ status: "failed", error: "Post not found" });
      return;
    }

    if (existingPost.user.toString() !== userId.toString()) {
      res.status(403).json({
        status: "failed",
        error: "Forbidden: you do not own this post",
      });
      return;
    }

    const updateData: { image?: string; caption?: string } = {};

    // Case 1: New image uploaded → upload to ImageKit + regenerate caption via AI
    if (file) {
      const base64Image = file.buffer.toString("base64");
      const fileName = `${uuidv4()}${path.extname(file.originalname)}`;

      const [caption, uploadResult] = await Promise.all([
        generateCaption(base64Image),
        uploadImage(file, fileName),
      ]);

      if (!uploadResult.url)
        throw new Error("Image upload failed: no URL returned");
      if (!caption)
        throw new Error("Caption generation failed: no caption returned");

      updateData.image = uploadResult.url;
      updateData.caption = caption; // AI-generated caption for new image
    } else if (req.body.caption) {
      // Case 2: No new image, but user wants to manually update the caption
      updateData.caption = req.body.caption;
    }

    const validate = updatePostSchema.safeParse(updateData);

    if (!validate.success) {
      res.status(400).json({
        status: "failed",
        error: validate.error?.issues[0]?.message || "Invalid post data",
      });
      return;
    }

    const post = await Post.findByIdAndUpdate(
      postId,
      { $set: updateData },
      { new: true }, // returns the updated document
    );

    res.status(200).json({
      status: "success",
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    console.log("error updating post", error);
    res.status(500).json({
      status: "failed",
      error: "Internal server error, failed to update post",
    });
  }
};

const deletePost = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user._id;
  const { postId } = req.params as { postId: string };

  if (!isValidObjectId(userId)) {
    res.status(400).json({ status: "failed", error: "Invalid user ID" });
    return;
  }

  if (!postId || !isValidObjectId(postId)) {
    res.status(400).json({ status: "failed", error: "Invalid post ID" });
    return;
  }

  try {
    // Check the post exists and belongs to this user
    const existingPost = await Post.findById(postId);

    if (!existingPost) {
      res.status(404).json({ status: "failed", error: "Post not found" });
      return;
    }

    if (existingPost.user.toString() !== userId.toString()) {
      res.status(403).json({
        status: "failed",
        error: "Forbidden: you do not own this post",
      });
      return;
    }

    const post = await Post.findByIdAndDelete(postId);

    res.status(200).json({
      status: "success",
      message: "Post deleted successfully",
      post,
    });
  } catch (error) {
    console.log("error deleting post", error);
    res.status(500).json({
      status: "failed",
      error: "Internal server error, failed to delete post",
    });
  }
};

export { createPost, updatePost, deletePost, getPosts };

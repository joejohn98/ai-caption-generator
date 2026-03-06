import path from "path";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import generateCaption from "../services/ai.service";
import { uploadImage } from "../services/storage.service";
import Post from "../models/post.model";
import mongoose from "mongoose";

const createPost = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user._id;
  const file = req.file;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
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

export { createPost };

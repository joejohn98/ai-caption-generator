import { Request, Response } from "express";

const createPost = async (req: Request, res: Response): Promise<void> => {
  const file = req.file;

  if (!file) {
    res.status(400).json({
      status: "failed",
      error: "Image is required",
    });
    return;
  }
  try {
    res.status(201).json({
      status: "success",
      message: "Post created successfully",
    });
  } catch (error) {
    console.log("error to create the post", error);
    res.status(500).json({
      status: "failed",
      error: "Internal server error, failed to create post",
    });
  }
};

export { createPost };

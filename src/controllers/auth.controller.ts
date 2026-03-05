import mongoose from "mongoose";
import { Request, Response } from "express";

import User from "../models/user.model";
import { registerSchema } from "../utils/validators/auth.validators";

const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  const validate = registerSchema.safeParse({ username, email, password });

  if (!validate.success) {
    res.status(400).json({
      status: "failed",
      error: validate.error?.issues[0]?.message || "Invalid input",
    });
    return;
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400).json({
      status: "failed",
      error: "User with this email already exists",
    });
    return;
  }

  try {
    const newUser = await User.create({ username, email, password });
    res.status(201).json({
      status: "success",
      data: newUser,
    });
  } catch (error) {
    console.log("error to register the user", error);
    res.status(500).json({
      status: "failed",
      error: "Internal server error, failed to register user",
    });
  }
};

export { registerUser };

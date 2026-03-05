import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import User from "../models/user.model";
import { loginSchema, registerSchema } from "../validators/auth.validators";
import generateToken from "../utils/generateToken";
import { config } from "../config/config";

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

    // Generate and set JWT token
    const token = generateToken(newUser._id.toString(), res);

    res.status(201).json({
      status: "success",
      data: newUser,
      token,
    });
  } catch (error) {
    console.log("error to register the user", error);
    res.status(500).json({
      status: "failed",
      error: "Internal server error, failed to register user",
    });
  }
};

const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const validate = loginSchema.safeParse({ email, password });

  if (!validate.success) {
    res.status(400).json({
      status: "failed",
      error: validate.error?.issues[0]?.message || "Invalid input",
    });
    return;
  }

  const existingUser = await User.findOne({ email }).select("+password");

  if (!existingUser) {
    res.status(400).json({
      status: "failed",
      error: "User with this email does not exist",
    });
    return;
  }

  try {
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordValid) {
      res.status(401).json({
        status: "failed",
        error: "Invalid email or password",
      });
      return;
    }
    // Generate and set JWT token
    const token = generateToken(existingUser._id.toString(), res);

    res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      data: existingUser,
      token,
    });
  } catch (error) {
    console.log("error to login the user", error);
    res.status(500).json({
      status: "failed",
      error: "Internal server error, failed to login user",
    });
  }
};

const logoutUser = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: config.nodeEnv === "production" ? "none" : "lax",
    });
    res.status(200).json({
      status: "success",
      message: "User logged out successfully",
    });
  } catch (error) {
    console.log("error to logout the user", error);
    res.status(500).json({
      status: "failed",
      error: "Internal server error, failed to logout user",
    });
  }
};

export { registerUser, loginUser, logoutUser };

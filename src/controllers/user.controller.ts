import { Request, Response } from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import { updateUserSchema } from "../validators/user.validators";

const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

const getMe = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user._id;

  if (!isValidObjectId(userId)) {
    res.status(400).json({
      status: "failed",
      error: "Invalid user ID",
    });
    return;
  }

  try {
    const user = await User.findById(userId).select("-__v");
    if (!user) {
      res.status(404).json({
        status: "failed",
        error: "User not found",
      });
      return;
    }
    res.status(200).json({
      status: "success",
      message: "User data fetched successfully",
      user,
    });
  } catch (error) {
    console.log("error fetching user", error);
    res.status(500).json({
      status: "failed",
      error: "Internal server error, failed to fetch user",
    });
  }
};

const updateMe = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user._id;

  if (!isValidObjectId(userId)) {
    res.status(400).json({
      status: "failed",
      error: "Invalid user ID",
    });
    return;
  }

  const updateData: { username?: string; email?: string; password?: string } =
    {};

  if (req.body.username) updateData.username = req.body.username;
  if (req.body.email) updateData.email = req.body.email;
  if (req.body.password) updateData.password = req.body.password;

  const validate = updateUserSchema.safeParse(updateData);

  if (!validate.success) {
    res.status(400).json({
      status: "failed",
      error: validate.error?.issues[0]?.message || "Invalid user data",
    });
    return;
  }

  try {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true },
    ).select("-__v");

    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.log("error updating user", error);
    res.status(500).json({
      status: "failed",
      error: "Internal server error, failed to update user",
    });
  }
};

const deleteMe = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user._id;

  if (!isValidObjectId(userId)) {
    res.status(400).json({
      status: "failed",
      error: "Invalid user ID",
    });
    return;
  }

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      res.status(404).json({
        status: "failed",
        error: "User not found",
      });
      return;
    }
    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log("error deleting user", error);
    res.status(500).json({
      status: "failed",
      error: "Internal server error, failed to delete user",
    });
  }
};

export { getMe, updateMe, deleteMe };

import jwt from "jsonwebtoken";
import { Response } from "express";

import { config } from "../config/config";

const generateToken = (userId: string, res: Response): string => {
  const payload = { id: userId };

  const token = jwt.sign(payload, config.jwtSecret!, {
    expiresIn: (config.jwtExpiration || "7d") as any,
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: config.nodeEnv === "production" ? "none" : "lax",
    maxAge: 60 * 60 * 24 * 7 * 1000,
  });

  return token;
};

export default generateToken;

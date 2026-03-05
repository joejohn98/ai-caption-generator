import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import { config } from "../config/config";
import User from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: typeof User | any;
    }
  }
}

interface DecodedToken extends jwt.JwtPayload {
  id: string;
}

const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  // Get token from header or cookie
  const authHeader = req.headers.authorization;

  let token;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    res.status(401).json({
      status: "failed",
      error: "Unauthorized, no token provided",
    });
    return;
  }

  try {
    // verify the token and extract user Id

    const decoded = jwt.verify(token, config.jwtSecret!) as DecodedToken;

    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401).json({
        status: "failed",
        error: "Unauthorized, user not found",
      });
      return;
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("error to protect the route", error);
    res.status(500).json({
      status: "failed",
      error: "Internal server error, failed to protect route",
    });
  }
};

export default protect;

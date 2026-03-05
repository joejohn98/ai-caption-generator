import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes";
import postRoutes from "./routes/post.routes";

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the AI Caption Generator API" });
});

// Auth routes
app.use("/api/auth", authRoutes);

// Post routes
app.use("/api/posts", postRoutes);

export default app;

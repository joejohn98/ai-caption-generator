import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes";

const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the AI Caption Generator API" });
});

// Auth routes
app.use("/api/auth", authRoutes);


export default app;

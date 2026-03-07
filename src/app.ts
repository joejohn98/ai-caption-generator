import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";

import authRoutes from "./routes/auth.routes";
import postRoutes from "./routes/post.routes";
import userRoutes from "./routes/user.routes";
import { swaggerSpec } from "./config/swagger";

const app = express();

// Middleware
app.use(
  cors({
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Swagger UI ──────────────────────────────────────────────────────────────
// Available at: http://localhost:5000/api-docs
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "AI Caption Generator API Docs",
    swaggerOptions: {
      persistAuthorization: true, // keeps the token filled in after page refresh
      displayRequestDuration: true, // shows how long each request took
      filter: true, // adds a search/filter bar at the top
      tryItOutEnabled: true, // auto-opens "Try it out" mode
    },
  }),
);

// Expose raw OpenAPI JSON spec (useful for importing into Postman)
app.get("/api-docs.json", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the AI Caption Generator API" });
});

// Auth routes
app.use("/api/auth", authRoutes);

// Post routes
app.use("/api/posts", postRoutes);

// User routes
app.use("/api/users", userRoutes);

export default app;

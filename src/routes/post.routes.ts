import { Router } from "express";
import multer from "multer";

import { createPost } from "../controllers/post.controller";
import protect from "../middlewares/protect.middleware";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.post("/", protect, upload.single("image"), createPost);

export default router;

import { Router } from "express";
import multer from "multer";

import {
  createPost,
  deletePost,
  updatePost,
} from "../controllers/post.controller";
import protect from "../middlewares/protect.middleware";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.post("/", protect, upload.single("image"), createPost);

router.put("/:postId", protect, upload.single("image"), updatePost);

router.delete("/:postId", protect, deletePost);

export default router;

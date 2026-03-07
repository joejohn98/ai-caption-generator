import { Router } from "express";
import multer from "multer";

import {
  createPost,
  deletePost,
  getPosts,
  updatePost,
} from "../controllers/post.controller";
import protect from "../middlewares/protect.middleware";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
    }
  },
});

const router = Router();

router.get("/", protect, getPosts);

router.post("/", protect, upload.single("image"), createPost);

router.put("/:postId", protect, upload.single("image"), updatePost);

router.delete("/:postId", protect, deletePost);

export default router;

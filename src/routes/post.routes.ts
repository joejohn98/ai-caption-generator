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

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: AI-powered post management — all routes require authentication
 */

/**
 * @swagger
 * /api/posts/:
 *   get:
 *     summary: Get all my posts
 *     description: >
 *       Returns all posts belonging to the authenticated user.
 *       Each post includes the image URL, AI-generated caption, and populated user info.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Posts fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: "Posts fetched successfully"
 *                 results:
 *                   type: integer
 *                   example: 2
 *                   description: Total number of posts returned
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *             example:
 *               status: success
 *               message: "Posts fetched successfully"
 *               results: 2
 *               posts:
 *                 - _id: "64f1a2b3c4d5e6f7a8b9c0d2"
 *                   image: "https://ik.imagekit.io/your_id/posts/uuid1.jpg"
 *                   caption: "Golden hour magic ✨ #sunset #nature #vibes"
 *                   user:
 *                     _id: "64f1a2b3c4d5e6f7a8b9c0d1"
 *                     username: "johndoe"
 *                     email: "john@example.com"
 *                   createdAt: "2024-01-15T10:30:00.000Z"
 *                   updatedAt: "2024-01-15T10:30:00.000Z"
 *                 - _id: "64f1a2b3c4d5e6f7a8b9c0d3"
 *                   image: "https://ik.imagekit.io/your_id/posts/uuid2.png"
 *                   caption: "City lights after dark 🌃 #cityscape #nightlife"
 *                   user:
 *                     _id: "64f1a2b3c4d5e6f7a8b9c0d1"
 *                     username: "johndoe"
 *                     email: "john@example.com"
 *                   createdAt: "2024-01-16T08:00:00.000Z"
 *                   updatedAt: "2024-01-16T08:00:00.000Z"
 *       400:
 *         description: Invalid user ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: failed
 *               error: "Invalid user ID"
 *       401:
 *         description: Unauthorized — token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: failed
 *               error: "Unauthorized, no token provided"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: failed
 *               error: "Internal server error, failed to fetch posts"
 */

router.get("/", protect, getPosts);

/**
 * @swagger
 * /api/posts/:
 *   post:
 *     summary: Upload image and generate AI caption
 *     description: >
 *       Uploads an image to **ImageKit** cloud storage and automatically generates
 *       a caption using **Google Gemini AI**. The AI produces a short, relevant caption
 *       with hashtags and emojis.
 *
 *       **File constraints:**
 *       - Allowed formats: JPEG, PNG, WebP
 *       - Max file size: 5MB
 *       - The image upload and AI caption generation happen in **parallel** for performance.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload (JPEG, PNG, or WebP — max 5MB)
 *     responses:
 *       201:
 *         description: Post created — image uploaded and AI caption generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: "Post created successfully"
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *             example:
 *               status: success
 *               message: "Post created successfully"
 *               post:
 *                 _id: "64f1a2b3c4d5e6f7a8b9c0d2"
 *                 image: "https://ik.imagekit.io/your_id/posts/3f8a1b2c-uuid.jpg"
 *                 caption: "Chasing sunsets and good vibes 🌅 #sunset #travel #wanderlust"
 *                 user: "64f1a2b3c4d5e6f7a8b9c0d1"
 *                 createdAt: "2024-01-15T10:30:00.000Z"
 *                 updatedAt: "2024-01-15T10:30:00.000Z"
 *       400:
 *         description: No image provided or invalid file type/size
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               noImage:
 *                 summary: No image file attached
 *                 value:
 *                   status: failed
 *                   error: "Image is required"
 *               invalidType:
 *                 summary: Wrong file type
 *                 value:
 *                   status: failed
 *                   error: "Only JPEG, PNG, and WebP images are allowed"
 *       401:
 *         description: Unauthorized — token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: failed
 *               error: "Unauthorized, no token provided"
 * 
 *       429:
 *         description: AI caption service rate limit reached
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: failed
 *               error: "AI caption service rate limit reached. Please try again later."
 *       500:
 *         description: Internal server error (image upload or AI caption generation failed)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: failed
 *               error: "Internal server error, failed to create post"
 */

router.post("/", protect, upload.single("image"), createPost);

/**
 * @swagger
 * /api/posts/{postId}:
 *   put:
 *     summary: Update a post — new image or edit caption
 *     description: >
 *       Updates an existing post. Supports two update modes:
 *
 *       **Mode 1 — New image upload** (`multipart/form-data` with `image` field):
 *       Uploads the new image to ImageKit and **regenerates the caption via AI**.
 *
 *       **Mode 2 — Caption edit only** (`multipart/form-data` with `caption` field):
 *       Manually updates the caption text without changing the image.
 *
 *       Only the post's **owner** can update it — returns 403 if another user tries.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the post to update
 *         example: "64f1a2b3c4d5e6f7a8b9c0d2"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: >
 *                   New image file (JPEG, PNG, or WebP — max 5MB).
 *                   If provided, caption is regenerated by AI automatically.
 *               caption:
 *                 type: string
 *                 example: "My custom caption ✨"
 *                 description: >
 *                   Manually edited caption text. Only used when no new image is uploaded.
 *           examples:
 *             newImage:
 *               summary: Upload a new image (AI regenerates caption)
 *               value:
 *                 image: "[binary image file]"
 *             captionOnly:
 *               summary: Edit caption only (no image change)
 *               value:
 *                 caption: "My custom caption ✨"
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: "Post updated successfully"
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *             example:
 *               status: success
 *               message: "Post updated successfully"
 *               post:
 *                 _id: "64f1a2b3c4d5e6f7a8b9c0d2"
 *                 image: "https://ik.imagekit.io/your_id/posts/new-uuid.jpg"
 *                 caption: "New AI caption with hashtags 🔥 #fresh #update"
 *                 user: "64f1a2b3c4d5e6f7a8b9c0d1"
 *                 createdAt: "2024-01-15T10:30:00.000Z"
 *                 updatedAt: "2024-01-16T08:00:00.000Z"
 *       400:
 *         description: Invalid post ID or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalidPostId:
 *                 summary: Invalid MongoDB ObjectId
 *                 value:
 *                   status: failed
 *                   error: "Invalid post ID"
 *               noData:
 *                 summary: No update data provided
 *                 value:
 *                   status: failed
 *                   error: "At least one field (image or caption) must be provided"
 *       401:
 *         description: Unauthorized — token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: failed
 *               error: "Unauthorized, no token provided"
 *       403:
 *         description: Forbidden — you do not own this post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: failed
 *               error: "Forbidden: you do not own this post"
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: failed
 *               error: "Post not found"
 * 
 *       429:
 *         description: AI caption service rate limit reached
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: failed
 *               error: "AI caption service rate limit reached. Please try again later."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: failed
 *               error: "Internal server error, failed to update post"
 */

router.put("/:postId", protect, upload.single("image"), updatePost);

/**
 * @swagger
 * /api/posts/{postId}:
 *   delete:
 *     summary: Delete a post
 *     description: >
 *       Permanently deletes a post by its ID.
 *       Only the post's **owner** can delete it — returns 403 if another user tries.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the post to delete
 *         example: "64f1a2b3c4d5e6f7a8b9c0d2"
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: "Post deleted successfully"
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *             example:
 *               status: success
 *               message: "Post deleted successfully"
 *               post:
 *                 _id: "64f1a2b3c4d5e6f7a8b9c0d2"
 *                 image: "https://ik.imagekit.io/your_id/posts/uuid.jpg"
 *                 caption: "Golden hour magic ✨ #sunset"
 *                 user: "64f1a2b3c4d5e6f7a8b9c0d1"
 *                 createdAt: "2024-01-15T10:30:00.000Z"
 *                 updatedAt: "2024-01-15T10:30:00.000Z"
 *       400:
 *         description: Invalid post ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: failed
 *               error: "Invalid post ID"
 *       401:
 *         description: Unauthorized — token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: failed
 *               error: "Unauthorized, no token provided"
 *       403:
 *         description: Forbidden — you do not own this post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: failed
 *               error: "Forbidden: you do not own this post"
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: failed
 *               error: "Post not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: failed
 *               error: "Internal server error, failed to delete post"
 */

router.delete("/:postId", protect, deletePost);

export default router;

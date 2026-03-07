import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/auth.controller";
import protect from "../middlewares/protect.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User registration, login, and logout
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: >
 *       Creates a new user account. On success, returns the user object and a JWT token.
 *       The token is also automatically set as an **httpOnly cookie** for browser clients.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthSuccessResponse'
 *             example:
 *               status: success
 *               data:
 *                 _id: "64f1a2b3c4d5e6f7a8b9c0d1"
 *                 username: "johndoe"
 *                 email: "john@example.com"
 *                 createdAt: "2024-01-15T10:30:00.000Z"
 *                 updatedAt: "2024-01-15T10:30:00.000Z"
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Validation error or email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               validationError:
 *                 summary: Validation failed
 *                 value:
 *                   status: failed
 *                   error: "Username must be at least 5 characters long"
 *               emailExists:
 *                 summary: Email already registered
 *                 value:
 *                   status: failed
 *                   error: "User with this email already exists"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: failed
 *               error: "Internal server error, failed to register user"
 */

router.post("/register", registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     description: >
 *       Authenticates a user and returns a JWT token.
 *       The token is also automatically set as an **httpOnly cookie** for browser clients.
 *       Use this token in the `Authorization: Bearer <token>` header for protected routes.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/AuthSuccessResponse'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "User logged in successfully"
 *             example:
 *               status: success
 *               message: "User logged in successfully"
 *               data:
 *                 _id: "64f1a2b3c4d5e6f7a8b9c0d1"
 *                 username: "johndoe"
 *                 email: "john@example.com"
 *                 createdAt: "2024-01-15T10:30:00.000Z"
 *                 updatedAt: "2024-01-15T10:30:00.000Z"
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Validation error or user not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               validationError:
 *                 summary: Validation failed
 *                 value:
 *                   status: failed
 *                   error: "Invalid email address"
 *               userNotFound:
 *                 summary: Email not registered
 *                 value:
 *                   status: failed
 *                   error: "User with this email does not exist"
 *       401:
 *         description: Wrong password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: failed
 *               error: "Invalid email or password"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: failed
 *               error: "Internal server error, failed to login user"
 */

router.post("/login", loginUser);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout the current user
 *     description: >
 *       Clears the authentication cookie, effectively logging the user out.
 *       **Requires authentication** via Bearer token or cookie.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessageResponse'
 *             example:
 *               status: success
 *               message: "User logged out successfully"
 *       401:
 *         description: Unauthorized — token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               noToken:
 *                 summary: No token provided
 *                 value:
 *                   status: failed
 *                   error: "Unauthorized, no token provided"
 *               invalidToken:
 *                 summary: Invalid or expired token
 *                 value:
 *                   status: failed
 *                   error: "Unauthorized, invalid token"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: failed
 *               error: "Internal server error, failed to logout user"
 */

router.post("/logout", protect, logoutUser);

export default router;

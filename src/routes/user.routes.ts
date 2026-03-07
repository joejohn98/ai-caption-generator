import { Router } from "express";
import { getMe, updateMe, deleteMe } from "../controllers/user.controller";
import protect from "../middlewares/protect.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile management — all routes require authentication
 */

/**
 * @swagger
 * /api/users/:
 *   get:
 *     summary: Get my profile
 *     description: >
 *       Returns the authenticated user's profile data.
 *       Password is never included in the response.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully
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
 *                   example: "User data fetched successfully"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *             example:
 *               status: success
 *               message: "User data fetched successfully"
 *               user:
 *                 _id: "64f1a2b3c4d5e6f7a8b9c0d1"
 *                 username: "johndoe"
 *                 email: "john@example.com"
 *                 createdAt: "2024-01-15T10:30:00.000Z"
 *                 updatedAt: "2024-01-15T10:30:00.000Z"
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
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: failed
 *               error: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: failed
 *               error: "Internal server error, failed to fetch user"
 */

router.get("/", protect, getMe);

/**
 * @swagger
 * /api/users/:
 *   put:
 *     summary: Update my profile
 *     description: >
 *       Updates the authenticated user's profile. All fields are **optional** —
 *       send only the fields you want to update. At least one field must be provided.
 *       If a new password is provided, it will be hashed before saving.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *           examples:
 *             updateUsername:
 *               summary: Update username only
 *               value:
 *                 username: "newusername"
 *             updateEmail:
 *               summary: Update email only
 *               value:
 *                 email: "newemail@example.com"
 *             updatePassword:
 *               summary: Update password only
 *               value:
 *                 password: "newpassword123"
 *             updateAll:
 *               summary: Update all fields
 *               value:
 *                 username: "newusername"
 *                 email: "newemail@example.com"
 *                 password: "newpassword123"
 *     responses:
 *       200:
 *         description: User profile updated successfully
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
 *                   example: "User updated successfully"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *             example:
 *               status: success
 *               message: "User updated successfully"
 *               user:
 *                 _id: "64f1a2b3c4d5e6f7a8b9c0d1"
 *                 username: "newusername"
 *                 email: "newemail@example.com"
 *                 createdAt: "2024-01-15T10:30:00.000Z"
 *                 updatedAt: "2024-01-16T08:00:00.000Z"
 *       400:
 *         description: Validation error or email already in use
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               noFields:
 *                 summary: No fields provided
 *                 value:
 *                   status: failed
 *                   error: "At least one field (username, email, or password) must be provided"
 *               emailInUse:
 *                 summary: Email taken by another user
 *                 value:
 *                   status: failed
 *                   error: "Email already in use"
 *               shortUsername:
 *                 summary: Username too short
 *                 value:
 *                   status: failed
 *                   error: "Username must be at least 5 characters long"
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
 *               error: "Internal server error, failed to update user"
 */

router.put("/", protect, updateMe);

/**
 * @swagger
 * /api/users/:
 *   delete:
 *     summary: Delete my account
 *     description: >
 *       **Permanently deletes** the authenticated user's account and **all their posts**.
 *       Also clears the authentication cookie. This action is irreversible.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Account and all associated posts deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessageResponse'
 *             example:
 *               status: success
 *               message: "User and associated posts deleted successfully"
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
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: failed
 *               error: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: failed
 *               error: "Internal server error, failed to delete user"
 */

router.delete("/", protect, deleteMe);

export default router;

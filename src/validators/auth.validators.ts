import { z } from "zod";

/**
 * Validation Schema for User Registration
 * Validates name, email and password strength
 *
 */

const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(5, "Username must be at least 5 characters long"),
  email: z
    .email("Invalid email address")
    .min(5, "Email must be at least 5 characters long")
    .toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password must be at most 20 characters long"),
});

/**
 * Validation Schema for User Login
 * Validates email format and ensures password is not empty
 *
 */

const loginSchema = z.object({
  email: z
    .email("Invalid email address")
    .min(5, "Email must be at least 5 characters long")
    .toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password must be at most 20 characters long"),
});

export { registerSchema, loginSchema };

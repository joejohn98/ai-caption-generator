import z from "zod";

const updateUserSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(5, "Username must be at least 5 characters long")
      .max(20, "Username must be at most 20 characters long")
      .optional(),
    email: z.email("Invalid email address").toLowerCase().optional(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(20, "Password must be at most 20 characters long")
      .optional(),
  })
  .refine(
    (data) =>
      data.username !== undefined ||
      data.email !== undefined ||
      data.password !== undefined,
    {
      message:
        "At least one field (username, email, or password) must be provided",
    },
  );

export { updateUserSchema };

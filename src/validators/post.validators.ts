import z from "zod";

const createPostSchema = z.object({
  image: z.url("Image URL is invalid"),
  caption: z.string().min(1, "Caption is required"),
  user: z.string().min(1, "User is required"),
});

const updatePostSchema = z
  .object({
    image: z.url("Image URL is invalid").optional(),
    caption: z.string().min(1, "Caption is required").optional(),
  })
  .refine((data) => data.image !== undefined || data.caption !== undefined, {
    message: "At least one field (image or caption) must be provided",
  });

export { createPostSchema, updatePostSchema };

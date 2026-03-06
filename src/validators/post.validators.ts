import z from "zod";

const createPostSchema = z.object({
  image: z.url("Image URL is invalid"),
  caption: z.string().min(1, "Caption is required"),
  user: z.string().min(1, "User is required"),
});

export { createPostSchema };

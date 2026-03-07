import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AI Caption Generator API",
      version: "1.0.0",
      description: `
A RESTful API built with **Express 5** and **TypeScript** that automatically generates captions 
for uploaded images using **Google Gemini AI**. Users upload an image, the AI generates a relevant 
caption with hashtags and emojis, and the image is stored on **ImageKit** cloud storage.

## Authentication
This API supports two authentication methods:
- **Bearer Token** — Send token in the \`Authorization: Bearer <token>\` header
- **HTTP Cookie** — Token is automatically set as an \`httpOnly\` cookie on login/register

## File Upload Rules
- **Max file size:** 5MB
- **Allowed formats:** JPEG, PNG, WebP only
- **Storage:** ImageKit cloud (UUID-based filenames)
      `,
      contact: {
        name: "AI Caption Generator",
        url: "https://github.com/joejohn98/ai-caption-generator",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
      {
        url: "https://your-deployed-url.railway.app", // 🔁 Replace with your deployed URL
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token obtained from /api/auth/login or /api/auth/register",
        },
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
          description: "JWT token automatically set as httpOnly cookie on login/register",
        },
      },
      schemas: {
        // ── User ──────────────────────────────────────────────
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "64f1a2b3c4d5e6f7a8b9c0d1",
              description: "MongoDB ObjectId",
            },
            username: {
              type: "string",
              example: "johndoe",
              minLength: 5,
              maxLength: 20,
            },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-15T10:30:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-15T10:30:00.000Z",
            },
          },
        },

        // ── Post ──────────────────────────────────────────────
        Post: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "64f1a2b3c4d5e6f7a8b9c0d2",
              description: "MongoDB ObjectId",
            },
            image: {
              type: "string",
              format: "uri",
              example: "https://ik.imagekit.io/your_id/posts/uuid.jpg",
              description: "ImageKit hosted image URL",
            },
            caption: {
              type: "string",
              example: "Golden hour magic ✨ #sunset #nature #photography",
              description: "AI-generated or manually edited caption",
            },
            user: {
              oneOf: [
                {
                  type: "string",
                  example: "64f1a2b3c4d5e6f7a8b9c0d1",
                  description: "User ObjectId (when not populated)",
                },
                {
                  $ref: "#/components/schemas/User",
                },
              ],
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-15T10:30:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-16T08:00:00.000Z",
            },
          },
        },

        // ── Request Bodies ────────────────────────────────────
        RegisterRequest: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            username: {
              type: "string",
              example: "johndoe",
              minLength: 5,
              maxLength: 20,
              description: "Must be 5–20 characters",
            },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "secret123",
              minLength: 6,
              maxLength: 20,
              description: "Must be 6–20 characters",
            },
          },
        },

        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "secret123",
            },
          },
        },

        UpdateUserRequest: {
          type: "object",
          description: "All fields are optional — provide only what you want to update",
          properties: {
            username: {
              type: "string",
              example: "newusername",
              minLength: 5,
              maxLength: 20,
            },
            email: {
              type: "string",
              format: "email",
              example: "newemail@example.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "newpassword123",
              minLength: 6,
              maxLength: 20,
            },
          },
        },

        // ── Responses ─────────────────────────────────────────
        AuthSuccessResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "success" },
            data: { $ref: "#/components/schemas/User" },
            token: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              description: "JWT token — also set as httpOnly cookie automatically",
            },
          },
        },

        ErrorResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "failed" },
            error: { type: "string", example: "Error message description" },
          },
        },

        SuccessMessageResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "success" },
            message: { type: "string", example: "Operation completed successfully" },
          },
        },
      },
    },
  },
  // Points to all route files where @swagger JSDoc comments live
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);

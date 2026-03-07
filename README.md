# AI Caption Generator API

A RESTful API built with **Express 5** and **TypeScript** that automatically generates captions for uploaded images using **Google Gemini AI**. Users upload an image, the AI generates a relevant caption with hashtags and emojis, and the image is stored on **ImageKit** cloud storage.

## Features

- **AI-powered caption generation** — Uses Google Gemini to generate short, relevant captions with hashtags and emojis
- **Cloud image storage** — Images uploaded to ImageKit with UUID-based filenames
- **JWT authentication** — Dual support for Bearer token and httpOnly cookie
- **User management** — Register, login, logout, profile updates, and account deletion (cascades to posts)
- **Post CRUD** — Create, read, update, and delete posts with ownership protection
- **Swagger API docs** — Interactive OpenAPI documentation at `/api-docs`
- **Input validation** — All inputs validated with Zod schemas
- **File validation** — Only JPEG, PNG, and WebP images allowed, 5MB max size
- **Rate limit handling** — Graceful 429 responses when Gemini AI quota is exceeded
- **Security** — Password hashing with bcrypt, protected routes, ownership checks, password never exposed in responses

## Tech Stack

| Layer              | Technology                        |
| ------------------ | --------------------------------- |
| **Runtime**        | Node.js                           |
| **Framework**      | Express 5                         |
| **Language**       | TypeScript                        |
| **Database**       | MongoDB (Mongoose ODM)            |
| **AI**             | Google Gemini (`@google/genai`)   |
| **Image Storage**  | ImageKit (`@imagekit/nodejs`)     |
| **Authentication** | JWT (`jsonwebtoken`) + `bcryptjs` |
| **Validation**     | Zod                               |
| **File Upload**    | Multer (memory storage)           |
| **API Docs**       | Swagger UI + swagger-jsdoc        |
| **Linting**        | ESLint + TypeScript ESLint        |

## Project Structure

```
src/
├── config/
│   ├── config.ts          # Environment variables & app configuration
│   ├── db.ts              # MongoDB connection setup
│   └── swagger.ts         # OpenAPI/Swagger specification & schemas
├── controllers/
│   ├── auth.controller.ts # Register, login, logout handlers
│   ├── post.controller.ts # CRUD operations for posts + AI caption
│   └── user.controller.ts # User profile management (getMe, updateMe, deleteMe)
├── middlewares/
│   └── protect.middleware.ts # JWT authentication middleware
├── models/
│   ├── post.model.ts      # Post schema (image, caption, user)
│   └── user.model.ts      # User schema (username, email, password)
├── routes/
│   ├── auth.routes.ts     # /api/auth routes (with Swagger docs)
│   ├── post.routes.ts     # /api/posts routes (with Swagger docs)
│   └── user.routes.ts     # /api/users routes (with Swagger docs)
├── services/
│   ├── ai.service.ts      # Google Gemini AI caption generation
│   └── storage.service.ts # ImageKit file upload
├── utils/
│   └── generateToken.ts   # JWT token generation + cookie setting
├── validators/
│   ├── auth.validators.ts # Register & login Zod schemas
│   ├── post.validators.ts # Create & update post Zod schemas
│   └── user.validators.ts # Update user Zod schema
├── app.ts                 # Express app setup, middleware & Swagger UI
└── index.ts               # Server entry point
```

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas) for deployment)
- **Google Gemini API Key** — [Get one here](https://ai.google.dev/)
- **ImageKit Account** — [Sign up here](https://imagekit.io/)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/joejohn98/ai-caption-generator.git
   cd ai-caption-generator
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables** — Create a `.env` file in the project root:

   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL=mongodb://localhost:27017/caption
   JWT_SECRET=your_jwt_secret_here
   JWT_EXPIRATION=7d
   GEMINI_API_KEY=your_gemini_api_key_here
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key_here
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The server will start at `http://localhost:5000`.

## API Documentation (Swagger)

Interactive API documentation is available via Swagger UI:

| URL                                   | Description                                 |
| ------------------------------------- | ------------------------------------------- |
| `http://localhost:5000/api-docs`      | Swagger UI — interactive API explorer       |
| `http://localhost:5000/api-docs.json` | Raw OpenAPI JSON spec (import into Postman) |

The Swagger UI includes:

- ✅ Try-it-out mode enabled by default
- ✅ Request duration display
- ✅ Persistent authorization (token stays after page refresh)
- ✅ Search/filter bar for endpoints
- ✅ Multiple request examples per endpoint

## API Endpoints

### Auth Routes (`/api/auth`)

| Method | Endpoint             | Auth | Description                 |
| ------ | -------------------- | ---- | --------------------------- |
| `POST` | `/api/auth/register` | ❌   | Register a new user         |
| `POST` | `/api/auth/login`    | ❌   | Login with email & password |
| `POST` | `/api/auth/logout`   | ✅   | Logout (clears cookie)      |

### User Routes (`/api/users`)

| Method   | Endpoint      | Auth | Description                                   |
| -------- | ------------- | ---- | --------------------------------------------- |
| `GET`    | `/api/users/` | ✅   | Get my profile                                |
| `PUT`    | `/api/users/` | ✅   | Update my profile (partial updates supported) |
| `DELETE` | `/api/users/` | ✅   | Delete my account & all associated posts      |

### Post Routes (`/api/posts`)

| Method   | Endpoint             | Auth | Description                             |
| -------- | -------------------- | ---- | --------------------------------------- |
| `GET`    | `/api/posts/`        | ✅   | Get all my posts                        |
| `POST`   | `/api/posts/`        | ✅   | Upload image & generate AI caption      |
| `PUT`    | `/api/posts/:postId` | ✅   | Update post (new image or edit caption) |
| `DELETE` | `/api/posts/:postId` | ✅   | Delete post                             |

## API Usage

### Register

```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "secret123"
}
```

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secret123"
}
```

### Create Post (Upload Image + AI Caption)

```bash
POST /api/posts/
Authorization: Bearer <token>
Content-Type: multipart/form-data

image: [select image file]
```

> The AI automatically generates a caption for the uploaded image. No need to provide one.

### Update Post — New Image

```bash
PUT /api/posts/:postId
Authorization: Bearer <token>
Content-Type: multipart/form-data

image: [select new image file]
```

> Uploading a new image will regenerate the caption via AI.

### Update Post — Caption Only

```bash
PUT /api/posts/:postId
Authorization: Bearer <token>
Content-Type: multipart/form-data

caption: "My custom caption ✨"
```

> You can manually edit the caption without re-uploading the image.

### Update User Profile

```bash
PUT /api/users/
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "newusername"
}
```

> All fields are optional — update only what you need (username, email, password).

## Authentication

The API supports two authentication methods:

1. **Bearer Token** — Send the token in the `Authorization` header:

   ```
   Authorization: Bearer <token>
   ```

2. **HTTP Cookie** — The token is automatically set as an `httpOnly` cookie on login/register. Cookies are sent automatically by browsers and Postman.

## File Upload Limits

| Constraint      | Value                     |
| --------------- | ------------------------- |
| Max file size   | 5MB                       |
| Allowed formats | JPEG, PNG, WebP           |
| Storage         | ImageKit (cloud)          |
| Filename format | UUID + original extension |

## Error Handling

The API returns consistent error responses:

```json
{
  "status": "failed",
  "error": "Description of what went wrong"
}
```

| Status Code | Meaning                                 |
| ----------- | --------------------------------------- |
| `400`       | Validation error or bad request         |
| `401`       | Unauthorized — missing or invalid token |
| `403`       | Forbidden — you don't own this resource |
| `404`       | Resource not found                      |
| `429`       | AI rate limit reached — try again later |
| `500`       | Internal server error                   |

## Available Scripts

| Script               | Description                              |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | Start development server with hot reload |
| `npm start`          | Start production server (requires build) |
| `npm run build`      | Compile TypeScript to JavaScript         |
| `npm run type-check` | Run TypeScript type checking             |
| `npm run lint`       | Run ESLint                               |
| `npm run lint:fix`   | Run ESLint with auto-fix                 |

## Environment Variables

| Variable               | Required | Default       | Description                                     |
| ---------------------- | -------- | ------------- | ----------------------------------------------- |
| `PORT`                 | ❌       | `5000`        | Server port                                     |
| `NODE_ENV`             | ❌       | `development` | Environment mode (`development` / `production`) |
| `DATABASE_URL`         | ✅       | —             | MongoDB connection string                       |
| `JWT_SECRET`           | ✅       | —             | Secret key for JWT signing                      |
| `JWT_EXPIRATION`       | ❌       | `7d`          | JWT token expiration                            |
| `GEMINI_API_KEY`       | ✅       | —             | Google Gemini API key                           |
| `IMAGEKIT_PRIVATE_KEY` | ✅       | —             | ImageKit private key                            |

### Deployment Note

For deploying to platforms like **Render** or **Railway**, use a cloud-hosted MongoDB:

```env
# Local
DATABASE_URL=mongodb://localhost:27017/caption

# Production (MongoDB Atlas)
DATABASE_URL=mongodb+srv://user:pass@cluster0.abc123.mongodb.net/caption?retryWrites=true&w=majority
```

## License

ISC

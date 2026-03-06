import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongoURI: process.env.DATABASE_URL as string,
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: process.env.JWT_EXPIRATION || "7d",
  imagekitPrivateKey: process.env.IMAGEKIT_PRIVATE_KEY,
};

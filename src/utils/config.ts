import dotenv from "dotenv";
dotenv.config();

export const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_HOST,
  MONGO_PORT,
  MONGO_DB,
  MONGO_AUTH_SOURCE,
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  NODE_ENV,
  PORT = "8000",
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASS,
  CLIENT_URL,
} = process.env;

export const MONGO_URI = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=${MONGO_AUTH_SOURCE}`;

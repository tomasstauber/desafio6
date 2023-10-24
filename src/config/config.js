import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT;
export const MONGODB_CONNECT = process.env.MONGODB_CONNECT;
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
export const SECRET_SESSIONS = process.env.SECRET_SESSIONS;
export const CLIENT_ID_GITHUB = process.env.CLIENT_ID_GITHUB;
export const CLIENT_SECRET_GITHUB = process.env.CLIENT_SECRET_GITHUB;
export const JWT_KEY = process.env.JWT_KEY;
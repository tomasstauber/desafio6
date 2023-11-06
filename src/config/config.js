import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT
export const MONGODB_CONNECT = process.env.MONGODB_CONNECT
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
export const SECRET_SESSIONS = process.env.SECRET_SESSIONS
export const CLIENT_ID_GITHUB = process.env.CLIENT_ID_GITHUB
export const CLIENT_SECRET_GITHUB = process.env.CLIENT_SECRET_GITHUB
export const JWT_KEY = process.env.JWT_KEY

export const PERSISTENCE = process.env.PERSISTENCE;
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASS = process.env.EMAIL_PASS;
export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
export const TWILIO_SMS_NUMBER = process.env.TWILIO_SMS_NUMBER;
import dotenv from "dotenv";

dotenv.config();

const port = Number(process.env.PORT ?? 5000);
const defaultClientOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000"
];

function parseClientOrigins(value: string | undefined) {
  if (!value) {
    return defaultClientOrigins;
  }

  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number.isFinite(port) ? port : 5000,
  mongoUri: process.env.MONGO_URI ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "dev-secret-change-me",
  clientOrigins: parseClientOrigins(process.env.CLIENT_ORIGIN)
};

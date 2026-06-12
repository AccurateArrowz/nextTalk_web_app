import dotenv from "dotenv";

dotenv.config();

const port = Number(process.env.PORT); // port 5000 is reserved by macOS AirPlay Receiver

function parseClientOrigins(value: string | undefined) {
  if (!value) {
    throw new Error("CLIENT_ORIGIN environment variable is required");
  }

  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number.isFinite(port) ? port : 8000,
  mongoUri: process.env.MONGO_URI ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "dev-secret-change-me",
  clientOrigins: parseClientOrigins(process.env.CLIENT_ORIGIN)
};

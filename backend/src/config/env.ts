import dotenv from "dotenv";

dotenv.config();

const port = Number(process.env.PORT ?? 5000);

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number.isFinite(port) ? port : 5000
};

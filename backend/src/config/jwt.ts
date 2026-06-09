import { env } from "@config/env.js";

export const jwtConfig = {
  secret: env.jwtSecret,
  expiresIn: "7d"
} as const;

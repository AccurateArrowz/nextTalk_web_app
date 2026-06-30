import { env } from "@config/env.js";

export const jwtConfig = {
  secret: env.jwtSecret,
  accessTokenExpiresIn: "15m",
  refreshTokenExpiresIn: "30d"
} as const;

import { env } from "@config/env.js";

export const jwtConfig = {
  accessSecret: env.jwtSecret,
  refreshSecret: env.jwtRefreshSecret,
  accessTokenExpiresIn: "15m",
  refreshTokenExpiresIn: "30d"
} as const;

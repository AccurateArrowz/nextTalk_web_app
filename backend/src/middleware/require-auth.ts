import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "@config/jwt.js";
import { accessTokenCookieName } from "@config/cookies.js";

type AuthPayload = {
  sub?: string;
  email?: string;
};

export type AuthenticatedRequest = Request & {
  authUserId?: string;
  file?: Express.Multer.File;
};

function readCookieValue(cookieHeader: string | undefined, name: string) {
  if (!cookieHeader) {
    return undefined;
  }

  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : undefined;
}

export function requireAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const bearerToken = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice("Bearer ".length)
    : undefined;
  const cookieToken = readCookieValue(req.headers.cookie, accessTokenCookieName);
  const token = bearerToken ?? cookieToken;

  if (!token) {
    const error = new Error("Authentication required");
    (error as Error & { statusCode?: number }).statusCode = 401;
    next(error);
    return;
  }

  try {
    const payload = jwt.verify(token, jwtConfig.secret) as AuthPayload;

    if (!payload.sub) {
      throw new Error("Invalid token");
    }

    req.authUserId = payload.sub;
    next();
  } catch {
    const error = new Error("Invalid or expired token");
    (error as Error & { statusCode?: number }).statusCode = 401;
    next(error);
  }
}

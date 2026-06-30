import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "@config/jwt.js";
import { userRepository } from "@features/users/user.repository.js";

type AuthPayload = {
  sub?: string;
  email?: string;
  kind?: "access" | "refresh";
};

export type AuthenticatedRequest = Request & {
  authUserId?: string;
  authUserRole?: "user" | "admin";
  file?: Express.Multer.File;
};

export async function requireAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const token = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice("Bearer ".length)
    : undefined;

  if (!token) {
    const error = new Error("Authentication required");
    (error as Error & { statusCode?: number }).statusCode = 401;
    next(error);
    return;
  }

  try {
    const payload = jwt.verify(token, jwtConfig.secret) as AuthPayload;

    if (payload.kind !== "access" || !payload.sub) {
      throw new Error("Invalid token");
    }

    const user = await userRepository.findById(payload.sub);

    if (!user) {
      throw new Error("Invalid token");
    }

    req.authUserId = payload.sub;
    req.authUserRole = user.role ?? "user";
    next();
  } catch {
    const error = new Error("Invalid or expired token");
    (error as Error & { statusCode?: number }).statusCode = 401;
    next(error);
  }
}

export function requireAdmin(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  if (req.authUserRole !== "admin") {
    const error = new Error("Admin access required");
    (error as Error & { statusCode?: number }).statusCode = 403;
    next(error);
    return;
  }

  next();
}

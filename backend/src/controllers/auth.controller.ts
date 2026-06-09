import type { Request, Response, NextFunction } from "express";
import { authService } from "@services/auth.service.js";
import { authCookieName } from "@config/cookies.js";

function setAuthCookie(res: Response, token: string) {
  res.cookie(authCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.register(req.body);
    setAuthCookie(res, result.token);
    res.status(201).json({
      message: result.message,
      user: result.user
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.login(req.body);
    setAuthCookie(res, result.token);
    res.status(200).json({
      message: result.message,
      user: result.user
    });
  } catch (error) {
    next(error);
  }
}

import type { Request, Response, NextFunction } from "express";
import { authService } from "@services/auth.service.js";
import { accessTokenCookieName } from "@config/cookies.js";

function setAccessTokenCookie(res: Response, token: string) {
  res.cookie(accessTokenCookieName, token, {
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
    setAccessTokenCookie(res, result.accessToken);
    res.status(201).json({
      message: result.message,
      user: result.user,
      accessToken: result.accessToken
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.login(req.body);
    setAccessTokenCookie(res, result.accessToken);
    res.status(200).json({
      message: result.message,
      user: result.user,
      accessToken: result.accessToken
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    res.clearCookie(accessTokenCookieName, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/"
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
}

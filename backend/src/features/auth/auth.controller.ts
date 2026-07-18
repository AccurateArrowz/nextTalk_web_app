import type { Request, Response, NextFunction } from "express";
import { refreshTokenCookieName } from "@config/cookies.js";
import { authService } from "@features/auth/auth.service.js";
import type { LoginUserInput, RegisterUserInput } from "@nexttalk/shared";

function setRefreshTokenCookie(res: Response, token: string) {
  res.cookie(refreshTokenCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000
  });
}

function clearRefreshTokenCookie(res: Response) {
  res.clearCookie(refreshTokenCookieName, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });
}

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

export async function register(
  req: Request<{}, unknown, RegisterUserInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await authService.register(req.body);
    setRefreshTokenCookie(res, authService.generateRefreshToken(result.user.id, result.user.email));
    res.status(201).json({
      message: result.message,
      user: result.user,
      accessToken: result.accessToken
    });
  } catch (error) {
    next(error);
  }
}

export async function login(
  req: Request<{}, unknown, LoginUserInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await authService.login(req.body);
    setRefreshTokenCookie(res, authService.generateRefreshToken(result.user.id, result.user.email));
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
    clearRefreshTokenCookie(res);
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const refreshToken = readCookieValue(req.headers.cookie, refreshTokenCookieName);

    if (!refreshToken) {
      const error = new Error("Refresh token is required");
      (error as Error & { statusCode?: number }).statusCode = 401;
      throw error;
    }

    const result = await authService.refreshFromToken(refreshToken);
    setRefreshTokenCookie(res, authService.generateRefreshToken(result.user.id, result.user.email));
    res.status(200).json({
      message: result.message,
      user: result.user,
      accessToken: result.accessToken
    });
  } catch (error) {
    clearRefreshTokenCookie(res);
    next(error);
  }
}

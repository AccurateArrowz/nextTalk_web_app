import type { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const statusCode =
    typeof err === "object" && err !== null && "statusCode" in err
      ? Number((err as { statusCode?: number }).statusCode) || 500
      : 500;

  const message =
    err instanceof Error ? err.message : "Internal server error";

  res.status(statusCode).json({
    message
  });
}

import type { Response } from "express";
import type { Pagination } from "@nexttalk/shared";

export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200
) {
  return res.status(statusCode).json({
    success: true,
    data,
    ...(message ? { message } : {}),
  });
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  pagination: Pagination,
  statusCode = 200
) {
  return res.status(statusCode).json({
    success: true,
    data,
    pagination,
  });
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 400
) {
  return res.status(statusCode).json({
    success: false,
    message,
  });
}

export function sendValidationError(
  res: Response,
  errors: Array<{ field?: string; message: string }>,
  message = "Validation failed",
  statusCode = 400
) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
}

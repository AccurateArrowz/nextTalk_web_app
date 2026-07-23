import type { Response } from "express";
import type {
  Pagination,
  ApiSuccessResponse,
  ApiPaginatedResponse,
  ApiErrorResponse,
  ApiValidationErrorResponse,
  ValidationErrorDetail,
} from "@nexttalk/shared";

export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200
): Response<ApiSuccessResponse<T>> {
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
): Response<ApiPaginatedResponse<T>> {
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
): Response<ApiErrorResponse> {
  return res.status(statusCode).json({
    success: false,
    message,
  });
}

export function sendValidationError(
  res: Response,
  errors: Array<ValidationErrorDetail>,
  message = "Validation failed",
  statusCode = 400
): Response<ApiValidationErrorResponse> {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
}
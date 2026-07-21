import { z } from "zod";

// Pagination metadata schema
export const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export type Pagination = z.infer<typeof paginationSchema>;

// General success response
export const apiSuccessResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    message: z.string().optional(),
  });

// Paginated success response
export const apiPaginatedResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: z.array(dataSchema),
    pagination: paginationSchema,
  });

// Validation error detail schema
export const validationErrorDetailSchema = z.object({
  field: z.string().optional(),
  message: z.string(),
});

// Validation error response
export const apiValidationErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  errors: z.array(validationErrorDetailSchema),
});

// Standard error response
export const apiErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
});

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ApiPaginatedResponse<T> = {
  success: true;
  data: T[];
  pagination: Pagination;
};

export type ValidationErrorDetail = z.infer<typeof validationErrorDetailSchema>;

export type ApiValidationErrorResponse = z.infer<typeof apiValidationErrorResponseSchema>;

export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;

export type ApiResponse<T> =
  | ApiSuccessResponse<T>
  | ApiPaginatedResponse<T>
  | ApiValidationErrorResponse
  | ApiErrorResponse;

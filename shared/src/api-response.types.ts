export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiPaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: Pagination;
}

export interface ValidationErrorDetail {
  field?: string;
  message: string;
}

export interface ApiValidationErrorResponse {
  success: false;
  message: string;
  errors: ValidationErrorDetail[];
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}

export type ApiResponse<T> =
  | ApiSuccessResponse<T>
  | ApiPaginatedResponse<T>
  | ApiValidationErrorResponse
  | ApiErrorResponse;
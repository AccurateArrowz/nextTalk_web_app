import type { HttpError } from "@utils/http-error.js";

export class AppError extends Error implements HttpError {
  constructor(
    public message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = "AppError";
  }
}

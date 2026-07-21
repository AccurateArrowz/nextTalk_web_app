import type { RequestHandler } from "express";
import type { ZodTypeAny } from "zod";
import { sendValidationError } from "@utils/response.js";

export function validateBody(schema: ZodTypeAny): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      sendValidationError(
        res,
        result.error.errors.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }))
      );
      return;
    }

    req.body = result.data;
    next();
  };
}

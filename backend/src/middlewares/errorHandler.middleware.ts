import { ErrorRequestHandler, Response } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { AppError } from "../utils/appError";
import { z, ZodError } from "zod";
import { ErrorCodeEnum } from "../enums/error-code.enum";

const formatZodError = (res: Response, error: z.ZodError) => {
  const errors = error?.issues?.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));
  return res.status(HTTPSTATUS.BAD_REQUEST).json({
    message: "Validation failed",
    errors: errors,
    errorCode: ErrorCodeEnum.VALIDATION_ERROR,
  });
};

export const errorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next
): any => {
  const errorName = error instanceof Error ? error.name : "";
  const isDatabaseUnavailable = [
    "MongoServerSelectionError",
    "MongoNetworkError",
    "MongoNetworkTimeoutError",
  ].includes(errorName);

  if (isDatabaseUnavailable) {
    console.error(`Database unavailable during ${req.method} ${req.path}`);
    return res.status(HTTPSTATUS.SERVICE_UNAVAILABLE).json({
      message: "Database is temporarily unavailable. Please try again shortly.",
      errorCode: ErrorCodeEnum.DATABASE_UNAVAILABLE,
    });
  }

  if (error?.type === "entity.too.large") {
    return res.status(HTTPSTATUS.PAYLOAD_TOO_LARGE).json({
      message: "Upload is too large. Choose a profile picture smaller than 1 MB.",
      errorCode: ErrorCodeEnum.VALIDATION_ERROR,
    });
  }

  if (errorName === "CorsError") {
    console.warn(`CORS rejected ${req.method} ${req.path}: ${error.message}`);
    return res.status(HTTPSTATUS.FORBIDDEN).json({
      message: "Request origin is not allowed",
    });
  }

  if (error instanceof SyntaxError) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      message: "Invalid JSON format. Please check your request body.",
    });
  }

  if (error instanceof ZodError) {
    return formatZodError(res, error);
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      errorCode: error.errorCode,
    });
  }

  if (error?.code === 11000) {
    return res.status(HTTPSTATUS.CONFLICT).json({
      message: "An account with this email already exists. Please try signing in again.",
      errorCode: ErrorCodeEnum.AUTH_EMAIL_ALREADY_EXISTS,
    });
  }

  console.error(`Unexpected error on ${req.method} ${req.path}`, error);

  return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
    message: "Internal Server Error",
    ...(process.env.NODE_ENV !== "production" && {
      error: error?.message || "Unknown error occurred",
    }),
  });
};

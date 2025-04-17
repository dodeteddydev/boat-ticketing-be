import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ErrorResponse } from "../utilities/errorResponse";
import { ResponseHelpers } from "../utilities/responseHelpers";
import { JsonWebTokenError } from "jsonwebtoken";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    res
      .status(400)
      .json(
        ResponseHelpers.error(
          "Validation Error",
          err.errors.length > 1
            ? err.errors.map((e) => `${e.path}: ${e.message}`)
            : `${err.errors[0].path}: ${err.errors[0].message}`
        )
      );
  } else if (err instanceof ErrorResponse) {
    res.status(err.status).json(ResponseHelpers.error(err.message, err.errors));
  } else if (err instanceof JsonWebTokenError) {
    res
      .status(401)
      .json(
        ResponseHelpers.error(
          "Unauthorized",
          "Invalid or missing authentication token"
        )
      );
  } else {
    res
      .status(500)
      .json(
        ResponseHelpers.error(
          "Internal Server Error",
          "Something went wrong. Please try again later."
        )
      );
  }
};

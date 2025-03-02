import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ErrorResponse } from "../utilities/error-response";
import { ResponseHelpers } from "../utilities/response-helpers";

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
            ? err.errors.map((e) => e.message)
            : err.errors[0].message
        )
      );
  } else if (err instanceof ErrorResponse) {
    res.status(err.status).json(ResponseHelpers.error(err.message, err.errors));
  } else {
    res
      .status(500)
      .json(ResponseHelpers.error("Internal Server Error", err.message));
  }
};

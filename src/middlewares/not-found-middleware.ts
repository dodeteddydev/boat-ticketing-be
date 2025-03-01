import { NextFunction, Request, Response } from "express";
import { ResponseHelpers } from "../utilities/response-helpers";

export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res
    .status(404)
    .json(
      ResponseHelpers.error(
        "Not Found",
        `The requested route [${req.method}] ${req.originalUrl} was not found on this server.`
      )
    );
};

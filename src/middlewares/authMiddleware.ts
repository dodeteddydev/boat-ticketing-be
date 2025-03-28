import { NextFunction, Request, Response } from "express";
import { JwtHelpers } from "../utilities/jwtHelpers";
import { ResponseHelpers } from "../utilities/responseHelpers";

export interface AuthRequest extends Request {
  userId?: number;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res
      .status(401)
      .json(
        ResponseHelpers.error(
          "Unauthorized",
          "Invalid or missing authentication token"
        )
      );
    return;
  }

  try {
    const decode = JwtHelpers.verifyAccessToken(token!);
    req.userId = decode.userId;
    next();
  } catch (error) {
    res
      .status(401)
      .json(
        ResponseHelpers.error(
          "Unauthorized",
          "Invalid or missing authentication token"
        )
      );
  }
};

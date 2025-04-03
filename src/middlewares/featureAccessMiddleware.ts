import { NextFunction, Response, RequestHandler } from "express";
import { AuthRequest } from "./authMiddleware";
import { prisma } from "../config/database";
import { Role } from "@prisma/client";
import { ResponseHelpers } from "../utilities/responseHelpers";

export const featureAccessMiddleware =
  (roles?: Role[]): RequestHandler =>
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: Number(req.userId!) },
      });

      if (!user) {
        res
          .status(401)
          .json(ResponseHelpers.error("Unauthorized", "User not found"));
        return;
      }

      if (user.status === "unverified") {
        res
          .status(403)
          .json(
            ResponseHelpers.error(
              "Forbidden",
              "Your account is not verified. Please verify your account to access this feature."
            )
          );
        return;
      }

      if (roles && !roles.includes(user?.role!)) {
        res
          .status(403)
          .json(
            ResponseHelpers.error(
              "Forbidden",
              "You do not have access to this feature"
            )
          );
        return;
      }

      next();
    } catch (error) {
      res
        .status(500)
        .json(
          ResponseHelpers.error("Server Error", "An unexpected error occurred")
        );
      return;
    }
  };

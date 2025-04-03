import { NextFunction, Request, Response } from "express";
import { ResponseHelpers } from "../../utilities/responseHelpers";
import { FilterUserRequest, UserRequest } from "./user-model";
import { UserService } from "./user-service";
import { AuthRequest } from "../../middlewares/authMiddleware";
import { ActiveRequest } from "../../types/activeRequest";

export class UserController {
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const request = req.body as UserRequest;
      const response = await UserService.create(request, req.userId!);
      res
        .status(201)
        .json(ResponseHelpers.success("User created successfully", response));
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const request = req.body as UserRequest;

      const userId = Number(id);
      if (isNaN(userId)) {
        res
          .status(400)
          .json(
            ResponseHelpers.error(
              "Invalid User ID",
              "ID must be type of number"
            )
          );
        return;
      }

      const response = await UserService.update(request, userId);

      res
        .status(200)
        .json(ResponseHelpers.success("User updated successfully", response));
    } catch (error) {
      next(error);
    }
  }

  static async active(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const request = req.body as ActiveRequest;

      const userId = Number(id);
      if (isNaN(userId)) {
        res
          .status(400)
          .json(
            ResponseHelpers.error(
              "Invalid User ID",
              "ID must be type of number"
            )
          );
        return;
      }

      const response = await UserService.active(request, userId);

      res
        .status(200)
        .json(ResponseHelpers.success("Active updated successfully", response));
    } catch (error) {
      next(error);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const request = {
        search: req.query.search as string,
        page: req.query.page ? Number(req.query.page) : 1,
        size: req.query.size ? Number(req.query.size) : 10,
        all: req.query.all === "true",
      } as FilterUserRequest;

      const response = await UserService.get(request);

      res
        .status(200)
        .json(
          ResponseHelpers.successWithPagination(
            "User get successfully",
            response
          )
        );
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const userId = Number(id);
      if (isNaN(userId)) {
        res
          .status(400)
          .json(
            ResponseHelpers.error(
              "Invalid User ID",
              "ID must be type of number"
            )
          );
        return;
      }

      const response = await UserService.delete(userId);

      res
        .status(200)
        .json(ResponseHelpers.success("User deleted successfully", response));
    } catch (error) {
      next(error);
    }
  }
}

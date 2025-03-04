import { NextFunction, Request, Response } from "express";
import { CreateOrUpdateUserRequest, LoginRequest } from "./user-model";
import { UserService } from "./user-service";
import { ResponseHelpers } from "../../utilities/response-helpers";
import { AuthRequest } from "../../middlewares/auth-middleware";

export class UserController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as CreateOrUpdateUserRequest;
      const response = await UserService.register(request);
      res
        .status(201)
        .json(
          ResponseHelpers.success("User registered successfully", response)
        );
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as LoginRequest;
      const response = await UserService.login(request);
      res
        .status(201)
        .json(ResponseHelpers.success("User Logged in successfully", response));
    } catch (error) {
      next(error);
    }
  }

  static async get(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const response = await UserService.get(req);
      res
        .status(200)
        .json(ResponseHelpers.success("User get successfully", response));
    } catch (error) {
      next(error);
    }
  }
}

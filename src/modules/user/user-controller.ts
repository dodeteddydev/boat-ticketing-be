import { NextFunction, Request, Response } from "express";
import { CreateOrUpdateUserRequest } from "./user-model";
import { UserService } from "./user-service";
import { ResponseHelpers } from "../../utilities/response-helpers";

export class UserController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as CreateOrUpdateUserRequest;
      const response = await UserService.register(request);
      res
        .status(201)
        .json(ResponseHelpers.success("User created successfully", response));
    } catch (error) {
      next(error);
    }
  }
}

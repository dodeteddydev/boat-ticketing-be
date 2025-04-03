import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../middlewares/authMiddleware";
import { ResponseHelpers } from "../../utilities/responseHelpers";
import { LoginRequest, RefreshRequest, RegisterRequest } from "./auth-model";
import { AuthService } from "./auth-service";

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as RegisterRequest;
      const response = await AuthService.register(request);
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
      const response = await AuthService.login(request);
      res
        .status(201)
        .json(ResponseHelpers.success("User Logged in successfully", response));
    } catch (error) {
      next(error);
    }
  }

  static async profile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const response = await AuthService.profile(req);
      res
        .status(200)
        .json(ResponseHelpers.success("Profile get successfully", response));
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as RefreshRequest;
      const response = await AuthService.refresh(request);
      res
        .status(200)
        .json(ResponseHelpers.success("Refresh token success", response));
    } catch (error) {
      next(error);
    }
  }
}

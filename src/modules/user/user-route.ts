import express, { NextFunction, Response } from "express";
import { authMiddleware, AuthRequest } from "../../middlewares/auth-middleware";
import { ResponseHelpers } from "../../utilities/response-helpers";
import { UserController } from "./user-controller";

export const userRoute = express.Router();

userRoute.post("/api/auth/register", UserController.register);
userRoute.post("/api/auth/login", UserController.login);
userRoute.get("/api/user/profile", authMiddleware, UserController.get);

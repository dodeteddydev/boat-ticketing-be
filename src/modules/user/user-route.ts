import express from "express";
import { authMiddleware } from "../../middlewares/auth-middleware";
import { UserController } from "./user-controller";

export const userRoute = express.Router();

userRoute.post("/api/auth/register", UserController.register);
userRoute.post("/api/auth/login", UserController.login);
userRoute.post("/api/auth/refresh", UserController.refresh);
userRoute.get("/api/user/profile", authMiddleware, UserController.get);

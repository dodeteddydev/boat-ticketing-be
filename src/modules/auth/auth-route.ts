import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { AuthController } from "./auth-controller";

export const authRoute = express.Router();

authRoute.post("/api/auth/register", AuthController.register);
authRoute.post("/api/auth/login", AuthController.login);
authRoute.post("/api/auth/refresh", AuthController.refresh);
authRoute.get("/api/auth/profile", authMiddleware, AuthController.profile);

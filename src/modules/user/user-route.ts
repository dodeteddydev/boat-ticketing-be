import express from "express";
import { UserController } from "./user-controller";

export const userRoute = express.Router();

userRoute.post("/api/auth/register", UserController.register);
userRoute.post("/api/auth/login", UserController.login);

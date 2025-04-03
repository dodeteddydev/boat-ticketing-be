import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { UserController } from "./user-controller";
import { featureAccessMiddleware } from "../../middlewares/featureAccessMiddleware";
import { Role } from "@prisma/client";

export const userRoute = express.Router();

userRoute.post(
  "/api/user",
  authMiddleware,
  featureAccessMiddleware([Role.superadmin, Role.boatowner]),
  UserController.create
);
userRoute.put(
  "/api/user/:id",
  authMiddleware,
  featureAccessMiddleware([Role.superadmin, Role.boatowner]),
  UserController.update
);
userRoute.patch(
  "/api/user/:id/active",
  authMiddleware,
  featureAccessMiddleware([Role.superadmin, Role.boatowner]),
  UserController.active
);
userRoute.get(
  "/api/user",
  authMiddleware,
  featureAccessMiddleware([Role.superadmin, Role.boatowner]),
  UserController.get
);
userRoute.delete(
  "/api/user/:id",
  authMiddleware,
  featureAccessMiddleware([Role.superadmin, Role.boatowner]),
  UserController.delete
);

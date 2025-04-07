import express from "express";
import { CategoryController } from "./category-controller";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { featureAccessMiddleware } from "../../middlewares/featureAccessMiddleware";
import { Role } from "@prisma/client";

export const categoryRoute = express.Router();

categoryRoute.post(
  "/api/category",
  authMiddleware,
  featureAccessMiddleware([Role.superadmin]),
  CategoryController.create
);
categoryRoute.put(
  "/api/category/:id",
  authMiddleware,
  featureAccessMiddleware([Role.superadmin]),
  CategoryController.update
);
categoryRoute.patch(
  "/api/category/:id/active",
  authMiddleware,
  featureAccessMiddleware([Role.superadmin]),
  CategoryController.active
);
categoryRoute.get(
  "/api/category",
  authMiddleware,
  featureAccessMiddleware(),
  CategoryController.get
);
categoryRoute.delete(
  "/api/category/:id",
  authMiddleware,
  featureAccessMiddleware([Role.superadmin]),
  CategoryController.delete
);

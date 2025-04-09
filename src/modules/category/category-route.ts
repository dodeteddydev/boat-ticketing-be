import { Role } from "@prisma/client";
import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { featureAccessMiddleware } from "../../middlewares/featureAccessMiddleware";
import { CategoryController } from "./category-controller";

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

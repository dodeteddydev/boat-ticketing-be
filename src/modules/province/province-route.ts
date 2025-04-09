import { Role } from "@prisma/client";
import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { featureAccessMiddleware } from "../../middlewares/featureAccessMiddleware";
import { ProvinceController } from "./province-controller";

export const provinceRoute = express.Router();

provinceRoute.post(
  "/api/province",
  authMiddleware,
  featureAccessMiddleware([Role.superadmin]),
  ProvinceController.create
);
provinceRoute.put(
  "/api/province/:id",
  authMiddleware,
  featureAccessMiddleware([Role.superadmin]),
  ProvinceController.update
);
provinceRoute.patch(
  "/api/province/:id/active",
  authMiddleware,
  featureAccessMiddleware([Role.superadmin]),
  ProvinceController.active
);
provinceRoute.get(
  "/api/province",
  authMiddleware,
  featureAccessMiddleware(),
  ProvinceController.get
);
provinceRoute.delete(
  "/api/province/:id",
  authMiddleware,
  featureAccessMiddleware([Role.superadmin]),
  ProvinceController.delete
);

import { Role } from "@prisma/client";
import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { featureAccessMiddleware } from "../../middlewares/featureAccessMiddleware";
import { CityController } from "./city-controller";

export const cityRoute = express.Router();

cityRoute.post(
  "/api/city",
  authMiddleware,
  featureAccessMiddleware([Role.superadmin]),
  CityController.create
);
cityRoute.put(
  "/api/city/:id",
  authMiddleware,
  featureAccessMiddleware([Role.superadmin]),
  CityController.update
);
cityRoute.patch(
  "/api/city/:id/active",
  authMiddleware,
  featureAccessMiddleware([Role.superadmin]),
  CityController.active
);
cityRoute.get(
  "/api/city",
  authMiddleware,
  featureAccessMiddleware(),
  CityController.get
);
cityRoute.delete(
  "/api/city/:id",
  authMiddleware,
  featureAccessMiddleware([Role.superadmin]),
  CityController.delete
);

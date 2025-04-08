import { Role } from "@prisma/client";
import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { featureAccessMiddleware } from "../../middlewares/featureAccessMiddleware";
import { CountryController } from "./country-controller";

export const countryRoute = express.Router();

countryRoute.post(
  "/api/country",
  authMiddleware,
  featureAccessMiddleware([Role.superadmin]),
  CountryController.create
);
countryRoute.put(
  "/api/country/:id",
  authMiddleware,
  featureAccessMiddleware([Role.superadmin]),
  CountryController.update
);
countryRoute.patch(
  "/api/country/:id/active",
  authMiddleware,
  featureAccessMiddleware([Role.superadmin]),
  CountryController.active
);
countryRoute.get(
  "/api/country",
  authMiddleware,
  featureAccessMiddleware(),
  CountryController.get
);
countryRoute.delete(
  "/api/country/:id",
  authMiddleware,
  featureAccessMiddleware([Role.superadmin]),
  CountryController.delete
);

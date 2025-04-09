import { Role } from "@prisma/client";
import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { featureAccessMiddleware } from "../../middlewares/featureAccessMiddleware";
import { PortController } from "./port-controller";

export const portRoute = express.Router();

portRoute.post(
  "/api/port",
  authMiddleware,
  featureAccessMiddleware([Role.superadmin]),
  PortController.create
);
portRoute.put(
  "/api/port/:id",
  authMiddleware,
  featureAccessMiddleware([Role.superadmin]),
  PortController.update
);
portRoute.patch(
  "/api/port/:id/active",
  authMiddleware,
  featureAccessMiddleware([Role.superadmin]),
  PortController.active
);
portRoute.get(
  "/api/port",
  authMiddleware,
  featureAccessMiddleware(),
  PortController.get
);
portRoute.delete(
  "/api/port/:id",
  authMiddleware,
  featureAccessMiddleware([Role.superadmin]),
  PortController.delete
);

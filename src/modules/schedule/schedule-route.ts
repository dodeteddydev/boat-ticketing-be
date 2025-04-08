import { Role } from "@prisma/client";
import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { featureAccessMiddleware } from "../../middlewares/featureAccessMiddleware";
import { ScheduleController } from "./schedule-controller";

export const scheduleRoute = express.Router();

scheduleRoute.post(
  "/api/schedule",
  authMiddleware,
  featureAccessMiddleware([Role.superadmin, Role.boatowner]),
  ScheduleController.create
);
scheduleRoute.put(
  "/api/schedule/:id",
  authMiddleware,
  featureAccessMiddleware([Role.superadmin, Role.boatowner]),
  ScheduleController.update
);
scheduleRoute.patch(
  "/api/schedule/:id/active",
  authMiddleware,
  featureAccessMiddleware([Role.superadmin, Role.boatowner]),
  ScheduleController.active
);
scheduleRoute.get(
  "/api/schedule",
  authMiddleware,
  featureAccessMiddleware(),
  ScheduleController.get
);
scheduleRoute.delete(
  "/api/schedule/:id",
  authMiddleware,
  featureAccessMiddleware([Role.superadmin, Role.boatowner]),
  ScheduleController.delete
);

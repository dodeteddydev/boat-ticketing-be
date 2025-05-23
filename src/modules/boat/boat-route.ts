import { Role } from "@prisma/client";
import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { featureAccessMiddleware } from "../../middlewares/featureAccessMiddleware";
import { BoatController } from "./boat-controller";
import { upload } from "../../utilities/multer";

export const boatRoute = express.Router();

boatRoute.post(
  "/api/boat",
  authMiddleware,
  featureAccessMiddleware([Role.superadmin, Role.boatowner]),
  upload.single("image"),
  BoatController.create
);
boatRoute.put(
  "/api/boat/:id",
  authMiddleware,
  featureAccessMiddleware([Role.superadmin, Role.boatowner]),
  upload.single("image"),
  BoatController.update
);
boatRoute.patch(
  "/api/boat/:id/active",
  authMiddleware,
  featureAccessMiddleware([Role.superadmin, Role.boatowner]),
  BoatController.active
);
boatRoute.get(
  "/api/boat",
  authMiddleware,
  featureAccessMiddleware(),
  BoatController.get
);
boatRoute.delete(
  "/api/boat/:id",
  authMiddleware,
  featureAccessMiddleware([Role.superadmin, Role.boatowner]),
  BoatController.delete
);

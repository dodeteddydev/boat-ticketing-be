import { Role } from "@prisma/client";
import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { featureAccessMiddleware } from "../../middlewares/featureAccessMiddleware";
import { upload } from "../../utilities/multer";
import { TransactionController } from "./transaction-controller";

export const transactionRoute = express.Router();

transactionRoute.post(
  "/api/transaction/topup",
  authMiddleware,
  featureAccessMiddleware([Role.superadmin, Role.customer]),
  upload.single("proofImage"),
  TransactionController.topup
);
transactionRoute.put(
  "/api/transaction/:id/topup",
  authMiddleware,
  featureAccessMiddleware([Role.superadmin, Role.customer]),
  upload.single("proofImage"),
  TransactionController.updateTopup
);
transactionRoute.patch(
  "/api/transaction/:id/approve",
  authMiddleware,
  featureAccessMiddleware([Role.superadmin]),
  TransactionController.approve
);
transactionRoute.patch(
  "/api/transaction/:id/reject",
  authMiddleware,
  featureAccessMiddleware([Role.superadmin]),
  TransactionController.reject
);
transactionRoute.get(
  "/api/transaction",
  authMiddleware,
  featureAccessMiddleware([Role.superadmin, Role.customer]),
  TransactionController.get
);

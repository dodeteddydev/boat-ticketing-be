import { Role } from "@prisma/client";
import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { featureAccessMiddleware } from "../../middlewares/featureAccessMiddleware";
import { WalletController } from "./wallet-controller";

export const walletRoute = express.Router();

walletRoute.get(
  "/api/wallet/balance",
  authMiddleware,
  featureAccessMiddleware([Role.superadmin, Role.customer]),
  WalletController.balance
);

import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { ProvinceController } from "./province-controller";

export const provinceRoute = express.Router();

provinceRoute.post("/api/province", authMiddleware, ProvinceController.create);
provinceRoute.put(
  "/api/province/:id",
  authMiddleware,
  ProvinceController.update
);
provinceRoute.patch(
  "/api/province/:id/active",
  authMiddleware,
  ProvinceController.active
);
provinceRoute.get("/api/province", authMiddleware, ProvinceController.get);
provinceRoute.delete(
  "/api/province/:id",
  authMiddleware,
  ProvinceController.delete
);

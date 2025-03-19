import express from "express";
import { CountryController } from "./country-controller";
import { authMiddleware } from "../../middlewares/authMiddleware";

export const countryRoute = express.Router();

countryRoute.post("/api/country", authMiddleware, CountryController.create);
countryRoute.put("/api/country/:id", authMiddleware, CountryController.update);
countryRoute.patch(
  "/api/country/:id/active",
  authMiddleware,
  CountryController.active
);
countryRoute.get("/api/country", authMiddleware, CountryController.get);
countryRoute.delete(
  "/api/country/:id",
  authMiddleware,
  CountryController.delete
);

import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { CityController } from "./city-controller";

export const cityRoute = express.Router();

cityRoute.post("/api/city", authMiddleware, CityController.create);
cityRoute.put("/api/city/:id", authMiddleware, CityController.update);
cityRoute.patch("/api/city/:id/active", authMiddleware, CityController.active);
cityRoute.get("/api/city", authMiddleware, CityController.get);
cityRoute.delete("/api/city/:id", authMiddleware, CityController.delete);

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cityRoute = void 0;
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const city_controller_1 = require("./city-controller");
exports.cityRoute = express_1.default.Router();
exports.cityRoute.post("/api/city", authMiddleware_1.authMiddleware, city_controller_1.CityController.create);
exports.cityRoute.put("/api/city/:id", authMiddleware_1.authMiddleware, city_controller_1.CityController.update);
exports.cityRoute.patch("/api/city/:id/active", authMiddleware_1.authMiddleware, city_controller_1.CityController.active);
exports.cityRoute.get("/api/city", authMiddleware_1.authMiddleware, city_controller_1.CityController.get);
exports.cityRoute.delete("/api/city/:id", authMiddleware_1.authMiddleware, city_controller_1.CityController.delete);

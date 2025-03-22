"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.provinceRoute = void 0;
const express_1 = __importDefault(require("express"));
const province_controller_1 = require("./province-controller");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
exports.provinceRoute = express_1.default.Router();
exports.provinceRoute.post("/api/province", authMiddleware_1.authMiddleware, province_controller_1.ProvinceController.create);
exports.provinceRoute.put("/api/province/:id", authMiddleware_1.authMiddleware, province_controller_1.ProvinceController.update);
exports.provinceRoute.patch("/api/province/:id/active", authMiddleware_1.authMiddleware, province_controller_1.ProvinceController.active);
exports.provinceRoute.get("/api/province", authMiddleware_1.authMiddleware, province_controller_1.ProvinceController.get);
exports.provinceRoute.delete("/api/province/:id", authMiddleware_1.authMiddleware, province_controller_1.ProvinceController.delete);

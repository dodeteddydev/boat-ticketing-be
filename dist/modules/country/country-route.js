"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.countryRoute = void 0;
const express_1 = __importDefault(require("express"));
const country_controller_1 = require("./country-controller");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
exports.countryRoute = express_1.default.Router();
exports.countryRoute.post("/api/country", authMiddleware_1.authMiddleware, country_controller_1.CountryController.create);
exports.countryRoute.put("/api/country/:id", authMiddleware_1.authMiddleware, country_controller_1.CountryController.update);
exports.countryRoute.patch("/api/country/:id/active", authMiddleware_1.authMiddleware, country_controller_1.CountryController.active);
exports.countryRoute.get("/api/country", authMiddleware_1.authMiddleware, country_controller_1.CountryController.get);
exports.countryRoute.delete("/api/country/:id", authMiddleware_1.authMiddleware, country_controller_1.CountryController.delete);

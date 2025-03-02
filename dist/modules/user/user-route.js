"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user-controller");
exports.userRoute = express_1.default.Router();
exports.userRoute.post("/api/auth/register", user_controller_1.UserController.register);
exports.userRoute.post("/api/auth/login", user_controller_1.UserController.login);

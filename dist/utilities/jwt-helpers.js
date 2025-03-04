"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtHelpers = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;
const accessExpires = process.env.JWT_ACCESS_EXPIRES;
const refreshExpires = process.env.JWT_REFRESH_EXPIRES;
class JwtHelpers {
    static generateToken(userId) {
        const access = jsonwebtoken_1.default.sign({ userId }, accessSecret, {
            expiresIn: `${Number(accessExpires)}m`,
        });
        const refresh = jsonwebtoken_1.default.sign({ userId }, refreshSecret, {
            expiresIn: `${Number(refreshExpires)}m`,
        });
        return { access, refresh };
    }
    static verifyToken(token) {
        return jsonwebtoken_1.default.verify(token, accessSecret);
    }
}
exports.JwtHelpers = JwtHelpers;

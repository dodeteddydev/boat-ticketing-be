"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_helpers_1 = require("../utilities/jwt-helpers");
const response_helpers_1 = require("../utilities/response-helpers");
const authMiddleware = (req, res, next) => {
    var _a;
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        res.status(401).json(response_helpers_1.ResponseHelpers.error("Unauthorized", ""));
        return;
    }
    try {
        const decode = jwt_helpers_1.JwtHelpers.verifyToken(token);
        req.userId = decode.userId;
        next();
    }
    catch (error) {
        res.status(403).json(response_helpers_1.ResponseHelpers.error("Unauthorized", ""));
    }
};
exports.authMiddleware = authMiddleware;

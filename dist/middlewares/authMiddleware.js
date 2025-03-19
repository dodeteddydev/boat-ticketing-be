"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwtHelpers_1 = require("../utilities/jwtHelpers");
const responseHelpers_1 = require("../utilities/responseHelpers");
const authMiddleware = (req, res, next) => {
    var _a;
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        res
            .status(401)
            .json(responseHelpers_1.ResponseHelpers.error("Unauthorized", "Invalid or missing authentication token"));
        return;
    }
    try {
        const decode = jwtHelpers_1.JwtHelpers.verifyAccessToken(token);
        req.userId = decode.userId;
        next();
    }
    catch (error) {
        res
            .status(401)
            .json(responseHelpers_1.ResponseHelpers.error("Unauthorized", "Invalid or missing authentication token"));
    }
};
exports.authMiddleware = authMiddleware;

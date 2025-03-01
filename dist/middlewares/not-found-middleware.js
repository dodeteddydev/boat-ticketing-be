"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundMiddleware = void 0;
const response_helpers_1 = require("../utilities/response-helpers");
const notFoundMiddleware = (req, res, next) => {
    res
        .status(404)
        .json(response_helpers_1.ResponseHelpers.error("Not Found", `The requested route [${req.method}] ${req.originalUrl} was not found on this server.`));
};
exports.notFoundMiddleware = notFoundMiddleware;

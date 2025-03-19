"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundMiddleware = void 0;
const responseHelpers_1 = require("../utilities/responseHelpers");
const notFoundMiddleware = (req, res, next) => {
    res
        .status(404)
        .json(responseHelpers_1.ResponseHelpers.error("Not Found", `The requested route [${req.method}] ${req.originalUrl} was not found on this server.`));
};
exports.notFoundMiddleware = notFoundMiddleware;

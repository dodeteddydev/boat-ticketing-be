"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const zod_1 = require("zod");
const errorResponse_1 = require("../utilities/errorResponse");
const responseHelpers_1 = require("../utilities/responseHelpers");
const jsonwebtoken_1 = require("jsonwebtoken");
const errorMiddleware = (err, req, res, next) => {
    if (err instanceof zod_1.ZodError) {
        res
            .status(400)
            .json(responseHelpers_1.ResponseHelpers.error("Validation Error", err.errors.length > 1
            ? err.errors.map((e) => `${e.path}: ${e.message}`)
            : `${err.errors[0].path}: ${err.errors[0].message}`));
    }
    else if (err instanceof errorResponse_1.ErrorResponse) {
        res.status(err.status).json(responseHelpers_1.ResponseHelpers.error(err.message, err.errors));
    }
    else if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
        res
            .status(401)
            .json(responseHelpers_1.ResponseHelpers.error("Unauthorized", "Invalid or missing authentication token"));
    }
    else {
        res
            .status(500)
            .json(responseHelpers_1.ResponseHelpers.error("Internal Server Error", err.message));
    }
};
exports.errorMiddleware = errorMiddleware;

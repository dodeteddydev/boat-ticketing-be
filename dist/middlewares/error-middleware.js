"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const zod_1 = require("zod");
const error_response_1 = require("../utilities/error-response");
const response_helpers_1 = require("../utilities/response-helpers");
const errorMiddleware = (err, req, res, next) => {
    if (err instanceof zod_1.ZodError) {
        res.status(400).json(response_helpers_1.ResponseHelpers.error("Validation Error", err.errors.map((e) => e.message)));
    }
    else if (err instanceof error_response_1.ErrorResponse) {
        res.status(err.status).json(response_helpers_1.ResponseHelpers.error(err.message, err.errors));
    }
    else {
        res
            .status(500)
            .json(response_helpers_1.ResponseHelpers.error("Internal Server Error", err.message));
    }
};
exports.errorMiddleware = errorMiddleware;

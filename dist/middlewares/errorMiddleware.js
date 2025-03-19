"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const zod_1 = require("zod");
const errorResponse_1 = require("../utilities/errorResponse");
const responseHelpers_1 = require("../utilities/responseHelpers");
const errorMiddleware = (err, req, res, next) => {
    if (err instanceof zod_1.ZodError) {
        res
            .status(400)
            .json(responseHelpers_1.ResponseHelpers.error("Validation Error", err.errors.length > 1
            ? err.errors.map((e) => e.message)
            : err.errors[0].message));
    }
    else if (err instanceof errorResponse_1.ErrorResponse) {
        res.status(err.status).json(responseHelpers_1.ResponseHelpers.error(err.message, err.errors));
    }
    else {
        res
            .status(500)
            .json(responseHelpers_1.ResponseHelpers.error("Internal Server Error", err.message));
    }
};
exports.errorMiddleware = errorMiddleware;

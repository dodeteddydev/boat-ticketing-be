"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorResponse = void 0;
class ErrorResponse extends Error {
    constructor(status, message, errors) {
        super(message);
        this.status = status;
        this.message = message;
        this.errors = errors;
    }
}
exports.ErrorResponse = ErrorResponse;

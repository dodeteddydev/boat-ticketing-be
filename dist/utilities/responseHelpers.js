"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseHelpers = void 0;
class ResponseHelpers {
    static success(message, data) {
        return {
            message: message,
            data: data,
        };
    }
    static successWithPagination(message, { data, paging }) {
        return {
            message: message,
            data: data,
            paging: paging,
        };
    }
    static error(message, errors) {
        return {
            message: message,
            errors: errors,
        };
    }
}
exports.ResponseHelpers = ResponseHelpers;

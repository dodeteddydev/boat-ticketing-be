"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateFormat = void 0;
const dateFormat = (date) => {
    return date.toISOString().replace("T", " ").replace("Z", "");
};
exports.dateFormat = dateFormat;

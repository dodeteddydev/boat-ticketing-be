"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activeValidation = void 0;
const zod_1 = require("zod");
exports.activeValidation = zod_1.z.object({
    active: zod_1.z.boolean({ required_error: "Active is required" }),
});

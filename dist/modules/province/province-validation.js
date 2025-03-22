"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvinceValidation = void 0;
const zod_1 = require("zod");
class ProvinceValidation {
}
exports.ProvinceValidation = ProvinceValidation;
_a = ProvinceValidation;
ProvinceValidation.create = zod_1.z.object({
    provinceName: zod_1.z
        .string({ required_error: "Province name is required" })
        .min(1, "Province name must be at least 1 character"),
    provinceCode: zod_1.z
        .string({ required_error: "Province code is required" })
        .min(1, "Province code must be at least 1 character"),
    countryId: zod_1.z.number({ required_error: "Country is required" }).min(1),
});
ProvinceValidation.update = _a.create;
ProvinceValidation.get = zod_1.z.object({
    search: zod_1.z.string().min(1).optional(),
    countryId: zod_1.z.number().min(1).optional(),
    page: zod_1.z.number().min(1).positive(),
    size: zod_1.z.number().min(1).max(100).positive(),
});

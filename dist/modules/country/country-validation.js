"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryValidation = void 0;
const zod_1 = require("zod");
class CountryValidation {
}
exports.CountryValidation = CountryValidation;
_a = CountryValidation;
CountryValidation.create = zod_1.z.object({
    countryName: zod_1.z
        .string({ required_error: "Country name is required" })
        .min(1, "Country name must be at least 1 character"),
    countryCode: zod_1.z
        .string({ required_error: "Country code is required" })
        .min(1, "Country code must be at least 1 character"),
});
CountryValidation.update = _a.create;
CountryValidation.get = zod_1.z.object({
    search: zod_1.z.string().min(1).optional(),
    page: zod_1.z.number().min(1).positive(),
    size: zod_1.z.number().min(1).max(100).positive(),
});

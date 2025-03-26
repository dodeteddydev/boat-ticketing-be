"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CityValidation = void 0;
const zod_1 = require("zod");
class CityValidation {
}
exports.CityValidation = CityValidation;
_a = CityValidation;
CityValidation.create = zod_1.z.object({
    cityName: zod_1.z
        .string({ required_error: "City name is required" })
        .min(1, "City name must be at least 1 character"),
    countryId: zod_1.z.number({ required_error: "Country is required" }).min(1),
    provinceId: zod_1.z.number({ required_error: "Province is required" }).min(1),
});
CityValidation.update = _a.create;
CityValidation.get = zod_1.z.object({
    search: zod_1.z.string().min(1).optional(),
    countryId: zod_1.z.number().min(1).optional(),
    provinceId: zod_1.z.number().min(1).optional(),
    page: zod_1.z.number().min(1).positive(),
    size: zod_1.z.number().min(1).max(100).positive(),
});

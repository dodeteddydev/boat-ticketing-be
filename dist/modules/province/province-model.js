"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertProvinceGlobalResponse = exports.convertProvinceResponse = void 0;
const convertProvinceResponse = (province, createdBy, country) => {
    return {
        id: province.id,
        provinceName: province.province_name,
        provinceCode: province.province_code,
        country: country,
        createdBy: createdBy,
        createdAt: province.created_at.toISOString(),
        updatedAt: province.updated_at.toISOString(),
        active: province.active,
    };
};
exports.convertProvinceResponse = convertProvinceResponse;
const convertProvinceGlobalResponse = (province) => {
    return {
        id: province.id,
        provinceName: province.province_name,
        provinceCode: province.province_code,
    };
};
exports.convertProvinceGlobalResponse = convertProvinceGlobalResponse;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertCountryGlobalResponse = exports.convertCountryResponse = void 0;
const convertCountryResponse = (country, createdBy) => {
    return {
        id: country.id,
        countryName: country.country_name,
        countryCode: country.country_code,
        createdBy: createdBy,
        createdAt: country.created_at.toISOString(),
        updatedAt: country.updated_at.toISOString(),
        active: country.active,
    };
};
exports.convertCountryResponse = convertCountryResponse;
const convertCountryGlobalResponse = (country) => {
    return {
        id: country.id,
        countryName: country.country_name,
        countryCode: country.country_code,
    };
};
exports.convertCountryGlobalResponse = convertCountryGlobalResponse;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToCountryResponse = void 0;
const convertToCountryResponse = (country, createdBy) => {
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
exports.convertToCountryResponse = convertToCountryResponse;

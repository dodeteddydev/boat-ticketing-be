"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertCityGlobalResponse = exports.convertCityResponse = void 0;
const convertCityResponse = (city, createdBy, country, province) => {
    return {
        id: city.id,
        cityName: city.city_name,
        country: country,
        province: province,
        createdBy: createdBy,
        createdAt: city.created_at.toISOString(),
        updatedAt: city.updated_at.toISOString(),
        active: city.active,
    };
};
exports.convertCityResponse = convertCityResponse;
const convertCityGlobalResponse = (city) => {
    return {
        id: city.id,
        cityName: city.city_name,
    };
};
exports.convertCityGlobalResponse = convertCityGlobalResponse;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CityService = void 0;
const database_1 = require("../../config/database");
const errorResponse_1 = require("../../utilities/errorResponse");
const validation_1 = require("../../utilities/validation");
const activeValidation_1 = require("../../validation/activeValidation");
const country_model_1 = require("../country/country-model");
const province_model_1 = require("../province/province-model");
const province_service_1 = require("../province/province-service");
const user_model_1 = require("../user/user-model");
const city_model_1 = require("./city-model");
const city_validation_1 = require("./city-validation");
class CityService {
    static checkProvinceExist(provinceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const province = yield database_1.prisma.province.findFirst({
                where: {
                    id: provinceId,
                },
            });
            if (!province)
                throw new errorResponse_1.ErrorResponse(404, "Failed create city", "Province doesn't exist");
        });
    }
    static checkCityExist(cityName) {
        return __awaiter(this, void 0, void 0, function* () {
            const city = yield database_1.prisma.city.findFirst({
                where: {
                    OR: [{ city_name: cityName }],
                },
            });
            const errorMessage = (city === null || city === void 0 ? void 0 : city.city_name) === cityName
                ? "City name is already exist"
                : "City is already exist";
            if (city)
                throw new errorResponse_1.ErrorResponse(400, "Failed create city", errorMessage);
        });
    }
    static create(request, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = (0, validation_1.validation)(city_validation_1.CityValidation.create, request);
            yield province_service_1.ProvinceService.checkCountryExist(createRequest.countryId);
            yield this.checkProvinceExist(createRequest.provinceId);
            yield this.checkCityExist(createRequest.cityName);
            const createdCity = yield database_1.prisma.city.create({
                data: {
                    city_name: createRequest.cityName,
                    country: { connect: { id: Number(createRequest.countryId) } },
                    province: { connect: { id: Number(createRequest.provinceId) } },
                    created_by: { connect: { id: Number(userId) } },
                },
                include: {
                    created_by: true,
                    country: true,
                    province: true,
                },
            });
            return (0, city_model_1.convertCityResponse)(createdCity, (0, user_model_1.convertUserGlobalResponse)(createdCity.created_by), (0, country_model_1.convertCountryGlobalResponse)(createdCity.country), (0, province_model_1.convertProvinceGlobalResponse)(createdCity.province));
        });
    }
    static update(request, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateRequest = (0, validation_1.validation)(city_validation_1.CityValidation.create, request);
            const existingCity = yield database_1.prisma.city.findUnique({
                where: { id },
            });
            if (!existingCity) {
                throw new errorResponse_1.ErrorResponse(404, "City not found", "City with this ID doesn't exist!");
            }
            if (updateRequest.cityName !== existingCity.city_name) {
                yield province_service_1.ProvinceService.checkCountryExist(updateRequest.countryId);
                yield this.checkProvinceExist(updateRequest.provinceId);
                yield this.checkCityExist(updateRequest.cityName);
            }
            const updatedCity = yield database_1.prisma.city.update({
                where: { id },
                data: {
                    city_name: updateRequest.cityName,
                    country: { connect: { id: Number(updateRequest.countryId) } },
                    province: { connect: { id: Number(updateRequest.provinceId) } },
                },
                include: {
                    created_by: true,
                    country: true,
                    province: true,
                },
            });
            return (0, city_model_1.convertCityResponse)(updatedCity, (0, user_model_1.convertUserGlobalResponse)(updatedCity.created_by), (0, country_model_1.convertCountryGlobalResponse)(updatedCity.country), (0, province_model_1.convertProvinceGlobalResponse)(updatedCity.province));
        });
    }
    static active(request, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const activeRequest = (0, validation_1.validation)(activeValidation_1.activeValidation, request);
            const existingCity = yield database_1.prisma.city.findUnique({
                where: { id },
            });
            if (!existingCity) {
                throw new errorResponse_1.ErrorResponse(404, "City not found", "City with this ID doesn't exist!");
            }
            const updatedActive = yield database_1.prisma.city.update({
                where: { id },
                data: {
                    active: activeRequest.active,
                },
                include: {
                    created_by: true,
                },
            });
            return { active: updatedActive.active };
        });
    }
    static get(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const getRequest = (0, validation_1.validation)(city_validation_1.CityValidation.get, request);
            const skip = (getRequest.page - 1) * getRequest.size;
            const filters = [];
            if (getRequest.countryId) {
                filters.push({
                    country_id: Number(getRequest.countryId),
                });
            }
            if (getRequest.provinceId) {
                filters.push({
                    province_id: Number(getRequest.provinceId),
                });
            }
            if (getRequest.search) {
                filters.push({
                    OR: [
                        {
                            city_name: {
                                contains: getRequest.search,
                            },
                        },
                    ],
                });
            }
            const getProvince = yield database_1.prisma.city.findMany({
                where: {
                    AND: filters,
                },
                orderBy: {
                    created_at: "desc",
                },
                take: getRequest.size,
                skip: skip,
                include: {
                    created_by: true,
                    country: true,
                    province: true,
                },
            });
            const total = yield database_1.prisma.city.count({
                where: {
                    AND: filters,
                },
            });
            return {
                data: getProvince.map((value) => (0, city_model_1.convertCityResponse)(value, (0, user_model_1.convertUserGlobalResponse)(value.created_by), (0, country_model_1.convertCountryGlobalResponse)(value.country), (0, province_model_1.convertProvinceGlobalResponse)(value.province))),
                paging: {
                    currentPage: getRequest.page,
                    totalPage: Math.ceil(total / getRequest.size),
                    size: getRequest.size,
                },
            };
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingCity = yield database_1.prisma.city.findUnique({
                where: { id },
            });
            if (!existingCity) {
                throw new errorResponse_1.ErrorResponse(404, "City not found", "City with this ID doesn't exist!");
            }
            yield database_1.prisma.city.delete({
                where: { id },
            });
            return `City with ID ${id} is deleted`;
        });
    }
}
exports.CityService = CityService;

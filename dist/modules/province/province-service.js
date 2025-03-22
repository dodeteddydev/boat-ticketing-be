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
exports.ProvinceService = void 0;
const database_1 = require("../../config/database");
const errorResponse_1 = require("../../utilities/errorResponse");
const validation_1 = require("../../utilities/validation");
const activeValidation_1 = require("../../validation/activeValidation");
const country_model_1 = require("../country/country-model");
const user_model_1 = require("../user/user-model");
const province_model_1 = require("./province-model");
const province_validation_1 = require("./province-validation");
class ProvinceService {
    static checkCountryExist(countryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const country = yield database_1.prisma.country.findFirst({
                where: {
                    id: countryId,
                },
            });
            if (!country)
                throw new errorResponse_1.ErrorResponse(404, "Failed create province", "Country doesn't exist");
        });
    }
    static checkProvinceExist(provinceName, provinceCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const province = yield database_1.prisma.province.findFirst({
                where: {
                    OR: [{ province_name: provinceName }, { province_code: provinceCode }],
                },
            });
            const errorMessage = (province === null || province === void 0 ? void 0 : province.province_name) === provinceName
                ? "Province name is already exist"
                : (province === null || province === void 0 ? void 0 : province.province_code) === provinceCode
                    ? "Province code already exist"
                    : "Province is already exist";
            if (province)
                throw new errorResponse_1.ErrorResponse(400, "Failed create province", errorMessage);
        });
    }
    static create(request, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = (0, validation_1.validation)(province_validation_1.ProvinceValidation.create, request);
            yield this.checkCountryExist(createRequest.countryId);
            yield this.checkProvinceExist(createRequest.provinceName, createRequest.provinceCode);
            const createdProvince = yield database_1.prisma.province.create({
                data: {
                    province_name: createRequest.provinceName,
                    province_code: createRequest.provinceCode,
                    country: { connect: { id: Number(createRequest.countryId) } },
                    created_by: { connect: { id: Number(userId) } },
                },
                include: {
                    created_by: true,
                    country: true,
                },
            });
            return (0, province_model_1.convertProvinceResponse)(createdProvince, (0, user_model_1.convertUserGlobalResponse)(createdProvince.created_by), (0, country_model_1.convertCountryGlobalResponse)(createdProvince.country));
        });
    }
    static update(request, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateRequest = (0, validation_1.validation)(province_validation_1.ProvinceValidation.create, request);
            const existingProvince = yield database_1.prisma.province.findUnique({
                where: { id },
            });
            if (!existingProvince) {
                throw new errorResponse_1.ErrorResponse(404, "Province not found", "Province with this ID doesn't exist!");
            }
            if (updateRequest.provinceName !== existingProvince.province_name &&
                updateRequest.provinceCode !== existingProvince.province_code) {
                yield this.checkCountryExist(updateRequest.countryId);
                yield this.checkProvinceExist(updateRequest.provinceName, updateRequest.provinceCode);
            }
            const updatedProvince = yield database_1.prisma.province.update({
                where: { id },
                data: {
                    province_name: updateRequest.provinceName,
                    province_code: updateRequest.provinceCode,
                },
                include: {
                    created_by: true,
                    country: true,
                },
            });
            return (0, province_model_1.convertProvinceResponse)(updatedProvince, (0, user_model_1.convertUserGlobalResponse)(updatedProvince.created_by), (0, country_model_1.convertCountryGlobalResponse)(updatedProvince.country));
        });
    }
    static active(request, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const activeRequest = (0, validation_1.validation)(activeValidation_1.activeValidation, request);
            const existingProvince = yield database_1.prisma.province.findUnique({
                where: { id },
            });
            if (!existingProvince) {
                throw new errorResponse_1.ErrorResponse(404, "Province not found", "Province with this ID doesn't exist!");
            }
            const updatedActive = yield database_1.prisma.province.update({
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
            const getRequest = (0, validation_1.validation)(province_validation_1.ProvinceValidation.get, request);
            const skip = (getRequest.page - 1) * getRequest.size;
            const filters = [];
            if (getRequest.countryId) {
                filters.push({
                    country_id: Number(getRequest.countryId),
                });
            }
            if (getRequest.search) {
                filters.push({
                    OR: [
                        {
                            province_name: {
                                contains: getRequest.search,
                            },
                        },
                        {
                            province_code: {
                                contains: getRequest.search,
                            },
                        },
                    ],
                });
            }
            const getProvince = yield database_1.prisma.province.findMany({
                where: {
                    active: true,
                    AND: filters,
                },
                take: getRequest.size,
                skip: skip,
                include: {
                    created_by: true,
                    country: true,
                },
            });
            const total = yield database_1.prisma.province.count({
                where: {
                    active: true,
                    AND: filters,
                },
            });
            return {
                data: getProvince.map((value) => (0, province_model_1.convertProvinceResponse)(value, (0, user_model_1.convertUserGlobalResponse)(value.created_by), (0, country_model_1.convertCountryGlobalResponse)(value.country))),
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
            const existingProvince = yield database_1.prisma.province.findUnique({
                where: { id },
            });
            if (!existingProvince) {
                throw new errorResponse_1.ErrorResponse(404, "Province not found", "Province with this ID doesn't exist!");
            }
            yield database_1.prisma.province.delete({
                where: { id },
                include: {
                    created_by: true,
                },
            });
            return `Province with ID ${id} is deleted`;
        });
    }
}
exports.ProvinceService = ProvinceService;

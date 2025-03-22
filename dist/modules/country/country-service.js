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
exports.CountryService = void 0;
const database_1 = require("../../config/database");
const errorResponse_1 = require("../../utilities/errorResponse");
const validation_1 = require("../../utilities/validation");
const activeValidation_1 = require("../../validation/activeValidation");
const user_model_1 = require("../user/user-model");
const country_model_1 = require("./country-model");
const country_validation_1 = require("./country-validation");
class CountryService {
    static checkCountryExist(countryName, countryCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const country = yield database_1.prisma.country.findFirst({
                where: {
                    OR: [{ country_name: countryName }, { country_code: countryCode }],
                },
            });
            const errorMessage = (country === null || country === void 0 ? void 0 : country.country_name) === countryName
                ? "Country name is already exist"
                : (country === null || country === void 0 ? void 0 : country.country_code) === countryCode
                    ? "Country code already exist"
                    : "Country is already exist";
            if (country)
                throw new errorResponse_1.ErrorResponse(400, "Failed create country", errorMessage);
        });
    }
    static create(request, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = (0, validation_1.validation)(country_validation_1.CountryValidation.create, request);
            yield this.checkCountryExist(createRequest.countryName, createRequest.countryCode);
            const createdCountry = yield database_1.prisma.country.create({
                data: {
                    country_name: createRequest.countryName,
                    country_code: createRequest.countryCode,
                    created_by: { connect: { id: Number(userId) } },
                },
                include: {
                    created_by: true,
                },
            });
            return (0, country_model_1.convertCountryResponse)(createdCountry, (0, user_model_1.convertUserGlobalResponse)(createdCountry.created_by));
        });
    }
    static update(request, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateRequest = (0, validation_1.validation)(country_validation_1.CountryValidation.create, request);
            const existingCountry = yield database_1.prisma.country.findUnique({
                where: { id },
            });
            if (!existingCountry) {
                throw new errorResponse_1.ErrorResponse(404, "Country not found", "Country with this ID doesn't exist!");
            }
            if (updateRequest.countryName !== existingCountry.country_name &&
                updateRequest.countryCode !== existingCountry.country_code) {
                yield this.checkCountryExist(updateRequest.countryName, updateRequest.countryCode);
            }
            const updatedCountry = yield database_1.prisma.country.update({
                where: { id },
                data: {
                    country_name: updateRequest.countryName,
                    country_code: updateRequest.countryCode,
                },
                include: {
                    created_by: true,
                },
            });
            return (0, country_model_1.convertCountryResponse)(updatedCountry, (0, user_model_1.convertUserGlobalResponse)(updatedCountry.created_by));
        });
    }
    static active(request, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const activeRequest = (0, validation_1.validation)(activeValidation_1.activeValidation, request);
            const existingCountry = yield database_1.prisma.country.findUnique({
                where: { id },
            });
            if (!existingCountry) {
                throw new errorResponse_1.ErrorResponse(404, "Country not found", "Country with this ID doesn't exist!");
            }
            const updatedActive = yield database_1.prisma.country.update({
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
            const getRequest = (0, validation_1.validation)(country_validation_1.CountryValidation.get, request);
            const skip = (getRequest.page - 1) * getRequest.size;
            const filters = [];
            if (getRequest.search) {
                filters.push({
                    OR: [
                        {
                            country_name: {
                                contains: getRequest.search,
                            },
                        },
                        {
                            country_code: {
                                contains: getRequest.search,
                            },
                        },
                    ],
                });
            }
            const getCountry = yield database_1.prisma.country.findMany({
                where: {
                    active: true,
                    AND: filters,
                },
                take: getRequest.size,
                skip: skip,
                include: {
                    created_by: true,
                },
            });
            const total = yield database_1.prisma.country.count({
                where: {
                    active: true,
                    AND: filters,
                },
            });
            return {
                data: getCountry.map((value) => (0, country_model_1.convertCountryResponse)(value, (0, user_model_1.convertUserGlobalResponse)(value.created_by))),
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
            const existingCountry = yield database_1.prisma.country.findUnique({
                where: { id },
            });
            if (!existingCountry) {
                throw new errorResponse_1.ErrorResponse(404, "Country not found", "Country with this ID doesn't exist!");
            }
            yield database_1.prisma.country.delete({
                where: { id },
                include: {
                    created_by: true,
                },
            });
            return `Country with ID ${id} is deleted`;
        });
    }
}
exports.CountryService = CountryService;

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
exports.CountryController = void 0;
const responseHelpers_1 = require("../../utilities/responseHelpers");
const country_service_1 = require("./country-service");
class CountryController {
    static create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = req.body;
                const response = yield country_service_1.CountryService.create(request, req.userId);
                res
                    .status(201)
                    .json(responseHelpers_1.ResponseHelpers.success("Country created successfully", response));
            }
            catch (error) {
                next(error);
            }
        });
    }
    static update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const request = req.body;
                const countryId = Number(id);
                if (isNaN(countryId)) {
                    res
                        .status(400)
                        .json(responseHelpers_1.ResponseHelpers.error("Invalid country ID", "ID must be type of number"));
                    return;
                }
                const response = yield country_service_1.CountryService.update(request, countryId);
                res
                    .status(200)
                    .json(responseHelpers_1.ResponseHelpers.success("Country updated successfully", response));
            }
            catch (error) {
                next(error);
            }
        });
    }
    static active(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const request = req.body;
                const countryId = Number(id);
                if (isNaN(countryId)) {
                    res
                        .status(400)
                        .json(responseHelpers_1.ResponseHelpers.error("Invalid country ID", "ID must be type of number"));
                    return;
                }
                const response = yield country_service_1.CountryService.active(request, countryId);
                res
                    .status(200)
                    .json(responseHelpers_1.ResponseHelpers.success("Active updated successfully", response));
            }
            catch (error) {
                next(error);
            }
        });
    }
    static get(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = {
                    search: req.query.search,
                    page: req.query.page ? Number(req.query.page) : 1,
                    size: req.query.size ? Number(req.query.size) : 10,
                    all: req.query.all === "true",
                };
                const response = yield country_service_1.CountryService.get(request);
                res
                    .status(200)
                    .json(responseHelpers_1.ResponseHelpers.successWithPagination("Country get successfully", response));
            }
            catch (error) {
                next(error);
            }
        });
    }
    static delete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const countryId = Number(id);
                if (isNaN(countryId)) {
                    res
                        .status(400)
                        .json(responseHelpers_1.ResponseHelpers.error("Invalid country ID", "ID must be type of number"));
                    return;
                }
                const response = yield country_service_1.CountryService.delete(countryId);
                res
                    .status(200)
                    .json(responseHelpers_1.ResponseHelpers.success("Country deleted successfully", response));
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.CountryController = CountryController;

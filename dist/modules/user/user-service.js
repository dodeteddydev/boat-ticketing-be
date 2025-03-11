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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = require("../../config/database");
const error_response_1 = require("../../utilities/error-response");
const jwt_helpers_1 = require("../../utilities/jwt-helpers");
const validation_1 = require("../../utilities/validation");
const user_model_1 = require("./user-model");
const user_vaidation_1 = require("./user-vaidation");
class UserService {
    static checkUserExist(name, username, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield database_1.prisma.user.findFirst({
                where: {
                    OR: [{ name }, { username }, { email }],
                },
            });
            const errorMessage = (user === null || user === void 0 ? void 0 : user.name) === name
                ? "Name is already registered"
                : (user === null || user === void 0 ? void 0 : user.username) === username
                    ? "Username is already registered"
                    : "Email is already registered";
            if (user)
                throw new error_response_1.ErrorResponse(400, "User registration failed", errorMessage);
        });
    }
    static register(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const registerRequest = (0, validation_1.validation)(user_vaidation_1.UserValidation.register, request);
            yield this.checkUserExist(registerRequest.name, registerRequest.username, registerRequest.email);
            registerRequest.password = yield bcrypt_1.default.hash(registerRequest.password, 10);
            const user = yield database_1.prisma.user.create({
                data: registerRequest,
            });
            return (0, user_model_1.convertToCreateOrUpdateUserResponse)(user);
        });
    }
    static login(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const loginRequest = (0, validation_1.validation)(user_vaidation_1.UserValidation.login, request);
            const user = yield database_1.prisma.user.findFirst({
                where: {
                    OR: [
                        { username: loginRequest.identifier },
                        { email: loginRequest.identifier },
                    ],
                },
            });
            if (!user)
                throw new error_response_1.ErrorResponse(400, "User login failed", "No account found. Please sign up to continue.");
            const isValidPassword = yield bcrypt_1.default.compare(loginRequest.password, user.password);
            if (!isValidPassword)
                throw new error_response_1.ErrorResponse(400, "User login failed", "Invalid username/email or password. Please try again!");
            const accessToken = jwt_helpers_1.JwtHelpers.generateToken(user.id.toString()).access;
            const refreshToken = jwt_helpers_1.JwtHelpers.generateToken(user.id.toString()).refresh;
            return (0, user_model_1.convertToLoginResponse)(user, accessToken, refreshToken);
        });
    }
    static get(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield database_1.prisma.user.findUnique({
                where: {
                    id: Number(request.userId),
                },
            });
            if (!user) {
                throw new error_response_1.ErrorResponse(404, "User not found", "User with this ID doesn't exist!");
            }
            return (0, user_model_1.convertToUserResponse)(user, null);
        });
    }
    static refresh(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshRequest = (0, validation_1.validation)(user_vaidation_1.UserValidation.refresh, request);
            const decode = jwt_helpers_1.JwtHelpers.verifyRefreshToken(refreshRequest.refreshToken);
            const userId = decode.userId;
            const accessToken = jwt_helpers_1.JwtHelpers.generateToken(userId.toString()).access;
            const refreshToken = jwt_helpers_1.JwtHelpers.generateToken(userId.toString()).refresh;
            return {
                accessToken,
                refreshToken,
            };
        });
    }
}
exports.UserService = UserService;

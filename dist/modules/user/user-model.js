"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToUserResponse = exports.convertToCreateOrUpdateUserResponse = exports.convertToLoginResponse = void 0;
const date_format_1 = require("../../utilities/date-format");
const convertToLoginResponse = (user, accessToken, refreshToken) => {
    return {
        id: user.id,
        role: user.role,
        name: user.name,
        username: user.username,
        email: user.email,
        accessToken: accessToken,
        refreshToken: refreshToken,
    };
};
exports.convertToLoginResponse = convertToLoginResponse;
const convertToCreateOrUpdateUserResponse = (user) => {
    return {
        id: user.id,
        role: user.role,
        name: user.name,
        username: user.username,
        email: user.email,
    };
};
exports.convertToCreateOrUpdateUserResponse = convertToCreateOrUpdateUserResponse;
const convertToUserResponse = (user, createdBy) => {
    return {
        id: user.id,
        role: user.role,
        name: user.name,
        username: user.username,
        email: user.email,
        status: user.status,
        createdBy: createdBy,
        createdAt: (0, date_format_1.dateFormat)(user.created_at),
        updatedAt: (0, date_format_1.dateFormat)(user.updated_at),
        active: user.active,
    };
};
exports.convertToUserResponse = convertToUserResponse;

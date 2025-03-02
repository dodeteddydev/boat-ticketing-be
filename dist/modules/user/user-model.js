"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToUserResponse = exports.convertToCreateOrUpdateUserResponse = exports.convertToLoginResponse = void 0;
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
        createdAt: user.created_at.toString(),
        updatedAt: user.updated_at.toString(),
        active: user.active,
    };
};
exports.convertToUserResponse = convertToUserResponse;

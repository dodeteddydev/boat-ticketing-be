"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertUserGlobalResponse = exports.convertUserResponse = exports.convertCreateOrUpdateUserResponse = exports.convertLoginResponse = void 0;
const convertLoginResponse = (user, accessToken, refreshToken) => {
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
exports.convertLoginResponse = convertLoginResponse;
const convertCreateOrUpdateUserResponse = (user) => {
    return {
        id: user.id,
        role: user.role,
        name: user.name,
        username: user.username,
        email: user.email,
    };
};
exports.convertCreateOrUpdateUserResponse = convertCreateOrUpdateUserResponse;
const convertUserResponse = (user, createdBy) => {
    return {
        id: user.id,
        role: user.role,
        name: user.name,
        username: user.username,
        email: user.email,
        status: user.status,
        createdBy: createdBy,
        createdAt: user.created_at.toISOString(),
        updatedAt: user.updated_at.toISOString(),
        active: user.active,
    };
};
exports.convertUserResponse = convertUserResponse;
const convertUserGlobalResponse = (createdBy) => {
    return {
        id: createdBy.id,
        name: createdBy.name,
    };
};
exports.convertUserGlobalResponse = convertUserGlobalResponse;

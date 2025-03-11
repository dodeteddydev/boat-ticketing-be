"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
class UserValidation {
}
exports.UserValidation = UserValidation;
UserValidation.register = zod_1.z.object({
    role: zod_1.z.enum(["superadmin", "boatowner", "boatadmin", "customer"], {
        required_error: "Role is required",
    }),
    name: zod_1.z
        .string({ required_error: "Name is required" })
        .min(1, "Name must be at least 1 character"),
    username: zod_1.z
        .string({ required_error: "Username is required" })
        .min(6, "Username must be at least 6 characters"),
    email: zod_1.z
        .string({ required_error: "Email is required" })
        .email("Please enter a valid email"),
    password: zod_1.z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be at least 6 character"),
});
UserValidation.login = zod_1.z.object({
    identifier: zod_1.z
        .string({ required_error: "Username or Email is required" })
        .min(1, "Please enter username or email correctly"),
    password: zod_1.z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be at least 6 character"),
});
UserValidation.refresh = zod_1.z.object({
    refreshToken: zod_1.z.string({ required_error: "Refresh token is required" }),
});

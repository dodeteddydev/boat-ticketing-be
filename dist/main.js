"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const error_middleware_1 = require("./middlewares/error-middleware");
const not_found_middleware_1 = require("./middlewares/not-found-middleware");
const user_route_1 = require("./modules/user/user-route");
const HOST = process.env.HOST;
const PORT = process.env.PORT;
const app = (0, express_1.default)();
app.use(express_1.default.json());
// ROUTE
app.use(user_route_1.userRoute);
// MIDDLEWARE
app.use(not_found_middleware_1.notFoundMiddleware);
app.use(error_middleware_1.errorMiddleware);
app.listen(PORT, () => console.log(`Server running on http://${HOST}:${PORT}`));

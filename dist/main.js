"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errorMiddleware_1 = require("./middlewares/errorMiddleware");
const notFoundMiddleware_1 = require("./middlewares/notFoundMiddleware");
const user_route_1 = require("./modules/user/user-route");
const cors_1 = __importDefault(require("cors"));
const country_route_1 = require("./modules/country/country-route");
const province_route_1 = require("./modules/province/province-route");
const city_route_1 = require("./modules/city/city-route");
const HOST = process.env.HOST;
const PORT = process.env.PORT;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// ROUTE
app.use(user_route_1.userRoute);
app.use(country_route_1.countryRoute);
app.use(province_route_1.provinceRoute);
app.use(city_route_1.cityRoute);
// MIDDLEWARE
app.use(notFoundMiddleware_1.notFoundMiddleware);
app.use(errorMiddleware_1.errorMiddleware);
app.listen(PORT, () => console.log(`Server running on http://${HOST}:${PORT}`));

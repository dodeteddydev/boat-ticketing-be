import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { notFoundMiddleware } from "./middlewares/notFoundMiddleware";
import { authRoute } from "./modules/auth/auth-route";
import { categoryRoute } from "./modules/category/category-route";
import { cityRoute } from "./modules/city/city-route";
import { countryRoute } from "./modules/country/country-route";
import { provinceRoute } from "./modules/province/province-route";
import { userRoute } from "./modules/user/user-route";
import { boatRoute } from "./modules/boat/boat-route";
import { portRoute } from "./modules/port/port-route";
import { scheduleRoute } from "./modules/schedule/schedule-route";
import path from "path";
import fs from "fs";
import { logger } from "./config/logger";
import { bookingRoute } from "./modules/booking/booking-route";
import { transactionRoute } from "./modules/transaction/transaction-route";
import { walletRoute } from "./modules/wallet/wallet-route";

const HOST = process.env.HOST;
const PORT = process.env.PORT;

const app = express();

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  logger.info("✅ 'uploads' folder created");
} else {
  logger.info("📁 'uploads' folder already exists");
}

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use("/api/uploads", express.static("uploads"));

// ROUTE
app.use(authRoute);
app.use(userRoute);
app.use(countryRoute);
app.use(provinceRoute);
app.use(cityRoute);
app.use(categoryRoute);
app.use(boatRoute);
app.use(portRoute);
app.use(scheduleRoute);
app.use(bookingRoute);
app.use(walletRoute);
app.use(transactionRoute);

// MIDDLEWARE
app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(PORT, () => logger.info(`Server running on http://${HOST}:${PORT}`));

import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { BookingController } from "./booking-controller";

export const bookingRoute = express.Router();

bookingRoute.post("/api/booking", authMiddleware, BookingController.create);

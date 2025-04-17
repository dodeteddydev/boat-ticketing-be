import { NextFunction, Response } from "express";
import { AuthRequest } from "../../middlewares/authMiddleware";
import { BookingRequest } from "./booking-model";
import { BookingService } from "./booking-service";
import { ResponseHelpers } from "../../utilities/responseHelpers";

export class BookingController {
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const request = req.body as BookingRequest[];
      const userId = req.userId!;

      const response = await BookingService.create(request, userId);

      res
        .status(201)
        .json(
          ResponseHelpers.success("Bookings created successfully", response)
        );
    } catch (error) {
      next(error);
    }
  }
}
